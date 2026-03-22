/**
 * Fog of War Engine
 *
 * Tracks discovered/undiscovered locations on the world map
 * based on player progress through chapters and scenes.
 * Locations are revealed when:
 *   - The player visits a scene set in that location
 *   - The player completes a chapter that references the location
 *   - A story flag unlocks the location explicitly
 *   - An adjacent location is discovered (partial reveal / "heard of")
 */

import type { GameState } from './types';

// ─── Types ──────────────────────────────────────────────────────────────────

export type LocationId = string;

export type DiscoveryStatus = 'undiscovered' | 'rumored' | 'discovered' | 'visited';

export interface MapLocation {
  id: LocationId;
  name: string;
  /** Short description shown when discovered */
  description: string;
  /** Extended lore shown when visited */
  lore?: string;
  /** Grid coordinates for map placement (percentage-based, 0-100) */
  x: number;
  y: number;
  /** Which region/area this belongs to */
  region: string;
  /** Faction that controls this location, if any */
  controllingFaction?: string;
  /** Adjacent location IDs — discovering this location rumors adjacent ones */
  adjacentLocations: LocationId[];
  /** Scene location strings that map to this location (from scene.location) */
  sceneLocationPatterns: string[];
  /** Chapters that reveal this location when entered */
  revealedByChapters?: number[];
  /** Story flags that reveal this location when set */
  revealedByFlags?: string[];
  /** Is this location visible from the start? */
  startsDiscovered?: boolean;
  /** AI art prompt for the map marker/icon */
  imagePrompt: string;
  /** Location type for map icon styling */
  locationType: 'city' | 'castle' | 'village' | 'wilderness' | 'ruins' | 'stronghold' | 'temple' | 'landmark';
  /** Is this a major location (larger on map)? */
  isMajor?: boolean;
}

export interface FogOfWarState {
  /** Map of locationId -> discovery status */
  locations: Record<LocationId, DiscoveryStatus>;
  /** Timestamps of when locations were first discovered */
  discoveryTimestamps: Record<LocationId, number>;
  /** Total locations on the map */
  totalLocations: number;
  /** Count of discovered + visited locations */
  revealedCount: number;
}

// ─── Discovery Logic ────────────────────────────────────────────────────────

/**
 * Creates an initial fog of war state from the location registry.
 */
export function createFogOfWarState(locations: MapLocation[]): FogOfWarState {
  const state: FogOfWarState = {
    locations: {},
    discoveryTimestamps: {},
    totalLocations: locations.length,
    revealedCount: 0,
  };

  for (const loc of locations) {
    if (loc.startsDiscovered) {
      state.locations[loc.id] = 'discovered';
      state.discoveryTimestamps[loc.id] = 0;
      state.revealedCount++;
    } else {
      state.locations[loc.id] = 'undiscovered';
    }
  }

  return state;
}

/**
 * Gets the discovery status for a location.
 */
export function getLocationStatus(
  state: FogOfWarState,
  locationId: LocationId
): DiscoveryStatus {
  return state.locations[locationId] ?? 'undiscovered';
}

/**
 * Reveals a location and optionally rumors its neighbors.
 * Returns a new state (immutable).
 */
export function discoverLocation(
  state: FogOfWarState,
  locationId: LocationId,
  locations: MapLocation[],
  timestamp: number = Date.now()
): { state: FogOfWarState; newlyDiscovered: LocationId[]; newlyRumored: LocationId[] } {
  const newState = deepCopyFogState(state);
  const newlyDiscovered: LocationId[] = [];
  const newlyRumored: LocationId[] = [];

  const currentStatus = newState.locations[locationId];

  // Only upgrade status, never downgrade
  if (currentStatus === 'undiscovered' || currentStatus === 'rumored') {
    newState.locations[locationId] = 'discovered';
    if (!newState.discoveryTimestamps[locationId]) {
      newState.discoveryTimestamps[locationId] = timestamp;
    }
    newlyDiscovered.push(locationId);
    if (currentStatus === 'undiscovered') {
      newState.revealedCount++;
    }
  }

  // Rumor adjacent locations
  const location = locations.find(l => l.id === locationId);
  if (location) {
    for (const adjId of location.adjacentLocations) {
      if (newState.locations[adjId] === 'undiscovered') {
        newState.locations[adjId] = 'rumored';
        newlyRumored.push(adjId);
      }
    }
  }

  return { state: newState, newlyDiscovered, newlyRumored };
}

/**
 * Marks a location as visited (highest discovery level).
 */
export function visitLocation(
  state: FogOfWarState,
  locationId: LocationId,
  locations: MapLocation[],
  timestamp: number = Date.now()
): { state: FogOfWarState; newlyDiscovered: LocationId[]; newlyRumored: LocationId[] } {
  // First ensure it's discovered
  const { state: discoveredState, newlyDiscovered, newlyRumored } = discoverLocation(
    state,
    locationId,
    locations,
    timestamp
  );

  const newState = deepCopyFogState(discoveredState);
  newState.locations[locationId] = 'visited';
  if (!newState.discoveryTimestamps[locationId]) {
    newState.discoveryTimestamps[locationId] = timestamp;
  }

  return { state: newState, newlyDiscovered, newlyRumored };
}

/**
 * Processes a scene's location string and updates fog of war accordingly.
 * Matches scene location text against location patterns to find which map location
 * the player is currently visiting.
 */
export function processSceneLocation(
  fogState: FogOfWarState,
  sceneLocation: string,
  locations: MapLocation[],
  timestamp: number = Date.now()
): { state: FogOfWarState; visitedLocationId: LocationId | null; newlyDiscovered: LocationId[]; newlyRumored: LocationId[] } {
  const matchedLocation = findLocationBySceneText(sceneLocation, locations);

  if (!matchedLocation) {
    return { state: fogState, visitedLocationId: null, newlyDiscovered: [], newlyRumored: [] };
  }

  const result = visitLocation(fogState, matchedLocation.id, locations, timestamp);
  return {
    ...result,
    visitedLocationId: matchedLocation.id,
  };
}

/**
 * Finds a map location that matches a scene's location text.
 */
export function findLocationBySceneText(
  sceneLocation: string,
  locations: MapLocation[]
): MapLocation | null {
  const normalizedScene = sceneLocation.toLowerCase().trim();

  for (const loc of locations) {
    for (const pattern of loc.sceneLocationPatterns) {
      const normalizedPattern = pattern.toLowerCase().trim();
      // Support wildcard patterns with *
      if (normalizedPattern.includes('*')) {
        const regex = new RegExp(
          '^' + normalizedPattern.replace(/\*/g, '.*') + '$',
          'i'
        );
        if (regex.test(normalizedScene)) {
          return loc;
        }
      } else if (normalizedScene.includes(normalizedPattern) || normalizedPattern.includes(normalizedScene)) {
        return loc;
      }
    }
  }
  return null;
}

/**
 * Checks story flags and chapter progress to auto-reveal locations.
 */
export function updateFogFromGameState(
  fogState: FogOfWarState,
  gameState: GameState,
  locations: MapLocation[],
  timestamp: number = Date.now()
): FogOfWarState {
  let currentFog = deepCopyFogState(fogState);

  for (const loc of locations) {
    // Already visited — nothing more to do
    if (currentFog.locations[loc.id] === 'visited') continue;

    // Check chapter-based reveals
    if (loc.revealedByChapters) {
      for (const chNum of loc.revealedByChapters) {
        const chapterId = `chapter_${chNum}`;
        if (
          gameState.completedChapters.includes(chapterId) ||
          gameState.currentChapterId === chapterId
        ) {
          const result = discoverLocation(currentFog, loc.id, locations, timestamp);
          currentFog = result.state;
          break;
        }
      }
    }

    // Check flag-based reveals
    if (loc.revealedByFlags) {
      for (const flag of loc.revealedByFlags) {
        if (gameState.flags[flag]) {
          const result = discoverLocation(currentFog, loc.id, locations, timestamp);
          currentFog = result.state;
          break;
        }
      }
    }
  }

  return currentFog;
}

/**
 * Gets exploration progress as a percentage.
 */
export function getExplorationProgress(state: FogOfWarState): {
  percentage: number;
  discovered: number;
  visited: number;
  rumored: number;
  undiscovered: number;
  total: number;
} {
  let discovered = 0;
  let visited = 0;
  let rumored = 0;
  let undiscovered = 0;

  for (const status of Object.values(state.locations)) {
    switch (status) {
      case 'discovered':
        discovered++;
        break;
      case 'visited':
        visited++;
        break;
      case 'rumored':
        rumored++;
        break;
      case 'undiscovered':
        undiscovered++;
        break;
    }
  }

  const total = state.totalLocations;
  const revealedCount = discovered + visited;
  const percentage = total > 0 ? Math.round((revealedCount / total) * 100) : 0;

  return { percentage, discovered, visited, rumored, undiscovered, total };
}

/**
 * Gets all locations grouped by their discovery status.
 */
export function getLocationsByStatus(
  state: FogOfWarState,
  locations: MapLocation[]
): Record<DiscoveryStatus, MapLocation[]> {
  const result: Record<DiscoveryStatus, MapLocation[]> = {
    undiscovered: [],
    rumored: [],
    discovered: [],
    visited: [],
  };

  for (const loc of locations) {
    const status = state.locations[loc.id] ?? 'undiscovered';
    result[status].push(loc);
  }

  return result;
}

/**
 * Serializes fog state for save/load.
 */
export function serializeFogState(state: FogOfWarState): string {
  return JSON.stringify(state);
}

/**
 * Deserializes fog state from save data.
 */
export function deserializeFogState(data: string): FogOfWarState {
  return JSON.parse(data);
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function deepCopyFogState(state: FogOfWarState): FogOfWarState {
  return {
    locations: { ...state.locations },
    discoveryTimestamps: { ...state.discoveryTimestamps },
    totalLocations: state.totalLocations,
    revealedCount: state.revealedCount,
  };
}
