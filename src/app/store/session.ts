import type { Exercise } from '@exercises/types';
import type { ComplexityResult } from '@utils/complexity';
import type { GeneratedPaths } from '@utils/generate';
import type { TestRunResult } from '@utils/runTests';
import { atom } from 'jotai';

/** Which destructive action the user is being asked to confirm. */
export type ConfirmKind = 'solution' | 'exercise';

/** The answer to a confirmation prompt. */
export type Decision = 'reset' | 'cancel';

/** The stage a test run is in, surfaced on the running screen. */
export type RunPhase = 'preparing' | 'testing' | 'analyzing';

// The open-exercise session spans several screens, so its state lives here to
// survive the exercise → running → results → exercise flow without unmounting.

export const exerciseAtom = atom<Exercise | null>(null);
export const runPhaseAtom = atom<RunPhase | null>(null);

/** Timed runs made on the currently open exercise since it was entered. */
export const sessionAttemptsAtom = atom<number>(0);

/** Which metrics of the last passing run are new personal bests. */
export interface NewBest {
  time: boolean;
  complexity: boolean;
}

export const newBestAtom = atom<NewBest>({ time: false, complexity: false });
export const pathsAtom = atom<GeneratedPaths | null>(null);
export const startedAtom = atom(false);
export const startedAtAtom = atom<number | null>(null);
export const elapsedMsAtom = atom<number | null>(null);
export const hasContentAtom = atom(false);
export const resultAtom = atom<TestRunResult | null>(null);
export const complexityAtom = atom<ComplexityResult | null>(null);
export const confirmAtom = atom<ConfirmKind | null>(null);
