"use strict";
/**
 * Standardized Error Handler
 *
 * Provides consistent error response format across all services.
 * Usage: app.use(globalErrorHandler);
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitError = exports.UnauthorizedError = exports.NotFoundError = exports.ValidationError = exports.AppError = exports.ErrorCode = void 0;
exports.globalErrorHandler = globalErrorHandler;
exports.asyncHandler = asyncHandler;
/**
 * Standard error codes used across the platform
 */
var ErrorCode;
(function (ErrorCode) {
    // Validation errors (400)
    ErrorCode["INVALID_REQUEST"] = "INVALID_REQUEST";
    ErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    ErrorCode["MISSING_REQUIRED_FIELD"] = "MISSING_REQUIRED_FIELD";
    ErrorCode["INVALID_INPUT"] = "INVALID_INPUT";
    // Authentication errors (401)
    ErrorCode["UNAUTHORIZED"] = "UNAUTHORIZED";
    ErrorCode["INVALID_TOKEN"] = "INVALID_TOKEN";
    ErrorCode["TOKEN_EXPIRED"] = "TOKEN_EXPIRED";
    // Authorization errors (403)
    ErrorCode["FORBIDDEN"] = "FORBIDDEN";
    ErrorCode["INSUFFICIENT_PERMISSIONS"] = "INSUFFICIENT_PERMISSIONS";
    // Not found errors (404)
    ErrorCode["NOT_FOUND"] = "NOT_FOUND";
    ErrorCode["RESOURCE_NOT_FOUND"] = "RESOURCE_NOT_FOUND";
    ErrorCode["ORDER_NOT_FOUND"] = "ORDER_NOT_FOUND";
    ErrorCode["MERCHANT_NOT_FOUND"] = "MERCHANT_NOT_FOUND";
    ErrorCode["STORE_NOT_FOUND"] = "STORE_NOT_FOUND";
    // Conflict errors (409)
    ErrorCode["CONFLICT"] = "CONFLICT";
    ErrorCode["DUPLICATE_RESOURCE"] = "DUPLICATE_RESOURCE";
    ErrorCode["INVALID_TRANSITION"] = "INVALID_TRANSITION";
    // Rate limit errors (429)
    ErrorCode["RATE_LIMIT_EXCEEDED"] = "RATE_LIMIT_EXCEEDED";
    ErrorCode["TOO_MANY_REQUESTS"] = "TOO_MANY_REQUESTS";
    // Server errors (500)
    ErrorCode["INTERNAL_SERVER_ERROR"] = "INTERNAL_SERVER_ERROR";
    ErrorCode["DATABASE_ERROR"] = "DATABASE_ERROR";
    ErrorCode["SERVICE_UNAVAILABLE"] = "SERVICE_UNAVAILABLE";
    ErrorCode["EXTERNAL_SERVICE_ERROR"] = "EXTERNAL_SERVICE_ERROR";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
/**
 * Custom application error
 */
class AppError extends Error {
    constructor(message, statusCode, code, details) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.name = 'AppError';
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
/**
 * Validation error (extends AppError)
 */
class ValidationError extends AppError {
    constructor(message, details) {
        super(message, 400, ErrorCode.VALIDATION_ERROR, details);
        this.name = 'ValidationError';
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
exports.ValidationError = ValidationError;
/**
 * Not found error
 */
class NotFoundError extends AppError {
    constructor(resource) {
        super(`${resource} not found`, 404, ErrorCode.NOT_FOUND);
        this.name = 'NotFoundError';
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
exports.NotFoundError = NotFoundError;
/**
 * Unauthorized error
 */
class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401, ErrorCode.UNAUTHORIZED);
        this.name = 'UnauthorizedError';
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}
exports.UnauthorizedError = UnauthorizedError;
/**
 * Rate limit error
 */
class RateLimitError extends AppError {
    constructor(retryAfter) {
        super('Too many requests, please try again later', 429, ErrorCode.RATE_LIMIT_EXCEEDED);
        if (retryAfter) {
            this.details = { retryAfter };
        }
        this.name = 'RateLimitError';
        Object.setPrototypeOf(this, RateLimitError.prototype);
    }
}
exports.RateLimitError = RateLimitError;
/**
 * Global error handler middleware
 *
 * Usage:
 * ```typescript
 * app.use(globalErrorHandler);
 * ```
 */
function globalErrorHandler(error, req, res, next) {
    const requestId = req.correlationId || 'unknown';
    // Log error
    console.error('[ERROR]', {
        requestId,
        path: req.path,
        method: req.method,
        error: error.message,
        code: error.code,
        stack: error.stack,
    });
    // Handle AppError
    if (error instanceof AppError) {
        const response = {
            success: false,
            error: {
                code: error.code,
                message: error.message,
                statusCode: error.statusCode,
                requestId,
                ...(error.details && { details: error.details }),
            },
        };
        res.status(error.statusCode).json(response);
        return;
    }
    // Handle MongoDB errors
    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
        if (error.code === 11000) {
            // Duplicate key error
            const response = {
                success: false,
                error: {
                    code: ErrorCode.DUPLICATE_RESOURCE,
                    message: 'A resource with this value already exists',
                    statusCode: 409,
                    requestId,
                },
            };
            res.status(409).json(response);
            return;
        }
    }
    // Handle validation errors (from Zod, Joi, etc.)
    if (error.isJoi || error.isZod) {
        const details = error.details ? error.details.reduce((acc, detail) => {
            acc[detail.path.join('.')] = detail.message;
            return acc;
        }, {}) : undefined;
        const response = {
            success: false,
            error: {
                code: ErrorCode.VALIDATION_ERROR,
                message: 'Validation failed',
                statusCode: 400,
                requestId,
                ...(details && { details }),
            },
        };
        res.status(400).json(response);
        return;
    }
    // Default error
    const response = {
        success: false,
        error: {
            code: ErrorCode.INTERNAL_SERVER_ERROR,
            message: process.env.NODE_ENV === 'production'
                ? 'An unexpected error occurred'
                : error.message,
            statusCode: 500,
            requestId,
        },
    };
    res.status(500).json(response);
}
/**
 * Async route wrapper to catch errors
 *
 * Usage:
 * ```typescript
 * router.get('/', asyncHandler(async (req, res) => {
 *   const data = await getData();
 *   res.json(data);
 * }));
 * ```
 */
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
