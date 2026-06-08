import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Resilient wrapper around the generated Supabase client. The generated
 * `client.ts` calls createClient() at import time, which throws when the
 * VITE_SUPABASE_* env vars are absent — that crashes the whole (lazy) Contact
 * route. This wrapper only constructs the client when configured, so the page
 * always renders and submission fails gracefully when it isn't.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && key);

export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(url as string, key as string, {
      auth: { storage: localStorage, persistSession: true, autoRefreshToken: true },
    })
  : null;
