"use strict";
// Canonical enum definitions for the REZ platform.
// Source of truth for all status codes, types, and categorical values.
//
// All services should import from @rez/shared instead of defining their own.
// For npm consumers: import { LOYALTY_TIERS, USER_ROLES, TRANSACTION_TYPES } from '@rez/shared';
//
// NOTE: Coin types, cashback status, order status, and payment status — along with
// their normalization helpers (normalizeCoinType, normalizeCashbackStatus,
// normalizeLoyaltyTier, normalizeOrderStatus, normalizePaymentStatus) — are
// exported by their respective files: constants/coins.ts, orderStatuses.ts,
// paymentStatuses.ts, and statusCompat.ts. Do NOT re-export them here to avoid
// duplicate identifier errors.
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_ROLES = exports.TRANSACTION_TYPES = exports.LOYALTY_TIERS = void 0;
exports.normalizeLoyaltyTier = normalizeLoyaltyTier;
// Loyalty Tiers
exports.LOYALTY_TIERS = ['bronze', 'silver', 'gold', 'platinum'];
function normalizeLoyaltyTier(tier) {
    if (!tier)
        return 'bronze';
    const map = {
        BRONZE: 'bronze', SILVER: 'silver', GOLD: 'gold', PLATINUM: 'platinum',
        STARTER: 'bronze', DIAMOND: 'platinum',
    };
    return map[tier.toUpperCase()] || 'bronze';
}
// Transaction Types
exports.TRANSACTION_TYPES = {
    EARNED: 'earned',
    SPENT: 'spent',
    EXPIRED: 'expired',
    REFUNDED: 'refunded',
    BONUS: 'bonus',
    BRANDED_AWARD: 'branded_award',
    TRANSFER: 'transfer',
    GIFT: 'gift',
};
// User Roles
exports.USER_ROLES = {
    USER: 'user',
    ADMIN: 'admin',
    MERCHANT: 'merchant',
    SUPPORT: 'support',
    OPERATOR: 'operator',
    SUPER_ADMIN: 'super_admin',
};
