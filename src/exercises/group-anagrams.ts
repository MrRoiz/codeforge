import type { Exercise } from '@exercises/types';

export const groupAnagrams: Exercise = {
  id: 'group-anagrams',
  name: 'Group Anagrams',
  createdAt: '2026-09-21',
  difficulty: 'medium',
  type: 'Hash Map',
  time: '15-20 min',
  description:
    'Given an array of strings `strs`, group the anagrams together. An anagram is a word formed by rearranging the letters of another word, using all the original letters exactly once. Return the groups in any order, but keep the strings within each group in their original input order.',
  examples: [
    {
      input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
      output: '[["eat","tea","ate"],["tan","nat"],["bat"]]',
      explanation:
        'Groups may appear in any order; within a group the words keep their input order.',
    },
    { input: 'strs = [""]', output: '[[""]]' },
    { input: 'strs = ["a"]', output: '[["a"]]' },
  ],
  constraints: [
    '1 <= strs.length <= 10^4',
    '0 <= strs[i].length <= 100',
    'strs[i] consists of lowercase English letters',
  ],
  functionSignature: 'export function groupAnagrams(strs: string[]): string[][]',
  hints: [
    'Two words are anagrams iff their sorted characters are equal',
    'Use the sorted word (or a character-count signature) as a hash map key',
    'Append each word to the bucket for its key',
    'Sorting every word costs O(n * k log k); counting makes it O(n * k)',
  ],
  tests: {
    cases: [
      {
        input: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']],
        expected: [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']],
        sorted: true,
      },
      { input: [['']], expected: [['']], sorted: true },
      { input: [['a']], expected: [['a']], sorted: true },
      { input: [['', '']], expected: [['', '']], sorted: true },
      {
        input: [['abc', 'cba', 'bac', 'xyz', 'zyx']],
        expected: [
          ['abc', 'cba', 'bac'],
          ['xyz', 'zyx'],
        ],
        sorted: true,
      },
      {
        input: [['ab', 'ba', 'abc', 'bc', 'ac']],
        expected: [['ab', 'ba'], ['abc'], ['bc'], ['ac']],
        sorted: true,
      },
      {
        input: [['a', 'b', 'c']],
        expected: [['a'], ['b'], ['c']],
        sorted: true,
      },
      {
        input: [['ddddddddddg', 'dgggggggggg']],
        expected: [['ddddddddddg'], ['dgggggggggg']],
        sorted: true,
      },
    ],
  },
};
