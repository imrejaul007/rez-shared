/**
 * Canonical coin type constants for the REZ platform.
 *
 * Primary coin is 'rez' throughout the platform.
 */
export declare const COIN_TYPES: {
    readonly PROMO: "promo";
    readonly BRANDED: "branded";
    readonly PRIVE: "prive";
    readonly CASHBACK: "cashback";
    readonly REFERRAL: "referral";
    readonly REZ: "rez";
};
export type CoinType = typeof COIN_TYPES[keyof typeof COIN_TYPES];
/** Array form for iteration and validation (canonical priority order: PROMO → BRANDED → PRIVE → CASHBACK → REFERRAL → REZ) */
export declare const COIN_TYPE_ARRAY: readonly CoinType[];
/**
 * Canonical coin type values for use in Mongoose schema enums and runtime validation.
 * Mirrors the backend's COIN_TYPE_VALUES but is defined here in the shared canonical source.
 * WALLET-03 fix: exported so rez-backend can import from @rez/shared instead of maintaining a duplicate.
 */
export declare const COIN_TYPE_VALUES: readonly CoinType[];
/** Maps legacy 'nuqta' to canonical 'rez'. All other types pass through. */
export declare const LEGACY_COIN_TYPE_MAP: Record<string, CoinType>;
/** Normalize any coin type string to canonical CoinType. Falls back to 'rez'. */
export declare function normalizeCoinType(type: string): CoinType;
export declare const COIN_EXPIRY_DAYS: Record<CoinType, number>;
export declare const COIN_DISPLAY_NAMES: Record<CoinType, string>;
export declare const REWARD_TYPES: readonly ["store_payment", "bill_payment", "recharge", "referral_bonus", "streak_bonus", "prive_campaign", "mission_complete", "first_visit", "birthday_bonus"];
export type RewardType = typeof REWARD_TYPES[number];
export declare const CASHBACK_STATUS: {
    readonly PENDING: "pending";
    readonly UNDER_REVIEW: "under_review";
    readonly APPROVED: "approved";
    readonly REJECTED: "rejected";
    readonly CREDITED: "credited";
    readonly PAID: "paid";
    readonly EXPIRED: "expired";
    readonly CANCELLED: "cancelled";
};
export type CashbackStatus = (typeof CASHBACK_STATUS)[keyof typeof CASHBACK_STATUS];
/**
 * Normalize any cashback status string to canonical lowercase form.
 * Handles UPPERCASE, MixedCase, and legacy variations.
 */
export declare function normalizeCashbackStatus(status: string): CashbackStatus;
export declare const LOYALTY_TIER: {
    readonly BRONZE: "bronze";
    readonly SILVER: "silver";
    readonly GOLD: "gold";
    readonly PLATINUM: "platinum";
    readonly STARTER: "bronze";
    readonly DIAMOND: "platinum";
    readonly DIMAOND: "platinum";
};
export type LoyaltyTier = (typeof LOYALTY_TIER)[keyof typeof LOYALTY_TIER];
/**
 * Normalize any loyalty tier string to canonical lowercase form.
 * Handles UPPERCASE, MixedCase, and the 'DIMAOND' typo.
 */
export declare function normalizeLoyaltyTier(tier: string): LoyaltyTier;
