'use client';

import React from 'react';

interface PointPoolProps {
  spent: number;
  total: number;
  remaining: number;
}

/**
 * Visual display of the point-buy pool showing spent/remaining points.
 * Uses a segmented bar with color coding.
 */
export function PointPool({ spent, total, remaining }: PointPoolProps) {
  const pct = Math.min(100, (spent / total) * 100);
  const isOverspent = remaining < 0;
  const isNearLimit = remaining <= 3 && remaining > 0;

  return (
    <div className="parchment-panel p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display text-sm uppercase tracking-wider text-parchment-400">
          Point Pool
        </h3>
        <div className="flex items-center gap-2">
          <span
            className={`font-display text-2xl font-bold tabular-nums ${
              isOverspent
                ? 'text-blood-500 glow-negative'
                : isNearLimit
                  ? 'text-gold-400'
                  : 'text-parchment-200'
            }`}
          >
            {remaining}
          </span>
          <span className="text-parchment-600 text-sm">/ {total}</span>
        </div>
      </div>

      {/* Pool bar */}
      <div className="relative w-full h-4 bg-shadow-800/60 rounded-full overflow-hidden border border-shadow-700/50">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-300 ease-out ${
            isOverspent
              ? 'bg-gradient-to-r from-blood-700 to-blood-500'
              : isNearLimit
                ? 'bg-gradient-to-r from-gold-700 to-gold-500'
                : 'bg-gradient-to-r from-parchment-700 to-parchment-500'
          }`}
          style={{ width: `${pct}%` }}
        />
        {/* Tick marks every 5 points */}
        {Array.from({ length: Math.floor(total / 5) }, (_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px bg-parchment-800/30"
            style={{ left: `${(((i + 1) * 5) / total) * 100}%` }}
          />
        ))}
      </div>

      <div className="flex justify-between mt-1.5 text-xs text-parchment-600">
        <span>{spent} spent</span>
        <span>
          {isOverspent ? (
            <span className="text-blood-400">Over by {Math.abs(remaining)}</span>
          ) : (
            `${remaining} remaining`
          )}
        </span>
      </div>
    </div>
  );
}
