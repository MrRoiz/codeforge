import type { Exercise } from '@exercises/types';

export const maxDepthBinaryTree: Exercise = {
  id: 'max-depth-binary-tree',
  name: 'Maximum Depth of Binary Tree',
  createdAt: '2026-09-21',
  difficulty: 'easy',
  type: 'Trees',
  time: '10-15 min',
  description:
    'Given the root of a binary tree, return its maximum depth — the number of nodes along the longest path from the root down to the farthest leaf node. An empty tree has depth 0. Trees are given in level-order form, using `null` for missing children.',
  examples: [
    {
      input: 'root = [3,9,20,null,null,15,7]',
      output: '3',
      explanation: 'The longest path is 3 -> 20 -> 15 (or 7), which has three nodes.',
    },
    { input: 'root = []', output: '0' },
  ],
  constraints: [
    'The number of nodes is in the range [0, 10^4]',
    '-100 <= Node.val <= 100',
    'Input is a level-order array where `null` marks an absent child',
  ],
  functionSignature: 'export function maxDepth(root: TreeNode | null): number',
  hints: [
    'An empty subtree has depth 0',
    'Depth of a node is 1 + the deeper of its two subtrees',
    'A recursive solution is the most direct',
    'BFS by levels also works — count the levels you drain',
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

export function maxDepth(root: TreeNode | null): number {
  void root;
  throw new Error('Not implemented');
}`,
  tests: {
    fileBody: `import { TreeNode, maxDepth } from './exercise.js';

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

describe('Maximum Depth of Binary Tree', () => {
  it('case 1: balanced tree', () => {
    expect(maxDepth(build([3, 9, 20, null, null, 15, 7]))).toBe(3);
  });

  it('case 2: empty tree', () => {
    expect(maxDepth(build([]))).toBe(0);
    expect(maxDepth(null)).toBe(0);
  });

  it('case 3: single node', () => {
    expect(maxDepth(build([1]))).toBe(1);
  });

  it('case 4: a balanced tree is shallower than a chain', () => {
    expect(maxDepth(build([1, 2, 3, 4, 5]))).toBe(3);
    expect(maxDepth(build([1, 2, null, 3, null, 4, null, 5]))).toBe(5);
  });

  it('case 5: only a right subtree', () => {
    expect(maxDepth(build([1, null, 2, null, 3]))).toBe(3);
  });

  it('case 6: tree with uneven branches', () => {
    expect(maxDepth(build([1, 2, 3, 4, null, null, 5, 6]))).toBe(4);
  });
});`,
    cases: [],
  },
};
