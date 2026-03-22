import type { Chapter } from '../story-types';

export const chapter5: Chapter = {
  number: 5,
  title: "The Conclave's Secret",
  subtitle: 'Prophecy is not foresight — it is a cage',
  openingNarration:
    'The war at Ashenmere was only a tremor before the earthquake. As Aldric Vane presses deeper into the Ashen Conclave\'s domain, the conspiracy unravels into something far older and more terrible than political assassination. High Seer Malachar has been weaving threads of fate for centuries, and every faction in Valdoria dances to a choreography written before any of them were born. The question is no longer who killed the king — but whether anything in this realm has ever been a choice at all.',
  artPrompt:
    'An ancient underground temple with glowing runes on the walls, a hooded mystic standing before a shimmering veil of light showing multiple branching futures, dark fantasy, oil painting style, ethereal purple and gold lighting',
  entryScene: 'ch5_conclaveSummons',
  scenes: [
    // ─── Scene 1: The Conclave's Summons ──────────────────────────
    {
      id: 'ch5_conclaveSummons',
      chapter: 5,
      title: "The Conclave's Summons",
      location: 'The Ashen Marches - Border of Conclave Territory',
      artPrompt:
        'A desolate grey landscape of ash-covered hills and dead trees, a lone rider approaching a distant glowing fortress, storm clouds above, oil painting style, ominous atmosphere',
      description: [
        'The Ashen Marches earn their name. The land here is grey — not from fire, but from the soil itself, a chalky pale earth where only the hardiest scrub grass grows. The trees are leafless silver birches, their white bark peeling like old parchment. It is a land that looks as though color itself has been drained away, leaving only the memory of life.',
        'Aldric rides through this pallid country with the sense of being watched by something that has no eyes. Elara has grown increasingly agitated since they crossed the border, her hands fidgeting with the amulet she wears — a charm of warding, she explained, though she did not say what it wards against.',
        'The summons came at dawn, delivered by a raven with silver-tipped feathers: "Come to the Sanctum of Echoes. Come alone if you dare, or bring armies if you must. The truth awaits, and it has grown tired of waiting." It was unsigned, but the seal was Malachar\'s — an eye within a spiral.',
      ],
      dialogue: [
        {
          speaker: 'elara_dawnwhisper',
          text: 'He knows we are coming. He has always known. That is what you must understand about Malachar — he does not predict the future. He has already been there. Every step we take is a step he mapped decades ago.',
          mood: 'fearful',
        },
        {
          speaker: 'narrator',
          text: 'A stone marker rises from the roadside, carved with spiraling script in a language that predates Valdoria. Elara reads it without stopping, her lips moving soundlessly. Her face goes a shade paler.',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: '"Here the world thins. Here the Ashenwild breathes. Turn back, or walk forward into the dream that does not end." It is a warning. But I think it was also meant for us specifically. See — there, in the margin. A newer carving. It says "Welcome home, Elara."',
          mood: 'desperate',
        },
      ],
      choices: [
        {
          id: 'ch5_approach_directly',
          text: 'Ride straight to the Sanctum of Echoes. If Malachar expects you, subtlety is pointless.',
          tooltip: 'A direct approach — bold or foolish',
          consequences: [
            { type: 'set_flag', flagId: 'ch5_direct_approach', value: true },
            { type: 'stat_change', stat: 'strength', value: 1 },
          ],
          targetScene: 'ch5_sanctumGates',
        },
        {
          id: 'ch5_scout_sanctum',
          text: 'Circle the Sanctum at a distance, looking for weaknesses, alternate entrances, signs of military presence.',
          tooltip: 'Reconnaissance before commitment',
          statCheck: {
            stat: 'cunning',
            difficulty: 7,
            successText: 'Your careful reconnaissance reveals a servants\' passage in the eastern cliff face, and the troubling absence of any guards.',
            failureText: 'The land itself seems to resist mapping. Paths loop. Landmarks shift. After hours of circling, you find yourself back where you started.',
            successScene: 'ch5_hiddenEntrance',
            failureScene: 'ch5_sanctumGates',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch5_scouted_sanctum', value: true },
          ],
          targetScene: 'ch5_hiddenEntrance',
        },
        {
          id: 'ch5_send_elara_ahead',
          text: 'Send Elara ahead as a former Conclave member — she may be able to pass where others cannot.',
          tooltip: 'Use Elara\'s knowledge of the Conclave',
          conditions: [
            { type: 'companion_present', companionId: 'elara_dawnwhisper', operator: 'true' },
          ],
          consequences: [
            { type: 'set_flag', flagId: 'ch5_elara_scout', value: true },
            { type: 'faction_change', factionId: 'ashenConclave', value: 5 },
          ],
          targetScene: 'ch5_elaraReturn',
        },
        {
          id: 'ch5_wait_for_allies',
          text: 'Camp here and wait for whatever allies you have summoned. The Sanctum should not be entered alone.',
          tooltip: 'Patience and preparation',
          conditions: [
            { type: 'flag_set', flagId: 'ch4_sent_ravens', operator: 'true' },
          ],
          consequences: [
            { type: 'set_flag', flagId: 'ch5_waited_allies', value: true },
            { type: 'heal', value: 10 },
          ],
          targetScene: 'ch5_alliesArrive',
        },
      ],
    },

    // ─── Scene: Allies Arrive ─────────────────────────────────────
    {
      id: 'ch5_alliesArrive',
      chapter: 5,
      title: 'Unlikely Company',
      location: 'The Ashen Marches - Camp',
      artPrompt:
        'A camp on grey hills where warriors from different factions arrive — knights, druids, and shadowy figures meeting around a fire, oil painting style, cautious atmosphere',
      description: [
        'They come in ones and twos over the course of a day. A squad of Iron Throne soldiers led by a young lieutenant who says Captain Thorne sent them. Three Verdant Pact rangers who move like shadows through the pale birches. And Nyx, materializing at the fire as though she had been sitting there all along, with a thin smile and a belt of throwing knives.',
        'It is not an army. It is barely a warband. But it is proof that Aldric\'s message reached ears willing to listen.',
      ],
      dialogue: [
        {
          speaker: 'nyx',
          text: 'Sylas sends his regards. And this.',
          mood: 'neutral',
        },
        {
          speaker: 'narrator',
          text: 'She tosses Aldric a small leather pouch. Inside: a skeleton key of dark metal and a folded map of the Sanctum\'s lower levels, annotated in Sylas\'s precise hand. A note reads: "The Guild always has maps. We charge extra for accurate ones."',
        },
        {
          speaker: 'nyx',
          text: 'I also bring news. Malachar has accelerated his timeline. Two more villages burned in the night — the seventh and eighth harrowings. Four remain. If we are going to stop this, it needs to be now.',
          mood: 'fearful',
        },
      ],
      choices: [
        {
          id: 'ch5_assault_now',
          text: 'Move on the Sanctum immediately with your assembled force.',
          consequences: [
            { type: 'add_item', itemId: 'sanctum_skeleton_key' },
            { type: 'add_item', itemId: 'sanctum_map' },
            { type: 'set_flag', flagId: 'ch5_has_allies', value: true },
          ],
          targetScene: 'ch5_sanctumGates',
        },
        {
          id: 'ch5_infiltrate_small',
          text: 'A large group will be detected. Take only Elara and Nyx through the hidden entrance.',
          consequences: [
            { type: 'add_item', itemId: 'sanctum_skeleton_key' },
            { type: 'add_item', itemId: 'sanctum_map' },
            { type: 'set_flag', flagId: 'ch5_small_team', value: true },
          ],
          targetScene: 'ch5_hiddenEntrance',
        },
      ],
    },

    // ─── Scene: Elara Returns ─────────────────────────────────────
    {
      id: 'ch5_elaraReturn',
      chapter: 5,
      title: "Elara's Report",
      location: 'The Ashen Marches - Border of Conclave Territory',
      artPrompt:
        'A hooded woman emerging from grey mist, looking shaken, hands trembling, a knight reaching out to steady her, desolate landscape, oil painting style',
      description: [
        'Elara returns three hours after she departed, and the change in her is visceral. She moves like someone who has seen her own grave. Her hands shake. Her eyes dart to shadows that are not there.',
        'When she speaks, her voice has the quality of someone recounting a nightmare they are not yet certain they have woken from.',
      ],
      dialogue: [
        {
          speaker: 'elara_dawnwhisper',
          text: 'The Sanctum is not a fortress. It is a temple. And it is alive, Aldric. The walls breathe. The corridors rearrange themselves. The Conclave acolytes I saw — they were not guarding anything. They were praying. Weeping. Some of them have been in there so long they have forgotten their own names.',
          mood: 'fearful',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'Malachar is in the deepest chamber — the Echo Chamber. I could feel him like a weight on my mind, even from the entrance. He is connected to the Sanctum now. Connected to the ley lines. Every harrowing feeds him, and he is so much more than what he was. He spoke to me, Aldric. In my thoughts. He said: "You left to find help. I let you leave so you would bring him to me."',
          mood: 'desperate',
        },
        {
          speaker: 'narrator',
          text: 'The implication settles like cold water. Elara\'s defection. Her conveniently complete knowledge. The list of target villages. Everything Aldric has learned about the conspiracy — was it discovery, or was it a trail of breadcrumbs laid by Malachar himself?',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'I know what you are thinking. And I do not have an answer. I believed my defection was genuine. I still believe it. But belief is a poor shield against a man who can rewrite the meaning of truth.',
          mood: 'sad',
        },
      ],
      choices: [
        {
          id: 'ch5_trust_despite',
          text: 'Even if Malachar planned this, that does not change what must be done. You go in together.',
          tooltip: 'Faith over certainty',
          consequences: [
            { type: 'set_flag', flagId: 'ch5_trusts_elara_fully', value: true },
            { type: 'stat_change', stat: 'charisma', value: 1 },
          ],
          targetScene: 'ch5_sanctumGates',
        },
        {
          id: 'ch5_leave_elara_behind',
          text: 'If Malachar can reach Elara\'s mind, she is a liability inside the Sanctum. She stays here.',
          tooltip: 'Strategic caution',
          consequences: [
            { type: 'set_flag', flagId: 'ch5_left_elara', value: true },
          ],
          targetScene: 'ch5_sanctumGates',
        },
        {
          id: 'ch5_elara_bait',
          text: 'Use this. If Malachar expects Elara to bring you in, let her — but with a plan he has not foreseen.',
          tooltip: 'Turn the trap against the trapper',
          statCheck: {
            stat: 'cunning',
            difficulty: 8,
            successText: 'A plan forms — Elara enters openly while Aldric takes a hidden route. Malachar watches the decoy while the real threat slips through.',
            failureText: 'The plan is too complex. Too many variables. You settle for a direct approach and hope courage compensates for cunning.',
            successScene: 'ch5_hiddenEntrance',
            failureScene: 'ch5_sanctumGates',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch5_used_elara_bait', value: true },
          ],
          targetScene: 'ch5_hiddenEntrance',
        },
      ],
    },

    // ─── Scene: Sanctum Gates ─────────────────────────────────────
    {
      id: 'ch5_sanctumGates',
      chapter: 5,
      title: 'Gates of the Sanctum',
      location: 'The Sanctum of Echoes - Entrance',
      artPrompt:
        'Massive stone gates carved with spiraling eyes and prophetic scenes, set into a grey cliff face, glowing purple runes, hooded figures standing motionless on either side, oil painting style, ominous grandeur',
      description: [
        'The Sanctum of Echoes is carved into the face of a cliff that should not exist — a sheer wall of grey stone rising from the flat marshland like a monument to something forgotten. Its gates are thirty feet tall, carved from a single piece of obsidian, covered in spiraling patterns that move when viewed from the corner of the eye.',
        'Acolytes stand on either side of the entrance, motionless as statues. Their eyes are open but unfocused, their lips moving in silent recitation. They do not react to Aldric\'s approach. They do not react to anything.',
        'The gates are already open. A corridor of pale blue light stretches inward, descending at a gentle angle into the earth. The air that flows from within smells of old paper, cold stone, and something else — ozone, like the air before lightning strikes.',
      ],
      dialogue: [
        {
          speaker: 'narrator',
          text: 'As Aldric crosses the threshold, the world changes. Sound dampens. Shadows deepen. And in the periphery of his vision, he catches glimpses of figures that are not there — echoes of people walking paths not yet taken, ghosts of futures that have not yet been decided.',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'These are probability shadows. The Sanctum exists partially in the Ashenwild — the realm where all possible futures coexist. Malachar has thinned the barrier here deliberately. Do not follow the shadows. They will lead you into futures where you never leave.',
          mood: 'fearful',
        },
      ],
      choices: [
        {
          id: 'ch5_follow_main_corridor',
          text: 'Stay on the main corridor. Follow the light deeper into the Sanctum.',
          consequences: [
            { type: 'set_flag', flagId: 'ch5_main_path', value: true },
          ],
          targetScene: 'ch5_hallOfProphecies',
        },
        {
          id: 'ch5_examine_acolytes',
          text: 'Stop to examine the frozen acolytes — their state might reveal something about Malachar\'s power.',
          tooltip: 'Investigation before pressing forward',
          statCheck: {
            stat: 'lore',
            difficulty: 6,
            successText: 'The acolytes are not frozen — they are resonating. Each one is living conduit for a ley line, their minds dissolved into the flow of prophetic energy. They can still be saved, but only if the source is cut.',
            failureText: 'The acolytes\' condition is beyond your understanding. Whatever has been done to them is old magic, deep magic, and it fills you with dread.',
            successScene: 'ch5_hallOfProphecies',
            failureScene: 'ch5_hallOfProphecies',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch5_examined_acolytes', value: true },
            { type: 'stat_change', stat: 'lore', value: 1 },
          ],
          targetScene: 'ch5_hallOfProphecies',
        },
        {
          id: 'ch5_follow_shadow',
          text: 'Against every instinct, follow one of the probability shadows — if the Sanctum shows possible futures, perhaps one shows a path to victory.',
          tooltip: 'Dangerous and potentially revelatory',
          statCheck: {
            stat: 'lore',
            difficulty: 9,
            successText: 'You step into the shadow and for a heartbeat you see it — a future where Malachar falls, and the method of his undoing. The vision burns itself into your memory before the shadow dissolves.',
            failureText: 'The shadow pulls you sideways, through corridors that do not exist, into a version of the Sanctum where you have already been here for years. Elara drags you back, but something followed.',
            successScene: 'ch5_hallOfProphecies',
            failureScene: 'ch5_shadowTrap',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch5_followed_shadow', value: true },
          ],
          targetScene: 'ch5_hallOfProphecies',
        },
      ],
      variants: [
        {
          condition: { type: 'flag_set', flagId: 'ch5_has_allies', operator: 'true' },
          description: [
            'The assembled warband approaches the Sanctum gates in formation — Iron Throne shields at the front, Pact rangers covering the flanks, Nyx somewhere in the shadows where she belongs. It is the most unlikely army in Valdorian history.',
            'The acolytes at the gates do not react to the small army. Their vacant eyes stare through the soldiers as though they are not there. Perhaps, to whatever the acolytes are seeing, they are not.',
          ],
        },
      ],
    },

    // ─── Scene: Hidden Entrance ───────────────────────────────────
    {
      id: 'ch5_hiddenEntrance',
      chapter: 5,
      title: 'The Servants\' Way',
      location: 'The Sanctum of Echoes - Eastern Cliff',
      artPrompt:
        'A narrow passage carved into a cliff face, a figure squeezing through with a torch, ancient stonework and dripping water, oil painting style, claustrophobic atmosphere',
      description: [
        'The servants\' passage is barely wide enough for a man in armor. Aldric squeezes through a crack in the eastern cliff face, scraping his shoulders on ancient stone that weeps with mineral-rich condensation. The passage descends in tight switchbacks, the air growing colder with each turn.',
        'The walls here are undecorated — no runes, no carvings, no magical light. This was built for those who carried food and emptied chamber pots, not for those who shaped the future. In the hierarchy of the Conclave, even architecture has a caste system.',
        'After twenty minutes of descent, the passage opens into a network of service corridors that run behind the Sanctum\'s grand chambers like veins behind a face.',
      ],
      dialogue: [
        {
          speaker: 'nyx',
          text: 'Service corridors. Every fortress has them. The powerful always forget about the people who clean up after them. Their loss, our advantage.',
          mood: 'neutral',
        },
        {
          speaker: 'narrator',
          text: 'Through thin walls, Aldric can hear chanting — dozens of voices in unison, reciting something that sounds less like prayer and more like a mathematical equation rendered in human breath.',
        },
      ],
      choices: [
        {
          id: 'ch5_eavesdrop',
          text: 'Press your ear to the wall and listen to the chanting — it might reveal what ritual is being performed.',
          statCheck: {
            stat: 'lore',
            difficulty: 7,
            successText: 'The chant is a convergence formula — they are synchronizing the ley line energies for the next harrowing. You can identify the target village: Greyhaven.',
            failureText: 'The words blur together in your mind, meaningless syllables that leave a headache like an iron band around your skull.',
            successScene: 'ch5_hallOfProphecies',
            failureScene: 'ch5_hallOfProphecies',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch5_overheard_ritual', value: true },
          ],
          targetScene: 'ch5_hallOfProphecies',
        },
        {
          id: 'ch5_push_deeper',
          text: 'Follow the service corridors deeper — try to reach the Echo Chamber without being detected.',
          statCheck: {
            stat: 'subtlety',
            difficulty: 7,
            successText: 'You navigate the labyrinthine corridors with silent precision, bypassing patrols of blank-eyed acolytes.',
            failureText: 'A wrong turn deposits you directly into a chamber full of Conclave sentinels. They turn as one, their eyes glowing with pale fire.',
            successScene: 'ch5_echoChamberApproach',
            failureScene: 'ch5_conclaveAmbush',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch5_used_service_tunnels', value: true },
          ],
          targetScene: 'ch5_echoChamberApproach',
        },
      ],
    },

    // ─── Scene: Shadow Trap ───────────────────────────────────────
    {
      id: 'ch5_shadowTrap',
      chapter: 5,
      title: 'Lost Between Worlds',
      location: 'The Ashenwild - Probability Fracture',
      artPrompt:
        'A surreal landscape where reality fractures like broken glass, multiple versions of the same corridor overlapping, spectral figures walking in different directions, oil painting style, disorienting dreamlike quality',
      description: [
        'Reality fractures. Aldric stands in a corridor that is simultaneously three corridors — overlapping, transparent, each one real in a different way. In one, he walks forward. In another, he has already turned back. In a third, he never entered the Sanctum at all.',
        'The shadow he followed dissolves into a dozen smaller shadows, each one a possible future, each one whispering his name in a voice that sounds like his own.',
        'Something moves in the fracture — something that is not a shadow and not a future. Something that lives in the spaces between possibilities, feeding on the energy of unmade choices.',
      ],
      dialogue: [
        {
          speaker: 'narrator',
          text: 'The thing between realities has no face, but it has hunger. It presses against the thinning barrier like a mouth against glass, and where it touches, the overlapping corridors shudder and merge in ways that hurt to look at.',
        },
      ],
      combat: {
        type: 'minor',
        enemyName: 'Probability Wraith',
        enemyDescription:
          'A formless entity that exists in the fractures between possible futures. It attacks not with claws or teeth but with alternatives — showing you realities where you have already lost, trying to make you accept one of them as true.',
        primaryStat: 'lore',
        difficulty: 7,
        secondaryStat: 'strength',
        description:
          'The wraith assaults your sense of what is real. You must anchor yourself in the present — in the truth of who you are and what you have chosen — or be lost in an infinity of might-have-beens.',
        victoryConsequences: [
          { type: 'stat_change', stat: 'lore', value: 2 },
          { type: 'set_flag', flagId: 'ch5_defeated_wraith', value: true },
          { type: 'add_item', itemId: 'shard_of_certainty' },
        ],
        victoryScene: 'ch5_hallOfProphecies',
        defeatConsequences: [
          { type: 'damage', value: 20 },
          { type: 'stat_change', stat: 'lore', value: -1 },
          { type: 'set_flag', flagId: 'ch5_wraith_scarred', value: true },
        ],
        defeatScene: 'ch5_hallOfProphecies',
      },
      choices: [
        {
          id: 'ch5_fight_wraith',
          text: 'Anchor yourself in memory — the taste of bread, the weight of your sword, the face of someone you love. Fight the wraith with reality.',
          consequences: [],
          targetScene: 'ch5_hallOfProphecies',
        },
      ],
    },

    // ─── Scene: Conclave Ambush ───────────────────────────────────
    {
      id: 'ch5_conclaveAmbush',
      chapter: 5,
      title: 'The Sentinels Awaken',
      location: 'The Sanctum of Echoes - Inner Corridors',
      artPrompt:
        'Glowing-eyed hooded sentinels surrounding a knight in a narrow stone corridor, hands raised with crackling magical energy, oil painting style, tense combat',
      description: [
        'The sentinels move with the synchronized precision of fingers on one hand. Their eyes glow with the same pale fire that lights the Sanctum\'s corridors, and their hands crackle with binding magic — the same runes that sealed the villages for the Harrowing.',
        'These are not soldiers. They are extensions of Malachar\'s will, acolytes whose minds have been so thoroughly subsumed by the Sanctum\'s magic that they function as living wards.',
      ],
      dialogue: [
        {
          speaker: 'narrator',
          text: 'They do not speak. They do not need to. The air between them and Aldric thickens, charged with the same ozone smell that permeates the Sanctum. Binding runes begin to trace themselves in the air, closing like a cage.',
        },
      ],
      combat: {
        type: 'minor',
        enemyName: 'Conclave Sentinels',
        enemyDescription:
          'Four acolytes moving as one, their minds dissolved into Malachar\'s network. They wield binding magic that can trap a man in a loop of frozen time.',
        primaryStat: 'strength',
        difficulty: 7,
        secondaryStat: 'subtlety',
        description:
          'The sentinels close in from all sides. Their binding runes tighten like invisible chains. Aldric must break through before the cage closes — through force, through evasion, or by disrupting the magic that connects them.',
        victoryConsequences: [
          { type: 'stat_change', stat: 'strength', value: 1 },
          { type: 'set_flag', flagId: 'ch5_defeated_sentinels', value: true },
        ],
        victoryScene: 'ch5_hallOfProphecies',
        defeatConsequences: [
          { type: 'damage', value: 15 },
          { type: 'set_flag', flagId: 'ch5_captured_briefly', value: true },
        ],
        defeatScene: 'ch5_hallOfProphecies',
      },
      choices: [
        {
          id: 'ch5_break_free',
          text: 'Shatter the binding with brute force — steel against sorcery.',
          consequences: [],
          targetScene: 'ch5_hallOfProphecies',
        },
        {
          id: 'ch5_disrupt_link',
          text: 'Target the connection between the sentinels rather than the sentinels themselves — cut the puppet strings.',
          conditions: [
            { type: 'stat_check', stat: 'lore', operator: 'gte', value: 5 },
          ],
          consequences: [
            { type: 'set_flag', flagId: 'ch5_disrupted_network', value: true },
            { type: 'stat_change', stat: 'lore', value: 1 },
          ],
          targetScene: 'ch5_hallOfProphecies',
        },
      ],
    },

    // ─── Scene: Hall of Prophecies ────────────────────────────────
    {
      id: 'ch5_hallOfProphecies',
      chapter: 5,
      title: 'The Hall of Prophecies',
      location: 'The Sanctum of Echoes - Hall of Prophecies',
      artPrompt:
        'A vast underground hall with walls covered in glowing prophetic murals, scenes of past and future events depicted in luminous paint, a central walkway leading to a distant glowing archway, oil painting style, awe-inspiring and terrifying',
      description: [
        'The Hall of Prophecies is a cathedral of foresight. Its walls stretch upward beyond the reach of torchlight, covered in murals that glow with their own inner luminescence — scenes painted not in pigment but in captured starlight, depicting events past, present, and yet to come.',
        'Aldric walks the central aisle and sees the history of Valdoria unfold around him. The founding of the realm. The rise of the factions. Wars and plagues and harvests, all rendered in exquisite detail. And ahead, where the murals shift from past to future, the images grow strange — branching, splitting, showing multiple possibilities layered over one another like palimpsest.',
        'One mural stops him cold. It depicts a disgraced knight standing in this very hall, looking at this very mural. Behind the painted knight, a shadow looms — a figure in Conclave robes, reaching out to touch the knight\'s shoulder. Aldric turns. There is no one behind him. Not yet.',
      ],
      dialogue: [
        {
          speaker: 'elara_dawnwhisper',
          text: 'The Prophecy Murals. I studied them for three years and understood perhaps one in ten. They are not predictions — they are instructions. Each one depicts a choice point, a moment where the future branches. Malachar has been navigating these branches like a man reading a map.',
          mood: 'fearful',
        },
        {
          speaker: 'narrator',
          text: 'Near the end of the hall, one mural stands larger than the rest. It shows Valdoria consumed by a light that is neither warm nor cold — a light that sees. At the center of the light stands a figure with Malachar\'s face and a thousand eyes, each one watching a different future, a different world, a different version of everything that could ever be.',
        },
        {
          speaker: 'narrator',
          text: 'Beneath the mural, in the old script of the Conclave, a single word: UNRAVELING.',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'This is what he wants. Not power — not the petty power of thrones and armies. He wants omniscience. To see every possible future simultaneously. To know every choice before it is made. He believes it will make him a god. I believe it will unmake reality itself.',
          mood: 'desperate',
        },
      ],
      choices: [
        {
          id: 'ch5_study_murals',
          text: 'Study the branching future murals carefully — there may be a depicted path where the Unraveling fails.',
          tooltip: 'Search for Malachar\'s weakness in his own prophecies',
          statCheck: {
            stat: 'lore',
            difficulty: 8,
            successText: 'There — hidden among the branches of possibility, a single thread where the Unraveling collapses. In that future, someone destroys the focal point during the ritual. But the focal point is a living person.',
            failureText: 'The murals are a labyrinth of meaning. You could spend years studying them and still be lost.',
            successScene: 'ch5_echoChamberApproach',
            failureScene: 'ch5_echoChamberApproach',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch5_found_weakness', value: true },
            { type: 'stat_change', stat: 'lore', value: 1 },
          ],
          targetScene: 'ch5_echoChamberApproach',
        },
        {
          id: 'ch5_destroy_murals',
          text: 'These prophecies are weapons. Destroy them — shatter the murals and deny Malachar his map of the future.',
          tooltip: 'An act of defiance, but also of destruction',
          consequences: [
            { type: 'faction_change', factionId: 'ashenConclave', value: -25 },
            { type: 'set_flag', flagId: 'ch5_destroyed_murals', value: true },
            { type: 'stat_change', stat: 'strength', value: 1 },
          ],
          targetScene: 'ch5_echoChamberApproach',
        },
        {
          id: 'ch5_press_forward',
          text: 'The murals are a distraction. Press on toward the Echo Chamber — every moment spent here is a moment Malachar uses.',
          consequences: [
            { type: 'set_flag', flagId: 'ch5_ignored_murals', value: true },
          ],
          targetScene: 'ch5_echoChamberApproach',
        },
        {
          id: 'ch5_document_murals',
          text: 'Sketch the key prophecy murals — this knowledge could be invaluable to whatever faction helps you stop Malachar.',
          consequences: [
            { type: 'add_item', itemId: 'prophecy_sketches' },
            { type: 'set_flag', flagId: 'ch5_documented_prophecies', value: true },
          ],
          targetScene: 'ch5_echoChamberApproach',
        },
      ],
      variants: [
        {
          condition: { type: 'flag_set', flagId: 'ch5_followed_shadow', operator: 'true' },
          dialogue: [
            {
              speaker: 'narrator',
              text: 'The vision from the probability shadow resolves here, in the Hall of Prophecies. The future you glimpsed — the one where Malachar falls — corresponds to one of the mural branches. You can see it now, glowing slightly brighter than the rest, as though the shadow left a residue of truth on your perception.',
            },
          ],
        },
      ],
    },

    // ─── Scene: Echo Chamber Approach ─────────────────────────────
    {
      id: 'ch5_echoChamberApproach',
      chapter: 5,
      title: 'The Threshold',
      location: 'The Sanctum of Echoes - Antechamber',
      artPrompt:
        'A circular antechamber before massive double doors carved with an all-seeing eye, the doors cracked open with blinding white light spilling through, a knight and companions standing before it, oil painting style, dramatic light and shadow',
      description: [
        'The antechamber before the Echo Chamber is perfectly circular, its domed ceiling painted with a single enormous eye that seems to follow movement. The doors ahead are carved from pale wood that has petrified into something harder than stone, and they stand slightly ajar. Light pours through the gap — not torchlight or sunlight, but something between the two, a luminescence that carries the weight of awareness.',
        'The air here tastes of endings. Not death exactly, but finality — the sensation of standing at a point from which there is no return, only different kinds of forward.',
        'Aldric can hear Malachar\'s voice through the door. Not words, but a tone — a sustained note, like a bell that never stops ringing, vibrating at a frequency that makes his teeth ache and his thoughts blur at the edges.',
      ],
      dialogue: [
        {
          speaker: 'elara_dawnwhisper',
          text: 'Beyond that door, the Ashenwild and the real world overlap almost completely. Malachar has been thinning the barrier for decades. In that room, prophecy is not vision — it is architecture. He can see every possible version of the next few moments. Every move you make, he has already countered in a future he has already visited.',
          mood: 'fearful',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'But there is a flaw. Prophecy shows what might be, not what will be. The more futures he holds in his mind, the harder it is to act in any single one. Overwhelm him. Surprise him. Be so unpredictable that his thousand eyes cannot track you.',
          mood: 'hopeful',
        },
      ],
      choices: [
        {
          id: 'ch5_charge_in',
          text: 'Kick the doors open and charge — give Malachar no time to prepare, no time to see the futures clearly.',
          tooltip: 'Aggressive and unpredictable',
          consequences: [
            { type: 'set_flag', flagId: 'ch5_charged_echo_chamber', value: true },
            { type: 'stat_change', stat: 'strength', value: 1 },
          ],
          targetScene: 'ch5_confrontation',
        },
        {
          id: 'ch5_enter_calmly',
          text: 'Enter calmly. If Malachar can see every future, then panic is useless. Meet him with the composure of someone who has nothing left to fear.',
          tooltip: 'Meet prophecy with resolve',
          consequences: [
            { type: 'set_flag', flagId: 'ch5_entered_calmly', value: true },
            { type: 'stat_change', stat: 'charisma', value: 1 },
          ],
          targetScene: 'ch5_confrontation',
        },
        {
          id: 'ch5_send_others_first',
          text: 'Send your companions through first — if Malachar is watching for you specifically, let him see others while you find another angle.',
          tooltip: 'Tactical misdirection',
          statCheck: {
            stat: 'cunning',
            difficulty: 7,
            successText: 'Your companions create the distraction while you slip in through a side passage Nyx identifies. For a single precious moment, you are invisible to prophecy.',
            failureText: 'Malachar\'s voice echoes through the door: "All of you. Together. I have seen this moment in four hundred futures, and in every one, you enter that door within the next ten heartbeats."',
            successScene: 'ch5_confrontation',
            failureScene: 'ch5_confrontation',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch5_flanked_malachar', value: true },
          ],
          targetScene: 'ch5_confrontation',
        },
      ],
    },

    // ─── Scene: Confrontation with Malachar ───────────────────────
    {
      id: 'ch5_confrontation',
      chapter: 5,
      title: 'The High Seer',
      location: 'The Sanctum of Echoes - Echo Chamber',
      artPrompt:
        'An enormous underground chamber with a vaulted ceiling showing stars that should not be visible underground, a robed figure floating above a glowing ley line nexus, multiple translucent reality-layers visible around him, oil painting style, cosmic dark fantasy, overwhelming scale',
      description: [
        'The Echo Chamber defies geometry. It is vast — vaster than the cliff that contains it should allow, as though the room occupies more space than the world has granted it. The ceiling is open to a sky of impossible stars, constellations that no astronomer has ever mapped, rotating slowly in patterns that whisper of mathematics beyond mortal comprehension.',
        'At the center, where twelve ley lines converge in a web of blue-white energy, High Seer Malachar floats three feet above the ground. He is simultaneously ancient and ageless — his body withered and translucent, but his eyes burning with the light of every future he has ever witnessed. Around him, reality layers like pages in a book, showing dozens of translucent versions of this moment, each slightly different.',
        'In some versions, Aldric attacks. In some, he listens. In some, he has already died. Malachar watches them all with the patient attention of a man reading a familiar story.',
      ],
      dialogue: [
        {
          speaker: 'narrator',
          text: 'When Malachar speaks, his voice comes from everywhere and nowhere, resonating in harmonics that make the probability shadows ripple.',
        },
        {
          speaker: 'high_seer_malachar',
          text: 'Aldric Vane. The disgraced knight who became the variable I could not eliminate. Do you know how rare that is? In seven hundred years of reading the futures, I have encountered perhaps three individuals whose choices genuinely surprised me. You are the fourth.',
          mood: 'neutral',
        },
        {
          speaker: 'high_seer_malachar',
          text: 'Let me be transparent, since opacity has clearly failed to manage you. Yes, I orchestrated the king\'s assassination. Yes, I engineered the faction war. Yes, the Harrowings are my design — twelve ritual sacrifices to thin the barrier between the world and the Ashenwild until I can step through and become one with the river of all possibility.',
          mood: 'sinister',
        },
        {
          speaker: 'high_seer_malachar',
          text: 'But understand — I do not do this for power. I do this because I have seen the alternative. In every future where the Unraveling does not occur, Valdoria falls. Not to war, not to plague, but to a darkness that comes from beyond the stars in forty-three years. I have seen it in eleven thousand futures. The only path where your world survives is the one where I become something more than human. Where I can see the threat coming from every angle. Where I can rewrite fate itself.',
          mood: 'desperate',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'He is lying. Or he believes it, which is worse. Malachar, the futures you see are filtered through your own desire. You do not want to save Valdoria. You want to justify what you have already decided to become.',
          mood: 'angry',
        },
        {
          speaker: 'high_seer_malachar',
          text: 'Perhaps. Or perhaps you defected because I needed you to defect. Because the knight needed a guide, and the guide needed a crisis of conscience. Does it matter, in the end, whether the hand that saves you was moved by love or by design?',
          mood: 'sinister',
        },
      ],
      choices: [
        {
          id: 'ch5_attack_malachar',
          text: 'Draw your sword. Whatever his justifications, the villages burned. The king is dead. The price of his vision has been paid in innocent blood.',
          tooltip: 'Combat against the High Seer',
          consequences: [
            { type: 'set_flag', flagId: 'ch5_attacked_malachar', value: true },
            { type: 'faction_change', factionId: 'ashenConclave', value: -20 },
          ],
          targetScene: 'ch5_malacharBattle',
        },
        {
          id: 'ch5_hear_him_out',
          text: 'Lower your weapon. If there truly is a greater threat, you need to understand it before you act. Ask Malachar to show you what he has seen.',
          tooltip: 'Seek understanding before judgment',
          consequences: [
            { type: 'set_flag', flagId: 'ch5_heard_malachar', value: true },
            { type: 'stat_change', stat: 'lore', value: 1 },
            { type: 'faction_change', factionId: 'ashenConclave', value: 10 },
          ],
          targetScene: 'ch5_malacharVision',
        },
        {
          id: 'ch5_negotiate',
          text: 'There must be another way. Demand that Malachar find a path to stop this darkness that does not require the Harrowings — if he can truly see all futures, he can find a different one.',
          tooltip: 'Challenge his logic on his own terms',
          statCheck: {
            stat: 'charisma',
            difficulty: 9,
            successText: 'For the first time, Malachar\'s composure cracks. A flicker of uncertainty crosses his ancient face — the expression of a man confronting the possibility that he chose convenience over conscience.',
            failureText: 'Malachar smiles sadly. "I have spent seven centuries looking for that path, child. It does not exist. Believe me — no one wanted it to more than I did."',
            successScene: 'ch5_malacharDoubt',
            failureScene: 'ch5_malacharVision',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch5_challenged_malachar', value: true },
          ],
          targetScene: 'ch5_malacharDoubt',
        },
        {
          id: 'ch5_elara_confront',
          text: 'Let Elara speak. This is between master and student. Step back and let her confront what she left behind.',
          tooltip: 'Trust your companion\'s judgment',
          conditions: [
            { type: 'companion_present', companionId: 'elara_dawnwhisper', operator: 'true' },
          ],
          consequences: [
            { type: 'set_flag', flagId: 'ch5_elara_confronted', value: true },
          ],
          targetScene: 'ch5_elaraMalachar',
        },
      ],
      variants: [
        {
          condition: { type: 'flag_set', flagId: 'ch5_found_weakness', operator: 'true' },
          dialogue: [
            {
              speaker: 'narrator',
              text: 'The mural\'s revelation burns in your mind: the Unraveling can be stopped by destroying the focal point — a living person who anchors the ritual. You search the chamber for the anchor, and your eyes are drawn to a figure suspended in the ley line nexus behind Malachar. An acolyte, barely alive, their body threaded with glowing conduits. The anchor.',
            },
          ],
        },
      ],
    },

    // ─── Scene: Malachar Battle ───────────────────────────────────
    {
      id: 'ch5_malacharBattle',
      chapter: 5,
      title: 'Wrath Against Prophecy',
      location: 'The Sanctum of Echoes - Echo Chamber',
      artPrompt:
        'A knight charging at a floating mystic who is surrounded by translucent probability shields, magical energy clashing with steel, reality fracturing around the battle, oil painting style, epic confrontation',
      description: [
        'Aldric\'s blade cuts through the first three probability layers before Malachar even raises his hand. The High Seer\'s eyes widen — not with fear, but with genuine surprise. For a man who has spent seven centuries being unsurprised, it is an expression of profound significance.',
        'The Echo Chamber shudders. Reality cracks and heals and cracks again as two forces collide — the blunt violence of mortal determination and the vast, terrible weight of prophetic power.',
      ],
      dialogue: [
        {
          speaker: 'high_seer_malachar',
          text: 'Fascinating. You should not be able to reach me. I have seen this moment in four hundred iterations and in none of them does your blade come this close. What are you, Vane?',
          mood: 'fearful',
        },
      ],
      combat: {
        type: 'boss',
        enemyName: 'High Seer Malachar',
        enemyDescription:
          'The ancient mystic floats at the nexus of twelve ley lines, surrounded by layers of probability that deflect attacks into alternate futures. His power is immense but divided — he must maintain the Unraveling ritual while fighting.',
        primaryStat: 'strength',
        difficulty: 10,
        secondaryStat: 'lore',
        description:
          'Malachar fights with prophecy itself — seeing your attacks before you make them, stepping into futures where your blows miss. But the Unraveling ritual demands his concentration, creating moments of vulnerability. Strike when his attention splits.',
        victoryConsequences: [
          { type: 'stat_change', stat: 'strength', value: 2 },
          { type: 'set_flag', flagId: 'ch5_wounded_malachar', value: true },
          { type: 'faction_change', factionId: 'ashenConclave', value: -15 },
        ],
        victoryScene: 'ch5_malacharRetreat',
        defeatConsequences: [
          { type: 'damage', value: 35 },
          { type: 'set_flag', flagId: 'ch5_malachar_overpowered', value: true },
        ],
        defeatScene: 'ch5_malacharRetreat',
      },
      choices: [
        {
          id: 'ch5_press_attack',
          text: 'Pour everything into the assault — if Malachar is surprised, press the advantage before he adapts.',
          consequences: [],
          targetScene: 'ch5_malacharRetreat',
        },
      ],
    },

    // ─── Scene: Malachar's Vision ─────────────────────────────────
    {
      id: 'ch5_malacharVision',
      chapter: 5,
      title: 'The Darkness Between Stars',
      location: 'The Ashenwild - Vision',
      artPrompt:
        'A terrifying vision of a dark entity between stars consuming a world, medieval kingdoms crumbling beneath an alien darkness, cosmic horror meets dark fantasy, oil painting style',
      description: [
        'Malachar extends his hand, and the world falls away. Aldric stands in the void between futures, and Malachar shows him the darkness.',
        'It comes from between the stars — not a creature but an absence, a hunger that unmakes meaning. Where it passes, stories end. Not tragically, not heroically, but simply mid-sentence. Entire civilizations reduced to static. And it is moving toward Valdoria with the patient inevitability of a glacier.',
        'In the vision, Aldric watches forty-three years compress into moments. He sees Valdoria at peace. He sees the first signs — crops that grow in impossible shapes, children born with eyes that see too far. He sees the end, and it is not dramatic. It is simply a cessation. One day, Valdoria is there. The next, it is as though it never existed.',
      ],
      dialogue: [
        {
          speaker: 'high_seer_malachar',
          text: 'This is what I have spent seven hundred years trying to prevent. Not an enemy you can fight. Not a force you can negotiate with. An ending so absolute that even prophecy cannot see past it. The only defense is a mind that can perceive all futures simultaneously — that can navigate the infinite paths and find the one where existence continues.',
          mood: 'desperate',
        },
        {
          speaker: 'high_seer_malachar',
          text: 'I am not a monster, Vane. I am a man who made the calculation. Twelve villages for a world. Three hundred lives for millions. The arithmetic is terrible, but it is clear.',
          mood: 'sad',
        },
      ],
      choices: [
        {
          id: 'ch5_accept_vision',
          text: 'The vision is compelling. Perhaps Malachar\'s method is monstrous but his cause is real. Agree to help — on the condition that no more villages burn.',
          consequences: [
            { type: 'faction_change', factionId: 'ashenConclave', value: 25 },
            { type: 'faction_change', factionId: 'verdantPact', value: -15 },
            { type: 'faction_change', factionId: 'ironThrone', value: -15 },
            { type: 'set_flag', flagId: 'ch5_sided_malachar', value: true },
          ],
          targetScene: 'ch5_malacharRetreat',
        },
        {
          id: 'ch5_reject_vision',
          text: 'A convenient vision from a man who can manipulate reality. Even if the darkness is real, becoming a god is not the only answer. Reject Malachar and fight.',
          consequences: [
            { type: 'faction_change', factionId: 'ashenConclave', value: -20 },
            { type: 'set_flag', flagId: 'ch5_rejected_vision', value: true },
          ],
          targetScene: 'ch5_malacharBattle',
        },
        {
          id: 'ch5_question_vision',
          text: 'Neither accept nor reject. Demand proof beyond vision — prophecy can be wrong, and the Ashenwild is a realm of possibilities, not certainties.',
          consequences: [
            { type: 'set_flag', flagId: 'ch5_questioned_vision', value: true },
            { type: 'stat_change', stat: 'cunning', value: 1 },
          ],
          targetScene: 'ch5_malacharDoubt',
        },
      ],
    },

    // ─── Scene: Malachar's Doubt ──────────────────────────────────
    {
      id: 'ch5_malacharDoubt',
      chapter: 5,
      title: 'A Crack in Omniscience',
      location: 'The Sanctum of Echoes - Echo Chamber',
      artPrompt:
        'An ancient mystic floating in a nexus of light, his expression one of uncertainty for the first time in centuries, cracks forming in the magical energy around him, oil painting style, subtle emotional power',
      description: [
        'For the first time in seven centuries, Malachar hesitates. The probability layers around him flicker, showing futures he has not examined, paths he dismissed, possibilities he was too certain to consider. The Echo Chamber trembles as the High Seer\'s perfect confidence develops its first fracture.',
        'It is a small thing — a moment of doubt in a mind that has been unshakeable since before Valdoria\'s founding. But in the architecture of prophecy, small cracks bring down great walls.',
      ],
      dialogue: [
        {
          speaker: 'high_seer_malachar',
          text: 'You ask me if I considered other paths. Of course I did. I have considered every path. I have walked every future. I have—',
          mood: 'angry',
        },
        {
          speaker: 'high_seer_malachar',
          text: '...I have not. Have I? There are paths I dismissed before walking them. Futures I labeled impossible because they required something I did not believe humans capable of. Cooperation without coercion. Sacrifice without manipulation. I filtered them out because they relied on the one variable I could never predict.',
          mood: 'sad',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'Free will, Malachar. The thing you spent your whole life trying to render obsolete.',
          mood: 'neutral',
        },
        {
          speaker: 'high_seer_malachar',
          text: 'Free will is chaos. It is noise. It is the reason prophecy fails. And yet... you are here. You should not be, according to my models. You are, as you have always been, an impossible variable. Perhaps that is exactly what is needed.',
          mood: 'hopeful',
        },
      ],
      choices: [
        {
          id: 'ch5_offer_alliance_malachar',
          text: 'Offer an alternative: use Malachar\'s knowledge to prepare Valdoria for the coming darkness, but through unity, not ritual sacrifice.',
          consequences: [
            { type: 'faction_change', factionId: 'ashenConclave', value: 15 },
            { type: 'set_flag', flagId: 'ch5_proposed_alternative', value: true },
            { type: 'stat_change', stat: 'charisma', value: 2 },
          ],
          targetScene: 'ch5_malacharRetreat',
        },
        {
          id: 'ch5_exploit_doubt',
          text: 'He is off balance. This may be the only chance to strike — attack while his certainty is broken.',
          consequences: [
            { type: 'set_flag', flagId: 'ch5_exploited_doubt', value: true },
            { type: 'faction_change', factionId: 'ashenConclave', value: -20 },
          ],
          targetScene: 'ch5_malacharBattle',
        },
        {
          id: 'ch5_demand_reparations',
          text: 'Malachar must answer for the Harrowings. Knowledge of the future does not absolve the crimes of the past. He must face the other factions\' judgment.',
          consequences: [
            { type: 'set_flag', flagId: 'ch5_demands_justice', value: true },
            { type: 'faction_change', factionId: 'ironThrone', value: 10 },
            { type: 'faction_change', factionId: 'verdantPact', value: 10 },
          ],
          targetScene: 'ch5_malacharRetreat',
        },
      ],
    },

    // ─── Scene: Elara vs Malachar ─────────────────────────────────
    {
      id: 'ch5_elaraMalachar',
      chapter: 5,
      title: 'Master and Student',
      location: 'The Sanctum of Echoes - Echo Chamber',
      artPrompt:
        'A young woman facing an ancient floating mystic, both surrounded by swirling magical energy, the student challenging the master, emotional intensity, oil painting style',
      description: [
        'Elara steps forward, and Aldric lets her. Some confrontations are not about swords. Some battles are fought in the spaces between two people who once trusted each other absolutely.',
        'The Echo Chamber seems to dim as Elara approaches the nexus. The probability layers part around her — not because she controls them, but because she is a known quantity here. The Sanctum remembers her. The ley lines recognize the signature of a mind they helped to shape.',
      ],
      dialogue: [
        {
          speaker: 'elara_dawnwhisper',
          text: 'You taught me to read the futures, Malachar. You taught me to see the branching paths, to weigh possibility against probability. You taught me that knowledge is sacred. And then you used everything you taught me as a leash.',
          mood: 'angry',
        },
        {
          speaker: 'high_seer_malachar',
          text: 'I taught you because you were brilliant, Elara. The most gifted seer I encountered in four centuries. And I let you leave because your brilliance made you unpredictable — a wildcard in my calculations. Your defection was not my plan. But your return... that, I foresaw.',
          mood: 'neutral',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'Then foresee this: I will tear this Sanctum down around your ears before I let you burn another village. I will shatter every ley line, collapse every probability, and seal the Ashenwild forever. Even if it costs me everything I am.',
          mood: 'angry',
        },
        {
          speaker: 'high_seer_malachar',
          text: 'And that, my dear student, is precisely the future I have been trying to prevent. Because if you seal the Ashenwild, you seal away not just my power but every defense this world will ever have against what is coming. Your righteous fury would doom Valdoria as surely as my calculations.',
          mood: 'sinister',
        },
        {
          speaker: 'narrator',
          text: 'The two seers face each other across the nexus, and the ley lines between them crackle with the tension of unresolved prophecy. The futures branch and branch and branch, and somewhere in the infinite splitting, there is a path through.',
        },
      ],
      choices: [
        {
          id: 'ch5_support_elara_action',
          text: 'Back Elara. If sealing the Ashenwild is the price of stopping the Harrowings, pay it. The future will have to find another solution to the darkness.',
          consequences: [
            { type: 'set_flag', flagId: 'ch5_backed_elara', value: true },
            { type: 'faction_change', factionId: 'ashenConclave', value: -25 },
            { type: 'faction_change', factionId: 'verdantPact', value: 10 },
          ],
          targetScene: 'ch5_malacharRetreat',
        },
        {
          id: 'ch5_mediate',
          text: 'Step between them. Neither destruction nor genocide is the answer. There must be a middle path — and you will find it or die trying.',
          consequences: [
            { type: 'set_flag', flagId: 'ch5_mediated_seers', value: true },
            { type: 'stat_change', stat: 'charisma', value: 2 },
          ],
          targetScene: 'ch5_malacharRetreat',
        },
        {
          id: 'ch5_let_them_fight',
          text: 'Let them settle this. Master versus student. Seer versus seer. The stronger vision will prevail.',
          consequences: [
            { type: 'set_flag', flagId: 'ch5_seers_dueled', value: true },
            { type: 'damage', value: 10 },
          ],
          targetScene: 'ch5_malacharRetreat',
        },
      ],
    },

    // ─── Scene: Malachar's Retreat ────────────────────────────────
    {
      id: 'ch5_malacharRetreat',
      chapter: 5,
      title: 'The Seer Withdraws',
      location: 'The Sanctum of Echoes - Collapsing Echo Chamber',
      artPrompt:
        'A vast chamber beginning to crumble, a mystic figure dissolving into light and shadow, the hero shielding themselves from falling debris, magical energy dissipating, oil painting style, dramatic collapse',
      description: [
        'Whether wounded, convinced, or simply calculating the next move, Malachar begins to withdraw. The ley line nexus flares and dims as he pulls his consciousness out of the Sanctum\'s architecture. The chamber groans — stone that has been held together by prophetic will beginning to remember that it should have collapsed centuries ago.',
        'The probability layers collapse one by one, the translucent futures folding like pages of a closing book. Reality reasserts itself with an almost audible snap, and for the first time in perhaps seven hundred years, the Sanctum of Echoes is just a room.',
        'Malachar\'s physical body sinks to the ground — frail, ancient, suddenly and terribly mortal. But his eyes still burn with that terrible light, and when he speaks, his voice carries the weight of a man who has already decided what comes next.',
      ],
      dialogue: [
        {
          speaker: 'high_seer_malachar',
          text: 'The Unraveling is incomplete. Eight of twelve Harrowings performed. The remaining four... I will find another way. Or I will complete them. That depends entirely on what you do next, Vane.',
          mood: 'neutral',
        },
        {
          speaker: 'high_seer_malachar',
          text: 'I am leaving this Sanctum. Not because you have defeated me — you have not. But because you have introduced a variable I did not account for, and I need time to recalculate. Go back to your factions. Tell them what you have learned. And when the darkness comes, remember that I tried to warn you.',
          mood: 'sinister',
        },
        {
          speaker: 'narrator',
          text: 'Malachar folds into shadow and light and is gone — not through a door, but through reality itself, stepping sideways into a future where he is somewhere else. The Sanctum shudders in his absence, and dust begins to fall from the cracking ceiling.',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'We need to leave. Now. This place is dying without him. And Aldric — what he showed you, the darkness between the stars — I have seen it too. In my own visions. He may be a monster, but he is not a liar. The threat is real. And we have just made our only plan to stop it much more complicated.',
          mood: 'desperate',
        },
      ],
      choices: [
        {
          id: 'ch5_escape_sanctum',
          text: 'Run. Get everyone out before the Sanctum collapses.',
          consequences: [
            { type: 'set_flag', flagId: 'ch5_escaped_sanctum', value: true },
          ],
          targetScene: 'ch5_aftermath',
        },
        {
          id: 'ch5_salvage_knowledge',
          text: 'Risk the collapse to salvage what you can — Malachar\'s research, his star charts, anything that might help against the coming darkness.',
          tooltip: 'Risk death for knowledge',
          statCheck: {
            stat: 'cunning',
            difficulty: 8,
            successText: 'You grab an armful of scrolls and charts before a section of ceiling crashes down where you stood moments ago. The knowledge is worth the bruises.',
            failureText: 'A falling column nearly crushes you. You escape with your life but nothing else.',
            successScene: 'ch5_aftermath',
            failureScene: 'ch5_aftermath',
          },
          consequences: [
            { type: 'add_item', itemId: 'malachar_research_notes' },
            { type: 'set_flag', flagId: 'ch5_salvaged_research', value: true },
            { type: 'damage', value: 10 },
          ],
          targetScene: 'ch5_aftermath',
        },
        {
          id: 'ch5_search_for_anchor',
          text: 'Search for the ritual anchor — the living person connected to the ley lines. They might still be alive in the collapsing chamber.',
          tooltip: 'Save the ritual victim',
          conditions: [
            { type: 'flag_set', flagId: 'ch5_found_weakness', operator: 'true' },
          ],
          statCheck: {
            stat: 'strength',
            difficulty: 7,
            successText: 'You find the acolyte suspended in the dying nexus — barely breathing, threaded with ley line conduits that are slowly releasing their hold. You cut them free and carry them out.',
            failureText: 'The nexus collapses before you can reach the anchor. Whatever was there is now buried under tons of stone.',
            successScene: 'ch5_aftermath',
            failureScene: 'ch5_aftermath',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch5_saved_anchor', value: true },
            { type: 'add_companion', companionId: 'ritual_anchor_acolyte' },
            { type: 'damage', value: 15 },
          ],
          targetScene: 'ch5_aftermath',
        },
      ],
      variants: [
        {
          condition: { type: 'flag_set', flagId: 'ch5_sided_malachar', operator: 'true' },
          dialogue: [
            {
              speaker: 'high_seer_malachar',
              text: 'You chose wisely, Vane. I will honor our agreement — no more Harrowings by fire. But the Unraveling must be completed. Find me willing sacrifices — those who would give their lives knowingly for the sake of the world. There are always martyrs. Find me four.',
              mood: 'neutral',
            },
          ],
        },
        {
          condition: { type: 'flag_set', flagId: 'ch5_proposed_alternative', operator: 'true' },
          dialogue: [
            {
              speaker: 'high_seer_malachar',
              text: 'Your alternative intrigues me enough to pause. Unite the factions. Prepare them for what comes. If you can rally Valdoria to face the darkness through strength of will rather than my intervention... I will watch. And if you fail, I will be there to do what must be done.',
              mood: 'neutral',
            },
          ],
        },
      ],
    },

    // ─── Scene: Aftermath ─────────────────────────────────────────
    {
      id: 'ch5_aftermath',
      chapter: 5,
      title: 'Ashes and Echoes',
      location: 'The Ashen Marches - Outside the Sanctum',
      artPrompt:
        'A group of weary travelers watching a cliff face crumble and collapse in a cloud of grey dust, dawn breaking over desolate hills, oil painting style, somber beauty in devastation',
      description: [
        'The Sanctum of Echoes dies slowly. Its cliff face cracks and crumbles over the course of an hour, sending plumes of grey dust into the still air. Where a monument to prophecy stood for seven hundred years, there is now only rubble and the faint, fading glow of ley lines severed from their nexus.',
        'Aldric stands outside with whatever companions remain, watching the collapse with the hollow exhaustion of someone who has learned too much in too short a time. The conspiracy is deeper than assassination. The stakes are higher than thrones. And the enemy — if Malachar can even be called that — has escaped to recalculate.',
        'The war between factions continues, each Harrowing feeding a ritual that may be the world\'s doom or its salvation. And somewhere between the stars, something ancient and hungry draws imperceptibly closer.',
      ],
      dialogue: [
        {
          speaker: 'elara_dawnwhisper',
          text: 'What do we do now? We cannot fight Malachar alone. We cannot stop the Harrowings without finding where he has gone. And we cannot ignore the darkness he showed us. Every path forward leads through the factions.',
          mood: 'neutral',
        },
        {
          speaker: 'narrator',
          text: 'Dawn breaks over the Ashen Marches, painting the grey landscape in tones of amber and rose. It is the kind of sunrise that makes you believe the world is worth saving — even when you are not sure how.',
        },
      ],
      choices: [
        {
          id: 'ch5_return_to_throne',
          text: 'Return to Queen Isolde and the Iron Throne. Military might will be needed, whatever comes next.',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 10 },
            { type: 'set_flag', flagId: 'ch5_returned_throne', value: true },
          ],
          targetScene: 'ch6_factionReturn',
        },
        {
          id: 'ch5_seek_verdant',
          text: 'Go to the Verdant Pact. Rowan and the druids understand the land\'s magic — they may know how to protect the remaining villages.',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 10 },
            { type: 'set_flag', flagId: 'ch5_sought_pact', value: true },
          ],
          targetScene: 'ch6_factionReturn',
        },
        {
          id: 'ch5_contact_guild',
          text: 'Find Sylas Ashford. The Obsidian Guild\'s network can track Malachar where armies and druids cannot.',
          consequences: [
            { type: 'faction_change', factionId: 'obsidianGuild', value: 10 },
            { type: 'set_flag', flagId: 'ch5_sought_guild', value: true },
          ],
          targetScene: 'ch6_factionReturn',
        },
        {
          id: 'ch5_go_alone',
          text: 'Trust no one. The factions are compromised, prophecy is unreliable, and the only certainty is your own sword arm. Go alone.',
          consequences: [
            { type: 'set_flag', flagId: 'ch5_went_alone', value: true },
            { type: 'stat_change', stat: 'strength', value: 1 },
            { type: 'stat_change', stat: 'cunning', value: 1 },
          ],
          targetScene: 'ch6_factionReturn',
        },
      ],
    },
  ],
};
