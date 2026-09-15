import type { Exercise } from '@exercises/types';

export const packageTransportation: Exercise = {
  id: 'package-transportation',
  validation: [{ level: 'reported', source: 'Amazon' }],
  name: 'Package Transportation',
  createdAt: '2026-09-14',
  difficulty: 'medium',
  type: 'Greedy + Sorting',
  time: '20-25 min',
  description:
    'A logistics fleet ships packages with n trucks, each with an initial capacity. A truck can carry a package only if the package weight is at most the truck\u2019s current capacity; after a delivery, that truck\u2019s capacity is halved (rounded down) and it may be reused. Given truckCapacities and packageWeights, determine whether every package can be shipped. Return 1 if possible, 0 otherwise.',
  examples: [
    {
      input: 'truckCapacities = [3, 5], packageWeights = [3, 2, 1]',
      output: '1',
      explanation:
        'Process heaviest-first: 3 on the cap-3 truck (becomes 1); 2 on the cap-5 truck (becomes 2); 1 on the cap-1 truck (becomes 0). Every package ships, so return 1.',
    },
    {
      input: 'truckCapacities = [2, 2], packageWeights = [2, 2, 2]',
      output: '0',
      explanation:
        'After two deliveries both trucks hold capacity 1; the third 2-weight package fits neither',
    },
    {
      input: 'truckCapacities = [11], packageWeights = [8, 5]',
      output: '1',
      explanation: 'Ship 8 on truck 11 (becomes 5), then ship 5 on the same truck (becomes 2)',
    },
  ],
  constraints: [
    '1 <= truckCapacities.length <= 10^5',
    '1 <= packageWeights.length <= 10^5',
    '1 <= truckCapacities[i], packageWeights[i] <= 10^9',
  ],
  functionSignature:
    'export function canShipAll(truckCapacities: number[], packageWeights: number[]): number',
  hints: [
    'This is a greedy scheduling problem — the order you process packages matters.',
    'Process packages in descending order of weight so the heavy packages get first pick of the big trucks.',
    'For each package, use the smallest truck that can still carry it (best-fit); never burn a bigger truck when a smaller one works.',
    'A truck is reusable: after a delivery, halve its capacity (floor) and keep it in the pool while it still fits something.',
  ],
  tests: {
    cases: [
      {
        input: [
          [3, 5],
          [3, 2, 1],
        ],
        expected: 1,
      },
      {
        input: [
          [2, 2],
          [2, 2, 2],
        ],
        expected: 0,
      },
      {
        input: [
          [100, 50],
          [40, 25, 25, 12, 12],
        ],
        expected: 1,
      },
      { input: [[11], [8, 5]], expected: 1 },
      {
        input: [
          [10, 7],
          [1, 4, 8],
        ],
        expected: 1,
      },
      { input: [[5, 5, 5], [6]], expected: 0 },
      {
        input: [
          [1, 1],
          [1, 1, 1],
        ],
        expected: 0,
      },
      { input: [[10], [5, 5]], expected: 1 },
      {
        input: [
          [9, 2],
          [8, 4, 1],
        ],
        expected: 1,
      },
      { input: [[7], [7]], expected: 1 },
      { input: [[1000000000], [500000000, 250000000, 125000000]], expected: 1 },
      { input: [[8], [8, 4, 2, 1]], expected: 1 },
    ],
  },
};
