import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import os from 'node:os';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

export interface TestCaseResult {
  name: string;
  passed: boolean;
  failureMessages: string[];
}

export interface TestRunResult {
  passed: boolean;
  numPassed: number;
  numTotal: number;
  cases: TestCaseResult[];
  rawError?: string;
}

function failed(rawError: string): TestRunResult {
  return { passed: false, numPassed: 0, numTotal: 0, cases: [], rawError };
}

// biome-ignore lint/suspicious/noControlCharactersInRegex: matching the ANSI escape sequence
const ANSI_PATTERN = /\u001b\[[0-9;]*m/g;
const SOURCE_LOCATION_PATTERN = /\.(ts|js):\d+/;
const ERROR_PATTERN = /error/i;

// A file that fails to load (bad syntax, a throwing import, an unsupported TS
// feature) never produces per-case results, only a cryptic "test failed". Pull
// the real error out of the runner's stderr for the results screen.
function cleanStderr(text: string): string | undefined {
  const lines = text
    .replace(ANSI_PATTERN, '')
    .split('\n')
    .map((l) => l.trimEnd())
    .filter((l) => l.trim().length > 0);
  if (lines.length === 0) {
    return undefined;
  }
  let start = lines.findIndex((l) => SOURCE_LOCATION_PATTERN.test(l));
  if (start === -1) {
    start = lines.findIndex((l) => ERROR_PATTERN.test(l));
  }
  if (start === -1) {
    start = 0;
  }
  return lines.slice(start, start + 12).join('\n');
}

// Locate a sibling support module: the built `.js` beside dist/index.js, or the
// `.ts` source under `pnpm dev`, which Node executes directly via type stripping.
function supportModule(name: string): string {
  for (const ext of ['js', 'ts']) {
    const file = path.join(here, `${name}.${ext}`);
    if (existsSync(file)) {
      return pathToFileURL(file).href;
    }
  }
  throw new Error(`codeforge: could not locate ${name} next to ${here}`);
}

// Runs the generated exercise.test.ts on Node's built-in test runner in an
// isolated child process, so the TUI is never clobbered by test output.
export function runTests(rootDir: string): Promise<TestRunResult> {
  const outFile = path.join(os.tmpdir(), `codeforge-test-${process.pid}-${Date.now()}.json`);
  const testFile = path.join(rootDir, 'exercise.test.ts');

  return new Promise((resolve) => {
    let reporter: string;
    try {
      reporter = supportModule('testReporter');
    } catch (err) {
      resolve(failed(String(err)));
      return;
    }

    const child = spawn(
      process.execPath,
      ['--test', `--test-reporter=${reporter}`, '--test-reporter-destination=stdout', testFile],
      {
        cwd: rootDir,
        stdio: ['ignore', 'ignore', 'pipe'],
        env: {
          ...process.env,
          NODE_ENV: 'test',
          FORCE_COLOR: '0',
          CODEFORGE_TEST_OUT: outFile,
          CODEFORGE_TEST_FILE: testFile,
        },
      },
    );

    let stderr = '';
    child.stderr?.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    const done = async (fallback: TestRunResult) => {
      let result = fallback;
      try {
        const raw = await fs.readFile(outFile, 'utf-8');
        await fs.unlink(outFile).catch(() => {});
        result = JSON.parse(raw) as TestRunResult;
      } catch {
        // fall through to the fallback below
      }
      if (result.cases.length === 0) {
        const detail = cleanStderr(stderr) ?? cleanStderr(result.rawError ?? '');
        result.rawError = detail ?? result.rawError ?? fallback.rawError;
      }
      resolve(result);
    };

    child.on('error', (err) => done(failed(String(err))));
    child.on('close', () => done(failed('The test runner exited without producing results.')));
  });
}
