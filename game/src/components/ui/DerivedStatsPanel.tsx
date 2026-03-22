'use client';

import React from 'react';
import type { DerivedStats } from '@/lib/types/stats';

interface DerivedStatsPanelProps {
  derived: DerivedStats;
}

interface DerivedStatRowProps {
  label: string;
  value: number | string;
  icon: string;
  description: string;
  color?: string;
}

function DerivedStatRow({ label, value, icon, description, color = '#a9b2c3' }: DerivedStatRowProps) {
  return (
    <div className="group flex items-center justify-between py-2 px-3 rounded hover:bg-shadow-800/40 transition-colors">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-lg flex-shrink-0" role="img" aria-label={label}>
          {icon}
        </span>
        <div className="min-w-0">
          <div className="text-xs font-display uppercase tracking-wider text-parchment-500">
            {label}
          </div>
          <div className="text-[10px] text-parchment-700 group-hover:text-parchment-500 transition-colors truncate">
            {description}
          </div>
        </div>
      </div>
      <span
        className="font-display text-lg font-bold tabular-nums ml-3 flex-shrink-0"
        style={{ color }}
      >
        {value}
      </span>
    </div>
  );
}

/**
 * Panel showing derived combat and narrative stats computed from primary attributes.
 * Updates live as the player adjusts their stats.
 */
export function DerivedStatsPanel({ derived }: DerivedStatsPanelProps) {
  return (
    <div className="parchment-panel p-4">
      <h3 className="font-display text-sm uppercase tracking-wider text-parchment-400 mb-3 pb-2 border-b border-parchment-800/30">
        Derived Statistics
      </h3>

      <div className="space-y-0.5">
        {/* Combat Stats */}
        <div className="mb-2">
          <div className="text-[10px] uppercase tracking-widest text-parchment-700 px-3 py-1">
            Combat
          </div>
          <DerivedStatRow
            label="Max HP"
            value={derived.maxHp}
            icon="❤️"
            description="Total health points"
            color="#e74c3c"
          />
          <DerivedStatRow
            label="Armor Class"
            value={derived.armorClass}
            icon="🛡️"
            description="Defense against attacks"
            color="#95a5a6"
          />
          <DerivedStatRow
            label="Initiative"
            value={derived.initiative >= 0 ? `+${derived.initiative}` : `${derived.initiative}`}
            icon="⚡"
            description="Turn order bonus"
            color="#f39c12"
          />
          <DerivedStatRow
            label="Carry Capacity"
            value={`${derived.carryCapacity} lbs`}
            icon="🎒"
            description="Maximum weight"
            color="#8B4513"
          />
        </div>

        {/* Political/Narrative Stats */}
        <div>
          <div className="text-[10px] uppercase tracking-widest text-parchment-700 px-3 py-1">
            Political
          </div>
          <DerivedStatRow
            label="Persuasion"
            value={derived.persuasionPower >= 0 ? `+${derived.persuasionPower}` : `${derived.persuasionPower}`}
            icon="🗣️"
            description="CHA + Diplomacy modifiers"
            color="#9932CC"
          />
          <DerivedStatRow
            label="Scheme Defense"
            value={derived.schemeResistance >= 0 ? `+${derived.schemeResistance}` : `${derived.schemeResistance}`}
            icon="🔮"
            description="WIS + Cunning modifiers"
            color="#2F4F4F"
          />
          <DerivedStatRow
            label="Political Clout"
            value={derived.politicalClout >= 0 ? `+${derived.politicalClout}` : `${derived.politicalClout}`}
            icon="👑"
            description="Influence + CHA modifiers"
            color="#C0A000"
          />
        </div>
      </div>
    </div>
  );
}
