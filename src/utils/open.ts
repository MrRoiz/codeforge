import { spawn } from 'node:child_process';

const REPO_URL = 'https://github.com/MrRoiz/codeforge';

/** Open the project repository in the default browser. Best effort, never throws. */
export function openRepo(): void {
  try {
    const isWin = process.platform === 'win32';
    const command = isWin ? 'cmd' : process.platform === 'darwin' ? 'open' : 'xdg-open';
    const args = isWin ? ['/c', 'start', '', REPO_URL] : [REPO_URL];
    const child = spawn(command, args, { detached: true, stdio: 'ignore' });
    child.unref();
  } catch {
    // ignore — opening a browser is best effort
  }
}