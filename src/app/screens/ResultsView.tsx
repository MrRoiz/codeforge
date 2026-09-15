import { ScrollView } from '@components/ScrollView';
import { formatDuration, KeyHints } from '@components/ui';
import type { Exercise } from '@exercises/types';
import { pickQuote } from '@utils/quotes';
import type { TestRunResult } from '@utils/runTests';
import { Box, Text, useInput } from 'ink';
import { useEffect, useState } from 'react';

interface Props {
  exercise: Exercise;
  result: TestRunResult;
  elapsedMs?: number | null;
  onRerun: () => void;
  onOpenEditor: () => void;
  onBack: () => void;
}

// border glow on a pass: cycle for a moment, then settle on green
const GLOW_COLORS = ['greenBright', 'cyanBright', 'whiteBright'];
const GLOW_FRAMES = 24;
const GLOW_MS = 140;

function accentColor(ok: boolean, pulsing: boolean, frame: number): string {
  if (!ok) {
    return 'redBright';
  }
  if (pulsing) {
    return GLOW_COLORS[frame % GLOW_COLORS.length];
  }
  return 'greenBright';
}

function bar(passed: number, total: number, width = 30): string {
  const filled = total === 0 ? 0 : Math.round((passed / total) * width);
  return '█'.repeat(filled) + '░'.repeat(width - filled);
}

function cleanMessage(msg: string): string[] {
  // biome-ignore lint/suspicious/noControlCharactersInRegex: matching the ANSI escape sequence
  const stripped = msg.replace(/\u001b\[[0-9;]*m/g, '');
  const lines = stripped
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  const interesting = lines.filter(
    (l) =>
      l.startsWith('Expected') ||
      l.startsWith('Received') ||
      l.startsWith('Error') ||
      l.includes('Not implemented'),
  );
  const chosen = interesting.length > 0 ? interesting : lines;
  return chosen.slice(0, 4);
}

export function ResultsView({ exercise, result, elapsedMs, onRerun, onOpenEditor, onBack }: Props) {
  useInput((input, key) => {
    if (key.escape) {
      onBack();
    }
    if (input === 't') {
      onRerun();
    }
    if (input === 'o') {
      onOpenEditor();
    }
  });

  const ok = result.passed;
  const [glowFrame, setGlowFrame] = useState(0);
  const [quote] = useState(() => (ok ? pickQuote() : ''));

  useEffect(() => {
    if (!ok) {
      return;
    }
    const id = setInterval(() => {
      setGlowFrame((f) => {
        if (f + 1 >= GLOW_FRAMES) {
          clearInterval(id);
        }
        return f + 1;
      });
    }, GLOW_MS);
    return () => clearInterval(id);
  }, [ok]);

  const pulsing = ok && glowFrame < GLOW_FRAMES;
  const accent = accentColor(ok, pulsing, glowFrame);

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
        borderColor={accent}
        paddingX={2}
        paddingY={0}
        flexDirection="column"
        alignItems="center"
        flexShrink={0}
      >
        <Text bold color={accent}>
          {ok ? '✔  ALL TESTS PASSED' : '✘  TESTS FAILED'}
        </Text>
        <Text dimColor>{exercise.name}</Text>
        {ok && quote ? (
          <Box marginTop={1}>
            <Text color="cyanBright" wrap="wrap">
              {quote}
            </Text>
          </Box>
        ) : null}
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
          <Text color="cyanBright">⏱ solved in {formatDuration(elapsedMs)}</Text>
        </Box>
      ) : null}

      <Box marginTop={1} flexDirection="column" flexGrow={1} flexShrink={1} minHeight={0}>
        <ScrollView isActive>
          {result.rawError ? (
            <Text color="redBright" wrap="wrap">
              {result.rawError}
            </Text>
          ) : (
            result.cases.map((c) => (
              <Box key={c.name} flexDirection="column" marginBottom={c.passed ? 0 : 1}>
                <Text color={c.passed ? 'greenBright' : 'redBright'}>
                  {c.passed ? '✓' : '✗'} {c.name}
                </Text>
                {c.passed ? null : (
                  <Text dimColor>
                    {cleanMessage(c.failureMessages.join('\n'))
                      .map((l) => `    ${l}`)
                      .join('\n')}
                  </Text>
                )}
              </Box>
            ))
          )}
        </ScrollView>
      </Box>

      <Box marginTop={1} flexShrink={0}>
        <KeyHints
          hints={[
            ['t', 'run again'],
            ['o', 'open in editor'],
            ['j/k', 'scroll'],
            ['esc', 'back'],
            ['q', 'quit'],
          ]}
        />
      </Box>
    </Box>
  );
}
