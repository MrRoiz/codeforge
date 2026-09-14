import type { Exercise } from '@exercises/types';

export const validParentheses: Exercise = {
  id: 'valid-parentheses',
  name: 'Valid Parentheses',
  difficulty: 'easy',
  type: 'Stack',
  time: '15-20 min',
  description:
    "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: open brackets must be closed by the same type of brackets, open brackets must be closed in the correct order, and every close bracket has a corresponding open bracket of the same type.",
  examples: [
    { input: 's = "()"', output: 'true' },
    { input: 's = "()[]{}"', output: 'true' },
    { input: 's = "(]"', output: 'false' },
    { input: 's = "([)]"', output: 'false' },
    { input: 's = "{[]}"', output: 'true' },
  ],
  constraints: ['1 <= s.length <= 10^4', "s consists of parentheses only '()[]{}'"],
  functionSignature: 'export function isValid(s: string): boolean',
  hints: [
    'Use a stack to track open brackets',
    'When you see a closing bracket, check if it matches the top of the stack',
    'At the end, the stack should be empty for a valid string',
  ],
  tests: [
    { input: ['()'], expected: true },
    { input: ['()[]{}'], expected: true },
    { input: ['(]'], expected: false },
    { input: ['([)]'], expected: false },
    { input: ['{[]}'], expected: true },
    { input: ['('], expected: false },
    { input: [')'], expected: false },
    { input: ['(('], expected: false },
    { input: ['())'], expected: false },
  ],
};