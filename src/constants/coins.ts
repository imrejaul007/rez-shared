/**
 * Canonical coin type constants for the REZ platform.
 *
 * Primary coin is 'rez' throughout the platform.
 */

// ── Coin Type Constants ───────────────────────────────────────────────────────

export const COIN_TYPES = {
  PRIMARY: 'rez' as const,
  PRIVE: 'prive' as const,
  BRANDED: 'branded' as const,
  PROMO: 'promo' as const,
  CATEGORY: 'category' as const,
  CASHBACK: 'cashback' as const,
  REFERRAL: 'referral' as const,
} as const;

export type CoinType = typeof COIN_TYPES[keyof typeof COIN_TYPES];

/** Array form for iteration and validation */
export const COIN_TYPE_ARRAY: readonly CoinType[] = [
  'rez', 'prive', 'promo', 'branded', 'category', 'cashback', 'referral',
] as const;

// ── Legacy Compatibility ──────────────────────────────────────────────────────

/** Maps legacy 'nuqta' to canonical 'rez'. All other types pass through. */
export const LEGACY_COIN_TYPE_MAP: Record<string, CoinType> = {
  nuqta: 'rez',
  rez: 'rez',
  prive: 'prive',
  branded: 'branded',
  promo: 'promo',
  category: 'category',
  cashback: 'cashback',
  referral: 'referral',
};

/** Normalize any coin type string to canonical CoinType. Falls back to 'rez'. */
export function normalizeCoinType(type: string): CoinType {
  return LEGACY_COIN_TYPE_MAP[type] ?? 'rez';
}

// ── Coin Configuration ───────────────────────────────────────────────────────

export const COIN_EXPIRY_DAYS: Record<CoinType, number> = {
  rez:      365,   // Primary coins: 1 year
  prive:    365,   // Prive coins: 1 year
  promo:    7,     // Promo coins: 7 days (creates urgency)
  branded:  90,    // Branded coins: 3 months
  category: 30,    // Category coins: 1 month
  cashback: 30,    // Cashback coins: 1 month
  referral: 90,    // Referral coins: 3 months
};

export const COIN_DISPLAY_NAMES: Record<CoinType, string> = {
  rez:      'REZ Coins',
  prive:    'Prive Coins',
  promo:    'Promo Coins',
  branded:  'Branded Coins',
  category: 'Category Coins',
  cashback: 'Cashback Coins',
  referral: 'Referral Coins',
};

// ── Reward Types ─────────────────────────────────────────────────────────────

export const REWARD_TYPES = [
  'store_payment', 'bill_payment', 'recharge',
  'referral_bonus', 'streak_bonus', 'prive_campaign',
  'mission_complete', 'first_visit', 'birthday_bonus',
] as const;

export type RewardType = typeof REWARD_TYPES[number];
