import fs from 'node:fs';
import type { TestCaseResult, TestRunResult } from './runTests';

interface ReporterEvent {
  type: string;
  data: {
    name?: string;
    details?: {
      type?: string;
      error?: unknown;
    };
  };
}

function errorMessage(error: unknown): string | null {
  if (!error) {
    return null;
  }
  if (typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return String(error);
}

/**
 * Aggregates node:test events into the JSON payload the TUI consumes. Loaded by
 * the built-in runner via `--test-reporter`; writes to CODEFORGE_TEST_OUT.
 */
export default async function* reporter(source: AsyncIterable<ReporterEvent>) {
  const cases: TestCaseResult[] = [];
  const testFile = process.env.CODEFORGE_TEST_FILE;
  const stderr: string[] = [];
  let suiteError: string | null = null;

  for await (const event of source) {
    if (event.type === 'test:stderr') {
      const message = (event.data as { message?: string }).message;
      if (message) {
        stderr.push(message);
      }
      continue;
    }

    if (event.type !== 'test:pass' && event.type !== 'test:fail') {
      continue;
    }

    const { name, details } = event.data;
    const message = errorMessage(details?.error);

    // score only leaf `it(...)` cases. Suites aggregate their children, and a
    // file that fails to load surfaces as a single test named after the file.
    const isLeaf = details?.type === 'test' && name !== testFile;
    if (!isLeaf) {
      if (event.type === 'test:fail' && suiteError === null && message) {
        suiteError = message;
      }
      continue;
    }

    cases.push({
      name: name ?? 'unknown',
      passed: event.type === 'test:pass',
      failureMessages: message ? [message] : [],
    });
  }

  const numPassed = cases.filter((c) => c.passed).length;
  const payload: TestRunResult = {
    passed: cases.length > 0 && numPassed === cases.length,
    numPassed,
    numTotal: cases.length,
    cases,
  };
  // a file that fails to load produces no leaf cases — surface why
  if (cases.length === 0) {
    const detail = stderr.join('').trim() || suiteError;
    if (detail) {
      payload.rawError = detail;
    }
  }

  const out = process.env.CODEFORGE_TEST_OUT;
  if (out) {
    fs.writeFileSync(out, JSON.stringify(payload));
  }
}
