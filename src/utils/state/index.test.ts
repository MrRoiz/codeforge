import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  applyNote,
  type ExerciseStat,
  emptyState,
  isEmptyStat,
  MAX_NOTE_LENGTH,
  withStat,
} from './index.js';

const BASE: ExerciseStat = { attempts: 3, solves: 2 };

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
