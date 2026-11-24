import {
  type DifficultyChoice,
  difficultyAtom,
  difficultyCountsAtom,
  screenAtom,
} from '@app/store';
import { Select } from '@components/Select';
import { CenteredColumn, KeyHints } from '@components/ui';
import { DIFFICULTIES, type Difficulty } from '@exercises/types';
import { Box, Text, useInput } from 'ink';
import { useAtomValue, useSetAtom } from 'jotai';

function capitalize(difficulty: Difficulty): string {
  return difficulty[0].toUpperCase() + difficulty.slice(1);
}

export function DifficultyMenu() {
  const counts = useAtomValue(difficultyCountsAtom);
  const setDifficulty = useSetAtom(difficultyAtom);
  const setScreen = useSetAtom(screenAtom);

  useInput((_input, key) => {
    if (key.escape) {
      setScreen('menu');
    }
  });

  return (
    <CenteredColumn maxWidth={50} minWidth={30}>
      <Text color="cyanBright" bold>
        SELECT DIFFICULTY
      </Text>
      <Box marginTop={1} flexDirection="column">
        <Select<DifficultyChoice>
          items={[
            { key: 'all', label: 'All', value: 'all', hint: `(${counts.all})` },
            ...DIFFICULTIES.map((difficulty) => ({
              key: difficulty,
              label: capitalize(difficulty),
              value: difficulty,
              hint: `(${counts[difficulty]})`,
              disabled: counts[difficulty] === 0,
            })),
          ]}
          onSelect={(choice) => {
            setDifficulty(choice);
            setScreen('list');
          }}
        />
      </Box>
      <Box marginTop={2}>
        <KeyHints
          hints={[
            ['j/k ↑↓', 'navigate'],
            ['↵', 'select'],
            ['esc', 'back'],
            ['q', 'quit'],
          ]}
        />
      </Box>
    </CenteredColumn>
  );
}
