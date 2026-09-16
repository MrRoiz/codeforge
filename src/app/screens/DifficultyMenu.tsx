import {
  type DifficultyChoice,
  difficultyAtom,
  difficultyCountsAtom,
  screenAtom,
} from '@app/store';
import { Select } from '@components/Select';
import { CenteredColumn, KeyHints } from '@components/ui';
import { Box, Text, useInput } from 'ink';
import { useAtomValue, useSetAtom } from 'jotai';

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
            {
              key: 'easy',
              label: 'Easy',
              value: 'easy',
              hint: `(${counts.easy})`,
              disabled: counts.easy === 0,
            },
            {
              key: 'medium',
              label: 'Medium',
              value: 'medium',
              hint: `(${counts.medium})`,
              disabled: counts.medium === 0,
            },
            {
              key: 'hard',
              label: 'Hard',
              value: 'hard',
              hint: `(${counts.hard})`,
              disabled: counts.hard === 0,
            },
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
