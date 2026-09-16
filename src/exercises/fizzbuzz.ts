import type { Exercise } from '@exercises/types';

export const fizzBuzz: Exercise = {
  id: 'fizzbuzz',
  name: 'FizzBuzz',
  createdAt: '2026-09-15',
  difficulty: 'easy',
  type: 'Simulation',
  time: '5-10 min',
  description:
    'Given an integer `n`, return a string array `answer` (1-indexed) where `answer[i] == "FizzBuzz"` if `i` is divisible by 3 and 5, `answer[i] == "Fizz"` if `i` is divisible by 3, `answer[i] == "Buzz"` if `i` is divisible by 5, and `answer[i] == i` (as a string) if none of the above is true.',
  examples: [
    {
      input: 'n = 3',
      output: '["1","2","Fizz"]',
      explanation: '3 is divisible by 3, so "Fizz"',
    },
    {
      input: 'n = 5',
      output: '["1","2","Fizz","4","Buzz"]',
      explanation: '5 is divisible by 5, so "Buzz"',
    },
  ],
  constraints: ['1 <= n <= 10^4'],
  functionSignature: 'export function fizzBuzz(n: number): string[]',
  hints: [
    'Loop from 1 to n',
    'Check divisibility by 15 first (both 3 and 5), then 3, then 5',
    'Otherwise convert the number to a string',
  ],
  tests: {
    cases: [
      { input: [1], expected: ['1'] },
      { input: [3], expected: ['1', '2', 'Fizz'] },
      { input: [5], expected: ['1', '2', 'Fizz', '4', 'Buzz'] },
      {
        input: [15],
        expected: [
          '1',
          '2',
          'Fizz',
          '4',
          'Buzz',
          'Fizz',
          '7',
          '8',
          'Fizz',
          'Buzz',
          '11',
          'Fizz',
          '13',
          '14',
          'FizzBuzz',
        ],
      },
    ],
  },
};
