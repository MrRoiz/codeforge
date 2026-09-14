import type { Exercise } from '@exercises/types';

export const digitSumWithoutConversion: Exercise = {
  id: 'digit-sum-without-conversion',
  name: 'Digit Sum Without Conversion',
  createdAt: '2026-09-14',
  difficulty: 'easy',
  type: 'Strings / ASCII',
  time: '10-15 min',
  description:
    'Given a numeric string like "12345", compute the sum of its digits without converting the string (or any substring) to a number — use character-by-character arithmetic. Input is guaranteed to contain only digit characters.',
  examples: [
    { input: 's = "12345"', output: '15' },
    { input: 's = "0"', output: '0' },
    { input: 's = "99999"', output: '45' },
  ],
  constraints: ['1 <= s.length <= 10^5', 's consists of digit characters only'],
  functionSignature: 'export function digitSum(s: string): number',
  hints: [
    'Each character has an ordinal value: "0" is 48',
    "Subtract the code of '0' to get the digit value: charCodeAt(i) - 48",
    'Accumulate in a single pass — no parseInt, no Number()',
  ],
  tests: [
    { input: ['12345'], expected: 15 },
    { input: ['0'], expected: 0 },
    { input: ['99999'], expected: 45 },
    { input: ['1001'], expected: 2 },
    { input: ['9'], expected: 9 },
    { input: ['10'], expected: 1 },
    { input: ['1234567890'], expected: 45 },
  ],
};
