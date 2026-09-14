import type { Exercise } from '@exercises/types';

export const findPivotIndex: Exercise = {
  id: 'find-pivot-index',
  name: 'Find Pivot Index',
  createdAt: '2026-09-14',
  difficulty: 'easy',
  type: 'Prefix Sum',
  time: '15-20 min',
  description:
    'Given an array of integers `nums`, calculate the pivot index of this array. The pivot index is the index where the sum of all the numbers strictly to the left of the index is equal to the sum of all the numbers strictly to the right of the index. If the index is on the left edge, the left sum is 0 (same for the right edge). Return the leftmost pivot index, or -1 if none exists.',
  examples: [
    { input: 'nums = [1,7,3,6,5,6]', output: '3', explanation: 'Left sum = 1+7+3 = 11, Right sum = 5+6 = 11' },
    { input: 'nums = [1,2,3]', output: '-1', explanation: 'No index satisfies the condition' },
    { input: 'nums = [2,1,-1]', output: '0', explanation: 'Left sum = 0, Right sum = 1 + (-1) = 0' },
  ],
  constraints: ['1 <= nums.length <= 10^4', '-1000 <= nums[i] <= 1000'],
  functionSignature: 'export function pivotIndex(nums: number[]): number',
  hints: [
    'Calculate the total sum of the array first',
    'Iterate while maintaining the running left sum',
    'Right sum = total - left sum - current element',
    'If left sum === right sum, return the index',
  ],
  tests: [
    { input: [[1, 7, 3, 6, 5, 6]], expected: 3 },
    { input: [[1, 2, 3]], expected: -1 },
    { input: [[2, 1, -1]], expected: 0 },
    { input: [[1]], expected: 0 },
    { input: [[1, 2]], expected: -1 },
    { input: [[-1, -1, -1, 0, 1, 1]], expected: 0 },
  ],
};