/**
 * Canonical coin type constants for the REZ platform.
 *
 * Primary coin is 'nuqta' throughout the platform.
 * Legacy code may still reference 'rez' — use normalizeCoinType() to convert.
 */
export declare const COIN_TYPES: {
    readonly PRIMARY: "nuqta";
    readonly PRIVE: "prive";
    readonly BRANDED: "branded";
    readonly PROMO: "promo";
    readonly CATEGORY: "category";
};
export type CoinType = typeof COIN_TYPES[keyof typeof COIN_TYPES];
/** Array form for iteration and validation */
export declare const COIN_TYPE_ARRAY: readonly CoinType[];
/** Maps legacy 'rez' to canonical 'nuqta'. All other types pass through. */
export declare const LEGACY_COIN_TYPE_MAP: Record<string, CoinType>;
/** Normalize any coin type string to canonical CoinType. Falls back to 'nuqta'. */
export declare function normalizeCoinType(type: string): CoinType;
export declare const COIN_EXPIRY_DAYS: Record<CoinType, number>;
export declare const COIN_DISPLAY_NAMES: Record<CoinType, string>;
export declare const REWARD_TYPES: readonly ["store_payment", "bill_payment", "recharge", "referral_bonus", "streak_bonus", "prive_campaign", "mission_complete", "first_visit", "birthday_bonus"];
export type RewardType = typeof REWARD_TYPES[number];
//# sourceMappingURL=coins.d.ts.map