import type { Exercise } from '@exercises/types';

export const invertBinaryTree: Exercise = {
  id: 'invert-binary-tree',
  name: 'Invert Binary Tree',
  createdAt: '2026-09-21',
  difficulty: 'easy',
  type: 'Trees',
  time: '10-15 min',
  description:
    'Given the root of a binary tree — each node is `{ val, left, right }`, where an absent child is `null` — invert (mirror) it by swapping the left and right child of every node, and return the resulting tree in the same form.',
  examples: [
    {
      input:
        'root = { val: 4, left: { val: 2, left: { val: 1, left: null, right: null }, right: { val: 3, left: null, right: null } }, right: { val: 7, left: { val: 6, left: null, right: null }, right: { val: 9, left: null, right: null } } }',
      output:
        '{ val: 4, left: { val: 7, left: { val: 9, left: null, right: null }, right: { val: 6, left: null, right: null } }, right: { val: 2, left: { val: 3, left: null, right: null }, right: { val: 1, left: null, right: null } } }',
      explanation: 'Every node\u2019s children are swapped, so the tree becomes its mirror image.',
    },
    {
      input: 'root = { val: 1, left: { val: 2, left: null, right: null }, right: null }',
      output: '{ val: 1, left: null, right: { val: 2, left: null, right: null } }',
    },
    { input: 'root = null', output: 'null' },
  ],
  constraints: [
    'The number of nodes is in the range [0, 100]',
    '-100 <= TreeNode.val <= 100',
    'A node is `{ val, left, right }`; `null` marks an absent child',
  ],
  functionSignature: 'export function invertTree(root: TreeNode | null): TreeNode | null',
  hints: [
    'Swap the two children of every node — a recursive walk is the most direct',
    'Any traversal works: DFS recursion, or BFS with an explicit queue',
    'A leaf node is unchanged by the swap',
    'Return null for an empty tree',
  ],
  stub: `export interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export function invertTree(root: TreeNode | null): TreeNode | null {
  void root;
  throw new Error('Not implemented');
}`,
  tests: {
    cases: [
      {
        input: [
          {
            val: 4,
            left: {
              val: 2,
              left: { val: 1, left: null, right: null },
              right: { val: 3, left: null, right: null },
            },
            right: {
              val: 7,
              left: { val: 6, left: null, right: null },
              right: { val: 9, left: null, right: null },
            },
          },
        ],
        expected: {
          val: 4,
          left: {
            val: 7,
            left: { val: 9, left: null, right: null },
            right: { val: 6, left: null, right: null },
          },
          right: {
            val: 2,
            left: { val: 3, left: null, right: null },
            right: { val: 1, left: null, right: null },
          },
        },
      },
      { input: [null], expected: null },
      {
        input: [{ val: 1, left: null, right: null }],
        expected: { val: 1, left: null, right: null },
      },
      {
        input: [{ val: 1, left: { val: 2, left: null, right: null }, right: null }],
        expected: { val: 1, left: null, right: { val: 2, left: null, right: null } },
      },
      {
        input: [{ val: 1, left: null, right: { val: 2, left: null, right: null } }],
        expected: { val: 1, left: { val: 2, left: null, right: null }, right: null },
      },
      {
        input: [
          {
            val: 1,
            left: {
              val: 2,
              left: { val: 4, left: null, right: null },
              right: { val: 5, left: null, right: null },
            },
            right: { val: 3, left: null, right: null },
          },
        ],
        expected: {
          val: 1,
          left: { val: 3, left: null, right: null },
          right: {
            val: 2,
            left: { val: 5, left: null, right: null },
            right: { val: 4, left: null, right: null },
          },
        },
      },
      {
        input: [
          {
            val: 1,
            left: {
              val: 2,
              left: { val: 4, left: null, right: null },
              right: null,
            },
            right: {
              val: 3,
              left: null,
              right: { val: 5, left: null, right: null },
            },
          },
        ],
        expected: {
          val: 1,
          left: {
            val: 3,
            left: { val: 5, left: null, right: null },
            right: null,
          },
          right: {
            val: 2,
            left: null,
            right: { val: 4, left: null, right: null },
          },
        },
      },
      {
        input: [
          {
            val: 1,
            left: {
              val: 2,
              left: { val: 3, left: null, right: null },
              right: null,
            },
            right: null,
          },
        ],
        expected: {
          val: 1,
          left: null,
          right: {
            val: 2,
            left: null,
            right: { val: 3, left: null, right: null },
          },
        },
      },
      {
        input: [
          {
            val: 5,
            left: {
              val: 3,
              left: { val: 1, left: null, right: null },
              right: { val: 4, left: null, right: null },
            },
            right: {
              val: 8,
              left: { val: 7, left: null, right: null },
              right: { val: 9, left: null, right: null },
            },
          },
        ],
        expected: {
          val: 5,
          left: {
            val: 8,
            left: { val: 9, left: null, right: null },
            right: { val: 7, left: null, right: null },
          },
          right: {
            val: 3,
            left: { val: 4, left: null, right: null },
            right: { val: 1, left: null, right: null },
          },
        },
      },
      {
        input: [
          {
            val: 1,
            left: { val: -2, left: null, right: null },
            right: { val: 3, left: null, right: null },
          },
        ],
        expected: {
          val: 1,
          left: { val: 3, left: null, right: null },
          right: { val: -2, left: null, right: null },
        },
      },
    ],
  },
};
