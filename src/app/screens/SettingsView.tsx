import { TextInput } from '@components/TextInput';
import { KeyHints } from '@components/ui';
import { expandPath } from '@utils/config';
import { Box, Text } from 'ink';
import { useState } from 'react';

interface Props {
  currentDir: string;
  defaultDir: string;
  onSave: (dir: string) => void;
  onBack: () => void;
}

export function SettingsView({ currentDir, defaultDir, onSave, onBack }: Props) {
  const [draft, setDraft] = useState(currentDir);

  const submit = () => {
    const resolved = draft.trim() === '' ? defaultDir : expandPath(draft);
    onSave(resolved);
  };

  return (
    <Box flexDirection="column" paddingLeft={2} paddingRight={2}>
      <Text color="cyanBright" bold>
        ⚙ SETTINGS
      </Text>

      <Box marginTop={1} flexDirection="column" borderStyle="round" borderColor="cyan" paddingX={1}>
        <Text color="yellowBright" bold>
          EXERCISES DIRECTORY
        </Text>
        <Text dimColor>Where codeforge creates each exercise folder.</Text>
        <Box marginTop={1}>
          <TextInput
            value={draft}
            onChange={setDraft}
            onSubmit={submit}
            onCancel={onBack}
            placeholder={defaultDir}
          />
        </Box>
      </Box>

      <Box marginTop={1} flexDirection="column" paddingLeft={1}>
        <Text dimColor>current → {currentDir}</Text>
        <Text dimColor>default → {defaultDir}</Text>
      </Box>

      <Box marginTop={1} flexDirection="column">
        <Text dimColor>Tip: use ~ for your home directory. Leave empty to use the default.</Text>
        <Text dimColor>An absolute path is recommended so it works from any folder.</Text>
      </Box>

      <Box marginTop={1}>
        <KeyHints
          hints={[
            ['type', 'edit path'],
            ['←→', 'move cursor'],
            ['ctrl+u', 'clear'],
            ['↵', 'save'],
            ['esc', 'cancel'],
          ]}
        />
      </Box>
    </Box>
  );
}
