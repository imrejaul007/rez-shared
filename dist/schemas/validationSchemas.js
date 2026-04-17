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
exports.couponCodeSchema = exports.merchantLoginSchema = exports.createProductSchema = exports.updateOfferSchema = exports.createCashbackOfferSchema = exports.createDiscountOfferSchema = exports.createOfferSchema = exports.updateOrderStatusSchema = exports.createOrderSchema = exports.addressSchema = exports.productCashbackSchema = void 0;
exports.validateRequest = validateRequest;
exports.validateParams = validateParams;
exports.validateQuery = validateQuery;
const zod_1 = require("zod");
const orderStatuses_1 = require("../orderStatuses");
/**
 * Product cashback subdocument schema (Zod)
 * Field names match the backend Product.cashback subdocument shape
 */
exports.productCashbackSchema = zod_1.z.object({
    percentage: zod_1.z.number().min(0).max(100).optional(),
    maxAmount: zod_1.z.number().min(0).optional(),
    minPurchase: zod_1.z.number().min(0).optional(),
    validUntil: zod_1.z.string().datetime().optional(),
    terms: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().optional(),
    conditions: zod_1.z.array(zod_1.z.string()).optional(),
});
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
 * Note: Backend enforces max 5 addresses per user (see address service)
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
    }).strict().refine(data => Object.values(data).some(v => typeof v === 'number' && v > 0), {
        message: 'At least one coin type must have a positive value',
    }).optional(),
    idempotencyKey: zod_1.z.string().uuid('Invalid idempotency key format'),
    fulfillmentDetails: zod_1.z.object({
        tableNumber: zod_1.z.string().optional(),
        storeAddress: zod_1.z.string().optional(),
        estimatedReadyTime: zod_1.z.string().datetime().optional().transform(v => v ? new Date(v) : undefined),
        pickupInstructions: zod_1.z.string().optional(),
    }).optional(),
});
/**
 * Order status update schema
 */
exports.updateOrderStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(orderStatuses_1.ORDER_STATUSES),
    note: zod_1.z.string().max(500).optional(),
});
/**
 * Offer creation schema (base)
 * Field names match the rez-backend Offer model canonical shape:
 *   type, cashbackPercentage, restrictions.minOrderValue,
 *   restrictions.usageLimit, restrictions.usageLimitPerUser
 */
const createOfferSchemaBase = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').max(200),
    description: zod_1.z.string().max(1000).optional(),
    type: zod_1.z.enum(['discount', 'cashback', 'voucher', 'combo', 'special', 'walk_in']), // B03 fix: was offerType
    validity: zod_1.z.object({
        startDate: zod_1.z.date(),
        endDate: zod_1.z.date(),
    }),
    // B05 fix: restrictions.minOrderValue (was flat minOrderAmount)
    // B06 fix: restrictions.usageLimit / restrictions.usageLimitPerUser (were flat maxRedemptions/*)
    restrictions: zod_1.z.object({
        minOrderValue: zod_1.z.number().nonnegative().optional(),
        usageLimit: zod_1.z.number().positive().optional(),
        usageLimitPerUser: zod_1.z.number().positive().optional(),
    }).optional(),
    isActive: zod_1.z.boolean().default(true),
    applicableCategories: zod_1.z.array(zod_1.z.string().max(24)).optional(),
    applicableProducts: zod_1.z.array(zod_1.z.string().max(24)).optional(),
    userSegments: zod_1.z.array(zod_1.z.string()).optional(),
});
/**
 * Offer creation schema
 * Note: Backend validates non-overlapping offers per merchant (see merchant service)
 */
exports.createOfferSchema = createOfferSchemaBase.refine((data) => data.validity.startDate < data.validity.endDate, {
    message: 'startDate must be before endDate',
    path: ['validity.endDate'],
});
/**
 * Discount offer schema (specific)
 */
exports.createDiscountOfferSchema = createOfferSchemaBase.extend({
    discountType: zod_1.z.enum(['percentage', 'fixed']),
    discountValue: zod_1.z.number().positive('Discount value must be positive'),
    maxDiscountAmount: zod_1.z.number().nonnegative().optional(),
}).refine((data) => data.validity.startDate < data.validity.endDate, {
    message: 'startDate must be before endDate',
    path: ['validity.endDate'],
});
/**
 * Cashback offer schema (specific)
 */
exports.createCashbackOfferSchema = createOfferSchemaBase.extend({
    cashbackType: zod_1.z.enum(['coins', 'wallet']),
    cashbackPercentage: zod_1.z.number().positive('Cashback percentage must be positive'), // B04 fix: was cashbackValue
}).refine((data) => data.validity.startDate < data.validity.endDate, {
    message: 'startDate must be before endDate',
    path: ['validity.endDate'],
});
/**
 * Update offer schema — all fields optional (Zod equivalent of updateOfferSchema)
 */
exports.updateOfferSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    image: zod_1.z.string().url().optional(),
    category: zod_1.z.enum(['food', 'retail', 'travel', 'healthcare', 'entertainment', 'beauty', 'wellness', 'fitness', 'groceries', 'pharmacy', 'other']).optional(),
    cashbackPercentage: zod_1.z.number().min(0).max(100).optional(),
    validity: zod_1.z.object({
        startDate: zod_1.z.date(),
        endDate: zod_1.z.date(),
    }).optional(),
    restrictions: zod_1.z.object({
        minOrderValue: zod_1.z.number().min(0).optional(),
        usageLimit: zod_1.z.number().int().min(1).optional(),
        usageLimitPerUser: zod_1.z.number().int().min(1).optional(),
        applicableOn: zod_1.z.array(zod_1.z.string()).optional(),
        excludedProducts: zod_1.z.array(zod_1.z.string()).optional(),
        ageRestriction: zod_1.z.object({
            minAge: zod_1.z.number().int().min(0).optional(),
            maxAge: zod_1.z.number().int().min(0).optional(),
        }).optional(),
    }).optional(),
    isActive: zod_1.z.boolean().optional(),
});
/**
 * Create product schema (Zod equivalent of createProductSchema)
 */
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    description: zod_1.z.string().optional(),
    pricing: zod_1.z.object({
        original: zod_1.z.number().min(0).optional(),
        selling: zod_1.z.number().min(0),
        discount: zod_1.z.number().min(0).optional(),
    }),
    inventory: zod_1.z.object({
        stock: zod_1.z.number().int().min(0).optional(),
        inStock: zod_1.z.boolean().optional(),
    }).optional(),
    category: zod_1.z.string().optional(),
    images: zod_1.z.array(zod_1.z.string()).optional(),
    cashback: exports.productCashbackSchema.optional(),
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
 * Note: Case-insensitive validation is done at the backend (see coupon service)
 * Do NOT transform to uppercase to preserve original code format
 */
exports.couponCodeSchema = zod_1.z.object({
    code: zod_1.z.string().min(1, 'Code is required').max(20),
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
 * Validate URL parameters
 * Prevents injection attacks via URL parameters (e.g., /orders/:id where id is a MongoDB ObjectId)
 */
function validateParams(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.params);
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
                    message: 'URL parameter validation failed',
                    statusCode: 400,
                    details: errors,
                },
            });
        }
        req.validatedParams = result.data;
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
