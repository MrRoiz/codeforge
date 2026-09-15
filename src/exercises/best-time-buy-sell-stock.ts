import type { Exercise } from '@exercises/types';

export const bestTimeBuySellStock: Exercise = {
  id: 'best-time-buy-sell-stock',
  validation: [{ level: 'reported', source: 'GoDaddy' }],
  name: 'Best Time to Buy and Sell Stock',
  createdAt: '2026-09-14',
  difficulty: 'easy',
  type: 'Arrays + Greedy',
  time: '15-20 min',
  description:
    'Given an array `prices` where prices[i] is the price of a stock on day i, choose one day to buy and a different later day to sell to maximize profit. Return the maximum profit; return 0 if no profit is possible.',
  examples: [
    {
      input: 'prices = [7, 1, 5, 3, 6, 4]',
      output: '5',
      explanation: 'Buy at price 1 (day 2) and sell at price 6 (day 5) → profit 5.',
    },
    {
      input: 'prices = [7, 6, 4, 3, 1]',
      output: '0',
      explanation: 'Prices only fall, so no profitable trade is possible — return 0.',
    },
  ],
  constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
  functionSignature: 'export function maxProfit(prices: number[]): number',
  hints: [
    'Track the minimum price seen so far',
    'At each day, calculate the profit if sold today',
    'Keep the maximum profit seen so far',
  ],
  tests: [
    { input: [[7, 1, 5, 3, 6, 4]], expected: 5 },
    { input: [[7, 6, 4, 3, 1]], expected: 0 },
    { input: [[1, 2, 3, 4, 5]], expected: 4 },
    { input: [[5, 4, 3, 2, 1]], expected: 0 },
    { input: [[2, 1, 2, 1, 0, 1, 2]], expected: 2 },
    { input: [[1]], expected: 0 },
  ],
};