import { StatDefinition, StatName, PointBuyConfig } from '@/types/stats';

/** Point-buy configuration for character creation */
export const POINT_BUY_CONFIG: PointBuyConfig = {
  totalPoints: 27,
  minStat: 3,
  maxStat: 18,
  baseStat: 8,
};

/** Cost table for point-buy: stat value -> cumulative cost from baseStat */
export const POINT_COSTS: Record<number, number> = {
  3: -5,
  4: -4,
  5: -3,
  6: -2,
  7: -1,
  8: 0,   // base — free
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,  // costs jump at 14+
  15: 9,
  16: 12,
  17: 15,
  18: 19,
};

/** Narrative check thresholds — stat must be >= this to pass */
export const NARRATIVE_THRESHOLDS: Record<StatName, number> = {
  strength: 12,
  dexterity: 12,
  intelligence: 12,
  wisdom: 12,
  constitution: 12,
  charisma: 12,
  influence: 12,
  cunning: 12,
  diplomacy: 12,
};

/** All nine primary stat definitions */
export const STAT_DEFINITIONS: StatDefinition[] = [
  {
    name: 'strength',
    label: 'Strength',
    abbreviation: 'STR',
    description: 'Raw physical power. Governs melee damage, intimidation, and feats of brute force.',
    icon: '⚔️',
    combatEffects: [
      'Increases melee damage by 1.5× per point',
      'Adds 2 HP per point',
      'Unlocks heavy weapon proficiency at 14+',
    ],
    narrativeEffects: [
      'Intimidate guards and rivals',
      'Break down doors and obstacles',
      'Win arm-wrestling challenges at feasts',
    ],
    color: '#c0392b',
  },
  {
    name: 'dexterity',
    label: 'Dexterity',
    abbreviation: 'DEX',
    description: 'Agility, reflexes, and precision. Governs evasion, ranged accuracy, and infiltration.',
    icon: '🏹',
    combatEffects: [
      'Increases evasion by 2% per point (max 40%)',
      'Boosts initiative for turn order',
      'Increases ranged attack accuracy',
    ],
    narrativeEffects: [
      'Sneak past guards and sentries',
      'Pick locks and disarm traps',
      'Perform feats of acrobatic prowess',
    ],
    color: '#16a085',
  },
  {
    name: 'intelligence',
    label: 'Intelligence',
    abbreviation: 'INT',
    description: 'Arcane knowledge and tactical acumen. Governs lore checks, tactical power, and puzzle-solving.',
    icon: '📖',
    combatEffects: [
      'Increases tactical power by 1.2× per point',
      'Reveals enemy weaknesses at 14+',
      'Increases critical hit planning bonus',
    ],
    narrativeEffects: [
      'Decipher ancient texts and prophecies',
      'Identify poisons and magical artifacts',
      'Solve complex riddles and puzzles',
    ],
    color: '#2980b9',
  },
  {
    name: 'wisdom',
    label: 'Wisdom',
    abbreviation: 'WIS',
    description: 'Perception, insight, and spiritual awareness. Governs willpower, healing, and mystical foresight.',
    icon: '📜',
    combatEffects: [
      'Increases healing effectiveness',
      'Adds tactical power by 0.8× per point',
      'Resistance to mental effects at 14+',
    ],
    narrativeEffects: [
      'Sense hidden dangers and ambushes',
      'Read people\'s true intentions',
      'Uncover hidden lore about the realm',
    ],
    color: '#8e44ad',
  },
  {
    name: 'constitution',
    label: 'Constitution',
    abbreviation: 'CON',
    description: 'Physical and mental resilience. Governs health, armor, and resistance to torture or poison.',
    icon: '🛡️',
    combatEffects: [
      'Increases max HP by 5 per point',
      'Adds 1.5 armor per point',
      'Resistance to status effects at 14+',
    ],
    narrativeEffects: [
      'Endure torture without breaking',
      'Resist poison and disease',
      'Survive harsh wilderness travel',
    ],
    color: '#27ae60',
  },
  {
    name: 'charisma',
    label: 'Charisma',
    abbreviation: 'CHA',
    description: 'Force of personality and leadership. Governs persuasion, morale, and commanding presence.',
    icon: '👑',
    combatEffects: [
      'Boosts ally morale in group encounters',
      'Chance to convince enemies to surrender',
      'Faction reputation gains increased by 10% per point',
    ],
    narrativeEffects: [
      'Persuade nobles and commoners alike',
      'Rally troops and followers to your cause',
      'Inspire loyalty in companions',
    ],
    color: '#f39c12',
  },
  {
    name: 'influence',
    label: 'Influence',
    abbreviation: 'INF',
    description: 'Political sway and reputation leverage. Governs court intrigue, power plays, and social standing.',
    icon: '🏛️',
    combatEffects: [
      'Call in favors for reinforcements',
      'Demoralize enemies through reputation',
      'Access to elite mercenary options',
    ],
    narrativeEffects: [
      'Leverage political connections',
      'Sway council votes and decrees',
      'Access restricted areas through status',
    ],
    color: '#d4af37',
  },
  {
    name: 'cunning',
    label: 'Cunning',
    abbreviation: 'CUN',
    description: 'Deception, scheming, and subterfuge. Governs traps, poisons, and underhanded tactics.',
    icon: '🗡️',
    combatEffects: [
      'Increases critical hit chance by 1.5% per point',
      'Boosts ambush effectiveness',
      'Increases poison damage',
    ],
    narrativeEffects: [
      'Detect lies and hidden motives',
      'Craft elaborate deceptions',
      'Outmaneuver political rivals',
    ],
    color: '#2c3e50',
  },
  {
    name: 'diplomacy',
    label: 'Diplomacy',
    abbreviation: 'DIP',
    description: 'Negotiation, alliance-building, and conflict resolution. Governs treaties, truces, and faction relations.',
    icon: '🤝',
    combatEffects: [
      'Chance to negotiate enemy surrender',
      'Improved truce terms after combat',
      'Reduced faction reputation penalties',
    ],
    narrativeEffects: [
      'Broker peace between warring factions',
      'Negotiate favorable trade agreements',
      'Resolve conflicts without bloodshed',
    ],
    color: '#3498db',
  },
];

/** Get stat definition by name */
export function getStatDef(name: StatName): StatDefinition {
  const def = STAT_DEFINITIONS.find(s => s.name === name);
  if (!def) throw new Error(`Unknown stat: ${name}`);
  return def;
}

/** All stat names in display order */
export const STAT_NAMES: StatName[] = STAT_DEFINITIONS.map(s => s.name);
