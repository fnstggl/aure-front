-- Tighten the public insert policy so it validates submissions server-side,
-- mirroring the client-side zod schema in src/pages/Contact.tsx. This also
-- removes the overly permissive `WITH CHECK (true)` flagged by the Supabase
-- security advisor (rls_policy_always_true).
DROP POLICY IF EXISTS "Anyone can submit pilot requests" ON public.pilot_requests;

CREATE POLICY "Anyone can submit pilot requests"
ON public.pilot_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(btrim(name)) BETWEEN 1 AND 100
  AND char_length(btrim(organization)) BETWEEN 1 AND 200
  AND char_length(btrim(role)) BETWEEN 1 AND 100
  AND char_length(btrim(compute_environment)) BETWEEN 1 AND 500
  AND char_length(email) <= 255
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
);

-- Note: no SELECT/UPDATE/DELETE policies are defined, so submissions are not
-- readable via the public/anon key. Admin access is via the dashboard or the
-- service role key.
