/**
 * Canonical coin type constants for the REZ platform.
 *
 * Primary coin is 'nuqta' throughout the platform.
 * Legacy code may still reference 'rez' — use normalizeCoinType() to convert.
 */

// ── Coin Type Constants ───────────────────────────────────────���──────────────

export const COIN_TYPES = {
  PRIMARY: 'nuqta' as const,
  PRIVE: 'prive' as const,
  BRANDED: 'branded' as const,
  PROMO: 'promo' as const,
  CATEGORY: 'category' as const,
} as const;

export type CoinType = typeof COIN_TYPES[keyof typeof COIN_TYPES];

/** Array form for iteration and validation */
export const COIN_TYPE_ARRAY: readonly CoinType[] = [
  'nuqta', 'prive', 'promo', 'branded', 'category',
] as const;

// ── Legacy Compatibility ─────────────────────────────��───────────────────────

/** Maps legacy 'rez' to canonical 'nuqta'. All other types pass through. */
export const LEGACY_COIN_TYPE_MAP: Record<string, CoinType> = {
  rez: 'nuqta',
  nuqta: 'nuqta',
  prive: 'prive',
  branded: 'branded',
  promo: 'promo',
  category: 'category',
};

/** Normalize any coin type string to canonical CoinType. Falls back to 'nuqta'. */
export function normalizeCoinType(type: string): CoinType {
  return LEGACY_COIN_TYPE_MAP[type] ?? 'nuqta';
}

// ── Coin Configuration ───────────────────────────────────────────────────────

export const COIN_EXPIRY_DAYS: Record<CoinType, number> = {
  nuqta:    365,   // Primary coins: 1 year
  prive:    365,   // Prive coins: 1 year
  promo:    7,     // Promo coins: 7 days (creates urgency)
  branded:  90,    // Branded coins: 3 months
  category: 30,    // Category coins: 1 month
};

export const COIN_DISPLAY_NAMES: Record<CoinType, string> = {
  nuqta:    'Nuqta Coins',
  prive:    'Prive Coins',
  promo:    'Promo Coins',
  branded:  'Branded Coins',
  category: 'Category Coins',
};

// ── Reward Types ─────────────────────────────────────────────────────────────

export const REWARD_TYPES = [
  'store_payment', 'bill_payment', 'recharge',
  'referral_bonus', 'streak_bonus', 'prive_campaign',
  'mission_complete', 'first_visit', 'birthday_bonus',
] as const;

export type RewardType = typeof REWARD_TYPES[number];
