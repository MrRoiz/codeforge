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

  useEffect(() => {
    const onResize = () => setSize(read());
    stdout.on('resize', onResize);
    return () => {
      stdout.off('resize', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stdout]);

  return size;
}
