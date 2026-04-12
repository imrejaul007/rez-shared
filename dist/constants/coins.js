"use strict";
/**
 * Canonical coin type constants for the REZ platform.
 *
 * Primary coin is 'rez' throughout the platform.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.REWARD_TYPES = exports.COIN_DISPLAY_NAMES = exports.COIN_EXPIRY_DAYS = exports.LEGACY_COIN_TYPE_MAP = exports.COIN_TYPE_ARRAY = exports.COIN_TYPES = void 0;
exports.normalizeCoinType = normalizeCoinType;
// ── Coin Type Constants ───────────────────────────────────────────────────────
exports.COIN_TYPES = {
    PRIMARY: 'rez',
    PRIVE: 'prive',
    BRANDED: 'branded',
    PROMO: 'promo',
    CATEGORY: 'category',
};
/** Array form for iteration and validation */
exports.COIN_TYPE_ARRAY = [
    'rez', 'prive', 'promo', 'branded', 'category',
];
// ── Legacy Compatibility ──────────────────────────────────────────────────────
/** Maps legacy 'nuqta' to canonical 'rez'. All other types pass through. */
exports.LEGACY_COIN_TYPE_MAP = {
    nuqta: 'rez',
    rez: 'rez',
    prive: 'prive',
    branded: 'branded',
    promo: 'promo',
    category: 'category',
};
/** Normalize any coin type string to canonical CoinType. Falls back to 'rez'. */
function normalizeCoinType(type) {
    return exports.LEGACY_COIN_TYPE_MAP[type] ?? 'rez';
}
// ── Coin Configuration ───────────────────────────────────────────────────────
exports.COIN_EXPIRY_DAYS = {
    rez: 365, // Primary coins: 1 year
    prive: 365, // Prive coins: 1 year
    promo: 7, // Promo coins: 7 days (creates urgency)
    branded: 90, // Branded coins: 3 months
    category: 30, // Category coins: 1 month
};
exports.COIN_DISPLAY_NAMES = {
    rez: 'REZ Coins',
    prive: 'Prive Coins',
    promo: 'Promo Coins',
    branded: 'Branded Coins',
    category: 'Category Coins',
};
// ── Reward Types ─────────────────────────────────────────────────────────────
exports.REWARD_TYPES = [
    'store_payment', 'bill_payment', 'recharge',
    'referral_bonus', 'streak_bonus', 'prive_campaign',
    'mission_complete', 'first_visit', 'birthday_bonus',
];
//# sourceMappingURL=coins.js.map