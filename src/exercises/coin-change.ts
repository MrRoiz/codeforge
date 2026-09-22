import type { Exercise } from '@exercises/types';

export const coinChange: Exercise = {
  id: 'coin-change',
  name: 'Coin Change',
  createdAt: '2026-09-21',
  difficulty: 'medium',
  type: 'Dynamic Programming',
  time: '20-25 min',
  description:
    'You are given an array `coins` of distinct denominations and an integer `amount`. Return the fewest number of coins needed to make up exactly `amount`, or -1 if the amount cannot be formed. You have an unlimited supply of each coin.',
  examples: [
    {
      input: 'coins = [1,2,5], amount = 11',
      output: '3',
      explanation: '11 = 5 + 5 + 1',
    },
    {
      input: 'coins = [2], amount = 3',
      output: '-1',
      explanation: 'An odd amount cannot be formed from 2s alone.',
    },
    { input: 'coins = [1], amount = 0', output: '0' },
  ],
  constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
  functionSignature: 'export function coinChange(coins: number[], amount: number): number',
  hints: [
    'Define dp[a] as the fewest coins to make amount a',
    'Base case: dp[0] = 0; every other entry starts at infinity',
    'For each amount, try every coin: dp[a] = min(dp[a], dp[a - coin] + 1)',
    'Return -1 when dp[amount] is still infinity',
  ],
  tests: {
    cases: [
      { input: [[1, 2, 5], 11], expected: 3 },
      { input: [[2], 3], expected: -1 },
      { input: [[1], 0], expected: 0 },
      { input: [[1], 1], expected: 1 },
      { input: [[2, 5, 10, 1], 27], expected: 4 },
      { input: [[186, 419, 83, 408], 6249], expected: 20 },
      { input: [[2, 4], 7], expected: -1 },
      { input: [[1, 5, 10, 25], 63], expected: 6 },
    ],
  },
};
