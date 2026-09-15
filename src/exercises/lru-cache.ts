import type { Exercise } from '@exercises/types';

export const lruCache: Exercise = {
  id: 'lru-cache',
  name: 'LRU Cache',
  createdAt: '2026-09-14',
  difficulty: 'medium',
  type: 'Design / Hash Map + Linked List',
  time: '25-30 min',
  description:
    'Design a Least Recently Used (LRU) cache. Implement the class `LRUCache`: the constructor takes a positive capacity; `get(key)` returns the value or -1; `put(key, value)` inserts or updates an entry. Both `get` and `put` mark the accessed key as the most recently used, and a `put` that exceeds capacity evicts the least recently used entry. Both operations must run in O(1) average time.',
  examples: [
    {
      input: 'capacity = 2: put(1,1), put(2,2), get(1), put(3,3), get(2)',
      output: 'get(1) -> 1; get(2) -> -1',
      explanation:
        'get(1) returns 1 and marks key 1 as most recently used; put(3,3) then evicts key 2, the least recently used entry.',
    },
  ],
  constraints: [
    '1 <= capacity <= 3000',
    '0 <= key <= 10^4',
    '0 <= value <= 10^5',
    'At most 2 * 10^5 calls to get and put',
  ],
  functionSignature: 'export class LRUCache',
  hints: [
    'Combine a hash map (key -> node) with a doubly linked list of recency',
    'Most recently used at the head, least recently used at the tail',
    'On get, move the node to the head',
    'On put at capacity, remove the tail node and its map entry before inserting',
  ],
  stub: `export class LRUCache {
  constructor(capacity: number) {
    void capacity;
  }

  get(key: number): number {
    void key;
    throw new Error('Not implemented');
  }

  put(key: number, value: number): void {
    void key;
    void value;
    throw new Error('Not implemented');
  }
}`,
  tests: {
    fileBody: `import { LRUCache } from './exercise.js';

describe('LRU Cache', () => {
  it('case 1: evicts the least recently used entry', () => {
    const cache = new LRUCache(2);
    cache.put(1, 1);
    cache.put(2, 2);
    expect(cache.get(1)).toBe(1);
    cache.put(3, 3); // evicts key 2
    expect(cache.get(2)).toBe(-1);
    cache.put(4, 4); // evicts key 1
    expect(cache.get(1)).toBe(-1);
    expect(cache.get(3)).toBe(3);
    expect(cache.get(4)).toBe(4);
  });

  it('case 2: capacity of 1', () => {
    const cache = new LRUCache(1);
    cache.put(1, 10);
    expect(cache.get(1)).toBe(10);
    cache.put(2, 20); // evicts key 1
    expect(cache.get(1)).toBe(-1);
    expect(cache.get(2)).toBe(20);
  });

  it('case 3: updating an existing key refreshes recency', () => {
    const cache = new LRUCache(2);
    cache.put(1, 1);
    cache.put(2, 2);
    cache.put(1, 10); // key 1 becomes most recently used
    expect(cache.get(1)).toBe(10);
    cache.put(3, 3); // evicts key 2
    expect(cache.get(2)).toBe(-1);
    expect(cache.get(1)).toBe(10);
  });

  it('case 4: get on a missing key returns -1', () => {
    const cache = new LRUCache(2);
    expect(cache.get(99)).toBe(-1);
  });
});`,
    cases: [],
  },
};
