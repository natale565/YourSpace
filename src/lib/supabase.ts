import { createBrowserClient } from '@supabase/ssr';

// Creates a Supabase client for use in the browser ('use client' components).
//
// How it works:
// - The URL and anon key come from .env. The NEXT_PUBLIC_ prefix means Next.js
//   exposes them to the browser — that's safe because the anon key is public
//   by design. Real security comes from Row Level Security (RLS) policies
//   on the database tables, not from hiding this key.
// - createBrowserClient stores the user's session (JWT tokens) in cookies,
//   so the server (see src/proxy.js) can read the same session. That's why
//   we use @supabase/ssr instead of the plain supabase-js client.
// - Every query made with this client is checked against RLS policies using
//   the logged-in user's identity (auth.uid() in SQL).
export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
}
