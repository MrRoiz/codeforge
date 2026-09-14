export interface ExerciseTest {
  input: unknown[];
  expected: unknown;
  sorted?: boolean;
}

//   ai-checked → tests reviewed by AI only (default when omitted)
//   reported   → seen in public candidate reports / aggregators
//   verified   → confirmed by a human who saw it in a real interview
export type ValidationLevel = 'ai-checked' | 'reported' | 'verified';

export interface Validation {
  level: ValidationLevel;
  /** where it was reported/verified, e.g. 'GoDaddy', 'EPAM' */
  source?: string;
}

export interface Exercise {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: string;
  time: string;
  /** provenance entries — omit to default to 'ai-checked' */
  validation?: Validation[];
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  functionSignature: string;
  hints: string[];
  /** solution mutates its first argument in place (and may return nothing) */
  mutatesInput?: boolean;
  /** solution mutates its first argument and returns a length; compare the first `result` chars to expected */
  mutatesInputPrefix?: boolean;
  /** optional full body for exercise.ts (overrides the generated function stub) */
  stub?: string;
  /** optional full test file content (overrides generated tests) */
  testFileBody?: string;
  tests: ExerciseTest[];
}

/**
 * Human-readable provenance label. Every exercise's test cases are AI-checked,
 * so that token is always present; entries are joined in order.
 */
export function validationLabel(exercise: Pick<Exercise, 'validation'>): string {
  const tokens: string[] = [];
  for (const v of exercise.validation ?? []) {
    if (v.level === 'verified' && v.source) tokens.push(`${v.source} (human-verified)`);
    else if (v.level === 'reported' && v.source) tokens.push(`${v.source} (reported)`);
    else if (v.level === 'ai-checked') tokens.push('AI checked');
  }
  if (!tokens.includes('AI checked')) tokens.push('AI checked');
  return [...new Set(tokens)].join(' · ');
}