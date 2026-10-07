import pkg from '../../../package.json' with { type: 'json' };

const VERSION_FLAGS = new Set(['--version', '-v', '-V']);

/** The string `--version` prints, e.g. `v2.0.1`. */
export const VERSION = `v${pkg.version}`;

/**
 * True when argv asks for the CLI version. Checked before the TTY guard in the
 * entry point so `codeforge --version` also works when stdin isn't a TTY
 * (pipes, scripts, CI).
 */
export function isVersionRequest(argv: readonly string[]): boolean {
  return argv.some((arg) => VERSION_FLAGS.has(arg));
}
