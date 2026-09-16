import { exerciseAtom } from '@app/store';
import { Box, Text } from 'ink';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';

const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export function RunningView() {
  const exercise = useAtomValue(exerciseAtom);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f + 1) % FRAMES.length), 80);
    return () => clearInterval(id);
  }, []);

  if (!exercise) {
    return null;
  }

  return (
    <Box flexDirection="column" paddingLeft={2}>
      <Text color="cyanBright" bold>
        {FRAMES[frame]} FORGING {exercise.name.toUpperCase()}...
      </Text>
      <Box marginTop={1}>
        <Text dimColor>running the test suite against your solution</Text>
      </Box>
    </Box>
  );
}
