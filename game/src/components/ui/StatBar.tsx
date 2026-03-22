'use client';

import React from 'react';
import { CREATION_STAT_MIN, CREATION_STAT_MAX } from '@/lib/types/stats';

interface StatBarProps {
  value: number;
  min?: number;
  max?: number;
  color: string;
  showThresholds?: boolean;
  /** Threshold at which narrative capabilities unlock */
  narrativeThreshold?: number;
}

/**
 * A horizontal bar showing stat value relative to min/max range.
 * Includes visual threshold marker for narrative check unlocks.
 */
export function StatBar({
  value,
  min = CREATION_STAT_MIN,
  max = CREATION_STAT_MAX,
  color,
  showThresholds = true,
  narrativeThreshold = 12,
}: StatBarProps) {
  const range = max - min;
  const pct = Math.max(0, Math.min(100, ((value - min) / range) * 100));
  const thresholdPct = ((narrativeThreshold - min) / range) * 100;
  const meetsThreshold = value >= narrativeThreshold;

  return (
    <div className="relative w-full h-3 bg-shadow-800/60 rounded-full overflow-hidden border border-shadow-700/50">
      {/* Background fill */}
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all duration-300 ease-out"
        style={{
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}99, ${color})`,
          boxShadow: value >= 14 ? `0 0 8px ${color}66` : 'none',
        }}
      />
      {/* Narrative threshold marker */}
      {showThresholds && (
        <div
          className="absolute top-0 bottom-0 w-0.5 transition-opacity duration-300"
          style={{
            left: `${thresholdPct}%`,
            backgroundColor: meetsThreshold ? '#27ae60' : '#e74c3c88',
          }}
          title={`Narrative check threshold: ${narrativeThreshold}`}
        />
      )}
      {/* Segment markers for visual feedback */}
      {Array.from({ length: range - 1 }, (_, i) => (
        <div
          key={i}
          className="absolute top-0 bottom-0 w-px bg-shadow-600/20"
          style={{ left: `${((i + 1) / range) * 100}%` }}
        />
      ))}
    </div>
  );
}
