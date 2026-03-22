/**
 * Sign Out Route Handler
 *
 * Server-side sign out that clears session cookies properly.
 * Called via POST to prevent CSRF via link prefetching.
 */

import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const { origin } = new URL(request.url);

  const supabase = await createSupabaseServerClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  return NextResponse.redirect(`${origin}/`, {
    status: 302,
  });
}
