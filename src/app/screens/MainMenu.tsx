import { useExerciseActions } from '@app/hooks/useExerciseActions';
import { exercisesDirAtom, screenAtom, statusAtom } from '@app/state';
import { Select } from '@components/Select';
import { KeyHints } from '@components/ui';
import { getRandomExercise } from '@exercises';
import { Box, Text, useApp } from 'ink';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

export type MenuAction = 'train' | 'random' | 'settings' | 'quit';

export function MainMenu() {
  const { exit } = useApp();
  const exercisesDir = useAtomValue(exercisesDirAtom);
  const [status, setStatus] = useAtom(statusAtom);
  const setScreen = useSetAtom(screenAtom);
  const { openExercise } = useExerciseActions();

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
    <Box flexDirection="column">
      <Box flexDirection="column" paddingLeft={2}>
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
      <Box marginTop={1} flexDirection="column" paddingLeft={2}>
        <Text dimColor>exercises → {exercisesDir}</Text>
        {status ? <Text color="greenBright">{status}</Text> : null}
      </Box>
      <Box marginTop={1} paddingLeft={2}>
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
  );
}
