import type { Exercise } from '@exercises/types';

export const wordBreak: Exercise = {
  id: 'word-break',
  name: 'Word Break',
  createdAt: '2026-09-14',
  difficulty: 'medium',
  type: 'Dynamic Programming (Strings)',
  time: '25-30 min',
  description:
    'Given a string `s` and a dictionary of strings `wordDict`, return true if `s` can be segmented into a sequence of one or more dictionary words that together cover the entire string with nothing left over. You may split `s` at any positions; every resulting piece must be a word in `wordDict`. Words may be reused any number of times, and pieces can have any length — they do not need to align with natural spaces. For example, "wordbreak" is valid when the dictionary contains "wor" and "dbreak".',
  examples: [
    {
      input: 's = "leetcode", wordDict = ["leet","code"]',
      output: 'true',
      explanation: '"leet" + "code" covers the whole string',
    },
    {
      input: 's = "applepenapple", wordDict = ["apple","pen"]',
      output: 'true',
      explanation: '"apple" + "pen" + "apple" — words may be reused',
    },
    {
      input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]',
      output: 'false',
      explanation:
        'No split covers the whole string, e.g. "cat" + "sand" + "og" leaves "og", which is not in the dictionary',
    },
    {
      input: 's = "cars", wordDict = ["car","ca","rs"]',
      output: 'true',
      explanation:
        '"car" + "s" fails ("s" is not a word), but "ca" + "rs" covers the whole string — remember to try all splits, not just the first match',
    },
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
  tests: {
    cases: [
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
  },
};
