import type { Exercise } from '@exercises/types';

export const maxConsecutiveOnes: Exercise = {
  id: 'max-consecutive-ones',
  name: 'Max Consecutive Ones',
  createdAt: '2026-09-14',
  difficulty: 'easy',
  type: 'Arrays',
  time: '15-20 min',
  description:
    'Given an array of 0s and 1s, return an object `{ length, start }` describing the longest run of consecutive 1s. If there are no 1s, return `{ length: 0, start: -1 }`. On ties, the first occurrence wins.',
  examples: [
    { input: 'nums = [1, 1, 0, 1, 1, 1, 0, 1]', output: '{ length: 3, start: 3 }' },
    { input: 'nums = [1, 0, 1, 1, 0, 1]', output: '{ length: 2, start: 2 }' },
  ],
  constraints: ['1 <= nums.length <= 10^5', 'nums[i] is 0 or 1'],
  functionSignature: 'export function maxConsecutiveOnes(nums: number[]): { length: number; start: number }',
  hints: [
    'Track the current run length and its start index',
    'Track the best run seen so far',
    'Reset the current run when a 0 is encountered',
    'First occurrence wins on ties: only replace when strictly greater',
  ],
  tests: {
    cases: [
      { input: [[1, 1, 0, 1, 1, 1, 0, 1]], expected: { length: 3, start: 3 } },
      { input: [[1, 1, 1, 1]], expected: { length: 4, start: 0 } },
      { input: [[0, 0, 0]], expected: { length: 0, start: -1 } },
      { input: [[1, 0, 1, 0, 1]], expected: { length: 1, start: 0 } },
      { input: [[0, 1, 1, 0, 1, 1, 1]], expected: { length: 3, start: 4 } },
      { input: [[1, 1, 0, 1, 1]], expected: { length: 2, start: 0 } },
    ],
  },
};