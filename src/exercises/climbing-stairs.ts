import type { Exercise } from '@exercises/types';

export const climbingStairs: Exercise = {
  id: 'climbing-stairs',
  name: 'Climbing Stairs',
  createdAt: '2026-09-15',
  difficulty: 'easy',
  type: 'Dynamic Programming',
  time: '10-15 min',
  description:
    'You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?',
  examples: [
    {
      input: 'n = 2',
      output: '2',
      explanation: 'Two ways: 1 + 1, or 2',
    },
    {
      input: 'n = 3',
      output: '3',
      explanation: 'Three ways: 1 + 1 + 1, 1 + 2, 2 + 1',
    },
  ],
  constraints: ['1 <= n <= 45'],
  functionSignature: 'export function climbStairs(n: number): number',
  hints: [
    'To reach step n you came from step n-1 (a 1-step) or step n-2 (a 2-step)',
    'ways(n) = ways(n - 1) + ways(n - 2) — this is Fibonacci',
    'The base cases are ways(1) = 1 and ways(2) = 2',
  ],
  tests: {
    cases: [
      { input: [1], expected: 1 },
      { input: [2], expected: 2 },
      { input: [3], expected: 3 },
      { input: [4], expected: 5 },
      { input: [5], expected: 8 },
      { input: [10], expected: 89 },
      { input: [45], expected: 1836311903 },
    ],
  },
};
