import assert from 'node:assert/strict';
import { test } from 'node:test';
import { complexityRank } from '../state/index.js';
import {
  analyzeSource,
  BIG_O,
  DIMENSION_SEPARATOR,
  formatBigO,
  powerOfN,
  superscript,
} from './index.js';

const TWO_DIMENSIONS = /2 dimensions/;

const product = (...symbols: string[]): string => formatBigO(symbols.join(DIMENSION_SEPARATOR));

const CONSTANT = BIG_O.constant;
const LOGARITHMIC = BIG_O.logarithmic;
const LINEAR = BIG_O.linear;
const LINEARITHMIC = BIG_O.linearithmic;
const UNKNOWN = BIG_O.unknown;
const QUADRATIC = powerOfN(2);
const N_M = product('n', 'm');
const N_M_K = product('n', 'm', 'k');
const N_SQUARED_M = product(`n${superscript(2)}`, 'm');
const DANGLING_PRODUCT = formatBigO(`n${DIMENSION_SEPARATOR}`);

const label = (source: string): string => analyzeSource(source, 'test.ts').label;

const LCP_VERTICAL_SCAN = `
export function longestCommonPrefix(strs: string[]): string {
  let prefix = "";
  let index = 0;
  while (true) {
    const letter = strs[0].at(index);
    if (!letter) break;
    const allHasIt = strs.every((str) => str.at(index) === letter);
    if (!allHasIt) break;
    prefix += letter;
    index++;
  }
  return prefix;
}
`;

const MATRIX_SCAN = `
export function sumMatrix(matrix: number[][]): number {
  let sum = 0;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      sum += matrix[i][j];
    }
  }
  return sum;
}
`;

const DISTINCT_FOR_OF = `
export function cross(xs: number[], ys: number[]): void {
  for (const x of xs) {
    for (const y of ys) {
      void x;
      void y;
    }
  }
}
`;

const SAME_FOR_OF = `
export function square(xs: number[]): void {
  for (const x of xs) {
    for (const y of xs) {
      void x;
      void y;
    }
  }
}
`;

const TRIPLE_DISTINCT = `
export function cube(xs: number[], ys: number[], zs: number[]): void {
  for (const x of xs) {
    for (const y of ys) {
      for (const z of zs) {
        void x;
        void y;
        void z;
      }
    }
  }
}
`;

const SEQUENTIAL = `
export function concat(xs: number[], ys: number[]): void {
  for (const x of xs) {
    void x;
  }
  for (const y of ys) {
    void y;
  }
}
`;

const NESTED_SAME_INDEX = `
export function bubble(arr: number[]): void {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        const tmp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = tmp;
      }
    }
  }
}
`;

const DERIVED_VIEW = `
export function pivotIndex(nums: number[]): number {
  let leftSum = 0;
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    const rightNumbers = nums.slice(i + 1);
    const rightSum = rightNumbers.reduce((carry, current) => carry + current, 0);
    if (leftSum === rightSum) return i;
    leftSum += num;
  }
  return -1;
}
`;

const DISTINCT_LENGTH = `
export function ranges(xs: number[], ys: number[]): void {
  for (let i = 0; i < xs.length; i++) {
    for (let j = 0; j < ys.length; j++) {
      void i;
      void j;
    }
  }
}
`;

const DISTINCT_INDEXED = `
export function crossIndexed(xs: number[], ys: number[]): void {
  let i = 0;
  while (true) {
    if (xs[i] === undefined) break;
    let j = 0;
    while (true) {
      if (ys[j] === undefined) break;
      j++;
    }
    i++;
  }
}
`;

const DISTINCT_AT = `
export function crossAt(xs: string, ys: string): void {
  let i = 0;
  while (true) {
    if (!xs.at(i)) break;
    let j = 0;
    while (true) {
      if (!ys.at(j)) break;
      j++;
    }
    i++;
  }
}
`;

const SAME_LENGTH_AND_AT = `
export function scanAt(xs: number[]): void {
  for (let i = 0; i < xs.length; i++) {
    let j = 0;
    while (true) {
      if (!xs.at(j)) break;
      j++;
    }
    void i;
  }
}
`;

const SAME_LENGTH_AND_INDEXED = `
export function scanIndexed(xs: number[]): void {
  for (let i = 0; i < xs.length; i++) {
    let j = 0;
    while (true) {
      if (!xs[j]) break;
      j++;
    }
    void i;
  }
}
`;

const BINARY_SEARCH = `
export function search(xs: number[], target: number): number {
  let lo = 0;
  let hi = xs.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (xs[mid] === target) return mid;
    if (xs[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
`;

const SORT_ONLY = `
export function ordered(xs: number[]): number[] {
  return [...xs].sort((a, b) => a - b);
}
`;

const RECURSION_ONLY = `
export function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
`;

const NO_LOOPS = `
export function identity(n: number): number {
  return n + 1;
}
`;

test('single-variable estimates are unchanged', () => {
  assert.equal(label(NO_LOOPS), CONSTANT);
  assert.equal(label(SORT_ONLY), LINEARITHMIC);
  assert.equal(label(BINARY_SEARCH), LOGARITHMIC);
  assert.equal(label(RECURSION_ONLY), UNKNOWN);
  assert.equal(label(SEQUENTIAL), LINEAR);
});

test('nested iterations over the same collection stay O(n²)', () => {
  assert.equal(label(SAME_FOR_OF), QUADRATIC);
  assert.equal(label(NESTED_SAME_INDEX), QUADRATIC);
  assert.equal(label(DERIVED_VIEW), QUADRATIC);
});

test('nested iterations over different collections become multi-variable', () => {
  assert.equal(label(DISTINCT_FOR_OF), N_M);
  assert.equal(label(TRIPLE_DISTINCT), N_M_K);
  assert.equal(label(MATRIX_SCAN), N_M);
});

test('index/while scans resolve their iterated dimension', () => {
  assert.equal(label(LCP_VERTICAL_SCAN), N_M);
});

test('each index-inference path resolves the right dimension', () => {
  assert.equal(label(DISTINCT_LENGTH), N_M);
  assert.equal(label(DISTINCT_INDEXED), N_M);
  assert.equal(label(DISTINCT_AT), N_M);
  assert.equal(label(SAME_LENGTH_AND_AT), QUADRATIC);
  assert.equal(label(SAME_LENGTH_AND_INDEXED), QUADRATIC);
});

test('reports multi-dimension detail and confidence', () => {
  const result = analyzeSource(LCP_VERTICAL_SCAN, 'test.ts');
  assert.equal(result.label, N_M);
  assert.equal(result.confidence, 'medium');
  assert.match(result.detail, TWO_DIMENSIONS);
});

test('multi-variable labels rank just below the same-degree single variable', () => {
  assert.equal(complexityRank(LINEARITHMIC), 3);
  assert.equal(complexityRank(QUADRATIC), 4);
  assert.equal(complexityRank(N_M), 3.5);
  assert.equal(complexityRank(N_SQUARED_M), 4.5);
  assert.ok(
    (complexityRank(LINEARITHMIC) ?? 0) < (complexityRank(N_M) ?? 0),
    'n·m is worse than n log n',
  );
  assert.ok((complexityRank(N_M) ?? 0) < (complexityRank(QUADRATIC) ?? 0), 'n·m is better than n²');
});

test('unknown labels still rank as unordered', () => {
  assert.equal(complexityRank(UNKNOWN), null);
  assert.equal(complexityRank('nonsense'), null);
  assert.equal(complexityRank(DANGLING_PRODUCT), null);
});

test('notation constants keep their canonical, persisted values', () => {
  assert.deepEqual(
    { ...BIG_O, quadratic: QUADRATIC, product: N_M },
    {
      constant: 'O(1)',
      logarithmic: 'O(log n)',
      linear: 'O(n)',
      linearithmic: 'O(n log n)',
      unknown: 'O(?)',
      quadratic: 'O(n²)',
      product: 'O(n·m)',
    },
  );
});
