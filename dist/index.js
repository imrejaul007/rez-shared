"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRANSACTION_TYPES = void 0;
// ── Canonical enums (consolidated from packages/shared-enums) ───────────────────
// Re-export selectively to avoid duplicate exports with coins.ts:
// coins.ts defines the canonical LoyaltyTier, USER_ROLES, UserRole, normalizeLoyaltyTier
var enums_1 = require("./enums");
Object.defineProperty(exports, "TRANSACTION_TYPES", { enumerable: true, get: function () { return enums_1.TRANSACTION_TYPES; } });
// ── Phase 7: Order & Payment status contracts ──────────────────────────────────
__exportStar(require("./orderStatuses"), exports);
__exportStar(require("./paymentStatuses"), exports);
// PaginatedResponse re-exported from types/api.ts (canonical version)
__exportStar(require("./statusCompat"), exports);
// ── Canonical entity types (Phase 8+: single source of truth) ─────────────────
// Import entity types directly: import type { User, Order } from '@rez/shared'
__exportStar(require("./types/user.types"), exports);
__exportStar(require("./types/merchant.types"), exports);
__exportStar(require("./types/offer.types"), exports);
__exportStar(require("./types/order.types"), exports);
__exportStar(require("./types/wallet.types"), exports);
__exportStar(require("./types/booking.types"), exports);
__exportStar(require("./types/campaign.types"), exports);
// ── Pre-existing shared exports ────────────────────────────────────────────────
// Types
__exportStar(require("./types/wallet"), exports);
__exportStar(require("./types/api"), exports);
// Utils
__exportStar(require("./utils/currency"), exports);
__exportStar(require("./utils/validation"), exports);
__exportStar(require("./utils/date"), exports);
__exportStar(require("./utils/caseNormalization"), exports);
__exportStar(require("./utils/campaignFilter"), exports);
__exportStar(require("./utils/userNormalization"), exports);
// Constants
__exportStar(require("./constants/coins"), exports);
__exportStar(require("./constants/errors"), exports);
