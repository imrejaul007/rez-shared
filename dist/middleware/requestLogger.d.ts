/**
 * Structured Request Logger Middleware
 *
 * Adds correlation IDs, logs all requests with structured format.
 * Usage: app.use(requestLogger);
 */
import { Request, Response, NextFunction } from 'express';
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
export declare function logger(context: Partial<LogContext>, message: string, data?: any): void;
/**
 * Structured logger for errors
 */
export declare function logError(context: Partial<LogContext>, error: Error, data?: any): void;
/**
 * Request logging middleware
 *
 * Adds:
 * - Correlation ID (x-correlation-id header)
 * - Request ID
 * - User ID / Merchant ID extraction
 * - Request/response logging
 */
export declare function requestLogger(req: Request, res: Response, next: NextFunction): void;
/**
 * Express middleware to attach logger to request
 */
export declare function attachLogger(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=requestLogger.d.ts.map