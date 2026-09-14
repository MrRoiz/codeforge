import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

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

function runnerPath(): string {
  // dist layout: dist/utils/jestRunner.js (this file is dist/utils/runTests.js)
  return path.join(here, 'jestRunner.js');
}

export function runJest(rootDir: string): Promise<TestRunResult> {
  const outFile = path.join(os.tmpdir(), `codeforge-jest-${process.pid}-${Date.now()}.json`);

  return new Promise((resolve) => {
    const child = spawn(process.execPath, [runnerPath(), rootDir, outFile], {
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