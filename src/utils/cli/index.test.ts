import assert from 'node:assert/strict';
import { test } from 'node:test';
import pkg from '../../../package.json' with { type: 'json' };
import { isVersionRequest, VERSION } from './index.js';

test('VERSION is the package version prefixed with v', () => {
  assert.equal(VERSION, `v${pkg.version}`);
});

test('recognizes the version flags', () => {
  for (const flag of ['--version', '-v', '-V']) {
    assert.equal(isVersionRequest([flag]), true, `expected ${flag} to request the version`);
  }
});

test('ignores unrelated or malformed arguments', () => {
  assert.equal(isVersionRequest([]), false);
  assert.equal(isVersionRequest(['--help']), false);
  assert.equal(isVersionRequest(['--version=1']), false);
  assert.equal(isVersionRequest(['version']), false);
});
