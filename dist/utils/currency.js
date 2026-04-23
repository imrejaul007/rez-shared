"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPaise = exports.toRupees = exports.toPaise = void 0;
exports.formatCurrency = formatCurrency;
exports.formatShortCurrency = formatShortCurrency;
/**
 * Format a number as Indian currency string.
 * e.g. 12500 → "₹12,500"
 */
function formatCurrency(amount) {
    return `₹${amount.toLocaleString('en-IN')}`;
}
/**
 * Format with suffix for large numbers.
 * e.g. 12500 → "₹12.5K", 1200000 → "₹12L"
 */
function formatShortCurrency(amount) {
    if (amount >= 10000000)
        return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000)
        return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000)
        return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
}
/** Convert rupees to paise. Always rounds to nearest integer. */
const toPaise = (rupees) => Math.round(rupees * 100);
exports.toPaise = toPaise;
/** Convert paise to rupees. Returns float (e.g. 2500 paise → 25.00 rupees). */
const toRupees = (paise) => paise / 100;
exports.toRupees = toRupees;
/**
 * Display a PaiseAmount as a formatted rupee string.
 * @example formatPaise(2500) → "₹25.00"
 */
const formatPaise = (paise) => formatCurrency((0, exports.toRupees)(paise));
exports.formatPaise = formatPaise;
