/**
 * World Map Types for "Ashen Crown"
 *
 * Defines the data structures for the interactive world map,
 * including locations, connections/paths, and region metadata.
 */

import { FactionId } from './narrative';

// ─── Location Types ──────────────────────────────────────────────────

export type LocationId =
  | 'valdris'
  | 'ashford'
  | 'thornwood'
  | 'iron_bastion'
  | 'verdant_hollow'
  | 'obsidian_spire'
  | 'ashen_keep'
  | 'salted_marches'
  | 'broken_crown_tavern'
  | 'kings_crypt'
  | 'thornwood_circle'
  | 'shadow_market'
  | 'eastern_gate'
  | 'harbor_district'
  | 'conclave_hall'
  | 'exiles_road';

export type LocationType =
  | 'capital'
  | 'village'
  | 'fortress'
  | 'wilderness'
  | 'landmark'
  | 'dungeon'
  | 'district';

export type LocationStatus = 'locked' | 'available' | 'visited' | 'active' | 'completed';

export interface MapLocation {
  id: LocationId;
  name: string;
  description: string;
  type: LocationType;
  /** SVG coordinates (0-1000 viewport) */
  x: number;
  y: number;
  /** Which faction controls or influences this location */
  controllingFaction?: FactionId;
  /** Which chapters feature this location */
  chapters: number[];
  /** Whether this is a major or minor location (affects node size) */
  major: boolean;
  /** AI art prompt for location illustration */
  imagePrompt: string;
  /** Icon to display on the map node */
  icon: LocationIcon;
  /** Region grouping for visual clustering */
  region: RegionId;
}

export type LocationIcon =
  | 'castle'
  | 'village'
  | 'forest'
  | 'tower'
  | 'cave'
  | 'tavern'
  | 'gate'
  | 'market'
  | 'temple'
  | 'road'
  | 'harbor'
  | 'crypt';

export type RegionId =
  | 'capital_district'
  | 'eastern_reaches'
  | 'thornwood_region'
  | 'western_marches'
  | 'northern_highlands';

// ─── Connections ─────────────────────────────────────────────────────

export type PathType = 'road' | 'trail' | 'secret' | 'river' | 'bridge';

export interface MapConnection {
  from: LocationId;
  to: LocationId;
  pathType: PathType;
  /** Whether this path is initially hidden (e.g. secret passages) */
  hidden?: boolean;
  /** Flag that must be set to reveal this path */
  revealFlag?: string;
  /** Label for the path */
  label?: string;
}

// ─── Regions ─────────────────────────────────────────────────────────

export interface MapRegion {
  id: RegionId;
  name: string;
  /** Polygon points for the region boundary (SVG coordinates) */
  boundaryPoints: Array<{ x: number; y: number }>;
  /** Fill color with low opacity for region tinting */
  color: string;
}

// ─── Full Map Config ─────────────────────────────────────────────────

export interface WorldMapConfig {
  locations: MapLocation[];
  connections: MapConnection[];
  regions: MapRegion[];
}

// ─── Component Props ─────────────────────────────────────────────────

export interface WorldMapProps {
  /** Current chapter number (1-10) to highlight relevant locations */
  currentChapter?: number;
  /** Player's current location */
  activeLocation?: LocationId;
  /** Map of location statuses based on game progress */
  locationStatuses?: Partial<Record<LocationId, LocationStatus>>;
  /** Set of discovered/revealed secret paths */
  revealedPaths?: Set<string>;
  /** Callback when a location node is clicked */
  onLocationClick?: (locationId: LocationId) => void;
  /** Callback when a location node is hovered */
  onLocationHover?: (locationId: LocationId | null) => void;
  /** Whether the map is in compact/mini mode (for sidebar) */
  compact?: boolean;
  /** Whether to show fog of war on unvisited locations */
  fogOfWar?: boolean;
  /** Completed chapters for unlocking logic */
  completedChapters?: number[];
}
