import type { Exercise } from '@exercises/types';

export const permutations: Exercise = {
  id: 'permutations',
  name: 'Permutations',
  difficulty: 'medium',
  type: 'Backtracking',
  time: '20-25 min',
  description:
    'Given an array `nums` of distinct integers, return all the possible permutations. You can return the answer in any order.',
  examples: [
    { input: 'nums = [1,2,3]', output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]' },
    { input: 'nums = [0,1]', output: '[[0,1],[1,0]]' },
  ],
  constraints: ['1 <= nums.length <= 6', '-10 <= nums[i] <= 10', 'All integers in nums are unique'],
  functionSignature: 'export function permute(nums: number[]): number[][]',
  hints: [
    'Backtrack: choose an element for the current position, recurse, then undo',
    'Swap-based generation: swap the current index with each later index',
    'Base case: when the index reaches the end, record a copy of the array',
  ],
  tests: [
    {
      input: [[1, 2, 3]],
      expected: [
        [1, 2, 3],
        [1, 3, 2],
        [2, 1, 3],
        [2, 3, 1],
        [3, 1, 2],
        [3, 2, 1],
      ],
      sorted: true,
    },
    {
      input: [[0, 1]],
      expected: [
        [0, 1],
        [1, 0],
      ],
      sorted: true,
    },
    { input: [[1]], expected: [[1]], sorted: true },
    {
      input: [[1, 2]],
      expected: [
        [1, 2],
        [2, 1],
      ],
      sorted: true,
    },
    {
      input: [[-1, 0, 1]],
      expected: [
        [-1, 0, 1],
        [-1, 1, 0],
        [0, -1, 1],
        [0, 1, -1],
        [1, -1, 0],
        [1, 0, -1],
      ],
      sorted: true,
    },
  ],
};
