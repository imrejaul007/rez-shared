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
/**
 * Generic job queue wrapper
 */
class JobQueue {
    constructor(name, redis, options = {}) {
        this.options = options;
        // Create queue
        this.queue = new bullmq_1.Queue(name, {
            connection: {
                host: redis.options?.host || 'localhost',
                port: redis.options?.port || 6379,
            },
            defaultJobOptions: {
                attempts: options.maxRetries || 3,
                backoff: options.retryBackoff === 'fixed'
                    ? { type: 'fixed', delay: 5000 }
                    : { type: 'exponential', delay: 1000 },
                removeOnComplete: { age: 3600 }, // Keep completed jobs for 1 hour
            },
        });
        // Monitor queue events
        this.queueEvents = new bullmq_1.QueueEvents(name, {
            connection: {
                host: redis.options?.host || 'localhost',
                port: redis.options?.port || 6379,
            },
        });
        this.queueEvents.on('failed', ({ jobId, failedReason }) => {
            console.error(`[${name}] Job ${jobId} failed: ${failedReason}`);
        });
        this.queueEvents.on('completed', ({ jobId }) => {
            console.log(`[${name}] Job ${jobId} completed`);
        });
    }
    /**
     * Add job to queue
     */
    async add(data, options) {
        return this.queue.add(data.type || 'job', data, {
            priority: options?.priority || 0,
            delay: options?.delay || this.options.defaultDelay || 0,
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
     */
    async schedule(data, scheduledTime, options) {
        const delay = scheduledTime.getTime() - Date.now();
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
            connection: this.queue.client.options,
            concurrency,
        });
        this.worker.on('failed', (job, err) => {
            console.error(`[${this.queue.name}] Worker failed:`, err);
        });
        this.worker.on('error', (err) => {
            console.error(`[${this.queue.name}] Worker error:`, err);
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
     */
    async sendEmail(to, subject, body, options) {
        await this.emailQueue.addUnique(`email:${to}:${subject}`, {
            type: 'send-email',
            to,
            subject,
            body,
            ...options,
        });
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
     */
    async sendWebhook(url, event, payload, options) {
        await this.webhookQueue.add({
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
//# sourceMappingURL=jobQueue.js.map