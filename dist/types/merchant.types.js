"use strict";
/**
 * Canonical Merchant and Store types for the REZ platform.
 *
 * Source of truth:
 *   rezbackend/src/models/Merchant.ts  (Merchant)
 *   rezbackend/src/models/Store.ts     (Store)
 *
 * Do NOT redefine these types in frontend apps — import from @rez/shared instead.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMerchantVerificationStatus = isMerchantVerificationStatus;
// ── Type guards ───────────────────────────────────────────────────────────────
function isMerchantVerificationStatus(value) {
    return ['pending', 'verified', 'rejected'].includes(value);
}
//# sourceMappingURL=merchant.types.js.map