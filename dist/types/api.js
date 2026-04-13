"use strict";
/**
 * Canonical API response types for all REZ apps.
 *
 * These types are a superset of both merchant and admin app formats.
 * Backend may return either nested or flat pagination — consumers should
 * handle both via the helper functions below.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItems = getItems;
exports.getPagination = getPagination;
// ── Helpers ─────────────────────────────────────────────────────────────────
/** Extract items array from either response format */
function getItems(response) {
    if ('data' in response && response.data) {
        // Nested format: { data: { items: [...], pagination } }
        if (typeof response.data === 'object' && 'items' in response.data) {
            return response.data.items;
        }
        // Flat format: { data: [...], pagination }
        if (Array.isArray(response.data)) {
            return response.data;
        }
    }
    return [];
}
/** Extract pagination from either response format */
function getPagination(response) {
    if ('data' in response && response.data && typeof response.data === 'object' && 'pagination' in response.data) {
        return response.data.pagination;
    }
    if ('pagination' in response && response.pagination) {
        return response.pagination;
    }
    return null;
}
