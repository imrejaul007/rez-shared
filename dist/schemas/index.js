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
exports.WalletBalanceResponseSchema = exports.CoinTransactionListResponseSchema = exports.CoinTransactionResponseSchema = exports.WalletCreditSchema = exports.WalletDebitSchema = exports.CoinSchema = exports.WalletBalanceSchema = exports.TRANSACTION_STATUS = exports.COIN_TRANSACTION_TYPE = exports.COIN_TYPE = exports.PaymentListResponseSchema = exports.PaymentResponseSchema = exports.UpdatePaymentStatusSchema = exports.CreatePaymentSchema = exports.PaymentGatewayResponseSchema = exports.PaymentUserDetailsSchema = exports.PAYMENT_PURPOSE = exports.PAYMENT_GATEWAY = exports.PAYMENT_METHOD = exports.PAYMENT_STATUS = exports.OrderListResponseSchema = exports.OrderResponseSchema = exports.UpdateOrderStatusSchema = exports.CreateOrderSchema = exports.OrderDeliverySchema = exports.OrderPaymentSchema = exports.OrderTotalsSchema = exports.OrderItemSchema = exports.ORDER_STATUS = exports.ProductListResponseSchema = exports.ProductResponseSchema = exports.UpdateProductSchema = exports.CreateProductSchema = exports.ProductRatingSchema = exports.ProductPricingSchema = exports.ProductImageSchema = void 0;
// Selective exports to avoid duplicate exports
// validationSchemas exports CreateProductRequest, UpdateOrderStatusRequest
// zod exports the same - prefer zod schemas
var product_schema_1 = require("./zod/product.schema");
Object.defineProperty(exports, "ProductImageSchema", { enumerable: true, get: function () { return product_schema_1.ProductImageSchema; } });
Object.defineProperty(exports, "ProductPricingSchema", { enumerable: true, get: function () { return product_schema_1.ProductPricingSchema; } });
Object.defineProperty(exports, "ProductRatingSchema", { enumerable: true, get: function () { return product_schema_1.ProductRatingSchema; } });
Object.defineProperty(exports, "CreateProductSchema", { enumerable: true, get: function () { return product_schema_1.CreateProductSchema; } });
Object.defineProperty(exports, "UpdateProductSchema", { enumerable: true, get: function () { return product_schema_1.UpdateProductSchema; } });
Object.defineProperty(exports, "ProductResponseSchema", { enumerable: true, get: function () { return product_schema_1.ProductResponseSchema; } });
Object.defineProperty(exports, "ProductListResponseSchema", { enumerable: true, get: function () { return product_schema_1.ProductListResponseSchema; } });
var order_schema_1 = require("./zod/order.schema");
Object.defineProperty(exports, "ORDER_STATUS", { enumerable: true, get: function () { return order_schema_1.ORDER_STATUS; } });
Object.defineProperty(exports, "OrderItemSchema", { enumerable: true, get: function () { return order_schema_1.OrderItemSchema; } });
Object.defineProperty(exports, "OrderTotalsSchema", { enumerable: true, get: function () { return order_schema_1.OrderTotalsSchema; } });
Object.defineProperty(exports, "OrderPaymentSchema", { enumerable: true, get: function () { return order_schema_1.OrderPaymentSchema; } });
Object.defineProperty(exports, "OrderDeliverySchema", { enumerable: true, get: function () { return order_schema_1.OrderDeliverySchema; } });
Object.defineProperty(exports, "CreateOrderSchema", { enumerable: true, get: function () { return order_schema_1.CreateOrderSchema; } });
Object.defineProperty(exports, "UpdateOrderStatusSchema", { enumerable: true, get: function () { return order_schema_1.UpdateOrderStatusSchema; } });
Object.defineProperty(exports, "OrderResponseSchema", { enumerable: true, get: function () { return order_schema_1.OrderResponseSchema; } });
Object.defineProperty(exports, "OrderListResponseSchema", { enumerable: true, get: function () { return order_schema_1.OrderListResponseSchema; } });
var payment_schema_1 = require("./zod/payment.schema");
Object.defineProperty(exports, "PAYMENT_STATUS", { enumerable: true, get: function () { return payment_schema_1.PAYMENT_STATUS; } });
Object.defineProperty(exports, "PAYMENT_METHOD", { enumerable: true, get: function () { return payment_schema_1.PAYMENT_METHOD; } });
Object.defineProperty(exports, "PAYMENT_GATEWAY", { enumerable: true, get: function () { return payment_schema_1.PAYMENT_GATEWAY; } });
Object.defineProperty(exports, "PAYMENT_PURPOSE", { enumerable: true, get: function () { return payment_schema_1.PAYMENT_PURPOSE; } });
Object.defineProperty(exports, "PaymentUserDetailsSchema", { enumerable: true, get: function () { return payment_schema_1.PaymentUserDetailsSchema; } });
Object.defineProperty(exports, "PaymentGatewayResponseSchema", { enumerable: true, get: function () { return payment_schema_1.PaymentGatewayResponseSchema; } });
Object.defineProperty(exports, "CreatePaymentSchema", { enumerable: true, get: function () { return payment_schema_1.CreatePaymentSchema; } });
Object.defineProperty(exports, "UpdatePaymentStatusSchema", { enumerable: true, get: function () { return payment_schema_1.UpdatePaymentStatusSchema; } });
Object.defineProperty(exports, "PaymentResponseSchema", { enumerable: true, get: function () { return payment_schema_1.PaymentResponseSchema; } });
Object.defineProperty(exports, "PaymentListResponseSchema", { enumerable: true, get: function () { return payment_schema_1.PaymentListResponseSchema; } });
var wallet_schema_1 = require("./zod/wallet.schema");
Object.defineProperty(exports, "COIN_TYPE", { enumerable: true, get: function () { return wallet_schema_1.COIN_TYPE; } });
Object.defineProperty(exports, "COIN_TRANSACTION_TYPE", { enumerable: true, get: function () { return wallet_schema_1.COIN_TRANSACTION_TYPE; } });
Object.defineProperty(exports, "TRANSACTION_STATUS", { enumerable: true, get: function () { return wallet_schema_1.TRANSACTION_STATUS; } });
Object.defineProperty(exports, "WalletBalanceSchema", { enumerable: true, get: function () { return wallet_schema_1.WalletBalanceSchema; } });
Object.defineProperty(exports, "CoinSchema", { enumerable: true, get: function () { return wallet_schema_1.CoinSchema; } });
Object.defineProperty(exports, "WalletDebitSchema", { enumerable: true, get: function () { return wallet_schema_1.WalletDebitSchema; } });
Object.defineProperty(exports, "WalletCreditSchema", { enumerable: true, get: function () { return wallet_schema_1.WalletCreditSchema; } });
Object.defineProperty(exports, "CoinTransactionResponseSchema", { enumerable: true, get: function () { return wallet_schema_1.CoinTransactionResponseSchema; } });
Object.defineProperty(exports, "CoinTransactionListResponseSchema", { enumerable: true, get: function () { return wallet_schema_1.CoinTransactionListResponseSchema; } });
Object.defineProperty(exports, "WalletBalanceResponseSchema", { enumerable: true, get: function () { return wallet_schema_1.WalletBalanceResponseSchema; } });
// API contracts
__exportStar(require("./apiContracts"), exports);
