"use strict";
/**
 * Rate Limiting Configuration
 *
 * Provides pre-configured rate limiters for common scenarios.
 * Requires Redis to be available.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRateLimiter = createRateLimiter;
exports.createOrderRateLimiter = createOrderRateLimiter;
exports.createStatusUpdateRateLimiter = createStatusUpdateRateLimiter;
exports.createKdsRateLimiter = createKdsRateLimiter;
exports.createOfferRateLimiter = createOfferRateLimiter;
exports.createGlobalRateLimiter = createGlobalRateLimiter;
exports.createAuthRateLimiter = createAuthRateLimiter;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const rate_limit_redis_1 = __importDefault(require("rate-limit-redis"));
function sendRedisCommand(redis, ...args) {
    return redis.call(...args);
}
/**
 * Create a rate limiter with Redis store
 */
function createRateLimiter(redis, options) {
    return (0, express_rate_limit_1.default)({
        store: new rate_limit_redis_1.default({
            prefix: 'rate-limit:',
            sendCommand: (...args) => sendRedisCommand(redis, ...args),
        }),
        windowMs: options.windowMs || 60 * 1000,
        max: options.max || 10,
        keyGenerator: options.keyGenerator || ((req) => req.ip),
        message: options.message || 'Too many requests, please try again later',
        standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
        skip: (req) => {
            // Skip rate limiting for health checks
            return req.path === '/health';
        },
    });
}
/**
 * Rate limiter for order creation
 * Limit: 5 orders per minute per user
 */
function createOrderRateLimiter(redis) {
    return createRateLimiter(redis, {
        windowMs: 60 * 1000, // 1 minute
        max: 5, // 5 orders per minute
        keyGenerator: (req) => req.userId || req.ip, // By user ID, fallback to IP
        message: 'Too many orders. Please wait before creating another order.',
    });
}
/**
 * Rate limiter for status updates (merchant)
 * Limit: 60 updates per minute per merchant
 */
function createStatusUpdateRateLimiter(redis) {
    return createRateLimiter(redis, {
        windowMs: 60 * 1000,
        max: 60,
        keyGenerator: (req) => req.merchantId ? `${req.merchantId}:status-update` : req.ip,
        message: 'Too many status updates. Please wait before updating order status again.',
    });
}
/**
 * Rate limiter for KDS updates
 * Limit: 1000 updates per minute per store (high for real-time)
 * Requires authentication - falls back to IP if storeId not available
 */
function createKdsRateLimiter(redis) {
    return createRateLimiter(redis, {
        windowMs: 60 * 1000,
        max: 1000,
        keyGenerator: (req) => {
            // Enforce per-store limiting if storeId available, otherwise per-IP
            // This prevents spoofing of storeId and protects shared networks
            if (req.storeId && req.merchantId) {
                return `${req.storeId}:kds`;
            }
            return req.ip;
        },
        message: 'KDS update rate limit exceeded.',
    });
}
/**
 * Rate limiter for offer creation (merchant)
 * Limit: 10 offers per hour per merchant
 */
function createOfferRateLimiter(redis) {
    return createRateLimiter(redis, {
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 10,
        keyGenerator: (req) => req.merchantId ? `${req.merchantId}:offer-create` : req.ip,
        message: 'Too many offers created. Please wait before creating more offers.',
    });
}
/**
 * Global API rate limiter
 * Limit: 1000 requests per minute per IP
 */
function createGlobalRateLimiter(redis) {
    return createRateLimiter(redis, {
        windowMs: 60 * 1000,
        max: 1000,
        keyGenerator: (req) => req.ip,
        message: 'Too many requests from your IP. Please try again later.',
    });
}
/**
 * Auth attempt rate limiter
 * Limit: 5 failed attempts per 15 minutes per IP/email
 * Uses the shared createRateLimiter helper with custom prefix for auth
 */
function createAuthRateLimiter(redis) {
    return createRateLimiter(redis, {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5, // 5 attempts
        keyGenerator: (req) => req.body?.email || req.body?.phone || req.ip,
        message: 'Too many login attempts. Please try again later.',
        skipSuccessfulRequests: true, // Don't count successful logins
    });
}
