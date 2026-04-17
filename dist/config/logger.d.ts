/**
 * Service Logger Configuration
 *
 * Provides a scoped logger for use in shared middleware and utilities.
 * Uses winston with a singleton console transport.
 */
import winston from 'winston';
/**
 * Create a component-scoped logger.
 * Returns an object with standard log methods, each tagged with the component name.
 */
export declare function createServiceLogger(component: string): {
    info: (message: string, meta?: Record<string, unknown>) => winston.Logger;
    warn: (message: string, meta?: Record<string, unknown>) => winston.Logger;
    error: (message: string, meta?: Record<string, unknown>) => winston.Logger;
    debug: (message: string, meta?: Record<string, unknown>) => winston.Logger;
};
