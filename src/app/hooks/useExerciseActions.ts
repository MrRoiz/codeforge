import { useAppPersistedState } from '@app/hooks/useAppPersistedState';
import {
  complexityAtom,
  confirmAtom,
  type Decision,
  elapsedMsAtom,
  errorAtom,
  exerciseAtom,
  exercisesDirAtom,
  hasContentAtom,
  newBestAtom,
  pathsAtom,
  resultAtom,
  runPhaseAtom,
  screenAtom,
  startedAtAtom,
  startedAtom,
} from '@app/store';
import type { Exercise } from '@exercises/types';
import { analyzeSolutionComplexity } from '@utils/complexity';
import {
  ensureGenerated,
  exerciseDir,
  exercisePaths,
  isDirty,
  isStarted,
  resetSolution,
} from '@utils/generate';
import {
  drainStdin,
  isTerminalEditor,
  launchDetached,
  launchInForeground,
  resolveEditor,
} from '@utils/open';
import { runJest } from '@utils/runTests';
import { enterFullScreen, exitFullScreen } from '@utils/screen';
import { useApp } from 'ink';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useRef } from 'react';

/**
 * The imperative side of an exercise session: creating files, starting and
 * resetting, launching the editor, running the tests and moving between
 * screens. All state it touches lives in `@app/store` atoms, so screens can
 * read it without prop drilling while these actions stay in one place.
 *
 * Atoms the actions both read and write use `useAtom`; write-only atoms use
 * `useSetAtom`, so the hook subscribes to exactly what it consumes.
 */
export function useExerciseActions() {
  const { suspendTerminal } = useApp();
  const persistedState = useAppPersistedState();
  const exercisesDir = useAtomValue(exercisesDirAtom);
  const [exercise, setExercise] = useAtom(exerciseAtom);
  const [startedAt, setStartedAt] = useAtom(startedAtAtom);

  const setPaths = useSetAtom(pathsAtom);
  const setStarted = useSetAtom(startedAtom);
  const setElapsedMs = useSetAtom(elapsedMsAtom);
  const setHasContent = useSetAtom(hasContentAtom);
  const setResult = useSetAtom(resultAtom);
  const setComplexity = useSetAtom(complexityAtom);
  const setConfirm = useSetAtom(confirmAtom);
  const setScreen = useSetAtom(screenAtom);
  const setError = useSetAtom(errorAtom);
  const setRunPhase = useSetAtom(runPhaseAtom);
  const setNewBest = useSetAtom(newBestAtom);

  // Opening an exercise only shows the problem — nothing is written to disk.
  const openExercise = async (ex: Exercise) => {
    setError(null);
    setExercise(ex);
    persistedState.resetSession();
    setPaths(exercisePaths(ex, exercisesDir));
    setResult(null);
    setElapsedMs(null);
    setComplexity(null);
    const alreadyStarted = await isStarted(ex, exercisesDir);
    setStarted(alreadyStarted);
    setHasContent(await isDirty(ex, exercisesDir));
    // Opening a page never starts the clock — it only resumes the clock when
    // returning to the same exercise this session. Existing files just mean the
    // exercise is "started"; the user begins timing with `s`.
    setStartedAt(exercise?.id === ex.id ? startedAt : null);
    setScreen('exercise');
  };

  // Starting creates the solution + test files. `reset` wipes a previous
  // solution back to the stub (only ever after the user confirms).
  const startExercise = async (ex: Exercise, reset = false) => {
    setConfirm(null);
    try {
      const generated = await ensureGenerated(ex, exercisesDir);
      persistedState.resetSession();
      if (reset) {
        await resetSolution(ex, exercisesDir);
        setStartedAt(Date.now());
        setElapsedMs(null);
      } else {
        setStartedAt(startedAt ?? Date.now());
        setElapsedMs(null);
      }
      setHasContent(await isDirty(ex, exercisesDir));
      setPaths(generated);
      setStarted(true);
      setError(null);
    } catch (err) {
      setError(String(err));
    }
  };

  // `s`: start the exercise. If a previous solution is already on disk, ask
  // before wiping it. The other entry points (`o`, `t`) never reset.
  const requestStart = async (ex: Exercise) => {
    try {
      if ((await isStarted(ex, exercisesDir)) && (await isDirty(ex, exercisesDir))) {
        setConfirm('solution');
        return;
      }
    } catch {
      // fall through to a plain start
    }
    await startExercise(ex, false);
  };

  // Starting the clock on an existing solution isn't allowed — to time an
  // exercise you must reset it first, so the only options are reset or cancel.
  const answerReset = (decision: Decision) => {
    setConfirm(null);
    if (decision === 'cancel' || !exercise) {
      return;
    }
    void startExercise(exercise, true);
  };

  // `x`: clear this exercise's recorded data (kept behind a confirm).
  const requestResetExercise = () => setConfirm('exercise');

  const answerResetExercise = (decision: Decision) => {
    setConfirm(null);
    if (decision === 'cancel' || !exercise) {
      return;
    }
    persistedState.resetExercise(exercise.id);
  };

  // `n`: persist the note the user typed for the open exercise.
  const saveNote = (note: string) => {
    if (exercise) {
      persistedState.saveNote(exercise.id, note);
    }
  };

  const restartTimer = () => {
    persistedState.resetSession();
    setStartedAt(Date.now());
    setElapsedMs(null);
  };

  // Opening in the editor makes sure the files exist (never overwriting a
  // solution), then launches the exercise file in the user's editor. Terminal
  // editors take over the TTY while the TUI is suspended; GUI editors detach.
  const openingEditor = useRef(false);
  const openEditor = async (ex: Exercise) => {
    if (openingEditor.current) {
      return;
    }
    openingEditor.current = true;
    try {
      const generated = await ensureGenerated(ex, exercisesDir);
      setPaths(generated);
      setStarted(true);
      // `o` begins the clock only when the file isn't dirty — a fresh exercise
      // or an untouched stub. Opening existing work just launches the editor and
      // leaves the timer alone.
      const dirty = await isDirty(ex, exercisesDir);
      setHasContent(dirty);
      if (!dirty) {
        setStartedAt(startedAt ?? Date.now());
      }
      setError(null);
      const editor = resolveEditor();
      if (editor && isTerminalEditor(editor.command)) {
        // Terminal editors need the real TTY. Suspend Ink (pause input/render),
        // drop out of codeforge's alternate screen, hand the terminal over, then
        // reclaim both once the editor exits.
        const suspension = await suspendTerminal();
        exitFullScreen();
        try {
          await launchInForeground(editor, generated.exerciseFile);
        } finally {
          // Keystrokes buffered while the editor had the terminal (e.g. a
          // repeated `o`) would otherwise be replayed on resume and reopen it.
          drainStdin();
          enterFullScreen();
          await suspension.resume();
        }
      } else {
        launchDetached(editor, generated.exerciseFile);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      openingEditor.current = false;
      // a terminal editor has just written the file — refresh the notice
      setHasContent(await isDirty(ex, exercisesDir));
    }
  };

  const run = async (ex: Exercise) => {
    setScreen('running');
    setRunPhase('preparing');
    setNewBest({ time: false, complexity: false });
    try {
      try {
        await ensureGenerated(ex, exercisesDir); // create on first run, never overwrite
        setStarted(true);
        setError(null);
      } catch (err) {
        setError(String(err));
      }
      setRunPhase('testing');
      const r = await runJest(exerciseDir(ex.id, exercisesDir));
      setRunPhase('analyzing');
      setResult(r);
      // the file has been edited by now — refresh so the "content exists" notice
      // reflects reality
      setHasContent(await isDirty(ex, exercisesDir));
      const cx = await analyzeSolutionComplexity(ex, exercisesDir);
      setComplexity(cx);
      // running tests never starts or resets the clock; only 's' and 'r' do.
      // The state is the source of truth: progress is recorded only while the
      // clock is running, and a solve is counted whenever a timed run passes.
      const timed = startedAt !== null;
      const ms = r.passed && timed ? Date.now() - startedAt : null;
      if (timed) {
        persistedState.recordAttempt(ex.id);
        if (r.passed) {
          persistedState.recordSolve(ex.id, {
            elapsedMs: ms,
            complexity: cx ? { label: cx.label, confidence: cx.confidence } : undefined,
          });
        }
      }
      // solving stops the clock — the final time is frozen in `elapsedMs`
      if (r.passed) {
        setStartedAt(null);
      }
      setElapsedMs(ms);
      setScreen('results');
    } finally {
      setRunPhase(null);
    }
  };

  return {
    openExercise,
    requestStart,
    answerReset,
    requestResetExercise,
    answerResetExercise,
    saveNote,
    restartTimer,
    openEditor,
    run,
  };
}
