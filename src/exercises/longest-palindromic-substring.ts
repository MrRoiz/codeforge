import type { Exercise } from '@exercises/types';

export const longestPalindromicSubstring: Exercise = {
  id: 'longest-palindromic-substring',
  name: 'Longest Palindromic Substring',
  createdAt: '2026-09-14',
  difficulty: 'medium',
  type: 'Two Pointers / DP',
  time: '20-25 min',
  description:
    'Given a string `s`, return the longest palindromic substring in `s`. Tests are chosen so the longest palindromic substring is unique.',
  examples: [
    { input: 's = "cbbd"', output: '"bb"' },
    {
      input: 's = "racecar"',
      output: '"racecar"',
      explanation: 'The whole string is a palindrome',
    },
    { input: 's = "forgeeksskeegfor"', output: '"geeksskeeg"' },
  ],
  constraints: ['1 <= s.length <= 1000', 's consists of only digits and English letters'],
  functionSignature: 'export function longestPalindrome(s: string): string',
  hints: [
    'Expand around every center (both odd- and even-length palindromes)',
    'Track the start and length of the best palindrome found',
    'Or use DP: dp[i][j] is true when s[i..j] is a palindrome',
  ],
  tests: {
    cases: [
      { input: ['cbbd'], expected: 'bb' },
      { input: ['racecar'], expected: 'racecar' },
      { input: ['a'], expected: 'a' },
      { input: ['abba'], expected: 'abba' },
      { input: ['abccba'], expected: 'abccba' },
      { input: ['forgeeksskeegfor'], expected: 'geeksskeeg' },
    ],
  },
};
