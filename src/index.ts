// P1-ARCH-1: Re-export wrapper — canonical source is at rez-shared/src/index.ts
// This package (packages/rez-shared) exists as a git submodule reference.
// All actual implementation lives in the canonical rez-shared/ package.
export * from '../../rez-shared/src/index';
