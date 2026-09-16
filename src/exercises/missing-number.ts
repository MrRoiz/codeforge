import type { Exercise } from '@exercises/types';

export const missingNumber: Exercise = {
  id: 'missing-number',
  name: 'Missing Number',
  createdAt: '2026-09-15',
  difficulty: 'easy',
  type: 'Math / Bit Manipulation',
  time: '10-15 min',
  description:
    'Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.',
  examples: [
    {
      input: 'nums = [3,0,1]',
      output: '2',
      explanation:
        'n = 3 since there are 3 numbers, so all numbers are in the range [0,3]. 2 is the missing number.',
    },
    {
      input: 'nums = [0,1]',
      output: '2',
      explanation:
        'n = 2 since there are 2 numbers, so all numbers are in the range [0,2]. 2 is the missing number.',
    },
  ],
  constraints: [
    'n == nums.length',
    '1 <= n <= 10^4',
    '0 <= nums[i] <= n',
    'All the numbers of nums are unique',
  ],
  functionSignature: 'export function missingNumber(nums: number[]): number',
  hints: [
    'The sum of 0..n is n * (n + 1) / 2',
    'Subtract the actual sum from the expected sum',
    'Alternatively XOR all indices and values together',
  ],
  tests: {
    cases: [
      { input: [[3, 0, 1]], expected: 2 },
      { input: [[0, 1]], expected: 2 },
      { input: [[9, 6, 4, 2, 3, 5, 7, 0, 1]], expected: 8 },
      { input: [[0]], expected: 1 },
      { input: [[1]], expected: 0 },
    ],
  },
};
