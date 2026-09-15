import type { Exercise } from '@exercises/types';

export const minimumWindowSubstring: Exercise = {
  id: 'minimum-window-substring',
  name: 'Minimum Window Substring',
  createdAt: '2026-09-14',
  difficulty: 'hard',
  type: 'Sliding Window',
  time: '25-30 min',
  description:
    'Given two strings `s` and `t`, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string "". Answers are unique.',
  examples: [
    { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"' },
    { input: 's = "a", t = "a"', output: '"a"' },
    { input: 's = "a", t = "aa"', output: '""', explanation: 's does not contain two a characters' },
  ],
  constraints: [
    '1 <= s.length, t.length <= 10^5',
    's and t consist of uppercase and lowercase English letters',
  ],
  functionSignature: 'export function minWindow(s: string, t: string): string',
  hints: [
    'Count the characters needed from t',
    'Grow the right pointer until the window is valid',
    'Shrink the left pointer while it stays valid, recording the smallest window',
    'Track how many required characters are currently satisfied',
  ],
  tests: {
    cases: [
      { input: ['ADOBECODEBANC', 'ABC'], expected: 'BANC' },
      { input: ['a', 'a'], expected: 'a' },
      { input: ['a', 'aa'], expected: '' },
      { input: ['aa', 'aa'], expected: 'aa' },
      { input: ['a', 'b'], expected: '' },
      { input: ['abc', 'c'], expected: 'c' },
      { input: ['bdab', 'ab'], expected: 'ab' },
    ],
  },
};
