import type { Exercise } from '@exercises/types';

export const minStack: Exercise = {
  id: 'min-stack',
  name: 'Min Stack',
  createdAt: '2026-09-21',
  difficulty: 'medium',
  type: 'Design / Stack',
  time: '20-25 min',
  description:
    'Design a stack that supports `push`, `pop`, `top` and retrieving the minimum element, all in O(1) time. Implement the class `MinStack`: `push(val)` adds to the top; `pop()` removes the top element; `top()` returns the top element; `getMin()` returns the smallest element currently in the stack. `pop`, `top` and `getMin` are only called on a non-empty stack.',
  examples: [
    {
      input: 'push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()',
      output: '-3, 0, -2',
      explanation: 'After popping -3, the minimum reverts to -2.',
    },
  ],
  constraints: [
    '-2^31 <= val <= 2^31 - 1',
    'At most 3 * 10^4 calls to push, pop, top and getMin',
    'pop, top and getMin are always called on a non-empty stack',
    'Every operation must be O(1)',
  ],
  functionSignature: 'export class MinStack',
  hints: [
    'A single stack is not enough to answer getMin in O(1)',
    'Keep a second stack whose top is the minimum so far',
    'On push, append min(val, currentMin) to the auxiliary stack',
    'On pop, pop both stacks so the minimum stays in sync',
  ],
  stub: `export class MinStack {
  push(val: number): void {
    void val;
    throw new Error('Not implemented');
  }

  pop(): void {
    throw new Error('Not implemented');
  }

  top(): number {
    throw new Error('Not implemented');
  }

  getMin(): number {
    throw new Error('Not implemented');
  }
}`,
  tests: {
    fileBody: `import { MinStack } from './exercise.js';

describe('Min Stack', () => {
  it('case 1: tracks the minimum across push and pop', () => {
    const stack = new MinStack();
    stack.push(-2);
    stack.push(0);
    stack.push(-3);
    expect(stack.getMin()).toBe(-3);
    stack.pop();
    expect(stack.top()).toBe(0);
    expect(stack.getMin()).toBe(-2);
  });

  it('case 2: a single element', () => {
    const stack = new MinStack();
    stack.push(5);
    expect(stack.top()).toBe(5);
    expect(stack.getMin()).toBe(5);
    stack.pop();
    stack.push(7);
    expect(stack.getMin()).toBe(7);
  });

  it('case 3: popping the minimum restores the previous minimum', () => {
    const stack = new MinStack();
    stack.push(2);
    stack.push(1);
    stack.push(3);
    expect(stack.getMin()).toBe(1);
    stack.pop();
    expect(stack.getMin()).toBe(1);
    stack.pop();
    expect(stack.getMin()).toBe(2);
  });

  it('case 4: duplicate minimums are handled', () => {
    const stack = new MinStack();
    stack.push(1);
    stack.push(1);
    stack.push(2);
    expect(stack.getMin()).toBe(1);
    stack.pop();
    stack.pop();
    expect(stack.getMin()).toBe(1);
    expect(stack.top()).toBe(1);
  });

  it('case 5: top reflects the most recent push', () => {
    const stack = new MinStack();
    stack.push(4);
    stack.push(2);
    stack.push(8);
    expect(stack.top()).toBe(8);
    stack.pop();
    expect(stack.top()).toBe(2);
    expect(stack.getMin()).toBe(2);
  });
});`,
    cases: [],
  },
};
