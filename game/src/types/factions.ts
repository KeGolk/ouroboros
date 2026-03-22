/**
 * Faction system types for the branching narrative RPG.
 *
 * Four morally-grey factions vie for control of the realm.
 * Each faction has a distinct moral philosophy, governing style,
 * and web of relationships with the other three.
 */

/** Unique identifier for each faction */
export type FactionId =
  | 'ironThrone'
  | 'ashenConclave'
  | 'verdantPact'
  | 'obsidianGuild';

/** How a faction views another faction */
export type RelationshipStatus =
  | 'allied'
  | 'friendly'
  | 'neutral'
  | 'suspicious'
  | 'hostile';

/** Directional relationship between two factions */
export interface FactionRelationship {
  /** The faction this relationship is directed toward */
  targetFactionId: FactionId;
  /** Current diplomatic status */
  status: RelationshipStatus;
  /** Narrative explanation for this relationship */
  reason: string;
  /** Numeric sentiment from -100 (blood feud) to +100 (sworn allies) */
  sentiment: number;
}

/** Stat bonuses/penalties a faction grants to its members */
export interface FactionStatModifiers {
  /** Combat prowess modifier */
  strength: number;
  /** Cunning and perception modifier */
  cunning: number;
  /** Persuasion and social modifier */
  charisma: number;
  /** Arcane or scholarly knowledge modifier */
  lore: number;
  /** Stealth and subtlety modifier */
  subtlety: number;
}

/** A faction's core moral philosophy */
export interface MoralPhilosophy {
  /** Short label (e.g. "Authoritarian Order") */
  label: string;
  /** Longer explanation of the faction's ethical worldview */
  description: string;
  /** The virtue this faction prizes most */
  coreVirtue: string;
  /** The vice this faction is most prone to */
  coreFlaw: string;
}

/** Detailed faction definition */
export interface Faction {
  /** Unique machine-readable identifier */
  id: FactionId;
  /** Display name shown in UI */
  name: string;
  /** Heraldic motto / tagline */
  motto: string;
  /** Short narrative description (1-2 sentences) */
  shortDescription: string;
  /** Full lore description shown in codex / faction screen */
  description: string;
  /** The faction's governing philosophy */
  moralPhilosophy: MoralPhilosophy;
  /** Primary hex colour for UI theming */
  color: string;
  /** Secondary / accent hex colour */
  accentColor: string;
  /** Unicode or emoji sigil placeholder */
  sigil: string;
  /** AI prompt description for generating the faction's banner art */
  artPrompt: string;
  /** Stat modifiers for faction members */
  statModifiers: FactionStatModifiers;
  /** How this faction relates to the other three */
  relationships: FactionRelationship[];
  /** Key locations controlled by this faction */
  territories: string[];
  /** Names of notable NPC leaders (references character IDs) */
  leaderIds: string[];
  /** Gameplay benefits for high faction reputation */
  reputationPerks: string[];
}

/** Map of faction ID to Faction for quick lookup */
export type FactionMap = Record<FactionId, Faction>;

/** Player's standing with a single faction */
export interface FactionStanding {
  factionId: FactionId;
  /** Reputation points: -100 (despised) to +100 (exalted) */
  reputation: number;
  /** Discrete tier derived from reputation */
  tier: ReputationTier;
  /** Whether the player has formally joined this faction */
  joined: boolean;
}

/** Named reputation tiers */
export type ReputationTier =
  | 'despised'    // -100 to -61
  | 'hostile'     // -60 to -21
  | 'neutral'     //  -20 to +20
  | 'friendly'    //  +21 to +60
  | 'honored'     //  +61 to +89
  | 'exalted';    //  +90 to +100

/** Helper: convert numeric reputation to tier */
export function reputationToTier(reputation: number): ReputationTier {
  if (reputation <= -61) return 'despised';
  if (reputation <= -21) return 'hostile';
  if (reputation <= 20) return 'neutral';
  if (reputation <= 60) return 'friendly';
  if (reputation <= 89) return 'honored';
  return 'exalted';
}
