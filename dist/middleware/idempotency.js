"use strict";
/**
 * Idempotency Middleware
 *
 * Ensures that requests with the same idempotency key return the same response.
 * Prevents duplicate operations from network retries.
 *
 * Usage:
 * ```typescript
 * app.use(idempotencyMiddleware(redis));
 * router.patch('/orders/:id/status', idempotencyMiddleware(redis), updateStatus);
 * ```
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.idempotencyMiddleware = idempotencyMiddleware;
exports.clearIdempotencyKey = clearIdempotencyKey;
exports.generateIdempotencyKey = generateIdempotencyKey;
const crypto_1 = require("crypto");
const IDEMPOTENCY_TTL = 3600; // 1 hour in seconds
/**
 * Idempotency middleware
 *
 * Checks if a request with the same idempotency key has been processed.
 * If yes, returns cached response. If no, caches the response for future requests.
 */
function idempotencyMiddleware(redis) {
    return async (req, res, next) => {
        // Only apply to mutation operations
        if (!['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method)) {
            return next();
        }
        // Get idempotency key from header
        const idempotencyKey = req.headers['idempotency-key'];
        // If no key provided, continue without idempotency protection
        if (!idempotencyKey) {
            return next();
        }
        // Validate UUID format
        if (!isValidUUID(idempotencyKey)) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_IDEMPOTENCY_KEY',
                    message: 'Invalid idempotency key format (must be UUID v4)',
                    statusCode: 400,
                },
            });
        }
        try {
            // Build cache key: include user/merchant + operation + key
            const userId = req.userId;
            const merchantId = req.merchantId;
            const cacheKeyPrefix = userId || merchantId || req.ip;
            const cacheKey = `idempotency:${cacheKeyPrefix}:${idempotencyKey}`;
            const lockKey = `idempotency:lock:${cacheKey}`;
            // Check if request has been processed
            let cached = await redis.get(cacheKey);
            if (cached) {
                // Return cached response with safe JSON parsing
                try {
                    const cachedData = JSON.parse(cached);
                    return res.status(cachedData.statusCode).json(cachedData.body);
                }
                catch (parseError) {
                    logger.error('Malformed cache entry, skipping:', parseError);
                    // Continue to process request if cache is corrupted
                }
            }
            // Acquire lock using SETNX to prevent concurrent execution
            const lockAcquired = await redis.set(lockKey, '1', 'EX', 30, 'NX');
            if (!lockAcquired) {
                // Wait briefly and try to get cached response again
                await new Promise(resolve => setTimeout(resolve, 100));
                cached = await redis.get(cacheKey);
                if (cached) {
                    try {
                        const cachedData = JSON.parse(cached);
                        return res.status(cachedData.statusCode).json(cachedData.body);
                    }
                    catch (parseError) {
                        logger.error('Malformed cache entry after lock wait, skipping:', parseError);
                    }
                }
                // If still no cache, continue but release lock
                await redis.del(lockKey).catch(() => { });
            }
            // Intercept response to cache it
            const originalSend = res.send;
            res.send = function (data) {
                // Only cache successful responses (2xx, 3xx)
                if (res.statusCode >= 200 && res.statusCode < 400) {
                    const responseData = {
                        statusCode: res.statusCode,
                        body: typeof data === 'string' ? JSON.parse(data) : data,
                    };
                    redis.setex(cacheKey, IDEMPOTENCY_TTL, JSON.stringify(responseData))
                        .then(() => redis.del(lockKey))
                        .catch((err) => {
                        logger.error('Failed to cache idempotent response:', err);
                        redis.del(lockKey).catch(() => { });
                    });
                }
                else {
                    // Release lock on non-cacheable responses
                    redis.del(lockKey).catch(() => { });
                }
                return originalSend.call(this, data);
            };
            next();
        }
        catch (error) {
            logger.error('Idempotency middleware error:', error);
            next();
        }
    };
}
/**
 * Validate UUID format
 */
function isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}
/**
 * Clear idempotency cache (for testing or manual cleanup)
 */
async function clearIdempotencyKey(redis, idempotencyKey) {
    const pattern = `idempotency:*:${idempotencyKey}`;
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
        await redis.del(...keys);
    }
}
/**
 * Helper to add idempotency key to outgoing requests
 */
function generateIdempotencyKey() {
    // UUID v4
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = ((0, crypto_1.randomUUID)() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
