import type { Exercise } from '@exercises/types';

export const sqrtX: Exercise = {
  id: 'sqrt-x',
  name: 'Sqrt(x)',
  createdAt: '2026-09-15',
  difficulty: 'easy',
  type: 'Math + Binary Search',
  time: '10-15 min',
  description:
    'Given a non-negative integer `x`, return the square root of `x` rounded down to the nearest integer. The returned integer should be non-negative as well. You must not use any built-in exponent function or operator (for example, `pow(x, 0.5)` or `x ** 0.5`).',
  examples: [
    {
      input: 'x = 4',
      output: '2',
      explanation: 'The square root of 4 is 2, so we return 2.',
    },
    {
      input: 'x = 8',
      output: '2',
      explanation: 'The square root of 8 is 2.828..., and since we round down, we return 2.',
    },
  ],
  constraints: ['0 <= x <= 2^31 - 1'],
  functionSignature: 'export function mySqrt(x: number): number',
  hints: [
    'Binary search the answer in the range [0, x]',
    'Find the largest k such that k * k <= x',
    'Use mid <= x / mid instead of mid * mid <= x to avoid overflow',
  ],
  tests: {
    cases: [
      { input: [4], expected: 2 },
      { input: [8], expected: 2 },
      { input: [0], expected: 0 },
      { input: [1], expected: 1 },
      { input: [2], expected: 1 },
      { input: [3], expected: 1 },
      { input: [9], expected: 3 },
      { input: [2147395599], expected: 46339 },
      { input: [2147483647], expected: 46340 },
    ],
  },
};
