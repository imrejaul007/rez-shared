"use strict";
/**
 * Canonical User types for the REZ platform.
 *
 * Source of truth: rezbackend/src/models/User.ts
 * Do NOT redefine these types in frontend apps — import from @rez/shared instead.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_ROLES = void 0;
exports.isUserRole = isUserRole;
exports.USER_ROLES = [
    'user',
    'admin',
    'merchant',
    'support',
    'operator',
    'super_admin',
];
// ── Type guards ───────────────────────────────────────────────────────────────
function isUserRole(value) {
    return exports.USER_ROLES.includes(value);
}
//# sourceMappingURL=user.types.js.map