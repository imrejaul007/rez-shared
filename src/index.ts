// ── Canonical enums (consolidated from packages/shared-enums) ───────────────────
// Re-export selectively to avoid duplicate exports with coins.ts:
// coins.ts defines the canonical LoyaltyTier, USER_ROLES, UserRole, normalizeLoyaltyTier
export {
  TRANSACTION_TYPES,
  type TransactionType,
} from './enums';

// ── Phase 7: Order & Payment status contracts ──────────────────────────────────
export * from './orderStatuses';
export * from './paymentStatuses';
export { OrderItemDTO, OrderPaymentDTO, OrderDTO, PaginatedDtoResponse, DtoWalletCoinType } from './dtos';
// PaginatedResponse re-exported from types/api.ts (canonical version)
export * from './statusCompat';

// DM-HIGH-02: Unified payment state
export * from './paymentState';

// DM-HIGH-04: Canonical notification categories
export * from './notificationCategory';

// ── Canonical entity types (Phase 8+: single source of truth) ─────────────────
// Import entity types directly: import type { User, Order } from '@rez/shared'
export * from './types/user.types';
export * from './types/merchant.types';
export * from './types/offer.types';
export * from './types/order.types';
export * from './types/wallet.types';
export * from './types/booking.types';
export * from './types/campaign.types';

// ── Pre-existing shared exports ────────────────────────────────────────────────
// Types
export * from './types/wallet';
export * from './types/api';

// Utils
export * from './utils/currency';
export * from './utils/validation';
export * from './utils/date';
export * from './utils/caseNormalization';
export * from './utils/campaignFilter';
export * from './utils/userNormalization';

// Constants
export * from './constants/coins';
export * from './constants/errors';

// Feature Flags
export * from './flags';

// Schema validation and API contracts
export * from './schemas/apiContracts';
export * from './validation';
