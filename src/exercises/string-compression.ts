import type { Exercise } from '@exercises/types';

export const stringCompression: Exercise = {
  id: 'string-compression',
  name: 'String Compression',
  createdAt: '2026-09-14',
  difficulty: 'medium',
  type: 'Two Pointers (in-place)',
  time: '20-25 min',
  description:
    'Given an array of characters `chars`, compress it in place: for each group of consecutive repeating characters, append the character, and if the group length is greater than 1, append the length as digits. Return the new length `k`; the first `k` characters of `chars` should hold the compressed string. Use constant extra space.',
  examples: [
    {
      input: 'chars = ["a","a","b","b","c","c","c"]',
      output: '6',
      explanation:
        'Before: ["a","a","b","b","c","c","c"]\nAfter:  ["a","2","b","2","c","3","c"]\n        └─────── k = 6 ────────┘ └─┘ leftover, ignored\nOnly the first 6 characters ("a","2","b","2","c","3") are the answer — the array is not resized.',
    },
    {
      input: 'chars = ["a","a","a","b","b"]',
      output: '4',
      explanation:
        'Before: ["a","a","a","b","b"]\nAfter:  ["a","3","b","2","b"]\n        └─── k = 4 ────┘ └─┘ leftover, ignored\nOnly the first 4 characters ("a","3","b","2") are the answer — the array is not resized.',
    },
    {
      input: 'chars = ["a"]',
      output: '1',
      explanation:
        'Before: ["a"]\nAfter:  ["a"]\n        └──┘ k = 1\nA single character needs no compression — the first 1 character is the answer and the array is not resized.',
    },
    {
      input: 'chars = ["a","b","b","b","b","b","b","b","b","b","b","b","b"]',
      output: '4',
      explanation:
        'Before: ["a","b","b","b","b","b","b","b","b","b","b","b","b"]\nAfter:  ["a","b","1","2","b","b","b","b","b","b","b","b","b"]\n        └─── k = 4 ────┘ └─────── leftover, ignored ───────┘\nOnly the first 4 characters ("a","b","1","2") are the answer — the array is not resized.',
    },
  ],
  constraints: ['1 <= chars.length <= 1000', 'chars[i] is a letter, digit, or symbol'],
  functionSignature: 'export function compress(chars: string[]): number',
  hints: [
    'Use a read pointer and a write pointer',
    'Count consecutive equal characters',
    'Write the character, then write the count digits one at a time (handles multi-digit counts)',
    'Return the write pointer as the new length',
  ],
  tests: {
    mutatesInputPrefix: true,
    cases: [
      { input: [['a', 'a', 'b', 'b', 'c', 'c', 'c']], expected: ['a', '2', 'b', '2', 'c', '3'] },
      { input: [['a']], expected: ['a'] },
      {
        input: [['a', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b']],
        expected: ['a', 'b', '1', '2'],
      },
      { input: [['a', 'a', 'a', 'b', 'b']], expected: ['a', '3', 'b', '2'] },
      { input: [['a', 'a', 'b']], expected: ['a', '2', 'b'] },
      { input: [['a', 'b', 'b', 'c']], expected: ['a', 'b', '2', 'c'] },
      { input: [['a', 'b', 'c']], expected: ['a', 'b', 'c'] },
      { input: [['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a']], expected: ['a', '1', '0'] },
      {
        input: [
          [
            'x',
            'x',
            'x',
            'x',
            'x',
            'x',
            'x',
            'x',
            'x',
            'x',
            'y',
            'y',
            'y',
            'y',
            'y',
            'y',
            'y',
            'y',
            'y',
            'y',
            'y',
            'y',
          ],
        ],
        expected: ['x', '1', '0', 'y', '1', '2'],
      },
    ],
  },
};
