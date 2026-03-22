'use client';

import React from 'react';
import type { StatBlock, StatId } from '@/lib/types/stats';
import { STAT_META } from '@/lib/types/stats';

interface NarrativeCheck {
  id: string;
  label: string;
  description: string;
  stat: StatId;
  threshold: number;
  icon: string;
}

/** All narrative capability checks and their thresholds */
const NARRATIVE_CHECKS: NarrativeCheck[] = [
  {
    id: 'intimidate',
    label: 'Intimidation',
    description: 'Force compliance through physical threat',
    stat: 'STR',
    threshold: 13,
    icon: '💪',
  },
  {
    id: 'reflexes',
    label: 'Quick Reflexes',
    description: 'React swiftly to danger and ambushes',
    stat: 'DEX',
    threshold: 13,
    icon: '🏃',
  },
  {
    id: 'lore',
    label: 'Lore Knowledge',
    description: 'Recall ancient texts and secret histories',
    stat: 'INT',
    threshold: 13,
    icon: '📖',
  },
  {
    id: 'insight',
    label: 'Insight',
    description: 'Detect lies and see through deception',
    stat: 'WIS',
    threshold: 13,
    icon: '👁️',
  },
  {
    id: 'endure',
    label: 'Endurance',
    description: 'Withstand torture, poison, and hardship',
    stat: 'CON',
    threshold: 13,
    icon: '🏔️',
  },
  {
    id: 'persuade',
    label: 'Persuasion',
    description: 'Convince others through force of personality',
    stat: 'CHA',
    threshold: 13,
    icon: '🗣️',
  },
  {
    id: 'rally',
    label: 'Rally Support',
    description: 'Mobilize political allies and factions',
    stat: 'Influence',
    threshold: 13,
    icon: '📯',
  },
  {
    id: 'scheme',
    label: 'Schemes',
    description: 'Devise and execute complex plots',
    stat: 'Cunning',
    threshold: 13,
    icon: '🕸️',
  },
  {
    id: 'negotiate',
    label: 'Negotiation',
    description: 'Broker deals and forge alliances',
    stat: 'Diplomacy',
    threshold: 13,
    icon: '🤝',
  },
];

interface NarrativeCapabilitiesProps {
  stats: StatBlock;
}

/**
 * Shows which narrative options will be available based on current stats.
 * Checks that are met are highlighted, unmet ones are dimmed with progress indication.
 */
export function NarrativeCapabilities({ stats }: NarrativeCapabilitiesProps) {
  const available = NARRATIVE_CHECKS.filter(c => stats[c.stat] >= c.threshold);
  const unavailable = NARRATIVE_CHECKS.filter(c => stats[c.stat] < c.threshold);

  return (
    <div className="parchment-panel p-4">
      <h3 className="font-display text-sm uppercase tracking-wider text-parchment-400 mb-1">
        Narrative Capabilities
      </h3>
      <p className="text-[10px] text-parchment-700 mb-3">
        Options unlocked in dialogue and story based on your stats
      </p>

      {/* Available capabilities */}
      {available.length > 0 && (
        <div className="mb-3">
          <div className="text-[10px] uppercase tracking-widest text-green-600/80 mb-1.5 px-1">
            Unlocked ({available.length})
          </div>
          <div className="grid grid-cols-1 gap-1">
            {available.map(check => (
              <NarrativeCheckRow key={check.id} check={check} statValue={stats[check.stat]} unlocked />
            ))}
          </div>
        </div>
      )}

      {/* Unavailable capabilities */}
      {unavailable.length > 0 && (
        <div>
          <div className="text-[10px] uppercase tracking-widest text-parchment-700 mb-1.5 px-1">
            Locked ({unavailable.length})
          </div>
          <div className="grid grid-cols-1 gap-1">
            {unavailable.map(check => (
              <NarrativeCheckRow key={check.id} check={check} statValue={stats[check.stat]} unlocked={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NarrativeCheckRow({
  check,
  statValue,
  unlocked,
}: {
  check: NarrativeCheck;
  statValue: number;
  unlocked: boolean;
}) {
  const deficit = check.threshold - statValue;
  const statMeta = STAT_META[check.stat];

  return (
    <div
      className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-all duration-200 ${
        unlocked
          ? 'bg-green-900/20 border border-green-800/30'
          : 'bg-shadow-800/30 border border-shadow-700/20 opacity-60'
      }`}
    >
      <span className="text-base flex-shrink-0">{check.icon}</span>
      <div className="flex-1 min-w-0">
        <div className={`text-xs font-display ${unlocked ? 'text-green-300' : 'text-parchment-500'}`}>
          {check.label}
        </div>
        <div className="text-[10px] text-parchment-700 truncate">
          {check.description}
        </div>
      </div>
      <div className="flex-shrink-0 text-right">
        {unlocked ? (
          <span className="text-green-400 text-xs font-display">✓</span>
        ) : (
          <span className="text-blood-400/80 text-[10px] font-mono">
            {statMeta.abbreviation} +{deficit}
          </span>
        )}
      </div>
    </div>
  );
}
