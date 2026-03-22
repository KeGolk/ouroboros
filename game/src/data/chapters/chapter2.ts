import type { Chapter } from '../story-types';

export const chapter2: Chapter = {
  number: 2,
  title: 'Whispers in Shadow',
  subtitle: 'The conspiracy deepens and the hunted becomes the hunter',
  openingNarration:
    'Three days have passed since King Aldren\'s death, and Valdoria holds its breath. ' +
    'The capital is locked down under martial law, the Ashen Conclave has sealed its borders, ' +
    'and in the Verdant Marches, armed militias gather beneath the ancient oaks. ' +
    'You are a wanted man in a fractured kingdom, and the only path to clearing your name ' +
    'leads deeper into the web of lies that killed a king. But you are not entirely alone — ' +
    'and not every shadow hides an enemy.',
  artPrompt:
    'Medieval spy looking through a cracked door into a candlelit room where conspirators meet, ' +
    'cobblestone streets in rain, multiple shadowy figures, dark fantasy noir, muted colors',
  entryScene: 'ch2_crossroads',
  scenes: [
    // ── Scene 1: The Crossroads (default/independent entry) ───────────
    {
      id: 'ch2_crossroads',
      chapter: 2,
      title: 'Crossroads',
      location: 'The King\'s Road — Thornfield Crossroads',
      artPrompt:
        'Medieval crossroads with a weathered signpost, three paths diverging into forest, farmland, ' +
        'and a distant city, overcast sky, lone traveler, dark fantasy',
      description: [
        'The crossroads at Thornfield has been the meeting point of travelers, merchants, and fugitives ' +
        'for centuries. Three roads converge here beneath a signpost so weathered that its directions ' +
        'have become suggestions rather than facts.',
        'You sit on a milestone, studying the roads ahead. The morning fog has not yet lifted, ' +
        'and the world feels suspended between possibilities. News of the king\'s death has spread ' +
        'like wildfire — every tavern, every market, every whispered conversation carries the same ' +
        'question: who killed Aldren, and what comes next?',
        'You need allies. You need information. And you need to decide which power in Valdoria ' +
        'is most likely to help you without stabbing you in the back.',
      ],
      dialogue: [
        {
          speaker: 'narrator',
          text: 'A raven circles overhead — perhaps a bird, perhaps a Conclave spy. In Valdoria, it is difficult to tell the difference.',
        },
      ],
      choices: [
        {
          id: 'ch2_c1_seek_guild',
          text: 'Head toward the merchant roads — find the Obsidian Guild',
          consequences: [
            { type: 'faction_change', factionId: 'obsidianGuild', value: 5 },
          ],
          targetScene: 'ch2_guild_safehouse',
        },
        {
          id: 'ch2_c1_seek_conclave',
          text: 'Take the northern path toward Conclave territory',
          consequences: [
            { type: 'faction_change', factionId: 'ashenConclave', value: 5 },
          ],
          targetScene: 'ch2_conclave_emissary',
        },
        {
          id: 'ch2_c1_seek_pact',
          text: 'Follow the eastern road into the Verdant Marches',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 5 },
          ],
          targetScene: 'ch2_pact_camp',
        },
        {
          id: 'ch2_c1_investigate_alone',
          text: 'Return to the capital in disguise to investigate alone',
          tooltip: 'Requires Subtlety — enter a city that is hunting you',
          statCheck: {
            stat: 'subtlety',
            difficulty: 5,
            successText:
              'You acquire a merchant\'s cloak and forged papers from a sympathetic innkeeper. The capital opens before you like a wound.',
            failureText:
              'You are recognized at the gate. A chase through the alleys leaves you battered but free — barely.',
            successScene: 'ch2_capital_undercover',
            failureScene: 'ch2_ambush',
          },
          consequences: [
            { type: 'set_flag', flagId: 'returned_to_capital', value: true },
          ],
          targetScene: 'ch2_capital_undercover',
        },
      ],
    },

    // ── Scene 2: Guild Safehouse ──────────────────────────────────────
    {
      id: 'ch2_guild_safehouse',
      chapter: 2,
      title: 'The Counting House',
      location: 'Valdoria — Obsidian Guild Safehouse',
      artPrompt:
        'Hidden underground room beneath a merchant shop, walls lined with ledgers and maps, ' +
        'a cunning woman in dark leather examining documents by candlelight, stacks of gold, ' +
        'shadows and secrets, dark fantasy',
      description: [
        'The Guild\'s safehouse is hidden beneath a perfectly ordinary chandler\'s shop in the ' +
        'merchant district. The candles sold upstairs are unremarkable. The information traded ' +
        'downstairs could topple kingdoms.',
        'The underground chamber is warm, dry, and furnished with a pragmatist\'s efficiency. ' +
        'Maps of Valdoria cover every wall, each one annotated with pins and threads connecting ' +
        'names, places, and debts. At the center of this web sits Nyx, the Guild\'s eyes and ears ' +
        'in the capital, reading a letter that she incinerates the moment you descend the stairs.',
      ],
      dialogue: [
        {
          speaker: 'nyx',
          text: 'You\'re still alive. I owe Fenton a silver — I bet you\'d be dead by Tuesday.',
          mood: 'neutral',
        },
        {
          speaker: 'aldric_vane',
          text: 'Charming. What has the Guild learned about the assassination?',
        },
        {
          speaker: 'nyx',
          text: 'Straight to business. I appreciate that in a fugitive.',
          mood: 'neutral',
        },
        {
          speaker: 'narrator',
          text: 'She unrolls a map and taps three points in sequence — the castle, the Conclave Spire, and a location in the Marches you don\'t recognize.',
        },
        {
          speaker: 'nyx',
          text: 'Three couriers left the capital within an hour of the king\'s death. One to the Spire — expected. One to the Marches — interesting. And one to a ruin called the Pale Sepulcher, deep in the Ashwood. That third one is what keeps me up at night.',
          mood: 'sinister',
        },
        {
          speaker: 'nyx',
          text: 'The Pale Sepulcher is pre-Valdorian. Old magic. The kind of place even the Conclave avoids. Someone wanted that ruin to know the king was dead before anyone else in the realm.',
          mood: 'fearful',
        },
        {
          speaker: 'aldric_vane',
          text: 'Who sent the couriers?',
        },
        {
          speaker: 'nyx',
          text: 'That, my dear knight, is what I need you to find out. The Guild doesn\'t do fieldwork — too much risk, too little profit margin. But you? You\'re already a dead man walking. What\'s a little more danger?',
          mood: 'sinister',
        },
      ],
      choices: [
        {
          id: 'ch2_c2_investigate_sepulcher',
          text: 'Agree to investigate the Pale Sepulcher',
          tooltip: 'Pursue the most dangerous lead',
          consequences: [
            { type: 'faction_change', factionId: 'obsidianGuild', value: 10 },
            { type: 'set_flag', flagId: 'investigating_sepulcher', value: true },
            { type: 'add_item', itemId: 'guild_map_sepulcher' },
          ],
          targetScene: 'ch2_ambush',
        },
        {
          id: 'ch2_c2_track_courier',
          text: 'Ask Nyx to help you track the courier to the Marches instead',
          tooltip: 'A safer lead that may connect to the Verdant Pact',
          consequences: [
            { type: 'faction_change', factionId: 'obsidianGuild', value: 5 },
            { type: 'set_flag', flagId: 'tracking_marches_courier', value: true },
          ],
          targetScene: 'ch2_pact_camp',
        },
        {
          id: 'ch2_c2_demand_more',
          text: 'Demand the Guild share everything — no more parceling out secrets',
          tooltip: 'Requires Cunning — see through Nyx\'s manipulation',
          statCheck: {
            stat: 'cunning',
            difficulty: 6,
            successText:
              'Nyx\'s smile falters. "You\'re sharper than you look." She produces a second document — a list of names. "The Midnight Ledger. Every noble who owed the dead king money. One of them paid a very different kind of debt."',
            failureText:
              'Nyx laughs. "Oh, you\'re adorable when you\'re demanding. But the Guild doesn\'t give — we trade. Bring me something worth knowing, and I\'ll consider it."',
            successScene: 'ch2_ambush',
            failureScene: 'ch2_ambush',
          },
          consequences: [
            { type: 'set_flag', flagId: 'has_midnight_ledger', value: true },
            { type: 'add_item', itemId: 'midnight_ledger' },
          ],
          targetScene: 'ch2_ambush',
        },
        {
          id: 'ch2_c2_recruit_nyx',
          text: 'Ask Nyx to come with you — you need someone who knows the shadows',
          tooltip: 'Try to gain a companion',
          statCheck: {
            stat: 'charisma',
            difficulty: 5,
            successText:
              '"Against my better judgment," Nyx says, buckling a bandolier of throwing knives across her chest. "But if we die, I\'m haunting you specifically."',
            failureText:
              '"I\'m flattered, truly. But Nyx doesn\'t do fieldwork. I\'ll be here when you get back. If you get back."',
            successScene: 'ch2_ambush',
            failureScene: 'ch2_ambush',
          },
          consequences: [
            { type: 'add_companion', companionId: 'nyx' },
            { type: 'faction_change', factionId: 'obsidianGuild', value: 5 },
          ],
          targetScene: 'ch2_ambush',
        },
      ],
    },

    // ── Scene 3: Conclave Emissary ────────────────────────────────────
    {
      id: 'ch2_conclave_emissary',
      chapter: 2,
      title: 'The Veiled Messenger',
      location: 'The Ashwood — Border of Conclave Territory',
      artPrompt:
        'Misty forest clearing with ancient standing stones, a cloaked figure with glowing eyes ' +
        'offering a scroll, runes floating in the air, ethereal and dangerous, dark fantasy',
      description: [
        'The Ashwood marks the boundary of Conclave territory — a forest where the trees grow in ' +
        'unnatural spirals and the shadows move independently of the light. The Conclave\'s wards ' +
        'are woven into the very roots, and you feel them pressing against your mind like curious ' +
        'fingers as you walk deeper.',
        'In a clearing ringed by standing stones, she waits. Elara Dawnwhisper — if you met her ' +
        'in the dungeons, she is a familiar face. If not, she is a stranger in Conclave robes, ' +
        'but her eyes carry none of the Conclave\'s cold detachment. They carry fear.',
      ],
      dialogue: [
        {
          speaker: 'elara_dawnwhisper',
          text: 'You came. I wasn\'t certain you would. The Ashwood has a way of turning people back — it feeds on doubt, and you must carry a great deal of it.',
          mood: 'neutral',
        },
        {
          speaker: 'aldric_vane',
          text: 'I carry questions. About the king. About Nighthollow poison. About what the Conclave is truly after.',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'All excellent questions, and I will answer them — but not here. Malachar\'s ravens are everywhere, and the standing stones have ears.',
          mood: 'fearful',
        },
        {
          speaker: 'narrator',
          text: 'She glances skyward, where dark shapes circle above the canopy. When she speaks again, her voice drops to barely a whisper.',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'Malachar did not order the king\'s death. I know this because I have read the Conclave\'s sealed archives — the real ones, not the ones they show to outsiders. The High Seer wanted Aldren alive. A dead king serves chaos, and Malachar despises chaos.',
          mood: 'hopeful',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'But someone used Conclave poison, which means someone inside the Conclave is working against Malachar. And that terrifies me more than anything, because whoever can operate in the High Seer\'s shadow without his knowledge is more dangerous than any of us imagined.',
          mood: 'fearful',
        },
      ],
      choices: [
        {
          id: 'ch2_c3_trust_elara',
          text: 'Follow Elara to a safer location to hear more',
          tooltip: 'Deepen your connection with the Conclave defector',
          consequences: [
            { type: 'add_companion', companionId: 'elara_dawnwhisper' },
            { type: 'set_flag', flagId: 'elara_ally', value: true },
            { type: 'faction_change', factionId: 'ashenConclave', value: 5 },
          ],
          targetScene: 'ch2_elara_revelation',
        },
        {
          id: 'ch2_c3_demand_proof',
          text: 'Demand proof — words are cheap, especially from a Conclave member',
          tooltip: 'Requires Lore — assess the validity of her claims',
          statCheck: {
            stat: 'lore',
            difficulty: 5,
            successText:
              'Elara produces a scroll bearing Malachar\'s personal cipher. You recognize the notation system — it is a standing order to protect the king\'s bloodline. Genuine.',
            failureText:
              'The scroll she shows you is dense with Conclave ciphers you cannot read. You must decide whether to trust her word.',
            successScene: 'ch2_elara_revelation',
            failureScene: 'ch2_elara_revelation',
          },
          consequences: [
            { type: 'set_flag', flagId: 'verified_conclave_claim', value: true },
            { type: 'add_companion', companionId: 'elara_dawnwhisper' },
          ],
          targetScene: 'ch2_elara_revelation',
        },
        {
          id: 'ch2_c3_confront_malachar',
          text: 'Insist on speaking to Malachar directly',
          tooltip: 'Dangerous — face the High Seer in person',
          consequences: [
            { type: 'faction_change', factionId: 'ashenConclave', value: 10 },
            { type: 'set_flag', flagId: 'confronting_malachar', value: true },
          ],
          targetScene: 'ch2_conclave_inner',
        },
        {
          id: 'ch2_c3_reject',
          text: 'Walk away — the Conclave is playing both sides',
          consequences: [
            { type: 'faction_change', factionId: 'ashenConclave', value: -10 },
            { type: 'set_flag', flagId: 'rejected_conclave', value: true },
          ],
          targetScene: 'ch2_ambush',
        },
      ],
    },

    // ── Scene 4: Conclave Inner Sanctum ───────────────────────────────
    {
      id: 'ch2_conclave_inner',
      chapter: 2,
      title: 'The Inner Sanctum',
      location: 'The Ashen Spire — Hall of Whispers',
      artPrompt:
        'Vast underground cathedral carved from black stone, floating orbs of purple light, ' +
        'an ancient mystic in dark robes seated on a throne of twisted roots, arcane symbols ' +
        'glowing on the walls, dark fantasy interior',
      description: [
        'The Hall of Whispers earns its name. Every word spoken here echoes and multiplies, ' +
        'bouncing between obsidian walls until the air itself seems to murmur with a thousand ' +
        'overlapping conversations. It is a room designed to remind visitors that the Conclave ' +
        'hears everything.',
        'High Seer Malachar sits at the far end, motionless as a statue carved from ash. He is ' +
        'ancient beyond reckoning — his skin papery and translucent, his eyes the milky white of ' +
        'the blind, though you suspect he sees more than any sighted man in Valdoria. When he ' +
        'speaks, his voice carries the dry certainty of someone who has outlived empires.',
      ],
      dialogue: [
        {
          speaker: 'high_seer_malachar',
          text: 'I have been expecting you, Aldric Vane. The threads of fate converge on you with unusual insistence. It is... inconvenient.',
          mood: 'neutral',
        },
        {
          speaker: 'aldric_vane',
          text: 'Nighthollow poison killed the king. Your poison. Your order.',
        },
        {
          speaker: 'high_seer_malachar',
          text: 'My poison, yes. My order? No. You ascribe to me a motive I do not possess. Aldren was a weak king, but a useful one. Weak kings are pliable. Dead kings are merely inconvenient.',
          mood: 'neutral',
        },
        {
          speaker: 'high_seer_malachar',
          text: 'Someone within my own order has betrayed me. They stole the Nighthollow from our vaults and used it to murder the one man whose survival served the Conclave\'s interests.',
          mood: 'angry',
        },
        {
          speaker: 'narrator',
          text: 'The orbs of light dim, and for a moment the hall plunges into near-darkness. When they return, Malachar\'s expression has changed — something almost human flickers behind those blind eyes.',
        },
        {
          speaker: 'high_seer_malachar',
          text: 'I will make you an offer, knight. Find the traitor within my order, and I will give you something no other power in Valdoria can — the truth about why you were really disgraced. Your fall was no accident, Vane. It was orchestrated. And the hand that pushed you is the same hand that killed your king.',
          mood: 'sinister',
        },
      ],
      choices: [
        {
          id: 'ch2_c4_accept_malachar',
          text: 'Accept Malachar\'s offer — hunt the traitor within the Conclave',
          tooltip: 'Align with the most powerful mystic in Valdoria',
          consequences: [
            { type: 'faction_change', factionId: 'ashenConclave', value: 15 },
            { type: 'set_flag', flagId: 'malachar_quest', value: true },
            { type: 'set_flag', flagId: 'knows_disgrace_orchestrated', value: true },
          ],
          targetScene: 'ch2_elara_revelation',
        },
        {
          id: 'ch2_c4_demand_truth_now',
          text: 'Demand the truth about your disgrace now, not later',
          tooltip: 'Requires Charisma — force Malachar\'s hand',
          statCheck: {
            stat: 'charisma',
            difficulty: 7,
            successText:
              '"Your disgrace was arranged by someone within the Iron Throne itself," Malachar says. "Someone who needed you removed from the king\'s inner circle before the assassination. Think on that."',
            failureText:
              '"Patience is a virtue you clearly lack. The truth is earned, not given. Do as I ask, or leave empty-handed."',
            successScene: 'ch2_elara_revelation',
            failureScene: 'ch2_elara_revelation',
          },
          consequences: [
            { type: 'set_flag', flagId: 'knows_throne_betrayal', value: true },
            { type: 'faction_change', factionId: 'ashenConclave', value: 5 },
          ],
          targetScene: 'ch2_elara_revelation',
        },
        {
          id: 'ch2_c4_refuse_malachar',
          text: 'Refuse — you won\'t be anyone\'s pawn',
          tooltip: 'Maintain independence but lose Conclave access',
          consequences: [
            { type: 'faction_change', factionId: 'ashenConclave', value: -15 },
            { type: 'set_flag', flagId: 'refused_malachar', value: true },
          ],
          targetScene: 'ch2_ambush',
        },
      ],
    },

    // ── Scene 5: Elara\'s Revelation ──────────────────────────────────
    {
      id: 'ch2_elara_revelation',
      chapter: 2,
      title: 'The Cipher and the Key',
      location: 'The Ashwood — Elara\'s Hidden Camp',
      artPrompt:
        'Small campfire in a misty forest clearing, a woman unrolling ancient scrolls covered in ' +
        'glowing runes, a knight watching intently, mushrooms glowing faintly in the undergrowth, ' +
        'intimate and mysterious, dark fantasy',
      description: [
        'Elara\'s camp is hidden in a hollow between the roots of an enormous dead oak — one of ' +
        'the petrified sentinels that mark the Ashwood\'s deepest reaches. She has been living here ' +
        'for weeks, and the camp shows it: scrolls pinned to bark with iron nails, a fire pit ' +
        'concealed by an overhead canopy of woven branches, and everywhere, the faint shimmer ' +
        'of protective wards.',
        'She unrolls a large scroll across a flat stone, and in the firelight, you see a map — ' +
        'but not of geography. It is a map of connections. Names, dates, transactions, all linked ' +
        'by lines of crimson ink. At its center, a single word: OUROBOROS.',
      ],
      dialogue: [
        {
          speaker: 'elara_dawnwhisper',
          text: 'This is what I\'ve been piecing together since I left the Conclave. A conspiracy that predates the king\'s death by years — perhaps decades.',
          mood: 'neutral',
        },
        {
          speaker: 'aldric_vane',
          text: 'Ouroboros. The serpent eating its own tail.',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'It is a cell structure — no single member knows more than two others. They exist within every faction, like a rot that has spread through every tree in the forest. The assassination was merely the signal. The real plan is something far larger.',
          mood: 'fearful',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'They seek something beneath the capital. An artifact from before the founding of Valdoria — before the factions, before the monarchy. The king was killed because he discovered what they were looking for and tried to stop them.',
          mood: 'desperate',
        },
        {
          speaker: 'narrator',
          text: 'She meets your eyes across the fire, and for the first time, you see not fear but resolve.',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'I cannot fight this alone. I am a scholar, not a warrior. But together — a knight\'s blade and a seer\'s knowledge — we might have a chance to unravel this before Valdoria tears itself apart.',
          mood: 'hopeful',
        },
      ],
      choices: [
        {
          id: 'ch2_c5_full_alliance',
          text: 'Swear to work together until the conspiracy is exposed',
          tooltip: 'Full commitment to Elara as a partner in the investigation',
          consequences: [
            { type: 'add_companion', companionId: 'elara_dawnwhisper' },
            { type: 'set_flag', flagId: 'elara_sworn_ally', value: true },
            { type: 'set_flag', flagId: 'knows_ouroboros', value: true },
            { type: 'stat_change', stat: 'lore', value: 1 },
          ],
          targetScene: 'ch2_ambush',
        },
        {
          id: 'ch2_c5_cautious',
          text: 'Agree to cooperate, but keep your options open',
          tooltip: 'Alliance without full commitment',
          consequences: [
            { type: 'set_flag', flagId: 'knows_ouroboros', value: true },
            { type: 'set_flag', flagId: 'cautious_alliance_elara', value: true },
          ],
          targetScene: 'ch2_ambush',
        },
        {
          id: 'ch2_c5_take_map',
          text: 'Ask to study the conspiracy map yourself',
          tooltip: 'Requires Lore — understand the connections',
          statCheck: {
            stat: 'lore',
            difficulty: 5,
            successText:
              'The patterns leap out at you. Three names recur at every junction — one from the Iron Throne, one from the Conclave, one from the Guild. The Verdant Pact is conspicuously absent.',
            failureText:
              'The cipher defeats you. Conclave notation is maddeningly complex, and Elara\'s shorthand makes it worse.',
            successScene: 'ch2_ambush',
            failureScene: 'ch2_ambush',
          },
          consequences: [
            { type: 'set_flag', flagId: 'studied_conspiracy_map', value: true },
            { type: 'set_flag', flagId: 'knows_ouroboros', value: true },
            { type: 'add_item', itemId: 'conspiracy_notes' },
          ],
          targetScene: 'ch2_ambush',
        },
      ],
    },

    // ── Scene 6: Verdant Pact Camp ────────────────────────────────────
    {
      id: 'ch2_pact_camp',
      chapter: 2,
      title: 'Under the Green Canopy',
      location: 'The Verdant Marches — Greenhollow Camp',
      artPrompt:
        'Rebel camp under enormous ancient trees, tents made of living vines and branches, ' +
        'farmers and healers tending wounded, a charismatic leader addressing a crowd from a tree stump, ' +
        'warm firelight, pastoral resistance, dark fantasy',
      description: [
        'Greenhollow is less a camp than a village that has decided to hide. Nestled in a valley ' +
        'between two hills, sheltered by oaks so ancient their roots form natural walls, the Verdant ' +
        'Pact\'s largest settlement is invisible from any road. You were led here blindfolded, your ' +
        'guide a silent woman who smelled of herbs and carried a longbow with casual competence.',
        'The camp is alive with quiet purpose. Farmers sharpen tools that serve double duty as ' +
        'weapons. Healers prepare poultices and bandages in quantities that suggest they expect ' +
        'violence. Children play between the tents, blissfully unaware that their parents are ' +
        'preparing for war.',
        'At the camp\'s heart, a man stands on a tree stump, speaking to a gathered crowd with ' +
        'the easy authority of someone who leads by inspiration rather than command.',
      ],
      dialogue: [
        {
          speaker: 'narrator',
          text: 'Brother Cedric materializes at your side. If you met him before, he greets you warmly. If not, he introduces himself with a healer\'s gentle authority.',
        },
        {
          speaker: 'brother_cedric',
          text: 'That is Rowan Greenmantle. He speaks of the king\'s death as an opportunity — not for violence, but for change. He believes the old order can be remade without bloodshed. I pray he is right.',
          mood: 'hopeful',
        },
        {
          speaker: 'narrator',
          text: 'Rowan notices you and pauses his speech. He is younger than you expected — mid-thirties at most, with the weathered hands of a farmer and the sharp eyes of a general. He descends from his stump and approaches.',
        },
        {
          speaker: 'rowan_greenmantle',
          text: 'So. The fugitive knight. I\'ve heard your name in three different versions of the same story — murderer, patsy, and hero. Which one are you?',
          mood: 'neutral',
        },
        {
          speaker: 'aldric_vane',
          text: 'I\'m a man looking for the truth. The king was murdered by a conspiracy that crosses faction lines.',
        },
        {
          speaker: 'rowan_greenmantle',
          text: 'Faction lines. You know what faction lines are to the people of the Marches? They\'re the borders drawn by powerful men to decide who gets to eat and who starves. The king\'s death changes nothing for my people — unless we make it change everything.',
          mood: 'angry',
        },
        {
          speaker: 'rowan_greenmantle',
          text: 'But I am not a fool, Sir Vane. A conspiracy that kills kings may also kill farmers. Tell me what you know, and I will tell you what the Marches have seen.',
          mood: 'neutral',
        },
      ],
      choices: [
        {
          id: 'ch2_c6_share_info',
          text: 'Share everything you\'ve learned about the conspiracy',
          tooltip: 'Full disclosure earns full trust',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 15 },
            { type: 'set_flag', flagId: 'pact_full_disclosure', value: true },
          ],
          targetScene: 'ch2_pact_revelation',
        },
        {
          id: 'ch2_c6_trade_info',
          text: 'Trade information — your clues for theirs',
          tooltip: 'Pragmatic approach, mutual benefit',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 10 },
            { type: 'set_flag', flagId: 'pact_trade', value: true },
          ],
          targetScene: 'ch2_pact_revelation',
        },
        {
          id: 'ch2_c6_offer_sword',
          text: 'Offer your military expertise to the Pact\'s cause',
          tooltip: 'Commit to the Pact as a soldier',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 20 },
            { type: 'faction_change', factionId: 'ironThrone', value: -10 },
            { type: 'set_flag', flagId: 'pact_soldier', value: true },
          ],
          targetScene: 'ch2_pact_revelation',
        },
        {
          id: 'ch2_c6_withhold',
          text: 'Hold back — you need to know more before sharing secrets',
          tooltip: 'Cautious, but may breed suspicion',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: -5 },
            { type: 'set_flag', flagId: 'pact_suspicious', value: true },
          ],
          targetScene: 'ch2_pact_revelation',
        },
      ],
    },

    // ── Scene 7: Pact Revelation ──────────────────────────────────────
    {
      id: 'ch2_pact_revelation',
      chapter: 2,
      title: 'The Farmer\'s Evidence',
      location: 'The Verdant Marches — Greenhollow Camp',
      artPrompt:
        'Campfire scene at night, leader showing a torn royal document to a knight, ' +
        'worried farmers listening, moonlight through oak branches, tense atmosphere, dark fantasy',
      description: [
        'Rowan leads you to a command tent — the largest in the camp, though still modest by any ' +
        'noble\'s standard. Inside, a table is covered with reports from scouts, trade manifests, ' +
        'and a single item that catches your eye immediately: a torn piece of parchment bearing ' +
        'the royal seal.',
      ],
      dialogue: [
        {
          speaker: 'rowan_greenmantle',
          text: 'One of my scouts intercepted a courier three days ago — the night the king died. This was in his satchel. He killed himself rather than be captured. Bit down on something in his tooth. Professional.',
          mood: 'neutral',
        },
        {
          speaker: 'narrator',
          text: 'The parchment is a fragment of a larger document. What remains reads: "...the succession must be controlled. When the Crown falls, the Pact must not be allowed to...". The rest is torn away.',
        },
        {
          speaker: 'rowan_greenmantle',
          text: 'Someone planned this. Planned it well enough to account for how every faction would react. The Pact was supposed to be neutralized. Instead, we caught their messenger. That means they\'ll try again — and next time, they won\'t use couriers.',
          mood: 'angry',
        },
        {
          speaker: 'brother_cedric',
          text: 'Violence breeds violence, Rowan. If we strike first, we become what we oppose.',
          mood: 'hopeful',
        },
        {
          speaker: 'rowan_greenmantle',
          text: 'And if we do nothing, we become victims. There is a line between pacifism and suicide, old friend.',
          mood: 'angry',
        },
      ],
      choices: [
        {
          id: 'ch2_c7_side_rowan',
          text: 'Side with Rowan — preparation for conflict is prudent',
          tooltip: 'Support the militant approach',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 10 },
            { type: 'set_flag', flagId: 'supports_pact_military', value: true },
            { type: 'stat_change', stat: 'strength', value: 1 },
          ],
          targetScene: 'ch2_ambush',
        },
        {
          id: 'ch2_c7_side_cedric',
          text: 'Side with Cedric — seek a peaceful solution first',
          tooltip: 'Support the pacifist approach',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 5 },
            { type: 'set_flag', flagId: 'supports_pact_peace', value: true },
            { type: 'stat_change', stat: 'charisma', value: 1 },
          ],
          targetScene: 'ch2_ambush',
        },
        {
          id: 'ch2_c7_examine_document',
          text: 'Examine the courier\'s document more closely',
          tooltip: 'Requires Lore — decode any hidden messages',
          statCheck: {
            stat: 'lore',
            difficulty: 5,
            successText:
              'Beneath the visible ink, you detect a second layer — writing in heat-reactive ink. Holding it to the fire reveals a partial address: the Pale Sepulcher.',
            failureText:
              'The document yields no further secrets to your untrained eye.',
            successScene: 'ch2_ambush',
            failureScene: 'ch2_ambush',
          },
          consequences: [
            { type: 'set_flag', flagId: 'found_hidden_message', value: true },
            { type: 'set_flag', flagId: 'investigating_sepulcher', value: true },
          ],
          targetScene: 'ch2_ambush',
        },
      ],
    },

    // ── Scene 8: Capital Undercover ───────────────────────────────────
    {
      id: 'ch2_capital_undercover',
      chapter: 2,
      title: 'The Wolf in Sheep\'s Clothing',
      location: 'Valdoria Capital — Merchant District',
      artPrompt:
        'Disguised knight in merchant clothes moving through a medieval city market, ' +
        'wanted posters on walls, soldiers patrolling, suspicious atmosphere, ' +
        'dark fantasy urban scene, muted colors',
      description: [
        'The capital wears its grief like armor. Black banners hang from every window, and ' +
        'the streets are thick with soldiers checking papers and faces. Queen Isolde has declared ' +
        'martial law, and the city groans under it — markets half-empty, taverns closing early, ' +
        'and on every wall, freshly posted notices bearing a rough sketch of your face.',
        'In your stolen merchant\'s cloak, you move through the crowds like a ghost. Every patrol ' +
        'sets your heart hammering, every second glance from a stranger feels like recognition. ' +
        'But the city holds secrets, and they are worth the risk.',
      ],
      dialogue: [
        {
          speaker: 'narrator',
          text: 'Near the old fishmarket, you spot a face you recognize — Captain Thorne, out of uniform, moving through the crowd with the careful anonymity of a man who does not want to be followed. He enters a wine shop through the back door.',
        },
      ],
      choices: [
        {
          id: 'ch2_c8_follow_thorne',
          text: 'Follow Thorne into the wine shop',
          tooltip: 'Requires Subtlety — shadow a trained soldier',
          statCheck: {
            stat: 'subtlety',
            difficulty: 6,
            successText:
              'You slip in through a cellar window and overhear Thorne speaking with someone in hushed tones. He is not hunting you — he is investigating the same conspiracy.',
            failureText:
              'Thorne spots you. His hand goes to his concealed blade — then recognition dawns. He pulls you inside roughly.',
            successScene: 'ch2_thorne_meeting',
            failureScene: 'ch2_thorne_meeting',
          },
          consequences: [
            { type: 'set_flag', flagId: 'followed_thorne', value: true },
          ],
          targetScene: 'ch2_thorne_meeting',
        },
        {
          id: 'ch2_c8_investigate_castle',
          text: 'Head toward the castle — search for evidence in the throne room',
          tooltip: 'Extremely risky but potentially rewarding',
          consequences: [
            { type: 'set_flag', flagId: 'investigated_castle', value: true },
          ],
          targetScene: 'ch2_ambush',
        },
        {
          id: 'ch2_c8_seek_contacts',
          text: 'Search the merchant district for Guild informants',
          consequences: [
            { type: 'faction_change', factionId: 'obsidianGuild', value: 5 },
          ],
          targetScene: 'ch2_guild_safehouse',
        },
      ],
    },

    // ── Scene 9: Thorne Meeting ───────────────────────────────────────
    {
      id: 'ch2_thorne_meeting',
      chapter: 2,
      title: 'The Captain\'s Dilemma',
      location: 'Valdoria Capital — Wine Shop Cellar',
      artPrompt:
        'Two men facing each other in a wine cellar, barrels stacked around them, single candle ' +
        'between them, one in guard captain armor, one in merchant disguise, tense confrontation, ' +
        'dark fantasy',
      description: [
        'The wine shop\'s cellar is deep and cool, lined with casks that have not been opened in ' +
        'years. The dust here has been recently disturbed — Thorne has been using this place ' +
        'as a private meeting room. On a barrel serves as a desk lie several documents: guard ' +
        'rotation schedules, witness statements, and a sealed letter bearing the Queen\'s personal cipher.',
      ],
      dialogue: [
        {
          speaker: 'captain_thorne',
          text: 'Vane. Of all the — you should not be here. If my men find you, I cannot protect you. Not anymore.',
          mood: 'angry',
        },
        {
          speaker: 'aldric_vane',
          text: 'You\'re investigating on your own. The Queen doesn\'t know.',
        },
        {
          speaker: 'captain_thorne',
          text: 'The Queen knows what she wants to know. She has already decided the Conclave is responsible and is preparing for war. I am... not convinced.',
          mood: 'neutral',
        },
        {
          speaker: 'captain_thorne',
          text: 'Three of my best guards were reassigned the night of the murder. Three guards who were supposed to be protecting the throne room. The reassignment orders came from inside the castle — but they don\'t match any officer\'s handwriting I can identify.',
          mood: 'fearful',
        },
        {
          speaker: 'captain_thorne',
          text: 'Someone inside the Iron Throne wanted that room unguarded. And I cannot say that to the Queen without proof, because it would mean accusing her own court of treason.',
          mood: 'desperate',
        },
      ],
      choices: [
        {
          id: 'ch2_c9_ally_thorne',
          text: 'Share what you know and ally with Thorne',
          tooltip: 'Gain a powerful contact inside the Iron Throne',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 10 },
            { type: 'set_flag', flagId: 'thorne_ally', value: true },
            { type: 'add_item', itemId: 'guard_reassignment_orders' },
          ],
          targetScene: 'ch2_ambush',
        },
        {
          id: 'ch2_c9_warn_thorne',
          text: 'Warn him about the conspiracy — he may be in danger',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 5 },
            { type: 'set_flag', flagId: 'warned_thorne', value: true },
          ],
          targetScene: 'ch2_ambush',
        },
        {
          id: 'ch2_c9_use_thorne',
          text: 'Use Thorne\'s information without sharing your own',
          tooltip: 'Requires Cunning — extract maximum value',
          statCheck: {
            stat: 'cunning',
            difficulty: 5,
            successText:
              'Thorne, desperate for an ally, shares everything he knows. You give him just enough to maintain the relationship, keeping your best cards hidden.',
            failureText:
              'Thorne sees through your evasion. "Still playing games, Vane? I thought we were past that." His trust erodes visibly.',
            successScene: 'ch2_ambush',
            failureScene: 'ch2_ambush',
          },
          consequences: [
            { type: 'set_flag', flagId: 'manipulated_thorne', value: true },
            { type: 'add_item', itemId: 'guard_reassignment_orders' },
            { type: 'stat_change', stat: 'cunning', value: 1 },
          ],
          targetScene: 'ch2_ambush',
        },
      ],
    },

    // ── Scene 10: The Ambush (combat scene, chapter climax) ───────────
    {
      id: 'ch2_ambush',
      chapter: 2,
      title: 'Shadows with Teeth',
      location: 'The King\'s Road — Darkwood Crossing',
      artPrompt:
        'Ambush scene on a dark forest road at night, masked assassins emerging from shadows, ' +
        'a knight drawing a sword, moonlight through canopy, danger and action, dark fantasy',
      description: [
        'They come in the deep hours of the night, when the road narrows between ancient oaks ' +
        'and the moonlight cannot penetrate the canopy. You hear them before you see them — the ' +
        'soft displacement of leaves, the whisper of drawn steel, the absence of night sounds ' +
        'that signals predators.',
        'Masked figures materialize from the shadows on both sides of the road. They wear no ' +
        'faction colors, carry no standard — only black cloth masks and weapons designed for ' +
        'silent killing. These are not bandits. Bandits do not move with military precision. ' +
        'Bandits do not carry poisoned blades.',
        'One of them steps forward, a curved dagger catching the moonlight. When she speaks, ' +
        'her voice carries the rehearsed calm of someone delivering a message they have memorized.',
      ],
      dialogue: [
        {
          speaker: 'narrator',
          text: 'The lead assassin\'s mask bears a faint symbol — a serpent devouring its own tail. Ouroboros.',
        },
        {
          speaker: 'narrator',
          text: '"The serpent sends its regards, Sir Vane. You have been looking in places that attract attention. This is your first and final warning: walk away. Leave Valdoria. Forget the king, forget the conspiracy, forget everything. Or the next visitors will not offer words first."',
        },
        {
          speaker: 'aldric_vane',
          text: 'I\'ve been warned before. By better people than you.',
        },
      ],
      combat: {
        type: 'minor',
        enemyName: 'Ouroboros Assassins',
        enemyDescription:
          'Three masked killers bearing the serpent sigil, armed with poisoned short blades and moving with eerie coordination.',
        primaryStat: 'strength',
        difficulty: 5,
        secondaryStat: 'subtlety',
        description:
          'The assassins attack in unison, their blades weaving patterns designed to overwhelm and disorient. You must fight with everything you have.',
        victoryConsequences: [
          { type: 'set_flag', flagId: 'defeated_ouroboros_assassins', value: true },
          { type: 'add_item', itemId: 'ouroboros_medallion' },
          { type: 'stat_change', stat: 'strength', value: 1 },
        ],
        victoryScene: 'ch2_aftermath',
        defeatConsequences: [
          { type: 'damage', value: 30 },
          { type: 'set_flag', flagId: 'defeated_by_assassins', value: true },
        ],
        defeatScene: 'ch2_aftermath',
      },
      choices: [
        {
          id: 'ch2_c10_fight',
          text: 'Draw your blade and fight',
          consequences: [],
          targetScene: 'ch2_aftermath',
        },
        {
          id: 'ch2_c10_negotiate',
          text: 'Try to negotiate — demand to speak to their master',
          tooltip: 'Requires Charisma — delay the attack',
          statCheck: {
            stat: 'charisma',
            difficulty: 6,
            successText:
              'The lead assassin hesitates. "The serpent does not meet with prey. But... you are more persistent than expected. We were told to offer you an alternative: join us. The winning side has room for a knight."',
            failureText:
              'The assassin laughs behind her mask. "Negotiations ended the moment you started asking questions." The blades come up.',
            successScene: 'ch2_aftermath',
            failureScene: 'ch2_aftermath',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ouroboros_recruitment_offer', value: true },
          ],
          targetScene: 'ch2_aftermath',
        },
      ],
    },

    // ── Scene 11: Aftermath (chapter-ending) ──────────────────────────
    {
      id: 'ch2_aftermath',
      chapter: 2,
      title: 'Counting Scars',
      location: 'The King\'s Road — Dawn',
      artPrompt:
        'Dawn breaking over a forest road after a battle, a wounded knight sitting against a tree, ' +
        'examining a serpent medallion, first light through mist, contemplative, dark fantasy',
      description: [
        'Dawn finds you alive — battered, bleeding from a dozen shallow cuts, but alive. The ' +
        'assassins are gone, whether dead, wounded, or withdrawn into the shadows that birthed them. ' +
        'In the growing light, you take stock of what you have: weapons, wounds, and a growing ' +
        'understanding that the conspiracy you are unraveling is larger and more deeply rooted ' +
        'than you imagined.',
        'The Ouroboros is real. It has agents in every faction, resources to command professional ' +
        'killers, and the will to murder a king. And now it knows your name.',
        'You need more than clues. You need allies with the power to act — a faction willing to ' +
        'stand against the serpent. The question is which one to trust with what you know.',
      ],
      dialogue: [
        {
          speaker: 'narrator',
          text: 'The road ahead splits three ways. Each path leads to power — and to a different definition of justice. The time for investigation is ending. The time for commitment is at hand.',
        },
      ],
      choices: [
        {
          id: 'ch2_c11_iron_throne',
          text: 'Return to the capital — the Iron Throne has the military power to crush the conspiracy',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 10 },
            { type: 'set_flag', flagId: 'ch2_chose_throne', value: true },
          ],
          targetScene: 'ch3_throne_approach',
        },
        {
          id: 'ch2_c11_conclave',
          text: 'Seek the Ashen Conclave — their knowledge is the key to understanding the artifact',
          consequences: [
            { type: 'faction_change', factionId: 'ashenConclave', value: 10 },
            { type: 'set_flag', flagId: 'ch2_chose_conclave', value: true },
          ],
          targetScene: 'ch3_conclave_approach',
        },
        {
          id: 'ch2_c11_pact',
          text: 'Go to the Verdant Pact — the only faction not infiltrated by the Ouroboros',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 10 },
            { type: 'set_flag', flagId: 'ch2_chose_pact', value: true },
          ],
          targetScene: 'ch3_pact_approach',
        },
        {
          id: 'ch2_c11_guild',
          text: 'Find the Obsidian Guild — they know who is paying for the conspiracy',
          consequences: [
            { type: 'faction_change', factionId: 'obsidianGuild', value: 10 },
            { type: 'set_flag', flagId: 'ch2_chose_guild', value: true },
          ],
          targetScene: 'ch3_guild_approach',
        },
      ],
    },
  ],
};
