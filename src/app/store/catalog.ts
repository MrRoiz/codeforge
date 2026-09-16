import { exercises } from '@exercises';
import type { Exercise } from '@exercises/types';
import { atom } from 'jotai';

export type DifficultyChoice = Exercise['difficulty'] | 'all';

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
