/**
 * Equipment Engine
 *
 * Handles equipping/unequipping items, computing stat bonuses from equipment,
 * validating equipment requirements, and comparing items.
 *
 * 10 slots: Head, Chest, Legs, Boots, Gloves, Main Hand, Off Hand, Ring, Amulet, Cape
 */

import type { StatId } from '../lib/types/stats';
import type { FactionId, GameState, FactionStanding } from './types';
import type {
  EquipmentSlot,
  EquipmentItem,
  EquipmentLoadout,
  EquipmentStatBonus,
  EquipmentComparison,
  InventoryState,
  ItemRarity,
} from '../types/equipment';
import { EQUIPMENT_SLOTS, createEmptyLoadout } from '../types/equipment';
import { ALL_STATS } from '../lib/types/stats';

// ─── Equipment Registry ───────────────────────────────────────────────────────

/** Global registry of all equipment items by ID */
const itemRegistry: Map<string, EquipmentItem> = new Map();

/** Register items into the global registry */
export function registerItems(items: EquipmentItem[]): void {
  for (const item of items) {
    itemRegistry.set(item.id, item);
  }
}

/** Get an item by ID from the registry */
export function getItem(itemId: string): EquipmentItem | null {
  return itemRegistry.get(itemId) ?? null;
}

/** Get all registered items */
export function getAllItems(): EquipmentItem[] {
  return Array.from(itemRegistry.values());
}

/** Get items filtered by slot */
export function getItemsBySlot(slot: EquipmentSlot): EquipmentItem[] {
  return getAllItems().filter(item => item.slot === slot);
}

/** Get items filtered by rarity */
export function getItemsByRarity(rarity: ItemRarity): EquipmentItem[] {
  return getAllItems().filter(item => item.rarity === rarity);
}

/** Clear the registry (for testing) */
export function clearItemRegistry(): void {
  itemRegistry.clear();
}

// ─── Stat Bonus Computation ───────────────────────────────────────────────────

/**
 * Compute total stat bonuses from all equipped items.
 * Returns a partial stat block with cumulative bonuses.
 */
export function computeEquipmentBonuses(
  loadout: EquipmentLoadout
): Partial<Record<StatId, number>> {
  const bonuses: Partial<Record<StatId, number>> = {};

  for (const slot of EQUIPMENT_SLOTS) {
    const itemId = loadout[slot];
    if (!itemId) continue;

    const item = getItem(itemId);
    if (!item) continue;

    // Add direct stat bonuses
    for (const bonus of item.statBonuses) {
      bonuses[bonus.stat] = (bonuses[bonus.stat] ?? 0) + bonus.value;
    }

    // Add passive stat bonuses
    if (item.passives) {
      for (const passive of item.passives) {
        if (passive.statBonuses) {
          for (const bonus of passive.statBonuses) {
            bonuses[bonus.stat] = (bonuses[bonus.stat] ?? 0) + bonus.value;
          }
        }
      }
    }
  }

  return bonuses;
}

/**
 * Get the bonus for a specific stat from equipment.
 */
export function getEquipmentStatBonus(
  loadout: EquipmentLoadout,
  stat: StatId
): number {
  const bonuses = computeEquipmentBonuses(loadout);
  return bonuses[stat] ?? 0;
}

/**
 * Compute faction bonuses from equipped items.
 */
export function computeEquipmentFactionBonuses(
  loadout: EquipmentLoadout
): Partial<Record<FactionId, number>> {
  const bonuses: Partial<Record<FactionId, number>> = {};

  for (const slot of EQUIPMENT_SLOTS) {
    const itemId = loadout[slot];
    if (!itemId) continue;

    const item = getItem(itemId);
    if (!item) continue;

    if (item.passives) {
      for (const passive of item.passives) {
        if (passive.factionBonus) {
          const { faction, value } = passive.factionBonus;
          bonuses[faction] = (bonuses[faction] ?? 0) + value;
        }
      }
    }
  }

  return bonuses;
}

// ─── Equipment Validation ─────────────────────────────────────────────────────

export interface EquipmentValidationResult {
  canEquip: boolean;
  reasons: string[];
}

/**
 * Check if a player can equip an item.
 * Validates level, faction standing, and stat requirements.
 */
export function canEquipItem(
  item: EquipmentItem,
  playerLevel: number,
  factions: FactionStanding,
  stats: Record<string, number>
): EquipmentValidationResult {
  const reasons: string[] = [];

  // Level check
  if (playerLevel < item.levelRequirement) {
    reasons.push(`Requires level ${item.levelRequirement} (you are level ${playerLevel})`);
  }

  // Faction check
  if (item.factionRequirement) {
    const standing = factions[item.factionRequirement];
    if (standing === undefined || standing <= 0) {
      reasons.push(`Requires positive standing with ${item.factionRequirement.replace('_', ' ')}`);
    }
  }

  // Stat check
  if (item.statRequirement) {
    const statValue = stats[item.statRequirement.stat] ?? 0;
    if (statValue < item.statRequirement.minimum) {
      reasons.push(
        `Requires ${item.statRequirement.stat} ${item.statRequirement.minimum} (you have ${statValue})`
      );
    }
  }

  return {
    canEquip: reasons.length === 0,
    reasons,
  };
}

// ─── Equip / Unequip Operations ───────────────────────────────────────────────

export interface EquipResult {
  success: boolean;
  inventory: InventoryState;
  /** Item that was unequipped (if slot was occupied) */
  unequippedItemId: string | null;
  /** Error message if failed */
  error?: string;
}

/**
 * Equip an item from inventory to the appropriate slot.
 * If the slot is occupied, the existing item is returned to inventory.
 */
export function equipItem(
  inventory: InventoryState,
  itemId: string,
  playerLevel: number,
  factions: FactionStanding,
  stats: Record<string, number>
): EquipResult {
  const item = getItem(itemId);
  if (!item) {
    return { success: false, inventory, unequippedItemId: null, error: 'Item not found' };
  }

  // Check if item is in inventory
  const invEntry = inventory.items.find(e => e.itemId === itemId);
  if (!invEntry || invEntry.quantity < 1) {
    return { success: false, inventory, unequippedItemId: null, error: 'Item not in inventory' };
  }

  // Validate requirements
  const validation = canEquipItem(item, playerLevel, factions, stats);
  if (!validation.canEquip) {
    return {
      success: false,
      inventory,
      unequippedItemId: null,
      error: validation.reasons.join('; '),
    };
  }

  // Build new inventory
  let newItems = inventory.items.map(e =>
    e.itemId === itemId ? { ...e, quantity: e.quantity - 1 } : { ...e }
  ).filter(e => e.quantity > 0);

  // Unequip current item in slot (return to inventory)
  let unequippedItemId: string | null = null;
  const currentItemId = inventory.equipment[item.slot];
  if (currentItemId) {
    unequippedItemId = currentItemId;
    const existing = newItems.find(e => e.itemId === currentItemId);
    if (existing) {
      newItems = newItems.map(e =>
        e.itemId === currentItemId ? { ...e, quantity: e.quantity + 1 } : e
      );
    } else {
      newItems.push({ itemId: currentItemId, quantity: 1 });
    }
  }

  // Equip new item
  const newEquipment: EquipmentLoadout = {
    ...inventory.equipment,
    [item.slot]: itemId,
  };

  return {
    success: true,
    inventory: {
      ...inventory,
      items: newItems,
      equipment: newEquipment,
    },
    unequippedItemId,
  };
}

/**
 * Unequip an item from a slot, returning it to inventory.
 */
export function unequipItem(
  inventory: InventoryState,
  slot: EquipmentSlot
): EquipResult {
  const currentItemId = inventory.equipment[slot];
  if (!currentItemId) {
    return { success: false, inventory, unequippedItemId: null, error: 'Slot is empty' };
  }

  // Return item to inventory
  let newItems = [...inventory.items];
  const existing = newItems.find(e => e.itemId === currentItemId);
  if (existing) {
    newItems = newItems.map(e =>
      e.itemId === currentItemId ? { ...e, quantity: e.quantity + 1 } : e
    );
  } else {
    newItems.push({ itemId: currentItemId, quantity: 1 });
  }

  // Clear slot
  const newEquipment: EquipmentLoadout = {
    ...inventory.equipment,
    [slot]: null,
  };

  return {
    success: true,
    inventory: {
      ...inventory,
      items: newItems,
      equipment: newEquipment,
    },
    unequippedItemId: currentItemId,
  };
}

// ─── Item Comparison ──────────────────────────────────────────────────────────

/**
 * Compare a new item against the currently equipped item in the same slot.
 */
export function compareItems(
  loadout: EquipmentLoadout,
  newItem: EquipmentItem
): EquipmentComparison {
  const currentItemId = loadout[newItem.slot];
  const currentItem = currentItemId ? getItem(currentItemId) : null;

  const statDiffs: EquipmentComparison['statDiffs'] = [];

  for (const stat of ALL_STATS) {
    const currentBonus = getBonusForStat(currentItem, stat);
    const newBonus = getBonusForStat(newItem, stat);

    if (currentBonus !== 0 || newBonus !== 0) {
      statDiffs.push({
        stat,
        current: currentBonus,
        proposed: newBonus,
        diff: newBonus - currentBonus,
      });
    }
  }

  const totalDiff = statDiffs.reduce((sum, d) => sum + d.diff, 0);

  return {
    slot: newItem.slot,
    currentItem,
    newItem,
    statDiffs,
    totalDiff,
  };
}

/** Get the total stat bonus an item provides for a specific stat */
function getBonusForStat(item: EquipmentItem | null, stat: StatId): number {
  if (!item) return 0;

  let total = 0;
  for (const bonus of item.statBonuses) {
    if (bonus.stat === stat) total += bonus.value;
  }
  if (item.passives) {
    for (const passive of item.passives) {
      if (passive.statBonuses) {
        for (const bonus of passive.statBonuses) {
          if (bonus.stat === stat) total += bonus.value;
        }
      }
    }
  }
  return total;
}

// ─── Inventory Helpers ────────────────────────────────────────────────────────

/**
 * Add an item to inventory.
 */
export function addToInventory(
  inventory: InventoryState,
  itemId: string,
  quantity: number = 1
): InventoryState {
  const totalItems = inventory.items.reduce((sum, e) => sum + e.quantity, 0);
  if (totalItems + quantity > inventory.maxCapacity) {
    // Silently cap at max capacity
    quantity = Math.max(0, inventory.maxCapacity - totalItems);
    if (quantity === 0) return inventory;
  }

  const existing = inventory.items.find(e => e.itemId === itemId);
  if (existing) {
    return {
      ...inventory,
      items: inventory.items.map(e =>
        e.itemId === itemId ? { ...e, quantity: e.quantity + quantity } : e
      ),
    };
  }

  return {
    ...inventory,
    items: [...inventory.items, { itemId, quantity }],
  };
}

/**
 * Remove an item from inventory.
 */
export function removeFromInventory(
  inventory: InventoryState,
  itemId: string,
  quantity: number = 1
): InventoryState {
  const entry = inventory.items.find(e => e.itemId === itemId);
  if (!entry || entry.quantity < quantity) return inventory;

  if (entry.quantity === quantity) {
    return {
      ...inventory,
      items: inventory.items.filter(e => e.itemId !== itemId),
    };
  }

  return {
    ...inventory,
    items: inventory.items.map(e =>
      e.itemId === itemId ? { ...e, quantity: e.quantity - quantity } : e
    ),
  };
}

/**
 * Check if inventory contains a specific item.
 */
export function hasItem(inventory: InventoryState, itemId: string): boolean {
  const entry = inventory.items.find(e => e.itemId === itemId);
  return !!entry && entry.quantity > 0;
}

/**
 * Get the total number of items in inventory (excluding equipped).
 */
export function getInventoryCount(inventory: InventoryState): number {
  return inventory.items.reduce((sum, e) => sum + e.quantity, 0);
}

/**
 * Get all equipped items as EquipmentItem objects.
 */
export function getEquippedItems(loadout: EquipmentLoadout): { slot: EquipmentSlot; item: EquipmentItem }[] {
  const equipped: { slot: EquipmentSlot; item: EquipmentItem }[] = [];
  for (const slot of EQUIPMENT_SLOTS) {
    const itemId = loadout[slot];
    if (itemId) {
      const item = getItem(itemId);
      if (item) {
        equipped.push({ slot, item });
      }
    }
  }
  return equipped;
}

/**
 * Get equippable items from inventory for a specific slot.
 */
export function getEquippableForSlot(
  inventory: InventoryState,
  slot: EquipmentSlot
): EquipmentItem[] {
  return inventory.items
    .map(e => getItem(e.itemId))
    .filter((item): item is EquipmentItem => item !== null && item.slot === slot);
}
