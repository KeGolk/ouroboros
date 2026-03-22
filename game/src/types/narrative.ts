/**
 * Narrative Data Types for "Ashen Crown" - A Political Intrigue RPG
 *
 * The story follows a disgraced noble navigating the power vacuum after
 * the assassination of the High King of Valdris. Four factions vie for
 * control, and the player's choices determine which ending unfolds.
 */

// ─── Factions ───────────────────────────────────────────────────────
export type FactionId = 'iron_covenant' | 'verdant_court' | 'obsidian_circle' | 'ashen_throne';

export interface Faction {
  id: FactionId;
  name: string;
  motto: string;
  description: string;
  color: string; // hex for UI theming
  values: string[]; // what this faction prizes
  leader: string; // character ID of the faction leader
}

// ─── Characters ─────────────────────────────────────────────────────
export interface Character {
  id: string;
  name: string;
  title: string;
  faction: FactionId | 'unaligned';
  description: string;
  personality: string;
  imagePrompt: string; // AI art prompt for placeholder generation
  isRecruitable: boolean;
  baseRelationship: number; // -100 to 100 starting disposition
}

// ─── Stats & Checks ─────────────────────────────────────────────────
export type StatId = 'strength' | 'dexterity' | 'intelligence' | 'wisdom' | 'constitution' | 'charisma' | 'influence' | 'cunning' | 'diplomacy';

export interface StatCheck {
  stat: StatId;
  difficulty: number; // 1-20 scale
  successNode: string; // node ID on pass
  failureNode: string; // node ID on fail
  description: string; // what the player is attempting
}

// ─── Conditions for branching ───────────────────────────────────────
export interface Condition {
  type: 'faction_reputation' | 'character_alive' | 'item_possessed' | 'flag_set' | 'stat_minimum' | 'chapter_visited';
  target: string; // faction ID, character ID, item ID, flag name, stat ID, or chapter ID
  operator: '>=' | '<=' | '==' | '!=' | '>' | '<';
  value: number | string | boolean;
}

// ─── Consequences of choices ────────────────────────────────────────
export interface Consequence {
  type: 'faction_rep' | 'set_flag' | 'give_item' | 'remove_item' | 'modify_stat'
      | 'kill_character' | 'recruit_character' | 'unlock_ending' | 'set_relationship'
      | 'grant_xp' | 'trigger_combat';
  target: string;
  value: number | string | boolean;
  description?: string; // flavor text for the consequence
}

// ─── Story Nodes (the atomic unit of narrative) ─────────────────────
export interface StoryNode {
  id: string;
  chapterId: string;
  title: string;
  text: string; // the narrative prose shown to the player
  imagePrompt?: string; // scene illustration prompt
  speaker?: string; // character ID if this is dialogue
  choices: Choice[];
  statCheck?: StatCheck; // optional stat check before choices appear
  consequences?: Consequence[]; // automatic consequences when entering this node
  isEndNode?: boolean; // does this node end the chapter?
  isCombatNode?: boolean; // triggers combat encounter
  combatEncounterId?: string; // links to combat data
  conditions?: Condition[]; // conditions that must be met to reach this node
}

// ─── Player Choices ─────────────────────────────────────────────────
export interface Choice {
  id: string;
  text: string; // what the player sees
  tooltip?: string; // hover hint
  targetNode: string; // which node this leads to
  consequences?: Consequence[];
  conditions?: Condition[]; // conditions to show this choice
  statCheck?: StatCheck; // optional check tied to this specific choice
  isHidden?: boolean; // hidden until conditions met
}

// ─── Chapters ───────────────────────────────────────────────────────
export interface Chapter {
  id: string;
  number: number; // 1-10
  title: string;
  subtitle: string;
  description: string; // chapter summary
  imagePrompt: string;
  startNodeId: string; // entry point node
  nodes: StoryNode[];
  availableFactions: FactionId[]; // factions active in this chapter
  keyCharacters: string[]; // character IDs featured
  minLevel?: number; // recommended player level
  isBossChapter?: boolean;
  bossId?: string;
}

// ─── Endings ────────────────────────────────────────────────────────
export type EndingId = 'iron_dominion' | 'verdant_renewal' | 'obsidian_ascension'
                     | 'ashen_restoration' | 'shadow_throne' | 'exile_wanderer';

export interface Ending {
  id: EndingId;
  title: string;
  subtitle: string;
  description: string; // full ending narrative
  epilogue: string; // what happens after
  imagePrompt: string;
  requirements: Condition[]; // what must be true to unlock
  priority: number; // higher = checked first (for tiebreaking)
  faction?: FactionId; // associated faction, if any
  isSecret?: boolean;
  achievementId?: string;
}

// ─── Full Narrative Config ──────────────────────────────────────────
export interface NarrativeConfig {
  meta: {
    title: string;
    version: string;
    author: string;
    totalChapters: number;
    totalEndings: number;
  };
  factions: Record<FactionId, Faction>;
  characters: Record<string, Character>;
  chapters: Chapter[];
  endings: Ending[];
  flags: Record<string, { description: string; default: boolean }>;
  items: Record<string, { name: string; description: string; imagePrompt: string; type: 'quest' | 'consumable' | 'equipment' | 'key' }>;
}
