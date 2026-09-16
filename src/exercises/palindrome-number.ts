import type { Exercise } from '@exercises/types';

export const palindromeNumber: Exercise = {
  id: 'palindrome-number',
  name: 'Palindrome Number',
  createdAt: '2026-09-15',
  difficulty: 'easy',
  type: 'Math',
  time: '10-15 min',
  description:
    'Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise. An integer is a palindrome when it reads the same forward and backward. For example, `121` is a palindrome while `123` is not.',
  examples: [
    {
      input: 'x = 121',
      output: 'true',
      explanation: 'Reads as 121 from left to right and from right to left.',
    },
    {
      input: 'x = -121',
      output: 'false',
      explanation:
        'From left to right it reads -121. From right to left it becomes 121-. So it is not a palindrome.',
    },
  ],
  constraints: ['-2^31 <= x <= 2^31 - 1'],
  functionSignature: 'export function isPalindrome(x: number): boolean',
  hints: [
    'A negative number is never a palindrome because of the minus sign',
    'A number ending in 0 (but not 0 itself) is never a palindrome',
    'Reverse half the number and compare it with the remaining half',
  ],
  tests: {
    cases: [
      { input: [121], expected: true },
      { input: [-121], expected: false },
      { input: [10], expected: false },
      { input: [0], expected: true },
      { input: [12321], expected: true },
      { input: [1000021], expected: false },
    ],
  },
};
