import { ScrollView } from '@components/ScrollView';
import { DifficultyBadge, formatDate, formatDuration, StatColumns } from '@components/ui';
import type { Exercise } from '@exercises/types';
import { formatExample } from '@utils/format';
import type { ExerciseStat } from '@utils/state';
import { Box, Text } from 'ink';
import type { ReactNode } from 'react';

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

/** A titled, indented block inside the scrollable exercise body. */
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box marginTop={1} flexDirection="column">
      <Text color="yellowBright" bold>
        {title}
      </Text>
      <Box flexDirection="column" marginLeft={1}>
        {children}
      </Box>
    </Box>
  );
}

/** The bordered title bar: exercise metadata plus the recorded stats. */
export function ExerciseHeader({ exercise, stat }: { exercise: Exercise; stat?: ExerciseStat }) {
  const headerInfo = (
    <Box flexDirection="column">
      <Box>
        <Text bold color="whiteBright">
          {exercise.name}
        </Text>
        <Text> </Text>
        <DifficultyBadge difficulty={exercise.difficulty} />
      </Box>
      <Text dimColor>
        {exercise.type} · {exercise.time}
      </Text>
      <Text dimColor>added: {formatDate(exercise.createdAt)}</Text>
    </Box>
  );

  return (
    <Box
      borderStyle="double"
      borderColor="cyan"
      paddingX={1}
      flexDirection="column"
      flexShrink={0}
      marginBottom={1}
    >
      {stat?.attempts ? (
        <Box width="100%" alignItems="center">
          {headerInfo}
          <Box flexGrow={1} justifyContent="space-evenly">
            <StatColumns stat={stat} />
          </Box>
        </Box>
      ) : (
        <Box
          position="relative"
          width="100%"
          minHeight={4}
          justifyContent="center"
          alignItems="center"
        >
          <Box position="absolute" left={0} top={0}>
            {headerInfo}
          </Box>
          <Text dimColor>not attempted yet</Text>
        </Box>
      )}
    </Box>
  );
}

/** The revealed test cases, or a note when a custom validator grades them. */
function TestCaseList({ exercise }: { exercise: Exercise }) {
  if (exercise.tests.fileBody) {
    return (
      <Text dimColor>
        This exercise is graded by a custom validator that accepts any correct answer.
      </Text>
    );
  }
  return (
    <>
      {exercise.tests.cases.map((t, i) => (
        <Text key={JSON.stringify(t.input)} wrap="wrap">
          <Text dimColor>{`${i + 1}. `}</Text>
          <Text color="greenBright">{JSON.stringify(t.input)}</Text>
          <Text dimColor> → </Text>
          <Text color="cyanBright">{JSON.stringify(t.expected)}</Text>
          {t.sorted ? <Text dimColor> (order-insensitive)</Text> : null}
        </Text>
      ))}
    </>
  );
}

/**
 * The scrollable problem statement: description, examples, test cases,
 * constraints and hints. Purely presentational — the container owns the
 * `c`/`h` reveal state so its key hints can reflect it.
 */
export function ExerciseDetails({
  exercise,
  showTests,
  showHints,
}: {
  exercise: Exercise;
  showTests: boolean;
  showHints: boolean;
}) {
  const testTitle = showTests
    ? 'TEST CASES'
    : `TEST CASES (${exercise.tests.cases.length}) — press c to reveal`;

  return (
    <ScrollView isActive>
      <Box flexDirection="column">
        <Text wrap="wrap">{exercise.description}</Text>
      </Box>

      <Section title="EXAMPLES">
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
      </Section>

      <Section title={testTitle}>{showTests ? <TestCaseList exercise={exercise} /> : null}</Section>

      <Section title="CONSTRAINTS">
        {exercise.constraints.map((c) => (
          <Text key={c} dimColor>
            • {c}
          </Text>
        ))}
      </Section>

      <Section title={showHints ? 'HINTS' : 'HINTS (hidden — press h)'}>
        {showHints
          ? exercise.hints.map((h, i) => (
              <Text key={h} color="magentaBright">
                {i + 1}. {h}
              </Text>
            ))
          : null}
      </Section>
    </ScrollView>
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

/** The bottom status box: the clock, the file paths and the dirty-file notice. */
export function ExerciseStatus({
  started,
  running,
  finished,
  elapsed,
  exerciseFile,
  testFile,
  hasContent,
}: {
  started: boolean;
  running: boolean;
  finished: boolean;
  elapsed: number;
  exerciseFile: string;
  testFile: string;
  hasContent: boolean;
}) {
  return (
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
  );
}
