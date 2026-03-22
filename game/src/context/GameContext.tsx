'use client';

/**
 * GameState React context provider for Crowns of Ash.
 *
 * Provides the current GameState and dispatch actions to all
 * descendant components via React Context + useReducer.
 */

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';

import type { PlayerStats, FactionId, FactionStanding } from '../engine/types';
import type {
  GameState,
  GamePhase,
  GameDifficulty,
  InventoryItem,
  ActiveEffect,
} from '../types/game';
import {
  createInitialGameState,
  DEFAULT_GAME_CONFIG,
} from '../types/game';

// ─── Action Types ────────────────────────────────────────────────────────────

/** All possible actions that can be dispatched to mutate GameState */
export type GameAction =
  | { type: 'NEW_GAME'; payload: { saveId: string; playerName: string } }
  | { type: 'LOAD_GAME'; payload: { gameState: GameState } }
  | { type: 'SET_PHASE'; payload: { phase: GamePhase } }
  | { type: 'SET_SCENE'; payload: { chapterId: string; sceneId: string } }
  | { type: 'UPDATE_STATS'; payload: { stats: Partial<PlayerStats> } }
  | { type: 'SET_PLAYER_NAME'; payload: { name: string } }
  | { type: 'SET_FACTION'; payload: { factionId: FactionId } }
  | { type: 'UPDATE_FACTION_REPUTATION'; payload: { factionId: FactionId; delta: number } }
  | { type: 'SET_FLAG'; payload: { flag: string; value: boolean } }
  | { type: 'ADD_TO_INVENTORY'; payload: { item: InventoryItem } }
  | { type: 'REMOVE_FROM_INVENTORY'; payload: { itemId: string } }
  | { type: 'EQUIP_ITEM'; payload: { itemId: string; equipped: boolean } }
  | { type: 'ADD_EFFECT'; payload: { effect: ActiveEffect } }
  | { type: 'REMOVE_EFFECT'; payload: { effectId: string } }
  | { type: 'TICK_EFFECTS' }
  | { type: 'GAIN_EXPERIENCE'; payload: { amount: number } }
  | { type: 'LEVEL_UP' }
  | { type: 'SET_HEALTH'; payload: { current: number; max?: number } }
  | { type: 'TAKE_DAMAGE'; payload: { amount: number } }
  | { type: 'HEAL'; payload: { amount: number } }
  | { type: 'KILL_CHARACTER'; payload: { characterId: string } }
  | { type: 'ADD_UNLOCK'; payload: { unlockId: string } }
  | { type: 'COMPLETE_CHAPTER'; payload: { chapterId: string } }
  | { type: 'SET_LOCATION'; payload: { locationId: string } }
  | { type: 'SET_DIFFICULTY'; payload: { difficulty: GameDifficulty } }
  | { type: 'SAVE_TIMESTAMP' }
  | { type: 'INCREMENT_PLAYTIME'; payload: { seconds: number } }
  | { type: 'ADD_ACHIEVEMENT'; payload: { achievementId: string } };

// ─── Reducer ─────────────────────────────────────────────────────────────────

function clampReputation(value: number): number {
  return Math.max(-100, Math.min(100, value));
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'NEW_GAME':
      return createInitialGameState(
        action.payload.saveId,
        action.payload.playerName,
        DEFAULT_GAME_CONFIG,
      );

    case 'LOAD_GAME':
      return action.payload.gameState;

    case 'SET_PHASE':
      return { ...state, phase: action.payload.phase };

    case 'SET_SCENE':
      return {
        ...state,
        currentChapterId: action.payload.chapterId,
        currentSceneId: action.payload.sceneId,
      };

    case 'UPDATE_STATS':
      return {
        ...state,
        stats: { ...state.stats, ...action.payload.stats },
      };

    case 'SET_PLAYER_NAME':
      return { ...state, playerName: action.payload.name };

    case 'SET_FACTION':
      return { ...state, playerFaction: action.payload.factionId };

    case 'UPDATE_FACTION_REPUTATION': {
      const { factionId, delta } = action.payload;
      const current = state.factions[factionId];
      return {
        ...state,
        factions: {
          ...state.factions,
          [factionId]: clampReputation(current + delta),
        } as FactionStanding,
      };
    }

    case 'SET_FLAG':
      return {
        ...state,
        flags: { ...state.flags, [action.payload.flag]: action.payload.value },
      };

    case 'ADD_TO_INVENTORY':
      return {
        ...state,
        inventory: [...state.inventory, action.payload.item],
      };

    case 'REMOVE_FROM_INVENTORY':
      return {
        ...state,
        inventory: state.inventory.filter((i) => i.id !== action.payload.itemId),
      };

    case 'EQUIP_ITEM':
      return {
        ...state,
        inventory: state.inventory.map((i) =>
          i.id === action.payload.itemId
            ? { ...i, equipped: action.payload.equipped }
            : i,
        ),
      };

    case 'ADD_EFFECT':
      return {
        ...state,
        activeEffects: [...state.activeEffects, action.payload.effect],
      };

    case 'REMOVE_EFFECT':
      return {
        ...state,
        activeEffects: state.activeEffects.filter(
          (e) => e.id !== action.payload.effectId,
        ),
      };

    case 'TICK_EFFECTS':
      return {
        ...state,
        activeEffects: state.activeEffects
          .map((e) =>
            e.remainingTurns !== null
              ? { ...e, remainingTurns: e.remainingTurns - 1 }
              : e,
          )
          .filter((e) => e.remainingTurns === null || e.remainingTurns > 0),
      };

    case 'GAIN_EXPERIENCE':
      return {
        ...state,
        experience: state.experience + action.payload.amount,
      };

    case 'LEVEL_UP':
      return {
        ...state,
        level: Math.min(state.level + 1, 100),
      };

    case 'SET_HEALTH':
      return {
        ...state,
        currentHealth: action.payload.current,
        maxHealth: action.payload.max ?? state.maxHealth,
      };

    case 'TAKE_DAMAGE':
      return {
        ...state,
        currentHealth: Math.max(0, state.currentHealth - action.payload.amount),
      };

    case 'HEAL':
      return {
        ...state,
        currentHealth: Math.min(
          state.maxHealth,
          state.currentHealth + action.payload.amount,
        ),
      };

    case 'KILL_CHARACTER':
      return {
        ...state,
        deadCharacters: [...state.deadCharacters, action.payload.characterId],
      };

    case 'ADD_UNLOCK':
      return {
        ...state,
        unlocks: [...state.unlocks, action.payload.unlockId],
      };

    case 'COMPLETE_CHAPTER':
      return {
        ...state,
        completedChapters: [
          ...state.completedChapters,
          action.payload.chapterId,
        ],
      };

    case 'SET_LOCATION':
      return {
        ...state,
        currentLocationId: action.payload.locationId,
      };

    case 'SET_DIFFICULTY':
      return {
        ...state,
        difficulty: action.payload.difficulty,
      };

    case 'SAVE_TIMESTAMP':
      return { ...state, savedAt: Date.now() };

    case 'INCREMENT_PLAYTIME':
      return {
        ...state,
        playtimeSeconds: state.playtimeSeconds + action.payload.seconds,
      };

    case 'ADD_ACHIEVEMENT':
      return {
        ...state,
        achievements: [...state.achievements, action.payload.achievementId],
      };

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

/** Shape of the value provided by the GameContext */
export interface GameContextValue {
  /** Current game state */
  state: GameState;
  /** Dispatch a game action to update state */
  dispatch: React.Dispatch<GameAction>;
  /** Start a new game with given save ID and player name */
  newGame: (saveId: string, playerName: string) => void;
  /** Load a previously saved game state */
  loadGame: (gameState: GameState) => void;
  /** Whether the game has started (not on main menu) */
  isPlaying: boolean;
}

const GameContext = createContext<GameContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export interface GameProviderProps {
  children: ReactNode;
  /** Optional initial state for testing or save restoration */
  initialState?: GameState;
}

export function GameProvider({ children, initialState }: GameProviderProps) {
  const defaultState =
    initialState ??
    createInitialGameState('default', '', DEFAULT_GAME_CONFIG);

  const [state, dispatch] = useReducer(gameReducer, defaultState);

  const newGame = useCallback(
    (saveId: string, playerName: string) => {
      dispatch({ type: 'NEW_GAME', payload: { saveId, playerName } });
    },
    [],
  );

  const loadGame = useCallback(
    (gameState: GameState) => {
      dispatch({ type: 'LOAD_GAME', payload: { gameState } });
    },
    [],
  );

  const isPlaying = state.phase !== 'main_menu' && state.phase !== 'game_over';

  const value: GameContextValue = {
    state,
    dispatch,
    newGame,
    loadGame,
    isPlaying,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Access the game state and dispatch actions.
 *
 * Must be used within a `<GameProvider>`.
 *
 * @throws Error if used outside of a GameProvider
 */
export function useGameState(): GameContextValue {
  const context = useContext(GameContext);
  if (context === null) {
    throw new Error('useGameState must be used within a <GameProvider>');
  }
  return context;
}

export default GameContext;
