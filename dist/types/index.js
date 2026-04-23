"use strict";
/**
 * @rez/shared — canonical type definitions barrel
 *
 * Re-exports all entity types from the single source of truth.
 * Import with:
 *   import type { User, UserRole } from '@rez/shared/types';
 *   import type { Order, OrderTotals } from '@rez/shared/types';
 */
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
__exportStar(require("./user.types"), exports);
__exportStar(require("./merchant.types"), exports);
__exportStar(require("./offer.types"), exports);
__exportStar(require("./order.types"), exports);
__exportStar(require("./wallet.types"), exports);
__exportStar(require("./booking.types"), exports);
__exportStar(require("./campaign.types"), exports);
__exportStar(require("./razorpay.types"), exports);
// Re-export API response types for convenience
__exportStar(require("./api"), exports);
