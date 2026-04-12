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
/**
 * CoinType as stored in Wallet documents.
 * 'rez' is the primary coin type. 'nuqta' was the legacy alias and may still
 * appear in existing MongoDB docs — use normalizeCoinType() from '@rez/shared'
 * to canonicalize.
 *
 * Note: CoinType is in constants/coins.ts.
 * Use this WalletCoinType when reading raw MongoDB wallet documents.
 */
export type WalletCoinType = 'rez' | 'prive' | 'branded' | 'promo';
export interface CoinBalance {
    type: WalletCoinType;
    amount: number;
    isActive: boolean;
    color: string;
    earnedDate?: string;
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
/**
 * Canonical balance shape from IWallet.balance.
 * Fields: total, available, pending, cashback.
 *
 * Note: A simpler WalletBalance interface (nuqta/prive/promo per-coin view)
 * lives in types/wallet.ts for backward compatibility with pre-Phase-8 code.
 * This WalletEntityBalance reflects the actual MongoDB document shape.
 */
export interface WalletEntityBalance {
    total: number;
    available: number;
    pending: number;
    cashback: number;
}
export interface WalletStatistics {
    totalEarned: number;
    totalSpent: number;
    totalCashback: number;
    totalRefunds: number;
    totalTopups: number;
    totalWithdrawals: number;
}
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
/**
 * Canonical transaction types from ICoinTransaction.type.
 */
export type CoinTransactionType = 'earned' | 'spent' | 'expired' | 'refunded' | 'bonus' | 'branded_award';
/**
 * CoinTransaction.coinType values — as stored in the CoinTransaction model.
 * Distinct from WalletCoinType (the coin balance type in Wallet.coins[].type).
 */
export type CoinTransactionCoinType = 'rez' | 'cashback' | 'referral';
export interface CoinTransactionEntity {
    _id: string;
    user: string;
    type: CoinTransactionType;
    amount: number;
    balance: number;
    coinType: CoinTransactionCoinType;
    balanceBefore: number;
    balanceAfter: number;
    source: string;
    description: string;
    category?: string;
    createdAt: string;
    updatedAt: string;
}
//# sourceMappingURL=wallet.types.d.ts.map