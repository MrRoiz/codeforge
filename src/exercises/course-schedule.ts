import type { Exercise } from '@exercises/types';

export const courseSchedule: Exercise = {
  id: 'course-schedule',
  name: 'Course Schedule',
  createdAt: '2026-09-21',
  difficulty: 'medium',
  type: 'Graphs / Cycle Detection',
  time: '20-25 min',
  description:
    'There are `numCourses` courses labeled from 0 to `numCourses - 1`. You are given `prerequisites`, where `prerequisites[i] = [a, b]` means you must take course `b` before course `a`. Return `true` if it is possible to finish all courses, otherwise `false`. It is possible exactly when the prerequisite graph contains no directed cycle.',
  examples: [
    {
      input: 'numCourses = 2, prerequisites = [[1,0]]',
      output: 'true',
      explanation: 'Take course 0 first, then course 1.',
    },
    {
      input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]',
      output: 'false',
      explanation: 'Courses 0 and 1 each require the other, so neither can be taken first.',
    },
  ],
  constraints: [
    '1 <= numCourses <= 2000',
    '0 <= prerequisites.length <= 5000',
    'prerequisites[i].length == 2',
    '0 <= a, b < numCourses',
    'All prerequisite pairs are unique',
  ],
  functionSignature:
    'export function canFinish(numCourses: number, prerequisites: number[][]): boolean',
  hints: [
    'Model courses as nodes and each prerequisite [a, b] as a directed edge b -> a',
    'The schedule is possible iff this directed graph has no cycle',
    'DFS with three states (unvisited, in-progress, done) detects a back edge',
    'Kahn\u2019s algorithm works too: repeatedly remove indegree-0 nodes; a leftover node means a cycle',
  ],
  tests: {
    cases: [
      { input: [2, [[1, 0]]], expected: true },
      {
        input: [
          2,
          [
            [1, 0],
            [0, 1],
          ],
        ],
        expected: false,
      },
      { input: [1, []], expected: true },
      {
        input: [
          3,
          [
            [1, 0],
            [2, 1],
          ],
        ],
        expected: true,
      },
      {
        input: [
          3,
          [
            [1, 0],
            [0, 2],
            [2, 1],
          ],
        ],
        expected: false,
      },
      {
        input: [
          4,
          [
            [1, 0],
            [2, 1],
            [3, 2],
          ],
        ],
        expected: true,
      },
      {
        input: [
          5,
          [
            [1, 0],
            [2, 1],
            [3, 2],
            [4, 3],
            [0, 4],
          ],
        ],
        expected: false,
      },
      {
        input: [
          3,
          [
            [0, 1],
            [1, 2],
            [2, 0],
          ],
        ],
        expected: false,
      },
      { input: [6, []], expected: true },
      {
        input: [
          4,
          [
            [1, 0],
            [2, 0],
            [3, 1],
            [3, 2],
          ],
        ],
        expected: true,
      },
      { input: [2, [[0, 1]]], expected: true },
      {
        input: [
          3,
          [
            [0, 1],
            [0, 2],
          ],
        ],
        expected: true,
      },
      {
        input: [
          5,
          [
            [1, 0],
            [2, 1],
            [3, 2],
            [4, 3],
          ],
        ],
        expected: true,
      },
    ],
  },
};
