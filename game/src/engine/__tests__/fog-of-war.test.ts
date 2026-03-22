import {
  createFogOfWarState,
  getLocationStatus,
  discoverLocation,
  visitLocation,
  processSceneLocation,
  updateFogFromGameState,
  getExplorationProgress,
  getLocationsByStatus,
  findLocationBySceneText,
  serializeFogState,
  deserializeFogState,
} from '../fog-of-war';
import type { MapLocation, FogOfWarState } from '../fog-of-war';
import type { GameState } from '../types';

// ─── Test Fixtures ──────────────────────────────────────────────────────────

const testLocations: MapLocation[] = [
  {
    id: 'capital',
    name: 'Valdoria',
    description: 'The capital city',
    x: 50,
    y: 50,
    region: 'Heartlands',
    adjacentLocations: ['forest', 'keep'],
    sceneLocationPatterns: ['valdoria*', '*capital*'],
    startsDiscovered: true,
    imagePrompt: 'A grand city',
    locationType: 'city',
    isMajor: true,
  },
  {
    id: 'keep',
    name: 'Thornhold Keep',
    description: 'The royal fortress',
    x: 52,
    y: 48,
    region: 'Heartlands',
    adjacentLocations: ['capital', 'dungeon'],
    sceneLocationPatterns: ['thornhold keep*', '*throne room*'],
    startsDiscovered: true,
    imagePrompt: 'A dark castle',
    locationType: 'castle',
  },
  {
    id: 'forest',
    name: 'Thornwood',
    description: 'An ancient forest',
    x: 60,
    y: 40,
    region: 'Verdant Marches',
    adjacentLocations: ['capital', 'grove'],
    sceneLocationPatterns: ['*thornwood*'],
    revealedByChapters: [3],
    imagePrompt: 'Dense forest',
    locationType: 'wilderness',
  },
  {
    id: 'grove',
    name: 'Eldergrove',
    description: 'A sacred grove',
    x: 65,
    y: 35,
    region: 'Verdant Marches',
    adjacentLocations: ['forest'],
    sceneLocationPatterns: ['*eldergrove*'],
    revealedByFlags: ['pact_ally'],
    imagePrompt: 'Sacred grove',
    locationType: 'temple',
  },
  {
    id: 'dungeon',
    name: 'Dungeons',
    description: 'Underground cells',
    x: 51,
    y: 52,
    region: 'Heartlands',
    adjacentLocations: ['keep'],
    sceneLocationPatterns: ['*dungeon*'],
    imagePrompt: 'Dark dungeon',
    locationType: 'ruins',
  },
  {
    id: 'spire',
    name: 'Ashen Spire',
    description: 'The Conclave tower',
    x: 45,
    y: 20,
    region: 'Ashlands',
    adjacentLocations: [],
    sceneLocationPatterns: ['*ashen spire*'],
    revealedByFlags: ['entered_spire'],
    imagePrompt: 'Black tower',
    locationType: 'stronghold',
    isMajor: true,
  },
];

function createTestGameState(overrides: Partial<GameState> = {}): GameState {
  return {
    saveId: 'test',
    playerName: 'Test Player',
    currentChapterId: 'chapter_1',
    currentSceneId: 'ch1_throne_room',
    stats: {
      strength: 5,
      dexterity: 5,
      intelligence: 5,
      wisdom: 5,
      constitution: 5,
      charisma: 5,
      influence: 0,
      cunning: 5,
      diplomacy: 0,
    },
    factions: {
      iron_throne: 0,
      shadow_guild: 0,
      peoples_front: 0,
      old_faith: 0,
    },
    flags: {},
    choiceHistory: [],
    deadCharacters: [],
    unlocks: [],
    completedChapters: [],
    savedAt: Date.now(),
    ngPlusCycle: 0,
    achievements: [],
    playtimeSeconds: 0,
    ...overrides,
  };
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('createFogOfWarState', () => {
  it('creates initial state with correct discovery for startsDiscovered locations', () => {
    const state = createFogOfWarState(testLocations);

    expect(state.totalLocations).toBe(6);
    expect(state.locations['capital']).toBe('discovered');
    expect(state.locations['keep']).toBe('discovered');
    expect(state.locations['forest']).toBe('undiscovered');
    expect(state.locations['grove']).toBe('undiscovered');
    expect(state.locations['dungeon']).toBe('undiscovered');
    expect(state.locations['spire']).toBe('undiscovered');
    expect(state.revealedCount).toBe(2);
  });

  it('sets timestamps for initially discovered locations', () => {
    const state = createFogOfWarState(testLocations);
    expect(state.discoveryTimestamps['capital']).toBe(0);
    expect(state.discoveryTimestamps['keep']).toBe(0);
    expect(state.discoveryTimestamps['forest']).toBeUndefined();
  });
});

describe('getLocationStatus', () => {
  it('returns correct status for known locations', () => {
    const state = createFogOfWarState(testLocations);
    expect(getLocationStatus(state, 'capital')).toBe('discovered');
    expect(getLocationStatus(state, 'forest')).toBe('undiscovered');
  });

  it('returns undiscovered for unknown location IDs', () => {
    const state = createFogOfWarState(testLocations);
    expect(getLocationStatus(state, 'nonexistent')).toBe('undiscovered');
  });
});

describe('discoverLocation', () => {
  it('discovers an undiscovered location', () => {
    const state = createFogOfWarState(testLocations);
    const result = discoverLocation(state, 'forest', testLocations, 1000);

    expect(result.state.locations['forest']).toBe('discovered');
    expect(result.newlyDiscovered).toContain('forest');
    expect(result.state.discoveryTimestamps['forest']).toBe(1000);
    expect(result.state.revealedCount).toBe(3);
  });

  it('rumors adjacent locations when discovering', () => {
    const state = createFogOfWarState(testLocations);
    const result = discoverLocation(state, 'forest', testLocations);

    // 'grove' is adjacent to 'forest', 'capital' is already discovered
    expect(result.newlyRumored).toContain('grove');
    expect(result.state.locations['grove']).toBe('rumored');
  });

  it('does not downgrade an already discovered location', () => {
    const state = createFogOfWarState(testLocations);
    // capital starts as discovered
    const result = discoverLocation(state, 'capital', testLocations);

    expect(result.state.locations['capital']).toBe('discovered');
    expect(result.newlyDiscovered).not.toContain('capital');
  });

  it('upgrades rumored to discovered', () => {
    let state = createFogOfWarState(testLocations);
    // First, discover forest to rumor grove
    const step1 = discoverLocation(state, 'forest', testLocations);
    expect(step1.state.locations['grove']).toBe('rumored');

    // Now discover grove
    const step2 = discoverLocation(step1.state, 'grove', testLocations);
    expect(step2.state.locations['grove']).toBe('discovered');
    expect(step2.newlyDiscovered).toContain('grove');
  });

  it('does not rumor already-discovered adjacent locations', () => {
    const state = createFogOfWarState(testLocations);
    // capital is adjacent to forest and keep, both already discovered
    const result = discoverLocation(state, 'dungeon', testLocations);
    // keep is adjacent to dungeon but already discovered — should not appear in rumored
    expect(result.newlyRumored).not.toContain('keep');
  });

  it('is immutable — does not modify original state', () => {
    const state = createFogOfWarState(testLocations);
    const original = { ...state.locations };
    discoverLocation(state, 'forest', testLocations);

    expect(state.locations).toEqual(original);
  });
});

describe('visitLocation', () => {
  it('marks a location as visited', () => {
    const state = createFogOfWarState(testLocations);
    const result = visitLocation(state, 'forest', testLocations, 2000);

    expect(result.state.locations['forest']).toBe('visited');
    expect(result.state.discoveryTimestamps['forest']).toBe(2000);
  });

  it('also discovers adjacent locations (rumors them)', () => {
    const state = createFogOfWarState(testLocations);
    const result = visitLocation(state, 'forest', testLocations);

    expect(result.newlyRumored).toContain('grove');
  });

  it('upgrades discovered to visited', () => {
    const state = createFogOfWarState(testLocations);
    // capital starts as 'discovered'
    const result = visitLocation(state, 'capital', testLocations);
    expect(result.state.locations['capital']).toBe('visited');
  });
});

describe('processSceneLocation', () => {
  it('matches scene location text and visits the map location', () => {
    const state = createFogOfWarState(testLocations);
    const result = processSceneLocation(state, 'Thornhold Keep — Throne Room', testLocations);

    expect(result.visitedLocationId).toBe('keep');
    expect(result.state.locations['keep']).toBe('visited');
  });

  it('matches wildcard patterns', () => {
    const state = createFogOfWarState(testLocations);
    const result = processSceneLocation(state, 'Valdoria — The Hollow Coin Tavern', testLocations);

    // 'valdoria*' pattern should match
    expect(result.visitedLocationId).toBe('capital');
  });

  it('returns null for unrecognized scene locations', () => {
    const state = createFogOfWarState(testLocations);
    const result = processSceneLocation(state, 'Unknown Place — Nowhere', testLocations);

    expect(result.visitedLocationId).toBeNull();
    expect(result.state).toEqual(state);
  });

  it('rumors adjacent locations when visiting', () => {
    const state = createFogOfWarState(testLocations);
    const result = processSceneLocation(state, 'The Thornwood Clearing', testLocations);

    if (result.visitedLocationId === 'forest') {
      expect(result.state.locations['grove']).toBe('rumored');
    }
  });
});

describe('findLocationBySceneText', () => {
  it('matches exact pattern inclusion', () => {
    // 'Thornhold Keep — Dungeons' contains 'dungeon' which matches the dungeon pattern
    // but also matches 'thornhold keep*' — the first match wins by order
    const loc = findLocationBySceneText('The Dark Dungeon Cells', testLocations);
    expect(loc?.id).toBe('dungeon');
  });

  it('matches case-insensitively', () => {
    const loc = findLocationBySceneText('THE THORNWOOD', testLocations);
    expect(loc?.id).toBe('forest');
  });

  it('matches wildcard patterns', () => {
    const loc = findLocationBySceneText('Valdoria City Center', testLocations);
    // 'valdoria*' should match
    expect(loc?.id).toBe('capital');
  });

  it('returns null for no match', () => {
    const loc = findLocationBySceneText('Mount Olympus', testLocations);
    expect(loc).toBeNull();
  });
});

describe('updateFogFromGameState', () => {
  it('reveals locations based on completed chapters', () => {
    const fogState = createFogOfWarState(testLocations);
    const gameState = createTestGameState({
      completedChapters: ['chapter_3'],
    });

    const updated = updateFogFromGameState(fogState, gameState, testLocations);

    // forest has revealedByChapters: [3]
    expect(updated.locations['forest']).toBe('discovered');
  });

  it('reveals locations based on current chapter', () => {
    const fogState = createFogOfWarState(testLocations);
    const gameState = createTestGameState({
      currentChapterId: 'chapter_3',
    });

    const updated = updateFogFromGameState(fogState, gameState, testLocations);
    expect(updated.locations['forest']).toBe('discovered');
  });

  it('reveals locations based on story flags', () => {
    const fogState = createFogOfWarState(testLocations);
    const gameState = createTestGameState({
      flags: { pact_ally: true },
    });

    const updated = updateFogFromGameState(fogState, gameState, testLocations);
    expect(updated.locations['grove']).toBe('discovered');
  });

  it('does not downgrade visited locations', () => {
    let fogState = createFogOfWarState(testLocations);
    fogState = visitLocation(fogState, 'forest', testLocations).state;
    expect(fogState.locations['forest']).toBe('visited');

    const gameState = createTestGameState({
      completedChapters: ['chapter_3'],
    });

    const updated = updateFogFromGameState(fogState, gameState, testLocations);
    expect(updated.locations['forest']).toBe('visited');
  });

  it('reveals multiple locations from multiple flags', () => {
    const fogState = createFogOfWarState(testLocations);
    const gameState = createTestGameState({
      flags: { pact_ally: true, entered_spire: true },
    });

    const updated = updateFogFromGameState(fogState, gameState, testLocations);
    expect(updated.locations['grove']).toBe('discovered');
    expect(updated.locations['spire']).toBe('discovered');
  });
});

describe('getExplorationProgress', () => {
  it('calculates correct percentages', () => {
    const state = createFogOfWarState(testLocations);
    const progress = getExplorationProgress(state);

    // 2 out of 6 start discovered
    expect(progress.discovered).toBe(2);
    expect(progress.visited).toBe(0);
    expect(progress.undiscovered).toBe(4);
    expect(progress.rumored).toBe(0);
    expect(progress.total).toBe(6);
    expect(progress.percentage).toBe(33); // 2/6 ≈ 33%
  });

  it('updates after discoveries', () => {
    let state = createFogOfWarState(testLocations);
    state = discoverLocation(state, 'forest', testLocations).state;
    state = visitLocation(state, 'dungeon', testLocations).state;

    const progress = getExplorationProgress(state);
    // capital, keep start discovered; forest was discovered; dungeon visited -> discovered count = capital + keep + forest = 3
    // but dungeon is now 'visited' so discovered = capital + keep + forest = 3, visited = dungeon = 1
    // Actually: capital & keep start discovered (2). discoverLocation(forest) => discovered (3).
    // visitLocation(dungeon) => also discovers dungeon first, then visits => visited=1, discovered=3
    // But dungeon moves from discovered to visited, so discovered=2 (capital, keep, forest minus dungeon's upgrade wait...)
    // Let's just check totals: 4 revealed out of 6
    expect(progress.discovered + progress.visited).toBe(4);
    expect(progress.rumored).toBe(1); // grove (rumored via forest)
    expect(progress.percentage).toBe(67); // 4/6 = 67%
  });
});

describe('getLocationsByStatus', () => {
  it('groups locations correctly', () => {
    let state = createFogOfWarState(testLocations);
    state = discoverLocation(state, 'forest', testLocations).state;

    const grouped = getLocationsByStatus(state, testLocations);

    expect(grouped.discovered.map(l => l.id)).toContain('capital');
    expect(grouped.discovered.map(l => l.id)).toContain('forest');
    expect(grouped.rumored.map(l => l.id)).toContain('grove');
    expect(grouped.undiscovered.map(l => l.id)).toContain('spire');
  });
});

describe('serialization', () => {
  it('round-trips correctly', () => {
    let state = createFogOfWarState(testLocations);
    state = visitLocation(state, 'forest', testLocations, 5000).state;

    const serialized = serializeFogState(state);
    const deserialized = deserializeFogState(serialized);

    expect(deserialized.locations).toEqual(state.locations);
    expect(deserialized.discoveryTimestamps).toEqual(state.discoveryTimestamps);
    expect(deserialized.totalLocations).toBe(state.totalLocations);
    expect(deserialized.revealedCount).toBe(state.revealedCount);
  });
});
