import type { Exercise } from '@exercises/types';

export const stepsToMakeArrayNonDecreasing: Exercise = {
  id: 'steps-to-make-array-non-decreasing',
  name: 'Steps to Make Array Non-decreasing',
  createdAt: '2026-09-15',
  difficulty: 'medium',
  type: 'Monotonic Stack',
  time: '20-30 min',
  description:
    'Given a 0-indexed integer array `nums`, in one step remove every element `nums[i]` where `nums[i - 1] > nums[i]` for all `0 < i < nums.length`. The removals in a step are decided from the array at the start of that step and happen simultaneously. Return the number of steps performed until `nums` becomes a non-decreasing array, i.e. until `nums[i - 1] <= nums[i]` for every `0 < i < nums.length`.',
  examples: [
    {
      input: 'nums = [5,3,4,4,7,3,6,11,8,5,11]',
      output: '3',
      explanation:
        'Step 1 removes 3 (index 1), 3 (index 5), 8 and 5 → [5,4,4,7,6,11,11]\nStep 2 removes 4 and 6 → [5,4,7,11,11]\nStep 3 removes 4 → [5,7,11,11], which is non-decreasing. So 3 steps.',
    },
    {
      input: 'nums = [4,5,7,7,13]',
      output: '0',
      explanation: 'The array is already non-decreasing, so no steps are needed.',
    },
  ],
  constraints: ['1 <= nums.length <= 10^5', '1 <= nums[i] <= 10^9'],
  functionSignature: 'export function totalSteps(nums: number[]): number',
  hints: [
    'An element is only removed if some larger value sits to its left',
    'The answer is the longest chain of removals, not the number of removed elements',
    'Scan left to right keeping a decreasing stack; pop everything <= the current value and track the deepest step count you merge',
  ],
  tests: {
    cases: [
      { input: [[5, 3, 4, 4, 7, 3, 6, 11, 8, 5, 11]], expected: 3 },
      { input: [[4, 5, 7, 7, 13]], expected: 0 },
      { input: [[3, 2, 1]], expected: 1 },
      { input: [[1]], expected: 0 },
      { input: [[2, 2, 2]], expected: 0 },
      { input: [[5, 14, 15, 2, 11, 5, 13, 15]], expected: 3 },
      { input: [[10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]], expected: 9 },
    ],
  },
};
