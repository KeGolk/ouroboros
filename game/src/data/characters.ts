/**
 * ═══════════════════════════════════════════════════════════════════
 *  THE CHARACTERS OF AETHERMOOR
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Nine souls caught in the gravitational collapse of a dying realm.
 *  Some seek power. Some seek redemption. All of them will be
 *  changed by the choices Aldric Vane makes — and the choices
 *  they make in return.
 *
 * ═══════════════════════════════════════════════════════════════════
 */

export interface Character {
  id: string;
  name: string;
  title: string;
  faction: 'ironThrone' | 'ashenConclave' | 'verdantPact' | 'obsidianGuild' | 'none';
  role: 'leader' | 'companion' | 'ally' | 'antagonist' | 'player';
  shortDescription: string;
  fullDescription: string;
  personality: string;
  motivation: string;
  artPrompt: string;
  stats: {
    strength: number;
    cunning: number;
    charisma: number;
    lore: number;
    subtlety: number;
  };
  isCompanion: boolean;
  companionAbility?: string;
}

export const characters: Character[] = [
  // ──────────────────────────────────────────────
  //  1. ALDRIC VANE — The Player Character
  // ──────────────────────────────────────────────
  {
    id: 'aldric_vane',
    name: 'Aldric Vane',
    title: 'The Disgraced Knight',
    faction: 'none',
    role: 'player',
    shortDescription:
      'A former knight of the King\'s Guard, stripped of rank and sentenced to die for a '
      + 'crime he did not commit. He escaped the headsman\'s block and now walks the fractured '
      + 'realm with nothing but his training and a burning need for the truth.',
    fullDescription:
      'Aldric Vane served twelve years in the King\'s Guard — the elite order sworn to '
      + 'protect the Obsidian Throne. He was not the strongest knight, nor the most cunning, '
      + 'but he was considered the most principled: the kind of soldier who returned lost coin '
      + 'purses and stood watch during blizzards without complaint. When King Aldren was found '
      + 'dead in his chambers with Aldric\'s dagger in his chest, no one who knew the knight '
      + 'believed it. But evidence is louder than character, and the court needed a scapegoat '
      + 'more than it needed justice. Aldric escaped execution through the intervention of '
      + 'an unknown benefactor — a debt he does not yet understand — and now moves through '
      + 'Aethermoor as a fugitive, a ghost, and the only person asking the right questions '
      + 'about who truly killed the king. The answers, he suspects, will cost more than '
      + 'his life.',
    personality:
      'Principled to a fault but learning, painfully, that principles without power are just '
      + 'words. Dry humor masks deep anger. Trusts slowly, forgives rarely, but once committed '
      + 'to a cause or a person, will walk through fire without hesitation. Struggles with the '
      + 'gap between the world as it should be and the world as it is.',
    motivation:
      'Clear his name. Discover who murdered King Aldren and why. Prevent the conspiracy '
      + 'from consuming the realm. Somewhere beneath these practical goals lies a quieter, '
      + 'more dangerous question: what kind of man does he want to be when this is over?',
    artPrompt:
      'A weathered knight in his mid-thirties with close-cropped dark hair and a scar across '
      + 'his jaw. He wears battered half-plate armor with the insignia scraped off. His eyes '
      + 'are grey-green and watchful. A longsword hangs at his hip, well-used but well-maintained. '
      + 'Gritty medieval portrait, muted earth tones, chiaroscuro lighting, Rembrandt meets '
      + 'dark fantasy.',
    stats: {
      strength: 6,
      cunning: 5,
      charisma: 5,
      lore: 4,
      subtlety: 5,
    },
    isCompanion: false,
  },

  // ──────────────────────────────────────────────
  //  2. QUEEN ISOLDE BLACKTHORN — Iron Throne Leader
  // ──────────────────────────────────────────────
  {
    id: 'queen_isolde',
    name: 'Isolde Blackthorn',
    title: 'Queen Regent of Aethermoor',
    faction: 'ironThrone',
    role: 'leader',
    shortDescription:
      'The widow of King Aldren and self-appointed regent, Isolde rules with an iron '
      + 'pragmatism that makes her allies uncomfortable and her enemies dead.',
    fullDescription:
      'Isolde Blackthorn was never meant to rule. A minor noble from a border house, she '
      + 'married Aldren for political convenience and discovered, to her own surprise, that '
      + 'she was better at governance than he ever was. Where Aldren was beloved but indecisive, '
      + 'Isolde is feared and effective. She seized the regency within hours of her husband\'s '
      + 'death, consolidated the military, and began systematically eliminating threats to the '
      + 'Throne\'s authority — real and imagined. She is not cruel by nature, but she has '
      + 'cultivated cruelty as a tool, and the distinction between the mask and the face has '
      + 'grown thin. She suspects Aldric is innocent of Aldren\'s murder but finds his guilt '
      + 'politically useful. This calculation does not trouble her sleep. Very little does.',
    personality:
      'Cold, precise, and relentlessly strategic. Isolde views emotions as information to be '
      + 'processed, not felt. She is capable of genuine warmth — in private, in unguarded '
      + 'moments — but has buried it so deep that even she is unsure it still exists. Her '
      + 'wit is razor-sharp and her patience is infinite. She never raises her voice because '
      + 'she has never needed to.',
    motivation:
      'Preserve the realm through centralized authority, whatever the cost. Isolde genuinely '
      + 'believes democracy is a death sentence for Aethermoor — that without a strong hand, '
      + 'the factions will tear the kingdom apart. She may be right. She will never know, '
      + 'because she will never allow the experiment.',
    artPrompt:
      'A regal woman in her early forties with sharp features, pale skin, and black hair '
      + 'pulled tightly back. She wears a high-collared gown of dark crimson over blackened '
      + 'steel armor. An iron crown rests on her brow. Her expression is composed, calculating, '
      + 'and utterly without mercy. Dark throne room background with crimson banners. '
      + 'Renaissance portrait style, rich darks, candlelight on steel.',
    stats: {
      strength: 3,
      cunning: 9,
      charisma: 8,
      lore: 5,
      subtlety: 7,
    },
    isCompanion: false,
  },

  // ──────────────────────────────────────────────
  //  3. HIGH SEER MALACHAR — Ashen Conclave Leader
  // ──────────────────────────────────────────────
  {
    id: 'high_seer_malachar',
    name: 'Malachar',
    title: 'High Seer of the Ashen Conclave',
    faction: 'ashenConclave',
    role: 'leader',
    shortDescription:
      'An ancient seer whose age is measured in centuries, not decades. Malachar speaks in '
      + 'prophecy, moves in riddles, and has been quietly shaping the realm\'s destiny since '
      + 'before anyone alive can remember.',
    fullDescription:
      'No one knows how old Malachar truly is. The Conclave\'s records — meticulous, '
      + 'cross-referenced, and spanning eight hundred years — mention him in every era, always '
      + 'with the same title, always with the same unsettling calm. He claims to have witnessed '
      + 'the Sundering itself, and his knowledge of pre-Sundering magic lends credibility to '
      + 'the claim. He is not the Conclave\'s strongest sorcerer, nor its most politically '
      + 'adept member, but he is its prophet — the voice that speaks the words others are '
      + 'afraid to hear. His prophecies have guided (or manipulated, depending on one\'s '
      + 'perspective) every major political shift in Aethermoor for generations. He has been '
      + 'waiting for someone like Aldric for a very long time. The question is whether he '
      + 'is a shepherd or a butcher, and whether there is a difference.',
    personality:
      'Serene, cryptic, and maddeningly patient. Malachar speaks as if every conversation '
      + 'is a lesson and every person a student who has not yet grasped the material. He is '
      + 'gentle in manner and absolute in purpose. His kindness is genuine but conditional — '
      + 'he cares deeply about the realm\'s future and very little about any individual\'s '
      + 'present. He will sacrifice anyone, including himself, for the pattern he sees unfolding '
      + 'across centuries.',
    motivation:
      'Fulfill the Prophecy of the Vessel — the ancient foretelling that a mortal will absorb '
      + 'the scattered Aether and restore magic to the realm. Malachar has spent lifetimes '
      + 'preparing for this moment. Whether the prophecy is genuine or a self-fulfilling '
      + 'construct of his own design is a question he has stopped asking.',
    artPrompt:
      'An impossibly old man with luminous silver eyes and a face like weathered parchment, '
      + 'framed by a deep hood of ash-grey robes. Faint arcane glyphs shimmer beneath his '
      + 'translucent skin. He holds a gnarled staff topped with a softly glowing crystal. '
      + 'Background of towering library shelves disappearing into shadow. Mystical, unsettling '
      + 'serenity. Muted purples, silvers, and candlelight gold.',
    stats: {
      strength: 2,
      cunning: 7,
      charisma: 6,
      lore: 10,
      subtlety: 8,
    },
    isCompanion: false,
  },

  // ──────────────────────────────────────────────
  //  4. ROWAN GREENMANTLE — Verdant Pact Leader
  // ──────────────────────────────────────────────
  {
    id: 'rowan_greenmantle',
    name: 'Rowan Greenmantle',
    title: 'Voice of the Greenwood',
    faction: 'verdantPact',
    role: 'leader',
    shortDescription:
      'A former turnip farmer who became a revolutionary. Rowan fights for the common folk '
      + 'with a passion that borders on recklessness and a moral clarity that makes pragmatists '
      + 'nervous.',
    fullDescription:
      'Rowan Greenmantle was born in Mosshollow, a village so small it appears on no royal '
      + 'map. He grew turnips, mended fences, and buried two children who died of a fever '
      + 'that a Conclave healer could have cured — if the Conclave shared its medicines with '
      + 'commoners. When Throne soldiers burned Mosshollow\'s harvest to deny supplies to '
      + 'Pact guerrillas, Rowan picked up an axe. He has not put it down since. His rise '
      + 'through the Pact was not political but organic — he spoke plainly, fought bravely, '
      + 'and refused to compromise on the principle that every person deserved a voice. The '
      + 'druids named him Voice of the Greenwood, a title he finds embarrassing. He is not '
      + 'a great thinker or a master strategist. He is a farmer who learned to fight because '
      + 'no one else would, and his greatest strength is that he has never forgotten what it '
      + 'feels like to have nothing.',
    personality:
      'Blunt, passionate, and stubbornly idealistic. Rowan laughs loudly, grieves openly, '
      + 'and trusts too easily — a vulnerability he knows about but refuses to correct because '
      + 'suspicion is the disease that killed the old order. He has a farmer\'s patience with '
      + 'slow growth and a farmer\'s fury at waste. He does not hate the nobility; he hates '
      + 'the system that makes nobility possible while children starve.',
    motivation:
      'Tear down the monarchy and replace it with a council of the people. Rowan wants every '
      + 'voice heard, every belly full, every child schooled. He knows this vision is naive. '
      + 'He does not care. Someone has to aim for the horizon even if they never reach it.',
    artPrompt:
      'A broad-shouldered man in his late forties with sun-weathered skin, calloused hands, '
      + 'and kind, fierce brown eyes. He wears practical leather armor over homespun cloth, '
      + 'with a green cloak pinned by an oak-leaf brooch. He carries an oak staff carved '
      + 'with druidic symbols and a hand axe at his belt. Forest background, dappled sunlight. '
      + 'Earthy, grounded portrait — warm browns and greens, natural light.',
    stats: {
      strength: 8,
      cunning: 4,
      charisma: 8,
      lore: 3,
      subtlety: 2,
    },
    isCompanion: false,
  },

  // ──────────────────────────────────────────────
  //  5. SYLAS ASHFORD — Obsidian Guild Leader
  // ──────────────────────────────────────────────
  {
    id: 'sylas_ashford',
    name: 'Sylas Ashford',
    title: 'Guildmaster of the Obsidian Guild',
    faction: 'obsidianGuild',
    role: 'leader',
    shortDescription:
      'A merchant prince whose smile has bankrupted kingdoms. Sylas deals in information, '
      + 'influence, and the comfortable fiction that everyone has a price.',
    fullDescription:
      'Sylas Ashford was born in the gutters of Blackhaven to a dockworker mother who died '
      + 'of the flux when he was nine. By twelve he was running messages for Guild enforcers. '
      + 'By twenty he owned a shipping company. By thirty he had orchestrated the quiet '
      + 'removal of three Guildmasters who stood between him and the top. He did not kill '
      + 'them — he considers violence wasteful — he simply made their positions untenable '
      + 'through a series of financial maneuvers so elegant that two of them thanked him '
      + 'afterward. Sylas is the most dangerous person in Aethermoor not because of what he '
      + 'can destroy but because of what he can buy. His intelligence network spans every '
      + 'faction. His trade routes feed armies. His ledgers contain secrets that could topple '
      + 'the Throne, dissolve the Conclave, and scatter the Pact. He does not use them '
      + 'because leverage, like wine, improves with age.',
    personality:
      'Charming, urbane, and utterly transactional. Sylas genuinely likes people — the way '
      + 'a chess player likes pieces. He is generous with those who are useful and forgotten '
      + 'by those who are not. His humor is quick and self-deprecating, a disarming mask over '
      + 'a mind that calculates cost-benefit ratios the way other people breathe. He does not '
      + 'consider himself immoral; he considers morality a market inefficiency.',
    motivation:
      'Replace the monarchy with a merchant republic where merit — defined as the ability to '
      + 'generate wealth — determines power. Sylas believes commerce is the only honest form '
      + 'of governance because it does not pretend to be anything other than self-interested. '
      + 'Beneath this philosophy is a gutter-born boy who swore he would never be powerless '
      + 'again.',
    artPrompt:
      'A lean, silver-haired man in his fifties with sharp cheekbones, a thin smile, and '
      + 'dark eyes that miss nothing. He wears a high-collared coat of black velvet with '
      + 'gold thread embroidery and a signet ring bearing the Guild\'s serpent-and-coin seal. '
      + 'Background of a candlelit study with maps, ledgers, and a goblet of wine. Noir '
      + 'portrait — dramatic shadows, gold highlights, elegant menace.',
    stats: {
      strength: 3,
      cunning: 9,
      charisma: 7,
      lore: 4,
      subtlety: 9,
    },
    isCompanion: false,
  },

  // ──────────────────────────────────────────────
  //  6. ELARA DAWNWHISPER — Companion (Conclave Defector)
  // ──────────────────────────────────────────────
  {
    id: 'elara_dawnwhisper',
    name: 'Elara Dawnwhisper',
    title: 'The Unbound Seer',
    faction: 'ashenConclave',
    role: 'companion',
    shortDescription:
      'A young mystic who fled the Conclave after discovering the true cost of Malachar\'s '
      + 'prophecy. She seeks redemption for the things she helped set in motion.',
    fullDescription:
      'Elara was the Conclave\'s prodigy — a girl from a fishing village who manifested '
      + 'Aetheric sight at the age of seven, seeing the luminous threads of magic that bind '
      + 'the world. Malachar himself took her as an apprentice, and for ten years she studied '
      + 'in the deepest archives of Ashenveil, learning secrets that made her powerful and '
      + 'truths that made her afraid. When she discovered the Prophecy of the Vessel\'s true '
      + 'nature — that the "chosen one" was not destined but manufactured, that Malachar had '
      + 'been engineering candidates for centuries, discarding those who broke — she fled. '
      + 'She carries stolen scrolls, a guilty conscience, and the knowledge that Malachar '
      + 'will not stop looking for her. She joins Aldric because she recognizes in him the '
      + 'next candidate, and she will not let another soul be consumed by the old man\'s '
      + 'beautiful, terrible design.',
    personality:
      'Anxious, brilliant, and haunted by complicity. Elara overthinks everything, trusts '
      + 'her instincts only when her logic fails, and carries the weight of her Conclave '
      + 'training like a scar she cannot stop touching. She is fiercely loyal once trust is '
      + 'earned, mordantly funny when she forgets to be afraid, and capable of breathtaking '
      + 'courage when someone else is in danger. Her greatest fear is becoming Malachar — '
      + 'sacrificing people for patterns.',
    motivation:
      'Prevent the Prophecy of the Vessel from claiming Aldric. Atone for her years of '
      + 'complicity in the Conclave\'s manipulations. Find a way to use her gifts that does '
      + 'not require sacrificing others.',
    artPrompt:
      'A young woman in her early twenties with dark skin, close-cropped silver-white hair '
      + '(prematurely aged by Aetheric exposure), and luminous amber eyes that seem to glow '
      + 'faintly. She wears a tattered grey Conclave robe with the insignia torn off, and '
      + 'carries a satchel stuffed with scrolls. Faint arcane marks trace her forearms. '
      + 'Expression of guarded determination. Warm undertones against cool mystical accents.',
    stats: {
      strength: 3,
      cunning: 6,
      charisma: 5,
      lore: 9,
      subtlety: 5,
    },
    isCompanion: true,
    companionAbility:
      'Aetheric Sight — Elara reveals hidden lore checks and secret passages in exploration '
      + 'scenes. Grants +2 to all Lore-based skill checks while in the party. Can identify '
      + 'magical traps and enchanted items before they trigger.',
  },

  // ──────────────────────────────────────────────
  //  7. CAPTAIN THORNE — Iron Throne Military Commander
  // ──────────────────────────────────────────────
  {
    id: 'captain_thorne',
    name: 'Ser Gareth Thorne',
    title: 'Captain of the Crownguard',
    faction: 'ironThrone',
    role: 'ally',
    shortDescription:
      'A decorated military commander who served alongside Aldric in the King\'s Guard. '
      + 'Torn between his oath to the Crown and his certainty that Aldric is innocent.',
    fullDescription:
      'Captain Thorne is the kind of soldier who makes armies function: competent, steady, '
      + 'and deeply, uncomfortably aware of the gap between what he is ordered to do and what '
      + 'he knows to be right. He trained with Aldric, fought beside him in the Border Campaigns, '
      + 'and was the last person to speak to him before the arrest. He knows Aldric did not kill '
      + 'the king. He also knows that saying so publicly would end his career, his freedom, and '
      + 'likely his life. So he serves Queen Isolde with rigid efficiency and hates himself a '
      + 'little more each day. Thorne commands the Crownguard — the Throne\'s elite urban '
      + 'military force — and has been quietly feeding Aldric information through dead drops, '
      + 'risking everything for a principle he cannot bring himself to abandon: that duty to '
      + 'justice outweighs duty to a crown.',
    personality:
      'Stoic, honorable, and increasingly desperate. Thorne is a man of few words and rigid '
      + 'discipline, the kind who polishes his armor at midnight because routine is the only '
      + 'thing keeping the doubt at bay. He is fiercely protective of his soldiers, agonizingly '
      + 'fair to prisoners, and slowly being crushed by the contradiction between loyalty and '
      + 'conscience. His humor, when it surfaces, is bone-dry and self-lacerating.',
    motivation:
      'Serve justice without betraying his oath. Thorne wants to believe these two things are '
      + 'compatible. The story will force him to choose, and the player\'s actions will '
      + 'determine which way he falls.',
    artPrompt:
      'A broad, square-jawed man in his late forties with cropped iron-grey hair and deep-set '
      + 'blue eyes lined with exhaustion. He wears polished Crownguard plate armor — dark '
      + 'steel with crimson trim — and carries a bastard sword and tower shield. His posture '
      + 'is rigid, military, and barely concealing strain. Stone corridor background, torchlight. '
      + 'Stern, duty-worn portrait in dark metallics and warm firelight.',
    stats: {
      strength: 9,
      cunning: 5,
      charisma: 5,
      lore: 3,
      subtlety: 3,
    },
    isCompanion: false,
  },

  // ──────────────────────────────────────────────
  //  8. NYX — Companion (Obsidian Guild Information Broker)
  // ──────────────────────────────────────────────
  {
    id: 'nyx',
    name: 'Nyx',
    title: 'The Whisper',
    faction: 'obsidianGuild',
    role: 'companion',
    shortDescription:
      'A Guild information broker whose real name, face, and loyalties are all subject to '
      + 'change without notice. Nyx sells secrets the way other people breathe: constantly, '
      + 'and without thinking about who needs the air.',
    fullDescription:
      'No one knows Nyx\'s real name, birthplace, or age — and the three different backstories '
      + 'they have offered Aldric are all plausible and mutually exclusive. What is known: Nyx '
      + 'operates as the Obsidian Guild\'s most effective independent broker, a freelance spy '
      + 'who trades intelligence across all four factions with cheerful amorality. They '
      + 'maintain contacts in every court, every temple, every tavern, and at least two '
      + 'cemeteries. Nyx attached themselves to Aldric\'s cause not out of loyalty or ideology '
      + 'but because a disgraced knight investigating a royal murder is, in Nyx\'s professional '
      + 'assessment, "the most interesting thing happening in Aethermoor right now, and '
      + 'interesting things are good for business." Whether Nyx will remain loyal when the '
      + 'cost of loyalty exceeds the cost of betrayal is the question that keeps Aldric '
      + 'awake at night.',
    personality:
      'Sardonic, elusive, and genuinely delighted by chaos. Nyx treats the apocalyptic '
      + 'collapse of the realm as a spectator sport and their own survival as a game they '
      + 'intend to win. Beneath the flippancy is a sharp, survivor\'s pragmatism — Nyx has '
      + 'lived through enough betrayals to know that the only reliable ally is information. '
      + 'They are surprisingly kind in small, unwitnessed moments — leaving food for stray '
      + 'cats, warning street children away from dangerous marks — but will deny any '
      + 'softness if confronted.',
    motivation:
      'Survive. Profit. Be entertained. Nyx\'s surface motivations are simple, but the '
      + 'player may discover deeper layers: a personal grudge against someone in the '
      + 'conspiracy, a debt to a dead friend, or simply the dawning, unwelcome realization '
      + 'that some things matter more than information.',
    artPrompt:
      'An androgynous figure of indeterminate age with sharp features, a knowing smirk, and '
      + 'dark eyes that catch candlelight like a cat\'s. They wear a hooded leather coat over '
      + 'dark, practical clothing, with multiple hidden pockets and a thin dagger visible at '
      + 'the wrist. Half their face is in shadow. Tavern background, smoky atmosphere. Noir '
      + 'aesthetic — deep shadows, warm amber highlights, roguish and dangerous.',
    stats: {
      strength: 4,
      cunning: 7,
      charisma: 6,
      lore: 5,
      subtlety: 10,
    },
    isCompanion: true,
    companionAbility:
      'Shadow Network — Nyx reveals hidden information, secret passages, and NPC true '
      + 'intentions in social encounters. Grants +2 to all Subtlety-based skill checks '
      + 'while in the party. Can unlock black market vendors and bribery options in any '
      + 'settlement.',
  },

  // ──────────────────────────────────────────────
  //  9. BROTHER CEDRIC — Companion (Verdant Pact Healer)
  // ──────────────────────────────────────────────
  {
    id: 'brother_cedric',
    name: 'Cedric of Thornwatch',
    title: 'Brother of the Green',
    faction: 'verdantPact',
    role: 'companion',
    shortDescription:
      'A pacifist healer-monk who walks the war-torn realm unarmed, tending to the wounded '
      + 'of every faction. His gentleness is absolute, his wisdom hard-earned, and his '
      + 'stubbornness legendary.',
    fullDescription:
      'Brother Cedric was a soldier once — a Throne pikeman who fought in the Border '
      + 'Campaigns alongside men like Aldric and Thorne. He was good at killing. The '
      + 'realization of how good nearly destroyed him. After the Siege of Thornwatch, where '
      + 'he watched an entire village burn because his commander deemed civilian evacuation '
      + '"strategically inconvenient," Cedric laid down his pike, walked into the Greenwood, '
      + 'and did not emerge for three years. When he returned, he wore the brown robes of a '
      + 'druidic healer-monk and carried no weapon. He has not raised a hand in violence since. '
      + 'He tends to the sick and wounded regardless of faction — Throne soldiers, Pact rebels, '
      + 'Guild enforcers, Conclave acolytes — because, as he says, "Blood is the same color '
      + 'under every banner." The Verdant Pact claims him as theirs, but Cedric belongs to '
      + 'no faction. He belongs to whoever is bleeding.',
    personality:
      'Gentle, contemplative, and possessed of a quiet moral authority that makes violent '
      + 'men uncomfortable. Cedric does not preach or lecture; he simply acts according to '
      + 'his principles with such consistency that others feel compelled to justify their own '
      + 'choices in his presence. His patience is vast but not infinite — when pushed to '
      + 'genuine anger, usually by cruelty toward the helpless, his voice drops to a whisper '
      + 'that carries more weight than any shout. He has a deep appreciation for simple '
      + 'pleasures: good bread, birdsong, the particular green of new leaves after rain.',
    motivation:
      'Heal what the war breaks. Cedric harbors no grand political ambitions — he wants to '
      + 'reduce suffering, person by person, wound by wound. He joins Aldric because the '
      + 'knight\'s journey passes through the heart of the conflict, and the heart of the '
      + 'conflict is where the wounded will be.',
    artPrompt:
      'A tall, lean man in his fifties with a shaved head, warm brown skin, and deep laugh '
      + 'lines around calm, dark eyes. He wears simple brown robes with a green sash and '
      + 'carries a leather satchel of herbs and bandages. His hands are large, scarred from '
      + 'old battles, and gentle. A faint druidic tattoo of intertwined vines traces his '
      + 'left forearm. Forest clearing background, soft green light. Warm, grounded portrait '
      + '— earth tones, natural light, peaceful intensity.',
    stats: {
      strength: 5,
      cunning: 4,
      charisma: 7,
      lore: 6,
      subtlety: 3,
    },
    isCompanion: true,
    companionAbility:
      'Mender\'s Grace — Cedric restores health after combat encounters and removes negative '
      + 'status effects. Grants passive healing between scenes. Can stabilize dying NPCs in '
      + 'story events, potentially unlocking alternative quest outcomes where key characters '
      + 'survive.',
  },
];
