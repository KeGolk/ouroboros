/**
 * Map State Types
 *
 * Defines the complete map state that gets persisted to both
 * localStorage (offline) and Supabase (cloud sync).
 * Bridges the fog-of-war engine with the persistence layer.
 */

import type { DiscoveryStatus, FogOfWarState } from '../engine/fog-of-war';

// ─── Player Position ────────────────────────────────────────────────

export interface PlayerPosition {
  /** Current location ID on the world map */
  currentLocationId: string | null;
  /** Previous location (for "go back" functionality) */
  previousLocationId: string | null;
  /** Ordered list of all locations visited (travel log) */
  travelHistory: string[];
}

// ─── Travel Availability ────────────────────────────────────────────

export interface TravelAvailability {
  /** Location IDs the player can currently travel to */
  availableDestinations: string[];
  /** Blocked destinations with reason strings */
  blockedDestinations: Record<string, string>;
  /** Locations unlocked by reaching specific chapters */
  chapterUnlockedLocations: Record<string, string[]>;
  /** Locations unlocked by faction reputation thresholds */
  factionUnlockedLocations: Record<string, string[]>;
}

// ─── Complete Map State (persisted) ─────────────────────────────────

export interface MapState {
  /** Player's current position on the map */
  position: PlayerPosition;
  /** Fog of war / discovery state */
  fogOfWar: FogOfWarState;
  /** Travel availability computed from game state */
  travelAvailability: TravelAvailability;
  /** IDs of paths that have been revealed (secret paths) */
  revealedPaths: string[];
}

// ─── Serialized format for localStorage/Supabase ────────────────────

export interface SerializedMapState {
  current_location_id: string | null;
  previous_location_id: string | null;
  fog_of_war: Record<string, DiscoveryStatus>;
  discovery_timestamps: Record<string, number>;
  travel_history: string[];
  available_destinations: string[];
  revealed_paths: string[];
}

/**
 * Serialize MapState for storage.
 */
export function serializeMapState(state: MapState): SerializedMapState {
  return {
    current_location_id: state.position.currentLocationId,
    previous_location_id: state.position.previousLocationId,
    fog_of_war: state.fogOfWar.locations,
    discovery_timestamps: state.fogOfWar.discoveryTimestamps,
    travel_history: state.position.travelHistory,
    available_destinations: state.travelAvailability.availableDestinations,
    revealed_paths: state.revealedPaths,
  };
}

/**
 * Deserialize MapState from storage.
 */
export function deserializeMapState(
  data: SerializedMapState,
  totalLocations: number
): MapState {
  const fogLocations = data.fog_of_war ?? {};
  const revealedCount = Object.values(fogLocations).filter(
    (s) => s === 'discovered' || s === 'visited'
  ).length;

  return {
    position: {
      currentLocationId: data.current_location_id,
      previousLocationId: data.previous_location_id,
      travelHistory: data.travel_history ?? [],
    },
    fogOfWar: {
      locations: fogLocations,
      discoveryTimestamps: data.discovery_timestamps ?? {},
      totalLocations,
      revealedCount,
    },
    travelAvailability: {
      availableDestinations: data.available_destinations ?? [],
      blockedDestinations: {},
      chapterUnlockedLocations: {},
      factionUnlockedLocations: {},
    },
    revealedPaths: data.revealed_paths ?? [],
  };
}

/**
 * Create a fresh initial map state.
 */
export function createInitialMapState(totalLocations: number): MapState {
  return {
    position: {
      currentLocationId: null,
      previousLocationId: null,
      travelHistory: [],
    },
    fogOfWar: {
      locations: {},
      discoveryTimestamps: {},
      totalLocations,
      revealedCount: 0,
    },
    travelAvailability: {
      availableDestinations: [],
      blockedDestinations: {},
      chapterUnlockedLocations: {},
      factionUnlockedLocations: {},
    },
    revealedPaths: [],
  };
}
