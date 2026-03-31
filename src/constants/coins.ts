export const COIN_TYPES = ['rez', 'promo', 'branded', 'category'] as const;
export type CoinType = typeof COIN_TYPES[number];

export const COIN_EXPIRY_DAYS: Record<CoinType, number> = {
  rez:      365,   // REZ coins: 1 year
  promo:    7,     // Promo coins: 7 days (creates urgency)
  branded:  90,    // Branded coins: 3 months
  category: 30,    // Category coins: 1 month
};

export const COIN_DISPLAY_NAMES: Record<CoinType, string> = {
  rez:      'REZ Coins',
  promo:    'Promo Coins',
  branded:  'Branded Coins',
  category: 'Category Coins',
};

export const REWARD_TYPES = [
  'store_payment', 'bill_payment', 'recharge',
  'referral_bonus', 'streak_bonus', 'prive_campaign',
  'mission_complete', 'first_visit', 'birthday_bonus'
] as const;
