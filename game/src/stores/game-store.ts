/**
 * Game Store — Zustand state management with map integration
 *
 * Central state store that manages:
 *   - Core game state (chapters, scenes, stats, factions)
 *   - Map state (position, fog of war, travel availability)
 *   - Persistence to localStorage (offline) and Supabase (cloud)
 *   - Auto-save on state changes
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { GameState } from '../engine/types';
import type { MapState, SerializedMapState } from '../types/map-state';
import {
  createInitialMapState,
  serializeMapState,
  deserializeMapState,
} from '../types/map-state';
import {
  createFogOfWarState,
  updateFogFromGameState,
  visitLocation,
  discoverLocation,
} from '../engine/fog-of-war';
import {
  computeTravelAvailability,
  computeAvailableDestinations,
  revealSecretPath,
  type TravelDestination,
} from '../engine/travel';
import { MAP_LOCATIONS } from '../data/map-locations';
import { WORLD_MAP_DATA } from '../data/world-map';
import { createNewGameState } from '../engine/narrative-engine';
import { getAutosaveManager } from '../engine/autosave';

// ─── Combined State Interface ───────────────────────────────────────

interface GameStoreState {
  // ── Core Game State ──
  gameState: GameState | null;
  isLoaded: boolean;

  // ── Map State ──
  mapState: MapState;

  // ── Computed / Derived ──
  availableDestinations: TravelDestination[];

  // ── Cloud Sync ──
  lastSyncedAt: number | null;
  syncError: string | null;
  isSyncing: boolean;
}

interface GameStoreActions {
  // ── Game State Actions ──
  initNewGame: (playerName: string, startChapterId: string, startSceneId: string) => void;
  loadGameState: (state: GameState, mapState?: SerializedMapState) => void;
  updateGameState: (partial: Partial<GameState>) => void;

  // ── Map Actions ──
  setPlayerPosition: (locationId: string) => void;
  discoverMapLocation: (locationId: string) => void;
  visitMapLocation: (locationId: string) => void;
  revealPath: (pathId: string) => void;
  refreshTravelAvailability: () => void;
  refreshFogOfWar: () => void;

  // ── Scene-Map Integration ──
  onSceneEnter: (sceneId: string, sceneLocation?: string) => void;
  onChapterChange: (chapterId: string) => void;

  // ── Persistence Actions ──
  saveToLocal: () => void;
  loadFromLocal: (saveId: string) => boolean;
  getSerializedMapState: () => SerializedMapState;
  syncToCloud: () => Promise<boolean>;
  loadFromCloud: (saveId: string) => Promise<boolean>;

  // ── Reset ──
  resetAll: () => void;
}

type GameStore = GameStoreState & GameStoreActions;

// ─── Local Storage Key ──────────────────────────────────────────────

const LOCAL_STORAGE_PREFIX = 'crowns_of_ash_save_';
const LOCAL_SAVE_INDEX_KEY = 'crowns_of_ash_save_index';

// ─── Store Creation ─────────────────────────────────────────────────

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // ── Initial State ──
      gameState: null,
      isLoaded: false,
      mapState: createInitialMapState(MAP_LOCATIONS.length),
      availableDestinations: [],
      lastSyncedAt: null,
      syncError: null,
      isSyncing: false,

      // ── Game State Actions ──

      initNewGame: (playerName, startChapterId, startSceneId) => {
        const gameState = createNewGameState(playerName, startChapterId, startSceneId);

        // Initialize fog of war from map location data
        const fogOfWar = createFogOfWarState(MAP_LOCATIONS);

        // Set starting position (Thornhold / first location)
        const startLocation = WORLD_MAP_DATA.locations.find(
          (l) => l.chapterIds.includes(startChapterId) || l.id === 'thornhold'
        );
        const startLocationId = startLocation?.id ?? 'thornhold';

        // Visit starting location
        const { state: visitedFog } = visitLocation(
          fogOfWar,
          startLocationId,
          MAP_LOCATIONS,
          Date.now()
        );

        // Update fog from initial game state
        const updatedFog = updateFogFromGameState(visitedFog, gameState, MAP_LOCATIONS);

        const mapState: MapState = {
          position: {
            currentLocationId: startLocationId,
            previousLocationId: null,
            travelHistory: [startLocationId],
          },
          fogOfWar: updatedFog,
          travelAvailability: {
            availableDestinations: [],
            blockedDestinations: {},
            chapterUnlockedLocations: {},
            factionUnlockedLocations: {},
          },
          revealedPaths: [],
        };

        // Compute initial travel availability
        mapState.travelAvailability = computeTravelAvailability(gameState, mapState);

        const destinations = mapState.position.currentLocationId
          ? computeAvailableDestinations(mapState.position.currentLocationId, gameState, mapState)
          : [];

        // Initialize autosave tracking for the new game
        const autosaveManager = getAutosaveManager();
        autosaveManager.initializeTracking(gameState);

        set({
          gameState,
          isLoaded: true,
          mapState,
          availableDestinations: destinations,
        });
      },

      loadGameState: (state, serializedMap) => {
        let mapState: MapState;

        if (serializedMap) {
          mapState = deserializeMapState(serializedMap, MAP_LOCATIONS.length);
        } else {
          // Reconstruct map state from game state
          const fogOfWar = createFogOfWarState(MAP_LOCATIONS);
          const updatedFog = updateFogFromGameState(fogOfWar, state, MAP_LOCATIONS);
          mapState = {
            ...createInitialMapState(MAP_LOCATIONS.length),
            fogOfWar: updatedFog,
          };
        }

        // Recompute travel availability
        mapState.travelAvailability = computeTravelAvailability(state, mapState);

        const destinations = mapState.position.currentLocationId
          ? computeAvailableDestinations(mapState.position.currentLocationId, state, mapState)
          : [];

        // Initialize autosave tracking for the loaded game
        const autosaveManager = getAutosaveManager();
        autosaveManager.initializeTracking(state);

        set({
          gameState: state,
          isLoaded: true,
          mapState,
          availableDestinations: destinations,
        });
      },

      updateGameState: (partial) => {
        const { gameState, mapState } = get();
        if (!gameState) return;

        const newGameState = { ...gameState, ...partial, savedAt: Date.now() };
        const autosaveManager = getAutosaveManager();

        // If chapter changed, update fog of war and trigger autosave
        let newMapState = mapState;
        if (partial.currentChapterId && partial.currentChapterId !== gameState.currentChapterId) {
          const updatedFog = updateFogFromGameState(mapState.fogOfWar, newGameState, MAP_LOCATIONS);
          newMapState = {
            ...mapState,
            fogOfWar: updatedFog,
          };
          newMapState.travelAvailability = computeTravelAvailability(newGameState, newMapState);
          autosaveManager.triggerChapterEnter(newGameState, partial.currentChapterId);
        }

        // If flags changed, update fog of war
        if (partial.flags) {
          const updatedFog = updateFogFromGameState(newMapState.fogOfWar, newGameState, MAP_LOCATIONS);
          newMapState = {
            ...newMapState,
            fogOfWar: updatedFog,
          };
          newMapState.travelAvailability = computeTravelAvailability(newGameState, newMapState);
        }

        // If factions changed, check for threshold crossings
        if (partial.factions) {
          autosaveManager.triggerFactionCheck(newGameState);
        }

        // If new chapters were completed, trigger autosave
        if (partial.completedChapters) {
          const newlyCompleted = partial.completedChapters.filter(
            c => !gameState.completedChapters.includes(c)
          );
          for (const chapterId of newlyCompleted) {
            autosaveManager.triggerChapterComplete(newGameState, chapterId);
          }
        }

        // If new character deaths, trigger autosave
        if (partial.deadCharacters) {
          const newlyDead = partial.deadCharacters.filter(
            c => !gameState.deadCharacters.includes(c)
          );
          for (const characterId of newlyDead) {
            autosaveManager.triggerCharacterDeath(newGameState, characterId);
          }
        }

        const destinations = newMapState.position.currentLocationId
          ? computeAvailableDestinations(newMapState.position.currentLocationId, newGameState, newMapState)
          : [];

        set({
          gameState: newGameState,
          mapState: newMapState,
          availableDestinations: destinations,
        });
      },

      // ── Map Actions ──

      setPlayerPosition: (locationId) => {
        const { gameState, mapState } = get();
        if (!gameState) return;

        const previousLocationId = mapState.position.currentLocationId;

        // Visit the new location (updates fog of war)
        const { state: newFog } = visitLocation(
          mapState.fogOfWar,
          locationId,
          MAP_LOCATIONS,
          Date.now()
        );

        const newMapState: MapState = {
          ...mapState,
          position: {
            currentLocationId: locationId,
            previousLocationId,
            travelHistory: [...mapState.position.travelHistory, locationId],
          },
          fogOfWar: newFog,
        };

        // Recompute travel availability
        newMapState.travelAvailability = computeTravelAvailability(gameState, newMapState);

        const destinations = computeAvailableDestinations(locationId, gameState, newMapState);

        set({
          mapState: newMapState,
          availableDestinations: destinations,
        });
      },

      discoverMapLocation: (locationId) => {
        const { mapState } = get();
        const { state: newFog } = discoverLocation(
          mapState.fogOfWar,
          locationId,
          MAP_LOCATIONS,
          Date.now()
        );

        set({
          mapState: {
            ...mapState,
            fogOfWar: newFog,
          },
        });
      },

      visitMapLocation: (locationId) => {
        const { mapState } = get();
        const { state: newFog } = visitLocation(
          mapState.fogOfWar,
          locationId,
          MAP_LOCATIONS,
          Date.now()
        );

        set({
          mapState: {
            ...mapState,
            fogOfWar: newFog,
          },
        });
      },

      revealPath: (pathId) => {
        const { gameState, mapState } = get();
        if (!gameState) return;

        const newMapState = revealSecretPath(pathId, mapState, gameState);

        const destinations = newMapState.position.currentLocationId
          ? computeAvailableDestinations(newMapState.position.currentLocationId, gameState, newMapState)
          : [];

        set({
          mapState: newMapState,
          availableDestinations: destinations,
        });
      },

      refreshTravelAvailability: () => {
        const { gameState, mapState } = get();
        if (!gameState) return;

        const newAvailability = computeTravelAvailability(gameState, mapState);
        const destinations = mapState.position.currentLocationId
          ? computeAvailableDestinations(mapState.position.currentLocationId, gameState, {
              ...mapState,
              travelAvailability: newAvailability,
            })
          : [];

        set({
          mapState: {
            ...mapState,
            travelAvailability: newAvailability,
          },
          availableDestinations: destinations,
        });
      },

      refreshFogOfWar: () => {
        const { gameState, mapState } = get();
        if (!gameState) return;

        const updatedFog = updateFogFromGameState(mapState.fogOfWar, gameState, MAP_LOCATIONS);

        set({
          mapState: {
            ...mapState,
            fogOfWar: updatedFog,
          },
        });
      },

      // ── Scene-Map Integration ──

      onSceneEnter: (sceneId, sceneLocation) => {
        const { gameState, mapState } = get();
        if (!gameState || !sceneLocation) return;

        // Find matching map location from scene location text
        const { findLocationBySceneText, processSceneLocation } = require('../engine/fog-of-war');

        const matchedLocation = findLocationBySceneText(sceneLocation, MAP_LOCATIONS);
        if (!matchedLocation) return;

        // Process the scene location — updates fog of war
        const {
          state: newFog,
          visitedLocationId,
        } = processSceneLocation(mapState.fogOfWar, sceneLocation, MAP_LOCATIONS, Date.now());

        if (!visitedLocationId) return;

        const previousLocationId = mapState.position.currentLocationId;
        const newMapState: MapState = {
          ...mapState,
          position: {
            currentLocationId: visitedLocationId,
            previousLocationId: previousLocationId !== visitedLocationId ? previousLocationId : mapState.position.previousLocationId,
            travelHistory:
              mapState.position.travelHistory[mapState.position.travelHistory.length - 1] === visitedLocationId
                ? mapState.position.travelHistory
                : [...mapState.position.travelHistory, visitedLocationId],
          },
          fogOfWar: newFog,
        };

        newMapState.travelAvailability = computeTravelAvailability(gameState, newMapState);

        const destinations = computeAvailableDestinations(visitedLocationId, gameState, newMapState);

        set({
          mapState: newMapState,
          availableDestinations: destinations,
        });
      },

      onChapterChange: (chapterId) => {
        const { gameState, mapState } = get();
        if (!gameState) return;

        const newGameState = { ...gameState, currentChapterId: chapterId };

        // Update fog of war for new chapter
        const updatedFog = updateFogFromGameState(mapState.fogOfWar, newGameState, MAP_LOCATIONS);

        const newMapState: MapState = {
          ...mapState,
          fogOfWar: updatedFog,
        };
        newMapState.travelAvailability = computeTravelAvailability(newGameState, newMapState);

        const destinations = newMapState.position.currentLocationId
          ? computeAvailableDestinations(newMapState.position.currentLocationId, newGameState, newMapState)
          : [];

        set({
          gameState: newGameState,
          mapState: newMapState,
          availableDestinations: destinations,
        });

        // Trigger autosave for chapter transition
        const autosaveManager = getAutosaveManager();
        autosaveManager.triggerChapterEnter(newGameState, chapterId);
      },

      // ── Persistence ──

      saveToLocal: () => {
        const { gameState, mapState } = get();
        if (!gameState) return;

        const serializedMap = serializeMapState(mapState);
        const saveData = {
          gameState: { ...gameState, savedAt: Date.now() },
          mapState: serializedMap,
          version: 1,
        };

        const key = `${LOCAL_STORAGE_PREFIX}${gameState.saveId}`;
        localStorage.setItem(key, JSON.stringify(saveData));

        // Update save index
        const indexStr = localStorage.getItem(LOCAL_SAVE_INDEX_KEY);
        const index: string[] = indexStr ? JSON.parse(indexStr) : [];
        if (!index.includes(gameState.saveId)) {
          index.push(gameState.saveId);
          localStorage.setItem(LOCAL_SAVE_INDEX_KEY, JSON.stringify(index));
        }
      },

      loadFromLocal: (saveId) => {
        const key = `${LOCAL_STORAGE_PREFIX}${saveId}`;
        const dataStr = localStorage.getItem(key);
        if (!dataStr) return false;

        try {
          const data = JSON.parse(dataStr);
          const { loadGameState } = get();
          loadGameState(data.gameState, data.mapState);
          return true;
        } catch {
          return false;
        }
      },

      getSerializedMapState: () => {
        return serializeMapState(get().mapState);
      },

      syncToCloud: async () => {
        const { gameState, mapState } = get();
        if (!gameState) return false;

        set({ isSyncing: true, syncError: null });

        try {
          const { getSupabaseClient, getCurrentUserId } = await import('../lib/supabase/client');
          const client = getSupabaseClient();
          if (!client) {
            set({ isSyncing: false });
            return false;
          }

          const userId = await getCurrentUserId();
          if (!userId) {
            set({ isSyncing: false });
            return false;
          }

          const serializedMap = serializeMapState(mapState);

          // Upsert game save with embedded map state
          const { error: saveError } = await client
            .from('game_saves')
            .upsert(
              {
                user_id: userId,
                save_id: gameState.saveId,
                player_name: gameState.playerName,
                current_chapter_id: gameState.currentChapterId,
                current_scene_id: gameState.currentSceneId,
                stats: gameState.stats,
                factions: gameState.factions,
                flags: gameState.flags,
                choice_history: gameState.choiceHistory,
                dead_characters: gameState.deadCharacters,
                unlocks: gameState.unlocks,
                completed_chapters: gameState.completedChapters,
                ng_plus_cycle: gameState.ngPlusCycle,
                achievements: gameState.achievements,
                playtime_seconds: gameState.playtimeSeconds,
                map_state: serializedMap,
              },
              { onConflict: 'user_id,save_id' }
            );

          if (saveError) throw saveError;

          // Upsert player position
          const { error: posError } = await client
            .from('player_positions')
            .upsert(
              {
                user_id: userId,
                save_id: gameState.saveId,
                current_location_id: mapState.position.currentLocationId ?? 'unknown',
                previous_location_id: mapState.position.previousLocationId,
                travel_history: mapState.position.travelHistory,
              },
              { onConflict: 'user_id,save_id' }
            );

          if (posError) throw posError;

          // Upsert travel availability
          const { error: travelError } = await client
            .from('travel_availability')
            .upsert(
              {
                user_id: userId,
                save_id: gameState.saveId,
                available_destinations: mapState.travelAvailability.availableDestinations,
                blocked_destinations: mapState.travelAvailability.blockedDestinations,
                chapter_unlocked_locations: mapState.travelAvailability.chapterUnlockedLocations,
                faction_unlocked_locations: mapState.travelAvailability.factionUnlockedLocations,
              },
              { onConflict: 'user_id,save_id' }
            );

          if (travelError) throw travelError;

          // Upsert individual map discoveries
          const discoveryRows = Object.entries(mapState.fogOfWar.locations).map(
            ([locationId, status]) => ({
              user_id: userId,
              save_id: gameState.saveId,
              location_id: locationId,
              discovery_status: status,
              discovered_at: mapState.fogOfWar.discoveryTimestamps[locationId]
                ? new Date(mapState.fogOfWar.discoveryTimestamps[locationId]).toISOString()
                : new Date().toISOString(),
              visited_at: status === 'visited' ? new Date().toISOString() : null,
            })
          );

          if (discoveryRows.length > 0) {
            const { error: discError } = await client
              .from('map_discoveries')
              .upsert(discoveryRows, {
                onConflict: 'user_id,save_id,location_id',
              });
            if (discError) throw discError;
          }

          set({ isSyncing: false, lastSyncedAt: Date.now(), syncError: null });
          return true;
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Cloud sync failed';
          set({ isSyncing: false, syncError: message });
          return false;
        }
      },

      loadFromCloud: async (saveId) => {
        set({ isSyncing: true, syncError: null });

        try {
          const { getSupabaseClient, getCurrentUserId } = await import('../lib/supabase/client');
          const client = getSupabaseClient();
          if (!client) {
            set({ isSyncing: false });
            return false;
          }

          const userId = await getCurrentUserId();
          if (!userId) {
            set({ isSyncing: false });
            return false;
          }

          // Load game save with embedded map state
          const { data: saveData, error: saveError } = await client
            .from('game_saves')
            .select('*')
            .eq('user_id', userId)
            .eq('save_id', saveId)
            .single();

          if (saveError || !saveData) {
            set({ isSyncing: false, syncError: 'Save not found' });
            return false;
          }

          // Reconstruct GameState from DB
          const gameState: GameState = {
            saveId: saveData.save_id,
            playerName: saveData.player_name,
            currentChapterId: saveData.current_chapter_id,
            currentSceneId: saveData.current_scene_id,
            stats: saveData.stats as GameState['stats'],
            factions: saveData.factions as GameState['factions'],
            flags: saveData.flags as Record<string, boolean>,
            choiceHistory: saveData.choice_history as GameState['choiceHistory'],
            deadCharacters: saveData.dead_characters,
            unlocks: saveData.unlocks,
            completedChapters: saveData.completed_chapters,
            ngPlusCycle: saveData.ng_plus_cycle,
            achievements: saveData.achievements,
            playtimeSeconds: saveData.playtime_seconds,
            savedAt: new Date(saveData.updated_at).getTime(),
          };

          // Load map state
          const mapStateData = saveData.map_state as SerializedMapState | null;
          const { loadGameState } = get();
          loadGameState(gameState, mapStateData ?? undefined);

          set({ isSyncing: false, lastSyncedAt: Date.now() });
          return true;
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to load from cloud';
          set({ isSyncing: false, syncError: message });
          return false;
        }
      },

      resetAll: () => {
        set({
          gameState: null,
          isLoaded: false,
          mapState: createInitialMapState(MAP_LOCATIONS.length),
          availableDestinations: [],
          lastSyncedAt: null,
          syncError: null,
          isSyncing: false,
        });
      },
    }),
    {
      name: 'crowns-of-ash-active-game',
      storage: createJSONStorage(() => {
        // Safe localStorage access for SSR
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({
        gameState: state.gameState,
        mapState: state.mapState,
        lastSyncedAt: state.lastSyncedAt,
      }),
    }
  )
);
