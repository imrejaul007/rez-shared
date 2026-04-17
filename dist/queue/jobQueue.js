"use strict";
/**
 * Job Queue Service
 *
 * Async job processing with Bull (Redis-based).
 * Supports retries, concurrency, scheduling.
 *
 * Usage:
 * ```typescript
 * const emailQueue = new JobQueue('send-email', redis);
 * await emailQueue.add({ to: 'user@example.com', subject: '...' });
 * emailQueue.process(async (job) => { ... });
 * ```
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobQueueService = exports.JobQueue = void 0;
const bullmq_1 = require("bullmq");
const logger_1 = require("../config/logger");
const logger = (0, logger_1.createServiceLogger)('JobQueue');
/**
 * Generic job queue wrapper
 */
class JobQueue {
    constructor(name, redis, options = {}) {
        this.options = options;
        this.redisConnection = redis.options || { host: 'localhost', port: 6379 };
        // Determine retention age in seconds based on policy
        const retentionAgeSeconds = this.getRetentionAge(options.retentionPolicy || 'short');
        // Create queue
        this.queue = new bullmq_1.Queue(name, {
            connection: this.redisConnection,
            defaultJobOptions: {
                attempts: options.maxRetries || 3,
                backoff: options.retryBackoff === 'fixed'
                    ? { type: 'fixed', delay: 5000 }
                    : { type: 'exponential', delay: 1000 },
                removeOnComplete: retentionAgeSeconds ? { age: retentionAgeSeconds } : false,
            },
        });
        // Monitor queue events
        this.queueEvents = new bullmq_1.QueueEvents(name, {
            connection: this.redisConnection,
        });
        this.queueEvents.on('failed', ({ jobId, failedReason }) => {
            logger.error(`[${name}] Job ${jobId} failed: ${failedReason}`);
        });
        this.queueEvents.on('completed', ({ jobId }) => {
            logger.debug(`[${name}] Job ${jobId} completed`);
        });
    }
    /**
     * Get retention age in seconds based on policy
     */
    getRetentionAge(policy) {
        switch (policy) {
            case 'short':
                return 3600; // 1 hour
            case 'medium':
                return 86400; // 24 hours
            case 'long':
                return 604800; // 7 days
            case 'permanent':
                return false; // Never remove
            default:
                return 3600;
        }
    }
    /**
     * Add job to queue
     */
    async add(data, options) {
        return this.queue.add(data.type || 'job', data, {
            priority: options?.priority || 0,
            delay: options?.delay ?? this.options.defaultDelay ?? 0,
        });
    }
    /**
     * Add job with unique key (deduplication)
     */
    async addUnique(uniqueKey, data, options) {
        return this.queue.add(data.type || 'job', data, {
            jobId: uniqueKey,
            priority: options?.priority || 0,
        });
    }
    /**
     * Add job to be processed at specific time
     * Note: If scheduledTime is in the past, the job will be executed immediately
     */
    async schedule(data, scheduledTime, options) {
        const delay = scheduledTime.getTime() - Date.now();
        if (delay < 0) {
            logger.warn(`[${this.queue.name}] Job scheduled for past time (${scheduledTime.toISOString()}), executing immediately`);
        }
        return this.queue.add(data.type || 'job', data, {
            priority: options?.priority || 0,
            delay: Math.max(0, delay),
        });
    }
    /**
     * Set up job processor
     */
    process(handler, concurrency = this.options.concurrency || 4) {
        this.worker = new bullmq_1.Worker(this.queue.name, handler, {
            connection: this.redisConnection,
            concurrency,
        });
        this.worker.on('failed', (job, err) => {
            logger.error(`[${this.queue.name}] Worker failed`, { error: err });
        });
        this.worker.on('error', (err) => {
            logger.error(`[${this.queue.name}] Worker error`, { error: err });
        });
    }
    /**
     * Get queue status
     */
    async getStatus() {
        const counts = await this.queue.getJobCounts();
        const jobs = await this.queue.getJobs(['active', 'waiting', 'failed']);
        return {
            ...counts,
            queueSize: jobs.length,
        };
    }
    /**
     * Pause queue
     */
    async pause() {
        await this.queue.pause();
    }
    /**
     * Resume queue
     */
    async resume() {
        await this.queue.resume();
    }
    /**
     * Clean completed jobs
     */
    async clean(olderThan = 3600000) {
        await this.queue.clean(olderThan, 1000, 'completed');
    }
    /**
     * Drain queue (remove all jobs)
     */
    async drain() {
        await this.queue.drain();
    }
    /**
     * Close queue
     */
    async close() {
        if (this.worker)
            await this.worker.close();
        if (this.queueEvents)
            await this.queueEvents.close();
        await this.queue.close();
    }
}
exports.JobQueue = JobQueue;
/**
 * Pre-configured job queues for common operations
 */
class JobQueueService {
    constructor(redis) {
        this.emailQueue = new JobQueue('send-email', redis);
        this.smsQueue = new JobQueue('send-sms', redis);
        this.pushQueue = new JobQueue('send-push', redis);
        this.webhookQueue = new JobQueue('send-webhook', redis);
        this.orderQueue = new JobQueue('process-order', redis);
    }
    /**
     * Queue email to be sent
     * @param dedupTTL - Optional TTL in seconds for email deduplication key. If set, identical
     *   emails sent within this window will be deduplicated. Defaults to 24 hours (86400s).
     *   Set to 0 to disable deduplication entirely.
     */
    async sendEmail(to, subject, body, options) {
        const ttl = options?.dedupTTL ?? 86400;
        const jobId = ttl > 0 ? `email:${to}:${subject}` : undefined;
        if (jobId) {
            await this.emailQueue.addUnique(jobId, {
                type: 'send-email',
                to,
                subject,
                body,
                ...options,
            });
        }
        else {
            await this.emailQueue.add({
                type: 'send-email',
                to,
                subject,
                body,
                ...options,
            });
        }
    }
    /**
     * Queue SMS to be sent
     */
    async sendSms(phone, message, options) {
        await this.smsQueue.add({
            type: 'send-sms',
            phone,
            message,
            ...options,
        });
    }
    /**
     * Queue push notification
     */
    async sendPush(userId, title, body, options) {
        await this.pushQueue.add({
            type: 'send-push',
            userId,
            title,
            body,
            ...options,
        });
    }
    /**
     * Queue webhook call
     * Uses idempotent jobId (url + event) to prevent duplicate deliveries when the same
     * webhook is triggered multiple times in quick succession.
     */
    async sendWebhook(url, event, payload, options) {
        // Use url + event as idempotent jobId to deduplicate rapid-fire triggers
        const jobId = `webhook:${url}:${event}`;
        await this.webhookQueue.addUnique(jobId, {
            type: 'send-webhook',
            url,
            event,
            payload,
            ...options,
        }, {
            priority: 5, // Higher priority for webhooks
        });
    }
    /**
     * Queue order processing
     */
    async processOrder(orderId, data) {
        await this.orderQueue.add({
            type: 'process-order',
            orderId,
            ...data,
        });
    }
    /**
     * Setup all processors
     */
    setupProcessors(handlers) {
        if (handlers.email)
            this.emailQueue.process(handlers.email, 2); // 2 concurrent emails
        if (handlers.sms)
            this.smsQueue.process(handlers.sms, 5); // 5 concurrent SMS
        if (handlers.push)
            this.pushQueue.process(handlers.push, 10); // 10 concurrent push
        if (handlers.webhook)
            this.webhookQueue.process(handlers.webhook, 5);
        if (handlers.order)
            this.orderQueue.process(handlers.order, 2);
    }
    /**
     * Get all queue statuses
     */
    async getAllStatus() {
        return {
            email: await this.emailQueue.getStatus(),
            sms: await this.smsQueue.getStatus(),
            push: await this.pushQueue.getStatus(),
            webhook: await this.webhookQueue.getStatus(),
            order: await this.orderQueue.getStatus(),
        };
    }
    /**
     * Close all queues
     */
    async closeAll() {
        await Promise.all([
            this.emailQueue.close(),
            this.smsQueue.close(),
            this.pushQueue.close(),
            this.webhookQueue.close(),
            this.orderQueue.close(),
        ]);
    }
}
exports.JobQueueService = JobQueueService;
