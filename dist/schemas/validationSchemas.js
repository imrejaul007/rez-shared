"use strict";
/**
 * Shared Validation Schemas using Zod
 *
 * Centralized validation for common objects across services.
 * Usage:
 * ```typescript
 * const { success, data, error } = createOrderSchema.safeParse(req.body);
 * ```
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponCodeSchema = exports.merchantLoginSchema = exports.createCashbackOfferSchema = exports.createDiscountOfferSchema = exports.createOfferSchema = exports.updateOrderStatusSchema = exports.createOrderSchema = exports.addressSchema = void 0;
exports.validateRequest = validateRequest;
exports.validateQuery = validateQuery;
const zod_1 = require("zod");
/**
 * Phone number validation (India)
 */
const phoneSchema = zod_1.z
    .string()
    .regex(/^(\+91|91)?[6-9]\d{9}$/, 'Invalid phone number');
/**
 * Pincode validation (India)
 */
const pincodeSchema = zod_1.z
    .string()
    .regex(/^\d{6}$/, 'Pincode must be 6 digits');
/**
 * Email validation
 */
const emailSchema = zod_1.z
    .string()
    .email('Invalid email address')
    .optional();
/**
 * Address schema
 */
exports.addressSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(100),
    phone: phoneSchema,
    email: emailSchema,
    addressLine1: zod_1.z.string().min(1, 'Address line 1 is required').max(200),
    addressLine2: zod_1.z.string().max(200).optional(),
    city: zod_1.z.string().min(1, 'City is required').max(50),
    state: zod_1.z.string().min(1, 'State is required').max(50),
    pincode: pincodeSchema,
    country: zod_1.z.string().max(50).default('India'),
    landmark: zod_1.z.string().max(100).optional(),
    addressType: zod_1.z.enum(['home', 'work', 'other']).default('home'),
});
/**
 * Order creation schema
 */
exports.createOrderSchema = zod_1.z.object({
    deliveryAddress: exports.addressSchema,
    paymentMethod: zod_1.z.enum(['cod', 'wallet', 'razorpay', 'upi', 'card', 'netbanking']),
    fulfillmentType: zod_1.z.enum(['delivery', 'pickup', 'dine_in', 'drive_thru']).default('delivery'),
    specialInstructions: zod_1.z.string().max(500).optional(),
    couponCode: zod_1.z.string().max(20).optional(),
    coinsUsed: zod_1.z.object({
        rezCoins: zod_1.z.number().nonnegative().optional(),
        promoCoins: zod_1.z.number().nonnegative().optional(),
        storePromoCoins: zod_1.z.number().nonnegative().optional(),
    }).optional(),
    idempotencyKey: zod_1.z.string().uuid('Invalid idempotency key format'),
    fulfillmentDetails: zod_1.z.object({
        tableNumber: zod_1.z.string().optional(),
        storeAddress: zod_1.z.string().optional(),
        estimatedReadyTime: zod_1.z.date().optional(),
        pickupInstructions: zod_1.z.string().optional(),
    }).optional(),
});
/**
 * Order status update schema
 */
exports.updateOrderStatusSchema = zod_1.z.object({
    status: zod_1.z.enum([
        'placed', 'confirmed', 'preparing', 'ready',
        'dispatched', 'out_for_delivery', 'delivered',
        'cancelled', 'cancelling', 'returned', 'refunded'
    ]),
    note: zod_1.z.string().max(500).optional(),
});
/**
 * Offer creation schema (base)
 */
const createOfferSchemaBase = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').max(200),
    description: zod_1.z.string().max(1000).optional(),
    offerType: zod_1.z.enum(['discount', 'cashback', 'deal', 'flash_sale', 'loyalty', 'gift_card', 'voucher', 'dynamic_pricing']),
    startDate: zod_1.z.date(),
    endDate: zod_1.z.date(),
    minOrderAmount: zod_1.z.number().nonnegative().optional(),
    maxRedemptions: zod_1.z.number().positive().optional(),
    maxRedemptionsPerUser: zod_1.z.number().positive().optional(),
    isActive: zod_1.z.boolean().default(true),
    applicableCategories: zod_1.z.array(zod_1.z.string().max(24)).optional(),
    applicableProducts: zod_1.z.array(zod_1.z.string().max(24)).optional(),
    userSegments: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.createOfferSchema = createOfferSchemaBase.refine((data) => data.startDate < data.endDate, {
    message: 'startDate must be before endDate',
    path: ['endDate'],
});
/**
 * Discount offer schema (specific)
 */
exports.createDiscountOfferSchema = createOfferSchemaBase.extend({
    discountType: zod_1.z.enum(['percentage', 'fixed']),
    discountValue: zod_1.z.number().positive('Discount value must be positive'),
    maxDiscountAmount: zod_1.z.number().nonnegative().optional(),
}).refine((data) => data.startDate < data.endDate, {
    message: 'startDate must be before endDate',
    path: ['endDate'],
});
/**
 * Cashback offer schema (specific)
 */
exports.createCashbackOfferSchema = createOfferSchemaBase.extend({
    cashbackType: zod_1.z.enum(['coins', 'wallet']),
    cashbackValue: zod_1.z.number().positive('Cashback value must be positive'),
}).refine((data) => data.startDate < data.endDate, {
    message: 'startDate must be before endDate',
    path: ['endDate'],
});
/**
 * Merchant login schema
 */
exports.merchantLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email').or(phoneSchema),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
});
/**
 * Coupon code validation schema
 */
exports.couponCodeSchema = zod_1.z.object({
    code: zod_1.z.string().min(1, 'Code is required').max(20).toUpperCase(),
    orderAmount: zod_1.z.number().positive(),
    userId: zod_1.z.string().optional(),
});
/**
 * Validation middleware factory
 */
function validateRequest(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.errors.reduce((acc, err) => {
                const path = err.path.join('.');
                acc[path] = err.message;
                return acc;
            }, {});
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Validation failed',
                    statusCode: 400,
                    details: errors,
                },
            });
        }
        req.validatedBody = result.data;
        next();
    };
}
/**
 * Validate query parameters
 */
function validateQuery(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.query);
        if (!result.success) {
            const errors = result.error.errors.reduce((acc, err) => {
                const path = err.path.join('.');
                acc[path] = err.message;
                return acc;
            }, {});
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Query validation failed',
                    statusCode: 400,
                    details: errors,
                },
            });
        }
        req.validatedQuery = result.data;
        next();
    };
}
//# sourceMappingURL=validationSchemas.js.map