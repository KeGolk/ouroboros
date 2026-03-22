/**
 * Core RPG stat system types for Crowns of Ash.
 *
 * Stats are divided into primary attributes that affect both combat and narrative.
 * Each stat has a base value, modifiers from equipment/buffs, and derived effects.
 */

/** The nine primary character attributes */
export type StatName =
  | 'strength'     // STR
  | 'dexterity'    // DEX
  | 'intelligence' // INT
  | 'wisdom'       // WIS
  | 'constitution' // CON
  | 'charisma'     // CHA
  | 'influence'    // Influence
  | 'cunning'      // Cunning
  | 'diplomacy';   // Diplomacy

/** Metadata about each stat — display info, narrative/combat effects */
export interface StatDefinition {
  name: StatName;
  label: string;
  abbreviation: string;
  description: string;
  /** Icon identifier for UI rendering */
  icon: string;
  /** What this stat affects in combat */
  combatEffects: string[];
  /** What this stat unlocks in narrative/dialogue */
  narrativeEffects: string[];
  /** Color theme for the stat (CSS color) */
  color: string;
}

/** A stat value with base and modifier breakdown */
export interface StatValue {
  base: number;
  /** Bonuses from equipment, buffs, faction, etc. */
  modifiers: StatModifier[];
  /** Computed total = base + sum(modifiers) */
  total: number;
}

export interface StatModifier {
  source: string;
  value: number;
  type: 'equipment' | 'faction' | 'buff' | 'trait' | 'chapter';
}

/** The full stat block for a character */
export type StatBlock = Record<StatName, StatValue>;

/** Derived combat stats computed from primary attributes */
export interface DerivedStats {
  /** Max HP = 50 + (constitution * 5) + (strength * 2) */
  maxHealth: number;
  /** Physical damage bonus = strength * 1.5 */
  meleePower: number;
  /** Ranged/magic damage = intelligence * 1.2 + wisdom * 0.8 */
  tacticalPower: number;
  /** Dodge chance % = min(dexterity * 2, 40) */
  evasion: number;
  /** Damage reduction = constitution * 1.5 */
  armor: number;
  /** Initiative for turn order = dexterity + cunning * 0.5 */
  initiative: number;
  /** Critical hit chance % = dexterity * 1.5 + cunning * 0.5 */
  critChance: number;
}

/** Narrative capability thresholds */
export interface NarrativeCapabilities {
  /** Intimidation checks: strength >= threshold */
  canIntimidate: boolean;
  /** Persuasion checks: charisma >= threshold */
  canPersuade: boolean;
  /** Deception checks: cunning >= threshold */
  canDeceive: boolean;
  /** Lore/knowledge checks: intelligence >= threshold */
  canDecipher: boolean;
  /** Sneak past guards: dexterity >= threshold */
  canSneak: boolean;
  /** Endure torture/poison: constitution >= threshold */
  canEndure: boolean;
  /** Negotiate treaties: diplomacy >= threshold */
  canNegotiate: boolean;
  /** Exert political pressure: influence >= threshold */
  canLeverage: boolean;
  /** Mystical insight: wisdom >= threshold */
  canDivine: boolean;
}

/** Point-buy configuration */
export interface PointBuyConfig {
  /** Total points to distribute */
  totalPoints: number;
  /** Minimum value for any stat */
  minStat: number;
  /** Maximum value for any stat */
  maxStat: number;
  /** Starting value for each stat (included in totalPoints) */
  baseStat: number;
}

/** Character creation state */
export interface CharacterCreationState {
  name: string;
  stats: Record<StatName, number>;
  pointsRemaining: number;
  faction: string | null;
  background: string | null;
}
