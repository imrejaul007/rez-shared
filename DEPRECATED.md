# DEPRECATED — Use packages/rez-shared Instead

This `rez-shared` package at the repo root is **deprecated** and will be removed
in a future release.

## Canonical location

All shared utilities, types, DTOs, and status constants have been moved to:

```
packages/rez-shared/
```

## Why

SD-08: Two copies of `rez-shared` existed simultaneously, creating schema and
type divergence across services. `packages/rez-shared` is the single source of
truth and is managed via the monorepo workspace.

## Migration

Update your service's `package.json` and TypeScript path aliases to reference
`packages/rez-shared` (published as `@rez/shared`). Do **not** add new exports
to this directory.

**Do not delete this directory yet** — services are being migrated incrementally
to avoid a breaking-change deployment. Track migration progress in the issue
tracker.
