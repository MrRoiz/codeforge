import type { Exercise } from '@exercises/types';

export const representativeLeadAssignment: Exercise = {
  id: 'representative-lead-assignment',
  name: 'Representative Lead Assignment',
  createdAt: '2026-09-23',
  difficulty: 'medium',
  type: 'Greedy + Sorting',
  time: '20-30 min',
  description:
    'Given a list of `representatives` and a list of `leads`, assign each lead to a representative. Each representative has a `priority` (higher wins), a `capacity` (the most leads it may hold) and a `counter` (the leads already assigned to it). A representative can take a lead only while `counter < capacity`; its remaining room is `capacity - counter`. Process the leads in order: for each lead pick the representative with the most remaining room, breaking ties by higher priority and then by earlier position in the input. Assigning a lead increments that representative\u2019s `counter`. Return the id of the representative chosen for each lead, in lead order, and `null` for a lead that cannot be assigned because every representative is full.',
  examples: [
    {
      input:
        'representatives = [{id:"r1",priority:1,capacity:3,counter:0},{id:"r2",priority:2,capacity:3,counter:0}]\nleads = ["l1","l2","l3","l4","l5"]',
      output: '["r2","r1","r2","r1","r2"]',
      explanation:
        'Both start with room 3; the tie goes to r2 (higher priority). r2 then has less room, so the two alternate.',
    },
    {
      input:
        'representatives = [{id:"p",priority:9,capacity:1,counter:1},{id:"q",priority:1,capacity:1,counter:0}]\nleads = ["l1"]',
      output: '["q"]',
      explanation: 'p is already at capacity (counter 1), so only q can take the lead.',
    },
    {
      input: 'representatives = [{id:"z",priority:5,capacity:1,counter:1}]\nleads = ["l1","l2"]',
      output: '[null,null]',
      explanation: 'Every representative is full, so both leads go unassigned.',
    },
  ],
  constraints: [
    '0 <= representatives.length <= 10^5',
    '0 <= leads.length <= 10^5',
    'representative ids are non-empty and unique',
    '0 <= counter <= capacity for every representative',
    'priority is an integer; a larger value means higher priority',
  ],
  functionSignature:
    'export function assignLeads(representatives: Representative[], leads: string[]): (string | null)[]',
  hints: [
    'Track each representative\u2019s remaining room as capacity - counter',
    'Assigning a lead increments the chosen representative\u2019s counter, which changes its remaining room for the next lead',
    'Re-select the best representative per lead: most remaining room, then higher priority, then input order',
    'When no representative has any remaining room, emit null for that lead',
  ],
  tests: {
    cases: [
      {
        input: [
          [
            { id: 'r1', priority: 1, capacity: 3, counter: 0 },
            { id: 'r2', priority: 2, capacity: 3, counter: 0 },
          ],
          ['l1', 'l2', 'l3', 'l4', 'l5'],
        ],
        expected: ['r2', 'r1', 'r2', 'r1', 'r2'],
      },
      {
        input: [
          [
            { id: 'a', priority: 5, capacity: 2, counter: 0 },
            { id: 'b', priority: 1, capacity: 5, counter: 0 },
          ],
          ['l1', 'l2', 'l3', 'l4'],
        ],
        expected: ['b', 'b', 'b', 'a'],
      },
      {
        input: [
          [
            { id: 'x', priority: 1, capacity: 5, counter: 3 },
            { id: 'y', priority: 2, capacity: 2, counter: 0 },
          ],
          ['l1', 'l2'],
        ],
        expected: ['y', 'x'],
      },
      {
        input: [
          [
            { id: 'p', priority: 9, capacity: 1, counter: 1 },
            { id: 'q', priority: 1, capacity: 1, counter: 0 },
          ],
          ['l1'],
        ],
        expected: ['q'],
      },
      {
        input: [[{ id: 'z', priority: 5, capacity: 1, counter: 1 }], ['l1', 'l2']],
        expected: [null, null],
      },
      {
        input: [
          [
            { id: 'm', priority: 1, capacity: 2, counter: 0 },
            { id: 'n', priority: 1, capacity: 2, counter: 0 },
          ],
          ['l1'],
        ],
        expected: ['m'],
      },
      {
        input: [[{ id: 'r', priority: 1, capacity: 1, counter: 0 }], []],
        expected: [],
      },
      {
        input: [
          [{ id: 'r', priority: 1, capacity: 3, counter: 0 }],
          ['l1', 'l2', 'l3', 'l4', 'l5'],
        ],
        expected: ['r', 'r', 'r', null, null],
      },
      {
        input: [
          [
            { id: 'z', priority: 5, capacity: 0, counter: 0 },
            { id: 'w', priority: 1, capacity: 1, counter: 0 },
          ],
          ['l1'],
        ],
        expected: ['w'],
      },
      {
        input: [
          [
            { id: 'c', priority: 1, capacity: 1, counter: 0 },
            { id: 'd', priority: 1, capacity: 4, counter: 0 },
          ],
          ['l1', 'l2'],
        ],
        expected: ['d', 'd'],
      },
      {
        input: [
          [
            { id: 'a', priority: 2, capacity: 3, counter: 2 },
            { id: 'b', priority: 1, capacity: 3, counter: 0 },
          ],
          ['l1', 'l2', 'l3'],
        ],
        expected: ['b', 'b', 'a'],
      },
      {
        input: [
          [
            { id: 'a', priority: 1, capacity: 2, counter: 0 },
            { id: 'b', priority: 2, capacity: 2, counter: 0 },
            { id: 'c', priority: 3, capacity: 1, counter: 0 },
          ],
          ['l1', 'l2', 'l3', 'l4'],
        ],
        expected: ['b', 'a', 'c', 'b'],
      },
    ],
  },
  stub: `interface Representative {
  id: string;
  priority: number;
  capacity: number;
  counter: number;
}

export function assignLeads(
  representatives: Representative[],
  leads: string[],
): (string | null)[] {
  // TODO: forge your solution
  throw new Error('Not implemented');
}`,
};
