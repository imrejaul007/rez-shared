"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REWARD_TYPES = exports.COIN_DISPLAY_NAMES = exports.COIN_EXPIRY_DAYS = exports.COIN_TYPES = void 0;
exports.COIN_TYPES = ['rez', 'promo', 'branded', 'category'];
exports.COIN_EXPIRY_DAYS = {
    rez: 365, // REZ coins: 1 year
    promo: 7, // Promo coins: 7 days (creates urgency)
    branded: 90, // Branded coins: 3 months
    category: 30, // Category coins: 1 month
};
exports.COIN_DISPLAY_NAMES = {
    rez: 'REZ Coins',
    promo: 'Promo Coins',
    branded: 'Branded Coins',
    category: 'Category Coins',
};
exports.REWARD_TYPES = [
    'store_payment', 'bill_payment', 'recharge',
    'referral_bonus', 'streak_bonus', 'prive_campaign',
    'mission_complete', 'first_visit', 'birthday_bonus'
];
//# sourceMappingURL=coins.js.map