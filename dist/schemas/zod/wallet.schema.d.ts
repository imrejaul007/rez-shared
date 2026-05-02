/**
 * Wallet API validation schemas
 * Validates WalletDebit, WalletCredit, and CoinTransactionResponse requests/responses
 * Canonical coin priority: promo > branded > prive > cashback > referral > rez
 */
import { z } from 'zod';
export declare const COIN_TYPE: z.ZodEnum<["promo", "branded", "prive", "cashback", "referral", "rez"]>;
export declare const COIN_TRANSACTION_TYPE: z.ZodEnum<["earned", "spent", "expired", "refunded", "bonus", "branded_award"]>;
export declare const TRANSACTION_STATUS: z.ZodEnum<["pending", "completed", "failed", "cancelled"]>;
export declare const WalletBalanceSchema: z.ZodObject<{
    total: z.ZodNumber;
    available: z.ZodNumber;
    pending: z.ZodNumber;
    cashback: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    pending?: number;
    cashback?: number;
    total?: number;
    available?: number;
}, {
    pending?: number;
    cashback?: number;
    total?: number;
    available?: number;
}>;
export declare const CoinSchema: z.ZodObject<{
    type: z.ZodEffects<z.ZodString, string, string>;
    amount: z.ZodNumber;
    isActive: z.ZodBoolean;
    expiryDate: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    type?: string;
    isActive?: boolean;
    amount?: number;
    expiryDate?: Date;
}, {
    type?: string;
    isActive?: boolean;
    amount?: number;
    expiryDate?: Date;
}>;
export declare const WalletDebitSchema: z.ZodObject<{
    user: z.ZodString;
    amount: z.ZodNumber;
    source: z.ZodString;
    sourceId: z.ZodOptional<z.ZodString>;
    description: z.ZodString;
    merchantId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    idempotencyKey: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    user?: string;
    description?: string;
    amount?: number;
    metadata?: Record<string, any>;
    source?: string;
    sourceId?: string;
    merchantId?: string;
    idempotencyKey?: string;
}, {
    user?: string;
    description?: string;
    amount?: number;
    metadata?: Record<string, any>;
    source?: string;
    sourceId?: string;
    merchantId?: string;
    idempotencyKey?: string;
}>;
export declare const WalletCreditSchema: z.ZodObject<{
    user: z.ZodString;
    coinType: z.ZodEnum<["promo", "branded", "prive", "cashback", "referral", "rez"]>;
    amount: z.ZodNumber;
    source: z.ZodString;
    sourceId: z.ZodOptional<z.ZodString>;
    description: z.ZodString;
    merchantId: z.ZodOptional<z.ZodString>;
    expiryDate: z.ZodOptional<z.ZodDate>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    idempotencyKey: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    user?: string;
    description?: string;
    amount?: number;
    metadata?: Record<string, any>;
    expiryDate?: Date;
    source?: string;
    sourceId?: string;
    merchantId?: string;
    idempotencyKey?: string;
    coinType?: "promo" | "branded" | "prive" | "cashback" | "referral" | "rez";
}, {
    user?: string;
    description?: string;
    amount?: number;
    metadata?: Record<string, any>;
    expiryDate?: Date;
    source?: string;
    sourceId?: string;
    merchantId?: string;
    idempotencyKey?: string;
    coinType?: "promo" | "branded" | "prive" | "cashback" | "referral" | "rez";
}>;
export declare const CoinTransactionResponseSchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodString>;
    user: z.ZodString;
    type: z.ZodEnum<["earned", "spent", "expired", "refunded", "bonus", "branded_award"]>;
    coinType: z.ZodEnum<["promo", "branded", "prive", "cashback", "referral", "rez"]>;
    amount: z.ZodNumber;
    balanceBefore: z.ZodNumber;
    balanceAfter: z.ZodNumber;
    source: z.ZodString;
    sourceId: z.ZodOptional<z.ZodString>;
    description: z.ZodString;
    merchantId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    idempotencyKey: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["pending", "completed", "failed", "cancelled"]>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    user?: string;
    type?: "refunded" | "expired" | "earned" | "spent" | "bonus" | "branded_award";
    status?: "cancelled" | "pending" | "completed" | "failed";
    description?: string;
    _id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    amount?: number;
    metadata?: Record<string, any>;
    source?: string;
    sourceId?: string;
    merchantId?: string;
    idempotencyKey?: string;
    coinType?: "promo" | "branded" | "prive" | "cashback" | "referral" | "rez";
    balanceBefore?: number;
    balanceAfter?: number;
}, {
    user?: string;
    type?: "refunded" | "expired" | "earned" | "spent" | "bonus" | "branded_award";
    status?: "cancelled" | "pending" | "completed" | "failed";
    description?: string;
    _id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    amount?: number;
    metadata?: Record<string, any>;
    source?: string;
    sourceId?: string;
    merchantId?: string;
    idempotencyKey?: string;
    coinType?: "promo" | "branded" | "prive" | "cashback" | "referral" | "rez";
    balanceBefore?: number;
    balanceAfter?: number;
}>;
export declare const CoinTransactionListResponseSchema: z.ZodArray<z.ZodObject<{
    _id: z.ZodOptional<z.ZodString>;
    user: z.ZodString;
    type: z.ZodEnum<["earned", "spent", "expired", "refunded", "bonus", "branded_award"]>;
    coinType: z.ZodEnum<["promo", "branded", "prive", "cashback", "referral", "rez"]>;
    amount: z.ZodNumber;
    balanceBefore: z.ZodNumber;
    balanceAfter: z.ZodNumber;
    source: z.ZodString;
    sourceId: z.ZodOptional<z.ZodString>;
    description: z.ZodString;
    merchantId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    idempotencyKey: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["pending", "completed", "failed", "cancelled"]>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    user?: string;
    type?: "refunded" | "expired" | "earned" | "spent" | "bonus" | "branded_award";
    status?: "cancelled" | "pending" | "completed" | "failed";
    description?: string;
    _id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    amount?: number;
    metadata?: Record<string, any>;
    source?: string;
    sourceId?: string;
    merchantId?: string;
    idempotencyKey?: string;
    coinType?: "promo" | "branded" | "prive" | "cashback" | "referral" | "rez";
    balanceBefore?: number;
    balanceAfter?: number;
}, {
    user?: string;
    type?: "refunded" | "expired" | "earned" | "spent" | "bonus" | "branded_award";
    status?: "cancelled" | "pending" | "completed" | "failed";
    description?: string;
    _id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    amount?: number;
    metadata?: Record<string, any>;
    source?: string;
    sourceId?: string;
    merchantId?: string;
    idempotencyKey?: string;
    coinType?: "promo" | "branded" | "prive" | "cashback" | "referral" | "rez";
    balanceBefore?: number;
    balanceAfter?: number;
}>, "many">;
export declare const WalletBalanceResponseSchema: z.ZodObject<{
    user: z.ZodString;
    balance: z.ZodObject<{
        total: z.ZodNumber;
        available: z.ZodNumber;
        pending: z.ZodNumber;
        cashback: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        pending?: number;
        cashback?: number;
        total?: number;
        available?: number;
    }, {
        pending?: number;
        cashback?: number;
        total?: number;
        available?: number;
    }>;
    coins: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodEffects<z.ZodString, string, string>;
        amount: z.ZodNumber;
        isActive: z.ZodBoolean;
        expiryDate: z.ZodOptional<z.ZodDate>;
    }, "strip", z.ZodTypeAny, {
        type?: string;
        isActive?: boolean;
        amount?: number;
        expiryDate?: Date;
    }, {
        type?: string;
        isActive?: boolean;
        amount?: number;
        expiryDate?: Date;
    }>, "many">>;
    currency: z.ZodString;
    isFrozen: z.ZodOptional<z.ZodBoolean>;
    isActive: z.ZodBoolean;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    user?: string;
    currency?: string;
    isActive?: boolean;
    updatedAt?: Date;
    balance?: {
        pending?: number;
        cashback?: number;
        total?: number;
        available?: number;
    };
    coins?: {
        type?: string;
        isActive?: boolean;
        amount?: number;
        expiryDate?: Date;
    }[];
    isFrozen?: boolean;
}, {
    user?: string;
    currency?: string;
    isActive?: boolean;
    updatedAt?: Date;
    balance?: {
        pending?: number;
        cashback?: number;
        total?: number;
        available?: number;
    };
    coins?: {
        type?: string;
        isActive?: boolean;
        amount?: number;
        expiryDate?: Date;
    }[];
    isFrozen?: boolean;
}>;
export type WalletDebitRequest = z.infer<typeof WalletDebitSchema>;
export type WalletCreditRequest = z.infer<typeof WalletCreditSchema>;
export type CoinTransactionResponse = z.infer<typeof CoinTransactionResponseSchema>;
export type CoinTransactionListResponse = z.infer<typeof CoinTransactionListResponseSchema>;
export type WalletBalanceResponse = z.infer<typeof WalletBalanceResponseSchema>;
export type CoinType = z.infer<typeof COIN_TYPE>;
export type CoinTransactionType = z.infer<typeof COIN_TRANSACTION_TYPE>;
export type TransactionStatus = z.infer<typeof TRANSACTION_STATUS>;
export declare const COIN_PRIORITY_ORDER: Array<z.infer<typeof COIN_TYPE>>;
