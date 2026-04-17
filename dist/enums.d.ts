export declare const LOYALTY_TIERS: readonly ["bronze", "silver", "gold", "platinum", "diamond"];
export type LoyaltyTier = typeof LOYALTY_TIERS[number];
export declare function normalizeLoyaltyTier(tier: string): LoyaltyTier;
export interface LoyaltyTierPerks {
    tier: LoyaltyTier;
    cashbackRate: number;
    freeDeliveryMinOrder: number;
    prioritySupport: boolean;
    exclusiveOffers: boolean;
    earlyAccess: boolean;
}
export declare const LOYALTY_TIER_PERKS: Record<LoyaltyTier, LoyaltyTierPerks>;
export declare function getLoyaltyTierPerks(tier: string): LoyaltyTierPerks;
export declare const TRANSACTION_TYPES: {
    readonly EARNED: "earned";
    readonly SPENT: "spent";
    readonly EXPIRED: "expired";
    readonly REFUNDED: "refunded";
    readonly BONUS: "bonus";
    readonly BRANDED_AWARD: "branded_award";
};
export type TransactionType = typeof TRANSACTION_TYPES[keyof typeof TRANSACTION_TYPES];
export declare const USER_ROLES: {
    readonly USER: "user";
    readonly CONSUMER: "consumer";
    readonly MERCHANT: "merchant";
    readonly ADMIN: "admin";
    readonly SUPPORT: "support";
    readonly OPERATOR: "operator";
    readonly SUPER_ADMIN: "super_admin";
};
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
