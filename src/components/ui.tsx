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
