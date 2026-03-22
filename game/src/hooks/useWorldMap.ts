/**
 * useWorldMap — React hook for world map state integration
 *
 * Provides a clean interface for components to:
 *   - Read current map state (position, fog of war, destinations)
 *   - Travel to locations
 *   - Query location discovery status
 *   - Get chapter/faction-specific available locations
 *
 * Bridges the game store with the world map UI components.
 */

import { useCallback, useMemo } from 'react';
import { useGameStore } from '../stores/game-store';
import { MAP_LOCATIONS } from '../data/map-locations';
import { WORLD_MAP_DATA } from '../data/world-map';
import type { TravelDestination } from '../engine/travel';
import { getExplorationProgress, getLocationsByStatus, type DiscoveryStatus } from '../engine/fog-of-war';

// ─── Hook Return Type ───────────────────────────────────────────────

interface UseWorldMapReturn {
  // ── Position ──
  currentLocationId: string | null;
  previousLocationId: string | null;
  travelHistory: string[];

  // ── Discovery ──
  getLocationDiscoveryStatus: (locationId: string) => DiscoveryStatus;
  isLocationDiscovered: (locationId: string) => boolean;
  isLocationVisited: (locationId: string) => boolean;
  explorationProgress: {
    percentage: number;
    discovered: number;
    visited: number;
    rumored: number;
    undiscovered: number;
    total: number;
  };

  // ── Travel ──
  availableDestinations: TravelDestination[];
  canTravelTo: (locationId: string) => boolean;
  getBlockedReason: (locationId: string) => string | undefined;
  travelTo: (locationId: string) => void;

  // ── Chapter/Faction Context ──
  chapterLocations: string[];
  factionLocations: Record<string, string[]>;

  // ── Secret Paths ──
  revealedPaths: string[];
  revealPath: (pathId: string) => void;
  isPathRevealed: (pathId: string) => boolean;

  // ── Location Data ──
  getLocationData: (locationId: string) => typeof MAP_LOCATIONS[0] | undefined;
  getWorldMapLocationData: (locationId: string) => typeof WORLD_MAP_DATA.locations[0] | undefined;
  allMapLocations: typeof MAP_LOCATIONS;

  // ── Persistence ──
  saveMapState: () => void;
  syncToCloud: () => Promise<boolean>;
  isSyncing: boolean;
  lastSyncedAt: number | null;
}

// ─── Hook Implementation ────────────────────────────────────────────

export function useWorldMap(): UseWorldMapReturn {
  const {
    gameState,
    mapState,
    availableDestinations,
    setPlayerPosition,
    revealPath: storeRevealPath,
    saveToLocal,
    syncToCloud,
    isSyncing,
    lastSyncedAt,
  } = useGameStore();

  // ── Position ──

  const currentLocationId = mapState.position.currentLocationId;
  const previousLocationId = mapState.position.previousLocationId;
  const travelHistory = mapState.position.travelHistory;

  // ── Discovery ──

  const getLocationDiscoveryStatus = useCallback(
    (locationId: string): DiscoveryStatus => {
      return mapState.fogOfWar.locations[locationId] ?? 'undiscovered';
    },
    [mapState.fogOfWar.locations]
  );

  const isLocationDiscovered = useCallback(
    (locationId: string): boolean => {
      const status = mapState.fogOfWar.locations[locationId];
      return status === 'discovered' || status === 'visited';
    },
    [mapState.fogOfWar.locations]
  );

  const isLocationVisited = useCallback(
    (locationId: string): boolean => {
      return mapState.fogOfWar.locations[locationId] === 'visited';
    },
    [mapState.fogOfWar.locations]
  );

  const explorationProgress = useMemo(
    () => getExplorationProgress(mapState.fogOfWar),
    [mapState.fogOfWar]
  );

  // ── Travel ──

  const canTravelTo = useCallback(
    (locationId: string): boolean => {
      return availableDestinations.some(
        (d) => d.locationId === locationId && d.isAccessible
      );
    },
    [availableDestinations]
  );

  const getBlockedReason = useCallback(
    (locationId: string): string | undefined => {
      return mapState.travelAvailability.blockedDestinations[locationId];
    },
    [mapState.travelAvailability.blockedDestinations]
  );

  const travelTo = useCallback(
    (locationId: string) => {
      setPlayerPosition(locationId);
      // Auto-save after travel
      saveToLocal();
    },
    [setPlayerPosition, saveToLocal]
  );

  // ── Chapter/Faction Context ──

  const chapterLocations = useMemo(() => {
    if (!gameState) return [];
    return mapState.travelAvailability.chapterUnlockedLocations[gameState.currentChapterId] ?? [];
  }, [gameState, mapState.travelAvailability.chapterUnlockedLocations]);

  const factionLocations = useMemo(
    () => mapState.travelAvailability.factionUnlockedLocations,
    [mapState.travelAvailability.factionUnlockedLocations]
  );

  // ── Secret Paths ──

  const revealedPaths = mapState.revealedPaths;

  const revealPath = useCallback(
    (pathId: string) => {
      storeRevealPath(pathId);
    },
    [storeRevealPath]
  );

  const isPathRevealed = useCallback(
    (pathId: string): boolean => {
      const path = WORLD_MAP_DATA.paths.find((p) => p.id === pathId);
      if (!path) return false;
      return path.isDiscovered || mapState.revealedPaths.includes(pathId);
    },
    [mapState.revealedPaths]
  );

  // ── Location Data ──

  const getLocationData = useCallback(
    (locationId: string) => {
      return MAP_LOCATIONS.find((l) => l.id === locationId);
    },
    []
  );

  const getWorldMapLocationData = useCallback(
    (locationId: string) => {
      return WORLD_MAP_DATA.locations.find((l) => l.id === locationId);
    },
    []
  );

  // ── Persistence ──

  const saveMapState = useCallback(() => {
    saveToLocal();
  }, [saveToLocal]);

  return {
    currentLocationId,
    previousLocationId,
    travelHistory,
    getLocationDiscoveryStatus,
    isLocationDiscovered,
    isLocationVisited,
    explorationProgress,
    availableDestinations,
    canTravelTo,
    getBlockedReason,
    travelTo,
    chapterLocations,
    factionLocations,
    revealedPaths,
    revealPath,
    isPathRevealed,
    getLocationData,
    getWorldMapLocationData,
    allMapLocations: MAP_LOCATIONS,
    saveMapState,
    syncToCloud,
    isSyncing,
    lastSyncedAt,
  };
}
