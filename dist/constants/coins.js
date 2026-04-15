"use strict";
/**
 * Canonical coin type constants for the REZ platform.
 *
 * Primary coin is 'rez' throughout the platform.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOYALTY_TIER = exports.CASHBACK_STATUS = exports.REWARD_TYPES = exports.COIN_DISPLAY_NAMES = exports.COIN_EXPIRY_DAYS = exports.LEGACY_COIN_TYPE_MAP = exports.COIN_TYPE_ARRAY = exports.COIN_TYPES = void 0;
exports.normalizeCoinType = normalizeCoinType;
exports.normalizeCashbackStatus = normalizeCashbackStatus;
exports.normalizeLoyaltyTier = normalizeLoyaltyTier;
// ── Coin Type Constants ────────────────────────────────────────────────────────
exports.COIN_TYPES = {
    PRIMARY: 'rez',
    PRIVE: 'prive',
    BRANDED: 'branded',
    PROMO: 'promo',
    CASHBACK: 'cashback',
    REFERRAL: 'referral',
};
/** Array form for iteration and validation */
exports.COIN_TYPE_ARRAY = [
    'rez', 'prive', 'promo', 'branded', 'cashback', 'referral',
];
// ── Legacy Compatibility ───────────────────────────────────────────────────────
/** Maps legacy 'nuqta' to canonical 'rez'. All other types pass through. */
exports.LEGACY_COIN_TYPE_MAP = {
    nuqta: 'rez',
    rez: 'rez',
    prive: 'prive',
    branded: 'branded',
    promo: 'promo',
    cashback: 'cashback',
    referral: 'referral',
};
/** Normalize any coin type string to canonical CoinType. Falls back to 'rez'. */
function normalizeCoinType(type) {
    return (exports.LEGACY_COIN_TYPE_MAP[type] ?? 'rez');
}
// ── Coin Configuration ────────────────────────────────────────────────────────
// H36 fix: COIN_EXPIRY_DAYS values must match currencyRules.ts (the canonical backend source).
// Previous values: promo=7 (was 90 in backend), branded=90 (was 180 in backend).
// REZ coins: 0 in backend (never expire) — using 0 here to match.
exports.COIN_EXPIRY_DAYS = {
    rez: 0, // Primary coins: never expire (matches currencyRules.ts expiryDays: 0)
    prive: 365, // Privé coins: 1 year
    promo: 90, // Promo coins: 90 days (matches currencyRules.ts)
    branded: 180, // Branded coins: 6 months (matches currencyRules.ts)
    cashback: 365, // Cashback coins: 1 year
    referral: 180, // Referral coins: 6 months
};
exports.COIN_DISPLAY_NAMES = {
    rez: 'REZ Coins',
    prive: 'Privé Coins',
    promo: 'Promo Coins',
    branded: 'Branded Coins',
    cashback: 'Cashback',
    referral: 'Referral Bonus',
};
// ── Reward Types ──────────────────────────────────────────────────────────────
exports.REWARD_TYPES = [
    'store_payment', 'bill_payment', 'recharge',
    'referral_bonus', 'streak_bonus', 'prive_campaign',
    'mission_complete', 'first_visit', 'birthday_bonus',
];
// ── P0-ENUM-2 FIX: Canonical CashbackStatus ──────────────────────────────────────
// Source of truth: rezbackend/src/models/Cashback.ts (status field enum).
// Canonical values are lowercase strings matching MongoDB document values.
exports.CASHBACK_STATUS = {
    PENDING: 'pending',
    UNDER_REVIEW: 'under_review',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    CREDITED: 'credited',
    PAID: 'paid',
    EXPIRED: 'expired',
    CANCELLED: 'cancelled',
};
/**
 * Normalize any cashback status string to canonical lowercase form.
 * Handles UPPERCASE, MixedCase, and legacy variations.
 */
function normalizeCashbackStatus(status) {
    const canonical = exports.CASHBACK_STATUS[status?.toUpperCase()];
    if (!canonical) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn(`[normalizeCashbackStatus] Unknown status "${status}" — defaulting to pending`);
        }
        return 'pending';
    }
    return canonical;
}
// ── P0-ENUM-3 FIX: Canonical LoyaltyTier (lowercase) ─────────────────────────────
// Handles the case mismatch between DB values (UPPERCASE) and business logic (lowercase).
// DB referralTier field: 'STARTER' | 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND' | 'DIMAOND' (typo)
// achievements.ts uses: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
exports.LOYALTY_TIER = {
    BRONZE: 'bronze',
    SILVER: 'silver',
    GOLD: 'gold',
    PLATINUM: 'platinum',
    STARTER: 'bronze', // 'STARTER' maps to 'bronze'
    DIAMOND: 'platinum', // 'DIAMOND' maps to 'platinum'
    DIMAOND: 'platinum', // 'DIMAOND' is the DB typo — normalize to 'platinum'
};
/**
 * Normalize any loyalty tier string to canonical lowercase form.
 * Handles UPPERCASE, MixedCase, and the 'DIMAOND' typo.
 */
function normalizeLoyaltyTier(tier) {
    if (!tier)
        return 'bronze';
    const upper = tier.toUpperCase();
    const map = {
        'BRONZE': 'bronze', 'SILVER': 'silver', 'GOLD': 'gold', 'PLATINUM': 'platinum',
        'STARTER': 'bronze', 'DIAMOND': 'platinum', 'DIMAOND': 'platinum',
    };
    return map[upper] || 'bronze';
}
