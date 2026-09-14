import type { Exercise } from '@exercises/types';

export const validPalindrome: Exercise = {
  id: 'valid-palindrome',
  name: 'Valid Palindrome',
  createdAt: '2026-09-14',
  difficulty: 'easy',
  type: 'Two Pointers + Strings',
  time: '15-20 min',
  description:
    'A phrase is a palindrome if, after converting all uppercase letters to lowercase and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Return true if it is a palindrome, false otherwise.',
  examples: [
    { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome' },
    { input: 's = "race a car"', output: 'false', explanation: '"raceacar" is not a palindrome' },
    { input: 's = " "', output: 'true', explanation: 'After removing non-alphanumerics, s is an empty string, which is a palindrome' },
  ],
  constraints: [
    '1 <= s.length <= 2 * 10^5',
    's consists only of printable ASCII characters',
  ],
  functionSignature: 'export function isPalindrome(s: string): boolean',
  hints: [
    'Use two pointers: left at start, right at end',
    'Skip non-alphanumeric characters from both ends',
    'Compare lowercase characters while moving inward',
  ],
  tests: [
    { input: ['A man, a plan, a canal: Panama'], expected: true },
    { input: ['race a car'], expected: false },
    { input: [' '], expected: true },
    { input: ['0P'], expected: false },
    { input: ['a'], expected: true },
    { input: ['Was it a car or a cat I saw?'], expected: true },
  ],
};