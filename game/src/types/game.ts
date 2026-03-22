/**
 * Core game state, session, and configuration types for Crowns of Ash.
 *
 * These types define the top-level game lifecycle: configuration for
 * initializing a game, the persistent game state, and the runtime session
 * that wraps state with metadata and player context.
 */

import type { PlayerStats, FactionStanding, FactionId, ChoiceRecord } from '../engine/types';

// ─── Game Difficulty & Mode ──────────────────────────────────────────────────

/** Difficulty presets that tune combat, stat checks, and resource availability */
export type GameDifficulty = 'merciful' | 'standard' | 'brutal' | 'ironborn';

/** The overall phase/mode the game is currently in */
export type GamePhase =
  | 'main_menu'
  | 'character_creation'
  | 'playing'
  | 'combat'
  | 'dialogue'
  | 'world_map'
  | 'inventory'
  | 'game_over'
  | 'ending'
  | 'paused';

// ─── Game Configuration ──────────────────────────────────────────────────────

/** Static configuration for initializing a new game */
export interface GameConfig {
  /** Display title of the game */
  title: string;
  /** Semantic version string (e.g. "0.1.0") */
  version: string;
  /** Total number of chapters in the campaign */
  totalChapters: number;
  /** Total available endings */
  totalEndings: number;
  /** Difficulty setting */
  difficulty: GameDifficulty;
  /** Starting chapter ID */
  startChapterId: string;
  /** Starting scene ID within the starting chapter */
  startSceneId: string;
  /** Starting location on the world map */
  startLocationId: string;
  /** Available factions in this campaign */
  availableFactions: FactionId[];
  /** Point-buy budget for character creation */
  statPointBudget: number;
  /** Minimum value any single stat can be set to */
  statMin: number;
  /** Maximum value any single stat can be set to */
  statMax: number;
  /** Whether autosave is enabled */
  autosaveEnabled: boolean;
  /** Autosave interval in seconds (0 = event-driven only) */
  autosaveIntervalSeconds: number;
  /** Maximum number of save slots */
  maxSaveSlots: number;
  /** Whether New Game+ is unlocked */
  ngPlusUnlocked: boolean;
  /** Feature flags for experimental/optional mechanics */
  featureFlags: Record<string, boolean>;
}

// ─── Game State ──────────────────────────────────────────────────────────────

/**
 * The full persistent game state — everything needed to save/load a game.
 *
 * This mirrors and extends the engine's GameState with additional fields
 * for the UI layer and session management.
 */
export interface GameState {
  /** Unique save identifier */
  saveId: string;
  /** Player-chosen character name */
  playerName: string;
  /** Current chapter ID */
  currentChapterId: string;
  /** Current scene ID within the chapter */
  currentSceneId: string;
  /** Player RPG stats */
  stats: PlayerStats;
  /** Faction reputation standings */
  factions: FactionStanding;
  /** Boolean flags tracking narrative state (e.g. "betrayed_lord_varn") */
  flags: Record<string, boolean>;
  /** Ordered history of all player choices */
  choiceHistory: ChoiceRecord[];
  /** IDs of characters that have been killed */
  deadCharacters: string[];
  /** Unlocked items, abilities, or chapter access */
  unlocks: string[];
  /** IDs of completed chapters */
  completedChapters: string[];
  /** Timestamp (epoch ms) of last save */
  savedAt: number;
  /** New Game+ cycle count (0 = first playthrough) */
  ngPlusCycle: number;
  /** Achievement IDs earned */
  achievements: string[];
  /** Total playtime in seconds */
  playtimeSeconds: number;
  /** Current world map location ID */
  currentLocationId: string | null;
  /** Serialized map state snapshot for persistence */
  mapStateSnapshot: Record<string, unknown> | null;
  /** Current game phase */
  phase: GamePhase;
  /** Difficulty setting for this save */
  difficulty: GameDifficulty;
  /** Player's chosen faction allegiance (null if unchosen) */
  playerFaction: FactionId | null;
  /** Current player health (for combat encounters) */
  currentHealth: number;
  /** Maximum player health */
  maxHealth: number;
  /** Current experience points */
  experience: number;
  /** Current player level */
  level: number;
  /** Items in the player's inventory */
  inventory: InventoryItem[];
  /** Active status effects / buffs / debuffs */
  activeEffects: ActiveEffect[];
}

/** An item in the player's inventory */
export interface InventoryItem {
  /** Unique item instance ID */
  id: string;
  /** Item definition/template ID */
  itemId: string;
  /** Display name */
  name: string;
  /** Item category */
  type: 'quest' | 'consumable' | 'equipment' | 'key';
  /** Stack count (1 for non-stackable) */
  quantity: number;
  /** Whether this item is currently equipped */
  equipped: boolean;
}

/** A time-limited effect applied to the player */
export interface ActiveEffect {
  /** Unique effect instance ID */
  id: string;
  /** Effect template/source ID */
  sourceId: string;
  /** Display name */
  name: string;
  /** Whether this is beneficial or harmful */
  kind: 'buff' | 'debuff' | 'neutral';
  /** Stat being modified (if applicable) */
  affectedStat: keyof PlayerStats | null;
  /** Magnitude of the modifier */
  magnitude: number;
  /** Remaining duration in turns (null = permanent until removed) */
  remainingTurns: number | null;
  /** Timestamp when the effect was applied */
  appliedAt: number;
}

// ─── Game Session ────────────────────────────────────────────────────────────

/** Save slot metadata shown in the load screen */
export interface SaveSlotMeta {
  /** Save slot identifier */
  saveId: string;
  /** Player name */
  playerName: string;
  /** Chapter number at time of save */
  chapterNumber: number;
  /** Chapter title at time of save */
  chapterTitle: string;
  /** Location name at time of save */
  locationName: string;
  /** Playtime in seconds */
  playtimeSeconds: number;
  /** Timestamp of the save */
  savedAt: number;
  /** Difficulty */
  difficulty: GameDifficulty;
  /** NG+ cycle */
  ngPlusCycle: number;
  /** Whether this is an autosave */
  isAutosave: boolean;
}

/** Source of a cloud sync operation */
export type SyncSource = 'local' | 'cloud' | 'conflict';

/** Status of cloud synchronization */
export interface SyncStatus {
  /** Whether a sync operation is in progress */
  isSyncing: boolean;
  /** Timestamp of last successful sync */
  lastSyncedAt: number | null;
  /** Error message from last sync attempt */
  lastError: string | null;
  /** Source of the most recent state */
  source: SyncSource;
}

/**
 * A game session wraps the persistent game state with runtime metadata
 * that doesn't need to be persisted but is needed during play.
 */
export interface GameSession {
  /** Unique session identifier (generated on each play session start) */
  sessionId: string;
  /** The authenticated user's ID (null if playing offline) */
  userId: string | null;
  /** The persistent game state */
  gameState: GameState;
  /** The game configuration for this session */
  config: GameConfig;
  /** Session start timestamp */
  startedAt: number;
  /** Whether the game has been modified since last save */
  isDirty: boolean;
  /** Whether the session is currently active */
  isActive: boolean;
  /** Whether the player is currently in a cutscene/non-interactive sequence */
  isInCutscene: boolean;
  /** Cloud sync status */
  syncStatus: SyncStatus;
  /** Available save slots */
  saveSlots: SaveSlotMeta[];
  /** Undo stack depth (number of choices that can be undone, 0 in ironborn) */
  undoDepth: number;
  /** Accumulated playtime this session in seconds */
  sessionPlaytimeSeconds: number;
  /** Last interaction timestamp (for idle detection) */
  lastInteractionAt: number;
}

// ─── Factory Defaults ────────────────────────────────────────────────────────

/** Default game configuration */
export const DEFAULT_GAME_CONFIG: GameConfig = {
  title: 'Crowns of Ash',
  version: '0.1.0',
  totalChapters: 10,
  totalEndings: 6,
  difficulty: 'standard',
  startChapterId: 'chapter_01',
  startSceneId: 'scene_01_intro',
  startLocationId: 'thornhold',
  availableFactions: ['iron_throne', 'shadow_guild', 'peoples_front', 'old_faith'],
  statPointBudget: 30,
  statMin: 1,
  statMax: 10,
  autosaveEnabled: true,
  autosaveIntervalSeconds: 0,
  maxSaveSlots: 10,
  ngPlusUnlocked: false,
  featureFlags: {},
};

/** Default player stats for a new game */
export const DEFAULT_PLAYER_STATS: PlayerStats = {
  strength: 5,
  dexterity: 5,
  intelligence: 5,
  wisdom: 5,
  constitution: 5,
  charisma: 5,
  influence: 5,
  cunning: 5,
  diplomacy: 5,
};

/** Default faction standings for a new game */
export const DEFAULT_FACTION_STANDING: FactionStanding = {
  iron_throne: 0,
  shadow_guild: 0,
  peoples_front: 0,
  old_faith: 0,
};

/** Create a fresh GameState for a new game */
export function createInitialGameState(
  saveId: string,
  playerName: string,
  config: GameConfig,
): GameState {
  return {
    saveId,
    playerName,
    currentChapterId: config.startChapterId,
    currentSceneId: config.startSceneId,
    stats: { ...DEFAULT_PLAYER_STATS },
    factions: { ...DEFAULT_FACTION_STANDING },
    flags: {},
    choiceHistory: [],
    deadCharacters: [],
    unlocks: [],
    completedChapters: [],
    savedAt: Date.now(),
    ngPlusCycle: 0,
    achievements: [],
    playtimeSeconds: 0,
    currentLocationId: config.startLocationId,
    mapStateSnapshot: null,
    phase: 'character_creation',
    difficulty: config.difficulty,
    playerFaction: null,
    currentHealth: 100,
    maxHealth: 100,
    experience: 0,
    level: 1,
    inventory: [],
    activeEffects: [],
  };
}

/** Create a fresh GameSession */
export function createGameSession(
  sessionId: string,
  userId: string | null,
  gameState: GameState,
  config: GameConfig,
): GameSession {
  const now = Date.now();
  return {
    sessionId,
    userId,
    gameState,
    config,
    startedAt: now,
    isDirty: false,
    isActive: true,
    isInCutscene: false,
    syncStatus: {
      isSyncing: false,
      lastSyncedAt: null,
      lastError: null,
      source: userId ? 'cloud' : 'local',
    },
    saveSlots: [],
    undoDepth: config.difficulty === 'ironborn' ? 0 : 5,
    sessionPlaytimeSeconds: 0,
    lastInteractionAt: now,
  };
}

// ─── Scene ───────────────────────────────────────────────────────────────────

/** A scene within a chapter — the atomic unit of narrative presentation */
export interface Scene {
  /** Unique scene identifier */
  id: string;
  /** Parent chapter ID */
  chapterId: string;
  /** Scene title shown in the UI */
  title: string;
  /** Narrative prose displayed to the player */
  text: string;
  /** Character ID of the speaker (if dialogue) */
  speakerId: string | null;
  /** AI art prompt for scene illustration */
  imagePrompt: string;
  /** Available player choices */
  choices: SceneChoice[];
  /** Whether this scene ends the chapter */
  isEndScene: boolean;
  /** Whether this scene triggers a combat encounter */
  isCombatScene: boolean;
  /** Combat encounter ID (if isCombatScene is true) */
  combatEncounterId: string | null;
  /** Ambient mood for visual/audio theming */
  mood: SceneMood;
  /** Location ID where this scene takes place */
  locationId: string | null;
}

/** Mood/atmosphere tag for a scene */
export type SceneMood =
  | 'tense'
  | 'somber'
  | 'triumphant'
  | 'mysterious'
  | 'violent'
  | 'peaceful'
  | 'desperate'
  | 'romantic'
  | 'foreboding';

/** A choice available within a scene */
export interface SceneChoice {
  /** Unique choice identifier */
  id: string;
  /** Display text shown to the player */
  text: string;
  /** Hover tooltip with additional context */
  tooltip: string | null;
  /** Target scene ID this choice leads to */
  targetSceneId: string;
  /** Whether this choice is hidden until conditions are met */
  isHidden: boolean;
}

// ─── Dialogue Node ───────────────────────────────────────────────────────────

/** A node in a dialogue tree for NPC conversations */
export interface DialogueNode {
  /** Unique node identifier */
  id: string;
  /** The NPC character ID speaking */
  speakerId: string;
  /** Dialogue text spoken by the NPC */
  text: string;
  /** Player response options */
  responses: DialogueResponse[];
  /** Whether this node ends the conversation */
  isTerminal: boolean;
  /** Emotional tone of the dialogue line */
  emotion: DialogueEmotion;
  /** Prerequisite flags that must be set to reach this node */
  requiredFlags: string[];
}

/** A player response option in a dialogue tree */
export interface DialogueResponse {
  /** Unique response identifier */
  id: string;
  /** Text displayed as the player's response */
  text: string;
  /** Next dialogue node ID */
  nextNodeId: string | null;
  /** Stat check required (if any) */
  statCheck: DialogueStatCheck | null;
  /** Flags set when this response is chosen */
  setsFlags: string[];
  /** Faction reputation changes */
  reputationChanges: DialogueReputationChange[];
}

/** A stat check attached to a dialogue response */
export interface DialogueStatCheck {
  /** Stat key to check */
  stat: keyof PlayerStats;
  /** Difficulty threshold */
  difficulty: number;
  /** Node ID on success */
  successNodeId: string;
  /** Node ID on failure */
  failureNodeId: string;
}

/** Reputation change from a dialogue choice */
export interface DialogueReputationChange {
  factionId: string;
  delta: number;
}

/** Emotional tone for dialogue lines */
export type DialogueEmotion =
  | 'neutral'
  | 'angry'
  | 'sad'
  | 'fearful'
  | 'joyful'
  | 'contemptuous'
  | 'pleading'
  | 'threatening'
  | 'sarcastic';

// ─── Quest ───────────────────────────────────────────────────────────────────

/** A quest the player can undertake */
export interface Quest {
  /** Unique quest identifier */
  id: string;
  /** Display title */
  title: string;
  /** Quest description/summary */
  description: string;
  /** Current quest state */
  status: QuestStatus;
  /** Ordered objectives to complete */
  objectives: QuestObjective[];
  /** Rewards granted on completion */
  rewards: QuestReward[];
  /** Chapter in which this quest is available */
  chapterId: string;
  /** NPC who gives the quest */
  questGiverId: string;
  /** Whether this is a main story quest or side quest */
  type: QuestType;
  /** Minimum player level recommended */
  recommendedLevel: number;
  /** Faction associated with this quest */
  factionId: string | null;
  /** Whether the quest has a time limit (in game turns) */
  timeLimitTurns: number | null;
}

/** Quest completion status */
export type QuestStatus = 'locked' | 'available' | 'active' | 'completed' | 'failed';

/** Type of quest */
export type QuestType = 'main' | 'side' | 'faction' | 'bounty';

/** A single objective within a quest */
export interface QuestObjective {
  /** Unique objective identifier */
  id: string;
  /** Description of what needs to be done */
  description: string;
  /** Whether this objective is complete */
  isComplete: boolean;
  /** Whether this objective is optional */
  isOptional: boolean;
  /** Target count for trackable objectives (e.g., "defeat 3 guards") */
  targetCount: number;
  /** Current progress count */
  currentCount: number;
}

/** Reward granted on quest completion */
export interface QuestReward {
  /** Type of reward */
  type: QuestRewardType;
  /** Target ID (item ID, ability ID, etc.) */
  targetId: string;
  /** Amount (XP amount, reputation delta, gold amount, etc.) */
  amount: number;
}

/** Types of quest rewards */
export type QuestRewardType = 'experience' | 'item' | 'gold' | 'reputation' | 'unlock' | 'ability';

// ─── Combat Encounter ────────────────────────────────────────────────────────

/** A combat encounter definition combining setup, enemies, and rewards */
export interface CombatEncounter {
  /** Unique encounter identifier */
  id: string;
  /** Display name of the encounter */
  name: string;
  /** Narrative description setting the scene */
  description: string;
  /** Type of encounter */
  type: CombatEncounterType;
  /** IDs of enemy entities in this encounter */
  enemyIds: string[];
  /** Experience rewarded on victory */
  experienceReward: number;
  /** Loot table entries */
  lootRewards: CombatLootReward[];
  /** Narrative text shown on victory */
  victoryText: string;
  /** Narrative text shown on defeat */
  defeatText: string;
  /** Whether the player can flee */
  canFlee: boolean;
  /** Chapter and scene context */
  chapterId: string;
  /** Location ID where this encounter occurs */
  locationId: string | null;
  /** Recommended player level */
  recommendedLevel: number;
  /** Environmental modifiers affecting the battle */
  environmentModifiers: EnvironmentModifier[];
}

/** Type of combat encounter */
export type CombatEncounterType = 'random' | 'scripted' | 'boss' | 'ambush' | 'duel';

/** Loot reward from a combat encounter */
export interface CombatLootReward {
  /** Item ID */
  itemId: string;
  /** Drop probability (0.0 to 1.0) */
  dropChance: number;
  /** Quantity range */
  minQuantity: number;
  maxQuantity: number;
}

/** Environmental modifier affecting combat */
export interface EnvironmentModifier {
  /** Modifier name */
  name: string;
  /** Description of the effect */
  description: string;
  /** Stat affected */
  affectedStat: string;
  /** Modifier value (positive = bonus, negative = penalty) */
  value: number;
}

// ─── Skill Tree & Skill Node ─────────────────────────────────────────────────

/** A skill tree grouping related abilities */
export interface SkillTree {
  /** Unique skill tree identifier */
  id: string;
  /** Display name (e.g., "Warfare", "Subterfuge", "Diplomacy") */
  name: string;
  /** Description of this skill tree's focus */
  description: string;
  /** All nodes in this tree */
  nodes: SkillNode[];
  /** Primary stat this tree scales with */
  primaryStat: keyof PlayerStats;
  /** Icon identifier for UI */
  icon: string;
  /** Theme color (CSS hex) */
  color: string;
}

/** A single node in a skill tree */
export interface SkillNode {
  /** Unique node identifier */
  id: string;
  /** Display name */
  name: string;
  /** Description of what this skill does */
  description: string;
  /** Skill tree this node belongs to */
  treeId: string;
  /** Tier/rank within the tree (0 = root, higher = deeper) */
  tier: number;
  /** Skill point cost to unlock */
  cost: number;
  /** Whether this node is currently unlocked */
  isUnlocked: boolean;
  /** Maximum number of times this skill can be ranked up */
  maxRank: number;
  /** Current rank (0 = not learned) */
  currentRank: number;
  /** Prerequisite node IDs that must be unlocked first */
  prerequisiteIds: string[];
  /** Type of bonus this skill provides */
  bonusType: SkillBonusType;
  /** Bonus value per rank */
  bonusPerRank: number;
  /** Position in the skill tree UI (for rendering) */
  position: { x: number; y: number };
}

/** Types of bonuses a skill node can provide */
export type SkillBonusType =
  | 'stat_increase'
  | 'damage_bonus'
  | 'defense_bonus'
  | 'ability_unlock'
  | 'passive_effect'
  | 'crafting_recipe'
  | 'dialogue_option';

// ─── Crafting Recipe ─────────────────────────────────────────────────────────

/** A recipe for crafting items */
export interface CraftingRecipe {
  /** Unique recipe identifier */
  id: string;
  /** Display name of the recipe */
  name: string;
  /** Description of what is crafted */
  description: string;
  /** Required ingredients */
  ingredients: CraftingIngredient[];
  /** Item ID of the crafted result */
  resultItemId: string;
  /** Number of items produced */
  resultQuantity: number;
  /** Crafting station type required */
  stationType: CraftingStationType;
  /** Minimum crafting skill level required */
  skillRequirement: number;
  /** Whether the recipe must be discovered/learned first */
  isHidden: boolean;
  /** Experience gained from crafting this recipe */
  craftingExperience: number;
  /** Crafting time in seconds (for UI animation) */
  craftTimeSeconds: number;
}

/** An ingredient required for a crafting recipe */
export interface CraftingIngredient {
  /** Item ID of the ingredient */
  itemId: string;
  /** Quantity required */
  quantity: number;
  /** Whether the ingredient is consumed during crafting */
  isConsumed: boolean;
}

/** Types of crafting stations */
export type CraftingStationType = 'forge' | 'alchemy_bench' | 'enchanting_table' | 'workbench' | 'cooking_fire';

// ─── Inventory ───────────────────────────────────────────────────────────────

/** The player's complete inventory */
export interface Inventory {
  /** All items in the inventory */
  items: InventoryItem[];
  /** Current gold amount */
  gold: number;
  /** Maximum number of item stacks */
  maxSlots: number;
  /** Currently equipped item IDs by slot */
  equipped: Record<string, string | null>;
  /** Weight capacity */
  maxWeight: number;
  /** Current total weight */
  currentWeight: number;
}

// ─── Player Save ─────────────────────────────────────────────────────────────

/** A complete player save file encompassing all persistent data */
export interface PlayerSave {
  /** Unique save identifier */
  id: string;
  /** Save file version for migration compatibility */
  version: string;
  /** Player-chosen character name */
  playerName: string;
  /** The full game state at time of save */
  gameState: GameState;
  /** Player's inventory snapshot */
  inventory: Inventory;
  /** Active and completed quests */
  quests: Quest[];
  /** Skill tree progress */
  skillTrees: SkillTree[];
  /** Known crafting recipes */
  knownRecipes: string[];
  /** Achievement IDs earned */
  achievements: string[];
  /** Total playtime in seconds */
  playtimeSeconds: number;
  /** Timestamp when saved (epoch ms) */
  savedAt: number;
  /** Save slot number */
  slotNumber: number;
  /** Whether this is an autosave */
  isAutosave: boolean;
  /** Screenshot data URI (if supported) */
  screenshotDataUrl: string | null;
  /** New Game+ cycle count */
  ngPlusCycle: number;
  /** Difficulty setting */
  difficulty: GameDifficulty;
}

// ─── Travel Event ────────────────────────────────────────────────────────────

/** An event that can occur while traveling between locations */
export interface TravelEvent {
  /** Unique event identifier */
  id: string;
  /** Display title */
  title: string;
  /** Narrative description of what happens */
  description: string;
  /** Type of travel event */
  type: TravelEventType;
  /** Probability of occurrence (0.0 to 1.0) */
  probability: number;
  /** Route this event can occur on (from location ID to location ID) */
  routeFrom: string;
  routeTo: string;
  /** Choices presented to the player */
  choices: TravelEventChoice[];
  /** Minimum player level for this event to trigger */
  minLevel: number;
  /** Maximum player level (event stops appearing) */
  maxLevel: number;
  /** Whether this event can only occur once */
  isOneTime: boolean;
  /** Required flags for this event to be eligible */
  requiredFlags: string[];
}

/** Types of travel events */
export type TravelEventType = 'ambush' | 'merchant' | 'discovery' | 'weather' | 'npc_encounter' | 'lore' | 'trap';

/** A choice within a travel event */
export interface TravelEventChoice {
  /** Choice identifier */
  id: string;
  /** Display text */
  text: string;
  /** Outcome description */
  outcomeText: string;
  /** Stat check (if any) */
  statCheck: { stat: keyof PlayerStats; difficulty: number } | null;
  /** Rewards/penalties */
  effects: TravelEventEffect[];
}

/** An effect from a travel event choice */
export interface TravelEventEffect {
  type: 'heal' | 'damage' | 'gold' | 'item' | 'reputation' | 'flag';
  value: number | string | boolean;
  targetId: string | null;
}

// ─── Combo Attack ────────────────────────────────────────────────────────────

/** A combination attack requiring specific conditions to execute */
export interface ComboAttack {
  /** Unique combo identifier */
  id: string;
  /** Display name */
  name: string;
  /** Description of the combo attack */
  description: string;
  /** Ability IDs that must be used in sequence to trigger this combo */
  requiredAbilitySequence: string[];
  /** Minimum stat values required to perform the combo */
  statRequirements: Partial<Record<keyof PlayerStats, number>>;
  /** Damage multiplier applied to the final hit */
  damageMultiplier: number;
  /** Additional effects applied on successful combo */
  bonusEffects: ComboEffect[];
  /** Cooldown in combat rounds after use */
  cooldownRounds: number;
  /** Narrative text displayed when combo is executed */
  flavorText: string;
  /** Visual effect identifier for UI animation */
  visualEffectId: string;
}

/** A bonus effect from a combo attack */
export interface ComboEffect {
  /** Effect type */
  type: 'stun' | 'bleed' | 'weaken' | 'heal_self' | 'buff_stat';
  /** Duration in rounds */
  duration: number;
  /** Effect potency/magnitude */
  potency: number;
}

// ─── Achievement ─────────────────────────────────────────────────────────────

/** A trackable achievement the player can earn */
export interface Achievement {
  /** Unique achievement identifier */
  id: string;
  /** Display title */
  title: string;
  /** Description of how to earn this achievement */
  description: string;
  /** Whether this achievement has been earned */
  isUnlocked: boolean;
  /** Timestamp when unlocked (null if locked) */
  unlockedAt: number | null;
  /** Category for UI grouping */
  category: AchievementCategory;
  /** Rarity/difficulty tier */
  tier: AchievementTier;
  /** Icon identifier for the UI */
  icon: string;
  /** Whether this achievement is hidden until earned */
  isSecret: boolean;
  /** Progress tracking (for progressive achievements) */
  progress: AchievementProgress | null;
  /** Reward granted when unlocked */
  reward: AchievementReward | null;
}

/** Achievement categories */
export type AchievementCategory =
  | 'story'
  | 'combat'
  | 'exploration'
  | 'social'
  | 'crafting'
  | 'collection'
  | 'challenge';

/** Achievement difficulty tiers */
export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum';

/** Progress tracking for incremental achievements */
export interface AchievementProgress {
  /** Current progress value */
  current: number;
  /** Target value to complete */
  target: number;
}

/** Reward for unlocking an achievement */
export interface AchievementReward {
  /** Reward type */
  type: 'title' | 'item' | 'cosmetic' | 'skill_point';
  /** Reward identifier */
  targetId: string;
  /** Display label for the reward */
  label: string;
}

// ─── Leaderboard Entry ───────────────────────────────────────────────────────

/** An entry on the game leaderboard */
export interface LeaderboardEntry {
  /** Unique entry identifier */
  id: string;
  /** Player display name */
  playerName: string;
  /** User ID (for authenticated players) */
  userId: string | null;
  /** Total score */
  score: number;
  /** Breakdown of how the score was calculated */
  scoreBreakdown: ScoreBreakdown;
  /** Which ending the player achieved */
  endingId: string;
  /** Difficulty setting */
  difficulty: GameDifficulty;
  /** New Game+ cycle */
  ngPlusCycle: number;
  /** Total playtime in seconds */
  playtimeSeconds: number;
  /** Number of chapters completed */
  chaptersCompleted: number;
  /** Number of achievements earned */
  achievementsEarned: number;
  /** Timestamp of submission */
  submittedAt: number;
  /** Player's chosen faction */
  factionId: string | null;
  /** Player level at end of game */
  finalLevel: number;
}

/** Score breakdown showing how the total was calculated */
export interface ScoreBreakdown {
  /** Points from story completion */
  storyPoints: number;
  /** Points from combat performance */
  combatPoints: number;
  /** Points from exploration */
  explorationPoints: number;
  /** Points from achievements */
  achievementPoints: number;
  /** Difficulty multiplier applied */
  difficultyMultiplier: number;
  /** NG+ bonus multiplier */
  ngPlusMultiplier: number;
  /** Speed bonus (lower playtime = higher) */
  speedBonus: number;
}

// ─── Image Asset ─────────────────────────────────────────────────────────────

/** Metadata for a game image asset */
export interface ImageAsset {
  /** Unique asset identifier */
  id: string;
  /** Display-friendly name */
  name: string;
  /** AI art generation prompt */
  prompt: string;
  /** URL or path to the generated image */
  url: string;
  /** Asset category */
  category: ImageAssetCategory;
  /** Image dimensions */
  width: number;
  height: number;
  /** Alt text for accessibility */
  altText: string;
  /** Associated entity ID (character, location, item, etc.) */
  entityId: string | null;
  /** Whether this asset has been generated */
  isGenerated: boolean;
  /** Fallback placeholder color (CSS hex) */
  placeholderColor: string;
}

/** Categories of image assets */
export type ImageAssetCategory =
  | 'character_portrait'
  | 'scene_illustration'
  | 'location_art'
  | 'item_icon'
  | 'faction_banner'
  | 'ending_art'
  | 'ui_element'
  | 'map_icon';

// ─── Ending ──────────────────────────────────────────────────────────────────

/** A game ending with full narrative and unlock criteria */
export interface Ending {
  /** Unique ending identifier */
  id: string;
  /** Display title */
  title: string;
  /** Short subtitle or tagline */
  subtitle: string;
  /** Full ending narrative text */
  description: string;
  /** Epilogue text describing the world's fate */
  epilogue: string;
  /** AI art prompt for the ending illustration */
  imagePrompt: string;
  /** Conditions that must be met to achieve this ending */
  requirements: EndingRequirement[];
  /** Priority for tie-breaking (higher = checked first) */
  priority: number;
  /** Faction most aligned with this ending */
  factionId: string | null;
  /** Whether this ending is hidden from the player until achieved */
  isSecret: boolean;
  /** Associated achievement ID */
  achievementId: string | null;
  /** Narrative tone of the ending */
  tone: EndingTone;
}

/** A requirement condition for an ending */
export interface EndingRequirement {
  /** Type of condition */
  type: 'faction_reputation' | 'flag' | 'character_alive' | 'quest_complete' | 'stat_minimum' | 'chapter_complete';
  /** Target identifier */
  target: string;
  /** Comparison operator */
  operator: '>=' | '<=' | '==' | '!=' | '>' | '<';
  /** Value to compare against */
  value: number | string | boolean;
}

/** Narrative tone classifications for endings */
export type EndingTone = 'triumphant' | 'bittersweet' | 'tragic' | 'ambiguous' | 'dark';
