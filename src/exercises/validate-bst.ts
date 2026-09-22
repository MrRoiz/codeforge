import type { Exercise } from '@exercises/types';

export const validateBst: Exercise = {
  id: 'validate-bst',
  name: 'Validate Binary Search Tree',
  createdAt: '2026-09-21',
  difficulty: 'medium',
  type: 'Trees',
  time: '20-25 min',
  description:
    'Given the root of a binary tree, determine whether it is a valid binary search tree. A valid BST requires that every node in a node\u2019s left subtree has a strictly smaller value, and every node in its right subtree has a strictly larger value. Trees are given in level-order form, using `null` for missing children.',
  examples: [
    { input: 'root = [2,1,3]', output: 'true' },
    {
      input: 'root = [5,1,4,null,null,3,6]',
      output: 'false',
      explanation: 'The value 3 sits in the right subtree of 5 but is smaller than 5.',
    },
  ],
  constraints: [
    'The number of nodes is in the range [0, 10^4]',
    '-2^31 <= Node.val <= 2^31 - 1',
    'The tree may contain duplicate values — the check is strict',
  ],
  functionSignature: 'export function isValidBST(root: TreeNode | null): boolean',
  hints: [
    'Comparing a node only with its direct children is not enough',
    'Carry an allowed open interval (low, high) down the recursion',
    'Going left tightens the high bound; going right tightens the low bound',
    'An in-order traversal must be strictly increasing',
  ],
  stub: `export class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

export function isValidBST(root: TreeNode | null): boolean {
  void root;
  throw new Error('Not implemented');
}`,
  tests: {
    fileBody: `import { TreeNode, isValidBST } from './exercise.js';

const build = (values: (number | null)[]): TreeNode | null => {
  if (values.length === 0 || values[0] === null) {
    return null;
  }
  const root = new TreeNode(values[0]);
  const queue: TreeNode[] = [root];
  let index = 1;
  while (queue.length > 0 && index < values.length) {
    const node = queue.shift() as TreeNode;
    const left = values[index++];
    if (left !== null && left !== undefined) {
      node.left = new TreeNode(left);
      queue.push(node.left);
    }
    const right = values[index++];
    if (right !== null && right !== undefined) {
      node.right = new TreeNode(right);
      queue.push(node.right);
    }
  }
  return root;
};

describe('Validate Binary Search Tree', () => {
  it('case 1: a valid BST', () => {
    expect(isValidBST(build([2, 1, 3]))).toBe(true);
  });

  it('case 2: a subtree value violates the ancestor bound', () => {
    expect(isValidBST(build([5, 1, 4, null, null, 3, 6]))).toBe(false);
  });

  it('case 3: empty and single-node trees are valid', () => {
    expect(isValidBST(build([]))).toBe(true);
    expect(isValidBST(build([1]))).toBe(true);
  });

  it('case 4: a deep violation of the ancestor bound', () => {
    expect(isValidBST(build([10, 5, 15, null, null, 6, 20]))).toBe(false);
  });

  it('case 5: duplicates are invalid', () => {
    expect(isValidBST(build([2, 2, 2]))).toBe(false);
    expect(isValidBST(build([2, 1, 2]))).toBe(false);
  });

  it('case 6: a valid deeper tree', () => {
    expect(isValidBST(build([8, 4, 12, 2, 6, 10, 14]))).toBe(true);
  });

  it('case 7: right subtree with a smaller descendant', () => {
    expect(isValidBST(build([5, 4, 6, null, null, 3, 7]))).toBe(false);
  });
});`,
    cases: [],
  },
};
