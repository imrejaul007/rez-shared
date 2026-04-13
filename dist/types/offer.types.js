"use strict";
/**
 * Canonical Offer types for the REZ platform.
 *
 * Source of truth: rezbackend/src/models/Offer.ts
 * Do NOT redefine these types in frontend apps — import from @rez/shared instead.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OFFER_CATEGORIES = void 0;
exports.isOfferCategory = isOfferCategory;
// ── Offer Category ────────────────────────────────────────────────────────────
exports.OFFER_CATEGORIES = [
    'mega',
    'student',
    'new_arrival',
    'trending',
    'food',
    'fashion',
    'electronics',
    'general',
    'entertainment',
    'beauty',
    'wellness',
];
// ── Type guards ───────────────────────────────────────────────────────────────
function isOfferCategory(value) {
    return exports.OFFER_CATEGORIES.includes(value);
}
//# sourceMappingURL=offer.types.js.map