/**
 * Type definitions for the branching narrative story system.
 * All story content is structured as typed data for engine consumption.
 */

import type { FactionId } from '../types/factions';

/** Unique scene identifier in format "chN_sceneSlug" */
export type SceneId = string;

/** Unique character identifier */
export type CharacterId = string;

/** Stat keys used in skill checks */
export type StatKey = 'strength' | 'cunning' | 'charisma' | 'lore' | 'subtlety';

/** Condition types for branching logic */
export interface Condition {
  type: 'stat_check' | 'faction_reputation' | 'has_item' | 'flag_set' | 'choice_made' | 'companion_present';
  stat?: StatKey;
  factionId?: FactionId;
  itemId?: string;
  flagId?: string;
  choiceId?: string;
  companionId?: CharacterId;
  operator: 'gte' | 'lte' | 'eq' | 'gt' | 'lt' | 'true' | 'false';
  value?: number | string | boolean;
}

/** Consequence applied when a choice is made */
export interface Consequence {
  type: 'stat_change' | 'faction_change' | 'set_flag' | 'add_item' | 'remove_item' | 'add_companion' | 'remove_companion' | 'damage' | 'heal';
  stat?: StatKey;
  factionId?: FactionId;
  itemId?: string;
  flagId?: string;
  companionId?: CharacterId;
  value?: number | string | boolean;
}

/** A combat encounter embedded in a scene */
export interface CombatEncounter {
  type: 'minor' | 'boss';
  enemyName: string;
  enemyDescription: string;
  /** Stat used for the primary check */
  primaryStat: StatKey;
  /** Difficulty threshold (player stat must meet or exceed) */
  difficulty: number;
  /** Optional secondary stat for bonus damage / advantage */
  secondaryStat?: StatKey;
  /** Consequences on victory */
  victoryConsequences: Consequence[];
  /** Scene to go to on victory */
  victoryScene: SceneId;
  /** Consequences on defeat */
  defeatConsequences: Consequence[];
  /** Scene to go to on defeat */
  defeatScene: SceneId;
  /** Flavor text for the encounter */
  description: string;
}

/** A single dialogue line */
export interface DialogueLine {
  speaker: CharacterId | 'narrator';
  text: string;
  /** Optional mood/emotion tag for UI styling */
  mood?: 'neutral' | 'angry' | 'sad' | 'fearful' | 'hopeful' | 'sinister' | 'triumphant' | 'desperate';
}

/** A choice the player can make */
export interface Choice {
  id: string;
  text: string;
  /** Tooltip hint shown on hover */
  tooltip?: string;
  /** Conditions that must be met for this choice to appear */
  conditions?: Condition[];
  /** What stat check is required (if any) */
  statCheck?: {
    stat: StatKey;
    difficulty: number;
    /** Text shown on success */
    successText: string;
    /** Text shown on failure */
    failureText: string;
    /** Scene on success (overrides targetScene) */
    successScene?: SceneId;
    /** Scene on failure */
    failureScene?: SceneId;
  };
  /** Consequences of making this choice */
  consequences: Consequence[];
  /** The next scene to navigate to */
  targetScene: SceneId;
}

/** A single scene in the story */
export interface Scene {
  id: SceneId;
  /** Chapter this scene belongs to */
  chapter: number;
  /** Display title for the scene */
  title: string;
  /** Location name shown in the UI */
  location: string;
  /** AI art prompt for this scene's background */
  artPrompt: string;
  /** Narrative description paragraphs */
  description: string[];
  /** Dialogue lines played in sequence */
  dialogue: DialogueLine[];
  /** Optional combat encounter */
  combat?: CombatEncounter;
  /** Player choices at the end of this scene */
  choices: Choice[];
  /** Flags/conditions to check for variant text */
  variants?: {
    condition: Condition;
    /** Override description paragraphs */
    description?: string[];
    /** Override/additional dialogue */
    dialogue?: DialogueLine[];
  }[];
}

/** A complete chapter */
export interface Chapter {
  number: number;
  title: string;
  subtitle: string;
  /** Opening narration shown before the first scene */
  openingNarration: string;
  /** AI art prompt for the chapter title card */
  artPrompt: string;
  /** All scenes in this chapter */
  scenes: Scene[];
  /** The first scene ID to play */
  entryScene: SceneId;
}

/** An ending narrative */
export interface Ending {
  id: string;
  title: string;
  subtitle: string;
  /** Which faction(s) primarily benefit */
  primaryFaction?: FactionId;
  /** Conditions required to reach this ending */
  conditions: Condition[];
  /** Narration paragraphs for the ending */
  narration: string[];
  /** Epilogue sections for different aspects of the world */
  epilogues: {
    title: string;
    text: string;
  }[];
  /** AI art prompt for the ending illustration */
  artPrompt: string;
  /** Unlocks for New Game+ */
  unlocks?: string[];
}

/** The complete story data structure */
export interface StoryData {
  chapters: Chapter[];
  endings: Ending[];
}
