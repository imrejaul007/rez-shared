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

// Loyalty Tiers
export const LOYALTY_TIERS = ['bronze', 'silver', 'gold', 'platinum'] as const;
export type LoyaltyTier = typeof LOYALTY_TIERS[number];

export function normalizeLoyaltyTier(tier: string): LoyaltyTier {
  if (!tier) return 'bronze';
  const map: Record<string, LoyaltyTier> = {
    BRONZE: 'bronze', SILVER: 'silver', GOLD: 'gold', PLATINUM: 'platinum',
    STARTER: 'bronze', DIAMOND: 'platinum', DIMAOND: 'platinum',
  };
  return map[tier.toUpperCase()] || 'bronze';
}

// Transaction Types
export const TRANSACTION_TYPES = {
  EARNED: 'earned',
  SPENT: 'spent',
  EXPIRED: 'expired',
  REFUNDED: 'refunded',
  BONUS: 'bonus',
  BRANDED_AWARD: 'branded_award',
  TRANSFER: 'transfer',
  GIFT: 'gift',
} as const;
export type TransactionType = typeof TRANSACTION_TYPES[keyof typeof TRANSACTION_TYPES];

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MERCHANT: 'merchant',
  SUPPORT: 'support',
  OPERATOR: 'operator',
  SUPER_ADMIN: 'super_admin',
} as const;
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
