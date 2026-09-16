import { useElapsed } from '@app/hooks/useElapsed';
import { useExerciseActions } from '@app/hooks/useExerciseActions';
import {
  confirmAtom,
  elapsedMsAtom,
  exerciseAtom,
  hasContentAtom,
  pathsAtom,
  progressAtom,
  screenAtom,
  startedAtAtom,
  startedAtom,
} from '@app/store';
import { ExerciseDetails, ExerciseHeader, ExerciseStatus } from '@components/exercise';
import { ConfirmPrompt, KeyHints } from '@components/ui';
import { Box, useInput } from 'ink';
import { useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';

export function ExerciseView() {
  const exercise = useAtomValue(exerciseAtom);
  const paths = useAtomValue(pathsAtom);
  const started = useAtomValue(startedAtom);
  const startedAt = useAtomValue(startedAtAtom);
  const elapsedMs = useAtomValue(elapsedMsAtom);
  const hasContent = useAtomValue(hasContentAtom);
  const confirm = useAtomValue(confirmAtom);
  const progress = useAtomValue(progressAtom);
  const setScreen = useSetAtom(screenAtom);
  const actions = useExerciseActions();

  const [showHints, setShowHints] = useState(false);
  const [showTests, setShowTests] = useState(false);

  const liveElapsed = useElapsed(startedAt);
  const running = startedAt !== null;
  // a stopped clock with a recorded time means the exercise was just solved
  const finished = !running && elapsedMs != null;
  const elapsed = running ? liveElapsed : (elapsedMs ?? 0);
  const confirmingReset = confirm === 'solution';
  const confirmingResetStats = confirm === 'stats';
  const confirming = confirmingReset || confirmingResetStats;

  useInput((input, key) => {
    if (!exercise) {
      return;
    }
    if (confirmingReset) {
      if (input === 'y' || input === 'Y') {
        actions.answerReset('reset');
      } else if (input === 'n' || input === 'N' || key.escape) {
        actions.answerReset('cancel');
      }
      return;
    }
    if (confirmingResetStats) {
      if (input === 'y' || input === 'Y') {
        actions.answerResetStats('reset');
      } else if (input === 'n' || input === 'N' || key.escape) {
        actions.answerResetStats('cancel');
      }
      return;
    }
    if (key.escape) {
      setScreen('list');
      return;
    }
    if (input === 's') {
      void actions.requestStart(exercise);
    }
    if (input === 't') {
      void actions.run(exercise);
    }
    if (input === 'o') {
      void actions.openEditor(exercise);
    }
    if (input === 'r' && started) {
      actions.restartTimer();
    }
    if (input === 'x') {
      actions.requestResetStats();
    }
    if (input === 'h') {
      setShowHints((v) => !v);
    }
    if (input === 'c') {
      setShowTests((v) => !v);
    }
  });

  if (!exercise || !paths) {
    return null;
  }

  return (
    <Box
      flexDirection="column"
      flexGrow={1}
      flexShrink={1}
      minHeight={0}
      paddingLeft={2}
      paddingRight={2}
    >
      <ExerciseHeader exercise={exercise} stat={progress.exercises[exercise.id]} />

      <ExerciseDetails exercise={exercise} showTests={showTests} showHints={showHints} />

      {confirmingReset ? (
        <ConfirmPrompt
          title="Reset the previous solution?"
          description="Starting the clock on existing work isn't allowed — exercise.ts will be replaced with the starter stub so you can solve it fresh."
          hints={[
            ['y', 'reset & start'],
            ['n / esc', 'cancel'],
          ]}
        />
      ) : null}

      {confirmingResetStats ? (
        <ConfirmPrompt
          title="Reset this exercise's stats?"
          description="Clears its attempts, solves and best/last times. Your solution file is left untouched."
          hints={[
            ['y', 'reset stats'],
            ['n / esc', 'cancel'],
          ]}
        />
      ) : null}

      <ExerciseStatus
        started={started}
        running={running}
        finished={finished}
        elapsed={elapsed}
        exerciseFile={paths.exerciseFile}
        testFile={paths.testFile}
        hasContent={hasContent}
      />

      <Box marginTop={1} flexShrink={0}>
        {confirming ? null : (
          <KeyHints
            hints={[
              ...(running || finished
                ? ([['r', 'restart timer']] as [string, string][])
                : ([['s', started ? 'start timer' : 'start']] as [string, string][])),
              ['t', 'run tests'],
              ['o', 'open in editor'],
              ...(progress.exercises[exercise.id]?.attempts
                ? ([['x', 'reset stats']] as [string, string][])
                : []),
              ['c', showTests ? 'hide tests' : 'show tests'],
              ['h', showHints ? 'hide hints' : 'show hints'],
              ['j/k', 'scroll'],
              ['esc', 'back'],
              ['q', 'quit'],
            ]}
          />
        )}
      </Box>
    </Box>
  );
}
