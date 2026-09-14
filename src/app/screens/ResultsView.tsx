import { Box, Text, useInput } from 'ink';
import { formatDuration, KeyHints } from '@components/ui';
import { ScrollView } from '@components/ScrollView';
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
    if (input === 't') onRerun();
  });

  const ok = result.passed;

  return (
    <Box flexDirection="column" flexGrow={1} flexShrink={1} minHeight={0} paddingLeft={2} paddingRight={2}>
      <Box
        borderStyle="double"
        borderColor={ok ? 'greenBright' : 'redBright'}
        paddingX={2}
        paddingY={0}
        flexDirection="column"
        alignItems="center"
        flexShrink={0}
      >
        <Text bold color={ok ? 'greenBright' : 'redBright'}>
          {ok ? '✔  ALL TESTS PASSED' : '✘  TESTS FAILED'}
        </Text>
        <Text dimColor>{exercise.name}</Text>
      </Box>

      <Box marginTop={1} flexShrink={0}>
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
        <Box marginTop={1} flexShrink={0}>
          <Text color="cyanBright">⏱  solved in {formatDuration(elapsedMs)}</Text>
        </Box>
      ) : null}

      <Box marginTop={1} flexDirection="column" flexGrow={1} flexShrink={1} minHeight={0}>
        <ScrollView isActive>
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
        </ScrollView>
      </Box>

      <Box marginTop={1} flexShrink={0}>
        <KeyHints
          hints={[
            ['t', 'run again'],
            ['j/k', 'scroll'],
            ['esc', 'back'],
            ['q', 'quit'],
          ]}
        />
      </Box>
    </Box>
  );
}