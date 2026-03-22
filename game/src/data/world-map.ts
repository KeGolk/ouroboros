/**
 * World Map Data for "Crowns of Ash"
 *
 * Defines all locations, their positions on the map grid,
 * connections (roads/paths) between them, and faction control.
 *
 * Coordinates are in a 0-100 normalized grid so the map scales
 * to any viewport size.
 */

import type { FactionId } from '@/types/factions';

// ─── Types ──────────────────────────────────────────────────────────────────

export type LocationId = string;

export type LocationType =
  | 'city'         // major settlement
  | 'town'         // smaller settlement
  | 'fortress'     // military stronghold
  | 'temple'       // religious / arcane site
  | 'wilderness'   // untamed region
  | 'port'         // coastal trade hub
  | 'ruins'        // ancient ruins
  | 'camp';        // temporary encampment

export type PathType =
  | 'road'         // well-traveled road
  | 'trail'        // rough trail
  | 'river'        // river route
  | 'secret';      // hidden path (requires discovery)

export interface MapLocation {
  /** Unique location identifier */
  id: LocationId;
  /** Display name */
  name: string;
  /** Short description for tooltip */
  description: string;
  /** Longer lore description */
  lore: string;
  /** Normalized X position (0-100) */
  x: number;
  /** Normalized Y position (0-100) */
  y: number;
  /** Type of location */
  type: LocationType;
  /** Controlling faction, if any */
  controlledBy?: FactionId;
  /** Whether this location is currently accessible */
  isAccessible: boolean;
  /** Whether this location has been discovered (visible on map) */
  isDiscovered: boolean;
  /** Chapter IDs that take place here */
  chapterIds: string[];
  /** AI art prompt for location illustration */
  imagePrompt: string;
  /** Icon to render on the map (emoji placeholder) */
  icon: string;
  /** Notable NPCs at this location */
  notableNpcs?: string[];
  /** Available services */
  services?: string[];
  /** Danger level 0-5 */
  dangerLevel: number;
}

export interface MapPath {
  /** Unique path identifier */
  id: string;
  /** Source location ID */
  from: LocationId;
  /** Destination location ID */
  to: LocationId;
  /** Type of path */
  type: PathType;
  /** Display name of the route */
  name: string;
  /** Travel time description */
  travelTime: string;
  /** Danger along this path (0-5) */
  dangerLevel: number;
  /** Whether this path is currently passable */
  isPassable: boolean;
  /** Whether this path has been discovered */
  isDiscovered: boolean;
  /** Optional waypoints for curved path rendering [x,y] pairs */
  waypoints?: [number, number][];
}

export interface WorldMapData {
  /** All map locations */
  locations: MapLocation[];
  /** All paths between locations */
  paths: MapPath[];
}

// ─── Location Definitions ───────────────────────────────────────────────────

const locations: MapLocation[] = [
  // === THE CROWNLANDS (Iron Throne territory) ===
  {
    id: 'ironhold',
    name: 'Ironhold Citadel',
    description: 'The seat of the Iron Throne, a massive fortress-city of dark stone and steel.',
    lore: 'Built upon the ruins of the First Kingdom, Ironhold\'s walls have never been breached. '
      + 'Its great forges burn day and night, arming the largest standing army in Aethermoor. '
      + 'The Throne Room houses the legendary Iron Crown, said to have been forged from a fallen star.',
    x: 45,
    y: 30,
    type: 'fortress',
    controlledBy: 'ironThrone',
    isAccessible: true,
    isDiscovered: true,
    chapterIds: ['chapter_1', 'chapter_5', 'chapter_9'],
    imagePrompt: 'A massive dark stone citadel with iron-banded walls, smoke rising from great forges, '
      + 'war banners of crimson and steel flying from every tower, gritty medieval dark fantasy',
    icon: '🏰',
    notableNpcs: ['commander_varek', 'lady_seraine'],
    services: ['Smithy', 'War Council', 'Garrison'],
    dangerLevel: 1,
  },
  {
    id: 'blackwall',
    name: 'Blackwall Keep',
    description: 'A grim border fortress guarding the northern passes.',
    lore: 'Blackwall Keep stands sentinel over the Greymist Pass, the only viable route between '
      + 'the Crownlands and the Conclave\'s mountain territories. Its garrison is perpetually '
      + 'undermanned and perpetually watchful.',
    x: 38,
    y: 15,
    type: 'fortress',
    controlledBy: 'ironThrone',
    isAccessible: true,
    isDiscovered: true,
    chapterIds: ['chapter_3'],
    imagePrompt: 'A stark black stone keep perched on a cliff overlooking a narrow mountain pass, '
      + 'snow on the peaks, watchfires burning, dark brooding atmosphere',
    icon: '⛫',
    notableNpcs: [],
    services: ['Garrison', 'Supplies'],
    dangerLevel: 3,
  },
  {
    id: 'kingsroad_inn',
    name: 'The Crossroads Inn',
    description: 'A busy waystation where all major roads converge.',
    lore: 'Neutral ground by ancient tradition, the Crossroads Inn is where merchants, soldiers, '
      + 'and spies share ale and rumors. The innkeeper, Old Margit, has heard every secret in the realm.',
    x: 50,
    y: 48,
    type: 'town',
    isAccessible: true,
    isDiscovered: true,
    chapterIds: ['chapter_2', 'chapter_6'],
    imagePrompt: 'A weathered timber inn at a crossroads, warm light spilling from windows, '
      + 'horses tied outside, merchants and soldiers milling about, dusk, medieval fantasy',
    icon: '🍺',
    services: ['Inn', 'Tavern', 'Trading Post'],
    dangerLevel: 1,
  },

  // === GREYMIST MOUNTAINS (Ashen Conclave territory) ===
  {
    id: 'ashenveil',
    name: 'Ashenveil',
    description: 'The fog-shrouded citadel of the Ashen Conclave, carved into the mountainside.',
    lore: 'Ashenveil is both library and fortress, its halls stretching deep into the Greymist '
      + 'Mountains. Ethereal lights float through its corridors, and the air hums with residual '
      + 'Aether. Only those the Conclave deems worthy may pass its warded gates.',
    x: 30,
    y: 8,
    type: 'temple',
    controlledBy: 'ashenConclave',
    isAccessible: true,
    isDiscovered: true,
    chapterIds: ['chapter_4', 'chapter_8'],
    imagePrompt: 'A mystical citadel carved into misty mountain cliffs, glowing purple runes on stone, '
      + 'hooded figures on winding stairs, ethereal fog, dark academia aesthetic',
    icon: '📜',
    notableNpcs: ['archon_maelis', 'seer_thessaly'],
    services: ['Library', 'Enchanting', 'Oracle'],
    dangerLevel: 2,
  },
  {
    id: 'oracle_spire',
    name: "The Oracle's Spire",
    description: 'A lone tower where the Conclave\'s seers commune with the Aether.',
    lore: 'The tallest point in the Greymist range, the Oracle\'s Spire pierces the cloud layer. '
      + 'Those who climb to its apex report visions of past and future, though not all return sane.',
    x: 20,
    y: 12,
    type: 'temple',
    controlledBy: 'ashenConclave',
    isAccessible: true,
    isDiscovered: false,
    chapterIds: ['chapter_8'],
    imagePrompt: 'A impossibly tall stone spire rising above the clouds, lightning crackling around its peak, '
      + 'a spiral staircase winding upward, mystical and ominous, dark fantasy',
    icon: '🗼',
    services: ['Prophecy', 'Meditation'],
    dangerLevel: 4,
  },

  // === THE GREENWOOD (Verdant Pact territory) ===
  {
    id: 'mosshollow',
    name: 'Mosshollow',
    description: 'A hidden village nestled in the ancient Greenwood, heart of the Verdant Pact.',
    lore: 'Mosshollow exists in harmony with the forest. Its buildings grow from living trees, '
      + 'and its people answer to the council of Elders rather than any king. The village is '
      + 'nearly impossible to find without a Pact guide.',
    x: 65,
    y: 60,
    type: 'town',
    controlledBy: 'verdantPact',
    isAccessible: true,
    isDiscovered: true,
    chapterIds: ['chapter_3', 'chapter_7'],
    imagePrompt: 'A village of living tree-houses in a dense ancient forest, glowing mushrooms, '
      + 'hanging moss, warm firelight, druids and common folk, naturalistic dark fantasy',
    icon: '🌿',
    notableNpcs: ['elder_brynn', 'warden_kael'],
    services: ['Herbalist', 'Druid Circle', 'Rest'],
    dangerLevel: 1,
  },
  {
    id: 'thornwatch',
    name: 'Thornwatch Outpost',
    description: 'A guerrilla outpost at the forest\'s edge, watching the roads.',
    lore: 'Thornwatch is part watchtower, part ambush point. The Pact\'s rangers stage raids on '
      + 'Throne supply lines from here and melt back into the trees before pursuit can mount.',
    x: 58,
    y: 52,
    type: 'camp',
    controlledBy: 'verdantPact',
    isAccessible: true,
    isDiscovered: true,
    chapterIds: ['chapter_3'],
    imagePrompt: 'A camouflaged wooden watchtower in thick forest, rope bridges between trees, '
      + 'rangers with bows, dappled green light, guerrilla aesthetic',
    icon: '🏕️',
    services: ['Scouting', 'Supplies'],
    dangerLevel: 2,
  },
  {
    id: 'druids_glen',
    name: "The Druid's Glen",
    description: 'A sacred grove where the most ancient rites of the land are performed.',
    lore: 'Standing stones older than any kingdom ring this clearing. Here the druids perform '
      + 'the old rites, communing with the Greenmother. The glen is said to be a node of raw '
      + 'Aetheric power, predating even the Sundering.',
    x: 72,
    y: 72,
    type: 'temple',
    controlledBy: 'verdantPact',
    isAccessible: true,
    isDiscovered: false,
    chapterIds: ['chapter_7'],
    imagePrompt: 'Ancient standing stones in a forest clearing, glowing with green light, '
      + 'druids in ceremony, fireflies, moss and vines, mystical naturalistic',
    icon: '🪨',
    services: ['Ritual', 'Healing'],
    dangerLevel: 3,
  },

  // === BLACKHAVEN (Obsidian Guild territory) ===
  {
    id: 'blackhaven',
    name: 'Blackhaven Port',
    description: 'The Guild\'s glittering port city — wealth and corruption in equal measure.',
    lore: 'Blackhaven is the wealthiest city in Aethermoor, a sprawling port where anything can '
      + 'be bought for the right price. Its gilded spires hide a labyrinth of black markets and '
      + 'spy networks. The Guild controls everything from the harbormaster to the rats in the walls.',
    x: 80,
    y: 38,
    type: 'port',
    controlledBy: 'obsidianGuild',
    isAccessible: true,
    isDiscovered: true,
    chapterIds: ['chapter_2', 'chapter_6', 'chapter_10'],
    imagePrompt: 'A wealthy port city at night, lantern-lit docks, tall ships, golden domes, '
      + 'shadowy alleys, noir atmosphere, dark fantasy meets Renaissance Venice',
    icon: '⚓',
    notableNpcs: ['guildmaster_rhenna', 'spymaster_dax'],
    services: ['Black Market', 'Bank', 'Tavern', 'Shipyard'],
    dangerLevel: 2,
  },
  {
    id: 'undermarket',
    name: 'The Undermarket',
    description: 'A vast underground bazaar beneath Blackhaven, dealing in the forbidden.',
    lore: 'Below Blackhaven lies a second city. The Undermarket vaults stretch for miles, '
      + 'housing every illicit trade imaginable: stolen artifacts, forbidden texts, poisons, '
      + 'and darker things. Entry requires a Guild token or a very convincing lie.',
    x: 82,
    y: 44,
    type: 'ruins',
    controlledBy: 'obsidianGuild',
    isAccessible: true,
    isDiscovered: false,
    chapterIds: ['chapter_6'],
    imagePrompt: 'A vast underground cavern converted into a bazaar, hanging lanterns, merchant stalls, '
      + 'shadowy figures, exotic goods, torchlight on stone arches, fantasy noir',
    icon: '🕳️',
    services: ['Black Market', 'Fence', 'Assassins Guild'],
    dangerLevel: 3,
  },

  // === CONTESTED / NEUTRAL TERRITORIES ===
  {
    id: 'ashen_ford',
    name: 'Ashen Ford',
    description: 'A contested river crossing, site of many battles.',
    lore: 'The Ash River marks the traditional boundary between Throne and Pact territories. '
      + 'Ashen Ford is the widest crossing point, and control of it has changed hands dozens '
      + 'of times. The surrounding fields are sown with more bones than grain.',
    x: 52,
    y: 55,
    type: 'wilderness',
    isAccessible: true,
    isDiscovered: true,
    chapterIds: ['chapter_5'],
    imagePrompt: 'A shallow river ford with a ruined stone bridge, old battle standards rotting '
      + 'in the mud, grey sky, crows, desolate battlefield atmosphere',
    icon: '⚔️',
    dangerLevel: 4,
  },
  {
    id: 'thornhold',
    name: 'Thornhold',
    description: 'An ancient keep where the story begins — the player\'s ancestral home.',
    lore: 'Thornhold was once the seat of House Ashworth, a noble family that served as mediators '
      + 'between the factions. After the High King\'s assassination, the keep fell into disrepair '
      + 'and the family was disgraced. It is here that the player begins their journey.',
    x: 48,
    y: 40,
    type: 'fortress',
    isAccessible: true,
    isDiscovered: true,
    chapterIds: ['chapter_1'],
    imagePrompt: 'A crumbling but once-grand stone keep, ivy-covered walls, a broken portcullis, '
      + 'sunset light through empty windows, melancholy and noble decay, dark fantasy',
    icon: '🏚️',
    notableNpcs: ['player_character'],
    dangerLevel: 1,
  },
  {
    id: 'ashenmere',
    name: 'Ashenmere',
    description: 'A strategic walled city besieged in the great faction war.',
    lore: 'Ashenmere controls the most fertile plains in Aethermoor. Its walls are ancient and '
      + 'strong, but the city has become a flashpoint in the conflict between all four factions. '
      + 'Whoever holds Ashenmere controls the food supply of the realm.',
    x: 55,
    y: 65,
    type: 'city',
    isAccessible: true,
    isDiscovered: true,
    chapterIds: ['chapter_7', 'chapter_9'],
    imagePrompt: 'A walled medieval city on a plain, siege camps visible outside its walls, '
      + 'smoke rising, trebuchets in the distance, dramatic sky, epic dark fantasy',
    icon: '🏙️',
    dangerLevel: 5,
  },
  {
    id: 'sunken_cathedral',
    name: 'The Sunken Cathedral',
    description: 'A half-submerged ancient temple holding secrets of the Sundering.',
    lore: 'When the Sundering shattered the old world, the Grand Cathedral of the First Faith '
      + 'sank into the marshes. Now only its spire remains above water, but below lies a treasure '
      + 'trove of pre-Sundering knowledge — and dangers best left undisturbed.',
    x: 35,
    y: 55,
    type: 'ruins',
    isAccessible: true,
    isDiscovered: false,
    chapterIds: ['chapter_4'],
    imagePrompt: 'A gothic cathedral partially submerged in a murky swamp, only the upper spire and '
      + 'rose window visible above green water, mist, eerie light from below, haunting dark fantasy',
    icon: '⛪',
    dangerLevel: 5,
  },
  {
    id: 'the_pale_wastes',
    name: 'The Pale Wastes',
    description: 'A blighted wasteland north of the mountains, source of dark rumors.',
    lore: 'Beyond the Greymist Mountains lies a land scoured by the Sundering. Nothing grows '
      + 'in the Pale Wastes, yet strange lights are seen at night and travelers speak of '
      + 'whispering voices. The Conclave forbids all travel here — which only makes the '
      + 'curious more determined.',
    x: 25,
    y: 2,
    type: 'wilderness',
    isAccessible: false,
    isDiscovered: false,
    chapterIds: ['chapter_10'],
    imagePrompt: 'A desolate white-grey wasteland stretching to the horizon, cracked earth, '
      + 'strange crystalline formations, sickly aurora in the sky, post-apocalyptic fantasy',
    icon: '💀',
    dangerLevel: 5,
  },
];

// ─── Path Definitions ───────────────────────────────────────────────────────

const paths: MapPath[] = [
  // Ironhold connections
  {
    id: 'ironhold_to_blackwall',
    from: 'ironhold',
    to: 'blackwall',
    type: 'road',
    name: "The King's March",
    travelTime: '2 days',
    dangerLevel: 1,
    isPassable: true,
    isDiscovered: true,
    waypoints: [[42, 22]],
  },
  {
    id: 'ironhold_to_thornhold',
    from: 'ironhold',
    to: 'thornhold',
    type: 'road',
    name: 'Crownland Highway',
    travelTime: '1 day',
    dangerLevel: 1,
    isPassable: true,
    isDiscovered: true,
  },
  {
    id: 'ironhold_to_kingsroad_inn',
    from: 'ironhold',
    to: 'kingsroad_inn',
    type: 'road',
    name: "King's Road South",
    travelTime: '1 day',
    dangerLevel: 1,
    isPassable: true,
    isDiscovered: true,
  },
  {
    id: 'ironhold_to_blackhaven',
    from: 'ironhold',
    to: 'blackhaven',
    type: 'road',
    name: 'East Trade Road',
    travelTime: '3 days',
    dangerLevel: 2,
    isPassable: true,
    isDiscovered: true,
    waypoints: [[62, 32]],
  },

  // Blackwall connections
  {
    id: 'blackwall_to_ashenveil',
    from: 'blackwall',
    to: 'ashenveil',
    type: 'trail',
    name: 'Greymist Pass',
    travelTime: '2 days',
    dangerLevel: 3,
    isPassable: true,
    isDiscovered: true,
    waypoints: [[34, 10]],
  },

  // Ashenveil connections
  {
    id: 'ashenveil_to_oracle_spire',
    from: 'ashenveil',
    to: 'oracle_spire',
    type: 'trail',
    name: 'Summit Trail',
    travelTime: '1 day',
    dangerLevel: 4,
    isPassable: true,
    isDiscovered: false,
  },
  {
    id: 'ashenveil_to_sunken_cathedral',
    from: 'ashenveil',
    to: 'sunken_cathedral',
    type: 'secret',
    name: 'The Drowned Way',
    travelTime: '3 days',
    dangerLevel: 4,
    isPassable: true,
    isDiscovered: false,
    waypoints: [[28, 30], [30, 45]],
  },

  // Crossroads connections
  {
    id: 'kingsroad_to_thornhold',
    from: 'kingsroad_inn',
    to: 'thornhold',
    type: 'road',
    name: 'Old Thornhold Road',
    travelTime: 'Half day',
    dangerLevel: 1,
    isPassable: true,
    isDiscovered: true,
  },
  {
    id: 'kingsroad_to_thornwatch',
    from: 'kingsroad_inn',
    to: 'thornwatch',
    type: 'trail',
    name: 'Forest Edge Trail',
    travelTime: '1 day',
    dangerLevel: 2,
    isPassable: true,
    isDiscovered: true,
  },
  {
    id: 'kingsroad_to_ashen_ford',
    from: 'kingsroad_inn',
    to: 'ashen_ford',
    type: 'road',
    name: 'South Road',
    travelTime: 'Half day',
    dangerLevel: 2,
    isPassable: true,
    isDiscovered: true,
  },
  {
    id: 'kingsroad_to_blackhaven',
    from: 'kingsroad_inn',
    to: 'blackhaven',
    type: 'road',
    name: 'Merchant Highway',
    travelTime: '2 days',
    dangerLevel: 2,
    isPassable: true,
    isDiscovered: true,
    waypoints: [[65, 42]],
  },

  // Thornwatch connections
  {
    id: 'thornwatch_to_mosshollow',
    from: 'thornwatch',
    to: 'mosshollow',
    type: 'trail',
    name: 'Deep Forest Path',
    travelTime: '1 day',
    dangerLevel: 2,
    isPassable: true,
    isDiscovered: true,
  },

  // Mosshollow connections
  {
    id: 'mosshollow_to_druids_glen',
    from: 'mosshollow',
    to: 'druids_glen',
    type: 'secret',
    name: 'The Hidden Way',
    travelTime: '1 day',
    dangerLevel: 3,
    isPassable: true,
    isDiscovered: false,
  },
  {
    id: 'mosshollow_to_ashenmere',
    from: 'mosshollow',
    to: 'ashenmere',
    type: 'trail',
    name: 'Farmland Road',
    travelTime: '1 day',
    dangerLevel: 3,
    isPassable: true,
    isDiscovered: true,
  },

  // Ashen Ford connections
  {
    id: 'ashen_ford_to_ashenmere',
    from: 'ashen_ford',
    to: 'ashenmere',
    type: 'road',
    name: 'River Road',
    travelTime: '1 day',
    dangerLevel: 3,
    isPassable: true,
    isDiscovered: true,
  },
  {
    id: 'ashen_ford_to_sunken_cathedral',
    from: 'ashen_ford',
    to: 'sunken_cathedral',
    type: 'trail',
    name: 'Marsh Trail',
    travelTime: '2 days',
    dangerLevel: 4,
    isPassable: true,
    isDiscovered: false,
    waypoints: [[42, 56]],
  },

  // Blackhaven connections
  {
    id: 'blackhaven_to_undermarket',
    from: 'blackhaven',
    to: 'undermarket',
    type: 'secret',
    name: 'Guild Tunnels',
    travelTime: '1 hour',
    dangerLevel: 2,
    isPassable: true,
    isDiscovered: false,
  },

  // Oracle connections
  {
    id: 'oracle_to_pale_wastes',
    from: 'oracle_spire',
    to: 'the_pale_wastes',
    type: 'secret',
    name: 'The Forbidden Pass',
    travelTime: '3 days',
    dangerLevel: 5,
    isPassable: false,
    isDiscovered: false,
  },

  // Ashenmere to druids glen
  {
    id: 'ashenmere_to_druids_glen',
    from: 'ashenmere',
    to: 'druids_glen',
    type: 'trail',
    name: 'Southern Forest Path',
    travelTime: '2 days',
    dangerLevel: 3,
    isPassable: true,
    isDiscovered: false,
    waypoints: [[62, 70]],
  },
];

// ─── Exports ────────────────────────────────────────────────────────────────

export const WORLD_MAP_DATA: WorldMapData = {
  locations,
  paths,
};

/** Get a location by ID */
export function getLocation(id: LocationId): MapLocation | undefined {
  return locations.find((loc) => loc.id === id);
}

/** Get all paths from a location */
export function getPathsFrom(locationId: LocationId): MapPath[] {
  return paths.filter(
    (p) => (p.from === locationId || p.to === locationId) && p.isPassable && p.isDiscovered,
  );
}

/** Get the path between two locations if it exists */
export function getPathBetween(from: LocationId, to: LocationId): MapPath | undefined {
  return paths.find(
    (p) =>
      ((p.from === from && p.to === to) || (p.from === to && p.to === from)) &&
      p.isPassable &&
      p.isDiscovered,
  );
}

/**
 * BFS pathfinding: find shortest route between two discovered, accessible locations.
 * Returns array of location IDs forming the path, or empty array if unreachable.
 */
export function findRoute(
  fromId: LocationId,
  toId: LocationId,
  discoveredLocations?: Set<LocationId>,
  discoveredPaths?: Set<string>,
): LocationId[] {
  if (fromId === toId) return [fromId];

  const queue: LocationId[][] = [[fromId]];
  const visited = new Set<LocationId>([fromId]);

  while (queue.length > 0) {
    const currentPath = queue.shift()!;
    const current = currentPath[currentPath.length - 1];

    // Find all connected locations
    const connectedPaths = paths.filter((p) => {
      const isConnected = p.from === current || p.to === current;
      if (!isConnected) return false;
      if (!p.isPassable) return false;
      if (discoveredPaths && !discoveredPaths.has(p.id) && !p.isDiscovered) return false;
      return true;
    });

    for (const path of connectedPaths) {
      const neighbor = path.from === current ? path.to : path.from;

      if (visited.has(neighbor)) continue;

      // Check if neighbor is discovered and accessible
      const loc = locations.find((l) => l.id === neighbor);
      if (!loc) continue;
      if (discoveredLocations && !discoveredLocations.has(neighbor) && !loc.isDiscovered) continue;
      if (!loc.isAccessible) continue;

      const newPath = [...currentPath, neighbor];

      if (neighbor === toId) return newPath;

      visited.add(neighbor);
      queue.push(newPath);
    }
  }

  return []; // No route found
}

/**
 * Get all paths along a route (pairs of consecutive location IDs).
 */
export function getRouteEdges(route: LocationId[]): MapPath[] {
  const edges: MapPath[] = [];
  for (let i = 0; i < route.length - 1; i++) {
    const path = paths.find(
      (p) =>
        (p.from === route[i] && p.to === route[i + 1]) ||
        (p.from === route[i + 1] && p.to === route[i]),
    );
    if (path) edges.push(path);
  }
  return edges;
}
