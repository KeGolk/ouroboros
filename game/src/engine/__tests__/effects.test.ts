import { applyEffect, applyEffects } from '../effects';
import type { GameState, Effect } from '../types';
import { createNewGameState } from '../narrative-engine';

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    ...createNewGameState('TestPlayer', 'ch1', 'scene1'),
    ...overrides,
  };
}

describe('applyEffect', () => {
  describe('stat effects', () => {
    it('increases a stat', () => {
      const state = makeState();
      const result = applyEffect(state, { type: 'stat', stat: 'strength', delta: 5 });
      expect(result.stats.strength).toBe(15);
      // Original unchanged (immutable)
      expect(state.stats.strength).toBe(10);
    });

    it('decreases a stat', () => {
      const state = makeState();
      const result = applyEffect(state, { type: 'stat', stat: 'cunning', delta: -3 });
      expect(result.stats.cunning).toBe(7);
    });

    it('clamps stats to 0-100', () => {
      const state = makeState();
      expect(applyEffect(state, { type: 'stat', stat: 'strength', delta: 200 }).stats.strength).toBe(100);
      expect(applyEffect(state, { type: 'stat', stat: 'strength', delta: -200 }).stats.strength).toBe(0);
    });
  });

  describe('faction effects', () => {
    it('changes faction standing', () => {
      const state = makeState();
      const result = applyEffect(state, { type: 'faction', faction: 'iron_throne', delta: 15 });
      expect(result.factions.iron_throne).toBe(15);
    });

    it('clamps faction standing to -100 to 100', () => {
      const state = makeState();
      expect(applyEffect(state, { type: 'faction', faction: 'shadow_guild', delta: -200 }).factions.shadow_guild).toBe(-100);
      expect(applyEffect(state, { type: 'faction', faction: 'shadow_guild', delta: 200 }).factions.shadow_guild).toBe(100);
    });
  });

  describe('flag effects', () => {
    it('sets a flag', () => {
      const state = makeState();
      const result = applyEffect(state, { type: 'flag', flag: 'found_sword', value: true });
      expect(result.flags.found_sword).toBe(true);
    });

    it('clears a flag', () => {
      const state = makeState({ flags: { found_sword: true } });
      const result = applyEffect(state, { type: 'flag', flag: 'found_sword', value: false });
      expect(result.flags.found_sword).toBe(false);
    });
  });

  describe('character_death effects', () => {
    it('kills a character', () => {
      const state = makeState();
      const result = applyEffect(state, { type: 'character_death', characterId: 'lord_varn' });
      expect(result.deadCharacters).toContain('lord_varn');
    });

    it('does not duplicate dead characters', () => {
      const state = makeState({ deadCharacters: ['lord_varn'] });
      const result = applyEffect(state, { type: 'character_death', characterId: 'lord_varn' });
      expect(result.deadCharacters.filter(c => c === 'lord_varn')).toHaveLength(1);
    });
  });

  describe('unlock effects', () => {
    it('unlocks a target', () => {
      const state = makeState();
      const result = applyEffect(state, { type: 'unlock', target: 'chapter_secret' });
      expect(result.unlocks).toContain('chapter_secret');
    });

    it('does not duplicate unlocks', () => {
      const state = makeState({ unlocks: ['chapter_secret'] });
      const result = applyEffect(state, { type: 'unlock', target: 'chapter_secret' });
      expect(result.unlocks.filter(u => u === 'chapter_secret')).toHaveLength(1);
    });
  });
});

describe('applyEffects', () => {
  it('applies multiple effects in sequence', () => {
    const state = makeState();
    const effects: Effect[] = [
      { type: 'stat', stat: 'strength', delta: 5 },
      { type: 'faction', faction: 'iron_throne', delta: 10 },
      { type: 'flag', flag: 'allied_with_king', value: true },
      { type: 'character_death', characterId: 'rebel_leader' },
    ];
    const result = applyEffects(state, effects);
    expect(result.stats.strength).toBe(15);
    expect(result.factions.iron_throne).toBe(10);
    expect(result.flags.allied_with_king).toBe(true);
    expect(result.deadCharacters).toContain('rebel_leader');
  });

  it('returns original state for empty effects', () => {
    const state = makeState();
    const result = applyEffects(state, []);
    expect(result).toBe(state);
  });
});
