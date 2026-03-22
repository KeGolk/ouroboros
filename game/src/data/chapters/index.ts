/**
 * Central index for all chapter data.
 * Import this to access the complete story content.
 */

import { chapter1 } from './chapter1';
import { chapter2 } from './chapter2';
import { chapter3 } from './chapter3';
import { chapter4 } from './chapter4';
import { chapter5 } from './chapter5';
import { chapter6 } from './chapter6';
import { chapter7 } from './chapter7';
import { chapter8 } from './chapter8';
import { chapter9 } from './chapter9';
import { chapter10 } from './chapter10';

import type { Chapter, Scene, SceneId } from '../story-types';

/** All chapters in order */
export const chapters: Chapter[] = [
  chapter1,
  chapter2,
  chapter3,
  chapter4,
  chapter5,
  chapter6,
  chapter7,
  chapter8,
  chapter9,
  chapter10,
];

/** Flat map of all scenes by ID for quick lookup */
export const sceneIndex: Record<SceneId, Scene> = {};

for (const chapter of chapters) {
  for (const scene of chapter.scenes) {
    sceneIndex[scene.id] = scene;
  }
}

/** Get a chapter by number (1-indexed) */
export function getChapter(num: number): Chapter | undefined {
  return chapters[num - 1];
}

/** Get a scene by ID from any chapter */
export function getScene(sceneId: SceneId): Scene | undefined {
  return sceneIndex[sceneId];
}

/** Get the chapter number a scene belongs to */
export function getSceneChapter(sceneId: SceneId): number | undefined {
  return sceneIndex[sceneId]?.chapter;
}

export {
  chapter1,
  chapter2,
  chapter3,
  chapter4,
  chapter5,
  chapter6,
  chapter7,
  chapter8,
  chapter9,
  chapter10,
};
