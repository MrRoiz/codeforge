import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.tsx',
    // programmatic API
    lib: 'src/lib.ts',
    // separate entry so the test runner can be spawned as its own child process
    jestRunner: 'src/utils/jestRunner.ts',
  },
  format: ['esm'],
  platform: 'node',
  target: 'node20',
  outDir: 'dist',
  clean: true,
  splitting: false,
  sourcemap: true,
  dts: false,
});
