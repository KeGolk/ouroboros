'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { MinorEncounter, MinorEncounterResult } from '@/types/combat';
import type { StatBlock, StatName } from '@/types/stats';

// ─── Animation Phases ────────────────────────────────────────────────

type EncounterPhase =
  | 'intro'        // Show scenario description
  | 'stat_display' // Reveal relevant stats
  | 'rolling'      // Animate the check roll
  | 'result'       // Show success/failure outcome
  | 'narrative';   // Display outcome narrative + branch choices

// ─── Stat Display Metadata ──────────────────────────────────────────

const STAT_META: Record<StatName, { label: string; abbrev: string; color: string; icon: string }> = {
  strength:     { label: 'Strength',     abbrev: 'STR', color: '#8B0000', icon: '⚔️' },
  dexterity:    { label: 'Dexterity',    abbrev: 'DEX', color: '#2E8B57', icon: '🌙' },
  intelligence: { label: 'Intelligence', abbrev: 'INT', color: '#4169E1', icon: '📖' },
  wisdom:       { label: 'Wisdom',       abbrev: 'WIS', color: '#DAA520', icon: '📜' },
  constitution: { label: 'Constitution', abbrev: 'CON', color: '#8B4513', icon: '🛡️' },
  charisma:     { label: 'Charisma',     abbrev: 'CHA', color: '#9932CC', icon: '👑' },
  influence:    { label: 'Influence',    abbrev: 'INF', color: '#B8860B', icon: '🏛️' },
  cunning:      { label: 'Cunning',      abbrev: 'CUN', color: '#2F4F4F', icon: '🗡️' },
  diplomacy:    { label: 'Diplomacy',    abbrev: 'DIP', color: '#4682B4', icon: '🤝' },
};

// ─── Props ──────────────────────────────────────────────────────────

export interface StatCheckEncounterProps {
  /** The encounter definition */
  encounter: MinorEncounter;
  /** Player's current stat block */
  playerStats: StatBlock;
  /** Called when the encounter resolves — parent can apply damage/XP */
  onResolve: (result: MinorEncounterResult) => void;
  /** Called when the player is ready to continue to the next scene */
  onContinue: (result: MinorEncounterResult) => void;
  /** Custom resolve function (if parent wants to control RNG) */
  resolveEncounter?: (stats: StatBlock, encounter: MinorEncounter) => MinorEncounterResult;
  /** Optional success scene navigation ID */
  successSceneId?: string;
  /** Optional failure scene navigation ID */
  failureSceneId?: string;
  /** Whether to auto-advance after showing the result (default: false) */
  autoAdvance?: boolean;
  /** Delay before auto-advance in ms (default: 3000) */
  autoAdvanceDelay?: number;
}

// ─── Component ──────────────────────────────────────────────────────

export function StatCheckEncounter({
  encounter,
  playerStats,
  onResolve,
  onContinue,
  resolveEncounter,
  autoAdvance = false,
  autoAdvanceDelay = 3000,
}: StatCheckEncounterProps) {
  const [phase, setPhase] = useState<EncounterPhase>('intro');
  const [result, setResult] = useState<MinorEncounterResult | null>(null);
  const [rollingValue, setRollingValue] = useState(0);
  const [showSecondary, setShowSecondary] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const rollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Trigger fade-in on mount
  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    };
  }, []);

  // Get stat values
  const primaryStat = encounter.checkStat;
  const primaryValue = playerStats[primaryStat]?.total ?? 0;
  const secondaryStat = encounter.secondaryStat;
  const secondaryValue = secondaryStat ? (playerStats[secondaryStat]?.total ?? 0) : 0;
  const secondaryMultiplier = encounter.secondaryMultiplier ?? 0.5;
  const secondaryBonus = secondaryStat ? Math.round(secondaryValue * secondaryMultiplier) : 0;
  const effectiveTotal = primaryValue + secondaryBonus;

  // Difficulty visualization
  const difficultyLabel = getDifficultyLabel(encounter.difficulty);
  const difficultyColor = getDifficultyColor(encounter.difficulty);

  // ── Phase Transitions ──

  const handleBeginCheck = useCallback(() => {
    setPhase('stat_display');
    // Show secondary stat after a brief delay
    if (secondaryStat) {
      setTimeout(() => setShowSecondary(true), 600);
    }
  }, [secondaryStat]);

  const handleRoll = useCallback(() => {
    setPhase('rolling');

    // Animate rolling numbers
    let ticks = 0;
    const maxTicks = 20;
    rollIntervalRef.current = setInterval(() => {
      ticks++;
      // Generate a random-ish display value centered around the expected range
      setRollingValue(Math.floor(Math.random() * (encounter.difficulty + 10)) + 1);

      if (ticks >= maxTicks) {
        if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);

        // Resolve the encounter
        let encounterResult: MinorEncounterResult;
        if (resolveEncounter) {
          encounterResult = resolveEncounter(playerStats, encounter);
        } else {
          // Default resolution using the combat engine's logic
          encounterResult = defaultResolveMinorEncounter(playerStats, encounter);
        }

        setRollingValue(encounterResult.totalCheck);
        setResult(encounterResult);
        onResolve(encounterResult);

        // Transition to result phase after a beat
        setTimeout(() => setPhase('result'), 500);
      }
    }, 80);
  }, [encounter, playerStats, resolveEncounter, onResolve]);

  const handleShowNarrative = useCallback(() => {
    setPhase('narrative');

    // Auto-advance if configured
    if (autoAdvance && result) {
      autoAdvanceRef.current = setTimeout(() => {
        onContinue(result);
      }, autoAdvanceDelay);
    }
  }, [autoAdvance, autoAdvanceDelay, result, onContinue]);

  const handleContinue = useCallback(() => {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    if (result) {
      onContinue(result);
    }
  }, [result, onContinue]);

  // ── Render ──

  return (
    <div
      className={`
        relative w-full max-w-2xl mx-auto
        transition-opacity duration-700 ease-out
        ${fadeIn ? 'opacity-100' : 'opacity-0'}
      `}
    >
      {/* Encounter Card */}
      <div className="parchment-panel p-6 md:p-8 space-y-6">

        {/* ── Header: Encounter Type Badge ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gold-400 text-lg">⚡</span>
            <span className="font-display text-xs uppercase tracking-[0.2em] text-gold-500/80">
              Stat Check
            </span>
          </div>
          <div
            className="font-display text-xs uppercase tracking-wider px-3 py-1 rounded border"
            style={{
              color: difficultyColor,
              borderColor: `${difficultyColor}44`,
              backgroundColor: `${difficultyColor}11`,
            }}
          >
            {difficultyLabel}
          </div>
        </div>

        {/* ── Scenario Description ── */}
        <div className="relative">
          <p className="text-parchment-200 font-body text-base md:text-lg leading-relaxed">
            {encounter.description}
          </p>
          {/* Decorative separator */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-parchment-700/40 to-transparent" />
            <span className="text-parchment-600 text-xs">✦</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-parchment-700/40 to-transparent" />
          </div>
        </div>

        {/* ── Stat Display Phase ── */}
        {(phase === 'intro') && (
          <div className="flex justify-center pt-2">
            <button
              onClick={handleBeginCheck}
              className="btn-medieval-primary px-6 py-3 text-base"
            >
              Face the Challenge
            </button>
          </div>
        )}

        {phase !== 'intro' && (
          <div className="space-y-4">

            {/* Stats Panel */}
            <div className="space-y-3">
              {/* Primary Stat */}
              <StatCheckRow
                stat={primaryStat}
                value={primaryValue}
                difficulty={encounter.difficulty}
                isPrimary
                visible
              />

              {/* Secondary Stat (if any) */}
              {secondaryStat && (
                <StatCheckRow
                  stat={secondaryStat}
                  value={secondaryValue}
                  difficulty={encounter.difficulty}
                  isPrimary={false}
                  bonus={secondaryBonus}
                  multiplier={secondaryMultiplier}
                  visible={showSecondary || phase !== 'stat_display'}
                />
              )}

              {/* Effective Total vs Difficulty */}
              <div
                className={`
                  flex items-center justify-between px-4 py-3 rounded-lg
                  border border-parchment-800/30 bg-shadow-900/60
                  transition-all duration-500
                  ${phase === 'stat_display' ? 'opacity-100 translate-y-0' : ''}
                `}
              >
                <span className="font-display text-sm text-parchment-400">
                  Your Check Total
                </span>
                <div className="flex items-center gap-4">
                  <span className="font-display text-xl text-parchment-100 font-bold tabular-nums">
                    {effectiveTotal}
                  </span>
                  <span className="text-parchment-600 text-sm">vs</span>
                  <span
                    className="font-display text-xl font-bold tabular-nums"
                    style={{ color: difficultyColor }}
                  >
                    {encounter.difficulty}
                  </span>
                </div>
              </div>
            </div>

            {/* Roll Button */}
            {phase === 'stat_display' && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={handleRoll}
                  className="btn-medieval-primary px-8 py-3 text-base group relative overflow-hidden"
                >
                  <span className="relative z-10">Test Your Mettle</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gold-700/0 via-gold-600/20 to-gold-700/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </button>
              </div>
            )}

            {/* Rolling Animation */}
            {phase === 'rolling' && (
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-2 border-gold-500/60 flex items-center justify-center bg-shadow-900/80 animate-pulse">
                    <span className="font-display text-3xl font-bold text-gold-300 tabular-nums">
                      {rollingValue}
                    </span>
                  </div>
                  {/* Spinning ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold-400/60 animate-spin" />
                </div>
                <span className="font-display text-xs text-parchment-500 uppercase tracking-wider animate-pulse">
                  Resolving...
                </span>
              </div>
            )}

            {/* Result Display */}
            {(phase === 'result' || phase === 'narrative') && result && (
              <ResultDisplay
                result={result}
                encounter={encounter}
                onShowNarrative={phase === 'result' ? handleShowNarrative : undefined}
              />
            )}

            {/* Narrative Outcome */}
            {phase === 'narrative' && result && (
              <NarrativeOutcome
                result={result}
                onContinue={handleContinue}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-Components ─────────────────────────────────────────────────

interface StatCheckRowProps {
  stat: StatName;
  value: number;
  difficulty: number;
  isPrimary: boolean;
  bonus?: number;
  multiplier?: number;
  visible: boolean;
}

function StatCheckRow({ stat, value, difficulty, isPrimary, bonus, multiplier, visible }: StatCheckRowProps) {
  const meta = STAT_META[stat];
  const barPct = Math.min(100, (value / Math.max(difficulty * 1.2, 20)) * 100);

  return (
    <div
      className={`
        transition-all duration-500 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
    >
      <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border border-parchment-800/20 bg-shadow-900/40">
        {/* Stat label */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base">{meta.icon}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span
                className="font-display text-sm font-semibold"
                style={{ color: meta.color }}
              >
                {meta.abbrev}
              </span>
              <span className="text-parchment-400 text-xs hidden sm:inline">
                {meta.label}
              </span>
              {isPrimary && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gold-800/30 text-gold-400 font-display uppercase tracking-wider">
                  Primary
                </span>
              )}
              {!isPrimary && bonus !== undefined && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-shadow-700/50 text-parchment-400 font-display uppercase tracking-wider">
                  ×{multiplier ?? 0.5} bonus
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stat value + bar */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-24 sm:w-32 h-2 bg-shadow-800/60 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${barPct}%`,
                background: `linear-gradient(90deg, ${meta.color}99, ${meta.color})`,
                boxShadow: value >= difficulty ? `0 0 6px ${meta.color}44` : 'none',
              }}
            />
          </div>
          <span className="font-display text-lg font-bold tabular-nums min-w-[2ch] text-right text-parchment-100">
            {isPrimary ? value : `+${bonus ?? 0}`}
          </span>
        </div>
      </div>
    </div>
  );
}

interface ResultDisplayProps {
  result: MinorEncounterResult;
  encounter: MinorEncounter;
  onShowNarrative?: () => void;
}

function ResultDisplay({ result, encounter, onShowNarrative }: ResultDisplayProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const success = result.success;
  const margin = result.totalCheck - result.difficulty;

  return (
    <div
      className={`
        space-y-4 transition-all duration-500 ease-out
        ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      {/* Result Banner */}
      <div
        className={`
          relative overflow-hidden rounded-lg border p-4 text-center
          ${success
            ? 'border-green-700/50 bg-green-900/20'
            : 'border-blood-700/50 bg-blood-900/20'
          }
        `}
      >
        {/* Glow effect */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: success
              ? 'radial-gradient(ellipse at center, rgba(46,204,113,0.3), transparent 70%)'
              : 'radial-gradient(ellipse at center, rgba(231,76,60,0.3), transparent 70%)',
          }}
        />

        <div className="relative z-10 space-y-2">
          <div className={`font-display text-2xl font-bold ${success ? 'text-green-400' : 'text-blood-400'}`}>
            {success ? 'Success!' : 'Failure!'}
          </div>

          {/* Roll breakdown */}
          <div className="flex items-center justify-center gap-2 text-sm text-parchment-400">
            <span className="font-display font-bold text-parchment-200 tabular-nums">
              {result.totalCheck}
            </span>
            <span>vs DC</span>
            <span className="font-display font-bold text-parchment-200 tabular-nums">
              {result.difficulty}
            </span>
            <span className={`font-display font-semibold tabular-nums ${margin >= 0 ? 'text-green-400' : 'text-blood-400'}`}>
              ({margin >= 0 ? '+' : ''}{margin})
            </span>
          </div>

          {/* Breakdown details */}
          <div className="flex items-center justify-center gap-4 text-xs text-parchment-500 pt-1">
            <span>Base: {result.statValue}</span>
            {result.secondaryBonus > 0 && (
              <span>Bonus: +{result.secondaryBonus}</span>
            )}
            <span>Roll Mod: {result.totalCheck - result.statValue - result.secondaryBonus >= 0 ? '+' : ''}{result.totalCheck - result.statValue - result.secondaryBonus}</span>
          </div>
        </div>
      </div>

      {/* Consequences summary */}
      <div className="flex items-center justify-between px-2 text-sm">
        {!success && encounter.failureDamage > 0 && (
          <div className="flex items-center gap-1.5 text-blood-400">
            <span>💔</span>
            <span>-{encounter.failureDamage} HP</span>
          </div>
        )}
        {success && <div />}
        <div className="flex items-center gap-1.5 text-gold-400">
          <span>✨</span>
          <span>+{result.experienceGained} XP</span>
        </div>
      </div>

      {/* Continue to narrative button */}
      {onShowNarrative && (
        <div className="flex justify-center pt-1">
          <button
            onClick={onShowNarrative}
            className="btn-medieval px-6 py-2"
          >
            See What Happens...
          </button>
        </div>
      )}
    </div>
  );
}

interface NarrativeOutcomeProps {
  result: MinorEncounterResult;
  onContinue: () => void;
}

function NarrativeOutcome({ result, onContinue }: NarrativeOutcomeProps) {
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReveal(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`
        space-y-4 transition-all duration-700 ease-out
        ${reveal ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}
      `}
    >
      {/* Narrative text */}
      <div className="px-4 py-4 rounded-lg border border-parchment-800/20 bg-shadow-950/60">
        <p className="text-parchment-200 font-body text-base leading-relaxed italic">
          &ldquo;{result.narrative}&rdquo;
        </p>
      </div>

      {/* Continue button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onContinue}
          className="btn-medieval-primary px-8 py-3 text-base"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// ─── Default Minor Encounter Resolution ─────────────────────────────

/**
 * Default resolution function that mirrors the combat engine's resolveMinorEncounter.
 * This is used when no custom resolver is provided.
 */
function defaultResolveMinorEncounter(
  playerStats: StatBlock,
  encounter: MinorEncounter,
): MinorEncounterResult {
  const primaryValue = playerStats[encounter.checkStat]?.total ?? 0;
  const secondaryBonus = encounter.secondaryStat
    ? Math.round(
        (playerStats[encounter.secondaryStat]?.total ?? 0) *
          (encounter.secondaryMultiplier ?? 0.5),
      )
    : 0;

  // Small random modifier (±3)
  const rollMod = Math.floor(Math.random() * 7) - 3;
  const totalCheck = primaryValue + secondaryBonus + rollMod;
  const success = totalCheck >= encounter.difficulty;

  const damageTaken = success ? 0 : encounter.failureDamage;
  const experienceGained = success
    ? encounter.experienceReward
    : Math.round(encounter.experienceReward * 0.25);

  const narrative = success ? encounter.successText : encounter.failureText;

  return {
    success,
    statValue: primaryValue,
    difficulty: encounter.difficulty,
    secondaryBonus,
    totalCheck,
    damageTaken,
    experienceGained,
    narrative,
  };
}

// ─── Helpers ────────────────────────────────────────────────────────

function getDifficultyLabel(dc: number): string {
  if (dc <= 5) return 'Trivial';
  if (dc <= 8) return 'Easy';
  if (dc <= 12) return 'Medium';
  if (dc <= 16) return 'Hard';
  if (dc <= 20) return 'Very Hard';
  if (dc <= 25) return 'Legendary';
  return 'Impossible';
}

function getDifficultyColor(dc: number): string {
  if (dc <= 5) return '#27ae60';
  if (dc <= 8) return '#2ecc71';
  if (dc <= 12) return '#f39c12';
  if (dc <= 16) return '#e67e22';
  if (dc <= 20) return '#e74c3c';
  if (dc <= 25) return '#c0392b';
  return '#8e44ad';
}
