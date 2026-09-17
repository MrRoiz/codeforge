import { useElapsed } from '@app/hooks/useElapsed';
import { exerciseAtom, type RunPhase, runPhaseAtom, startedAtAtom } from '@app/store';
import { DifficultyBadge, formatDuration } from '@components/ui';
import { Box, Text } from 'ink';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';

const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

// The stages of a run, in the order `useExerciseActions.run` performs them.
const STEPS: { phase: RunPhase; label: string }[] = [
  { phase: 'preparing', label: 'preparing the exercise files' },
  { phase: 'testing', label: 'running the hidden test suite' },
  { phase: 'analyzing', label: 'estimating your solution complexity' },
];

const TIPS = [
  'the test file is regenerated on every run, so the tests cannot be "fixed".',
  'press o to solve it in your editor of choice. codeforge only checks the output.',
  'a passing timed run records your best time and complexity.',
  'hints live behind h, and the graded cases behind c.',
  'press x on an exercise to clear just its stats.',
];

type StepState = 'done' | 'active' | 'pending';

function stepState(index: number, activeIndex: number): StepState {
  if (index < activeIndex) {
    return 'done';
  }
  if (index === activeIndex) {
    return 'active';
  }
  return 'pending';
}

function stepGlyph(state: StepState, frame: number): string {
  if (state === 'done') {
    return '✓';
  }
  if (state === 'active') {
    return FRAMES[frame % FRAMES.length];
  }
  return '○';
}

function stepColor(state: StepState): string | undefined {
  if (state === 'done') {
    return 'greenBright';
  }
  if (state === 'active') {
    return 'cyanBright';
  }
  return undefined;
}

function labelColor(state: StepState): string | undefined {
  if (state === 'done') {
    return 'greenBright';
  }
  if (state === 'active') {
    return 'whiteBright';
  }
  return undefined;
}

export function RunningView() {
  const exercise = useAtomValue(exerciseAtom);
  const startedAt = useAtomValue(startedAtAtom);
  const phase = useAtomValue(runPhaseAtom);

  const [frame, setFrame] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [runStartedAt] = useState(() => Date.now());

  const elapsed = useElapsed(startedAt ?? runStartedAt);
  const timed = startedAt !== null;

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => f + 1), 80);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTipIndex((i) => (i + 1) % TIPS.length), 4500);
    return () => clearInterval(id);
  }, []);

  if (!exercise) {
    return null;
  }

  const found = STEPS.findIndex((step) => step.phase === phase);
  const activeIndex = found === -1 ? 0 : found;
  const cases = exercise.tests.fileBody
    ? 'custom validator'
    : `${exercise.tests.cases.length} test cases`;

  return (
    <Box
      flexDirection="column"
      flexGrow={1}
      flexShrink={1}
      minHeight={0}
      paddingLeft={2}
      paddingRight={2}
    >
      <Box
        borderStyle="double"
        borderColor="cyan"
        paddingX={2}
        paddingY={1}
        flexDirection="column"
        flexShrink={0}
      >
        <Box>
          <Text color="cyanBright" bold>
            ⚒ FORGING{' '}
          </Text>
          <Text bold color="whiteBright">
            {exercise.name.toUpperCase()}
          </Text>
        </Box>
        <Box marginTop={1}>
          <DifficultyBadge difficulty={exercise.difficulty} />
          <Text dimColor>
            {'  '}
            {exercise.type} · {exercise.time} · {cases}
          </Text>
        </Box>
      </Box>

      <Box marginTop={2} flexDirection="column" flexShrink={0}>
        {STEPS.map((step, i) => {
          const state = stepState(i, activeIndex);
          return (
            <Box key={step.phase}>
              <Text color={stepColor(state)} dimColor={state === 'pending'}>
                {stepGlyph(state, frame)}{' '}
              </Text>
              <Text color={labelColor(state)} dimColor={state === 'pending'}>
                {step.label}
              </Text>
            </Box>
          );
        })}
      </Box>

      <Box marginTop={1} flexShrink={0}>
        {timed ? (
          <Text color="cyanBright">⏱ {formatDuration(elapsed)} on the clock. This run counts.</Text>
        ) : (
          <Text dimColor>untimed run. Press s on the exercise to start the clock.</Text>
        )}
      </Box>

      <Box marginTop={2} flexShrink={0}>
        <Text dimColor wrap="wrap">
          <Text color="magentaBright">tip </Text>
          {TIPS[tipIndex]}
        </Text>
      </Box>
    </Box>
  );
}
