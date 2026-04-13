"use strict";
/**
 * Campaign Filter Translation Utility
 *
 * FL-13 fix: Consumer code sends `campaignType` (camelCase) with values like
 * 'LUCKY_DRAW' (SCREAMING_CASE) but the backend expects `type` (snake_case) with
 * values like 'lucky_draw' (lowercase).
 *
 * This utility provides bidirectional translation between consumer filter format
 * and the backend query format so that filtering always works regardless of which
 * layer sends the request.
 *
 * Consumer API call (before fix — BROKEN):
 *   GET /api/campaigns/active?campaignType=LUCKY_DRAW
 *
 * Consumer API call (after fix — WORKS):
 *   GET /api/campaigns/active?type=lucky_draw
 *   // OR use campaignFilterToBackend() to transform the full params object:
 *   const params = campaignFilterToBackend({ campaignType: 'LUCKY_DRAW' });
 *   // params = { type: 'lucky_draw' }
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CAMPAIGN_TYPE_LABELS = exports.CAMPAIGN_TYPE_VALUES = void 0;
exports.campaignFilterToBackend = campaignFilterToBackend;
exports.campaignFromBackend = campaignFromBackend;
exports.buildCampaignQuery = buildCampaignQuery;
exports.validateCampaignType = validateCampaignType;
const caseNormalization_1 = require("./caseNormalization");
// ── Canonical CampaignType values (snake_case, as stored in DB) ─────────────────
exports.CAMPAIGN_TYPE_VALUES = [
    'cashback_boost',
    'bank_offer',
    'bill_upload_bonus',
    'category_multiplier',
    'first_transaction_bonus',
    'festival_offer',
    'new-user', // note: hyphen, not underscore (ENUM-11 — deferred)
    'flash_sale',
    'lucky_draw',
    'referral_bonus',
    'tier_upgrade',
];
// ── Consumer-facing campaign type labels (display names) ────────────────────────
exports.CAMPAIGN_TYPE_LABELS = {
    cashback_boost: 'Cashback Boost',
    bank_offer: 'Bank Offer',
    bill_upload_bonus: 'Bill Upload Bonus',
    category_multiplier: 'Category Multiplier',
    first_transaction_bonus: 'First Transaction Bonus',
    festival_offer: 'Festival Offer',
    'new-user': 'New User',
    flash_sale: 'Flash Sale',
    lucky_draw: 'Lucky Draw',
    referral_bonus: 'Referral Bonus',
    tier_upgrade: 'Tier Upgrade',
};
/**
 * Translate a consumer-side campaign filter object to the format expected by
 * the backend /api/campaigns/active endpoint.
 *
 * Handles:
 *   - Key renaming: campaignType → type
 *   - Case normalization: 'LUCKY_DRAW' → 'lucky_draw'
 *   - Only passes recognized keys to the backend
 *
 * @param input - Consumer filter params (may contain campaignType, camelCase values)
 * @returns Backend-compatible query params
 */
function campaignFilterToBackend(input) {
    const result = {};
    if (input.limit != null)
        result.limit = input.limit;
    if (input.page != null)
        result.page = input.page;
    if (input.region != null)
        result.region = input.region;
    if (input.isActive != null)
        result.isActive = input.isActive;
    // Normalize type: consumer may send 'campaignType' or 'type'
    const rawType = input.campaignType ?? input.type;
    if (rawType != null) {
        result.type = (0, caseNormalization_1.normalizeCase)(rawType);
    }
    // Normalize status: consumer may send SCREAMING_CASE
    if (input.status != null) {
        result.status = (0, caseNormalization_1.normalizeCase)(input.status);
    }
    return result;
}
/**
 * Translate a backend campaign response item to consumer-friendly format.
 * Normalizes enum values to canonical snake_case.
 *
 * @param campaign - Raw campaign object from backend
 * @returns Consumer-normalized campaign object
 */
function campaignFromBackend(campaign) {
    // Normalize the 'type' field if present
    if (campaign.type && typeof campaign.type === 'string') {
        return { ...campaign, type: (0, caseNormalization_1.normalizeCase)(campaign.type) };
    }
    return campaign;
}
/**
 * Build a backend query URLSearchParams from consumer filter input.
 *
 * @example
 *   const params = buildCampaignQuery({ campaignType: 'LUCKY_DRAW', limit: 10 });
 *   // params.toString() === 'type=lucky_draw&limit=10'
 */
function buildCampaignQuery(input) {
    const backendParams = campaignFilterToBackend(input);
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(backendParams)) {
        searchParams.set(key, String(value));
    }
    return searchParams;
}
/**
 * Validate that a campaign type value is in the canonical set.
 * Returns the canonical value or null if invalid.
 */
function validateCampaignType(raw) {
    if (!raw)
        return null;
    const normalized = (0, caseNormalization_1.normalizeCase)(raw);
    if (exports.CAMPAIGN_TYPE_VALUES.includes(normalized)) {
        return normalized;
    }
    return null;
}
