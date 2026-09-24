import { appStateAtom, newBestAtom, sessionAttemptsAtom } from '@app/store';
import {
  recordAttempt as persistAttempt,
  recordNote as persistNote,
  resetAll as persistResetAll,
  resetExercise as persistResetExercise,
  recordSolve as persistSolve,
  type SolveOutcome,
  solveStanding,
} from '@utils/state';
import { useAtom, useSetAtom } from 'jotai';

/**
 * The single place that mutates the app's persisted state (every exercise's
 * stats and note). Every method writes to `state.json` and mirrors the returned
 * state into `appStateAtom`, so the file and the in-memory view can never drift.
 * `sessionAttemptsAtom` counts the timed runs of the currently open exercise,
 * since it was last entered.
 */
export function useAppPersistedState() {
  const [state, setState] = useAtom(appStateAtom);
  const setSessionAttempts = useSetAtom(sessionAttemptsAtom);
  const setNewBest = useSetAtom(newBestAtom);

  return {
    /** Record a timed attempt: bump the persisted total and this try's count. */
    recordAttempt(exerciseId: string) {
      setState(persistAttempt(exerciseId));
      setSessionAttempts((n) => n + 1);
    },

    /** Record a passing run, flagging any new personal bests it sets. */
    recordSolve(exerciseId: string, outcome: SolveOutcome = {}) {
      // `state` is from the current render; a prior `recordAttempt` only touches
      // the counters, never the best-time/best-complexity snapshots compared here.
      setNewBest(solveStanding(state.exercises[exerciseId], outcome));
      setState(persistSolve(exerciseId, outcome));
    },

    /** Save (or clear, when blank) an exercise's note. */
    saveNote(exerciseId: string, note: string) {
      setState(persistNote(exerciseId, note));
    },

    /** Clear one exercise's recorded data and restart this try's count. */
    resetExercise(exerciseId: string) {
      setState(persistResetExercise(exerciseId));
      setSessionAttempts(0);
    },

    /** Clear every exercise's stats and restart this try's count. */
    resetAll() {
      setState(persistResetAll());
      setSessionAttempts(0);
    },

    /** Restart the current try's count when a new exercise is entered. */
    resetSession() {
      setSessionAttempts(0);
      setNewBest({ time: false, complexity: false });
    },
  };
}
