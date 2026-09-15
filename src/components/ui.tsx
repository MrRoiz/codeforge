import type { Exercise } from '@exercises/types';
import type { ExerciseStat } from '@utils/state';
import { Box, Text } from 'ink';

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

/** Human-readable progress for one exercise, for the list and detail views. */
export function formatProgress(stat?: ExerciseStat): string {
  if (!stat || stat.attempts === 0) {
    return 'not attempted';
  }
  if (stat.solves === 0) {
    return `${stat.attempts} attempt${stat.attempts === 1 ? '' : 's'} · not solved yet`;
  }
  const parts = [`✓ solved ${stat.solves}×`];
  if (stat.bestMs != null) {
    parts.push(`best ${formatDuration(stat.bestMs)}`);
  }
  if (stat.lastMs != null) {
    parts.push(`last ${formatDuration(stat.lastMs)}`);
  }
  if (stat.attempts > stat.solves) {
    parts.push(`${stat.attempts} runs`);
  }
  return parts.join(' · ');
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
