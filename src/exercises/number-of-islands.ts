import type { Exercise } from '@exercises/types';

export const numberOfIslands: Exercise = {
  id: 'number-of-islands',
  validation: [{ level: 'reported', source: 'GoDaddy' }],
  name: 'Number of Islands',
  createdAt: '2026-09-14',
  difficulty: 'medium',
  type: 'DFS/BFS + Grid',
  time: '25-35 min',
  description:
    'Given an m x n 2D binary grid which represents a map of "1"s (land) and "0"s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
  examples: [
    {
      input: `grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]`,
      output: '1',
    },
    {
      input: `grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]`,
      output: '3',
    },
  ],
  constraints: [
    'm == grid.length',
    'n == grid[i].length',
    '1 <= m, n <= 300',
    'grid[i][j] is "0" or "1"',
  ],
  functionSignature: 'export function numIslands(grid: string[][]): number',
  hints: [
    'Use DFS or BFS to explore each island',
    'Mark visited cells by flipping "1" to "0" in place',
    'Increment the count each time you start a new DFS/BFS from an unvisited "1"',
  ],
  tests: {
    cases: [
      {
        input: [
          [
            ['1', '1', '1', '1', '0'],
            ['1', '1', '0', '1', '0'],
            ['1', '1', '0', '0', '0'],
            ['0', '0', '0', '0', '0'],
          ],
        ],
        expected: 1,
      },
      {
        input: [
          [
            ['1', '1', '0', '0', '0'],
            ['1', '1', '0', '0', '0'],
            ['0', '0', '1', '0', '0'],
            ['0', '0', '0', '1', '1'],
          ],
        ],
        expected: 3,
      },
      { input: [[['1']]], expected: 1 },
      { input: [[['0']]], expected: 0 },
      {
        input: [
          [
            ['1', '0', '1'],
            ['0', '1', '0'],
            ['1', '0', '1'],
          ],
        ],
        expected: 5,
      },
    ],
  },
};
