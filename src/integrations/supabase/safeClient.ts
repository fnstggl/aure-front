import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Resilient wrapper around the generated Supabase client. The generated
 * `client.ts` calls createClient() at import time, which throws when the
 * VITE_SUPABASE_* env vars are absent — that crashes the whole (lazy) Contact
 * route. This wrapper only constructs the client when configured, so the page
 * always renders and submission fails gracefully when it isn't.
 *
 * The defaults below point at the project's public Supabase endpoint. The URL
 * and publishable (anon) key are safe to ship in the client bundle — every
 * table is protected by row-level security, so the key only grants the access
 * that RLS policies allow (here: inserting validated pilot requests). Setting
 * VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY overrides these for local
 * development or alternate environments.
 */
const DEFAULT_SUPABASE_URL = "https://buacamcuqxtizcnovtrq.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_pLAC3bcWM2Jo-ejNBS2wrQ_pcGMClMB";

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || DEFAULT_SUPABASE_URL;
const key = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) || DEFAULT_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(url && key);

export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(url as string, key as string, {
      auth: { storage: localStorage, persistSession: true, autoRefreshToken: true },
    })
  : null;
