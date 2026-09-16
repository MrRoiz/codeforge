import type { Exercise } from '@exercises/types';

export const validAnagram: Exercise = {
  id: 'valid-anagram',
  name: 'Valid Anagram',
  createdAt: '2026-09-15',
  difficulty: 'easy',
  type: 'Hash Map / Counting',
  time: '10-15 min',
  description:
    'Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise. An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, using all the original letters exactly once.',
  examples: [
    {
      input: 's = "anagram", t = "nagaram"',
      output: 'true',
      explanation: 'Both strings use the same letters with the same counts.',
    },
    {
      input: 's = "rat", t = "car"',
      output: 'false',
      explanation: 'The letter counts differ, so t is not an anagram of s.',
    },
  ],
  constraints: [
    '1 <= s.length, t.length <= 5 * 10^4',
    's and t consist of lowercase English letters',
  ],
  functionSignature: 'export function isAnagram(s: string, t: string): boolean',
  hints: [
    'If the lengths differ, they cannot be anagrams',
    'Count the frequency of each character in s',
    'Decrement the counts while scanning t; any negative count means false',
  ],
  tests: {
    cases: [
      { input: ['anagram', 'nagaram'], expected: true },
      { input: ['rat', 'car'], expected: false },
      { input: ['a', 'a'], expected: true },
      { input: ['a', 'b'], expected: false },
      { input: ['ab', 'a'], expected: false },
      { input: ['listen', 'silent'], expected: true },
    ],
  },
};
