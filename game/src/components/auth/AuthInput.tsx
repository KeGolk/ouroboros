'use client';

import React from 'react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function AuthInput({ label, error, id, ...props }: AuthInputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={inputId}
        className="block text-sm font-body text-parchment-300"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`
          w-full px-4 py-3 rounded-lg font-body text-sm
          bg-shadow-900/80 border text-parchment-100
          placeholder:text-parchment-700
          focus:outline-none focus:ring-2 focus:ring-gold-600/40 focus:border-gold-600/50
          transition-all duration-200
          ${error
            ? 'border-blood-500/60 focus:ring-blood-500/30'
            : 'border-parchment-800/30 hover:border-parchment-700/40'
          }
        `}
        {...props}
      />
      {error && (
        <p className="text-xs text-blood-400 font-body mt-1">{error}</p>
      )}
    </div>
  );
}
