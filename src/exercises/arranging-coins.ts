import type { Exercise } from '@exercises/types';

export const arrangingCoins: Exercise = {
  id: 'arranging-coins',
  validation: [{ level: 'reported', source: 'GoDaddy' }],
  name: 'Arranging Coins',
  createdAt: '2026-09-14',
  difficulty: 'easy',
  type: 'Math + Binary Search',
  time: '15-20 min',
  description:
    'You have n coins and want to build a staircase where the ith row has exactly i coins. The last row may be incomplete. Given n, return the number of complete rows.',
  examples: [
    { input: 'n = 5', output: '2', explanation: 'Rows: 1 + 2 coins, 2 left over (row 3 incomplete)' },
    { input: 'n = 8', output: '3', explanation: 'Rows: 1 + 2 + 3 coins, 2 left over' },
  ],
  constraints: ['1 <= n <= 2^31 - 1'],
  functionSignature: 'export function arrangeCoins(n: number): number',
  hints: [
    'Sum of the first k rows = k(k+1)/2',
    'Find the largest k such that k(k+1)/2 <= n',
    'Can be solved with binary search in O(log n), or the quadratic formula in O(1)',
  ],
  tests: {
    cases: [
      { input: [5], expected: 2 },
      { input: [8], expected: 3 },
      { input: [1], expected: 1 },
      { input: [3], expected: 2 },
      { input: [6], expected: 3 },
      { input: [10], expected: 4 },
      { input: [1804289383], expected: 60070 },
    ],
  },
};