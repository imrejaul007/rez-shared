"use strict";
/**
 * Webhook Service
 *
 * Manages outgoing webhooks to external systems.
 * Supports signing, retries, delivery tracking.
 *
 * Usage:
 * ```typescript
 * const webhookService = new WebhookService(redis, mongoose, jobQueue);
 * await webhookService.register(merchantId, 'https://example.com/webhooks', 'order.created');
 * await webhookService.trigger('order.created', { orderId: '123' });
 * ```
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = exports.WebhookDelivery = exports.Webhook = exports.WebhookEventType = void 0;
exports.setupWebhookProcessor = setupWebhookProcessor;
const crypto_1 = require("crypto");
const axios_1 = __importDefault(require("axios"));
const mongoose_1 = __importStar(require("mongoose"));
var WebhookEventType;
(function (WebhookEventType) {
    // Order events
    WebhookEventType["ORDER_CREATED"] = "order.created";
    WebhookEventType["ORDER_CONFIRMED"] = "order.confirmed";
    WebhookEventType["ORDER_STATUS_UPDATED"] = "order.status_updated";
    WebhookEventType["ORDER_CANCELLED"] = "order.cancelled";
    WebhookEventType["ORDER_DELIVERED"] = "order.delivered";
    // Payment events
    WebhookEventType["PAYMENT_RECEIVED"] = "payment.received";
    WebhookEventType["PAYMENT_FAILED"] = "payment.failed";
    WebhookEventType["PAYMENT_REFUNDED"] = "payment.refunded";
    // Offer events
    WebhookEventType["OFFER_CREATED"] = "offer.created";
    WebhookEventType["OFFER_UPDATED"] = "offer.updated";
    WebhookEventType["OFFER_COMPLETED"] = "offer.completed";
    // KDS events
    WebhookEventType["KDS_ORDER_READY"] = "kds.order_ready";
    WebhookEventType["KDS_ORDER_STARTED"] = "kds.order_started";
})(WebhookEventType || (exports.WebhookEventType = WebhookEventType = {}));
const webhookSchema = new mongoose_1.Schema({
    merchant: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Merchant', required: true },
    targetUrl: { type: String, required: true },
    events: [String],
    secret: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    maxRetries: { type: Number, default: 5 },
    retryPolicy: { type: String, enum: ['exponential', 'fixed'], default: 'exponential' },
    headers: mongoose_1.Schema.Types.Mixed,
}, { timestamps: true });
exports.Webhook = mongoose_1.default.model('Webhook', webhookSchema);
const deliverySchema = new mongoose_1.Schema({
    webhook: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Webhook', required: true },
    event: { type: String, required: true },
    payload: mongoose_1.Schema.Types.Mixed,
    statusCode: Number,
    response: String,
    error: String,
    attempt: { type: Number, default: 1 },
    nextRetryAt: Date,
    delivered: { type: Boolean, default: false },
}, { timestamps: true });
exports.WebhookDelivery = mongoose_1.default.model('WebhookDelivery', deliverySchema);
/**
 * Webhook service
 */
class WebhookService {
    constructor(redis, jobQueue) {
        this.redis = redis;
        this.jobQueue = jobQueue;
    }
    /**
     * Register webhook for merchant
     */
    async register(merchantId, targetUrl, events, options) {
        const secret = this.generateSecret();
        const webhook = await exports.Webhook.create({
            merchant: merchantId,
            targetUrl,
            events,
            secret,
            headers: options?.headers,
            maxRetries: options?.maxRetries || 5,
        });
        return webhook;
    }
    /**
     * Deregister webhook
     */
    async deregister(webhookId) {
        await exports.Webhook.findByIdAndDelete(webhookId);
    }
    /**
     * Trigger webhook event
     */
    async trigger(event, data, merchantId) {
        // Find all webhooks subscribed to this event
        let query = { events: event, isActive: true };
        if (merchantId) {
            query.merchant = merchantId;
        }
        const webhooks = await exports.Webhook.find(query);
        if (webhooks.length === 0) {
            return; // No subscriptions
        }
        // Queue delivery for each webhook
        for (const webhook of webhooks) {
            await this.jobQueue.add({
                type: 'send-webhook',
                webhookId: webhook._id.toString(),
                event,
                payload: data,
            });
        }
    }
    /**
     * Deliver webhook (called by job processor)
     */
    async deliver(webhookId, event, payload, attempt = 1) {
        const startTime = Date.now();
        const timeoutMs = 15000; // 15 second timeout for entire delivery operation
        try {
            const webhook = await exports.Webhook.findById(webhookId);
            if (!webhook || !webhook.isActive) {
                return false;
            }
            // Check if we've exceeded the total timeout
            if (Date.now() - startTime > timeoutMs) {
                throw new Error('Webhook delivery timeout');
            }
            // Prepare request
            const signature = this.sign(JSON.stringify(payload), webhook.secret);
            const headers = {
                'Content-Type': 'application/json',
                'X-Webhook-Signature': signature,
                'X-Webhook-Event': event,
                'X-Webhook-Delivery': new Date().toISOString(),
                ...webhook.headers,
            };
            // Send request with timeout enforcement
            const remainingTime = timeoutMs - (Date.now() - startTime);
            const response = await axios_1.default.post(webhook.targetUrl, payload, {
                headers,
                timeout: Math.min(10000, remainingTime),
            });
            // Log successful delivery
            await exports.WebhookDelivery.create({
                webhook: webhookId,
                event,
                payload,
                statusCode: response.status,
                response: JSON.stringify(response.data),
                attempt,
                delivered: true,
            });
            return true;
        }
        catch (error) {
            const axiosError = error;
            // Determine if retry is needed (using webhook's configured maxRetries)
            const webhook = await exports.Webhook.findById(webhookId).catch(() => null);
            const maxRetries = webhook?.maxRetries || 5;
            const shouldRetry = this.shouldRetry(axiosError, attempt, maxRetries);
            // Log failed delivery
            await exports.WebhookDelivery.create({
                webhook: webhookId,
                event,
                payload,
                statusCode: axiosError.response?.status,
                error: axiosError.message,
                attempt,
                nextRetryAt: shouldRetry ? this.getNextRetryTime(attempt) : undefined,
                delivered: false,
            });
            // Queue retry if needed
            if (shouldRetry) {
                await this.jobQueue.add({
                    type: 'send-webhook',
                    webhookId,
                    event,
                    payload,
                    attempt: attempt + 1,
                }, { delay: this.getRetryDelay(attempt, webhook?.retryPolicy) });
            }
            return false;
        }
    }
    /**
     * Get delivery history
     */
    async getDeliveryHistory(webhookId, limit = 50) {
        return exports.WebhookDelivery.find({ webhook: webhookId })
            .sort({ createdAt: -1 })
            .limit(limit);
    }
    /**
     * Get webhook stats
     */
    async getStats(webhookId) {
        const total = await exports.WebhookDelivery.countDocuments({ webhook: webhookId });
        const delivered = await exports.WebhookDelivery.countDocuments({ webhook: webhookId, delivered: true });
        const failed = await exports.WebhookDelivery.countDocuments({ webhook: webhookId, delivered: false });
        const pending = await exports.WebhookDelivery.countDocuments({
            webhook: webhookId,
            delivered: false,
            nextRetryAt: { $ne: null },
        });
        return {
            total,
            delivered,
            failed,
            pending,
            successRate: total > 0 ? ((delivered / total) * 100).toFixed(2) : 0,
        };
    }
    /**
     * Generate HMAC signature
     */
    sign(payload, secret) {
        return (0, crypto_1.createHmac)('sha256', secret)
            .update(payload)
            .digest('hex');
    }
    /**
     * Verify webhook signature using constant-time comparison
     * Prevents timing attacks on signature verification
     */
    verifySignature(payload, signature, secret) {
        try {
            const expectedSignature = this.sign(payload, secret);
            // Use timingSafeEqual to prevent timing attacks
            // Both buffers must be the same length
            if (expectedSignature.length !== signature.length) {
                return false;
            }
            return (0, crypto_1.timingSafeEqual)(Buffer.from(expectedSignature), Buffer.from(signature));
        }
        catch (error) {
            logger.error('Signature verification error:', error);
            return false;
        }
    }
    /**
     * Generate random secret
     */
    generateSecret() {
        return (0, crypto_1.randomBytes)(32).toString('hex');
    }
    /**
     * Determine if webhook delivery should be retried
     */
    shouldRetry(error, attempt, maxRetries = 5) {
        if (attempt >= maxRetries)
            return false;
        // Retry on network errors
        if (!error.response)
            return true;
        const status = error.response.status;
        // Retry on 5xx errors and specific 4xx errors
        return status >= 500 || status === 429 || status === 408;
    }
    /**
     * Calculate next retry time
     */
    getNextRetryTime(attempt) {
        const delay = this.getRetryDelay(attempt, 'exponential');
        return new Date(Date.now() + delay);
    }
    /**
     * Calculate retry delay in ms
     */
    getRetryDelay(attempt, policy = 'exponential') {
        if (policy === 'exponential') {
            // 1s, 2s, 4s, 8s, 16s
            return Math.min(1000 * Math.pow(2, attempt - 1), 30000);
        }
        else {
            // Fixed 5 second delay
            return 5000;
        }
    }
}
exports.WebhookService = WebhookService;
/**
 * Setup webhook job processor
 */
function setupWebhookProcessor(jobQueue, webhookService) {
    jobQueue.process(async (job) => {
        const { webhookId, event, payload, attempt = 1 } = job.data;
        const success = await webhookService.deliver(webhookId, event, payload, attempt);
        if (!success && attempt < 5) {
            throw new Error(`Webhook delivery failed, will retry`);
        }
        return { delivered: success, attempt };
    }, 5);
}
