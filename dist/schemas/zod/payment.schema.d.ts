/**
 * Payment API validation schemas
 * Validates CreatePayment, PaymentResponse requests/responses
 * Includes full 11-state FSM for payment statuses
 */
import { z } from 'zod';
export declare const PAYMENT_STATUS: z.ZodEnum<["pending", "processing", "completed", "failed", "cancelled", "expired", "refund_initiated", "refund_processing", "refunded", "refund_failed", "partially_refunded"]>;
export declare const PAYMENT_METHOD: z.ZodEnum<["upi", "card", "wallet", "netbanking"]>;
export declare const PAYMENT_GATEWAY: z.ZodEnum<["stripe", "razorpay", "paypal"]>;
export declare const PAYMENT_PURPOSE: z.ZodEnum<["wallet_topup", "order_payment", "event_booking", "financial_service", "other"]>;
export declare const PaymentUserDetailsSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string;
    email?: string;
    phone?: string;
}, {
    name?: string;
    email?: string;
    phone?: string;
}>;
export declare const PaymentGatewayResponseSchema: z.ZodObject<{
    gateway: z.ZodString;
    transactionId: z.ZodOptional<z.ZodString>;
    paymentUrl: z.ZodOptional<z.ZodString>;
    qrCode: z.ZodOptional<z.ZodString>;
    upiId: z.ZodOptional<z.ZodString>;
    expiryTime: z.ZodOptional<z.ZodDate>;
    timestamp: z.ZodDate;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    gateway: z.ZodString;
    transactionId: z.ZodOptional<z.ZodString>;
    paymentUrl: z.ZodOptional<z.ZodString>;
    qrCode: z.ZodOptional<z.ZodString>;
    upiId: z.ZodOptional<z.ZodString>;
    expiryTime: z.ZodOptional<z.ZodDate>;
    timestamp: z.ZodDate;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    gateway: z.ZodString;
    transactionId: z.ZodOptional<z.ZodString>;
    paymentUrl: z.ZodOptional<z.ZodString>;
    qrCode: z.ZodOptional<z.ZodString>;
    upiId: z.ZodOptional<z.ZodString>;
    expiryTime: z.ZodOptional<z.ZodDate>;
    timestamp: z.ZodDate;
}, z.ZodTypeAny, "passthrough">>;
export declare const CreatePaymentSchema: z.ZodObject<{
    paymentId: z.ZodString;
    orderId: z.ZodString;
    user: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodDefault<z.ZodString>;
    /** How the customer pays: upi, card, wallet, netbanking */
    paymentMethod: z.ZodEnum<["upi", "card", "wallet", "netbanking"]>;
    /** Which gateway processes the payment: razorpay, stripe, paypal */
    gateway: z.ZodEnum<["stripe", "razorpay", "paypal"]>;
    purpose: z.ZodDefault<z.ZodOptional<z.ZodEnum<["wallet_topup", "order_payment", "event_booking", "financial_service", "other"]>>>;
    userDetails: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name?: string;
        email?: string;
        phone?: string;
    }, {
        name?: string;
        email?: string;
        phone?: string;
    }>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    gatewayResponse: z.ZodOptional<z.ZodObject<{
        gateway: z.ZodString;
        transactionId: z.ZodOptional<z.ZodString>;
        paymentUrl: z.ZodOptional<z.ZodString>;
        qrCode: z.ZodOptional<z.ZodString>;
        upiId: z.ZodOptional<z.ZodString>;
        expiryTime: z.ZodOptional<z.ZodDate>;
        timestamp: z.ZodDate;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        gateway: z.ZodString;
        transactionId: z.ZodOptional<z.ZodString>;
        paymentUrl: z.ZodOptional<z.ZodString>;
        qrCode: z.ZodOptional<z.ZodString>;
        upiId: z.ZodOptional<z.ZodString>;
        expiryTime: z.ZodOptional<z.ZodDate>;
        timestamp: z.ZodDate;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        gateway: z.ZodString;
        transactionId: z.ZodOptional<z.ZodString>;
        paymentUrl: z.ZodOptional<z.ZodString>;
        qrCode: z.ZodOptional<z.ZodString>;
        upiId: z.ZodOptional<z.ZodString>;
        expiryTime: z.ZodOptional<z.ZodDate>;
        timestamp: z.ZodDate;
    }, z.ZodTypeAny, "passthrough">>>;
}, "strip", z.ZodTypeAny, {
    user?: string;
    currency?: string;
    amount?: number;
    metadata?: Record<string, any>;
    gateway?: "razorpay" | "stripe" | "paypal";
    paymentId?: string;
    orderId?: string;
    paymentMethod?: "wallet" | "card" | "upi" | "netbanking";
    purpose?: "wallet_topup" | "order_payment" | "event_booking" | "financial_service" | "other";
    userDetails?: {
        name?: string;
        email?: string;
        phone?: string;
    };
    gatewayResponse?: {
        gateway?: string;
        transactionId?: string;
        paymentUrl?: string;
        qrCode?: string;
        upiId?: string;
        expiryTime?: Date;
        timestamp?: Date;
    } & {
        [k: string]: unknown;
    };
}, {
    user?: string;
    currency?: string;
    amount?: number;
    metadata?: Record<string, any>;
    gateway?: "razorpay" | "stripe" | "paypal";
    paymentId?: string;
    orderId?: string;
    paymentMethod?: "wallet" | "card" | "upi" | "netbanking";
    purpose?: "wallet_topup" | "order_payment" | "event_booking" | "financial_service" | "other";
    userDetails?: {
        name?: string;
        email?: string;
        phone?: string;
    };
    gatewayResponse?: {
        gateway?: string;
        transactionId?: string;
        paymentUrl?: string;
        qrCode?: string;
        upiId?: string;
        expiryTime?: Date;
        timestamp?: Date;
    } & {
        [k: string]: unknown;
    };
}>;
export declare const UpdatePaymentStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["pending", "processing", "completed", "failed", "cancelled", "expired", "refund_initiated", "refund_processing", "refunded", "refund_failed", "partially_refunded"]>;
    failureReason: z.ZodOptional<z.ZodString>;
    walletCredited: z.ZodOptional<z.ZodBoolean>;
    refundedAmount: z.ZodOptional<z.ZodNumber>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    status?: "cancelled" | "refunded" | "pending" | "processing" | "completed" | "failed" | "expired" | "refund_initiated" | "refund_processing" | "refund_failed" | "partially_refunded";
    metadata?: Record<string, any>;
    failureReason?: string;
    walletCredited?: boolean;
    refundedAmount?: number;
}, {
    status?: "cancelled" | "refunded" | "pending" | "processing" | "completed" | "failed" | "expired" | "refund_initiated" | "refund_processing" | "refund_failed" | "partially_refunded";
    metadata?: Record<string, any>;
    failureReason?: string;
    walletCredited?: boolean;
    refundedAmount?: number;
}>;
export declare const PaymentResponseSchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodString>;
    paymentId: z.ZodString;
    orderId: z.ZodString;
    user: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodString;
    /** How the customer pays: upi, card, wallet, netbanking */
    paymentMethod: z.ZodEnum<["upi", "card", "wallet", "netbanking"]>;
    /** Which gateway processes the payment: razorpay, stripe, paypal */
    gateway: z.ZodOptional<z.ZodEnum<["stripe", "razorpay", "paypal"]>>;
    purpose: z.ZodEnum<["wallet_topup", "order_payment", "event_booking", "financial_service", "other"]>;
    status: z.ZodEnum<["pending", "processing", "completed", "failed", "cancelled", "expired", "refund_initiated", "refund_processing", "refunded", "refund_failed", "partially_refunded"]>;
    userDetails: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name?: string;
        email?: string;
        phone?: string;
    }, {
        name?: string;
        email?: string;
        phone?: string;
    }>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    gatewayResponse: z.ZodOptional<z.ZodObject<{
        gateway: z.ZodString;
        transactionId: z.ZodOptional<z.ZodString>;
        paymentUrl: z.ZodOptional<z.ZodString>;
        qrCode: z.ZodOptional<z.ZodString>;
        upiId: z.ZodOptional<z.ZodString>;
        expiryTime: z.ZodOptional<z.ZodDate>;
        timestamp: z.ZodDate;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        gateway: z.ZodString;
        transactionId: z.ZodOptional<z.ZodString>;
        paymentUrl: z.ZodOptional<z.ZodString>;
        qrCode: z.ZodOptional<z.ZodString>;
        upiId: z.ZodOptional<z.ZodString>;
        expiryTime: z.ZodOptional<z.ZodDate>;
        timestamp: z.ZodDate;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        gateway: z.ZodString;
        transactionId: z.ZodOptional<z.ZodString>;
        paymentUrl: z.ZodOptional<z.ZodString>;
        qrCode: z.ZodOptional<z.ZodString>;
        upiId: z.ZodOptional<z.ZodString>;
        expiryTime: z.ZodOptional<z.ZodDate>;
        timestamp: z.ZodDate;
    }, z.ZodTypeAny, "passthrough">>>;
    failureReason: z.ZodOptional<z.ZodString>;
    walletCredited: z.ZodOptional<z.ZodBoolean>;
    walletCreditedAt: z.ZodOptional<z.ZodDate>;
    completedAt: z.ZodOptional<z.ZodDate>;
    failedAt: z.ZodOptional<z.ZodDate>;
    expiresAt: z.ZodOptional<z.ZodDate>;
    refundedAmount: z.ZodOptional<z.ZodNumber>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    user?: string;
    status?: "cancelled" | "refunded" | "pending" | "processing" | "completed" | "failed" | "expired" | "refund_initiated" | "refund_processing" | "refund_failed" | "partially_refunded";
    currency?: string;
    _id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    amount?: number;
    metadata?: Record<string, any>;
    gateway?: "razorpay" | "stripe" | "paypal";
    paymentId?: string;
    orderId?: string;
    paymentMethod?: "wallet" | "card" | "upi" | "netbanking";
    purpose?: "wallet_topup" | "order_payment" | "event_booking" | "financial_service" | "other";
    userDetails?: {
        name?: string;
        email?: string;
        phone?: string;
    };
    gatewayResponse?: {
        gateway?: string;
        transactionId?: string;
        paymentUrl?: string;
        qrCode?: string;
        upiId?: string;
        expiryTime?: Date;
        timestamp?: Date;
    } & {
        [k: string]: unknown;
    };
    failureReason?: string;
    walletCredited?: boolean;
    refundedAmount?: number;
    walletCreditedAt?: Date;
    completedAt?: Date;
    failedAt?: Date;
    expiresAt?: Date;
}, {
    user?: string;
    status?: "cancelled" | "refunded" | "pending" | "processing" | "completed" | "failed" | "expired" | "refund_initiated" | "refund_processing" | "refund_failed" | "partially_refunded";
    currency?: string;
    _id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    amount?: number;
    metadata?: Record<string, any>;
    gateway?: "razorpay" | "stripe" | "paypal";
    paymentId?: string;
    orderId?: string;
    paymentMethod?: "wallet" | "card" | "upi" | "netbanking";
    purpose?: "wallet_topup" | "order_payment" | "event_booking" | "financial_service" | "other";
    userDetails?: {
        name?: string;
        email?: string;
        phone?: string;
    };
    gatewayResponse?: {
        gateway?: string;
        transactionId?: string;
        paymentUrl?: string;
        qrCode?: string;
        upiId?: string;
        expiryTime?: Date;
        timestamp?: Date;
    } & {
        [k: string]: unknown;
    };
    failureReason?: string;
    walletCredited?: boolean;
    refundedAmount?: number;
    walletCreditedAt?: Date;
    completedAt?: Date;
    failedAt?: Date;
    expiresAt?: Date;
}>;
export declare const PaymentListResponseSchema: z.ZodArray<z.ZodObject<{
    _id: z.ZodOptional<z.ZodString>;
    paymentId: z.ZodString;
    orderId: z.ZodString;
    user: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodString;
    /** How the customer pays: upi, card, wallet, netbanking */
    paymentMethod: z.ZodEnum<["upi", "card", "wallet", "netbanking"]>;
    /** Which gateway processes the payment: razorpay, stripe, paypal */
    gateway: z.ZodOptional<z.ZodEnum<["stripe", "razorpay", "paypal"]>>;
    purpose: z.ZodEnum<["wallet_topup", "order_payment", "event_booking", "financial_service", "other"]>;
    status: z.ZodEnum<["pending", "processing", "completed", "failed", "cancelled", "expired", "refund_initiated", "refund_processing", "refunded", "refund_failed", "partially_refunded"]>;
    userDetails: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name?: string;
        email?: string;
        phone?: string;
    }, {
        name?: string;
        email?: string;
        phone?: string;
    }>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    gatewayResponse: z.ZodOptional<z.ZodObject<{
        gateway: z.ZodString;
        transactionId: z.ZodOptional<z.ZodString>;
        paymentUrl: z.ZodOptional<z.ZodString>;
        qrCode: z.ZodOptional<z.ZodString>;
        upiId: z.ZodOptional<z.ZodString>;
        expiryTime: z.ZodOptional<z.ZodDate>;
        timestamp: z.ZodDate;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        gateway: z.ZodString;
        transactionId: z.ZodOptional<z.ZodString>;
        paymentUrl: z.ZodOptional<z.ZodString>;
        qrCode: z.ZodOptional<z.ZodString>;
        upiId: z.ZodOptional<z.ZodString>;
        expiryTime: z.ZodOptional<z.ZodDate>;
        timestamp: z.ZodDate;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        gateway: z.ZodString;
        transactionId: z.ZodOptional<z.ZodString>;
        paymentUrl: z.ZodOptional<z.ZodString>;
        qrCode: z.ZodOptional<z.ZodString>;
        upiId: z.ZodOptional<z.ZodString>;
        expiryTime: z.ZodOptional<z.ZodDate>;
        timestamp: z.ZodDate;
    }, z.ZodTypeAny, "passthrough">>>;
    failureReason: z.ZodOptional<z.ZodString>;
    walletCredited: z.ZodOptional<z.ZodBoolean>;
    walletCreditedAt: z.ZodOptional<z.ZodDate>;
    completedAt: z.ZodOptional<z.ZodDate>;
    failedAt: z.ZodOptional<z.ZodDate>;
    expiresAt: z.ZodOptional<z.ZodDate>;
    refundedAmount: z.ZodOptional<z.ZodNumber>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    user?: string;
    status?: "cancelled" | "refunded" | "pending" | "processing" | "completed" | "failed" | "expired" | "refund_initiated" | "refund_processing" | "refund_failed" | "partially_refunded";
    currency?: string;
    _id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    amount?: number;
    metadata?: Record<string, any>;
    gateway?: "razorpay" | "stripe" | "paypal";
    paymentId?: string;
    orderId?: string;
    paymentMethod?: "wallet" | "card" | "upi" | "netbanking";
    purpose?: "wallet_topup" | "order_payment" | "event_booking" | "financial_service" | "other";
    userDetails?: {
        name?: string;
        email?: string;
        phone?: string;
    };
    gatewayResponse?: {
        gateway?: string;
        transactionId?: string;
        paymentUrl?: string;
        qrCode?: string;
        upiId?: string;
        expiryTime?: Date;
        timestamp?: Date;
    } & {
        [k: string]: unknown;
    };
    failureReason?: string;
    walletCredited?: boolean;
    refundedAmount?: number;
    walletCreditedAt?: Date;
    completedAt?: Date;
    failedAt?: Date;
    expiresAt?: Date;
}, {
    user?: string;
    status?: "cancelled" | "refunded" | "pending" | "processing" | "completed" | "failed" | "expired" | "refund_initiated" | "refund_processing" | "refund_failed" | "partially_refunded";
    currency?: string;
    _id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    amount?: number;
    metadata?: Record<string, any>;
    gateway?: "razorpay" | "stripe" | "paypal";
    paymentId?: string;
    orderId?: string;
    paymentMethod?: "wallet" | "card" | "upi" | "netbanking";
    purpose?: "wallet_topup" | "order_payment" | "event_booking" | "financial_service" | "other";
    userDetails?: {
        name?: string;
        email?: string;
        phone?: string;
    };
    gatewayResponse?: {
        gateway?: string;
        transactionId?: string;
        paymentUrl?: string;
        qrCode?: string;
        upiId?: string;
        expiryTime?: Date;
        timestamp?: Date;
    } & {
        [k: string]: unknown;
    };
    failureReason?: string;
    walletCredited?: boolean;
    refundedAmount?: number;
    walletCreditedAt?: Date;
    completedAt?: Date;
    failedAt?: Date;
    expiresAt?: Date;
}>, "many">;
export type CreatePaymentRequest = z.infer<typeof CreatePaymentSchema>;
export type UpdatePaymentStatusRequest = z.infer<typeof UpdatePaymentStatusSchema>;
export type PaymentResponse = z.infer<typeof PaymentResponseSchema>;
export type PaymentListResponse = z.infer<typeof PaymentListResponseSchema>;
export type PaymentStatus = z.infer<typeof PAYMENT_STATUS>;
export type PaymentMethod = z.infer<typeof PAYMENT_METHOD>;
export type PaymentGateway = z.infer<typeof PAYMENT_GATEWAY>;
export type PaymentPurpose = z.infer<typeof PAYMENT_PURPOSE>;
