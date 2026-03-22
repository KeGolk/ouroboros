/**
 * World & Environment Types for "Ashen Crown"
 *
 * Defines the core data structures for the game world:
 * Maps, Tiles, Zones, and Locations with their environmental
 * properties, hazards, and narrative hooks.
 *
 * These types represent the *world data* (terrain, climate, hazards),
 * whereas world-map.ts handles *UI representation* (SVG coords, icons)
 * and map-state.ts handles *player state* (fog-of-war, travel history).
 */

import type { FactionId } from './factions';
import type { LocationId, RegionId } from './world-map';

// ─── Terrain & Climate ──────────────────────────────────────────────

/** Physical terrain type of a tile or location */
export type TerrainType =
  | 'plains'
  | 'forest'
  | 'mountain'
  | 'swamp'
  | 'desert'
  | 'tundra'
  | 'coast'
  | 'river'
  | 'ruins'
  | 'underground'
  | 'urban'
  | 'volcanic';

/** Climate conditions that affect gameplay and visuals */
export type Climate =
  | 'temperate'
  | 'arid'
  | 'frigid'
  | 'tropical'
  | 'volcanic'
  | 'cursed';

/** Time-of-day phases that affect encounters and visibility */
export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';

/** Weather conditions that may impose travel/combat modifiers */
export type WeatherCondition =
  | 'clear'
  | 'overcast'
  | 'rain'
  | 'storm'
  | 'fog'
  | 'snow'
  | 'ashfall'
  | 'blood_mist';

// ─── Tile ───────────────────────────────────────────────────────────

/** Grid coordinates for hex/square tile systems */
export interface TileCoord {
  /** Column index */
  col: number;
  /** Row index */
  row: number;
}

/** Elevation band affecting movement cost and line-of-sight */
export type ElevationLevel = 'sea_level' | 'lowland' | 'highland' | 'peak';

/** A single tile in the world grid */
export interface Tile {
  /** Unique identifier derived from coordinates (e.g. "12_7") */
  id: string;
  /** Grid position */
  coord: TileCoord;
  /** Primary terrain of this tile */
  terrain: TerrainType;
  /** Elevation band */
  elevation: ElevationLevel;
  /** Movement cost multiplier (1.0 = normal, higher = slower) */
  movementCost: number;
  /** Whether the tile blocks line-of-sight */
  blocksLineOfSight: boolean;
  /** Whether this tile is passable at all */
  passable: boolean;
  /** Optional location situated on this tile */
  locationId: LocationId | null;
  /** Zone this tile belongs to */
  zoneId: string;
  /** Visual variant index for tile art randomisation */
  visualVariant: number;
}

// ─── Environmental Hazard ───────────────────────────────────────────

/** Types of environmental dangers */
export type HazardType =
  | 'poison_gas'
  | 'unstable_ground'
  | 'cursed_aura'
  | 'extreme_heat'
  | 'extreme_cold'
  | 'flooding'
  | 'wildfire'
  | 'magical_anomaly';

/** Severity of a hazard */
export type HazardSeverity = 'minor' | 'moderate' | 'severe' | 'lethal';

/** An environmental hazard present in a zone or location */
export interface EnvironmentalHazard {
  /** Machine-readable identifier */
  id: string;
  /** Human-readable name */
  name: string;
  /** Category of hazard */
  type: HazardType;
  /** How dangerous this hazard is */
  severity: HazardSeverity;
  /** Narrative description of the hazard */
  description: string;
  /** Stat or item check required to mitigate */
  mitigationCheck: HazardMitigation | null;
  /** Whether the hazard is always active or conditional */
  persistent: boolean;
  /** If conditional, what triggers this hazard */
  triggerCondition: string | null;
}

/** How a player can mitigate or avoid a hazard */
export interface HazardMitigation {
  /** Which stat is checked (e.g. 'cunning', 'strength') */
  stat: string;
  /** Minimum stat value to pass */
  threshold: number;
  /** Alternative: an item that bypasses the check entirely */
  bypassItemId: string | null;
}

// ─── Zone ───────────────────────────────────────────────────────────

/** Danger level of a zone, affecting encounter tables and loot */
export type ZoneDangerLevel =
  | 'safe'
  | 'low'
  | 'moderate'
  | 'high'
  | 'extreme';

/** A contiguous area of the world with shared properties */
export interface Zone {
  /** Unique zone identifier */
  id: string;
  /** Display name */
  name: string;
  /** Narrative description of the zone's atmosphere */
  description: string;
  /** Primary terrain across the zone */
  primaryTerrain: TerrainType;
  /** Climate of the zone */
  climate: Climate;
  /** How dangerous this zone is */
  dangerLevel: ZoneDangerLevel;
  /** Faction that controls or contests this zone */
  controllingFaction: FactionId | null;
  /** Region this zone belongs to */
  regionId: RegionId;
  /** Environmental hazards present in this zone */
  hazards: EnvironmentalHazard[];
  /** IDs of tiles that comprise this zone */
  tileIds: string[];
  /** Location IDs within this zone */
  locationIds: LocationId[];
  /** Level range recommendation for encounters */
  levelRange: LevelRange;
  /** Ambient audio/visual theme key */
  ambience: ZoneAmbience;
  /** Whether this zone is initially hidden behind fog of war */
  initiallyHidden: boolean;
}

/** Recommended level range for a zone (values between 1–100) */
export interface LevelRange {
  /** Minimum recommended level (1–100) */
  min: number;
  /** Maximum recommended level (1–100) */
  max: number;
}

/** Ambient theme settings for a zone */
export interface ZoneAmbience {
  /** Key for background music track */
  musicTrack: string;
  /** Key for ambient sound loop */
  ambientSound: string;
  /** CSS/shader filter to apply (e.g. 'sepia', 'desaturate') */
  visualFilter: string;
  /** Particle effect overlay (e.g. 'ash', 'snow', 'embers') */
  particleEffect: string | null;
}

// ─── Location (Game-Data Layer) ─────────────────────────────────────

/** Functional purpose of a location for gameplay */
export type LocationFunction =
  | 'quest_hub'
  | 'merchant'
  | 'rest_point'
  | 'dungeon_entrance'
  | 'boss_arena'
  | 'crafting_station'
  | 'faction_hall'
  | 'archive'
  | 'prison'
  | 'shrine';

/** A point of interest with gameplay data (complements MapLocation in world-map.ts) */
export interface Location {
  /** References the same ID used in world-map.ts MapLocation */
  id: LocationId;
  /** Display name */
  name: string;
  /** Rich lore description */
  loreDescription: string;
  /** Short in-game description (shown on hover/tooltip) */
  shortDescription: string;
  /** What the player can do here */
  functions: LocationFunction[];
  /** Zone this location resides in */
  zoneId: string;
  /** Terrain at this specific location (may differ from zone) */
  terrain: TerrainType;
  /** NPCs present at this location (character IDs) */
  npcIds: string[];
  /** Quests available at this location (quest IDs) */
  questIds: string[];
  /** Items that can be found here (item IDs) */
  lootTableId: string | null;
  /** Environmental hazards specific to this location */
  hazards: EnvironmentalHazard[];
  /** Prerequisites to access this location */
  accessRequirements: AccessRequirement[];
  /** Whether this location has an interior map/scene */
  hasInterior: boolean;
  /** Interior scene ID if applicable */
  interiorSceneId: string | null;
  /** Tags for search and filtering */
  tags: string[];
}

/** A prerequisite for accessing a location */
export interface AccessRequirement {
  /** Type of requirement */
  type: AccessRequirementType;
  /** Human-readable description */
  description: string;
  /** The specific value needed (quest ID, item ID, faction ID, etc.) */
  value: string;
  /** For reputation requirements, the minimum reputation needed */
  minReputation: number | null;
}

/** Types of access requirements */
export type AccessRequirementType =
  | 'quest_complete'
  | 'item_required'
  | 'faction_reputation'
  | 'chapter_reached'
  | 'skill_check';

// ─── World Map (Game-Data Layer) ────────────────────────────────────

/** Complete world definition combining all spatial data */
export interface GameWorld {
  /** Unique world identifier */
  id: string;
  /** Display name of the world */
  name: string;
  /** Narrative overview of the world */
  description: string;
  /** All zones in the world */
  zones: Zone[];
  /** All locations in the world */
  locations: Location[];
  /** Full tile grid (may be loaded lazily per zone) */
  tiles: Tile[];
  /** Current global weather (can change with story events) */
  currentWeather: WeatherCondition;
  /** Current time of day (affects encounters and visibility) */
  currentTimeOfDay: TimeOfDay;
  /** World-level flags set by story progression */
  worldFlags: Record<string, boolean>;
  /** Global event modifiers currently active */
  activeWorldEvents: WorldEvent[];
}

/** A world-level event that modifies zone/location behaviour */
export interface WorldEvent {
  /** Unique event identifier */
  id: string;
  /** Display name */
  name: string;
  /** Narrative description */
  description: string;
  /** Zones affected by this event */
  affectedZoneIds: string[];
  /** Locations affected by this event */
  affectedLocationIds: LocationId[];
  /** How this event modifies danger levels */
  dangerModifier: number;
  /** Weather override while event is active */
  weatherOverride: WeatherCondition | null;
  /** Whether this event is currently active */
  active: boolean;
  /** Chapter or flag that triggers this event */
  triggerCondition: string;
  /** Chapter or flag that ends this event */
  endCondition: string;
}
