/**
 * AutosaveIndicator — Shows a brief toast when autosave triggers.
 *
 * Appears in the corner of the screen with a subtle animation,
 * styled to match the dark medieval parchment aesthetic.
 */

'use client';

import React from 'react';
import type { AutosaveStatus } from '../hooks/useAutosave';

interface AutosaveIndicatorProps {
  status: AutosaveStatus;
  /** Position on screen */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export function AutosaveIndicator({
  status,
  position = 'top-right',
}: AutosaveIndicatorProps) {
  if (!status.justSaved) return null;

  const positionClasses: Record<string, string> = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <div
      className={`
        fixed ${positionClasses[position]} z-40
        flex items-center gap-2 px-3 py-2
        bg-shadow-900/90 border border-parchment-800/30 rounded-lg
        text-parchment-400 text-xs font-display
        animate-in fade-in slide-in-from-top-2 duration-300
        pointer-events-none select-none
      `}
      role="status"
      aria-live="polite"
    >
      {/* Spinning save icon */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-gold-500 animate-spin"
        style={{ animationDuration: '1.5s' }}
      >
        <path d="M23 4v6h-6" />
        <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
      </svg>

      <span className="text-parchment-300">
        Saved
      </span>

      {status.lastSaveLabel && (
        <>
          <span className="text-parchment-700">·</span>
          <span className="text-parchment-500 italic">
            {status.lastSaveLabel}
          </span>
        </>
      )}
    </div>
  );
}

export default AutosaveIndicator;
