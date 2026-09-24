import type { Exercise } from '@exercises/types';

export const maxDepthBinaryTree: Exercise = {
  id: 'max-depth-binary-tree',
  name: 'Maximum Depth of Binary Tree',
  createdAt: '2026-09-21',
  difficulty: 'easy',
  type: 'Trees',
  time: '10-15 min',
  description:
    'Given the root of a binary tree, return its maximum depth — the number of nodes along the longest path from the root down to the farthest leaf. A node is `{ val, left, right }`, where an absent child is `null`. An empty tree has depth 0.',
  examples: [
    {
      input:
        'root = { val: 3, left: { val: 9, left: null, right: null }, right: { val: 20, left: { val: 15, left: null, right: null }, right: { val: 7, left: null, right: null } } }',
      output: '3',
      explanation: 'The longest path is 3 -> 20 -> 15 (or 7), which has three nodes.',
    },
    { input: 'root = null', output: '0' },
  ],
  constraints: [
    'The number of nodes is in the range [0, 10^4]',
    '-100 <= TreeNode.val <= 100',
    'A node is `{ val, left, right }`; `null` marks an absent child',
  ],
  functionSignature: 'export function maxDepth(root: TreeNode | null): number',
  hints: [
    'An empty subtree has depth 0',
    'Depth of a node is 1 + the deeper of its two subtrees',
    'A recursive solution is the most direct',
    'BFS by levels also works — count the levels you drain',
  ],
  stub: `export interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export function maxDepth(root: TreeNode | null): number {
  void root;
  throw new Error('Not implemented');
}`,
  tests: {
    cases: [
      {
        input: [
          {
            val: 3,
            left: { val: 9, left: null, right: null },
            right: {
              val: 20,
              left: { val: 15, left: null, right: null },
              right: { val: 7, left: null, right: null },
            },
          },
        ],
        expected: 3,
      },
      { input: [null], expected: 0 },
      { input: [{ val: 1, left: null, right: null }], expected: 1 },
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
        expected: 3,
      },
      {
        input: [
          {
            val: 1,
            left: {
              val: 2,
              left: {
                val: 3,
                left: { val: 4, left: { val: 5, left: null, right: null }, right: null },
                right: null,
              },
              right: null,
            },
            right: null,
          },
        ],
        expected: 5,
      },
      {
        input: [
          {
            val: 1,
            left: null,
            right: {
              val: 2,
              left: null,
              right: { val: 3, left: null, right: null },
            },
          },
        ],
        expected: 3,
      },
      {
        input: [
          {
            val: 1,
            left: {
              val: 2,
              left: { val: 4, left: { val: 6, left: null, right: null }, right: null },
              right: null,
            },
            right: {
              val: 3,
              left: null,
              right: { val: 5, left: null, right: null },
            },
          },
        ],
        expected: 4,
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
            right: {
              val: 3,
              left: { val: 6, left: null, right: null },
              right: { val: 7, left: null, right: null },
            },
          },
        ],
        expected: 3,
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
            right: {
              val: 3,
              left: { val: 6, left: null, right: null },
              right: null,
            },
          },
        ],
        expected: 3,
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
        expected: 3,
      },
    ],
  },
};
