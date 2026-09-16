import { useExerciseActions } from '@app/hooks/useExerciseActions';
import { useTerminalSize } from '@app/hooks/useTerminalSize';
import { exercisesDirAtom, screenAtom, statusAtom } from '@app/store';
import { ProgressOverview } from '@components/ProgressOverview';
import { Select } from '@components/Select';
import { CenteredColumn, KeyHints } from '@components/ui';
import { getRandomExercise } from '@exercises';
import { pickWelcome } from '@utils/welcome';
import { Box, Text, useApp } from 'ink';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';

export type MenuAction = 'train' | 'random' | 'settings' | 'quit';

// below this many columns the progress card stacks under the menu
const STACK_BELOW = 76;

export function MainMenu() {
  const { exit } = useApp();
  const { columns } = useTerminalSize();
  const exercisesDir = useAtomValue(exercisesDirAtom);
  const [status, setStatus] = useAtom(statusAtom);
  const setScreen = useSetAtom(screenAtom);
  const { openExercise } = useExerciseActions();
  const [welcome] = useState(() => pickWelcome());

  const stacked = columns < STACK_BELOW;

  const onSelect = (action: MenuAction) => {
    if (action === 'quit') {
      exit();
    }
    if (action === 'train') {
      setScreen('difficulty');
    }
    if (action === 'settings') {
      setStatus(undefined);
      setScreen('settings');
    }
    if (action === 'random') {
      void openExercise(getRandomExercise());
    }
  };

  return (
    <CenteredColumn maxWidth={78}>
      <Text color="cyanBright" wrap="wrap">
        {welcome}
      </Text>

      <Box flexDirection={stacked ? 'column' : 'row'} marginTop={2}>
        <Box flexDirection="column" flexShrink={0}>
          <Select<MenuAction>
            items={[
              {
                key: 'train',
                label: '⚔  Train',
                value: 'train',
                hint: 'choose difficulty & exercise',
              },
              { key: 'random', label: '🎲 Random Challenge', value: 'random', hint: 'surprise me' },
              {
                key: 'settings',
                label: '⚙  Settings',
                value: 'settings',
                hint: 'where exercises are created',
              },
              { key: 'quit', label: '🚪 Quit', value: 'quit' },
            ]}
            onSelect={onSelect}
          />
        </Box>
        {stacked ? null : <Box flexGrow={1} />}
        <Box marginTop={stacked ? 2 : 0}>
          <ProgressOverview />
        </Box>
      </Box>

      <Box marginTop={2} flexDirection="column">
        <Text dimColor>exercises → {exercisesDir}</Text>
        {status ? <Text color="greenBright">{status}</Text> : null}
        <Box marginTop={1}>
          <KeyHints
            hints={[
              ['j/k ↑↓', 'navigate'],
              ['↵', 'select'],
              ['p', 'github'],
              ['q', 'quit'],
            ]}
          />
        </Box>
      </Box>
    </CenteredColumn>
  );
}
