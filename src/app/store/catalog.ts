import { exercises, getExercisesByDifficulty } from '@exercises';
import { DIFFICULTIES, type Difficulty } from '@exercises/types';
import { atom } from 'jotai';

export type DifficultyChoice = Difficulty | 'all';

export const difficultyAtom = atom<DifficultyChoice>('all');

export const difficultyCountsAtom = atom<Record<DifficultyChoice, number>>(() => {
  const counts = { all: exercises.length } as Record<DifficultyChoice, number>;
  for (const difficulty of DIFFICULTIES) {
    counts[difficulty] = getExercisesByDifficulty(difficulty).length;
  }
  return counts;
});

export const filteredExercisesAtom = atom((get) => {
  const difficulty = get(difficultyAtom);
  return difficulty === 'all' ? exercises : getExercisesByDifficulty(difficulty);
});
