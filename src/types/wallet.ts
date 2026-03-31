// CoinType is canonical in constants/coins.ts — re-exported here for backward compat
import type { CoinType } from '../constants/coins';
export type { CoinType };

export interface WalletBalance {
  rez:      number;
  promo:    number;
  branded:  number;
  category: number;
  total:    number;
}

export interface CoinTransaction {
  _id:         string;
  coinType:    CoinType;
  amount:      number;
  type:        'earned' | 'spent' | 'expired' | 'refunded';
  description: string;
  createdAt:   string;
}
