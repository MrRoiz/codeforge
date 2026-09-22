import type { Exercise } from '@exercises/types';

export const lengthOfLIS: Exercise = {
  id: 'longest-increasing-subsequence',
  name: 'Longest Increasing Subsequence',
  createdAt: '2026-09-21',
  difficulty: 'medium',
  type: 'Dynamic Programming',
  time: '20-25 min',
  description:
    'Given an integer array `nums`, return the length of the longest strictly increasing subsequence. A subsequence keeps the relative order of elements but may delete any number of them. The elements of the subsequence must be strictly increasing.',
  examples: [
    {
      input: 'nums = [10,9,2,5,3,7,101,18]',
      output: '4',
      explanation: 'One longest subsequence is [2,3,7,101] (also [2,3,7,18]).',
    },
    {
      input: 'nums = [0,1,0,3,2,3]',
      output: '4',
      explanation: 'One longest subsequence is [0,1,2,3].',
    },
    { input: 'nums = [7,7,7,7,7]', output: '1' },
  ],
  constraints: [
    '1 <= nums.length <= 2500',
    '-10^4 <= nums[i] <= 10^4',
    'O(n^2) DP is acceptable; O(n log n) is the follow-up',
  ],
  functionSignature: 'export function lengthOfLIS(nums: number[]): number',
  hints: [
    'Define dp[i] as the length of the LIS ending exactly at index i',
    'dp[i] = 1 + max(dp[j]) over all j < i with nums[j] < nums[i]',
    'The answer is the maximum over all dp[i]',
    'For O(n log n), keep a sorted array of the smallest tails of increasing runs',
  ],
  tests: {
    cases: [
      { input: [[10, 9, 2, 5, 3, 7, 101, 18]], expected: 4 },
      { input: [[0, 1, 0, 3, 2, 3]], expected: 4 },
      { input: [[7, 7, 7, 7, 7]], expected: 1 },
      { input: [[1]], expected: 1 },
      { input: [[1, 2, 3, 4, 5]], expected: 5 },
      { input: [[5, 4, 3, 2, 1]], expected: 1 },
      { input: [[1, 3, 6, 7, 9, 4, 10, 5, 6]], expected: 6 },
      { input: [[4, 10, 4, 3, 8, 9]], expected: 3 },
    ],
  },
};
