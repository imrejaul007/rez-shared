/**
 * Structured Request Logger Middleware
 *
 * Adds correlation IDs, logs all requests with structured format.
 * Usage: app.use(requestLogger);
 */

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export interface LogContext {
  correlationId: string;
  requestId: string;
  timestamp: string;
  path: string;
  method: string;
  userId?: string;
  merchantId?: string;
  statusCode?: number;
  duration?: number;
  error?: string;
}

/**
 * Structured logger
 */
export function logger(context: Partial<LogContext>, message: string, data?: any) {
  const log = {
    timestamp: new Date().toISOString(),
    level: 'info',
    ...context,
    message,
    ...(data && { data }),
  };
  console.log(JSON.stringify(log));
}

/**
 * Structured logger for errors
 */
export function logError(context: Partial<LogContext>, error: Error, data?: any) {
  const log = {
    timestamp: new Date().toISOString(),
    level: 'error',
    ...context,
    error: error.message,
    stack: error.stack,
    ...(data && { data }),
  };
  console.error(JSON.stringify(log));
}

/**
 * Request logging middleware
 *
 * Adds:
 * - Correlation ID (x-correlation-id header)
 * - Request ID
 * - User ID / Merchant ID extraction
 * - Request/response logging
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();

  // Extract or generate correlation ID
  const correlationId = (req.headers['x-correlation-id'] as string) || uuidv4();
  const requestId = uuidv4();

  // Attach to request for use in routes
  (req as any).correlationId = correlationId;
  (req as any).requestId = requestId;

  // Extract user/merchant IDs if present
  const userId = (req as any).userId;
  const merchantId = (req as any).merchantId;

  // Log incoming request
  logger(
    {
      correlationId,
      requestId,
      path: req.path,
      method: req.method,
      userId,
      merchantId,
    },
    'Request received',
    {
      ip: req.ip,
      userAgent: req.get('user-agent'),
    }
  );

  // Add correlation ID to response headers
  res.setHeader('x-correlation-id', correlationId);
  res.setHeader('x-request-id', requestId);

  // Capture response
  const originalSend = res.send;

  res.send = function (data) {
    const duration = Date.now() - startTime;

    logger(
      {
        correlationId,
        requestId,
        path: req.path,
        method: req.method,
        statusCode: res.statusCode,
        duration,
        userId,
        merchantId,
      },
      'Request completed'
    );

    // Call original send
    return originalSend.call(this, data);
  };

  next();
}

/**
 * Express middleware to attach logger to request
 */
export function attachLogger(req: Request, res: Response, next: NextFunction) {
  (req as any).logger = {
    info: (message: string, data?: any) =>
      logger(
        {
          correlationId: (req as any).correlationId,
          requestId: (req as any).requestId,
          path: req.path,
          method: req.method,
          userId: (req as any).userId,
          merchantId: (req as any).merchantId,
        },
        message,
        data
      ),
    error: (error: Error, data?: any) =>
      logError(
        {
          correlationId: (req as any).correlationId,
          requestId: (req as any).requestId,
          path: req.path,
          method: req.method,
          userId: (req as any).userId,
          merchantId: (req as any).merchantId,
        },
        error,
        data
      ),
  };
  next();
}
