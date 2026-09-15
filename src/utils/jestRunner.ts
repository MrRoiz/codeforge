import fs from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

async function main() {
  const [, , rootDir, outFile] = process.argv;
  if (!(rootDir && outFile)) {
    process.exit(2);
  }

  const tsJestPath = require.resolve('ts-jest');
  // biome-ignore lint/suspicious/noExplicitAny: jest is loaded dynamically and has no shipped types
  const jestPkg: any = require('jest');

  const config = {
    rootDir,
    testEnvironment: 'node',
    testMatch: ['<rootDir>/exercise.test.ts'],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' },
    transform: {
      '^.+\\.tsx?$': [
        tsJestPath,
        {
          diagnostics: false,
          tsconfig: {
            module: 'commonjs',
            target: 'es2022',
            esModuleInterop: true,
          },
        },
      ],
    },
  };

  const { results } = await jestPkg.runCLI({ config: JSON.stringify(config), silent: true }, [
    rootDir,
  ]);

  const cases: { name: string; passed: boolean; failureMessages: string[] }[] = [];
  for (const suite of results.testResults ?? []) {
    // jest >= 30 exposes per-test results on `testResults`; older versions used `assertionResults`
    const assertions = suite.testResults ?? suite.assertionResults ?? [];
    for (const a of assertions) {
      cases.push({
        name: a.title ?? a.fullName ?? 'unknown',
        passed: a.status === 'passed',
        failureMessages: a.failureMessages ?? [],
      });
    }
  }

  const payload = {
    passed: results.numFailedTests === 0 && results.numTotalTests > 0,
    numPassed: results.numPassedTests ?? 0,
    numTotal: results.numTotalTests ?? 0,
    cases,
  };

  await fs.writeFile(outFile, JSON.stringify(payload));
}

main().catch(async (err) => {
  const outFile = process.argv[4];
  if (outFile) {
    await fs
      .writeFile(
        outFile,
        JSON.stringify({
          passed: false,
          numPassed: 0,
          numTotal: 0,
          cases: [],
          rawError: String(err?.stack ?? err),
        }),
      )
      .catch(() => {});
  }
  process.exit(1);
});
