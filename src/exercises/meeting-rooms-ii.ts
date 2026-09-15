import type { Exercise } from '@exercises/types';

export const meetingRoomsII: Exercise = {
  id: 'meeting-rooms-ii',
  name: 'Meeting Rooms II',
  createdAt: '2026-09-14',
  difficulty: 'medium',
  type: 'Intervals + Heap',
  time: '25-30 min',
  description:
    'Given an array of meeting time intervals `intervals` where intervals[i] = [start, end], return the minimum number of conference rooms required. A meeting occupies the half-open interval [start, end): it releases the room at `end`, so meetings like [0, 1] and [1, 2] can share a room.',
  examples: [
    {
      input: 'intervals = [[0,30],[5,10],[15,20]]',
      output: '2',
      explanation:
        '[0,30] overlaps both [5,10] and [15,20], so 2 rooms are needed; [5,10] and [15,20] do not overlap each other.',
    },
    { input: 'intervals = [[7,10],[2,4]]', output: '1' },
    {
      input: 'intervals = [[0,1],[1,2],[2,3]]',
      output: '1',
      explanation: 'Back-to-back meetings share one room',
    },
  ],
  constraints: ['1 <= intervals.length <= 10^4', '0 <= start < end <= 10^6'],
  functionSignature: 'export function minMeetingRooms(intervals: number[][]): number',
  hints: [
    'Sort the meetings by start time',
    'Use a min-heap of end times for rooms currently in use',
    'If the earliest-ending room is free before the next meeting starts, reuse it',
    'The heap size is the answer',
  ],
  tests: {
    cases: [
      {
        input: [
          [
            [0, 30],
            [5, 10],
            [15, 20],
          ],
        ],
        expected: 2,
      },
      {
        input: [
          [
            [7, 10],
            [2, 4],
          ],
        ],
        expected: 1,
      },
      {
        input: [
          [
            [1, 5],
            [2, 6],
            [3, 7],
          ],
        ],
        expected: 3,
      },
      {
        input: [
          [
            [1, 2],
            [3, 4],
            [5, 6],
          ],
        ],
        expected: 1,
      },
      {
        input: [
          [
            [1, 10],
            [2, 3],
            [4, 5],
          ],
        ],
        expected: 2,
      },
      {
        input: [
          [
            [0, 1],
            [1, 2],
            [2, 3],
          ],
        ],
        expected: 1,
      },
    ],
  },
};
