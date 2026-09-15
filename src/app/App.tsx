import fs from 'node:fs/promises';
import { Layout } from '@app/Layout';
import { type DifficultyChoice, DifficultyMenu } from '@app/screens/DifficultyMenu';
import { ExerciseList } from '@app/screens/ExerciseList';
import { ExerciseView } from '@app/screens/ExerciseView';
import { MainMenu, type MenuAction } from '@app/screens/MainMenu';
import { ResultsView } from '@app/screens/ResultsView';
import { RunningView } from '@app/screens/RunningView';
import { SettingsView } from '@app/screens/SettingsView';
import { exercises, getRandomExercise } from '@exercises';
import type { Exercise } from '@exercises/types';
import {
  type Config,
  defaultExercisesDir,
  loadConfig,
  resolveExercisesDir,
  saveConfig,
} from '@utils/config';
import {
  ensureGenerated,
  exerciseDir,
  exercisePaths,
  type GeneratedPaths,
  isDirty,
  isStarted,
  resetSolution,
} from '@utils/generate';
import {
  drainStdin,
  isTerminalEditor,
  launchDetached,
  launchInForeground,
  openRepo,
  resolveEditor,
} from '@utils/open';
import { runJest, type TestRunResult } from '@utils/runTests';
import { enterFullScreen, exitFullScreen } from '@utils/screen';
import { loadState, recordAttempt, recordSolve, type State } from '@utils/state';
import { Box, Text, useApp, useInput } from 'ink';
import { useMemo, useRef, useState } from 'react';

type Screen = 'menu' | 'difficulty' | 'list' | 'exercise' | 'running' | 'results' | 'settings';

export function App() {
  const { exit, suspendTerminal } = useApp();
  const [screen, setScreen] = useState<Screen>('menu');
  const [config, setConfig] = useState<Config>(() => loadConfig());
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [difficulty, setDifficulty] = useState<DifficultyChoice>('all');
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [paths, setPaths] = useState<GeneratedPaths | null>(null);
  const [started, setStarted] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const [result, setResult] = useState<TestRunResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchActive, setSearchActive] = useState(false);
  const [state, setState] = useState<State>(() => loadState());
  const [confirmReset, setConfirmReset] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  // global keys — disabled while typing in settings, searching the exercise
  // list, or answering the reset prompt so 'q' and 'p' are normal characters
  useInput(
    (input) => {
      if (input === 'q') {
        exit();
      }
      if (input === 'p') {
        openRepo();
      }
    },
    { isActive: screen !== 'settings' && !searchActive && !confirmReset },
  );

  const exercisesDir = useMemo(() => resolveExercisesDir(config), [config]);
  const defaultDir = useMemo(() => defaultExercisesDir(), []);

  const counts = useMemo(
    () => ({
      all: exercises.length,
      easy: exercises.filter((e) => e.difficulty === 'easy').length,
      medium: exercises.filter((e) => e.difficulty === 'medium').length,
      hard: exercises.filter((e) => e.difficulty === 'hard').length,
    }),
    [],
  );

  const filtered = useMemo(
    () => (difficulty === 'all' ? exercises : exercises.filter((e) => e.difficulty === difficulty)),
    [difficulty],
  );

  // Opening an exercise only shows the problem — nothing is written to disk.
  const openExercise = async (ex: Exercise) => {
    setError(null);
    setExercise(ex);
    setPaths(exercisePaths(ex, exercisesDir));
    setResult(null);
    setElapsedMs(null);
    const alreadyStarted = await isStarted(ex, exercisesDir);
    setStarted(alreadyStarted);
    setHasContent(await isDirty(ex, exercisesDir));
    // Opening a page never starts the clock — it only resumes the clock when
    // returning to the same exercise this session. Existing files just mean the
    // exercise is "started"; the user begins timing with `s`.
    setStartedAt((prev) => (exercise?.id === ex.id ? prev : null));
    setScreen('exercise');
  };

  // Starting creates the solution + test files. `reset` wipes a previous
  // solution back to the stub (only ever after the user confirms).
  const startExercise = async (ex: Exercise, reset = false) => {
    setConfirmReset(false);
    try {
      const generated = await ensureGenerated(ex, exercisesDir);
      if (reset) {
        await resetSolution(ex, exercisesDir);
        setStartedAt(Date.now());
        setElapsedMs(null);
      } else {
        setStartedAt((prev) => prev ?? Date.now());
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
        setConfirmReset(true);
        return;
      }
    } catch {
      // fall through to a plain start
    }
    await startExercise(ex, false);
  };

  // Starting the clock on an existing solution isn't allowed — to time an
  // exercise you must reset it first, so the only options are reset or cancel.
  const answerReset = (decision: 'reset' | 'cancel') => {
    setConfirmReset(false);
    if (decision === 'cancel' || !exercise) {
      return;
    }
    void startExercise(exercise, true);
  };

  const restartTimer = () => {
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
        setStartedAt((prev) => prev ?? Date.now());
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

  const startRun = async (ex: Exercise) => {
    setScreen('running');
    try {
      await ensureGenerated(ex, exercisesDir); // create on first run, never overwrite
      setStarted(true);
      setError(null);
    } catch (err) {
      setError(String(err));
    }
    const r = await runJest(exerciseDir(ex.id, exercisesDir));
    setResult(r);
    // the file has been edited by now — refresh so the "content exists" notice
    // reflects reality
    setHasContent(await isDirty(ex, exercisesDir));
    // running tests never starts or resets the clock; only 's' and 'r' do.
    // The state is the source of truth: progress is recorded only while the
    // clock is running, and a solve is counted whenever a timed run passes.
    const timed = startedAt !== null;
    const ms = r.passed && timed ? Date.now() - startedAt : null;
    if (timed) {
      let next = recordAttempt(ex.id);
      if (r.passed) {
        next = recordSolve(ex.id, ms);
      }
      setState(next);
    }
    // solving stops the clock — the final time is frozen in `elapsedMs`
    if (r.passed) {
      setStartedAt(null);
    }
    setElapsedMs(ms);
    setScreen('results');
  };

  const onMenu = (action: MenuAction) => {
    if (action === 'quit') {
      exit();
    }
    if (action === 'train') {
      setScreen('difficulty');
    }
    if (action === 'settings') {
      setStatus(undefined);
      setScreen('settings');
    }
    if (action === 'random') {
      void openExercise(getRandomExercise());
    }
  };

  const saveDir = async (dir: string) => {
    try {
      await fs.mkdir(dir, { recursive: true });
      const next: Config = { ...config, exercisesDir: dir };
      saveConfig(next);
      setConfig(next);
      setStatus(`Exercises will be created in ${dir}`);
      setError(null);
    } catch (err) {
      setError(`Could not use that directory: ${String(err)}`);
    }
    setScreen('menu');
  };

  return (
    <Layout>
      {error ? (
        <Box paddingX={2}>
          <Text color="redBright">Error: {error}</Text>
        </Box>
      ) : null}

      {screen === 'menu' ? (
        <MainMenu onSelect={onMenu} exercisesDir={exercisesDir} status={status} />
      ) : null}

      {screen === 'settings' ? (
        <SettingsView
          currentDir={exercisesDir}
          defaultDir={defaultDir}
          onSave={(dir) => void saveDir(dir)}
          onBack={() => setScreen('menu')}
        />
      ) : null}

      {screen === 'difficulty' ? (
        <DifficultyMenu
          counts={counts}
          onSelect={(choice) => {
            setDifficulty(choice);
            setScreen('list');
          }}
          onBack={() => setScreen('menu')}
        />
      ) : null}

      {screen === 'list' ? (
        <ExerciseList
          exercises={filtered}
          state={state}
          onSelect={(ex) => void openExercise(ex)}
          onBack={() => setScreen('difficulty')}
          onSearchActive={setSearchActive}
        />
      ) : null}

      {screen === 'exercise' && exercise && paths ? (
        <ExerciseView
          exercise={exercise}
          stat={state.exercises[exercise.id]}
          exerciseFile={paths.exerciseFile}
          testFile={paths.testFile}
          started={started}
          startedAt={startedAt}
          elapsedMs={elapsedMs}
          hasContent={hasContent}
          confirmingReset={confirmReset}
          onStart={() => void requestStart(exercise)}
          onResetDecision={answerReset}
          onRun={() => void startRun(exercise)}
          onOpenEditor={() => void openEditor(exercise)}
          onRestartTimer={restartTimer}
          onBack={() => setScreen('list')}
        />
      ) : null}

      {screen === 'running' && exercise ? <RunningView name={exercise.name} /> : null}

      {screen === 'results' && exercise && result ? (
        <ResultsView
          exercise={exercise}
          result={result}
          elapsedMs={elapsedMs}
          onRerun={() => void startRun(exercise)}
          onOpenEditor={() => void openEditor(exercise)}
          onBack={() => setScreen('exercise')}
        />
      ) : null}
    </Layout>
  );
}
