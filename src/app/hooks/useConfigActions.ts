import fs from 'node:fs/promises';
import { configAtom, errorAtom, statusAtom } from '@app/store';
import { type Config, saveConfig } from '@utils/config';
import { useAtom, useSetAtom } from 'jotai';

/** Persists config changes and mirrors the outcome into the app-level atoms. */
export function useConfigActions() {
  const [config, setConfig] = useAtom(configAtom);
  const setStatus = useSetAtom(statusAtom);
  const setError = useSetAtom(errorAtom);

  const saveDir = async (dir: string) => {
    try {
      await fs.mkdir(dir, { recursive: true });
      const next: Config = { ...config, exercisesDir: dir };
      saveConfig(next);
      setConfig(next);
      setStatus(`Exercises will be created in ${dir}`);
      setError(null);
    } catch (err) {
      setError(`Could not use that directory: ${String(err)}`);
    }
  };

  const clearStatus = () => setStatus(undefined);

  return { saveDir, clearStatus };
}
