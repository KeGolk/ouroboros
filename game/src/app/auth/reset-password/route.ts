/**
 * Password Reset Callback Route
 *
 * Handles the redirect after a user clicks the password reset link in their email.
 * The reset link contains a code that we exchange for a session, then redirect
 * to the account settings page where the user can enter a new password.
 */

import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  // If there's a code, exchange it for a session
  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
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

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        // Session established — redirect to account settings with reset mode
        return NextResponse.redirect(`${origin}/account/settings?mode=reset-password`);
      }

      console.error('[Reset Password] Code exchange failed:', error.message);
    }
  }

  // Fallback: redirect to login with a message
  return NextResponse.redirect(`${origin}/auth/login?notice=password-reset-expired`);
}
