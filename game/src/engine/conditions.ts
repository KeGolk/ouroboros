/**
 * Condition evaluator for the narrative engine.
 * Evaluates branching conditions against the current game state.
 */

import type {
  Condition,
  GameState,
  ComparisonOp,
} from './types';

/**
 * Compare two numbers using the specified operator.
 */
function compare(left: number, op: ComparisonOp, right: number): boolean {
  switch (op) {
    case 'gte': return left >= right;
    case 'lte': return left <= right;
    case 'gt':  return left > right;
    case 'lt':  return left < right;
    case 'eq':  return left === right;
    case 'neq': return left !== right;
    default:
      throw new Error(`Unknown comparison operator: ${op}`);
  }
}

/**
 * Count choices in history matching a pattern.
 * Supports '*' wildcard at end (e.g., "ch1_*" matches all ch1 choices).
 */
function countMatchingChoices(
  history: GameState['choiceHistory'],
  pattern: string
): number {
  if (pattern.endsWith('*')) {
    const prefix = pattern.slice(0, -1);
    return history.filter(c => c.choiceId.startsWith(prefix)).length;
  }
  return history.filter(c => c.choiceId === pattern).length;
}

/**
 * Evaluate a single condition against the current game state.
 * Returns true if the condition is met.
 */
export function evaluateCondition(
  condition: Condition,
  state: GameState
): boolean {
  switch (condition.type) {
    case 'stat':
      return compare(
        state.stats[condition.stat],
        condition.op,
        condition.value
      );

    case 'faction':
      return compare(
        state.factions[condition.faction],
        condition.op,
        condition.value
      );

    case 'flag':
      return (state.flags[condition.flag] ?? false) === condition.value;

    case 'choice_count':
      return compare(
        countMatchingChoices(state.choiceHistory, condition.pattern),
        condition.op,
        condition.value
      );

    case 'chapter_completed':
      return state.completedChapters.includes(condition.chapterId);

    case 'character_alive':
      const isDead = state.deadCharacters.includes(condition.characterId);
      return condition.alive ? !isDead : isDead;

    case 'and':
      return condition.conditions.every(c => evaluateCondition(c, state));

    case 'or':
      return condition.conditions.some(c => evaluateCondition(c, state));

    case 'not':
      return !evaluateCondition(condition.condition, state);

    default:
      // Exhaustive check
      const _exhaustive: never = condition;
      throw new Error(`Unknown condition type: ${(_exhaustive as Condition).type}`);
  }
}

/**
 * Evaluate multiple conditions (all must be true - implicit AND).
 */
export function evaluateConditions(
  conditions: Condition[],
  state: GameState
): boolean {
  return conditions.every(c => evaluateCondition(c, state));
}

/**
 * Filter choices that are available given the current state.
 * Choices without conditions are always available.
 */
export function filterAvailableChoices<T extends { conditions?: Condition[] }>(
  choices: T[],
  state: GameState
): T[] {
  return choices.filter(choice => {
    if (!choice.conditions || choice.conditions.length === 0) return true;
    return evaluateConditions(choice.conditions, state);
  });
}
