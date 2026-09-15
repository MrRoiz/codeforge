import type { Exercise } from '@exercises/types';

export const longestSubstringNoRepeat: Exercise = {
  id: 'longest-substring-no-repeat',
  name: 'Longest Substring Without Repeating Characters',
  createdAt: '2026-09-14',
  difficulty: 'medium',
  type: 'Sliding Window + Hash Map',
  time: '20-30 min',
  description:
    'Given a string `s`, find the length of the longest substring without repeating characters. A substring is contiguous.',
  examples: [
    {
      input: 's = "abcadcbb"',
      output: '4',
      explanation: 'The longest substrings without repeats have length 4, e.g. "bcad" or "adcb" — return the length, 4.',
    },
    {
      input: 's = "pwwkew"',
      output: '3',
      explanation: 'The longest substrings have length 3, e.g. "wke" or "kew" — return the length, 3.',
    },
    {
      input: 's = "bbbbb"',
      output: '1',
      explanation: 'The only non-repeating substring is "b" — return the length, 1.',
    },
    { input: 's = ""', output: '0' },
  ],
  constraints: [
    '0 <= s.length <= 5 * 10^4',
    's consists of English letters, digits, symbols and spaces',
  ],
  functionSignature: 'export function lengthOfLongestSubstring(s: string): number',
  hints: [
    'Use a sliding window with two pointers',
    'Use a Map to track the last seen index of each character',
    'When a duplicate is found inside the window, move start past its previous occurrence',
    'The `lastSeen[ch] >= start` guard is crucial to avoid stale entries (try "abba")',
  ],
  tests: [
    { input: ['abcadcbb'], expected: 4 },
    { input: ['pwwkew'], expected: 3 },
    { input: ['bbbbb'], expected: 1 },
    { input: [''], expected: 0 },
    { input: ['abba'], expected: 2 },
    { input: ['abcdef'], expected: 6 },
    { input: ['aab'], expected: 2 },
    { input: ['dvdf'], expected: 3 },
  ],
};