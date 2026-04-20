// Canonical enum definitions for the REZ platform.
// Source of truth for all status codes, types, and categorical values.
//
// All services should import from @rez/shared instead of defining their own.
// For npm consumers: import { LOYALTY_TIERS, USER_ROLES, TRANSACTION_TYPES } from '@rez/shared';
//
// NOTE: Coin types, cashback status, order status, and payment status — along with
// their normalization helpers (normalizeCoinType, normalizeCashbackStatus,
// normalizeLoyaltyTier, normalizeOrderStatus, normalizePaymentStatus) — are
// exported by their respective files: constants/coins.ts, orderStatuses.ts,
// paymentStatuses.ts, and statusCompat.ts. Do NOT re-export them here to avoid
// duplicate identifier errors.

// ── Loyalty Tiers ──────────────────────────────────────────────────────────────
// DM-HIGH-05 FIX: Canonical lowercase enum. All comparisons must use this enum.
// DM values: 'bronze', 'silver', 'gold', 'platinum', 'diamond'
export const LOYALTY_TIERS = ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as const;
export type LoyaltyTier = typeof LOYALTY_TIERS[number];

// NOTE: normalizeLoyaltyTier is defined ONLY in constants/coins.ts (canonical source).
// It handles uppercase variants (BRONZE→bronze), the DIMAOND typo, and STARTER→bronze.
// Import it from './constants/coins' or from the barrel export '@rez/shared'.
// Do NOT define normalizeLoyaltyTier here — duplication causes TypeScript errors.

// Transaction Types
// NOTE: Backend wallet service only supports 6 types (earned|spent|expired|refunded|bonus|branded_award).
// 'transfer' and 'gift' are NOT in the backend type definition. Do NOT add them to
// the backend wallet service without first updating the backend type definition.
export const TRANSACTION_TYPES = {
  EARNED: 'earned',
  SPENT: 'spent',
  EXPIRED: 'expired',
  REFUNDED: 'refunded',
  BONUS: 'bonus',
  BRANDED_AWARD: 'branded_award',
} as const;
export type TransactionType = typeof TRANSACTION_TYPES[keyof typeof TRANSACTION_TYPES];

// User Roles
// 2026-04-16: CONSUMER added to match canonical shared-types/UserRole (7 values).
export const USER_ROLES = {
  USER: 'user',
  CONSUMER: 'consumer',
  MERCHANT: 'merchant',
  ADMIN: 'admin',
  SUPPORT: 'support',
  OPERATOR: 'operator',
  SUPER_ADMIN: 'super_admin',
} as const;
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
