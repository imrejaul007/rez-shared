/**
 * Health Check Middleware
 *
 * Provides health status endpoints for monitoring and orchestration.
 * Usage: app.use(healthCheckRouter);
 */
import { Router } from 'express';
import type Redis from 'ioredis';
import mongoose from 'mongoose';
export interface HealthCheckDependencies {
    redis?: Redis;
    mongoose?: typeof mongoose;
}
export interface HealthStatus {
    status: 'healthy' | 'unhealthy' | 'degraded';
    timestamp: string;
    uptime: number;
    checks: {
        database?: {
            status: 'up' | 'down';
            latency?: number;
        };
        redis?: {
            status: 'up' | 'down';
            latency?: number;
        };
        memory?: {
            used: number;
            heapUsed: number;
            heapTotal: number;
        };
    };
    errors?: string[];
}
/**
 * Create health check router
 */
export declare function createHealthCheckRouter(deps: HealthCheckDependencies): Router;
/**
 * Middleware to attach health check functions to app
 */
export declare function attachHealthChecks(app: any, deps: HealthCheckDependencies): void;
//# sourceMappingURL=healthCheck.d.ts.map