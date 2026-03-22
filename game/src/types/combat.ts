/**
 * Combat system types for the branching narrative RPG.
 *
 * Supports two combat modes:
 * 1. Minor encounters — stat-check resolution (single roll, narrative outcome)
 * 2. Boss fights — multi-round tactical combat with abilities and turn order
 *
 * All combat resolves through the primary stats:
 *   STR (strength), DEX (dexterity), INT (intelligence),
 *   WIS (wisdom), CON (constitution), CHA (charisma)
 */

import type { StatName, StatBlock, DerivedStats } from './stats';

// ─── Combatant ───────────────────────────────────────────────────────

/** Represents any entity that can participate in combat */
export interface Combatant {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Primary stat block */
  stats: StatBlock;
  /** Derived combat numbers */
  derived: DerivedStats;
  /** Current hit points (mutable during combat) */
  currentHp: number;
  /** Current level */
  level: number;
  /** Active status effects */
  statusEffects: StatusEffect[];
  /** Available combat abilities */
  abilities: CombatAbility[];
  /** Whether this is the player character */
  isPlayer: boolean;
  /** AI behavior pattern for NPCs */
  aiPattern?: AiPattern;
  /** Portrait / art prompt for combat UI */
  portraitPrompt?: string;
}

/** AI behavior patterns for NPC combatants */
export type AiPattern =
  | 'aggressive'   // Prioritizes highest damage
  | 'defensive'    // Prioritizes healing/defense when low HP
  | 'tactical'     // Uses abilities strategically based on situation
  | 'berserker'    // Gets stronger as HP drops
  | 'support';     // Focuses on buffs/debuffs

// ─── Abilities ───────────────────────────────────────────────────────

/** Damage types that interact with different defenses */
export type DamageType = 'physical' | 'tactical' | 'arcane' | 'poison' | 'true';

/** Which stat powers this ability */
export type ScalingStat = StatName;

/** A combat ability usable in boss fights */
export interface CombatAbility {
  id: string;
  name: string;
  description: string;
  /** The stat this ability scales with for damage/effectiveness */
  scalingStat: ScalingStat;
  /** Type of damage dealt */
  damageType: DamageType;
  /** Base damage before stat scaling */
  baseDamage: number;
  /** Multiplier applied to the scaling stat */
  statMultiplier: number;
  /** Accuracy modifier (added to base hit chance) */
  accuracyMod: number;
  /** Cooldown in rounds (0 = usable every round) */
  cooldown: number;
  /** Current cooldown remaining */
  currentCooldown: number;
  /** Status effect applied on hit (optional) */
  appliesEffect?: StatusEffectTemplate;
  /** Whether this ability targets self (heal/buff) */
  targetsSelf: boolean;
  /** Whether this ability hits all enemies */
  areaOfEffect: boolean;
  /** Minimum stat requirement to use */
  statRequirement?: { stat: ScalingStat; minimum: number };
  /** Narrative text shown when used */
  flavorText: string;
}

/** Template for applying status effects */
export interface StatusEffectTemplate {
  type: StatusEffectType;
  duration: number;
  potency: number;
}

// ─── Status Effects ──────────────────────────────────────────────────

export type StatusEffectType =
  | 'bleed'         // DOT: physical damage per round
  | 'poison'        // DOT: poison damage per round
  | 'burn'          // DOT: arcane damage per round
  | 'stun'          // Skip next turn
  | 'weakened'      // Reduced attack power
  | 'fortified'     // Increased defense
  | 'haste'         // Extra action
  | 'slow'          // Reduced initiative
  | 'inspired'      // Increased crit chance
  | 'demoralized'   // Reduced hit chance
  | 'regeneration'  // Heal per round
  | 'shield';       // Absorbs damage

export interface StatusEffect {
  type: StatusEffectType;
  /** Rounds remaining */
  duration: number;
  /** Effect strength (damage per round, stat modifier amount, etc.) */
  potency: number;
  /** Source ability or event */
  source: string;
}

// ─── Combat Actions ──────────────────────────────────────────────────

/** Actions a combatant can take on their turn */
export type CombatActionType = 'attack' | 'ability' | 'defend' | 'flee';

export interface CombatAction {
  type: CombatActionType;
  /** For 'ability' actions, which ability is used */
  abilityId?: string;
  /** Who is targeted (combatant ID) */
  targetId?: string;
}

// ─── Combat Resolution ──────────────────────────────────────────────

/** Result of a single attack or ability roll */
export interface AttackResult {
  /** Did the attack connect? */
  hit: boolean;
  /** Was this a critical hit? */
  critical: boolean;
  /** Final damage dealt (after defense, before HP clamp) */
  damage: number;
  /** Damage before mitigation */
  rawDamage: number;
  /** Defense/resist value that reduced damage */
  mitigated: number;
  /** The computed hit chance (0-100) */
  hitChance: number;
  /** The actual roll (0-100) */
  hitRoll: number;
  /** Status effects applied */
  appliedEffects: StatusEffect[];
  /** Narrative description of what happened */
  narrative: string;
}

/** Result of a defend action */
export interface DefendResult {
  /** Temporary defense bonus gained */
  defenseBonus: number;
  /** Narrative description */
  narrative: string;
}

/** Result of a flee attempt */
export interface FleeResult {
  success: boolean;
  /** Flee chance was dexterity vs enemy cunning */
  fleeChance: number;
  fleeRoll: number;
  narrative: string;
}

/** The outcome of one combatant's full turn */
export interface TurnResult {
  /** Who acted */
  actorId: string;
  /** What action was taken */
  action: CombatAction;
  /** Result of the action */
  attackResult?: AttackResult;
  defendResult?: DefendResult;
  fleeResult?: FleeResult;
  /** DOT / status effect tick results applied at start of turn */
  statusTicks: StatusTickResult[];
  /** State snapshot of all combatants after this turn */
  combatantSnapshots: CombatantSnapshot[];
}

/** Result of a status effect ticking at start of turn */
export interface StatusTickResult {
  effectType: StatusEffectType;
  /** Damage dealt or healing done */
  value: number;
  /** Did the effect expire this tick? */
  expired: boolean;
  narrative: string;
}

/** Minimal snapshot of a combatant's state for UI rendering */
export interface CombatantSnapshot {
  id: string;
  name: string;
  currentHp: number;
  maxHp: number;
  statusEffects: StatusEffect[];
  isDefeated: boolean;
}

// ─── Encounter Definitions ──────────────────────────────────────────

/** A minor (stat-check) encounter embedded in narrative */
export interface MinorEncounter {
  id: string;
  type: 'minor';
  /** Narrative setup text */
  description: string;
  /** Which stat is checked */
  checkStat: ScalingStat;
  /** Difficulty threshold (stat total must meet or exceed) */
  difficulty: number;
  /** Optional secondary stat that provides a bonus */
  secondaryStat?: ScalingStat;
  /** Multiplier for secondary stat contribution (default 0.5) */
  secondaryMultiplier?: number;
  /** Flat damage dealt on failure */
  failureDamage: number;
  /** Text shown on success */
  successText: string;
  /** Text shown on failure */
  failureText: string;
  /** Experience gained on success */
  experienceReward: number;
  /** Chapter/scene this encounter belongs to */
  chapterId: string;
}

/** A boss fight encounter with multi-round combat */
export interface BossEncounter {
  id: string;
  type: 'boss';
  /** Narrative setup text */
  description: string;
  /** Enemy combatants */
  enemies: Combatant[];
  /** Boss-specific mechanics (phase transitions, etc.) */
  phases?: BossPhase[];
  /** Experience gained on victory */
  experienceReward: number;
  /** Narrative text on victory */
  victoryText: string;
  /** Narrative text on defeat */
  defeatText: string;
  /** Can the player flee? */
  canFlee: boolean;
  /** Chapter/scene this encounter belongs to */
  chapterId: string;
}

/** Boss fight phase transition */
export interface BossPhase {
  /** HP percentage threshold to trigger this phase */
  hpThreshold: number;
  /** Narrative text when phase begins */
  transitionText: string;
  /** Stat changes applied to the boss */
  statChanges?: Partial<Record<StatName, number>>;
  /** New abilities unlocked */
  newAbilities?: CombatAbility[];
  /** Status effects applied to the boss */
  appliedEffects?: StatusEffectTemplate[];
}

export type Encounter = MinorEncounter | BossEncounter;

// ─── Combat State ────────────────────────────────────────────────────

/** Current state of an ongoing boss fight */
export interface CombatState {
  /** Unique combat instance ID */
  id: string;
  /** The encounter being fought */
  encounterId: string;
  /** Current round number */
  round: number;
  /** Turn order (combatant IDs sorted by initiative) */
  turnOrder: string[];
  /** Index into turnOrder for current actor */
  currentTurnIndex: number;
  /** All combatants (player + enemies) */
  combatants: Combatant[];
  /** Complete log of all turns */
  turnLog: TurnResult[];
  /** Is combat finished? */
  isComplete: boolean;
  /** Final outcome */
  outcome?: CombatOutcome;
  /** Current boss phase index (0-based) */
  currentPhase: number;
}

export type CombatOutcome = 'victory' | 'defeat' | 'fled';

/** Result returned after combat ends */
export interface CombatResult {
  outcome: CombatOutcome;
  /** Total experience earned */
  experienceGained: number;
  /** HP remaining on player */
  playerHpRemaining: number;
  /** Rounds the combat lasted */
  roundsElapsed: number;
  /** Full turn log for replay / narrative */
  turnLog: TurnResult[];
  /** Narrative summary */
  summary: string;
}

/** Result of a minor encounter stat check */
export interface MinorEncounterResult {
  success: boolean;
  /** The stat value that was checked */
  statValue: number;
  /** The difficulty threshold */
  difficulty: number;
  /** Bonus from secondary stat */
  secondaryBonus: number;
  /** Total check value (stat + secondary bonus + roll modifier) */
  totalCheck: number;
  /** Damage taken on failure */
  damageTaken: number;
  /** Experience gained */
  experienceGained: number;
  /** Narrative text */
  narrative: string;
}
