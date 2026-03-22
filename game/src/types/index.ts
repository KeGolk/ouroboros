// Barrel export for all game type modules
//
// Canonical faction types (Faction, FactionId, FactionStanding) come from ./factions.
// Duplicate definitions in ./narrative and ./entities are excluded to avoid ambiguity.

export * from './combat';
export * from './equipment';
export * from './factions';
export * from './game';
export * from './map-state';
export * from './stats';
export * from './world';
export * from './world-map';

// Re-export narrative types, excluding FactionId and Faction (canonical in ./factions)
export type {
  Character,
  StatId,
  StatCheck,
  Condition,
  Consequence,
  StoryNode,
  Choice,
  Chapter,
  EndingId,
  Ending,
  NarrativeConfig,
} from './narrative';

// Re-export entity types, excluding FactionId and FactionStanding (canonical in ./factions)
export type {
  EntityId,
  EntityType,
  EntityBase,
  EntityLocation,
  CharacterLevel,
  FactionRank,
  PlayerBackground,
  Player,
  EnemyTier,
  EnemyArchetype,
  Enemy,
  LootDrop,
  CombatDialogue,
  EnemyPhase,
  NpcRole,
  NpcDisposition,
  MerchantStock,
  Npc,
  RecruitCondition,
  NpcScheduleEntry,
  ItemCategory,
  ConsumableEffectType,
  ConsumableEffect,
  Item,
  ItemStatBonus,
  GameEntity,
} from './entities';

// Re-export entity utility functions and constants
export {
  MIN_LEVEL,
  MAX_LEVEL,
  createCharacterLevel,
  isValidLevel,
  isPlayer,
  isEnemy,
  isNpc,
  isItem,
  createEntityId,
} from './entities';
