import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { type Confidence, complexityRank } from '@utils/complexity';
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
  /** free-form note the user wrote for this exercise */
  note?: string;
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

/** Longest note we persist; longer text is cut when saved. */
export const MAX_NOTE_LENGTH = 120;

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

  const standing = solveStanding(stat, outcome);
  if (standing.time) {
    next.bestTimeAttempt = attempt;
  }
  if (standing.complexity) {
    next.bestComplexityAttempt = attempt;
  }

  return next;
}

/** Set (or clear, when blank) an exercise's note (pure). */
export function applyNote(stat: ExerciseStat, note: string): ExerciseStat {
  const trimmed = note.trim();
  if (trimmed) {
    return { ...stat, note: trimmed.slice(0, MAX_NOTE_LENGTH) };
  }
  const { note: _note, ...rest } = stat;
  return rest;
}

/** Whether a stat carries nothing worth persisting. */
export function isEmptyStat(stat: ExerciseStat): boolean {
  return !stat.note && stat.attempts === 0 && stat.solves === 0;
}

/** Whether a passing run sets new bests against an exercise's recorded stats. */
export interface SolveStanding {
  /** the run is faster than the recorded best time */
  time: boolean;
  /** the run's growth class is lower than the recorded best */
  complexity: boolean;
}

/** Classify a solve against the current stat, without mutating anything (pure). */
export function solveStanding(
  stat: ExerciseStat | undefined,
  outcome: SolveOutcome,
): SolveStanding {
  const bestTime = stat?.bestTimeAttempt?.timeMs;
  const time = outcome.elapsedMs != null && (bestTime == null || outcome.elapsedMs < bestTime);

  const rank = outcome.complexity ? complexityRank(outcome.complexity.label) : null;
  const bestRank = stat?.bestComplexityAttempt?.complexity
    ? complexityRank(stat.bestComplexityAttempt.complexity.label)
    : null;
  const complexity = rank != null && (bestRank == null || rank < bestRank);

  return { time, complexity };
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

/** Folder holding one timestamped copy of the state per reset. */
export function backupsDir(): string {
  return path.join(codeforgeHome(), 'backups');
}

/** The backups folder as shown in the UI, shortened to `~` under the home dir. */
export function backupsDirLabel(): string {
  const dir = backupsDir();
  const home = os.homedir();
  return dir.startsWith(`${home}${path.sep}`) ? `~${dir.slice(home.length)}` : dir;
}

/** Filesystem-safe timestamp for a backup folder name (ISO, no `:`/`.`). */
export function backupTimestamp(at = new Date()): string {
  return at.toISOString().replace(/[:.]/g, '-');
}

/** Copy the current state aside before a reset, so it can be recovered. */
function backupState(state: State, at = new Date()): void {
  if (Object.keys(state.exercises).length === 0) {
    return;
  }
  const dir = path.join(backupsDir(), backupTimestamp(at));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'state.json'), `${JSON.stringify(state, null, 2)}\n`);
}

/**
 * The single read-modify-write path: load, apply a pure change, persist it.
 * Every writer goes through here so a write can never leave a partial file.
 * Pass `backup` to copy the previous state aside before overwriting it.
 */
export function updateState(
  apply: (state: State) => State,
  options: { backup?: boolean } = {},
): State {
  const prev = loadState();
  const next = apply(prev);
  if (options.backup) {
    backupState(prev);
  }
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

/** Set or clear an exercise's note, dropping the entry when nothing is left. */
export function recordNote(exerciseId: string, note: string): State {
  return updateState((state) => {
    const next = withStat(state, exerciseId, (stat) => applyNote(stat, note));
    if (isEmptyStat(next.exercises[exerciseId])) {
      const exercises = { ...next.exercises };
      delete exercises[exerciseId];
      return { version: STATE_VERSION, exercises };
    }
    return next;
  });
}

/** Remove one exercise's recorded data (attempts, solves, snapshots and note). */
export function resetExercise(exerciseId: string): State {
  return updateState(
    (state) => {
      const exercises = { ...state.exercises };
      delete exercises[exerciseId];
      return { version: STATE_VERSION, exercises };
    },
    { backup: true },
  );
}

/** Remove every exercise's recorded data. */
export function resetAll(): State {
  return updateState(() => emptyState(), { backup: true });
}
