import type { Exercise } from '@exercises/types';

export const mergeTwoSortedLists: Exercise = {
  id: 'merge-two-sorted-lists',
  name: 'Merge Two Sorted Lists',
  createdAt: '2026-09-21',
  difficulty: 'easy',
  type: 'Linked List',
  time: '15-20 min',
  description:
    'You are given the heads of two sorted linked lists `list1` and `list2`. Merge the two lists into one sorted list by splicing together the existing nodes, and return the head of the merged list. Both input lists are sorted in non-decreasing order.',
  examples: [
    {
      input: 'list1 = [1,2,4], list2 = [1,3,4]',
      output: '[1,1,2,3,4,4]',
      explanation: 'The two lists interleave; all nodes are reused, none are copied.',
    },
    { input: 'list1 = [], list2 = []', output: '[]' },
    { input: 'list1 = [], list2 = [0]', output: '[0]' },
  ],
  constraints: [
    'The number of nodes in both lists is in the range [0, 50]',
    '-100 <= Node.val <= 100',
    'Both list1 and list2 are sorted in non-decreasing order',
    'Splice the existing nodes — do not allocate new ones',
  ],
  functionSignature:
    'export function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null',
  hints: [
    'Use a dummy head node so you never special-case the first element',
    'Advance the pointer of whichever list has the smaller current value',
    'When one list runs out, attach the rest of the other list directly',
    'Iterating is O(n + m) time and O(1) extra space; recursion costs O(n + m) stack',
  ],
  stub: `export class ListNode {
  val: number;
  next: ListNode | null;

  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

export function mergeTwoLists(
  list1: ListNode | null,
  list2: ListNode | null,
): ListNode | null {
  void list1;
  void list2;
  throw new Error('Not implemented');
}`,
  tests: {
    fileBody: `import { ListNode, mergeTwoLists } from './exercise.js';

const build = (values: number[]): ListNode | null => {
  const dummy = new ListNode();
  let tail = dummy;
  for (const value of values) {
    tail.next = new ListNode(value);
    tail = tail.next;
  }
  return dummy.next;
};

const toArray = (head: ListNode | null): number[] => {
  const result: number[] = [];
  let node = head;
  while (node) {
    result.push(node.val);
    node = node.next;
  }
  return result;
};

describe('Merge Two Sorted Lists', () => {
  it('case 1: merges two equal-length lists', () => {
    const merged = mergeTwoLists(build([1, 2, 4]), build([1, 3, 4]));
    expect(toArray(merged)).toEqual([1, 1, 2, 3, 4, 4]);
  });

  it('case 2: both lists empty', () => {
    expect(toArray(mergeTwoLists(build([]), build([])))).toEqual([]);
  });

  it('case 3: one list empty', () => {
    expect(toArray(mergeTwoLists(build([]), build([0])))).toEqual([0]);
    expect(toArray(mergeTwoLists(build([1, 2, 3]), build([])))).toEqual([1, 2, 3]);
  });

  it('case 4: interleaves when one list is much shorter', () => {
    expect(toArray(mergeTwoLists(build([5]), build([1, 2])))).toEqual([1, 2, 5]);
  });

  it('case 5: keeps duplicates', () => {
    expect(toArray(mergeTwoLists(build([2, 2, 2]), build([2, 2])))).toEqual([2, 2, 2, 2, 2]);
  });

  it('case 6: handles negative values', () => {
    const merged = mergeTwoLists(build([-5, -2, 3]), build([-4, -1, 10]));
    expect(toArray(merged)).toEqual([-5, -4, -2, -1, 3, 10]);
  });
});`,
    cases: [],
  },
};
