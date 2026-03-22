/**
 * Master story data index.
 * Single import point for all narrative content.
 */

export { chapters, sceneIndex, getChapter, getScene, getSceneChapter } from './chapters';
export { endings } from './endings';
export { characters } from './characters';
export type {
  Chapter,
  Scene,
  SceneId,
  CharacterId,
  StatKey,
  Choice,
  Condition,
  Consequence,
  CombatEncounter,
  DialogueLine,
  Ending,
  StoryData,
} from './story-types';

import { chapters } from './chapters';
import { endings } from './endings';
import type { StoryData } from './story-types';

/** Complete story data bundle */
export const storyData: StoryData = {
  chapters,
  endings,
};
