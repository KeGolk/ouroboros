/**
 * Auth Callback Route Handler
 *
 * Handles the OAuth redirect callback from Supabase Auth.
 * After a user signs in with Google/Discord (or confirms email),
 * Supabase redirects here with an authorization code that we
 * exchange for a session using the SSR-compatible server client.
 *
 * The session tokens are stored in HTTP-only cookies via @supabase/ssr,
 * making them available to Server Components and middleware.
 *
 * Flow:
 * 1. User clicks "Sign in with Google/Discord" or confirms email
 * 2. Supabase redirects to /auth/callback?code=xxx&next=/some-page
 * 3. This handler exchanges the code for a session
 * 4. Session cookies are set on the response
 * 5. User is redirected to the `next` URL (default: /)
 */

import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';
  const errorUrl = `${origin}/auth/login?error=auth_callback_failed`;

  // No authorization code — something went wrong
  if (!code) {
    console.error('[Auth Callback] No authorization code in URL');
    return NextResponse.redirect(errorUrl);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[Auth Callback] Supabase not configured');
    return NextResponse.redirect(`${origin}/?notice=offline-mode`);
  }

  // Create an SSR-compatible Supabase client that writes session
  // cookies to the response via Next.js cookies() API
  const cookieStore = await cookies();

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.delete({ name, ...options });
      },
    },
  });

  // Exchange the authorization code for a session.
  // This sets the auth cookies via the cookie handlers above.
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('[Auth Callback] Code exchange failed:', error.message);
    return NextResponse.redirect(
      `${origin}/auth/login?error=${encodeURIComponent(error.message)}`
    );
  }

  // Success — redirect to the intended destination
  // Ensure the redirect stays within our origin (prevent open redirect)
  const redirectUrl = next.startsWith('/') ? `${origin}${next}` : `${origin}/`;

  return NextResponse.redirect(redirectUrl);
}
