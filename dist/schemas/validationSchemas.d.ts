/**
 * Shared Validation Schemas using Zod
 *
 * Centralized validation for common objects across services.
 * Usage:
 * ```typescript
 * const { success, data, error } = createOrderSchema.safeParse(req.body);
 * ```
 */
import { z } from 'zod';
/**
 * Address schema
 */
export declare const addressSchema: z.ZodObject<{
    name: z.ZodString;
    phone: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    addressLine1: z.ZodString;
    addressLine2: z.ZodOptional<z.ZodString>;
    city: z.ZodString;
    state: z.ZodString;
    pincode: z.ZodString;
    country: z.ZodDefault<z.ZodString>;
    landmark: z.ZodOptional<z.ZodString>;
    addressType: z.ZodDefault<z.ZodEnum<["home", "work", "other"]>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    phone: string;
    addressLine1: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    addressType: "other" | "home" | "work";
    email?: string | undefined;
    addressLine2?: string | undefined;
    landmark?: string | undefined;
}, {
    name: string;
    phone: string;
    addressLine1: string;
    city: string;
    state: string;
    pincode: string;
    email?: string | undefined;
    addressLine2?: string | undefined;
    country?: string | undefined;
    landmark?: string | undefined;
    addressType?: "other" | "home" | "work" | undefined;
}>;
export type Address = z.infer<typeof addressSchema>;
/**
 * Order creation schema
 */
export declare const createOrderSchema: z.ZodObject<{
    deliveryAddress: z.ZodObject<{
        name: z.ZodString;
        phone: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
        addressLine1: z.ZodString;
        addressLine2: z.ZodOptional<z.ZodString>;
        city: z.ZodString;
        state: z.ZodString;
        pincode: z.ZodString;
        country: z.ZodDefault<z.ZodString>;
        landmark: z.ZodOptional<z.ZodString>;
        addressType: z.ZodDefault<z.ZodEnum<["home", "work", "other"]>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
        addressType: "other" | "home" | "work";
        email?: string | undefined;
        addressLine2?: string | undefined;
        landmark?: string | undefined;
    }, {
        name: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        pincode: string;
        email?: string | undefined;
        addressLine2?: string | undefined;
        country?: string | undefined;
        landmark?: string | undefined;
        addressType?: "other" | "home" | "work" | undefined;
    }>;
    paymentMethod: z.ZodEnum<["cod", "wallet", "razorpay", "upi", "card", "netbanking"]>;
    fulfillmentType: z.ZodDefault<z.ZodEnum<["delivery", "pickup", "dine_in", "drive_thru"]>>;
    specialInstructions: z.ZodOptional<z.ZodString>;
    couponCode: z.ZodOptional<z.ZodString>;
    coinsUsed: z.ZodOptional<z.ZodObject<{
        rezCoins: z.ZodOptional<z.ZodNumber>;
        promoCoins: z.ZodOptional<z.ZodNumber>;
        storePromoCoins: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        rezCoins?: number | undefined;
        promoCoins?: number | undefined;
        storePromoCoins?: number | undefined;
    }, {
        rezCoins?: number | undefined;
        promoCoins?: number | undefined;
        storePromoCoins?: number | undefined;
    }>>;
    idempotencyKey: z.ZodString;
    fulfillmentDetails: z.ZodOptional<z.ZodObject<{
        tableNumber: z.ZodOptional<z.ZodString>;
        storeAddress: z.ZodOptional<z.ZodString>;
        estimatedReadyTime: z.ZodOptional<z.ZodDate>;
        pickupInstructions: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        tableNumber?: string | undefined;
        storeAddress?: string | undefined;
        estimatedReadyTime?: Date | undefined;
        pickupInstructions?: string | undefined;
    }, {
        tableNumber?: string | undefined;
        storeAddress?: string | undefined;
        estimatedReadyTime?: Date | undefined;
        pickupInstructions?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    deliveryAddress: {
        name: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
        addressType: "other" | "home" | "work";
        email?: string | undefined;
        addressLine2?: string | undefined;
        landmark?: string | undefined;
    };
    paymentMethod: "cod" | "wallet" | "card" | "upi" | "netbanking" | "razorpay";
    fulfillmentType: "delivery" | "pickup" | "drive_thru" | "dine_in";
    idempotencyKey: string;
    specialInstructions?: string | undefined;
    couponCode?: string | undefined;
    coinsUsed?: {
        rezCoins?: number | undefined;
        promoCoins?: number | undefined;
        storePromoCoins?: number | undefined;
    } | undefined;
    fulfillmentDetails?: {
        tableNumber?: string | undefined;
        storeAddress?: string | undefined;
        estimatedReadyTime?: Date | undefined;
        pickupInstructions?: string | undefined;
    } | undefined;
}, {
    deliveryAddress: {
        name: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        pincode: string;
        email?: string | undefined;
        addressLine2?: string | undefined;
        country?: string | undefined;
        landmark?: string | undefined;
        addressType?: "other" | "home" | "work" | undefined;
    };
    paymentMethod: "cod" | "wallet" | "card" | "upi" | "netbanking" | "razorpay";
    idempotencyKey: string;
    fulfillmentType?: "delivery" | "pickup" | "drive_thru" | "dine_in" | undefined;
    specialInstructions?: string | undefined;
    couponCode?: string | undefined;
    coinsUsed?: {
        rezCoins?: number | undefined;
        promoCoins?: number | undefined;
        storePromoCoins?: number | undefined;
    } | undefined;
    fulfillmentDetails?: {
        tableNumber?: string | undefined;
        storeAddress?: string | undefined;
        estimatedReadyTime?: Date | undefined;
        pickupInstructions?: string | undefined;
    } | undefined;
}>;
export type CreateOrderRequest = z.infer<typeof createOrderSchema>;
/**
 * Order status update schema
 */
export declare const updateOrderStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["placed", "confirmed", "preparing", "ready", "dispatched", "out_for_delivery", "delivered", "cancelled", "cancelling", "returned", "refunded"]>;
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "placed" | "confirmed" | "preparing" | "ready" | "dispatched" | "out_for_delivery" | "delivered" | "cancelled" | "cancelling" | "returned" | "refunded";
    note?: string | undefined;
}, {
    status: "placed" | "confirmed" | "preparing" | "ready" | "dispatched" | "out_for_delivery" | "delivered" | "cancelled" | "cancelling" | "returned" | "refunded";
    note?: string | undefined;
}>;
export type UpdateOrderStatusRequest = z.infer<typeof updateOrderStatusSchema>;
export declare const createOfferSchema: z.ZodEffects<z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    offerType: z.ZodEnum<["discount", "cashback", "deal", "flash_sale", "loyalty", "gift_card", "voucher", "dynamic_pricing"]>;
    startDate: z.ZodDate;
    endDate: z.ZodDate;
    minOrderAmount: z.ZodOptional<z.ZodNumber>;
    maxRedemptions: z.ZodOptional<z.ZodNumber>;
    maxRedemptionsPerUser: z.ZodOptional<z.ZodNumber>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    applicableCategories: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    applicableProducts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    userSegments: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    isActive: boolean;
    startDate: Date;
    endDate: Date;
    title: string;
    offerType: "cashback" | "discount" | "voucher" | "deal" | "flash_sale" | "loyalty" | "gift_card" | "dynamic_pricing";
    description?: string | undefined;
    minOrderAmount?: number | undefined;
    maxRedemptions?: number | undefined;
    maxRedemptionsPerUser?: number | undefined;
    applicableCategories?: string[] | undefined;
    applicableProducts?: string[] | undefined;
    userSegments?: string[] | undefined;
}, {
    startDate: Date;
    endDate: Date;
    title: string;
    offerType: "cashback" | "discount" | "voucher" | "deal" | "flash_sale" | "loyalty" | "gift_card" | "dynamic_pricing";
    isActive?: boolean | undefined;
    description?: string | undefined;
    minOrderAmount?: number | undefined;
    maxRedemptions?: number | undefined;
    maxRedemptionsPerUser?: number | undefined;
    applicableCategories?: string[] | undefined;
    applicableProducts?: string[] | undefined;
    userSegments?: string[] | undefined;
}>, {
    isActive: boolean;
    startDate: Date;
    endDate: Date;
    title: string;
    offerType: "cashback" | "discount" | "voucher" | "deal" | "flash_sale" | "loyalty" | "gift_card" | "dynamic_pricing";
    description?: string | undefined;
    minOrderAmount?: number | undefined;
    maxRedemptions?: number | undefined;
    maxRedemptionsPerUser?: number | undefined;
    applicableCategories?: string[] | undefined;
    applicableProducts?: string[] | undefined;
    userSegments?: string[] | undefined;
}, {
    startDate: Date;
    endDate: Date;
    title: string;
    offerType: "cashback" | "discount" | "voucher" | "deal" | "flash_sale" | "loyalty" | "gift_card" | "dynamic_pricing";
    isActive?: boolean | undefined;
    description?: string | undefined;
    minOrderAmount?: number | undefined;
    maxRedemptions?: number | undefined;
    maxRedemptionsPerUser?: number | undefined;
    applicableCategories?: string[] | undefined;
    applicableProducts?: string[] | undefined;
    userSegments?: string[] | undefined;
}>;
export type CreateOfferRequest = z.infer<typeof createOfferSchema>;
/**
 * Discount offer schema (specific)
 */
export declare const createDiscountOfferSchema: z.ZodEffects<z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    offerType: z.ZodEnum<["discount", "cashback", "deal", "flash_sale", "loyalty", "gift_card", "voucher", "dynamic_pricing"]>;
    startDate: z.ZodDate;
    endDate: z.ZodDate;
    minOrderAmount: z.ZodOptional<z.ZodNumber>;
    maxRedemptions: z.ZodOptional<z.ZodNumber>;
    maxRedemptionsPerUser: z.ZodOptional<z.ZodNumber>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    applicableCategories: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    applicableProducts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    userSegments: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
} & {
    discountType: z.ZodEnum<["percentage", "fixed"]>;
    discountValue: z.ZodNumber;
    maxDiscountAmount: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    isActive: boolean;
    startDate: Date;
    endDate: Date;
    title: string;
    offerType: "cashback" | "discount" | "voucher" | "deal" | "flash_sale" | "loyalty" | "gift_card" | "dynamic_pricing";
    discountType: "fixed" | "percentage";
    discountValue: number;
    description?: string | undefined;
    minOrderAmount?: number | undefined;
    maxRedemptions?: number | undefined;
    maxRedemptionsPerUser?: number | undefined;
    applicableCategories?: string[] | undefined;
    applicableProducts?: string[] | undefined;
    userSegments?: string[] | undefined;
    maxDiscountAmount?: number | undefined;
}, {
    startDate: Date;
    endDate: Date;
    title: string;
    offerType: "cashback" | "discount" | "voucher" | "deal" | "flash_sale" | "loyalty" | "gift_card" | "dynamic_pricing";
    discountType: "fixed" | "percentage";
    discountValue: number;
    isActive?: boolean | undefined;
    description?: string | undefined;
    minOrderAmount?: number | undefined;
    maxRedemptions?: number | undefined;
    maxRedemptionsPerUser?: number | undefined;
    applicableCategories?: string[] | undefined;
    applicableProducts?: string[] | undefined;
    userSegments?: string[] | undefined;
    maxDiscountAmount?: number | undefined;
}>, {
    isActive: boolean;
    startDate: Date;
    endDate: Date;
    title: string;
    offerType: "cashback" | "discount" | "voucher" | "deal" | "flash_sale" | "loyalty" | "gift_card" | "dynamic_pricing";
    discountType: "fixed" | "percentage";
    discountValue: number;
    description?: string | undefined;
    minOrderAmount?: number | undefined;
    maxRedemptions?: number | undefined;
    maxRedemptionsPerUser?: number | undefined;
    applicableCategories?: string[] | undefined;
    applicableProducts?: string[] | undefined;
    userSegments?: string[] | undefined;
    maxDiscountAmount?: number | undefined;
}, {
    startDate: Date;
    endDate: Date;
    title: string;
    offerType: "cashback" | "discount" | "voucher" | "deal" | "flash_sale" | "loyalty" | "gift_card" | "dynamic_pricing";
    discountType: "fixed" | "percentage";
    discountValue: number;
    isActive?: boolean | undefined;
    description?: string | undefined;
    minOrderAmount?: number | undefined;
    maxRedemptions?: number | undefined;
    maxRedemptionsPerUser?: number | undefined;
    applicableCategories?: string[] | undefined;
    applicableProducts?: string[] | undefined;
    userSegments?: string[] | undefined;
    maxDiscountAmount?: number | undefined;
}>;
export type CreateDiscountOfferRequest = z.infer<typeof createDiscountOfferSchema>;
/**
 * Cashback offer schema (specific)
 */
export declare const createCashbackOfferSchema: z.ZodEffects<z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    offerType: z.ZodEnum<["discount", "cashback", "deal", "flash_sale", "loyalty", "gift_card", "voucher", "dynamic_pricing"]>;
    startDate: z.ZodDate;
    endDate: z.ZodDate;
    minOrderAmount: z.ZodOptional<z.ZodNumber>;
    maxRedemptions: z.ZodOptional<z.ZodNumber>;
    maxRedemptionsPerUser: z.ZodOptional<z.ZodNumber>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    applicableCategories: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    applicableProducts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    userSegments: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
} & {
    cashbackType: z.ZodEnum<["coins", "wallet"]>;
    cashbackValue: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    isActive: boolean;
    startDate: Date;
    endDate: Date;
    title: string;
    offerType: "cashback" | "discount" | "voucher" | "deal" | "flash_sale" | "loyalty" | "gift_card" | "dynamic_pricing";
    cashbackType: "wallet" | "coins";
    cashbackValue: number;
    description?: string | undefined;
    minOrderAmount?: number | undefined;
    maxRedemptions?: number | undefined;
    maxRedemptionsPerUser?: number | undefined;
    applicableCategories?: string[] | undefined;
    applicableProducts?: string[] | undefined;
    userSegments?: string[] | undefined;
}, {
    startDate: Date;
    endDate: Date;
    title: string;
    offerType: "cashback" | "discount" | "voucher" | "deal" | "flash_sale" | "loyalty" | "gift_card" | "dynamic_pricing";
    cashbackType: "wallet" | "coins";
    cashbackValue: number;
    isActive?: boolean | undefined;
    description?: string | undefined;
    minOrderAmount?: number | undefined;
    maxRedemptions?: number | undefined;
    maxRedemptionsPerUser?: number | undefined;
    applicableCategories?: string[] | undefined;
    applicableProducts?: string[] | undefined;
    userSegments?: string[] | undefined;
}>, {
    isActive: boolean;
    startDate: Date;
    endDate: Date;
    title: string;
    offerType: "cashback" | "discount" | "voucher" | "deal" | "flash_sale" | "loyalty" | "gift_card" | "dynamic_pricing";
    cashbackType: "wallet" | "coins";
    cashbackValue: number;
    description?: string | undefined;
    minOrderAmount?: number | undefined;
    maxRedemptions?: number | undefined;
    maxRedemptionsPerUser?: number | undefined;
    applicableCategories?: string[] | undefined;
    applicableProducts?: string[] | undefined;
    userSegments?: string[] | undefined;
}, {
    startDate: Date;
    endDate: Date;
    title: string;
    offerType: "cashback" | "discount" | "voucher" | "deal" | "flash_sale" | "loyalty" | "gift_card" | "dynamic_pricing";
    cashbackType: "wallet" | "coins";
    cashbackValue: number;
    isActive?: boolean | undefined;
    description?: string | undefined;
    minOrderAmount?: number | undefined;
    maxRedemptions?: number | undefined;
    maxRedemptionsPerUser?: number | undefined;
    applicableCategories?: string[] | undefined;
    applicableProducts?: string[] | undefined;
    userSegments?: string[] | undefined;
}>;
export type CreateCashbackOfferRequest = z.infer<typeof createCashbackOfferSchema>;
/**
 * Merchant login schema
 */
export declare const merchantLoginSchema: z.ZodObject<{
    email: z.ZodUnion<[z.ZodString, z.ZodString]>;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type MerchantLoginRequest = z.infer<typeof merchantLoginSchema>;
/**
 * Coupon code validation schema
 */
export declare const couponCodeSchema: z.ZodObject<{
    code: z.ZodString;
    orderAmount: z.ZodNumber;
    userId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    code: string;
    orderAmount: number;
    userId?: string | undefined;
}, {
    code: string;
    orderAmount: number;
    userId?: string | undefined;
}>;
export type CouponCodeRequest = z.infer<typeof couponCodeSchema>;
/**
 * Validation middleware factory
 */
export declare function validateRequest(schema: z.ZodSchema): (req: any, res: any, next: any) => any;
/**
 * Validate query parameters
 */
export declare function validateQuery(schema: z.ZodSchema): (req: any, res: any, next: any) => any;
//# sourceMappingURL=validationSchemas.d.ts.map