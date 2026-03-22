/**
 * Stat-Based Narrative & Dialogue Check System
 *
 * Uses INT, WIS, CHA, Influence, Cunning, and Diplomacy stats to:
 * - Determine success/failure of skill checks during dialogue
 * - Unlock conditional dialogue options based on stat thresholds
 * - Provide graduated outcomes (critical success, success, partial, failure, critical failure)
 * - Support combined stat checks (e.g., CHA + Diplomacy for treaty negotiation)
 * - Apply situational modifiers from faction standing, relationship, and flags
 *
 * The system supports both deterministic (threshold-based) checks for dialogue unlocks
 * and probabilistic (d20-based) checks for skill challenges.
 */

import type {
  GameState,
  PlayerStats,
  FactionStanding,
  FactionId,
  Condition,
  Effect,
} from './types';
import { evaluateConditions } from './conditions';

// ─── Dialogue Stat Types ────────────────────────────────────────────────────

/** Stats used for narrative/dialogue checks */
export type DialogueStat = 'wisdom' | 'charisma' | 'cunning';

/** Political stats that modify narrative outcomes */
export type PoliticalStat = 'diplomacy' | 'cunning';

/** All stats available for narrative checks */
export type NarrativeStat = DialogueStat | PoliticalStat | keyof PlayerStats;

/** Named skill check archetypes mapped to their governing stats */
export type SkillCheckType =
  | 'persuasion'     // CHA primary, Diplomacy-like (uses diplomacy)
  | 'intimidation'   // STR/CHA hybrid (uses strength + charisma)
  | 'deception'      // CUN primary (uses cunning)
  | 'insight'        // WIS primary (uses wisdom)
  | 'investigation'  // INT-like (uses cunning + wisdom)
  | 'diplomacy'      // CHA + diplomacy (uses charisma + diplomacy)
  | 'manipulation'   // CUN + cunning (uses cunning + influence)
  | 'lore'           // WIS/INT (uses wisdom)
  | 'perception'     // WIS (uses wisdom)
  | 'negotiation'    // CHA + CUN (uses charisma + cunning)
  | 'scheme'         // CUN + influence (uses cunning + influence)
  | 'inspire'        // CHA + diplomacy (uses charisma + diplomacy)
  | 'custom';        // Uses explicitly specified stats

// ─── Difficulty Tiers ───────────────────────────────────────────────────────

export enum DialogueDifficulty {
  /** Basic checks — almost anyone can pass */
  Trivial = 5,
  /** Simple social situations */
  Easy = 8,
  /** Average social challenge, needs some skill */
  Medium = 12,
  /** Difficult — convincing a suspicious guard, outwitting a spy */
  Hard = 16,
  /** Very challenging — swaying a hostile noble, deciphering ancient plots */
  VeryHard = 20,
  /** Nearly impossible — convincing an enemy leader, uncovering a master scheme */
  Legendary = 25,
  /** Godlike — changing the course of history through words alone */
  Impossible = 30,
}

// ─── Check Outcome ──────────────────────────────────────────────────────────

export type CheckOutcomeLevel =
  | 'critical_success'  // Natural 20 or exceeded DC by 10+
  | 'success'           // Met or exceeded DC
  | 'partial_success'   // Failed by 1-3 (close enough for partial outcomes)
  | 'failure'           // Failed by 4+
  | 'critical_failure'; // Natural 1 or failed by 10+

export interface DialogueCheckResult {
  /** The type of check performed */
  checkType: SkillCheckType;
  /** The outcome level */
  outcome: CheckOutcomeLevel;
  /** Whether the check passed (success or critical_success) */
  passed: boolean;
  /** Whether partial success was achieved */
  isPartial: boolean;
  /** The player's total roll/score */
  playerTotal: number;
  /** The difficulty class */
  dc: number;
  /** Margin of success/failure (positive = passed by, negative = failed by) */
  margin: number;
  /** The primary stat used */
  primaryStat: keyof PlayerStats;
  /** The primary stat's value */
  primaryStatValue: number;
  /** Any secondary stat used */
  secondaryStat?: keyof PlayerStats;
  /** Secondary stat value */
  secondaryStatValue?: number;
  /** The d20 roll (if probabilistic) */
  roll?: number;
  /** Bonus from faction standing */
  factionBonus: number;
  /** Bonus from situational modifiers */
  situationalBonus: number;
  /** Descriptive text about the outcome */
  narrativeText: string;
  /** Was this a threshold (deterministic) check? */
  isThresholdCheck: boolean;
}

// ─── Dialogue Check Configuration ───────────────────────────────────────────

export interface DialogueCheckConfig {
  /** The type of skill check */
  type: SkillCheckType;
  /** Difficulty class */
  dc: number;
  /** For custom checks: which primary stat to use */
  primaryStat?: keyof PlayerStats;
  /** For custom checks: optional secondary stat (averaged in at half weight) */
  secondaryStat?: keyof PlayerStats;
  /** Whether this is a threshold check (deterministic) or a d20 roll */
  isThresholdCheck?: boolean;
  /** Faction that, if favored, grants a bonus */
  factionBonus?: { faction: FactionId; weight: number };
  /** Extra situational modifier */
  situationalModifier?: number;
  /** Flavor text templates for each outcome */
  narrativeTemplates?: Partial<Record<CheckOutcomeLevel, string>>;
  /** Whether advantage applies (roll 2d20 take highest) */
  advantage?: boolean;
  /** Whether disadvantage applies */
  disadvantage?: boolean;
}

// ─── Conditional Dialogue Option ────────────────────────────────────────────

export interface ConditionalDialogue {
  /** Unique ID for this dialogue option */
  id: string;
  /** The text shown to the player (may include stat tag like "[CHA 14]") */
  text: string;
  /** The type of stat check required to show this option */
  checkType: SkillCheckType;
  /** Minimum stat threshold to show this option (deterministic unlock) */
  statThreshold: number;
  /** The primary stat checked for visibility */
  primaryStat: keyof PlayerStats;
  /** Optional secondary stat checked */
  secondaryStat?: keyof PlayerStats;
  /** Additional conditions beyond stat threshold */
  additionalConditions?: Condition[];
  /** If the option is attempted, the DC for success */
  attemptDC?: number;
  /** Effects applied on success */
  successEffects?: Effect[];
  /** Effects applied on failure */
  failureEffects?: Effect[];
  /** Effects applied on partial success */
  partialEffects?: Effect[];
  /** Scene to navigate to on success */
  successSceneId?: string;
  /** Scene to navigate to on failure */
  failureSceneId?: string;
  /** Scene for partial success */
  partialSceneId?: string;
  /** Tooltip showing the check info (auto-generated if not provided) */
  tooltip?: string;
  /** Whether this option is hidden until the stat requirement is met */
  hideIfUnqualified?: boolean;
  /** Whether failing this check has story consequences */
  failureIsConsequential?: boolean;
}

// ─── Skill Check Stat Mappings ──────────────────────────────────────────────

/**
 * Maps each skill check type to its governing stats.
 * Primary stat contributes full modifier; secondary contributes half.
 */
export const SKILL_CHECK_STATS: Record<
  Exclude<SkillCheckType, 'custom'>,
  { primary: keyof PlayerStats; secondary?: keyof PlayerStats; description: string }
> = {
  persuasion: {
    primary: 'charisma',
    secondary: 'diplomacy',
    description: 'Appeal to reason and emotion to convince others',
  },
  intimidation: {
    primary: 'strength',
    secondary: 'charisma',
    description: 'Use force of personality or physical presence to coerce',
  },
  deception: {
    primary: 'cunning',
    secondary: 'charisma',
    description: 'Mislead, lie, or create false impressions',
  },
  insight: {
    primary: 'wisdom',
    description: 'Read body language, detect lies, and understand hidden motives',
  },
  investigation: {
    primary: 'wisdom',
    secondary: 'cunning',
    description: 'Piece together clues, analyze evidence, and uncover secrets',
  },
  diplomacy: {
    primary: 'charisma',
    secondary: 'diplomacy',
    description: 'Negotiate treaties, broker peace, and build alliances',
  },
  manipulation: {
    primary: 'cunning',
    secondary: 'influence',
    description: 'Exploit weaknesses, blackmail, and pull strings from the shadows',
  },
  lore: {
    primary: 'wisdom',
    description: 'Recall ancient knowledge, decipher texts, and identify artifacts',
  },
  perception: {
    primary: 'wisdom',
    description: 'Notice hidden details, eavesdrop, and spot danger',
  },
  negotiation: {
    primary: 'charisma',
    secondary: 'cunning',
    description: 'Broker deals, haggle, and find mutually beneficial arrangements',
  },
  scheme: {
    primary: 'cunning',
    secondary: 'influence',
    description: 'Plan elaborate plots, set traps, and orchestrate betrayals',
  },
  inspire: {
    primary: 'charisma',
    secondary: 'diplomacy',
    description: 'Rally troops, inspire loyalty, and kindle hope in dark times',
  },
};

// ─── Core Check Functions ───────────────────────────────────────────────────

/**
 * Roll a d20 (1-20).
 */
function rollD20(): number {
  return Math.floor(Math.random() * 20) + 1;
}

/**
 * Roll with advantage/disadvantage.
 */
function rollD20Advantage(advantage: boolean): number {
  const roll1 = rollD20();
  const roll2 = rollD20();
  return advantage ? Math.max(roll1, roll2) : Math.min(roll1, roll2);
}

/**
 * Get the effective stat value for a check.
 * Primary stat counts fully; secondary stat contributes half (floored).
 */
export function getEffectiveStatValue(
  stats: PlayerStats,
  primaryStat: keyof PlayerStats,
  secondaryStat?: keyof PlayerStats,
): number {
  const primaryValue = stats[primaryStat];
  if (!secondaryStat) return primaryValue;
  const secondaryValue = stats[secondaryStat];
  return primaryValue + Math.floor(secondaryValue / 4);
}

/**
 * Calculate the D&D-style modifier from a stat value.
 * Uses floor((stat - 10) / 2).
 */
export function getStatModifier(statValue: number): number {
  return Math.floor((statValue - 10) / 2);
}

/**
 * Get faction standing bonus for a check.
 * Positive standing grants a bonus; negative grants a penalty.
 * Scaled: every 20 points of standing = +/-1 modifier.
 */
export function getFactionBonus(
  factions: FactionStanding,
  factionConfig?: { faction: FactionId; weight: number },
): number {
  if (!factionConfig) return 0;
  const standing = factions[factionConfig.faction];
  return Math.floor((standing / 20) * factionConfig.weight);
}

/**
 * Determine the outcome level based on roll, total, and DC.
 */
export function determineOutcome(
  total: number,
  dc: number,
  roll?: number,
  isThreshold: boolean = false,
): CheckOutcomeLevel {
  const margin = total - dc;

  // For threshold checks, no critical results
  if (isThreshold) {
    if (margin >= 10) return 'critical_success';
    if (margin >= 0) return 'success';
    if (margin >= -3) return 'partial_success';
    if (margin >= -10) return 'failure';
    return 'critical_failure';
  }

  // d20 checks: natural 20/1 matter
  if (roll === 20) return 'critical_success';
  if (roll === 1) return 'critical_failure';

  if (margin >= 10) return 'critical_success';
  if (margin >= 0) return 'success';
  if (margin >= -3) return 'partial_success';
  if (margin >= -10) return 'failure';
  return 'critical_failure';
}

/**
 * Generate default narrative text for a check result.
 */
function generateNarrativeText(
  checkType: SkillCheckType,
  outcome: CheckOutcomeLevel,
  templates?: Partial<Record<CheckOutcomeLevel, string>>,
): string {
  // Use custom templates if provided
  if (templates?.[outcome]) {
    return templates[outcome]!;
  }

  // Default narrative text per check type and outcome
  const defaults: Record<SkillCheckType, Record<CheckOutcomeLevel, string>> = {
    persuasion: {
      critical_success: 'Your words strike with absolute conviction. They are utterly swayed.',
      success: 'Your argument lands. They nod, convinced.',
      partial_success: 'They waver, partially convinced but still uncertain.',
      failure: 'Your words fall on deaf ears. They remain unmoved.',
      critical_failure: 'Your plea backfires spectacularly. They are now more opposed than before.',
    },
    intimidation: {
      critical_success: 'They tremble before your overwhelming presence. Complete submission.',
      success: 'Your threat is taken seriously. They back down.',
      partial_success: 'They flinch but hold their ground, clearly shaken.',
      failure: 'They stand firm, unimpressed by your bluster.',
      critical_failure: 'They laugh at your attempt and grow bolder.',
    },
    deception: {
      critical_success: 'Your lie is so convincing they would stake their life on it.',
      success: 'They believe your deception without question.',
      partial_success: 'They accept your story, though something seems to nag at them.',
      failure: 'Your deception is transparent. They see right through you.',
      critical_failure: 'Not only do they catch the lie, but they now suspect your every word.',
    },
    insight: {
      critical_success: 'You perceive their deepest motives as clearly as written text.',
      success: 'You read their intentions accurately.',
      partial_success: 'You sense something is off, but can\'t quite pinpoint what.',
      failure: 'Their true intentions remain hidden from you.',
      critical_failure: 'You completely misread the situation, drawing false conclusions.',
    },
    investigation: {
      critical_success: 'The pieces fall together perfectly. You uncover the complete truth.',
      success: 'Your investigation yields the key information you sought.',
      partial_success: 'You find some clues, but the picture remains incomplete.',
      failure: 'Your investigation turns up nothing of value.',
      critical_failure: 'You find misleading evidence that sends you down the wrong path.',
    },
    diplomacy: {
      critical_success: 'A masterful display of diplomacy. Both sides feel they\'ve won.',
      success: 'You successfully broker an agreement acceptable to all parties.',
      partial_success: 'A fragile accord is reached, though tensions remain.',
      failure: 'Negotiations break down. The parties cannot find common ground.',
      critical_failure: 'Your diplomatic efforts ignite old grievances. Relations worsen.',
    },
    manipulation: {
      critical_success: 'They dance on your strings without ever knowing they were pulled.',
      success: 'Your manipulation achieves the desired result.',
      partial_success: 'You gain partial leverage, but they sense something amiss.',
      failure: 'Your attempt at manipulation is clumsy and obvious.',
      critical_failure: 'They realize you were trying to manipulate them and turn hostile.',
    },
    lore: {
      critical_success: 'Ancient knowledge floods your mind — you recall every relevant detail.',
      success: 'You recall the relevant lore accurately.',
      partial_success: 'You remember fragments, enough to piece together a partial answer.',
      failure: 'The knowledge eludes you. These texts are beyond your learning.',
      critical_failure: 'You misremember the lore, arriving at a dangerously wrong conclusion.',
    },
    perception: {
      critical_success: 'Nothing escapes your notice. You perceive even the most hidden details.',
      success: 'You notice the important details clearly.',
      partial_success: 'You catch a glimpse of something, but it\'s fleeting and unclear.',
      failure: 'You fail to notice anything unusual.',
      critical_failure: 'Your senses deceive you, and you focus on entirely the wrong thing.',
    },
    negotiation: {
      critical_success: 'A brilliant trade. You walk away with far more than expected.',
      success: 'The negotiation concludes favorably in your interest.',
      partial_success: 'You secure a deal, but with significant concessions.',
      failure: 'The other party drives a hard bargain you cannot match.',
      critical_failure: 'You somehow end up worse off than when you started.',
    },
    scheme: {
      critical_success: 'Your scheme unfolds with clockwork precision. No one suspects a thing.',
      success: 'The scheme succeeds as planned.',
      partial_success: 'The scheme partially works, but loose ends remain.',
      failure: 'Your scheme unravels before it can take effect.',
      critical_failure: 'The scheme collapses catastrophically and implicates you directly.',
    },
    inspire: {
      critical_success: 'Your words kindle an unquenchable fire. They would follow you into the abyss.',
      success: 'Your speech rallies their spirits. Morale soars.',
      partial_success: 'Some are moved, others remain skeptical. A mixed response.',
      failure: 'Your words ring hollow. They remain disheartened.',
      critical_failure: 'Your attempt to inspire backfires, deepening their despair.',
    },
    custom: {
      critical_success: 'An extraordinary success beyond all expectations.',
      success: 'You succeed in your endeavor.',
      partial_success: 'A partial success — not quite what you hoped for.',
      failure: 'You fail in your attempt.',
      critical_failure: 'A catastrophic failure with unforeseen consequences.',
    },
  };

  return defaults[checkType]?.[outcome] ?? defaults.custom[outcome];
}

// ─── Main Check Functions ───────────────────────────────────────────────────

/**
 * Resolve the stat mapping for a skill check type.
 */
export function resolveCheckStats(
  config: DialogueCheckConfig,
): { primary: keyof PlayerStats; secondary?: keyof PlayerStats } {
  if (config.type === 'custom') {
    return {
      primary: config.primaryStat ?? 'charisma',
      secondary: config.secondaryStat,
    };
  }
  const mapping = SKILL_CHECK_STATS[config.type];
  return {
    primary: config.primaryStat ?? mapping.primary,
    secondary: config.secondaryStat ?? mapping.secondary,
  };
}

/**
 * Perform a dialogue/narrative stat check.
 *
 * This is the core function that resolves whether a player passes a skill check
 * during dialogue or narrative scenes. It supports both:
 *
 * 1. **Threshold checks** (deterministic): Compare effective stat vs DC.
 *    Used for unlocking dialogue options — if your stat is high enough, the option appears.
 *
 * 2. **Rolled checks** (probabilistic): d20 + stat modifier vs DC.
 *    Used for attempting actions — success isn't guaranteed even with high stats.
 *
 * @param config - The check configuration (type, DC, modifiers)
 * @param state - The current game state
 * @param deterministicRoll - Optional fixed roll value (for testing)
 * @returns Detailed result of the check
 */
export function performDialogueCheck(
  config: DialogueCheckConfig,
  state: GameState,
  deterministicRoll?: number,
): DialogueCheckResult {
  const { primary, secondary } = resolveCheckStats(config);
  const isThreshold = config.isThresholdCheck ?? false;

  // Get effective stat value
  const primaryValue = state.stats[primary];
  const secondaryValue = secondary ? state.stats[secondary] : undefined;
  const effectiveStatValue = getEffectiveStatValue(state.stats, primary, secondary);

  // Calculate modifiers
  const statModifier = getStatModifier(effectiveStatValue);
  const factionBonus = getFactionBonus(state.factions, config.factionBonus);
  const situationalBonus = config.situationalModifier ?? 0;

  let playerTotal: number;
  let roll: number | undefined;

  if (isThreshold) {
    // Threshold check: pure stat comparison (no randomness)
    playerTotal = effectiveStatValue + factionBonus + situationalBonus;
  } else {
    // Rolled check: d20 + stat modifier + bonuses
    if (deterministicRoll !== undefined) {
      roll = deterministicRoll;
    } else if (config.advantage && !config.disadvantage) {
      roll = rollD20Advantage(true);
    } else if (config.disadvantage && !config.advantage) {
      roll = rollD20Advantage(false);
    } else {
      roll = rollD20();
    }
    playerTotal = roll + statModifier + factionBonus + situationalBonus;
  }

  const outcome = determineOutcome(playerTotal, config.dc, roll, isThreshold);
  const passed = outcome === 'critical_success' || outcome === 'success';
  const isPartial = outcome === 'partial_success';
  const margin = playerTotal - config.dc;

  const narrativeText = generateNarrativeText(
    config.type,
    outcome,
    config.narrativeTemplates,
  );

  return {
    checkType: config.type,
    outcome,
    passed,
    isPartial,
    playerTotal,
    dc: config.dc,
    margin,
    primaryStat: primary,
    primaryStatValue: primaryValue,
    secondaryStat: secondary,
    secondaryStatValue: secondaryValue,
    roll,
    factionBonus,
    situationalBonus,
    narrativeText,
    isThresholdCheck: isThreshold,
  };
}

/**
 * Perform a deterministic threshold check (for testing/reproducibility).
 * Always uses threshold mode (no d20 roll).
 */
export function performThresholdCheck(
  config: Omit<DialogueCheckConfig, 'isThresholdCheck'>,
  state: GameState,
): DialogueCheckResult {
  return performDialogueCheck(
    { ...config, isThresholdCheck: true },
    state,
  );
}

// ─── Dialogue Option Filtering ──────────────────────────────────────────────

/**
 * Check if a conditional dialogue option should be visible to the player.
 * Uses threshold-based checks — if the player's stat meets the threshold, it appears.
 */
export function isDialogueOptionAvailable(
  option: ConditionalDialogue,
  state: GameState,
): boolean {
  // Check stat threshold
  const effectiveStat = getEffectiveStatValue(
    state.stats,
    option.primaryStat,
    option.secondaryStat,
  );

  if (effectiveStat < option.statThreshold) {
    return false;
  }

  // Check additional conditions
  if (option.additionalConditions && option.additionalConditions.length > 0) {
    return evaluateConditions(option.additionalConditions, state);
  }

  return true;
}

/**
 * Filter a list of conditional dialogue options, returning only those
 * the player qualifies for based on stats and conditions.
 */
export function filterDialogueOptions(
  options: ConditionalDialogue[],
  state: GameState,
): ConditionalDialogue[] {
  return options.filter(opt => isDialogueOptionAvailable(opt, state));
}

/**
 * Categorize dialogue options into available, locked (visible but too hard),
 * and hidden (not shown at all).
 */
export function categorizeDialogueOptions(
  options: ConditionalDialogue[],
  state: GameState,
): {
  available: ConditionalDialogue[];
  locked: ConditionalDialogue[];
  hidden: ConditionalDialogue[];
} {
  const available: ConditionalDialogue[] = [];
  const locked: ConditionalDialogue[] = [];
  const hidden: ConditionalDialogue[] = [];

  for (const option of options) {
    if (isDialogueOptionAvailable(option, state)) {
      available.push(option);
    } else if (option.hideIfUnqualified) {
      hidden.push(option);
    } else {
      locked.push(option);
    }
  }

  return { available, locked, hidden };
}

/**
 * Attempt a conditional dialogue option's skill check.
 * Called when the player selects an option that has an attemptDC.
 */
export function attemptDialogueOption(
  option: ConditionalDialogue,
  state: GameState,
  deterministicRoll?: number,
): {
  result: DialogueCheckResult;
  effects: Effect[];
  nextSceneId?: string;
} {
  const dc = option.attemptDC ?? option.statThreshold;

  const result = performDialogueCheck(
    {
      type: option.checkType,
      dc,
      primaryStat: option.primaryStat,
      secondaryStat: option.secondaryStat,
    },
    state,
    deterministicRoll,
  );

  let effects: Effect[] = [];
  let nextSceneId: string | undefined;

  if (result.passed) {
    effects = option.successEffects ?? [];
    nextSceneId = option.successSceneId;
  } else if (result.isPartial && option.partialEffects) {
    effects = option.partialEffects;
    nextSceneId = option.partialSceneId ?? option.failureSceneId;
  } else {
    effects = option.failureEffects ?? [];
    nextSceneId = option.failureSceneId;
  }

  return { result, effects, nextSceneId };
}

// ─── Tooltip Generation ─────────────────────────────────────────────────────

/**
 * Generate a UI tooltip for a dialogue option showing the stat check info.
 */
export function generateCheckTooltip(
  option: ConditionalDialogue,
  state: GameState,
): string {
  const statNames: Record<keyof PlayerStats, string> = {
    strength: 'STR',
    dexterity: 'DEX',
    intelligence: 'INT',
    wisdom: 'WIS',
    constitution: 'CON',
    charisma: 'CHA',
    influence: 'INF',
    cunning: 'CUN',
    diplomacy: 'DIP',
  };

  const primaryName = statNames[option.primaryStat];
  const primaryValue = state.stats[option.primaryStat];
  const threshold = option.statThreshold;
  const meetsThreshold = primaryValue >= threshold;

  let tooltip = `[${primaryName} ${threshold}]`;

  if (option.secondaryStat) {
    const secondaryName = statNames[option.secondaryStat];
    tooltip += ` (+${secondaryName})`;
  }

  tooltip += ` — Your ${primaryName}: ${primaryValue}`;
  tooltip += meetsThreshold ? ' ✓' : ' ✗';

  if (option.attemptDC && option.attemptDC !== threshold) {
    tooltip += ` | Check DC: ${option.attemptDC}`;
  }

  return tooltip;
}

/**
 * Generate a display tag for showing stat requirements inline in choice text.
 * Example: "[CHA 14]" or "[CUN 16 + Honor]"
 */
export function generateStatTag(
  primaryStat: keyof PlayerStats,
  threshold: number,
  secondaryStat?: keyof PlayerStats,
): string {
  const statAbbrev: Record<keyof PlayerStats, string> = {
    strength: 'STR',
    dexterity: 'DEX',
    intelligence: 'INT',
    wisdom: 'WIS',
    constitution: 'CON',
    charisma: 'CHA',
    influence: 'INF',
    cunning: 'CUN',
    diplomacy: 'DIP',
  };

  let tag = `[${statAbbrev[primaryStat]} ${threshold}`;
  if (secondaryStat) {
    tag += ` + ${statAbbrev[secondaryStat]}`;
  }
  tag += ']';
  return tag;
}

// ─── Combined/Multi-Check System ────────────────────────────────────────────

export interface MultiCheckConfig {
  /** All checks that must pass (AND logic) */
  requiredChecks?: DialogueCheckConfig[];
  /** Checks where at least one must pass (OR logic) */
  alternativeChecks?: DialogueCheckConfig[];
  /** Minimum number of alternative checks that must pass */
  minAlternativePasses?: number;
}

/**
 * Perform a multi-check: a combination of required AND alternative checks.
 *
 * Useful for complex narrative moments where multiple skills might apply.
 * Example: To sneak past guards AND forge documents, both checks must pass.
 * Example: To enter the council, you can use persuasion OR intimidation OR diplomacy.
 */
export function performMultiCheck(
  config: MultiCheckConfig,
  state: GameState,
  deterministicRolls?: number[],
): {
  overallSuccess: boolean;
  results: DialogueCheckResult[];
  passedCount: number;
  totalCount: number;
} {
  const results: DialogueCheckResult[] = [];
  let rollIndex = 0;

  // Evaluate required checks (all must pass)
  let allRequiredPassed = true;
  if (config.requiredChecks) {
    for (const check of config.requiredChecks) {
      const roll = deterministicRolls?.[rollIndex++];
      const result = performDialogueCheck(check, state, roll);
      results.push(result);
      if (!result.passed && !result.isPartial) {
        allRequiredPassed = false;
      }
    }
  }

  // Evaluate alternative checks (at least minAlternativePasses must pass)
  let alternativesPassed = 0;
  const minRequired = config.minAlternativePasses ?? 1;
  if (config.alternativeChecks) {
    for (const check of config.alternativeChecks) {
      const roll = deterministicRolls?.[rollIndex++];
      const result = performDialogueCheck(check, state, roll);
      results.push(result);
      if (result.passed || result.isPartial) {
        alternativesPassed++;
      }
    }
  }

  const alternativeSuccess = !config.alternativeChecks || alternativesPassed >= minRequired;
  const passedCount = results.filter(r => r.passed || r.isPartial).length;

  return {
    overallSuccess: allRequiredPassed && alternativeSuccess,
    results,
    passedCount,
    totalCount: results.length,
  };
}

// ─── Reputation-Modified Checks ─────────────────────────────────────────────

/**
 * Get a situational modifier based on the player's relationship with a character
 * or their standing with a faction. This allows reputation to influence dialogue checks.
 *
 * @param state - Current game state
 * @param characterId - Optional character being spoken to
 * @param factionId - Optional faction context
 * @returns A modifier between -5 and +5
 */
export function getReputationModifier(
  state: GameState,
  characterId?: string,
  factionId?: FactionId,
): number {
  let modifier = 0;

  // Faction standing modifier: every 25 points = +/-1, max ±4
  if (factionId) {
    const standing = state.factions[factionId];
    modifier += Math.max(-4, Math.min(4, Math.floor(standing / 25)));
  }

  // Diplomacy/cunning can affect certain checks
  // High diplomacy: +1 to diplomacy/inspire checks with lawful characters
  // High cunning: +1 to manipulation/scheme checks
  if (state.stats.diplomacy >= 75) modifier += 1;
  if (state.stats.cunning >= 75) modifier += 1;

  return Math.max(-5, Math.min(5, modifier));
}

// ─── Narrative Check Presets ────────────────────────────────────────────────

/**
 * Pre-built check configurations for common narrative scenarios.
 * Use these as templates for story content.
 */
export const NARRATIVE_CHECK_PRESETS = {
  /** Convince a guard to let you pass */
  convinceGuard: (dc: number = DialogueDifficulty.Medium): DialogueCheckConfig => ({
    type: 'persuasion',
    dc,
    narrativeTemplates: {
      critical_success: 'The guard not only lets you pass but offers to escort you.',
      success: 'The guard steps aside, convinced by your argument.',
      partial_success: 'The guard hesitates, then lets you through with a warning.',
      failure: '"I have my orders. You shall not pass."',
      critical_failure: '"Guards! We have an intruder!"',
    },
  }),

  /** Detect a character's hidden motives */
  readIntentions: (dc: number = DialogueDifficulty.Hard): DialogueCheckConfig => ({
    type: 'insight',
    dc,
    narrativeTemplates: {
      critical_success: 'You see through every layer of their deception. Their true plan is laid bare.',
      success: 'Something in their eyes betrays their true intentions.',
      partial_success: 'You sense they\'re hiding something, but you can\'t determine what.',
      failure: 'Their expression reveals nothing.',
      critical_failure: 'You misread their friendly demeanor as sincere.',
    },
  }),

  /** Broker a deal between factions */
  brokerPeace: (dc: number = DialogueDifficulty.VeryHard): DialogueCheckConfig => ({
    type: 'diplomacy',
    dc,
    narrativeTemplates: {
      critical_success: 'A historic accord is reached. Both factions hail you as a peacemaker.',
      success: 'After tense negotiation, an agreement is reached.',
      partial_success: 'A temporary ceasefire is established, but it feels fragile.',
      failure: 'The talks collapse. Both sides blame each other — and you.',
      critical_failure: 'Your mediation ignites old wounds. War seems inevitable.',
    },
  }),

  /** Scheme to undermine a rival */
  plotScheme: (dc: number = DialogueDifficulty.Hard): DialogueCheckConfig => ({
    type: 'scheme',
    dc,
    narrativeTemplates: {
      critical_success: 'Your scheme unfolds perfectly. Your rival never sees it coming.',
      success: 'The pieces fall into place. Your rival\'s position weakens.',
      partial_success: 'The scheme works, but traces of your involvement remain.',
      failure: 'Your scheme is too transparent. It falls apart before it begins.',
      critical_failure: 'Your scheme is discovered and traced back to you. Your rival now knows.',
    },
  }),

  /** Rally troops or followers before battle */
  rallyTroops: (dc: number = DialogueDifficulty.Medium): DialogueCheckConfig => ({
    type: 'inspire',
    dc,
    narrativeTemplates: {
      critical_success: 'Your words set their blood ablaze. They roar with renewed purpose!',
      success: 'Your speech lifts their spirits. They stand ready to fight.',
      partial_success: 'Some cheer, but others exchange uncertain glances.',
      failure: 'Your words echo hollowly. The soldiers stare at the ground.',
      critical_failure: 'Your speech highlights the hopelessness of the situation. Morale plummets.',
    },
  }),

  /** Recall ancient lore or decipher a text */
  decipherLore: (dc: number = DialogueDifficulty.Hard): DialogueCheckConfig => ({
    type: 'lore',
    dc,
    narrativeTemplates: {
      critical_success: 'The ancient text yields its secrets — and more besides.',
      success: 'You successfully decipher the key passages.',
      partial_success: 'You grasp fragments, enough to point you in the right direction.',
      failure: 'The script remains indecipherable to you.',
      critical_failure: 'You mistranslate a crucial passage, arriving at a false conclusion.',
    },
  }),

  /** Lie or bluff your way through */
  bluff: (dc: number = DialogueDifficulty.Medium): DialogueCheckConfig => ({
    type: 'deception',
    dc,
  }),

  /** Negotiate trade terms */
  negotiateTrade: (dc: number = DialogueDifficulty.Medium): DialogueCheckConfig => ({
    type: 'negotiation',
    dc,
  }),
} as const;
