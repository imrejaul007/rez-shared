export declare const LOYALTY_TIERS: readonly ["bronze", "silver", "gold", "platinum"];
export type LoyaltyTier = typeof LOYALTY_TIERS[number];
export declare function normalizeLoyaltyTier(tier: string): LoyaltyTier;
export declare const TRANSACTION_TYPES: {
    readonly EARNED: "earned";
    readonly SPENT: "spent";
    readonly EXPIRED: "expired";
    readonly REFUNDED: "refunded";
    readonly BONUS: "bonus";
    readonly BRANDED_AWARD: "branded_award";
    readonly TRANSFER: "transfer";
    readonly GIFT: "gift";
};
export type TransactionType = typeof TRANSACTION_TYPES[keyof typeof TRANSACTION_TYPES];
export declare const USER_ROLES: {
    readonly USER: "user";
    readonly ADMIN: "admin";
    readonly MERCHANT: "merchant";
    readonly SUPPORT: "support";
    readonly OPERATOR: "operator";
    readonly SUPER_ADMIN: "super_admin";
};
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
