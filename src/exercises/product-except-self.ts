import type { Exercise } from '@exercises/types';

export const productExceptSelf: Exercise = {
  id: 'product-except-self',
  name: 'Product of Array Except Self',
  createdAt: '2026-09-14',
  difficulty: 'medium',
  type: 'Arrays + Prefix/Suffix Product',
  time: '20-30 min',
  description:
    'Given an integer array `nums`, return an array `answer` where `answer[i]` equals the product of all elements except `nums[i]`. Division is not allowed. Aim for O(n) time.',
  examples: [
    { input: 'nums = [1, 2, 3, 4, 5]', output: '[120, 60, 40, 30, 24]' },
    { input: 'nums = [-1, 1, 0, -3, 3]', output: '[0, 0, 9, 0, 0]' },
  ],
  constraints: [
    '2 <= nums.length <= 10^5',
    '-30 <= nums[i] <= 30',
    'The product of any prefix or suffix fits in a 32-bit integer',
  ],
  functionSignature: 'export function productExceptSelf(nums: number[]): number[]',
  hints: [
    'Key insight: answer[i] = (product of prefix) x (product of suffix)',
    'Two passes: left-to-right for prefix products, right-to-left for suffix products',
    'Can be optimized to O(1) extra space (excluding the output array)',
  ],
  tests: [
    { input: [[1, 2, 3, 4, 5]], expected: [120, 60, 40, 30, 24] },
    { input: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0] },
    { input: [[1, 2]], expected: [2, 1] },
    { input: [[0, 0]], expected: [0, 0] },
    { input: [[1, 0]], expected: [0, 1] },
    { input: [[2, 3, 4]], expected: [12, 8, 6] },
  ],
};