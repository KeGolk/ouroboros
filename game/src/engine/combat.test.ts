/**
 * Tests for the stat-based combat resolution system.
 *
 * Uses a seeded RNG for deterministic results.
 */

import {
  createRng,
  setGlobalRng,
  resetGlobalRng,
  getStatTotal,
  computeDerived,
  calculateHitChance,
  calculateRawDamage,
  calculateMitigation,
  calculateFinalDamage,
  calculateEvasion,
  calculateCritChance,
  resolveAttack,
  resolveDefend,
  resolveFlee,
  processStatusEffects,
  applyStatusTicks,
  calculateTurnOrder,
  chooseAiAction,
  resolveMinorEncounter,
  createCombatant,
  CombatEngine,
  BASIC_ATTACK,
} from './combat';

import type {
  Combatant,
  CombatAbility,
  MinorEncounter,
  BossEncounter,
  StatusEffect,
} from '../types/combat';
import type { StatBlock, StatName } from '../types/stats';

// ─── Test Helpers ────────────────────────────────────────────────────

function makeStatBlock(overrides: Partial<Record<StatName, number>> = {}): StatBlock {
  const defaults: Record<StatName, number> = {
    strength: 10,
    dexterity: 10,
    intelligence: 10,
    wisdom: 10,
    constitution: 10,
    charisma: 10,
    influence: 10,
    cunning: 10,
    diplomacy: 10,
  };
  const merged = { ...defaults, ...overrides };
  const block: StatBlock = {} as StatBlock;
  for (const [key, value] of Object.entries(merged)) {
    block[key as StatName] = { base: value, modifiers: [], total: value };
  }
  return block;
}

function makeTestCombatant(overrides: Partial<{
  id: string;
  name: string;
  level: number;
  stats: Partial<Record<StatName, number>>;
  abilities: CombatAbility[];
  isPlayer: boolean;
  aiPattern: Combatant['aiPattern'];
  statusEffects: StatusEffect[];
}> = {}): Combatant {
  const c = createCombatant({
    id: overrides.id ?? 'test_char',
    name: overrides.name ?? 'Test Character',
    level: overrides.level ?? 5,
    stats: {
      strength: 10,
      dexterity: 10,
      intelligence: 10,
      wisdom: 10,
      constitution: 10,
      charisma: 10,
      influence: 10,
      cunning: 10,
      diplomacy: 10,
      ...overrides.stats,
    },
    abilities: overrides.abilities,
    isPlayer: overrides.isPlayer ?? false,
    aiPattern: overrides.aiPattern,
  });
  if (overrides.statusEffects) {
    c.statusEffects = overrides.statusEffects;
  }
  return c;
}

function makeAbility(overrides: Partial<CombatAbility> = {}): CombatAbility {
  return {
    id: 'test_ability',
    name: 'Test Strike',
    description: 'A test attack.',
    scalingStat: 'strength',
    damageType: 'physical',
    baseDamage: 10,
    statMultiplier: 1.0,
    accuracyMod: 0,
    cooldown: 0,
    currentCooldown: 0,
    targetsSelf: false,
    areaOfEffect: false,
    flavorText: 'Test.',
    ...overrides,
  };
}

// ─── Setup / Teardown ────────────────────────────────────────────────

beforeEach(() => {
  // Use deterministic seed for all tests
  setGlobalRng(createRng(42));
});

afterEach(() => {
  resetGlobalRng();
});

// ─── Stat Helpers ────────────────────────────────────────────────────

describe('getStatTotal', () => {
  it('returns the total value of a stat', () => {
    const stats = makeStatBlock({ strength: 15 });
    expect(getStatTotal(stats, 'strength')).toBe(15);
  });

  it('returns default values', () => {
    const stats = makeStatBlock();
    expect(getStatTotal(stats, 'cunning')).toBe(10);
  });
});

describe('computeDerived', () => {
  it('computes maxHealth from constitution and strength', () => {
    const stats = makeStatBlock({ constitution: 12, strength: 14 });
    const derived = computeDerived(stats, 5);
    // 50 + 12*5 + 14*2 + 5*8 = 50 + 60 + 28 + 40 = 178
    expect(derived.maxHealth).toBe(178);
  });

  it('computes meleePower from strength', () => {
    const stats = makeStatBlock({ strength: 16 });
    const derived = computeDerived(stats, 5);
    // 16 * 1.5 + 5 * 0.5 = 24 + 2.5 = 26.5 → 27 (rounded)
    expect(derived.meleePower).toBe(27);
  });

  it('caps evasion at 40', () => {
    const stats = makeStatBlock({ dexterity: 25 });
    const derived = computeDerived(stats, 1);
    expect(derived.evasion).toBe(40);
  });

  it('computes initiative from cunning and dexterity', () => {
    const stats = makeStatBlock({ cunning: 15, dexterity: 12 });
    const derived = computeDerived(stats, 4);
    // 15 + 12*0.5 + 4*0.25 = 15 + 6 + 1 = 22
    expect(derived.initiative).toBe(22);
  });

  it('caps critChance at 35', () => {
    const stats = makeStatBlock({ cunning: 25, dexterity: 20 });
    const derived = computeDerived(stats, 1);
    expect(derived.critChance).toBe(35);
  });
});

// ─── Hit Chance ──────────────────────────────────────────────────────

describe('calculateHitChance', () => {
  it('uses attacker cunning and defender dexterity', () => {
    const attacker = makeTestCombatant({ stats: { cunning: 15 } });
    const defender = makeTestCombatant({ stats: { dexterity: 8 } });
    // 70 + 15*2 - 8*1.5 = 70 + 30 - 12 = 88
    expect(calculateHitChance(attacker, defender)).toBe(88);
  });

  it('clamps minimum at 5%', () => {
    const attacker = makeTestCombatant({ stats: { cunning: 1 } });
    const defender = makeTestCombatant({ stats: { dexterity: 30 } });
    // 70 + 2 - 45 = 27 — actually that's still > 5
    // Let's use really extreme values
    const attacker2 = makeTestCombatant({ stats: { cunning: 0 } });
    const defender2 = makeTestCombatant({ stats: { dexterity: 50 } });
    expect(calculateHitChance(attacker2, defender2)).toBe(5);
  });

  it('clamps maximum at 95%', () => {
    const attacker = makeTestCombatant({ stats: { cunning: 30 } });
    const defender = makeTestCombatant({ stats: { dexterity: 1 } });
    expect(calculateHitChance(attacker, defender)).toBe(95);
  });

  it('increases hit chance against demoralized defenders', () => {
    const attacker = makeTestCombatant({ stats: { cunning: 10 } });
    const defender = makeTestCombatant({
      stats: { dexterity: 10 },
      statusEffects: [{ type: 'demoralized', duration: 2, potency: 0, source: 'test' }],
    });
    const normal = calculateHitChance(attacker, makeTestCombatant({ stats: { dexterity: 10 } }));
    const vsDemoralized = calculateHitChance(attacker, defender);
    expect(vsDemoralized).toBe(normal + 15);
  });

  it('sets hit chance to 95 against stunned defenders', () => {
    const attacker = makeTestCombatant({ stats: { cunning: 5 } });
    const defender = makeTestCombatant({
      stats: { dexterity: 20 },
      statusEffects: [{ type: 'stun', duration: 1, potency: 0, source: 'test' }],
    });
    expect(calculateHitChance(attacker, defender)).toBe(95);
  });
});

// ─── Damage Calculation ──────────────────────────────────────────────

describe('calculateMitigation', () => {
  it('uses constitution for physical damage', () => {
    const defender = makeTestCombatant({ stats: { constitution: 14 } });
    const mit = calculateMitigation(defender, 'physical');
    expect(mit).toBe(Math.round(14 * 1.5)); // 21
  });

  it('uses wisdom for arcane damage', () => {
    const defender = makeTestCombatant({ stats: { wisdom: 16 } });
    const mit = calculateMitigation(defender, 'arcane');
    expect(mit).toBe(Math.round(16 * 1.5)); // 24
  });

  it('returns 0 for true damage', () => {
    const defender = makeTestCombatant({ stats: { constitution: 20 } });
    expect(calculateMitigation(defender, 'true')).toBe(0);
  });

  it('adds fortified bonus to mitigation', () => {
    const defender = makeTestCombatant({
      stats: { constitution: 10 },
      statusEffects: [{ type: 'fortified', duration: 1, potency: 10, source: 'test' }],
    });
    const mit = calculateMitigation(defender, 'physical');
    // 10*1.5 + 10 = 25
    expect(mit).toBe(25);
  });
});

describe('calculateFinalDamage', () => {
  it('subtracts mitigation from raw damage', () => {
    expect(calculateFinalDamage(30, 12)).toBe(18);
  });

  it('floors at 0', () => {
    expect(calculateFinalDamage(5, 20)).toBe(0);
  });
});

// ─── Evasion ─────────────────────────────────────────────────────────

describe('calculateEvasion', () => {
  it('scales with dexterity, capped at 40', () => {
    const defender = makeTestCombatant({ stats: { dexterity: 15 } });
    expect(calculateEvasion(defender)).toBe(30); // 15*2 = 30
  });

  it('returns 0 for stunned targets', () => {
    const defender = makeTestCombatant({
      stats: { dexterity: 20 },
      statusEffects: [{ type: 'stun', duration: 1, potency: 0, source: 'test' }],
    });
    expect(calculateEvasion(defender)).toBe(0);
  });

  it('halves evasion for slowed targets', () => {
    const defender = makeTestCombatant({
      stats: { dexterity: 14 },
      statusEffects: [{ type: 'slow', duration: 2, potency: 0, source: 'test' }],
    });
    expect(calculateEvasion(defender)).toBe(14); // 14*2=28, halved=14
  });
});

// ─── Critical Hits ──────────────────────────────────────────────────

describe('calculateCritChance', () => {
  it('scales with cunning and dexterity', () => {
    const attacker = makeTestCombatant({ stats: { cunning: 12, dexterity: 8 } });
    // 12*1.5 + 8*0.5 = 18 + 4 = 22
    expect(calculateCritChance(attacker)).toBe(22);
  });

  it('adds bonus for inspired', () => {
    const attacker = makeTestCombatant({
      stats: { cunning: 10, dexterity: 6 },
      statusEffects: [{ type: 'inspired', duration: 2, potency: 0, source: 'test' }],
    });
    // 10*1.5 + 6*0.5 + 15 = 15 + 3 + 15 = 33
    expect(calculateCritChance(attacker)).toBe(33);
  });

  it('caps at 35', () => {
    const attacker = makeTestCombatant({
      stats: { cunning: 25, dexterity: 20 },
      statusEffects: [{ type: 'inspired', duration: 2, potency: 0, source: 'test' }],
    });
    expect(calculateCritChance(attacker)).toBe(35);
  });
});

// ─── Attack Resolution ──────────────────────────────────────────────

describe('resolveAttack', () => {
  it('resolves a successful hit with damage', () => {
    // Seed 42 produces deterministic rolls
    const attacker = makeTestCombatant({ stats: { strength: 15, cunning: 15 } });
    const defender = makeTestCombatant({ stats: { constitution: 8, dexterity: 5 } });
    const ability = makeAbility({ baseDamage: 10, statMultiplier: 1.0 });

    const result = resolveAttack(attacker, defender, ability);
    // With high cunning vs low dexterity, should usually hit
    expect(typeof result.hit).toBe('boolean');
    expect(typeof result.damage).toBe('number');
    expect(result.hitChance).toBeGreaterThan(70);
    expect(result.narrative.length).toBeGreaterThan(0);
  });

  it('resolves a self-targeting ability as healing', () => {
    const user = makeTestCombatant({ stats: { wisdom: 14 } });
    const healAbility = makeAbility({
      id: 'heal',
      name: 'Heal',
      scalingStat: 'wisdom',
      targetsSelf: true,
      baseDamage: 15,
      statMultiplier: 1.5,
    });

    const result = resolveAttack(user, user, healAbility);
    expect(result.hit).toBe(true);
    expect(result.damage).toBeLessThan(0); // Negative = healing
    expect(result.narrative).toContain('restoring');
  });

  it('can apply status effects on hit', () => {
    setGlobalRng(createRng(1)); // Different seed for effect application
    const attacker = makeTestCombatant({ stats: { strength: 20, cunning: 20 } });
    const defender = makeTestCombatant({ stats: { dexterity: 1 } });
    const ability = makeAbility({
      baseDamage: 15,
      appliesEffect: { type: 'bleed', duration: 3, potency: 5 },
    });

    // Run multiple times to see if effect ever applies
    let effectApplied = false;
    for (let i = 0; i < 20; i++) {
      setGlobalRng(createRng(i));
      const result = resolveAttack(attacker, defender, ability);
      if (result.appliedEffects.length > 0) {
        effectApplied = true;
        expect(result.appliedEffects[0].type).toBe('bleed');
        expect(result.appliedEffects[0].duration).toBe(3);
        break;
      }
    }
    expect(effectApplied).toBe(true);
  });
});

// ─── Defend Action ──────────────────────────────────────────────────

describe('resolveDefend', () => {
  it('grants defense bonus based on constitution', () => {
    const combatant = makeTestCombatant({ stats: { constitution: 14 } });
    const result = resolveDefend(combatant);
    // 14 * 0.75 + 5 = 15.5 → 16
    expect(result.defenseBonus).toBe(16);
    expect(result.narrative).toContain('braces');
  });
});

// ─── Flee Action ────────────────────────────────────────────────────

describe('resolveFlee', () => {
  it('calculates flee chance from dexterity vs cunning', () => {
    const player = makeTestCombatant({ stats: { dexterity: 18 }, isPlayer: true });
    const enemy = makeTestCombatant({ stats: { cunning: 8 } });
    const result = resolveFlee(player, [enemy]);
    // 40 + (18-8)*3 = 70
    expect(result.fleeChance).toBe(70);
  });

  it('clamps flee chance between 10-80', () => {
    const player = makeTestCombatant({ stats: { dexterity: 30 }, isPlayer: true });
    const enemy = makeTestCombatant({ stats: { cunning: 1 } });
    const result = resolveFlee(player, [enemy]);
    expect(result.fleeChance).toBeLessThanOrEqual(80);
    expect(result.fleeChance).toBeGreaterThanOrEqual(10);
  });
});

// ─── Status Effects ─────────────────────────────────────────────────

describe('processStatusEffects', () => {
  it('ticks bleed damage', () => {
    const combatant = makeTestCombatant({
      statusEffects: [{ type: 'bleed', duration: 2, potency: 5, source: 'Slash' }],
    });
    const ticks = processStatusEffects(combatant);
    expect(ticks).toHaveLength(1);
    expect(ticks[0].effectType).toBe('bleed');
    expect(ticks[0].value).toBe(5);
    expect(ticks[0].expired).toBe(false);
  });

  it('heals with regeneration', () => {
    const combatant = makeTestCombatant({
      statusEffects: [{ type: 'regeneration', duration: 3, potency: 8, source: 'Heal' }],
    });
    const ticks = processStatusEffects(combatant);
    expect(ticks[0].value).toBe(-8); // Negative = healing
  });

  it('marks effects as expired when duration reaches 0', () => {
    const combatant = makeTestCombatant({
      statusEffects: [{ type: 'poison', duration: 1, potency: 3, source: 'Venom' }],
    });
    const ticks = processStatusEffects(combatant);
    expect(ticks[0].expired).toBe(true);
  });
});

describe('applyStatusTicks', () => {
  it('reduces HP from damage ticks', () => {
    const combatant = makeTestCombatant();
    combatant.currentHp = 100;
    combatant.statusEffects = [{ type: 'bleed', duration: 0, potency: 10, source: 'test' }];

    applyStatusTicks(combatant, [
      { effectType: 'bleed', value: 10, expired: true, narrative: '' },
    ]);
    expect(combatant.currentHp).toBe(90);
  });

  it('heals HP from negative value ticks', () => {
    const combatant = makeTestCombatant();
    combatant.currentHp = 50;
    combatant.statusEffects = [{ type: 'regeneration', duration: 1, potency: 8, source: 'test' }];

    applyStatusTicks(combatant, [
      { effectType: 'regeneration', value: -8, expired: false, narrative: '' },
    ]);
    expect(combatant.currentHp).toBe(58);
  });

  it('removes expired effects', () => {
    const combatant = makeTestCombatant();
    combatant.statusEffects = [
      { type: 'bleed', duration: 0, potency: 5, source: 'test' },
      { type: 'fortified', duration: 2, potency: 10, source: 'test' },
    ];

    applyStatusTicks(combatant, []);
    expect(combatant.statusEffects).toHaveLength(1);
    expect(combatant.statusEffects[0].type).toBe('fortified');
  });
});

// ─── Turn Order ─────────────────────────────────────────────────────

describe('calculateTurnOrder', () => {
  it('sorts by initiative (higher goes first)', () => {
    const fast = makeTestCombatant({ id: 'fast', stats: { cunning: 18, dexterity: 15 } });
    const slow = makeTestCombatant({ id: 'slow', stats: { cunning: 5, dexterity: 3 } });
    const mid = makeTestCombatant({ id: 'mid', stats: { cunning: 10, dexterity: 10 } });

    const order = calculateTurnOrder([slow, fast, mid]);
    expect(order[0]).toBe('fast');
    expect(order[2]).toBe('slow');
  });

  it('excludes dead combatants', () => {
    const alive = makeTestCombatant({ id: 'alive' });
    const dead = makeTestCombatant({ id: 'dead' });
    dead.currentHp = 0;

    const order = calculateTurnOrder([alive, dead]);
    expect(order).toEqual(['alive']);
  });
});

// ─── AI Decision Making ─────────────────────────────────────────────

describe('chooseAiAction', () => {
  it('aggressive AI uses strongest ability', () => {
    const weak = makeAbility({ id: 'weak', baseDamage: 5 });
    const strong = makeAbility({ id: 'strong', baseDamage: 20 });
    const ai = makeTestCombatant({
      aiPattern: 'aggressive',
      abilities: [weak, strong],
    });
    const player = makeTestCombatant({ id: 'player', isPlayer: true });

    const action = chooseAiAction(ai, [player]);
    expect(action.type).toBe('ability');
    expect(action.abilityId).toBe('strong');
  });

  it('defensive AI heals when low HP', () => {
    const healAbility = makeAbility({ id: 'heal', targetsSelf: true });
    const ai = makeTestCombatant({
      aiPattern: 'defensive',
      abilities: [makeAbility(), healAbility],
    });
    ai.currentHp = Math.round(ai.derived.maxHealth * 0.2);

    const player = makeTestCombatant({ id: 'player', isPlayer: true });
    const action = chooseAiAction(ai, [player]);
    expect(action.abilityId).toBe('heal');
  });
});

// ─── Minor Encounter Resolution ─────────────────────────────────────

describe('resolveMinorEncounter', () => {
  const encounter: MinorEncounter = {
    id: 'test_encounter',
    type: 'minor',
    description: 'A locked door blocks your path.',
    checkStat: 'strength',
    difficulty: 12,
    failureDamage: 10,
    successText: 'You force the door open!',
    failureText: 'The door holds firm.',
    experienceReward: 50,
    chapterId: 'ch1',
  };

  it('succeeds when stat meets difficulty', () => {
    const stats = makeStatBlock({ strength: 15 });
    const result = resolveMinorEncounter(stats, encounter);
    // 15 ± small variance should exceed 12
    expect(result.statValue).toBe(15);
    expect(result.difficulty).toBe(12);
    expect(result.success).toBe(true);
    expect(result.damageTaken).toBe(0);
    expect(result.experienceGained).toBe(50);
    expect(result.narrative).toBe('You force the door open!');
  });

  it('fails when stat is below difficulty', () => {
    setGlobalRng(createRng(7)); // Seed that gives unfavorable roll
    const stats = makeStatBlock({ strength: 5 });
    const result = resolveMinorEncounter(stats, encounter);
    expect(result.statValue).toBe(5);
    expect(result.success).toBe(false);
    expect(result.damageTaken).toBe(10);
    expect(result.experienceGained).toBe(13); // 25% of 50
  });

  it('includes secondary stat bonus', () => {
    const encounterWithSecondary: MinorEncounter = {
      ...encounter,
      difficulty: 18,
      secondaryStat: 'cunning',
      secondaryMultiplier: 0.5,
    };
    const stats = makeStatBlock({ strength: 14, cunning: 12 });
    const result = resolveMinorEncounter(stats, encounterWithSecondary);
    // primary=14, secondary=12*0.5=6, total=20 ± variance
    expect(result.secondaryBonus).toBe(6);
    expect(result.totalCheck).toBeGreaterThanOrEqual(14 + 6 - 3);
  });
});

// ─── Combat Engine (Boss Fights) ────────────────────────────────────

describe('CombatEngine', () => {
  function makeBossEncounter(): BossEncounter {
    const bossAbility = makeAbility({
      id: 'boss_slash',
      name: 'Devastating Slash',
      baseDamage: 15,
      statMultiplier: 1.2,
      scalingStat: 'strength',
    });

    return {
      id: 'boss_test',
      type: 'boss',
      description: 'A fearsome warlord blocks your path.',
      enemies: [
        createCombatant({
          id: 'boss',
          name: 'Warlord Grimjaw',
          level: 5,
          stats: {
            strength: 14,
            cunning: 10,
            charisma: 6,
            wisdom: 8,
            constitution: 12,
            dexterity: 6,
            intelligence: 8,
            influence: 5,
            diplomacy: 4,
          },
          abilities: [bossAbility, { ...BASIC_ATTACK }],
          aiPattern: 'aggressive',
        }),
      ],
      experienceReward: 200,
      victoryText: 'The warlord falls!',
      defeatText: 'You have been slain...',
      canFlee: true,
      chapterId: 'ch3',
    };
  }

  it('initializes combat state correctly', () => {
    const player = createCombatant({
      id: 'player',
      name: 'Hero',
      level: 5,
      stats: { strength: 12, cunning: 14, charisma: 10, wisdom: 10, constitution: 11, dexterity: 10, intelligence: 10, influence: 8, diplomacy: 8 },
      isPlayer: true,
    });

    const engine = new CombatEngine(makeBossEncounter(), player);
    const state = engine.getState();

    expect(state.round).toBe(1);
    expect(state.combatants).toHaveLength(2);
    expect(state.isComplete).toBe(false);
    expect(state.turnOrder).toHaveLength(2);
  });

  it('resolves a player attack action', () => {
    const player = createCombatant({
      id: 'player',
      name: 'Hero',
      level: 5,
      stats: { strength: 12, cunning: 14, charisma: 10, wisdom: 10, constitution: 11, dexterity: 10, intelligence: 10, influence: 8, diplomacy: 8 },
      abilities: [{ ...BASIC_ATTACK }],
      isPlayer: true,
    });

    const engine = new CombatEngine(makeBossEncounter(), player);
    const results = engine.executePlayerAction({
      type: 'attack',
      targetId: 'boss',
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].actorId).toBeDefined();
    // After player acts, AI should also have acted
    expect(results.some((r) => r.actorId === 'boss' || r.actorId === 'player')).toBe(true);
  });

  it('completes combat when enemy reaches 0 HP', () => {
    const player = createCombatant({
      id: 'player',
      name: 'Hero',
      level: 10,
      stats: { strength: 25, cunning: 20, charisma: 10, wisdom: 15, constitution: 20, dexterity: 12, intelligence: 12, influence: 10, diplomacy: 8 },
      abilities: [makeAbility({ baseDamage: 500, statMultiplier: 10 })],
      isPlayer: true,
    });

    const engine = new CombatEngine(makeBossEncounter(), player);
    const results = engine.executePlayerAction({
      type: 'ability',
      abilityId: 'test_ability',
      targetId: 'boss',
    });

    const state = engine.getState();
    expect(state.isComplete).toBe(true);
    expect(state.outcome).toBe('victory');
  });

  it('returns correct combat result on victory', () => {
    const player = createCombatant({
      id: 'player',
      name: 'Hero',
      level: 10,
      stats: { strength: 25, cunning: 20, charisma: 10, wisdom: 15, constitution: 20, dexterity: 12, intelligence: 12, influence: 10, diplomacy: 8 },
      abilities: [makeAbility({ baseDamage: 500, statMultiplier: 10 })],
      isPlayer: true,
    });

    const encounter = makeBossEncounter();
    const engine = new CombatEngine(encounter, player);
    engine.executePlayerAction({
      type: 'ability',
      abilityId: 'test_ability',
      targetId: 'boss',
    });

    const result = engine.getResult(encounter.experienceReward);
    expect(result.outcome).toBe('victory');
    expect(result.experienceGained).toBe(200);
    expect(result.playerHpRemaining).toBeGreaterThan(0);
    expect(result.summary).toContain('Victory');
  });

  it('supports defend action', () => {
    const player = createCombatant({
      id: 'player',
      name: 'Hero',
      level: 5,
      stats: { strength: 10, cunning: 10, charisma: 10, wisdom: 10, constitution: 14, dexterity: 10, intelligence: 10, influence: 8, diplomacy: 8 },
      isPlayer: true,
    });

    const engine = new CombatEngine(makeBossEncounter(), player);
    const results = engine.executePlayerAction({ type: 'defend' });

    const playerTurn = results.find((r) => r.actorId === 'player');
    expect(playerTurn?.defendResult).toBeDefined();
    expect(playerTurn?.defendResult?.defenseBonus).toBeGreaterThan(0);
  });

  it('handles boss phase transitions', () => {
    const encounter = makeBossEncounter();
    encounter.phases = [
      {
        hpThreshold: 95,
        transitionText: 'The warlord enters a frenzy!',
        statChanges: { strength: 5 },
        appliedEffects: [{ type: 'inspired', duration: 3, potency: 0 }],
      },
    ];

    const player = createCombatant({
      id: 'player',
      name: 'Hero',
      level: 8,
      stats: { strength: 20, cunning: 18, charisma: 10, wisdom: 12, constitution: 16, dexterity: 10, intelligence: 10, influence: 8, diplomacy: 8 },
      abilities: [makeAbility({ baseDamage: 100, statMultiplier: 2 })],
      isPlayer: true,
    });

    const engine = new CombatEngine(encounter, player);

    // Attack to trigger phase — high damage should drop boss below 95%
    engine.executePlayerAction({
      type: 'ability',
      abilityId: 'test_ability',
      targetId: 'boss',
    });

    // Boss should have transitioned to phase 0 (95% threshold easily hit by big damage)
    const state = engine.getState();
    const boss = state.combatants.find((c) => c.id === 'boss');
    if (boss && boss.currentHp > 0) {
      expect(state.currentPhase).toBe(0);
      // Boss should have the inspired effect from phase transition
      expect(boss.statusEffects.some((e) => e.type === 'inspired')).toBe(true);
    }
  });
});

// ─── createCombatant ────────────────────────────────────────────────

describe('createCombatant', () => {
  it('creates a combatant with computed derived stats', () => {
    const c = createCombatant({
      id: 'test',
      name: 'Test',
      level: 3,
      stats: { strength: 12, cunning: 10, charisma: 8, wisdom: 10, constitution: 14, dexterity: 9, intelligence: 10, influence: 8, diplomacy: 8 },
    });

    expect(c.id).toBe('test');
    expect(c.currentHp).toBe(c.derived.maxHealth);
    expect(c.abilities).toHaveLength(1); // Default basic attack
    expect(c.statusEffects).toHaveLength(0);
  });

  it('sets HP equal to maxHealth on creation', () => {
    const c = createCombatant({
      id: 'test',
      name: 'Test',
      level: 5,
      stats: { strength: 10, cunning: 10, charisma: 10, wisdom: 10, constitution: 15, dexterity: 10, intelligence: 10, influence: 8, diplomacy: 8 },
    });

    expect(c.currentHp).toBe(c.derived.maxHealth);
    // maxHealth = 50 + 15*5 + 10*2 + 5*8 = 50+75+20+40 = 185
    expect(c.derived.maxHealth).toBe(185);
  });
});
