export interface ExerciseTest {
  input: unknown[];
  expected: unknown;
  sorted?: boolean;
}

export interface TestConfig {
  cases: ExerciseTest[];
  /** solution mutates its first argument in place (and may return nothing) */
  mutatesInput?: boolean;
  /** solution mutates its first argument and returns a length; compare the first `result` chars to expected */
  mutatesInputPrefix?: boolean;
  /** optional full test file content (overrides generated tests) */
  fileBody?: string;
}

export interface Exercise {
  id: string;
  name: string;
  /** ISO date (YYYY-MM-DD) the exercise was added to the app */
  createdAt: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: string;
  time: string;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  functionSignature: string;
  hints: string[];
  /** optional full body for exercise.ts (overrides the generated function stub) */
  stub?: string;
  tests: TestConfig;
}
