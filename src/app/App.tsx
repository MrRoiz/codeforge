import { Box, Text, useApp, useInput } from 'ink';
import fs from 'node:fs/promises';
import { useMemo, useRef, useState } from 'react';
import { exercises, getRandomExercise } from '@exercises';
import type { Exercise } from '@exercises/types';
import { ensureGenerated, exercisePaths, gymDir, isStarted, type GeneratedPaths } from '@utils/generate';
import { runJest, type TestRunResult } from '@utils/runTests';
import { drainStdin, isTerminalEditor, launchDetached, launchInForeground, openRepo, resolveEditor } from '@utils/open';
import { enterFullScreen, exitFullScreen } from '@utils/screen';
import {
  defaultExercisesDir,
  loadConfig,
  resolveExercisesDir,
  saveConfig,
  type Config,
} from '@utils/config';
import { MainMenu, type MenuAction } from '@app/screens/MainMenu';
import { DifficultyMenu, type DifficultyChoice } from '@app/screens/DifficultyMenu';
import { ExerciseList } from '@app/screens/ExerciseList';
import { ExerciseView } from '@app/screens/ExerciseView';
import { RunningView } from '@app/screens/RunningView';
import { ResultsView } from '@app/screens/ResultsView';
import { SettingsView } from '@app/screens/SettingsView';
import { Layout } from '@app/Layout';

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

  // global keys — disabled while typing in settings or searching the exercise
  // list so 'q' and 'p' are normal characters
  useInput(
    (input) => {
      if (input === 'q') exit();
      if (input === 'p') openRepo();
    },
    { isActive: screen !== 'settings' && !searchActive },
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
    // keep the clock running if we're returning to the same exercise this session
    setStartedAt((prev) => (exercise?.id === ex.id && prev !== null ? prev : alreadyStarted ? Date.now() : null));
    setScreen('exercise');
  };

  // Starting creates the solution + test files (never overwriting a solution).
  const startExercise = async (ex: Exercise) => {
    try {
      const generated = await ensureGenerated(ex, exercisesDir);
      setPaths(generated);
      setStarted(true);
      setStartedAt((prev) => prev ?? Date.now());
      setError(null);
    } catch (err) {
      setError(String(err));
    }
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
    if (openingEditor.current) return;
    openingEditor.current = true;
    try {
      const generated = await ensureGenerated(ex, exercisesDir);
      setPaths(generated);
      setStarted(true);
      setStartedAt((prev) => prev ?? Date.now());
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
    const r = await runJest(gymDir(ex.id, exercisesDir));
    setResult(r);
    // running tests never starts or resets the clock; only 's' and 'r' do
    setElapsedMs(r.passed && startedAt !== null ? Date.now() - startedAt : null);
    setScreen('results');
  };

  const onMenu = (action: MenuAction) => {
    if (action === 'quit') exit();
    if (action === 'train') setScreen('difficulty');
    if (action === 'settings') {
      setStatus(undefined);
      setScreen('settings');
    }
    if (action === 'random') void openExercise(getRandomExercise());
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
          onSelect={(ex) => void openExercise(ex)}
          onBack={() => setScreen('difficulty')}
          onSearchActive={setSearchActive}
        />
      ) : null}

      {screen === 'exercise' && exercise && paths ? (
        <ExerciseView
          exercise={exercise}
          exerciseFile={paths.exerciseFile}
          testFile={paths.testFile}
          started={started}
          startedAt={startedAt}
          onStart={() => void startExercise(exercise)}
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
