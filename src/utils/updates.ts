import { loadConfig } from '@utils/config';
import pkg from '../../package.json' with { type: 'json' };

const REGISTRY_URL = 'https://registry.npmjs.org/@mr_roiz%2Fcodeforge/latest';
const TIMEOUT_MS = 3000;

export interface UpdateInfo {
  current: string;
  latest: string;
}

/** Compare two semver strings numerically: <0, 0, >0. Handles x.y.z segments. */
function compareVersions(a: string, b: string): number {
  const pa = a.split('.').map((n) => Number(n) || 0);
  const pb = b.split('.').map((n) => Number(n) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const x = pa[i] ?? 0;
    const y = pb[i] ?? 0;
    if (x !== y) {
      return x - y;
    }
  }
  return 0;
}

/**
 * Compare the installed version (package.json) against the latest published on
 * npm. Silent and never throws — callers fire this without awaiting. Returns
 * null when opted out, offline, or already on the latest version.
 */
export async function checkForUpdates(): Promise<UpdateInfo | null> {
  if (loadConfig().updateCheck === false) {
    return null;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(REGISTRY_URL, { signal: controller.signal });
    if (!res.ok) {
      return null;
    }
    const data = (await res.json()) as { version?: string };
    if (!data.version) {
      return null;
    }
    if (compareVersions(data.version, pkg.version) <= 0) {
      return null;
    }
    return { current: pkg.version, latest: data.version };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
