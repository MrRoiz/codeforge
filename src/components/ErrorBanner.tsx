import { errorAtom } from '@app/state';
import { Box, Text } from 'ink';
import { useAtomValue } from 'jotai';

/** The app-level error banner, shown directly under the logo. */
export function ErrorBanner() {
  const error = useAtomValue(errorAtom);
  if (!error) {
    return null;
  }
  return (
    <Box paddingX={2}>
      <Text color="redBright">Error: {error}</Text>
    </Box>
  );
}
