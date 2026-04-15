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
exports.isValidUserRole = exports.isValidPaymentStatus = exports.isValidOrderStatus = exports.UserRoleValues = exports.PaymentStatusValues = exports.OrderStatusValues = exports.NotificationChannel = exports.TransactionType = exports.UserRole = exports.PaymentStatus = exports.OrderStatus = void 0;
// ── Canonical enums (Phase 0: Shared Artifacts) ────────────────────────────────
var index_1 = require("../enums/src/index");
Object.defineProperty(exports, "OrderStatus", { enumerable: true, get: function () { return index_1.OrderStatus; } });
Object.defineProperty(exports, "PaymentStatus", { enumerable: true, get: function () { return index_1.PaymentStatus; } });
Object.defineProperty(exports, "UserRole", { enumerable: true, get: function () { return index_1.UserRole; } });
Object.defineProperty(exports, "TransactionType", { enumerable: true, get: function () { return index_1.TransactionType; } });
Object.defineProperty(exports, "NotificationChannel", { enumerable: true, get: function () { return index_1.NotificationChannel; } });
Object.defineProperty(exports, "OrderStatusValues", { enumerable: true, get: function () { return index_1.OrderStatusValues; } });
Object.defineProperty(exports, "PaymentStatusValues", { enumerable: true, get: function () { return index_1.PaymentStatusValues; } });
Object.defineProperty(exports, "UserRoleValues", { enumerable: true, get: function () { return index_1.UserRoleValues; } });
Object.defineProperty(exports, "isValidOrderStatus", { enumerable: true, get: function () { return index_1.isValidOrderStatus; } });
Object.defineProperty(exports, "isValidPaymentStatus", { enumerable: true, get: function () { return index_1.isValidPaymentStatus; } });
Object.defineProperty(exports, "isValidUserRole", { enumerable: true, get: function () { return index_1.isValidUserRole; } });
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
