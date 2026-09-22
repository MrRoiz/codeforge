import type { Exercise } from '@exercises/types';

export const longestConsecutive: Exercise = {
  id: 'longest-consecutive-sequence',
  name: 'Longest Consecutive Sequence',
  createdAt: '2026-09-21',
  difficulty: 'medium',
  type: 'Hash Set',
  time: '20-25 min',
  description:
    'Given an unsorted array of integers `nums`, return the length of the longest run of consecutive integers (values differing by exactly 1). The run does not need to appear contiguously in the array. Your algorithm must run in O(n) time.',
  examples: [
    {
      input: 'nums = [100,4,200,1,3,2]',
      output: '4',
      explanation: 'The longest run is [1, 2, 3, 4], which has length 4.',
    },
    {
      input: 'nums = [0,3,7,2,5,8,4,6,0,1]',
      output: '9',
      explanation: 'The run [0..8] has length 9 (the duplicate 0 is ignored).',
    },
  ],
  constraints: [
    '0 <= nums.length <= 10^5',
    '-10^9 <= nums[i] <= 10^9',
    'O(n) time is required — sorting in O(n log n) is not enough',
  ],
  functionSignature: 'export function longestConsecutive(nums: number[]): number',
  hints: [
    'Put every value into a hash set for O(1) lookups',
    'A value starts a run iff `value - 1` is not in the set',
    'From each start, walk upward while consecutive values exist',
    'Each value is visited a constant number of times overall — O(n)',
  ],
  tests: {
    cases: [
      { input: [[100, 4, 200, 1, 3, 2]], expected: 4 },
      { input: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], expected: 9 },
      { input: [[]], expected: 0 },
      { input: [[1]], expected: 1 },
      { input: [[1, 2, 0, 1]], expected: 3 },
      { input: [[9, 1, 4, 7, 3, -1, 0, 5, 8, -1, 6]], expected: 7 },
      { input: [[10, 11, 12, 13]], expected: 4 },
      { input: [[5, 5, 5]], expected: 1 },
    ],
  },
};
