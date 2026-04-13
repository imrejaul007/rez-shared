"use strict";
/**
 * Canonical Booking types for the REZ platform.
 *
 * Source of truth (backend models):
 *   rezbackend/src/models/TableBooking.ts
 *   rezbackend/src/models/ServiceBooking.ts
 *   rezbackend/src/models/EventBooking.ts
 *   rezbackend/src/models/OtaBooking.ts
 *   rezbackend/src/models/TrialBooking.ts
 *
 * Uses a discriminated union (AnyBooking) so consumers can type-narrow
 * with a simple switch on `bookingType`.
 *
 * Do NOT redefine these types in frontend apps — import from @rez/shared instead.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTableBooking = isTableBooking;
exports.isServiceBooking = isServiceBooking;
exports.isEventBooking = isEventBooking;
exports.isOtaBooking = isOtaBooking;
exports.isTrialBooking = isTrialBooking;
// ── Type guards ───────────────────────────────────────────────────────────────
function isTableBooking(booking) {
    return booking.bookingType === 'table';
}
function isServiceBooking(booking) {
    return booking.bookingType === 'service';
}
function isEventBooking(booking) {
    return booking.bookingType === 'event';
}
function isOtaBooking(booking) {
    return booking.bookingType === 'ota';
}
function isTrialBooking(booking) {
    return booking.bookingType === 'trial';
}
//# sourceMappingURL=booking.types.js.map