"use strict";
/**
 * Canonical Order Statuses — Phase 7 shared contracts
 *
 * Source of truth: rezbackend/src/config/orderStateMachine.ts
 * These values mirror the backend FSM exactly. If the backend FSM changes,
 * update this file in lockstep.
 *
 * See also: packages/rez-shared/src/statusCompat.ts for legacy value normalization.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAST_ORDER_STATUSES = exports.ACTIVE_ORDER_STATUSES = exports.TERMINAL_ORDER_STATUSES = exports.ORDER_STATUSES = exports.STATUS_ORDER = void 0;
exports.isOrderStatus = isOrderStatus;
exports.getOrderProgress = getOrderProgress;
// Ordered statuses for linear progress calculation (placed → delivered)
exports.STATUS_ORDER = [
    'placed',
    'confirmed',
    'preparing',
    'ready',
    'dispatched',
    'out_for_delivery',
    'delivered',
];
// All valid order statuses (including terminal branches)
// NOTE: 'failed_delivery', 'return_requested', 'return_rejected' added — present in backend FSM
exports.ORDER_STATUSES = [
    'placed',
    'confirmed',
    'preparing',
    'ready',
    'dispatched',
    'out_for_delivery',
    'failed_delivery',
    'delivered',
    'cancelling',
    'cancelled',
    'return_requested',
    'return_rejected',
    'returned',
    'refunded',
];
// Terminal statuses — no further forward progress (order complete/closed)
exports.TERMINAL_ORDER_STATUSES = ['cancelled', 'returned', 'refunded', 'return_rejected'];
// Active statuses — order is in progress (not yet delivered/cancelled/refunded)
exports.ACTIVE_ORDER_STATUSES = [
    'placed',
    'confirmed',
    'preparing',
    'ready',
    'dispatched',
    'out_for_delivery',
    'failed_delivery',
    'cancelling',
    'return_requested',
];
// Past statuses — order reached a notable endpoint (delivered, failed, or cancelled)
exports.PAST_ORDER_STATUSES = ['delivered', 'failed_delivery', 'return_rejected'];
/**
 * Type guard: check if a string is a valid OrderStatus.
 */
function isOrderStatus(value) {
    return exports.ORDER_STATUSES.includes(value);
}
/**
 * Calculate order progress as a percentage (0–100).
 * Mirrors backend getOrderProgress() — keep in sync.
 */
function getOrderProgress(status) {
    if (status === 'delivered')
        return 100;
    // Post-delivery states: return flow is 100% delivered progress (item was delivered)
    if (status === 'failed_delivery' || status === 'return_requested' || status === 'return_rejected')
        return 100;
    // Cancelled/refunded: no progress
    if (status === 'cancelled' || status === 'refunded' || status === 'returned')
        return 0;
    const index = exports.STATUS_ORDER.indexOf(status);
    if (index < 0)
        return 0;
    const maxIndex = exports.STATUS_ORDER.length - 1; // 6 (delivered)
    return Math.round((index / maxIndex) * 100);
}
