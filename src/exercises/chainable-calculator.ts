import type { Exercise } from '@exercises/types';

export const chainableCalculator: Exercise = {
  id: 'chainable-calculator',
  name: 'Chainable Calculator',
  createdAt: '2026-09-17',
  difficulty: 'medium',
  type: 'Functions / Fluent Interface',
  time: '15-20 min',
  description:
    'Build a calculator with a fluent (chainable) interface using a factory function. Implement `calculator(initial = 0)`: it returns an object exposing `add`, `subtract`, `multiply` and `divide`, each of which applies an operation to the running total and returns the same object so calls can be chained. `value()` returns the current total. Dividing by zero must throw an `Error`, and separate calls to `calculator` must not share state.',
  examples: [
    {
      input: 'calculator().add(5).subtract(2).multiply(3).value()',
      output: '9',
      explanation: 'Start at 0: 0 + 5 = 5, 5 - 2 = 3, 3 * 3 = 9.',
    },
    {
      input: 'calculator(10).divide(5).value()',
      output: '2',
      explanation: 'The initial argument seeds the running total with 10.',
    },
  ],
  constraints: [
    'The initial argument defaults to 0',
    'add, subtract, multiply and divide each return the same object',
    'divide(0) throws an Error',
    'Each call to calculator() has its own state',
    'Chains may be arbitrarily long',
  ],
  functionSignature: 'export function calculator(initial = 0)',
  hints: [
    'Keep the running total in a closure variable',
    'Return an object whose methods return that same object',
    'A default parameter handles the starting value',
    'Guard against division by zero before updating the total',
  ],
  stub: `export interface ChainableCalculator {
  add(value: number): this;
  subtract(value: number): this;
  multiply(value: number): this;
  divide(value: number): this;
  value(): number;
}

export function calculator(initial = 0): ChainableCalculator {
  void initial;
  throw new Error('Not implemented');
}`,
  tests: {
    fileBody: `import { calculator } from './exercise.js';

describe('Chainable Calculator', () => {
  it('case 1: starts at zero', () => {
    expect(calculator().value()).toBe(0);
  });

  it('case 2: chains add, subtract and multiply', () => {
    expect(calculator().add(5).subtract(2).multiply(3).value()).toBe(9);
  });

  it('case 3: supports division and a seeded start', () => {
    expect(calculator(10).divide(5).value()).toBe(2);
    expect(calculator().add(20).divide(4).subtract(1).value()).toBe(4);
  });

  it('case 4: every operation returns the same object for chaining', () => {
    const calc = calculator();
    expect(calc.add(1)).toBe(calc);
    expect(calc.subtract(1)).toBe(calc);
    expect(calc.multiply(2)).toBe(calc);
    expect(calc.divide(2)).toBe(calc);
  });

  it('case 5: separate calculators do not share state', () => {
    const a = calculator(1);
    const b = calculator(10);
    a.add(5);
    expect(a.value()).toBe(6);
    expect(b.value()).toBe(10);
  });

  it('case 6: preserves operation order', () => {
    expect(calculator().add(2).multiply(3).value()).toBe(6);
    expect(calculator().multiply(3).add(2).value()).toBe(2);
  });

  it('case 7: dividing by zero throws', () => {
    const calc = calculator().add(1);
    expect(() => calc.divide(0)).toThrow();
  });
});`,
    cases: [],
  },
};
