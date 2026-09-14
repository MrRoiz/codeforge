import { Box } from 'ink';
import type { ReactNode } from 'react';
import { Logo } from '@components/Logo';
import { useTerminalSize } from '@app/useTerminalSize';

// Single source of truth for the app frame: full terminal size, the CODEFORGE
// logo, and one consistent vertical offset for every screen's content.
export function Layout({ children }: { children: ReactNode }) {
  const { columns, rows } = useTerminalSize();

  return (
    <Box flexDirection="column" width={columns} height={rows} paddingY={1}>
      <Logo />
      <Box flexDirection="column" flexGrow={1} flexShrink={1} minHeight={0} marginTop={3}>
        {children}
      </Box>
    </Box>
  );
}
