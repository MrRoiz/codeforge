import type { Exercise } from '@exercises/types';

export const wordBreak: Exercise = {
  id: 'word-break',
  name: 'Word Break',
  difficulty: 'medium',
  type: 'Dynamic Programming (Strings)',
  time: '25-30 min',
  description:
    'Given a string `s` and a dictionary of strings `wordDict`, return true if `s` can be segmented into a space-separated sequence of one or more dictionary words. The same word may be reused.',
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
  ],
};
