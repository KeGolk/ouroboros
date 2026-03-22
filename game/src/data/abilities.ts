/**
 * Predefined combat abilities for the branching narrative RPG.
 *
 * Organized by faction affinity and combat role.
 * Each ability scales with a primary stat and interacts with the
 * damage type / defense system.
 */

import type { CombatAbility } from '../types/combat';

// ─── Iron Throne Abilities (STR / Fortitude focused) ─────────────────

export const IRON_THRONE_ABILITIES: CombatAbility[] = [
  {
    id: 'crushing_blow',
    name: 'Crushing Blow',
    description: 'A devastating overhead strike that can stagger the foe.',
    scalingStat: 'strength',
    damageType: 'physical',
    baseDamage: 18,
    statMultiplier: 1.4,
    accuracyMod: -5,
    cooldown: 2,
    currentCooldown: 0,
    targetsSelf: false,
    areaOfEffect: false,
    appliesEffect: { type: 'stun', duration: 1, potency: 0 },
    flavorText: 'The weight of iron authority crashes down.',
  },
  {
    id: 'shield_wall',
    name: 'Shield Wall',
    description: 'Raise your guard, gaining significant damage reduction.',
    scalingStat: 'constitution',
    damageType: 'physical',
    baseDamage: 0,
    statMultiplier: 1.0,
    accuracyMod: 0,
    cooldown: 3,
    currentCooldown: 0,
    targetsSelf: true,
    areaOfEffect: false,
    appliesEffect: { type: 'fortified', duration: 2, potency: 15 },
    flavorText: 'An impenetrable wall of steel and resolve.',
  },
  {
    id: 'rallying_cry',
    name: 'Rallying Cry',
    description: 'Inspire yourself with a war cry, boosting critical chance.',
    scalingStat: 'charisma',
    damageType: 'physical',
    baseDamage: 0,
    statMultiplier: 0,
    accuracyMod: 0,
    cooldown: 4,
    currentCooldown: 0,
    targetsSelf: true,
    areaOfEffect: false,
    appliesEffect: { type: 'inspired', duration: 3, potency: 0 },
    flavorText: 'For crown and country!',
  },
];

// ─── Ashen Conclave Abilities (Wisdom / INT focused) ─────────────────

export const ASHEN_CONCLAVE_ABILITIES: CombatAbility[] = [
  {
    id: 'arcane_bolt',
    name: 'Arcane Bolt',
    description: 'A searing bolt of magical energy that bypasses physical armor.',
    scalingStat: 'wisdom',
    damageType: 'arcane',
    baseDamage: 14,
    statMultiplier: 1.6,
    accuracyMod: 5,
    cooldown: 0,
    currentCooldown: 0,
    targetsSelf: false,
    areaOfEffect: false,
    flavorText: 'Pale fire dances between your fingers.',
  },
  {
    id: 'immolate',
    name: 'Immolate',
    description: 'Set the enemy ablaze with arcane fire, dealing damage over time.',
    scalingStat: 'wisdom',
    damageType: 'arcane',
    baseDamage: 8,
    statMultiplier: 1.0,
    accuracyMod: 0,
    cooldown: 3,
    currentCooldown: 0,
    targetsSelf: false,
    areaOfEffect: false,
    appliesEffect: { type: 'burn', duration: 3, potency: 6 },
    flavorText: 'Ashen flames consume the flesh.',
  },
  {
    id: 'soul_mend',
    name: 'Soul Mend',
    description: 'Channel arcane energy to restore health and grant regeneration.',
    scalingStat: 'wisdom',
    damageType: 'arcane',
    baseDamage: 20,
    statMultiplier: 1.2,
    accuracyMod: 0,
    cooldown: 4,
    currentCooldown: 0,
    targetsSelf: true,
    areaOfEffect: false,
    appliesEffect: { type: 'regeneration', duration: 3, potency: 5 },
    flavorText: 'The warmth of forgotten souls seeps into your wounds.',
  },
];

// ─── Verdant Pact Abilities (Fortitude / Nature focused) ─────────────

export const VERDANT_PACT_ABILITIES: CombatAbility[] = [
  {
    id: 'thorn_strike',
    name: 'Thorn Strike',
    description: 'Lash out with bramble-wrapped fists, causing bleeding.',
    scalingStat: 'strength',
    damageType: 'physical',
    baseDamage: 12,
    statMultiplier: 1.2,
    accuracyMod: 0,
    cooldown: 1,
    currentCooldown: 0,
    targetsSelf: false,
    areaOfEffect: false,
    appliesEffect: { type: 'bleed', duration: 3, potency: 4 },
    flavorText: 'Thorns tear through armor and flesh alike.',
  },
  {
    id: 'natures_embrace',
    name: "Nature's Embrace",
    description: 'Draw on the vitality of the land to heal and fortify.',
    scalingStat: 'constitution',
    damageType: 'physical',
    baseDamage: 25,
    statMultiplier: 1.5,
    accuracyMod: 0,
    cooldown: 4,
    currentCooldown: 0,
    targetsSelf: true,
    areaOfEffect: false,
    appliesEffect: { type: 'regeneration', duration: 4, potency: 6 },
    flavorText: 'The forest breathes life into your bones.',
  },
  {
    id: 'venomous_spore',
    name: 'Venomous Spore',
    description: 'Release a cloud of toxic spores that poison the target.',
    scalingStat: 'cunning',
    damageType: 'poison',
    baseDamage: 6,
    statMultiplier: 1.0,
    accuracyMod: 10,
    cooldown: 2,
    currentCooldown: 0,
    targetsSelf: false,
    areaOfEffect: false,
    appliesEffect: { type: 'poison', duration: 4, potency: 5 },
    flavorText: 'Invisible death drifts on the wind.',
  },
];

// ─── Obsidian Guild Abilities (Cunning / Stealth focused) ────────────

export const OBSIDIAN_GUILD_ABILITIES: CombatAbility[] = [
  {
    id: 'backstab',
    name: 'Backstab',
    description: 'A precise strike from the shadows with high crit chance.',
    scalingStat: 'dexterity',
    damageType: 'physical',
    baseDamage: 16,
    statMultiplier: 1.5,
    accuracyMod: 10,
    cooldown: 2,
    currentCooldown: 0,
    targetsSelf: false,
    areaOfEffect: false,
    flavorText: 'The blade finds its mark between the ribs.',
  },
  {
    id: 'smoke_bomb',
    name: 'Smoke Bomb',
    description: 'Disorient the enemy, reducing their accuracy.',
    scalingStat: 'cunning',
    damageType: 'tactical',
    baseDamage: 4,
    statMultiplier: 0.5,
    accuracyMod: 20,
    cooldown: 3,
    currentCooldown: 0,
    targetsSelf: false,
    areaOfEffect: false,
    appliesEffect: { type: 'demoralized', duration: 2, potency: 0 },
    flavorText: 'Acrid smoke fills the air.',
  },
  {
    id: 'poisoned_blade',
    name: 'Poisoned Blade',
    description: 'A venom-coated dagger that deals poison damage over time.',
    scalingStat: 'cunning',
    damageType: 'poison',
    baseDamage: 10,
    statMultiplier: 1.2,
    accuracyMod: 5,
    cooldown: 2,
    currentCooldown: 0,
    targetsSelf: false,
    areaOfEffect: false,
    appliesEffect: { type: 'poison', duration: 3, potency: 6 },
    flavorText: 'One cut is all it takes.',
  },
  {
    id: 'shadow_step',
    name: 'Shadow Step',
    description: 'Melt into the shadows, gaining evasion and haste.',
    scalingStat: 'dexterity',
    damageType: 'physical',
    baseDamage: 0,
    statMultiplier: 0,
    accuracyMod: 0,
    cooldown: 4,
    currentCooldown: 0,
    targetsSelf: true,
    areaOfEffect: false,
    appliesEffect: { type: 'haste', duration: 2, potency: 0 },
    flavorText: 'You become one with the darkness.',
  },
];

// ─── Universal Abilities ─────────────────────────────────────────────

export const UNIVERSAL_ABILITIES: CombatAbility[] = [
  {
    id: 'basic_attack',
    name: 'Strike',
    description: 'A basic physical attack.',
    scalingStat: 'strength',
    damageType: 'physical',
    baseDamage: 5,
    statMultiplier: 1.0,
    accuracyMod: 0,
    cooldown: 0,
    currentCooldown: 0,
    targetsSelf: false,
    areaOfEffect: false,
    flavorText: 'A swift, practiced blow.',
  },
  {
    id: 'second_wind',
    name: 'Second Wind',
    description: 'Draw on inner reserves to recover some health.',
    scalingStat: 'constitution',
    damageType: 'physical',
    baseDamage: 15,
    statMultiplier: 1.0,
    accuracyMod: 0,
    cooldown: 5,
    currentCooldown: 0,
    targetsSelf: true,
    areaOfEffect: false,
    flavorText: 'You grit your teeth and fight on.',
  },
  {
    id: 'tactical_assessment',
    name: 'Tactical Assessment',
    description: 'Study the enemy, gaining inspired status for increased crits.',
    scalingStat: 'cunning',
    damageType: 'tactical',
    baseDamage: 0,
    statMultiplier: 0,
    accuracyMod: 0,
    cooldown: 4,
    currentCooldown: 0,
    targetsSelf: true,
    areaOfEffect: false,
    appliesEffect: { type: 'inspired', duration: 3, potency: 0 },
    flavorText: 'You see the pattern in their movements.',
  },
];

/** Get abilities for a faction */
export function getAbilitiesForFaction(factionId: string): CombatAbility[] {
  switch (factionId) {
    case 'ironThrone':
      return IRON_THRONE_ABILITIES.map((a) => ({ ...a }));
    case 'ashenConclave':
      return ASHEN_CONCLAVE_ABILITIES.map((a) => ({ ...a }));
    case 'verdantPact':
      return VERDANT_PACT_ABILITIES.map((a) => ({ ...a }));
    case 'obsidianGuild':
      return OBSIDIAN_GUILD_ABILITIES.map((a) => ({ ...a }));
    default:
      return UNIVERSAL_ABILITIES.map((a) => ({ ...a }));
  }
}

/** Get all universal abilities (available to all players) */
export function getUniversalAbilities(): CombatAbility[] {
  return UNIVERSAL_ABILITIES.map((a) => ({ ...a }));
}
