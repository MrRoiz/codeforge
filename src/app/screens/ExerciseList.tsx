import { Box, Text, useInput } from 'ink';
import { useState } from 'react';
import { Select } from '@components/Select';
import { DifficultyBadge, KeyHints } from '@components/ui';
import { validationLabel, type Exercise } from '@exercises/types';

interface Props {
  exercises: Exercise[];
  onSelect: (exercise: Exercise) => void;
  onBack: () => void;
}

const LABEL_WIDTH = 37;

function padLabel(name: string): string {
  const short = name.length > LABEL_WIDTH - 1 ? `${name.slice(0, LABEL_WIDTH - 2)}…` : name;
  return short.padEnd(LABEL_WIDTH);
}

export function ExerciseList({ exercises, onSelect, onBack }: Props) {
  const [highlighted, setHighlighted] = useState<Exercise>(exercises[0]);

  useInput((_input, key) => {
    if (key.escape) onBack();
  });

  return (
    <Box flexDirection="column" paddingLeft={2}>
      <Text color="cyanBright" bold>
        {`SELECT EXERCISE (${exercises.length})`}
      </Text>
      <Box marginTop={1}>
        <Box flexDirection="column" width={60} flexShrink={0}>
          <Select<Exercise>
            items={exercises.map((e) => ({
              key: e.id,
              label: padLabel(e.name),
              value: e,
              hint: `${e.difficulty} · ${e.time}`,
            }))}
            onSelect={onSelect}
            onHighlight={(e) => setHighlighted(e)}
          />
        </Box>
        <Box flexDirection="column" marginLeft={2} flexGrow={1}>
          <Box borderStyle="round" borderColor="gray" paddingX={1} flexDirection="column">
            <Text bold color="whiteBright">
              {highlighted.name}
            </Text>
            <Box marginTop={1}>
              <DifficultyBadge difficulty={highlighted.difficulty} />
              <Text dimColor>{`  ${highlighted.type}`}</Text>
            </Box>
            <Box marginTop={1}>
              <Text dimColor>source: {validationLabel(highlighted)}</Text>
            </Box>
            <Box marginTop={1}>
              <Text wrap="wrap" dimColor>
                {highlighted.description}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box marginTop={1}>
        <KeyHints hints={[['↑↓', 'navigate'], ['↵', 'open'], ['esc', 'back'], ['q', 'quit']]} />
      </Box>
    </Box>
  );
}