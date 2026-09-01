import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const modulePath = process.argv[2];
if (!modulePath) throw new Error('Pass the transpiled Component Mesh module path.');

const component = await import(pathToFileURL(resolve(modulePath)).href);
assert.equal(typeof component.normalize?.signal, 'function', 'normalize.signal export is missing');

const result = component.normalize.signal(new Int32Array([-500, 0, 250, 750, 1_500]), 0, 1_000);
assert.deepEqual(Array.from(result.values), [0, 0, 250_000, 750_000, 1_000_000]);
assert.equal(result.checksum, 0xff6d5f83);
assert.equal(result.clamped, 2);

const reversed = component.normalize.signal(new Int32Array([-1, 5, 11]), 10, 0);
assert.deepEqual(Array.from(reversed.values), [0, 500_000, 1_000_000]);
assert.equal(reversed.clamped, 2);

console.log(JSON.stringify({
  runtime: 'jco-esm',
  checksum: `0x${result.checksum.toString(16).padStart(8, '0')}`,
  clamped: result.clamped,
  values: Array.from(result.values),
}));
