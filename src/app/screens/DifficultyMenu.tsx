import { Box, Text, useInput } from 'ink';
import { Select } from '@components/Select';
import { KeyHints } from '@components/ui';
import type { Exercise } from '@exercises/types';

export type DifficultyChoice = Exercise['difficulty'] | 'all';

interface Props {
  counts: Record<DifficultyChoice, number>;
  onSelect: (choice: DifficultyChoice) => void;
  onBack: () => void;
}

export function DifficultyMenu({ counts, onSelect, onBack }: Props) {
  useInput((_input, key) => {
    if (key.escape) onBack();
  });

  return (
    <Box flexDirection="column" paddingLeft={2}>
      <Text color="cyanBright" bold>
        SELECT DIFFICULTY
      </Text>
      <Box marginTop={1} flexDirection="column">
        <Select<DifficultyChoice>
          items={[
            { label: 'All', value: 'all', hint: `(${counts.all})` },
            { label: 'Easy', value: 'easy', hint: `(${counts.easy})`, disabled: counts.easy === 0 },
            { label: 'Medium', value: 'medium', hint: `(${counts.medium})`, disabled: counts.medium === 0 },
            { label: 'Hard', value: 'hard', hint: `(${counts.hard})`, disabled: counts.hard === 0 },
          ]}
          onSelect={onSelect}
        />
      </Box>
      <Box marginTop={1}>
        <KeyHints hints={[['j/k ↑↓', 'navigate'], ['↵', 'select'], ['esc', 'back'], ['q', 'quit']]} />
      </Box>
    </Box>
  );
}