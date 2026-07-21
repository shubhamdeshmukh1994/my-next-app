import { createClient } from "@supabase/supabase-js";

// Stateless client for public, cacheable reads -- no cookies/session
// involved, so it's safe to call from inside a `'use cache'` scope.
// lib/supabase/server.ts's client reads cookies() (a Dynamic API) and
// will throw if used there; reach for this one instead whenever the
// query doesn't depend on the current user's session.
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
