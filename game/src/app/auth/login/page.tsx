'use client';

import React, { Suspense, useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { PasswordResetForm } from '@/components/auth/PasswordResetForm';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';

type AuthView = 'login' | 'signup' | 'reset';

function AuthLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [view, setView] = useState<AuthView>('login');

  const errorParam = searchParams.get('error');
  const noticeParam = searchParams.get('notice');

  const handleSuccess = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Game branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-display text-parchment-100 tracking-widest">
            Crowns of Ash
          </h1>
          <p className="mt-2 text-sm text-parchment-600 font-body italic">
            A tale of treachery and thrones
          </p>
        </div>

        {/* Status notices */}
        {errorParam && (
          <div className="mb-4 p-3 rounded-lg bg-blood-900/30 border border-blood-700/30">
            <p className="text-sm text-blood-300 font-body">{decodeURIComponent(errorParam)}</p>
          </div>
        )}

        {noticeParam === 'password-reset-expired' && (
          <div className="mb-4 p-3 rounded-lg bg-gold-900/20 border border-gold-700/30">
            <p className="text-sm text-gold-300 font-body">
              Your password reset link has expired. Please request a new one.
            </p>
          </div>
        )}

        {!isSupabaseConfigured && (
          <div className="mb-4 p-3 rounded-lg bg-gold-900/20 border border-gold-700/30">
            <p className="text-sm text-gold-300 font-body">
              Cloud sync is not configured. The game is fully playable offline with local saves.
            </p>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="mt-2 text-xs text-gold-400 hover:text-gold-300 transition-colors underline"
            >
              Continue without account &rarr;
            </button>
          </div>
        )}

        {/* Auth panel */}
        <div className="parchment-panel p-6 sm:p-8">
          {view === 'login' && (
            <LoginForm
              onSwitchToSignup={() => setView('signup')}
              onSwitchToReset={() => setView('reset')}
              onSuccess={handleSuccess}
            />
          )}

          {view === 'signup' && (
            <SignupForm
              onSwitchToLogin={() => setView('login')}
              onSuccess={handleSuccess}
            />
          )}

          {view === 'reset' && (
            <PasswordResetForm
              onSwitchToLogin={() => setView('login')}
            />
          )}
        </div>

        {/* Skip auth */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="text-sm text-parchment-600 hover:text-parchment-400 font-body transition-colors"
          >
            Play without an account
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AuthLoginPage() {
  return (
    <Suspense fallback={null}>
      <AuthLoginContent />
    </Suspense>
  );
}
