"use strict";
/**
 * Structured Request Logger Middleware
 *
 * Adds correlation IDs, logs all requests with structured format.
 * Usage: app.use(requestLogger);
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = logger;
exports.logError = logError;
exports.requestLogger = requestLogger;
exports.attachLogger = attachLogger;
const uuid_1 = require("uuid");
/**
 * Structured logger
 */
function logger(context, message, data) {
    const log = {
        timestamp: new Date().toISOString(),
        level: 'info',
        ...context,
        message,
        ...(data && { data }),
    };
    logger.debug(JSON.stringify(log));
}
/**
 * Structured logger for errors
 */
function logError(context, error, data) {
    const log = {
        timestamp: new Date().toISOString(),
        level: 'error',
        ...context,
        error: error.message,
        stack: error.stack,
        ...(data && { data }),
    };
    logger.error(JSON.stringify(log));
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
function requestLogger(req, res, next) {
    const startTime = Date.now();
    // Extract or generate correlation ID
    const correlationId = req.headers['x-correlation-id'] || (0, uuid_1.v4)();
    const requestId = (0, uuid_1.v4)();
    // Attach to request for use in routes
    req.correlationId = correlationId;
    req.requestId = requestId;
    // Extract user/merchant IDs if present
    const userId = req.userId;
    const merchantId = req.merchantId;
    // Log incoming request
    logger({
        correlationId,
        requestId,
        path: req.path,
        method: req.method,
        userId,
        merchantId,
    }, 'Request received', {
        ip: req.ip,
        userAgent: req.get('user-agent'),
    });
    // Add correlation ID to response headers
    res.setHeader('x-correlation-id', correlationId);
    res.setHeader('x-request-id', requestId);
    // Capture response
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        logger({
            correlationId,
            requestId,
            path: req.path,
            method: req.method,
            statusCode: res.statusCode,
            duration,
            userId,
            merchantId,
        }, 'Request completed');
    });
    next();
}
/**
 * Express middleware to attach logger to request
 */
function attachLogger(req, res, next) {
    req.logger = {
        info: (message, data) => logger({
            correlationId: req.correlationId,
            requestId: req.requestId,
            path: req.path,
            method: req.method,
            userId: req.userId,
            merchantId: req.merchantId,
        }, message, data),
        error: (error, data) => logError({
            correlationId: req.correlationId,
            requestId: req.requestId,
            path: req.path,
            method: req.method,
            userId: req.userId,
            merchantId: req.merchantId,
        }, error, data),
    };
    next();
}
