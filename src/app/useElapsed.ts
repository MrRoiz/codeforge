import { useEffect, useState } from 'react';

/** Milliseconds elapsed since `since`, ticking once per second. 0 when not started. */
export function useElapsed(since: number | null): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (since === null) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [since]);

  return since === null ? 0 : now - since;
}
