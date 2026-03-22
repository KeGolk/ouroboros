export const items: Record<string, { name: string; description: string; imagePrompt: string; type: 'quest' | 'consumable' | 'equipment' | 'key' }> = {
  royal_signet: {
    name: 'Royal Signet Ring',
    description: 'The seal of House Valdris. Proof of legitimate authority — or a forger\'s masterwork.',
    imagePrompt: 'A heavy gold ring with a dragon-and-crown sigil pressed into dark wax, resting on aged parchment, close-up still life, oil painting style',
    type: 'quest',
  },
  ironhand_writ: {
    name: 'Ironhand\'s Writ of Passage',
    description: 'A sealed military document granting free passage through Iron Covenant territories.',
    imagePrompt: 'A rolled military scroll sealed with iron wax, stamped with a gauntlet emblem, on a war table with maps, oil painting style',
    type: 'key',
  },
  thornweave_seed: {
    name: 'Thornweave Seed',
    description: 'A living seed from the Heartwood tree, pulsing with faint green light. The druids would kill to possess it.',
    imagePrompt: 'A glowing green seed cupped in dirt-stained hands, tendrils of light reaching upward like tiny roots, dark forest background, oil painting style',
    type: 'quest',
  },
  obsidian_codex: {
    name: 'The Obsidian Codex',
    description: 'A fragment of the forbidden texts from the Sunken Library. Its pages shift when unobserved.',
    imagePrompt: 'An ancient black-bound book with silver glyphs that seem to move, open pages showing diagrams of ley-lines, candlelit desk background, oil painting style',
    type: 'quest',
  },
  ashen_crown: {
    name: 'The Ashen Crown',
    description: 'The ruined crown of the High King, recovered from his pyre. Blackened but unbroken.',
    imagePrompt: 'A charred but intact crown of twisted gold and iron, resting on a velvet cushion stained with soot, dim throne room background, oil painting style',
    type: 'quest',
  },
  shadow_dagger: {
    name: 'The Kingslayer\'s Blade',
    description: 'The very dagger that slew the High King. Whoever forged it knew forbidden metallurgy.',
    imagePrompt: 'A sleek black dagger with an impossibly thin blade, dark runes etched along its length, lying in a pool of dried blood on marble, oil painting style',
    type: 'quest',
  },
  healing_draught: {
    name: 'Druidic Healing Draught',
    description: 'A potent herbal remedy brewed by Verdant Court healers. Restores vitality.',
    imagePrompt: 'A glass vial filled with luminous green liquid, cork stopper sealed with wax, herbs scattered around it, oil painting style',
    type: 'consumable',
  },
  iron_shield: {
    name: 'Covenant Shield',
    description: 'A battered but sturdy shield bearing the Iron Covenant\'s wolf emblem.',
    imagePrompt: 'A large kite shield with dents and scratches, painted with a snarling iron wolf, leaning against a stone wall, oil painting style',
    type: 'equipment',
  },
  mireths_compass: {
    name: 'Mireth\'s Compass',
    description: 'A strange device that points not north, but toward "what matters most." Its needle spins when you lie.',
    imagePrompt: 'An ornate brass compass with unusual symbols instead of cardinal directions, its needle glowing faintly blue, held in an aged hand, oil painting style',
    type: 'quest',
  },
  charter_scroll: {
    name: 'The Charter of Rights',
    description: 'A document limiting royal power, drafted through compromise and blood. Its ink is barely dry.',
    imagePrompt: 'An elegant parchment scroll with multiple wax seals from different factions, quill and ink pot beside it, oil painting style',
    type: 'quest',
  },
};

export const flags: Record<string, { description: string; default: boolean }> = {
  // ── Faction betrayal flags (for Shadow Throne ending) ──
  betrayed_iron: { description: 'Player betrayed the Iron Covenant at a critical moment', default: false },
  betrayed_verdant: { description: 'Player betrayed the Verdant Court at a critical moment', default: false },
  betrayed_obsidian: { description: 'Player betrayed the Obsidian Circle at a critical moment', default: false },
  betrayed_ashen: { description: 'Player betrayed the Ashen Throne at a critical moment', default: false },

  // ── Character survival flags ──
  vareth_survived: { description: 'Commander Vareth survived to the final chapter', default: true },
  elara_survived: { description: 'Archdruid Elara survived to the final chapter', default: true },
  thorn_survived: { description: 'Magister Thorn survived to the final chapter', default: true },
  isolde_survived: { description: 'Princess Isolde survived to the final chapter', default: true },
  brynn_survived: { description: 'Ser Brynn survived to the final chapter', default: true },
  rowan_survived: { description: 'Rowan survived to the final chapter', default: true },
  lysara_survived: { description: 'Lysara survived to the final chapter', default: true },

  // ── Major story flags ──
  supported_martial_law: { description: 'Player supported the Covenant\'s martial law decree', default: false },
  dissolved_monarchy: { description: 'Player helped dissolve the monarchy in favor of a council', default: false },
  nexus_activated: { description: 'Player helped activate the Arcane Nexus', default: false },
  charter_drafted: { description: 'Player helped draft the Charter of Rights', default: false },
  refused_all_factions: { description: 'Player refused to commit to any faction\'s cause', default: false },

  // ── Chapter-specific flags ──
  saved_ashford_refugees: { description: 'Player saved the refugees from Ashford', default: false },
  learned_assassination_truth: { description: 'Player discovered who truly ordered the king\'s death', default: false },
  found_sunken_library: { description: 'Player discovered the Sunken Library', default: false },
  united_border_lords: { description: 'Player convinced the border lords to unite', default: false },
  spared_duke_maren: { description: 'Player chose not to expose Duke Maren\'s treachery', default: false },
  heartwood_restored: { description: 'Player helped restore the Heartwood grove', default: false },
  forged_alliance: { description: 'Player formed a temporary alliance between two factions', default: false },
  kingslayer_identified: { description: 'Player identified the king\'s true assassin', default: false },
  dark_ritual_stopped: { description: 'Player prevented the Obsidian Circle\'s dark ritual', default: false },
  siege_survived: { description: 'Player survived the Siege of Valdris', default: false },
};
