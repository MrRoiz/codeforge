import type { Exercise } from '@exercises/types';

export const largestRectangleArea: Exercise = {
  id: 'largest-rectangle-in-histogram',
  name: 'Largest Rectangle in Histogram',
  createdAt: '2026-09-21',
  difficulty: 'hard',
  type: 'Stack',
  time: '30-35 min',
  description:
    'Given an array `heights` representing the heights of adjacent bars of width 1 in a histogram, return the area of the largest rectangle that fits entirely within the histogram. The rectangle is axis-aligned and its height is bounded by the shortest bar it spans.',
  examples: [
    {
      input: 'heights = [2,1,5,6,2,3]',
      output: '10',
      explanation: 'The bars 5 and 6 form a rectangle of height 5 and width 2.',
    },
    { input: 'heights = [2,4]', output: '4' },
  ],
  constraints: [
    '1 <= heights.length <= 10^5',
    '0 <= heights[i] <= 10^4',
    'An O(n) monotonic-stack solution is expected',
  ],
  functionSignature: 'export function largestRectangleArea(heights: number[]): number',
  hints: [
    'For each bar, find how far left and right it can extend while remaining the minimum',
    'A brute force over every (left, right) pair is O(n^2)',
    'Maintain a stack of indices with increasing heights',
    'When a shorter bar appears, pop and settle the rectangle for each taller bar',
    'Appending a sentinel height of 0 flushes the stack at the end',
  ],
  tests: {
    cases: [
      { input: [[2, 1, 5, 6, 2, 3]], expected: 10 },
      { input: [[2, 4]], expected: 4 },
      { input: [[1, 1]], expected: 2 },
      { input: [[4, 2]], expected: 4 },
      { input: [[3, 6, 5, 7, 4, 8, 1, 0]], expected: 20 },
      { input: [[1, 2, 3, 4, 5]], expected: 9 },
      { input: [[5, 4, 3, 2, 1]], expected: 9 },
      { input: [[2, 2, 2]], expected: 6 },
      { input: [[1000]], expected: 1000 },
    ],
  },
};
