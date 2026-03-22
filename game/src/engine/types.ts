/**
 * Core types for the narrative engine.
 * Defines all data structures for chapters, choices, conditions, and endings.
 */

// ─── Factions ────────────────────────────────────────────────────────────────

export type FactionId = 'iron_throne' | 'shadow_guild' | 'peoples_front' | 'old_faith';

export interface FactionStanding {
  iron_throne: number;   // -100 to 100
  shadow_guild: number;
  peoples_front: number;
  old_faith: number;
}

// ─── Character Stats (RPG) ──────────────────────────────────────────────────

export interface PlayerStats {
  /** STR — Raw physical power, melee damage, intimidation */
  strength: number;
  /** DEX — Agility, reflexes, evasion, ranged accuracy */
  dexterity: number;
  /** INT — Arcane knowledge, tactical acumen, lore mastery */
  intelligence: number;
  /** WIS — Perception, willpower, mystical insight */
  wisdom: number;
  /** CON — Endurance, resilience, health pool */
  constitution: number;
  /** CHA — Force of personality, leadership, morale */
  charisma: number;
  /** Influence — Political sway, reputation leverage, court power */
  influence: number;
  /** Cunning — Deception, scheming, subterfuge */
  cunning: number;
  /** Diplomacy — Negotiation, alliance-building, conflict resolution */
  diplomacy: number;
}

// ─── Conditions ─────────────────────────────────────────────────────────────

export type ComparisonOp = 'gte' | 'lte' | 'gt' | 'lt' | 'eq' | 'neq';

export interface StatCondition {
  type: 'stat';
  stat: keyof PlayerStats;
  op: ComparisonOp;
  value: number;
}

export interface FactionCondition {
  type: 'faction';
  faction: FactionId;
  op: ComparisonOp;
  value: number;
}

export interface FlagCondition {
  type: 'flag';
  flag: string;
  value: boolean;
}

export interface ChoiceCountCondition {
  type: 'choice_count';
  /** Pattern to match choice IDs (supports * wildcard) */
  pattern: string;
  op: ComparisonOp;
  value: number;
}

export interface ChapterCompletedCondition {
  type: 'chapter_completed';
  chapterId: string;
}

export interface CharacterAliveCondition {
  type: 'character_alive';
  characterId: string;
  alive: boolean;
}

export interface CompositeCondition {
  type: 'and' | 'or';
  conditions: Condition[];
}

export interface NotCondition {
  type: 'not';
  condition: Condition;
}

export type Condition =
  | StatCondition
  | FactionCondition
  | FlagCondition
  | ChoiceCountCondition
  | ChapterCompletedCondition
  | CharacterAliveCondition
  | CompositeCondition
  | NotCondition;

// ─── Effects (what happens when a choice is made) ───────────────────────────

export interface StatEffect {
  type: 'stat';
  stat: keyof PlayerStats;
  delta: number;
}

export interface FactionEffect {
  type: 'faction';
  faction: FactionId;
  delta: number;
}

export interface FlagEffect {
  type: 'flag';
  flag: string;
  value: boolean;
}

export interface CharacterDeathEffect {
  type: 'character_death';
  characterId: string;
}

export interface UnlockEffect {
  type: 'unlock';
  /** Unlock an item, ability, or chapter */
  target: string;
}

export type Effect =
  | StatEffect
  | FactionEffect
  | FlagEffect
  | CharacterDeathEffect
  | UnlockEffect;

// ─── Choices ────────────────────────────────────────────────────────────────

export interface Choice {
  id: string;
  text: string;
  /** Optional tooltip/flavor text */
  tooltip?: string;
  /** Conditions that must be met to show this choice */
  conditions?: Condition[];
  /** Effects applied when this choice is selected */
  effects: Effect[];
  /** The next scene to navigate to */
  nextSceneId: string;
  /** Stat check: if present, player rolls against this */
  statCheck?: {
    stat: keyof PlayerStats;
    difficulty: number;
    successSceneId: string;
    failureSceneId: string;
    /** Effects on success vs failure */
    successEffects?: Effect[];
    failureEffects?: Effect[];
  };
}

// ─── Scenes ─────────────────────────────────────────────────────────────────

export interface Scene {
  id: string;
  /** Narrative text displayed to the player */
  text: string;
  /** Character speaking/present (if any) */
  speakerId?: string;
  /** AI image prompt description for placeholder */
  imagePrompt?: string;
  /** Choices available in this scene */
  choices: Choice[];
  /** Auto-applied effects when entering this scene */
  onEnterEffects?: Effect[];
  /** Is this scene a combat encounter? */
  isCombat?: boolean;
  /** Combat configuration */
  combat?: {
    enemyName: string;
    enemyStrength: number;
    playerStatUsed: keyof PlayerStats;
    victorySceneId: string;
    defeatSceneId: string;
    victoryEffects?: Effect[];
    defeatEffects?: Effect[];
  };
}

// ─── Chapters ───────────────────────────────────────────────────────────────

export interface Chapter {
  id: string;
  number: number;
  title: string;
  description: string;
  /** The first scene in this chapter */
  entrySceneId: string;
  /** All scenes in this chapter */
  scenes: Record<string, Scene>;
  /** Conditions to unlock this chapter */
  unlockConditions?: Condition[];
  /** Chapter-level image prompt */
  imagePrompt?: string;
}

// ─── Endings ────────────────────────────────────────────────────────────────

export interface Ending {
  id: string;
  title: string;
  description: string;
  /** Epilogue text */
  epilogueText: string;
  /** Conditions that determine if this ending is reached */
  conditions: Condition[];
  /** Priority for tie-breaking when multiple endings qualify */
  priority: number;
  /** Which faction benefits most from this ending */
  dominantFaction?: FactionId;
  /** Image prompt for the ending screen */
  imagePrompt?: string;
  /** Is this a "good" ending, "bad", or "neutral"? */
  tone: 'triumphant' | 'bittersweet' | 'tragic' | 'ambiguous' | 'dark';
}

// ─── Game State ─────────────────────────────────────────────────────────────

export interface ChoiceRecord {
  chapterId: string;
  sceneId: string;
  choiceId: string;
  timestamp: number;
}

export interface GameState {
  /** Unique save ID */
  saveId: string;
  /** Player name */
  playerName: string;
  /** Current chapter */
  currentChapterId: string;
  /** Current scene within the chapter */
  currentSceneId: string;
  /** Player stats */
  stats: PlayerStats;
  /** Faction standings */
  factions: FactionStanding;
  /** Boolean flags tracking story state */
  flags: Record<string, boolean>;
  /** All choices made so far */
  choiceHistory: ChoiceRecord[];
  /** Characters that have died */
  deadCharacters: string[];
  /** Unlocked items/abilities/chapters */
  unlocks: string[];
  /** Chapters completed */
  completedChapters: string[];
  /** Timestamp of save */
  savedAt: number;
  /** New Game+ cycle count */
  ngPlusCycle: number;
  /** Achievements earned */
  achievements: string[];
  /** Total playtime in seconds */
  playtimeSeconds: number;
  /** Current location on the world map */
  currentLocationId?: string;
  /** Serialized map state for save/load (optional — stored separately in MapState) */
  mapStateSnapshot?: Record<string, unknown>;
}

// ─── Story Data (entire game content) ───────────────────────────────────────

export interface StoryData {
  chapters: Chapter[];
  endings: Ending[];
  characters: CharacterDef[];
}

export interface CharacterDef {
  id: string;
  name: string;
  title: string;
  faction: FactionId;
  description: string;
  imagePrompt?: string;
  /** Personality traits that affect dialogue */
  traits: string[];
}
