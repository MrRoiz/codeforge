import { progressAtom, sessionAttemptsAtom } from '@app/store';
import {
  recordAttempt as persistAttempt,
  resetAll as persistResetAll,
  resetStat as persistResetStat,
  recordSolve as persistSolve,
  type SolveOutcome,
} from '@utils/state';
import { useSetAtom } from 'jotai';

/**
 * The single place that mutates progress. Every method persists the change to
 * `state.json` and mirrors the returned state into `progressAtom`, so the file
 * and the in-memory view can never drift. `sessionAttemptsAtom` counts the
 * timed runs of the currently open exercise, since it was last entered.
 */
export function useProgress() {
  const setProgress = useSetAtom(progressAtom);
  const setSessionAttempts = useSetAtom(sessionAttemptsAtom);

  return {
    /** Record a timed attempt: bump the persisted total and this try's count. */
    recordAttempt(exerciseId: string) {
      setProgress(persistAttempt(exerciseId));
      setSessionAttempts((n) => n + 1);
    },

    /** Record a passing run with its time and complexity. */
    recordSolve(exerciseId: string, outcome: SolveOutcome = {}) {
      setProgress(persistSolve(exerciseId, outcome));
    },

    /** Clear one exercise's stats and restart this try's count. */
    resetStat(exerciseId: string) {
      setProgress(persistResetStat(exerciseId));
      setSessionAttempts(0);
    },

    /** Clear every exercise's stats and restart this try's count. */
    resetAll() {
      setProgress(persistResetAll());
      setSessionAttempts(0);
    },

    /** Restart the current try's count when a new exercise is entered. */
    resetSession() {
      setSessionAttempts(0);
    },
  };
}
