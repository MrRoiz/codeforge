// Alternate-screen helpers so the TUI takes over the full terminal and
// restores whatever was on screen when it exits (like vim / htop).
let active = false;

export function enterFullScreen(): void {
  if (!process.stdout.isTTY || active) {
    return;
  }
  active = true;
  process.stdout.write('\x1b[?1049h'); // enter alternate screen buffer
  process.stdout.write('\x1b[2J\x1b[H'); // clear + move cursor home
}

export function exitFullScreen(): void {
  if (!process.stdout.isTTY || !active) {
    return;
  }
  active = false;
  process.stdout.write('\x1b[?1049l'); // restore the main screen buffer
}
