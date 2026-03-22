'use client';

import React, { useState, FormEvent } from 'react';
import { signUpWithEmail } from '@/lib/supabase/auth';
import { AuthInput } from './AuthInput';
import { SocialLoginButtons } from './SocialLoginButtons';

interface SignupFormProps {
  onSwitchToLogin: () => void;
  onSuccess: () => void;
}

export function SignupForm({ onSwitchToLogin, onSuccess }: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await signUpWithEmail(email, password);
    setLoading(false);

    if (!result.success && result.error) {
      setError(result.error.message);
    } else {
      setEmailSent(true);
    }
  };

  if (emailSent) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-gold-800/30 border border-gold-600/30
          flex items-center justify-center">
          <svg className="w-8 h-8 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-display text-parchment-100 tracking-wide">
            Check Your Raven
          </h2>
          <p className="mt-2 text-sm text-parchment-400 font-body leading-relaxed">
            We&apos;ve sent a confirmation link to{' '}
            <span className="text-gold-400">{email}</span>.
            <br />
            Click the link to verify your account and begin your journey.
          </p>
        </div>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="btn-medieval w-full py-3 text-base"
        >
          Return to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-display text-parchment-100 tracking-wide">
          Forge Your Account
        </h2>
        <p className="mt-1 text-sm text-parchment-500 font-body">
          Create an account to save progress across devices
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
            or sign up with email
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
          placeholder="At least 8 characters"
          autoComplete="new-password"
          disabled={loading}
        />

        <AuthInput
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat your password"
          autoComplete="new-password"
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
              Creating account...
            </span>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      {/* Footer links */}
      <div className="text-center text-sm font-body text-parchment-600">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-gold-400 hover:text-gold-300 transition-colors"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
