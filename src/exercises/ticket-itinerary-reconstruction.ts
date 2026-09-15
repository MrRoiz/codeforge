import type { Exercise } from '@exercises/types';

export const ticketItineraryReconstruction: Exercise = {
  id: 'ticket-itinerary-reconstruction',
  name: 'Ticket Itinerary Reconstruction',
  createdAt: '2026-09-14',
  difficulty: 'medium',
  type: 'Hash Map + Graph',
  time: '20-25 min',
  description:
    'You have ticket pairs [from, to] shuffled out of order. Exactly one city appears only as a departure (the start) and one only as an arrival (the end). Rebuild and return the full itinerary as a list of cities. Tickets form a single valid path with no duplicates.',
  examples: [
    {
      input: 'tickets = [["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]]',
      output: '["JFK","MUC","LHR","SFO","SJC"]',
    },
  ],
  constraints: ['1 <= tickets.length <= 10^4', 'Cities are non-empty strings', 'The route is a single valid path'],
  functionSignature: 'export function reconstructItinerary(tickets: string[][]): string[]',
  hints: [
    'The start city is the one that never appears as a destination',
    'Build a map from each origin to its destination',
    'Walk the map from the start, collecting cities',
  ],
  tests: {
    cases: [
      {
        input: [[['MUC', 'LHR'], ['JFK', 'MUC'], ['SFO', 'SJC'], ['LHR', 'SFO']]],
        expected: ['JFK', 'MUC', 'LHR', 'SFO', 'SJC'],
      },
      { input: [[['A', 'B']]], expected: ['A', 'B'] },
      { input: [[['B', 'C'], ['A', 'B']]], expected: ['A', 'B', 'C'] },
      { input: [[['SFO', 'LAX'], ['LAX', 'JFK'], ['JFK', 'ORD']]], expected: ['SFO', 'LAX', 'JFK', 'ORD'] },
      { input: [[['X', 'Y'], ['Y', 'Z'], ['Z', 'W']]], expected: ['X', 'Y', 'Z', 'W'] },
    ],
  },
};
