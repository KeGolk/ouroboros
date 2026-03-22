/**
 * Next.js Middleware — Session Management & Route Protection
 *
 * This middleware runs on every matched request to:
 * 1. Refresh the Supabase auth session (token rotation)
 * 2. Protect routes that require authentication
 * 3. Redirect authenticated users away from auth-only pages
 *
 * The game is fully playable without an account (localStorage saves),
 * so most routes are public. Only account-specific features like
 * cloud saves, achievements, and leaderboards require auth.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

/**
 * Routes that require authentication.
 * Users without a session will be redirected to /auth/login.
 */
const PROTECTED_ROUTES = [
  '/account',
  '/account/settings',
  '/cloud-saves',
  '/leaderboard/submit',
];

/**
 * Routes that should redirect authenticated users elsewhere.
 * E.g., if already logged in, redirect away from login page.
 */
const AUTH_ONLY_ROUTES = [
  '/auth/login',
  '/auth/register',
];

/**
 * Check if a pathname matches any of the given route prefixes.
 */
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );
}

export async function middleware(request: NextRequest) {
  // Step 1: Always refresh the session (handles token rotation)
  const response = await updateSession(request);

  const { pathname } = request.nextUrl;

  // Step 2: Check if Supabase is even configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // Supabase not configured — allow all routes (offline mode)
    // But redirect protected routes to home since they can't function
    if (matchesRoute(pathname, PROTECTED_ROUTES)) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('notice', 'offline-mode');
      return NextResponse.redirect(url);
    }
    return response;
  }

  // Step 3: For protected and auth-only routes, check session status
  const isProtected = matchesRoute(pathname, PROTECTED_ROUTES);
  const isAuthOnly = matchesRoute(pathname, AUTH_ONLY_ROUTES);

  if (isProtected || isAuthOnly) {
    // We check for the Supabase auth cookie to determine login status.
    // The actual session validation was already done by updateSession().
    const hasAuthCookie = request.cookies.getAll().some(
      (cookie) =>
        cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token')
    );

    if (isProtected && !hasAuthCookie) {
      // Not authenticated → redirect to login with return URL
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    if (isAuthOnly && hasAuthCookie) {
      // Already authenticated → redirect to account or home
      const redirect = request.nextUrl.searchParams.get('redirect');
      const url = request.nextUrl.clone();
      url.pathname = redirect || '/account';
      url.searchParams.delete('redirect');
      return NextResponse.redirect(url);
    }
  }

  return response;
}

/**
 * Configure which routes the middleware should run on.
 * Excludes static files, images, and Next.js internals.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public folder assets (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)',
  ],
};
