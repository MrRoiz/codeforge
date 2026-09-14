import type { Exercise } from '@exercises/types';

export const longestCommonPrefix: Exercise = {
  id: 'longest-common-prefix',
  name: 'Longest Common Prefix',
  createdAt: '2026-09-14',
  difficulty: 'easy',
  type: 'Strings',
  time: '15-20 min',
  description:
    'Find the longest common prefix string among an array of strings. If there is no common prefix, return an empty string.',
  examples: [
    { input: 'strs = ["flower", "flow", "flight"]', output: '"fl"' },
    { input: 'strs = ["dog", "racecar", "car"]', output: '""', explanation: 'There is no common prefix' },
    { input: 'strs = ["interspecies", "interstellar", "interstate"]', output: '"inters"' },
  ],
  constraints: [
    '1 <= strs.length <= 200',
    '0 <= strs[i].length <= 200',
    'strs[i] consists of only lowercase English letters',
  ],
  functionSignature: 'export function longestCommonPrefix(strs: string[]): string',
  hints: [
    'Vertical scanning: compare character by character across all strings',
    'Horizontal scanning: reduce the prefix iteratively between pairs',
    'Trick: sort the array, then compare only the first and last strings',
  ],
  tests: [
    { input: [['flower', 'flow', 'flight']], expected: 'fl' },
    { input: [['dog', 'racecar', 'car']], expected: '' },
    { input: [['interspecies', 'interstellar', 'interstate']], expected: 'inters' },
    { input: [['']], expected: '' },
    { input: [['a']], expected: 'a' },
    { input: [['abc', 'abc', 'abc']], expected: 'abc' },
    { input: [['ab', 'abc', 'abcd']], expected: 'ab' },
  ],
};