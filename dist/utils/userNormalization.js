"use strict";
/**
 * User Response Normalization Utility
 *
 * AC2-H1 fix: The backend exposes THREE different user-response shapes across three endpoints:
 *   1. GET /api/user/profile  → flat: { id, name, email, phone, profilePicture, isVerified }
 *   2. GET /api/user/auth/me  → nested: { id, phoneNumber, email, profile, preferences, wallet, role, ... }
 *   3. GET /api/user/boot     → grouped: { profile: {...firstName...}, wallet, cart: {itemCount}, notifications: {unreadCount} }
 *
 * This utility normalizes all three shapes to a single CanonicalUserProfile so that
 * consumer code can work with a consistent interface regardless of which endpoint was called.
 *
 * Usage:
 *   import { normalizeUserResponse } from '@rez/shared';
 *   const user = normalizeUserResponse(rawApiResponse);
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeUserId = normalizeUserId;
exports.normalizeUserResponse = normalizeUserResponse;
// ── TF-12: normalizeUserId() — canonical id/_id resolver ───────────────────────
/**
 * Extract a stable string id from any entity that may have `id`, `_id`, or
 * other id-like fields. MongoDB documents use `_id` while API responses use
 * `id` — this utility normalises both to a single canonical string id.
 *
 * Usage:
 *   import { normalizeUserId } from '@rez/shared';
 *   const userId = normalizeUserId(user); // always returns string
 */
function normalizeUserId(entity) {
    if (!entity)
        return '';
    return entity.id ?? entity._id ?? '';
}
/**
 * Detect which shape a response matches and normalize it to CanonicalUserProfile.
 * Returns null if the input cannot be matched to any known shape.
 */
function normalizeUserResponse(raw) {
    if (!raw)
        return null;
    // Shape 1: flat with `name` field (GET /api/user/profile)
    if ('name' in raw && 'id' in raw && !('profile' in raw) && !('phoneNumber' in raw)) {
        const s = raw;
        return {
            id: s.id ?? '',
            name: s.name ?? '',
            email: s.email,
            phone: s.phone,
            avatar: s.profilePicture,
            isVerified: s.isVerified ?? false,
            isOnboarded: true,
            createdAt: s.createdAt,
            updatedAt: s.updatedAt,
        };
    }
    // Shape 2: has phoneNumber + nested profile (GET /api/user/auth/me)
    if ('phoneNumber' in raw || ('profile' in raw && !('wallet' in raw) && !('itemCount' in raw.cart))) {
        const s = raw;
        const prof = s.profile ?? {};
        return {
            id: s.id ?? s._id ?? '',
            name: [prof.firstName, prof.lastName].filter(Boolean).join(' ') || s.email || '',
            firstName: prof.firstName,
            lastName: prof.lastName,
            email: s.email,
            phone: s.phoneNumber,
            avatar: prof.avatar,
            isVerified: s.isVerified ?? false,
            isOnboarded: s.isOnboarded ?? false,
            role: s.role,
            createdAt: s.createdAt,
            updatedAt: s.updatedAt,
        };
    }
    // Shape 3: boot response with grouped profile/wallet/cart (GET /api/user/boot)
    if ('profile' in raw && ('wallet' in raw || 'cart' in raw || 'notifications' in raw)) {
        const s = raw;
        const prof = s.profile ?? {};
        const isVerified = prof.auth?.isVerified ?? prof.subscription?.tier != null;
        return {
            id: raw.id ?? raw.user ?? raw._id ?? '',
            name: [prof.firstName, prof.lastName].filter(Boolean).join(' ') || '',
            firstName: prof.firstName,
            lastName: prof.lastName,
            avatar: prof.avatar,
            isVerified: isVerified,
            isOnboarded: prof.isOnboarded ?? false,
            loyaltyTier: prof.subscription?.tier,
            walletBalance: s.wallet?.balance?.total,
            coinBalance: s.wallet?.coins?.find((c) => c.type === 'rez')?.amount,
            cartItemCount: s.cart?.itemCount,
            unreadNotificationCount: s.notifications?.unreadCount,
        };
    }
    // Fallback: try to extract id and name from any unknown shape
    const unknown = raw;
    const id = String(unknown.id ?? unknown._id ?? unknown.user ?? '');
    const name = String(unknown.name ??
        unknown.fullName ??
        [unknown.firstName, unknown.lastName].filter(Boolean).join(' ') ??
        '');
    return { id, name, isVerified: false, isOnboarded: false };
}
