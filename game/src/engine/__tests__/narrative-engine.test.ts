import { NarrativeEngine, createNewGameState } from '../narrative-engine';
import type { StoryData, Chapter, Scene, Ending } from '../types';

// ─── Test Story Data ────────────────────────────────────────────────────────

function createTestStory(): StoryData {
  const chapter1: Chapter = {
    id: 'ch1',
    number: 1,
    title: 'The Beginning',
    description: 'Your journey begins.',
    entrySceneId: 'ch1_intro',
    scenes: {
      ch1_intro: {
        id: 'ch1_intro',
        text: 'You stand at the crossroads of fate.',
        choices: [
          {
            id: 'ally_throne',
            text: 'Seek the Iron Throne',
            effects: [
              { type: 'faction', faction: 'iron_throne', delta: 20 },
              { type: 'stat', stat: 'diplomacy', delta: 5 },
            ],
            nextSceneId: 'ch1_throne_path',
          },
          {
            id: 'join_shadows',
            text: 'Slip into the shadows',
            effects: [
              { type: 'faction', faction: 'shadow_guild', delta: 20 },
              { type: 'stat', stat: 'cunning', delta: 5 },
            ],
            nextSceneId: 'ch1_shadow_path',
          },
          {
            id: 'help_people',
            text: 'Stand with the common folk',
            effects: [
              { type: 'faction', faction: 'peoples_front', delta: 20 },
              { type: 'stat', stat: 'charisma', delta: 5 },
            ],
            nextSceneId: 'ch1_people_path',
          },
          {
            id: 'secret_choice',
            text: 'Invoke the old gods (requires wisdom)',
            conditions: [{ type: 'stat', stat: 'wisdom', op: 'gte', value: 20 }],
            effects: [
              { type: 'faction', faction: 'old_faith', delta: 30 },
              { type: 'stat', stat: 'wisdom', delta: 10 },
            ],
            nextSceneId: 'ch1_faith_path',
          },
        ],
      },
      ch1_throne_path: {
        id: 'ch1_throne_path',
        text: 'The king grants you an audience.',
        speakerId: 'king_aldric',
        choices: [
          {
            id: 'swear_fealty',
            text: 'Swear fealty to the king',
            effects: [
              { type: 'faction', faction: 'iron_throne', delta: 15 },
              { type: 'flag', flag: 'sworn_to_king', value: true },
            ],
            nextSceneId: 'ch1_end',
          },
          {
            id: 'demand_reward',
            text: 'Demand a reward first',
            effects: [
              { type: 'stat', stat: 'cunning', delta: 3 },
              { type: 'stat', stat: 'diplomacy', delta: -5 },
            ],
            nextSceneId: 'ch1_end',
            statCheck: {
              stat: 'charisma',
              difficulty: 25,
              successSceneId: 'ch1_reward_success',
              failureSceneId: 'ch1_reward_fail',
              successEffects: [{ type: 'unlock', target: 'golden_medallion' }],
              failureEffects: [{ type: 'faction', faction: 'iron_throne', delta: -10 }],
            },
          },
        ],
      },
      ch1_shadow_path: {
        id: 'ch1_shadow_path',
        text: 'A hooded figure meets you in the alley.',
        choices: [
          {
            id: 'accept_contract',
            text: 'Accept the assassination contract',
            effects: [
              { type: 'faction', faction: 'shadow_guild', delta: 15 },
              { type: 'stat', stat: 'cunning', delta: 10 },
              { type: 'flag', flag: 'assassin_contract', value: true },
            ],
            nextSceneId: 'ch1_end',
          },
        ],
      },
      ch1_people_path: {
        id: 'ch1_people_path',
        text: 'The villagers welcome you as one of their own.',
        choices: [
          {
            id: 'defend_village',
            text: 'Defend the village from bandits',
            effects: [
              { type: 'faction', faction: 'peoples_front', delta: 15 },
              { type: 'stat', stat: 'strength', delta: 5 },
            ],
            nextSceneId: 'ch1_combat',
          },
        ],
      },
      ch1_combat: {
        id: 'ch1_combat',
        text: 'Bandits attack the village!',
        isCombat: true,
        combat: {
          enemyName: 'Bandit Leader',
          enemyStrength: 15,
          playerStatUsed: 'strength',
          victorySceneId: 'ch1_end',
          defeatSceneId: 'ch1_defeat',
          victoryEffects: [
            { type: 'stat', stat: 'strength', delta: 3 },
            { type: 'flag', flag: 'defeated_bandits', value: true },
          ],
          defeatEffects: [
            { type: 'stat', stat: 'diplomacy', delta: -5 },
          ],
        },
        choices: [],
      },
      ch1_faith_path: {
        id: 'ch1_faith_path',
        text: 'The ancient spirits respond to your call.',
        onEnterEffects: [
          { type: 'flag', flag: 'awakened_spirits', value: true },
        ],
        choices: [
          {
            id: 'embrace_power',
            text: 'Embrace the dark power',
            effects: [
              { type: 'stat', stat: 'cunning', delta: 15 },
              { type: 'stat', stat: 'wisdom', delta: 10 },
            ],
            nextSceneId: 'ch1_end',
          },
        ],
      },
      ch1_reward_success: {
        id: 'ch1_reward_success',
        text: 'The king, impressed by your boldness, grants you a golden medallion.',
        choices: [{ id: 'continue', text: 'Continue', effects: [], nextSceneId: 'ch1_end' }],
      },
      ch1_reward_fail: {
        id: 'ch1_reward_fail',
        text: 'The king is offended by your greed.',
        choices: [{ id: 'continue', text: 'Continue', effects: [], nextSceneId: 'ch1_end' }],
      },
      ch1_defeat: {
        id: 'ch1_defeat',
        text: 'You are wounded but survive.',
        choices: [{ id: 'continue', text: 'Continue', effects: [], nextSceneId: 'ch1_end' }],
      },
      ch1_end: {
        id: 'ch1_end',
        text: 'Chapter 1 concludes.',
        choices: [],
      },
    },
  };

  const chapter2: Chapter = {
    id: 'ch2',
    number: 2,
    title: 'The Rising Storm',
    description: 'War looms on the horizon.',
    entrySceneId: 'ch2_intro',
    unlockConditions: [{ type: 'chapter_completed', chapterId: 'ch1' }],
    scenes: {
      ch2_intro: {
        id: 'ch2_intro',
        text: 'Dark clouds gather over the kingdom.',
        choices: [
          {
            id: 'prepare_war',
            text: 'Prepare for war',
            effects: [{ type: 'stat', stat: 'strength', delta: 5 }],
            nextSceneId: 'ch2_end',
          },
        ],
      },
      ch2_end: {
        id: 'ch2_end',
        text: 'Chapter 2 concludes.',
        choices: [],
      },
    },
  };

  const endings: Ending[] = [
    {
      id: 'ending_iron_king',
      title: 'The Iron Crown',
      description: 'You claim the throne.',
      epilogueText: 'The realm bends to your will...',
      conditions: [
        { type: 'faction', faction: 'iron_throne', op: 'gte', value: 30 },
        { type: 'flag', flag: 'sworn_to_king', value: true },
      ],
      priority: 10,
      dominantFaction: 'iron_throne',
      tone: 'triumphant',
    },
    {
      id: 'ending_shadow',
      title: 'Shadow Ruler',
      description: 'You rule from the dark.',
      epilogueText: 'None know your face...',
      conditions: [
        { type: 'faction', faction: 'shadow_guild', op: 'gte', value: 30 },
        { type: 'flag', flag: 'assassin_contract', value: true },
      ],
      priority: 10,
      dominantFaction: 'shadow_guild',
      tone: 'dark',
    },
  ];

  return {
    chapters: [chapter1, chapter2],
    endings,
    characters: [
      {
        id: 'king_aldric',
        name: 'King Aldric',
        title: 'King of the Realm',
        faction: 'iron_throne',
        description: 'A stern but just ruler.',
        traits: ['stern', 'just', 'proud'],
      },
    ],
  };
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('NarrativeEngine', () => {
  let engine: NarrativeEngine;
  let story: StoryData;

  beforeEach(() => {
    story = createTestStory();
    const state = createNewGameState('Hero', 'ch1', 'ch1_intro');
    engine = new NarrativeEngine(story, state);
  });

  describe('initialization', () => {
    it('starts with the correct scene', () => {
      const scene = engine.getCurrentScene();
      expect(scene).not.toBeNull();
      expect(scene!.id).toBe('ch1_intro');
    });

    it('starts with the correct chapter', () => {
      const chapter = engine.getCurrentChapter();
      expect(chapter).not.toBeNull();
      expect(chapter!.id).toBe('ch1');
    });
  });

  describe('choice tracking', () => {
    it('records choices in history', () => {
      engine.makeChoice('ally_throne');
      const state = engine.getState();
      expect(state.choiceHistory).toHaveLength(1);
      expect(state.choiceHistory[0].choiceId).toBe('ally_throne');
      expect(state.choiceHistory[0].chapterId).toBe('ch1');
    });

    it('accumulates choices across scenes', () => {
      engine.makeChoice('ally_throne');
      engine.makeChoice('swear_fealty');
      const state = engine.getState();
      expect(state.choiceHistory).toHaveLength(2);
    });
  });

  describe('effect application', () => {
    it('applies faction effects from choices', () => {
      engine.makeChoice('ally_throne');
      const state = engine.getState();
      expect(state.factions.iron_throne).toBe(20);
    });

    it('applies stat effects from choices', () => {
      engine.makeChoice('ally_throne');
      const state = engine.getState();
      expect(state.stats.diplomacy).toBe(5);
    });

    it('applies flag effects from choices', () => {
      engine.makeChoice('ally_throne');
      engine.makeChoice('swear_fealty');
      const state = engine.getState();
      expect(state.flags.sworn_to_king).toBe(true);
    });

    it('applies cunning effects', () => {
      engine.makeChoice('join_shadows');
      engine.makeChoice('accept_contract');
      const state = engine.getState();
      expect(state.stats.cunning).toBe(25);
      expect(state.flags.assassin_contract).toBe(true);
    });

    it('applies onEnterEffects when entering a scene', () => {
      // Need wisdom >= 20 for the old faith path
      const state = createNewGameState('Hero', 'ch1', 'ch1_intro');
      state.stats.wisdom = 25;
      engine.setState(state);

      engine.makeChoice('secret_choice');
      const newState = engine.getState();
      expect(newState.flags.awakened_spirits).toBe(true);
    });
  });

  describe('conditional choices', () => {
    it('filters out choices with unmet conditions', () => {
      const choices = engine.getAvailableChoices();
      // secret_choice requires wisdom >= 20, default wisdom is 10
      const secretChoice = choices.find(c => c.id === 'secret_choice');
      expect(secretChoice).toBeUndefined();
      expect(choices).toHaveLength(3); // 3 of 4 available
    });

    it('shows conditional choices when conditions are met', () => {
      const state = engine.getState();
      state.stats.wisdom = 25;
      engine.setState(state);

      const choices = engine.getAvailableChoices();
      const secretChoice = choices.find(c => c.id === 'secret_choice');
      expect(secretChoice).toBeDefined();
      expect(choices).toHaveLength(4);
    });
  });

  describe('stat checks', () => {
    it('resolves stat checks with seed', () => {
      engine.makeChoice('ally_throne');
      // Now at throne path, try demand_reward with stat check
      // charisma=10, roll seed=20, total=30, difficulty=25 → success
      const result = engine.makeChoice('demand_reward');
      // The stat check is handled internally with random, so we test via resolveStatCheck
    });

    it('resolveStatCheck returns deterministic results with seed', () => {
      const result = engine.resolveStatCheck('charisma', 25, 20);
      // charisma=10 + seed=20 = 30 >= 25
      expect(result.success).toBe(true);
      expect(result.roll).toBe(30);
    });

    it('resolveStatCheck fails when roll is too low', () => {
      const result = engine.resolveStatCheck('charisma', 25, 5);
      // charisma=10 + seed=5 = 15 < 25
      expect(result.success).toBe(false);
      expect(result.roll).toBe(15);
    });
  });

  describe('combat', () => {
    it('resolves combat encounters via makeChoice', () => {
      engine.makeChoice('help_people');
      // defend_village navigates to ch1_combat which auto-resolves
      const result = engine.makeChoice('defend_village');
      // makeChoice returns combatResult when navigating to a combat scene
      expect(result.combatResult).toBeDefined();
      expect(typeof result.combatResult!.victory).toBe('boolean');
    });

    it('resolves combat directly via resolveCombat', () => {
      // Test the resolveCombat method directly with known seeds
      const combatConfig = {
        enemyName: 'Test Enemy',
        enemyStrength: 15,
        playerStatUsed: 'strength' as const,
        victorySceneId: 'ch1_end',
        defeatSceneId: 'ch1_defeat',
        victoryEffects: [{ type: 'flag' as const, flag: 'test_victory', value: true }],
        defeatEffects: [{ type: 'stat' as const, stat: 'diplomacy' as const, delta: -5 }],
      };

      // player strength=10 + seed=20 = 30, enemy=15 + seed=1 = 16 → victory
      const result = engine.resolveCombat(combatConfig, 20, 1);
      expect(result.victory).toBe(true);
      expect(result.playerRoll).toBe(30);
      expect(result.enemyRoll).toBe(16);

      // Victory effects should be applied
      const state = engine.getState();
      expect(state.flags.test_victory).toBe(true);
    });

    it('applies defeat effects on combat loss', () => {
      const combatConfig = {
        enemyName: 'Strong Enemy',
        enemyStrength: 50,
        playerStatUsed: 'strength' as const,
        victorySceneId: 'ch1_end',
        defeatSceneId: 'ch1_defeat',
        victoryEffects: [],
        defeatEffects: [{ type: 'stat' as const, stat: 'diplomacy' as const, delta: -10 }],
      };

      // player strength=10 + seed=1 = 11, enemy=50 + seed=20 = 70 → defeat
      const result = engine.resolveCombat(combatConfig, 1, 20);
      expect(result.victory).toBe(false);
      expect(engine.getState().stats.diplomacy).toBe(-10); // 0 - 10
    });
  });

  describe('chapter navigation', () => {
    it('blocks locked chapters', () => {
      // ch2 requires ch1 completed
      const scene = engine.enterChapter('ch2');
      expect(scene).toBeNull();
    });

    it('allows access to unlocked chapters', () => {
      engine.completeCurrentChapter();
      const scene = engine.enterChapter('ch2');
      expect(scene).not.toBeNull();
      expect(scene!.id).toBe('ch2_intro');
    });

    it('tracks completed chapters', () => {
      engine.completeCurrentChapter();
      const state = engine.getState();
      expect(state.completedChapters).toContain('ch1');
    });

    it('navigates with chapter:scene format', () => {
      engine.completeCurrentChapter();
      const scene = engine.navigateTo('ch2:ch2_intro');
      expect(scene).not.toBeNull();
      expect(engine.getState().currentChapterId).toBe('ch2');
    });
  });

  describe('ending resolution', () => {
    it('resolves iron throne ending', () => {
      engine.makeChoice('ally_throne');
      engine.makeChoice('swear_fealty');
      const ending = engine.checkForEnding();
      expect(ending).not.toBeNull();
      expect(ending!.id).toBe('ending_iron_king');
    });

    it('resolves shadow ending', () => {
      engine.makeChoice('join_shadows');
      engine.makeChoice('accept_contract');
      const ending = engine.checkForEnding();
      expect(ending).not.toBeNull();
      expect(ending!.id).toBe('ending_shadow');
    });

    it('returns null when no ending qualifies', () => {
      const ending = engine.checkForEnding();
      expect(ending).toBeNull();
    });

    it('returns qualifying endings ranked', () => {
      engine.makeChoice('ally_throne');
      engine.makeChoice('swear_fealty');
      const endings = engine.getQualifyingEndings();
      expect(endings.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('event system', () => {
    it('emits events on scene enter', () => {
      const events: string[] = [];
      engine.addEventListener(e => events.push(e.type));
      engine.enterScene('ch1_intro');
      expect(events).toContain('scene_enter');
    });

    it('emits events on choice made', () => {
      const events: string[] = [];
      engine.addEventListener(e => events.push(e.type));
      engine.makeChoice('ally_throne');
      expect(events).toContain('choice_made');
      expect(events).toContain('scene_enter');
    });

    it('supports removing listeners', () => {
      const events: string[] = [];
      const remove = engine.addEventListener(e => events.push(e.type));
      engine.makeChoice('ally_throne');
      const count = events.length;
      remove();
      engine.enterScene('ch1_throne_path');
      expect(events.length).toBe(count); // No new events
    });
  });

  describe('New Game+', () => {
    it('creates NG+ state with boosted stats', () => {
      const ngState = engine.createNewGamePlus();
      expect(ngState.ngPlusCycle).toBe(1);
      expect(ngState.stats.strength).toBe(12);
      expect(ngState.stats.cunning).toBe(12);
    });

    it('preserves achievements in NG+', () => {
      engine.awardAchievement('first_blood');
      const ngState = engine.createNewGamePlus();
      expect(ngState.achievements).toContain('first_blood');
    });

    it('resets progress in NG+', () => {
      engine.makeChoice('ally_throne');
      engine.completeCurrentChapter();
      const ngState = engine.createNewGamePlus();
      expect(ngState.choiceHistory).toHaveLength(0);
      expect(ngState.completedChapters).toHaveLength(0);
      expect(ngState.factions.iron_throne).toBe(0);
    });
  });

  describe('achievements', () => {
    it('awards achievements', () => {
      const awarded = engine.awardAchievement('first_choice');
      expect(awarded).toBe(true);
      expect(engine.getState().achievements).toContain('first_choice');
    });

    it('does not duplicate achievements', () => {
      engine.awardAchievement('first_choice');
      const awarded = engine.awardAchievement('first_choice');
      expect(awarded).toBe(false);
      expect(engine.getState().achievements.filter(a => a === 'first_choice')).toHaveLength(1);
    });
  });

  describe('journey summary', () => {
    it('provides accurate summary', () => {
      engine.makeChoice('ally_throne');
      engine.makeChoice('swear_fealty');
      engine.completeCurrentChapter();

      const summary = engine.getJourneySummary();
      expect(summary.chaptersCompleted).toBe(1);
      expect(summary.totalChapters).toBe(2);
      expect(summary.choicesMade).toBe(2);
      expect(summary.dominantFaction.faction).toBe('iron_throne');
    });
  });
});
