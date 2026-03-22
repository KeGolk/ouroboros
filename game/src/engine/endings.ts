/**
 * Ending resolution engine.
 * Evaluates which ending the player has reached based on accumulated decisions.
 */

import type { Ending, GameState, FactionId, FactionStanding } from './types';
import { evaluateConditions } from './conditions';

export interface EndingCandidate {
  ending: Ending;
  /** How many conditions were met (for scoring) */
  conditionsMet: number;
  /** Priority from the ending definition */
  priority: number;
  /** Calculated score = priority + faction bonus */
  score: number;
}

/**
 * Get the dominant faction from the player's current standings.
 */
export function getDominantFaction(factions: FactionStanding): {
  faction: FactionId;
  standing: number;
} {
  const entries: [FactionId, number][] = [
    ['iron_throne', factions.iron_throne],
    ['shadow_guild', factions.shadow_guild],
    ['peoples_front', factions.peoples_front],
    ['old_faith', factions.old_faith],
  ];

  const sorted = entries.sort((a, b) => b[1] - a[1]);
  return { faction: sorted[0][0], standing: sorted[0][1] };
}

/**
 * Calculate a faction alignment bonus for an ending.
 * If the ending's dominant faction matches the player's highest faction,
 * the ending gets a bonus score.
 */
function factionAlignmentBonus(
  ending: Ending,
  state: GameState
): number {
  if (!ending.dominantFaction) return 0;
  const { faction, standing } = getDominantFaction(state.factions);
  if (faction === ending.dominantFaction && standing > 0) {
    return Math.floor(standing / 10); // 0-10 bonus
  }
  return 0;
}

/**
 * Evaluate all endings and return candidates that qualify.
 * Sorted by score (highest first).
 */
export function evaluateEndings(
  endings: Ending[],
  state: GameState
): EndingCandidate[] {
  const candidates: EndingCandidate[] = [];

  for (const ending of endings) {
    const met = evaluateConditions(ending.conditions, state);
    if (met) {
      const bonus = factionAlignmentBonus(ending, state);
      candidates.push({
        ending,
        conditionsMet: ending.conditions.length,
        priority: ending.priority,
        score: ending.priority + bonus,
      });
    }
  }

  // Sort by score descending, then by priority descending as tiebreaker
  candidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.priority - a.priority;
  });

  return candidates;
}

/**
 * Determine the single best ending for the current game state.
 * Returns null if no ending conditions are met (shouldn't happen in a complete game).
 */
export function resolveEnding(
  endings: Ending[],
  state: GameState
): Ending | null {
  const candidates = evaluateEndings(endings, state);
  return candidates.length > 0 ? candidates[0].ending : null;
}

/**
 * Get a summary of how close the player is to each ending.
 * Useful for debug/analytics or "ending tracker" UI.
 */
export function getEndingProgress(
  endings: Ending[],
  state: GameState
): Array<{
  endingId: string;
  title: string;
  qualified: boolean;
  /** How many top-level conditions are met (rough progress indicator) */
  conditionsMet: number;
  totalConditions: number;
}> {
  return endings.map(ending => {
    // Count individual conditions met
    let met = 0;
    for (const cond of ending.conditions) {
      try {
        const { evaluateCondition } = require('./conditions');
        if (evaluateCondition(cond, state)) met++;
      } catch {
        // Skip if evaluation fails
      }
    }

    return {
      endingId: ending.id,
      title: ending.title,
      qualified: evaluateConditions(ending.conditions, state),
      conditionsMet: met,
      totalConditions: ending.conditions.length,
    };
  });
}
