import { Character } from '../../types/narrative';

export const characters: Record<string, Character> = {
  // ─── Iron Covenant ────────────────────────────────────────────
  commander_vareth: {
    id: 'commander_vareth',
    name: 'Vareth Ironhand',
    title: 'Commander of the Iron Covenant',
    faction: 'iron_covenant',
    description:
      'A scarred veteran who lost his sword arm in the Border Wars and replaced it with a mechanical prosthetic forged by Obsidian Circle artificers. He believes in order above all else, but his rigid code of honor sometimes blinds him to the suffering it causes.',
    personality: 'Stoic, commanding, secretly compassionate. Speaks in clipped military cadence.',
    imagePrompt:
      'Portrait of a weathered middle-aged warrior with a mechanical iron prosthetic arm, steel-grey eyes, cropped silver hair, heavy plate armor with wolf-pelt cloak, dark castle background, oil painting style, muted palette',
    isRecruitable: true,
    baseRelationship: 0,
  },
  ser_brynn: {
    id: 'ser_brynn',
    name: 'Ser Brynn of Ashenford',
    title: 'Knight-Captain of the Covenant Guard',
    faction: 'iron_covenant',
    description:
      'A young idealistic knight who joined the Covenant believing in justice, now struggling with the moral compromises demanded by her superiors. She is torn between loyalty and conscience.',
    personality: 'Earnest, conflicted, brave to a fault. Speaks formally but with warmth.',
    imagePrompt:
      'Portrait of a young woman knight in burnished steel armor, auburn hair in a braid, determined green eyes, longsword at her hip, standing before a burning village, oil painting style, warm and tragic lighting',
    isRecruitable: true,
    baseRelationship: 15,
  },

  // ─── Verdant Court ────────────────────────────────────────────
  archdruid_elara: {
    id: 'archdruid_elara',
    name: 'Elara Thornweave',
    title: 'Archdruid of the Verdant Court',
    faction: 'verdant_court',
    description:
      'An ancient half-elf who has watched empires rise and fall. She distrusts all who seek power but is not above manipulation when she believes the land demands it. Her patience is both her greatest strength and most dangerous quality.',
    personality: 'Patient, cryptic, maternal yet ruthless when crossed. Speaks in nature metaphors.',
    imagePrompt:
      'Portrait of an ageless half-elf woman with moss-green eyes, silver-white hair woven with living vines, wearing layered robes of bark and leaf, ancient forest background, oil painting style, ethereal green lighting',
    isRecruitable: true,
    baseRelationship: -10,
  },
  rowan: {
    id: 'rowan',
    name: 'Rowan Blackthorn',
    title: 'Voice of the Wildwood',
    faction: 'verdant_court',
    description:
      'A young druid and shapeshifter whose connection to beasts makes him more comfortable with wolves than people. He harbors a secret rage at the nobility for burning the Thornwood during the Border Wars.',
    personality: 'Fierce, laconic, distrustful of outsiders. Communicates more through action than words.',
    imagePrompt:
      'Portrait of a wiry young man with wild dark hair and amber wolf-like eyes, wearing fur and leather armor, a large raven perched on his shoulder, foggy forest background, oil painting style, dark naturalistic palette',
    isRecruitable: true,
    baseRelationship: -20,
  },

  // ─── Obsidian Circle ──────────────────────────────────────────
  magister_thorn: {
    id: 'magister_thorn',
    name: 'Magister Aldric Thorn',
    title: 'First Voice of the Obsidian Circle',
    faction: 'obsidian_circle',
    description:
      'A brilliant but morally flexible sorcerer who views people as variables in grand equations. He genuinely believes his machinations serve the greater good, which makes him far more dangerous than a simple villain.',
    personality: 'Intellectual, sardonic, eerily calm. Speaks with precise diction and veiled threats.',
    imagePrompt:
      'Portrait of a gaunt man with sharp cheekbones, deep-set violet eyes, slicked-back black hair with silver streaks, wearing obsidian-studded dark robes, library of forbidden tomes background, oil painting style, candlelit shadows',
    isRecruitable: true,
    baseRelationship: -5,
  },
  lysara: {
    id: 'lysara',
    name: 'Lysara Vex',
    title: 'Shadow Archivist',
    faction: 'obsidian_circle',
    description:
      'A former street thief turned scholar who discovered an aptitude for forbidden magic. She serves the Circle but maintains her own network of informants. Her loyalty is to knowledge itself, not any master.',
    personality: 'Quick-witted, flirtatious, dangerously curious. Shifts between street slang and scholarly prose.',
    imagePrompt:
      'Portrait of a dark-skinned woman with shaved head and intricate tattoo-like arcane sigils on her scalp, sharp intelligent eyes, wearing a mixture of leather armor and scholar robes, hidden laboratory background, oil painting style, blue-purple magical lighting',
    isRecruitable: true,
    baseRelationship: 10,
  },

  // ─── Ashen Throne ─────────────────────────────────────────────
  princess_isolde: {
    id: 'princess_isolde',
    name: 'Princess Isolde Valdris',
    title: 'Last of the Royal Blood',
    faction: 'ashen_throne',
    description:
      'The slain king\'s youngest daughter, who survived the assassination only because she was in exile for speaking against her father\'s corruption. She returns with legitimate claim but uncertain motives — does she want reform, or revenge?',
    personality: 'Regal, sharp-tongued, haunted. Alternates between vulnerability and steel resolve.',
    imagePrompt:
      'Portrait of a young noblewoman with pale skin, dark circled grey eyes, long black hair partially covered by a tattered royal veil, wearing once-fine armor now battle-worn, ruined throne room background, oil painting style, dramatic chiaroscuro lighting',
    isRecruitable: true,
    baseRelationship: 5,
  },
  duke_maren: {
    id: 'duke_maren',
    name: 'Duke Aldous Maren',
    title: 'Lord Protector of the Eastern Marches',
    faction: 'ashen_throne',
    description:
      'An aging nobleman who served the old king faithfully — perhaps too faithfully. He backed Isolde\'s claim publicly but privately maneuvers to ensure the restored monarchy serves his interests. A master of court intrigue who has survived six kings.',
    personality: 'Grandfatherly, disarming, utterly ruthless beneath the smile. Speaks in folksy wisdom that conceals sharp calculations.',
    imagePrompt:
      'Portrait of a portly elderly nobleman with a neatly trimmed white beard, twinkling but cold blue eyes, wearing rich burgundy velvet with gold chains of office, opulent study background with maps and wine, oil painting style, warm candlelight',
    isRecruitable: false,
    baseRelationship: 20,
  },

  // ─── Unaligned ────────────────────────────────────────────────
  kael: {
    id: 'kael',
    name: 'Kael the Ashen',
    title: 'The Protagonist (Player Character)',
    faction: 'unaligned',
    description:
      'A disgraced minor noble whose family was destroyed in the political purges following the king\'s assassination. With nothing left to lose, they navigate the deadly factions seeking justice, revenge, or a new path entirely.',
    personality: 'Determined by player choices.',
    imagePrompt:
      'Portrait of a young person of ambiguous features with ash-streaked dark hair, intense eyes bearing old grief, wearing a worn traveling cloak over light armor with a family sigil barely visible, road at twilight background, oil painting style, moody atmospheric lighting',
    isRecruitable: false,
    baseRelationship: 0,
  },
  mireth: {
    id: 'mireth',
    name: 'Mireth Greymantle',
    title: 'The Wandering Sage',
    faction: 'unaligned',
    description:
      'A mysterious old woman who appears at critical moments, offering cryptic counsel. She claims to have served every faction at one time or another. Her true allegiance, if any, is one of the game\'s deepest mysteries.',
    personality: 'Enigmatic, wryly humorous, unsettling. Speaks in riddles that prove prophetic.',
    imagePrompt:
      'Portrait of an ancient crone with one milky blind eye and one sharp green eye, wild grey hair beneath a tattered hood, wearing layers of grey travel-stained robes, crossroads at dusk background, oil painting style, mystical twilight atmosphere',
    isRecruitable: false,
    baseRelationship: 0,
  },
};
