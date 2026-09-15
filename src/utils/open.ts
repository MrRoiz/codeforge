import { spawn, spawnSync } from 'node:child_process';

const REPO_URL = 'https://github.com/MrRoiz/codeforge';

// Editors probed on PATH when neither $EDITOR nor $VISUAL is set. GUI editors
// first, then terminal ones, in rough order of preference.
const EDITOR_CANDIDATES = [
  'code',
  'cursor',
  'zed',
  'windsurf',
  'subl',
  'nvim',
  'vim',
  'nano',
  'hx',
  'emacs',
  'micro',
];

// Editors that need the controlling terminal, so they must run in the
// foreground while Ink hands over the TTY (see suspendTerminal). GUI editors
// are launched detached instead.
const TERMINAL_EDITORS = new Set([
  'vi',
  'vim',
  'nvim',
  'neovim',
  'nano',
  'pico',
  'micro',
  'hx',
  'helix',
  'kak',
  'kakoune',
  'joe',
  'emacs',
]);

export interface EditorCommand {
  command: string;
  args: string[];
}

function baseName(command: string): string {
  const base = command.split(/[\\/]/).pop() ?? command;
  return base.replace(/\.(exe|cmd|bat)$/i, '').toLowerCase();
}

/** Whether the editor is a TUI that needs the terminal handed over to it. */
export function isTerminalEditor(command: string): boolean {
  return TERMINAL_EDITORS.has(baseName(command));
}

/** Hand a target to the OS default handler. Best effort, never throws. */
function openWithSystem(target: string): void {
  try {
    const isWin = process.platform === 'win32';
    const command = isWin ? 'cmd' : process.platform === 'darwin' ? 'open' : 'xdg-open';
    const args = isWin ? ['/c', 'start', '', target] : [target];
    const child = spawn(command, args, { detached: true, stdio: 'ignore' });
    child.on('error', () => {});
    child.unref();
  } catch {
    // ignore — opening externally is best effort
  }
}

/** Open the project repository in the default browser. Best effort, never throws. */
export function openRepo(): void {
  openWithSystem(REPO_URL);
}

/** Whether a command is available on PATH. */
function isOnPath(command: string): boolean {
  const finder = process.platform === 'win32' ? 'where' : 'which';
  try {
    return spawnSync(finder, [command], { stdio: 'ignore' }).status === 0;
  } catch {
    return false;
  }
}

/**
 * Resolve the editor command, in order: `$EDITOR`, `$VISUAL`, then a probe of
 * common editors on PATH. Returns the command plus any leading args (so e.g.
 * `EDITOR="code --wait"` works).
 */
export function resolveEditor(): EditorCommand | null {
  for (const env of [process.env.EDITOR, process.env.VISUAL]) {
    const raw = env?.trim();
    if (!raw) continue;
    const [command, ...args] = raw.split(/\s+/);
    if (command) return { command, args };
  }
  const found = EDITOR_CANDIDATES.find(isOnPath);
  return found ? { command: found, args: [] } : null;
}

/**
 * Launch the editor without a terminal (GUI editors): detached and ignored.
 * Falls back to the OS default handler when no editor could be resolved.
 * Best effort, never throws.
 */
export function launchDetached(editor: EditorCommand | null, file: string): void {
  if (!editor) {
    openWithSystem(file);
    return;
  }
  try {
    const child = spawn(editor.command, [...editor.args, file], { detached: true, stdio: 'ignore' });
    child.on('error', () => {});
    child.unref();
  } catch {
    openWithSystem(file);
  }
}

/**
 * Run the editor in the foreground, sharing this process's terminal, and
 * resolve when it exits. Call this from inside `suspendTerminal()`.
 */
export function launchInForeground(editor: EditorCommand, file: string): Promise<void> {
  return new Promise((resolve) => {
    try {
      const child = spawn(editor.command, [...editor.args, file], { stdio: 'inherit' });
      child.on('error', () => resolve());
      child.on('exit', () => resolve());
    } catch {
      resolve();
    }
  });
}

/**
 * Discard input that was buffered while the editor had the terminal.
 *
 * Ink pauses its input reader during `suspendTerminal()`, but Node keeps
 * reading the shared TTY into stdin's buffer. A keystroke that arrives before
 * the editor owns the terminal (e.g. a repeated `o`) is then replayed when Ink
 * resumes, which immediately reopens the editor. Drop the backlog first.
 */
export function drainStdin(): void {
  if (!process.stdin.isTTY) return;
  try {
    while (process.stdin.read() !== null) {
      // discard
    }
  } catch {
    // best effort
  }
}
