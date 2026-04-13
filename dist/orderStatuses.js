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
exports.ORDER_STATUSES = [
    'placed',
    'confirmed',
    'preparing',
    'ready',
    'dispatched',
    'out_for_delivery',
    'delivered',
    'cancelled',
    'cancelling',
    'returned',
    'refunded',
];
// Terminal statuses — no further forward progress
exports.TERMINAL_ORDER_STATUSES = ['cancelled', 'returned', 'refunded'];
// Active statuses — order is in progress
exports.ACTIVE_ORDER_STATUSES = [
    'placed',
    'confirmed',
    'preparing',
    'ready',
    'dispatched',
    'out_for_delivery',
    'cancelling',
];
// Past statuses — order is complete in some way
exports.PAST_ORDER_STATUSES = ['delivered', 'cancelled', 'returned', 'refunded'];
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
    if (status === 'cancelled' || status === 'refunded' || status === 'returned')
        return 0;
    const index = exports.STATUS_ORDER.indexOf(status);
    if (index < 0)
        return 0;
    const maxIndex = exports.STATUS_ORDER.length - 1; // 6 (delivered)
    return Math.round((index / maxIndex) * 100);
}
