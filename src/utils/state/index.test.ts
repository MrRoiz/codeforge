import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, test } from 'node:test';
import {
  applyNote,
  backupsDir,
  backupsDirLabel,
  type ExerciseStat,
  emptyState,
  isEmptyStat,
  MAX_NOTE_LENGTH,
  recordSolve,
  resetAll,
  resetExercise,
  statePath,
  withStat,
} from './index.js';

const BASE: ExerciseStat = { attempts: 3, solves: 2 };

let home: string;
let prevHome: string | undefined;
let prevUserProfile: string | undefined;

beforeEach(() => {
  prevHome = process.env.HOME;
  prevUserProfile = process.env.USERPROFILE;
  home = fs.mkdtempSync(path.join(os.tmpdir(), 'codeforge-state-'));
  process.env.HOME = home;
  process.env.USERPROFILE = home;
});

afterEach(() => {
  process.env.HOME = prevHome;
  process.env.USERPROFILE = prevUserProfile;
  fs.rmSync(home, { recursive: true, force: true });
});

function latestBackup(): { version: number; exercises: Record<string, ExerciseStat> } {
  const dirs = fs.readdirSync(backupsDir());
  const file = path.join(backupsDir(), dirs.at(-1) ?? '', 'state.json');
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

test('applyNote stores a trimmed note', () => {
  assert.deepEqual(applyNote(BASE, '  use a heap  '), { ...BASE, note: 'use a heap' });
});

test('applyNote replaces an existing note', () => {
  assert.deepEqual(applyNote({ ...BASE, note: 'old' }, 'new'), { ...BASE, note: 'new' });
});

test('applyNote clears the note on blank input', () => {
  assert.deepEqual(applyNote({ ...BASE, note: 'old' }, '   '), BASE);
});

test('applyNote cuts a note to the max length', () => {
  const long = 'x'.repeat(MAX_NOTE_LENGTH + 50);
  assert.equal(applyNote(BASE, long).note, long.slice(0, MAX_NOTE_LENGTH));
});

test('applyNote does not mutate its input', () => {
  const stat: ExerciseStat = { ...BASE, note: 'old' };
  applyNote(stat, 'new');
  assert.equal(stat.note, 'old');
});

test('isEmptyStat is true only with no note and no activity', () => {
  assert.equal(isEmptyStat({ attempts: 0, solves: 0 }), true);
  assert.equal(isEmptyStat({ attempts: 1, solves: 0 }), false);
  assert.equal(isEmptyStat({ attempts: 0, solves: 1 }), false);
  assert.equal(isEmptyStat({ attempts: 0, solves: 0, note: 'x' }), false);
});

test('setting then clearing a note leaves a droppable stat', () => {
  const saved = withStat(emptyState(), 'two-sum', (stat) => applyNote(stat, 'hello'));
  assert.equal(saved.exercises['two-sum'].note, 'hello');

  const cleared = withStat(saved, 'two-sum', (stat) => applyNote(stat, ''));
  assert.equal(isEmptyStat(cleared.exercises['two-sum']), true);
});

test('resetAll backs up the previous state before wiping it', () => {
  recordSolve('two-sum', { elapsedMs: 100 });
  resetAll();

  const dirs = fs.readdirSync(backupsDir());
  assert.equal(dirs.length, 1);
  assert.equal(latestBackup().exercises['two-sum'].solves, 1);
  assert.deepEqual(JSON.parse(fs.readFileSync(statePath(), 'utf-8')), emptyState());
});

test('resetExercise backs up the previous state before wiping it', () => {
  recordSolve('two-sum', { elapsedMs: 100 });
  resetExercise('two-sum');

  assert.equal(latestBackup().exercises['two-sum'].solves, 1);
  assert.deepEqual(JSON.parse(fs.readFileSync(statePath(), 'utf-8')), emptyState());
});

test('resetting an already-empty state writes no backup', () => {
  resetAll();
  assert.equal(fs.existsSync(backupsDir()), false);
});

test('backupsDirLabel shortens the home prefix to ~', () => {
  assert.equal(backupsDirLabel(), path.join('~', '.codeforge', 'backups'));
});
