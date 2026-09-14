import type { Exercise } from '@exercises/types';

export const perfectSquares: Exercise = {
  id: 'perfect-squares',
  name: 'Perfect Squares',
  difficulty: 'medium',
  type: 'Dynamic Programming',
  time: '20-25 min',
  description:
    'Given an integer `n`, return the least number of perfect square numbers that sum to `n`. A perfect square is an integer that is the square of an integer.',
  examples: [
    { input: 'n = 12', output: '3', explanation: '12 = 4 + 4 + 4' },
    { input: 'n = 13', output: '2', explanation: '13 = 4 + 9' },
  ],
  constraints: ['1 <= n <= 10^4'],
  functionSignature: 'export function numSquares(n: number): number',
  hints: [
    'Let dp[i] be the fewest squares summing to i',
    'For each i, try every square j*j <= i: dp[i] = min(dp[i], dp[i - j*j] + 1)',
    'Base case: dp[0] = 0',
  ],
  tests: [
    { input: [1], expected: 1 },
    { input: [12], expected: 3 },
    { input: [13], expected: 2 },
    { input: [10], expected: 2 },
    { input: [16], expected: 1 },
    { input: [18], expected: 2 },
    { input: [7], expected: 4 },
    { input: [100], expected: 1 },
  ],
};
