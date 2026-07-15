import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

// Runs on the server before every request (except the paths excluded in
// `config.matcher` below). Its one job: keep the user's Supabase session fresh.
//
// Why this is needed:
// - Supabase sessions use short-lived access tokens plus a refresh token,
//   both stored in cookies.
// - If the access token has expired, `supabase.auth.getUser()` below refreshes
//   it automatically. The `setAll` cookie handler then writes the new tokens
//   onto BOTH the request (so code later in this request sees them) and the
//   response (so the browser stores them for future requests).
// - Without this, users would get silently logged out when their token
//   expires, even though their refresh token was still valid.
export async function proxy(request) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // A server-side Supabase client that reads/writes auth cookies directly
  // from this request/response pair (there's no browser here to do it).
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        // How the client reads the current session
        getAll() {
          return request.cookies.getAll()
        },
        // How the client persists refreshed tokens
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This call is what actually triggers the token refresh when needed.
  await supabase.auth.getUser()

  return supabaseResponse
}

export const config = {
  // Run on every route EXCEPT static assets and images (no auth needed there).
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
