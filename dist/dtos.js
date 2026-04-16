"use strict";
/**
 * Shared DTO interfaces — Phase 7 shared contracts
 *
 * These interfaces define the over-the-wire shapes that the backend produces
 * and all clients consume. Update here when the backend model shapes change.
 *
 * CANONICAL SCHEMA DECISION (DM-02): This file is the source of truth for
 * API response shapes. The Order model in rez-backend and any other service
 * implementations must map to these DTOs. Use normalizers from statusCompat.ts
 * to handle cross-service schema differences.
 *
 * ID FIELD CONVENTION (TF-12): All entity IDs use `id` (not `_id`) in DTOs
 * to match REST API conventions. Backend MongoDB `_id` is mapped to `id` at
 * the API boundary via normalizeUserId() and similar helpers.
 */
Object.defineProperty(exports, "__esModule", { value: true });
