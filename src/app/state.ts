import { exercises } from '@exercises';
import type { Exercise } from '@exercises/types';
import type { ComplexityResult } from '@utils/complexity';
import { type Config, defaultExercisesDir, loadConfig, resolveExercisesDir } from '@utils/config';
import type { GeneratedPaths } from '@utils/generate';
import type { TestRunResult } from '@utils/runTests';
import { loadState, type State } from '@utils/state';
import { atom } from 'jotai';

/** Every top-level view the app can be on. */
export type Screen =
  | 'menu'
  | 'difficulty'
  | 'list'
  | 'exercise'
  | 'running'
  | 'results'
  | 'settings';

export type DifficultyChoice = Exercise['difficulty'] | 'all';
export type ConfirmKind = 'solution' | 'stats';
export type Decision = 'reset' | 'cancel';

// --- app shell ----------------------------------------------------------------

export const screenAtom = atom<Screen>('menu');
export const errorAtom = atom<string | null>(null);
/** A one-line note shown on the main menu (e.g. after saving settings). */
export const statusAtom = atom<string | undefined>(undefined);
/** True while a screen is capturing text (settings, search) — gates global keys. */
export const searchActiveAtom = atom(false);

// --- config -------------------------------------------------------------------

export const configAtom = atom<Config>(loadConfig());
export const exercisesDirAtom = atom((get) => resolveExercisesDir(get(configAtom)));
export const defaultDirAtom = atom(() => defaultExercisesDir());

// --- exercise catalog ---------------------------------------------------------

export const difficultyAtom = atom<DifficultyChoice>('all');

export const difficultyCountsAtom = atom<Record<DifficultyChoice, number>>(() => ({
  all: exercises.length,
  easy: exercises.filter((e) => e.difficulty === 'easy').length,
  medium: exercises.filter((e) => e.difficulty === 'medium').length,
  hard: exercises.filter((e) => e.difficulty === 'hard').length,
}));

export const filteredExercisesAtom = atom((get) => {
  const difficulty = get(difficultyAtom);
  return difficulty === 'all' ? exercises : exercises.filter((e) => e.difficulty === difficulty);
});

// --- open exercise session ----------------------------------------------------
// These live here because the session spans several screens: they must survive
// the exercise → running → results → exercise flow without being unmounted.

export const exerciseAtom = atom<Exercise | null>(null);
export const pathsAtom = atom<GeneratedPaths | null>(null);
export const startedAtom = atom(false);
export const startedAtAtom = atom<number | null>(null);
export const elapsedMsAtom = atom<number | null>(null);
export const hasContentAtom = atom(false);
export const resultAtom = atom<TestRunResult | null>(null);
export const complexityAtom = atom<ComplexityResult | null>(null);
export const confirmAtom = atom<ConfirmKind | null>(null);

// --- progress -----------------------------------------------------------------

export const progressAtom = atom<State>(loadState());
