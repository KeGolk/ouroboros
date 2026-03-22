/**
 * useAutosave — React hook that integrates autosave triggers into the game.
 *
 * Subscribes to the Zustand game store and monitors for key narrative moments:
 * - Chapter transitions (currentChapterId changes)
 * - Major decisions (choices with significant effects)
 * - Faction standing threshold crossings
 * - Character deaths
 * - Combat resolution
 * - Chapter completion
 *
 * Shows a brief toast notification when autosave occurs.
 */

'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useGameStore } from '../stores/game-store';
import {
  getAutosaveManager,
  type AutosaveEvent,
  type AutosaveTrigger,
  type AutosaveConfig,
} from '../engine/autosave';
import type { GameState, Effect } from '../engine/types';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AutosaveStatus {
  /** Whether an autosave recently completed */
  justSaved: boolean;
  /** The most recent autosave trigger type */
  lastTrigger: AutosaveTrigger | null;
  /** Timestamp of the last autosave */
  lastSavedAt: number | null;
  /** Human-readable description of the last autosave */
  lastSaveLabel: string | null;
  /** Whether autosave is enabled */
  enabled: boolean;
}

interface UseAutosaveOptions {
  /** Override default autosave configuration */
  config?: Partial<AutosaveConfig>;
  /** Duration in ms to show the "saved" indicator (default 2000) */
  toastDurationMs?: number;
}

// ─── Trigger Labels ─────────────────────────────────────────────────────────

const TRIGGER_LABELS: Record<AutosaveTrigger, string> = {
  chapter_enter: 'New chapter',
  chapter_complete: 'Chapter complete',
  major_decision: 'Major decision',
  faction_threshold: 'Faction shift',
  character_death: 'Character death',
  combat_resolved: 'Combat resolved',
  ending_reached: 'Ending reached',
};

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useAutosave(options: UseAutosaveOptions = {}): AutosaveStatus {
  const { config, toastDurationMs = 2000 } = options;

  const gameState = useGameStore(s => s.gameState);
  const manager = getAutosaveManager(config);

  const [status, setStatus] = useState<AutosaveStatus>({
    justSaved: false,
    lastTrigger: null,
    lastSavedAt: null,
    lastSaveLabel: null,
    enabled: manager.isEnabled(),
  });

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevChapterRef = useRef<string | null>(null);
  const prevDeadCharsRef = useRef<string[]>([]);
  const prevFactionsRef = useRef<Record<string, number> | null>(null);

  // ─── Autosave event listener ──────────────────────────────────────

  const handleAutosaveEvent = useCallback(
    (event: AutosaveEvent) => {
      // Clear previous toast timer
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }

      setStatus({
        justSaved: true,
        lastTrigger: event.trigger,
        lastSavedAt: event.timestamp,
        lastSaveLabel: TRIGGER_LABELS[event.trigger] ?? 'Autosaved',
        enabled: manager.isEnabled(),
      });

      // Auto-hide the toast after duration
      toastTimerRef.current = setTimeout(() => {
        setStatus(prev => ({ ...prev, justSaved: false }));
      }, toastDurationMs);
    },
    [manager, toastDurationMs]
  );

  // ─── Register autosave listener ───────────────────────────────────

  useEffect(() => {
    const unsubscribe = manager.addEventListener(handleAutosaveEvent);
    return unsubscribe;
  }, [manager, handleAutosaveEvent]);

  // ─── Initialize faction tracking when game loads ──────────────────

  useEffect(() => {
    if (gameState) {
      manager.initializeTracking(gameState);
      prevChapterRef.current = gameState.currentChapterId;
      prevDeadCharsRef.current = [...gameState.deadCharacters];
      prevFactionsRef.current = { ...gameState.factions };
    }
  }, [gameState?.saveId]); // Only reinitialize on new/loaded game

  // ─── Monitor chapter transitions ──────────────────────────────────

  useEffect(() => {
    if (!gameState) return;

    const prevChapter = prevChapterRef.current;
    const currentChapter = gameState.currentChapterId;

    if (prevChapter && prevChapter !== currentChapter) {
      manager.triggerChapterEnter(gameState, currentChapter);
    }

    prevChapterRef.current = currentChapter;
  }, [gameState?.currentChapterId, manager]);

  // ─── Monitor chapter completions ──────────────────────────────────

  const prevCompletedRef = useRef<string[]>([]);

  useEffect(() => {
    if (!gameState) return;

    const prevCompleted = prevCompletedRef.current;
    const currentCompleted = gameState.completedChapters;

    // Find newly completed chapters
    const newlyCompleted = currentCompleted.filter(c => !prevCompleted.includes(c));

    for (const chapterId of newlyCompleted) {
      manager.triggerChapterComplete(gameState, chapterId);
    }

    prevCompletedRef.current = [...currentCompleted];
  }, [gameState?.completedChapters, manager]);

  // ─── Monitor character deaths ─────────────────────────────────────

  useEffect(() => {
    if (!gameState) return;

    const prevDead = prevDeadCharsRef.current;
    const currentDead = gameState.deadCharacters;

    // Find newly dead characters
    const newlyDead = currentDead.filter(c => !prevDead.includes(c));

    for (const characterId of newlyDead) {
      manager.triggerCharacterDeath(gameState, characterId);
    }

    prevDeadCharsRef.current = [...currentDead];
  }, [gameState?.deadCharacters, manager]);

  // ─── Monitor faction threshold crossings ──────────────────────────

  useEffect(() => {
    if (!gameState) return;

    const prevFactions = prevFactionsRef.current;
    if (!prevFactions) {
      prevFactionsRef.current = { ...gameState.factions };
      return;
    }

    // Only check if factions actually changed
    const changed = Object.keys(gameState.factions).some(
      key => gameState.factions[key as keyof typeof gameState.factions] !==
        (prevFactions as Record<string, number>)[key]
    );

    if (changed) {
      manager.triggerFactionCheck(gameState);
      prevFactionsRef.current = { ...gameState.factions };
    }
  }, [
    gameState?.factions.iron_throne,
    gameState?.factions.shadow_guild,
    gameState?.factions.peoples_front,
    gameState?.factions.old_faith,
    manager,
  ]);

  // ─── Cleanup ──────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  return status;
}

/**
 * Imperative function to trigger autosave from non-React contexts
 * (e.g., from the NarrativeEngine event handler or game store actions).
 */
export function triggerAutosaveForChoice(
  state: GameState,
  choiceId: string,
  effects: Effect[]
): void {
  const manager = getAutosaveManager();
  manager.triggerMajorDecision(state, choiceId, effects);
}

export function triggerAutosaveForCombat(
  state: GameState,
  enemyName: string,
  victory: boolean
): void {
  const manager = getAutosaveManager();
  manager.triggerCombatResolved(state, enemyName, victory);
}
