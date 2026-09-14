import { Box, Text } from 'ink';
import { Select } from '@components/Select';
import { KeyHints } from '@components/ui';

export type MenuAction = 'train' | 'random' | 'settings' | 'quit';

export function MainMenu({
  onSelect,
  exercisesDir,
  status,
}: {
  onSelect: (action: MenuAction) => void;
  exercisesDir: string;
  status?: string;
}) {
  return (
    <Box flexDirection="column">
      <Box flexDirection="column" paddingLeft={2}>
        <Select<MenuAction>
          items={[
            { label: '⚔  Train', value: 'train', hint: 'choose difficulty & exercise' },
            { label: '🎲 Random Challenge', value: 'random', hint: 'surprise me' },
            { label: '⚙  Settings', value: 'settings', hint: 'where exercises are created' },
            { label: '🚪 Quit', value: 'quit' },
          ]}
          onSelect={onSelect}
        />
      </Box>
      <Box marginTop={1} flexDirection="column" paddingLeft={2}>
        <Text dimColor>exercises → {exercisesDir}</Text>
        {status ? <Text color="greenBright">{status}</Text> : null}
      </Box>
      <Box marginTop={1} paddingLeft={2}>
        <KeyHints hints={[['↑↓', 'navigate'], ['↵', 'select'], ['q', 'quit']]} />
      </Box>
    </Box>
  );
}
