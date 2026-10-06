import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.tsx',
    // programmatic API
    lib: 'src/lib.ts',
    // separate entry so the test runner can load it as its own module
    testReporter: 'src/utils/testReporter.ts',
  },
  format: ['esm'],
  platform: 'node',
  target: 'node22',
  // keep `node:` prefixes — stripping them turns `node:test` into the bare
  // `test` package, which does not exist
  removeNodeProtocol: false,
  outDir: 'dist',
  clean: true,
  splitting: false,
  sourcemap: true,
  dts: false,
});
