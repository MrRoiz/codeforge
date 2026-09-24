import type { Exercise } from '@exercises/types';

export const validateBst: Exercise = {
  id: 'validate-bst',
  name: 'Validate Binary Search Tree',
  createdAt: '2026-09-21',
  difficulty: 'medium',
  type: 'Trees',
  time: '20-25 min',
  description:
    'Given the root of a binary tree, determine whether it is a valid binary search tree. A node is `{ val, left, right }`, where an absent child is `null`. A valid BST requires that every node in a node\u2019s left subtree has a strictly smaller value, and every node in its right subtree has a strictly larger value.',
  examples: [
    {
      input:
        'root = { val: 2, left: { val: 1, left: null, right: null }, right: { val: 3, left: null, right: null } }',
      output: 'true',
    },
    {
      input:
        'root = { val: 5, left: { val: 1, left: null, right: null }, right: { val: 4, left: { val: 3, left: null, right: null }, right: { val: 6, left: null, right: null } } }',
      output: 'false',
      explanation: 'The value 3 sits in the right subtree of 5 but is smaller than 5.',
    },
  ],
  constraints: [
    'The number of nodes is in the range [0, 10^4]',
    '-2^31 <= TreeNode.val <= 2^31 - 1',
    'The tree may contain duplicate values — the check is strict',
  ],
  functionSignature: 'export function isValidBST(root: TreeNode | null): boolean',
  hints: [
    'Comparing a node only with its direct children is not enough',
    'Carry an allowed open interval (low, high) down the recursion',
    'Going left tightens the high bound; going right tightens the low bound',
    'An in-order traversal must be strictly increasing',
  ],
  stub: `export interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export function isValidBST(root: TreeNode | null): boolean {
  void root;
  throw new Error('Not implemented');
}`,
  tests: {
    cases: [
      {
        input: [
          {
            val: 2,
            left: { val: 1, left: null, right: null },
            right: { val: 3, left: null, right: null },
          },
        ],
        expected: true,
      },
      {
        input: [
          {
            val: 5,
            left: { val: 1, left: null, right: null },
            right: {
              val: 4,
              left: { val: 3, left: null, right: null },
              right: { val: 6, left: null, right: null },
            },
          },
        ],
        expected: false,
      },
      { input: [null], expected: true },
      { input: [{ val: 1, left: null, right: null }], expected: true },
      {
        input: [
          {
            val: 10,
            left: { val: 5, left: null, right: null },
            right: {
              val: 15,
              left: { val: 6, left: null, right: null },
              right: { val: 20, left: null, right: null },
            },
          },
        ],
        expected: false,
      },
      {
        input: [
          {
            val: 2,
            left: { val: 2, left: null, right: null },
            right: { val: 2, left: null, right: null },
          },
        ],
        expected: false,
      },
      {
        input: [
          {
            val: 2,
            left: { val: 1, left: null, right: null },
            right: { val: 2, left: null, right: null },
          },
        ],
        expected: false,
      },
      {
        input: [
          {
            val: 8,
            left: {
              val: 4,
              left: { val: 2, left: null, right: null },
              right: { val: 6, left: null, right: null },
            },
            right: {
              val: 12,
              left: { val: 10, left: null, right: null },
              right: { val: 14, left: null, right: null },
            },
          },
        ],
        expected: true,
      },
      {
        input: [
          {
            val: 5,
            left: { val: 4, left: null, right: null },
            right: {
              val: 6,
              left: { val: 3, left: null, right: null },
              right: { val: 7, left: null, right: null },
            },
          },
        ],
        expected: false,
      },
      { input: [{ val: 2147483647, left: null, right: null }], expected: true },
      { input: [{ val: -2147483648, left: null, right: null }], expected: true },
    ],
  },
};
