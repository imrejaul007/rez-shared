"use strict";
/**
 * Circuit Breaker Pattern Implementation
 *
 * Provides graceful degradation when external services are failing.
 * Prevents cascading failures across services.
 *
 * Usage:
 * ```typescript
 * const redisBreaker = new CircuitBreaker(async () => {
 *   return await redis.get(key);
 * }, { timeout: 3000, threshold: 50 });
 *
 * const result = await redisBreaker.call()
 *   .catch(() => fallbackValue);
 * ```
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreaker = exports.CircuitState = void 0;
exports.createRedisCircuitBreaker = createRedisCircuitBreaker;
exports.createHttpCircuitBreaker = createHttpCircuitBreaker;
exports.createDatabaseCircuitBreaker = createDatabaseCircuitBreaker;
exports.getCircuitBreakerStatus = getCircuitBreakerStatus;
var CircuitState;
(function (CircuitState) {
    CircuitState["CLOSED"] = "CLOSED";
    CircuitState["OPEN"] = "OPEN";
    CircuitState["HALF_OPEN"] = "HALF_OPEN";
})(CircuitState || (exports.CircuitState = CircuitState = {}));
class CircuitBreaker {
    constructor(fn, options = {}) {
        this.fn = fn;
        this.state = CircuitState.CLOSED;
        this.failureCount = 0;
        this.successCount = 0;
        this.requestCount = 0;
        this.timeout = options.timeout || 3000;
        this.errorThresholdPercentage = options.errorThresholdPercentage || 50;
        this.resetTimeout = options.resetTimeout || 30000;
        this.name = options.name || 'CircuitBreaker';
        this.onOpen = options.onOpen;
        this.onHalfOpen = options.onHalfOpen;
        this.onClose = options.onClose;
    }
    /**
     * Call the protected function
     */
    async call() {
        this.requestCount++;
        // Check if circuit is open
        if (this.state === CircuitState.OPEN) {
            // Check if it's time to attempt recovery
            if (Date.now() >= (this.nextAttemptTime || 0)) {
                this.transitionTo(CircuitState.HALF_OPEN);
            }
            else {
                throw new Error(`[${this.name}] Circuit breaker is OPEN. Service unavailable.`);
            }
        }
        try {
            const result = await Promise.race([
                this.fn(),
                this.timeout ? this.createTimeout() : Promise.resolve(null),
            ]);
            this.onSuccess();
            return result;
        }
        catch (error) {
            this.onFailure();
            throw error;
        }
    }
    /**
     * Record successful call
     */
    onSuccess() {
        this.failureCount = 0;
        this.successCount++;
        // If in HALF_OPEN state, transition back to CLOSED
        if (this.state === CircuitState.HALF_OPEN) {
            this.transitionTo(CircuitState.CLOSED);
        }
    }
    /**
     * Record failed call
     */
    onFailure() {
        this.failureCount++;
        this.lastFailureTime = Date.now();
        // Calculate failure percentage
        if (this.requestCount > 0) {
            const failurePercentage = (this.failureCount / this.requestCount) * 100;
            if (failurePercentage >= this.errorThresholdPercentage) {
                this.transitionTo(CircuitState.OPEN);
            }
        }
    }
    /**
     * Transition to new state
     */
    transitionTo(newState) {
        if (this.state === newState) {
            return;
        }
        const oldState = this.state;
        this.state = newState;
        console.warn(`[${this.name}] Circuit breaker: ${oldState} → ${newState}`);
        if (newState === CircuitState.OPEN) {
            this.nextAttemptTime = Date.now() + this.resetTimeout;
            this.onOpen?.();
        }
        else if (newState === CircuitState.HALF_OPEN) {
            this.onHalfOpen?.();
        }
        else if (newState === CircuitState.CLOSED) {
            this.failureCount = 0;
            this.successCount = 0;
            this.requestCount = 0;
            this.onClose?.();
        }
    }
    /**
     * Create a timeout promise
     */
    createTimeout() {
        return new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error(`[${this.name}] Request timeout after ${this.timeout}ms`));
            }, this.timeout);
        });
    }
    /**
     * Get circuit status
     */
    getStatus() {
        return {
            name: this.name,
            state: this.state,
            failureCount: this.failureCount,
            successCount: this.successCount,
            requestCount: this.requestCount,
            failurePercentage: this.requestCount > 0 ? (this.failureCount / this.requestCount) * 100 : 0,
        };
    }
    /**
     * Reset the circuit breaker
     */
    reset() {
        console.warn(`[${this.name}] Circuit breaker reset`);
        this.state = CircuitState.CLOSED;
        this.failureCount = 0;
        this.successCount = 0;
        this.requestCount = 0;
        this.lastFailureTime = undefined;
        this.nextAttemptTime = undefined;
    }
}
exports.CircuitBreaker = CircuitBreaker;
/**
 * Circuit breaker for Redis operations
 */
function createRedisCircuitBreaker(fn, name = 'Redis') {
    return new CircuitBreaker(fn, {
        timeout: 3000,
        errorThresholdPercentage: 50,
        resetTimeout: 30000,
        name,
    });
}
/**
 * Circuit breaker for HTTP calls
 */
function createHttpCircuitBreaker(fn, name = 'HTTP') {
    return new CircuitBreaker(fn, {
        timeout: 5000,
        errorThresholdPercentage: 50,
        resetTimeout: 60000,
        name,
    });
}
/**
 * Circuit breaker for database operations
 */
function createDatabaseCircuitBreaker(fn, name = 'Database') {
    return new CircuitBreaker(fn, {
        timeout: 10000,
        errorThresholdPercentage: 25, // Lower threshold for DB - more critical
        resetTimeout: 60000,
        name,
    });
}
/**
 * Batch circuit breaker status report
 */
function getCircuitBreakerStatus(breakers) {
    const report = [];
    for (const [name, breaker] of breakers) {
        report.push({
            ...breaker.getStatus(),
        });
    }
    return report;
}
//# sourceMappingURL=circuitBreaker.js.map