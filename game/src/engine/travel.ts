/**
 * Travel System
 *
 * Computes available travel destinations based on:
 *   - Current position on the world map
 *   - Connected paths (discovered and passable)
 *   - Current chapter (some locations only accessible in certain chapters)
 *   - Faction standing (some locations gated by reputation)
 *   - Story flags (secret paths, blocked routes)
 *   - Fog of war status (must be at least rumored)
 */

import type { GameState, FactionId } from './types';
import type { MapState, TravelAvailability } from '../types/map-state';
import type { FogOfWarState, DiscoveryStatus, MapLocation } from './fog-of-war';
import {
  WORLD_MAP_DATA,
  type MapPath,
  type LocationId,
} from '../data/world-map';
import { MAP_LOCATIONS } from '../data/map-locations';

// ─── Faction Reputation Thresholds ──────────────────────────────────

/** Minimum faction reputation to enter a faction's controlled territory */
const FACTION_TERRITORY_MIN_REP = -30;

/** Reputation thresholds for special faction locations */
const FACTION_LOCATION_THRESHOLDS: Record<string, { faction: string; minRep: number }> = {
  // Ashen Conclave locations require at least neutral standing
  ashenveil: { faction: 'ashenConclave', minRep: -20 },
  oracle_spire: { faction: 'ashenConclave', minRep: 20 },
  // Verdant Pact hidden locations require friendship
  druids_glen: { faction: 'verdantPact', minRep: 30 },
  // Obsidian Guild underground requires trust
  undermarket: { faction: 'obsidianGuild', minRep: 10 },
};

// ─── Chapter-Based Location Access ──────────────────────────────────

/**
 * Locations that become accessible (or blocked) based on the current chapter.
 * Format: { locationId: { availableFrom: chapterNumber, availableUntil?: chapterNumber } }
 */
const CHAPTER_ACCESS_RULES: Record<string, { availableFrom: number; availableUntil?: number }> = {
  the_pale_wastes: { availableFrom: 10 },
  sunken_cathedral: { availableFrom: 4 },
  ashenmere: { availableFrom: 5 },
};

// ─── Core Travel Computation ────────────────────────────────────────

export interface TravelDestination {
  locationId: string;
  locationName: string;
  pathId: string;
  pathName: string;
  pathType: string;
  travelTime: string;
  dangerLevel: number;
  isAccessible: boolean;
  blockedReason?: string;
}

/**
 * Compute all available travel destinations from the player's current position.
 */
export function computeAvailableDestinations(
  currentLocationId: string,
  gameState: GameState,
  mapState: MapState
): TravelDestination[] {
  const destinations: TravelDestination[] = [];
  const currentChapter = extractChapterNumber(gameState.currentChapterId);

  // Get all paths from current location
  const connectedPaths = WORLD_MAP_DATA.paths.filter(
    (p) => p.from === currentLocationId || p.to === currentLocationId
  );

  for (const path of connectedPaths) {
    const destId = path.from === currentLocationId ? path.to : path.from;
    const destLocation = WORLD_MAP_DATA.locations.find((l) => l.id === destId);

    if (!destLocation) continue;

    // Check if path is known
    const pathKnown = path.isDiscovered || mapState.revealedPaths.includes(path.id);
    if (!pathKnown) continue;

    // Check fog of war — destination must be at least rumored
    const fogStatus = mapState.fogOfWar.locations[destId] ?? 'undiscovered';
    if (fogStatus === 'undiscovered') continue;

    // Determine accessibility
    const { accessible, reason } = checkLocationAccessibility(
      destId,
      destLocation,
      path,
      currentChapter,
      gameState,
      mapState
    );

    destinations.push({
      locationId: destId,
      locationName: destLocation.name,
      pathId: path.id,
      pathName: path.name,
      pathType: path.type,
      travelTime: path.travelTime,
      dangerLevel: Math.max(path.dangerLevel, destLocation.dangerLevel),
      isAccessible: accessible,
      blockedReason: reason,
    });
  }

  return destinations;
}

/**
 * Check if a specific location is accessible given current game state.
 */
function checkLocationAccessibility(
  locationId: string,
  location: (typeof WORLD_MAP_DATA.locations)[0],
  path: MapPath,
  currentChapter: number,
  gameState: GameState,
  mapState: MapState
): { accessible: boolean; reason?: string } {
  // Check if path is passable
  if (!path.isPassable) {
    return { accessible: false, reason: 'The path is impassable.' };
  }

  // Check if location itself is accessible
  if (!location.isAccessible) {
    return { accessible: false, reason: `${location.name} is not accessible.` };
  }

  // Check chapter-based access rules
  const chapterRule = CHAPTER_ACCESS_RULES[locationId];
  if (chapterRule) {
    if (currentChapter < chapterRule.availableFrom) {
      return {
        accessible: false,
        reason: `This location is not yet accessible in the current chapter.`,
      };
    }
    if (chapterRule.availableUntil && currentChapter > chapterRule.availableUntil) {
      return {
        accessible: false,
        reason: `This location is no longer accessible.`,
      };
    }
  }

  // Check faction reputation requirements
  const factionReq = FACTION_LOCATION_THRESHOLDS[locationId];
  if (factionReq) {
    const factionRep = getFactionReputation(gameState, factionReq.faction);
    if (factionRep < factionReq.minRep) {
      return {
        accessible: false,
        reason: `Your reputation with the controlling faction is too low.`,
      };
    }
  }

  // Check general faction territory access
  if (location.controlledBy) {
    const factionRep = getFactionReputation(gameState, location.controlledBy);
    if (factionRep < FACTION_TERRITORY_MIN_REP) {
      return {
        accessible: false,
        reason: `You are unwelcome in ${location.controlledBy} territory.`,
      };
    }
  }

  return { accessible: true };
}

/**
 * Update the full TravelAvailability based on current game state.
 * This is called whenever the game state changes.
 */
export function computeTravelAvailability(
  gameState: GameState,
  mapState: MapState
): TravelAvailability {
  const currentLocationId = mapState.position.currentLocationId;
  const currentChapter = extractChapterNumber(gameState.currentChapterId);

  // Compute available destinations from current position
  let availableDestinations: string[] = [];
  const blockedDestinations: Record<string, string> = {};

  if (currentLocationId) {
    const destinations = computeAvailableDestinations(
      currentLocationId,
      gameState,
      mapState
    );

    for (const dest of destinations) {
      if (dest.isAccessible) {
        availableDestinations.push(dest.locationId);
      } else if (dest.blockedReason) {
        blockedDestinations[dest.locationId] = dest.blockedReason;
      }
    }
  }

  // Compute chapter-unlocked locations
  const chapterUnlockedLocations: Record<string, string[]> = {};
  for (const location of WORLD_MAP_DATA.locations) {
    for (const chId of location.chapterIds) {
      const chNum = extractChapterNumber(chId);
      const key = `chapter_${chNum}`;
      if (!chapterUnlockedLocations[key]) {
        chapterUnlockedLocations[key] = [];
      }
      chapterUnlockedLocations[key].push(location.id);
    }
  }

  // Compute faction-unlocked locations
  const factionUnlockedLocations: Record<string, string[]> = {};
  for (const location of WORLD_MAP_DATA.locations) {
    if (location.controlledBy) {
      const faction = location.controlledBy;
      if (!factionUnlockedLocations[faction]) {
        factionUnlockedLocations[faction] = [];
      }
      const factionRep = getFactionReputation(gameState, faction);
      if (factionRep >= FACTION_TERRITORY_MIN_REP) {
        factionUnlockedLocations[faction].push(location.id);
      }
    }
  }

  return {
    availableDestinations,
    blockedDestinations,
    chapterUnlockedLocations,
    factionUnlockedLocations,
  };
}

/**
 * Process a travel action: move to a new location and update map state.
 * Returns the updated MapState.
 */
export function travelToLocation(
  destinationId: string,
  mapState: MapState,
  gameState: GameState,
  allLocations: MapLocation[]
): MapState {
  const currentLocationId = mapState.position.currentLocationId;

  // Import fog-of-war functions inline to avoid circular deps
  const { visitLocation } = require('./fog-of-war');

  // Update fog of war — mark destination as visited
  const { state: newFogState } = visitLocation(
    mapState.fogOfWar,
    destinationId,
    allLocations,
    Date.now()
  );

  // Update position
  const newPosition = {
    currentLocationId: destinationId,
    previousLocationId: currentLocationId,
    travelHistory: [...mapState.position.travelHistory, destinationId],
  };

  // Build new map state
  const newMapState: MapState = {
    ...mapState,
    position: newPosition,
    fogOfWar: newFogState,
  };

  // Recompute travel availability from new position
  newMapState.travelAvailability = computeTravelAvailability(gameState, newMapState);

  return newMapState;
}

/**
 * Reveal a secret path and update map state.
 */
export function revealSecretPath(
  pathId: string,
  mapState: MapState,
  gameState: GameState
): MapState {
  if (mapState.revealedPaths.includes(pathId)) {
    return mapState; // Already revealed
  }

  const newMapState: MapState = {
    ...mapState,
    revealedPaths: [...mapState.revealedPaths, pathId],
  };

  // Recompute travel availability since new paths may be available
  newMapState.travelAvailability = computeTravelAvailability(gameState, newMapState);

  return newMapState;
}

// ─── Helpers ────────────────────────────────────────────────────────

/**
 * Extract chapter number from chapter ID (e.g., "chapter_3" -> 3).
 */
function extractChapterNumber(chapterId: string): number {
  const match = chapterId.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 1;
}

/**
 * Get faction reputation from the engine game state.
 * Maps between the two faction ID systems.
 */
function getFactionReputation(gameState: GameState, factionIdOrName: string): number {
  // Map from factions.ts IDs to engine types.ts IDs
  const factionMapping: Record<string, keyof typeof gameState.factions> = {
    ironThrone: 'iron_throne',
    ashenConclave: 'shadow_guild',
    verdantPact: 'peoples_front',
    obsidianGuild: 'old_faith',
    // Direct mapping for engine IDs
    iron_throne: 'iron_throne',
    shadow_guild: 'shadow_guild',
    peoples_front: 'peoples_front',
    old_faith: 'old_faith',
  };

  const engineFactionId = factionMapping[factionIdOrName];
  if (engineFactionId && engineFactionId in gameState.factions) {
    return gameState.factions[engineFactionId];
  }
  return 0;
}

/**
 * Get all locations relevant to the current chapter.
 */
export function getChapterLocations(chapterId: string): string[] {
  return WORLD_MAP_DATA.locations
    .filter((loc) => loc.chapterIds.includes(chapterId))
    .map((loc) => loc.id);
}

/**
 * Get all locations controlled by a faction.
 */
export function getFactionLocations(factionId: string): string[] {
  return WORLD_MAP_DATA.locations
    .filter((loc) => loc.controlledBy === factionId)
    .map((loc) => loc.id);
}
