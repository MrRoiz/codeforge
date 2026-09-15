import { Box, Text, useInput } from 'ink';
import { useState } from 'react';
import { DifficultyBadge, formatDate, formatDuration, KeyHints } from '@components/ui';
import { ScrollView } from '@components/ScrollView';
import { useElapsed } from '@app/useElapsed';
import { formatExample } from '@utils/format';
import { validationLabel, type Exercise } from '@exercises/types';

interface Props {
  exercise: Exercise;
  exerciseFile: string;
  testFile: string;
  started: boolean;
  startedAt: number | null;
  onStart: () => void;
  onRun: () => void;
  onOpenEditor: () => void;
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
  onOpenEditor,
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
    if (input === 'o') onOpenEditor();
    if (input === 'r' && started) onRestartTimer();
    if (input === 'h') setShowHints((v) => !v);
    if (input === 'c') setShowTests((v) => !v);
  });

  const hasCustomTests = Boolean(exercise.tests.fileBody);

  return (
    <Box flexDirection="column" flexGrow={1} flexShrink={1} minHeight={0} paddingLeft={2} paddingRight={2}>
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
              <Box key={i} flexDirection="column">
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
                  <Box flexDirection="column" flexGrow={1} flexBasis={0} flexShrink={1} marginRight={2}>
                    <MultiLine label="Input:  " value={formatExample(ex.input)} color="greenBright" />
                  </Box>
                  <Box flexDirection="column" flexGrow={1} flexBasis={0} flexShrink={1}>
                    <MultiLine label="Output: " value={formatExample(ex.output)} color="greenBright" />
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
                <Text dimColor>This exercise is graded by a custom validator that accepts any correct answer.</Text>
              ) : (
                exercise.tests.cases.map((t, i) => (
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

      </ScrollView>

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

      <Box marginTop={1} flexShrink={0}>
        <KeyHints
          hints={[
            ...(!started ? ([['s', 'start']] as [string, string][]) : []),
            ['t', 'run tests'],
            ['o', 'open in editor'],
            ...(started ? ([['r', 'restart timer']] as [string, string][]) : []),
            ['c', showTests ? 'hide tests' : 'show tests'],
            ['h', showHints ? 'hide hints' : 'show hints'],
            ['j/k', 'scroll'],
            ['esc', 'back'],
            ['q', 'quit'],
          ]}
        />
      </Box>
    </Box>
  );
}
