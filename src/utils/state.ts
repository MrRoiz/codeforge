import fs from 'node:fs';
import path from 'node:path';
import type { Confidence } from '@utils/complexity';
import { codeforgeHome } from '@utils/config';

/** Estimated time complexity of a solution, as a small persisted snapshot. */
export interface ComplexityInfo {
  /** growth class, e.g. "O(n)" */
  label: string;
  confidence: Confidence;
}

/** A snapshot of one solve — the data worth keeping around. */
export interface SolveAttempt {
  /** ISO timestamp of the run */
  at: string;
  /** elapsed time, when the clock was running */
  timeMs?: number;
  /** estimated complexity of the solution at that point */
  complexity?: ComplexityInfo;
}

/** Progress for a single exercise, keyed by exercise id. */
export interface ExerciseStat {
  /** test runs, passing or not */
  attempts: number;
  /** passing runs */
  solves: number;
  /** ISO timestamp of the last run (whether it passed or not) */
  lastAttempt?: string;
  /** the most recent passing run */
  lastSolve?: SolveAttempt;
  /** the fastest passing run */
  bestTimeAttempt?: SolveAttempt;
  /** the passing run with the lowest growth class */
  bestComplexityAttempt?: SolveAttempt;
}

export interface State {
  version: 2;
  exercises: Record<string, ExerciseStat>;
}

/** What a single test run contributes to the state. */
export interface SolveOutcome {
  /** elapsed ms, when the clock was running */
  elapsedMs?: number | null;
  /** estimated complexity of the current solution */
  complexity?: ComplexityInfo | null;
}

const STATE_VERSION = 2;
const EMPTY_STAT: ExerciseStat = { attempts: 0, solves: 0 };

// lower is better; labels the analyzer can emit (unknown labels rank as null)
const COMPLEXITY_RANK: Record<string, number> = {
  'O(1)': 0,
  'O(log n)': 1,
  'O(n)': 2,
  'O(n log n)': 3,
  'O(n²)': 4,
  'O(n³)': 5,
  'O(n⁴)': 6,
  'O(n⁵)': 7,
  'O(n⁶)': 8,
};

/** Rank a complexity label, or null when it can't be ordered. */
export function complexityRank(label: string): number | null {
  const rank = COMPLEXITY_RANK[label];
  return rank === undefined ? null : rank;
}

/** Progress lives in the app home, independent of the exercises directory. */
export function statePath(): string {
  return path.join(codeforgeHome(), 'state.json');
}

export function emptyState(): State {
  return { version: STATE_VERSION, exercises: {} };
}

/** Read the state, tolerating a missing or corrupt file. Older versions are discarded. */
export function loadState(): State {
  let raw: string;
  try {
    raw = fs.readFileSync(statePath(), 'utf-8');
  } catch {
    return emptyState();
  }
  try {
    const parsed = JSON.parse(raw) as Partial<State> | null;
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      parsed.version !== STATE_VERSION ||
      typeof parsed.exercises !== 'object'
    ) {
      return emptyState();
    }
    return { version: STATE_VERSION, exercises: parsed.exercises ?? {} };
  } catch {
    return emptyState();
  }
}

// --- pure steps, one per state operation -------------------------------------

/** Count an attempt and stamp its time (pure). */
export function applyAttempt(stat: ExerciseStat, at = new Date().toISOString()): ExerciseStat {
  return { ...stat, attempts: stat.attempts + 1, lastAttempt: at };
}

/** Count a solve and fold it into the last/best snapshots (pure). */
export function applySolve(
  stat: ExerciseStat,
  outcome: SolveOutcome,
  at = new Date().toISOString(),
): ExerciseStat {
  const attempt: SolveAttempt = { at };
  if (outcome.elapsedMs != null) {
    attempt.timeMs = outcome.elapsedMs;
  }
  if (outcome.complexity) {
    attempt.complexity = outcome.complexity;
  }

  const next: ExerciseStat = { ...stat, solves: stat.solves + 1, lastSolve: attempt };

  if (attempt.timeMs != null) {
    const best = stat.bestTimeAttempt?.timeMs;
    if (best == null || attempt.timeMs < best) {
      next.bestTimeAttempt = attempt;
    }
  }

  if (attempt.complexity) {
    const rank = complexityRank(attempt.complexity.label);
    const bestRank =
      stat.bestComplexityAttempt?.complexity == null
        ? null
        : complexityRank(stat.bestComplexityAttempt.complexity.label);
    if (rank != null && (bestRank == null || rank < bestRank)) {
      next.bestComplexityAttempt = attempt;
    }
  }

  return next;
}

/** Replace one exercise's stat via a pure step (pure). */
export function withStat(
  state: State,
  exerciseId: string,
  step: (stat: ExerciseStat) => ExerciseStat,
): State {
  const prev = state.exercises[exerciseId] ?? EMPTY_STAT;
  return {
    version: STATE_VERSION,
    exercises: { ...state.exercises, [exerciseId]: step(prev) },
  };
}

// --- writers ------------------------------------------------------------------

function saveState(state: State): void {
  const file = statePath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  // write-then-rename so an interrupted write can't leave a partial file
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, `${JSON.stringify(state, null, 2)}\n`);
  fs.renameSync(tmp, file);
}

/**
 * The single read-modify-write path: load, apply a pure change, persist it.
 * Every writer goes through here so a write can never leave a partial file.
 */
export function updateState(apply: (state: State) => State): State {
  const next = apply(loadState());
  saveState(next);
  return next;
}

/** Record one attempt for an exercise. */
export function recordAttempt(exerciseId: string): State {
  return updateState((state) => withStat(state, exerciseId, (stat) => applyAttempt(stat)));
}

/** Record one solve for an exercise, with its time and complexity. */
export function recordSolve(exerciseId: string, outcome: SolveOutcome = {}): State {
  return updateState((state) => withStat(state, exerciseId, (stat) => applySolve(stat, outcome)));
}

/** Remove one exercise's recorded progress (attempts, solves and snapshots). */
export function resetStat(exerciseId: string): State {
  return updateState((state) => {
    const exercises = { ...state.exercises };
    delete exercises[exerciseId];
    return { version: STATE_VERSION, exercises };
  });
}

/** Remove every exercise's recorded progress. */
export function resetAll(): State {
  return updateState(() => emptyState());
}
