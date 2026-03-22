'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { PasswordResetForm } from './PasswordResetForm';
import { isSupabaseConfigured } from '@/lib/supabase/auth';

type AuthView = 'login' | 'signup' | 'reset';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialView?: AuthView;
}

export function AuthModal({ isOpen, onClose, onSuccess, initialView = 'login' }: AuthModalProps) {
  const [view, setView] = useState<AuthView>(initialView);

  // Reset view when modal opens
  useEffect(() => {
    if (isOpen) {
      setView(initialView);
    }
  }, [isOpen, initialView]);

  // Close on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  const handleSuccess = useCallback(() => {
    onSuccess?.();
    onClose();
  }, [onSuccess, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md parchment-panel p-6 sm:p-8
          animate-in fade-in slide-in-from-bottom-4 duration-300"
        role="dialog"
        aria-modal="true"
        aria-label="Authentication"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-lg
            text-parchment-600 hover:text-parchment-300 hover:bg-shadow-800/60
            transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Offline notice */}
        {!isSupabaseConfigured && (
          <div className="mb-4 p-3 rounded-lg bg-gold-900/20 border border-gold-700/30">
            <p className="text-xs text-gold-300 font-body">
              Cloud sync is not configured. The game is fully playable offline
              with local saves.
            </p>
          </div>
        )}

        {/* Auth forms */}
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
    </div>
  );
}
