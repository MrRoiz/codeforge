import type { Exercise } from '@exercises/types';

export const mostUsedRoutePerCourier: Exercise = {
  id: 'most-used-route-per-courier',
  validation: [{ level: 'reported', source: 'EPAM' }],
  name: 'Most Used Route Per Courier',
  createdAt: '2026-09-14',
  difficulty: 'medium',
  type: 'Hash Map + Counting',
  time: '15-20 min',
  description:
    'Given a list of delivery records, each with a `courier`, an `origin` and a `destination`, return an object keyed by courier where each value is the route `[origin, destination]` that courier used most often, together with its count. On a tie between routes for the same courier, pick the route that appears first in the input. Return an empty object when the input list is empty.',
  examples: [
    {
      input:
        'deliveries = [{courier:"A",origin:"NY",destination:"LA"},{courier:"A",origin:"NY",destination:"LA"},{courier:"A",origin:"SF",destination:"LA"},{courier:"B",origin:"NY",destination:"Miami"},{courier:"B",origin:"Chicago",destination:"Miami"},{courier:"B",origin:"NY",destination:"Miami"}]',
      output: '{ A: { route: ["NY","LA"], count: 2 }, B: { route: ["NY","Miami"], count: 2 } }',
      explanation: 'A uses NY->LA twice and B uses NY->Miami twice; the single-use routes lose.',
    },
    { input: 'deliveries = []', output: '{}' },
    {
      input: 'deliveries = [{courier:"A",origin:"NY",destination:"LA"},{courier:"A",origin:"SF",destination:"LA"}]',
      output: '{ A: { route: ["NY","LA"], count: 1 } }',
      explanation: 'Both routes appear once; the tie goes to the first one encountered.',
    },
  ],
  constraints: [
    '0 <= deliveries.length <= 10^5',
    'courier, origin and destination are non-empty strings',
    'origin may equal destination',
  ],
  functionSignature:
    'export function mostUsedRoutePerCourier(deliveries: Delivery[]): Record<string, { route: [string, string]; count: number }>',
  hints: [
    'Group deliveries by courier, counting each (origin, destination) pair',
    'Make the pair usable as a key: the tuple itself, a nested map, or a "origin->destination" string',
    'For each courier keep the route with the highest count, replacing only on a strictly greater count so the first-encountered route wins ties',
    'Return an object from courier to { route, count }',
  ],
  tests: [
    {
      input: [
        [
          { courier: 'A', origin: 'NY', destination: 'LA' },
          { courier: 'A', origin: 'NY', destination: 'LA' },
          { courier: 'A', origin: 'SF', destination: 'LA' },
          { courier: 'B', origin: 'NY', destination: 'Miami' },
          { courier: 'B', origin: 'Chicago', destination: 'Miami' },
          { courier: 'B', origin: 'NY', destination: 'Miami' },
        ],
      ],
      expected: {
        A: { route: ['NY', 'LA'], count: 2 },
        B: { route: ['NY', 'Miami'], count: 2 },
      },
    },
    { input: [[]], expected: {} },
    {
      input: [[{ courier: 'A', origin: 'NY', destination: 'LA' }]],
      expected: { A: { route: ['NY', 'LA'], count: 1 } },
    },
    {
      input: [
        [
          { courier: 'A', origin: 'NY', destination: 'LA' },
          { courier: 'A', origin: 'SF', destination: 'LA' },
        ],
      ],
      expected: { A: { route: ['NY', 'LA'], count: 1 } },
    },
    {
      input: [
        [
          { courier: 'A', origin: 'NY', destination: 'NY' },
          { courier: 'A', origin: 'NY', destination: 'NY' },
        ],
      ],
      expected: { A: { route: ['NY', 'NY'], count: 2 } },
    },
    {
      input: [
        [
          { courier: 'A', origin: 'NY', destination: 'LA' },
          { courier: 'A', origin: 'NY', destination: 'LA' },
          { courier: 'A', origin: 'NY', destination: 'LA' },
          { courier: 'B', origin: 'SF', destination: 'NY' },
          { courier: 'B', origin: 'SF', destination: 'NY' },
          { courier: 'B', origin: 'NY', destination: 'LA' },
        ],
      ],
      expected: {
        A: { route: ['NY', 'LA'], count: 3 },
        B: { route: ['SF', 'NY'], count: 2 },
      },
    },
  ],
  stub: `interface Delivery {
  courier: string;
  origin: string;
  destination: string;
}

export function mostUsedRoutePerCourier(
  deliveries: Delivery[],
): Record<string, { route: [string, string]; count: number }> {
  // TODO: forge your solution
  throw new Error('Not implemented');
}`,
};