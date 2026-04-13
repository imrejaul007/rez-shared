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
    name?: string;
    email?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
    landmark?: string;
    addressType?: "other" | "home" | "work";
}, {
    name?: string;
    email?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
    landmark?: string;
    addressType?: "other" | "home" | "work";
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
        name?: string;
        email?: string;
        phone?: string;
        addressLine1?: string;
        addressLine2?: string;
        city?: string;
        state?: string;
        pincode?: string;
        country?: string;
        landmark?: string;
        addressType?: "other" | "home" | "work";
    }, {
        name?: string;
        email?: string;
        phone?: string;
        addressLine1?: string;
        addressLine2?: string;
        city?: string;
        state?: string;
        pincode?: string;
        country?: string;
        landmark?: string;
        addressType?: "other" | "home" | "work";
    }>;
    paymentMethod: z.ZodEnum<["cod", "wallet", "razorpay", "upi", "card", "netbanking"]>;
    fulfillmentType: z.ZodDefault<z.ZodEnum<["delivery", "pickup", "dine_in", "drive_thru"]>>;
    specialInstructions: z.ZodOptional<z.ZodString>;
    couponCode: z.ZodOptional<z.ZodString>;
    coinsUsed: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        rezCoins: z.ZodOptional<z.ZodNumber>;
        promoCoins: z.ZodOptional<z.ZodNumber>;
        storePromoCoins: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        rezCoins?: number;
        promoCoins?: number;
        storePromoCoins?: number;
    }, {
        rezCoins?: number;
        promoCoins?: number;
        storePromoCoins?: number;
    }>, {
        rezCoins?: number;
        promoCoins?: number;
        storePromoCoins?: number;
    }, {
        rezCoins?: number;
        promoCoins?: number;
        storePromoCoins?: number;
    }>>;
    idempotencyKey: z.ZodString;
    fulfillmentDetails: z.ZodOptional<z.ZodObject<{
        tableNumber: z.ZodOptional<z.ZodString>;
        storeAddress: z.ZodOptional<z.ZodString>;
        estimatedReadyTime: z.ZodEffects<z.ZodOptional<z.ZodString>, Date, string>;
        pickupInstructions: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        tableNumber?: string;
        storeAddress?: string;
        estimatedReadyTime?: Date;
        pickupInstructions?: string;
    }, {
        tableNumber?: string;
        storeAddress?: string;
        estimatedReadyTime?: string;
        pickupInstructions?: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    deliveryAddress?: {
        name?: string;
        email?: string;
        phone?: string;
        addressLine1?: string;
        addressLine2?: string;
        city?: string;
        state?: string;
        pincode?: string;
        country?: string;
        landmark?: string;
        addressType?: "other" | "home" | "work";
    };
    paymentMethod?: "cod" | "wallet" | "card" | "upi" | "netbanking" | "razorpay";
    fulfillmentType?: "delivery" | "pickup" | "drive_thru" | "dine_in";
    specialInstructions?: string;
    couponCode?: string;
    coinsUsed?: {
        rezCoins?: number;
        promoCoins?: number;
        storePromoCoins?: number;
    };
    idempotencyKey?: string;
    fulfillmentDetails?: {
        tableNumber?: string;
        storeAddress?: string;
        estimatedReadyTime?: Date;
        pickupInstructions?: string;
    };
}, {
    deliveryAddress?: {
        name?: string;
        email?: string;
        phone?: string;
        addressLine1?: string;
        addressLine2?: string;
        city?: string;
        state?: string;
        pincode?: string;
        country?: string;
        landmark?: string;
        addressType?: "other" | "home" | "work";
    };
    paymentMethod?: "cod" | "wallet" | "card" | "upi" | "netbanking" | "razorpay";
    fulfillmentType?: "delivery" | "pickup" | "drive_thru" | "dine_in";
    specialInstructions?: string;
    couponCode?: string;
    coinsUsed?: {
        rezCoins?: number;
        promoCoins?: number;
        storePromoCoins?: number;
    };
    idempotencyKey?: string;
    fulfillmentDetails?: {
        tableNumber?: string;
        storeAddress?: string;
        estimatedReadyTime?: string;
        pickupInstructions?: string;
    };
}>;
export type CreateOrderRequest = z.infer<typeof createOrderSchema>;
/**
 * Order status update schema
 */
export declare const updateOrderStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["placed", "confirmed", "preparing", "ready", "dispatched", "out_for_delivery", "delivered", "cancelled", "cancelling", "returned", "refunded"]>;
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: "placed" | "confirmed" | "preparing" | "ready" | "dispatched" | "out_for_delivery" | "delivered" | "cancelled" | "cancelling" | "returned" | "refunded";
    note?: string;
}, {
    status?: "placed" | "confirmed" | "preparing" | "ready" | "dispatched" | "out_for_delivery" | "delivered" | "cancelled" | "cancelling" | "returned" | "refunded";
    note?: string;
}>;
export type UpdateOrderStatusRequest = z.infer<typeof updateOrderStatusSchema>;
export declare const createOfferSchema: z.ZodEffects<z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    offerType: z.ZodEnum<["discount", "cashback", "voucher", "combo", "special", "walk_in"]>;
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
    isActive?: boolean;
    startDate?: Date;
    endDate?: Date;
    title?: string;
    description?: string;
    offerType?: "cashback" | "discount" | "voucher" | "combo" | "special" | "walk_in";
    minOrderAmount?: number;
    maxRedemptions?: number;
    maxRedemptionsPerUser?: number;
    applicableCategories?: string[];
    applicableProducts?: string[];
    userSegments?: string[];
}, {
    isActive?: boolean;
    startDate?: Date;
    endDate?: Date;
    title?: string;
    description?: string;
    offerType?: "cashback" | "discount" | "voucher" | "combo" | "special" | "walk_in";
    minOrderAmount?: number;
    maxRedemptions?: number;
    maxRedemptionsPerUser?: number;
    applicableCategories?: string[];
    applicableProducts?: string[];
    userSegments?: string[];
}>, {
    isActive?: boolean;
    startDate?: Date;
    endDate?: Date;
    title?: string;
    description?: string;
    offerType?: "cashback" | "discount" | "voucher" | "combo" | "special" | "walk_in";
    minOrderAmount?: number;
    maxRedemptions?: number;
    maxRedemptionsPerUser?: number;
    applicableCategories?: string[];
    applicableProducts?: string[];
    userSegments?: string[];
}, {
    isActive?: boolean;
    startDate?: Date;
    endDate?: Date;
    title?: string;
    description?: string;
    offerType?: "cashback" | "discount" | "voucher" | "combo" | "special" | "walk_in";
    minOrderAmount?: number;
    maxRedemptions?: number;
    maxRedemptionsPerUser?: number;
    applicableCategories?: string[];
    applicableProducts?: string[];
    userSegments?: string[];
}>;
export type CreateOfferRequest = z.infer<typeof createOfferSchema>;
/**
 * Discount offer schema (specific)
 */
export declare const createDiscountOfferSchema: z.ZodEffects<z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    offerType: z.ZodEnum<["discount", "cashback", "voucher", "combo", "special", "walk_in"]>;
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
    discountValue?: number;
    isActive?: boolean;
    startDate?: Date;
    endDate?: Date;
    title?: string;
    description?: string;
    offerType?: "cashback" | "discount" | "voucher" | "combo" | "special" | "walk_in";
    minOrderAmount?: number;
    maxRedemptions?: number;
    maxRedemptionsPerUser?: number;
    applicableCategories?: string[];
    applicableProducts?: string[];
    userSegments?: string[];
    discountType?: "fixed" | "percentage";
    maxDiscountAmount?: number;
}, {
    discountValue?: number;
    isActive?: boolean;
    startDate?: Date;
    endDate?: Date;
    title?: string;
    description?: string;
    offerType?: "cashback" | "discount" | "voucher" | "combo" | "special" | "walk_in";
    minOrderAmount?: number;
    maxRedemptions?: number;
    maxRedemptionsPerUser?: number;
    applicableCategories?: string[];
    applicableProducts?: string[];
    userSegments?: string[];
    discountType?: "fixed" | "percentage";
    maxDiscountAmount?: number;
}>, {
    discountValue?: number;
    isActive?: boolean;
    startDate?: Date;
    endDate?: Date;
    title?: string;
    description?: string;
    offerType?: "cashback" | "discount" | "voucher" | "combo" | "special" | "walk_in";
    minOrderAmount?: number;
    maxRedemptions?: number;
    maxRedemptionsPerUser?: number;
    applicableCategories?: string[];
    applicableProducts?: string[];
    userSegments?: string[];
    discountType?: "fixed" | "percentage";
    maxDiscountAmount?: number;
}, {
    discountValue?: number;
    isActive?: boolean;
    startDate?: Date;
    endDate?: Date;
    title?: string;
    description?: string;
    offerType?: "cashback" | "discount" | "voucher" | "combo" | "special" | "walk_in";
    minOrderAmount?: number;
    maxRedemptions?: number;
    maxRedemptionsPerUser?: number;
    applicableCategories?: string[];
    applicableProducts?: string[];
    userSegments?: string[];
    discountType?: "fixed" | "percentage";
    maxDiscountAmount?: number;
}>;
export type CreateDiscountOfferRequest = z.infer<typeof createDiscountOfferSchema>;
/**
 * Cashback offer schema (specific)
 */
export declare const createCashbackOfferSchema: z.ZodEffects<z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    offerType: z.ZodEnum<["discount", "cashback", "voucher", "combo", "special", "walk_in"]>;
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
    isActive?: boolean;
    startDate?: Date;
    endDate?: Date;
    title?: string;
    description?: string;
    offerType?: "cashback" | "discount" | "voucher" | "combo" | "special" | "walk_in";
    minOrderAmount?: number;
    maxRedemptions?: number;
    maxRedemptionsPerUser?: number;
    applicableCategories?: string[];
    applicableProducts?: string[];
    userSegments?: string[];
    cashbackType?: "wallet" | "coins";
    cashbackValue?: number;
}, {
    isActive?: boolean;
    startDate?: Date;
    endDate?: Date;
    title?: string;
    description?: string;
    offerType?: "cashback" | "discount" | "voucher" | "combo" | "special" | "walk_in";
    minOrderAmount?: number;
    maxRedemptions?: number;
    maxRedemptionsPerUser?: number;
    applicableCategories?: string[];
    applicableProducts?: string[];
    userSegments?: string[];
    cashbackType?: "wallet" | "coins";
    cashbackValue?: number;
}>, {
    isActive?: boolean;
    startDate?: Date;
    endDate?: Date;
    title?: string;
    description?: string;
    offerType?: "cashback" | "discount" | "voucher" | "combo" | "special" | "walk_in";
    minOrderAmount?: number;
    maxRedemptions?: number;
    maxRedemptionsPerUser?: number;
    applicableCategories?: string[];
    applicableProducts?: string[];
    userSegments?: string[];
    cashbackType?: "wallet" | "coins";
    cashbackValue?: number;
}, {
    isActive?: boolean;
    startDate?: Date;
    endDate?: Date;
    title?: string;
    description?: string;
    offerType?: "cashback" | "discount" | "voucher" | "combo" | "special" | "walk_in";
    minOrderAmount?: number;
    maxRedemptions?: number;
    maxRedemptionsPerUser?: number;
    applicableCategories?: string[];
    applicableProducts?: string[];
    userSegments?: string[];
    cashbackType?: "wallet" | "coins";
    cashbackValue?: number;
}>;
export type CreateCashbackOfferRequest = z.infer<typeof createCashbackOfferSchema>;
/**
 * Merchant login schema
 */
export declare const merchantLoginSchema: z.ZodObject<{
    email: z.ZodUnion<[z.ZodString, z.ZodString]>;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email?: string;
    password?: string;
}, {
    email?: string;
    password?: string;
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
    userId?: string;
    code?: string;
    orderAmount?: number;
}, {
    userId?: string;
    code?: string;
    orderAmount?: number;
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
