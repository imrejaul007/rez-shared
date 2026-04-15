"use strict";
/**
 * Legacy status compatibility mapper — Phase 7 shared contracts
 *
 * Copied from rezbackend/src/utils/statusCompat.ts so that clients can
 * normalize legacy status values without a round-trip to the server.
 *
 * Add mappings here as legacy values are discovered in client storage,
 * push notifications, or cached API responses. Never remove a mapping
 * until you are certain no stored data or client can produce the old value.
 *
 * Source of truth: rezbackend/src/utils/statusCompat.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeOrderStatus = normalizeOrderStatus;
exports.normalizePaymentStatus = normalizePaymentStatus;
// ── Order status normalizer ────────────────────────────────────────────────────
const ORDER_STATUS_MAP = {
    in_transit: 'out_for_delivery', // old name → canonical
    refund_initiated: 'partially_refunded',
    shipping: 'dispatched',
    packed: 'preparing',
    accepted: 'confirmed',
};
// ── Payment status normalizer ──────────────────────────────────────────────────
const PAYMENT_STATUS_MAP = {
    success: 'paid',
    captured: 'paid',
    pending_capture: 'authorized',
    completed: 'paid',
    initiated: 'awaiting_payment',
};
/**
 * Normalize a legacy order status string to its canonical Phase 3 equivalent.
 * Returns the input unchanged if it is already canonical.
 *
 * @example
 *   normalizeOrderStatus('in_transit')  // → 'out_for_delivery'
 *   normalizeOrderStatus('confirmed')   // → 'confirmed'
 */
function normalizeOrderStatus(status) {
    return ORDER_STATUS_MAP[status] ?? status;
}
/**
 * Normalize a legacy payment status string to its canonical Phase 3 equivalent.
 * Returns the input unchanged if it is already canonical.
 *
 * @example
 *   normalizePaymentStatus('success')  // → 'paid'
 *   normalizePaymentStatus('paid')     // → 'paid'
 */
function normalizePaymentStatus(status) {
    return PAYMENT_STATUS_MAP[status] ?? status;
}
exports.default = { normalizeOrderStatus, normalizePaymentStatus };
