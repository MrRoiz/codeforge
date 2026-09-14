import { Box, Text, useInput } from 'ink';
import { formatDuration, KeyHints } from '@components/ui';
import type { TestRunResult } from '@utils/runTests';
import type { Exercise } from '@exercises/types';

interface Props {
  exercise: Exercise;
  result: TestRunResult;
  elapsedMs?: number | null;
  onRerun: () => void;
  onBack: () => void;
}

function bar(passed: number, total: number, width = 30): string {
  const filled = total === 0 ? 0 : Math.round((passed / total) * width);
  return '█'.repeat(filled) + '░'.repeat(width - filled);
}

function cleanMessage(msg: string): string[] {
  const stripped = msg.replace(/\u001b\[[0-9;]*m/g, '');
  const lines = stripped
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  const interesting = lines.filter(
    (l) => l.startsWith('Expected') || l.startsWith('Received') || l.startsWith('Error') || l.includes('Not implemented'),
  );
  const chosen = interesting.length > 0 ? interesting : lines;
  return chosen.slice(0, 4);
}

export function ResultsView({ exercise, result, elapsedMs, onRerun, onBack }: Props) {
  useInput((input, key) => {
    if (key.escape) onBack();
    if (input === 'r') onRerun();
  });

  const ok = result.passed;

  return (
    <Box flexDirection="column" paddingLeft={2} paddingRight={2}>
      <Box
        borderStyle="double"
        borderColor={ok ? 'greenBright' : 'redBright'}
        paddingX={2}
        paddingY={0}
        flexDirection="column"
        alignItems="center"
      >
        <Text bold color={ok ? 'greenBright' : 'redBright'}>
          {ok ? '✔  ALL TESTS PASSED' : '✘  TESTS FAILED'}
        </Text>
        <Text dimColor>{exercise.name}</Text>
      </Box>

      <Box marginTop={1}>
        <Text>
          <Text color={ok ? 'greenBright' : 'yellowBright'}>
            {bar(result.numPassed, result.numTotal)}
          </Text>
          <Text>
            {'  '}
            {result.numPassed}/{result.numTotal} passed
          </Text>
        </Text>
      </Box>

      {ok && elapsedMs != null ? (
        <Box marginTop={1}>
          <Text color="cyanBright">⏱  solved in {formatDuration(elapsedMs)}</Text>
        </Box>
      ) : null}

      <Box marginTop={1} flexDirection="column">
        {result.rawError ? (
          <Text color="redBright" wrap="wrap">
            {result.rawError}
          </Text>
        ) : (
          result.cases.map((c, i) => (
            <Box key={i} flexDirection="column" marginBottom={c.passed ? 0 : 1}>
              <Text color={c.passed ? 'greenBright' : 'redBright'}>
                {c.passed ? '✓' : '✗'} {c.name}
              </Text>
              {!c.passed
                ? cleanMessage(c.failureMessages.join('\n')).map((l, j) => (
                    <Text key={j} dimColor>
                      {'    '}
                      {l}
                    </Text>
                  ))
                : null}
            </Box>
          ))
        )}
      </Box>

      <Box marginTop={1}>
        <KeyHints
          hints={[
            ['r', 'run again'],
            ['esc', 'back'],
            ['q', 'quit'],
          ]}
        />
      </Box>
    </Box>
  );
}