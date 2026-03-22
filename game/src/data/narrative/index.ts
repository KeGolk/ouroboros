/**
 * Narrative Configuration Index
 *
 * "Ashen Crown" — A Political Intrigue RPG
 *
 * This file assembles the complete narrative configuration from all data modules.
 * It serves as the single import point for the game engine.
 */

import { NarrativeConfig } from '../../types/narrative';
import { factions } from './factions';
import { characters } from './characters';
import { items, flags } from './items';
import { endings } from './endings';

import chapter01 from './chapters/chapter01';
import chapter02 from './chapters/chapter02';
import chapter03 from './chapters/chapter03';
import chapter04 from './chapters/chapter04';
import chapter05 from './chapters/chapter05';
import chapter06 from './chapters/chapter06';
import chapter07 from './chapters/chapter07';
import chapter08 from './chapters/chapter08';
import chapter09 from './chapters/chapter09';
import chapter10 from './chapters/chapter10';

export const narrativeConfig: NarrativeConfig = {
  meta: {
    title: 'Ashen Crown',
    version: '1.0.0',
    author: 'Ouroboros Studio',
    totalChapters: 10,
    totalEndings: 6,
  },
  factions,
  characters,
  chapters: [
    chapter01,
    chapter02,
    chapter03,
    chapter04,
    chapter05,
    chapter06,
    chapter07,
    chapter08,
    chapter09,
    chapter10,
  ],
  endings,
  flags,
  items,
};

// ─── Utility exports for engine consumption ─────────────────────────

/** Get a chapter by its ID */
export function getChapter(chapterId: string) {
  return narrativeConfig.chapters.find((ch) => ch.id === chapterId);
}

/** Get a chapter by its number (1-10) */
export function getChapterByNumber(num: number) {
  return narrativeConfig.chapters.find((ch) => ch.number === num);
}

/** Get a specific story node by ID across all chapters */
export function getNode(nodeId: string) {
  for (const chapter of narrativeConfig.chapters) {
    const node = chapter.nodes.find((n) => n.id === nodeId);
    if (node) return node;
  }
  return undefined;
}

/** Get a character by ID */
export function getCharacter(characterId: string) {
  return narrativeConfig.characters[characterId];
}

/** Get a faction by ID */
export function getFaction(factionId: string) {
  return narrativeConfig.factions[factionId as keyof typeof narrativeConfig.factions];
}

/** Get all endings sorted by priority (highest first) */
export function getEndingsByPriority() {
  return [...narrativeConfig.endings].sort((a, b) => b.priority - a.priority);
}

/** Get total node count across all chapters */
export function getTotalNodeCount() {
  return narrativeConfig.chapters.reduce((sum, ch) => sum + ch.nodes.length, 0);
}

/** Get total choice count across all nodes */
export function getTotalChoiceCount() {
  return narrativeConfig.chapters.reduce(
    (sum, ch) => sum + ch.nodes.reduce((nSum, n) => nSum + n.choices.length, 0),
    0
  );
}

// ─── Narrative statistics (for debugging/display) ───────────────────

export const narrativeStats = {
  chapters: narrativeConfig.chapters.length,
  nodes: getTotalNodeCount(),
  choices: getTotalChoiceCount(),
  characters: Object.keys(narrativeConfig.characters).length,
  factions: Object.keys(narrativeConfig.factions).length,
  endings: narrativeConfig.endings.length,
  items: Object.keys(narrativeConfig.items).length,
  flags: Object.keys(narrativeConfig.flags).length,
};

export default narrativeConfig;
