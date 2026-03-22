/**
 * Save/Load Service Layer
 *
 * Provides a unified API for creating manual saves, triggering autosaves,
 * listing saves, loading saves, and deleting saves.
 *
 * Supports two storage backends:
 * 1. localStorage (offline/anonymous mode) — always available
 * 2. Supabase cloud (authenticated mode) — syncs when user is logged in
 *
 * The service automatically detects the storage mode based on auth state.
 */

import { GameState } from '@/engine/types';
import { getSupabaseClient, getCurrentUserId } from '@/lib/supabase/client';

/* eslint-disable @typescript-eslint/no-explicit-any */

// ─── Constants ──────────────────────────────────────────────────────────────

const LOCAL_SAVES_KEY = 'ouroboros_saves';
const AUTOSAVE_SLOT_ID = '__autosave__';
const QUICKSAVE_SLOT_ID = '__quicksave__';
const MAX_LOCAL_SAVES = 50;
const MAX_AUTOSAVE_SLOTS = 3; // rotating autosave slots

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SaveMetadata {
  saveId: string;
  playerName: string;
  currentChapterId: string;
  currentSceneId: string;
  savedAt: number;
  playtimeSeconds: number;
  ngPlusCycle: number;
  isAutosave: boolean;
  isQuicksave: boolean;
  slotLabel: string;
  /** Cloud-only: row ID in Supabase */
  cloudId?: string;
}

export interface SaveSlot {
  metadata: SaveMetadata;
  state: GameState;
}

export type SaveResult =
  | { success: true; saveId: string }
  | { success: false; error: string };

export type LoadResult =
  | { success: true; state: GameState }
  | { success: false; error: string };

export type DeleteResult =
  | { success: true }
  | { success: false; error: string };

// ─── Helpers ────────────────────────────────────────────────────────────────

function generateSaveId(): string {
  return `save_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function buildMetadata(state: GameState, opts: {
  isAutosave?: boolean;
  isQuicksave?: boolean;
  slotLabel?: string;
}): SaveMetadata {
  return {
    saveId: state.saveId,
    playerName: state.playerName,
    currentChapterId: state.currentChapterId,
    currentSceneId: state.currentSceneId,
    savedAt: state.savedAt,
    playtimeSeconds: state.playtimeSeconds,
    ngPlusCycle: state.ngPlusCycle,
    isAutosave: opts.isAutosave ?? false,
    isQuicksave: opts.isQuicksave ?? false,
    slotLabel: opts.slotLabel ?? `Manual Save`,
  };
}

// ─── localStorage Backend ───────────────────────────────────────────────────

function getLocalSaves(): SaveSlot[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_SAVES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SaveSlot[];
  } catch {
    return [];
  }
}

function setLocalSaves(saves: SaveSlot[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_SAVES_KEY, JSON.stringify(saves));
  } catch (e) {
    // If storage is full, remove oldest non-autosaves first
    const trimmed = saves
      .sort((a, b) => b.metadata.savedAt - a.metadata.savedAt)
      .slice(0, MAX_LOCAL_SAVES);
    localStorage.setItem(LOCAL_SAVES_KEY, JSON.stringify(trimmed));
  }
}

function upsertLocalSave(slot: SaveSlot): void {
  const saves = getLocalSaves();
  const existingIdx = saves.findIndex(s => s.metadata.saveId === slot.metadata.saveId);
  if (existingIdx >= 0) {
    saves[existingIdx] = slot;
  } else {
    saves.push(slot);
  }
  setLocalSaves(saves);
}

function deleteLocalSave(saveId: string): boolean {
  const saves = getLocalSaves();
  const filtered = saves.filter(s => s.metadata.saveId !== saveId);
  if (filtered.length === saves.length) return false;
  setLocalSaves(filtered);
  return true;
}

function findLocalSave(saveId: string): SaveSlot | undefined {
  return getLocalSaves().find(s => s.metadata.saveId === saveId);
}

// ─── Supabase Backend ───────────────────────────────────────────────────────

function gameStateToDbRow(state: GameState, userId: string) {
  return {
    user_id: userId,
    save_id: state.saveId,
    player_name: state.playerName,
    current_chapter_id: state.currentChapterId,
    current_scene_id: state.currentSceneId,
    stats: state.stats as unknown as Record<string, number>,
    factions: state.factions as unknown as Record<string, number>,
    flags: state.flags,
    choice_history: state.choiceHistory.map(c => ({
      chapter_id: c.chapterId,
      scene_id: c.sceneId,
      choice_id: c.choiceId,
      timestamp: c.timestamp,
    })),
    dead_characters: state.deadCharacters,
    unlocks: state.unlocks,
    completed_chapters: state.completedChapters,
    ng_plus_cycle: state.ngPlusCycle,
    achievements: state.achievements,
    playtime_seconds: state.playtimeSeconds,
    map_state: {
      current_location_id: null,
      previous_location_id: null,
      fog_of_war: {},
      discovery_timestamps: {},
      travel_history: [],
      available_destinations: [],
      revealed_paths: [],
    },
  };
}

function dbRowToGameState(row: Record<string, unknown>): GameState {
  const choiceHistory = (row.choice_history as Array<{
    chapter_id: string;
    scene_id: string;
    choice_id: string;
    timestamp: number;
  }>) ?? [];

  return {
    saveId: row.save_id as string,
    playerName: row.player_name as string,
    currentChapterId: row.current_chapter_id as string,
    currentSceneId: row.current_scene_id as string,
    stats: row.stats as GameState['stats'],
    factions: row.factions as GameState['factions'],
    flags: (row.flags as Record<string, boolean>) ?? {},
    choiceHistory: choiceHistory.map(c => ({
      chapterId: c.chapter_id,
      sceneId: c.scene_id,
      choiceId: c.choice_id,
      timestamp: c.timestamp,
    })),
    deadCharacters: (row.dead_characters as string[]) ?? [],
    unlocks: (row.unlocks as string[]) ?? [],
    completedChapters: (row.completed_chapters as string[]) ?? [],
    savedAt: new Date(row.updated_at as string).getTime(),
    ngPlusCycle: (row.ng_plus_cycle as number) ?? 0,
    achievements: (row.achievements as string[]) ?? [],
    playtimeSeconds: (row.playtime_seconds as number) ?? 0,
  };
}

async function upsertCloudSave(state: GameState, userId: string): Promise<SaveResult> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase not configured' };

  const row = gameStateToDbRow(state, userId);

  const { error } = await (client as any)
    .from('game_saves')
    .upsert(row, { onConflict: 'user_id,save_id' });

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, saveId: state.saveId };
}

async function loadCloudSave(saveId: string, userId: string): Promise<LoadResult> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase not configured' };

  const { data, error } = await (client as any)
    .from('game_saves')
    .select('*')
    .eq('user_id', userId)
    .eq('save_id', saveId)
    .single();

  if (error || !data) {
    return { success: false, error: error?.message ?? 'Save not found' };
  }

  return { success: true, state: dbRowToGameState(data as Record<string, unknown>) };
}

async function listCloudSaves(userId: string): Promise<SaveMetadata[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  const { data, error } = await (client as any)
    .from('game_saves')
    .select('save_id, player_name, current_chapter_id, current_scene_id, playtime_seconds, ng_plus_cycle, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error || !data) return [];

  return (data as any[]).map((row: any) => ({
    saveId: row.save_id,
    playerName: row.player_name,
    currentChapterId: row.current_chapter_id,
    currentSceneId: row.current_scene_id,
    savedAt: new Date(row.updated_at).getTime(),
    playtimeSeconds: row.playtime_seconds ?? 0,
    ngPlusCycle: row.ng_plus_cycle ?? 0,
    isAutosave: (row.save_id as string).startsWith(AUTOSAVE_SLOT_ID),
    isQuicksave: row.save_id === QUICKSAVE_SLOT_ID,
    slotLabel: (row.save_id as string).startsWith(AUTOSAVE_SLOT_ID)
      ? 'Autosave'
      : row.save_id === QUICKSAVE_SLOT_ID
        ? 'Quicksave'
        : 'Manual Save',
    cloudId: row.save_id,
  }));
}

async function deleteCloudSave(saveId: string, userId: string): Promise<DeleteResult> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase not configured' };

  const { error } = await (client as any)
    .from('game_saves')
    .delete()
    .eq('user_id', userId)
    .eq('save_id', saveId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Create a manual save of the current game state.
 * Saves to both localStorage and cloud (if authenticated).
 */
export async function createManualSave(
  state: GameState,
  slotLabel?: string
): Promise<SaveResult> {
  const saveId = generateSaveId();
  const saveState: GameState = {
    ...state,
    saveId,
    savedAt: Date.now(),
  };

  const metadata = buildMetadata(saveState, { slotLabel: slotLabel ?? `Manual Save` });
  const slot: SaveSlot = { metadata, state: saveState };

  // Always save locally
  upsertLocalSave(slot);

  // Attempt cloud save if authenticated
  const userId = await getCurrentUserId();
  if (userId) {
    const cloudResult = await upsertCloudSave(saveState, userId);
    if (!cloudResult.success) {
      console.warn('[SaveService] Cloud save failed, local save preserved:', cloudResult.error);
    }
  }

  return { success: true, saveId };
}

/**
 * Create a quicksave (single rotating slot).
 * Overwrites the previous quicksave.
 */
export async function createQuicksave(state: GameState): Promise<SaveResult> {
  const saveState: GameState = {
    ...state,
    saveId: QUICKSAVE_SLOT_ID,
    savedAt: Date.now(),
  };

  const metadata = buildMetadata(saveState, { isQuicksave: true, slotLabel: 'Quicksave' });
  const slot: SaveSlot = { metadata, state: saveState };

  upsertLocalSave(slot);

  const userId = await getCurrentUserId();
  if (userId) {
    const cloudResult = await upsertCloudSave(saveState, userId);
    if (!cloudResult.success) {
      console.warn('[SaveService] Cloud quicksave failed:', cloudResult.error);
    }
  }

  return { success: true, saveId: QUICKSAVE_SLOT_ID };
}

/**
 * Trigger an autosave. Uses rotating slots to keep the last N autosaves.
 */
export async function triggerAutosave(state: GameState): Promise<SaveResult> {
  // Determine which autosave slot to use (rotating)
  const existingAutosaves = getLocalSaves()
    .filter(s => s.metadata.isAutosave)
    .sort((a, b) => a.metadata.savedAt - b.metadata.savedAt);

  let slotIndex: number;
  if (existingAutosaves.length < MAX_AUTOSAVE_SLOTS) {
    slotIndex = existingAutosaves.length;
  } else {
    // Overwrite the oldest autosave
    const oldest = existingAutosaves[0];
    const match = oldest.metadata.saveId.match(/_(\d+)$/);
    slotIndex = match ? parseInt(match[1], 10) : 0;
  }

  const autosaveId = `${AUTOSAVE_SLOT_ID}${slotIndex}`;

  const saveState: GameState = {
    ...state,
    saveId: autosaveId,
    savedAt: Date.now(),
  };

  const metadata = buildMetadata(saveState, {
    isAutosave: true,
    slotLabel: `Autosave ${slotIndex + 1}`,
  });
  const slot: SaveSlot = { metadata, state: saveState };

  upsertLocalSave(slot);

  const userId = await getCurrentUserId();
  if (userId) {
    const cloudResult = await upsertCloudSave(saveState, userId);
    if (!cloudResult.success) {
      console.warn('[SaveService] Cloud autosave failed:', cloudResult.error);
    }
  }

  return { success: true, saveId: autosaveId };
}

/**
 * List all available saves, combining local and cloud saves.
 * Cloud saves take precedence for duplicate saveIds (by timestamp).
 */
export async function listSaves(): Promise<SaveMetadata[]> {
  const localSlots = getLocalSaves();
  const localMeta = localSlots.map(s => s.metadata);

  const userId = await getCurrentUserId();
  if (!userId) {
    // Offline mode: return local saves only
    return localMeta.sort((a, b) => b.savedAt - a.savedAt);
  }

  // Merge local and cloud saves
  const cloudMeta = await listCloudSaves(userId);

  const mergedMap = new Map<string, SaveMetadata>();

  // Add local saves first
  for (const meta of localMeta) {
    mergedMap.set(meta.saveId, meta);
  }

  // Cloud saves override local if newer
  for (const meta of cloudMeta) {
    const existing = mergedMap.get(meta.saveId);
    if (!existing || meta.savedAt > existing.savedAt) {
      mergedMap.set(meta.saveId, meta);
    }
  }

  return Array.from(mergedMap.values()).sort((a, b) => b.savedAt - a.savedAt);
}

/**
 * Load a save by its saveId.
 * Tries localStorage first (faster), falls back to cloud.
 */
export async function loadSave(saveId: string): Promise<LoadResult> {
  // Try local first
  const localSlot = findLocalSave(saveId);
  if (localSlot) {
    return { success: true, state: localSlot.state };
  }

  // Try cloud
  const userId = await getCurrentUserId();
  if (!userId) {
    return { success: false, error: 'Save not found in local storage and not authenticated for cloud access' };
  }

  const cloudResult = await loadCloudSave(saveId, userId);
  if (cloudResult.success) {
    // Cache it locally for faster access next time
    const metadata = buildMetadata(cloudResult.state, {
      isAutosave: saveId.startsWith(AUTOSAVE_SLOT_ID),
      isQuicksave: saveId === QUICKSAVE_SLOT_ID,
      slotLabel: saveId.startsWith(AUTOSAVE_SLOT_ID)
        ? 'Autosave'
        : saveId === QUICKSAVE_SLOT_ID
          ? 'Quicksave'
          : 'Manual Save',
    });
    upsertLocalSave({ metadata, state: cloudResult.state });
  }

  return cloudResult;
}

/**
 * Load the most recent quicksave.
 */
export async function loadQuicksave(): Promise<LoadResult> {
  return loadSave(QUICKSAVE_SLOT_ID);
}

/**
 * Load the most recent autosave.
 */
export async function loadLatestAutosave(): Promise<LoadResult> {
  const saves = await listSaves();
  const autosave = saves.find(s => s.isAutosave);
  if (!autosave) {
    return { success: false, error: 'No autosave found' };
  }
  return loadSave(autosave.saveId);
}

/**
 * Delete a save by its saveId (from both local and cloud).
 */
export async function deleteSave(saveId: string): Promise<DeleteResult> {
  // Delete locally
  deleteLocalSave(saveId);

  // Delete from cloud if authenticated
  const userId = await getCurrentUserId();
  if (userId) {
    const cloudResult = await deleteCloudSave(saveId, userId);
    if (!cloudResult.success) {
      console.warn('[SaveService] Cloud delete failed:', cloudResult.error);
      // Still count as success since local delete worked
    }
  }

  return { success: true };
}

/**
 * Delete all saves (local and cloud). Used for "start fresh" or account cleanup.
 */
export async function deleteAllSaves(): Promise<DeleteResult> {
  // Clear all local saves
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_SAVES_KEY);
  }

  // Clear cloud saves if authenticated
  const userId = await getCurrentUserId();
  if (userId) {
    const client = getSupabaseClient();
    if (client) {
      const { error } = await (client as any)
        .from('game_saves')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.warn('[SaveService] Cloud delete-all failed:', error.message);
      }
    }
  }

  return { success: true };
}

/**
 * Sync local saves to the cloud. Useful after a user logs in.
 * Uploads any local saves that don't exist in the cloud or are newer.
 */
export async function syncLocalSavesToCloud(): Promise<{
  synced: number;
  errors: string[];
}> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { synced: 0, errors: ['Not authenticated'] };
  }

  const localSlots = getLocalSaves();
  const cloudMeta = await listCloudSaves(userId);
  const cloudMap = new Map(cloudMeta.map(m => [m.saveId, m]));

  let synced = 0;
  const errors: string[] = [];

  for (const slot of localSlots) {
    const cloudEntry = cloudMap.get(slot.metadata.saveId);
    // Upload if not in cloud or local is newer
    if (!cloudEntry || slot.metadata.savedAt > cloudEntry.savedAt) {
      const result = await upsertCloudSave(slot.state, userId);
      if (result.success) {
        synced++;
      } else {
        errors.push(`Failed to sync ${slot.metadata.saveId}: ${result.error}`);
      }
    }
  }

  return { synced, errors };
}

/**
 * Download all cloud saves to local storage. Useful after login on a new device.
 */
export async function syncCloudSavesToLocal(): Promise<{
  synced: number;
  errors: string[];
}> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { synced: 0, errors: ['Not authenticated'] };
  }

  const cloudMeta = await listCloudSaves(userId);
  let synced = 0;
  const errors: string[] = [];

  for (const meta of cloudMeta) {
    const localSlot = findLocalSave(meta.saveId);
    // Download if not local or cloud is newer
    if (!localSlot || meta.savedAt > localSlot.metadata.savedAt) {
      const result = await loadCloudSave(meta.saveId, userId);
      if (result.success) {
        const metadata = buildMetadata(result.state, {
          isAutosave: meta.isAutosave,
          isQuicksave: meta.isQuicksave,
          slotLabel: meta.slotLabel,
        });
        upsertLocalSave({ metadata, state: result.state });
        synced++;
      } else {
        errors.push(`Failed to sync ${meta.saveId}: ${result.error}`);
      }
    }
  }

  return { synced, errors };
}

/**
 * Check if any save exists (for "Continue" button on main menu).
 */
export async function hasAnySave(): Promise<boolean> {
  const localSaves = getLocalSaves();
  if (localSaves.length > 0) return true;

  const userId = await getCurrentUserId();
  if (userId) {
    const cloudSaves = await listCloudSaves(userId);
    return cloudSaves.length > 0;
  }

  return false;
}

/**
 * Get the most recent save (for "Continue" on main menu).
 */
export async function getMostRecentSave(): Promise<SaveMetadata | null> {
  const saves = await listSaves();
  return saves.length > 0 ? saves[0] : null;
}

/**
 * Export a save as a JSON string (for manual backup/sharing).
 */
export function exportSave(saveId: string): string | null {
  const slot = findLocalSave(saveId);
  if (!slot) return null;
  return JSON.stringify(slot.state, null, 2);
}

/**
 * Import a save from a JSON string.
 */
export async function importSave(jsonString: string): Promise<SaveResult> {
  try {
    const state = JSON.parse(jsonString) as GameState;
    // Validate essential fields
    if (!state.playerName || !state.currentChapterId || !state.currentSceneId) {
      return { success: false, error: 'Invalid save data: missing required fields' };
    }

    // Give it a new saveId to avoid conflicts
    const saveId = generateSaveId();
    const importedState: GameState = {
      ...state,
      saveId,
      savedAt: Date.now(),
    };

    const metadata = buildMetadata(importedState, { slotLabel: 'Imported Save' });
    upsertLocalSave({ metadata, state: importedState });

    const userId = await getCurrentUserId();
    if (userId) {
      await upsertCloudSave(importedState, userId);
    }

    return { success: true, saveId };
  } catch {
    return { success: false, error: 'Failed to parse save data' };
  }
}
