import type { Exercise } from '@exercises/types';

export const binarySearch: Exercise = {
  id: 'binary-search',
  name: 'Binary Search',
  createdAt: '2026-09-15',
  difficulty: 'easy',
  type: 'Binary Search',
  time: '10-15 min',
  description:
    'Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, return its index. Otherwise, return `-1`. You must write an algorithm with `O(log n)` runtime complexity.',
  examples: [
    {
      input: 'nums = [-1,0,3,5,9,12], target = 9',
      output: '4',
      explanation: '9 exists in nums and its index is 4',
    },
    {
      input: 'nums = [-1,0,3,5,9,12], target = 2',
      output: '-1',
      explanation: '2 does not exist in nums so return -1',
    },
  ],
  constraints: [
    '1 <= nums.length <= 10^4',
    '-10^4 < nums[i], target < 10^4',
    'All the integers in nums are unique',
    'nums is sorted in ascending order',
  ],
  functionSignature: 'export function search(nums: number[], target: number): number',
  hints: [
    'Keep a low and high bound of the search range',
    'Compute the middle index and compare nums[mid] with target',
    'Halve the range each iteration based on the comparison',
    'Avoid overflow using mid = low + (high - low) / 2',
  ],
  tests: {
    cases: [
      { input: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
      { input: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
      { input: [[5], 5], expected: 0 },
      { input: [[5], -5], expected: -1 },
      { input: [[1, 2, 3, 4, 5], 1], expected: 0 },
      { input: [[1, 2, 3, 4, 5], 5], expected: 4 },
      { input: [[1, 2, 3, 4, 5], 3], expected: 2 },
    ],
  },
};
