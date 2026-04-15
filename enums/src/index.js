"use strict";
// Canonical enum registry for REZ ecosystem
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidUserRole = exports.isValidPaymentStatus = exports.isValidOrderStatus = exports.UserRoleValues = exports.PaymentStatusValues = exports.OrderStatusValues = exports.NotificationChannel = exports.TransactionType = exports.UserRole = exports.PaymentStatus = exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["CART"] = "CART";
    OrderStatus["CHECKOUT"] = "CHECKOUT";
    OrderStatus["PAID"] = "PAID";
    OrderStatus["FULFILLED"] = "FULFILLED";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["CANCELLED"] = "CANCELLED";
    OrderStatus["REFUNDED"] = "REFUNDED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["INIT"] = "INIT";
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["SUCCESS"] = "SUCCESS";
    PaymentStatus["FAILED"] = "FAILED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var UserRole;
(function (UserRole) {
    UserRole["CUSTOMER"] = "CUSTOMER";
    UserRole["MERCHANT"] = "MERCHANT";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["SUPPORT"] = "SUPPORT";
})(UserRole || (exports.UserRole = UserRole = {}));
var TransactionType;
(function (TransactionType) {
    TransactionType["DEBIT"] = "DEBIT";
    TransactionType["CREDIT"] = "CREDIT";
    TransactionType["REFUND"] = "REFUND";
    TransactionType["CHARGEBACK"] = "CHARGEBACK";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["EMAIL"] = "EMAIL";
    NotificationChannel["SMS"] = "SMS";
    NotificationChannel["PUSH"] = "PUSH";
    NotificationChannel["IN_APP"] = "IN_APP";
})(NotificationChannel || (exports.NotificationChannel = NotificationChannel = {}));
// Helper functions for enum operations
exports.OrderStatusValues = Object.values(OrderStatus);
exports.PaymentStatusValues = Object.values(PaymentStatus);
exports.UserRoleValues = Object.values(UserRole);
const isValidOrderStatus = (status) => exports.OrderStatusValues.includes(status);
exports.isValidOrderStatus = isValidOrderStatus;
const isValidPaymentStatus = (status) => exports.PaymentStatusValues.includes(status);
exports.isValidPaymentStatus = isValidPaymentStatus;
const isValidUserRole = (role) => exports.UserRoleValues.includes(role);
exports.isValidUserRole = isValidUserRole;
