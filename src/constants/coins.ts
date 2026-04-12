/**
 * Canonical coin type constants for the REZ platform.
 *
 * Primary coin is 'rez' throughout the platform.
 */

// ── Coin Type Constants ────────────────────────────────────────────────────────

export const COIN_TYPES = {
  PRIMARY:  'rez'      as const,
  PRIVE:    'prive'    as const,
  BRANDED:  'branded'  as const,
  PROMO:    'promo'    as const,
  CASHBACK: 'cashback' as const,
  REFERRAL: 'referral' as const,
} as const;

export type CoinType = typeof COIN_TYPES[keyof typeof COIN_TYPES];

/** Array form for iteration and validation */
export const COIN_TYPE_ARRAY: readonly CoinType[] = [
  'rez', 'prive', 'promo', 'branded', 'cashback', 'referral',
] as const;

// ── Legacy Compatibility ───────────────────────────────────────────────────────

/** Maps legacy 'nuqta' to canonical 'rez'. All other types pass through. */
export const LEGACY_COIN_TYPE_MAP: Record<string, CoinType> = {
  nuqta:    'rez',
  rez:      'rez',
  prive:    'prive',
  branded:  'branded',
  promo:    'promo',
  cashback: 'cashback',
  referral: 'referral',
};

/** Normalize any coin type string to canonical CoinType. Falls back to 'rez'. */
export function normalizeCoinType(type: string): CoinType {
  return (LEGACY_COIN_TYPE_MAP[type] ?? 'rez') as CoinType;
}

// ── Coin Configuration ────────────────────────────────────────────────────────

// H36 fix: COIN_EXPIRY_DAYS values must match currencyRules.ts (the canonical backend source).
// Previous values: promo=7 (was 90 in backend), branded=90 (was 180 in backend).
// REZ coins: 0 in backend (never expire) — using 0 here to match.
export const COIN_EXPIRY_DAYS: Record<CoinType, number> = {
  rez:      0,    // Primary coins: never expire (matches currencyRules.ts expiryDays: 0)
  prive:    365,  // Privé coins: 1 year
  promo:    90,   // Promo coins: 90 days (matches currencyRules.ts)
  branded:  180,  // Branded coins: 6 months (matches currencyRules.ts)
  cashback: 365,  // Cashback coins: 1 year
  referral: 180,  // Referral coins: 6 months
};

export const COIN_DISPLAY_NAMES: Record<CoinType, string> = {
  rez:      'REZ Coins',
  prive:    'Privé Coins',
  promo:    'Promo Coins',
  branded:  'Branded Coins',
  cashback: 'Cashback',
  referral: 'Referral Bonus',
};

// ── Reward Types ──────────────────────────────────────────────────────────────

export const REWARD_TYPES = [
  'store_payment', 'bill_payment', 'recharge',
  'referral_bonus', 'streak_bonus', 'prive_campaign',
  'mission_complete', 'first_visit', 'birthday_bonus',
] as const;

export type RewardType = typeof REWARD_TYPES[number];
