/**
 * Combat Resolution Engine
 *
 * Stat-based combat system that uses STR (strength), DEX (dexterity),
 * CON (constitution), and other stats to calculate hit chance, damage,
 * defense, and combat outcomes.
 *
 * Two modes:
 *  1. resolveMinorEncounter() — single stat check for narrative encounters
 *  2. Boss fight via CombatEngine class — multi-round tactical combat
 *
 * All randomness flows through a seedable RNG for deterministic testing.
 */

import type {
  StatBlock,
  DerivedStats,
  StatName,
} from '../types/stats';
import type {
  Combatant,
  CombatAbility,
  CombatAction,
  CombatState,
  CombatResult,
  CombatOutcome,
  AttackResult,
  DefendResult,
  FleeResult,
  TurnResult,
  StatusEffect,
  StatusTickResult,
  CombatantSnapshot,
  MinorEncounter,
  MinorEncounterResult,
  BossEncounter,
  BossPhase,
  DamageType,
  StatusEffectType,
} from '../types/combat';

// ─── RNG ─────────────────────────────────────────────────────────────

/** Seedable pseudo-random number generator (mulberry32) */
export function createRng(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Default RNG using Math.random */
let globalRng: () => number = Math.random;

/** Set the global RNG (useful for testing) */
export function setGlobalRng(rng: () => number): void {
  globalRng = rng;
}

/** Reset to Math.random */
export function resetGlobalRng(): void {
  globalRng = Math.random;
}

/** Roll 0-100 using current RNG */
function roll100(): number {
  return Math.floor(globalRng() * 100) + 1;
}

/** Roll a variance range around a value (±variance%) */
function rollVariance(base: number, variancePercent: number): number {
  const variance = base * (variancePercent / 100);
  return Math.round(base + (globalRng() * 2 - 1) * variance);
}

// ─── Stat Helpers ────────────────────────────────────────────────────

/** Get the total value of a stat from a stat block */
export function getStatTotal(stats: StatBlock, stat: StatName): number {
  return stats[stat].total;
}

/** Compute derived combat stats from a stat block and level */
export function computeDerived(stats: StatBlock, level: number): DerivedStats {
  const str = getStatTotal(stats, 'strength');
  const cun = getStatTotal(stats, 'cunning');
  const con = getStatTotal(stats, 'constitution');
  const dex = getStatTotal(stats, 'dexterity');
  const wis = getStatTotal(stats, 'wisdom');

  return {
    maxHealth: 50 + con * 5 + str * 2 + level * 8,
    meleePower: Math.round(str * 1.5 + level * 0.5),
    tacticalPower: Math.round(cun * 1.2 + wis * 0.8 + level * 0.5),
    evasion: Math.min(40, Math.round(dex * 2)),
    armor: Math.round(con * 1.5),
    initiative: Math.round(cun + dex * 0.5 + level * 0.25),
    critChance: Math.min(35, Math.round(cun * 1.5 + dex * 0.5)),
  };
}

// ─── Hit Chance Calculation ──────────────────────────────────────────

/**
 * Calculate hit chance for an attacker against a defender.
 *
 * Formula:
 *   baseHit = 70 + (attacker.cunning * 2) - (defender.dexterity * 1.5)
 *   + accuracyMod from ability
 *   + demoralized penalty on defender
 *   Clamped to [5, 95]
 */
export function calculateHitChance(
  attacker: Combatant,
  defender: Combatant,
  accuracyMod: number = 0,
): number {
  const attackerCunning = getStatTotal(attacker.stats, 'cunning');
  const defenderDexterity = getStatTotal(defender.stats, 'dexterity');

  let hitChance = 70 + attackerCunning * 2 - defenderDexterity * 1.5 + accuracyMod;

  // Demoralized defender is easier to hit
  if (defender.statusEffects.some((e) => e.type === 'demoralized')) {
    hitChance += 15;
  }

  // Inspired attacker gets bonus
  if (attacker.statusEffects.some((e) => e.type === 'inspired')) {
    hitChance += 10;
  }

  // Stunned defender can't dodge
  if (defender.statusEffects.some((e) => e.type === 'stun')) {
    hitChance = 95;
  }

  return Math.max(5, Math.min(95, Math.round(hitChance)));
}

// ─── Damage Calculation ─────────────────────────────────────────────

/**
 * Calculate raw damage for an ability.
 *
 * Formula:
 *   baseDamage + (scalingStat * statMultiplier)
 *   ± 15% variance
 *   × critMultiplier if critical
 */
export function calculateRawDamage(
  attacker: Combatant,
  ability: CombatAbility,
  isCritical: boolean,
): number {
  const scalingValue = getStatTotal(attacker.stats, ability.scalingStat);
  let damage = ability.baseDamage + scalingValue * ability.statMultiplier;

  // Apply variance (±15%)
  damage = rollVariance(damage, 15);

  // Weakened debuff reduces damage
  const weakened = attacker.statusEffects.find((e) => e.type === 'weakened');
  if (weakened) {
    damage *= 0.7; // 30% reduction
  }

  // Critical hit
  if (isCritical) {
    const critMult = 1.5 + getStatTotal(attacker.stats, 'strength') * 0.01;
    damage *= critMult;
  }

  return Math.max(1, Math.round(damage));
}

/**
 * Calculate defense mitigation against a damage type.
 *
 * Physical: constitution * 1.5 + fortified bonus
 * Tactical: wisdom * 1.0 + cunning * 0.5
 * Arcane: wisdom * 1.5
 * Poison: constitution * 1.0
 * True: no mitigation
 */
export function calculateMitigation(
  defender: Combatant,
  damageType: DamageType,
): number {
  if (damageType === 'true') return 0;

  const con = getStatTotal(defender.stats, 'constitution');
  const wis = getStatTotal(defender.stats, 'wisdom');
  const cun = getStatTotal(defender.stats, 'cunning');

  let mitigation = 0;

  switch (damageType) {
    case 'physical':
      mitigation = con * 1.5;
      break;
    case 'tactical':
      mitigation = wis * 1.0 + cun * 0.5;
      break;
    case 'arcane':
      mitigation = wis * 1.5;
      break;
    case 'poison':
      mitigation = con * 1.0;
      break;
  }

  // Fortified bonus
  const fortified = defender.statusEffects.find((e) => e.type === 'fortified');
  if (fortified) {
    mitigation += fortified.potency;
  }

  // Shield absorb
  const shield = defender.statusEffects.find((e) => e.type === 'shield');
  if (shield) {
    mitigation += shield.potency;
  }

  return Math.round(mitigation);
}

/**
 * Calculate final damage after mitigation.
 * Minimum 1 damage on hit (except shield full absorb).
 */
export function calculateFinalDamage(rawDamage: number, mitigation: number): number {
  return Math.max(0, rawDamage - mitigation);
}

// ─── Evasion ─────────────────────────────────────────────────────────

/**
 * Calculate evasion chance.
 * dexterity * 2, capped at 40%, halved if stunned.
 */
export function calculateEvasion(defender: Combatant): number {
  const dexterity = getStatTotal(defender.stats, 'dexterity');
  let evasion = Math.min(40, dexterity * 2);

  if (defender.statusEffects.some((e) => e.type === 'stun')) {
    evasion = 0;
  }
  if (defender.statusEffects.some((e) => e.type === 'slow')) {
    evasion = Math.round(evasion * 0.5);
  }
  if (defender.statusEffects.some((e) => e.type === 'haste')) {
    evasion = Math.min(40, evasion + 10);
  }

  return evasion;
}

// ─── Critical Hits ──────────────────────────────────────────────────

/**
 * Calculate critical hit chance.
 * cunning * 1.5 + dexterity * 0.5, capped at 35%.
 */
export function calculateCritChance(attacker: Combatant): number {
  const cun = getStatTotal(attacker.stats, 'cunning');
  const dex = getStatTotal(attacker.stats, 'dexterity');
  let critChance = cun * 1.5 + dex * 0.5;

  if (attacker.statusEffects.some((e) => e.type === 'inspired')) {
    critChance += 15;
  }

  return Math.min(35, Math.round(critChance));
}

// ─── Attack Resolution ──────────────────────────────────────────────

/**
 * Resolve a single attack or ability use.
 *
 * Flow:
 * 1. Calculate hit chance (attacker cunning vs defender dexterity)
 * 2. Roll to hit
 * 3. If hit, check evasion
 * 4. If not evaded, calculate raw damage (scaling stat × multiplier)
 * 5. Apply defense mitigation (constitution for physical, wisdom for magical)
 * 6. Check for critical hit (cunning + dexterity based)
 * 7. Apply status effects
 * 8. Generate narrative text
 */
export function resolveAttack(
  attacker: Combatant,
  defender: Combatant,
  ability: CombatAbility,
): AttackResult {
  // Self-targeting abilities (heals/buffs)
  if (ability.targetsSelf) {
    return resolveSelfAbility(attacker, ability);
  }

  // Step 1-2: Hit roll
  const hitChance = calculateHitChance(attacker, defender, ability.accuracyMod);
  const hitRoll = roll100();
  const baseHit = hitRoll <= hitChance;

  // Step 3: Evasion check (only if hit lands)
  let hit = baseHit;
  if (baseHit) {
    const evasion = calculateEvasion(defender);
    const evasionRoll = roll100();
    if (evasionRoll <= evasion) {
      hit = false;
    }
  }

  if (!hit) {
    const narrative = baseHit
      ? `${defender.name} nimbly evades ${attacker.name}'s ${ability.name}!`
      : `${attacker.name}'s ${ability.name} misses ${defender.name}!`;

    return {
      hit: false,
      critical: false,
      damage: 0,
      rawDamage: 0,
      mitigated: 0,
      hitChance,
      hitRoll,
      appliedEffects: [],
      narrative,
    };
  }

  // Step 4: Critical hit check
  const critChance = calculateCritChance(attacker);
  const critRoll = roll100();
  const critical = critRoll <= critChance;

  // Step 5: Raw damage
  const rawDamage = calculateRawDamage(attacker, ability, critical);

  // Step 6: Mitigation
  const mitigation = calculateMitigation(defender, ability.damageType);
  const damage = calculateFinalDamage(rawDamage, mitigation);

  // Step 7: Status effects
  const appliedEffects: StatusEffect[] = [];
  if (ability.appliesEffect) {
    const effectChance = 60 + getStatTotal(attacker.stats, ability.scalingStat);
    if (roll100() <= Math.min(90, effectChance)) {
      appliedEffects.push({
        type: ability.appliesEffect.type,
        duration: ability.appliesEffect.duration,
        potency: ability.appliesEffect.potency,
        source: ability.name,
      });
    }
  }

  // Step 8: Narrative
  const critText = critical ? ' CRITICAL HIT!' : '';
  const effectText = appliedEffects.length > 0
    ? ` ${defender.name} is now ${appliedEffects[0].type}!`
    : '';
  const narrative = `${attacker.name} strikes ${defender.name} with ${ability.name} for ${damage} damage!${critText}${effectText}`;

  return {
    hit: true,
    critical,
    damage,
    rawDamage,
    mitigated: mitigation,
    hitChance,
    hitRoll,
    appliedEffects,
    narrative,
  };
}

/** Resolve a self-targeting ability (heal, buff) */
function resolveSelfAbility(user: Combatant, ability: CombatAbility): AttackResult {
  const scalingValue = getStatTotal(user.stats, ability.scalingStat);
  const healAmount = ability.baseDamage + scalingValue * ability.statMultiplier;
  const finalHeal = Math.round(rollVariance(healAmount, 10));

  const appliedEffects: StatusEffect[] = [];
  if (ability.appliesEffect) {
    appliedEffects.push({
      type: ability.appliesEffect.type,
      duration: ability.appliesEffect.duration,
      potency: ability.appliesEffect.potency,
      source: ability.name,
    });
  }

  const effectText = appliedEffects.length > 0
    ? ` ${user.name} gains ${appliedEffects[0].type}!`
    : '';

  return {
    hit: true,
    critical: false,
    damage: -finalHeal, // Negative = healing
    rawDamage: -finalHeal,
    mitigated: 0,
    hitChance: 100,
    hitRoll: 1,
    appliedEffects,
    narrative: `${user.name} uses ${ability.name}, restoring ${finalHeal} health!${effectText}`,
  };
}

// ─── Defend Action ──────────────────────────────────────────────────

/** Resolve a defend action — grants fortified buff */
export function resolveDefend(combatant: Combatant): DefendResult {
  const con = getStatTotal(combatant.stats, 'constitution');
  const defenseBonus = Math.round(con * 0.75 + 5);

  return {
    defenseBonus,
    narrative: `${combatant.name} braces for impact, gaining ${defenseBonus} defense!`,
  };
}

// ─── Flee Action ────────────────────────────────────────────────────

/** Resolve a flee attempt — dexterity vs enemy cunning */
export function resolveFlee(player: Combatant, enemies: Combatant[]): FleeResult {
  const playerDexterity = getStatTotal(player.stats, 'dexterity');
  const avgEnemyCunning = enemies.reduce(
    (sum, e) => sum + getStatTotal(e.stats, 'cunning'),
    0,
  ) / enemies.length;

  const fleeChance = Math.max(10, Math.min(80, 40 + (playerDexterity - avgEnemyCunning) * 3));
  const fleeRoll = roll100();
  const success = fleeRoll <= fleeChance;

  return {
    success,
    fleeChance: Math.round(fleeChance),
    fleeRoll,
    narrative: success
      ? `${player.name} slips away into the shadows!`
      : `${player.name} tries to flee but is cut off!`,
  };
}

// ─── Status Effect Processing ───────────────────────────────────────

/** Process status effects at the start of a combatant's turn */
export function processStatusEffects(combatant: Combatant): StatusTickResult[] {
  const results: StatusTickResult[] = [];

  for (const effect of combatant.statusEffects) {
    let value = 0;
    let narrative = '';

    switch (effect.type) {
      case 'bleed':
        value = effect.potency;
        narrative = `${combatant.name} bleeds for ${value} damage!`;
        break;
      case 'poison':
        value = effect.potency;
        narrative = `${combatant.name} takes ${value} poison damage!`;
        break;
      case 'burn':
        value = effect.potency;
        narrative = `${combatant.name} burns for ${value} arcane damage!`;
        break;
      case 'regeneration':
        value = -effect.potency; // Negative = healing
        narrative = `${combatant.name} regenerates ${effect.potency} health.`;
        break;
      case 'stun':
        narrative = `${combatant.name} is stunned and cannot act!`;
        break;
      default:
        // Passive effects (weakened, fortified, etc.) don't tick
        break;
    }

    effect.duration -= 1;
    const expired = effect.duration <= 0;

    if (value !== 0 || effect.type === 'stun') {
      results.push({
        effectType: effect.type,
        value,
        expired,
        narrative: expired
          ? `${narrative} The effect wears off.`
          : narrative,
      });
    } else if (expired) {
      results.push({
        effectType: effect.type,
        value: 0,
        expired: true,
        narrative: `${combatant.name}'s ${effect.type} effect wears off.`,
      });
    }
  }

  return results;
}

/** Apply status tick damage/healing to combatant HP */
export function applyStatusTicks(
  combatant: Combatant,
  ticks: StatusTickResult[],
): void {
  for (const tick of ticks) {
    if (tick.value > 0) {
      combatant.currentHp = Math.max(0, combatant.currentHp - tick.value);
    } else if (tick.value < 0) {
      combatant.currentHp = Math.min(
        combatant.derived.maxHealth,
        combatant.currentHp - tick.value, // Subtract negative = add
      );
    }
  }

  // Remove expired effects
  combatant.statusEffects = combatant.statusEffects.filter((e) => e.duration > 0);
}

// ─── Turn Order ─────────────────────────────────────────────────────

/** Calculate initiative-based turn order */
export function calculateTurnOrder(combatants: Combatant[]): string[] {
  return combatants
    .filter((c) => c.currentHp > 0)
    .sort((a, b) => {
      const initA = computeDerived(a.stats, a.level).initiative;
      const initB = computeDerived(b.stats, b.level).initiative;
      if (initB !== initA) return initB - initA; // Higher initiative goes first
      // Tie-break: player goes first
      if (a.isPlayer !== b.isPlayer) return a.isPlayer ? -1 : 1;
      return 0;
    })
    .map((c) => c.id);
}

// ─── Combatant Snapshot ─────────────────────────────────────────────

/** Create a snapshot of all combatants for UI state */
export function snapshotCombatants(combatants: Combatant[]): CombatantSnapshot[] {
  return combatants.map((c) => ({
    id: c.id,
    name: c.name,
    currentHp: c.currentHp,
    maxHp: c.derived.maxHealth,
    statusEffects: [...c.statusEffects],
    isDefeated: c.currentHp <= 0,
  }));
}

// ─── AI Decision Making ─────────────────────────────────────────────

/** Choose an action for an AI combatant */
export function chooseAiAction(
  ai: Combatant,
  enemies: Combatant[],
): CombatAction {
  const hpPercent = ai.currentHp / ai.derived.maxHealth;
  const availableAbilities = ai.abilities.filter((a) => a.currentCooldown === 0);
  const aliveEnemies = enemies.filter((e) => e.currentHp > 0);

  if (aliveEnemies.length === 0) {
    return { type: 'defend' };
  }

  const pattern = ai.aiPattern ?? 'aggressive';

  switch (pattern) {
    case 'defensive': {
      // Heal/buff when below 40% HP
      if (hpPercent < 0.4) {
        const selfAbility = availableAbilities.find((a) => a.targetsSelf);
        if (selfAbility) {
          return { type: 'ability', abilityId: selfAbility.id, targetId: ai.id };
        }
        return { type: 'defend' };
      }
      // Otherwise attack weakest
      const weakest = aliveEnemies.reduce((min, e) =>
        e.currentHp < min.currentHp ? e : min,
      );
      const ability = availableAbilities.find((a) => !a.targetsSelf) ?? ai.abilities[0];
      return { type: 'ability', abilityId: ability.id, targetId: weakest.id };
    }

    case 'berserker': {
      // Gets more aggressive as HP drops — always use strongest ability
      const strongest = availableAbilities
        .filter((a) => !a.targetsSelf)
        .sort((a, b) => b.baseDamage - a.baseDamage)[0];
      const target = aliveEnemies[Math.floor(globalRng() * aliveEnemies.length)];
      if (strongest) {
        return { type: 'ability', abilityId: strongest.id, targetId: target.id };
      }
      return { type: 'attack', targetId: target.id };
    }

    case 'tactical': {
      // Use status effects when available, target weakest
      const debuffAbility = availableAbilities.find(
        (a) => a.appliesEffect && !a.targetsSelf,
      );
      const weakest = aliveEnemies.reduce((min, e) =>
        e.currentHp < min.currentHp ? e : min,
      );
      if (debuffAbility && !weakest.statusEffects.some((e) => e.type === debuffAbility.appliesEffect!.type)) {
        return { type: 'ability', abilityId: debuffAbility.id, targetId: weakest.id };
      }
      const dmgAbility = availableAbilities.find((a) => !a.targetsSelf);
      if (dmgAbility) {
        return { type: 'ability', abilityId: dmgAbility.id, targetId: weakest.id };
      }
      return { type: 'attack', targetId: weakest.id };
    }

    case 'support': {
      // Buff self or heal when possible
      const buffAbility = availableAbilities.find((a) => a.targetsSelf);
      if (buffAbility) {
        return { type: 'ability', abilityId: buffAbility.id, targetId: ai.id };
      }
      const target = aliveEnemies[0];
      return { type: 'attack', targetId: target.id };
    }

    case 'aggressive':
    default: {
      // Use strongest available ability on random target
      const damageAbilities = availableAbilities
        .filter((a) => !a.targetsSelf)
        .sort((a, b) => b.baseDamage - a.baseDamage);
      const target = aliveEnemies[Math.floor(globalRng() * aliveEnemies.length)];
      if (damageAbilities.length > 0) {
        return { type: 'ability', abilityId: damageAbilities[0].id, targetId: target.id };
      }
      return { type: 'attack', targetId: target.id };
    }
  }
}

// ─── Default Basic Attack ───────────────────────────────────────────

/** The basic attack ability every combatant has */
export const BASIC_ATTACK: CombatAbility = {
  id: 'basic_attack',
  name: 'Strike',
  description: 'A basic physical attack.',
  scalingStat: 'strength',
  damageType: 'physical',
  baseDamage: 5,
  statMultiplier: 1.0,
  accuracyMod: 0,
  cooldown: 0,
  currentCooldown: 0,
  targetsSelf: false,
  areaOfEffect: false,
  flavorText: 'A swift, practiced blow.',
};

// ─── Boss Phase Transitions ─────────────────────────────────────────

/** Check and apply boss phase transitions */
export function checkPhaseTransition(
  boss: Combatant,
  phases: BossPhase[],
  currentPhase: number,
): { transitioned: boolean; newPhase: number; narrative: string } {
  const hpPercent = (boss.currentHp / boss.derived.maxHealth) * 100;

  for (let i = currentPhase + 1; i < phases.length; i++) {
    if (hpPercent <= phases[i].hpThreshold) {
      const phase = phases[i];

      // Apply stat changes
      if (phase.statChanges) {
        for (const [stat, change] of Object.entries(phase.statChanges)) {
          const statName = stat as StatName;
          if (boss.stats[statName]) {
            boss.stats[statName] = {
              ...boss.stats[statName],
              modifiers: [
                ...boss.stats[statName].modifiers,
                { source: 'phase_transition', value: change!, type: 'buff' as const },
              ],
              total: boss.stats[statName].total + change!,
            };
          }
        }
        // Recompute derived stats
        boss.derived = computeDerived(boss.stats, boss.level);
      }

      // Add new abilities
      if (phase.newAbilities) {
        boss.abilities.push(...phase.newAbilities);
      }

      // Apply status effects
      if (phase.appliedEffects) {
        for (const template of phase.appliedEffects) {
          boss.statusEffects.push({
            type: template.type,
            duration: template.duration,
            potency: template.potency,
            source: 'phase_transition',
          });
        }
      }

      return {
        transitioned: true,
        newPhase: i,
        narrative: phase.transitionText,
      };
    }
  }

  return { transitioned: false, newPhase: currentPhase, narrative: '' };
}

// ─── Combat Engine (Boss Fights) ────────────────────────────────────

/**
 * Main combat engine for multi-round boss fights.
 * Manages turn order, action resolution, status effects, and phase transitions.
 */
export class CombatEngine {
  private state: CombatState;
  private phases: BossPhase[];

  constructor(encounter: BossEncounter, player: Combatant) {
    const allCombatants = [player, ...encounter.enemies];

    this.phases = encounter.phases ?? [];
    this.state = {
      id: `combat_${Date.now()}`,
      encounterId: encounter.id,
      round: 1,
      turnOrder: calculateTurnOrder(allCombatants),
      currentTurnIndex: 0,
      combatants: allCombatants,
      turnLog: [],
      isComplete: false,
      currentPhase: -1, // Before first phase
    };
  }

  /** Get current combat state (read-only snapshot) */
  getState(): Readonly<CombatState> {
    return this.state;
  }

  /** Get the combatant whose turn it currently is */
  getCurrentActor(): Combatant | undefined {
    const actorId = this.state.turnOrder[this.state.currentTurnIndex];
    return this.state.combatants.find((c) => c.id === actorId);
  }

  /** Get the player combatant */
  getPlayer(): Combatant {
    return this.state.combatants.find((c) => c.isPlayer)!;
  }

  /** Get all living enemy combatants */
  getAliveEnemies(): Combatant[] {
    return this.state.combatants.filter((c) => !c.isPlayer && c.currentHp > 0);
  }

  /** Get all available abilities for the current actor */
  getAvailableAbilities(): CombatAbility[] {
    const actor = this.getCurrentActor();
    if (!actor) return [];
    return actor.abilities.filter((a) => a.currentCooldown === 0);
  }

  /**
   * Execute a player action and resolve until the next player turn
   * (or combat ends).
   */
  executePlayerAction(action: CombatAction): TurnResult[] {
    if (this.state.isComplete) return [];

    const results: TurnResult[] = [];

    // Execute the player's action
    const playerResult = this.executeTurn(action);
    results.push(playerResult);

    if (this.state.isComplete) return results;

    // Advance to next turn and resolve all AI turns
    this.advanceTurn();
    while (!this.state.isComplete) {
      const actor = this.getCurrentActor();
      if (!actor || actor.isPlayer) break;

      const aiAction = chooseAiAction(actor, [this.getPlayer()]);
      const aiResult = this.executeTurn(aiAction);
      results.push(aiResult);

      if (this.state.isComplete) break;
      this.advanceTurn();
    }

    return results;
  }

  /** Execute a single turn for the current actor */
  private executeTurn(action: CombatAction): TurnResult {
    const actor = this.getCurrentActor()!;
    const result: TurnResult = {
      actorId: actor.id,
      action,
      statusTicks: [],
      combatantSnapshots: [],
    };

    // Process status effects at start of turn
    const ticks = processStatusEffects(actor);
    applyStatusTicks(actor, ticks);
    result.statusTicks = ticks;

    // Check if actor died to DOTs
    if (actor.currentHp <= 0) {
      result.combatantSnapshots = snapshotCombatants(this.state.combatants);
      this.checkCombatEnd();
      return result;
    }

    // Check for stun (skip turn)
    if (ticks.some((t) => t.effectType === 'stun' && !t.expired)) {
      result.combatantSnapshots = snapshotCombatants(this.state.combatants);
      return result;
    }

    // Resolve the action
    switch (action.type) {
      case 'attack':
      case 'ability': {
        const ability = action.type === 'ability'
          ? actor.abilities.find((a) => a.id === action.abilityId) ?? BASIC_ATTACK
          : BASIC_ATTACK;

        if (ability.targetsSelf) {
          // Self-targeting
          const attackResult = resolveAttack(actor, actor, ability);
          result.attackResult = attackResult;

          // Apply healing
          if (attackResult.damage < 0) {
            actor.currentHp = Math.min(
              actor.derived.maxHealth,
              actor.currentHp - attackResult.damage,
            );
          }

          // Apply status effects to self
          for (const effect of attackResult.appliedEffects) {
            actor.statusEffects.push(effect);
          }
        } else {
          // Find target
          const target = this.state.combatants.find((c) => c.id === action.targetId);
          if (!target || target.currentHp <= 0) break;

          const attackResult = resolveAttack(actor, target, ability);
          result.attackResult = attackResult;

          // Apply damage
          if (attackResult.hit) {
            target.currentHp = Math.max(0, target.currentHp - attackResult.damage);

            // Apply status effects to target
            for (const effect of attackResult.appliedEffects) {
              target.statusEffects.push(effect);
            }

            // Check boss phase transitions
            if (!target.isPlayer && this.phases.length > 0) {
              const phaseCheck = checkPhaseTransition(
                target,
                this.phases,
                this.state.currentPhase,
              );
              if (phaseCheck.transitioned) {
                this.state.currentPhase = phaseCheck.newPhase;
                // Append phase transition to narrative
                result.attackResult = {
                  ...attackResult,
                  narrative: `${attackResult.narrative}\n\n${phaseCheck.narrative}`,
                };
              }
            }
          }
        }

        // Set cooldown
        if (action.type === 'ability' && ability.cooldown > 0) {
          ability.currentCooldown = ability.cooldown;
        }
        break;
      }

      case 'defend': {
        const defendResult = resolveDefend(actor);
        result.defendResult = defendResult;

        // Apply fortified effect
        actor.statusEffects.push({
          type: 'fortified',
          duration: 1,
          potency: defendResult.defenseBonus,
          source: 'defend',
        });
        break;
      }

      case 'flee': {
        const enemies = this.getAliveEnemies();
        const fleeResult = resolveFlee(actor, enemies);
        result.fleeResult = fleeResult;

        if (fleeResult.success) {
          this.state.isComplete = true;
          this.state.outcome = 'fled';
        }
        break;
      }
    }

    // Tick down cooldowns for this actor
    for (const ability of actor.abilities) {
      if (ability.currentCooldown > 0) {
        ability.currentCooldown--;
      }
    }

    // Snapshot and check end
    result.combatantSnapshots = snapshotCombatants(this.state.combatants);
    this.checkCombatEnd();

    return result;
  }

  /** Advance to the next turn, wrapping around for new rounds */
  private advanceTurn(): void {
    this.state.currentTurnIndex++;

    if (this.state.currentTurnIndex >= this.state.turnOrder.length) {
      // New round
      this.state.round++;
      this.state.turnOrder = calculateTurnOrder(this.state.combatants);
      this.state.currentTurnIndex = 0;
    }

    // Skip dead combatants
    while (this.state.currentTurnIndex < this.state.turnOrder.length) {
      const actor = this.state.combatants.find(
        (c) => c.id === this.state.turnOrder[this.state.currentTurnIndex],
      );
      if (actor && actor.currentHp > 0) break;
      this.state.currentTurnIndex++;
    }
  }

  /** Check if combat should end */
  private checkCombatEnd(): void {
    const player = this.getPlayer();
    const aliveEnemies = this.getAliveEnemies();

    if (player.currentHp <= 0) {
      this.state.isComplete = true;
      this.state.outcome = 'defeat';
    } else if (aliveEnemies.length === 0) {
      this.state.isComplete = true;
      this.state.outcome = 'victory';
    }
  }

  /** Get the final combat result (only valid when combat is complete) */
  getResult(experienceReward: number): CombatResult {
    const player = this.getPlayer();
    const outcome = this.state.outcome ?? 'defeat';

    let summary: string;
    switch (outcome) {
      case 'victory':
        summary = `Victory! After ${this.state.round} rounds of fierce combat, ${player.name} stands triumphant with ${player.currentHp} HP remaining.`;
        break;
      case 'defeat':
        summary = `Defeat. After ${this.state.round} rounds, ${player.name} falls in battle.`;
        break;
      case 'fled':
        summary = `${player.name} escaped from combat after ${this.state.round} rounds.`;
        break;
    }

    return {
      outcome,
      experienceGained: outcome === 'victory' ? experienceReward : Math.round(experienceReward * 0.25),
      playerHpRemaining: player.currentHp,
      roundsElapsed: this.state.round,
      turnLog: this.state.turnLog,
      summary,
    };
  }
}

// ─── Minor Encounter Resolution ─────────────────────────────────────

/**
 * Resolve a minor (stat-check) encounter.
 *
 * The player's relevant stat is checked against a difficulty threshold.
 * A secondary stat provides a partial bonus.
 * A small random modifier (±3) adds variance.
 *
 * Success: gain experience, continue unharmed
 * Failure: take damage, still continue
 */
export function resolveMinorEncounter(
  playerStats: StatBlock,
  encounter: MinorEncounter,
): MinorEncounterResult {
  const primaryValue = getStatTotal(playerStats, encounter.checkStat);
  const secondaryBonus = encounter.secondaryStat
    ? Math.round(
        getStatTotal(playerStats, encounter.secondaryStat) *
          (encounter.secondaryMultiplier ?? 0.5),
      )
    : 0;

  // Small random modifier for variance
  const rollMod = Math.floor(globalRng() * 7) - 3; // -3 to +3

  const totalCheck = primaryValue + secondaryBonus + rollMod;
  const success = totalCheck >= encounter.difficulty;

  const damageTaken = success ? 0 : encounter.failureDamage;
  const experienceGained = success ? encounter.experienceReward : Math.round(encounter.experienceReward * 0.25);

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

// ─── Utility: Create Combatant ──────────────────────────────────────

/** Helper to create a combatant from minimal data */
export function createCombatant(config: {
  id: string;
  name: string;
  level: number;
  stats: Record<StatName, number>;
  abilities?: CombatAbility[];
  isPlayer?: boolean;
  aiPattern?: Combatant['aiPattern'];
  portraitPrompt?: string;
}): Combatant {
  const statBlock: StatBlock = {} as StatBlock;
  for (const [key, value] of Object.entries(config.stats)) {
    statBlock[key as StatName] = {
      base: value,
      modifiers: [],
      total: value,
    };
  }

  const derived = computeDerived(statBlock, config.level);

  return {
    id: config.id,
    name: config.name,
    stats: statBlock,
    derived,
    currentHp: derived.maxHealth,
    level: config.level,
    statusEffects: [],
    abilities: config.abilities ?? [{ ...BASIC_ATTACK }],
    isPlayer: config.isPlayer ?? false,
    aiPattern: config.aiPattern,
    portraitPrompt: config.portraitPrompt,
  };
}
