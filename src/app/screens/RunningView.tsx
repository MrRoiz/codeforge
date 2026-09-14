import { Box, Text } from 'ink';
import { useEffect, useState } from 'react';

const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export function RunningView({ name }: { name: string }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f + 1) % FRAMES.length), 80);
    return () => clearInterval(id);
  }, []);

  return (
    <Box flexDirection="column" paddingLeft={2}>
      <Text color="cyanBright" bold>
        {FRAMES[frame]} FORGING {name.toUpperCase()}...
      </Text>
      <Box marginTop={1}>
        <Text dimColor>running the test suite against your solution</Text>
      </Box>
    </Box>
  );
}