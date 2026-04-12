/**
 * Canonical Wallet and Coin entity types for the REZ platform.
 *
 * Source of truth:
 *   rezbackend/src/models/Wallet.ts          (IWallet, ICoinBalance)
 *   rezbackend/src/models/CoinTransaction.ts  (ICoinTransaction)
 *   rez-shared/src/constants/coins.ts         (CoinType — authoritative)
 *
 * NOTE: WalletBalance and CoinTransaction (simple shapes) remain in
 * types/wallet.ts for backward compatibility. This file adds the full
 * Wallet entity and richer transaction types needed by all apps.
 *
 * Do NOT redefine these types in frontend apps — import from @rez/shared instead.
 */

// ── Coin Type (wallet-model-aware, includes legacy 'rez') ─────────────────────

/**
 * CoinType as stored in Wallet documents.
 * 'rez' is the primary coin type. 'nuqta' was the legacy alias and may still
 * appear in existing MongoDB docs — use normalizeCoinType() from '@rez/shared'
 * to canonicalize.
 *
 * Note: CoinType is in constants/coins.ts.
 * Use this WalletCoinType when reading raw MongoDB wallet documents.
 */
/**
 * WalletCoinType: coin types that have a balance bucket in the Wallet document.
 * These correspond to the `type` field in Wallet.coins[].
 * Note: 'cashback' is a balance bucket on WalletEntityBalance, not a coins[] entry.
 *       'category' and 'referral' are transaction-only coin types — no wallet balance bucket.
 */
export type WalletCoinType = 'rez' | 'prive' | 'branded' | 'promo' | 'cashback';

// ── Coin Balance (full) ───────────────────────────────────────────────────────

export interface CoinBalance {
  type: WalletCoinType;
  amount: number;
  isActive: boolean;
  color: string;
  earnedDate?: string;       // ISO date string
  lastUsed?: string;
  lastEarned?: string;
  expiryDate?: string;
  promoDetails?: {
    campaignId?: string;
    campaignName?: string;
    maxRedemptionPercentage: number;
    expiryDate: string;
  };
}

// ── Branded Coin ──────────────────────────────────────────────────────────────

export interface BrandedCoin {
  merchantId: string;
  merchantName: string;
  merchantLogo?: string;
  merchantColor?: string;
  amount: number;
  earnedDate: string;
  lastUsed?: string;
  expiresAt?: string;
  isActive: boolean;
}

// ── Wallet Balance (canonical — matches IWallet.balance) ──────────────────────

/**
 * Canonical balance shape from IWallet.balance.
 * Fields: total, available, pending, cashback.
 *
 * Note: A simpler WalletBalance interface (rez/prive/promo per-coin view)
 * lives in types/wallet.ts for backward compatibility with pre-Phase-8 code.
 * This WalletEntityBalance reflects the actual MongoDB document shape.
 */
export interface WalletEntityBalance {
  total: number;
  available: number;
  pending: number;
  cashback: number;
}

// ── Wallet Statistics ─────────────────────────────────────────────────────────

export interface WalletStatistics {
  totalEarned: number;
  totalSpent: number;
  totalCashback: number;
  totalRefunds: number;
  totalTopups: number;
  totalWithdrawals: number;
}

// ── Full Wallet entity ────────────────────────────────────────────────────────

export interface Wallet {
  _id: string;
  user: string;
  balance: WalletEntityBalance;
  coins: CoinBalance[];
  brandedCoins: BrandedCoin[];
  currency: string;
  statistics: WalletStatistics;
  isActive: boolean;
  isFrozen: boolean;
  frozenReason?: string;
  frozenAt?: string;
  lastTransactionAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Transaction Type ──────────────────────────────────────────────────────────

/**
 * Canonical transaction types from ICoinTransaction.type.
 */
export type CoinTransactionType =
  | 'earned'
  | 'spent'
  | 'expired'
  | 'refunded'
  | 'bonus'
  | 'branded_award';

// ── Coin Transaction coinType ─────────────────────────────────────────────────

/**
 * CoinTransaction.coinType values — as stored in the CoinTransaction model.
 * Distinct from WalletCoinType (the coin balance type in Wallet.coins[].type).
 */
/**
 * CoinTransactionCoinType: all coin types that can appear in a CoinTransaction document.
 * This is the full set from the CoinTransaction model (wallet-service + backend).
 * Subset of CoinType from constants/coins.ts.
 * Note: 'nuqta' is a legacy alias for 'rez'; use normalizeCoinType() to canonicalize.
 */
export type CoinTransactionCoinType =
  | 'rez'
  | 'nuqta'    // legacy alias for 'rez' — present in existing MongoDB docs
  | 'prive'
  | 'branded'
  | 'promo'
  | 'cashback'
  | 'referral';

// ── Full Coin Transaction entity ──────────────────────────────────────────────

export interface CoinTransactionEntity {
  _id: string;
  user: string;
  type: CoinTransactionType;
  amount: number;
  balance: number;          // Legacy snapshot — balance at time of transaction
  coinType: CoinTransactionCoinType;
  balanceBefore: number;
  balanceAfter: number;
  source: string;           // See ICoinTransaction.source in backend for full enum
  description: string;
  category?: string;        // MainCategorySlug
  createdAt: string;
  updatedAt: string;
}
