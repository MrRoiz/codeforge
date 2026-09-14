import pkg from '../../package.json' with { type: 'json' };
import { loadConfig, saveConfig } from '@utils/config';

const REGISTRY_URL = 'https://registry.npmjs.org/@mr_roiz%2Fcodeforge/latest';
const CHECK_INTERVAL_MS = 1000 * 60 * 60 * 24;
const TIMEOUT_MS = 3000;

export interface UpdateInfo {
  current: string;
  latest: string;
}

/**
 * Check the npm registry for a newer release. Silent and never throws — callers
 * fire this without awaiting. The result is cached in the config, so a known
 * update keeps showing on every run between checks. Returns null when opted out,
 * throttled with no cached update, offline, or already on the latest version.
 */
export async function checkForUpdates(): Promise<UpdateInfo | null> {
  const config = loadConfig();
  if (config.updateCheck === false) return null;
  const now = Date.now();

  // Only skip the network when we already know the latest version; a stale
  // lastUpdateCheck without a cached result must never hide a real update.
  const hasCached = config.lastKnownLatest !== undefined;
  if (
    hasCached &&
    config.lastUpdateCheck !== undefined &&
    now - config.lastUpdateCheck < CHECK_INTERVAL_MS
  ) {
    if (config.lastKnownLatest !== pkg.version) {
      return { current: pkg.version, latest: config.lastKnownLatest! };
    }
    return null;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(REGISTRY_URL, { signal: controller.signal });
    if (!res.ok) return null;
    const data = (await res.json()) as { version?: string };
    if (!data.version) return null;
    saveConfig({ ...config, lastUpdateCheck: now, lastKnownLatest: data.version });
    if (data.version === pkg.version) return null;
    return { current: pkg.version, latest: data.version };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}