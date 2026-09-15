import { useElapsed } from '@app/useElapsed';
import { ScrollView } from '@components/ScrollView';
import {
  DifficultyBadge,
  formatDate,
  formatDuration,
  formatProgress,
  KeyHints,
} from '@components/ui';
import { type Exercise, validationLabel } from '@exercises/types';
import { formatExample } from '@utils/format';
import type { ExerciseStat } from '@utils/state';
import { Box, Text, useInput } from 'ink';
import { useState } from 'react';

interface Props {
  exercise: Exercise;
  stat?: ExerciseStat;
  exerciseFile: string;
  testFile: string;
  started: boolean;
  startedAt: number | null;
  elapsedMs: number | null;
  hasContent: boolean;
  confirmingReset: boolean;
  onStart: () => void;
  onResetDecision: (decision: 'reset' | 'cancel') => void;
  onRun: () => void;
  onOpenEditor: () => void;
  onRestartTimer: () => void;
  onBack: () => void;
}

function MultiLine({ label, value, color }: { label: string; value: string; color?: string }) {
  const text = value
    .split('\n')
    .map((line, i) => (i === 0 ? `${label}${line}` : `${' '.repeat(label.length)}${line}`))
    .join('\n');
  return (
    <Box flexDirection="column">
      <Text color={color}>{text}</Text>
    </Box>
  );
}

function clockStatus(running: boolean, finished: boolean, elapsed: number) {
  if (running) {
    return <Text color="cyanBright">⏱ elapsed → {formatDuration(elapsed)}</Text>;
  }
  if (finished) {
    return <Text color="greenBright">✓ solved in {formatDuration(elapsed)}</Text>;
  }
  return <Text color="yellowBright">Files ready — the clock is not running.</Text>;
}

export function ExerciseView({
  exercise,
  stat,
  exerciseFile,
  testFile,
  started,
  startedAt,
  elapsedMs,
  hasContent,
  confirmingReset,
  onStart,
  onResetDecision,
  onRun,
  onOpenEditor,
  onRestartTimer,
  onBack,
}: Props) {
  const [showHints, setShowHints] = useState(false);
  const [showTests, setShowTests] = useState(false);
  const liveElapsed = useElapsed(startedAt);
  const running = startedAt !== null;
  // a stopped clock with a recorded time means the exercise was just solved
  const finished = !running && elapsedMs != null;
  const elapsed = running ? liveElapsed : (elapsedMs ?? 0);

  useInput((input, key) => {
    if (confirmingReset) {
      if (input === 'y' || input === 'Y') {
        onResetDecision('reset');
      } else if (input === 'n' || input === 'N' || key.escape) {
        onResetDecision('cancel');
      }
      return;
    }
    if (key.escape) {
      onBack();
      return;
    }
    if (input === 's') {
      onStart();
    }
    if (input === 't') {
      onRun();
    }
    if (input === 'o') {
      onOpenEditor();
    }
    if (input === 'r' && started) {
      onRestartTimer();
    }
    if (input === 'h') {
      setShowHints((v) => !v);
    }
    if (input === 'c') {
      setShowTests((v) => !v);
    }
  });

  const hasCustomTests = Boolean(exercise.tests.fileBody);

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
        paddingX={1}
        flexDirection="column"
        flexShrink={0}
        marginBottom={1}
      >
        <Box justifyContent="space-between">
          <Text bold color="whiteBright">
            {exercise.name}
          </Text>
          <DifficultyBadge difficulty={exercise.difficulty} />
        </Box>
        <Text dimColor>
          {exercise.type} · {exercise.time}
        </Text>
        <Text dimColor>source: {validationLabel(exercise)}</Text>
        <Text dimColor>added: {formatDate(exercise.createdAt)}</Text>
        <Text color={stat?.solves ? 'greenBright' : undefined} dimColor={!stat?.solves}>
          progress: {formatProgress(stat)}
        </Text>
      </Box>

      <ScrollView isActive>
        <Box flexDirection="column">
          <Text wrap="wrap">{exercise.description}</Text>
        </Box>

        <Box marginTop={1} flexDirection="column">
          <Text color="yellowBright" bold>
            EXAMPLES
          </Text>
          <Box flexDirection="column" marginLeft={1}>
            {exercise.examples.map((ex, i) => (
              <Box key={JSON.stringify(ex.input)} flexDirection="column">
                {i > 0 ? (
                  <Box
                    borderStyle="single"
                    borderColor="gray"
                    borderTop
                    borderBottom={false}
                    borderLeft={false}
                    borderRight={false}
                    marginTop={1}
                    marginBottom={1}
                  />
                ) : null}
                <Box flexDirection="row" alignItems="flex-start">
                  <Box
                    flexDirection="column"
                    flexGrow={1}
                    flexBasis={0}
                    flexShrink={1}
                    marginRight={2}
                  >
                    <MultiLine
                      label="Input:  "
                      value={formatExample(ex.input)}
                      color="greenBright"
                    />
                  </Box>
                  <Box flexDirection="column" flexGrow={1} flexBasis={0} flexShrink={1}>
                    <MultiLine
                      label="Output: "
                      value={formatExample(ex.output)}
                      color="greenBright"
                    />
                  </Box>
                </Box>
                {ex.explanation ? <MultiLine label="Note:   " value={ex.explanation} /> : null}
              </Box>
            ))}
          </Box>
        </Box>

        <Box marginTop={1} flexDirection="column">
          <Text color="yellowBright" bold>
            TEST CASES {showTests ? '' : `(${exercise.tests.cases.length}) — press c to reveal`}
          </Text>
          {showTests ? (
            <Box flexDirection="column" marginLeft={1}>
              {hasCustomTests ? (
                <Text dimColor>
                  This exercise is graded by a custom validator that accepts any correct answer.
                </Text>
              ) : (
                exercise.tests.cases.map((t, i) => (
                  <Text key={JSON.stringify(t.input)} wrap="wrap">
                    <Text dimColor>{`${i + 1}. `}</Text>
                    <Text color="greenBright">{JSON.stringify(t.input)}</Text>
                    <Text dimColor> → </Text>
                    <Text color="cyanBright">{JSON.stringify(t.expected)}</Text>
                    {t.sorted ? <Text dimColor> (order-insensitive)</Text> : null}
                  </Text>
                ))
              )}
            </Box>
          ) : null}
        </Box>

        <Box marginTop={1} flexDirection="column">
          <Text color="yellowBright" bold>
            CONSTRAINTS
          </Text>
          <Box flexDirection="column" marginLeft={1}>
            {exercise.constraints.map((c) => (
              <Text key={c} dimColor>
                • {c}
              </Text>
            ))}
          </Box>
        </Box>

        <Box marginTop={1} flexDirection="column">
          <Text color="yellowBright" bold>
            HINTS {showHints ? '' : '(hidden — press h)'}
          </Text>
          {showHints ? (
            <Box flexDirection="column" marginLeft={1}>
              {exercise.hints.map((h, i) => (
                <Text key={h} color="magentaBright">
                  {i + 1}. {h}
                </Text>
              ))}
            </Box>
          ) : null}
        </Box>
      </ScrollView>

      {confirmingReset ? (
        <Box
          marginTop={1}
          flexDirection="column"
          borderStyle="double"
          borderColor="yellowBright"
          paddingX={1}
          flexShrink={0}
        >
          <Text bold color="yellowBright">
            ⚠ Reset the previous solution?
          </Text>
          <Text dimColor>
            Starting the clock on existing work isn't allowed — exercise.ts will be replaced with
            the starter stub so you can solve it fresh.
          </Text>
          <Box marginTop={1}>
            <KeyHints
              hints={[
                ['y', 'reset & start'],
                ['n / esc', 'cancel'],
              ]}
            />
          </Box>
        </Box>
      ) : null}

      <Box
        marginTop={1}
        flexDirection="column"
        borderStyle="round"
        borderColor={started ? 'gray' : 'yellowBright'}
        paddingX={1}
        flexShrink={0}
      >
        {started ? (
          <>
            {clockStatus(running, finished, elapsed)}
            <Text dimColor>
              Solve it in your editor of choice — codeforge only checks the output.
            </Text>
            <Text color="cyanBright">solution → {exerciseFile}</Text>
            <Text dimColor>tests → {testFile} (auto-generated)</Text>
          </>
        ) : (
          <>
            <Text color="yellowBright">Not started yet. Press s to create the exercise files.</Text>
            <Text dimColor>will create → {exerciseFile}</Text>
          </>
        )}
        {!running && hasContent ? (
          <Box
            marginTop={1}
            borderStyle="round"
            borderColor="magentaBright"
            paddingX={1}
            flexDirection="column"
          >
            <Text color="magentaBright">
              ⚠ exercise.ts already has content. Keep working on it with{' '}
              <Text color="cyanBright">o</Text> — but the clock won't start on its own. Press{' '}
              <Text color="cyanBright">s</Text> to start it manually; only a timed run counts as a
              solve.
            </Text>
          </Box>
        ) : null}
      </Box>

      <Box marginTop={1} flexShrink={0}>
        {confirmingReset ? null : (
          <KeyHints
            hints={[
              ...(running || finished
                ? ([['r', 'restart timer']] as [string, string][])
                : ([['s', started ? 'start timer' : 'start']] as [string, string][])),
              ['t', 'run tests'],
              ['o', 'open in editor'],
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
