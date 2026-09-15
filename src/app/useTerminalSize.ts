import { useStdout } from 'ink';
import { useEffect, useState } from 'react';

export interface TerminalSize {
  columns: number;
  rows: number;
}

export function useTerminalSize(): TerminalSize {
  const { stdout } = useStdout();
  const read = (): TerminalSize => ({
    columns: stdout.columns || 80,
    rows: stdout.rows || 24,
  });
  const [size, setSize] = useState<TerminalSize>(read);

  // biome-ignore lint/correctness/useExhaustiveDependencies: `read` only depends on `stdout`
  useEffect(() => {
    const onResize = () => setSize(read());
    stdout.on('resize', onResize);
    return () => {
      stdout.off('resize', onResize);
    };
  }, [stdout]);

  return size;
}
