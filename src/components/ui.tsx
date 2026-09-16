import { useTerminalSize } from '@app/hooks/useTerminalSize';
import type { Exercise } from '@exercises/types';
import type { ExerciseStat, SolveAttempt } from '@utils/state';
import { Box, Text } from 'ink';
import type { ReactNode } from 'react';

const DIFFICULTY_COLORS: Record<Exercise['difficulty'], string> = {
  easy: 'greenBright',
  medium: 'yellowBright',
  hard: 'redBright',
};

const DIFFICULTY_LABELS: Record<Exercise['difficulty'], string> = {
  easy: 'EASY',
  medium: 'MED',
  hard: 'HARD',
};

export function difficultyColor(d: Exercise['difficulty']): string {
  return DIFFICULTY_COLORS[d];
}

export function DifficultyBadge({ difficulty }: { difficulty: Exercise['difficulty'] }) {
  const label = DIFFICULTY_LABELS[difficulty];
  return (
    <Text backgroundColor={difficultyColor(difficulty)} color="black">
      {` ${label} `}
    </Text>
  );
}

/** mm:ss, or h:mm:ss once past an hour. */
export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

/** Renders an ISO 'YYYY-MM-DD' date as e.g. 'Sep 14, 2026'. */
export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) {
    return iso;
  }
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Renders an ISO timestamp as e.g. 'Sep 14, 23:30'. */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return iso;
  }
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/** One solve snapshot: its time and complexity (whichever are recorded). */
function describeSolve(attempt: SolveAttempt): string {
  const parts: string[] = [];
  if (attempt.timeMs != null) {
    parts.push(formatDuration(attempt.timeMs));
  }
  if (attempt.complexity) {
    parts.push(attempt.complexity.label);
  }
  if (parts.length === 0) {
    parts.push('—');
  }
  return parts.join(' · ');
}

/** Complexity-first view of a solve snapshot, for the "best complexity" column. */
function describeComplexity(attempt: SolveAttempt): string {
  const parts: string[] = [];
  if (attempt.complexity) {
    parts.push(attempt.complexity.label);
  }
  if (attempt.timeMs != null) {
    parts.push(formatDuration(attempt.timeMs));
  }
  if (parts.length === 0) {
    parts.push('—');
  }
  return parts.join(' · ');
}

interface StatColumn {
  header: string;
  value: string;
}

/** One column per stat we keep for an exercise. */
function statColumns(stat: ExerciseStat): StatColumn[] {
  const withDate = (text: string, iso: string) => `${text} · ${formatDateTime(iso)}`;
  return [
    { header: 'attempts', value: String(stat.attempts) },
    { header: 'solves', value: String(stat.solves) },
    {
      header: 'last attempt',
      value: stat.lastAttempt ? formatDateTime(stat.lastAttempt) : '—',
    },
    {
      header: 'last solve',
      value: stat.lastSolve ? withDate(describeSolve(stat.lastSolve), stat.lastSolve.at) : '—',
    },
    {
      header: 'best time',
      value: stat.bestTimeAttempt
        ? withDate(describeSolve(stat.bestTimeAttempt), stat.bestTimeAttempt.at)
        : '—',
    },
    {
      header: 'best complexity',
      value: stat.bestComplexityAttempt
        ? withDate(describeComplexity(stat.bestComplexityAttempt), stat.bestComplexityAttempt.at)
        : '—',
    },
  ];
}

/** The stat columns as flex children — for a `space-between` row. */
export function StatColumns({ stat }: { stat?: ExerciseStat }) {
  if (!stat || stat.attempts === 0) {
    return null;
  }
  return (
    <>
      {statColumns(stat).map((c) => (
        <Box key={c.header} flexDirection="column" alignItems="center">
          <Text dimColor>{c.header}</Text>
          <Text>{c.value}</Text>
        </Box>
      ))}
    </>
  );
}

/** A standalone stats row spanning the full width. */
export function Stats({ stat }: { stat?: ExerciseStat }) {
  if (!stat || stat.attempts === 0) {
    return (
      <Box width="100%" justifyContent="center">
        <Text dimColor>not attempted yet</Text>
      </Box>
    );
  }
  return (
    <Box width="100%" justifyContent="space-between">
      <StatColumns stat={stat} />
    </Box>
  );
}

export function KeyHints({ hints }: { hints: [string, string][] }) {
  return (
    <Box>
      {hints.map(([key, label], i) => (
        <Text key={key} dimColor>
          {i > 0 ? '   ' : ''}
          <Text color="cyanBright">{key}</Text> {label}
        </Text>
      ))}
    </Box>
  );
}

/** A warning box asking the user to confirm a destructive action. */
export function ConfirmPrompt({
  title,
  description,
  hints,
}: {
  title: string;
  description: string;
  hints: [string, string][];
}) {
  return (
    <Box
      marginTop={1}
      flexDirection="column"
      borderStyle="double"
      borderColor="yellowBright"
      paddingX={1}
      flexShrink={0}
    >
      <Text bold color="yellowBright">
        ⚠ {title}
      </Text>
      <Text dimColor>{description}</Text>
      <Box marginTop={1}>
        <KeyHints hints={hints} />
      </Box>
    </Box>
  );
}

/**
 * A fixed-width column centered on screen, for the menu-style screens. Content
 * inside is left-aligned; the width shrinks to fit narrow terminals.
 */
export function CenteredColumn({
  maxWidth = 78,
  minWidth = 40,
  children,
}: {
  maxWidth?: number;
  minWidth?: number;
  children: ReactNode;
}) {
  const { columns } = useTerminalSize();
  const width = Math.min(maxWidth, Math.max(minWidth, columns - 4));

  return (
    <Box flexDirection="column" alignItems="center" width="100%" paddingX={2} paddingY={1}>
      <Box flexDirection="column" width={width}>
        {children}
      </Box>
    </Box>
  );
}
