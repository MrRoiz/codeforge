import type { Exercise } from '@exercises/types';

export const singleNumber: Exercise = {
  id: 'single-number',
  name: 'Single Number',
  createdAt: '2026-09-15',
  difficulty: 'easy',
  type: 'Bit Manipulation',
  time: '10-15 min',
  description:
    'Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one. You must implement a solution with linear runtime complexity and use only constant extra space.',
  examples: [
    {
      input: 'nums = [2,2,1]',
      output: '1',
      explanation: '2 appears twice; 1 appears once.',
    },
    {
      input: 'nums = [4,1,2,1,2]',
      output: '4',
      explanation: '1 and 2 each appear twice; 4 appears once.',
    },
  ],
  constraints: [
    '1 <= nums.length <= 3 * 10^4',
    '-3 * 10^4 <= nums[i] <= 3 * 10^4',
    'Each element in the array appears twice except for one element which appears only once',
  ],
  functionSignature: 'export function singleNumber(nums: number[]): number',
  hints: [
    'The linear + constant space requirement rules out a hash map',
    'XOR of a number with itself is 0',
    'XOR is commutative and associative, so order does not matter',
    'XOR of all elements leaves only the unique one',
  ],
  tests: {
    cases: [
      { input: [[2, 2, 1]], expected: 1 },
      { input: [[4, 1, 2, 1, 2]], expected: 4 },
      { input: [[1]], expected: 1 },
      { input: [[7, 3, 5, 7, 3, 5, 9]], expected: 9 },
    ],
  },
};
