import type { Exercise } from '@exercises/types';

export const stringCompression: Exercise = {
  id: 'string-compression',
  validation: [{ level: 'reported', source: 'GoDaddy' }],
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
      explanation: 'The first 6 characters become ["a","2","b","2","c","3"]',
    },
    { input: 'chars = ["a"]', output: '1' },
    {
      input: 'chars = ["a","b","b","b","b","b","b","b","b","b","b","b","b"]',
      output: '4',
      explanation: 'Compressed to ["a","b","1","2"]',
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
  mutatesInputPrefix: true,
  tests: [
    { input: [['a', 'a', 'b', 'b', 'c', 'c', 'c']], expected: ['a', '2', 'b', '2', 'c', '3'] },
    { input: [['a']], expected: ['a'] },
    {
      input: [['a', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b']],
      expected: ['a', 'b', '1', '2'],
    },
    { input: [['a', 'a', 'a', 'b', 'b']], expected: ['a', '3', 'b', '2'] },
    { input: [['a', 'b', 'c']], expected: ['a', 'b', 'c'] },
    { input: [['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a']], expected: ['a', '1', '0'] },
  ],
};
