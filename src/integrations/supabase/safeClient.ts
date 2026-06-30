import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Lazily-constructed, resilient Supabase client.
 *
 * Two problems this solves:
 *  1. The generated `client.ts` calls createClient() at import time, which
 *     throws when the VITE_SUPABASE_* env vars are absent — that would crash
 *     the Contact route. Here the client is only built when configured, so the
 *     page always renders and submission fails gracefully when it isn't.
 *  2. The Supabase SDK is ~70 KB gzipped. Importing it at module scope pulls it
 *     into the Contact route's initial chunk and onto the first-paint path.
 *     Instead we dynamically import() it on first use (form submit), so it ships
 *     as a separate chunk that is fetched only when someone actually submits.
 *
 * The defaults below point at the project's public Supabase endpoint. The URL
 * and publishable (anon) key are safe to ship in the client bundle — every
 * table is protected by row-level security, so the key only grants the access
 * that RLS policies allow (here: inserting validated pilot requests). Setting
 * VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY overrides these.
 *
 * NOTE: `import type { … }` above is erased at build time, so it does NOT pull
 * the SDK into this module's chunk — only the dynamic import() below loads it.
 */
const DEFAULT_SUPABASE_URL = "https://buacamcuqxtizcnovtrq.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_pLAC3bcWM2Jo-ejNBS2wrQ_pcGMClMB";

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || DEFAULT_SUPABASE_URL;
const key = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) || DEFAULT_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(url && key);

let cached: SupabaseClient<Database> | null = null;

/**
 * Returns the Supabase client, importing the SDK on first call. Resolves to
 * null when the project isn't configured (callers should handle that path).
 */
export async function getSupabaseClient(): Promise<SupabaseClient<Database> | null> {
  if (!isSupabaseConfigured) return null;
  if (cached) return cached;
  const { createClient } = await import("@supabase/supabase-js");
  cached = createClient<Database>(url as string, key as string, {
    auth: { storage: localStorage, persistSession: true, autoRefreshToken: true },
  });
  return cached;
}
