"use strict";
/**
 * Case Normalization Utilities
 *
 * FL-08 fix: Backend frequently sends SCREAMING_CASE enum values (e.g. 'NEW_USER',
 * 'CONFIRMED', 'LUCKY_DRAW') while consumer code expects snake_case/camelCase (e.g.
 * 'new_user', 'confirmed', 'lucky_draw').
 *
 * These utilities ensure consistent case handling at the API boundary so that
 * conditional checks never silently fail due to case mismatches.
 *
 * Usage:
 *   import { normalizeCase, camelToSnake, snakeToCamel, screamingToSnake } from '@rez/shared';
 *
 *   // Convert SCREAMING_CASE to snake_case
 *   normalizeCase('NEW_USER')        // → 'new_user'
 *   normalizeCase('LUCKY_DRAW')      // → 'lucky_draw'
 *
 *   // Convert camelCase to snake_case
 *   camelToSnake('newUser')          // → 'new_user'
 *   camelToSnake('campaignType')      // → 'campaign_type'
 *
 *   // Convert snake_case to camelCase
 *   snakeToCamel('new_user')          // → 'newUser'
 *   snakeToCamel('campaign_type')    // → 'campaignType'
 *
 *   // Normalize a field key in an object
 *   normalizeKeys(obj, screamingToSnake)  // → all keys converted
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.screamingToSnake = screamingToSnake;
exports.camelToSnake = camelToSnake;
exports.snakeToCamel = snakeToCamel;
exports.normalizeCase = normalizeCase;
exports.normalizeKeys = normalizeKeys;
exports.normalizeEnumValue = normalizeEnumValue;
exports.getOfferValue = getOfferValue;
/**
 * Convert a SCREAMING_CASE string to snake_case.
 * 'NEW_USER' → 'new_user'
 * 'LUCKY_DRAW' → 'lucky_draw'
 * 'CONFIRMED' → 'confirmed'
 * Already lowercase/snake strings pass through unchanged.
 */
function screamingToSnake(value) {
    if (!value)
        return value;
    // Already lowercase or snake_case — pass through
    if (value === value.toLowerCase())
        return value;
    return value
        .replace(/([A-Z])/g, '_$1')
        .replace(/^_/, '')
        .toLowerCase();
}
/**
 * Convert a camelCase string to snake_case.
 * 'newUser' → 'new_user'
 * 'campaignType' → 'campaign_type'
 */
function camelToSnake(value) {
    return value.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}
/**
 * Convert a snake_case string to camelCase.
 * 'new_user' → 'newUser'
 * 'campaign_type' → 'campaignType'
 */
function snakeToCamel(value) {
    return value.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}
/**
 * Universal normalizer: converts any common case variant to lowercase snake_case.
 * Handles SCREAMING_CASE, camelCase, and already-normalized snake_case.
 * 'NEW_USER' | 'newUser' | 'new_user' | 'NewUser' → 'new_user'
 */
function normalizeCase(value) {
    if (!value)
        return value;
    // If all uppercase (or with underscores only): treat as SCREAMING_CASE
    if (value === value.toUpperCase() && value.includes('_')) {
        return value.toLowerCase();
    }
    // If all uppercase without underscores: SCREAMING_CASE without separator
    if (value === value.toUpperCase() && !value.includes('_')) {
        return value.toLowerCase();
    }
    // If camelCase (mixed case with lowercase start): convert
    if (value !== value.toLowerCase() && value !== value.toUpperCase()) {
        return camelToSnake(value);
    }
    // Already lowercase or snake_case
    return value.toLowerCase();
}
/**
 * Apply a transformation function to every key in a plain object.
 * Useful for normalizing API response field names.
 *
 * @param obj - The object whose keys to transform
 * @param fn  - The transformation function (e.g. screamingToSnake, camelToSnake)
 * @returns A new object with transformed keys (does not mutate the original)
 */
function normalizeKeys(obj, fn) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        result[fn(key)] = value;
    }
    return result;
}
/**
 * Normalize an enum value from backend (any case) to canonical lowercase value.
 * Returns the original value if it's already a known valid value, otherwise
 * tries to normalize it.
 *
 * @param raw    - The raw value from backend
 * @param valid  - Array of valid canonical (lowercase snake_case) values
 */
function normalizeEnumValue(raw, valid) {
    if (!raw)
        return valid[0] ?? '';
    const normalized = normalizeCase(raw);
    return valid.includes(normalized) ? normalized : raw;
}
// ── Offer value field normalization (FL-16) ────────────────────────────────────
/**
 * FL-16 fix: Extract the canonical `value` from an offer object, handling
 * inconsistent field names used across the codebase:
 *   - `value`             → canonical (preferred)
 *   - `cashbackPercentage` → backend field name (alias for `value`)
 *   - `discountValue`     → consumer Deal.ts field
 *   - `cashbackAmount`    → consumer cash-store.types.ts field
 *   - `offerValue`        → various components
 *
 * All consumer code should use this function instead of accessing any of the
 * above fields directly.
 *
 * @param offer - A raw offer object from any source (backend API, mock data, etc.)
 * @returns The numeric offer value, or 0 if not found
 */
function getOfferValue(offer) {
    if (!offer)
        return 0;
    const value = offer.value ??
        offer.cashbackPercentage ??
        offer.discountValue ??
        offer.cashbackAmount ??
        offer.offerValue ??
        0;
    return typeof value === 'number' && !isNaN(value) ? value : 0;
}
