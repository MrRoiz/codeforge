import { useExerciseActions } from '@app/hooks/useExerciseActions';
import {
  complexityAtom,
  elapsedMsAtom,
  exerciseAtom,
  newBestAtom,
  resultAtom,
  screenAtom,
  sessionAttemptsAtom,
} from '@app/store';
import { ScrollView } from '@components/ScrollView';
import { formatDuration, KeyHints, progressBar } from '@components/ui';
import { pickQuote } from '@utils/quotes';
import { ANSI_PATTERN } from '@utils/runTests';
import { Box, Text, useInput } from 'ink';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';

// border glow on a pass: cycle for a moment, then settle on green
const GLOW_COLORS = ['greenBright', 'cyanBright', 'whiteBright'];
const GLOW_FRAMES = 24;
const GLOW_MS = 140;
const RESULT_BAR_WIDTH = 30;

// legend line `node:assert` prints above a `+ actual` / `- expected` diff
const ASSERT_DIFF_LEGEND = '+ actual - expected';
const MAX_MESSAGE_LINES = 8;

function accentColor(ok: boolean, pulsing: boolean, frame: number): string {
  if (!ok) {
    return 'redBright';
  }
  if (pulsing) {
    return GLOW_COLORS[frame % GLOW_COLORS.length];
  }
  return 'greenBright';
}

/** A prominent result tile: the headline number plus a one-line detail. */
function StatCard({
  label,
  value,
  detail,
  color,
  best = false,
}: {
  label: string;
  value: string;
  detail: string;
  color: string;
  best?: boolean;
}) {
  return (
    <Box
      flexGrow={1}
      flexBasis={0}
      borderStyle="double"
      borderColor={color}
      paddingX={2}
      flexDirection="column"
    >
      <Box>
        <Text dimColor>{label}</Text>
        {best ? (
          <Text bold color="greenBright">
            {'  '}★ NEW BEST
          </Text>
        ) : null}
      </Box>
      <Text bold color={color}>
        {value}
      </Text>
      <Text dimColor>{detail}</Text>
    </Box>
  );
}

/**
 * The failure lines worth showing for one case. A `node:assert` diff lists every
 * element of the compared values; keep its header and legend but only the
 * `+`/`-` lines that differ, so the mismatch fits on screen.
 */
function cleanMessage(msg: string): string[] {
  const lines = msg
    .replace(ANSI_PATTERN, '')
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => line.length > 0);

  const legendIndex = lines.indexOf(ASSERT_DIFF_LEGEND);
  const shown =
    legendIndex === -1
      ? lines
      : [...lines.slice(0, legendIndex + 1), ...lines.slice(legendIndex + 1).filter(isChangedLine)];

  if (shown.length <= MAX_MESSAGE_LINES) {
    return shown;
  }
  const kept = shown.slice(0, MAX_MESSAGE_LINES - 1);
  return [...kept, `… ${shown.length - kept.length} more lines`];
}

function isChangedLine(line: string): boolean {
  return line.startsWith('+') || line.startsWith('-');
}

export function ResultsView() {
  const exercise = useAtomValue(exerciseAtom);
  const result = useAtomValue(resultAtom);
  const elapsedMs = useAtomValue(elapsedMsAtom);
  const complexity = useAtomValue(complexityAtom);
  const sessionAttempts = useAtomValue(sessionAttemptsAtom);
  const newBest = useAtomValue(newBestAtom);
  const setScreen = useSetAtom(screenAtom);
  const { run, openEditor } = useExerciseActions();

  const ok = result?.passed ?? false;
  const [glowFrame, setGlowFrame] = useState(0);
  const [quote] = useState(() => (ok ? pickQuote() : ''));

  useInput((input, key) => {
    if (!exercise) {
      return;
    }
    if (key.escape) {
      setScreen('exercise');
    }
    if (input === 't') {
      void run(exercise);
    }
    if (input === 'o') {
      void openEditor(exercise);
    }
  });

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

  if (!exercise || !result) {
    return null;
  }

  const pulsing = ok && glowFrame < GLOW_FRAMES;
  const accent = accentColor(ok, pulsing, glowFrame);
  // a passing timed run is the only one with a time worth showing
  const timeMs = ok && elapsedMs != null ? elapsedMs : null;

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

      {timeMs != null || complexity != null || sessionAttempts > 0 ? (
        <Box flexShrink={0} flexDirection="row" columnGap={1}>
          {timeMs == null ? null : (
            <StatCard
              label="TIME"
              value={formatDuration(timeMs)}
              detail="timed solve"
              color="cyanBright"
              best={newBest.time}
            />
          )}
          {sessionAttempts === 0 ? null : (
            <StatCard
              label="ATTEMPTS"
              value={String(sessionAttempts)}
              detail="this session"
              color="yellowBright"
            />
          )}
          {complexity == null ? null : (
            <StatCard
              label="COMPLEXITY"
              value={complexity.label}
              detail={`${complexity.confidence} confidence · ${complexity.detail}`}
              color="magentaBright"
              best={newBest.complexity}
            />
          )}
        </Box>
      ) : null}

      <Box marginTop={1} flexShrink={0}>
        <Text>
          <Text color={ok ? 'greenBright' : 'yellowBright'}>
            {progressBar({
              done: result.numPassed,
              total: result.numTotal,
              width: RESULT_BAR_WIDTH,
            })}
          </Text>
          <Text>
            {'  '}
            {result.numPassed}/{result.numTotal} passed
          </Text>
        </Text>
      </Box>

      <Box marginTop={1} flexDirection="column" flexGrow={1} flexShrink={1} minHeight={0}>
        <ScrollView>
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
