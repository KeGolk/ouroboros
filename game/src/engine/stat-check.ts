/**
 * Stat-Check Resolution Engine
 *
 * Unified utility for resolving all stat-based checks in the game:
 * - Narrative dialogue checks (persuasion, intimidation, etc.)
 * - Combat stat checks (attack rolls, saving throws)
 * - Exploration checks (lockpicking, climbing, perception)
 * - Political intrigue checks (scheming, diplomacy, manipulation)
 *
 * Supports both the 6-stat PlayerStats system (narrative engine) and
 * the 9-stat StatBlock system (RPG engine), with automatic bridging.
 *
 * Features:
 * - d20-based rolling with advantage/disadvantage
 * - Critical success (nat 20) and critical failure (nat 1)
 * - 5-tier outcome system: critical_success, success, partial_success, failure, critical_failure
 * - Narrative text generation hooks for each outcome
 * - Situational modifiers from faction standing, equipment, buffs
 * - Compound checks (multiple stats combined)
 * - Deterministic mode for testing
 */

import type {
  PlayerStats,
  FactionStanding,
  FactionId,
} from './types';

// ─── Core Types ──────────────────────────────────────────────────────────────

/** All stats available for checks (union of both stat systems) */
export type CheckStat =
  // PlayerStats (narrative engine)
  | 'strength' | 'dexterity' | 'intelligence' | 'wisdom' | 'constitution' | 'charisma' | 'influence' | 'cunning' | 'diplomacy'
  // 9-stat system (RPG engine) — uppercase identifiers
  | 'STR' | 'DEX' | 'INT' | 'WIS' | 'CON' | 'CHA'
  | 'Influence' | 'Cunning' | 'Diplomacy';

/** Five-tier outcome levels */
export type OutcomeLevel =
  | 'critical_success'  // Natural 20 or exceeded DC by 10+
  | 'success'           // Met or exceeded DC
  | 'partial_success'   // Failed by 1-3 (close enough for partial)
  | 'failure'           // Failed by 4-9
  | 'critical_failure'; // Natural 1 or failed by 10+

/** Difficulty tiers with named DC values */
export enum CheckDifficulty {
  Trivial = 5,
  Easy = 8,
  Medium = 12,
  Hard = 15,
  VeryHard = 18,
  NearlyImpossible = 22,
  Legendary = 25,
  Godlike = 30,
}

/** Configuration for a stat check */
export interface StatCheckInput {
  /** Primary stat to check */
  stat: CheckStat;
  /** Difficulty class to beat */
  dc: number;
  /** Optional secondary stat (contributes at half weight) */
  secondaryStat?: CheckStat;
  /** Flat bonus/penalty modifier from situation, equipment, etc. */
  situationalModifier?: number;
  /** Roll with advantage (2d20 take highest) */
  advantage?: boolean;
  /** Roll with disadvantage (2d20 take lowest) */
  disadvantage?: boolean;
  /** Faction that modifies this check */
  factionContext?: {
    factionId: FactionId;
    /** How strongly faction standing affects this (default 1.0) */
    weight?: number;
  };
  /** Custom narrative text templates for each outcome level */
  narrativeTemplates?: Partial<Record<OutcomeLevel, string>>;
  /** If true, use threshold comparison instead of d20 roll (deterministic) */
  thresholdMode?: boolean;
  /** Tags for categorizing the check (e.g., 'social', 'combat', 'exploration') */
  tags?: string[];
}

/** The full result of a stat check */
export interface StatCheckOutput {
  /** The outcome level */
  outcome: OutcomeLevel;
  /** Whether the check passed (success or critical_success) */
  passed: boolean;
  /** Whether partial success was achieved */
  isPartial: boolean;
  /** Whether this was a critical hit/miss */
  isCritical: boolean;
  /** The d20 roll (undefined in threshold mode) */
  roll?: number;
  /** The stat modifier applied */
  statModifier: number;
  /** Secondary stat bonus applied */
  secondaryBonus: number;
  /** Situational modifier applied */
  situationalModifier: number;
  /** Faction standing bonus applied */
  factionBonus: number;
  /** The player's total score */
  total: number;
  /** The difficulty class */
  dc: number;
  /** Margin of success/failure (positive = passed by, negative = failed by) */
  margin: number;
  /** Which stat was checked */
  stat: CheckStat;
  /** The stat's raw value */
  statValue: number;
  /** Secondary stat info if used */
  secondaryStat?: CheckStat;
  secondaryStatValue?: number;
  /** Generated narrative text describing the outcome */
  narrativeText: string;
  /** Was this a threshold (deterministic) check? */
  isThresholdCheck: boolean;
  /** Category tags from the input */
  tags: string[];
}

/** Stats source — either PlayerStats or a numeric record */
export type StatsSource = PlayerStats | Record<string, number>;

// ─── Dice Rolling ───────────────────────────────────────────────────────────

/** Seedable RNG for deterministic testing */
let rngOverride: (() => number) | null = null;

/** Override the RNG for testing. Pass null to reset. */
export function setStatCheckRng(rng: (() => number) | null): void {
  rngOverride = rng;
}

/** Roll a d20 (1-20) */
export function rollD20(): number {
  const rand = rngOverride ? rngOverride() : Math.random();
  return Math.floor(rand * 20) + 1;
}

/** Roll 2d20 and take highest (advantage) or lowest (disadvantage) */
function rollD20WithAdvantage(isAdvantage: boolean): number {
  const roll1 = rollD20();
  const roll2 = rollD20();
  return isAdvantage ? Math.max(roll1, roll2) : Math.min(roll1, roll2);
}

// ─── Stat Value Resolution ──────────────────────────────────────────────────

/**
 * Mapping from 9-stat system to PlayerStats equivalents.
 * Used when a 9-stat identifier is passed but the stats source is PlayerStats.
 */
const STAT_BRIDGE: Record<string, keyof PlayerStats> = {
  STR: 'strength',
  CON: 'constitution',
  DEX: 'dexterity',
  INT: 'intelligence',
  WIS: 'wisdom',
  CHA: 'charisma',
  Influence: 'influence',
  Cunning: 'cunning',
  Diplomacy: 'diplomacy'
};

/**
 * Resolve a stat value from any stats source.
 * Handles both PlayerStats and generic numeric records.
 */
export function resolveStatValue(stats: StatsSource, stat: CheckStat): number {
  // Direct lookup first
  if (stat in stats) {
    return (stats as Record<string, number>)[stat] ?? 0;
  }

  // Try bridge mapping (9-stat -> PlayerStats)
  const bridged = STAT_BRIDGE[stat];
  if (bridged && bridged in stats) {
    return (stats as Record<string, number>)[bridged] ?? 0;
  }

  // Fallback: lowercase match attempt
  const lower = stat.toLowerCase();
  for (const key of Object.keys(stats)) {
    if (key.toLowerCase() === lower) {
      return (stats as Record<string, number>)[key] ?? 0;
    }
  }

  return 0;
}

/**
 * Calculate the D&D-style modifier from a stat value.
 * Formula: floor((stat - 10) / 2)
 */
export function calcStatModifier(statValue: number): number {
  return Math.floor((statValue - 10) / 2);
}

// ─── Faction Bonus ──────────────────────────────────────────────────────────

/**
 * Calculate bonus/penalty from faction standing.
 * Every 20 points of standing = +/-1 modifier, scaled by weight.
 */
export function calcFactionBonus(
  factions: FactionStanding | undefined,
  context?: StatCheckInput['factionContext'],
): number {
  if (!factions || !context) return 0;
  const standing = factions[context.factionId] ?? 0;
  const weight = context.weight ?? 1.0;
  return Math.floor((standing / 20) * weight);
}

// ─── Outcome Determination ──────────────────────────────────────────────────

/**
 * Determine the outcome level from the total, DC, and optional die roll.
 *
 * Rules:
 * - Natural 20 → critical_success (rolled checks only)
 * - Natural 1 → critical_failure (rolled checks only)
 * - Exceeded DC by 10+ → critical_success
 * - Met or exceeded DC → success
 * - Failed by 1-3 → partial_success
 * - Failed by 4-9 → failure
 * - Failed by 10+ → critical_failure
 */
export function determineOutcome(
  total: number,
  dc: number,
  roll?: number,
  isThreshold: boolean = false,
): OutcomeLevel {
  const margin = total - dc;

  // d20 natural rolls override (not in threshold mode)
  if (!isThreshold && roll !== undefined) {
    if (roll === 20) return 'critical_success';
    if (roll === 1) return 'critical_failure';
  }

  if (margin >= 10) return 'critical_success';
  if (margin >= 0) return 'success';
  if (margin >= -3) return 'partial_success';
  if (margin >= -9) return 'failure';
  return 'critical_failure';
}

// ─── Narrative Text Generation ──────────────────────────────────────────────

/** Default narrative text for each outcome level, keyed by check category */
const DEFAULT_NARRATIVES: Record<string, Record<OutcomeLevel, string>> = {
  social: {
    critical_success: 'Your words carry the weight of absolute authority. There is no question of dissent.',
    success: 'Your argument lands effectively. They are convinced.',
    partial_success: 'They waver, partially swayed but not entirely committed.',
    failure: 'Your words miss the mark. They remain unconvinced.',
    critical_failure: 'Your attempt backfires spectacularly, making things worse than before.',
  },
  combat: {
    critical_success: 'A devastating blow! Your strike finds its mark with lethal precision.',
    success: 'Your attack connects solidly.',
    partial_success: 'A glancing blow — some effect, but not as intended.',
    failure: 'Your attack fails to connect.',
    critical_failure: 'A catastrophic miss! You leave yourself wide open.',
  },
  exploration: {
    critical_success: 'Your expertise shines through. The task is accomplished with remarkable skill.',
    success: 'You successfully complete the task.',
    partial_success: 'You manage the task, but with complications.',
    failure: 'The challenge proves too great.',
    critical_failure: 'A disastrous failure. The situation has worsened considerably.',
  },
  political: {
    critical_success: 'A masterstroke of political acumen. Your rivals never see it coming.',
    success: 'Your political maneuvering achieves the desired result.',
    partial_success: 'A partial victory — you gain ground, but not without cost.',
    failure: 'Your political gambit fails to gain traction.',
    critical_failure: 'Your scheming is exposed. Enemies multiply.',
  },
  stealth: {
    critical_success: 'Like a shadow, you pass unnoticed. None suspect a thing.',
    success: 'You move unseen, accomplishing your goal quietly.',
    partial_success: 'You nearly succeed, but something draws a flicker of attention.',
    failure: 'You are detected. Stealth is no longer an option.',
    critical_failure: 'You stumble directly into the worst possible situation.',
  },
  knowledge: {
    critical_success: 'Ancient knowledge floods your mind — every detail, crisp and clear.',
    success: 'You recall the relevant information accurately.',
    partial_success: 'Fragments of memory surface — enough for a partial answer.',
    failure: 'The knowledge eludes you entirely.',
    critical_failure: 'You misremember the facts, arriving at a dangerously wrong conclusion.',
  },
  default: {
    critical_success: 'An extraordinary success beyond all expectations!',
    success: 'You succeed in your endeavor.',
    partial_success: 'A partial success — not quite what you hoped for.',
    failure: 'You fail in your attempt.',
    critical_failure: 'A catastrophic failure with unforeseen consequences.',
  },
};

/**
 * Generate narrative text for a check result.
 * Uses custom templates if provided, falls back to category defaults.
 */
export function generateNarrativeText(
  outcome: OutcomeLevel,
  templates?: Partial<Record<OutcomeLevel, string>>,
  tags?: string[],
): string {
  // Custom template takes priority
  if (templates?.[outcome]) {
    return templates[outcome]!;
  }

  // Find the best matching category from tags
  if (tags && tags.length > 0) {
    for (const tag of tags) {
      if (DEFAULT_NARRATIVES[tag]) {
        return DEFAULT_NARRATIVES[tag][outcome];
      }
    }
  }

  return DEFAULT_NARRATIVES.default[outcome];
}

// ─── Core Resolution Function ───────────────────────────────────────────────

/**
 * Resolve a stat check.
 *
 * This is the primary entry point for all stat-based checks in the game.
 * It handles both d20-based probabilistic checks and threshold-based
 * deterministic checks.
 *
 * @param input - The check configuration
 * @param stats - The character's stats (PlayerStats or any numeric record)
 * @param factions - Optional faction standings for faction-modified checks
 * @param deterministicRoll - Optional fixed d20 value for testing
 * @returns Full check result with outcome, narrative text, and breakdown
 *
 * @example
 * ```ts
 * // Basic strength check
 * const result = resolveStatCheck(
 *   { stat: 'strength', dc: 15, tags: ['combat'] },
 *   playerStats,
 * );
 *
 * // Charisma check with faction bonus and advantage
 * const result = resolveStatCheck(
 *   {
 *     stat: 'charisma',
 *     dc: 18,
 *     secondaryStat: 'wisdom',
 *     advantage: true,
 *     factionContext: { factionId: 'iron_throne', weight: 1.5 },
 *     tags: ['social', 'political'],
 *   },
 *   playerStats,
 *   factionStandings,
 * );
 *
 * // Threshold check (no dice, pure stat comparison)
 * const result = resolveStatCheck(
 *   { stat: 'cunning', dc: 14, thresholdMode: true },
 *   playerStats,
 * );
 * ```
 */
export function resolveStatCheck(
  input: StatCheckInput,
  stats: StatsSource,
  factions?: FactionStanding,
  deterministicRoll?: number,
): StatCheckOutput {
  const {
    stat,
    dc,
    secondaryStat,
    situationalModifier = 0,
    advantage = false,
    disadvantage = false,
    factionContext,
    narrativeTemplates,
    thresholdMode = false,
    tags = [],
  } = input;

  // Resolve stat values
  const statValue = resolveStatValue(stats, stat);
  const secondaryStatValue = secondaryStat
    ? resolveStatValue(stats, secondaryStat)
    : undefined;

  // Calculate modifiers
  const statModifier = calcStatModifier(statValue);
  const secondaryBonus = secondaryStatValue !== undefined
    ? Math.floor(calcStatModifier(secondaryStatValue) / 2)
    : 0;
  const factionBonus = calcFactionBonus(factions, factionContext);

  let total: number;
  let roll: number | undefined;

  if (thresholdMode) {
    // Threshold mode: pure stat comparison, no randomness
    total = statValue + secondaryBonus + factionBonus + situationalModifier;
  } else {
    // Rolled mode: d20 + modifiers
    if (deterministicRoll !== undefined) {
      roll = deterministicRoll;
    } else if (advantage && !disadvantage) {
      roll = rollD20WithAdvantage(true);
    } else if (disadvantage && !advantage) {
      roll = rollD20WithAdvantage(false);
    } else {
      roll = rollD20();
    }
    total = roll + statModifier + secondaryBonus + factionBonus + situationalModifier;
  }

  const outcome = determineOutcome(total, dc, roll, thresholdMode);
  const passed = outcome === 'critical_success' || outcome === 'success';
  const isPartial = outcome === 'partial_success';
  const isCritical = outcome === 'critical_success' || outcome === 'critical_failure';
  const margin = total - dc;

  const narrativeText = generateNarrativeText(outcome, narrativeTemplates, tags);

  return {
    outcome,
    passed,
    isPartial,
    isCritical,
    roll,
    statModifier,
    secondaryBonus,
    situationalModifier,
    factionBonus,
    total,
    dc,
    margin,
    stat,
    statValue,
    secondaryStat,
    secondaryStatValue,
    narrativeText,
    isThresholdCheck: thresholdMode,
    tags,
  };
}

// ─── Compound Checks ────────────────────────────────────────────────────────

/** Configuration for a compound (multi-stat) check */
export interface CompoundCheckInput {
  /** All checks that must pass (AND logic) */
  requiredChecks?: StatCheckInput[];
  /** Checks where at least N must pass (OR logic) */
  alternativeChecks?: StatCheckInput[];
  /** Minimum number of alternative checks that must pass (default 1) */
  minAlternativePasses?: number;
}

/** Result of a compound check */
export interface CompoundCheckOutput {
  /** Overall success (all required passed AND enough alternatives passed) */
  overallSuccess: boolean;
  /** Individual results for each check */
  results: StatCheckOutput[];
  /** How many checks passed */
  passedCount: number;
  /** Total number of checks */
  totalCount: number;
  /** Combined narrative text from all checks */
  combinedNarrative: string;
  /** Best outcome achieved across all checks */
  bestOutcome: OutcomeLevel;
  /** Worst outcome across all checks */
  worstOutcome: OutcomeLevel;
}

const OUTCOME_RANK: Record<OutcomeLevel, number> = {
  critical_success: 4,
  success: 3,
  partial_success: 2,
  failure: 1,
  critical_failure: 0,
};

/**
 * Resolve a compound check — multiple stat checks combined with AND/OR logic.
 *
 * Useful for complex scenarios like:
 * - Sneak past guards (DEX) AND forge documents (INT) — both must pass
 * - Enter the council via persuasion OR intimidation OR diplomacy — any one works
 * - Mixed: Must pass a STR check AND either CHA or CUN
 *
 * @example
 * ```ts
 * const result = resolveCompoundCheck(
 *   {
 *     requiredChecks: [{ stat: 'strength', dc: 12 }],
 *     alternativeChecks: [
 *       { stat: 'charisma', dc: 15 },
 *       { stat: 'cunning', dc: 15 },
 *     ],
 *     minAlternativePasses: 1,
 *   },
 *   playerStats,
 * );
 * ```
 */
export function resolveCompoundCheck(
  input: CompoundCheckInput,
  stats: StatsSource,
  factions?: FactionStanding,
  deterministicRolls?: number[],
): CompoundCheckOutput {
  const results: StatCheckOutput[] = [];
  let rollIndex = 0;

  // Evaluate required checks (all must pass or partially pass)
  let allRequiredPassed = true;
  if (input.requiredChecks) {
    for (const check of input.requiredChecks) {
      const roll = deterministicRolls?.[rollIndex++];
      const result = resolveStatCheck(check, stats, factions, roll);
      results.push(result);
      if (!result.passed && !result.isPartial) {
        allRequiredPassed = false;
      }
    }
  }

  // Evaluate alternative checks
  let alternativesPassed = 0;
  const minRequired = input.minAlternativePasses ?? 1;
  if (input.alternativeChecks) {
    for (const check of input.alternativeChecks) {
      const roll = deterministicRolls?.[rollIndex++];
      const result = resolveStatCheck(check, stats, factions, roll);
      results.push(result);
      if (result.passed || result.isPartial) {
        alternativesPassed++;
      }
    }
  }

  const alternativeSuccess = !input.alternativeChecks || alternativesPassed >= minRequired;
  const passedCount = results.filter(r => r.passed || r.isPartial).length;

  // Determine best/worst outcomes
  let bestOutcome: OutcomeLevel = 'critical_failure';
  let worstOutcome: OutcomeLevel = 'critical_success';
  for (const r of results) {
    if (OUTCOME_RANK[r.outcome] > OUTCOME_RANK[bestOutcome]) bestOutcome = r.outcome;
    if (OUTCOME_RANK[r.outcome] < OUTCOME_RANK[worstOutcome]) worstOutcome = r.outcome;
  }

  // Combine narratives
  const combinedNarrative = results.map(r => r.narrativeText).join(' ');

  return {
    overallSuccess: allRequiredPassed && alternativeSuccess,
    results,
    passedCount,
    totalCount: results.length,
    combinedNarrative,
    bestOutcome,
    worstOutcome,
  };
}

// ─── Opposed Check ──────────────────────────────────────────────────────────

/** Result of an opposed check between two characters */
export interface OpposedCheckOutput {
  /** Whether the initiator wins */
  initiatorWins: boolean;
  /** Initiator's check result */
  initiatorResult: StatCheckOutput;
  /** Opponent's check result */
  opponentResult: StatCheckOutput;
  /** The margin between the two totals */
  margin: number;
  /** Narrative text describing the contest */
  narrativeText: string;
}

/**
 * Resolve an opposed check between two characters.
 * Both roll d20 + stat modifier; higher total wins. Ties favor the opponent (defender).
 *
 * @example
 * ```ts
 * const result = resolveOpposedCheck(
 *   'charisma', playerStats,
 *   'wisdom', npcStats,
 *   { tags: ['social'] },
 * );
 * ```
 */
export function resolveOpposedCheck(
  initiatorStat: CheckStat,
  initiatorStats: StatsSource,
  opponentStat: CheckStat,
  opponentStats: StatsSource,
  options: {
    situationalModifier?: number;
    tags?: string[];
    narrativeTemplates?: {
      win?: string;
      lose?: string;
      tie?: string;
    };
  } = {},
  deterministicRolls?: [number, number],
): OpposedCheckOutput {
  const initiatorRoll = deterministicRolls?.[0] ?? rollD20();
  const opponentRoll = deterministicRolls?.[1] ?? rollD20();

  const initiatorValue = resolveStatValue(initiatorStats, initiatorStat);
  const opponentValue = resolveStatValue(opponentStats, opponentStat);

  const initiatorMod = calcStatModifier(initiatorValue);
  const opponentMod = calcStatModifier(opponentValue);

  const sitMod = options.situationalModifier ?? 0;
  const initiatorTotal = initiatorRoll + initiatorMod + sitMod;
  const opponentTotal = opponentRoll + opponentMod;

  const initiatorWins = initiatorTotal > opponentTotal;
  const margin = initiatorTotal - opponentTotal;

  // Build result objects
  const initiatorResult: StatCheckOutput = {
    outcome: initiatorWins
      ? (initiatorRoll === 20 ? 'critical_success' : 'success')
      : (initiatorRoll === 1 ? 'critical_failure' : 'failure'),
    passed: initiatorWins,
    isPartial: false,
    isCritical: initiatorRoll === 20 || initiatorRoll === 1,
    roll: initiatorRoll,
    statModifier: initiatorMod,
    secondaryBonus: 0,
    situationalModifier: sitMod,
    factionBonus: 0,
    total: initiatorTotal,
    dc: opponentTotal,
    margin,
    stat: initiatorStat,
    statValue: initiatorValue,
    narrativeText: '',
    isThresholdCheck: false,
    tags: options.tags ?? [],
  };

  const opponentResult: StatCheckOutput = {
    outcome: !initiatorWins
      ? (opponentRoll === 20 ? 'critical_success' : 'success')
      : (opponentRoll === 1 ? 'critical_failure' : 'failure'),
    passed: !initiatorWins,
    isPartial: false,
    isCritical: opponentRoll === 20 || opponentRoll === 1,
    roll: opponentRoll,
    statModifier: opponentMod,
    secondaryBonus: 0,
    situationalModifier: 0,
    factionBonus: 0,
    total: opponentTotal,
    dc: initiatorTotal,
    margin: -margin,
    stat: opponentStat,
    statValue: opponentValue,
    narrativeText: '',
    isThresholdCheck: false,
    tags: options.tags ?? [],
  };

  // Generate narrative
  let narrativeText: string;
  if (initiatorWins) {
    narrativeText = options.narrativeTemplates?.win
      ?? `A contest of wills! The challenger prevails with a total of ${initiatorTotal} against ${opponentTotal}.`;
  } else if (margin === 0) {
    narrativeText = options.narrativeTemplates?.tie
      ?? `An even match! The contest is a dead heat at ${initiatorTotal}. The defender holds.`;
  } else {
    narrativeText = options.narrativeTemplates?.lose
      ?? `The challenger falls short with ${initiatorTotal} against the defender's ${opponentTotal}.`;
  }

  return {
    initiatorWins,
    initiatorResult,
    opponentResult,
    margin,
    narrativeText,
  };
}

// ─── Convenience Presets ────────────────────────────────────────────────────

/**
 * Pre-configured stat check templates for common game scenarios.
 * Each returns a StatCheckInput that can be passed to resolveStatCheck().
 */
export const CHECK_PRESETS = {
  /** Persuade someone through charm and reason */
  persuade: (dc: number = CheckDifficulty.Medium): StatCheckInput => ({
    stat: 'charisma',
    secondaryStat: 'wisdom',
    dc,
    tags: ['social'],
    narrativeTemplates: {
      critical_success: 'Your words carry absolute conviction. There is no room for doubt.',
      success: 'Your argument resonates. They nod in agreement.',
      partial_success: 'They consider your words carefully, swayed but not fully committed.',
      failure: 'Your plea falls on deaf ears.',
      critical_failure: 'Your words inflame rather than persuade. You\'ve made an enemy.',
    },
  }),

  /** Intimidate through force of personality or physical presence */
  intimidate: (dc: number = CheckDifficulty.Medium): StatCheckInput => ({
    stat: 'strength',
    secondaryStat: 'charisma',
    dc,
    tags: ['social', 'combat'],
    narrativeTemplates: {
      critical_success: 'They tremble before you, utterly cowed.',
      success: 'Your threatening presence breaks their resolve.',
      partial_success: 'They flinch but hold their ground, clearly shaken.',
      failure: 'They stand firm against your bluster.',
      critical_failure: 'They laugh at your empty threats, emboldened.',
    },
  }),

  /** Deceive or bluff */
  deceive: (dc: number = CheckDifficulty.Medium): StatCheckInput => ({
    stat: 'cunning',
    secondaryStat: 'charisma',
    dc,
    tags: ['social', 'stealth'],
    narrativeTemplates: {
      critical_success: 'Your lie is so convincing, even you almost believe it.',
      success: 'They accept your story without question.',
      partial_success: 'They buy it, but something nags at them.',
      failure: 'They see right through your deception.',
      critical_failure: 'Not only is the lie exposed, but your credibility is destroyed.',
    },
  }),

  /** Read someone's true intentions */
  insight: (dc: number = CheckDifficulty.Hard): StatCheckInput => ({
    stat: 'wisdom',
    dc,
    tags: ['social', 'knowledge'],
    narrativeTemplates: {
      critical_success: 'You read them like an open book — every hidden motive laid bare.',
      success: 'You sense the truth behind their words.',
      partial_success: 'Something feels off, but you can\'t quite place what.',
      failure: 'Their true intentions remain hidden.',
      critical_failure: 'You completely misread their motives.',
    },
  }),

  /** Navigate a political situation */
  politicalManeuver: (dc: number = CheckDifficulty.Hard): StatCheckInput => ({
    stat: 'cunning',
    secondaryStat: 'charisma',
    dc,
    tags: ['political'],
    narrativeTemplates: {
      critical_success: 'A masterstroke! The court whispers your name with newfound respect.',
      success: 'Your political acumen carries the day.',
      partial_success: 'You gain ground, but not without drawing unwanted attention.',
      failure: 'Your political gambit fails to gain traction.',
      critical_failure: 'Your scheming is exposed. Powerful enemies take notice.',
    },
  }),

  /** Recall ancient lore or decipher text */
  lore: (dc: number = CheckDifficulty.Hard): StatCheckInput => ({
    stat: 'wisdom',
    dc,
    tags: ['knowledge'],
    narrativeTemplates: {
      critical_success: 'The ancient text yields its secrets — and reveals hidden truths besides.',
      success: 'You successfully decipher the key passages.',
      partial_success: 'Fragments of meaning emerge, pointing you in the right direction.',
      failure: 'The knowledge eludes you entirely.',
      critical_failure: 'You mistranslate a crucial passage, drawing false conclusions.',
    },
  }),

  /** Endure physical hardship (poison, torture, exhaustion) */
  endure: (dc: number = CheckDifficulty.Medium): StatCheckInput => ({
    stat: 'strength',
    secondaryStat: 'wisdom',
    dc,
    tags: ['combat'],
    narrativeTemplates: {
      critical_success: 'You endure without flinching. Your resilience is legendary.',
      success: 'You grit your teeth and push through.',
      partial_success: 'You endure, but it takes a toll.',
      failure: 'The ordeal proves too much to bear.',
      critical_failure: 'You collapse completely, body and spirit broken.',
    },
  }),

  /** Sneak past or hide */
  stealth: (dc: number = CheckDifficulty.Medium): StatCheckInput => ({
    stat: 'cunning',
    dc,
    tags: ['stealth'],
    narrativeTemplates: {
      critical_success: 'You move like a shadow — not a soul notices your passage.',
      success: 'You slip past undetected.',
      partial_success: 'You pass, but someone catches a fleeting glimpse.',
      failure: 'You\'re spotted. Cover is blown.',
      critical_failure: 'You stumble directly into a patrol.',
    },
  }),

  /** Rally troops or inspire followers */
  inspire: (dc: number = CheckDifficulty.Medium): StatCheckInput => ({
    stat: 'charisma',
    secondaryStat: 'diplomacy',
    dc,
    tags: ['social', 'political'],
    narrativeTemplates: {
      critical_success: 'Your words set their blood ablaze! They roar with renewed purpose!',
      success: 'Your speech lifts their spirits. They stand ready.',
      partial_success: 'Some cheer, but others exchange uncertain glances.',
      failure: 'Your words echo hollowly. Morale remains low.',
      critical_failure: 'Your speech highlights the hopelessness. Morale plummets.',
    },
  }),

  /** Broker peace between factions */
  diplomacy: (dc: number = CheckDifficulty.VeryHard): StatCheckInput => ({
    stat: 'charisma',
    secondaryStat: 'wisdom',
    dc,
    tags: ['political', 'social'],
    narrativeTemplates: {
      critical_success: 'A historic accord! Both sides hail you as a peacemaker.',
      success: 'After tense negotiation, an agreement is reached.',
      partial_success: 'A fragile ceasefire, but tensions simmer beneath.',
      failure: 'Talks collapse. Both sides blame each other — and you.',
      critical_failure: 'Your mediation ignites old wounds. War feels inevitable.',
    },
  }),

  /** Execute a scheme or plot */
  scheme: (dc: number = CheckDifficulty.Hard): StatCheckInput => ({
    stat: 'cunning',
    secondaryStat: 'cunning',
    dc,
    tags: ['political', 'stealth'],
    narrativeTemplates: {
      critical_success: 'Your scheme unfolds with clockwork precision. No one suspects.',
      success: 'The pieces fall into place as planned.',
      partial_success: 'The scheme works, but loose ends remain.',
      failure: 'Your plot unravels before it takes effect.',
      critical_failure: 'The scheme collapses and you\'re exposed. Your rivals know.',
    },
  }),
} as const;

// ─── Utility: Quick Check ───────────────────────────────────────────────────

/**
 * Quick stat check for simple pass/fail scenarios.
 * Returns just the boolean result and narrative text.
 *
 * @example
 * ```ts
 * const { passed, text } = quickCheck('strength', 15, playerStats);
 * if (passed) { ... }
 * ```
 */
export function quickCheck(
  stat: CheckStat,
  dc: number,
  stats: StatsSource,
  options?: {
    tags?: string[];
    situationalModifier?: number;
    factions?: FactionStanding;
    factionContext?: StatCheckInput['factionContext'];
  },
): { passed: boolean; isPartial: boolean; text: string; outcome: OutcomeLevel } {
  const result = resolveStatCheck(
    {
      stat,
      dc,
      situationalModifier: options?.situationalModifier,
      factionContext: options?.factionContext,
      tags: options?.tags,
    },
    stats,
    options?.factions,
  );

  return {
    passed: result.passed,
    isPartial: result.isPartial,
    text: result.narrativeText,
    outcome: result.outcome,
  };
}

// ─── Difficulty Helpers ─────────────────────────────────────────────────────

/**
 * Get a human-readable label for a difficulty value.
 */
export function getDifficultyLabel(dc: number): string {
  if (dc <= CheckDifficulty.Trivial) return 'Trivial';
  if (dc <= CheckDifficulty.Easy) return 'Easy';
  if (dc <= CheckDifficulty.Medium) return 'Moderate';
  if (dc <= CheckDifficulty.Hard) return 'Hard';
  if (dc <= CheckDifficulty.VeryHard) return 'Very Hard';
  if (dc <= CheckDifficulty.NearlyImpossible) return 'Nearly Impossible';
  if (dc <= CheckDifficulty.Legendary) return 'Legendary';
  return 'Godlike';
}

/**
 * Estimate the probability of passing a check given a stat value and DC.
 * Returns a percentage (0-100).
 */
export function estimateSuccessChance(
  statValue: number,
  dc: number,
  situationalModifier: number = 0,
): number {
  const modifier = calcStatModifier(statValue) + situationalModifier;
  // Need to roll (dc - modifier) or higher on d20
  const minRoll = dc - modifier;

  if (minRoll <= 1) return 100; // Auto-succeed (except nat 1)
  if (minRoll > 20) return 5;  // Only nat 20 succeeds

  // Chance = (21 - minRoll) / 20 * 100
  const chance = ((21 - minRoll) / 20) * 100;
  return Math.max(5, Math.min(95, Math.round(chance)));
}
