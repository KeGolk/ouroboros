import { Ending } from '../../types/narrative';

export const endings: Ending[] = [
  {
    id: 'iron_dominion',
    title: 'The Iron Dominion',
    subtitle: 'Order is restored — but at what cost?',
    description:
      'You have placed Commander Vareth upon the throne, and the Iron Covenant\'s armies march across Valdris unopposed. The borders are secured, bandits are crushed, and the long chaos finally ends. But the peace is enforced by fear, and the gallows never stand empty. Those who questioned the old ways are silenced. You have a seat at the council table, honored as the one who made it possible — yet you cannot help but notice that the council never disagrees with its king.',
    epilogue:
      'In the years that follow, Valdris knows a brutal prosperity. The harvests are good because the farmers dare not fail. The roads are safe because the penalty for banditry is death. Slowly, the world forgets what freedom felt like. And in the deep forests, the Verdant Court\'s remnants whisper of a different path, nursing their grievances like embers. You wonder, sometimes, if you merely traded one tyrant for another — one who at least keeps his promises.',
    imagePrompt:
      'A vast iron throne room with banners of steel and wolf, armored soldiers standing in rigid formation, a crowned military commander on a dark throne, the protagonist standing beside looking conflicted, muted grey and iron tones, oil painting style, oppressive grandeur',
    requirements: [
      { type: 'faction_reputation', target: 'iron_covenant', operator: '>=', value: 70 },
      { type: 'flag_set', target: 'vareth_survived', operator: '==', value: true },
      { type: 'flag_set', target: 'supported_martial_law', operator: '==', value: true },
    ],
    priority: 10,
    faction: 'iron_covenant',
    achievementId: 'ending_iron',
  },
  {
    id: 'verdant_renewal',
    title: 'The Verdant Renewal',
    subtitle: 'The old ways return — but the world has changed.',
    description:
      'The monarchy is dissolved. In its place, a Grand Council of regional lords, druids, and elected commoners governs Valdris. Archdruid Elara guides the transition with patient wisdom, and the land itself seems to breathe easier. Villages govern themselves, ancient groves are restored, and the people choose their own paths. But without a central army, the borders grow porous. Neighboring kingdoms smell weakness. And not all who sit on the Council share Elara\'s selfless vision.',
    epilogue:
      'The first years are golden — a flowering of art, craft, and free thought unseen in generations. But by the third winter, old grudges resurface. Border lords squabble, trade routes fragment, and the Obsidian Circle, driven underground, begins its subtle revenge. You serve on the Council, a voice of reason in increasingly fractious debates. Elara grows older, even by half-elf standards, and you realize the dream requires eternal vigilance. Freedom, it turns out, is harder to maintain than tyranny.',
    imagePrompt:
      'A great circular council chamber open to the sky, with a massive ancient tree growing through the center, diverse people seated in a ring, sunlight filtering through leaves, the protagonist speaking from a carved wooden seat, green and gold tones, oil painting style, hopeful but fragile atmosphere',
    requirements: [
      { type: 'faction_reputation', target: 'verdant_court', operator: '>=', value: 70 },
      { type: 'flag_set', target: 'elara_survived', operator: '==', value: true },
      { type: 'flag_set', target: 'dissolved_monarchy', operator: '==', value: true },
    ],
    priority: 10,
    faction: 'verdant_court',
    achievementId: 'ending_verdant',
  },
  {
    id: 'obsidian_ascension',
    title: 'The Obsidian Ascension',
    subtitle: 'Knowledge conquers all — but wisdom comes too late.',
    description:
      'Magister Thorn\'s grand design reaches fruition. Using the forbidden rites recovered from the Sunken Library, the Obsidian Circle binds the ley-lines of Valdris to a great Arcane Nexus, granting them power over the very fabric of reality within the realm. Disease is cured, famine banished, storms calmed. But the Circle sees all, controls all. Every thought that brushes against magic — which is to say, every thought — is known to them. You stand as Thorn\'s right hand, the bridge between the mundane world and its secret masters.',
    epilogue:
      'Valdris becomes a paradise of plenty and a prison of the mind. The people are fed, housed, and healed — and watched, always watched. You have access to knowledge undreamed of, power that would make old kings weep. But you also see what Thorn will not admit: the Nexus is unstable. The ley-lines strain under the weight of control. One day, perhaps in a year, perhaps in a century, it will fracture. And when it does, the devastation will make the king\'s assassination look like a tavern brawl.',
    imagePrompt:
      'A vast crystalline tower piercing storm clouds, purple arcane energy flowing through visible ley-lines across the landscape, robed scholars directing reality with gestures, the protagonist holding a glowing obsidian staff, purple and black tones, oil painting style, beautiful and terrifying',
    requirements: [
      { type: 'faction_reputation', target: 'obsidian_circle', operator: '>=', value: 70 },
      { type: 'flag_set', target: 'thorn_survived', operator: '==', value: true },
      { type: 'flag_set', target: 'nexus_activated', operator: '==', value: true },
    ],
    priority: 10,
    faction: 'obsidian_circle',
    achievementId: 'ending_obsidian',
  },
  {
    id: 'ashen_restoration',
    title: 'The Ashen Restoration',
    subtitle: 'The crown returns — tempered by fire.',
    description:
      'Princess Isolde ascends the Ashen Throne, not as her father\'s heir but as something new — a monarch bound by a charter of rights you helped draft. The old nobility grumbles, Duke Maren schemes, but the people rally to a queen who suffered alongside them. The realm has a center again, a symbol to unite behind. Whether the charter will survive the next generation\'s ambitions remains to be seen.',
    epilogue:
      'Isolde proves a capable if haunted ruler. She institutes reforms her father would have burned as heresy — peasant courts, limited noble levies, a royal academy open to all. You serve as her Chancellor, the steady hand beside a monarch prone to dark moods and sudden rages. The other factions accept the compromise, for now. Duke Maren dies peacefully in his sleep — though the physician you sent to examine him found nothing natural about it. Some things, Isolde tells you, are the cost of keeping the peace. You choose not to ask further.',
    imagePrompt:
      'A restored but humble throne room, a young queen in simple crown and practical armor sitting on the ancient throne, holding a scroll charter in one hand, the protagonist standing beside as advisor, warm amber and grey tones, oil painting style, dignified and bittersweet',
    requirements: [
      { type: 'faction_reputation', target: 'ashen_throne', operator: '>=', value: 70 },
      { type: 'flag_set', target: 'isolde_survived', operator: '==', value: true },
      { type: 'flag_set', target: 'charter_drafted', operator: '==', value: true },
    ],
    priority: 10,
    faction: 'ashen_throne',
    achievementId: 'ending_ashen',
  },
  {
    id: 'shadow_throne',
    title: 'The Shadow Throne',
    subtitle: 'You played them all — and won everything but your soul.',
    description:
      'No faction triumphed. No banner flies above the capital. Instead, you sit in the shadows behind whichever puppet wears the crown this season, pulling strings with a skill that would make Duke Maren weep with envy. You betrayed every faction just enough to weaken them, helped each just enough to earn their debt. The realm limps along in fragile balance, held together by your web of secrets, blackmail, and carefully rationed truth.',
    epilogue:
      'You have no title, no lands, no banner. What you have is power — the only kind that matters. Every lord owes you a favor. Every spy answers to your network. Every faction believes you are secretly on their side. It is exhausting, lonely, and terrifying. One mistake, one thread pulled loose, and the whole tapestry unravels with you woven into it. But for now, you are the most powerful person in Valdris, and no one even knows your name. You take a sip of wine that someone else tasted first, and you begin planning tomorrow\'s lies.',
    imagePrompt:
      'A dark room behind a throne, seen through a gap in heavy curtains, a shadowy figure (the protagonist) manipulating puppet strings attached to miniature figures of faction leaders on a game board, single candle lighting, deep shadow and amber tones, oil painting style, sinister and lonely',
    requirements: [
      { type: 'flag_set', target: 'betrayed_iron', operator: '==', value: true },
      { type: 'flag_set', target: 'betrayed_verdant', operator: '==', value: true },
      { type: 'flag_set', target: 'betrayed_obsidian', operator: '==', value: true },
      { type: 'flag_set', target: 'betrayed_ashen', operator: '==', value: true },
      { type: 'stat_minimum', target: 'cunning', operator: '>=', value: 16 },
    ],
    priority: 20, // checked before faction endings
    isSecret: true,
    achievementId: 'ending_shadow',
  },
  {
    id: 'exile_wanderer',
    title: 'The Exile\'s Road',
    subtitle: 'Some fires cannot be saved — only fled.',
    description:
      'You have seen too much. Done too much. The factions tear each other apart in a final, bloody reckoning, and you — exhausted, disillusioned, perhaps wiser — choose to walk away. You take what little you can carry, say goodbye to those few who still call you friend, and pass through the southern gates as smoke rises behind you. Valdris will sort itself out, or it won\'t. You are done being a piece on someone else\'s board.',
    epilogue:
      'You wander south, past the Thornwood, past the Salted Marches, to lands where no one knows the name Valdris or cares about its politics. You find a village. You find work. You find, slowly, something like peace. Sometimes, a trader brings news from the north — this lord fell, that battle was won, a new king crowned or deposed. You listen politely and return to your garden. It is a small life. It is yours. And on quiet evenings, when the light is right, you almost forget the sound of screaming.',
    imagePrompt:
      'A lone traveler walking away from a burning city on a hill, carrying only a pack and a walking stick, walking into a golden sunset across open plains, the road stretching to distant peaceful mountains, warm gold and grey tones, oil painting style, melancholic beauty and freedom',
    requirements: [
      { type: 'flag_set', target: 'refused_all_factions', operator: '==', value: true },
    ],
    priority: 5, // fallback ending
    achievementId: 'ending_exile',
  },
];
