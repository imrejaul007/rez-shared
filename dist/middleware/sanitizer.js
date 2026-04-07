"use strict";
/**
 * Input Sanitization Middleware
 *
 * Sanitizes text inputs to prevent XSS attacks.
 * Usage: app.use(sanitizeInputs);
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeInputs = sanitizeInputs;
exports.sanitizeString = sanitizeString;
exports.validatePhone = validatePhone;
exports.validatePincode = validatePincode;
exports.validateEmail = validateEmail;
exports.sanitizeAddress = sanitizeAddress;
const isomorphic_dompurify_1 = __importDefault(require("isomorphic-dompurify"));
/**
 * Maximum lengths for common fields
 */
const FIELD_LIMITS = {
    name: 100,
    phone: 20,
    email: 100,
    notes: 1000,
    specialInstructions: 500,
    title: 200,
    description: 5000,
    address: 500,
    pincode: 10,
};
/**
 * Fields that should NOT be sanitized (numbers, booleans, etc.)
 */
const SAFE_FIELDS = ['quantity', 'price', 'discount', 'amount', 'total', 'isActive', 'isPaused'];
/**
 * Recursively sanitize an object
 */
function sanitizeObject(obj, path = '') {
    if (obj === null || obj === undefined) {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map((item, idx) => sanitizeObject(item, `${path}[${idx}]`));
    }
    if (typeof obj !== 'object') {
        return obj;
    }
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
        const fieldPath = path ? `${path}.${key}` : key;
        // Skip safe fields (numbers, booleans, objects with special meaning)
        if (SAFE_FIELDS.includes(key) || typeof value === 'number' || typeof value === 'boolean') {
            sanitized[key] = value;
            continue;
        }
        if (typeof value === 'string') {
            // Sanitize HTML
            let clean = isomorphic_dompurify_1.default.sanitize(value.trim());
            // Enforce field length limits
            const limit = FIELD_LIMITS[key];
            if (limit && clean.length > limit) {
                clean = clean.substring(0, limit);
            }
            sanitized[key] = clean;
        }
        else if (typeof value === 'object') {
            sanitized[key] = sanitizeObject(value, fieldPath);
        }
        else {
            sanitized[key] = value;
        }
    }
    return sanitized;
}
/**
 * Middleware to sanitize request body, query, and params
 */
function sanitizeInputs(req, res, next) {
    try {
        // Sanitize body
        if (req.body && typeof req.body === 'object') {
            req.body = sanitizeObject(req.body);
        }
        // Sanitize query (less common for POST, but good to be safe)
        if (req.query && typeof req.query === 'object') {
            req.query = sanitizeObject(req.query);
        }
        // Sanitize params
        if (req.params && typeof req.params === 'object') {
            req.params = sanitizeObject(req.params);
        }
        next();
    }
    catch (error) {
        // If sanitization fails, reject the request
        res.status(400).json({
            success: false,
            error: {
                code: 'INVALID_INPUT',
                message: 'Input sanitization failed',
                statusCode: 400,
            },
        });
    }
}
/**
 * Validate and sanitize a single string
 */
function sanitizeString(value, maxLength) {
    if (typeof value !== 'string') {
        return '';
    }
    let clean = isomorphic_dompurify_1.default.sanitize(value.trim());
    if (maxLength && clean.length > maxLength) {
        clean = clean.substring(0, maxLength);
    }
    return clean;
}
/**
 * Validate phone number format
 */
function validatePhone(phone) {
    const cleaned = phone.replace(/[\s-]/g, '');
    const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
    return phoneRegex.test(cleaned);
}
/**
 * Validate pincode format (India)
 */
function validatePincode(pincode) {
    const pincodeRegex = /^\d{6}$/;
    return pincodeRegex.test(String(pincode));
}
/**
 * Validate email format
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
/**
 * Sanitize and validate delivery address
 */
function sanitizeAddress(address) {
    if (!address || typeof address !== 'object') {
        throw new Error('Invalid address object');
    }
    const sanitized = {
        name: sanitizeString(address.name || '', 100),
        phone: sanitizeString(address.phone || '', 20),
        email: address.email ? sanitizeString(address.email, 100) : undefined,
        addressLine1: sanitizeString(address.addressLine1 || '', 200),
        addressLine2: address.addressLine2 ? sanitizeString(address.addressLine2, 200) : undefined,
        city: sanitizeString(address.city || '', 50),
        state: sanitizeString(address.state || '', 50),
        pincode: sanitizeString(address.pincode || '', 10),
        country: sanitizeString(address.country || 'India', 50),
        landmark: address.landmark ? sanitizeString(address.landmark, 100) : undefined,
        addressType: address.addressType || 'home',
    };
    // Validate required fields
    if (!sanitized.name)
        throw new Error('Address name is required');
    if (!sanitized.phone)
        throw new Error('Address phone is required');
    if (!validatePhone(sanitized.phone))
        throw new Error('Invalid phone number');
    if (!sanitized.addressLine1)
        throw new Error('Address line 1 is required');
    if (!sanitized.city)
        throw new Error('City is required');
    if (!sanitized.state)
        throw new Error('State is required');
    if (!sanitized.pincode)
        throw new Error('Pincode is required');
    if (!validatePincode(sanitized.pincode))
        throw new Error('Invalid pincode format');
    return sanitized;
}
//# sourceMappingURL=sanitizer.js.map