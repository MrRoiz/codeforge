import fs from 'node:fs/promises';
import * as path from 'node:path';
import type { Exercise } from '@exercises/types';
import { exerciseDir } from '@utils/generate';
import ts from 'typescript';

export type Confidence = 'low' | 'medium' | 'high';

export interface ComplexityResult {
  /** rough growth class, e.g. "O(n)", "O(n²)" */
  label: string;
  confidence: Confidence;
  /** short human explanation of what the estimate is based on */
  detail: string;
}

// array methods that iterate the whole collection (sort handled separately)
const ITERATION_METHODS = new Set([
  'map',
  'forEach',
  'filter',
  'reduce',
  'reduceRight',
  'some',
  'every',
  'find',
  'findIndex',
  'findLast',
  'flatMap',
  'flat',
]);

const SUPERSCRIPTS: Record<number, string> = {
  2: '²',
  3: '³',
  4: '⁴',
  5: '⁵',
  6: '⁶',
};

function isLoopStatement(node: ts.Node): boolean {
  return (
    ts.isForStatement(node) ||
    ts.isForInStatement(node) ||
    ts.isForOfStatement(node) ||
    ts.isWhileStatement(node) ||
    ts.isDoStatement(node)
  );
}

function isIterationCall(node: ts.Node): boolean {
  if (!ts.isCallExpression(node)) {
    return false;
  }
  const callee = node.expression;
  return ts.isPropertyAccessExpression(callee) && ITERATION_METHODS.has(callee.name.text);
}

function isSortCall(node: ts.Node): boolean {
  return (
    ts.isCallExpression(node) &&
    ts.isPropertyAccessExpression(node.expression) &&
    node.expression.name.text === 'sort'
  );
}

/** Detect a "search space halves each step" pattern: `/ 2`, `/= 2`, `>> 1`, `(lo+hi)/2`. */
function isHalving(node: ts.Node): boolean {
  if (!ts.isBinaryExpression(node)) {
    return false;
  }
  const op = node.operatorToken.kind;
  if (op === ts.SyntaxKind.SlashToken || op === ts.SyntaxKind.SlashEqualsToken) {
    const right = node.right;
    if (ts.isNumericLiteral(right) && right.text === '2') {
      return true;
    }
    if (ts.isParenthesizedExpression(right)) {
      return true;
    }
  }
  if (op === ts.SyntaxKind.GreaterThanGreaterThanToken) {
    const right = node.right;
    if (ts.isNumericLiteral(right) && right.text === '1') {
      return true;
    }
  }
  return false;
}

function isFunctionLike(node: ts.Node): boolean {
  return (
    ts.isFunctionDeclaration(node) ||
    ts.isFunctionExpression(node) ||
    ts.isArrowFunction(node) ||
    ts.isMethodDeclaration(node)
  );
}

/** Names a function can be called by from inside itself (its own name). */
function selfNames(fn: ts.Node): Set<string> {
  const names = new Set<string>();
  if (
    (ts.isFunctionDeclaration(fn) || ts.isMethodDeclaration(fn)) &&
    fn.name &&
    ts.isIdentifier(fn.name)
  ) {
    names.add(fn.name.text);
  }
  const parent = fn.parent;
  if (parent && ts.isVariableDeclaration(parent) && ts.isIdentifier(parent.name)) {
    names.add(parent.name.text);
  }
  return names;
}

interface FnAnalysis {
  depth: number;
  sort: boolean;
  halving: boolean;
  recursive: boolean;
}

function analyzeFunction(fn: ts.Node): FnAnalysis {
  const names = selfNames(fn);
  let depth = 0;
  let maxDepth = 0;
  let sort = false;
  let halving = false;
  let recursive = false;

  const visit = (node: ts.Node) => {
    const entered = isLoopStatement(node) || isIterationCall(node);
    if (entered) {
      depth += 1;
      if (depth > maxDepth) {
        maxDepth = depth;
      }
    }
    if (isSortCall(node)) {
      sort = true;
    }
    if (isHalving(node)) {
      halving = true;
    }
    if (ts.isCallExpression(node)) {
      const callee = node.expression;
      // a self-call: bare `foo()` or `this.foo()` — not `obj.foo()` (which would
      // false-positive on names that collide with library methods, e.g. Map.get)
      if (ts.isIdentifier(callee) && names.has(callee.text)) {
        recursive = true;
      } else if (
        ts.isPropertyAccessExpression(callee) &&
        callee.expression.kind === ts.SyntaxKind.ThisKeyword &&
        names.has(callee.name.text)
      ) {
        recursive = true;
      }
    }
    ts.forEachChild(node, visit);
    if (entered) {
      depth -= 1;
    }
  };
  ts.forEachChild(fn, visit);

  return { depth: maxDepth, sort, halving, recursive };
}

/**
 * Estimate the time complexity of a solution from its syntax tree. This is a
 * heuristic — it counts loop/iteration nesting, `sort`, halving loops and
 * recursion; it cannot see through data structures or amortization, so the
 * result is deliberately labelled with a confidence.
 */
export function analyzeSource(source: string, fileName = 'exercise.ts'): ComplexityResult {
  const sourceFile = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  const analyses: FnAnalysis[] = [];
  const collect = (node: ts.Node) => {
    if (isFunctionLike(node)) {
      analyses.push(analyzeFunction(node));
    }
    ts.forEachChild(node, collect);
  };
  collect(sourceFile);

  if (analyses.length === 0) {
    return { label: 'O(1)', confidence: 'low', detail: 'no functions found' };
  }

  const maxDepth = Math.max(...analyses.map((a) => a.depth));
  const anySort = analyses.some((a) => a.sort);
  const anyHalving = analyses.some((a) => a.halving);
  const anyRecursive = analyses.some((a) => a.recursive);

  let label: string;
  if (maxDepth === 0) {
    if (anySort) {
      label = 'O(n log n)';
    } else if (anyHalving) {
      label = 'O(log n)';
    } else if (anyRecursive) {
      label = 'O(?)';
    } else {
      label = 'O(1)';
    }
  } else if (maxDepth === 1) {
    if (anyHalving) {
      label = 'O(log n)';
    } else if (anySort) {
      label = 'O(n log n)';
    } else {
      label = 'O(n)';
    }
  } else {
    label = `O(n${SUPERSCRIPTS[maxDepth] ?? `^${maxDepth}`})`;
  }

  let confidence: Confidence = maxDepth <= 1 ? 'high' : 'medium';
  // a sort combined with loops can hide extra factors the heuristic can't see
  if (anySort && maxDepth >= 1) {
    confidence = 'medium';
  }
  if (anyRecursive || maxDepth >= 3) {
    confidence = 'low';
  }

  const bits: string[] = [];
  bits.push(
    maxDepth === 0 ? 'no loops detected' : `${maxDepth} nesting level${maxDepth === 1 ? '' : 's'}`,
  );
  if (anySort) {
    bits.push('uses sort');
  }
  if (anyHalving) {
    bits.push('halving loop');
  }
  if (anyRecursive) {
    bits.push('recursion');
  }

  return { label, confidence, detail: bits.join(' · ') };
}

/** Read an exercise's solution and estimate its time complexity. */
export async function analyzeSolutionComplexity(
  exercise: Exercise,
  exercisesDir: string,
): Promise<ComplexityResult | null> {
  try {
    const file = path.join(exerciseDir(exercise.id, exercisesDir), 'exercise.ts');
    const source = await fs.readFile(file, 'utf-8');
    return analyzeSource(source, `${exercise.id}.ts`);
  } catch {
    return null;
  }
}
