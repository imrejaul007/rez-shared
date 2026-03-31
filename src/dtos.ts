/**
 * Shared DTO interfaces — Phase 7 shared contracts
 *
 * These interfaces define the over-the-wire shapes that the backend produces
 * and all clients consume. Update here when the backend model shapes change.
 */

import type { OrderStatus } from './orderStatuses';
import type { OrderPaymentStatus } from './paymentStatuses';
import type { CoinType } from './constants/coins';

// Re-export for convenience so consumers import only from @rez/shared
export type { OrderStatus } from './orderStatuses';
export type { OrderPaymentStatus, PaymentStatus } from './paymentStatuses';
// Note: CoinType is exported directly from './constants/coins' via index.ts — no re-export here

// ── Order Item ─────────────────────────────────────────────────────────────────

export interface OrderItemDTO {
  _id: string;
  menuItem: string;            // MenuItem ObjectId ref
  name: string;
  price: number;               // unit price at time of order (INR paise or rupees — check backend)
  quantity: number;
  customizations?: Array<{
    group: string;
    choice: string;
    price: number;
  }>;
  totalPrice: number;          // price * quantity + customizations
}

// ── Order Payment Sub-document ─────────────────────────────────────────────────

export interface OrderPaymentDTO {
  method: 'cod' | 'online' | 'wallet' | 'mixed';
  status: OrderPaymentStatus;
  transactionId?: string;
  gatewayOrderId?: string;
  paidAt?: string;             // ISO date string
  amount: number;
  walletAmountUsed?: number;
  coinsRedeemed?: number;
}

// ── Order DTO (summary shape returned by API) ──────────────────────────────────

export interface OrderDTO {
  _id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItemDTO[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  payment: OrderPaymentDTO;
  merchant: {
    _id: string;
    name: string;
    address?: string;
  };
  customer: {
    _id: string;
    name: string;
    phone?: string;
  };
  deliveryAddress?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    coordinates?: { lat: number; lng: number };
  };
  estimatedDeliveryTime?: number;   // minutes
  createdAt: string;
  updatedAt: string;
}

// ── Wallet Coin Type (alias for client code that doesn't import constants) ─────

export type WalletCoinType = CoinType;

// ── Pagination wrapper ─────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
