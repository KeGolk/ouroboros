/**
 * Equipment System Types
 *
 * 10 equipment slots per character:
 *   Head, Chest, Legs, Boots, Gloves, Main Hand, Off Hand, Ring, Amulet, Cape
 *
 * Equipment provides stat bonuses, special effects, and faction requirements.
 * Integrates with the stat system (both classic 6 + political 3 stats).
 */

import type { StatId } from '../lib/types/stats';
import type { FactionId } from '../engine/types';

// ─── Equipment Slots ──────────────────────────────────────────────────────────

/** The 10 equipment slots available per character */
export type EquipmentSlot =
  | 'head'
  | 'chest'
  | 'legs'
  | 'boots'
  | 'gloves'
  | 'main_hand'
  | 'off_hand'
  | 'ring'
  | 'amulet'
  | 'cape';

/** All equipment slots in display order */
export const EQUIPMENT_SLOTS: readonly EquipmentSlot[] = [
  'head',
  'chest',
  'legs',
  'boots',
  'gloves',
  'main_hand',
  'off_hand',
  'ring',
  'amulet',
  'cape',
] as const;

/** Human-readable slot display names */
export const SLOT_DISPLAY_NAMES: Record<EquipmentSlot, string> = {
  head: 'Head',
  chest: 'Chest',
  legs: 'Legs',
  boots: 'Boots',
  gloves: 'Gloves',
  main_hand: 'Main Hand',
  off_hand: 'Off Hand',
  ring: 'Ring',
  amulet: 'Amulet',
  cape: 'Cape',
};

/** Icons for each slot (emoji for placeholder UI) */
export const SLOT_ICONS: Record<EquipmentSlot, string> = {
  head: '👑',
  chest: '🛡️',
  legs: '🦿',
  boots: '🥾',
  gloves: '🧤',
  main_hand: '⚔️',
  off_hand: '🛡️',
  ring: '💍',
  amulet: '📿',
  cape: '🧣',
};

// ─── Item Rarity ──────────────────────────────────────────────────────────────

/** Rarity tiers for items and equipment, ordered from most common to most rare */
export enum Rarity {
  Common = 'Common',
  Uncommon = 'Uncommon',
  Rare = 'Rare',
  Epic = 'Epic',
  Legendary = 'Legendary',
}

/** String literal union kept for backward compatibility with existing data */
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

/** Map from Rarity enum to ItemRarity literal for interop */
export const RARITY_TO_ITEM_RARITY: Record<Rarity, ItemRarity> = {
  [Rarity.Common]: 'common',
  [Rarity.Uncommon]: 'uncommon',
  [Rarity.Rare]: 'rare',
  [Rarity.Epic]: 'epic',
  [Rarity.Legendary]: 'legendary',
};

/** Map from ItemRarity literal to Rarity enum for interop */
export const ITEM_RARITY_TO_RARITY: Record<ItemRarity, Rarity> = {
  common: Rarity.Common,
  uncommon: Rarity.Uncommon,
  rare: Rarity.Rare,
  epic: Rarity.Epic,
  legendary: Rarity.Legendary,
};

/** Rarity display colors (for UI) */
export const RARITY_COLORS: Record<ItemRarity, string> = {
  common: '#9CA3AF',     // gray
  uncommon: '#22C55E',   // green
  rare: '#3B82F6',       // blue
  epic: '#A855F7',       // purple
  legendary: '#F59E0B',  // amber/gold
};

export const RARITY_LABELS: Record<ItemRarity, string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
};

/** Ordered array of all rarity tiers from lowest to highest */
export const RARITY_ORDER: readonly Rarity[] = [
  Rarity.Common,
  Rarity.Uncommon,
  Rarity.Rare,
  Rarity.Epic,
  Rarity.Legendary,
] as const;

// ─── Equipment Item ───────────────────────────────────────────────────────────

/** Stat bonus provided by an equipment item */
export interface EquipmentStatBonus {
  stat: StatId;
  value: number;
}

/** Special passive effect on equipment */
export interface EquipmentPassive {
  id: string;
  name: string;
  description: string;
  /** Stat bonuses applied while equipped */
  statBonuses?: EquipmentStatBonus[];
  /** Faction reputation modifier while equipped */
  factionBonus?: { faction: FactionId; value: number };
}

/** An equipment item definition */
export interface EquipmentItem {
  /** Unique item ID */
  id: string;
  /** Display name */
  name: string;
  /** Flavor description */
  description: string;
  /** Which slot this item occupies */
  slot: EquipmentSlot;
  /** Item rarity */
  rarity: ItemRarity;
  /** Direct stat bonuses */
  statBonuses: EquipmentStatBonus[];
  /** Optional passive effects */
  passives?: EquipmentPassive[];
  /** Minimum level required to equip */
  levelRequirement: number;
  /** Faction requirement (must have positive standing) */
  factionRequirement?: FactionId;
  /** Minimum stat requirement to equip */
  statRequirement?: { stat: StatId; minimum: number };
  /** AI image prompt for this item */
  imagePrompt: string;
  /** Gold value for display */
  value: number;
  /** Is this a quest-related item? */
  isQuestItem?: boolean;
  /** Which chapter this item can be obtained in */
  obtainableInChapter?: string;
  /** Lore text for item inspection */
  loreText?: string;
}

// ─── Equipment Loadout ────────────────────────────────────────────────────────

/** A character's full equipment loadout — one item per slot (or null if empty) */
export type EquipmentLoadout = Record<EquipmentSlot, string | null>;

/** Create an empty equipment loadout */
export function createEmptyLoadout(): EquipmentLoadout {
  return {
    head: null,
    chest: null,
    legs: null,
    boots: null,
    gloves: null,
    main_hand: null,
    off_hand: null,
    ring: null,
    amulet: null,
    cape: null,
  };
}

// ─── Inventory ────────────────────────────────────────────────────────────────

/** Player inventory entry — item ID + quantity */
export interface InventoryEntry {
  itemId: string;
  quantity: number;
}

/** Full inventory state */
export interface InventoryState {
  /** Items in inventory (by ID) */
  items: InventoryEntry[];
  /** Currently equipped items (loadout) */
  equipment: EquipmentLoadout;
  /** Maximum inventory capacity */
  maxCapacity: number;
}

/** Create default inventory state */
export function createDefaultInventory(): InventoryState {
  return {
    items: [],
    equipment: createEmptyLoadout(),
    maxCapacity: 30,
  };
}

// ─── Equipment Comparison ─────────────────────────────────────────────────────

/** Comparison between two items for a slot */
export interface EquipmentComparison {
  slot: EquipmentSlot;
  currentItem: EquipmentItem | null;
  newItem: EquipmentItem;
  /** Stat differences: positive = new item is better */
  statDiffs: { stat: StatId; current: number; proposed: number; diff: number }[];
  /** Overall "power" difference */
  totalDiff: number;
}
