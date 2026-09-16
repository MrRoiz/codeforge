import type { Exercise } from '@exercises/types';

export const moveZeroes: Exercise = {
  id: 'move-zeroes',
  name: 'Move Zeroes',
  createdAt: '2026-09-15',
  difficulty: 'easy',
  type: 'Two Pointers (in-place)',
  time: '10-15 min',
  description:
    'Given an integer array `nums`, move all `0`s to the end of it while maintaining the relative order of the non-zero elements. Do this in-place without making a copy of the array and do not return anything; mutate `nums` instead.',
  examples: [
    {
      input: 'nums = [0,1,0,3,12]',
      output: 'nums becomes [1,3,12,0,0] (no return value)',
      explanation:
        'The non-zero elements keep their order (1, 3, 12) and the zeroes move to the end. The function returns nothing (void); the graded result is the mutated array.',
    },
    {
      input: 'nums = [0]',
      output: 'nums becomes [0] (no return value)',
      explanation: 'A single zero is already at the end; nothing moves.',
    },
  ],
  constraints: ['1 <= nums.length <= 10^4', '-2^31 <= nums[i] <= 2^31 - 1'],
  functionSignature: 'export function moveZeroes(nums: number[]): void',
  hints: [
    'Use a write pointer for the next position of a non-zero value',
    'Scan with a read pointer; when you find a non-zero, write it at the write pointer',
    'After the scan, fill the remaining positions with zeroes',
  ],
  tests: {
    mutatesInput: true,
    cases: [
      { input: [[0, 1, 0, 3, 12]], expected: [1, 3, 12, 0, 0] },
      { input: [[0]], expected: [0] },
      { input: [[1]], expected: [1] },
      { input: [[0, 0, 1]], expected: [1, 0, 0] },
      { input: [[1, 2, 3]], expected: [1, 2, 3] },
      { input: [[0, 0, 0]], expected: [0, 0, 0] },
    ],
  },
};
