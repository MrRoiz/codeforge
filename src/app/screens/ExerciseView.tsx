import { Box, Text, useInput } from 'ink';
import { useState } from 'react';
import { DifficultyBadge, formatDuration, KeyHints } from '@components/ui';
import { useElapsed } from '@app/useElapsed';
import { validationLabel, type Exercise } from '@exercises/types';

interface Props {
  exercise: Exercise;
  exerciseFile: string;
  testFile: string;
  started: boolean;
  startedAt: number | null;
  onStart: () => void;
  onRun: () => void;
  onRestartTimer: () => void;
  onBack: () => void;
}

function MultiLine({ label, value, color }: { label: string; value: string; color?: string }) {
  const lines = value.split('\n');
  return (
    <Box flexDirection="column">
      {lines.map((line, i) => (
        <Text key={i} color={color}>
          {i === 0 ? `${label}${line}` : `${' '.repeat(label.length)}${line}`}
        </Text>
      ))}
    </Box>
  );
}

export function ExerciseView({
  exercise,
  exerciseFile,
  testFile,
  started,
  startedAt,
  onStart,
  onRun,
  onRestartTimer,
  onBack,
}: Props) {
  const [showHints, setShowHints] = useState(false);
  const [showTests, setShowTests] = useState(false);
  const elapsed = useElapsed(startedAt);

  useInput((input, key) => {
    if (key.escape) {
      onBack();
      return;
    }
    if (input === 's') onStart();
    if (input === 't') onRun();
    if (input === 'r' && started) onRestartTimer();
    if (input === 'h') setShowHints((v) => !v);
    if (input === 'c') setShowTests((v) => !v);
  });

  const hasCustomTests = Boolean(exercise.testFileBody);

  return (
    <Box flexDirection="column" paddingLeft={2} paddingRight={2}>
      <Box borderStyle="double" borderColor="cyan" paddingX={1} flexDirection="column">
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
      </Box>

      <Box marginTop={1} flexDirection="column">
        <Text wrap="wrap">{exercise.description}</Text>
      </Box>

      <Box marginTop={1} flexDirection="column">
        <Text color="yellowBright" bold>
          EXAMPLES
        </Text>
        <Box flexDirection="column" marginLeft={1}>
          {exercise.examples.map((ex, i) => (
            <Box key={i} flexDirection="column" marginTop={i === 0 ? 0 : 1}>
              <MultiLine label="Input:  " value={ex.input} color="greenBright" />
              <MultiLine label="Output: " value={ex.output} color="greenBright" />
              {ex.explanation ? <MultiLine label="Note:   " value={ex.explanation} /> : null}
            </Box>
          ))}
        </Box>
      </Box>

      <Box marginTop={1} flexDirection="column">
        <Text color="yellowBright" bold>
          TEST CASES {showTests ? '' : `(${exercise.tests.length}) — press c to reveal`}
        </Text>
        {showTests ? (
          <Box flexDirection="column" marginLeft={1}>
            {hasCustomTests ? (
              <Text dimColor>This exercise is graded by a custom validator that accepts any correct answer.</Text>
            ) : (
              exercise.tests.map((t, i) => (
                <Text key={i} wrap="wrap">
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
          {exercise.constraints.map((c, i) => (
            <Text key={i} dimColor>
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
              <Text key={i} color="magentaBright">
                {i + 1}. {h}
              </Text>
            ))}
          </Box>
        ) : null}
      </Box>

      <Box marginTop={1} flexDirection="column" borderStyle="round" borderColor={started ? 'gray' : 'yellowBright'} paddingX={1}>
        {started ? (
          <>
            {startedAt !== null ? <Text color="cyanBright">⏱  elapsed → {formatDuration(elapsed)}</Text> : null}
            <Text dimColor>Solve it in your editor of choice — codeforge only checks the output.</Text>
            <Text color="cyanBright">solution → {exerciseFile}</Text>
            <Text dimColor>tests    → {testFile} (auto-generated)</Text>
          </>
        ) : (
          <>
            <Text color="yellowBright">Not started yet. Press s to create the exercise files.</Text>
            <Text dimColor>will create → {exerciseFile}</Text>
          </>
        )}
      </Box>

      <Box marginTop={1}>
        <KeyHints
          hints={[
            ...(!started ? ([['s', 'start']] as [string, string][]) : []),
            ['t', started ? 'run tests' : 'start & run tests'],
            ...(started ? ([['r', 'restart timer']] as [string, string][]) : []),
            ['c', showTests ? 'hide tests' : 'show tests'],
            ['h', showHints ? 'hide hints' : 'show hints'],
            ['esc', 'back'],
            ['q', 'quit'],
          ]}
        />
      </Box>
    </Box>
  );
}
