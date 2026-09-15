import type { Exercise } from '@exercises/types';

export const reverseString: Exercise = {
  id: 'reverse-string',
  name: 'Reverse String',
  createdAt: '2026-09-14',
  difficulty: 'easy',
  type: 'Two Pointers',
  time: '10-15 min',
  description:
    'Write a function that reverses a string. The input string is given as an array of characters `s`. You must do this by modifying the input array in-place with O(1) extra memory. Do not return anything; mutate `s` instead.',
  examples: [
    {
      input: 's = ["h","e","l","l","o"]',
      output: 's becomes ["o","l","l","e","h"] (no return value)',
      explanation:
        'In-place: the input array `s` is reversed. The function returns nothing (void); the graded result is the mutated array `s` itself, not a return value.',
    },
    {
      input: 's = ["H","a","n","n","a","h"]',
      output: 's becomes ["h","a","n","n","a","H"] (no return value)',
      explanation: 'In-place: `s` is reversed; nothing is returned.',
    },
  ],
  constraints: ['1 <= s.length <= 10^5', 's[i] is a printable ascii character'],
  functionSignature: 'export function reverseString(s: string[]): void',
  hints: [
    'Use two pointers: one at start, one at end',
    'Swap characters at both pointers',
    'Move pointers towards the center',
    'Stop when the pointers meet',
  ],
  tests: {
    mutatesInput: true,
    cases: [
      { input: [['h', 'e', 'l', 'l', 'o']], expected: ['o', 'l', 'l', 'e', 'h'] },
      { input: [['H', 'a', 'n', 'n', 'a', 'h']], expected: ['h', 'a', 'n', 'n', 'a', 'H'] },
      { input: [['a']], expected: ['a'] },
      { input: [['a', 'b']], expected: ['b', 'a'] },
    ],
  },
};