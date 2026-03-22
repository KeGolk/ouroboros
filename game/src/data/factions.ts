import type { Faction, FactionId, FactionMap } from '../types/factions';

/**
 * ═══════════════════════════════════════════════════════════════════
 *  THE FOUR FACTIONS OF AETHERMOOR
 * ═══════════════════════════════════════════════════════════════════
 *
 *  The realm of Aethermoor teeters on the brink. Four great powers
 *  contest the vacant Obsidian Throne, each convinced only their
 *  vision can save — or rule — the shattered kingdom.
 *
 *  None are wholly good. None are wholly evil.
 *  Every crown casts a shadow.
 * ═══════════════════════════════════════════════════════════════════
 */

// ──────────────────────────────────────────────
//  1. THE IRON THRONE  — Martial Authoritarians
// ──────────────────────────────────────────────
const ironThrone: Faction = {
  id: 'ironThrone',
  name: 'The Iron Throne',
  motto: 'Order Through Strength',
  shortDescription:
    'A military aristocracy that believes only an iron fist can hold the realm together.',
  description:
    'Born from the ashes of the Sundering Wars, the Iron Throne is a coalition of noble '
    + 'houses united under the doctrine of martial supremacy. They maintain the largest '
    + 'standing army in Aethermoor and control the fortified heartlands. Their courts are '
    + 'rigid hierarchies where bloodline and battlefield valor determine rank. Critics call '
    + 'them tyrants; supporters say they are the only bulwark against chaos. Under their '
    + 'rule, roads are safe and harvests are taxed — heavily. The common folk are protected '
    + 'but never free.',
  moralPhilosophy: {
    label: 'Authoritarian Order',
    description:
      'The Iron Throne holds that freedom without structure is merely slow-motion '
      + 'destruction. A strong sovereign, bound by duty and tradition, is the only '
      + 'guarantee of peace. They sacrifice individual liberty for collective security, '
      + 'believing the masses are incapable of self-governance.',
    coreVirtue: 'Duty',
    coreFlaw: 'Tyranny',
  },
  color: '#8B0000',      // dark crimson
  accentColor: '#C0C0C0', // steel silver
  sigil: '⚔️',
  artPrompt:
    'A battle-scarred iron crown resting on a war table strewn with maps, lit by flickering '
    + 'torchlight. Dark red banners bearing crossed swords hang in a stone great hall. '
    + 'Gritty medieval oil-painting style, muted reds and greys, Game of Thrones aesthetic.',
  statModifiers: {
    strength: 3,
    cunning: 0,
    charisma: 1,
    lore: -1,
    subtlety: -1,
  },
  relationships: [
    {
      targetFactionId: 'ashenConclave',
      status: 'suspicious',
      reason:
        'The Throne distrusts sorcerers who answer to no liege, but grudgingly '
        + 'relies on Conclave war-mages in border conflicts.',
      sentiment: -25,
    },
    {
      targetFactionId: 'verdantPact',
      status: 'hostile',
      reason:
        'The Pact\'s refusal to kneel and their harbour of deserters makes them '
        + 'a constant thorn. Open skirmishes erupt each harvest season over contested farmland.',
      sentiment: -55,
    },
    {
      targetFactionId: 'obsidianGuild',
      status: 'friendly',
      reason:
        'Gold buys swords. The Guild bankrolls Throne campaigns in exchange for trade '
        + 'monopolies and tariff exemptions — a marriage of convenience both sides exploit.',
      sentiment: 35,
    },
  ],
  territories: [
    'Ironhold Citadel',
    'The Crownlands',
    'Blackwall Keep',
    'The King\'s March',
  ],
  leaderIds: ['commander_varek', 'lady_seraine'],
  reputationPerks: [
    'Access to elite military gear at faction smithies',
    'Throne garrison reinforcements in combat encounters',
    'Diplomatic immunity in Crownland territories',
    'Unlocks "Iron Mandate" dialogue options (intimidation)',
  ],
};

// ──────────────────────────────────────────────
//  2. THE ASHEN CONCLAVE  — Scholar-Theocrats
// ──────────────────────────────────────────────
const ashenConclave: Faction = {
  id: 'ashenConclave',
  name: 'The Ashen Conclave',
  motto: 'Knowledge Is the Only True Power',
  shortDescription:
    'A theocratic order of scholars, seers, and sorcerers who seek to guide the realm through enlightenment — or control it through secrets.',
  description:
    'The Ashen Conclave traces its lineage to the pre-Sundering mage-priests who '
    + 'channeled the Aether itself. Today they occupy the great library-temples of '
    + 'Ashenveil, a fog-shrouded city carved into the Greymist Mountains. They hoard '
    + 'forbidden knowledge and dispense prophecy to those who pay their price. Their '
    + 'hierarchy is meritocratic — a peasant with arcane talent can rise higher than any '
    + 'lord — but the Conclave\'s inner circle guards secrets ruthlessly, including truths '
    + 'about the Sundering that could destabilise every other faction.',
  moralPhilosophy: {
    label: 'Enlightened Paternalism',
    description:
      'The Conclave believes wisdom — not swords or coins — should govern. They argue '
      + 'the unenlightened masses need guardianship by those who can perceive deeper '
      + 'truths. Their benevolence is genuine but conditional: knowledge shared too '
      + 'freely is knowledge weaponised by fools.',
    coreVirtue: 'Wisdom',
    coreFlaw: 'Elitism',
  },
  color: '#4A4A6A',       // ashen violet
  accentColor: '#D4AF37',  // antiqued gold
  sigil: '📜',
  artPrompt:
    'An ancient tome open on a stone altar surrounded by guttering candles and drifting ash. '
    + 'Hooded figures in grey robes stand in a vaulted library with towering shelves. '
    + 'Mystical glyphs glow faintly on the walls. Dark academia aesthetic, muted purples '
    + 'and golds, parchment textures.',
  statModifiers: {
    strength: -1,
    cunning: 1,
    charisma: 0,
    lore: 3,
    subtlety: 1,
  },
  relationships: [
    {
      targetFactionId: 'ironThrone',
      status: 'suspicious',
      reason:
        'The Throne\'s anti-sorcery edicts threaten Conclave autonomy, yet the Conclave '
        + 'needs Throne steel to protect its mountain borders.',
      sentiment: -20,
    },
    {
      targetFactionId: 'verdantPact',
      status: 'neutral',
      reason:
        'Druids and mages share a respect for the old powers, but the Pact considers '
        + 'Conclave knowledge-hoarding a betrayal of the shared Aetheric heritage.',
      sentiment: 5,
    },
    {
      targetFactionId: 'obsidianGuild',
      status: 'hostile',
      reason:
        'The Guild has attempted to buy — and when rebuffed, steal — Conclave artefacts '
        + 'for decades. The Conclave views merchants as vultures who commodify the sacred.',
      sentiment: -50,
    },
  ],
  territories: [
    'Ashenveil Citadel',
    'The Greymist Sanctum',
    'Library of Echoes',
    'The Oracle\'s Spire',
  ],
  leaderIds: ['archon_maelis', 'seer_thessaly'],
  reputationPerks: [
    'Access to arcane lore checks and hidden dialogue branches',
    'Conclave enchantments on equipped items',
    'Prophecy hints that reveal future chapter consequences',
    'Unlocks "Arcane Insight" dialogue options (persuasion through knowledge)',
  ],
};

// ──────────────────────────────────────────────
//  3. THE VERDANT PACT  — Egalitarian Rebels
// ──────────────────────────────────────────────
const verdantPact: Faction = {
  id: 'verdantPact',
  name: 'The Verdant Pact',
  motto: 'No King but the Land',
  shortDescription:
    'A loose alliance of druids, freeholders, and dispossessed commoners fighting for the old ways and the rights of the common folk.',
  description:
    'The Verdant Pact is not a single organisation but a patchwork of village councils, '
    + 'druidic circles, and guerrilla bands bound by a shared hatred of centralised rule. '
    + 'They worship the Greenmother and draw strength from the ancient forests. Their lands '
    + 'are fertile but lawless — justice is meted out by local elders, not distant kings. '
    + 'Romantics see them as freedom fighters; pragmatists see a collection of squabbling '
    + 'villages incapable of defending against a real army. Their greatest weapon is the '
    + 'loyalty of the smallfolk, who would rather burn their harvest than let a Throne '
    + 'tax-collector touch it.',
  moralPhilosophy: {
    label: 'Communal Libertarianism',
    description:
      'The Pact believes governance should flow upward from the soil, not downward from '
      + 'a throne. Every person has a voice; no one may rule without consent. Yet this '
      + 'radical egalitarianism fractures their power — they cannot agree long enough to '
      + 'build the institutions that would protect the freedoms they cherish.',
    coreVirtue: 'Liberty',
    coreFlaw: 'Anarchy',
  },
  color: '#2E5D34',       // forest green
  accentColor: '#8B6914',  // bark brown
  sigil: '🌿',
  artPrompt:
    'A massive ancient oak tree with faces carved into its bark, surrounded by moss-covered '
    + 'standing stones in a misty forest clearing. Green banners with leaf motifs hang from '
    + 'low branches. Fireflies and shafts of dim light. Earthy, wild aesthetic — muted '
    + 'greens and browns, gritty naturalism.',
  statModifiers: {
    strength: 1,
    cunning: 1,
    charisma: 2,
    lore: 0,
    subtlety: 0,
  },
  relationships: [
    {
      targetFactionId: 'ironThrone',
      status: 'hostile',
      reason:
        'Generations of Throne conquest, forced conscription, and crop seizures have made '
        + 'the Pact the Throne\'s bitterest enemy. Blood debts run deep.',
      sentiment: -60,
    },
    {
      targetFactionId: 'ashenConclave',
      status: 'neutral',
      reason:
        'The druids respect the Conclave\'s connection to the old Aether, but resent '
        + 'their refusal to share knowledge that could heal blighted lands.',
      sentiment: 10,
    },
    {
      targetFactionId: 'obsidianGuild',
      status: 'suspicious',
      reason:
        'Guild merchants bring needed trade goods to remote villages, but their land '
        + 'speculation and debt-traps have displaced entire communities.',
      sentiment: -30,
    },
  ],
  territories: [
    'The Greenwood',
    'Mosshollow Village',
    'Thornwatch Outpost',
    'The Druid\'s Glen',
  ],
  leaderIds: ['elder_brynn', 'warden_kael'],
  reputationPerks: [
    'Herbalism and survival supplies at Pact camps',
    'Guerrilla allies in wilderness combat encounters',
    'Safe passage and shelter in forest territories',
    'Unlocks "Voice of the People" dialogue options (populist appeal)',
  ],
};

// ──────────────────────────────────────────────
//  4. THE OBSIDIAN GUILD  — Mercantile Oligarchs
// ──────────────────────────────────────────────
const obsidianGuild: Faction = {
  id: 'obsidianGuild',
  name: 'The Obsidian Guild',
  motto: 'Every Man Has a Price',
  shortDescription:
    'A ruthless mercantile syndicate that controls trade, banking, and intelligence — buying what cannot be conquered.',
  description:
    'The Obsidian Guild began as a consortium of obsidian miners but evolved into the '
    + 'realm\'s dominant financial power. They control the trade routes, the banks, the '
    + 'black markets, and — most dangerously — the flow of information. Guild agents '
    + 'operate in every court and tavern. They have no army of their own but can hire '
    + 'any mercenary company on the continent. Their sprawling port city of Blackhaven '
    + 'is the wealthiest settlement in Aethermoor: a glittering cesspool of opportunity '
    + 'and exploitation where a clever commoner can become a prince and a foolish noble '
    + 'can lose everything overnight.',
  moralPhilosophy: {
    label: 'Pragmatic Opportunism',
    description:
      'The Guild believes morality is a luxury the powerful impose on the weak. True '
      + 'freedom comes through wealth: the ability to buy choices. They are ruthlessly '
      + 'meritocratic — talent and ambition matter more than birth — but their world is '
      + 'transactional to its core. Loyalty is a contract, not a feeling.',
    coreVirtue: 'Ambition',
    coreFlaw: 'Greed',
  },
  color: '#1C1C2E',       // obsidian dark
  accentColor: '#FFD700',  // gold
  sigil: '💎',
  artPrompt:
    'A polished obsidian coin stamped with a serpent eating its own tail, resting on a '
    + 'velvet-lined merchant\'s chest overflowing with gold. Behind it, a harbour city at '
    + 'night with lantern-lit docks and shadowy figures. Dark noir aesthetic — deep blacks, '
    + 'glinting gold highlights, smoke and candlelight.',
  statModifiers: {
    strength: -1,
    cunning: 2,
    charisma: 1,
    lore: 0,
    subtlety: 3,
  },
  relationships: [
    {
      targetFactionId: 'ironThrone',
      status: 'friendly',
      reason:
        'The Guild finances Throne wars and receives trade monopolies in return. '
        + 'Both sides know the alliance is mercenary, but the gold flows freely.',
      sentiment: 30,
    },
    {
      targetFactionId: 'ashenConclave',
      status: 'hostile',
      reason:
        'The Conclave\'s refusal to sell artefacts or license magical trade infuriates '
        + 'the Guild. Several covert heists have only deepened the enmity.',
      sentiment: -45,
    },
    {
      targetFactionId: 'verdantPact',
      status: 'suspicious',
      reason:
        'The Pact\'s barter economy and rejection of Guild currency undermines profits. '
        + 'The Guild infiltrates Pact villages with debt schemes while publicly offering "aid".',
      sentiment: -25,
    },
  ],
  territories: [
    'Blackhaven Port',
    'The Gilded Quarter',
    'Undermarket Vaults',
    'The Whispering Docks',
  ],
  leaderIds: ['guildmaster_rhenna', 'spymaster_dax'],
  reputationPerks: [
    'Black market access with rare items and poisons',
    'Hired mercenary backup in combat encounters',
    'Bribery and smuggling options in quests',
    'Unlocks "Silver Tongue" dialogue options (bribery and leverage)',
  ],
};

// ═══════════════════════════════════════════════
//  EXPORTS
// ═══════════════════════════════════════════════

/** All factions indexed by ID */
export const FACTIONS: FactionMap = {
  ironThrone,
  ashenConclave,
  verdantPact,
  obsidianGuild,
};

/** Ordered list for UI iteration */
export const FACTION_LIST: Faction[] = [
  ironThrone,
  ashenConclave,
  verdantPact,
  obsidianGuild,
];

/** All valid faction IDs */
export const FACTION_IDS: FactionId[] = [
  'ironThrone',
  'ashenConclave',
  'verdantPact',
  'obsidianGuild',
];

/** Quick lookup helpers */
export function getFaction(id: FactionId): Faction {
  return FACTIONS[id];
}

export function getFactionName(id: FactionId): string {
  return FACTIONS[id].name;
}

export function getFactionColor(id: FactionId): string {
  return FACTIONS[id].color;
}

/** Get the relationship between two factions */
export function getRelationship(
  fromId: FactionId,
  toId: FactionId,
) {
  return FACTIONS[fromId].relationships.find(
    (r) => r.targetFactionId === toId,
  );
}

/** Default faction standings for a new player (all neutral) */
export function createDefaultStandings() {
  return FACTION_IDS.map((id) => ({
    factionId: id,
    reputation: 0,
    tier: 'neutral' as const,
    joined: false,
  }));
}
