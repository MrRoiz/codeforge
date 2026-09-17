import { newBestAtom, progressAtom, sessionAttemptsAtom } from '@app/store';
import {
  recordAttempt as persistAttempt,
  resetAll as persistResetAll,
  resetStat as persistResetStat,
  recordSolve as persistSolve,
  type SolveOutcome,
  solveStanding,
} from '@utils/state';
import { useAtomValue, useSetAtom } from 'jotai';

/**
 * The single place that mutates progress. Every method persists the change to
 * `state.json` and mirrors the returned state into `progressAtom`, so the file
 * and the in-memory view can never drift. `sessionAttemptsAtom` counts the
 * timed runs of the currently open exercise, since it was last entered.
 */
export function useProgress() {
  const state = useAtomValue(progressAtom);
  const setProgress = useSetAtom(progressAtom);
  const setSessionAttempts = useSetAtom(sessionAttemptsAtom);
  const setNewBest = useSetAtom(newBestAtom);

  return {
    /** Record a timed attempt: bump the persisted total and this try's count. */
    recordAttempt(exerciseId: string) {
      setProgress(persistAttempt(exerciseId));
      setSessionAttempts((n) => n + 1);
    },

    /** Record a passing run, flagging any new personal bests it sets. */
    recordSolve(exerciseId: string, outcome: SolveOutcome = {}) {
      // `state` is from the current render; a prior `recordAttempt` only touches
      // the counters, never the best-time/best-complexity snapshots compared here.
      setNewBest(solveStanding(state.exercises[exerciseId], outcome));
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
      setNewBest({ time: false, complexity: false });
    },
  };
}
