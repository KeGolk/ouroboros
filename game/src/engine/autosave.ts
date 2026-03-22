/**
 * Autosave Manager — Triggers autosaves at key narrative moments.
 *
 * Autosave triggers:
 * 1. Chapter transitions (entering a new chapter)
 * 2. Major decisions (choices with significant effects)
 * 3. Faction standing changes (crossing tier thresholds)
 * 4. Character deaths
 * 5. Combat resolution
 * 6. Chapter completion
 *
 * Debounces rapid triggers to avoid excessive saves.
 * Uses the saveService for the actual save operation.
 */

import type { GameState, Effect, FactionId } from './types';
import type { EngineEvent } from './narrative-engine';
import { triggerAutosave } from '../services/saveService';

// ─── Types ──────────────────────────────────────────────────────────────────

export type AutosaveTrigger =
  | 'chapter_enter'
  | 'chapter_complete'
  | 'major_decision'
  | 'faction_threshold'
  | 'character_death'
  | 'combat_resolved'
  | 'ending_reached';

export interface AutosaveEvent {
  trigger: AutosaveTrigger;
  timestamp: number;
  details: Record<string, unknown>;
}

export interface AutosaveConfig {
  /** Whether autosave is enabled */
  enabled: boolean;
  /** Minimum interval between autosaves in ms (default 10 seconds) */
  debounceMs: number;
  /** Maximum number of rotating autosave slots */
  maxSlots: number;
  /** Which triggers are enabled */
  triggers: Record<AutosaveTrigger, boolean>;
}

export type AutosaveCallback = (event: AutosaveEvent) => void;

// ─── Constants ──────────────────────────────────────────────────────────────

const DEFAULT_DEBOUNCE_MS = 10_000; // 10 seconds between autosaves

/** Faction reputation thresholds that trigger autosave when crossed */
const FACTION_THRESHOLDS = [-75, -50, -25, 0, 25, 50, 75];

/** Minimum total effect magnitude to qualify as a "major decision" */
const MAJOR_DECISION_THRESHOLD = 3;

const DEFAULT_CONFIG: AutosaveConfig = {
  enabled: true,
  debounceMs: DEFAULT_DEBOUNCE_MS,
  maxSlots: 3,
  triggers: {
    chapter_enter: true,
    chapter_complete: true,
    major_decision: true,
    faction_threshold: true,
    character_death: true,
    combat_resolved: true,
    ending_reached: true,
  },
};

// ─── Autosave Manager ───────────────────────────────────────────────────────

export class AutosaveManager {
  private config: AutosaveConfig;
  private lastAutosaveAt: number = 0;
  private pendingAutosave: ReturnType<typeof setTimeout> | null = null;
  private previousFactions: Record<FactionId, number> | null = null;
  private listeners: AutosaveCallback[] = [];
  private isSaving: boolean = false;

  constructor(config?: Partial<AutosaveConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    if (config?.triggers) {
      this.config.triggers = { ...DEFAULT_CONFIG.triggers, ...config.triggers };
    }
  }

  // ─── Configuration ─────────────────────────────────────────────────

  getConfig(): AutosaveConfig {
    return { ...this.config };
  }

  updateConfig(partial: Partial<AutosaveConfig>): void {
    this.config = { ...this.config, ...partial };
    if (partial.triggers) {
      this.config.triggers = { ...this.config.triggers, ...partial.triggers };
    }
  }

  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  // ─── Event Listeners ───────────────────────────────────────────────

  addEventListener(listener: AutosaveCallback): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(event: AutosaveEvent): void {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (err) {
        console.error('[AutosaveManager] Listener error:', err);
      }
    }
  }

  // ─── State Tracking ────────────────────────────────────────────────

  /**
   * Initialize faction tracking with the current game state.
   * Call this when a game is loaded or started.
   */
  initializeTracking(state: GameState): void {
    this.previousFactions = { ...state.factions };
  }

  // ─── Trigger Evaluation ────────────────────────────────────────────

  /**
   * Handle a NarrativeEngine event and determine if an autosave should fire.
   * Returns the trigger type if autosave was queued, null otherwise.
   */
  handleEngineEvent(event: EngineEvent, currentState: GameState): AutosaveTrigger | null {
    if (!this.config.enabled) return null;

    switch (event.type) {
      case 'scene_enter':
        return this.handleSceneEnter(event, currentState);

      case 'choice_made':
        return this.handleChoiceMade(event, currentState);

      case 'chapter_complete':
        return this.handleChapterComplete(event, currentState);

      case 'combat':
        return this.handleCombat(event, currentState);

      case 'ending_reached':
        return this.handleEndingReached(event, currentState);

      default:
        return null;
    }
  }

  private handleSceneEnter(event: EngineEvent, state: GameState): AutosaveTrigger | null {
    const { chapterId } = event.data as { chapterId: string; sceneId: string };

    // Check if this is a chapter transition (new chapter entered)
    if (this.config.triggers.chapter_enter) {
      // The scene_enter event fires for every scene, but we only want to autosave
      // when entering a new chapter. We detect this by checking if the chapterId
      // in the event differs from what we had before.
      // The game store's onChapterChange handles this separately, so we check
      // if the scene is the entry scene of the chapter.
      const isChapterEntry = state.currentChapterId === chapterId &&
        state.currentSceneId === (event.data as Record<string, unknown>).sceneId;

      // We rely on the explicit chapter_enter trigger from the hook
      // This handler is mainly for scene-level checks
    }

    // Check for faction threshold crossings after scene effects
    return this.checkFactionThresholds(state);
  }

  private handleChoiceMade(event: EngineEvent, state: GameState): AutosaveTrigger | null {
    // Check if this was a major decision based on effect magnitude
    if (this.config.triggers.major_decision) {
      if (this.isMajorDecision(event)) {
        this.queueAutosave(state, 'major_decision', {
          choiceId: event.data.choiceId,
          chapterId: event.data.chapterId,
        });
        return 'major_decision';
      }
    }

    // Check for character deaths in effects
    if (this.config.triggers.character_death) {
      const effects = (event.data.effects as Effect[] | undefined) ?? [];
      const deaths = effects.filter(e => e.type === 'character_death');
      if (deaths.length > 0) {
        this.queueAutosave(state, 'character_death', {
          characterIds: deaths.map(d => (d as { characterId: string }).characterId),
        });
        return 'character_death';
      }
    }

    // Check for faction threshold crossings
    const factionTrigger = this.checkFactionThresholds(state);
    if (factionTrigger) return factionTrigger;

    return null;
  }

  private handleChapterComplete(event: EngineEvent, state: GameState): AutosaveTrigger | null {
    if (!this.config.triggers.chapter_complete) return null;

    this.queueAutosave(state, 'chapter_complete', {
      chapterId: event.data.chapterId,
    });
    return 'chapter_complete';
  }

  private handleCombat(event: EngineEvent, state: GameState): AutosaveTrigger | null {
    if (!this.config.triggers.combat_resolved) return null;

    this.queueAutosave(state, 'combat_resolved', {
      enemyName: event.data.enemyName,
      victory: event.data.victory,
    });
    return 'combat_resolved';
  }

  private handleEndingReached(event: EngineEvent, state: GameState): AutosaveTrigger | null {
    if (!this.config.triggers.ending_reached) return null;

    // Ending saves bypass debounce — always save immediately
    this.executeAutosave(state, 'ending_reached', {
      endingId: event.data.endingId,
    });
    return 'ending_reached';
  }

  // ─── Faction Threshold Detection ───────────────────────────────────

  private checkFactionThresholds(state: GameState): AutosaveTrigger | null {
    if (!this.config.triggers.faction_threshold) return null;
    if (!this.previousFactions) {
      this.previousFactions = { ...state.factions };
      return null;
    }

    const crossedThresholds: Array<{ faction: FactionId; threshold: number; direction: 'up' | 'down' }> = [];

    for (const factionId of Object.keys(state.factions) as FactionId[]) {
      const prev = this.previousFactions[factionId];
      const curr = state.factions[factionId];

      for (const threshold of FACTION_THRESHOLDS) {
        // Check if the threshold was crossed (in either direction)
        if ((prev < threshold && curr >= threshold) || (prev >= threshold && curr < threshold)) {
          crossedThresholds.push({
            faction: factionId,
            threshold,
            direction: curr >= threshold ? 'up' : 'down',
          });
        }
      }
    }

    // Update previous factions for next check
    this.previousFactions = { ...state.factions };

    if (crossedThresholds.length > 0) {
      this.queueAutosave(state, 'faction_threshold', {
        crossedThresholds,
      });
      return 'faction_threshold';
    }

    return null;
  }

  // ─── Major Decision Detection ──────────────────────────────────────

  /**
   * Determine if a choice qualifies as a "major decision" based on the
   * magnitude and variety of its effects.
   */
  private isMajorDecision(event: EngineEvent): boolean {
    const effects = (event.data.effects as Effect[] | undefined) ?? [];
    if (effects.length === 0) return false;

    let magnitude = 0;

    for (const effect of effects) {
      switch (effect.type) {
        case 'stat':
          magnitude += Math.abs(effect.delta) >= 5 ? 2 : 1;
          break;
        case 'faction':
          magnitude += Math.abs(effect.delta) >= 10 ? 3 : Math.abs(effect.delta) >= 5 ? 2 : 1;
          break;
        case 'flag':
          magnitude += 1;
          break;
        case 'character_death':
          magnitude += 5; // Character deaths are always major
          break;
        case 'unlock':
          magnitude += 2;
          break;
      }
    }

    return magnitude >= MAJOR_DECISION_THRESHOLD;
  }

  // ─── Autosave Execution ────────────────────────────────────────────

  /**
   * Queue an autosave with debouncing.
   * If an autosave was recently performed, this will delay the save.
   */
  private queueAutosave(
    state: GameState,
    trigger: AutosaveTrigger,
    details: Record<string, unknown>
  ): void {
    const now = Date.now();
    const timeSinceLastSave = now - this.lastAutosaveAt;

    // Clear any pending autosave
    if (this.pendingAutosave) {
      clearTimeout(this.pendingAutosave);
      this.pendingAutosave = null;
    }

    if (timeSinceLastSave >= this.config.debounceMs) {
      // Enough time has passed, save immediately
      this.executeAutosave(state, trigger, details);
    } else {
      // Debounce: schedule save for later
      const delay = this.config.debounceMs - timeSinceLastSave;
      this.pendingAutosave = setTimeout(() => {
        this.pendingAutosave = null;
        this.executeAutosave(state, trigger, details);
      }, delay);
    }
  }

  /**
   * Execute the autosave immediately.
   */
  private async executeAutosave(
    state: GameState,
    trigger: AutosaveTrigger,
    details: Record<string, unknown>
  ): Promise<void> {
    if (this.isSaving) return; // Prevent concurrent saves
    this.isSaving = true;

    const event: AutosaveEvent = {
      trigger,
      timestamp: Date.now(),
      details,
    };

    try {
      const result = await triggerAutosave({
        ...state,
        savedAt: Date.now(),
      });

      if (result.success) {
        this.lastAutosaveAt = Date.now();
        this.notifyListeners(event);
        console.debug(`[Autosave] Triggered by ${trigger}`, details);
      } else {
        console.warn(`[Autosave] Failed:`, result.error);
      }
    } catch (err) {
      console.error('[Autosave] Error:', err);
    } finally {
      this.isSaving = false;
    }
  }

  // ─── Direct Trigger Methods ────────────────────────────────────────

  /**
   * Explicitly trigger an autosave for a chapter transition.
   * Called by the game store when a chapter change is detected.
   */
  triggerChapterEnter(state: GameState, chapterId: string): void {
    if (!this.config.enabled || !this.config.triggers.chapter_enter) return;
    this.queueAutosave(state, 'chapter_enter', { chapterId });
  }

  /**
   * Explicitly trigger an autosave for chapter completion.
   */
  triggerChapterComplete(state: GameState, chapterId: string): void {
    if (!this.config.enabled || !this.config.triggers.chapter_complete) return;
    this.queueAutosave(state, 'chapter_complete', { chapterId });
  }

  /**
   * Explicitly trigger an autosave for a major decision.
   */
  triggerMajorDecision(state: GameState, choiceId: string, effects: Effect[]): void {
    if (!this.config.enabled || !this.config.triggers.major_decision) return;

    // Construct a synthetic event to check magnitude
    const syntheticEvent: EngineEvent = {
      type: 'choice_made',
      data: { choiceId, effects },
    };

    if (this.isMajorDecision(syntheticEvent)) {
      this.queueAutosave(state, 'major_decision', { choiceId });
    }
  }

  /**
   * Explicitly trigger an autosave for faction changes.
   * Compares previous and current factions to detect threshold crossings.
   */
  triggerFactionCheck(state: GameState): void {
    this.checkFactionThresholds(state);
  }

  /**
   * Explicitly trigger an autosave after combat resolution.
   */
  triggerCombatResolved(state: GameState, enemyName: string, victory: boolean): void {
    if (!this.config.enabled || !this.config.triggers.combat_resolved) return;
    this.queueAutosave(state, 'combat_resolved', { enemyName, victory });
  }

  /**
   * Explicitly trigger an autosave for character death.
   */
  triggerCharacterDeath(state: GameState, characterId: string): void {
    if (!this.config.enabled || !this.config.triggers.character_death) return;
    this.queueAutosave(state, 'character_death', { characterId });
  }

  // ─── Cleanup ───────────────────────────────────────────────────────

  /**
   * Cancel any pending autosave and clean up.
   */
  dispose(): void {
    if (this.pendingAutosave) {
      clearTimeout(this.pendingAutosave);
      this.pendingAutosave = null;
    }
    this.listeners = [];
    this.previousFactions = null;
  }
}

// ─── Singleton ──────────────────────────────────────────────────────────────

let _instance: AutosaveManager | null = null;

/**
 * Get the global AutosaveManager instance.
 */
export function getAutosaveManager(config?: Partial<AutosaveConfig>): AutosaveManager {
  if (!_instance) {
    _instance = new AutosaveManager(config);
  }
  return _instance;
}

/**
 * Reset the global instance (for testing or cleanup).
 */
export function resetAutosaveManager(): void {
  _instance?.dispose();
  _instance = null;
}
