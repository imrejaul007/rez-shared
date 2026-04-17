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
export const LOYALTY_TIERS = ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as const;
// P0 FIX: Added 'diamond' — gamification service uses 'diamond' tier; was previously
// normalized to 'platinum' but should be a distinct tier for consumer-facing display.
export type LoyaltyTier = typeof LOYALTY_TIERS[number];

export function normalizeLoyaltyTier(tier: string): LoyaltyTier {
  if (!tier) return 'bronze';
  const map: Record<string, LoyaltyTier> = {
    BRONZE: 'bronze', SILVER: 'silver', GOLD: 'gold', PLATINUM: 'platinum',
    STARTER: 'bronze',
    // P0 FIX: 'diamond' is now a distinct tier (not normalized to 'platinum').
    // 'DIAMOND' (UPPERCASE) and 'DIMAOND' (DB typo) still map to 'platinum'
    // for DB normalization, but 'diamond' (lowercase) is a valid canonical value.
    DIAMOND: 'diamond', DIMAOND: 'platinum',
  };
  return map[tier.toUpperCase()] ?? (LOYALTY_TIERS.includes(tier.toLowerCase() as LoyaltyTier) ? tier.toLowerCase() as LoyaltyTier : 'bronze');
}

// Loyalty Tier Perks — defines tangible benefits per tier
// Used by checkout flow (cashback multiplier), delivery (free threshold), support routing
export interface LoyaltyTierPerks {
  tier: LoyaltyTier;
  cashbackRate: number;       // % cashback on orders (e.g., 0.01 = 1%)
  freeDeliveryMinOrder: number; // minimum order for free delivery (0 = always free)
  prioritySupport: boolean;
  exclusiveOffers: boolean;
  earlyAccess: boolean;
}

export const LOYALTY_TIER_PERKS: Record<LoyaltyTier, LoyaltyTierPerks> = {
  bronze:   { tier: 'bronze',   cashbackRate: 0.01, freeDeliveryMinOrder: 999, prioritySupport: false, exclusiveOffers: false, earlyAccess: false },
  silver:   { tier: 'silver',   cashbackRate: 0.015, freeDeliveryMinOrder: 500, prioritySupport: false, exclusiveOffers: false, earlyAccess: false },
  gold:     { tier: 'gold',     cashbackRate: 0.02, freeDeliveryMinOrder: 300, prioritySupport: true,  exclusiveOffers: false, earlyAccess: false },
  platinum: { tier: 'platinum', cashbackRate: 0.03, freeDeliveryMinOrder: 0,   prioritySupport: true,  exclusiveOffers: true,  earlyAccess: false },
  diamond:  { tier: 'diamond',  cashbackRate: 0.05, freeDeliveryMinOrder: 0,   prioritySupport: true,  exclusiveOffers: true,  earlyAccess: true  },
};

export function getLoyaltyTierPerks(tier: string): LoyaltyTierPerks {
  const normalized = normalizeLoyaltyTier(tier);
  return LOYALTY_TIER_PERKS[normalized];
}

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
