import type { Exercise } from '@exercises/types';

export const wordBreak: Exercise = {
  id: 'word-break',
  name: 'Word Break',
  difficulty: 'medium',
  type: 'Dynamic Programming (Strings)',
  time: '25-30 min',
  description:
    'Given a string `s` and a dictionary of strings `wordDict`, return true if `s` can be built by concatenating one or more dictionary words back-to-back. In other words, split `s` at any positions so that every resulting piece is in `wordDict`. Words may be reused, and the pieces do not have to align with natural spaces or have any particular length — e.g. "wordbreak" is valid when the dictionary contains "wor" and "dbreak".',
  examples: [
    { input: 's = "leetcode", wordDict = ["leet","code"]', output: 'true' },
    { input: 's = "applepenapple", wordDict = ["apple","pen"]', output: 'true' },
    { input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]', output: 'false' },
  ],
  constraints: [
    '1 <= s.length <= 300',
    '1 <= wordDict.length <= 1000',
    '1 <= wordDict[i].length <= 20',
  ],
  functionSignature: 'export function wordBreak(s: string, wordDict: string[]): boolean',
  hints: [
    'Let dp[i] be true if s[0..i) can be segmented',
    'For each i, check every word that ends at i: if dp[i - len] and the substring matches, set dp[i]',
    'Base case: dp[0] = true',
  ],
  tests: [
    { input: ['leetcode', ['leet', 'code']], expected: true },
    { input: ['applepenapple', ['apple', 'pen']], expected: true },
    { input: ['catsandog', ['cats', 'dog', 'sand', 'and', 'cat']], expected: false },
    { input: ['a', ['a']], expected: true },
    { input: ['ab', ['a', 'b']], expected: true },
    { input: ['ab', ['a']], expected: false },
    { input: ['cars', ['car', 'ca', 'rs']], expected: true },
    { input: ['a', ['a', 'b']], expected: true },
    { input: ['ba', ['a', 'ba']], expected: true },
    { input: ['bab', ['ba', 'b']], expected: true },
    { input: ['abcd', ['abc', 'bcd', 'a', 'd']], expected: true },
    { input: ['aaaaaaa', ['aaaa', 'aaa']], expected: true },
    { input: ['aaaa', ['aa']], expected: true },
    { input: ['ccbb', ['bc', 'cb']], expected: false },
  ],
};
