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
exports.normalizeBookingType = normalizeBookingType;
exports.isTableBooking = isTableBooking;
exports.isServiceBooking = isServiceBooking;
exports.isEventBooking = isEventBooking;
exports.isOtaBooking = isOtaBooking;
exports.isTrialBooking = isTrialBooking;
/** Backend sends suffixed values ('table_booking', etc.). Normalize to canonical short form. */
function normalizeBookingType(raw) {
    const map = {
        table_booking: 'table',
        service_booking: 'service',
        event_booking: 'event',
        ota_booking: 'ota',
        trial_booking: 'trial',
        // short forms pass through
        table: 'table',
        service: 'service',
        event: 'event',
        ota: 'ota',
        trial: 'trial',
    };
    return map[raw] ?? 'service';
}
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
