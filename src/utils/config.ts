import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export interface Config {
  exercisesDir?: string;
  /** set to false to disable the version-update check */
  updateCheck?: boolean;
}

// respects XDG on Linux, %APPDATA% on Windows, ~/.config elsewhere
function configDir(): string {
  const xdg = process.env.XDG_CONFIG_HOME;
  let base = path.join(os.homedir(), '.config');
  if (xdg?.trim()) {
    base = xdg;
  } else if (process.platform === 'win32') {
    base = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
  }
  return path.join(base, 'codeforge');
}

export function configPath(): string {
  return path.join(configDir(), 'config.json');
}

export function loadConfig(): Config {
  try {
    const parsed = JSON.parse(fs.readFileSync(configPath(), 'utf-8'));
    return parsed && typeof parsed === 'object' ? (parsed as Config) : {};
  } catch {
    return {};
  }
}

export function saveConfig(config: Config): void {
  fs.mkdirSync(configDir(), { recursive: true });
  fs.writeFileSync(configPath(), `${JSON.stringify(config, null, 2)}\n`);
}

/** Expand `~` and make the path absolute. */
export function expandPath(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    return '';
  }
  const expanded =
    trimmed === '~' || trimmed.startsWith('~/')
      ? path.join(os.homedir(), trimmed.slice(1))
      : trimmed;
  return path.resolve(expanded);
}

/** codeforge's home folder — holds the exercises dir and the progress state. */
export function codeforgeHome(): string {
  return path.join(os.homedir(), '.codeforge');
}

/** Where exercises are written by default (when nothing is configured). */
export function defaultExercisesDir(): string {
  return path.join(codeforgeHome(), 'exercises');
}

/**
 * Resolve the effective exercises directory.
 * Priority: CODEFORGE_DIR env > saved config > default.
 */
export function resolveExercisesDir(config: Config): string {
  const fromEnv = process.env.CODEFORGE_DIR ? expandPath(process.env.CODEFORGE_DIR) : '';
  if (fromEnv) {
    return fromEnv;
  }
  if (config.exercisesDir) {
    return expandPath(config.exercisesDir);
  }
  return defaultExercisesDir();
}
