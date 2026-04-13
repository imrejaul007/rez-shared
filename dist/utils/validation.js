"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidIndianPhone = isValidIndianPhone;
exports.isValidGSTIN = isValidGSTIN;
exports.isValidPAN = isValidPAN;
exports.isValidUPI = isValidUPI;
function isValidIndianPhone(phone) {
    return /^[6-9][0-9]{9}$/.test(phone.replace(/\s|-/g, ''));
}
function isValidGSTIN(gstin) {
    return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin);
}
function isValidPAN(pan) {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
}
function isValidUPI(upi) {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/.test(upi);
}
