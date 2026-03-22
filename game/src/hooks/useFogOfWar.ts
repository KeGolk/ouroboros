'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { MapLocation, FogOfWarState, LocationId, DiscoveryStatus } from '../engine/fog-of-war';
import {
  createFogOfWarState,
  getLocationStatus,
  processSceneLocation,
  updateFogFromGameState,
  discoverLocation,
  visitLocation,
  getExplorationProgress,
  serializeFogState,
  deserializeFogState,
} from '../engine/fog-of-war';
import type { GameState } from '../engine/types';

const FOG_STORAGE_KEY = 'ashen_crown_fog_of_war';

interface UseFogOfWarOptions {
  /** All map locations */
  locations: MapLocation[];
  /** Current game state for auto-discovery */
  gameState?: GameState;
  /** Whether to persist to localStorage */
  persist?: boolean;
  /** Storage key override */
  storageKey?: string;
}

interface UseFogOfWarReturn {
  /** Current fog of war state */
  fogState: FogOfWarState;
  /** Get status of a specific location */
  getStatus: (locationId: LocationId) => DiscoveryStatus;
  /** Process a scene location string (auto-discovers matching map location) */
  processScene: (sceneLocation: string) => {
    visitedLocationId: LocationId | null;
    newlyDiscovered: LocationId[];
    newlyRumored: LocationId[];
  };
  /** Manually discover a location */
  discover: (locationId: LocationId) => void;
  /** Manually visit a location */
  visit: (locationId: LocationId) => void;
  /** Reset fog to initial state */
  reset: () => void;
  /** Exploration progress stats */
  progress: ReturnType<typeof getExplorationProgress>;
  /** Whether any new discoveries happened since last acknowledgment */
  hasNewDiscoveries: boolean;
  /** Acknowledge new discoveries (clears the flag) */
  acknowledgeDiscoveries: () => void;
  /** List of newly discovered location IDs since last ack */
  newDiscoveries: LocationId[];
}

export function useFogOfWar({
  locations,
  gameState,
  persist = true,
  storageKey = FOG_STORAGE_KEY,
}: UseFogOfWarOptions): UseFogOfWarReturn {
  const [fogState, setFogState] = useState<FogOfWarState>(() => {
    // Try loading from localStorage
    if (persist && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          return deserializeFogState(saved);
        }
      } catch {
        // Fall through to default
      }
    }
    return createFogOfWarState(locations);
  });

  const [newDiscoveries, setNewDiscoveries] = useState<LocationId[]>([]);
  const prevGameStateRef = useRef<GameState | undefined>(undefined);

  // Persist to localStorage on state changes
  useEffect(() => {
    if (persist && typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, serializeFogState(fogState));
      } catch {
        // localStorage might be full or unavailable
      }
    }
  }, [fogState, persist, storageKey]);

  // Auto-update fog when game state changes
  useEffect(() => {
    if (!gameState || gameState === prevGameStateRef.current) return;
    prevGameStateRef.current = gameState;

    setFogState(prev => updateFogFromGameState(prev, gameState, locations));
  }, [gameState, locations]);

  const getStatus = useCallback(
    (locationId: LocationId): DiscoveryStatus => {
      return getLocationStatus(fogState, locationId);
    },
    [fogState]
  );

  const processScene = useCallback(
    (sceneLocation: string) => {
      const result = processSceneLocation(fogState, sceneLocation, locations);
      if (result.visitedLocationId) {
        setFogState(result.state);
        const allNew = [...result.newlyDiscovered, ...result.newlyRumored];
        if (allNew.length > 0) {
          setNewDiscoveries(prev => [...prev, ...allNew]);
        }
      }
      return {
        visitedLocationId: result.visitedLocationId,
        newlyDiscovered: result.newlyDiscovered,
        newlyRumored: result.newlyRumored,
      };
    },
    [fogState, locations]
  );

  const discover = useCallback(
    (locationId: LocationId) => {
      const result = discoverLocation(fogState, locationId, locations);
      setFogState(result.state);
      if (result.newlyDiscovered.length > 0 || result.newlyRumored.length > 0) {
        setNewDiscoveries(prev => [...prev, ...result.newlyDiscovered]);
      }
    },
    [fogState, locations]
  );

  const visit = useCallback(
    (locationId: LocationId) => {
      const result = visitLocation(fogState, locationId, locations);
      setFogState(result.state);
      if (result.newlyDiscovered.length > 0) {
        setNewDiscoveries(prev => [...prev, ...result.newlyDiscovered]);
      }
    },
    [fogState, locations]
  );

  const reset = useCallback(() => {
    const freshState = createFogOfWarState(locations);
    setFogState(freshState);
    setNewDiscoveries([]);
    if (persist && typeof window !== 'undefined') {
      try {
        localStorage.removeItem(storageKey);
      } catch {
        // ignore
      }
    }
  }, [locations, persist, storageKey]);

  const acknowledgeDiscoveries = useCallback(() => {
    setNewDiscoveries([]);
  }, []);

  const progress = getExplorationProgress(fogState);

  return {
    fogState,
    getStatus,
    processScene,
    discover,
    visit,
    reset,
    progress,
    hasNewDiscoveries: newDiscoveries.length > 0,
    acknowledgeDiscoveries,
    newDiscoveries,
  };
}

export default useFogOfWar;
