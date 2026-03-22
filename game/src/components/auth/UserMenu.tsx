'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/lib/supabase/auth';
import { AuthModal } from './AuthModal';

/**
 * UserMenu — Shows sign-in button when logged out, user avatar/menu when logged in.
 * Designed to be placed in the game's header/nav bar.
 */
export function UserMenu() {
  const { user, loading, isOffline } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSignOut = async () => {
    setMenuOpen(false);
    await signOut();
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-shadow-800 animate-pulse" />
    );
  }

  // Offline — no auth available
  if (isOffline) {
    return (
      <div className="text-xs text-parchment-600 font-body px-3 py-1.5
        border border-parchment-800/20 rounded-lg bg-shadow-900/40">
        Offline Mode
      </div>
    );
  }

  // Logged out — show sign-in button
  if (!user) {
    return (
      <>
        <button
          type="button"
          onClick={() => setAuthModalOpen(true)}
          className="btn-medieval text-xs px-3 py-1.5"
        >
          Sign In
        </button>
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />
      </>
    );
  }

  // Logged in — show user menu
  const displayName = user.user_metadata?.full_name
    || user.email?.split('@')[0]
    || 'Adventurer';
  const avatarUrl = user.user_metadata?.avatar_url;
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 px-2 py-1 rounded-lg
          hover:bg-shadow-800/60 transition-colors"
        aria-label="User menu"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-8 h-8 rounded-full border border-parchment-800/40"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gold-800/40 border border-gold-600/30
            flex items-center justify-center text-gold-300 font-display text-sm">
            {initials}
          </div>
        )}
        <span className="hidden sm:block text-sm text-parchment-300 font-body max-w-[120px] truncate">
          {displayName}
        </span>
        <svg className={`w-3 h-3 text-parchment-500 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 parchment-panel p-1 z-50">
          <div className="px-3 py-2 border-b border-parchment-800/20">
            <p className="text-xs text-parchment-500 font-body truncate">
              {user.email}
            </p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full text-left px-3 py-2 text-sm font-body
              text-parchment-300 hover:bg-shadow-800/60 hover:text-blood-300
              rounded transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
