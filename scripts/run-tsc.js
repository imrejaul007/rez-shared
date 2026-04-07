#!/usr/bin/env node

const { spawnSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

const candidates = [
  path.join(__dirname, '..', 'node_modules', '.bin', process.platform === 'win32' ? 'tsc.cmd' : 'tsc'),
  path.join(__dirname, '..', 'node_modules', 'typescript', 'bin', 'tsc'),
];

let tscPath = candidates.find((candidate) => fs.existsSync(candidate));

if (!tscPath) {
  try {
    tscPath = require.resolve('typescript/bin/tsc', {
      paths: [path.join(__dirname, '..')],
    });
  } catch {
    tscPath = undefined;
  }
}

if (!tscPath) {
  console.error('[rez-shared] TypeScript compiler not found. Install workspace dependencies before building.');
  process.exit(1);
}

const result = spawnSync(tscPath, { stdio: 'inherit' });
process.exit(result.status ?? 1);
