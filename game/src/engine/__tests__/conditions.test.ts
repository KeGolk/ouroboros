import { evaluateCondition, evaluateConditions, filterAvailableChoices } from '../conditions';
import type { GameState, Condition, Choice } from '../types';
import { createNewGameState } from '../narrative-engine';

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    ...createNewGameState('TestPlayer', 'ch1', 'scene1'),
    ...overrides,
  };
}

describe('evaluateCondition', () => {
  describe('stat conditions', () => {
    it('evaluates gte correctly', () => {
      const state = makeState({ stats: { strength: 15, dexterity: 10, intelligence: 10, wisdom: 10, constitution: 10, charisma: 10, influence: 0, cunning: 10, diplomacy: 0 } });
      expect(evaluateCondition({ type: 'stat', stat: 'strength', op: 'gte', value: 15 }, state)).toBe(true);
      expect(evaluateCondition({ type: 'stat', stat: 'strength', op: 'gte', value: 16 }, state)).toBe(false);
    });

    it('evaluates lt correctly', () => {
      const state = makeState({ stats: { strength: 5, dexterity: 10, intelligence: 10, wisdom: 10, constitution: 10, charisma: 10, influence: 0, cunning: 10, diplomacy: 0 } });
      expect(evaluateCondition({ type: 'stat', stat: 'strength', op: 'lt', value: 10 }, state)).toBe(true);
      expect(evaluateCondition({ type: 'stat', stat: 'strength', op: 'lt', value: 5 }, state)).toBe(false);
    });

    it('evaluates eq and neq correctly', () => {
      const state = makeState();
      expect(evaluateCondition({ type: 'stat', stat: 'diplomacy', op: 'eq', value: 0 }, state)).toBe(true);
      expect(evaluateCondition({ type: 'stat', stat: 'diplomacy', op: 'neq', value: 0 }, state)).toBe(false);
      expect(evaluateCondition({ type: 'stat', stat: 'diplomacy', op: 'neq', value: 1 }, state)).toBe(true);
    });
  });

  describe('faction conditions', () => {
    it('evaluates faction standing', () => {
      const state = makeState({
        factions: { iron_throne: 30, shadow_guild: -20, peoples_front: 10, old_faith: 0 },
      });
      expect(evaluateCondition({ type: 'faction', faction: 'iron_throne', op: 'gte', value: 25 }, state)).toBe(true);
      expect(evaluateCondition({ type: 'faction', faction: 'shadow_guild', op: 'lt', value: 0 }, state)).toBe(true);
      expect(evaluateCondition({ type: 'faction', faction: 'old_faith', op: 'eq', value: 0 }, state)).toBe(true);
    });
  });

  describe('flag conditions', () => {
    it('evaluates set flags', () => {
      const state = makeState({ flags: { betrayed_king: true, found_artifact: false } });
      expect(evaluateCondition({ type: 'flag', flag: 'betrayed_king', value: true }, state)).toBe(true);
      expect(evaluateCondition({ type: 'flag', flag: 'found_artifact', value: true }, state)).toBe(false);
    });

    it('unset flags default to false', () => {
      const state = makeState({ flags: {} });
      expect(evaluateCondition({ type: 'flag', flag: 'nonexistent', value: false }, state)).toBe(true);
      expect(evaluateCondition({ type: 'flag', flag: 'nonexistent', value: true }, state)).toBe(false);
    });
  });

  describe('choice_count conditions', () => {
    it('counts exact choice matches', () => {
      const state = makeState({
        choiceHistory: [
          { chapterId: 'ch1', sceneId: 's1', choiceId: 'help_villagers', timestamp: 1 },
          { chapterId: 'ch1', sceneId: 's2', choiceId: 'help_villagers', timestamp: 2 },
          { chapterId: 'ch2', sceneId: 's1', choiceId: 'betray_ally', timestamp: 3 },
        ],
      });
      expect(evaluateCondition({ type: 'choice_count', pattern: 'help_villagers', op: 'gte', value: 2 }, state)).toBe(true);
      expect(evaluateCondition({ type: 'choice_count', pattern: 'betray_ally', op: 'eq', value: 1 }, state)).toBe(true);
    });

    it('counts wildcard pattern matches', () => {
      const state = makeState({
        choiceHistory: [
          { chapterId: 'ch1', sceneId: 's1', choiceId: 'honor_choice_1', timestamp: 1 },
          { chapterId: 'ch1', sceneId: 's2', choiceId: 'honor_choice_2', timestamp: 2 },
          { chapterId: 'ch2', sceneId: 's1', choiceId: 'corrupt_choice_1', timestamp: 3 },
        ],
      });
      expect(evaluateCondition({ type: 'choice_count', pattern: 'honor_*', op: 'gte', value: 2 }, state)).toBe(true);
      expect(evaluateCondition({ type: 'choice_count', pattern: 'corrupt_*', op: 'eq', value: 1 }, state)).toBe(true);
    });
  });

  describe('chapter_completed conditions', () => {
    it('checks completed chapters', () => {
      const state = makeState({ completedChapters: ['ch1', 'ch2'] });
      expect(evaluateCondition({ type: 'chapter_completed', chapterId: 'ch1' }, state)).toBe(true);
      expect(evaluateCondition({ type: 'chapter_completed', chapterId: 'ch3' }, state)).toBe(false);
    });
  });

  describe('character_alive conditions', () => {
    it('checks if character is alive', () => {
      const state = makeState({ deadCharacters: ['lord_varn'] });
      expect(evaluateCondition({ type: 'character_alive', characterId: 'lord_varn', alive: false }, state)).toBe(true);
      expect(evaluateCondition({ type: 'character_alive', characterId: 'lord_varn', alive: true }, state)).toBe(false);
      expect(evaluateCondition({ type: 'character_alive', characterId: 'lady_mira', alive: true }, state)).toBe(true);
    });
  });

  describe('composite conditions', () => {
    it('evaluates AND conditions', () => {
      const state = makeState({
        stats: { strength: 20, dexterity: 10, intelligence: 10, wisdom: 10, constitution: 10, charisma: 10, influence: 0, cunning: 10, diplomacy: 0 },
        flags: { has_sword: true },
      });
      const condition: Condition = {
        type: 'and',
        conditions: [
          { type: 'stat', stat: 'strength', op: 'gte', value: 15 },
          { type: 'flag', flag: 'has_sword', value: true },
        ],
      };
      expect(evaluateCondition(condition, state)).toBe(true);
    });

    it('fails AND when one is false', () => {
      const state = makeState({
        stats: { strength: 10, dexterity: 10, intelligence: 10, wisdom: 10, constitution: 10, charisma: 10, influence: 0, cunning: 10, diplomacy: 0 },
        flags: { has_sword: true },
      });
      const condition: Condition = {
        type: 'and',
        conditions: [
          { type: 'stat', stat: 'strength', op: 'gte', value: 15 },
          { type: 'flag', flag: 'has_sword', value: true },
        ],
      };
      expect(evaluateCondition(condition, state)).toBe(false);
    });

    it('evaluates OR conditions', () => {
      const state = makeState({
        stats: { strength: 5, dexterity: 10, intelligence: 10, wisdom: 10, constitution: 10, charisma: 10, influence: 0, cunning: 10, diplomacy: 0 },
        factions: { iron_throne: 50, shadow_guild: 0, peoples_front: 0, old_faith: 0 },
      });
      const condition: Condition = {
        type: 'or',
        conditions: [
          { type: 'stat', stat: 'strength', op: 'gte', value: 15 },
          { type: 'faction', faction: 'iron_throne', op: 'gte', value: 40 },
        ],
      };
      expect(evaluateCondition(condition, state)).toBe(true);
    });

    it('evaluates NOT conditions', () => {
      const state = makeState({ flags: { traitor: false } });
      expect(evaluateCondition({ type: 'not', condition: { type: 'flag', flag: 'traitor', value: true } }, state)).toBe(true);
    });

    it('handles deeply nested conditions', () => {
      const state = makeState({
        stats: { strength: 20, dexterity: 10, intelligence: 10, wisdom: 10, constitution: 10, charisma: 10, influence: 0, cunning: 15, diplomacy: 80 },
        flags: { royal_blood: true },
      });
      const condition: Condition = {
        type: 'and',
        conditions: [
          {
            type: 'or',
            conditions: [
              { type: 'stat', stat: 'strength', op: 'gte', value: 18 },
              { type: 'stat', stat: 'cunning', op: 'gte', value: 18 },
            ],
          },
          { type: 'flag', flag: 'royal_blood', value: true },
          { type: 'not', condition: { type: 'stat', stat: 'cunning', op: 'gte', value: 50 } },
        ],
      };
      expect(evaluateCondition(condition, state)).toBe(true);
    });
  });
});

describe('evaluateConditions', () => {
  it('returns true for empty conditions', () => {
    const state = makeState();
    expect(evaluateConditions([], state)).toBe(true);
  });

  it('returns true only when all conditions pass', () => {
    const state = makeState({
      stats: { strength: 20, dexterity: 10, intelligence: 10, wisdom: 10, constitution: 10, charisma: 10, influence: 0, cunning: 10, diplomacy: 50 },
    });
    expect(evaluateConditions([
      { type: 'stat', stat: 'strength', op: 'gte', value: 15 },
      { type: 'stat', stat: 'diplomacy', op: 'gte', value: 50 },
    ], state)).toBe(true);
  });
});

describe('filterAvailableChoices', () => {
  it('returns choices without conditions', () => {
    const choices: Choice[] = [
      { id: 'c1', text: 'Go left', effects: [], nextSceneId: 's2' },
      { id: 'c2', text: 'Go right', effects: [], nextSceneId: 's3' },
    ];
    expect(filterAvailableChoices(choices, makeState())).toHaveLength(2);
  });

  it('filters out choices with unmet conditions', () => {
    const choices: Choice[] = [
      { id: 'c1', text: 'Attack (requires strength)', effects: [], nextSceneId: 's2',
        conditions: [{ type: 'stat', stat: 'strength', op: 'gte', value: 99 }] },
      { id: 'c2', text: 'Talk', effects: [], nextSceneId: 's3' },
    ];
    expect(filterAvailableChoices(choices, makeState())).toHaveLength(1);
    expect(filterAvailableChoices(choices, makeState())[0].id).toBe('c2');
  });
});
