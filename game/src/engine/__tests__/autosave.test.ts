/**
 * Tests for the AutosaveManager.
 */

import {
  AutosaveManager,
  type AutosaveConfig,
  type AutosaveEvent,
  type AutosaveTrigger,
} from '../autosave';
import type { GameState, Effect } from '../types';
import { createNewGameState } from '../narrative-engine';

// ─── Mock saveService ───────────────────────────────────────────────────────

jest.mock('../../services/saveService', () => ({
  triggerAutosave: jest.fn().mockResolvedValue({ success: true, saveId: '__autosave__0' }),
}));

const { triggerAutosave: mockTriggerAutosave } = require('../../services/saveService');

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    ...createNewGameState('TestPlayer', 'ch1', 'scene1'),
    ...overrides,
  };
}

function createManager(config?: Partial<AutosaveConfig>): AutosaveManager {
  return new AutosaveManager({
    debounceMs: 0, // disable debounce for tests
    ...config,
  });
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('AutosaveManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('configuration', () => {
    it('should create with default config', () => {
      const manager = new AutosaveManager();
      const config = manager.getConfig();
      expect(config.enabled).toBe(true);
      expect(config.triggers.chapter_enter).toBe(true);
      expect(config.triggers.major_decision).toBe(true);
      expect(config.triggers.faction_threshold).toBe(true);
    });

    it('should allow updating config', () => {
      const manager = createManager();
      manager.updateConfig({ enabled: false });
      expect(manager.isEnabled()).toBe(false);
    });

    it('should allow toggling enabled state', () => {
      const manager = createManager();
      manager.setEnabled(false);
      expect(manager.isEnabled()).toBe(false);
      manager.setEnabled(true);
      expect(manager.isEnabled()).toBe(true);
    });
  });

  describe('chapter transitions', () => {
    it('should trigger autosave on chapter enter', async () => {
      const manager = createManager();
      const state = makeState({ currentChapterId: 'ch2' });

      manager.triggerChapterEnter(state, 'ch2');

      // Flush timers and promises
      jest.runAllTimers();
      await Promise.resolve();

      expect(mockTriggerAutosave).toHaveBeenCalledTimes(1);
      expect(mockTriggerAutosave).toHaveBeenCalledWith(
        expect.objectContaining({ currentChapterId: 'ch2' })
      );
    });

    it('should NOT trigger when chapter_enter trigger is disabled', async () => {
      const manager = createManager({
        triggers: {
          chapter_enter: false,
          chapter_complete: true,
          major_decision: true,
          faction_threshold: true,
          character_death: true,
          combat_resolved: true,
          ending_reached: true,
        },
      });
      const state = makeState();

      manager.triggerChapterEnter(state, 'ch2');
      jest.runAllTimers();
      await Promise.resolve();

      expect(mockTriggerAutosave).not.toHaveBeenCalled();
    });

    it('should NOT trigger when autosave is disabled', async () => {
      const manager = createManager({ enabled: false });
      const state = makeState();

      manager.triggerChapterEnter(state, 'ch2');
      jest.runAllTimers();
      await Promise.resolve();

      expect(mockTriggerAutosave).not.toHaveBeenCalled();
    });
  });

  describe('chapter completion', () => {
    it('should trigger autosave on chapter complete', async () => {
      const manager = createManager();
      const state = makeState({ completedChapters: ['ch1'] });

      manager.triggerChapterComplete(state, 'ch1');
      jest.runAllTimers();
      await Promise.resolve();

      expect(mockTriggerAutosave).toHaveBeenCalledTimes(1);
    });
  });

  describe('faction threshold crossings', () => {
    it('should trigger autosave when crossing a faction threshold', async () => {
      const manager = createManager();
      const initialState = makeState({
        factions: { iron_throne: -10, shadow_guild: 0, peoples_front: 0, old_faith: 0 },
      });

      // Initialize tracking with low iron_throne
      manager.initializeTracking(initialState);

      // Now simulate iron_throne crossing the 0 threshold (from -10 to 5)
      const newState = makeState({
        factions: { iron_throne: 5, shadow_guild: 0, peoples_front: 0, old_faith: 0 },
      });

      manager.triggerFactionCheck(newState);
      jest.runAllTimers();
      await Promise.resolve();

      expect(mockTriggerAutosave).toHaveBeenCalledTimes(1);
    });

    it('should NOT trigger when faction changes but stays within same tier', async () => {
      const manager = createManager();
      const initialState = makeState({
        factions: { iron_throne: 5, shadow_guild: 0, peoples_front: 0, old_faith: 0 },
      });

      manager.initializeTracking(initialState);

      // Small change that doesn't cross a threshold
      const newState = makeState({
        factions: { iron_throne: 10, shadow_guild: 0, peoples_front: 0, old_faith: 0 },
      });

      manager.triggerFactionCheck(newState);
      jest.runAllTimers();
      await Promise.resolve();

      expect(mockTriggerAutosave).not.toHaveBeenCalled();
    });

    it('should detect threshold crossing in negative direction', async () => {
      const manager = createManager();
      const initialState = makeState({
        factions: { iron_throne: 30, shadow_guild: 0, peoples_front: 0, old_faith: 0 },
      });

      manager.initializeTracking(initialState);

      // Crossing 25 threshold downward
      const newState = makeState({
        factions: { iron_throne: 20, shadow_guild: 0, peoples_front: 0, old_faith: 0 },
      });

      manager.triggerFactionCheck(newState);
      jest.runAllTimers();
      await Promise.resolve();

      expect(mockTriggerAutosave).toHaveBeenCalledTimes(1);
    });
  });

  describe('major decisions', () => {
    it('should trigger autosave for choices with high-magnitude effects', async () => {
      const manager = createManager();
      const state = makeState();

      const effects: Effect[] = [
        { type: 'faction', faction: 'iron_throne', delta: 15 },
        { type: 'stat', stat: 'strength', delta: 5 },
        { type: 'flag', flag: 'betrayed_king', value: true },
      ];

      manager.triggerMajorDecision(state, 'betray_king', effects);
      jest.runAllTimers();
      await Promise.resolve();

      expect(mockTriggerAutosave).toHaveBeenCalledTimes(1);
    });

    it('should NOT trigger for minor choices', async () => {
      const manager = createManager();
      const state = makeState();

      // Minor effect: only 1 small stat change
      const effects: Effect[] = [
        { type: 'stat', stat: 'cunning', delta: 1 },
      ];

      manager.triggerMajorDecision(state, 'look_around', effects);
      jest.runAllTimers();
      await Promise.resolve();

      expect(mockTriggerAutosave).not.toHaveBeenCalled();
    });

    it('should always trigger for character deaths', async () => {
      const manager = createManager();
      const state = makeState();

      const effects: Effect[] = [
        { type: 'character_death', characterId: 'lord_varen' },
      ];

      manager.triggerMajorDecision(state, 'execute_varen', effects);
      jest.runAllTimers();
      await Promise.resolve();

      expect(mockTriggerAutosave).toHaveBeenCalledTimes(1);
    });
  });

  describe('combat resolution', () => {
    it('should trigger autosave after combat', async () => {
      const manager = createManager();
      const state = makeState();

      manager.triggerCombatResolved(state, 'Dark Knight', true);
      jest.runAllTimers();
      await Promise.resolve();

      expect(mockTriggerAutosave).toHaveBeenCalledTimes(1);
    });
  });

  describe('character death', () => {
    it('should trigger autosave on character death', async () => {
      const manager = createManager();
      const state = makeState({ deadCharacters: ['lord_varen'] });

      manager.triggerCharacterDeath(state, 'lord_varen');
      jest.runAllTimers();
      await Promise.resolve();

      expect(mockTriggerAutosave).toHaveBeenCalledTimes(1);
    });
  });

  describe('event listeners', () => {
    it('should notify listeners when autosave fires', async () => {
      const manager = createManager();
      const events: AutosaveEvent[] = [];
      manager.addEventListener((event) => events.push(event));

      const state = makeState();
      manager.triggerChapterComplete(state, 'ch1');
      jest.runAllTimers();
      await Promise.resolve();

      expect(events).toHaveLength(1);
      expect(events[0].trigger).toBe('chapter_complete');
      expect(events[0].details).toEqual({ chapterId: 'ch1' });
    });

    it('should allow removing listeners', async () => {
      const manager = createManager();
      const events: AutosaveEvent[] = [];
      const unsubscribe = manager.addEventListener((event) => events.push(event));

      unsubscribe();

      const state = makeState();
      manager.triggerChapterComplete(state, 'ch1');
      jest.runAllTimers();
      await Promise.resolve();

      expect(events).toHaveLength(0);
    });
  });

  describe('debouncing', () => {
    it('should debounce rapid triggers', async () => {
      const manager = new AutosaveManager({ debounceMs: 5000 });
      const state = makeState();

      // First trigger should fire immediately
      manager.triggerChapterComplete(state, 'ch1');
      jest.advanceTimersByTime(0);
      await Promise.resolve();
      expect(mockTriggerAutosave).toHaveBeenCalledTimes(1);

      // Second trigger within debounce window should be delayed
      manager.triggerChapterComplete(state, 'ch2');
      jest.advanceTimersByTime(1000);
      await Promise.resolve();
      expect(mockTriggerAutosave).toHaveBeenCalledTimes(1); // still 1

      // After debounce period, the delayed save should fire
      jest.advanceTimersByTime(5000);
      await Promise.resolve();
      expect(mockTriggerAutosave).toHaveBeenCalledTimes(2);
    });
  });

  describe('engine event handling', () => {
    it('should handle chapter_complete engine event', async () => {
      const manager = createManager();
      const state = makeState();

      const trigger = manager.handleEngineEvent(
        { type: 'chapter_complete', data: { chapterId: 'ch1' } },
        state
      );

      expect(trigger).toBe('chapter_complete');
      jest.runAllTimers();
      await Promise.resolve();
      expect(mockTriggerAutosave).toHaveBeenCalledTimes(1);
    });

    it('should handle combat engine event', async () => {
      const manager = createManager();
      const state = makeState();

      const trigger = manager.handleEngineEvent(
        { type: 'combat', data: { enemyName: 'Dragon', victory: true, playerRoll: 25, enemyRoll: 15 } },
        state
      );

      expect(trigger).toBe('combat_resolved');
      jest.runAllTimers();
      await Promise.resolve();
      expect(mockTriggerAutosave).toHaveBeenCalledTimes(1);
    });

    it('should return null for disabled autosave', () => {
      const manager = createManager({ enabled: false });
      const state = makeState();

      const trigger = manager.handleEngineEvent(
        { type: 'chapter_complete', data: { chapterId: 'ch1' } },
        state
      );

      expect(trigger).toBeNull();
    });
  });

  describe('cleanup', () => {
    it('should dispose cleanly', () => {
      const manager = createManager();
      const events: AutosaveEvent[] = [];
      manager.addEventListener((event) => events.push(event));

      manager.dispose();

      // After dispose, no listeners should fire
      const state = makeState();
      manager.triggerChapterComplete(state, 'ch1');
      jest.runAllTimers();

      // The save may still happen internally, but listeners should not fire
      expect(events).toHaveLength(0);
    });
  });
});
