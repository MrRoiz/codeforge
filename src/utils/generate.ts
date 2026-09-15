import fs from 'node:fs/promises';
import * as path from 'node:path';
import { validationLabel, type Exercise } from '@exercises/types';
import { formatExample } from '@utils/format';

export interface GeneratedPaths {
  dir: string;
  exerciseFile: string;
  testFile: string;
}

const TODO_MARKER = '// TODO: forge your solution';

// `exercisesDir` is the folder that holds one subfolder per exercise.
export function exerciseDir(exerciseId: string, exercisesDir: string): string {
  return path.resolve(exercisesDir, exerciseId);
}

/** Compute the file locations without creating anything. */
export function exercisePaths(exercise: Exercise, exercisesDir: string): GeneratedPaths {
  const dir = exerciseDir(exercise.id, exercisesDir);
  return {
    dir,
    exerciseFile: path.join(dir, 'exercise.ts'),
    testFile: path.join(dir, 'exercise.test.ts'),
  };
}

/** Whether the exercise has been started (solution file exists). */
export async function isStarted(exercise: Exercise, exercisesDir: string): Promise<boolean> {
  try {
    await fs.access(exercisePaths(exercise, exercisesDir).exerciseFile);
    return true;
  } catch {
    return false;
  }
}

export async function ensureGenerated(exercise: Exercise, exercisesDir: string): Promise<GeneratedPaths> {
  const { dir, exerciseFile, testFile } = exercisePaths(exercise, exercisesDir);

  await fs.mkdir(dir, { recursive: true });

  let existing: string | null = null;
  try {
    existing = await fs.readFile(exerciseFile, 'utf-8');
  } catch {
    existing = null;
  }

  // never clobber the developer's work-in-progress solution
  if (existing === null) {
    await fs.writeFile(exerciseFile, renderExerciseFile(exercise));
  }
  // tests are owned by codeforge; always refresh them
  await fs.writeFile(testFile, renderTestFile(exercise));

  return { dir, exerciseFile, testFile };
}

export async function resetSolution(exercise: Exercise, exercisesDir: string): Promise<void> {
  const exerciseFile = path.join(exerciseDir(exercise.id, exercisesDir), 'exercise.ts');
  await fs.writeFile(exerciseFile, renderExerciseFile(exercise));
}

export async function isSolved(exercise: Exercise, exercisesDir: string): Promise<boolean> {
  try {
    const content = await fs.readFile(path.join(exerciseDir(exercise.id, exercisesDir), 'exercise.ts'), 'utf-8');
    return !content.includes(TODO_MARKER);
  } catch {
    return false;
  }
}

function commentBlock(label: string, value: string, pad = ' *   '): string {
  const continuation = ' '.repeat(label.length);
  const lines = value.split('\n');
  return lines
    .map((line, i) => `${pad}${i === 0 ? label : continuation}${line}`)
    .join('\n');
}

function renderExerciseFile(exercise: Exercise): string {
  const examples = exercise.examples
    .map((e) => {
      const lines = [commentBlock('Input:  ', formatExample(e.input)), commentBlock('Output: ', formatExample(e.output))];
      if (e.explanation) lines.push(commentBlock('Note:   ', e.explanation));
      return lines.join('\n');
    })
    .join('\n *\n');

  const constraints = exercise.constraints.map((c) => ` *   - ${c}`).join('\n');

  return `/*
 * ============================================================================
 *  ${exercise.name.toUpperCase()}
 *  Difficulty: ${exercise.difficulty.toUpperCase()} | Type: ${exercise.type} | Time: ${exercise.time}
 *  Source: ${validationLabel(exercise)}
 * ============================================================================
 *
 * ${exercise.description}
 *
 * Examples:
${examples}
 *
 * Constraints:
${constraints}
 */

${
    exercise.stub ??
    `${exercise.functionSignature} {
  ${TODO_MARKER}
  throw new Error('Not implemented');
}`
}
`;
}

function fnName(exercise: Exercise): string {
  const match = exercise.functionSignature.match(/function\s+(\w+)/);
  if (!match) throw new Error(`Bad function signature for ${exercise.id}`);
  return match[1];
}

const TEST_HEADER = (name: string) =>
  `// ============================================================================
//  CODEFORGE test suite — ${name}
//  This file is regenerated on every run. Do not edit it — edit exercise.ts
// ============================================================================
`;

const HELPERS = `
// treat -0 and 0 as equal; deep-normalize arrays and objects
const norm = (v: any): any => {
  if (typeof v === 'number') return Object.is(v, -0) ? 0 : v;
  if (Array.isArray(v)) return v.map(norm);
  if (v && typeof v === 'object') {
    return Object.fromEntries(Object.entries(v).map(([k, val]) => [k, norm(val)]));
  }
  return v;
};

// order-insensitive comparison: sort an array of primitives, or an array of
// arrays by their JSON (keeping inner order intact — e.g. permutations)
const cmp = (a: any, b: any): number => {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (typeof a === 'string' && typeof b === 'string') return a < b ? -1 : a > b ? 1 : 0;
  const x = JSON.stringify(a);
  const y = JSON.stringify(b);
  return x < y ? -1 : x > y ? 1 : 0;
};
const sortDeep = (v: any): any => {
  if (!Array.isArray(v)) return norm(v);
  const mapped = v.map(norm);
  if (mapped.every((x) => !Array.isArray(x))) return [...mapped].sort(cmp);
  return [...mapped].sort((a, b) => cmp(JSON.stringify(a), JSON.stringify(b)));
};
`;

function renderTestFile(exercise: Exercise): string {
  const { cases: testCases, mutatesInput, mutatesInputPrefix, fileBody } = exercise.tests;

  if (fileBody) {
    return `${TEST_HEADER(exercise.name)}\n${fileBody}\n`;
  }

  const fn = fnName(exercise);

  const cases = testCases
    .map((t, i) => {
      const argsLiteral = JSON.stringify(t.input);
      const expectedLiteral = JSON.stringify(t.expected);
      const label = `${fn}(${t.input.map((a) => JSON.stringify(a)).join(', ')})`;

      let assertion: string;
      if (mutatesInputPrefix) {
        assertion = `    expect(norm(args[0].slice(0, result))).toEqual(norm(${expectedLiteral}));`;
      } else if (mutatesInput) {
        assertion = `    expect(norm(args[0])).toEqual(norm(${expectedLiteral}));`;
      } else if (t.sorted) {
        assertion = `    expect(sortDeep(result)).toEqual(sortDeep(${expectedLiteral}));`;
      } else {
        assertion = `    expect(norm(result)).toEqual(norm(${expectedLiteral}));`;
      }

      return `  it('case ${i + 1}: ${label.replace(/'/g, "\\'")}', () => {
    const args: any[] = ${argsLiteral};
    const result: any = ${fn}(...args);
${assertion}
  });`;
    })
    .join('\n\n');

  return `${TEST_HEADER(exercise.name)}
import { ${fn} } from './exercise.js';
${HELPERS}
describe('${exercise.name}', () => {
${cases}
});
`;
}