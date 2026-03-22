'use client';

import { useCallback, useMemo, useState } from 'react';
import type { StatId, StatBlock, ComputedStatSheet } from '@/lib/types/stats';
import {
  ALL_STATS,
  CREATION_POINT_POOL,
  CREATION_STAT_MIN,
  CREATION_STAT_MAX,
  STAT_META,
} from '@/lib/types/stats';
import {
  pointBuyCost,
  totalPointBuyCost,
  computeStatSheet,
  createDefaultStatBlock,
  formatModifier,
  getStatLabel,
  calcModifier,
} from '@/lib/engine/stats';

/** Preset stat configurations for quick character builds */
export interface StatPreset {
  id: string;
  label: string;
  description: string;
  stats: StatBlock;
}

export const STAT_PRESETS: StatPreset[] = [
  {
    id: 'warrior-king',
    label: 'Warrior King',
    description: 'Lead from the front. Might makes right.',
    stats: {
      STR: 15, DEX: 10, INT: 8, WIS: 10, CON: 14, CHA: 12,
      Influence: 10, Cunning: 8, Diplomacy: 10,
    },
  },
  {
    id: 'master-of-whispers',
    label: 'Master of Whispers',
    description: 'Knowledge is power, and secrets are currency.',
    stats: {
      STR: 8, DEX: 12, INT: 14, WIS: 13, CON: 8, CHA: 10,
      Influence: 10, Cunning: 15, Diplomacy: 8,
    },
  },
  {
    id: 'silver-tongue',
    label: 'Silver Tongue',
    description: 'Why fight when you can talk your way to victory?',
    stats: {
      STR: 8, DEX: 8, INT: 12, WIS: 10, CON: 10, CHA: 15,
      Influence: 13, Cunning: 10, Diplomacy: 14,
    },
  },
  {
    id: 'iron-hand',
    label: 'Iron Hand',
    description: 'Endurance and political influence rule empires.',
    stats: {
      STR: 13, DEX: 8, INT: 10, WIS: 12, CON: 15, CHA: 10,
      Influence: 14, Cunning: 8, Diplomacy: 8,
    },
  },
  {
    id: 'balanced',
    label: 'Jack of All Trades',
    description: 'Versatile and adaptable. No fatal weaknesses.',
    stats: {
      STR: 10, DEX: 10, INT: 11, WIS: 11, CON: 10, CHA: 11,
      Influence: 11, Cunning: 10, Diplomacy: 10,
    },
  },
];

export interface UseStatAllocationReturn {
  /** Current stat block */
  stats: StatBlock;
  /** Computed stat sheet with modifiers and derived stats */
  computed: ComputedStatSheet;
  /** Points remaining to spend */
  pointsRemaining: number;
  /** Total points spent */
  pointsSpent: number;
  /** Total point pool */
  totalPool: number;
  /** Whether the current allocation is valid */
  isValid: boolean;
  /** Validation errors */
  errors: string[];
  /** Increase a stat by 1 */
  increaseStat: (stat: StatId) => void;
  /** Decrease a stat by 1 */
  decreaseStat: (stat: StatId) => void;
  /** Set a stat to a specific value */
  setStat: (stat: StatId, value: number) => void;
  /** Apply a preset */
  applyPreset: (preset: StatPreset) => void;
  /** Reset all stats to default */
  resetStats: () => void;
  /** Check if a specific stat can be increased */
  canIncrease: (stat: StatId) => boolean;
  /** Check if a specific stat can be decreased */
  canDecrease: (stat: StatId) => boolean;
  /** Get the cost to increase a stat from its current value */
  costToIncrease: (stat: StatId) => number;
  /** Get the refund from decreasing a stat from its current value */
  refundFromDecrease: (stat: StatId) => number;
  /** Available presets */
  presets: StatPreset[];
}

export function useStatAllocation(
  initialStats?: StatBlock
): UseStatAllocationReturn {
  const [stats, setStats] = useState<StatBlock>(
    initialStats ?? createDefaultStatBlock()
  );

  const pointsSpent = useMemo(() => totalPointBuyCost(stats), [stats]);
  const pointsRemaining = useMemo(
    () => CREATION_POINT_POOL - pointsSpent,
    [pointsSpent]
  );

  const computed = useMemo(
    () => computeStatSheet(stats),
    [stats]
  );

  const errors = useMemo(() => {
    const errs: string[] = [];
    for (const statId of ALL_STATS) {
      if (stats[statId] < CREATION_STAT_MIN) {
        errs.push(`${STAT_META[statId].name} is below minimum (${CREATION_STAT_MIN})`);
      }
      if (stats[statId] > CREATION_STAT_MAX) {
        errs.push(`${STAT_META[statId].name} is above maximum (${CREATION_STAT_MAX})`);
      }
    }
    if (pointsSpent > CREATION_POINT_POOL) {
      errs.push(`Spent ${pointsSpent} points, but only ${CREATION_POINT_POOL} available`);
    }
    return errs;
  }, [stats, pointsSpent]);

  const isValid = errors.length === 0 && pointsRemaining >= 0;

  const canIncrease = useCallback(
    (stat: StatId): boolean => {
      if (stats[stat] >= CREATION_STAT_MAX) return false;
      const costNow = pointBuyCost(stats[stat]);
      const costNext = pointBuyCost(stats[stat] + 1);
      if (costNow === -1 || costNext === -1) return false;
      return (costNext - costNow) <= pointsRemaining;
    },
    [stats, pointsRemaining]
  );

  const canDecrease = useCallback(
    (stat: StatId): boolean => stats[stat] > CREATION_STAT_MIN,
    [stats]
  );

  const costToIncrease = useCallback(
    (stat: StatId): number => {
      const current = stats[stat];
      if (current >= CREATION_STAT_MAX) return -1;
      const costNow = pointBuyCost(current);
      const costNext = pointBuyCost(current + 1);
      if (costNow === -1 || costNext === -1) return -1;
      return costNext - costNow;
    },
    [stats]
  );

  const refundFromDecrease = useCallback(
    (stat: StatId): number => {
      const current = stats[stat];
      if (current <= CREATION_STAT_MIN) return 0;
      const costNow = pointBuyCost(current);
      const costPrev = pointBuyCost(current - 1);
      if (costNow === -1 || costPrev === -1) return 0;
      return costNow - costPrev;
    },
    [stats]
  );

  const increaseStat = useCallback(
    (stat: StatId) => {
      if (!canIncrease(stat)) return;
      setStats(prev => ({ ...prev, [stat]: prev[stat] + 1 }));
    },
    [canIncrease]
  );

  const decreaseStat = useCallback(
    (stat: StatId) => {
      if (!canDecrease(stat)) return;
      setStats(prev => ({ ...prev, [stat]: prev[stat] - 1 }));
    },
    [canDecrease]
  );

  const setStat = useCallback(
    (stat: StatId, value: number) => {
      const clamped = Math.max(CREATION_STAT_MIN, Math.min(CREATION_STAT_MAX, value));
      setStats(prev => ({ ...prev, [stat]: clamped }));
    },
    []
  );

  const applyPreset = useCallback(
    (preset: StatPreset) => {
      setStats({ ...preset.stats });
    },
    []
  );

  const resetStats = useCallback(() => {
    setStats(createDefaultStatBlock());
  }, []);

  return {
    stats,
    computed,
    pointsRemaining,
    pointsSpent,
    totalPool: CREATION_POINT_POOL,
    isValid,
    errors,
    increaseStat,
    decreaseStat,
    setStat,
    applyPreset,
    resetStats,
    canIncrease,
    canDecrease,
    costToIncrease,
    refundFromDecrease,
    presets: STAT_PRESETS,
  };
}
