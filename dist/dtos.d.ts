/**
 * Shared DTO interfaces — Phase 7 shared contracts
 *
 * These interfaces define the over-the-wire shapes that the backend produces
 * and all clients consume. Update here when the backend model shapes change.
 */
import type { OrderStatus } from './orderStatuses';
import type { OrderPaymentStatus } from './paymentStatuses';
import type { CoinType } from './constants/coins';
export type { OrderStatus } from './orderStatuses';
export type { OrderPaymentStatus, PaymentStatus } from './paymentStatuses';
export interface OrderItemDTO {
    _id: string;
    menuItem: string;
    name: string;
    price: number;
    quantity: number;
    customizations?: Array<{
        group: string;
        choice: string;
        price: number;
    }>;
    totalPrice: number;
}
export interface OrderPaymentDTO {
    method: 'cod' | 'wallet' | 'card' | 'upi' | 'netbanking' | 'razorpay' | 'stripe';
    status: OrderPaymentStatus;
    transactionId?: string;
    gatewayOrderId?: string;
    paidAt?: string;
    amount: number;
    walletAmountUsed?: number;
    coinsRedeemed?: number;
}
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
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    estimatedDeliveryTime?: number;
    createdAt: string;
    updatedAt: string;
}
export type DtoWalletCoinType = CoinType;
/** @deprecated Use PaginatedResponse from types/api.ts instead */
export interface PaginatedDtoResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
/** @deprecated Use PaginatedResponse from types/api.ts */
export type PaginatedResponse<T> = PaginatedDtoResponse<T>;
