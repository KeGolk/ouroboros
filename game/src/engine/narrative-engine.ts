/**
 * NarrativeEngine — Core engine for the branching narrative RPG.
 *
 * Responsibilities:
 * - Track player choices across chapters
 * - Evaluate branching conditions
 * - Apply effects from choices
 * - Resolve stat checks and combat
 * - Determine which ending path the player reaches
 * - Navigate between scenes and chapters
 */

import type {
  StoryData,
  GameState,
  Chapter,
  Scene,
  Choice,
  Effect,
  PlayerStats,
  FactionStanding,
  ChoiceRecord,
  Ending,
} from './types';
import { evaluateCondition, evaluateConditions, filterAvailableChoices } from './conditions';
import { applyEffects } from './effects';
import { resolveEnding, evaluateEndings, getDominantFaction } from './endings';

// ─── Default State Factory ──────────────────────────────────────────────────

export function createDefaultStats(): PlayerStats {
  return {
    strength: 10,
    dexterity: 10,
    intelligence: 10,
    wisdom: 10,
    constitution: 10,
    charisma: 10,
    influence: 0,
    cunning: 10,
    diplomacy: 0,
  };
}

export function createDefaultFactions(): FactionStanding {
  return {
    iron_throne: 0,
    shadow_guild: 0,
    peoples_front: 0,
    old_faith: 0,
  };
}

export function createNewGameState(
  playerName: string,
  startChapterId: string,
  startSceneId: string,
  ngPlusCycle: number = 0
): GameState {
  return {
    saveId: generateSaveId(),
    playerName,
    currentChapterId: startChapterId,
    currentSceneId: startSceneId,
    stats: createDefaultStats(),
    factions: createDefaultFactions(),
    flags: {},
    choiceHistory: [],
    deadCharacters: [],
    unlocks: [],
    completedChapters: [],
    savedAt: Date.now(),
    ngPlusCycle,
    achievements: [],
    playtimeSeconds: 0,
  };
}

function generateSaveId(): string {
  return `save_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Narrative Engine ───────────────────────────────────────────────────────

export interface EngineEvent {
  type: 'scene_enter' | 'choice_made' | 'stat_check' | 'combat' | 'chapter_complete' | 'ending_reached' | 'chapter_enter' | 'faction_change' | 'character_death';
  data: Record<string, unknown>;
}

export type EngineEventListener = (event: EngineEvent) => void;

export class NarrativeEngine {
  private storyData: StoryData;
  private state: GameState;
  private chapterMap: Map<string, Chapter>;
  private listeners: EngineEventListener[] = [];

  constructor(storyData: StoryData, state: GameState) {
    this.storyData = storyData;
    this.state = state;

    // Build chapter lookup map
    this.chapterMap = new Map();
    for (const chapter of storyData.chapters) {
      this.chapterMap.set(chapter.id, chapter);
    }
  }

  // ─── State Access ───────────────────────────────────────────────────────

  getState(): GameState {
    return { ...this.state };
  }

  getStateRef(): Readonly<GameState> {
    return this.state;
  }

  /** Replace the entire state (e.g., after loading a save) */
  setState(state: GameState): void {
    this.state = state;
  }

  // ─── Event System ─────────────────────────────────────────────────────

  addEventListener(listener: EngineEventListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private emit(event: EngineEvent): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }

  // ─── Scene Navigation ────────────────────────────────────────────────

  getCurrentChapter(): Chapter | null {
    return this.chapterMap.get(this.state.currentChapterId) ?? null;
  }

  getCurrentScene(): Scene | null {
    const chapter = this.getCurrentChapter();
    if (!chapter) return null;
    return chapter.scenes[this.state.currentSceneId] ?? null;
  }

  /**
   * Get available choices for the current scene,
   * filtered by conditions.
   */
  getAvailableChoices(): Choice[] {
    const scene = this.getCurrentScene();
    if (!scene) return [];
    return filterAvailableChoices(scene.choices, this.state);
  }

  /**
   * Navigate to a specific scene within the current chapter.
   * Applies onEnterEffects.
   */
  enterScene(sceneId: string): Scene | null {
    const chapter = this.getCurrentChapter();
    if (!chapter) return null;

    const scene = chapter.scenes[sceneId];
    if (!scene) return null;

    this.state = {
      ...this.state,
      currentSceneId: sceneId,
    };

    // Apply on-enter effects
    if (scene.onEnterEffects && scene.onEnterEffects.length > 0) {
      this.state = applyEffects(this.state, scene.onEnterEffects);
    }

    this.emit({
      type: 'scene_enter',
      data: { chapterId: this.state.currentChapterId, sceneId },
    });

    return scene;
  }

  /**
   * Navigate to a scene, potentially in a different chapter.
   * Format: "chapterId:sceneId" or just "sceneId" for current chapter.
   */
  navigateTo(target: string): Scene | null {
    if (target.includes(':')) {
      const [chapterId, sceneId] = target.split(':');
      return this.enterChapter(chapterId, sceneId);
    }
    return this.enterScene(target);
  }

  /**
   * Enter a new chapter.
   */
  enterChapter(chapterId: string, sceneId?: string): Scene | null {
    const chapter = this.chapterMap.get(chapterId);
    if (!chapter) return null;

    // Check unlock conditions
    if (chapter.unlockConditions && chapter.unlockConditions.length > 0) {
      if (!evaluateConditions(chapter.unlockConditions, this.state)) {
        return null; // Chapter is locked
      }
    }

    const previousChapterId = this.state.currentChapterId;

    this.state = {
      ...this.state,
      currentChapterId: chapterId,
      currentSceneId: sceneId ?? chapter.entrySceneId,
    };

    const scene = this.getCurrentScene();
    if (scene?.onEnterEffects) {
      this.state = applyEffects(this.state, scene.onEnterEffects);
    }

    // Emit chapter_enter if this is a new chapter transition
    if (previousChapterId !== chapterId) {
      this.emit({
        type: 'chapter_enter',
        data: {
          chapterId,
          previousChapterId,
          sceneId: this.state.currentSceneId,
        },
      });
    }

    this.emit({
      type: 'scene_enter',
      data: { chapterId, sceneId: this.state.currentSceneId },
    });

    return scene;
  }

  /**
   * Mark the current chapter as completed.
   */
  completeCurrentChapter(): void {
    const chapterId = this.state.currentChapterId;
    if (!this.state.completedChapters.includes(chapterId)) {
      this.state = {
        ...this.state,
        completedChapters: [...this.state.completedChapters, chapterId],
      };
      this.emit({
        type: 'chapter_complete',
        data: { chapterId },
      });
    }
  }

  // ─── Choice Processing ───────────────────────────────────────────────

  /**
   * Process a player choice.
   * - Records the choice in history
   * - Applies effects
   * - Handles stat checks if present
   * - Navigates to the next scene
   *
   * Returns the resulting scene.
   */
  makeChoice(choiceId: string): {
    scene: Scene | null;
    statCheckResult?: { success: boolean; roll: number; difficulty: number };
    combatResult?: { victory: boolean; playerRoll: number; enemyRoll: number };
  } {
    const currentScene = this.getCurrentScene();
    if (!currentScene) return { scene: null };

    const choice = currentScene.choices.find(c => c.id === choiceId);
    if (!choice) return { scene: null };

    // Verify conditions are met
    if (choice.conditions && choice.conditions.length > 0) {
      if (!evaluateConditions(choice.conditions, this.state)) {
        return { scene: null }; // Choice not available
      }
    }

    // Record the choice
    const record: ChoiceRecord = {
      chapterId: this.state.currentChapterId,
      sceneId: this.state.currentSceneId,
      choiceId: choice.id,
      timestamp: Date.now(),
    };
    this.state = {
      ...this.state,
      choiceHistory: [...this.state.choiceHistory, record],
    };

    // Snapshot factions before applying effects (for change detection)
    const previousFactions = { ...this.state.factions };
    const previousDeadCharacters = [...this.state.deadCharacters];

    // Apply choice effects
    if (choice.effects.length > 0) {
      this.state = applyEffects(this.state, choice.effects);
    }

    this.emit({
      type: 'choice_made',
      data: {
        choiceId,
        chapterId: this.state.currentChapterId,
        effects: choice.effects,
        effectCount: choice.effects.length,
      },
    });

    // Emit faction_change events for any factions that changed
    for (const factionId of Object.keys(this.state.factions) as Array<keyof typeof this.state.factions>) {
      const delta = this.state.factions[factionId] - previousFactions[factionId];
      if (delta !== 0) {
        this.emit({
          type: 'faction_change',
          data: {
            faction: factionId,
            previousValue: previousFactions[factionId],
            newValue: this.state.factions[factionId],
            delta,
          },
        });
      }
    }

    // Emit character_death events for newly dead characters
    const newlyDead = this.state.deadCharacters.filter(
      c => !previousDeadCharacters.includes(c)
    );
    for (const characterId of newlyDead) {
      this.emit({
        type: 'character_death',
        data: { characterId, choiceId },
      });
    }

    // Handle stat check
    if (choice.statCheck) {
      const result = this.resolveStatCheck(
        choice.statCheck.stat,
        choice.statCheck.difficulty
      );

      if (result.success) {
        if (choice.statCheck.successEffects) {
          this.state = applyEffects(this.state, choice.statCheck.successEffects);
        }
        const scene = this.navigateTo(choice.statCheck.successSceneId);
        return { scene, statCheckResult: result };
      } else {
        if (choice.statCheck.failureEffects) {
          this.state = applyEffects(this.state, choice.statCheck.failureEffects);
        }
        const scene = this.navigateTo(choice.statCheck.failureSceneId);
        return { scene, statCheckResult: result };
      }
    }

    // Navigate to next scene
    const nextScene = this.navigateTo(choice.nextSceneId);

    // Handle combat scene
    if (nextScene?.isCombat && nextScene.combat) {
      const combatResult = this.resolveCombat(nextScene.combat);
      return { scene: nextScene, combatResult };
    }

    return { scene: nextScene };
  }

  // ─── Stat Checks ─────────────────────────────────────────────────────

  /**
   * Resolve a stat check.
   * Uses a deterministic-ish system: stat value + random modifier vs difficulty.
   */
  resolveStatCheck(
    stat: keyof PlayerStats,
    difficulty: number,
    randomSeed?: number
  ): { success: boolean; roll: number; difficulty: number } {
    const statValue = this.state.stats[stat];
    // Roll: stat value + random 1-20 modifier
    const random = randomSeed ?? (Math.floor(Math.random() * 20) + 1);
    const roll = statValue + random;

    this.emit({
      type: 'stat_check',
      data: { stat, statValue, roll, difficulty, success: roll >= difficulty },
    });

    return {
      success: roll >= difficulty,
      roll,
      difficulty,
    };
  }

  // ─── Combat ───────────────────────────────────────────────────────────

  /**
   * Resolve a combat encounter.
   */
  resolveCombat(
    combat: NonNullable<Scene['combat']>,
    playerSeed?: number,
    enemySeed?: number
  ): { victory: boolean; playerRoll: number; enemyRoll: number } {
    const playerStat = this.state.stats[combat.playerStatUsed];
    const playerRandom = playerSeed ?? (Math.floor(Math.random() * 20) + 1);
    const enemyRandom = enemySeed ?? (Math.floor(Math.random() * 20) + 1);

    const playerRoll = playerStat + playerRandom;
    const enemyRoll = combat.enemyStrength + enemyRandom;

    const victory = playerRoll >= enemyRoll;

    if (victory && combat.victoryEffects) {
      this.state = applyEffects(this.state, combat.victoryEffects);
    } else if (!victory && combat.defeatEffects) {
      this.state = applyEffects(this.state, combat.defeatEffects);
    }

    // Navigate to result scene
    this.navigateTo(victory ? combat.victorySceneId : combat.defeatSceneId);

    this.emit({
      type: 'combat',
      data: {
        enemyName: combat.enemyName,
        playerRoll,
        enemyRoll,
        victory,
      },
    });

    return { victory, playerRoll, enemyRoll };
  }

  // ─── Ending Resolution ───────────────────────────────────────────────

  /**
   * Check if the player has reached an ending.
   * Called after completing the final chapter.
   */
  checkForEnding(): Ending | null {
    return resolveEnding(this.storyData.endings, this.state);
  }

  /**
   * Get all qualifying endings ranked by score.
   */
  getQualifyingEndings() {
    return evaluateEndings(this.storyData.endings, this.state);
  }

  /**
   * Get the player's dominant faction.
   */
  getDominantFaction() {
    return getDominantFaction(this.state.factions);
  }

  // ─── Chapter Access ───────────────────────────────────────────────────

  /**
   * Get all unlocked chapters.
   */
  getUnlockedChapters(): Chapter[] {
    return this.storyData.chapters.filter(chapter => {
      if (!chapter.unlockConditions || chapter.unlockConditions.length === 0) {
        return true;
      }
      return evaluateConditions(chapter.unlockConditions, this.state);
    });
  }

  /**
   * Check if a specific chapter is unlocked.
   */
  isChapterUnlocked(chapterId: string): boolean {
    const chapter = this.chapterMap.get(chapterId);
    if (!chapter) return false;
    if (!chapter.unlockConditions || chapter.unlockConditions.length === 0) {
      return true;
    }
    return evaluateConditions(chapter.unlockConditions, this.state);
  }

  // ─── Analytics / Debug ────────────────────────────────────────────────

  /**
   * Get a summary of the player's journey so far.
   */
  getJourneySummary(): {
    chaptersCompleted: number;
    totalChapters: number;
    choicesMade: number;
    dominantFaction: { faction: string; standing: number };
    deadCharacters: string[];
    flagsSet: string[];
  } {
    return {
      chaptersCompleted: this.state.completedChapters.length,
      totalChapters: this.storyData.chapters.length,
      choicesMade: this.state.choiceHistory.length,
      dominantFaction: getDominantFaction(this.state.factions),
      deadCharacters: [...this.state.deadCharacters],
      flagsSet: Object.entries(this.state.flags)
        .filter(([, v]) => v)
        .map(([k]) => k),
    };
  }

  /**
   * Get choice statistics: how many times each faction-aligned choice was made.
   */
  getChoiceStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    for (const record of this.state.choiceHistory) {
      const key = `${record.chapterId}/${record.choiceId}`;
      stats[key] = (stats[key] || 0) + 1;
    }
    return stats;
  }

  // ─── Achievements ─────────────────────────────────────────────────────

  /**
   * Award an achievement if not already earned.
   */
  awardAchievement(achievementId: string): boolean {
    if (this.state.achievements.includes(achievementId)) {
      return false; // Already earned
    }
    this.state = {
      ...this.state,
      achievements: [...this.state.achievements, achievementId],
    };
    return true;
  }

  // ─── New Game+ ────────────────────────────────────────────────────────

  /**
   * Create a New Game+ state, preserving achievements and some bonuses.
   */
  createNewGamePlus(): GameState {
    const firstChapter = this.storyData.chapters[0];
    return {
      ...createNewGameState(
        this.state.playerName,
        firstChapter.id,
        firstChapter.entrySceneId,
        this.state.ngPlusCycle + 1
      ),
      achievements: [...this.state.achievements],
      // NG+ bonus: slightly higher starting stats
      stats: {
        strength: 12 + this.state.ngPlusCycle,
        dexterity: 12 + this.state.ngPlusCycle,
        intelligence: 12 + this.state.ngPlusCycle,
        wisdom: 12 + this.state.ngPlusCycle,
        constitution: 12 + this.state.ngPlusCycle,
        charisma: 12 + this.state.ngPlusCycle,
        influence: 0,
        cunning: 12 + this.state.ngPlusCycle,
        diplomacy: 0,
      },
    };
  }
}
