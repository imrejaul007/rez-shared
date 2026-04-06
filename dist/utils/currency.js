"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=currency.js.map