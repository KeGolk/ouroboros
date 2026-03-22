/**
 * Faction type definitions for Crowns of Ash.
 *
 * Defines the 4 playable factions, reputation mechanics with range -100 to +100,
 * and faction-related data structures used throughout the game.
 */

import type { FactionId } from '../engine/types';

// ─── Reputation Constants ────────────────────────────────────────────────────

/** Minimum reputation value a player can have with any faction */
export const REPUTATION_MIN = -100 as const;

/** Maximum reputation value a player can have with any faction */
export const REPUTATION_MAX = 100 as const;

/** Starting reputation with all factions */
export const REPUTATION_DEFAULT = 0 as const;

/** Number of faction slots in the game */
export const FACTION_SLOT_COUNT = 4 as const;

// ─── Reputation Thresholds ───────────────────────────────────────────────────

/**
 * Named reputation tiers that determine NPC behavior, dialogue options,
 * quest availability, and faction-specific content.
 */
export enum ReputationTier {
  /** -100 to -76: The faction actively hunts you */
  Nemesis = 'nemesis',
  /** -75 to -51: The faction considers you a sworn enemy */
  Hated = 'hated',
  /** -50 to -26: The faction distrusts and dislikes you */
  Hostile = 'hostile',
  /** -25 to -1: The faction views you with suspicion */
  Unfriendly = 'unfriendly',
  /** 0: No opinion — a stranger */
  Neutral = 'neutral',
  /** 1 to 25: The faction acknowledges your existence favorably */
  Friendly = 'friendly',
  /** 26 to 50: The faction respects and welcomes you */
  Respected = 'respected',
  /** 51 to 75: The faction considers you a trusted ally */
  Honored = 'honored',
  /** 76 to 100: The faction reveres you as a champion */
  Exalted = 'exalted',
}

/** Thresholds that map reputation values to tiers */
export const REPUTATION_TIER_THRESHOLDS: ReadonlyArray<{
  readonly min: number;
  readonly max: number;
  readonly tier: ReputationTier;
}> = [
  { min: -100, max: -76, tier: ReputationTier.Nemesis },
  { min: -75, max: -51, tier: ReputationTier.Hated },
  { min: -50, max: -26, tier: ReputationTier.Hostile },
  { min: -25, max: -1, tier: ReputationTier.Unfriendly },
  { min: 0, max: 0, tier: ReputationTier.Neutral },
  { min: 1, max: 25, tier: ReputationTier.Friendly },
  { min: 26, max: 50, tier: ReputationTier.Respected },
  { min: 51, max: 75, tier: ReputationTier.Honored },
  { min: 76, max: 100, tier: ReputationTier.Exalted },
] as const;

// ─── Faction Definition ──────────────────────────────────────────────────────

/** Full definition of a faction with lore, visuals, and gameplay data */
export interface Faction {
  /** Unique faction identifier matching FactionId */
  readonly id: FactionId;
  /** Display name */
  readonly name: string;
  /** Short motto or slogan */
  readonly motto: string;
  /** Lore description of the faction */
  readonly description: string;
  /** Primary theme color (CSS hex) */
  readonly color: string;
  /** Secondary/accent color (CSS hex) */
  readonly accentColor: string;
  /** Icon/sigil identifier for UI rendering */
  readonly icon: string;
  /** Faction leader character ID */
  readonly leaderId: string;
  /** Key location IDs associated with this faction */
  readonly territoryIds: readonly string[];
  /** Opposing faction ID (reputation gains with one often mean losses with the other) */
  readonly rivalFactionId: FactionId;
  /** Allied faction ID (smaller positive spillover) */
  readonly alliedFactionId: FactionId;
  /** Gameplay bonuses granted at high reputation */
  readonly perks: readonly FactionPerk[];
}

/** A perk unlocked at a specific reputation tier */
export interface FactionPerk {
  /** Minimum reputation tier required */
  readonly requiredTier: ReputationTier;
  /** Display name of the perk */
  readonly name: string;
  /** Description of the gameplay benefit */
  readonly description: string;
  /** Type of perk for the game engine */
  readonly type: FactionPerkType;
  /** Magnitude of the effect */
  readonly value: number;
}

/** Types of faction perks */
export type FactionPerkType =
  | 'shop_discount'
  | 'stat_bonus'
  | 'dialogue_option'
  | 'quest_access'
  | 'safe_passage'
  | 'combat_ally';

// ─── Faction Reputation State ────────────────────────────────────────────────

/** A single faction reputation slot tracking current standing */
export interface FactionReputationSlot {
  /** Faction identifier */
  factionId: FactionId;
  /** Current reputation value, clamped to [-100, +100] */
  reputation: number;
  /** Computed reputation tier based on current value */
  tier: ReputationTier;
  /** Whether this faction has been formally joined by the player */
  isJoined: boolean;
  /** Total reputation gained (lifetime, for tracking) */
  totalGained: number;
  /** Total reputation lost (lifetime, for tracking) */
  totalLost: number;
  /** Highest reputation ever achieved with this faction */
  peakReputation: number;
  /** Lowest reputation ever reached with this faction */
  lowestReputation: number;
}

/** All 4 faction reputation slots */
export interface FactionReputationMap {
  iron_throne: FactionReputationSlot;
  shadow_guild: FactionReputationSlot;
  peoples_front: FactionReputationSlot;
  old_faith: FactionReputationSlot;
}

// ─── The 4 Faction Definitions ───────────────────────────────────────────────

/** All available faction IDs as a readonly tuple */
export const ALL_FACTION_IDS: readonly FactionId[] = [
  'iron_throne',
  'shadow_guild',
  'peoples_front',
  'old_faith',
] as const;

/** The 4 faction definitions with full lore and gameplay data */
export const FACTIONS: Readonly<Record<FactionId, Faction>> = {
  iron_throne: {
    id: 'iron_throne',
    name: 'The Iron Throne',
    motto: 'Order through strength.',
    description:
      'The ruling power of the realm, the Iron Throne commands vast armies and enforces law through steel and fear. They believe only absolute authority can hold the kingdom together against the encroaching darkness.',
    color: '#8B0000',
    accentColor: '#C0C0C0',
    icon: 'crown-iron',
    leaderId: 'lord_aldric',
    territoryIds: ['kings_bastion', 'irongate', 'the_watchtowers'],
    rivalFactionId: 'peoples_front',
    alliedFactionId: 'old_faith',
    perks: [
      {
        requiredTier: ReputationTier.Friendly,
        name: 'Royal Patronage',
        description: 'Merchants in throne territories offer 10% discounts.',
        type: 'shop_discount',
        value: 10,
      },
      {
        requiredTier: ReputationTier.Respected,
        name: 'King\'s Writ',
        description: 'Safe passage through all throne-controlled territories.',
        type: 'safe_passage',
        value: 1,
      },
      {
        requiredTier: ReputationTier.Honored,
        name: 'Royal Guard Escort',
        description: 'A soldier fights alongside you in combat encounters.',
        type: 'combat_ally',
        value: 15,
      },
    ],
  },
  shadow_guild: {
    id: 'shadow_guild',
    name: 'The Shadow Guild',
    motto: 'Knowledge is the sharpest blade.',
    description:
      'A secretive network of spies, assassins, and information brokers operating from the underbelly of every city. They trade in secrets and believe true power lies not in crowns, but in whispers.',
    color: '#2F1B41',
    accentColor: '#9B59B6',
    icon: 'dagger-shadow',
    leaderId: 'the_whisper',
    territoryIds: ['undercroft', 'ravens_nest', 'the_hollows'],
    rivalFactionId: 'old_faith',
    alliedFactionId: 'peoples_front',
    perks: [
      {
        requiredTier: ReputationTier.Friendly,
        name: 'Black Market Access',
        description: 'Unlock hidden shops with rare and illicit goods.',
        type: 'quest_access',
        value: 1,
      },
      {
        requiredTier: ReputationTier.Respected,
        name: 'Silver Tongue',
        description: 'New dialogue options using insider knowledge.',
        type: 'dialogue_option',
        value: 1,
      },
      {
        requiredTier: ReputationTier.Honored,
        name: 'Shadow Step',
        description: '+2 Cunning bonus while in Guild territory.',
        type: 'stat_bonus',
        value: 2,
      },
    ],
  },
  peoples_front: {
    id: 'peoples_front',
    name: "The People's Front",
    motto: 'Freedom forged in fire.',
    description:
      'A revolutionary movement born from the suffering of common folk. They fight against the tyranny of nobles and the corruption of the powerful, seeking to build a world where every voice is heard.',
    color: '#8B4513',
    accentColor: '#DAA520',
    icon: 'fist-raised',
    leaderId: 'sera_blackthorn',
    territoryIds: ['thornhold', 'the_commons', 'ashfield'],
    rivalFactionId: 'iron_throne',
    alliedFactionId: 'shadow_guild',
    perks: [
      {
        requiredTier: ReputationTier.Friendly,
        name: 'Common Cause',
        description: 'Access to resistance safe houses and supply caches.',
        type: 'quest_access',
        value: 1,
      },
      {
        requiredTier: ReputationTier.Respected,
        name: "People's Champion",
        description: 'Commoners rally to your cause, granting +2 Charisma in settlements.',
        type: 'stat_bonus',
        value: 2,
      },
      {
        requiredTier: ReputationTier.Honored,
        name: 'Uprising',
        description: 'Rebels fight alongside you in combat encounters.',
        type: 'combat_ally',
        value: 12,
      },
    ],
  },
  old_faith: {
    id: 'old_faith',
    name: 'The Old Faith',
    motto: 'The roots remember what the leaves forget.',
    description:
      'Keepers of ancient rites and forgotten magic, the Old Faith draws power from the land itself. Their druids and mystics preserve knowledge from before the age of iron, warning that only the old ways can save the realm.',
    color: '#2E4A1E',
    accentColor: '#7CFC00',
    icon: 'tree-ancient',
    leaderId: 'elder_morrigan',
    territoryIds: ['whispering_woods', 'standing_stones', 'the_grove'],
    rivalFactionId: 'shadow_guild',
    alliedFactionId: 'iron_throne',
    perks: [
      {
        requiredTier: ReputationTier.Friendly,
        name: 'Herbal Remedies',
        description: 'Access to unique healing items at Old Faith shrines.',
        type: 'shop_discount',
        value: 15,
      },
      {
        requiredTier: ReputationTier.Respected,
        name: 'Ancient Wisdom',
        description: '+2 Wisdom bonus while in natural/wilderness areas.',
        type: 'stat_bonus',
        value: 2,
      },
      {
        requiredTier: ReputationTier.Honored,
        name: 'Nature\'s Ward',
        description: 'Mystical protection grants safe passage through wild territories.',
        type: 'safe_passage',
        value: 1,
      },
    ],
  },
} as const;

// ─── Utility Functions ───────────────────────────────────────────────────────

/**
 * Clamp a reputation value to the valid range [-100, +100].
 */
export function clampReputation(value: number): number {
  return Math.max(REPUTATION_MIN, Math.min(REPUTATION_MAX, value));
}

/**
 * Determine the reputation tier for a given reputation value.
 */
export function getReputationTier(reputation: number): ReputationTier {
  const clamped = clampReputation(reputation);
  if (clamped <= -76) return ReputationTier.Nemesis;
  if (clamped <= -51) return ReputationTier.Hated;
  if (clamped <= -26) return ReputationTier.Hostile;
  if (clamped <= -1) return ReputationTier.Unfriendly;
  if (clamped === 0) return ReputationTier.Neutral;
  if (clamped <= 25) return ReputationTier.Friendly;
  if (clamped <= 50) return ReputationTier.Respected;
  if (clamped <= 75) return ReputationTier.Honored;
  return ReputationTier.Exalted;
}

/**
 * Create a default FactionReputationSlot for a given faction.
 */
export function createDefaultReputationSlot(factionId: FactionId): FactionReputationSlot {
  return {
    factionId,
    reputation: REPUTATION_DEFAULT,
    tier: ReputationTier.Neutral,
    isJoined: false,
    totalGained: 0,
    totalLost: 0,
    peakReputation: REPUTATION_DEFAULT,
    lowestReputation: REPUTATION_DEFAULT,
  };
}

/**
 * Create the initial FactionReputationMap with all 4 faction slots at neutral.
 */
export function createDefaultFactionReputationMap(): FactionReputationMap {
  return {
    iron_throne: createDefaultReputationSlot('iron_throne'),
    shadow_guild: createDefaultReputationSlot('shadow_guild'),
    peoples_front: createDefaultReputationSlot('peoples_front'),
    old_faith: createDefaultReputationSlot('old_faith'),
  };
}

/**
 * Apply a reputation change to a faction slot, clamping to [-100, +100]
 * and updating tracking fields.
 */
export function applyReputationChange(
  slot: FactionReputationSlot,
  delta: number,
): FactionReputationSlot {
  const newReputation = clampReputation(slot.reputation + delta);
  return {
    ...slot,
    reputation: newReputation,
    tier: getReputationTier(newReputation),
    totalGained: delta > 0 ? slot.totalGained + delta : slot.totalGained,
    totalLost: delta < 0 ? slot.totalLost + Math.abs(delta) : slot.totalLost,
    peakReputation: Math.max(slot.peakReputation, newReputation),
    lowestReputation: Math.min(slot.lowestReputation, newReputation),
  };
}

/**
 * Get the display label for a reputation tier.
 */
export function getReputationTierLabel(tier: ReputationTier): string {
  const labels: Record<ReputationTier, string> = {
    [ReputationTier.Nemesis]: 'Nemesis',
    [ReputationTier.Hated]: 'Hated',
    [ReputationTier.Hostile]: 'Hostile',
    [ReputationTier.Unfriendly]: 'Unfriendly',
    [ReputationTier.Neutral]: 'Neutral',
    [ReputationTier.Friendly]: 'Friendly',
    [ReputationTier.Respected]: 'Respected',
    [ReputationTier.Honored]: 'Honored',
    [ReputationTier.Exalted]: 'Exalted',
  };
  return labels[tier];
}

/**
 * Get the CSS color associated with a reputation tier for UI rendering.
 */
export function getReputationTierColor(tier: ReputationTier): string {
  const colors: Record<ReputationTier, string> = {
    [ReputationTier.Nemesis]: '#FF0000',
    [ReputationTier.Hated]: '#CC3300',
    [ReputationTier.Hostile]: '#FF6600',
    [ReputationTier.Unfriendly]: '#FF9900',
    [ReputationTier.Neutral]: '#999999',
    [ReputationTier.Friendly]: '#66CC00',
    [ReputationTier.Respected]: '#33CC33',
    [ReputationTier.Honored]: '#0099FF',
    [ReputationTier.Exalted]: '#9933FF',
  };
  return colors[tier];
}
