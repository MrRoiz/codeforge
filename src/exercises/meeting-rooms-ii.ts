import type { Exercise } from '@exercises/types';

export const meetingRoomsII: Exercise = {
  id: 'meeting-rooms-ii',
  name: 'Meeting Rooms II',
  difficulty: 'medium',
  type: 'Intervals + Heap',
  time: '25-30 min',
  description:
    'Given an array of meeting time intervals `intervals` where intervals[i] = [start, end], return the minimum number of conference rooms required.',
  examples: [
    { input: 'intervals = [[0,30],[5,10],[15,20]]', output: '2' },
    { input: 'intervals = [[7,10],[2,4]]', output: '1' },
  ],
  constraints: ['1 <= intervals.length <= 10^4', '0 <= start < end <= 10^6'],
  functionSignature: 'export function minMeetingRooms(intervals: number[][]): number',
  hints: [
    'Sort the meetings by start time',
    'Use a min-heap of end times for rooms currently in use',
    'If the earliest-ending room is free before the next meeting starts, reuse it',
    'The heap size is the answer',
  ],
  tests: [
    { input: [[[0, 30], [5, 10], [15, 20]]], expected: 2 },
    { input: [[[7, 10], [2, 4]]], expected: 1 },
    { input: [[[1, 5], [2, 6], [3, 7]]], expected: 3 },
    { input: [[[1, 2], [3, 4], [5, 6]]], expected: 1 },
    { input: [[[1, 10], [2, 3], [4, 5]]], expected: 2 },
    { input: [[[0, 1], [1, 2], [2, 3]]], expected: 1 },
  ],
};
