"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateObjectIdParam = validateObjectIdParam;
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Middleware factory: validates that a named route param is a valid MongoDB ObjectId.
 * Rejects with 400 if the param is missing or not a valid ObjectId.
 *
 * @example
 * // Apply to a router
 * router.get('/:id', validateObjectIdParam('id'), myHandler);
 * router.get('/:merchantId/reviews', validateObjectIdParam('merchantId'), myHandler);
 *
 * @param paramName - The name of the req.params key to validate
 */
function validateObjectIdParam(paramName) {
    return (req, _res, next) => {
        const id = req.params[paramName];
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            // Intentionally avoid returning the value to prevent ObjectId enumeration
            _res.status(400).json({ success: false, error: `Invalid ${paramName}` });
            return;
        }
        next();
    };
}
