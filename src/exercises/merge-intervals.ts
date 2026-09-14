import type { Exercise } from '@exercises/types';

export const mergeIntervals: Exercise = {
  id: 'merge-intervals',
  validation: [{ level: 'reported', source: 'GoDaddy' }],
  name: 'Merge Intervals',
  createdAt: '2026-09-14',
  difficulty: 'medium',
  type: 'Arrays + Sorting',
  time: '25-35 min',
  description:
    'Given an array of intervals where intervals[i] = [start, end], merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.',
  examples: [
    { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: '[1,3] and [2,6] overlap and merge into [1,6]' },
    { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]', explanation: 'Touching intervals count as overlapping' },
  ],
  constraints: [
    '1 <= intervals.length <= 10^4',
    'intervals[i].length == 2',
    '0 <= start <= end <= 10^4',
  ],
  functionSignature: 'export function merge(intervals: number[][]): number[][]',
  hints: [
    'Sort the intervals by start time',
    'Iterate, extending the last merged interval when they overlap',
    'Two intervals [a,b] and [c,d] overlap if c <= b',
  ],
  tests: [
    { input: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
    { input: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
    { input: [[[1, 4], [2, 3]]], expected: [[1, 4]] },
    { input: [[[1, 4], [5, 6]]], expected: [[1, 4], [5, 6]] },
    { input: [[[1, 4], [0, 4]]], expected: [[0, 4]] },
    { input: [[[1, 4], [0, 0]]], expected: [[0, 0], [1, 4]] },
  ],
};