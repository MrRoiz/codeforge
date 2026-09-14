import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import os from 'node:os';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

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

interface RunnerCommand {
  command: string;
  args: string[];
}

// In a build (`pnpm build`), tsup emits dist/jestRunner.js and this file is
// bundled into dist/index.js, so `here` is dist. Under `pnpm dev` (tsx) there is
// no build, so `here` is src/utils and we spawn the TypeScript runner via tsx.
function runnerCommand(rootDir: string, outFile: string): RunnerCommand {
  const jsRunner = path.join(here, 'jestRunner.js');
  if (existsSync(jsRunner)) {
    return { command: process.execPath, args: [jsRunner, rootDir, outFile] };
  }

  const tsRunner = path.join(here, 'jestRunner.ts');
  if (existsSync(tsRunner)) {
    const tsxCli = require.resolve('tsx/cli');
    return { command: process.execPath, args: [tsxCli, tsRunner, rootDir, outFile] };
  }

  throw new Error(`codeforge: could not locate the test runner next to ${here}`);
}

export function runJest(rootDir: string): Promise<TestRunResult> {
  const outFile = path.join(os.tmpdir(), `codeforge-jest-${process.pid}-${Date.now()}.json`);

  return new Promise((resolve) => {
    let runner: RunnerCommand;
    try {
      runner = runnerCommand(rootDir, outFile);
    } catch (err) {
      resolve({ passed: false, numPassed: 0, numTotal: 0, cases: [], rawError: String(err) });
      return;
    }

    const child = spawn(runner.command, runner.args, {
      cwd: rootDir,
      stdio: 'ignore',
      env: { ...process.env, NODE_ENV: 'test', FORCE_COLOR: '0' },
    });

    const done = async (fallback: TestRunResult) => {
      try {
        const raw = await fs.readFile(outFile, 'utf-8');
        await fs.unlink(outFile).catch(() => {});
        resolve(JSON.parse(raw));
      } catch {
        resolve(fallback);
      }
    };

    child.on('error', (err) =>
      done({ passed: false, numPassed: 0, numTotal: 0, cases: [], rawError: String(err) }),
    );

    child.on('close', () =>
      done({
        passed: false,
        numPassed: 0,
        numTotal: 0,
        cases: [],
        rawError: 'Jest runner exited without producing results.',
      }),
    );
  });
}