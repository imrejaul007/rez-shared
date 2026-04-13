"use strict";
/**
 * Secrets Manager
 *
 * Manages sensitive credentials and secrets.
 * Supports both environment variables and AWS Secrets Manager.
 *
 * Usage:
 * ```typescript
 * const secrets = new SecretsManager();
 * const apiKey = await secrets.get('razorpay-api-key');
 * secrets.validateRequired(['razorpay-api-key', 'razorpay-secret']);
 * ```
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET_KEYS = exports.SecretsManager = void 0;
exports.auditSecrets = auditSecrets;
exports.scanForHardcodedSecrets = scanForHardcodedSecrets;
/**
 * Local secrets cache (with TTL)
 */
const secretsCache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour
/**
 * Base secrets manager
 */
class SecretsManager {
    constructor(source = 'env', redis) {
        this.source = source;
        this.redis = redis;
    }
    /**
     * Get a secret
     */
    async get(secretName) {
        // Check local cache first
        const cached = this.getFromCache(secretName);
        if (cached)
            return cached;
        // Fetch from appropriate source
        let value;
        switch (this.source) {
            case 'aws':
                value = await this.getFromAws(secretName);
                break;
            case 'vault':
                value = await this.getFromVault(secretName);
                break;
            case 'env':
            default:
                value = this.getFromEnv(secretName);
                break;
        }
        // Cache the result
        if (value) {
            this.setInCache(secretName, value);
        }
        return value;
    }
    /**
     * Get multiple secrets
     */
    async getMultiple(secretNames) {
        const secrets = {};
        for (const name of secretNames) {
            secrets[name] = await this.get(name);
        }
        return secrets;
    }
    /**
     * Validate that required secrets exist
     */
    async validateRequired(requiredSecrets) {
        const missing = [];
        for (const secret of requiredSecrets) {
            const value = await this.get(secret);
            if (!value) {
                missing.push(secret);
            }
        }
        if (missing.length > 0) {
            throw new Error(`Missing required secrets: ${missing.join(', ')}`);
        }
    }
    /**
     * Rotate a secret (store new value)
     */
    async rotate(secretName, newValue) {
        // Clear cache
        secretsCache.delete(secretName);
        switch (this.source) {
            case 'aws':
                // Note: AWS requires separate API call
                console.warn(`[SecretsManager] AWS secret rotation requires AWS API call`);
                break;
            case 'vault':
                // Note: HashiCorp Vault requires separate API call
                console.warn(`[SecretsManager] Vault secret rotation requires Vault API call`);
                break;
            case 'env':
            default:
                // Update environment variable
                process.env[this.formatEnvName(secretName)] = newValue;
                break;
        }
    }
    /**
     * Audit log: log secret access (for compliance)
     */
    async logAccess(secretName, userId) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            secretName,
            userId: userId || 'system',
            source: this.source,
        };
        // Log to Redis for audit trail
        if (this.redis) {
            try {
                await this.redis.lpush('audit:secrets', JSON.stringify(logEntry));
            }
            catch (error) {
                console.warn('[SecretsManager] Failed to log secret access:', error);
            }
        }
        // Also log to console/logger
        console.log('[SecretsManager] Secret accessed:', logEntry);
    }
    // ===== Private Methods =====
    getFromEnv(secretName) {
        const envName = this.formatEnvName(secretName);
        return process.env[envName];
    }
    async getFromAws(secretName) {
        // Requires AWS SDK v3
        try {
            const { SecretsManagerClient, GetSecretValueCommand } = await Promise.resolve().then(() => __importStar(require('@aws-sdk/client-secrets-manager')));
            const client = new SecretsManagerClient({ region: process.env.AWS_REGION || 'us-east-1' });
            const command = new GetSecretValueCommand({ SecretId: secretName });
            const response = await client.send(command);
            return response.SecretString;
        }
        catch (error) {
            console.error(`[SecretsManager] Failed to get AWS secret "${secretName}":`, error);
            return undefined;
        }
    }
    async getFromVault(secretName) {
        // Requires HashiCorp Vault
        try {
            const axios = await Promise.resolve().then(() => __importStar(require('axios')));
            const vaultAddr = process.env.VAULT_ADDR || 'http://localhost:8200';
            const vaultToken = process.env.VAULT_TOKEN;
            const response = await axios.default.get(`${vaultAddr}/v1/secret/data/${secretName}`, {
                headers: { 'X-Vault-Token': vaultToken },
            });
            return response.data.data.data.value;
        }
        catch (error) {
            console.error(`[SecretsManager] Failed to get Vault secret "${secretName}":`, error);
            return undefined;
        }
    }
    formatEnvName(secretName) {
        // Convert kebab-case to UPPER_SNAKE_CASE
        return secretName.replace(/-/g, '_').toUpperCase();
    }
    getFromCache(secretName) {
        const cached = secretsCache.get(secretName);
        if (!cached)
            return undefined;
        if (cached.expiresAt < Date.now()) {
            secretsCache.delete(secretName);
            return undefined;
        }
        return cached.value;
    }
    setInCache(secretName, value) {
        secretsCache.set(secretName, {
            value,
            expiresAt: Date.now() + CACHE_TTL,
        });
    }
}
exports.SecretsManager = SecretsManager;
/**
 * Pre-configured secret keys
 */
exports.SECRET_KEYS = {
    // Payment gateways
    RAZORPAY_KEY_ID: 'razorpay-key-id',
    RAZORPAY_KEY_SECRET: 'razorpay-key-secret',
    // Email service
    SENDGRID_API_KEY: 'sendgrid-api-key',
    SMTP_PASSWORD: 'smtp-password',
    // SMS service
    TWILIO_AUTH_TOKEN: 'twilio-auth-token',
    TWILIO_API_KEY: 'twilio-api-key',
    // Authentication
    JWT_SECRET: 'jwt-secret',
    OAUTH_CLIENT_SECRET: 'oauth-client-secret',
    // Database
    DATABASE_PASSWORD: 'database-password',
    REDIS_PASSWORD: 'redis-password',
    // AWS credentials
    AWS_ACCESS_KEY_ID: 'aws-access-key-id',
    AWS_SECRET_ACCESS_KEY: 'aws-secret-access-key',
    // Third-party integrations
    STRIPE_SECRET_KEY: 'stripe-secret-key',
    PAYPAL_CLIENT_SECRET: 'paypal-client-secret',
    GOOGLE_MAPS_API_KEY: 'google-maps-api-key',
};
/**
 * Audit secrets on startup
 */
async function auditSecrets(secretsManager, requiredSecrets) {
    console.log('[SecretsManager] Auditing required secrets...');
    const results = {};
    for (const secret of requiredSecrets) {
        const value = await secretsManager.get(secret);
        results[secret] = !!value;
    }
    const missing = Object.entries(results)
        .filter(([_, exists]) => !exists)
        .map(([name]) => name);
    if (missing.length > 0) {
        console.error('[SecretsManager] ❌ Missing secrets:', missing);
        throw new Error(`Missing required secrets: ${missing.join(', ')}`);
    }
    const configured = Object.entries(results)
        .filter(([_, exists]) => exists)
        .map(([name]) => name);
    console.log(`[SecretsManager] ✅ All ${configured.length} required secrets configured`);
}
/**
 * Check for hardcoded secrets in environment (for debugging)
 */
function scanForHardcodedSecrets() {
    const suspiciousPatterns = {
        'razorpay-key': /rp_(live|test)_[a-zA-Z0-9]{14}/,
        'stripe-key': /(sk|pk)_(live|test)_[a-zA-Z0-9]{24,}/,
        'jwt-secret': /eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*/,
        'api-key': /(api[-_]?key|apikey)\s*[:=]\s*["']([a-zA-Z0-9_-]{20,})["']/i,
    };
    const found = {};
    for (const [key, value] of Object.entries(process.env)) {
        if (!value)
            continue;
        for (const [pattern, regex] of Object.entries(suspiciousPatterns)) {
            if (regex.test(value)) {
                if (!found[pattern])
                    found[pattern] = [];
                found[pattern].push(key);
            }
        }
    }
    if (Object.keys(found).length > 0) {
        console.warn('[SecretsManager] ⚠️ Potential hardcoded secrets detected:');
        console.warn(found);
        console.warn('[SecretsManager] Move these to a secrets manager (AWS Secrets Manager, HashiCorp Vault, etc.)');
    }
}
//# sourceMappingURL=secretsManager.js.map