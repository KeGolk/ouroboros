/**
 * Tests for the Stat-Based Narrative & Dialogue Check System
 *
 * Covers:
 * - Stat modifier calculations
 * - Threshold (deterministic) checks
 * - Rolled (d20) checks with deterministic roll injection
 * - Dialogue option filtering by stat thresholds
 * - Categorization of options (available/locked/hidden)
 * - Multi-check system (AND/OR logic)
 * - Faction reputation modifiers
 * - Tooltip and stat tag generation
 * - Narrative text generation
 * - All skill check type mappings
 */

import {
  performDialogueCheck,
  performThresholdCheck,
  isDialogueOptionAvailable,
  filterDialogueOptions,
  categorizeDialogueOptions,
  attemptDialogueOption,
  performMultiCheck,
  getEffectiveStatValue,
  getStatModifier,
  getFactionBonus,
  determineOutcome,
  resolveCheckStats,
  generateCheckTooltip,
  generateStatTag,
  getReputationModifier,
  SKILL_CHECK_STATS,
  NARRATIVE_CHECK_PRESETS,
  DialogueDifficulty,
} from '../dialogue-checks';
import type {
  DialogueCheckConfig,
  ConditionalDialogue,
  DialogueCheckResult,
} from '../dialogue-checks';
import type { GameState, PlayerStats, FactionStanding } from '../types';

// ─── Test Helpers ───────────────────────────────────────────────────────────

function createTestState(overrides: {
  stats?: Partial<PlayerStats>;
  factions?: Partial<FactionStanding>;
  flags?: Record<string, boolean>;
} = {}): GameState {
  return {
    saveId: 'test_save',
    playerName: 'Test Player',
    currentChapterId: 'ch1',
    currentSceneId: 'scene1',
    stats: {
      strength: 10,
      dexterity: 10,
      intelligence: 10,
      wisdom: 10,
      constitution: 10,
      charisma: 10,
      influence: 0,
      cunning: 10,
      diplomacy: 50,
      ...overrides.stats,
    },
    factions: {
      iron_throne: 0,
      shadow_guild: 0,
      peoples_front: 0,
      old_faith: 0,
      ...overrides.factions,
    },
    flags: overrides.flags ?? {},
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

// ─── Stat Modifier Calculations ─────────────────────────────────────────────

describe('getStatModifier', () => {
  test('returns 0 for stat value 10', () => {
    expect(getStatModifier(10)).toBe(0);
  });

  test('returns positive modifier for high stats', () => {
    expect(getStatModifier(14)).toBe(2);
    expect(getStatModifier(18)).toBe(4);
    expect(getStatModifier(20)).toBe(5);
  });

  test('returns negative modifier for low stats', () => {
    expect(getStatModifier(8)).toBe(-1);
    expect(getStatModifier(6)).toBe(-2);
    expect(getStatModifier(3)).toBe(-4);
  });

  test('follows D&D floor((stat-10)/2) formula', () => {
    expect(getStatModifier(11)).toBe(0);
    expect(getStatModifier(12)).toBe(1);
    expect(getStatModifier(13)).toBe(1);
    expect(getStatModifier(9)).toBe(-1);
  });
});

describe('getEffectiveStatValue', () => {
  test('returns primary stat when no secondary', () => {
    const stats: PlayerStats = {
      strength: 10, dexterity: 10, intelligence: 10,
      wisdom: 12, constitution: 10, charisma: 16,
      influence: 0, cunning: 14, diplomacy: 50,
    };
    expect(getEffectiveStatValue(stats, 'charisma')).toBe(16);
  });

  test('adds floor(secondary/4) when secondary provided', () => {
    const stats: PlayerStats = {
      strength: 10, dexterity: 10, intelligence: 10,
      wisdom: 12, constitution: 10, charisma: 16,
      influence: 0, cunning: 14, diplomacy: 50,
    };
    // charisma(16) + floor(diplomacy(50)/4) = 16 + 12 = 28
    expect(getEffectiveStatValue(stats, 'charisma', 'diplomacy')).toBe(28);
  });

  test('secondary contribution is floored', () => {
    const stats: PlayerStats = {
      strength: 10, dexterity: 10, intelligence: 10,
      wisdom: 12, constitution: 10, charisma: 16,
      influence: 0, cunning: 14, diplomacy: 3,
    };
    // charisma(16) + floor(diplomacy(3)/4) = 16 + 0 = 16
    expect(getEffectiveStatValue(stats, 'charisma', 'diplomacy')).toBe(16);
  });
});

// ─── Faction Bonus ──────────────────────────────────────────────────────────

describe('getFactionBonus', () => {
  test('returns 0 when no faction config', () => {
    const factions: FactionStanding = {
      iron_throne: 50, shadow_guild: 0, peoples_front: 0, old_faith: 0,
    };
    expect(getFactionBonus(factions)).toBe(0);
  });

  test('positive standing gives positive bonus', () => {
    const factions: FactionStanding = {
      iron_throne: 60, shadow_guild: 0, peoples_front: 0, old_faith: 0,
    };
    // floor((60/20) * 1) = floor(3) = 3
    expect(getFactionBonus(factions, { faction: 'iron_throne', weight: 1 })).toBe(3);
  });

  test('negative standing gives negative bonus', () => {
    const factions: FactionStanding = {
      iron_throne: -40, shadow_guild: 0, peoples_front: 0, old_faith: 0,
    };
    // floor((-40/20) * 1) = floor(-2) = -2
    expect(getFactionBonus(factions, { faction: 'iron_throne', weight: 1 })).toBe(-2);
  });

  test('weight scales the bonus', () => {
    const factions: FactionStanding = {
      iron_throne: 40, shadow_guild: 0, peoples_front: 0, old_faith: 0,
    };
    // floor((40/20) * 2) = floor(4) = 4
    expect(getFactionBonus(factions, { faction: 'iron_throne', weight: 2 })).toBe(4);
  });
});

// ─── Outcome Determination ──────────────────────────────────────────────────

describe('determineOutcome', () => {
  test('critical success on natural 20', () => {
    expect(determineOutcome(25, 30, 20)).toBe('critical_success');
  });

  test('critical failure on natural 1', () => {
    expect(determineOutcome(6, 5, 1)).toBe('critical_failure');
  });

  test('success when total >= DC', () => {
    expect(determineOutcome(15, 12, 10)).toBe('success');
    expect(determineOutcome(12, 12, 10)).toBe('success');
  });

  test('critical success when exceeding DC by 10+', () => {
    expect(determineOutcome(25, 12, 15)).toBe('critical_success');
  });

  test('partial success when failed by 1-3', () => {
    expect(determineOutcome(11, 12, 8)).toBe('partial_success');
    expect(determineOutcome(9, 12, 8)).toBe('partial_success');
  });

  test('failure when failed by 4-9', () => {
    expect(determineOutcome(8, 12, 5)).toBe('failure');
  });

  test('critical failure when failed by 10+', () => {
    expect(determineOutcome(1, 12, 3)).toBe('critical_failure');
  });

  test('threshold checks ignore natural 20/1', () => {
    expect(determineOutcome(25, 30, undefined, true)).toBe('failure');
    expect(determineOutcome(35, 25, undefined, true)).toBe('critical_success');
  });
});

// ─── Skill Check Stat Resolution ────────────────────────────────────────────

describe('resolveCheckStats', () => {
  test('persuasion maps to charisma + diplomacy', () => {
    const result = resolveCheckStats({ type: 'persuasion', dc: 12 });
    expect(result.primary).toBe('charisma');
    expect(result.secondary).toBe('diplomacy');
  });

  test('deception maps to cunning + charisma', () => {
    const result = resolveCheckStats({ type: 'deception', dc: 12 });
    expect(result.primary).toBe('cunning');
    expect(result.secondary).toBe('charisma');
  });

  test('insight maps to wisdom (no secondary)', () => {
    const result = resolveCheckStats({ type: 'insight', dc: 12 });
    expect(result.primary).toBe('wisdom');
    expect(result.secondary).toBeUndefined();
  });

  test('custom uses provided stats', () => {
    const result = resolveCheckStats({
      type: 'custom',
      dc: 12,
      primaryStat: 'strength',
      secondaryStat: 'cunning',
    });
    expect(result.primary).toBe('strength');
    expect(result.secondary).toBe('cunning');
  });

  test('custom defaults primary to charisma if not provided', () => {
    const result = resolveCheckStats({ type: 'custom', dc: 12 });
    expect(result.primary).toBe('charisma');
  });

  test('overriding primary stat on named check', () => {
    const result = resolveCheckStats({
      type: 'persuasion',
      dc: 12,
      primaryStat: 'cunning',
    });
    expect(result.primary).toBe('cunning');
  });
});

// ─── Dialogue Check (Rolled) ────────────────────────────────────────────────

describe('performDialogueCheck (rolled)', () => {
  test('high stat + good roll = success', () => {
    const state = createTestState({ stats: { charisma: 18 } });
    const result = performDialogueCheck(
      { type: 'persuasion', dc: DialogueDifficulty.Medium },
      state,
      10, // deterministic roll
    );
    // roll(10) + modifier(floor((18+floor(diplomacy(50)/4)-10)/2) = floor((18+12-10)/2) = floor(10) = 10) = 20 >= 12
    expect(result.passed).toBe(true);
    expect(result.checkType).toBe('persuasion');
    expect(result.primaryStat).toBe('charisma');
    expect(result.roll).toBe(10);
    expect(result.isThresholdCheck).toBe(false);
  });

  test('low stat + poor roll = failure', () => {
    const state = createTestState({ stats: { charisma: 6 } });
    const result = performDialogueCheck(
      { type: 'persuasion', dc: DialogueDifficulty.Hard },
      state,
      3, // poor roll
    );
    expect(result.passed).toBe(false);
    expect(result.outcome).not.toBe('partial_success');
  });

  test('natural 20 always succeeds', () => {
    const state = createTestState({ stats: { charisma: 3 } });
    const result = performDialogueCheck(
      { type: 'persuasion', dc: DialogueDifficulty.Legendary },
      state,
      20,
    );
    expect(result.passed).toBe(true);
    expect(result.outcome).toBe('critical_success');
  });

  test('natural 1 always fails', () => {
    const state = createTestState({ stats: { charisma: 20 } });
    const result = performDialogueCheck(
      { type: 'persuasion', dc: DialogueDifficulty.Trivial },
      state,
      1,
    );
    expect(result.passed).toBe(false);
    expect(result.outcome).toBe('critical_failure');
  });

  test('faction bonus applies to roll', () => {
    const state = createTestState({
      stats: { charisma: 10 },
      factions: { iron_throne: 80 },
    });
    const result = performDialogueCheck(
      {
        type: 'persuasion',
        dc: 12,
        factionBonus: { faction: 'iron_throne', weight: 1 },
      },
      state,
      10,
    );
    expect(result.factionBonus).toBe(4); // floor(80/20) = 4
    // total = roll(10) + modifier + factionBonus(4)
    expect(result.factionBonus).toBeGreaterThan(0);
  });

  test('situational modifier applies', () => {
    const state = createTestState({ stats: { cunning: 10 } });
    const result = performDialogueCheck(
      {
        type: 'deception',
        dc: 15,
        situationalModifier: 5,
      },
      state,
      10,
    );
    expect(result.situationalBonus).toBe(5);
  });

  test('provides narrative text for each outcome', () => {
    const state = createTestState({ stats: { charisma: 14 } });
    const result = performDialogueCheck(
      { type: 'persuasion', dc: 12 },
      state,
      15,
    );
    expect(result.narrativeText).toBeTruthy();
    expect(typeof result.narrativeText).toBe('string');
    expect(result.narrativeText.length).toBeGreaterThan(0);
  });
});

// ─── Threshold Checks ───────────────────────────────────────────────────────

describe('performThresholdCheck', () => {
  test('passes when effective stat >= DC', () => {
    const state = createTestState({ stats: { charisma: 14 } });
    const result = performThresholdCheck(
      { type: 'persuasion', dc: 12 },
      state,
    );
    // effective = charisma(14) + floor(diplomacy(50)/4) = 14 + 12 = 26
    expect(result.passed).toBe(true);
    expect(result.isThresholdCheck).toBe(true);
    expect(result.roll).toBeUndefined();
  });

  test('fails when effective stat < DC', () => {
    const state = createTestState({ stats: { cunning: 5, charisma: 3 } });
    const result = performThresholdCheck(
      { type: 'deception', dc: 20 },
      state,
    );
    // effective = cunning(5) + floor(charisma(3)/4) = 5 + 0 = 5
    expect(result.passed).toBe(false);
    expect(result.isThresholdCheck).toBe(true);
  });

  test('threshold check is deterministic (no randomness)', () => {
    const state = createTestState({ stats: { wisdom: 15 } });
    const results: DialogueCheckResult[] = [];
    for (let i = 0; i < 10; i++) {
      results.push(performThresholdCheck(
        { type: 'insight', dc: 14 },
        state,
      ));
    }
    // All results should be identical
    const first = results[0];
    expect(results.every(r => r.passed === first.passed)).toBe(true);
    expect(results.every(r => r.playerTotal === first.playerTotal)).toBe(true);
  });
});

// ─── Dialogue Option Filtering ──────────────────────────────────────────────

describe('isDialogueOptionAvailable', () => {
  const baseOption: ConditionalDialogue = {
    id: 'opt1',
    text: '[CHA 14] Convince the guard to let you pass',
    checkType: 'persuasion',
    statThreshold: 14,
    primaryStat: 'charisma',
  };

  test('available when stat meets threshold', () => {
    const state = createTestState({ stats: { charisma: 14 } });
    expect(isDialogueOptionAvailable(baseOption, state)).toBe(true);
  });

  test('available when stat exceeds threshold', () => {
    const state = createTestState({ stats: { charisma: 18 } });
    expect(isDialogueOptionAvailable(baseOption, state)).toBe(true);
  });

  test('unavailable when stat below threshold', () => {
    const state = createTestState({ stats: { charisma: 12 } });
    expect(isDialogueOptionAvailable(baseOption, state)).toBe(false);
  });

  test('checks additional conditions', () => {
    const optionWithConditions: ConditionalDialogue = {
      ...baseOption,
      additionalConditions: [
        { type: 'flag', flag: 'met_the_king', value: true },
      ],
    };
    const stateNoFlag = createTestState({ stats: { charisma: 14 } });
    expect(isDialogueOptionAvailable(optionWithConditions, stateNoFlag)).toBe(false);

    const stateWithFlag = createTestState({
      stats: { charisma: 14 },
      flags: { met_the_king: true },
    });
    expect(isDialogueOptionAvailable(optionWithConditions, stateWithFlag)).toBe(true);
  });

  test('considers secondary stat in effective value', () => {
    const optionWithSecondary: ConditionalDialogue = {
      ...baseOption,
      statThreshold: 16,
      secondaryStat: 'diplomacy',
    };
    // charisma(14) + floor(diplomacy(50)/4) = 14 + 12 = 26 >= 16
    const state = createTestState({ stats: { charisma: 14 } });
    expect(isDialogueOptionAvailable(optionWithSecondary, state)).toBe(true);
  });
});

describe('filterDialogueOptions', () => {
  const options: ConditionalDialogue[] = [
    {
      id: 'easy',
      text: '[CHA 8] A simple request',
      checkType: 'persuasion',
      statThreshold: 8,
      primaryStat: 'charisma',
    },
    {
      id: 'medium',
      text: '[CHA 14] A compelling argument',
      checkType: 'persuasion',
      statThreshold: 14,
      primaryStat: 'charisma',
    },
    {
      id: 'hard',
      text: '[CUN 18] A masterful deception',
      checkType: 'deception',
      statThreshold: 18,
      primaryStat: 'cunning',
    },
  ];

  test('returns only options that meet stat thresholds', () => {
    const state = createTestState({ stats: { charisma: 14, cunning: 10 } });
    const available = filterDialogueOptions(options, state);
    expect(available.map(o => o.id)).toEqual(['easy', 'medium']);
  });

  test('returns all options for high stats', () => {
    const state = createTestState({ stats: { charisma: 20, cunning: 20 } });
    const available = filterDialogueOptions(options, state);
    expect(available).toHaveLength(3);
  });

  test('returns only easy options for low stats', () => {
    const state = createTestState({ stats: { charisma: 8, cunning: 5 } });
    const available = filterDialogueOptions(options, state);
    expect(available.map(o => o.id)).toEqual(['easy']);
  });
});

describe('categorizeDialogueOptions', () => {
  const options: ConditionalDialogue[] = [
    {
      id: 'visible_unlocked',
      text: '[CHA 8] Easy option',
      checkType: 'persuasion',
      statThreshold: 8,
      primaryStat: 'charisma',
    },
    {
      id: 'visible_locked',
      text: '[CUN 18] Hard option',
      checkType: 'deception',
      statThreshold: 18,
      primaryStat: 'cunning',
      hideIfUnqualified: false,
    },
    {
      id: 'hidden_locked',
      text: '[WIS 20] Secret option',
      checkType: 'insight',
      statThreshold: 20,
      primaryStat: 'wisdom',
      hideIfUnqualified: true,
    },
  ];

  test('categorizes into available, locked, and hidden', () => {
    const state = createTestState({ stats: { charisma: 10, cunning: 10, wisdom: 10 } });
    const { available, locked, hidden } = categorizeDialogueOptions(options, state);

    expect(available.map(o => o.id)).toEqual(['visible_unlocked']);
    expect(locked.map(o => o.id)).toEqual(['visible_locked']);
    expect(hidden.map(o => o.id)).toEqual(['hidden_locked']);
  });

  test('all available for high stats', () => {
    const state = createTestState({ stats: { charisma: 20, cunning: 20, wisdom: 20 } });
    const { available, locked, hidden } = categorizeDialogueOptions(options, state);
    expect(available).toHaveLength(3);
    expect(locked).toHaveLength(0);
    expect(hidden).toHaveLength(0);
  });
});

// ─── Attempt Dialogue Option ────────────────────────────────────────────────

describe('attemptDialogueOption', () => {
  const option: ConditionalDialogue = {
    id: 'persuade_noble',
    text: '[CHA 14] Persuade the noble',
    checkType: 'persuasion',
    statThreshold: 14,
    primaryStat: 'charisma',
    attemptDC: 14,
    successSceneId: 'noble_convinced',
    failureSceneId: 'noble_angry',
    partialSceneId: 'noble_hesitant',
    successEffects: [{ type: 'faction', faction: 'iron_throne', delta: 10 }],
    failureEffects: [{ type: 'faction', faction: 'iron_throne', delta: -5 }],
    partialEffects: [{ type: 'faction', faction: 'iron_throne', delta: 3 }],
  };

  test('success returns success effects and scene', () => {
    const state = createTestState({ stats: { charisma: 16 } });
    const { result, effects, nextSceneId } = attemptDialogueOption(option, state, 15);
    expect(result.passed).toBe(true);
    expect(effects).toEqual(option.successEffects);
    expect(nextSceneId).toBe('noble_convinced');
  });

  test('failure returns failure effects and scene', () => {
    const state = createTestState({ stats: { charisma: 6 } });
    const { result, effects, nextSceneId } = attemptDialogueOption(option, state, 2);
    expect(result.passed).toBe(false);
    expect(result.isPartial).toBe(false);
    expect(effects).toEqual(option.failureEffects);
    expect(nextSceneId).toBe('noble_angry');
  });

  test('partial success returns partial effects and scene', () => {
    const state = createTestState({ stats: { charisma: 10 } });
    // Need a roll that gives a total close to DC but not quite
    // stat modifier for charisma(10)+floor(diplomacy(50)/4)=22: mod = floor((22-10)/2) = 6
    // total = roll + 6 needs to be 11-13 for partial (DC-3 to DC-1)
    // So roll needs to be 5, 6, or 7
    const { result, effects, nextSceneId } = attemptDialogueOption(option, state, 5);
    // total = 5 + 6 = 11, DC = 14, margin = -3 → partial
    expect(result.isPartial).toBe(true);
    expect(effects).toEqual(option.partialEffects);
    expect(nextSceneId).toBe('noble_hesitant');
  });
});

// ─── Multi-Check System ────────────────────────────────────────────────────

describe('performMultiCheck', () => {
  test('all required checks must pass', () => {
    const state = createTestState({ stats: { cunning: 14, wisdom: 14 } });
    const result = performMultiCheck(
      {
        requiredChecks: [
          { type: 'deception', dc: 10 },
          { type: 'insight', dc: 10 },
        ],
      },
      state,
      [15, 15], // both good rolls
    );
    expect(result.overallSuccess).toBe(true);
    expect(result.results).toHaveLength(2);
  });

  test('fails if any required check fails', () => {
    const state = createTestState({ stats: { cunning: 14, wisdom: 5 } });
    const result = performMultiCheck(
      {
        requiredChecks: [
          { type: 'deception', dc: 10 },
          { type: 'insight', dc: 20 },
        ],
      },
      state,
      [15, 2], // second roll fails
    );
    expect(result.overallSuccess).toBe(false);
  });

  test('alternative checks need at least one to pass', () => {
    const state = createTestState({ stats: { charisma: 14, cunning: 8, strength: 16 } });
    const result = performMultiCheck(
      {
        alternativeChecks: [
          { type: 'persuasion', dc: 20 },      // hard
          { type: 'intimidation', dc: 12 },     // easier with high STR
        ],
      },
      state,
      [3, 15], // first fails, second passes
    );
    expect(result.overallSuccess).toBe(true);
  });

  test('minAlternativePasses requires specific count', () => {
    const state = createTestState({ stats: { charisma: 14 } });
    const result = performMultiCheck(
      {
        alternativeChecks: [
          { type: 'persuasion', dc: 10 },
          { type: 'diplomacy', dc: 10 },
          { type: 'negotiation', dc: 10 },
        ],
        minAlternativePasses: 2,
      },
      state,
      [15, 15, 2], // two pass, one fails
    );
    expect(result.overallSuccess).toBe(true);
    expect(result.passedCount).toBeGreaterThanOrEqual(2);
  });

  test('reports pass count and total', () => {
    const state = createTestState({ stats: { charisma: 14 } });
    const result = performMultiCheck(
      {
        requiredChecks: [{ type: 'persuasion', dc: 10 }],
        alternativeChecks: [
          { type: 'diplomacy', dc: 10 },
          { type: 'negotiation', dc: 10 },
        ],
      },
      state,
      [15, 15, 2],
    );
    expect(result.totalCount).toBe(3);
  });
});

// ─── Reputation Modifier ───────────────────────────────────────────────────

describe('getReputationModifier', () => {
  test('returns 0 with neutral standing', () => {
    const state = createTestState();
    expect(getReputationModifier(state)).toBe(0);
  });

  test('positive faction standing gives bonus', () => {
    const state = createTestState({ factions: { iron_throne: 75 } });
    const mod = getReputationModifier(state, undefined, 'iron_throne');
    expect(mod).toBe(3); // floor(75/25) = 3
  });

  test('negative faction standing gives penalty', () => {
    const state = createTestState({ factions: { shadow_guild: -50 } });
    const mod = getReputationModifier(state, undefined, 'shadow_guild');
    expect(mod).toBe(-2); // floor(-50/25) = -2
  });

  test('high diplomacy adds +1', () => {
    const state = createTestState({ stats: { diplomacy: 80 } });
    const mod = getReputationModifier(state);
    expect(mod).toBe(1);
  });

  test('high cunning adds +1', () => {
    const state = createTestState({ stats: { cunning: 80 } });
    const mod = getReputationModifier(state);
    expect(mod).toBe(1);
  });

  test('clamped to [-5, +5]', () => {
    const state = createTestState({
      factions: { iron_throne: 100 },
      stats: { diplomacy: 100 },
    });
    const mod = getReputationModifier(state, undefined, 'iron_throne');
    expect(mod).toBeLessThanOrEqual(5);
    expect(mod).toBeGreaterThanOrEqual(-5);
  });
});

// ─── Tooltip & Tag Generation ───────────────────────────────────────────────

describe('generateStatTag', () => {
  test('generates simple stat tag', () => {
    expect(generateStatTag('charisma', 14)).toBe('[CHA 14]');
  });

  test('generates compound stat tag with secondary', () => {
    expect(generateStatTag('cunning', 16, 'influence')).toBe('[CUN 16 + INF]');
  });

  test('generates tag for wisdom', () => {
    expect(generateStatTag('wisdom', 12)).toBe('[WIS 12]');
  });
});

describe('generateCheckTooltip', () => {
  test('generates tooltip with pass indicator', () => {
    const option: ConditionalDialogue = {
      id: 'test',
      text: 'Test',
      checkType: 'persuasion',
      statThreshold: 14,
      primaryStat: 'charisma',
    };
    const passingState = createTestState({ stats: { charisma: 16 } });
    const tooltip = generateCheckTooltip(option, passingState);
    expect(tooltip).toContain('[CHA 14]');
    expect(tooltip).toContain('Your CHA: 16');
    expect(tooltip).toContain('✓');
  });

  test('shows failure indicator when under threshold', () => {
    const option: ConditionalDialogue = {
      id: 'test',
      text: 'Test',
      checkType: 'deception',
      statThreshold: 18,
      primaryStat: 'cunning',
    };
    const failingState = createTestState({ stats: { cunning: 10 } });
    const tooltip = generateCheckTooltip(option, failingState);
    expect(tooltip).toContain('✗');
  });

  test('shows secondary stat info', () => {
    const option: ConditionalDialogue = {
      id: 'test',
      text: 'Test',
      checkType: 'diplomacy',
      statThreshold: 14,
      primaryStat: 'charisma',
      secondaryStat: 'diplomacy',
    };
    const state = createTestState();
    const tooltip = generateCheckTooltip(option, state);
    expect(tooltip).toContain('+DIP');
  });
});

// ─── Skill Check Type Coverage ──────────────────────────────────────────────

describe('SKILL_CHECK_STATS completeness', () => {
  const expectedTypes: Array<Exclude<import('../dialogue-checks').SkillCheckType, 'custom'>> = [
    'persuasion', 'intimidation', 'deception', 'insight', 'investigation',
    'diplomacy', 'manipulation', 'lore', 'perception', 'negotiation',
    'scheme', 'inspire',
  ];

  test('all skill check types have stat mappings', () => {
    for (const type of expectedTypes) {
      expect(SKILL_CHECK_STATS[type]).toBeDefined();
      expect(SKILL_CHECK_STATS[type].primary).toBeDefined();
      expect(SKILL_CHECK_STATS[type].description).toBeTruthy();
    }
  });

  test('all types use INT/WIS/CHA/Influence-like stats', () => {
    const narrativeStats = ['charisma', 'wisdom', 'cunning', 'strength', 'diplomacy', 'influence'];
    for (const type of expectedTypes) {
      const mapping = SKILL_CHECK_STATS[type];
      expect(narrativeStats).toContain(mapping.primary);
      if (mapping.secondary) {
        expect(narrativeStats).toContain(mapping.secondary);
      }
    }
  });
});

// ─── Narrative Check Presets ────────────────────────────────────────────────

describe('NARRATIVE_CHECK_PRESETS', () => {
  test('convinceGuard creates valid config', () => {
    const config = NARRATIVE_CHECK_PRESETS.convinceGuard();
    expect(config.type).toBe('persuasion');
    expect(config.dc).toBe(DialogueDifficulty.Medium);
    expect(config.narrativeTemplates).toBeDefined();
    expect(config.narrativeTemplates?.critical_success).toBeTruthy();
  });

  test('readIntentions creates valid config', () => {
    const config = NARRATIVE_CHECK_PRESETS.readIntentions(20);
    expect(config.type).toBe('insight');
    expect(config.dc).toBe(20);
  });

  test('brokerPeace uses diplomacy', () => {
    const config = NARRATIVE_CHECK_PRESETS.brokerPeace();
    expect(config.type).toBe('diplomacy');
    expect(config.dc).toBe(DialogueDifficulty.VeryHard);
  });

  test('plotScheme uses scheme', () => {
    const config = NARRATIVE_CHECK_PRESETS.plotScheme();
    expect(config.type).toBe('scheme');
  });

  test('rallyTroops uses inspire', () => {
    const config = NARRATIVE_CHECK_PRESETS.rallyTroops();
    expect(config.type).toBe('inspire');
  });

  test('decipherLore uses lore', () => {
    const config = NARRATIVE_CHECK_PRESETS.decipherLore();
    expect(config.type).toBe('lore');
  });

  test('all presets produce working checks', () => {
    const state = createTestState({ stats: { charisma: 14, cunning: 14, wisdom: 14 } });
    const presets = [
      NARRATIVE_CHECK_PRESETS.convinceGuard(),
      NARRATIVE_CHECK_PRESETS.readIntentions(),
      NARRATIVE_CHECK_PRESETS.brokerPeace(),
      NARRATIVE_CHECK_PRESETS.plotScheme(),
      NARRATIVE_CHECK_PRESETS.rallyTroops(),
      NARRATIVE_CHECK_PRESETS.decipherLore(),
      NARRATIVE_CHECK_PRESETS.bluff(),
      NARRATIVE_CHECK_PRESETS.negotiateTrade(),
    ];

    for (const preset of presets) {
      const result = performDialogueCheck(preset, state, 10);
      expect(result.checkType).toBeTruthy();
      expect(result.narrativeText).toBeTruthy();
      expect(typeof result.passed).toBe('boolean');
    }
  });
});

// ─── Difficulty Tiers ───────────────────────────────────────────────────────

describe('DialogueDifficulty', () => {
  test('difficulty tiers are ordered', () => {
    expect(DialogueDifficulty.Trivial).toBeLessThan(DialogueDifficulty.Easy);
    expect(DialogueDifficulty.Easy).toBeLessThan(DialogueDifficulty.Medium);
    expect(DialogueDifficulty.Medium).toBeLessThan(DialogueDifficulty.Hard);
    expect(DialogueDifficulty.Hard).toBeLessThan(DialogueDifficulty.VeryHard);
    expect(DialogueDifficulty.VeryHard).toBeLessThan(DialogueDifficulty.Legendary);
    expect(DialogueDifficulty.Legendary).toBeLessThan(DialogueDifficulty.Impossible);
  });
});

// ─── Integration: End-to-End Dialogue Flow ─────────────────────────────────

describe('End-to-End: Political Intrigue Dialogue', () => {
  const dialogueOptions: ConditionalDialogue[] = [
    {
      id: 'polite_request',
      text: 'Politely ask for an audience.',
      checkType: 'persuasion',
      statThreshold: 0, // Always available
      primaryStat: 'charisma',
    },
    {
      id: 'bribe_guard',
      text: '[CUN 12] Bribe the guard with a knowing look.',
      checkType: 'manipulation',
      statThreshold: 12,
      primaryStat: 'cunning',
      attemptDC: 14,
      successSceneId: 'guard_bribed',
      failureSceneId: 'guard_suspicious',
    },
    {
      id: 'invoke_authority',
      text: '[CHA 16] Invoke your noble authority.',
      checkType: 'intimidation',
      statThreshold: 16,
      primaryStat: 'charisma',
      secondaryStat: 'diplomacy',
      attemptDC: 12,
      successSceneId: 'authority_recognized',
      failureSceneId: 'authority_rejected',
      hideIfUnqualified: false,
    },
    {
      id: 'secret_passage',
      text: '[WIS 18] Recall the old servant passages.',
      checkType: 'lore',
      statThreshold: 18,
      primaryStat: 'wisdom',
      attemptDC: 15,
      successSceneId: 'passage_found',
      failureSceneId: 'passage_lost',
      hideIfUnqualified: true,
    },
  ];

  test('average character sees basic + some skill options', () => {
    const state = createTestState({
      stats: { charisma: 14, cunning: 12, wisdom: 10, diplomacy: 5 },
    });

    const { available, locked, hidden } = categorizeDialogueOptions(dialogueOptions, state);

    expect(available.map(o => o.id)).toContain('polite_request');
    expect(available.map(o => o.id)).toContain('bribe_guard');
    // CHA 14 + floor(diplomacy(5)/4) = 14 + 1 = 15 < 16 threshold → locked
    expect(locked.map(o => o.id)).toContain('invoke_authority');
    expect(hidden.map(o => o.id)).toContain('secret_passage');
  });

  test('high-charisma character sees authority option', () => {
    const state = createTestState({
      stats: { charisma: 18, cunning: 14, wisdom: 10 },
    });

    const { available } = categorizeDialogueOptions(dialogueOptions, state);
    expect(available.map(o => o.id)).toContain('invoke_authority');
  });

  test('wise character discovers secret passage', () => {
    const state = createTestState({
      stats: { wisdom: 20 },
    });

    const { available } = categorizeDialogueOptions(dialogueOptions, state);
    expect(available.map(o => o.id)).toContain('secret_passage');
  });

  test('attempting bribe can succeed or fail based on check', () => {
    const state = createTestState({ stats: { cunning: 14 } });
    const bribeOption = dialogueOptions.find(o => o.id === 'bribe_guard')!;

    // Good roll
    const success = attemptDialogueOption(bribeOption, state, 15);
    expect(success.result.passed).toBe(true);
    expect(success.nextSceneId).toBe('guard_bribed');

    // Bad roll
    const failure = attemptDialogueOption(bribeOption, state, 1);
    expect(failure.result.passed).toBe(false);
    expect(failure.nextSceneId).toBe('guard_suspicious');
  });
});
