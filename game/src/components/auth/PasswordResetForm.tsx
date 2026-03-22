'use client';

import React, { useState, FormEvent } from 'react';
import { resetPassword } from '@/lib/supabase/auth';
import { AuthInput } from './AuthInput';

interface PasswordResetFormProps {
  onSwitchToLogin: () => void;
}

export function PasswordResetForm({ onSwitchToLogin }: PasswordResetFormProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    const result = await resetPassword(email);
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
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-display text-parchment-100 tracking-wide">
            Raven Dispatched
          </h2>
          <p className="mt-2 text-sm text-parchment-400 font-body leading-relaxed">
            If an account exists for{' '}
            <span className="text-gold-400">{email}</span>,
            you&apos;ll receive a password reset link shortly.
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
          Reset Your Seal
        </h2>
        <p className="mt-1 text-sm text-parchment-500 font-body">
          Enter your email and we&apos;ll send a link to reset your password
        </p>
      </div>

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
              Sending...
            </span>
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>

      <div className="text-center text-sm font-body">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-parchment-500 hover:text-gold-400 transition-colors"
        >
          &larr; Back to Sign In
        </button>
      </div>
    </div>
  );
}
