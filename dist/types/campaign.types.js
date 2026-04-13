"use strict";
/**
 * Canonical Campaign types for the REZ platform.
 *
 * Two clearly separated interfaces:
 *   PromoCampaign — from rezbackend/src/models/Campaign.ts
 *                   (Homepage "Exciting Deals" section, coin/cashback campaigns)
 *   AdCampaign    — from rezbackend/src/models/AdCampaign.ts
 *                   (Merchant-bought ad placements, CPC/CPM bidding)
 *
 * Do NOT redefine these types in frontend apps — import from @rez/shared instead.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdCampaign = isAdCampaign;
exports.isPromoCampaign = isPromoCampaign;
// ── Type guards ───────────────────────────────────────────────────────────────
function isAdCampaign(campaign) {
    return 'merchantId' in campaign && 'bidType' in campaign;
}
function isPromoCampaign(campaign) {
    return 'campaignId' in campaign && 'badge' in campaign;
}
//# sourceMappingURL=campaign.types.js.map