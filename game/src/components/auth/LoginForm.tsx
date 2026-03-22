'use client';

import React, { useState, FormEvent } from 'react';
import { signInWithEmail } from '@/lib/supabase/auth';
import { AuthInput } from './AuthInput';
import { SocialLoginButtons } from './SocialLoginButtons';

interface LoginFormProps {
  onSwitchToSignup: () => void;
  onSwitchToReset: () => void;
  onSuccess: () => void;
}

export function LoginForm({ onSwitchToSignup, onSwitchToReset, onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    const result = await signInWithEmail(email, password);
    setLoading(false);

    if (!result.success && result.error) {
      setError(result.error.message);
    } else {
      onSuccess();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-display text-parchment-100 tracking-wide">
          Return to the Realm
        </h2>
        <p className="mt-1 text-sm text-parchment-500 font-body">
          Sign in to sync your progress across devices
        </p>
      </div>

      {/* Social login buttons */}
      <SocialLoginButtons onError={setError} disabled={loading} />

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-parchment-800/30" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-shadow-900 text-parchment-600 font-body">
            or sign in with email
          </span>
        </div>
      </div>

      {/* Email/password form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          autoComplete="email"
          disabled={loading}
        />

        <AuthInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          disabled={loading}
        />

        {error && (
          <div className="p-3 rounded-lg bg-blood-900/30 border border-blood-700/30">
            <p className="text-sm text-blood-300 font-body">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-medieval-primary w-full py-3 text-base"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Footer links */}
      <div className="space-y-2 text-center text-sm font-body">
        <button
          type="button"
          onClick={onSwitchToReset}
          className="text-parchment-500 hover:text-gold-400 transition-colors"
        >
          Forgot your password?
        </button>
        <div className="text-parchment-600">
          No account yet?{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-gold-400 hover:text-gold-300 transition-colors"
          >
            Create one
          </button>
        </div>
      </div>
    </div>
  );
}
