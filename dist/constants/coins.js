"use strict";
/**
 * Canonical coin type constants for the REZ platform.
 *
 * Primary coin is 'rez' throughout the platform.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.REWARD_TYPES = exports.COIN_DISPLAY_NAMES = exports.COIN_EXPIRY_DAYS = exports.LEGACY_COIN_TYPE_MAP = exports.COIN_TYPE_ARRAY = exports.COIN_TYPES = void 0;
exports.normalizeCoinType = normalizeCoinType;
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
