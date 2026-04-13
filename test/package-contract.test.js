const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

test('rez-shared exports map only exposes files that exist in dist', () => {
  const packageJson = readJson(path.join(__dirname, '..', 'package.json'));
  const exportsMap = packageJson.exports || {};

  for (const [subpath, target] of Object.entries(exportsMap)) {
    if (typeof target !== 'object' || target === null) continue;

    for (const field of ['import', 'require', 'types']) {
      if (!target[field]) continue;
      const resolved = path.join(__dirname, '..', target[field]);
      assert.ok(fs.existsSync(resolved), `${subpath} -> ${field} target is missing: ${target[field]}`);
    }
  }
});

test('rez-shared root source exports match the stable committed dist surface', () => {
  const sourceIndex = fs.readFileSync(path.join(__dirname, '..', 'src', 'index.ts'), 'utf8');
  const distIndex = fs.readFileSync(path.join(__dirname, '..', 'dist', 'index.d.ts'), 'utf8');

  assert.match(sourceIndex, /export \* from '\.\/orderStatuses';/);
  assert.match(sourceIndex, /export \* from '\.\/paymentStatuses';/);
  assert.ok(!/export \* from '\.\/middleware';/.test(sourceIndex), 'root source must not export unsupported middleware subpath');
  assert.ok(!/export \* from '\.\/queue';/.test(sourceIndex), 'root source must not export unsupported queue subpath');
  assert.match(distIndex, /export \* from '\.\/orderStatuses';/);
  assert.match(distIndex, /export \* from '\.\/paymentStatuses';/);
});

test('rez-shared publishes the committed middleware, schema, queue, and webhook subpaths', () => {
  const packageJson = readJson(path.join(__dirname, '..', 'package.json'));
  const exportsMap = packageJson.exports || {};

  for (const subpath of ['./middleware', './schemas', './queue', './webhook']) {
    assert.ok(exportsMap[subpath], `missing export for ${subpath}`);
  }
});
