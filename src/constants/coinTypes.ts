/**
 * Canonical coin type constants — use these instead of string literals.
 * Primary coin is 'nuqta' throughout the platform.
 */
export const COIN_TYPES = {
  PRIMARY: 'nuqta' as const,
  PRIVE: 'prive' as const,
  BRANDED: 'branded' as const,
  PROMO: 'promo' as const,
} as const;

export type CoinType = typeof COIN_TYPES[keyof typeof COIN_TYPES];

// Legacy alias — 'rez' was used in early wallet-service code
export const LEGACY_COIN_TYPE_MAP: Record<string, CoinType> = {
  rez: 'nuqta',
  nuqta: 'nuqta',
  prive: 'prive',
  branded: 'branded',
  promo: 'promo',
};

export function normalizeCoinType(type: string): CoinType {
  return LEGACY_COIN_TYPE_MAP[type] ?? 'nuqta';
}
