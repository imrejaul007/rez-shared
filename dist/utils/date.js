"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = formatDate;
exports.getRelativeTime = getRelativeTime;
exports.getExpiryCountdown = getExpiryCountdown;
function formatDate(dateStr) {
    // DATE-TZ-001 FIX: Added explicit Asia/Kolkata timezone so dates don't shift
    // by ±N days depending on server timezone.
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        timeZone: 'Asia/Kolkata',
    });
}
function getRelativeTime(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1)
        return 'just now';
    if (mins < 60)
        return `${mins}m ago`;
    if (hours < 24)
        return `${hours}h ago`;
    if (days < 7)
        return `${days}d ago`;
    return formatDate(dateStr);
}
function getExpiryCountdown(expiryDate) {
    const diff = new Date(expiryDate).getTime() - Date.now();
    if (diff <= 0)
        return 'Expired';
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (hours < 24)
        return `${hours}h left`;
    return `${days}d left`;
}
