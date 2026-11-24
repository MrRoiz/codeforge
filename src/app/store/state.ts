import { exercises } from '@exercises';
import { DIFFICULTIES, type Difficulty } from '@exercises/types';
import { loadState, type State } from '@utils/state';
import { atom } from 'jotai';

export const appStateAtom = atom<State>(loadState());

export interface DifficultyProgress {
  solved: number;
  total: number;
}

export interface ProgressSummary {
  /** exercises with at least one passing solve */
  solved: number;
  /** the whole catalog */
  total: number;
  /** test runs across every exercise, passing or not */
  attempts: number;
  byDifficulty: Record<Difficulty, DifficultyProgress>;
}

/** A read-only roll-up of the progress state for the home screen. */
export const progressSummaryAtom = atom((get): ProgressSummary => {
  const state = get(appStateAtom);
  const byDifficulty = {} as Record<Difficulty, DifficultyProgress>;
  for (const difficulty of DIFFICULTIES) {
    byDifficulty[difficulty] = { solved: 0, total: 0 };
  }
  let solved = 0;
  let attempts = 0;

  for (const ex of exercises) {
    const stat = state.exercises[ex.id];
    byDifficulty[ex.difficulty].total += 1;
    attempts += stat?.attempts ?? 0;
    if (stat?.solves) {
      solved += 1;
      byDifficulty[ex.difficulty].solved += 1;
    }
  }

  return { solved, total: exercises.length, attempts, byDifficulty };
});
