import type { Chapter } from '../story-types';

export const chapter8: Chapter = {
  number: 8,
  title: 'Echoes of the Fallen King',
  subtitle: 'The dead speak truths the living dare not whisper',
  openingNarration:
    'King Aldren has been dead for months, yet his murder still poisons the realm like venom spreading through a wound. Every faction blames another. Every alliance is built on suspicion. And you — disgraced, hunted, carrying the weight of a truth no one wants to hear — are the only one still asking the question that matters: who held the blade, and who guided the hand that held it?',
  artPrompt:
    'A ghostly crown floating above an ancient stone sarcophagus in a candlelit crypt, spectral light, dark fantasy mystery atmosphere',
  entryScene: 'ch8_the_dead_kings_shadow',
  scenes: [
    // ── SCENE 1: The Dead King's Shadow ──
    {
      id: 'ch8_the_dead_kings_shadow',
      chapter: 8,
      title: 'The Dead King\'s Shadow',
      location: 'Ashenmere — Hall of Records',
      artPrompt:
        'A dusty medieval archive with towering shelves of scrolls, a figure studying documents by candlelight, scattered papers, dark fantasy',
      description: [
        'The Hall of Records survived the siege with little more than a shattered window and a layer of dust. Its keepers — a pair of elderly archivists who refused to evacuate — have laid out the documents you requested: tax ledgers, shipping manifests, correspondence between the crown and the four factions in the months preceding King Aldren\'s death.',
        'The pattern emerges slowly, like a figure stepping out of fog. Payments from the Obsidian Guild to mercenary companies. Troop movements ordered by Queen Isolde that left the king\'s personal guard dangerously thin. Ashen Conclave ritual components shipped to the capital in quantities far exceeding any ceremony. Verdant Pact scouts mapping the royal hunting grounds weeks before the assassination.',
        'Every faction\'s hands are dirty. But whose are stained deepest?',
      ],
      dialogue: [
        {
          speaker: 'elara_dawnwhisper',
          text: 'Look at this — a shipment of moonshade extract, enough to kill a hundred men, routed through three Guild front companies. The final destination is listed as the Royal Apothecary.',
          mood: 'fearful',
        },
        {
          speaker: 'aldric_vane',
          text: 'Moonshade. That\'s what the physicians found in the king\'s blood.',
          mood: 'neutral',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'But here — the Conclave authorized the shipment. Malachar\'s personal seal. And the Guild invoice is countersigned by someone in the queen\'s household. Aldric, this wasn\'t one faction. This was coordinated.',
          mood: 'fearful',
        },
        {
          speaker: 'narrator',
          text: 'The candle gutters. In the dancing shadows, the truth takes shape — not a single assassin but a conspiracy, its tendrils reaching into every seat of power in Valdoria.',
        },
      ],
      choices: [
        {
          id: 'ch8_follow_guild_trail',
          text: 'Follow the Obsidian Guild\'s money trail — the poison came through their networks.',
          consequences: [
            { type: 'set_flag', flagId: 'ch8_investigated_guild', value: true },
            { type: 'faction_change', factionId: 'obsidianGuild', value: -5 },
          ],
          targetScene: 'ch8_guild_ledger',
        },
        {
          id: 'ch8_follow_conclave_trail',
          text: 'Investigate the Ashen Conclave\'s ritual shipments — Malachar\'s seal is the key.',
          consequences: [
            { type: 'set_flag', flagId: 'ch8_investigated_conclave', value: true },
            { type: 'faction_change', factionId: 'ashenConclave', value: -5 },
          ],
          targetScene: 'ch8_conclave_secrets',
        },
        {
          id: 'ch8_follow_crown_trail',
          text: 'Examine the queen\'s troop movements — who ordered the guard reduced?',
          consequences: [
            { type: 'set_flag', flagId: 'ch8_investigated_crown', value: true },
            { type: 'faction_change', factionId: 'ironThrone', value: -5 },
          ],
          targetScene: 'ch8_crown_conspiracy',
        },
        {
          id: 'ch8_follow_pact_trail',
          text: 'Why were Verdant Pact scouts mapping the king\'s hunting grounds?',
          consequences: [
            { type: 'set_flag', flagId: 'ch8_investigated_pact', value: true },
            { type: 'faction_change', factionId: 'verdantPact', value: -5 },
          ],
          targetScene: 'ch8_pact_involvement',
        },
      ],
    },

    // ── SCENE 2: Guild Ledger ──
    {
      id: 'ch8_guild_ledger',
      chapter: 8,
      title: 'The Merchant\'s Poison',
      location: 'Ashenmere — Obsidian Guild Safehouse',
      artPrompt:
        'A hidden room behind a tavern wall with a desk full of coded ledgers, poison vials on shelves, candlelight, dark fantasy noir',
      description: [
        'Nyx leads you to the safehouse reluctantly, her usual sardonic composure fraying at the edges. The room behind the tavern wall is small, airless, and crammed with the kind of evidence that gets people killed: coded ledgers, correspondence in invisible ink, a shelf of poisons labeled in the Guild\'s private cipher.',
        'The money trail is damning. Sylas Ashford personally authorized the moonshade shipment — not through intermediaries, but with his own hand. The payment came from a special fund labeled only as "the Convergence Account."',
      ],
      dialogue: [
        {
          speaker: 'nyx',
          text: 'Before you say anything — Sylas didn\'t order the king\'s death. He supplied the means because someone else made it very, very profitable for him to do so. That\'s what the Guild does. We don\'t start fires; we sell kindling.',
          mood: 'angry',
        },
        {
          speaker: 'aldric_vane',
          text: 'Who paid him?',
          mood: 'neutral',
        },
        {
          speaker: 'nyx',
          text: 'That\'s the part Sylas won\'t tell me. The Convergence Account is beyond my clearance. But I can tell you one thing: the money didn\'t come from any single faction. It came from all of them.',
          mood: 'sinister',
        },
        {
          speaker: 'narrator',
          text: 'She produces a ledger from behind a loose stone — one she clearly hid here before your arrival. The final page shows four payments into the Convergence Account, each from a different source, each for exactly the same amount. A perfect, damning symmetry.',
        },
      ],
      choices: [
        {
          id: 'ch8_confront_sylas',
          text: 'Demand that Nyx arrange a meeting with Sylas Ashford — now.',
          statCheck: {
            stat: 'charisma',
            difficulty: 6,
            successText: 'Nyx hesitates, then nods slowly. "He won\'t like it. But he\'ll respect it. One hour — the Gilded Rat tavern."',
            failureText: 'Nyx shakes her head. "Sylas doesn\'t meet with people who make demands. He meets with people who have leverage. Get some."',
            successScene: 'ch8_sylas_confrontation',
            failureScene: 'ch8_the_ritual_chamber',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch8_demanded_sylas_meeting', value: true },
          ],
          targetScene: 'ch8_sylas_confrontation',
        },
        {
          id: 'ch8_take_ledger',
          text: 'Take the ledger as evidence — this is proof of conspiracy.',
          consequences: [
            { type: 'add_item', itemId: 'convergence_ledger' },
            { type: 'faction_change', factionId: 'obsidianGuild', value: -15 },
            { type: 'set_flag', flagId: 'ch8_has_ledger', value: true },
          ],
          targetScene: 'ch8_the_ritual_chamber',
        },
        {
          id: 'ch8_protect_nyx',
          text: 'Promise to keep Nyx\'s name out of this — she\'s risking her life showing you this.',
          consequences: [
            { type: 'faction_change', factionId: 'obsidianGuild', value: 5 },
            { type: 'set_flag', flagId: 'ch8_protected_nyx', value: true },
          ],
          targetScene: 'ch8_the_ritual_chamber',
        },
      ],
    },

    // ── SCENE 3: Conclave Secrets ──
    {
      id: 'ch8_conclave_secrets',
      chapter: 8,
      title: 'The Seer\'s Design',
      location: 'Ashenmere — Ley-Line Chamber',
      artPrompt:
        'An underground chamber with a pulsing magical ley-line visible through cracked stone floor, ancient runes glowing on walls, dark fantasy arcane',
      description: [
        'Beneath the ruined temple, the ley-line pulses with a sickly luminescence. Elara guides you deeper, past the shattered remnants of the ward circle, to a chamber that was sealed until the siege\'s violence cracked it open.',
        'Inside, you find something that stops you cold: a ritual space, ancient and meticulously maintained, with King Aldren\'s personal sigil carved into the floor at its center. This is not a recent addition — the stone is worn smooth by decades of use. Someone has been performing rituals tied to the king for years.',
      ],
      dialogue: [
        {
          speaker: 'elara_dawnwhisper',
          text: 'Soul-binding. These runes are for soul-binding. Someone was... tethering the king\'s life force to the ley-line. Not to kill him — to sustain him. King Aldren should have died years ago.',
          mood: 'fearful',
        },
        {
          speaker: 'aldric_vane',
          text: 'Someone was keeping him alive? Why?',
          mood: 'neutral',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'Control. A king bound to the ley-line is a king who can be controlled by whoever controls the line. And only one person has that power.',
          mood: 'sinister',
        },
        {
          speaker: 'narrator',
          text: 'She does not say Malachar\'s name. She does not need to. The High Seer\'s influence runs through the Conclave like roots through soil — unseen, inescapable, and older than anyone alive can remember.',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'But if the binding was sustaining him, then killing the king wasn\'t just murder — it was severance. Someone cut the link deliberately. And when a soul-binding is severed by force, the energy doesn\'t simply dissipate. It goes somewhere.',
          mood: 'fearful',
        },
      ],
      choices: [
        {
          id: 'ch8_study_runes',
          text: 'Study the runes more carefully — where did the released energy go?',
          statCheck: {
            stat: 'lore',
            difficulty: 7,
            successText: 'The energy signature is unmistakable: it was channeled back into the ley-line, supercharging it. Whoever severed the binding gained an enormous reservoir of arcane power.',
            failureText: 'The runes are in a dialect of Old Valdorian you cannot decipher. You\'ll need more expertise — or more time.',
            successScene: 'ch8_the_ritual_chamber',
            failureScene: 'ch8_the_ritual_chamber',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch8_understood_binding', value: true },
            { type: 'faction_change', factionId: 'ashenConclave', value: -10 },
            { type: 'stat_change', stat: 'lore', value: 1 },
          ],
          targetScene: 'ch8_the_ritual_chamber',
        },
        {
          id: 'ch8_destroy_runes',
          text: 'Destroy the ritual space — no one should have this power.',
          consequences: [
            { type: 'set_flag', flagId: 'ch8_destroyed_ritual_site', value: true },
            { type: 'faction_change', factionId: 'ashenConclave', value: -20 },
            { type: 'faction_change', factionId: 'verdantPact', value: 10 },
          ],
          targetScene: 'ch8_the_ritual_chamber',
        },
        {
          id: 'ch8_preserve_evidence',
          text: 'Document everything but leave it intact — this is evidence, not something to destroy.',
          consequences: [
            { type: 'set_flag', flagId: 'ch8_preserved_ritual_site', value: true },
            { type: 'add_item', itemId: 'ritual_documentation' },
          ],
          targetScene: 'ch8_the_ritual_chamber',
        },
      ],
    },

    // ── SCENE 4: Crown Conspiracy ──
    {
      id: 'ch8_crown_conspiracy',
      chapter: 8,
      title: 'The Queen\'s Gambit',
      location: 'Ashenmere — Captured Command Post',
      artPrompt:
        'A ransacked military command tent with overturned tables and scattered documents bearing royal seals, dark fantasy',
      description: [
        'Among the debris of the besieging army\'s abandoned command post, you find what you\'re looking for: sealed orders bearing Queen Isolde\'s cipher. Captain Thorne helps you decode them, his face growing more ashen with each revelation.',
        'Three weeks before King Aldren\'s death, the queen ordered the Royal Guard\'s elite company transferred to the western frontier — a response to a Verdant Pact uprising that, according to these documents, she herself provoked through a proxy. The king was left with a skeleton guard of men hand-picked by the queen\'s loyalists.',
      ],
      dialogue: [
        {
          speaker: 'captain_thorne',
          text: 'I was stationed at the western frontier. I remember the orders — they came down the chain like any other. Routine transfer, we were told. Border security.',
          mood: 'angry',
        },
        {
          speaker: 'captain_thorne',
          text: 'She used us. She used the entire garrison as a diversion. And I...',
          mood: 'sad',
        },
        {
          speaker: 'narrator',
          text: 'He sets down the decoded orders with the careful precision of a man handling something explosive. His hands, you notice, are steady now. The uncertainty is gone, replaced by something harder and more dangerous: clarity.',
        },
        {
          speaker: 'captain_thorne',
          text: 'But Vane — the queen wanted the throne, not the king dead. She could have simply deposed him. Why assassination? Why poison? Unless someone else turned her opportunism into something darker.',
          mood: 'neutral',
        },
      ],
      choices: [
        {
          id: 'ch8_blame_queen',
          text: '"She may not have held the blade, but she opened the door. That\'s enough."',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: -15 },
            { type: 'set_flag', flagId: 'ch8_blamed_queen', value: true },
          ],
          targetScene: 'ch8_the_ritual_chamber',
        },
        {
          id: 'ch8_exonerate_queen',
          text: '"Thorne\'s right. She\'s guilty of treason, but someone manipulated her plan into a murder."',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 5 },
            { type: 'set_flag', flagId: 'ch8_partial_queen_guilt', value: true },
          ],
          targetScene: 'ch8_the_ritual_chamber',
        },
        {
          id: 'ch8_recruit_thorne',
          text: '"Captain — I need you with me on this. Not as the queen\'s man. As Aldren\'s."',
          statCheck: {
            stat: 'charisma',
            difficulty: 5,
            successText: 'Thorne straightens. The soldier in him answers. "For the king we failed. Yes. I\'m with you."',
            failureText: 'Thorne shakes his head slowly. "I don\'t know what I am anymore, Vane. But I\'ll hear you out."',
            successScene: 'ch8_the_ritual_chamber',
            failureScene: 'ch8_the_ritual_chamber',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch8_thorne_recruited', value: true },
            { type: 'faction_change', factionId: 'ironThrone', value: -5 },
          ],
          targetScene: 'ch8_the_ritual_chamber',
        },
      ],
    },

    // ── SCENE 5: Pact Involvement ──
    {
      id: 'ch8_pact_involvement',
      chapter: 8,
      title: 'The Reluctant Conspirators',
      location: 'Thornwood — Rowan\'s War Tent',
      artPrompt:
        'Inside a rustic rebel leader\'s tent with maps and weapons, a tense conversation by firelight, dark fantasy',
      description: [
        'Rowan does not deny it. That is the first thing that strikes you — his absolute refusal to lie. He sits across from you in his war tent, a cup of untouched cider before him, and tells you everything with the flat honesty of a man who has already judged himself.',
        'The Verdant Pact knew about the assassination before it happened. Not the details — not the poison, not the date — but the intent. A Conclave intermediary approached them months before, offering a deal: support for the Pact\'s territorial claims in exchange for intelligence on the king\'s movements.',
      ],
      dialogue: [
        {
          speaker: 'rowan_greenmantle',
          text: 'We provided the scouts. We mapped the hunting grounds. We told ourselves we were just gathering intelligence — that knowing the king\'s schedule wasn\'t the same as signing his death warrant.',
          mood: 'sad',
        },
        {
          speaker: 'rowan_greenmantle',
          text: 'We were fools. Or cowards. Take your pick.',
          mood: 'angry',
        },
        {
          speaker: 'aldric_vane',
          text: 'The intermediary — who was it? Conclave? Guild?',
          mood: 'neutral',
        },
        {
          speaker: 'rowan_greenmantle',
          text: 'Someone who moved between all four factions like a shadow between candle flames. We knew them only as "the Architect." Even Malachar seemed to defer to them — and Malachar defers to no one.',
          mood: 'fearful',
        },
        {
          speaker: 'narrator',
          text: 'The Architect. A name — or a title — that surfaces now like a body from deep water. Someone who orchestrated not just a murder but an entire realm\'s descent into chaos.',
        },
      ],
      choices: [
        {
          id: 'ch8_forgive_rowan',
          text: '"You were manipulated. All of you were. The guilt belongs to whoever pulled the strings."',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 15 },
            { type: 'set_flag', flagId: 'ch8_forgave_rowan', value: true },
            { type: 'stat_change', stat: 'charisma', value: 1 },
          ],
          targetScene: 'ch8_the_ritual_chamber',
        },
        {
          id: 'ch8_condemn_rowan',
          text: '"You knew an innocent man would die and you did nothing. That\'s complicity."',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: -15 },
            { type: 'set_flag', flagId: 'ch8_condemned_rowan', value: true },
          ],
          targetScene: 'ch8_the_ritual_chamber',
        },
        {
          id: 'ch8_press_for_architect',
          text: '"The Architect. Tell me everything — every detail, every meeting, every message."',
          statCheck: {
            stat: 'cunning',
            difficulty: 6,
            successText: 'Rowan produces a bundle of letters — coded, but with enough context that you can begin to trace the Architect\'s identity.',
            failureText: 'Rowan shakes his head. "I\'ve told you everything I know. The Architect covered their tracks like a winter storm covers footprints."',
            successScene: 'ch8_the_ritual_chamber',
            failureScene: 'ch8_the_ritual_chamber',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch8_architect_letters', value: true },
            { type: 'add_item', itemId: 'architect_correspondence' },
          ],
          targetScene: 'ch8_the_ritual_chamber',
        },
      ],
    },

    // ── SCENE 6: Sylas Confrontation (optional) ──
    {
      id: 'ch8_sylas_confrontation',
      chapter: 8,
      title: 'The Price of Everything',
      location: 'Ashenmere — The Gilded Rat Tavern',
      artPrompt:
        'A richly dressed merchant prince in a private tavern booth, golden goblet, shadows, bodyguards in background, dark fantasy noir',
      description: [
        'Sylas Ashford occupies the private booth at the back of the Gilded Rat as though he owns it — which, you learn later, he does. He is smaller than you expected, a lean man with the watchful stillness of a cat, his fingers adorned with rings that could buy a small village each.',
        'Two bodyguards flank the booth. Nyx sits beside Sylas, her expression carefully neutral. A goblet of wine waits for you, untouched and, you suspect, a test.',
      ],
      dialogue: [
        {
          speaker: 'sylas_ashford',
          text: 'The disgraced knight. You\'ve caused me a great deal of expense, Vane. Disrupted supply chains, frightened informants, burned two of my safehouses. I should be furious.',
          mood: 'neutral',
        },
        {
          speaker: 'sylas_ashford',
          text: 'Instead, I find myself impressed. You\'ve done in months what my best agents couldn\'t do in years — you\'ve actually rattled the board. So. Ask your questions. But understand: every answer has a price.',
          mood: 'sinister',
        },
        {
          speaker: 'aldric_vane',
          text: 'The Convergence Account. Who funded the king\'s assassination?',
          mood: 'neutral',
        },
        {
          speaker: 'sylas_ashford',
          text: 'Everyone, Vane. And no one. Four payments, four factions, each believing they were the only hand on the knife. Magnificent, really. The Architect played us all like instruments in an orchestra.',
          mood: 'sinister',
        },
      ],
      choices: [
        {
          id: 'ch8_threaten_sylas',
          text: '"Name the Architect or I bring this ledger to every faction leader in Valdoria."',
          statCheck: {
            stat: 'cunning',
            difficulty: 7,
            successText: 'Sylas\'s composure cracks — just for an instant. "Careful, knight. But... you\'ve earned a name. Ask Malachar about his first apprentice. The one the histories say died. They didn\'t."',
            failureText: 'Sylas laughs softly. "Threats. How quaint. Do what you will with the ledger — I\'ve already destroyed the originals. You hold a copy of a copy."',
            successScene: 'ch8_the_ritual_chamber',
            failureScene: 'ch8_the_ritual_chamber',
          },
          consequences: [
            { type: 'faction_change', factionId: 'obsidianGuild', value: -10 },
            { type: 'set_flag', flagId: 'ch8_threatened_sylas', value: true },
          ],
          targetScene: 'ch8_the_ritual_chamber',
        },
        {
          id: 'ch8_bargain_sylas',
          text: '"What\'s your price for the Architect\'s identity?"',
          consequences: [
            { type: 'faction_change', factionId: 'obsidianGuild', value: 10 },
            { type: 'set_flag', flagId: 'ch8_bargained_with_sylas', value: true },
          ],
          targetScene: 'ch8_the_ritual_chamber',
        },
        {
          id: 'ch8_appeal_sylas',
          text: '"You were used too, Sylas. The Architect made you an accessory to regicide. That\'s not good business — that\'s a liability."',
          statCheck: {
            stat: 'charisma',
            difficulty: 6,
            successText: 'Sylas is quiet for a long moment. Then: "Malachar\'s first apprentice. Varen. Everyone thinks he\'s dead. He\'s not. Find Varen, find the Architect."',
            failureText: 'Sylas waves a dismissive hand. "My liabilities are my own concern. But I appreciate the attempt."',
            successScene: 'ch8_the_ritual_chamber',
            failureScene: 'ch8_the_ritual_chamber',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch8_appealed_to_sylas', value: true },
          ],
          targetScene: 'ch8_the_ritual_chamber',
        },
      ],
    },

    // ── SCENE 7: The Ritual Chamber — The Revelation ──
    {
      id: 'ch8_the_ritual_chamber',
      chapter: 8,
      title: 'The Architect Revealed',
      location: 'Ashenmere — Deep Ley-Line Nexus',
      artPrompt:
        'A vast underground cavern with a glowing magical nexus at its center, ancient pillars, a spectral figure materializing from light, dark fantasy revelation scene',
      description: [
        'The pieces converge here, in the deep places beneath Ashenmere where the ley-line burns brightest. Elara has prepared a ritual of her own — not a ward or a weapon, but a mirror: a spell that will reflect the ley-line\'s memory back upon itself, showing what was done to it and by whom.',
        'The cavern is vast, its ceiling lost in darkness, its walls carved with runes that predate the kingdom by millennia. The ley-line runs through its center like a river of liquid starlight, and in its glow you can see the scars — places where power was drawn violently, where the natural flow was dammed and redirected.',
        'As Elara completes the ritual, the light coalesces. It takes shape. And the shape is a face you have never seen — yet somehow, horribly, recognize.',
      ],
      dialogue: [
        {
          speaker: 'elara_dawnwhisper',
          text: 'There. The ley-line remembers. The last person to draw from the nexus at lethal magnitude — the one who severed the king\'s soul-binding.',
          mood: 'fearful',
        },
        {
          speaker: 'narrator',
          text: 'The face in the light is gaunt, ageless, with eyes that burn with an intelligence both brilliant and terrible. It is a face that appears in no living record, on no wanted poster, in no faction\'s roster of enemies. Yet the ley-line knows it intimately — this face has been drawing from the nexus for decades.',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'Varen. Malachar\'s first apprentice. The histories say he died in a ritual gone wrong thirty years ago. But the ley-line says otherwise. He\'s been here — beneath Ashenmere — this whole time. Hidden. Patient. Planning.',
          mood: 'fearful',
        },
        {
          speaker: 'aldric_vane',
          text: 'One man. One man turned four factions against each other, murdered a king, and set the realm on fire.',
          mood: 'angry',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'Not just a man. The soul-binding he severed — the king\'s life force — he absorbed it. He\'s been feeding on the ley-line for thirty years, and now he has the life essence of a king running through him. Aldric, he\'s more powerful than Malachar. More powerful than anyone alive.',
          mood: 'desperate',
        },
      ],
      choices: [
        {
          id: 'ch8_tell_all_factions',
          text: 'Every faction needs to know the truth — call for a council immediately.',
          consequences: [
            { type: 'set_flag', flagId: 'ch8_called_council', value: true },
            { type: 'faction_change', factionId: 'ironThrone', value: 5 },
            { type: 'faction_change', factionId: 'ashenConclave', value: 5 },
            { type: 'faction_change', factionId: 'verdantPact', value: 5 },
            { type: 'faction_change', factionId: 'obsidianGuild', value: 5 },
          ],
          targetScene: 'ch8_cedric_counsel',
        },
        {
          id: 'ch8_tell_allies_only',
          text: 'Share this only with your closest allies — trust no one else until you know who Varen has compromised.',
          consequences: [
            { type: 'set_flag', flagId: 'ch8_secret_knowledge', value: true },
            { type: 'stat_change', stat: 'cunning', value: 1 },
          ],
          targetScene: 'ch8_cedric_counsel',
        },
        {
          id: 'ch8_hunt_varen',
          text: 'Forget politics. Hunt Varen now, before he realizes you know.',
          consequences: [
            { type: 'set_flag', flagId: 'ch8_hunting_varen', value: true },
            { type: 'stat_change', stat: 'strength', value: 1 },
          ],
          targetScene: 'ch8_cedric_counsel',
        },
      ],
      variants: [
        {
          condition: { type: 'flag_set', flagId: 'ch8_understood_binding', operator: 'true' },
          dialogue: [
            {
              speaker: 'elara_dawnwhisper',
              text: 'You saw the runes. You understood the binding. That\'s why you can feel it now — the wrongness in the ley-line. Varen is draining it. If he isn\'t stopped, the line will collapse, and every ward, every enchantment, every scrap of magic in Valdoria will die with it.',
              mood: 'desperate',
            },
          ],
        },
      ],
    },

    // ── SCENE 8: Brother Cedric's Counsel ──
    {
      id: 'ch8_cedric_counsel',
      chapter: 8,
      title: 'The Healer\'s Burden',
      location: 'Ashenmere — Field Hospital',
      artPrompt:
        'A medieval field hospital in a ruined chapel, a gentle monk tending wounded soldiers, candlelight and herbs, somber dark fantasy',
      description: [
        'You find Brother Cedric where he has been since the siege began: in the field hospital, tending the wounded with a patience and gentleness that seems to belong to a gentler world than this one. His hands are stained with poultice and blood, and his eyes carry the exhaustion of a man who has not rested in days, yet his voice is steady.',
        'He listens to everything without interruption. The conspiracy. The Architect. Varen. The terrible scope of a plan that sacrificed a king and brought a realm to the edge of ruin. When you finish, the silence between you fills with the groans of the wounded and the distant sound of hammers repairing the walls.',
      ],
      dialogue: [
        {
          speaker: 'brother_cedric',
          text: 'You carry a heavy truth, Aldric. The kind that bends the spine and darkens the sight. I have seen men break under lighter burdens.',
          mood: 'sad',
        },
        {
          speaker: 'aldric_vane',
          text: 'I don\'t know what to do with it, Cedric. Every faction is guilty. Every leader I might turn to has blood on their hands — including mine.',
          mood: 'desperate',
        },
        {
          speaker: 'brother_cedric',
          text: 'Guilt is a river, child. It flows from the source to the sea, touching everything along its banks. But the source is not the river. The factions were tools — crude ones, wielded by a hand that understood their weaknesses. Isolde\'s ambition. Malachar\'s hunger for knowledge. Rowan\'s desperation. Sylas\'s greed. Varen played them like an instrument.',
          mood: 'neutral',
        },
        {
          speaker: 'brother_cedric',
          text: 'The question before you now is not who to blame. It is who to save. And whether you can save them from each other long enough to face the true enemy together.',
          mood: 'hopeful',
        },
        {
          speaker: 'narrator',
          text: 'He places a hand on your shoulder. It is warm, and despite everything — despite the blood and the ruins and the terrible weight of knowledge — you feel, for one brief moment, something that might be peace.',
        },
      ],
      choices: [
        {
          id: 'ch8_seek_unity',
          text: '"You\'re right. We need to unite them — all of them — against Varen."',
          consequences: [
            { type: 'set_flag', flagId: 'ch8_chose_unity', value: true },
            { type: 'faction_change', factionId: 'verdantPact', value: 5 },
            { type: 'stat_change', stat: 'charisma', value: 1 },
          ],
          targetScene: 'ch8_chapter_end',
        },
        {
          id: 'ch8_seek_justice',
          text: '"Unity can wait. Justice first — the factions must answer for their roles before they can be trusted."',
          consequences: [
            { type: 'set_flag', flagId: 'ch8_chose_justice', value: true },
            { type: 'stat_change', stat: 'cunning', value: 1 },
          ],
          targetScene: 'ch8_chapter_end',
        },
        {
          id: 'ch8_seek_power',
          text: '"I need to be strong enough to face Varen alone if it comes to that. What do you know about the ley-line\'s power?"',
          consequences: [
            { type: 'set_flag', flagId: 'ch8_chose_power', value: true },
            { type: 'faction_change', factionId: 'ashenConclave', value: 5 },
            { type: 'stat_change', stat: 'lore', value: 1 },
          ],
          targetScene: 'ch8_chapter_end',
        },
        {
          id: 'ch8_confide_doubt',
          text: '"I\'m not sure I can do this, Cedric. Any of it."',
          consequences: [
            { type: 'set_flag', flagId: 'ch8_showed_vulnerability', value: true },
            { type: 'heal', value: 15 },
          ],
          targetScene: 'ch8_chapter_end',
        },
      ],
    },

    // ── SCENE 9: Chapter End ──
    {
      id: 'ch8_chapter_end',
      chapter: 8,
      title: 'The Road Ahead',
      location: 'Ashenmere — City Gates',
      artPrompt:
        'A lone figure standing at the open gates of a battle-scarred city at dusk, looking toward distant mountains, dark fantasy',
      description: [
        'The truth is known — to you, at least, and to the handful of souls you trust. Varen, the Architect, the puppet master who danced four factions into regicide. He is out there, somewhere in the shadows of Valdoria, gorging on stolen power and watching his masterwork unfold.',
        'But truth alone is not enough. The factions are shattered, suspicious, bleeding from wounds both old and new. To face Varen, you need allies. To forge allies from enemies, you need a miracle — or a very good plan.',
        'Word has gone out: a council is to be held. The Council of Thorns, they call it, for the ancient briar-covered ruins where Valdoria\'s first peace was forged a thousand years ago. All four faction leaders have been invited. Whether they come to talk or to fight remains to be seen.',
      ],
      dialogue: [
        {
          speaker: 'elara_dawnwhisper',
          text: 'The council is our last chance, Aldric. If we cannot make them see past their grievances — if we cannot show them the real enemy — then Varen wins without ever stepping out of the shadows.',
          mood: 'hopeful',
        },
        {
          speaker: 'narrator',
          text: 'You stand at the gates of Ashenmere as the sun dips below the horizon, painting the sky in shades of amber and ash. Ahead lies the most dangerous negotiation of your life. Behind you, a city of scarred survivors watches and waits for a peace that may never come.',
        },
      ],
      choices: [
        {
          id: 'ch8_to_chapter_9',
          text: 'Journey to the Council of Thorns.',
          consequences: [
            { type: 'set_flag', flagId: 'ch8_complete', value: true },
          ],
          targetScene: 'ch9_council_gathering',
        },
      ],
    },
  ],
};
