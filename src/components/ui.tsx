import { Box, Text } from 'ink';
import type { Exercise } from '@exercises/types';

export function difficultyColor(d: Exercise['difficulty']): string {
  return d === 'easy' ? 'greenBright' : d === 'medium' ? 'yellowBright' : 'redBright';
}

export function DifficultyBadge({ difficulty }: { difficulty: Exercise['difficulty'] }) {
  const label = difficulty === 'easy' ? 'EASY' : difficulty === 'medium' ? 'MED' : 'HARD';
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
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
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
