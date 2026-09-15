import fs from 'node:fs';
import path from 'node:path';
import { codeforgeHome } from '@utils/config';

/** Progress for a single exercise, keyed by exercise id. */
export interface ExerciseStat {
  /** test runs, passing or not */
  attempts: number;
  /** times solved — a passing run while the clock was running */
  solves: number;
  /** fastest passing run, in milliseconds */
  bestMs?: number;
  /** most recent passing run, in milliseconds */
  lastMs?: number;
  /** ISO timestamp of the last test run */
  lastAttemptAt?: string;
  /** ISO timestamp of the last solve */
  lastSolvedAt?: string;
}

export interface State {
  version: 1;
  exercises: Record<string, ExerciseStat>;
}

const STATE_VERSION = 1;
const EMPTY_STAT: ExerciseStat = { attempts: 0, solves: 0 };

/** Progress lives in the app home, independent of the exercises directory. */
export function statePath(): string {
  return path.join(codeforgeHome(), 'state.json');
}

export function emptyState(): State {
  return { version: STATE_VERSION, exercises: {} };
}

/** Read the state, tolerating a missing or corrupt file. */
export function loadState(): State {
  let raw: string;
  try {
    raw = fs.readFileSync(statePath(), 'utf-8');
  } catch {
    return emptyState();
  }
  try {
    const parsed = JSON.parse(raw) as Partial<State> | null;
    if (!parsed || typeof parsed !== 'object' || typeof parsed.exercises !== 'object') {
      return emptyState();
    }
    return { version: STATE_VERSION, exercises: parsed.exercises ?? {} };
  } catch {
    return emptyState();
  }
}

// --- pure steps, one per state operation -------------------------------------

/** Count an attempt (pure). */
export function applyAttempt(stat: ExerciseStat): ExerciseStat {
  return { ...stat, attempts: stat.attempts + 1, lastAttemptAt: new Date().toISOString() };
}

/** Count a solve, updating the best/last time when one is given (pure). */
export function applySolve(stat: ExerciseStat, elapsedMs?: number | null): ExerciseStat {
  const next: ExerciseStat = {
    ...stat,
    solves: stat.solves + 1,
    lastSolvedAt: new Date().toISOString(),
  };
  if (elapsedMs != null) {
    next.lastMs = elapsedMs;
    next.bestMs = stat.bestMs == null ? elapsedMs : Math.min(stat.bestMs, elapsedMs);
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
  return updateState((state) => withStat(state, exerciseId, applyAttempt));
}

/** Record one solve for an exercise, with an optional solve time. */
export function recordSolve(exerciseId: string, elapsedMs?: number | null): State {
  return updateState((state) => withStat(state, exerciseId, (stat) => applySolve(stat, elapsedMs)));
}
