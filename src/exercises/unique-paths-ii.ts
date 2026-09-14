import type { Exercise } from '@exercises/types';

export const uniquePathsII: Exercise = {
  id: 'unique-paths-ii',
  name: 'Unique Paths II',
  difficulty: 'medium',
  type: 'Dynamic Programming (Grid)',
  time: '20-25 min',
  description:
    'A robot starts at the top-left of an m x n grid and can only move down or right. Some cells contain obstacles (1); empty cells are 0. Return the number of unique paths from the top-left to the bottom-right corner.',
  examples: [
    { input: 'grid = [[0,0,0],[0,1,0],[0,0,0]]', output: '2' },
    { input: 'grid = [[0,1],[0,0]]', output: '1' },
  ],
  constraints: ['1 <= m, n <= 100', 'grid[i][j] is 0 or 1'],
  functionSignature: 'export function uniquePathsWithObstacles(grid: number[][]): number',
  hints: [
    'Let dp[i][j] be the number of paths to cell (i, j)',
    'If a cell has an obstacle, dp = 0',
    'Otherwise dp[i][j] = dp[i-1][j] + dp[i][j-1]',
    'The start cell is 0 paths if it has an obstacle',
  ],
  tests: [
    { input: [[[0, 0, 0], [0, 1, 0], [0, 0, 0]]], expected: 2 },
    { input: [[[0, 1], [0, 0]]], expected: 1 },
    { input: [[[1]]], expected: 0 },
    { input: [[[0]]], expected: 1 },
    { input: [[[0, 0], [0, 0]]], expected: 2 },
    { input: [[[0, 1], [1, 0]]], expected: 0 },
    { input: [[[0, 0, 0], [0, 0, 0], [0, 0, 0]]], expected: 6 },
  ],
};
