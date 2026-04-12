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

// ── Discriminant ──────────────────────────────────────────────────────────────

export type BookingType = 'table' | 'service' | 'event' | 'ota' | 'trial';

// ── Shared Booking Status ─────────────────────────────────────────────────────

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'refunded'
  | 'expired';

// ── Base Booking ──────────────────────────────────────────────────────────────

export interface BaseBooking {
  _id: string;
  bookingNumber: string;
  status: BookingStatus;
  bookingType: BookingType;
  userId: string;
  storeId?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Table Booking ─────────────────────────────────────────────────────────────

export interface TableBooking extends BaseBooking {
  bookingType: 'table';
  partySize: number;
  /** ISO date string — the date of the reservation */
  appointmentDate: string;
  /** HH:MM (24-hour format) */
  appointmentTime: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  specialRequests?: string;
  cancellationReason?: string;
}

// ── Service Booking ───────────────────────────────────────────────────────────

export interface ServiceBooking extends BaseBooking {
  bookingType: 'service';
  serviceId: string;
  /** ISO date string */
  bookingDate: string;
  timeSlot: {
    start: string;  // "09:00"
    end: string;    // "10:00"
  };
  duration: number;          // minutes
  serviceType: 'home' | 'store' | 'online';
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerNotes?: string;
  pricing?: {
    basePrice: number;
    total: number;
    currency: string;
    cashbackEarned?: number;
  };
  paymentStatus?: 'pending' | 'paid' | 'partial' | 'refunded' | 'failed';
  cancellationReason?: string;
  cancelledBy?: 'user' | 'merchant' | 'system';
}

// ── Event Booking ─────────────────────────────────────────────────────────────

export interface EventBooking extends BaseBooking {
  bookingType: 'event';
  eventId: string;
  slotId?: string;
  ticketTypeId?: string;
  quantity: number;
  /** ISO date string — when the booking was made */
  bookingDate: string;
  amount: number;
  currency: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  bookingReference: string;
  attendeeInfo: {
    name: string;
    email: string;
    phone?: string;
    age?: number;
    specialRequirements?: string;
  };
  qrCode?: string;
  checkInTime?: string;
  checkOutTime?: string;
}

// ── OTA Booking (Hotel) ───────────────────────────────────────────────────────

export interface OtaBooking extends BaseBooking {
  bookingType: 'ota';
  hotelId: string;
  /** ISO date string */
  checkIn: string;
  /** ISO date string */
  checkOut: string;
  /** Amount in paise (INR ×100) */
  amountPaise: number;
}

// ── Trial Booking ─────────────────────────────────────────────────────────────

export interface TrialBooking extends BaseBooking {
  bookingType: 'trial';
  trialId: string;
  merchantId: string;
  qrHash: string;
  qrExpiresAt: string;
  commitmentFeePaid: number;
  commitmentFeePaymentId: string;
  geoAtBooking: { lat: number; lng: number };
  geoAtScan?: { lat: number; lng: number };
  completedAt?: string;
  rewardCredited: boolean;
  rating?: number;
  reviewText?: string;
  reviewedAt?: string;
}

// ── Discriminated Union ───────────────────────────────────────────────────────

export type AnyBooking =
  | TableBooking
  | ServiceBooking
  | EventBooking
  | OtaBooking
  | TrialBooking;

// ── Type guards ───────────────────────────────────────────────────────────────

export function isTableBooking(booking: AnyBooking): booking is TableBooking {
  return booking.bookingType === 'table';
}

export function isServiceBooking(booking: AnyBooking): booking is ServiceBooking {
  return booking.bookingType === 'service';
}

export function isEventBooking(booking: AnyBooking): booking is EventBooking {
  return booking.bookingType === 'event';
}

export function isOtaBooking(booking: AnyBooking): booking is OtaBooking {
  return booking.bookingType === 'ota';
}

export function isTrialBooking(booking: AnyBooking): booking is TrialBooking {
  return booking.bookingType === 'trial';
}
