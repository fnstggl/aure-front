import { lazy, type ComponentType } from "react";

/**
 * Drop-in replacement for React.lazy that survives production deploys.
 *
 * Vite emits content-hashed chunk filenames (e.g. HowItWorks-Buxga25-.js).
 * Every deploy regenerates those hashes, and Netlify's atomic deploys stop
 * serving the previous build's files. A browser tab still running an older
 * build therefore holds references to chunk URLs that now 404, so the next
 * lazy navigation rejects with "Failed to fetch dynamically imported module"
 * (or a text/html MIME-type error from the SPA fallback).
 *
 * When that happens we force a single full reload, which fetches the current
 * index.html and its up-to-date hashed chunks — so the page recovers
 * automatically instead of sitting broken until the user manually refreshes.
 *
 * A sessionStorage guard ensures we only auto-reload once per failure, so a
 * genuinely offline/broken state cannot trigger an infinite reload loop.
 */
const RELOAD_GUARD_KEY = "aurelius:chunk-reload";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyWithReload<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
) {
  return lazy(async () => {
    try {
      const component = await factory();
      // Loaded fine — clear any guard left over from a previous recovery.
      window.sessionStorage.removeItem(RELOAD_GUARD_KEY);
      return component;
    } catch (error) {
      const alreadyReloaded =
        window.sessionStorage.getItem(RELOAD_GUARD_KEY) === "1";

      if (!alreadyReloaded) {
        window.sessionStorage.setItem(RELOAD_GUARD_KEY, "1");
        window.location.reload();
        // Keep the Suspense fallback on screen while the reload takes over.
        return new Promise<{ default: T }>(() => {});
      }

      // Still failing after a reload: the chunk is genuinely unavailable, so
      // surface the error instead of reloading forever.
      throw error;
    }
  });
}
