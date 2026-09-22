import type { Exercise } from '@exercises/types';

export const findKthLargest: Exercise = {
  id: 'kth-largest-element',
  name: 'Kth Largest Element in an Array',
  createdAt: '2026-09-21',
  difficulty: 'medium',
  type: 'Heap',
  time: '20-25 min',
  description:
    'Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array. This is the `k`th largest in sorted order, not the `k`th distinct element.',
  examples: [
    { input: 'nums = [3,2,1,5,6,4], k = 2', output: '5' },
    {
      input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4',
      output: '4',
      explanation: 'Sorted descending: 6,5,5,4,... so the 4th largest is 4.',
    },
  ],
  constraints: [
    '1 <= k <= nums.length <= 10^5',
    '-10^4 <= nums[i] <= 10^4',
    'A full sort is O(n log n); a size-k heap is O(n log k)',
  ],
  functionSignature: 'export function findKthLargest(nums: number[], k: number): number',
  hints: [
    'Sorting and indexing works but is O(n log n)',
    'Keep a min-heap of the k largest values seen so far',
    'The heap root is the smallest of those k, i.e. the kth largest',
    'Quickselect gives O(n) average time',
  ],
  tests: {
    cases: [
      { input: [[3, 2, 1, 5, 6, 4], 2], expected: 5 },
      { input: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], expected: 4 },
      { input: [[1], 1], expected: 1 },
      { input: [[7, 6, 5, 4, 3, 2, 1], 1], expected: 7 },
      { input: [[7, 6, 5, 4, 3, 2, 1], 7], expected: 1 },
      { input: [[2, 1], 2], expected: 1 },
      { input: [[-1, -2, -3], 2], expected: -2 },
      { input: [[5, 5, 5, 5], 3], expected: 5 },
    ],
  },
};
