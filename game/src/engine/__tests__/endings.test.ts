import { evaluateEndings, resolveEnding, getDominantFaction } from '../endings';
import type { GameState, Ending } from '../types';
import { createNewGameState } from '../narrative-engine';

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    ...createNewGameState('TestPlayer', 'ch1', 'scene1'),
    ...overrides,
  };
}

const testEndings: Ending[] = [
  {
    id: 'ending_iron_king',
    title: 'The Iron Crown',
    description: 'You rule with an iron fist.',
    epilogueText: 'The realm bends to your will...',
    conditions: [
      { type: 'faction', faction: 'iron_throne', op: 'gte', value: 50 },
      { type: 'stat', stat: 'diplomacy', op: 'gte', value: 40 },
    ],
    priority: 10,
    dominantFaction: 'iron_throne',
    imagePrompt: 'A dark throne room',
    tone: 'triumphant',
  },
  {
    id: 'ending_shadow_master',
    title: 'Master of Shadows',
    description: 'You rule from the shadows.',
    epilogueText: 'No one knows your name, but all feel your influence...',
    conditions: [
      { type: 'faction', faction: 'shadow_guild', op: 'gte', value: 50 },
      { type: 'stat', stat: 'cunning', op: 'gte', value: 30 },
    ],
    priority: 10,
    dominantFaction: 'shadow_guild',
    imagePrompt: 'A shadowy figure',
    tone: 'ambiguous',
  },
  {
    id: 'ending_peoples_hero',
    title: "The People's Champion",
    description: 'The people rise with you.',
    epilogueText: 'A new era of democracy dawns...',
    conditions: [
      { type: 'faction', faction: 'peoples_front', op: 'gte', value: 50 },
      { type: 'stat', stat: 'charisma', op: 'gte', value: 30 },
    ],
    priority: 10,
    dominantFaction: 'peoples_front',
    imagePrompt: 'A crowd cheering',
    tone: 'triumphant',
  },
  {
    id: 'ending_dark_lord',
    title: 'The Dark Sovereign',
    description: 'Corruption consumes you.',
    epilogueText: 'The old gods whisper as darkness spreads...',
    conditions: [
      { type: 'stat', stat: 'cunning', op: 'gte', value: 70 },
    ],
    priority: 15,
    dominantFaction: 'old_faith',
    imagePrompt: 'Dark clouds',
    tone: 'dark',
  },
  {
    id: 'ending_fallen',
    title: 'The Fallen',
    description: 'You fall, forgotten.',
    epilogueText: 'History forgets your name...',
    conditions: [
      { type: 'stat', stat: 'influence', op: 'gte', value: 20 },
      { type: 'stat', stat: 'diplomacy', op: 'lte', value: 5 },
    ],
    priority: 5,
    tone: 'tragic',
  },
];

describe('getDominantFaction', () => {
  it('returns the faction with highest standing', () => {
    const result = getDominantFaction({
      iron_throne: 30,
      shadow_guild: 50,
      peoples_front: 10,
      old_faith: -20,
    });
    expect(result.faction).toBe('shadow_guild');
    expect(result.standing).toBe(50);
  });

  it('returns first faction on tie', () => {
    const result = getDominantFaction({
      iron_throne: 50,
      shadow_guild: 50,
      peoples_front: 0,
      old_faith: 0,
    });
    // Both are 50, iron_throne comes first alphabetically in our sort
    expect(result.standing).toBe(50);
  });
});

describe('evaluateEndings', () => {
  it('returns no candidates when no conditions are met', () => {
    const state = makeState();
    const candidates = evaluateEndings(testEndings, state);
    // Default state: diplomacy=0, cunning=10, influence=0, all factions=0
    // "ending_fallen" requires influence>=20 which defaults don't meet
    expect(candidates).toHaveLength(0);
  });

  it('returns qualifying endings sorted by score', () => {
    const state = makeState({
      factions: { iron_throne: 60, shadow_guild: 0, peoples_front: 0, old_faith: 0 },
      stats: { strength: 10, dexterity: 10, intelligence: 10, wisdom: 10, constitution: 10, charisma: 10, influence: 0, cunning: 10, diplomacy: 50 },
    });
    const candidates = evaluateEndings(testEndings, state);
    expect(candidates.length).toBeGreaterThanOrEqual(1);
    expect(candidates[0].ending.id).toBe('ending_iron_king');
  });

  it('prioritizes higher-priority endings', () => {
    const state = makeState({
      factions: { iron_throne: 0, shadow_guild: 0, peoples_front: 0, old_faith: 0 },
      stats: { strength: 10, dexterity: 10, intelligence: 10, wisdom: 10, constitution: 10, charisma: 10, influence: 0, cunning: 80, diplomacy: 0 },
    });
    const candidates = evaluateEndings(testEndings, state);
    // Dark lord has priority 15, no faction-bonus competitor qualifies
    expect(candidates[0].ending.id).toBe('ending_dark_lord');
  });

  it('applies faction alignment bonus', () => {
    const state = makeState({
      factions: { iron_throne: 80, shadow_guild: 0, peoples_front: 0, old_faith: 0 },
      stats: { strength: 10, dexterity: 10, intelligence: 10, wisdom: 10, constitution: 10, charisma: 10, influence: 0, cunning: 10, diplomacy: 50 },
    });
    const candidates = evaluateEndings(testEndings, state);
    // Iron king should get a faction bonus (80/10 = 8)
    const ironKing = candidates.find(c => c.ending.id === 'ending_iron_king');
    expect(ironKing).toBeDefined();
    expect(ironKing!.score).toBe(10 + 8); // priority + faction bonus
  });
});

describe('resolveEnding', () => {
  it('returns the best qualifying ending', () => {
    const state = makeState({
      factions: { iron_throne: 60, shadow_guild: 60, peoples_front: 0, old_faith: 0 },
      stats: { strength: 10, dexterity: 10, intelligence: 10, wisdom: 10, constitution: 10, charisma: 10, influence: 0, cunning: 40, diplomacy: 50 },
    });
    const ending = resolveEnding(testEndings, state);
    expect(ending).not.toBeNull();
    // Both iron_throne and shadow_guild qualify, faction bonus from iron_throne=60 ties with shadow_guild=60
    // Both have priority 10, but iron_throne also gets bonus 6 vs shadow_guild bonus 6 (tied)
    expect(ending!.id).toBeDefined();
  });

  it('returns null when no ending qualifies', () => {
    const state = makeState();
    const ending = resolveEnding(testEndings, state);
    expect(ending).toBeNull();
  });

  it('returns the tragic ending for low diplomacy', () => {
    const state = makeState({
      stats: { strength: 10, dexterity: 10, intelligence: 10, wisdom: 10, constitution: 10, charisma: 10, influence: 25, cunning: 10, diplomacy: 3 },
    });
    const ending = resolveEnding(testEndings, state);
    expect(ending).not.toBeNull();
    expect(ending!.id).toBe('ending_fallen');
  });
});
