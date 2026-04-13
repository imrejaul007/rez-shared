"use strict";
/**
 * Canonical Wallet and Coin entity types for the REZ platform.
 *
 * Source of truth:
 *   rezbackend/src/models/Wallet.ts          (IWallet, ICoinBalance)
 *   rezbackend/src/models/CoinTransaction.ts  (ICoinTransaction)
 *   rez-shared/src/constants/coins.ts         (CoinType — authoritative)
 *
 * NOTE: WalletBalance and CoinTransaction (simple shapes) remain in
 * types/wallet.ts for backward compatibility. This file adds the full
 * Wallet entity and richer transaction types needed by all apps.
 *
 * Do NOT redefine these types in frontend apps — import from @rez/shared instead.
 */
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=wallet.types.js.map