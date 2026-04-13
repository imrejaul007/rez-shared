/**
 * Input Sanitization Middleware
 *
 * Sanitizes text inputs to prevent XSS attacks.
 * Usage: app.use(sanitizeInputs);
 */
import { Request, Response, NextFunction } from 'express';
/**
 * Middleware to sanitize request body, query, and params
 */
export declare function sanitizeInputs(req: Request, res: Response, next: NextFunction): void;
/**
 * Validate and sanitize a single string
 */
export declare function sanitizeString(value: string, maxLength?: number): string;
/**
 * Validate phone number format
 */
export declare function validatePhone(phone: string): boolean;
/**
 * Validate pincode format (India)
 */
export declare function validatePincode(pincode: string): boolean;
/**
 * Validate email format
 */
export declare function validateEmail(email: string): boolean;
/**
 * Sanitize and validate delivery address
 */
export declare function sanitizeAddress(address: any): {
    name: string;
    phone: string;
    email: string | undefined;
    addressLine1: string;
    addressLine2: string | undefined;
    city: string;
    state: string;
    pincode: string;
    country: string;
    landmark: string | undefined;
    addressType: any;
};
//# sourceMappingURL=sanitizer.d.ts.map