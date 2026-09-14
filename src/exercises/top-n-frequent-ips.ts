import type { Exercise } from '@exercises/types';

export const topNFrequentIps: Exercise = {
  id: 'top-n-frequent-ips',
  name: 'Top N Frequent IPs',
  createdAt: '2026-09-14',
  difficulty: 'medium',
  type: 'Hash Map + Heap',
  time: '20-25 min',
  description:
    'Given a list of IP addresses from server logs, return the `n` most frequent IP addresses. Tests use distinct top frequencies so the result set is unambiguous.',
  examples: [
    {
      input:
        'ips = ["192.168.1.1","10.0.0.1","192.168.1.1","192.168.1.1","10.0.0.1","172.16.0.1"], n = 2',
      output: '["192.168.1.1","10.0.0.1"]',
    },
  ],
  constraints: ['1 <= ips.length <= 10^5', '1 <= n <= number of unique IPs'],
  functionSignature: 'export function topNFrequentIps(ips: string[], n: number): string[]',
  hints: [
    'Count frequencies with a hash map',
    'Keep a min-heap of size n, or sort the unique IPs by count',
    'Return the top n by count',
  ],
  tests: [
    {
      input: [
        [
          '192.168.1.1',
          '10.0.0.1',
          '192.168.1.1',
          '192.168.1.1',
          '10.0.0.1',
          '172.16.0.1',
        ],
        2,
      ],
      expected: ['192.168.1.1', '10.0.0.1'],
      sorted: true,
    },
    { input: [['1.1.1.1', '1.1.1.1', '1.1.1.1', '2.2.2.2', '2.2.2.2', '3.3.3.3'], 1], expected: ['1.1.1.1'], sorted: true },
    { input: [['1.1.1.1', '1.1.1.1', '1.1.1.1', '2.2.2.2', '2.2.2.2', '3.3.3.3'], 3], expected: ['1.1.1.1', '2.2.2.2', '3.3.3.3'], sorted: true },
    { input: [['10.0.0.1', '10.0.0.1', '192.168.1.1', '192.168.1.1', '192.168.1.1', '172.16.0.1'], 1], expected: ['192.168.1.1'], sorted: true },
    { input: [['1.1.1.1'], 1], expected: ['1.1.1.1'], sorted: true },
  ],
};
