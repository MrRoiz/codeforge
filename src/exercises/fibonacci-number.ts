import type { Exercise } from '@exercises/types';

export const fibonacciNumber: Exercise = {
  id: 'fibonacci-number',
  name: 'Fibonacci Number',
  createdAt: '2026-09-15',
  difficulty: 'easy',
  type: 'Recursion / DP',
  time: '10-15 min',
  description:
    'The Fibonacci numbers, commonly denoted `F(n)`, form a sequence where each number is the sum of the two preceding ones, starting from `0` and `1`: F(0) = 0, F(1) = 1, and F(n) = F(n - 1) + F(n - 2) for n > 1. Given `n`, calculate `F(n)`.',
  examples: [
    { input: 'n = 2', output: '1', explanation: 'F(2) = F(1) + F(0) = 1 + 0 = 1' },
    { input: 'n = 4', output: '3', explanation: 'F(4) = F(3) + F(2) = 2 + 1 = 3' },
  ],
  constraints: ['0 <= n <= 30'],
  functionSignature: 'export function fib(n: number): number',
  hints: [
    'The recurrence is directly given — start there',
    'Naive recursion is exponential; memoize or build bottom-up',
    'You only ever need the previous two values, so O(1) space is possible',
  ],
  tests: {
    cases: [
      { input: [0], expected: 0 },
      { input: [1], expected: 1 },
      { input: [2], expected: 1 },
      { input: [3], expected: 2 },
      { input: [4], expected: 3 },
      { input: [5], expected: 5 },
      { input: [10], expected: 55 },
      { input: [30], expected: 832040 },
    ],
  },
};
