import fs from 'node:fs/promises';
import * as path from 'node:path';
import type { Exercise } from '@exercises/types';
import { exerciseDir } from '@utils/generate';
import ts from 'typescript';

export type Confidence = 'low' | 'medium' | 'high';

export interface ComplexityResult {
  /** rough growth class, e.g. "O(n)", "O(n²)", "O(n·m)" */
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

/** Canonical growth classes the analyzer emits. */
export const BIG_O = {
  constant: 'O(1)',
  logarithmic: 'O(log n)',
  linear: 'O(n)',
  linearithmic: 'O(n log n)',
  unknown: 'O(?)',
} as const;

export const BIG_O_PREFIX = 'O(';
export const BIG_O_SUFFIX = ')';

/** Separator between dimensions in a product label, e.g. `n·m`. */
export const DIMENSION_SEPARATOR = '·';

/** Wrap an inner term in Big-O notation: `n²·m` → `O(n²·m)`. */
export function formatBigO(inner: string): string {
  return `${BIG_O_PREFIX}${inner}${BIG_O_SUFFIX}`;
}

/** Superscript glyph for an exponent: 2 → `²`. */
export function superscript(exponent: number): string {
  return SUPERSCRIPTS[exponent] ?? `^${exponent}`;
}

/** Label for a power of n: 2 → `O(n²)`. */
export function powerOfN(exponent: number): string {
  return formatBigO(`n${superscript(exponent)}`);
}

/** Inverse of `SUPERSCRIPTS`: a superscript glyph back to its exponent. */
export function superscriptExponent(glyph: string): number | undefined {
  for (const [exponent, symbol] of Object.entries(SUPERSCRIPTS)) {
    if (symbol === glyph) {
      return Number(exponent);
    }
  }
  return undefined;
}

// dimension symbols, assigned in order of first appearance
const SYMBOL_NAMES = ['n', 'm', 'k', 'j', 'p', 'q'];

// loops whose iterated collection can't be inferred share this dimension so
// nesting them keeps behaving like the single-variable estimate
const UNKNOWN_DIMENSION = '?';

const WHITESPACE = /\s+/g;

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

function isAssignment(kind: ts.SyntaxKind): boolean {
  return kind >= ts.SyntaxKind.FirstAssignment && kind <= ts.SyntaxKind.LastAssignment;
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

/** Compact source text of an expression, used as a dimension identity. */
function normExpr(node: ts.Node): string {
  return node.getText().replace(WHITESPACE, '');
}

// method calls that hand back a view of the same collection, so iterating the
// result is still the same dimension as iterating the original (e.g. a slice)
const DERIVED_COLLECTION_METHODS = new Set([
  'slice',
  'splice',
  'subarray',
  'concat',
  'map',
  'filter',
  'flat',
  'flatMap',
  'sort',
  'toSorted',
  'reverse',
  'toReversed',
  'toSpliced',
  'with',
  'fill',
  'copyWithin',
  'values',
  'keys',
  'entries',
]);

/**
 * Identify the collection a dimension belongs to. Indexing yields an element
 * (a different dimension — `strs[0]` vs `strs`), but calling a method that
 * returns a view of the same collection does not (`nums.slice(1)` vs `nums`).
 * Local aliases are followed so `const rest = nums.slice(1); rest.reduce(...)`
 * still resolves back to `nums`.
 */
function dimensionIdentity(node: ts.Node, aliases: Map<string, string>): string {
  if (ts.isIdentifier(node)) {
    const alias = aliases.get(node.text);
    if (alias !== undefined) {
      return alias;
    }
  }
  if (
    ts.isCallExpression(node) &&
    ts.isPropertyAccessExpression(node.expression) &&
    DERIVED_COLLECTION_METHODS.has(node.expression.name.text)
  ) {
    return dimensionIdentity(node.expression.expression, aliases);
  }
  return normExpr(node);
}

/** Map local `const`/`let` names to the collection dimension they hold. */
function collectAliases(fn: ts.Node): Map<string, string> {
  const aliases = new Map<string, string>();
  const visit = (node: ts.Node) => {
    if (node !== fn && isFunctionLike(node)) {
      return;
    }
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
      const identity = dimensionIdentity(node.initializer, aliases);
      if (identity !== node.name.text) {
        aliases.set(node.name.text, identity);
      }
    }
    ts.forEachChild(node, visit);
  };
  ts.forEachChild(fn, visit);
  return aliases;
}

/** Variables a loop drives, either declared in its header or reassigned in its body. */
function loopCounters(loop: ts.Node): Set<string> {
  const names = new Set<string>();
  if (
    ts.isForStatement(loop) &&
    loop.initializer &&
    ts.isVariableDeclarationList(loop.initializer)
  ) {
    for (const decl of loop.initializer.declarations) {
      if (ts.isIdentifier(decl.name)) {
        names.add(decl.name.text);
      }
    }
  }
  const visit = (node: ts.Node) => {
    if (node !== loop && isFunctionLike(node)) {
      return;
    }
    if (ts.isPrefixUnaryExpression(node) || ts.isPostfixUnaryExpression(node)) {
      if (ts.isIdentifier(node.operand)) {
        names.add(node.operand.text);
      }
    } else if (
      ts.isBinaryExpression(node) &&
      isAssignment(node.operatorToken.kind) &&
      ts.isIdentifier(node.left)
    ) {
      names.add(node.left.text);
    }
    ts.forEachChild(node, visit);
  };
  ts.forEachChild(loop, visit);
  return names;
}

interface KeyCandidate {
  key: string;
  score: number;
}

/** `x.length` compared against a bare identifier — the collection indexed by that loop. */
function lengthComparedContainer(node: ts.BinaryExpression): ts.Node | null {
  const { left, right } = node;
  if (
    ts.isPropertyAccessExpression(left) &&
    left.name.text === 'length' &&
    ts.isIdentifier(right)
  ) {
    return left.expression;
  }
  if (
    ts.isPropertyAccessExpression(right) &&
    right.name.text === 'length' &&
    ts.isIdentifier(left)
  ) {
    return right.expression;
  }
  return null;
}

/**
 * Infer the dimension a `for`/`while`/`do` loop walks: the collection it indexes
 * with its counter (`arr[i]`, `str.at(i)`, `i < arr.length`). A counter match
 * scores highest so a matrix loop prefers its own axis over a nested one.
 */
function inferIndexKey(loop: ts.Node, aliases: Map<string, string>): string | null {
  const counters = loopCounters(loop);
  const candidates: KeyCandidate[] = [];
  const consider = (container: ts.Node, indexName: string | null) => {
    const score = indexName !== null && counters.has(indexName) ? 3 : 1;
    candidates.push({ key: dimensionIdentity(container, aliases), score });
  };

  const visit = (node: ts.Node) => {
    if (node !== loop && isFunctionLike(node)) {
      return;
    }
    if (ts.isElementAccessExpression(node) && ts.isIdentifier(node.argumentExpression)) {
      consider(node.expression, node.argumentExpression.text);
    }
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
      const method = node.expression.name.text;
      const first = node.arguments[0];
      if ((method === 'at' || method === 'charAt') && first && ts.isIdentifier(first)) {
        consider(node.expression.expression, first.text);
      }
    }
    if (ts.isBinaryExpression(node)) {
      const container = lengthComparedContainer(node);
      if (container) {
        consider(container, null);
      }
    }
    ts.forEachChild(node, visit);
  };
  ts.forEachChild(loop, visit);

  let best: KeyCandidate | null = null;
  for (const candidate of candidates) {
    if (best === null || candidate.score > best.score) {
      best = candidate;
    }
  }
  return best === null ? null : best.key;
}

/** The dimension a loop or iteration walks. */
function loopKey(node: ts.Node, aliases: Map<string, string>): string {
  if (ts.isCallExpression(node) && isIterationCall(node)) {
    const callee = node.expression as ts.PropertyAccessExpression;
    return dimensionIdentity(callee.expression, aliases);
  }
  if (ts.isForOfStatement(node) || ts.isForInStatement(node)) {
    return dimensionIdentity(node.expression, aliases);
  }
  return inferIndexKey(node, aliases) ?? UNKNOWN_DIMENSION;
}

/** Prefer the longer chain; on a tie, the one touching more dimensions. */
function isBetterChain(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) {
    return a.length > b.length;
  }
  return new Set(a).size > new Set(b).size;
}

/** Turn a chain of dimension keys into a product label like `n²·m`. */
function productLabel(chain: readonly string[]): string {
  const order: string[] = [];
  const counts = new Map<string, number>();
  for (const key of chain) {
    if (!counts.has(key)) {
      order.push(key);
    }
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return order
    .map((key, i) => {
      const name = SYMBOL_NAMES[i] ?? `s${i}`;
      const count = counts.get(key) ?? 1;
      if (count === 1) {
        return name;
      }
      return `${name}${superscript(count)}`;
    })
    .join(DIMENSION_SEPARATOR);
}

interface FnAnalysis {
  /** dimension keys along the deepest nesting path */
  chain: string[];
  sort: boolean;
  halving: boolean;
  recursive: boolean;
}

function analyzeFunction(fn: ts.Node): FnAnalysis {
  const names = selfNames(fn);
  const aliases = collectAliases(fn);
  const stack: string[] = [];
  let best: string[] = [];
  let sort = false;
  let halving = false;
  let recursive = false;

  const visit = (node: ts.Node) => {
    const entered = isLoopStatement(node) || isIterationCall(node);
    if (entered) {
      stack.push(loopKey(node, aliases));
      if (isBetterChain(stack, best)) {
        best = stack.slice();
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
      stack.pop();
    }
  };
  ts.forEachChild(fn, visit);

  return { chain: best, sort, halving, recursive };
}

/**
 * Estimate the time complexity of a solution from its syntax tree. This is a
 * heuristic — it walks loops and array methods, tagging each with the dimension
 * it iterates so nesting over different collections yields `O(n·m)` rather than
 * collapsing to `O(n²)`. It also notices `sort`, halving loops and recursion; it
 * cannot see through data structures or amortization, so the result is
 * deliberately labelled with a confidence.
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
    return { label: BIG_O.constant, confidence: 'low', detail: 'no functions found' };
  }

  let chain: string[] = [];
  for (const analysis of analyses) {
    if (isBetterChain(analysis.chain, chain)) {
      chain = analysis.chain;
    }
  }
  const depth = chain.length;
  const dimensions = new Set(chain).size;
  const anySort = analyses.some((a) => a.sort);
  const anyHalving = analyses.some((a) => a.halving);
  const anyRecursive = analyses.some((a) => a.recursive);

  let label: string;
  if (depth === 0) {
    if (anySort) {
      label = BIG_O.linearithmic;
    } else if (anyHalving) {
      label = BIG_O.logarithmic;
    } else if (anyRecursive) {
      label = BIG_O.unknown;
    } else {
      label = BIG_O.constant;
    }
  } else if (depth === 1) {
    if (anyHalving) {
      label = BIG_O.logarithmic;
    } else if (anySort) {
      label = BIG_O.linearithmic;
    } else {
      label = BIG_O.linear;
    }
  } else {
    label = formatBigO(productLabel(chain));
  }

  let confidence: Confidence = depth <= 1 ? 'high' : 'medium';
  // a sort combined with loops can hide extra factors the heuristic can't see
  if (anySort && depth >= 1) {
    confidence = 'medium';
  }
  if (anyRecursive || depth >= 3) {
    confidence = 'low';
  }

  const bits: string[] = [];
  bits.push(depth === 0 ? 'no loops detected' : `${depth} nesting level${depth === 1 ? '' : 's'}`);
  if (dimensions > 1) {
    bits.push(`${dimensions} dimensions`);
  }
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
