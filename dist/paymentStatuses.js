"use strict";
/**
 * Canonical Payment Statuses — Phase 7 shared contracts
 *
 * Source of truth: rezbackend/src/config/financialStateMachine.ts
 * These values mirror the backend FSM exactly. If the backend FSM changes,
 * update this file in lockstep.
 *
 * Two distinct status domains are tracked:
 *   1. PaymentStatus       — standalone Payment model lifecycle
 *   2. OrderPaymentStatus  — Order.payment.status sub-document lifecycle
 *
 * See also: packages/rez-shared/src/statusCompat.ts for legacy value normalization.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TERMINAL_ORDER_PAYMENT_STATUSES = exports.TERMINAL_PAYMENT_STATUSES = exports.ORDER_PAYMENT_STATUSES = exports.PAYMENT_STATUSES = void 0;
exports.isPaymentStatus = isPaymentStatus;
exports.isOrderPaymentStatus = isOrderPaymentStatus;
// ── Standalone Payment model lifecycle ────────────────────────────────────────
exports.PAYMENT_STATUSES = [
    'pending',
    'processing',
    'completed',
    'failed',
    'cancelled',
    'expired',
    'refund_initiated',
    'refund_processing',
    'refunded',
    'refund_failed',
];
// ── Order.payment.status sub-document lifecycle ────────────────────────────────
exports.ORDER_PAYMENT_STATUSES = [
    'pending',
    'awaiting_payment',
    'processing',
    'authorized',
    'paid',
    'partially_refunded',
    'failed',
    'refunded',
];
// Terminal payment statuses (standalone Payment model)
exports.TERMINAL_PAYMENT_STATUSES = ['completed', 'cancelled', 'expired', 'refunded'];
// Terminal order-payment statuses
exports.TERMINAL_ORDER_PAYMENT_STATUSES = ['failed', 'refunded'];
/**
 * Type guard: check if a string is a valid PaymentStatus.
 */
function isPaymentStatus(value) {
    return exports.PAYMENT_STATUSES.includes(value);
}
/**
 * Type guard: check if a string is a valid OrderPaymentStatus.
 */
function isOrderPaymentStatus(value) {
    return exports.ORDER_PAYMENT_STATUSES.includes(value);
}
