/**
 * Effect applicator for the narrative engine.
 * Applies effects to game state immutably.
 */

import type { Effect, GameState, PlayerStats, FactionStanding } from './types';

/** Clamp a value between min and max */
function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

/**
 * Apply a single effect to the game state.
 * Returns a new state (immutable).
 */
export function applyEffect(state: GameState, effect: Effect): GameState {
  switch (effect.type) {
    case 'stat': {
      const newStats: PlayerStats = {
        ...state.stats,
        [effect.stat]: clamp(
          state.stats[effect.stat] + effect.delta,
          0,
          100
        ),
      };
      return { ...state, stats: newStats };
    }

    case 'faction': {
      const newFactions: FactionStanding = {
        ...state.factions,
        [effect.faction]: clamp(
          state.factions[effect.faction] + effect.delta,
          -100,
          100
        ),
      };
      return { ...state, factions: newFactions };
    }

    case 'flag': {
      return {
        ...state,
        flags: { ...state.flags, [effect.flag]: effect.value },
      };
    }

    case 'character_death': {
      if (state.deadCharacters.includes(effect.characterId)) {
        return state; // Already dead
      }
      return {
        ...state,
        deadCharacters: [...state.deadCharacters, effect.characterId],
      };
    }

    case 'unlock': {
      if (state.unlocks.includes(effect.target)) {
        return state; // Already unlocked
      }
      return {
        ...state,
        unlocks: [...state.unlocks, effect.target],
      };
    }

    default: {
      const _exhaustive: never = effect;
      throw new Error(`Unknown effect type: ${(_exhaustive as Effect).type}`);
    }
  }
}

/**
 * Apply multiple effects to the game state in order.
 * Returns a new state (immutable).
 */
export function applyEffects(state: GameState, effects: Effect[]): GameState {
  return effects.reduce((s, effect) => applyEffect(s, effect), state);
}
