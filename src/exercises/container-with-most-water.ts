import type { Exercise } from '@exercises/types';

export const containerWithMostWater: Exercise = {
  id: 'container-with-most-water',
  name: 'Container With Most Water',
  difficulty: 'medium',
  type: 'Two Pointers',
  time: '20-25 min',
  description:
    'You are given an integer array `height` of length `n`, where `height[i]` is the height of a vertical line drawn at index `i`. Pick two lines that, together with the x-axis, form a container holding the most water. Return the maximum amount of water it can store. The container\'s area is `min(height[left], height[right]) * (right - left)`.',
  examples: [
    {
      input: 'height = [1,8,6,2,5,4,8,3,7]',
      output: '49',
      explanation: 'Lines at indices 1 and 8: min(8, 7) * (8 - 1) = 7 * 7 = 49.',
    },
    {
      input: 'height = [1,1]',
      output: '1',
      explanation: 'Only one pair: min(1, 1) * 1 = 1.',
    },
  ],
  constraints: [
    '2 <= height.length <= 10^5',
    '0 <= height[i] <= 10^4',
  ],
  functionSignature: 'export function maxArea(height: number[]): number',
  hints: [
    'Aim for O(n): start with the widest container (left = 0, right = n - 1).',
    'The area is capped by the shorter line, so shrinking the width can only pay off if you replace the shorter line.',
    'Move the pointer at the shorter line inward and track the best area seen.',
  ],
  tests: [
    { input: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 },
    { input: [[1, 1]], expected: 1 },
    { input: [[4, 3, 2, 1, 4]], expected: 16 },
    { input: [[1, 2, 1]], expected: 2 },
    { input: [[1, 2, 4, 3]], expected: 4 },
    { input: [[2, 3, 4, 5, 18, 17, 6]], expected: 17 },
  ],
};
