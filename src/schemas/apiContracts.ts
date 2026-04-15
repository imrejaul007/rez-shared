/**
 * Canonical API Response Contracts
 *
 * These schemas define the canonical request/response shapes for all client-server communication.
 * All four codebases (consumer, merchant, admin, backend) must conform to these schemas.
 *
 * Generated from unified audit: Phase 3 API contract alignment (2026-04-15)
 * Bug IDs: CA-API-*, MA-API-*, AA-API-*
 */

import { z } from 'zod';

/**
 * Canonical API Response Wrapper
 * All endpoints must return responses conforming to this shape
 */
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
  meta: z.record(z.unknown()).optional(),
});

export type ApiResponse<T = unknown> = z.infer<typeof apiResponseSchema> & {
  data?: T;
};

/**
 * User Profile Contract
 * Used by: GET /user/auth/me, PATCH /user/auth/profile
 */
export const userProfileSchema = z.object({
  id: z.string(),
  _id: z.string().optional(), // MongoDB ObjectId — may be present on legacy responses
  phoneNumber: z.string(),
  email: z.string().email().optional(),
  profile: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    avatar: z.string().optional(),
    bio: z.string().optional(),
    dateOfBirth: z.string().datetime().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    location: z.object({
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      pincode: z.string().optional(),
      coordinates: z.tuple([z.number(), z.number()]).optional(),
    }).optional(),
  }).optional(),
  preferences: z.object({
    language: z.string().optional(),
    currency: z.string().optional(),
    theme: z.enum(['light', 'dark']).optional(),
    notifications: z.object({
      push: z.boolean().optional(),
      email: z.boolean().optional(),
      sms: z.boolean().optional(),
    }).optional(),
  }).optional(),
  statedIdentity: z.string().optional(),
  featureLevel: z.number().optional(),
  segment: z.string().optional(),
  verificationSegment: z.string().optional(),
  verifications: z.record(z.unknown()).optional(),
  activeZones: z.array(z.string()).optional(),
  role: z.enum(['user', 'admin', 'merchant']),
  isVerified: z.boolean(),
  isOnboarded: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

/**
 * Profile Update Request
 * Used by: PATCH /user/auth/profile
 * Method: PATCH (not PUT) — servers must use PATCH only
 */
export const profileUpdateSchema = z.object({
  profile: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    avatar: z.string().optional(),
    bio: z.string().optional(),
    dateOfBirth: z.string().datetime().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    location: z.object({
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      pincode: z.string().optional(),
      coordinates: z.tuple([z.number(), z.number()]).optional(),
    }).optional(),
  }).optional(),
  preferences: z.object({
    language: z.string().optional(),
    currency: z.string().optional(),
    theme: z.enum(['light', 'dark']).optional(),
    notifications: z.object({
      push: z.boolean().optional(),
      email: z.boolean().optional(),
      sms: z.boolean().optional(),
    }).optional(),
  }).optional(),
  statedIdentity: z.string().optional(),
});

export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;

/**
 * Payment Method Type
 * Used across consumer, merchant payment endpoints
 */
export const paymentMethodSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['upi', 'card', 'wallet', 'netbanking']),
  gateway: z.string(), // 'razorpay' | 'paypal' | 'internal'
  icon: z.string().optional(),
  isAvailable: z.boolean(),
  processingFee: z.number().optional(),
  processingTime: z.string().optional(),
  description: z.string().optional(),
});

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

/**
 * Payment Request Contract
 * All payment endpoints must accept and validate this shape
 * Amount field must be validated on server (client-computed amounts are advisory)
 */
export const paymentRequestSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('INR'),
  paymentMethod: z.enum(['razorpay', 'paypal', 'internal', 'wallet']),
  paymentMethodType: z.enum(['card', 'upi', 'wallet', 'netbanking', 'rezcoins']),
  purpose: z.enum([
    'wallet_topup',
    'order_payment',
    'event_booking',
    'financial_service',
    'other'
  ]).optional(),
  idempotencyKey: z.string().uuid('Invalid idempotency key'),
  metadata: z.record(z.unknown()).optional(),
});

export type PaymentRequest = z.infer<typeof paymentRequestSchema>;

/**
 * Gateway Response Contract
 * Returned by payment gateways (Razorpay, PayPal, etc.)
 * Clients must not assume additional fields
 */
export const gatewayResponseSchema = z.object({
  code: z.string().optional(),
  message: z.string().optional(),
  transactionId: z.string().optional(),
  authCode: z.string().optional(),
  rrn: z.string().optional(),
});

export type GatewayResponse = z.infer<typeof gatewayResponseSchema>;

/**
 * Payment Response Contract
 * Returned by: POST /wallet/payment, POST /order/payment, etc.
 */
export const paymentResponseSchema = z.object({
  paymentId: z.string(),
  orderId: z.string().optional(),
  amount: z.number(),
  currency: z.string(),
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled']),
  gateway: z.string(),
  paymentUrl: z.string().optional(),
  qrCode: z.string().optional(),
  upiId: z.string().optional(),
  expiryTime: z.string().optional(),
  transactionId: z.string().optional(),
  gatewayResponse: gatewayResponseSchema.optional(),
});

export type PaymentResponse = z.infer<typeof paymentResponseSchema>;

/**
 * Error Response Contract
 * All error responses must use this shape
 */
export const errorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.string().optional(),
  errorCode: z.string().optional(),
  details: z.record(z.unknown()).optional(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;

/**
 * Pagination Metadata
 * Used in list responses
 */
export const paginationSchema = z.object({
  page: z.number().positive(),
  limit: z.number().positive().max(100, 'Limit must not exceed 100'),
  total: z.number().nonnegative(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

export type Pagination = z.infer<typeof paginationSchema>;

/**
 * Generic Paginated Response
 * Used for list endpoints across all services
 */
export const paginatedResponseSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    success: z.literal(true),
    data: z.array(schema),
    pagination: paginationSchema,
  });

/**
 * Admin Auth Response Contract
 * Returned by: POST /admin/auth/login
 */
export const adminAuthResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    token: z.string(),
    refreshToken: z.string().optional(),
    user: z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      role: z.enum(['admin', 'superadmin', 'support']),
      permissions: z.array(z.string()).optional(),
    }),
  }),
});

export type AdminAuthResponse = z.infer<typeof adminAuthResponseSchema>;

/**
 * Idempotency Key Contract
 * Required on all mutating endpoints (POST, PATCH, DELETE on money/order/wallet endpoints)
 * Backend stores key for 24h minimum; returns same response on retry
 */
export const idempotencyKeyHeaderSchema = z.object({
  'Idempotency-Key': z.string().uuid('Invalid idempotency key UUID format'),
});

/**
 * Validation helper: Ensure API response conforms to contract
 */
export function validateApiResponse<T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; error?: string } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error.message };
}
