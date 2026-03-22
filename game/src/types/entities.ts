/**
 * Core Game Entity Types for "Crowns of Ash"
 *
 * Defines the four fundamental entity types that populate the game world:
 *   - Player: The protagonist, a disgraced noble navigating Valdris
 *   - Enemy: Hostile entities encountered in combat
 *   - NPC: Non-player characters for dialogue, quests, and trade
 *   - Item: Objects that can be acquired, equipped, or consumed
 *
 * All entities share a common base and extend with role-specific fields.
 * Integrates with the stat, combat, equipment, and narrative systems.
 */

import type { StatName, StatBlock, DerivedStats, StatValue } from './stats';
import type { StatusEffect, CombatAbility, AiPattern } from './combat';
import type { EquipmentLoadout, InventoryState, ItemRarity, EquipmentSlot } from './equipment';

// ─── Level Constants ─────────────────────────────────────────────────────────

/** Minimum character level */
export const MIN_LEVEL = 1;

/** Maximum character level */
export const MAX_LEVEL = 100;

/** Valid character level range (1–100) */
export type CharacterLevel = number & { readonly __brand: 'CharacterLevel' };

/** Create a validated CharacterLevel from a raw number, clamping to 1–100 */
export function createCharacterLevel(level: number): CharacterLevel {
  const clamped = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.round(level)));
  return clamped as CharacterLevel;
}

/** Check whether a number is a valid character level (1–100) */
export function isValidLevel(level: number): level is CharacterLevel {
  return Number.isInteger(level) && level >= MIN_LEVEL && level <= MAX_LEVEL;
}

// ─── Entity Base ─────────────────────────────────────────────────────────────

/** Unique entity identifier (UUID format) */
export type EntityId = string & { readonly __brand: 'EntityId' };

/** All entity categories in the game */
export type EntityType = 'player' | 'enemy' | 'npc' | 'item';

/** Shared properties for all game entities */
export interface EntityBase {
  /** Unique identifier */
  id: EntityId;
  /** Entity category discriminator */
  type: EntityType;
  /** Display name */
  name: string;
  /** Narrative description */
  description: string;
  /** AI art prompt for portrait generation */
  imagePrompt: string;
  /** Whether this entity is currently active in the game world */
  isActive: boolean;
}

// ─── Location Reference ──────────────────────────────────────────────────────

/** Where an entity exists in the game world */
export interface EntityLocation {
  /** Region identifier */
  regionId: string;
  /** Specific location within the region */
  locationId: string;
  /** Sub-area (e.g., room, floor) */
  subArea?: string;
}

// ─── Faction Affiliation ─────────────────────────────────────────────────────

/** Faction standing for an entity */
export type FactionId = 'iron_covenant' | 'verdant_court' | 'obsidian_circle' | 'ashen_throne';

export interface FactionStanding {
  factionId: FactionId;
  /** Reputation value from -100 (hated) to 100 (exalted) */
  reputation: number;
  /** Named rank within the faction */
  rank: FactionRank;
}

export type FactionRank =
  | 'outcast'     // -100 to -50
  | 'distrusted'  // -49 to -10
  | 'neutral'     //  -9 to  9
  | 'known'       //  10 to 29
  | 'trusted'     //  30 to 59
  | 'honored'     //  60 to 89
  | 'exalted';    //  90 to 100

// ─── Player Entity ───────────────────────────────────────────────────────────

/** Character class / archetype chosen at creation */
export type PlayerBackground =
  | 'fallen_knight'    // STR/FOR focus — disgraced military commander
  | 'court_schemer'    // CUN/CHA focus — exiled political advisor
  | 'hedge_scholar'    // WIS/CUN focus — wandering sage and alchemist
  | 'shadow_blade'     // STE/CUN focus — former spymaster
  | 'war_priest'       // WIS/FOR focus — defrocked temple guardian
  | 'noble_exile';     // CHA/STR focus — banished aristocrat

/** The player character — protagonist of Crowns of Ash */
export interface Player extends EntityBase {
  type: 'player';
  /** Character background chosen at creation */
  background: PlayerBackground;
  /** Current level (1–100) */
  level: CharacterLevel;
  /** Current experience points */
  experience: number;
  /** Experience needed for next level */
  experienceToNextLevel: number;
  /** Primary stat block */
  stats: StatBlock;
  /** Derived combat stats */
  derived: DerivedStats;
  /** Current hit points */
  currentHp: number;
  /** Maximum hit points */
  maxHp: number;
  /** Reputation with each faction */
  factionStandings: FactionStanding[];
  /** Currently equipped items */
  equipment: EquipmentLoadout;
  /** Full inventory state */
  inventory: InventoryState;
  /** Unlocked combat abilities */
  abilities: CombatAbility[];
  /** Active status effects (buffs/debuffs persisting outside combat) */
  statusEffects: StatusEffect[];
  /** Flags and story state for narrative progression */
  flags: Record<string, boolean>;
  /** Characters the player has recruited as allies */
  recruitedAllyIds: EntityId[];
  /** Relationship scores with NPCs (-100 to 100) */
  relationships: Record<EntityId, number>;
  /** Current world location */
  location: EntityLocation;
  /** Chapters the player has completed */
  completedChapterIds: string[];
  /** Currently active quests */
  activeQuestIds: string[];
  /** Total play time in seconds */
  playTimeSeconds: number;
  /** Number of deaths / game overs */
  deathCount: number;
  /** Character title earned through gameplay */
  title: string;
}

// ─── Enemy Entity ────────────────────────────────────────────────────────────

/** Enemy threat classification */
export type EnemyTier =
  | 'minion'      // Fodder, dispatched in minor encounters
  | 'elite'       // Tougher foes, may appear in small groups
  | 'champion'    // Mid-boss difficulty, guards key areas
  | 'boss'        // Chapter boss, multi-phase fights
  | 'legendary';  // End-game threats, unique mechanics

/** Enemy archetype determining combat behavior */
export type EnemyArchetype =
  | 'brute'       // High STR, low CUN — charges in
  | 'assassin'    // High STE/CUN — attacks from shadows
  | 'caster'      // High WIS — uses arcane abilities
  | 'guardian'    // High FOR — defensive, protects others
  | 'commander'   // High CHA — buffs allies, debuffs player
  | 'beast';      // Feral, unpredictable attack patterns

/** A hostile entity the player fights */
export interface Enemy extends EntityBase {
  type: 'enemy';
  /** Threat level classification */
  tier: EnemyTier;
  /** Combat behavior archetype */
  archetype: EnemyArchetype;
  /** Enemy level 1–100 (determines stat scaling) */
  level: CharacterLevel;
  /** Primary stat block */
  stats: StatBlock;
  /** Derived combat stats */
  derived: DerivedStats;
  /** Current hit points */
  currentHp: number;
  /** Maximum hit points */
  maxHp: number;
  /** Available combat abilities */
  abilities: CombatAbility[];
  /** Active status effects */
  statusEffects: StatusEffect[];
  /** AI combat behavior pattern */
  aiPattern: AiPattern;
  /** Faction this enemy belongs to (if any) */
  faction?: FactionId;
  /** Experience points awarded on defeat */
  experienceReward: number;
  /** Items dropped on defeat (item IDs with drop chance) */
  lootTable: LootDrop[];
  /** World location where this enemy spawns */
  location: EntityLocation;
  /** Unique dialogue or taunt lines during combat */
  combatDialogue?: CombatDialogue;
  /** For bosses: phase transition thresholds */
  phases?: EnemyPhase[];
  /** Whether this enemy respawns after being defeated */
  respawns: boolean;
  /** Chapter(s) where this enemy appears */
  chapterIds: string[];
}

/** Loot drop entry with probability */
export interface LootDrop {
  /** Item ID to drop */
  itemId: string;
  /** Drop chance from 0.0 to 1.0 */
  dropChance: number;
  /** Minimum quantity */
  minQuantity: number;
  /** Maximum quantity */
  maxQuantity: number;
}

/** Enemy combat dialogue lines */
export interface CombatDialogue {
  /** Said at start of combat */
  onEngage: string;
  /** Said when hitting the player */
  onHit?: string;
  /** Said when taking heavy damage */
  onDamaged?: string;
  /** Said on phase transition (bosses) */
  onPhaseChange?: string;
  /** Said on defeat */
  onDefeat: string;
}

/** Boss phase transition */
export interface EnemyPhase {
  /** HP percentage threshold to trigger (0.0 to 1.0) */
  hpThreshold: number;
  /** Narrative text when phase begins */
  transitionText: string;
  /** Stat modifications applied */
  statModifiers?: Partial<Record<StatName, number>>;
  /** New abilities unlocked in this phase */
  unlockedAbilities?: CombatAbility[];
  /** AI pattern change for this phase */
  aiPatternOverride?: AiPattern;
}

// ─── NPC Entity ──────────────────────────────────────────────────────────────

/** NPC role in the game world */
export type NpcRole =
  | 'quest_giver'   // Offers quests and story hooks
  | 'merchant'      // Buys/sells items
  | 'trainer'       // Teaches abilities or improves stats
  | 'informant'     // Provides lore, rumors, and intel
  | 'ally'          // Recruited companion (fights alongside player)
  | 'noble'         // Political figure, faction leader
  | 'commoner'      // Background character with ambient dialogue
  | 'guard';        // Blocks passage, enforces faction territory

/** Disposition toward the player */
export type NpcDisposition =
  | 'hostile'       // Will attack or refuse interaction
  | 'suspicious'    // Guarded, limited dialogue options
  | 'neutral'       // Standard interaction
  | 'friendly'      // Offers better prices, more info
  | 'loyal';        // Full trust, unlocks special options

/** Merchant inventory entry */
export interface MerchantStock {
  itemId: string;
  /** Price in gold */
  price: number;
  /** Available quantity (-1 for unlimited) */
  quantity: number;
  /** Minimum faction reputation to purchase */
  reputationRequired?: number;
  /** Minimum player level to purchase */
  levelRequired?: number;
}

/** A non-player character for interaction, trade, and quests */
export interface Npc extends EntityBase {
  type: 'npc';
  /** Title or honorific */
  title: string;
  /** Primary role in the game */
  role: NpcRole;
  /** Secondary roles (e.g., a noble who also trades) */
  secondaryRoles?: NpcRole[];
  /** Faction allegiance */
  faction: FactionId | 'unaligned';
  /** Current disposition toward the player */
  disposition: NpcDisposition;
  /** Base relationship score (-100 to 100) */
  baseRelationship: number;
  /** Personality description for dialogue generation */
  personality: string;
  /** Current world location */
  location: EntityLocation;
  /** Dialogue tree entry point (node ID) */
  dialogueEntryId?: string;
  /** Quest IDs this NPC offers */
  questIds?: string[];
  /** Merchant inventory (if role includes merchant) */
  merchantStock?: MerchantStock[];
  /** Abilities this NPC can teach (if role includes trainer) */
  teachableAbilityIds?: string[];
  /** Whether this NPC can be recruited as an ally */
  isRecruitable: boolean;
  /** Conditions required to recruit */
  recruitConditions?: RecruitCondition[];
  /** Combat stats (for allies or hostile NPCs) */
  stats?: StatBlock;
  /** Derived combat stats */
  derived?: DerivedStats;
  /** Combat abilities (for allies or hostile NPCs) */
  abilities?: CombatAbility[];
  /** AI pattern when fighting alongside player */
  allyAiPattern?: AiPattern;
  /** Whether this NPC is essential (cannot be killed) */
  isEssential: boolean;
  /** Whether this NPC is currently alive */
  isAlive: boolean;
  /** Chapter(s) where this NPC appears */
  chapterIds: string[];
  /** Schedule: different locations at different story points */
  schedule?: NpcScheduleEntry[];
}

/** Condition to recruit an NPC as an ally */
export interface RecruitCondition {
  type: 'relationship' | 'faction_reputation' | 'quest_complete' | 'item_possessed' | 'stat_minimum';
  target: string;
  /** Minimum value required */
  threshold: number;
}

/** NPC location at different story points */
export interface NpcScheduleEntry {
  /** Chapter ID when this schedule applies */
  chapterId: string;
  /** Location during this chapter */
  location: EntityLocation;
  /** Whether the NPC is available for interaction */
  isAvailable: boolean;
}

// ─── Item Entity ─────────────────────────────────────────────────────────────

/** Item categories */
export type ItemCategory =
  | 'weapon'       // Equippable in main_hand or off_hand
  | 'armor'        // Equippable in head, chest, legs, boots, gloves, cape
  | 'accessory'    // Equippable in ring, amulet
  | 'consumable'   // Single-use (potions, scrolls, food)
  | 'quest'        // Story-critical items, cannot be sold
  | 'material'     // Crafting components
  | 'key'          // Unlocks areas or triggers events
  | 'lore';        // Books, letters, documents — provide backstory

/** Consumable effect types */
export type ConsumableEffectType =
  | 'heal'           // Restores HP
  | 'buff_stat'      // Temporarily boosts a stat
  | 'cure_status'    // Removes a negative status effect
  | 'apply_status'   // Applies a status effect
  | 'restore_all'    // Full HP and status cure
  | 'reveal_map';    // Reveals fog of war

/** Effect applied when a consumable item is used */
export interface ConsumableEffect {
  type: ConsumableEffectType;
  /** Target stat for buff effects */
  targetStat?: StatName;
  /** Effect magnitude (HP restored, stat bonus amount, etc.) */
  value: number;
  /** Duration in rounds (0 = instant, -1 = permanent) */
  duration: number;
  /** Flavor text when consumed */
  useText: string;
}

/** A game item — weapons, armor, consumables, quest objects, etc. */
export interface Item extends EntityBase {
  type: 'item';
  /** Item classification */
  category: ItemCategory;
  /** Rarity tier */
  rarity: ItemRarity;
  /** Equipment slot (for equippable items) */
  equipSlot?: EquipmentSlot;
  /** Stat bonuses when equipped */
  statBonuses?: ItemStatBonus[];
  /** Effects when consumed (for consumables) */
  consumableEffects?: ConsumableEffect[];
  /** Gold value for buying/selling */
  goldValue: number;
  /** Weight for inventory management */
  weight: number;
  /** Minimum level to use or equip */
  levelRequirement: number;
  /** Faction requirement to equip */
  factionRequirement?: FactionId;
  /** Stat requirement to equip */
  statRequirement?: { stat: StatName; minimum: number };
  /** Whether the item can be sold */
  isSellable: boolean;
  /** Whether the item stacks in inventory */
  isStackable: boolean;
  /** Maximum stack size (if stackable) */
  maxStackSize?: number;
  /** Lore text revealed on inspection */
  loreText?: string;
  /** Chapter where this item can first be obtained */
  obtainableInChapter?: string;
  /** Quest ID this item is associated with */
  questId?: string;
}

/** Stat bonus provided by an item */
export interface ItemStatBonus {
  stat: StatName;
  value: number;
}

// ─── Discriminated Union ─────────────────────────────────────────────────────

/** Union of all game entities, discriminated by `type` field */
export type GameEntity = Player | Enemy | Npc | Item;

// ─── Type Guards ─────────────────────────────────────────────────────────────

/** Check if an entity is a Player */
export function isPlayer(entity: GameEntity): entity is Player {
  return entity.type === 'player';
}

/** Check if an entity is an Enemy */
export function isEnemy(entity: GameEntity): entity is Enemy {
  return entity.type === 'enemy';
}

/** Check if an entity is an NPC */
export function isNpc(entity: GameEntity): entity is Npc {
  return entity.type === 'npc';
}

/** Check if an entity is an Item */
export function isItem(entity: GameEntity): entity is Item {
  return entity.type === 'item';
}

// ─── Factory Helpers ─────────────────────────────────────────────────────────

/** Create a branded EntityId from a string */
export function createEntityId(id: string): EntityId {
  return id as EntityId;
}
