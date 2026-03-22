import type { Chapter } from '../story-types';

export const chapter4: Chapter = {
  number: 4,
  title: 'Blood and Iron',
  subtitle: 'When diplomacy fails, the sword speaks',
  openingNarration:
    'The fragile peace that held Valdoria together has shattered like glass beneath a mailed fist. Armies march. Villages burn. The assassination of King Aldren was not an ending but a spark, and now the tinder catches. Aldric Vane rides through a realm at war, the truth of the conspiracy still half-formed in his mind, while the factions bare their teeth and the innocent pay the price of ambition.',
  artPrompt:
    'A dark medieval battlefield at dawn, banners of four factions flying over smoking ruins, armored knights clashing with druids and shadowy assassins, dramatic storm clouds overhead, oil painting style, dark fantasy, chiaroscuro lighting',
  entryScene: 'ch4_warCouncil',
  scenes: [
    // ─── Scene 1: War Council ─────────────────────────────────────
    {
      id: 'ch4_warCouncil',
      chapter: 4,
      title: 'The War Council',
      location: 'Ironhold Fortress - War Chamber',
      artPrompt:
        'A vast stone war room with a carved map table, flickering torchlight, armored commanders arguing, dark medieval fantasy, oil painting style',
      description: [
        'The war chamber of Ironhold Fortress smells of tallow and old iron. A massive table dominates the room, its surface carved into a relief map of Valdoria, now scarred with knife marks where commanders have jabbed their daggers to mark enemy positions. Colored stones represent armies: black for the Iron Throne, white for the Ashen Conclave, green for the Verdant Pact, red for the Obsidian Guild.',
        'Aldric stands among warriors and schemers, acutely aware that his disgraced knighthood grants him no rank here. Yet the intelligence he carries — fragments of the assassination conspiracy — has bought him a seat at this table. The question is whose table it truly is.',
        'Captain Thorne presides, his scarred face a mask of rigid discipline. Across from him, emissaries from each faction watch one another with the wary patience of wolves circling the same kill.',
      ],
      dialogue: [
        {
          speaker: 'captain_thorne',
          text: 'Three border villages burned in the night. The Verdant Pact claims it was Iron Throne reprisal. We claim it was Conclave provocation. The truth, I suspect, serves none of us well.',
          mood: 'angry',
        },
        {
          speaker: 'narrator',
          text: 'Captain Thorne unfolds a bloodstained map and spreads it across the war table. Red circles mark the sites of massacres — too many, too recent, too coordinated to be coincidence.',
        },
        {
          speaker: 'queen_isolde',
          text: 'Enough posturing, Captain. Our scouts report a Verdant Pact warband moving through the Thornwood toward Ashenmere. If they take that crossing, they split our territory in two. I need solutions, not eulogies for peasants.',
          mood: 'neutral',
        },
        {
          speaker: 'rowan_greenmantle',
          text: 'Your Majesty speaks of peasants as though they are tiles on a game board. Perhaps that is why they flock to our banners rather than yours.',
          mood: 'angry',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'Aldric — I have been listening to the whispers in the Conclave channels. Something is wrong. These attacks are too precise, too perfectly timed to set every faction against every other. Someone is orchestrating this.',
          mood: 'fearful',
        },
      ],
      choices: [
        {
          id: 'ch4_support_throne',
          text: 'Stand with Queen Isolde and advocate for a military strike against the Verdant Pact warband.',
          tooltip: 'Align with the Iron Throne\'s militaristic approach',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 15 },
            { type: 'faction_change', factionId: 'verdantPact', value: -20 },
            { type: 'set_flag', flagId: 'ch4_sided_throne_war', value: true },
          ],
          targetScene: 'ch4_marchToAshenmere',
        },
        {
          id: 'ch4_support_pact',
          text: 'Side with Rowan and argue that the real enemy is whoever orchestrated the village burnings.',
          tooltip: 'Align with the Verdant Pact\'s perspective',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 15 },
            { type: 'faction_change', factionId: 'ironThrone', value: -10 },
            { type: 'set_flag', flagId: 'ch4_sided_pact_war', value: true },
          ],
          targetScene: 'ch4_thornwoodParley',
        },
        {
          id: 'ch4_investigate_attacks',
          text: 'Press Elara\'s lead — demand time to investigate the attacks before any army marches.',
          tooltip: 'Pursue the conspiracy angle',
          statCheck: {
            stat: 'cunning',
            difficulty: 6,
            successText: 'Your sharp reasoning convinces the council to grant you a day\'s reprieve.',
            failureText: 'Queen Isolde dismisses your plea. The army marches regardless, and you scramble to keep up.',
            successScene: 'ch4_villageInvestigation',
            failureScene: 'ch4_marchToAshenmere',
          },
          consequences: [
            { type: 'faction_change', factionId: 'ashenConclave', value: 5 },
            { type: 'set_flag', flagId: 'ch4_investigated_attacks', value: true },
          ],
          targetScene: 'ch4_villageInvestigation',
        },
        {
          id: 'ch4_consult_sylas',
          text: 'Slip away to consult Sylas Ashford — the Obsidian Guild always knows who profits from chaos.',
          tooltip: 'Seek the merchant prince\'s intelligence',
          conditions: [
            { type: 'faction_reputation', factionId: 'obsidianGuild', operator: 'gte', value: -10 },
          ],
          consequences: [
            { type: 'faction_change', factionId: 'obsidianGuild', value: 10 },
            { type: 'set_flag', flagId: 'ch4_consulted_guild', value: true },
          ],
          targetScene: 'ch4_guildIntelligence',
        },
      ],
    },

    // ─── Scene 2: March to Ashenmere ──────────────────────────────
    {
      id: 'ch4_marchToAshenmere',
      chapter: 4,
      title: 'The March to Ashenmere',
      location: 'The Ashenmere Crossing',
      artPrompt:
        'A medieval army marching through misty wetlands toward a stone bridge, dark banners flying, grim soldiers trudging through mud, oil painting style, dark atmosphere',
      description: [
        'The Iron Throne\'s army moves like a steel serpent through the marshlands east of Ashenmere. Two thousand soldiers in dark plate, their boots churning the road to mud, their breath steaming in the cold morning air. Aldric rides near the vanguard, Elara at his side, both of them uneasy.',
        'The Ashenmere Crossing is a ancient stone bridge spanning a river gorge — the only passage between the eastern and western halves of Valdoria wide enough for an army. Whoever holds it controls the flow of the war. And according to scouts, a Verdant Pact force under the command of a warrior known only as the Thornknight has already fortified the far side.',
        'Smoke rises from a village on the near bank. Not battle smoke — cooking fires. Refugees from the border burnings have gathered here, hundreds of families with nowhere left to go, directly in the path of two converging armies.',
      ],
      dialogue: [
        {
          speaker: 'captain_thorne',
          text: 'The refugees complicate things. We cannot maneuver siege equipment through their encampment without displacing them, and we cannot leave them at our backs. War does not pause for the wretched.',
          mood: 'neutral',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'Aldric, look at them. Children, elders, the sick. If we force them out, they will die in the marshes. If we fight around them, they will die in the crossfire. There is no version of this battle that does not cost innocent lives.',
          mood: 'sad',
        },
        {
          speaker: 'narrator',
          text: 'A child watches from between the canvas walls of a makeshift tent, clutching a wooden sword. He stares at Aldric\'s armor with wide eyes — not with admiration, but with the recognition of someone who has already learned that armor means death is coming.',
        },
        {
          speaker: 'queen_isolde',
          text: 'Vane. You wanted to be useful. Here is your chance. Clear the civilians or find me another route across that river. You have until sunset.',
          mood: 'neutral',
        },
      ],
      choices: [
        {
          id: 'ch4_evacuate_civilians',
          text: 'Organize an evacuation — guide the refugees south to the monastery at Greyhaven before battle begins.',
          tooltip: 'Protect civilians at the cost of time',
          statCheck: {
            stat: 'charisma',
            difficulty: 7,
            successText: 'Your earnest plea and organized effort moves the refugees to safety before nightfall.',
            failureText: 'The refugees resist, terrified of another move. You manage to clear most but not all.',
            successScene: 'ch4_bridgeBattle',
            failureScene: 'ch4_bridgeBattle',
          },
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 10 },
            { type: 'faction_change', factionId: 'ironThrone', value: -5 },
            { type: 'set_flag', flagId: 'ch4_saved_refugees', value: true },
            { type: 'stat_change', stat: 'charisma', value: 1 },
          ],
          targetScene: 'ch4_bridgeBattle',
        },
        {
          id: 'ch4_force_through',
          text: 'Follow the Queen\'s order — force the refugees aside and prepare the assault.',
          tooltip: 'Military efficiency at a moral cost',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 10 },
            { type: 'faction_change', factionId: 'verdantPact', value: -15 },
            { type: 'set_flag', flagId: 'ch4_displaced_refugees', value: true },
            { type: 'stat_change', stat: 'strength', value: 1 },
          ],
          targetScene: 'ch4_bridgeBattle',
        },
        {
          id: 'ch4_find_ford',
          text: 'Scout for an alternate river crossing to avoid the refugee camp entirely.',
          tooltip: 'Find another way across',
          statCheck: {
            stat: 'cunning',
            difficulty: 8,
            successText: 'You discover a hidden ford two miles upstream, shielded by willow groves.',
            failureText: 'Hours of searching yield nothing. The army must use the bridge after all.',
            successScene: 'ch4_flanking',
            failureScene: 'ch4_bridgeBattle',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch4_found_ford', value: true },
          ],
          targetScene: 'ch4_flanking',
        },
      ],
    },

    // ─── Scene 2b: Thornwood Parley ───────────────────────────────
    {
      id: 'ch4_thornwoodParley',
      chapter: 4,
      title: 'Parley in the Thornwood',
      location: 'The Thornwood - Sacred Grove',
      artPrompt:
        'A moonlit sacred grove with massive ancient oaks, druids and rangers gathered around a bonfire, a rebel camp in a dark enchanted forest, oil painting style',
      description: [
        'The Thornwood swallows all sound. Ancient oaks tower overhead, their canopy so thick that even noon feels like dusk. Aldric follows Rowan Greenmantle through paths invisible to untrained eyes, past sentries hidden in the undergrowth who watch with bowstrings half-drawn.',
        'The Sacred Grove is a clearing where the trees form a near-perfect circle, as if the forest itself had carved out a council chamber. A bonfire crackles at its center, casting long shadows across the faces of the Verdant Pact\'s inner circle — weathered farmers, fierce rangers, druids with bark-patterned skin.',
        'Brother Cedric waits by the fire, tending to a wounded scout. He looks up as Aldric enters, and something like hope crosses his gentle face.',
      ],
      dialogue: [
        {
          speaker: 'rowan_greenmantle',
          text: 'You came. That took either courage or desperation. I respect both. Sit. Eat. Then tell me why I should not assume the Iron Throne sent you here to map our positions.',
          mood: 'neutral',
        },
        {
          speaker: 'brother_cedric',
          text: 'Because I vouched for him, Rowan. This man pulled my patients from the burning chapel at Millhaven. The Throne would not send a knight who saves commoners — they do not understand the value.',
          mood: 'hopeful',
        },
        {
          speaker: 'narrator',
          text: 'Rowan studies Aldric for a long moment, the firelight turning his green eyes to amber. Then he reaches into his cloak and produces a dagger — not as a threat, but as evidence. The blade is etched with Conclave sigils.',
        },
        {
          speaker: 'rowan_greenmantle',
          text: 'This was pulled from the back of one of my scouts. Not an Iron Throne blade, not a Guild knife. Ashen Conclave. The same Conclave that claims neutrality while whispering prophecies into every faction\'s ear. Someone is playing us all, Vane. And I think you know it.',
          mood: 'angry',
        },
      ],
      choices: [
        {
          id: 'ch4_share_intel_pact',
          text: 'Share everything you know about the conspiracy — the assassination, Elara\'s warnings, the orchestrated attacks.',
          tooltip: 'Full transparency with the Verdant Pact',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 20 },
            { type: 'faction_change', factionId: 'ashenConclave', value: -10 },
            { type: 'set_flag', flagId: 'ch4_pact_knows_conspiracy', value: true },
          ],
          targetScene: 'ch4_pactAlliance',
        },
        {
          id: 'ch4_partial_truth',
          text: 'Reveal only that you suspect the Conclave — keep the details of the assassination conspiracy to yourself.',
          tooltip: 'Cautious disclosure',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 10 },
            { type: 'set_flag', flagId: 'ch4_partial_pact_trust', value: true },
          ],
          targetScene: 'ch4_pactAlliance',
        },
        {
          id: 'ch4_demand_proof',
          text: 'Demand to see the Verdant Pact\'s own intelligence before sharing anything — trust must be earned both ways.',
          tooltip: 'Negotiate an information exchange',
          statCheck: {
            stat: 'charisma',
            difficulty: 6,
            successText: 'Rowan nods slowly, respecting your caution. He produces a bundle of intercepted Conclave letters.',
            failureText: 'Rowan\'s expression hardens. "You want our secrets but offer nothing. Perhaps you are a Throne spy after all."',
            successScene: 'ch4_pactAlliance',
            failureScene: 'ch4_bridgeBattle',
          },
          consequences: [
            { type: 'add_item', itemId: 'conclave_intercepted_letters' },
          ],
          targetScene: 'ch4_pactAlliance',
        },
      ],
    },

    // ─── Scene 2c: Village Investigation ──────────────────────────
    {
      id: 'ch4_villageInvestigation',
      chapter: 4,
      title: 'Ashes Tell No Lies',
      location: 'Millhaven - Burned Ruins',
      artPrompt:
        'Ruins of a burned medieval village at dawn, a lone investigator kneeling in ash, charred timber and scattered personal belongings, somber atmosphere, oil painting style',
      description: [
        'Millhaven is a graveyard of smoke and silence. The village that once housed three hundred souls is now a geometry of charred beams and collapsed walls. Ash drifts like grey snow. Aldric walks through the ruins with Elara, both of them covering their mouths against the acrid air.',
        'The attack pattern is wrong. Aldric has seen enough raids in his years of service to know that armies burn outward from a center — they enter a village and the destruction radiates. But Millhaven burned from the perimeter inward. Someone surrounded this village and set fires at every exit simultaneously. This was not a raid. It was an execution.',
        'Elara kneels beside a burned doorframe and traces symbols scorched into the wood — not by the fire, but deliberately carved before it. Her face goes pale.',
      ],
      dialogue: [
        {
          speaker: 'elara_dawnwhisper',
          text: 'These are binding runes. Old Conclave magic — the kind they told me was forbidden even to study. Someone used containment wards to seal the villagers inside before setting the fires. This was ritual, Aldric. This was deliberate sacrifice.',
          mood: 'fearful',
        },
        {
          speaker: 'narrator',
          text: 'In the ash, Aldric finds a child\'s doll, its cloth body half-burned but its painted face still smiling. He sets it gently on a stone that might have been a hearth.',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'The Conclave teaches that sufficient death in a bounded space creates a resonance — a kind of echo in the weave of fate. They call it a Harrowing. I thought it was theoretical. Academic. Gods, Aldric, they are harvesting deaths to fuel something.',
          mood: 'desperate',
        },
      ],
      choices: [
        {
          id: 'ch4_collect_evidence',
          text: 'Carefully document everything — the rune patterns, the burn geometry, the evidence of ritual — to present to the other factions.',
          tooltip: 'Build an irrefutable case',
          consequences: [
            { type: 'add_item', itemId: 'millhaven_evidence' },
            { type: 'stat_change', stat: 'lore', value: 1 },
            { type: 'set_flag', flagId: 'ch4_has_harrowing_evidence', value: true },
          ],
          targetScene: 'ch4_bridgeBattle',
        },
        {
          id: 'ch4_trace_runes',
          text: 'Have Elara trace the magical residue to find where the energy was directed — follow the trail to its source.',
          tooltip: 'Track the Conclave\'s ritual magic',
          statCheck: {
            stat: 'lore',
            difficulty: 7,
            successText: 'Elara\'s hands tremble as she follows the invisible threads of spent magic. They point northeast — toward the Conclave\'s Sanctum of Echoes.',
            failureText: 'The magical residue is too dispersed. Elara can sense direction but not distance.',
            successScene: 'ch4_bridgeBattle',
            failureScene: 'ch4_bridgeBattle',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch4_traced_ritual', value: true },
            { type: 'faction_change', factionId: 'ashenConclave', value: -10 },
          ],
          targetScene: 'ch4_bridgeBattle',
        },
        {
          id: 'ch4_confront_elara',
          text: 'Turn on Elara — demand to know how much she knew about the Conclave\'s true practices before she defected.',
          tooltip: 'Question your companion\'s loyalty',
          consequences: [
            { type: 'set_flag', flagId: 'ch4_confronted_elara', value: true },
            { type: 'faction_change', factionId: 'ashenConclave', value: -5 },
          ],
          targetScene: 'ch4_elaraConfession',
        },
      ],
    },

    // ─── Scene 2d: Guild Intelligence ─────────────────────────────
    {
      id: 'ch4_guildIntelligence',
      chapter: 4,
      title: 'The Price of Knowing',
      location: 'The Gilded Rat - Obsidian Guild Safehouse',
      artPrompt:
        'A lavish underground tavern with velvet curtains and candlelight, a well-dressed merchant prince sitting across from an armored knight, gold coins and secret documents on the table, oil painting style, dark intrigue',
      description: [
        'The Gilded Rat exists in the basement of a respectable-looking tailor\'s shop in Ashenmere. Its entrance is hidden behind a rack of mourning clothes — Sylas Ashford\'s idea of humor. The room below is all velvet and candlelight, improbably luxurious for a space with no windows.',
        'Sylas sits behind a desk carved from a single piece of obsidian, sipping wine from a goblet that probably cost more than a soldier\'s yearly wage. Nyx materializes from the shadows behind him, silent as a held breath.',
        'The merchant prince does not deal in charity. Every piece of information has a price, and Sylas is a man who always collects.',
      ],
      dialogue: [
        {
          speaker: 'sylas_ashford',
          text: 'Aldric Vane. The disgraced knight who keeps turning up at the center of every storm. You are either very lucky or very dangerous. I find myself hoping for the latter — lucky men are unpredictable.',
          mood: 'neutral',
        },
        {
          speaker: 'nyx',
          text: 'He was followed. Two Conclave watchers, posted at the north and east approaches. I dealt with the eastern one. The northern one... ran.',
          mood: 'neutral',
        },
        {
          speaker: 'sylas_ashford',
          text: 'How inconvenient. Well, since your visit is now known to interested parties, we may as well make it worthwhile. What do you want, Vane? And more importantly — what are you willing to pay?',
          mood: 'sinister',
        },
      ],
      choices: [
        {
          id: 'ch4_pay_gold',
          text: 'Offer gold — you have coin enough for information, if the information is worth it.',
          tooltip: 'A straightforward transaction',
          consequences: [
            { type: 'faction_change', factionId: 'obsidianGuild', value: 5 },
            { type: 'add_item', itemId: 'guild_intelligence_dossier' },
            { type: 'set_flag', flagId: 'ch4_bought_guild_intel', value: true },
          ],
          targetScene: 'ch4_guildRevelation',
        },
        {
          id: 'ch4_offer_service',
          text: 'Offer a future favor — the Guild trades in debts, and a knight with connections to multiple factions is a valuable asset.',
          tooltip: 'Indebt yourself to the Guild',
          consequences: [
            { type: 'faction_change', factionId: 'obsidianGuild', value: 15 },
            { type: 'set_flag', flagId: 'ch4_owes_guild_favor', value: true },
            { type: 'add_item', itemId: 'guild_intelligence_dossier' },
          ],
          targetScene: 'ch4_guildRevelation',
        },
        {
          id: 'ch4_trade_info',
          text: 'Trade information for information — share what you know about the Conclave\'s ritual magic in exchange for Guild intelligence.',
          tooltip: 'Knowledge for knowledge',
          conditions: [
            { type: 'flag_set', flagId: 'ch4_investigated_attacks', operator: 'true' },
          ],
          consequences: [
            { type: 'faction_change', factionId: 'obsidianGuild', value: 10 },
            { type: 'faction_change', factionId: 'ashenConclave', value: -5 },
            { type: 'add_item', itemId: 'guild_intelligence_dossier' },
            { type: 'set_flag', flagId: 'ch4_intel_exchange', value: true },
          ],
          targetScene: 'ch4_guildRevelation',
        },
      ],
    },

    // ─── Scene: Guild Revelation ──────────────────────────────────
    {
      id: 'ch4_guildRevelation',
      chapter: 4,
      title: 'What the Guild Knows',
      location: 'The Gilded Rat - Obsidian Guild Safehouse',
      artPrompt:
        'Close-up of a conspiracy board with connected threads, maps, portraits, and arcane symbols pinned to a wall, candlelight, oil painting style',
      description: [
        'Sylas produces a leather folio thick with documents and spreads its contents across the obsidian desk. Maps, letters, shipping manifests, reports from agents embedded in every faction. The scope of the Guild\'s intelligence network is staggering — and terrifying.',
        'Nyx pins a map to the wall and begins connecting locations with red thread. The pattern that emerges makes Aldric\'s stomach drop.',
      ],
      dialogue: [
        {
          speaker: 'sylas_ashford',
          text: 'Six villages burned in the last month. Each one along a ley line — those invisible rivers of magical energy the Conclave pretends do not exist. Each burning at a precise astronomical conjunction. And each one funneling energy toward a single point.',
          mood: 'sinister',
        },
        {
          speaker: 'nyx',
          text: 'The Sanctum of Echoes. Malachar\'s personal fortress. We have agents who got within a mile of it. None came back. The ones who did... were not themselves anymore.',
          mood: 'fearful',
        },
        {
          speaker: 'sylas_ashford',
          text: 'The assassination was not politics, Vane. It was a ritual component. A king\'s blood, spilled at the right time, in the right place. Malachar is building something. Or summoning something. And every faction\'s war is feeding it.',
          mood: 'sinister',
        },
      ],
      choices: [
        {
          id: 'ch4_rally_factions',
          text: 'This changes everything. Take this intelligence to the war council and try to unite the factions against the Conclave.',
          consequences: [
            { type: 'set_flag', flagId: 'ch4_has_guild_intel', value: true },
            { type: 'faction_change', factionId: 'obsidianGuild', value: 5 },
          ],
          targetScene: 'ch4_bridgeBattle',
        },
        {
          id: 'ch4_strike_sanctum',
          text: 'Propose a covert strike on the Sanctum of Echoes — a small team might succeed where armies would be detected.',
          consequences: [
            { type: 'set_flag', flagId: 'ch4_plans_sanctum_raid', value: true },
            { type: 'faction_change', factionId: 'obsidianGuild', value: 10 },
          ],
          targetScene: 'ch4_bridgeBattle',
        },
      ],
    },

    // ─── Scene: Elara's Confession ────────────────────────────────
    {
      id: 'ch4_elaraConfession',
      chapter: 4,
      title: 'The Weight of Silence',
      location: 'Millhaven - Burned Ruins',
      artPrompt:
        'A woman in tattered mystic robes kneeling in ashes, tears on her face, a knight standing over her with conflicted expression, burned village ruins, oil painting style, emotional chiaroscuro',
      description: [
        'Elara does not flinch from the accusation. She stands amid the ashes of Millhaven and lets the question hang between them like smoke. When she finally speaks, her voice is stripped of its usual careful composure.',
      ],
      dialogue: [
        {
          speaker: 'elara_dawnwhisper',
          text: 'I knew. Not the specifics — not the villages, not the children. But I knew the Harrowing was more than theory. I saw the preparations. The star charts. The acquisition of binding components. I told myself they were academic exercises. I told myself that because the alternative was unbearable.',
          mood: 'desperate',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'I defected because I found a list of target sites in Malachar\'s study. Twelve villages. Twelve harrowings. Twelve convergences to fuel what he calls the Unraveling. I took the list and I ran. But I was too late for the first six.',
          mood: 'sad',
        },
        {
          speaker: 'narrator',
          text: 'She produces a folded parchment from inside her robes — old, creased from being clutched too tightly, too often. A list of twelve villages. Six are crossed out in red ink. Millhaven is among them.',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'If you cannot trust me after this, I understand. But those six remaining villages still stand. Their people still breathe. That is why I stay. Not for absolution. For them.',
          mood: 'hopeful',
        },
      ],
      choices: [
        {
          id: 'ch4_forgive_elara',
          text: 'Take the list and tell Elara that guilt means nothing — only what she does next matters.',
          tooltip: 'Forgive and move forward',
          consequences: [
            { type: 'add_item', itemId: 'harrowing_target_list' },
            { type: 'set_flag', flagId: 'ch4_forgave_elara', value: true },
            { type: 'add_companion', companionId: 'elara_dawnwhisper' },
            { type: 'stat_change', stat: 'charisma', value: 1 },
          ],
          targetScene: 'ch4_bridgeBattle',
        },
        {
          id: 'ch4_conditional_trust',
          text: 'Accept the list but make clear that trust must be rebuilt — she will prove herself through action.',
          tooltip: 'Cautious acceptance',
          consequences: [
            { type: 'add_item', itemId: 'harrowing_target_list' },
            { type: 'set_flag', flagId: 'ch4_conditional_elara', value: true },
          ],
          targetScene: 'ch4_bridgeBattle',
        },
        {
          id: 'ch4_reject_elara',
          text: 'Turn away. She knew, and she let it happen. Some sins cannot be balanced.',
          tooltip: 'Reject Elara\'s companionship',
          consequences: [
            { type: 'add_item', itemId: 'harrowing_target_list' },
            { type: 'set_flag', flagId: 'ch4_rejected_elara', value: true },
            { type: 'stat_change', stat: 'strength', value: 1 },
          ],
          targetScene: 'ch4_bridgeBattle',
        },
      ],
    },

    // ─── Scene: Pact Alliance ─────────────────────────────────────
    {
      id: 'ch4_pactAlliance',
      chapter: 4,
      title: 'The Green Banner',
      location: 'The Thornwood - Sacred Grove',
      artPrompt:
        'A torchlit druid council with warriors and healers, a knight being offered a green sash by a rebel leader, ancient forest clearing, oil painting style',
      description: [
        'The Verdant Pact\'s leadership listens in grim silence as the weight of the conspiracy settles over the grove. Rangers who moments ago had arrows nocked at Aldric now lower their bows. The enemy has shifted.',
        'Rowan paces the firelit circle, his jaw tight with the particular fury of a man who realizes he has been dancing on someone else\'s strings.',
      ],
      dialogue: [
        {
          speaker: 'rowan_greenmantle',
          text: 'So while we bleed fighting the Throne, Malachar sits in his sanctum and counts our dead like a miser counts coins. Every soldier who falls on either side feeds his ritual. We are not warriors — we are livestock.',
          mood: 'angry',
        },
        {
          speaker: 'brother_cedric',
          text: 'Then we must stop fighting. Both sides. If the war itself is the weapon, the only defense is peace.',
          mood: 'hopeful',
        },
        {
          speaker: 'rowan_greenmantle',
          text: 'Peace with the Iron Throne? Cedric, they burned the Thornwood. They salted the fields of Greenhollow. You ask me to embrace the hand that holds the torch.',
          mood: 'angry',
        },
        {
          speaker: 'rowan_greenmantle',
          text: 'But perhaps... a temporary ceasefire. Not peace. Not forgiveness. A shared enemy. Vane, if I send you back to Queen Isolde with our terms, will she listen?',
          mood: 'neutral',
        },
      ],
      choices: [
        {
          id: 'ch4_promise_ceasefire',
          text: 'Promise to broker a ceasefire — ride to the Ashenmere Crossing under a green banner and make Isolde hear the truth.',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 15 },
            { type: 'set_flag', flagId: 'ch4_carries_pact_terms', value: true },
            { type: 'add_item', itemId: 'verdant_pact_treaty' },
          ],
          targetScene: 'ch4_bridgeBattle',
        },
        {
          id: 'ch4_join_pact_assault',
          text: 'Offer to join the Verdant Pact\'s defense at the crossing — fight alongside them when the Throne arrives.',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 20 },
            { type: 'faction_change', factionId: 'ironThrone', value: -25 },
            { type: 'set_flag', flagId: 'ch4_fights_for_pact', value: true },
            { type: 'add_companion', companionId: 'rowan_greenmantle' },
          ],
          targetScene: 'ch4_bridgeBattle',
        },
      ],
    },

    // ─── Scene: Flanking Route ────────────────────────────────────
    {
      id: 'ch4_flanking',
      chapter: 4,
      title: 'The Hidden Ford',
      location: 'Ashenmere River - Upstream Ford',
      artPrompt:
        'Soldiers carefully fording a shallow river in morning mist, willow trees providing cover, a knight leading the way, oil painting style, atmospheric',
      description: [
        'The ford is barely worthy of the name — a stretch of river where the water runs shallow over a bed of flat stones, hidden by overhanging willows. Aldric leads a company of fifty handpicked soldiers across, the water never rising above their waists, while the main army makes a show of preparing to assault the bridge.',
        'If this works, the Verdant Pact defenders will find themselves flanked, the battle ended before it truly begins. If it fails, fifty soldiers will be caught in the open on the wrong side of a river with no retreat.',
        'Elara walks beside him, her staff creating small eddies in the current. Her lips move silently — a prayer or a spell, Aldric cannot tell the difference.',
      ],
      dialogue: [
        {
          speaker: 'elara_dawnwhisper',
          text: 'The Thornwood is alive in ways the Throne does not understand. The trees themselves may warn the Pact of our crossing. We must move quickly.',
          mood: 'fearful',
        },
        {
          speaker: 'narrator',
          text: 'The company crosses without incident, emerging on the far bank dripping and shivering but intact. Through the willow screen, Aldric can see the Verdant Pact\'s fortifications from behind — earthworks and sharpened stakes, all facing the wrong direction.',
        },
      ],
      choices: [
        {
          id: 'ch4_surprise_attack',
          text: 'Signal the main force and launch a coordinated assault — crush the Pact defenders between two armies.',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 15 },
            { type: 'faction_change', factionId: 'verdantPact', value: -20 },
            { type: 'set_flag', flagId: 'ch4_flanked_pact', value: true },
          ],
          targetScene: 'ch4_bridgeBattle',
        },
        {
          id: 'ch4_demand_surrender',
          text: 'Approach under flag of parley — show the Pact that they are surrounded and demand surrender to avoid bloodshed.',
          tooltip: 'Try to end this without a massacre',
          statCheck: {
            stat: 'charisma',
            difficulty: 8,
            successText: 'The Thornknight sees the flanking force and, after a tense silence, orders his fighters to lower their weapons.',
            failureText: 'The Thornknight snarls defiance and the battle erupts regardless.',
            successScene: 'ch4_bossFight',
            failureScene: 'ch4_bridgeBattle',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch4_offered_parley', value: true },
          ],
          targetScene: 'ch4_bossFight',
        },
      ],
    },

    // ─── Scene: Bridge Battle (Boss Fight) ────────────────────────
    {
      id: 'ch4_bridgeBattle',
      chapter: 4,
      title: 'The Battle of Ashenmere Crossing',
      location: 'Ashenmere Crossing - The Stone Bridge',
      artPrompt:
        'An epic battle on a massive stone bridge over a gorge, armored knights clashing with druid warriors and vine-covered sentinels, arrows and magic filling the air, dramatic storm lighting, oil painting style, dark fantasy',
      description: [
        'The Battle of Ashenmere Crossing begins not with a charge but with a scream — a Verdant Pact war horn that sounds like a wounded stag, echoing off the gorge walls until it seems to come from everywhere at once. Then the arrows fall.',
        'The bridge is thirty feet wide and two hundred long, its ancient stones slick with spray from the river below. It becomes a killing ground. Iron Throne heavy infantry pushes forward in shield walls while Pact rangers rain arrows from fortified positions on the far bank. The dead pile up at the chokepoint.',
        'And then, through the chaos, a figure emerges on the bridge. Massive. Clad in armor of living thornwood, vines coiling and tightening across plates of bark-hardened wood. The Thornknight — the Verdant Pact\'s champion — strides through the melee like a force of nature, sending Iron Throne soldiers sprawling with each sweep of a greatsword wrapped in briars.',
      ],
      dialogue: [
        {
          speaker: 'captain_thorne',
          text: 'That thing is holding the bridge alone! Our line will break if someone does not bring it down. Vane — you wanted to prove yourself. Here is your chance.',
          mood: 'desperate',
        },
        {
          speaker: 'narrator',
          text: 'The Thornknight turns toward Aldric. Through the slits in its living helm, eyes burn with green fire. When it speaks, its voice is the groan of old wood bending in a storm.',
        },
        {
          speaker: 'narrator',
          text: '"You serve those who burn forests and salt the earth. Come then, Iron Man. Let the land judge between us."',
        },
      ],
      combat: {
        type: 'boss',
        enemyName: 'The Thornknight',
        enemyDescription:
          'A towering champion clad in armor of living thornwood. Vines coil around plates of bark-hardened wood, and a greatsword wrapped in briars hums with druidic power. Where the Thornknight walks, roots crack through stone.',
        primaryStat: 'strength',
        difficulty: 9,
        secondaryStat: 'cunning',
        description:
          'The Thornknight advances across the corpse-strewn bridge, each step cracking the ancient stone. Thorned vines lash out like whips. Aldric must find a way past that living armor — through brute force, or by exploiting the gaps where bark meets vine.',
        victoryConsequences: [
          { type: 'stat_change', stat: 'strength', value: 2 },
          { type: 'faction_change', factionId: 'ironThrone', value: 15 },
          { type: 'set_flag', flagId: 'ch4_defeated_thornknight', value: true },
          { type: 'add_item', itemId: 'thornknight_greatsword' },
        ],
        victoryScene: 'ch4_aftermath',
        defeatConsequences: [
          { type: 'damage', value: 30 },
          { type: 'set_flag', flagId: 'ch4_lost_to_thornknight', value: true },
        ],
        defeatScene: 'ch4_aftermathDefeat',
      },
      choices: [
        {
          id: 'ch4_fight_thornknight',
          text: 'Draw your sword and face the Thornknight on the bridge.',
          tooltip: 'Boss fight — Strength check',
          consequences: [],
          targetScene: 'ch4_aftermath',
        },
        {
          id: 'ch4_use_fire',
          text: 'Call for oil and torches — that armor is wood, and wood burns.',
          tooltip: 'Exploit the Thornknight\'s weakness',
          conditions: [
            { type: 'stat_check', stat: 'cunning', operator: 'gte', value: 5 },
          ],
          consequences: [
            { type: 'set_flag', flagId: 'ch4_used_fire', value: true },
            { type: 'stat_change', stat: 'cunning', value: 1 },
            { type: 'faction_change', factionId: 'verdantPact', value: -10 },
          ],
          targetScene: 'ch4_aftermath',
        },
        {
          id: 'ch4_parley_bridge',
          text: 'Shout for a ceasefire — reveal what you know about the Conclave\'s manipulation.',
          tooltip: 'Try to stop the battle entirely',
          conditions: [
            { type: 'flag_set', flagId: 'ch4_has_harrowing_evidence', operator: 'true' },
          ],
          statCheck: {
            stat: 'charisma',
            difficulty: 9,
            successText: 'The Thornknight hesitates. The evidence is undeniable. Slowly, the living armor begins to retract.',
            failureText: 'The Thornknight roars that words are the weapons of liars, and attacks with renewed fury.',
            successScene: 'ch4_ceasefire',
            failureScene: 'ch4_aftermath',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch4_attempted_bridge_parley', value: true },
          ],
          targetScene: 'ch4_ceasefire',
        },
      ],
      variants: [
        {
          condition: { type: 'flag_set', flagId: 'ch4_carries_pact_terms', operator: 'true' },
          description: [
            'Aldric arrives at the bridge bearing a green banner — the Verdant Pact\'s sign of parley. But he is too late. The battle has already begun, and the green cloth in his hand makes him a target for both sides.',
            'The Thornknight spots the banner and pauses, confusion visible even through the living helm. A moment of hesitation that might save lives — or cost Aldric his.',
          ],
        },
        {
          condition: { type: 'flag_set', flagId: 'ch4_fights_for_pact', operator: 'true' },
          description: [
            'Aldric stands on the far side of the bridge, fighting beside the Verdant Pact. The irony is not lost on him — a disgraced knight of the Iron Throne, now raising his sword against the army he once served.',
            'The Thornknight nods to him with something like respect. The battle rages, but this time, the champion fights at Aldric\'s side rather than against him.',
          ],
          dialogue: [
            {
              speaker: 'rowan_greenmantle',
              text: 'Hold the line! If the bridge falls, the Thornwood falls with it. Vane — watch our left flank. Your old brothers-in-arms know your fighting style. Use it against them.',
              mood: 'desperate',
            },
          ],
        },
      ],
    },

    // ─── Scene: Boss Fight Solo ───────────────────────────────────
    {
      id: 'ch4_bossFight',
      chapter: 4,
      title: 'Champion\'s Duel',
      location: 'Ashenmere Crossing - Between the Lines',
      artPrompt:
        'A dramatic single combat between a knight and a massive thorn-armored warrior on a stone bridge, both armies watching from opposite sides, oil painting style, epic fantasy',
      description: [
        'The two armies stand in uneasy stillness on opposite banks as the Thornknight steps onto the bridge, alone. This will be settled the old way — a champion\'s duel. If Aldric wins, the Pact withdraws. If the Thornknight wins, the Iron Throne retreats.',
        'The bridge becomes an arena. Two hundred feet of ancient stone, a gorge below, and no room to maneuver. Just steel against thorn, will against will.',
      ],
      dialogue: [
        {
          speaker: 'narrator',
          text: 'The Thornknight plants its greatsword point-down in the stone and waits. When Aldric steps forward, it inclines its helmed head — not mockery, but the respect of one warrior acknowledging another.',
        },
      ],
      combat: {
        type: 'boss',
        enemyName: 'The Thornknight (Formal Duel)',
        enemyDescription:
          'In formal duel, the Thornknight fights with deliberate, measured strikes. Each blow is an expression of the Verdant Pact\'s grief and fury. The living armor pulses with green light.',
        primaryStat: 'strength',
        difficulty: 8,
        secondaryStat: 'cunning',
        description:
          'A duel of honor on the ancient bridge. The Thornknight fights with the weight of the Thornwood behind every swing. Aldric must find the rhythm in the storm of thorns and steel.',
        victoryConsequences: [
          { type: 'stat_change', stat: 'strength', value: 2 },
          { type: 'faction_change', factionId: 'ironThrone', value: 10 },
          { type: 'faction_change', factionId: 'verdantPact', value: 5 },
          { type: 'set_flag', flagId: 'ch4_won_duel', value: true },
          { type: 'add_item', itemId: 'thornknight_respect_token' },
        ],
        victoryScene: 'ch4_aftermath',
        defeatConsequences: [
          { type: 'damage', value: 25 },
          { type: 'faction_change', factionId: 'ironThrone', value: -10 },
          { type: 'set_flag', flagId: 'ch4_lost_duel', value: true },
        ],
        defeatScene: 'ch4_aftermathDefeat',
      },
      choices: [
        {
          id: 'ch4_accept_duel',
          text: 'Salute the Thornknight and begin the duel with honor.',
          consequences: [],
          targetScene: 'ch4_aftermath',
        },
      ],
    },

    // ─── Scene: Ceasefire ─────────────────────────────────────────
    {
      id: 'ch4_ceasefire',
      chapter: 4,
      title: 'The Uneasy Silence',
      location: 'Ashenmere Crossing - The Stone Bridge',
      artPrompt:
        'Two opposing armies lowering weapons on a stone bridge, their leaders meeting in the middle with tense expressions, oil painting style, tense atmosphere',
      description: [
        'The silence that follows is more deafening than the battle. Soldiers on both sides lower their weapons with the uncertain reluctance of men who have been told to stop killing but have not yet been told to stop hating.',
        'Queen Isolde strides onto the bridge, her black armor streaked with someone else\'s blood. The Thornknight stands opposite, its living helm slowly retracting to reveal a weathered face — a woman, old enough to be a grandmother, with eyes that have seen too many forests burn.',
      ],
      dialogue: [
        {
          speaker: 'queen_isolde',
          text: 'If this is a trick, Vane, I will hang you from this bridge by your own intestines. Speak. Show them what convinced you.',
          mood: 'angry',
        },
        {
          speaker: 'narrator',
          text: 'Aldric presents the evidence — the binding runes, the ley line pattern, the Conclave\'s Harrowing ritual. He lays it out on the ancient stone while two armies listen. The weight of the truth is almost physical.',
        },
        {
          speaker: 'narrator',
          text: 'The Thornknight examines the evidence with calloused hands. When she looks up, the green fire in her eyes has been replaced by something colder — the focused fury of a hunter who has finally identified her quarry.',
        },
      ],
      choices: [
        {
          id: 'ch4_propose_alliance',
          text: 'Propose a formal alliance against the Ashen Conclave — united, the factions might stand a chance.',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 5 },
            { type: 'faction_change', factionId: 'verdantPact', value: 15 },
            { type: 'faction_change', factionId: 'ashenConclave', value: -20 },
            { type: 'set_flag', flagId: 'ch4_brokered_alliance', value: true },
            { type: 'stat_change', stat: 'charisma', value: 2 },
          ],
          targetScene: 'ch4_aftermath',
        },
        {
          id: 'ch4_temporary_truce',
          text: 'Suggest only a temporary truce — enough time to investigate the Conclave before resuming the war.',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 5 },
            { type: 'faction_change', factionId: 'verdantPact', value: 5 },
            { type: 'set_flag', flagId: 'ch4_temporary_truce', value: true },
          ],
          targetScene: 'ch4_aftermath',
        },
      ],
    },

    // ─── Scene: Aftermath (Victory) ───────────────────────────────
    {
      id: 'ch4_aftermath',
      chapter: 4,
      title: 'After the Storm',
      location: 'Ashenmere Crossing - Camp',
      artPrompt:
        'A military camp at sunset with soldiers tending wounds, a knight sitting alone cleaning his sword, the stone bridge visible in the background with bodies being cleared, oil painting style, somber',
      description: [
        'Night falls on Ashenmere like a shroud. Campfires dot both banks of the river — some triumphant, some mourning, most simply exhausted. The bridge is stained dark, and soldiers work by torchlight to clear the dead before the crows come.',
        'Aldric sits apart from the fires, cleaning blood from his blade with mechanical precision. The Thornknight\'s challenge still echoes in his mind. Whatever the outcome of today, the larger war — the one Malachar is orchestrating from the shadows — has only just begun.',
        'Elara finds him as the moon rises, carrying two cups of something warm that might generously be called tea.',
      ],
      dialogue: [
        {
          speaker: 'elara_dawnwhisper',
          text: 'You fought well today. Or you spoke well. Or you simply survived. In Valdoria, those are becoming the same thing.',
          mood: 'sad',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'Aldric — the Sanctum of Echoes. That is where this ends. Malachar is performing the Unraveling, and he needs only six more harrowings to complete it. When he does, the veil between the world and the Ashenwild — the realm of dead prophecies — will dissolve. He means to become an oracle-god. To see and control all possible futures.',
          mood: 'fearful',
        },
        {
          speaker: 'narrator',
          text: 'The campfire crackles. Somewhere in the dark, a soldier sings a hymn for the dead. The melody is old — older than Valdoria, older than the kingdoms that came before. It speaks of a world that was, and the one that might yet be.',
        },
      ],
      choices: [
        {
          id: 'ch4_rest_and_plan',
          text: 'Rest tonight and plan the next move at dawn. The conspiracy can wait until you have the strength to face it.',
          consequences: [
            { type: 'heal', value: 15 },
            { type: 'set_flag', flagId: 'ch4_rested', value: true },
          ],
          targetScene: 'ch5_conclaveSummons',
        },
        {
          id: 'ch4_ride_tonight',
          text: 'There is no time to rest. Ride through the night toward the Conclave\'s territory — every hour of delay is another village at risk.',
          consequences: [
            { type: 'stat_change', stat: 'cunning', value: 1 },
            { type: 'damage', value: 5 },
            { type: 'set_flag', flagId: 'ch4_rode_nightfall', value: true },
          ],
          targetScene: 'ch5_conclaveSummons',
        },
        {
          id: 'ch4_send_ravens',
          text: 'Send ravens to every faction with the evidence. If Malachar is to be stopped, the realm must know the truth.',
          consequences: [
            { type: 'set_flag', flagId: 'ch4_sent_ravens', value: true },
            { type: 'faction_change', factionId: 'ashenConclave', value: -15 },
            { type: 'faction_change', factionId: 'ironThrone', value: 5 },
            { type: 'faction_change', factionId: 'verdantPact', value: 5 },
            { type: 'faction_change', factionId: 'obsidianGuild', value: 5 },
          ],
          targetScene: 'ch5_conclaveSummons',
        },
      ],
    },

    // ─── Scene: Aftermath (Defeat) ────────────────────────────────
    {
      id: 'ch4_aftermathDefeat',
      chapter: 4,
      title: 'Broken Steel',
      location: 'Ashenmere Crossing - Field Hospital',
      artPrompt:
        'A wounded knight lying on a cot in a candlelit field hospital, healers tending wounds, dark and somber atmosphere, oil painting style',
      description: [
        'Aldric wakes to the taste of blood and the smell of poultices. Brother Cedric\'s gentle hands are binding the wound across his ribs — deeper than he realized in the heat of the fight. The Thornknight\'s blade found gaps in his armor that he did not know existed.',
        'The field hospital is a canvas cathedral of groaning men and quiet weeping. Cedric moves between the wounded with the tireless efficiency of a man who has done this too many times before.',
      ],
      dialogue: [
        {
          speaker: 'brother_cedric',
          text: 'You will live, though you will wish you had not for the next several days. The Thornknight spared your life — she could have taken your head but struck to wound instead. Even in war, the Pact remembers mercy. Perhaps the Throne should learn from that.',
          mood: 'sad',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'The battle is over. The Pact holds the crossing. Queen Isolde is... furious is not a strong enough word. She is looking for someone to blame, and your name is on her lips, Aldric.',
          mood: 'fearful',
        },
      ],
      choices: [
        {
          id: 'ch4_face_queen',
          text: 'Face Queen Isolde\'s wrath directly — take responsibility for the defeat.',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: -10 },
            { type: 'stat_change', stat: 'charisma', value: 1 },
            { type: 'set_flag', flagId: 'ch4_faced_queen_wrath', value: true },
          ],
          targetScene: 'ch5_conclaveSummons',
        },
        {
          id: 'ch4_flee_camp',
          text: 'Slip away before Isolde\'s judgment falls — head toward the Conclave\'s territory alone.',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: -20 },
            { type: 'set_flag', flagId: 'ch4_fled_camp', value: true },
          ],
          targetScene: 'ch5_conclaveSummons',
        },
        {
          id: 'ch4_redirect_blame',
          text: 'Redirect Isolde\'s fury toward the true enemy — present whatever evidence you have of the Conclave\'s manipulation.',
          tooltip: 'Requires evidence from investigation',
          conditions: [
            { type: 'has_item', itemId: 'millhaven_evidence', operator: 'true' },
          ],
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 5 },
            { type: 'faction_change', factionId: 'ashenConclave', value: -10 },
            { type: 'set_flag', flagId: 'ch4_redirected_blame', value: true },
          ],
          targetScene: 'ch5_conclaveSummons',
        },
      ],
    },
  ],
};
