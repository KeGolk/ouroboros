/**
 * Tests for the Reputation State Management System
 */

import {
  REPUTATION_MIN,
  REPUTATION_MAX,
  REPUTATION_DEFAULT,
  ALL_FACTION_IDS,
  clampReputation,
  createFactionStanding,
  getReputation,
  getReputationTier,
  getAllReputationTiers,
  updateReputation,
  setReputation,
  updateReputationWithRipple,
  batchUpdateReputation,
  meetsReputationThreshold,
  meetsReputationTier,
  getHighestReputationFaction,
  getLowestReputationFaction,
  getReputationSummary,
  applyReputationEffect,
  validateFactionStanding,
  sanitizeFactionStanding,
  RIPPLE_MATRIX,
} from '../reputation';
import type { FactionStanding, GameState } from '../types';

// ─── Helpers ───────────────────────────────────────────────────────────────

function makeStanding(overrides?: Partial<FactionStanding>): FactionStanding {
  return createFactionStanding(overrides);
}

function makeGameState(factionOverrides?: Partial<FactionStanding>): GameState {
  return {
    saveId: 'test-save',
    playerName: 'Test Player',
    currentChapterId: 'ch1',
    currentSceneId: 'scene1',
    stats: { strength: 10, dexterity: 10, intelligence: 10, wisdom: 10, constitution: 10, charisma: 10, influence: 0, cunning: 10, diplomacy: 0 },
    factions: createFactionStanding(factionOverrides),
    flags: {},
    choiceHistory: [],
    deadCharacters: [],
    unlocks: [],
    completedChapters: [],
    savedAt: Date.now(),
    ngPlusCycle: 0,
    achievements: [],
    playtimeSeconds: 0,
  };
}

// ─── clampReputation ───────────────────────────────────────────────────────

describe('clampReputation', () => {
  it('returns value unchanged when within bounds', () => {
    expect(clampReputation(0)).toBe(0);
    expect(clampReputation(50)).toBe(50);
    expect(clampReputation(-50)).toBe(-50);
  });

  it('clamps to minimum when below -100', () => {
    expect(clampReputation(-101)).toBe(-100);
    expect(clampReputation(-500)).toBe(-100);
    expect(clampReputation(-Infinity)).toBe(-100);
  });

  it('clamps to maximum when above +100', () => {
    expect(clampReputation(101)).toBe(100);
    expect(clampReputation(500)).toBe(100);
    expect(clampReputation(Infinity)).toBe(100);
  });

  it('rounds to nearest integer', () => {
    expect(clampReputation(10.4)).toBe(10);
    expect(clampReputation(10.5)).toBe(11);
    expect(clampReputation(-10.6)).toBe(-11);
  });

  it('handles boundary values exactly', () => {
    expect(clampReputation(-100)).toBe(-100);
    expect(clampReputation(100)).toBe(100);
  });
});

// ─── createFactionStanding ────────────────────────────────────────────────

describe('createFactionStanding', () => {
  it('creates all factions at default (0) when no overrides', () => {
    const standing = createFactionStanding();
    expect(standing.iron_throne).toBe(0);
    expect(standing.shadow_guild).toBe(0);
    expect(standing.peoples_front).toBe(0);
    expect(standing.old_faith).toBe(0);
  });

  it('applies partial overrides', () => {
    const standing = createFactionStanding({ iron_throne: 50, old_faith: -30 });
    expect(standing.iron_throne).toBe(50);
    expect(standing.shadow_guild).toBe(0);
    expect(standing.peoples_front).toBe(0);
    expect(standing.old_faith).toBe(-30);
  });

  it('clamps override values', () => {
    const standing = createFactionStanding({ iron_throne: 200, shadow_guild: -200 });
    expect(standing.iron_throne).toBe(100);
    expect(standing.shadow_guild).toBe(-100);
  });
});

// ─── getReputation ─────────────────────────────────────────────────────────

describe('getReputation', () => {
  it('returns the correct value for each faction', () => {
    const standing = makeStanding({ iron_throne: 42, shadow_guild: -17 });
    expect(getReputation(standing, 'iron_throne')).toBe(42);
    expect(getReputation(standing, 'shadow_guild')).toBe(-17);
    expect(getReputation(standing, 'peoples_front')).toBe(0);
  });
});

// ─── getReputationTier ─────────────────────────────────────────────────────

describe('getReputationTier', () => {
  it('maps to despised for -100 to -61', () => {
    expect(getReputationTier(-100)).toBe('despised');
    expect(getReputationTier(-61)).toBe('despised');
    expect(getReputationTier(-80)).toBe('despised');
  });

  it('maps to hostile for -60 to -21', () => {
    expect(getReputationTier(-60)).toBe('hostile');
    expect(getReputationTier(-21)).toBe('hostile');
    expect(getReputationTier(-40)).toBe('hostile');
  });

  it('maps to neutral for -20 to +20', () => {
    expect(getReputationTier(-20)).toBe('neutral');
    expect(getReputationTier(0)).toBe('neutral');
    expect(getReputationTier(20)).toBe('neutral');
  });

  it('maps to friendly for +21 to +60', () => {
    expect(getReputationTier(21)).toBe('friendly');
    expect(getReputationTier(60)).toBe('friendly');
    expect(getReputationTier(40)).toBe('friendly');
  });

  it('maps to honored for +61 to +89', () => {
    expect(getReputationTier(61)).toBe('honored');
    expect(getReputationTier(89)).toBe('honored');
    expect(getReputationTier(75)).toBe('honored');
  });

  it('maps to exalted for +90 to +100', () => {
    expect(getReputationTier(90)).toBe('exalted');
    expect(getReputationTier(100)).toBe('exalted');
    expect(getReputationTier(95)).toBe('exalted');
  });

  it('clamps out-of-range values before tier mapping', () => {
    expect(getReputationTier(150)).toBe('exalted');
    expect(getReputationTier(-150)).toBe('despised');
  });
});

// ─── getAllReputationTiers ──────────────────────────────────────────────────

describe('getAllReputationTiers', () => {
  it('returns tiers for all factions', () => {
    const standing = makeStanding({
      iron_throne: 95,
      shadow_guild: -70,
      peoples_front: 0,
      old_faith: 45,
    });
    const tiers = getAllReputationTiers(standing);
    expect(tiers.iron_throne).toBe('exalted');
    expect(tiers.shadow_guild).toBe('despised');
    expect(tiers.peoples_front).toBe('neutral');
    expect(tiers.old_faith).toBe('friendly');
  });
});

// ─── updateReputation ──────────────────────────────────────────────────────

describe('updateReputation', () => {
  it('adds positive delta', () => {
    const standing = makeStanding();
    const result = updateReputation(standing, 'iron_throne', 25);
    expect(result.iron_throne).toBe(25);
  });

  it('adds negative delta', () => {
    const standing = makeStanding({ shadow_guild: 30 });
    const result = updateReputation(standing, 'shadow_guild', -50);
    expect(result.shadow_guild).toBe(-20);
  });

  it('clamps at maximum', () => {
    const standing = makeStanding({ iron_throne: 90 });
    const result = updateReputation(standing, 'iron_throne', 50);
    expect(result.iron_throne).toBe(100);
  });

  it('clamps at minimum', () => {
    const standing = makeStanding({ old_faith: -90 });
    const result = updateReputation(standing, 'old_faith', -50);
    expect(result.old_faith).toBe(-100);
  });

  it('does not mutate original standing', () => {
    const standing = makeStanding({ iron_throne: 50 });
    const result = updateReputation(standing, 'iron_throne', 10);
    expect(standing.iron_throne).toBe(50);
    expect(result.iron_throne).toBe(60);
  });

  it('does not affect other factions', () => {
    const standing = makeStanding({ iron_throne: 10, shadow_guild: 20 });
    const result = updateReputation(standing, 'iron_throne', 30);
    expect(result.shadow_guild).toBe(20);
  });
});

// ─── setReputation ─────────────────────────────────────────────────────────

describe('setReputation', () => {
  it('sets exact value', () => {
    const standing = makeStanding();
    const result = setReputation(standing, 'peoples_front', 75);
    expect(result.peoples_front).toBe(75);
  });

  it('clamps the set value', () => {
    const standing = makeStanding();
    expect(setReputation(standing, 'iron_throne', 150).iron_throne).toBe(100);
    expect(setReputation(standing, 'iron_throne', -150).iron_throne).toBe(-100);
  });

  it('does not mutate original', () => {
    const standing = makeStanding();
    setReputation(standing, 'iron_throne', 50);
    expect(standing.iron_throne).toBe(0);
  });
});

// ─── updateReputationWithRipple ────────────────────────────────────────────

describe('updateReputationWithRipple', () => {
  it('applies primary delta to target faction', () => {
    const standing = makeStanding();
    const result = updateReputationWithRipple(standing, 'iron_throne', 20);
    expect(result.iron_throne).toBe(20);
  });

  it('applies positive ripple to allied factions', () => {
    const standing = makeStanding();
    // Iron Throne +20 → Old Faith gets +20 * 0.2 = +4
    const result = updateReputationWithRipple(standing, 'iron_throne', 20);
    expect(result.old_faith).toBe(4);
  });

  it('applies negative ripple to rival factions', () => {
    const standing = makeStanding();
    // Iron Throne +20 → People's Front gets +20 * -0.3 = -6
    const result = updateReputationWithRipple(standing, 'iron_throne', 20);
    expect(result.peoples_front).toBe(-6);
  });

  it('ripple is proportional to delta magnitude', () => {
    const standing = makeStanding();
    // Iron Throne +50 → People's Front gets +50 * -0.3 = -15
    const result = updateReputationWithRipple(standing, 'iron_throne', 50);
    expect(result.peoples_front).toBe(-15);
  });

  it('negative delta causes inverse ripple', () => {
    const standing = makeStanding();
    // Iron Throne -20 → Old Faith gets -20 * 0.2 = -4
    const result = updateReputationWithRipple(standing, 'iron_throne', -20);
    expect(result.iron_throne).toBe(-20);
    expect(result.old_faith).toBe(-4);
    // Peoples Front gets -20 * -0.3 = +6
    expect(result.peoples_front).toBe(6);
  });

  it('clamps all ripple results', () => {
    const standing = makeStanding({ peoples_front: -98 });
    // Iron Throne +50 → People's Front gets -15, so -98 + -15 = -113 → -100
    const result = updateReputationWithRipple(standing, 'iron_throne', 50);
    expect(result.peoples_front).toBe(-100);
  });

  it('skips ripple when disabled', () => {
    const standing = makeStanding();
    const result = updateReputationWithRipple(standing, 'iron_throne', 50, false);
    expect(result.iron_throne).toBe(50);
    expect(result.shadow_guild).toBe(0);
    expect(result.peoples_front).toBe(0);
    expect(result.old_faith).toBe(0);
  });

  it('does not mutate original', () => {
    const standing = makeStanding();
    updateReputationWithRipple(standing, 'iron_throne', 50);
    expect(standing.iron_throne).toBe(0);
  });
});

// ─── batchUpdateReputation ─────────────────────────────────────────────────

describe('batchUpdateReputation', () => {
  it('applies multiple changes', () => {
    const standing = makeStanding();
    const result = batchUpdateReputation(standing, [
      { factionId: 'iron_throne', delta: 30 },
      { factionId: 'shadow_guild', delta: -20 },
    ]);
    expect(result.iron_throne).toBe(30);
    expect(result.shadow_guild).toBe(-20);
    expect(result.peoples_front).toBe(0);
  });

  it('handles multiple changes to same faction (additive)', () => {
    const standing = makeStanding();
    const result = batchUpdateReputation(standing, [
      { factionId: 'iron_throne', delta: 30 },
      { factionId: 'iron_throne', delta: 20 },
    ]);
    expect(result.iron_throne).toBe(50);
  });

  it('clamps results', () => {
    const standing = makeStanding({ iron_throne: 90 });
    const result = batchUpdateReputation(standing, [
      { factionId: 'iron_throne', delta: 50 },
    ]);
    expect(result.iron_throne).toBe(100);
  });
});

// ─── meetsReputationThreshold ──────────────────────────────────────────────

describe('meetsReputationThreshold', () => {
  it('returns true when at or above threshold', () => {
    const standing = makeStanding({ iron_throne: 50 });
    expect(meetsReputationThreshold(standing, 'iron_throne', 50)).toBe(true);
    expect(meetsReputationThreshold(standing, 'iron_throne', 30)).toBe(true);
  });

  it('returns false when below threshold', () => {
    const standing = makeStanding({ iron_throne: 50 });
    expect(meetsReputationThreshold(standing, 'iron_throne', 51)).toBe(false);
  });

  it('works with negative thresholds', () => {
    const standing = makeStanding({ shadow_guild: -30 });
    expect(meetsReputationThreshold(standing, 'shadow_guild', -50)).toBe(true);
    expect(meetsReputationThreshold(standing, 'shadow_guild', -30)).toBe(true);
    expect(meetsReputationThreshold(standing, 'shadow_guild', 0)).toBe(false);
  });
});

// ─── meetsReputationTier ───────────────────────────────────────────────────

describe('meetsReputationTier', () => {
  it('returns true when at required tier', () => {
    const standing = makeStanding({ iron_throne: 50 });
    expect(meetsReputationTier(standing, 'iron_throne', 'friendly')).toBe(true);
  });

  it('returns true when above required tier', () => {
    const standing = makeStanding({ iron_throne: 95 });
    expect(meetsReputationTier(standing, 'iron_throne', 'neutral')).toBe(true);
    expect(meetsReputationTier(standing, 'iron_throne', 'friendly')).toBe(true);
  });

  it('returns false when below required tier', () => {
    const standing = makeStanding({ iron_throne: 10 });
    expect(meetsReputationTier(standing, 'iron_throne', 'friendly')).toBe(false);
  });
});

// ─── getHighestReputationFaction / getLowestReputationFaction ────────────────────────────

describe('getHighestReputationFaction', () => {
  it('returns faction with highest rep', () => {
    const standing = makeStanding({
      iron_throne: 10,
      shadow_guild: 50,
      peoples_front: 30,
      old_faith: 20,
    });
    expect(getHighestReputationFaction(standing)).toBe('shadow_guild');
  });

  it('returns first in canonical order on tie', () => {
    const standing = makeStanding(); // all 0
    expect(getHighestReputationFaction(standing)).toBe('iron_throne');
  });
});

describe('getLowestReputationFaction', () => {
  it('returns faction with lowest rep', () => {
    const standing = makeStanding({
      iron_throne: 10,
      shadow_guild: -50,
      peoples_front: 30,
      old_faith: -20,
    });
    expect(getLowestReputationFaction(standing)).toBe('shadow_guild');
  });
});

// ─── getReputationSummary ──────────────────────────────────────────────────

describe('getReputationSummary', () => {
  it('returns summary for all 4 factions', () => {
    const standing = makeStanding({ iron_throne: 50, shadow_guild: -100 });
    const summary = getReputationSummary(standing);
    expect(summary).toHaveLength(4);
  });

  it('computes percentage correctly', () => {
    const standing = makeStanding({ iron_throne: 0, shadow_guild: -100, peoples_front: 100 });
    const summary = getReputationSummary(standing);
    const ironThrone = summary.find((s) => s.factionId === 'iron_throne')!;
    const shadowGuild = summary.find((s) => s.factionId === 'shadow_guild')!;
    const peoplesFront = summary.find((s) => s.factionId === 'peoples_front')!;
    expect(ironThrone.percentage).toBe(50);     // 0 maps to 50%
    expect(shadowGuild.percentage).toBe(0);     // -100 maps to 0%
    expect(peoplesFront.percentage).toBe(100);  // +100 maps to 100%
  });

  it('includes correct tier info', () => {
    const standing = makeStanding({ iron_throne: 95 });
    const summary = getReputationSummary(standing);
    const ironThrone = summary.find((s) => s.factionId === 'iron_throne')!;
    expect(ironThrone.tier).toBe('exalted');
  });
});

// ─── applyReputationEffect ─────────────────────────────────────────────────

describe('applyReputationEffect', () => {
  it('updates game state factions with ripple', () => {
    const state = makeGameState();
    const result = applyReputationEffect(state, 'iron_throne', 20, true);
    expect(result.factions.iron_throne).toBe(20);
    // Ripple: old_faith gets +4
    expect(result.factions.old_faith).toBe(4);
  });

  it('updates game state factions without ripple', () => {
    const state = makeGameState();
    const result = applyReputationEffect(state, 'iron_throne', 20, false);
    expect(result.factions.iron_throne).toBe(20);
    expect(result.factions.old_faith).toBe(0);
  });

  it('does not mutate original game state', () => {
    const state = makeGameState();
    applyReputationEffect(state, 'iron_throne', 50);
    expect(state.factions.iron_throne).toBe(0);
  });
});

// ─── validateFactionStanding ───────────────────────────────────────────────

describe('validateFactionStanding', () => {
  it('returns true for valid standings', () => {
    const standing = makeStanding({ iron_throne: 50, shadow_guild: -50 });
    expect(validateFactionStanding(standing)).toBe(true);
  });

  it('returns violations for out-of-range values', () => {
    const standing: FactionStanding = {
      iron_throne: 150,
      shadow_guild: -200,
      peoples_front: 0,
      old_faith: 50,
    };
    const result = validateFactionStanding(standing);
    expect(result).not.toBe(true);
    if (result !== true) {
      expect(result).toHaveLength(2);
      expect(result[0].factionId).toBe('iron_throne');
      expect(result[1].factionId).toBe('shadow_guild');
    }
  });
});

// ─── sanitizeFactionStanding ───────────────────────────────────────────────

describe('sanitizeFactionStanding', () => {
  it('clamps all values to valid range', () => {
    const dirty: FactionStanding = {
      iron_throne: 200,
      shadow_guild: -300,
      peoples_front: 50,
      old_faith: 100,
    };
    const clean = sanitizeFactionStanding(dirty);
    expect(clean.iron_throne).toBe(100);
    expect(clean.shadow_guild).toBe(-100);
    expect(clean.peoples_front).toBe(50);
    expect(clean.old_faith).toBe(100);
  });
});

// ─── RIPPLE_MATRIX integrity ───────────────────────────────────────────────

describe('RIPPLE_MATRIX', () => {
  it('has entries for all 4 factions', () => {
    for (const factionId of ALL_FACTION_IDS) {
      expect(RIPPLE_MATRIX[factionId]).toBeDefined();
    }
  });

  it('self-ripple is always 0', () => {
    for (const factionId of ALL_FACTION_IDS) {
      expect(RIPPLE_MATRIX[factionId][factionId]).toBe(0);
    }
  });

  it('all multipliers are in reasonable range [-1, 1]', () => {
    for (const factionId of ALL_FACTION_IDS) {
      for (const otherId of ALL_FACTION_IDS) {
        const val = RIPPLE_MATRIX[factionId][otherId];
        expect(val).toBeGreaterThanOrEqual(-1);
        expect(val).toBeLessThanOrEqual(1);
      }
    }
  });
});
