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

import { Request, Response, NextFunction } from 'express';
import type Redis from 'ioredis';

const IDEMPOTENCY_TTL = 3600; // 1 hour in seconds

/**
 * Idempotency middleware
 *
 * Checks if a request with the same idempotency key has been processed.
 * If yes, returns cached response. If no, caches the response for future requests.
 */
export function idempotencyMiddleware(redis: Redis) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only apply to mutation operations
    if (!['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method)) {
      return next();
    }

    // Get idempotency key from header
    const idempotencyKey = req.headers['idempotency-key'] as string;

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
      const userId = (req as any).userId;
      const merchantId = (req as any).merchantId;
      const cacheKeyPrefix = userId || merchantId || req.ip;
      const cacheKey = `idempotency:${cacheKeyPrefix}:${idempotencyKey}`;
      const lockKey = `${cacheKey}:lock`;

      // Atomic check-and-lock using Redis SETNX for distributed lock
      const locked = await redis.set(lockKey, '1', 'EX', 5, 'NX');

      if (!locked) {
        // Another request is processing this idempotency key, wait briefly
        let retries = 0;
        while (retries < 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          const cached = await redis.get(cacheKey);
          if (cached) {
            try {
              const cachedData = JSON.parse(cached);
              return res.status(cachedData.statusCode).json(cachedData.body);
            } catch (parseError) {
              console.error('Idempotency cache parsing failed:', parseError);
              // Fall through to process request
              break;
            }
          }
          retries++;
        }
      }

      try {
        // Check if request has been processed (after lock acquired)
        const cached = await redis.get(cacheKey);

        if (cached) {
          // Return cached response
          try {
            const cachedData = JSON.parse(cached);
            return res.status(cachedData.statusCode).json(cachedData.body);
          } catch (parseError) {
            console.error('Idempotency cache parsing failed, processing request:', parseError);
            // Fall through to process request
          }
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

            redis.setex(cacheKey, IDEMPOTENCY_TTL, JSON.stringify(responseData)).catch((err: unknown) => {
              console.error('Failed to cache idempotent response:', err);
            });
          }

          return originalSend.call(this, data);
        };

        next();
      } finally {
        // Always release the lock
        await redis.del(lockKey);
      }
    } catch (error) {
      console.error('Idempotency middleware error:', error);
      next();
    }
  };
}

/**
 * Validate UUID format
 */
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Clear idempotency cache (for testing or manual cleanup)
 */
export async function clearIdempotencyKey(redis: Redis, idempotencyKey: string): Promise<void> {
  const pattern = `idempotency:*:${idempotencyKey}`;
  const keys = await redis.keys(pattern);

  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

/**
 * Helper to add idempotency key to outgoing requests
 */
export function generateIdempotencyKey(): string {
  // UUID v4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
