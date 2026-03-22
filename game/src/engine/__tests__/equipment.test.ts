/**
 * Tests for the Equipment Engine
 *
 * Covers: equip/unequip, stat bonuses, validation, comparison, inventory ops
 */

import {
  registerItems,
  clearItemRegistry,
  getItem,
  getAllItems,
  getItemsBySlot,
  computeEquipmentBonuses,
  getEquipmentStatBonus,
  computeEquipmentFactionBonuses,
  canEquipItem,
  equipItem,
  unequipItem,
  compareItems,
  addToInventory,
  removeFromInventory,
  hasItem,
  getInventoryCount,
  getEquippedItems,
  getEquippableForSlot,
} from '../equipment';
import type { EquipmentItem, InventoryState } from '../../types/equipment';
import { createEmptyLoadout, createDefaultInventory } from '../../types/equipment';
import type { FactionStanding } from '../types';

// ─── Test Fixtures ────────────────────────────────────────────────────────────

const testSword: EquipmentItem = {
  id: 'test_sword',
  name: 'Test Sword',
  description: 'A test sword',
  slot: 'main_hand',
  rarity: 'common',
  statBonuses: [{ stat: 'STR', value: 2 }],
  levelRequirement: 1,
  imagePrompt: 'test',
  value: 10,
};

const testShield: EquipmentItem = {
  id: 'test_shield',
  name: 'Test Shield',
  description: 'A test shield',
  slot: 'off_hand',
  rarity: 'common',
  statBonuses: [{ stat: 'CON', value: 2 }],
  levelRequirement: 1,
  imagePrompt: 'test',
  value: 10,
};

const testHelm: EquipmentItem = {
  id: 'test_helm',
  name: 'Test Helm',
  description: 'A test helm',
  slot: 'head',
  rarity: 'uncommon',
  statBonuses: [{ stat: 'CON', value: 1 }, { stat: 'STR', value: 1 }],
  levelRequirement: 3,
  imagePrompt: 'test',
  value: 50,
};

const betterSword: EquipmentItem = {
  id: 'better_sword',
  name: 'Better Sword',
  description: 'A better sword',
  slot: 'main_hand',
  rarity: 'rare',
  statBonuses: [{ stat: 'STR', value: 4 }, { stat: 'DEX', value: 1 }],
  passives: [{
    id: 'sharp',
    name: 'Sharp',
    description: 'Extra sharp',
    statBonuses: [{ stat: 'STR', value: 1 }],
  }],
  levelRequirement: 5,
  imagePrompt: 'test',
  value: 200,
};

const factionItem: EquipmentItem = {
  id: 'faction_ring',
  name: 'Faction Ring',
  description: 'Requires faction standing',
  slot: 'ring',
  rarity: 'rare',
  statBonuses: [{ stat: 'CHA', value: 2 }],
  levelRequirement: 5,
  factionRequirement: 'iron_throne',
  imagePrompt: 'test',
  value: 100,
};

const statReqItem: EquipmentItem = {
  id: 'heavy_armor',
  name: 'Heavy Armor',
  description: 'Requires high STR',
  slot: 'chest',
  rarity: 'rare',
  statBonuses: [{ stat: 'CON', value: 3 }],
  levelRequirement: 1,
  statRequirement: { stat: 'STR', minimum: 14 },
  imagePrompt: 'test',
  value: 200,
};

const passiveWithFaction: EquipmentItem = {
  id: 'faction_cape',
  name: 'Faction Cape',
  description: 'Has faction bonus passive',
  slot: 'cape',
  rarity: 'epic',
  statBonuses: [{ stat: 'CHA', value: 2 }],
  passives: [{
    id: 'faction_aura',
    name: 'Faction Aura',
    description: 'Boosts faction standing',
    factionBonus: { faction: 'shadow_guild', value: 5 },
  }],
  levelRequirement: 1,
  imagePrompt: 'test',
  value: 500,
};

// ─── All 10 slot items for complete loadout test ──────────────────────────────

const allSlotItems: EquipmentItem[] = [
  { id: 'slot_head', name: 'Helm', description: '', slot: 'head', rarity: 'common', statBonuses: [{ stat: 'CON', value: 1 }], levelRequirement: 1, imagePrompt: '', value: 1 },
  { id: 'slot_chest', name: 'Chest', description: '', slot: 'chest', rarity: 'common', statBonuses: [{ stat: 'CON', value: 1 }], levelRequirement: 1, imagePrompt: '', value: 1 },
  { id: 'slot_legs', name: 'Legs', description: '', slot: 'legs', rarity: 'common', statBonuses: [{ stat: 'DEX', value: 1 }], levelRequirement: 1, imagePrompt: '', value: 1 },
  { id: 'slot_boots', name: 'Boots', description: '', slot: 'boots', rarity: 'common', statBonuses: [{ stat: 'DEX', value: 1 }], levelRequirement: 1, imagePrompt: '', value: 1 },
  { id: 'slot_gloves', name: 'Gloves', description: '', slot: 'gloves', rarity: 'common', statBonuses: [{ stat: 'STR', value: 1 }], levelRequirement: 1, imagePrompt: '', value: 1 },
  { id: 'slot_main_hand', name: 'Sword', description: '', slot: 'main_hand', rarity: 'common', statBonuses: [{ stat: 'STR', value: 2 }], levelRequirement: 1, imagePrompt: '', value: 1 },
  { id: 'slot_off_hand', name: 'Shield', description: '', slot: 'off_hand', rarity: 'common', statBonuses: [{ stat: 'CON', value: 2 }], levelRequirement: 1, imagePrompt: '', value: 1 },
  { id: 'slot_ring', name: 'Ring', description: '', slot: 'ring', rarity: 'common', statBonuses: [{ stat: 'Influence', value: 1 }], levelRequirement: 1, imagePrompt: '', value: 1 },
  { id: 'slot_amulet', name: 'Amulet', description: '', slot: 'amulet', rarity: 'common', statBonuses: [{ stat: 'WIS', value: 1 }], levelRequirement: 1, imagePrompt: '', value: 1 },
  { id: 'slot_cape', name: 'Cape', description: '', slot: 'cape', rarity: 'common', statBonuses: [{ stat: 'CHA', value: 1 }], levelRequirement: 1, imagePrompt: '', value: 1 },
];

const defaultFactions: FactionStanding = {
  iron_throne: 0,
  shadow_guild: 0,
  peoples_front: 0,
  old_faith: 0,
};

const positiveFactions: FactionStanding = {
  iron_throne: 50,
  shadow_guild: 50,
  peoples_front: 50,
  old_faith: 50,
};

// ─── Setup / Teardown ─────────────────────────────────────────────────────────

beforeEach(() => {
  clearItemRegistry();
  registerItems([testSword, testShield, testHelm, betterSword, factionItem, statReqItem, passiveWithFaction, ...allSlotItems]);
});

// ─── Registry Tests ───────────────────────────────────────────────────────────

describe('Item Registry', () => {
  test('registers and retrieves items', () => {
    expect(getItem('test_sword')).toEqual(testSword);
    expect(getItem('nonexistent')).toBeNull();
  });

  test('gets all items', () => {
    expect(getAllItems().length).toBe(17); // 7 named + 10 slot items
  });

  test('filters by slot', () => {
    const mainHands = getItemsBySlot('main_hand');
    expect(mainHands.length).toBe(3); // test_sword, better_sword, slot_main_hand
    expect(mainHands.every(i => i.slot === 'main_hand')).toBe(true);
  });
});

// ─── Stat Bonus Tests ─────────────────────────────────────────────────────────

describe('Stat Bonus Computation', () => {
  test('computes bonuses from empty loadout', () => {
    const loadout = createEmptyLoadout();
    const bonuses = computeEquipmentBonuses(loadout);
    expect(Object.keys(bonuses)).toHaveLength(0);
  });

  test('computes direct stat bonuses', () => {
    const loadout = createEmptyLoadout();
    loadout.main_hand = 'test_sword';
    loadout.off_hand = 'test_shield';

    const bonuses = computeEquipmentBonuses(loadout);
    expect(bonuses.STR).toBe(2);
    expect(bonuses.CON).toBe(2);
  });

  test('includes passive stat bonuses', () => {
    const loadout = createEmptyLoadout();
    loadout.main_hand = 'better_sword';

    const bonuses = computeEquipmentBonuses(loadout);
    // 4 direct + 1 passive = 5 total STR
    expect(bonuses.STR).toBe(5);
    expect(bonuses.DEX).toBe(1);
  });

  test('computes bonuses from fully equipped loadout (all 10 slots)', () => {
    const loadout = createEmptyLoadout();
    loadout.head = 'slot_head';
    loadout.chest = 'slot_chest';
    loadout.legs = 'slot_legs';
    loadout.boots = 'slot_boots';
    loadout.gloves = 'slot_gloves';
    loadout.main_hand = 'slot_main_hand';
    loadout.off_hand = 'slot_off_hand';
    loadout.ring = 'slot_ring';
    loadout.amulet = 'slot_amulet';
    loadout.cape = 'slot_cape';

    const bonuses = computeEquipmentBonuses(loadout);
    expect(bonuses.CON).toBe(4);  // head + chest + off_hand
    expect(bonuses.DEX).toBe(2);  // legs + boots
    expect(bonuses.STR).toBe(3);  // gloves + main_hand
    expect(bonuses.Influence).toBe(1); // ring
    expect(bonuses.WIS).toBe(1);  // amulet
    expect(bonuses.CHA).toBe(1);  // cape
  });

  test('getEquipmentStatBonus returns single stat bonus', () => {
    const loadout = createEmptyLoadout();
    loadout.main_hand = 'test_sword';
    expect(getEquipmentStatBonus(loadout, 'STR')).toBe(2);
    expect(getEquipmentStatBonus(loadout, 'DEX')).toBe(0);
  });

  test('computes faction bonuses from passives', () => {
    const loadout = createEmptyLoadout();
    loadout.cape = 'faction_cape';

    const factionBonuses = computeEquipmentFactionBonuses(loadout);
    expect(factionBonuses.shadow_guild).toBe(5);
  });
});

// ─── Validation Tests ─────────────────────────────────────────────────────────

describe('Equipment Validation', () => {
  test('validates level requirement', () => {
    const result = canEquipItem(testHelm, 1, defaultFactions, { CON: 10 });
    expect(result.canEquip).toBe(false);
    expect(result.reasons[0]).toContain('level 3');
  });

  test('passes when level is sufficient', () => {
    const result = canEquipItem(testSword, 1, defaultFactions, {});
    expect(result.canEquip).toBe(true);
    expect(result.reasons).toHaveLength(0);
  });

  test('validates faction requirement', () => {
    const result = canEquipItem(factionItem, 10, defaultFactions, {});
    expect(result.canEquip).toBe(false);
    expect(result.reasons[0]).toContain('iron throne');
  });

  test('passes faction requirement with positive standing', () => {
    const result = canEquipItem(factionItem, 10, positiveFactions, {});
    expect(result.canEquip).toBe(true);
  });

  test('validates stat requirement', () => {
    const result = canEquipItem(statReqItem, 10, defaultFactions, { STR: 10 });
    expect(result.canEquip).toBe(false);
    expect(result.reasons[0]).toContain('STR 14');
  });

  test('passes stat requirement', () => {
    const result = canEquipItem(statReqItem, 10, defaultFactions, { STR: 15 });
    expect(result.canEquip).toBe(true);
  });

  test('accumulates multiple failures', () => {
    const result = canEquipItem(factionItem, 1, defaultFactions, {});
    expect(result.canEquip).toBe(false);
    expect(result.reasons.length).toBe(2); // level + faction
  });
});

// ─── Equip / Unequip Tests ────────────────────────────────────────────────────

describe('Equip / Unequip', () => {
  test('equips item from inventory', () => {
    let inv = createDefaultInventory();
    inv = addToInventory(inv, 'test_sword');

    const result = equipItem(inv, 'test_sword', 5, defaultFactions, {});
    expect(result.success).toBe(true);
    expect(result.inventory.equipment.main_hand).toBe('test_sword');
    expect(result.inventory.items.find(e => e.itemId === 'test_sword')).toBeUndefined();
    expect(result.unequippedItemId).toBeNull();
  });

  test('swaps equipped item back to inventory', () => {
    let inv = createDefaultInventory();
    inv = addToInventory(inv, 'test_sword');
    inv = addToInventory(inv, 'better_sword');

    // Equip first sword
    const r1 = equipItem(inv, 'test_sword', 5, defaultFactions, {});
    expect(r1.success).toBe(true);

    // Equip second sword (should swap)
    const r2 = equipItem(r1.inventory, 'better_sword', 10, defaultFactions, {});
    expect(r2.success).toBe(true);
    expect(r2.inventory.equipment.main_hand).toBe('better_sword');
    expect(r2.unequippedItemId).toBe('test_sword');
    // test_sword should be back in inventory
    expect(r2.inventory.items.find(e => e.itemId === 'test_sword')?.quantity).toBe(1);
  });

  test('fails if item not in inventory', () => {
    const inv = createDefaultInventory();
    const result = equipItem(inv, 'test_sword', 5, defaultFactions, {});
    expect(result.success).toBe(false);
    expect(result.error).toContain('not in inventory');
  });

  test('fails if requirements not met', () => {
    let inv = createDefaultInventory();
    inv = addToInventory(inv, 'test_helm');
    const result = equipItem(inv, 'test_helm', 1, defaultFactions, {});
    expect(result.success).toBe(false);
    expect(result.error).toContain('level 3');
  });

  test('unequips item to inventory', () => {
    let inv = createDefaultInventory();
    inv.equipment.main_hand = 'test_sword';

    const result = unequipItem(inv, 'main_hand');
    expect(result.success).toBe(true);
    expect(result.inventory.equipment.main_hand).toBeNull();
    expect(result.inventory.items.find(e => e.itemId === 'test_sword')?.quantity).toBe(1);
    expect(result.unequippedItemId).toBe('test_sword');
  });

  test('unequip fails on empty slot', () => {
    const inv = createDefaultInventory();
    const result = unequipItem(inv, 'main_hand');
    expect(result.success).toBe(false);
    expect(result.error).toContain('empty');
  });
});

// ─── Comparison Tests ─────────────────────────────────────────────────────────

describe('Item Comparison', () => {
  test('compares against empty slot', () => {
    const loadout = createEmptyLoadout();
    const comparison = compareItems(loadout, testSword);

    expect(comparison.slot).toBe('main_hand');
    expect(comparison.currentItem).toBeNull();
    expect(comparison.statDiffs.find(d => d.stat === 'STR')?.diff).toBe(2);
    expect(comparison.totalDiff).toBe(2);
  });

  test('compares upgrade', () => {
    const loadout = createEmptyLoadout();
    loadout.main_hand = 'test_sword';

    const comparison = compareItems(loadout, betterSword);
    // betterSword: STR 4+1 passive, DEX 1 vs testSword: STR 2
    const strDiff = comparison.statDiffs.find(d => d.stat === 'STR');
    expect(strDiff?.current).toBe(2);
    expect(strDiff?.proposed).toBe(5);
    expect(strDiff?.diff).toBe(3);
    expect(comparison.totalDiff).toBe(4); // +3 STR + 1 DEX
  });
});

// ─── Inventory Helper Tests ───────────────────────────────────────────────────

describe('Inventory Helpers', () => {
  test('adds items to inventory', () => {
    let inv = createDefaultInventory();
    inv = addToInventory(inv, 'test_sword', 2);
    expect(inv.items.find(e => e.itemId === 'test_sword')?.quantity).toBe(2);
  });

  test('stacks same items', () => {
    let inv = createDefaultInventory();
    inv = addToInventory(inv, 'test_sword', 1);
    inv = addToInventory(inv, 'test_sword', 3);
    expect(inv.items.find(e => e.itemId === 'test_sword')?.quantity).toBe(4);
  });

  test('respects max capacity', () => {
    let inv = createDefaultInventory();
    inv.maxCapacity = 5;
    inv = addToInventory(inv, 'test_sword', 10);
    expect(getInventoryCount(inv)).toBe(5);
  });

  test('removes items', () => {
    let inv = createDefaultInventory();
    inv = addToInventory(inv, 'test_sword', 3);
    inv = removeFromInventory(inv, 'test_sword', 2);
    expect(inv.items.find(e => e.itemId === 'test_sword')?.quantity).toBe(1);
  });

  test('removes items completely when quantity reaches 0', () => {
    let inv = createDefaultInventory();
    inv = addToInventory(inv, 'test_sword', 2);
    inv = removeFromInventory(inv, 'test_sword', 2);
    expect(inv.items.find(e => e.itemId === 'test_sword')).toBeUndefined();
  });

  test('hasItem checks correctly', () => {
    let inv = createDefaultInventory();
    expect(hasItem(inv, 'test_sword')).toBe(false);
    inv = addToInventory(inv, 'test_sword');
    expect(hasItem(inv, 'test_sword')).toBe(true);
  });

  test('getInventoryCount sums all items', () => {
    let inv = createDefaultInventory();
    inv = addToInventory(inv, 'test_sword', 3);
    inv = addToInventory(inv, 'test_shield', 2);
    expect(getInventoryCount(inv)).toBe(5);
  });

  test('getEquippedItems returns all equipped', () => {
    const loadout = createEmptyLoadout();
    loadout.main_hand = 'test_sword';
    loadout.off_hand = 'test_shield';

    const equipped = getEquippedItems(loadout);
    expect(equipped).toHaveLength(2);
    expect(equipped[0].slot).toBe('main_hand');
    expect(equipped[1].slot).toBe('off_hand');
  });

  test('getEquippableForSlot returns matching inventory items', () => {
    let inv = createDefaultInventory();
    inv = addToInventory(inv, 'test_sword');
    inv = addToInventory(inv, 'better_sword');
    inv = addToInventory(inv, 'test_shield');

    const equippable = getEquippableForSlot(inv, 'main_hand');
    expect(equippable).toHaveLength(2);
    expect(equippable.every(i => i.slot === 'main_hand')).toBe(true);
  });
});

// ─── 10 Slot Completeness Tests ───────────────────────────────────────────────

describe('10 Equipment Slots', () => {
  test('createEmptyLoadout has exactly 10 slots', () => {
    const loadout = createEmptyLoadout();
    const slots = Object.keys(loadout);
    expect(slots).toHaveLength(10);
    expect(slots).toContain('head');
    expect(slots).toContain('chest');
    expect(slots).toContain('legs');
    expect(slots).toContain('boots');
    expect(slots).toContain('gloves');
    expect(slots).toContain('main_hand');
    expect(slots).toContain('off_hand');
    expect(slots).toContain('ring');
    expect(slots).toContain('amulet');
    expect(slots).toContain('cape');
  });

  test('can equip all 10 slots simultaneously', () => {
    let inv = createDefaultInventory();
    for (const item of allSlotItems) {
      inv = addToInventory(inv, item.id);
    }

    // Equip each slot
    for (const item of allSlotItems) {
      const result = equipItem(inv, item.id, 10, defaultFactions, {});
      expect(result.success).toBe(true);
      inv = result.inventory;
    }

    // All slots filled
    for (const item of allSlotItems) {
      expect(inv.equipment[item.slot]).toBe(item.id);
    }

    // Inventory should be empty (all items equipped)
    expect(getInventoryCount(inv)).toBe(0);

    // Get total bonuses from all 10 slots
    const bonuses = computeEquipmentBonuses(inv.equipment);
    expect(Object.values(bonuses).reduce((a, b) => a + b, 0)).toBeGreaterThan(0);
  });

  test('each slot has dedicated items in allSlotItems', () => {
    const coveredSlots = new Set(allSlotItems.map(i => i.slot));
    expect(coveredSlots.size).toBe(10);
  });
});
