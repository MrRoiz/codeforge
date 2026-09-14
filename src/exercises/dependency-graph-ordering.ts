import type { Exercise } from '@exercises/types';

export const dependencyGraphOrdering: Exercise = {
  id: 'dependency-graph-ordering',
  name: 'Dependency Graph Ordering',
  difficulty: 'medium',
  type: 'Topological Sort',
  time: '25-30 min',
  description:
    'Given a number of tasks and a list of dependencies, return a valid execution order. Tasks are numbered from 0 to tasks - 1. dependencies[i] = [a, b] means task `a` depends on task `b`, so `b` must run before `a`. If there is a circular dependency, return an empty list. Any valid order is accepted.',
  examples: [
    { input: 'tasks = 4, dependencies = [[1,0],[2,1],[3,2]]', output: '[0,1,2,3]' },
    { input: 'tasks = 4, dependencies = [[1,0],[2,1],[0,2]]', output: '[]', explanation: '0 -> 2 -> 1 -> 0 is a cycle' },
    { input: 'tasks = 3, dependencies = [[1,0],[2,0]]', output: '[0,1,2] or [0,2,1]' },
  ],
  constraints: [
    '1 <= tasks <= 10^4',
    '0 <= dependencies.length <= 10^4',
    'dependencies[i] = [a, b] means a depends on b',
  ],
  functionSignature: 'export function findOrder(tasks: number, dependencies: number[][]): number[]',
  hints: [
    "Kahn's algorithm: build an adjacency list and an in-degree array",
    'Start from tasks with in-degree 0',
    'Process a task, then decrement the in-degree of its dependents',
    'If you process fewer than `tasks` nodes, a cycle exists -> return []',
  ],
  tests: [],
  testFileBody: `import { findOrder } from './exercise.js';

// any topological order is accepted — validate instead of comparing exactly
const isValidOrder = (tasks: number, deps: number[][], order: number[]): boolean => {
  if (order.length !== tasks || new Set(order).size !== tasks) return false;
  const pos = new Map(order.map((t, i) => [t, i]));
  for (const [a, b] of deps) {
    if (pos.get(b)! >= pos.get(a)!) return false;
  }
  return true;
};

describe('Dependency Graph Ordering', () => {
  it('case 1: linear chain is ordered correctly', () => {
    const deps = [[1, 0], [2, 1], [3, 2]];
    expect(isValidOrder(4, deps, findOrder(4, deps))).toBe(true);
  });

  it('case 2: cycle returns []', () => {
    expect(findOrder(4, [[1, 0], [2, 1], [0, 2]])).toEqual([]);
  });

  it('case 3: fan-out yields a valid order', () => {
    const deps = [[1, 0], [2, 0]];
    expect(isValidOrder(3, deps, findOrder(3, deps))).toBe(true);
  });

  it('case 4: single task', () => {
    expect(findOrder(1, [])).toEqual([0]);
  });

  it('case 5: two-node cycle returns []', () => {
    expect(findOrder(2, [[1, 0], [0, 1]])).toEqual([]);
  });

  it('case 6: no dependencies yields a valid order', () => {
    const order = findOrder(3, []);
    expect(isValidOrder(3, [], order)).toBe(true);
  });

  it('case 7: diamond dependency', () => {
    const deps = [[3, 1], [3, 2], [1, 0], [2, 0]];
    expect(isValidOrder(4, deps, findOrder(4, deps))).toBe(true);
  });
});`,
};
