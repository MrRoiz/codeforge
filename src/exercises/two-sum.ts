import type { Exercise } from '@exercises/types';

export const twoSum: Exercise = {
  id: 'two-sum',
  name: 'Two Sum',
  createdAt: '2026-09-14',
  difficulty: 'easy',
  type: 'Arrays + Hashing',
  time: '15-20 min',
  description:
    'Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice. Return the answer in any order.',
  examples: [
    {
      input: 'nums = [2, 7, 11, 15], target = 9',
      output: '[0, 1]',
      explanation: 'nums[0] + nums[1] = 2 + 7 = 9',
    },
    { input: 'nums = [3, 2, 4], target = 6', output: '[1, 2]' },
    { input: 'nums = [3, 3], target = 6', output: '[0, 1]' },
  ],
  constraints: [
    '2 <= nums.length <= 10^4',
    '-10^9 <= nums[i] <= 10^9',
    '-10^9 <= target <= 10^9',
    'Only one valid answer exists',
  ],
  functionSignature: 'export function twoSum(nums: number[], target: number): number[]',
  hints: [
    'Brute force: check every pair - O(n^2)',
    'Use a hashmap to store seen numbers and their indices',
    'For each number, check if `target - num` exists in the hashmap',
  ],
  tests: {
    cases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1], sorted: true },
      { input: [[3, 2, 4], 6], expected: [1, 2], sorted: true },
      { input: [[3, 3], 6], expected: [0, 1], sorted: true },
      { input: [[1, 2, 3, 4, 5], 9], expected: [3, 4], sorted: true },
      { input: [[-1, -2, -3, -4, -5], -8], expected: [2, 4], sorted: true },
      { input: [[5, 75, 25], 100], expected: [1, 2], sorted: true },
    ],
  },
};
