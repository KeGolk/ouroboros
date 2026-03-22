/**
 * Narrative Engine — Public API
 *
 * Core engine for a branching narrative RPG with political intrigue.
 * Tracks player choices, evaluates conditions, applies effects,
 * and determines ending paths.
 */

// Types
export type {
  FactionId,
  FactionStanding,
  PlayerStats,
  ComparisonOp,
  StatCondition,
  FactionCondition,
  FlagCondition,
  ChoiceCountCondition,
  ChapterCompletedCondition,
  CharacterAliveCondition,
  CompositeCondition,
  NotCondition,
  Condition,
  StatEffect,
  FactionEffect,
  FlagEffect,
  CharacterDeathEffect,
  UnlockEffect,
  Effect,
  Choice,
  Scene,
  Chapter,
  Ending,
  ChoiceRecord,
  GameState,
  StoryData,
  CharacterDef,
} from './types';

// Condition evaluator
export {
  evaluateCondition,
  evaluateConditions,
  filterAvailableChoices,
} from './conditions';

// Effect applicator
export {
  applyEffect,
  applyEffects,
} from './effects';

// Ending resolution
export {
  evaluateEndings,
  resolveEnding,
  getDominantFaction,
  getEndingProgress,
} from './endings';

// Narrative engine
export {
  NarrativeEngine,
  createNewGameState,
  createDefaultStats,
  createDefaultFactions,
} from './narrative-engine';

export type { EngineEvent, EngineEventListener } from './narrative-engine';

// Reputation state management
export {
  REPUTATION_MIN,
  REPUTATION_MAX,
  REPUTATION_DEFAULT,
  ALL_FACTION_IDS,
  TIER_THRESHOLDS,
  RIPPLE_MATRIX,
  clampReputation,
  createFactionStanding,
  getReputation,
  getReputationTier,
  getAllReputationTiers,
  updateReputation,
  setReputation,
  updateReputationWithRipple,
  batchUpdateReputation,
  meetsReputationThreshold,
  meetsReputationTier,
  getHighestReputationFaction,
  getLowestReputationFaction,
  getReputationSummary,
  applyReputationEffect,
  validateFactionStanding,
  sanitizeFactionStanding,
} from './reputation';

export type { ReputationTier, FactionReputationSummary } from './reputation';

// Dialogue check system
export {
  performDialogueCheck,
  performThresholdCheck,
  isDialogueOptionAvailable,
  filterDialogueOptions,
  categorizeDialogueOptions,
  attemptDialogueOption,
  performMultiCheck,
  getEffectiveStatValue,
  getStatModifier,
  getFactionBonus,
  determineOutcome,
  resolveCheckStats,
  generateCheckTooltip,
  generateStatTag,
  getReputationModifier,
  SKILL_CHECK_STATS,
  NARRATIVE_CHECK_PRESETS,
  DialogueDifficulty,
} from './dialogue-checks';

export type {
  DialogueStat,
  PoliticalStat,
  NarrativeStat,
  SkillCheckType,
  CheckOutcomeLevel,
  DialogueCheckResult,
  DialogueCheckConfig,
  ConditionalDialogue,
  MultiCheckConfig,
} from './dialogue-checks';

// Combat resolution engine
export {
  createRng,
  setGlobalRng,
  resetGlobalRng,
  getStatTotal,
  computeDerived,
  calculateHitChance,
  calculateRawDamage,
  calculateMitigation,
  calculateFinalDamage,
  calculateEvasion,
  calculateCritChance,
  resolveAttack,
  resolveDefend,
  resolveFlee,
  processStatusEffects,
  applyStatusTicks,
  calculateTurnOrder,
  snapshotCombatants,
  chooseAiAction,
  resolveMinorEncounter,
  createCombatant,
  checkPhaseTransition,
  BASIC_ATTACK,
  CombatEngine,
} from './combat';

// Fog of War system
export {
  createFogOfWarState,
  getLocationStatus,
  discoverLocation,
  visitLocation,
  processSceneLocation,
  findLocationBySceneText,
  updateFogFromGameState,
  getExplorationProgress,
  getLocationsByStatus,
  serializeFogState,
  deserializeFogState,
} from './fog-of-war';

export type {
  LocationId,
  DiscoveryStatus,
  MapLocation,
  FogOfWarState,
} from './fog-of-war';

// Travel system
export {
  computeAvailableDestinations,
  computeTravelAvailability,
  travelToLocation,
  revealSecretPath,
  getChapterLocations,
  getFactionLocations,
} from './travel';

export type { TravelDestination } from './travel';
