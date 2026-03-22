/**
 * Reputation State Management System
 *
 * Manages per-faction reputation scores in the range [-100, +100].
 * Provides initialization, update, clamping, tier calculation,
 * cross-faction ripple effects, and batch operations.
 *
 * Design:
 * - Pure functions for all state transitions (immutable updates)
 * - Clamping enforced at every mutation boundary
 * - Tier thresholds aligned with engine/types.ts FactionStanding
 * - Cross-faction ripple effects model political alliances/rivalries
 */

import type { FactionId, FactionStanding, GameState } from './types';

// ─── Constants ─────────────────────────────────────────────────────────────

/** Minimum reputation value (absolute floor) */
export const REPUTATION_MIN = -100;

/** Maximum reputation value (absolute ceiling) */
export const REPUTATION_MAX = 100;

/** Default starting reputation for all factions */
export const REPUTATION_DEFAULT = 0;

/** All faction IDs in canonical order */
export const ALL_FACTION_IDS: readonly FactionId[] = [
  'iron_throne',
  'shadow_guild',
  'peoples_front',
  'old_faith',
] as const;

// ─── Reputation Tiers ──────────────────────────────────────────────────────

/**
 * Named reputation tiers with thresholds.
 * Each tier unlocks different dialogue, quest, and faction-specific content.
 */
export type ReputationTier =
  | 'despised'     // -100 to -61
  | 'hostile'      //  -60 to -21
  | 'neutral'      //  -20 to  +20
  | 'friendly'     //  +21 to  +60
  | 'honored'      //  +61 to  +89
  | 'exalted';     //  +90 to +100

/** Tier threshold definitions (lower-bound inclusive) */
export const TIER_THRESHOLDS: readonly { tier: ReputationTier; min: number; max: number }[] = [
  { tier: 'despised',  min: -100, max: -61 },
  { tier: 'hostile',   min:  -60, max: -21 },
  { tier: 'neutral',   min:  -20, max:  20 },
  { tier: 'friendly',  min:   21, max:  60 },
  { tier: 'honored',   min:   61, max:  89 },
  { tier: 'exalted',   min:   90, max: 100 },
];

// ─── Cross-Faction Ripple Matrix ───────────────────────────────────────────

/**
 * When faction A gains reputation, allied factions gain a fraction
 * and rival factions lose a fraction. This models political dynamics.
 *
 * Matrix value: multiplier applied to the delta.
 * e.g., if iron_throne gains +10, shadow_guild gets +10 * -0.3 = -3
 *
 * Key relationships:
 * - Iron Throne ↔ Old Faith: cautious allies (+0.2)
 * - Shadow Guild ↔ People's Front: mutual suspicion (-0.2)
 * - Iron Throne ↔ People's Front: ideological enemies (-0.3)
 * - Shadow Guild ↔ Old Faith: philosophical opposition (-0.25)
 */
export const RIPPLE_MATRIX: Record<FactionId, Record<FactionId, number>> = {
  iron_throne: {
    iron_throne:    0,      // self: no ripple
    shadow_guild:  -0.15,   // throne distrusts guild's methods
    peoples_front: -0.3,    // throne vs populist uprising
    old_faith:      0.2,    // traditional alliance
  },
  shadow_guild: {
    iron_throne:   -0.15,
    shadow_guild:   0,
    peoples_front: -0.2,    // guild exploits what front protects
    old_faith:     -0.25,   // guild's pragmatism vs faith's dogma
  },
  peoples_front: {
    iron_throne:   -0.3,    // front opposes noble rule
    shadow_guild:  -0.2,
    peoples_front:  0,
    old_faith:      0.1,    // some common ground on justice
  },
  old_faith: {
    iron_throne:    0.2,
    shadow_guild:  -0.25,
    peoples_front:  0.1,
    old_faith:      0,
  },
};

// ─── Core Functions ────────────────────────────────────────────────────────

/**
 * Clamp a reputation value to the valid range [-100, +100].
 * This is the single source of truth for bounds enforcement.
 */
export function clampReputation(value: number): number {
  return Math.max(REPUTATION_MIN, Math.min(REPUTATION_MAX, Math.round(value)));
}

/**
 * Create a fresh FactionStanding with all factions at default reputation.
 * Optionally accepts partial overrides for specific factions.
 */
export function createFactionStanding(
  overrides?: Partial<FactionStanding>
): FactionStanding {
  return {
    iron_throne:    clampReputation(overrides?.iron_throne   ?? REPUTATION_DEFAULT),
    shadow_guild:   clampReputation(overrides?.shadow_guild  ?? REPUTATION_DEFAULT),
    peoples_front:  clampReputation(overrides?.peoples_front ?? REPUTATION_DEFAULT),
    old_faith:      clampReputation(overrides?.old_faith     ?? REPUTATION_DEFAULT),
  };
}

/**
 * Get the current reputation value for a specific faction.
 */
export function getReputation(standing: FactionStanding, factionId: FactionId): number {
  return standing[factionId];
}

/**
 * Convert a numeric reputation to its named tier.
 */
export function getReputationTier(reputation: number): ReputationTier {
  const clamped = clampReputation(reputation);
  if (clamped <= -61) return 'despised';
  if (clamped <= -21) return 'hostile';
  if (clamped <=  20) return 'neutral';
  if (clamped <=  60) return 'friendly';
  if (clamped <=  89) return 'honored';
  return 'exalted';
}

/**
 * Get tier info for all factions at once.
 */
export function getAllReputationTiers(
  standing: FactionStanding
): Record<FactionId, ReputationTier> {
  return {
    iron_throne:    getReputationTier(standing.iron_throne),
    shadow_guild:   getReputationTier(standing.shadow_guild),
    peoples_front:  getReputationTier(standing.peoples_front),
    old_faith:      getReputationTier(standing.old_faith),
  };
}

// ─── Update Functions ──────────────────────────────────────────────────────

/**
 * Update a single faction's reputation by a delta amount.
 * Returns a new FactionStanding (immutable update).
 * The result is always clamped to [-100, +100].
 */
export function updateReputation(
  standing: FactionStanding,
  factionId: FactionId,
  delta: number
): FactionStanding {
  return {
    ...standing,
    [factionId]: clampReputation(standing[factionId] + delta),
  };
}

/**
 * Set a faction's reputation to an exact value (clamped).
 * Use sparingly — prefer delta-based updates for gameplay.
 */
export function setReputation(
  standing: FactionStanding,
  factionId: FactionId,
  value: number
): FactionStanding {
  return {
    ...standing,
    [factionId]: clampReputation(value),
  };
}

/**
 * Update a faction's reputation with cross-faction ripple effects.
 * When you gain/lose rep with one faction, allied/rival factions
 * are affected proportionally via the RIPPLE_MATRIX.
 *
 * @param standing  Current faction standings
 * @param factionId The primary faction being affected
 * @param delta     The reputation change for the primary faction
 * @param enableRipple Whether to apply ripple effects (default: true)
 * @returns New FactionStanding with all changes applied
 */
export function updateReputationWithRipple(
  standing: FactionStanding,
  factionId: FactionId,
  delta: number,
  enableRipple = true
): FactionStanding {
  // Start with the primary faction update
  let result: FactionStanding = {
    ...standing,
    [factionId]: clampReputation(standing[factionId] + delta),
  };

  if (!enableRipple) return result;

  // Apply ripple effects to other factions
  const rippleRow = RIPPLE_MATRIX[factionId];
  for (const otherId of ALL_FACTION_IDS) {
    if (otherId === factionId) continue;
    const multiplier = rippleRow[otherId];
    if (multiplier === 0) continue;

    const rippleDelta = Math.round(delta * multiplier);
    if (rippleDelta === 0) continue;

    result = {
      ...result,
      [otherId]: clampReputation(result[otherId] + rippleDelta),
    };
  }

  return result;
}

/**
 * Apply multiple reputation changes at once (batch update).
 * Each entry is a [factionId, delta] pair.
 * Ripple effects are NOT applied for batch updates to avoid cascading complexity.
 */
export function batchUpdateReputation(
  standing: FactionStanding,
  changes: Array<{ factionId: FactionId; delta: number }>
): FactionStanding {
  let result = { ...standing };

  for (const { factionId, delta } of changes) {
    result[factionId] = clampReputation(result[factionId] + delta);
  }

  return result;
}

// ─── Query Functions ───────────────────────────────────────────────────────

/**
 * Check if player meets a minimum reputation threshold with a faction.
 */
export function meetsReputationThreshold(
  standing: FactionStanding,
  factionId: FactionId,
  minReputation: number
): boolean {
  return standing[factionId] >= minReputation;
}

/**
 * Check if player is at or above a specific tier with a faction.
 */
export function meetsReputationTier(
  standing: FactionStanding,
  factionId: FactionId,
  requiredTier: ReputationTier
): boolean {
  const tierOrder: ReputationTier[] = [
    'despised', 'hostile', 'neutral', 'friendly', 'honored', 'exalted',
  ];
  const currentTier = getReputationTier(standing[factionId]);
  return tierOrder.indexOf(currentTier) >= tierOrder.indexOf(requiredTier);
}

/**
 * Get the faction with the highest reputation.
 * Returns the first one found in case of ties (canonical order).
 *
 * Note: For ending resolution with richer context, use endings.ts getDominantFaction().
 */
export function getHighestReputationFaction(standing: FactionStanding): FactionId {
  let best: FactionId = 'iron_throne';
  let bestValue = standing.iron_throne;

  for (const factionId of ALL_FACTION_IDS) {
    if (standing[factionId] > bestValue) {
      bestValue = standing[factionId];
      best = factionId;
    }
  }

  return best;
}

/**
 * Get the faction with the lowest reputation.
 */
export function getLowestReputationFaction(standing: FactionStanding): FactionId {
  let worst: FactionId = 'iron_throne';
  let worstValue = standing.iron_throne;

  for (const factionId of ALL_FACTION_IDS) {
    if (standing[factionId] < worstValue) {
      worstValue = standing[factionId];
      worst = factionId;
    }
  }

  return worst;
}

/**
 * Get a summary of all faction standings with tier info.
 * Useful for UI display.
 */
export interface FactionReputationSummary {
  factionId: FactionId;
  reputation: number;
  tier: ReputationTier;
  percentage: number; // 0-100 for progress bars (maps -100..+100 to 0..100%)
}

export function getReputationSummary(
  standing: FactionStanding
): FactionReputationSummary[] {
  return ALL_FACTION_IDS.map((factionId) => {
    const reputation = standing[factionId];
    return {
      factionId,
      reputation,
      tier: getReputationTier(reputation),
      // Map [-100, +100] → [0, 100] for UI progress bars
      percentage: Math.round(((reputation - REPUTATION_MIN) / (REPUTATION_MAX - REPUTATION_MIN)) * 100),
    };
  });
}

// ─── GameState Integration ─────────────────────────────────────────────────

/**
 * Apply a reputation effect to a GameState, returning a new GameState.
 * This is the primary integration point with the narrative engine's Effect system.
 */
export function applyReputationEffect(
  state: GameState,
  factionId: FactionId,
  delta: number,
  withRipple = true
): GameState {
  return {
    ...state,
    factions: withRipple
      ? updateReputationWithRipple(state.factions, factionId, delta)
      : updateReputation(state.factions, factionId, delta),
  };
}

/**
 * Validate that a FactionStanding has all values within bounds.
 * Returns true if valid, or an array of violations.
 */
export function validateFactionStanding(
  standing: FactionStanding
): true | Array<{ factionId: FactionId; value: number; issue: string }> {
  const violations: Array<{ factionId: FactionId; value: number; issue: string }> = [];

  for (const factionId of ALL_FACTION_IDS) {
    const value = standing[factionId];
    if (typeof value !== 'number' || Number.isNaN(value)) {
      violations.push({ factionId, value, issue: 'not a valid number' });
    } else if (value < REPUTATION_MIN) {
      violations.push({ factionId, value, issue: `below minimum (${REPUTATION_MIN})` });
    } else if (value > REPUTATION_MAX) {
      violations.push({ factionId, value, issue: `above maximum (${REPUTATION_MAX})` });
    }
  }

  return violations.length === 0 ? true : violations;
}

/**
 * Sanitize a FactionStanding by clamping all values.
 * Useful when loading potentially corrupt save data.
 */
export function sanitizeFactionStanding(standing: FactionStanding): FactionStanding {
  return {
    iron_throne:    clampReputation(standing.iron_throne   ?? REPUTATION_DEFAULT),
    shadow_guild:   clampReputation(standing.shadow_guild  ?? REPUTATION_DEFAULT),
    peoples_front:  clampReputation(standing.peoples_front ?? REPUTATION_DEFAULT),
    old_faith:      clampReputation(standing.old_faith     ?? REPUTATION_DEFAULT),
  };
}
