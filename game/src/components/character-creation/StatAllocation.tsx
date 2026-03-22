'use client';

import React, { useState } from 'react';
import type { StatId, StatBlock } from '@/lib/types/stats';
import { ALL_STATS, CLASSIC_STATS, POLITICAL_STATS, STAT_META, CREATION_STAT_MIN, CREATION_STAT_MAX } from '@/lib/types/stats';
import { calcModifier, formatModifier, getStatLabel } from '@/lib/engine/stats';
import { useStatAllocation, StatPreset } from '@/hooks/useStatAllocation';
import { StatBar } from '@/components/ui/StatBar';
import { PointPool } from '@/components/ui/PointPool';
import { DerivedStatsPanel } from '@/components/ui/DerivedStatsPanel';
import { NarrativeCapabilities } from '@/components/ui/NarrativeCapabilities';

interface StatAllocationProps {
  /** Called when the player confirms their stat allocation */
  onConfirm?: (stats: StatBlock) => void;
  /** Called when the player goes back */
  onBack?: () => void;
  /** Initial stats (for editing existing character) */
  initialStats?: StatBlock;
}

/**
 * Complete character stat allocation UI with point-buy interface.
 *
 * Features:
 * - Point-buy system with variable costs at higher stat values
 * - Real-time derived stat computation
 * - Narrative capability unlock indicators
 * - Stat presets for quick builds
 * - Responsive layout for mobile and desktop
 * - Dark gritty GoT aesthetic
 */
export function StatAllocation({ onConfirm, onBack, initialStats }: StatAllocationProps) {
  const {
    stats,
    computed,
    pointsRemaining,
    pointsSpent,
    totalPool,
    isValid,
    errors,
    increaseStat,
    decreaseStat,
    canIncrease,
    canDecrease,
    costToIncrease,
    refundFromDecrease,
    applyPreset,
    resetStats,
    presets,
  } = useStatAllocation(initialStats);

  const [selectedStat, setSelectedStat] = useState<StatId | null>(null);
  const [showPresets, setShowPresets] = useState(false);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="font-display text-2xl md:text-3xl text-parchment-200 mb-1">
          Forge Your Character
        </h2>
        <p className="text-parchment-600 text-sm">
          Distribute your attribute points wisely. Higher values cost more to achieve.
        </p>
      </div>

      {/* Point Pool - always visible at top */}
      <div className="mb-6">
        <PointPool spent={pointsSpent} total={totalPool} remaining={pointsRemaining} />
      </div>

      {/* Preset Quick-Select */}
      <div className="mb-6">
        <button
          onClick={() => setShowPresets(!showPresets)}
          className="btn-medieval text-xs w-full md:w-auto"
        >
          {showPresets ? 'Hide Presets' : '⚡ Quick Build Presets'}
        </button>

        {showPresets && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-3">
            {presets.map(preset => (
              <PresetCard
                key={preset.id}
                preset={preset}
                onSelect={() => {
                  applyPreset(preset);
                  setShowPresets(false);
                }}
              />
            ))}
            <button
              onClick={resetStats}
              className="parchment-panel p-3 text-left hover:border-blood-600/40 transition-colors"
            >
              <div className="font-display text-sm text-blood-400">↺ Reset All</div>
              <div className="text-[10px] text-parchment-700">Return all stats to default</div>
            </button>
          </div>
        )}
      </div>

      {/* Main Content: Stats + Derived/Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Stat Allocation (takes 2 cols on large screens) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Classic Stats */}
          <div className="parchment-panel p-4">
            <h3 className="font-display text-sm uppercase tracking-wider text-parchment-400 mb-3 pb-2 border-b border-parchment-800/30">
              Physical & Mental Attributes
            </h3>
            <div className="space-y-3">
              {CLASSIC_STATS.map(statId => (
                <StatRow
                  key={statId}
                  statId={statId}
                  value={stats[statId]}
                  modifier={calcModifier(statId, stats[statId])}
                  canInc={canIncrease(statId)}
                  canDec={canDecrease(statId)}
                  costInc={costToIncrease(statId)}
                  refundDec={refundFromDecrease(statId)}
                  onIncrease={() => increaseStat(statId)}
                  onDecrease={() => decreaseStat(statId)}
                  isSelected={selectedStat === statId}
                  onSelect={() => setSelectedStat(selectedStat === statId ? null : statId)}
                />
              ))}
            </div>
          </div>

          {/* Political Stats */}
          <div className="parchment-panel p-4">
            <h3 className="font-display text-sm uppercase tracking-wider text-parchment-400 mb-3 pb-2 border-b border-parchment-800/30">
              Political Attributes
            </h3>
            <div className="space-y-3">
              {POLITICAL_STATS.map(statId => (
                <StatRow
                  key={statId}
                  statId={statId}
                  value={stats[statId]}
                  modifier={calcModifier(statId, stats[statId])}
                  canInc={canIncrease(statId)}
                  canDec={canDecrease(statId)}
                  costInc={costToIncrease(statId)}
                  refundDec={refundFromDecrease(statId)}
                  onIncrease={() => increaseStat(statId)}
                  onDecrease={() => decreaseStat(statId)}
                  isSelected={selectedStat === statId}
                  onSelect={() => setSelectedStat(selectedStat === statId ? null : statId)}
                />
              ))}
            </div>
          </div>

          {/* Selected Stat Detail (expanded info) */}
          {selectedStat && (
            <StatDetailPanel statId={selectedStat} value={stats[selectedStat]} />
          )}
        </div>

        {/* Right Column: Derived Stats + Narrative */}
        <div className="space-y-4">
          <DerivedStatsPanel derived={computed.derived} />
          <NarrativeCapabilities stats={stats} />
        </div>
      </div>

      {/* Validation Errors */}
      {errors.length > 0 && (
        <div className="mt-4 parchment-panel p-3 border-blood-700/50">
          <div className="text-blood-400 text-xs font-display uppercase tracking-wider mb-1">
            Invalid Allocation
          </div>
          {errors.map((err, i) => (
            <div key={i} className="text-blood-300 text-xs">• {err}</div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-between">
        {onBack && (
          <button onClick={onBack} className="btn-medieval">
            ← Back
          </button>
        )}
        <div className="flex gap-3 sm:ml-auto">
          <button onClick={resetStats} className="btn-medieval">
            Reset
          </button>
          {onConfirm && (
            <button
              onClick={() => onConfirm(stats)}
              disabled={!isValid}
              className="btn-medieval-primary"
            >
              Confirm Stats →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

interface StatRowProps {
  statId: StatId;
  value: number;
  modifier: number;
  canInc: boolean;
  canDec: boolean;
  costInc: number;
  refundDec: number;
  onIncrease: () => void;
  onDecrease: () => void;
  isSelected: boolean;
  onSelect: () => void;
}

function StatRow({
  statId,
  value,
  modifier,
  canInc,
  canDec,
  costInc,
  refundDec,
  onIncrease,
  onDecrease,
  isSelected,
  onSelect,
}: StatRowProps) {
  const meta = STAT_META[statId];
  const modStr = formatModifier(modifier);
  const rating = getStatLabel(value);
  const isPositive = modifier > 0;
  const isNegative = modifier < 0;

  return (
    <div
      className={`rounded-lg p-3 transition-all duration-200 ${
        isSelected
          ? 'bg-shadow-800/60 border border-parchment-700/40 ring-1 ring-gold-600/20'
          : 'hover:bg-shadow-800/30'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Stat Icon + Name */}
        <button
          onClick={onSelect}
          className="flex items-center gap-2 min-w-[120px] md:min-w-[160px] text-left group"
          title={meta.description}
        >
          <div
            className="w-8 h-8 rounded flex items-center justify-center text-sm flex-shrink-0 border border-shadow-700/50"
            style={{ backgroundColor: `${meta.color}22`, borderColor: `${meta.color}44` }}
          >
            {getStatIcon(statId)}
          </div>
          <div className="min-w-0">
            <div className="font-display text-sm text-parchment-200 group-hover:text-parchment-100 transition-colors">
              {meta.name}
            </div>
            <div className="text-[10px] text-parchment-700">
              {meta.abbreviation} · {rating}
            </div>
          </div>
        </button>

        {/* Decrease Button */}
        <button
          onClick={onDecrease}
          disabled={!canDec}
          className="btn-stat"
          title={canDec ? `Decrease (refund ${refundDec} pt${refundDec !== 1 ? 's' : ''})` : `Minimum ${CREATION_STAT_MIN}`}
          aria-label={`Decrease ${meta.name}`}
        >
          −
        </button>

        {/* Value Display */}
        <div className="flex flex-col items-center min-w-[48px]">
          <span className="font-display text-xl font-bold tabular-nums text-parchment-100">
            {value}
          </span>
          <span
            className={`text-xs font-mono tabular-nums ${
              isPositive ? 'text-green-400 glow-positive' : isNegative ? 'text-blood-400 glow-negative' : 'text-parchment-600'
            }`}
          >
            {modStr}
          </span>
        </div>

        {/* Increase Button */}
        <button
          onClick={onIncrease}
          disabled={!canInc}
          className="btn-stat"
          title={canInc ? `Increase (costs ${costInc} pt${costInc !== 1 ? 's' : ''})` : value >= CREATION_STAT_MAX ? `Maximum ${CREATION_STAT_MAX}` : 'Not enough points'}
          aria-label={`Increase ${meta.name}`}
        >
          +
        </button>

        {/* Cost Indicator */}
        <div className="hidden sm:block min-w-[60px] text-right">
          {canInc && costInc > 0 && (
            <span className="text-[10px] text-parchment-700">
              Cost: <span className={costInc >= 3 ? 'text-gold-400' : 'text-parchment-500'}>{costInc}</span>
            </span>
          )}
        </div>

        {/* Stat Bar */}
        <div className="hidden md:block flex-1 max-w-[200px]">
          <StatBar
            value={value}
            min={CREATION_STAT_MIN}
            max={CREATION_STAT_MAX}
            color={meta.color}
          />
        </div>
      </div>

      {/* Mobile stat bar (below the row) */}
      <div className="md:hidden mt-2">
        <StatBar
          value={value}
          min={CREATION_STAT_MIN}
          max={CREATION_STAT_MAX}
          color={meta.color}
        />
      </div>
    </div>
  );
}

function PresetCard({ preset, onSelect }: { preset: StatPreset; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className="parchment-panel p-3 text-left hover:border-gold-600/40 hover:shadow-gold-glow transition-all duration-200 group"
    >
      <div className="font-display text-sm text-gold-300 group-hover:text-gold-200 mb-0.5">
        {preset.label}
      </div>
      <div className="text-[10px] text-parchment-700 group-hover:text-parchment-500 mb-2">
        {preset.description}
      </div>
      <div className="flex flex-wrap gap-1">
        {ALL_STATS.map(statId => {
          const val = preset.stats[statId];
          const meta = STAT_META[statId];
          const isHigh = val >= 14;
          const isLow = val <= 8;
          return (
            <span
              key={statId}
              className={`text-[9px] font-mono px-1 py-0.5 rounded ${
                isHigh
                  ? 'bg-green-900/30 text-green-400'
                  : isLow
                    ? 'bg-blood-900/30 text-blood-400'
                    : 'bg-shadow-800/40 text-parchment-600'
              }`}
            >
              {meta.abbreviation}:{val}
            </span>
          );
        })}
      </div>
    </button>
  );
}

function StatDetailPanel({ statId, value }: { statId: StatId; value: number }) {
  const meta = STAT_META[statId];
  const modifier = calcModifier(statId, value);

  return (
    <div
      className="parchment-panel p-4 transition-all duration-300"
      style={{ borderColor: `${meta.color}33` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg border"
          style={{ backgroundColor: `${meta.color}22`, borderColor: `${meta.color}44` }}
        >
          {getStatIcon(statId)}
        </div>
        <div>
          <h4 className="font-display text-lg" style={{ color: meta.color }}>
            {meta.name}
          </h4>
          <div className="text-xs text-parchment-600">
            {meta.category === 'political' ? 'Political Attribute' : 'Classic Attribute'}
          </div>
        </div>
        <div className="ml-auto text-right">
          <div className="font-display text-2xl font-bold text-parchment-100">{value}</div>
          <div
            className={`text-sm font-mono ${
              modifier > 0 ? 'text-green-400' : modifier < 0 ? 'text-blood-400' : 'text-parchment-600'
            }`}
          >
            Modifier: {formatModifier(modifier)}
          </div>
        </div>
      </div>

      <p className="text-sm text-parchment-400 mb-3">
        {meta.description}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-blood-500/80 mb-1">
            Combat Impact
          </div>
          <ul className="space-y-0.5">
            {getCombatEffects(statId, value).map((effect, i) => (
              <li key={i} className="text-xs text-parchment-500 flex items-start gap-1">
                <span className="text-blood-600 mt-0.5">⚔</span>
                {effect}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-green-600/80 mb-1">
            Narrative Impact
          </div>
          <ul className="space-y-0.5">
            {getNarrativeEffects(statId, value).map((effect, i) => (
              <li key={i} className="text-xs text-parchment-500 flex items-start gap-1">
                <span className="text-green-600 mt-0.5">◈</span>
                {effect}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStatIcon(statId: StatId): string {
  const icons: Record<StatId, string> = {
    STR: '⚔️',
    DEX: '🏹',
    INT: '📚',
    WIS: '👁️',
    CON: '🛡️',
    CHA: '👑',
    Influence: '🏛️',
    Cunning: '🗡️',
    Diplomacy: '📜',
  };
  return icons[statId] ?? '●';
}

function getCombatEffects(statId: StatId, value: number): string[] {
  const effects: Record<StatId, string[]> = {
    STR: [
      `Melee damage bonus: ${formatModifier(calcModifier(statId, value))}`,
      `Carry capacity: ${value * 15} lbs`,
      value >= 14 ? 'Heavy weapon proficiency unlocked' : 'Heavy weapons require 14+',
    ],
    DEX: [
      `AC bonus: ${formatModifier(calcModifier(statId, value))}`,
      `Initiative: ${formatModifier(calcModifier(statId, value))}`,
      `Ranged attack bonus: ${formatModifier(calcModifier(statId, value))}`,
    ],
    INT: [
      `Arcane knowledge checks: ${formatModifier(calcModifier(statId, value))}`,
      value >= 14 ? 'Can identify magical items' : 'Need 14+ to identify magical items',
      `Puzzle solving advantage at 13+`,
    ],
    WIS: [
      `Perception checks: ${formatModifier(calcModifier(statId, value))}`,
      `Healing effectiveness: ${formatModifier(calcModifier(statId, value))}`,
      value >= 13 ? 'Can detect hidden traps' : 'Need 13+ to detect traps',
    ],
    CON: [
      `HP bonus per level: ${formatModifier(calcModifier(statId, value))}`,
      `Poison resistance: ${formatModifier(calcModifier(statId, value))}`,
      value >= 14 ? 'Status effect resistance active' : 'Need 14+ for status resistance',
    ],
    CHA: [
      `Persuasion power bonus: ${formatModifier(calcModifier(statId, value))}`,
      `Ally morale boost in combat`,
      value >= 13 ? 'Can attempt enemy surrender' : 'Need 13+ for surrender attempts',
    ],
    Influence: [
      `Political clout: ${formatModifier(calcModifier(statId, value))}`,
      `Faction reputation gains boosted`,
      value >= 13 ? 'Can mobilize political allies' : 'Need 13+ to rally support',
    ],
    Cunning: [
      `Scheme resistance: ${formatModifier(calcModifier(statId, value))}`,
      `Espionage success rate improved`,
      value >= 13 ? 'Can detect enemy schemes' : 'Need 13+ to detect schemes',
    ],
    Diplomacy: [
      `Negotiation power: ${formatModifier(calcModifier(statId, value))}`,
      `Alliance stability improved`,
      value >= 13 ? 'Can broker peace treaties' : 'Need 13+ for treaties',
    ],
  };
  return effects[statId] ?? [];
}

function getNarrativeEffects(statId: StatId, value: number): string[] {
  const effects: Record<StatId, string[]> = {
    STR: [
      value >= 13 ? '✓ Intimidation dialogue options' : '✗ Need 13+ for intimidation',
      value >= 12 ? '✓ Break obstacles' : '✗ Need 12+ to break obstacles',
      value >= 15 ? '✓ Feats of legendary strength' : '○ Need 15+ for legendary feats',
    ],
    DEX: [
      value >= 13 ? '✓ Quick-time escape sequences' : '✗ Need 13+ for escapes',
      value >= 12 ? '✓ Ambush avoidance' : '✗ Need 12+ to avoid ambushes',
      value >= 15 ? '✓ Acrobatic infiltration' : '○ Need 15+ for acrobatics',
    ],
    INT: [
      value >= 13 ? '✓ Lore knowledge dialogue' : '✗ Need 13+ for lore options',
      value >= 12 ? '✓ Decipher coded messages' : '✗ Need 12+ for codebreaking',
      value >= 15 ? '✓ Uncover ancient prophecies' : '○ Need 15+ for prophecies',
    ],
    WIS: [
      value >= 13 ? '✓ Detect lies in dialogue' : '✗ Need 13+ to detect lies',
      value >= 12 ? '✓ Sense danger' : '✗ Need 12+ to sense danger',
      value >= 15 ? '✓ Prophetic visions' : '○ Need 15+ for visions',
    ],
    CON: [
      value >= 13 ? '✓ Endure torture scenes' : '✗ Need 13+ for endurance',
      value >= 12 ? '✓ Resist poison' : '✗ Need 12+ to resist poison',
      value >= 15 ? '✓ Survive mortal wounds' : '○ Need 15+ for survival feats',
    ],
    CHA: [
      value >= 13 ? '✓ Persuasion dialogue' : '✗ Need 13+ for persuasion',
      value >= 12 ? '✓ Rally followers' : '✗ Need 12+ to rally',
      value >= 15 ? '✓ Inspire legendary loyalty' : '○ Need 15+ for legendary loyalty',
    ],
    Influence: [
      value >= 13 ? '✓ Mobilize faction support' : '✗ Need 13+ for factions',
      value >= 12 ? '✓ Access court events' : '✗ Need 12+ for court access',
      value >= 15 ? '✓ Kingmaker choices' : '○ Need 15+ for kingmaker paths',
    ],
    Cunning: [
      value >= 13 ? '✓ Execute complex schemes' : '✗ Need 13+ for schemes',
      value >= 12 ? '✓ Blackmail options' : '✗ Need 12+ for blackmail',
      value >= 15 ? '✓ Mastermind plot twists' : '○ Need 15+ for master plots',
    ],
    Diplomacy: [
      value >= 13 ? '✓ Negotiate alliances' : '✗ Need 13+ for negotiations',
      value >= 12 ? '✓ Trade deal bonuses' : '✗ Need 12+ for trade deals',
      value >= 15 ? '✓ Forge impossible peace' : '○ Need 15+ for impossible peace',
    ],
  };
  return effects[statId] ?? [];
}
