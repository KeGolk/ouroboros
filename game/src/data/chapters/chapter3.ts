import type { Chapter } from '../story-types';

export const chapter3: Chapter = {
  number: 3,
  title: 'The Price of Loyalty',
  subtitle: 'Alliances are forged in the fires of desperation',
  openingNarration:
    'A week has passed since the king\'s murder, and Valdoria is unraveling. ' +
    'The Iron Throne mobilizes its armies under Queen Isolde\'s iron hand. The Ashen Conclave ' +
    'has sealed its borders and gone silent — a silence that frightens the wise more than any ' +
    'declaration of war. The Verdant Pact arms its farmers and fortifies its villages. And the ' +
    'Obsidian Guild, as always, profits from the chaos while whispering secrets to whoever will pay. ' +
    'You stand at the center of a storm that will reshape the realm. The Ouroboros conspiracy ' +
    'is real, it is vast, and it is moving toward a goal that no single faction can stop alone. ' +
    'The time has come to choose your ground — and to discover what loyalty truly costs.',
  artPrompt:
    'Medieval war council table with four faction banners — iron crown, ashen eye, green oak, ' +
    'and obsidian coin — a knight standing before them deciding, dramatic lighting from a fireplace, ' +
    'dark fantasy political scene',
  entryScene: 'ch3_throne_approach',
  scenes: [
    // ── Scene 1: Iron Throne Approach ─────────────────────────────────
    {
      id: 'ch3_throne_approach',
      chapter: 3,
      title: 'The Queen\'s Gambit',
      location: 'Valdoria Capital — Queen\'s War Room',
      artPrompt:
        'Medieval war room with a large map table, queen in black armor pointing at positions, ' +
        'generals and advisors, candles and war banners, tension and power, dark fantasy',
      description: [
        'Queen Isolde Blackthorn has transformed the castle\'s great hall into a war room. The ' +
        'feasting tables are gone, replaced by an enormous map of Valdoria painted on stretched ' +
        'hide, with wooden markers representing troop positions. The markers around the Conclave\'s ' +
        'borders are dense — three regiments, siege engines, and cavalry. She is not preparing ' +
        'for a skirmish. She is preparing for annihilation.',
        'The Queen herself wears a breastplate of blackened steel over her mourning dress — a ' +
        'statement of intent that needs no words. When you enter, escorted by Captain Thorne, ' +
        'she does not look up from the map. She makes you wait. It is, you realize, the first ' +
        'move in a negotiation.',
      ],
      dialogue: [
        {
          speaker: 'queen_isolde',
          text: 'The fugitive returns. Either you have something worth hearing, or you have a death wish. Given your history, I am prepared for either.',
          mood: 'neutral',
        },
        {
          speaker: 'aldric_vane',
          text: 'Your Grace, the Conclave may not be responsible for the king\'s death. There is a conspiracy — the Ouroboros — operating within every faction. The assassination was designed to start a war that would weaken all of Valdoria.',
        },
        {
          speaker: 'queen_isolde',
          text: 'A conspiracy within every faction. How convenient — and how unprovable. I deal in certainties, Vane. The poison was Conclave. The motive was Conclave. The evidence points to the Conclave.',
          mood: 'angry',
        },
        {
          speaker: 'captain_thorne',
          text: 'Your Grace, if I may — the guard reassignment orders I discovered support Vane\'s claims. Someone inside the castle—',
          mood: 'neutral',
        },
        {
          speaker: 'queen_isolde',
          text: 'Inside the castle. Yes. Which is why I need allies I can verify and enemies I can see. The Conclave is a visible enemy. This "Ouroboros" is a shadow.',
          mood: 'angry',
        },
        {
          speaker: 'narrator',
          text: 'The Queen finally looks up from her map. Her eyes are the color of winter iron — cold, sharp, and utterly devoid of sentimentality.',
        },
        {
          speaker: 'queen_isolde',
          text: 'I will make you one offer, Vane. Serve the Iron Throne. Bring me proof of this conspiracy — names, documents, the conspirators themselves. In return, I will restore your knighthood, grant you lands, and delay my march on the Conclave. Refuse, and you remain a fugitive in my kingdom. Choose.',
          mood: 'sinister',
        },
      ],
      choices: [
        {
          id: 'ch3_c1_swear_throne',
          text: 'Kneel and swear allegiance to the Iron Throne',
          tooltip: 'Full commitment to the Queen — power and obligation in equal measure',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 25 },
            { type: 'faction_change', factionId: 'verdantPact', value: -10 },
            { type: 'set_flag', flagId: 'sworn_to_throne', value: true },
            { type: 'add_item', itemId: 'throne_commission' },
          ],
          targetScene: 'ch3_throne_mission',
        },
        {
          id: 'ch3_c1_conditional',
          text: 'Accept conditionally — you serve the truth, not the throne',
          tooltip: 'Requires Charisma — negotiate terms with a queen',
          statCheck: {
            stat: 'charisma',
            difficulty: 6,
            successText:
              'Isolde\'s lip curls — not quite a smile, not quite a sneer. "Independent operators are unreliable. But they are also deniable. Very well, Vane. You work for the truth. But the truth works for me."',
            failureText:
              '"Conditional loyalty is no loyalty at all. But I am pragmatic enough to use a blunt instrument when a sharp one is unavailable. Go. Prove yourself useful."',
            successScene: 'ch3_throne_mission',
            failureScene: 'ch3_throne_mission',
          },
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 15 },
            { type: 'set_flag', flagId: 'throne_independent', value: true },
          ],
          targetScene: 'ch3_throne_mission',
        },
        {
          id: 'ch3_c1_refuse_throne',
          text: 'Refuse — the Queen\'s war will play into the conspiracy\'s hands',
          tooltip: 'Walk away from the most powerful faction',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: -20 },
            { type: 'set_flag', flagId: 'refused_throne', value: true },
          ],
          targetScene: 'ch3_crossroads_decision',
        },
        {
          id: 'ch3_c1_warn_war',
          text: 'Warn Isolde that the war is exactly what the Ouroboros wants',
          tooltip: 'Requires Lore — present evidence of the conspiracy\'s strategy',
          conditions: [
            { type: 'flag_set', flagId: 'knows_ouroboros', operator: 'true' },
          ],
          statCheck: {
            stat: 'lore',
            difficulty: 6,
            successText:
              'You lay out the evidence — the couriers, the hidden messages, the cell structure. Isolde listens in silence. For the first time, doubt crosses her face. "If what you say is true... then I am being maneuvered."',
            failureText:
              'Your arguments are passionate but disorganized. Isolde waves them away. "Theories and speculation. Bring me facts, Vane, or bring me nothing."',
            successScene: 'ch3_throne_mission',
            failureScene: 'ch3_throne_mission',
          },
          consequences: [
            { type: 'set_flag', flagId: 'warned_queen_ouroboros', value: true },
            { type: 'faction_change', factionId: 'ironThrone', value: 10 },
          ],
          targetScene: 'ch3_throne_mission',
        },
      ],
    },

    // ── Scene 2: Conclave Approach ────────────────────────────────────
    {
      id: 'ch3_conclave_approach',
      chapter: 3,
      title: 'The Seer\'s Bargain',
      location: 'The Ashen Spire — Observatory',
      artPrompt:
        'Astronomical observatory at top of a dark tower, ancient mystic gazing at stars through ' +
        'arcane instruments, glowing star charts on walls, a knight standing at the threshold, ' +
        'purple and silver light, dark fantasy',
      description: [
        'Malachar receives you in the Observatory — the highest chamber of the Ashen Spire, ' +
        'where the ceiling is open to the sky and enormous brass instruments track the movements ' +
        'of stars that no mundane telescope can see. The air here tastes of ozone and old magic, ' +
        'and the constellations above seem to shift when you are not looking directly at them.',
        'The High Seer stands at a workbench covered in crystalline apparatus, his blind eyes ' +
        'fixed on something visible only to his inner sight. Around him, lesser Seers move in ' +
        'silence, their faces hidden behind veils of ash-gray silk.',
      ],
      dialogue: [
        {
          speaker: 'high_seer_malachar',
          text: 'The stars have been wrong for seventeen days. Since the night of the murder, the constellation of the Serpent has risen three degrees off its predicted path. This has not happened in six hundred years.',
          mood: 'fearful',
        },
        {
          speaker: 'aldric_vane',
          text: 'I did not come here for astronomy, Malachar.',
        },
        {
          speaker: 'high_seer_malachar',
          text: 'No. You came because you are frightened, and frightened men seek knowledge as a weapon. But the stars are not irrelevant, knight. The last time the Serpent shifted, the Pale Sepulcher was opened, and something was sealed inside it that should never have existed.',
          mood: 'sinister',
        },
        {
          speaker: 'high_seer_malachar',
          text: 'The Ouroboros does not merely want power. They want to open the Sepulcher again. And the artifact within — the Coil of Endings — is not a weapon. It is a key. A key to unmake the very foundations of the realm.',
          mood: 'fearful',
        },
        {
          speaker: 'narrator',
          text: 'For the first time, you hear genuine fear in the ancient mystic\'s voice. Whatever lies in the Pale Sepulcher, even Malachar — who has lived through the rise and fall of dynasties — is afraid of it.',
        },
        {
          speaker: 'high_seer_malachar',
          text: 'I need a champion, Vane. Someone who can reach the Sepulcher before the Ouroboros does. The Conclave cannot move openly — the Queen\'s armies are at our borders, and any military action will be interpreted as aggression. But a single knight, moving in secret...',
          mood: 'desperate',
        },
      ],
      choices: [
        {
          id: 'ch3_c2_champion_conclave',
          text: 'Accept — become the Conclave\'s champion',
          tooltip: 'Align with ancient knowledge at the cost of political trust',
          consequences: [
            { type: 'faction_change', factionId: 'ashenConclave', value: 25 },
            { type: 'faction_change', factionId: 'ironThrone', value: -10 },
            { type: 'set_flag', flagId: 'conclave_champion', value: true },
            { type: 'add_item', itemId: 'conclave_ward_stone' },
            { type: 'set_flag', flagId: 'knows_coil_of_endings', value: true },
          ],
          targetScene: 'ch3_conclave_preparation',
        },
        {
          id: 'ch3_c2_demand_knowledge',
          text: 'Agree, but demand access to the Conclave\'s full archives',
          tooltip: 'Requires Lore — negotiate for maximum knowledge',
          statCheck: {
            stat: 'lore',
            difficulty: 7,
            successText:
              'Malachar\'s blind eyes narrow. "You understand the value of what you ask. Few outsiders have entered the Deep Archives and emerged... unchanged. But very well. Knowledge for service."',
            failureText:
              '"The archives are not a library for curious knights. You will receive what you need for the mission, no more."',
            successScene: 'ch3_conclave_preparation',
            failureScene: 'ch3_conclave_preparation',
          },
          consequences: [
            { type: 'faction_change', factionId: 'ashenConclave', value: 20 },
            { type: 'set_flag', flagId: 'conclave_archive_access', value: true },
            { type: 'stat_change', stat: 'lore', value: 2 },
            { type: 'set_flag', flagId: 'knows_coil_of_endings', value: true },
          ],
          targetScene: 'ch3_conclave_preparation',
        },
        {
          id: 'ch3_c2_refuse_conclave',
          text: 'Refuse — you won\'t be a pawn of mystics',
          consequences: [
            { type: 'faction_change', factionId: 'ashenConclave', value: -15 },
            { type: 'set_flag', flagId: 'refused_conclave', value: true },
          ],
          targetScene: 'ch3_crossroads_decision',
        },
      ],
    },

    // ── Scene 3: Verdant Pact Approach ────────────────────────────────
    {
      id: 'ch3_pact_approach',
      chapter: 3,
      title: 'The People\'s Champion',
      location: 'The Verdant Marches — Greenhollow Council',
      artPrompt:
        'Outdoor council meeting under an enormous ancient oak tree, rebel leader addressing ' +
        'a crowd of armed farmers, a healer standing to the side, banners of green and brown, ' +
        'passionate atmosphere, dark fantasy',
      description: [
        'Greenhollow is no longer a hidden camp — it is a fortress. In the week since the king\'s ' +
        'death, Rowan Greenmantle has transformed the settlement into the Pact\'s seat of power. ' +
        'Earthwork walls ring the valley, and the ancient oaks have been reinforced with ' +
        'sharpened stakes. Scouts patrol the perimeter in shifts, and every villager carries a weapon.',
        'The Council Oak stands at the camp\'s heart — a tree so old and vast that twenty people ' +
        'can sit in the shade of its lowest branches. Beneath it, Rowan has convened a war council. ' +
        'Two dozen leaders from across the Marches sit in a rough circle, their faces hardened by ' +
        'years of oppression and a week of escalating fear.',
      ],
      dialogue: [
        {
          speaker: 'rowan_greenmantle',
          text: 'The Queen has mobilized her armies. Three regiments march toward the Conclave, but their supply lines run through our territory. She expects us to lie down and let her boots trample our fields. Again.',
          mood: 'angry',
        },
        {
          speaker: 'brother_cedric',
          text: 'If we block her supply lines, she will consider it an act of war. We are not ready for war, Rowan.',
          mood: 'fearful',
        },
        {
          speaker: 'rowan_greenmantle',
          text: 'We are never ready. That is by design. The powerful stay powerful by ensuring the rest of us are always one step behind.',
          mood: 'angry',
        },
        {
          speaker: 'narrator',
          text: 'Rowan turns to you. In the firelight, his expression softens from defiance to something more complex — hope tempered by exhaustion.',
        },
        {
          speaker: 'rowan_greenmantle',
          text: 'You know the military, Vane. You know how the Crown thinks, how its armies move. And you know about this Ouroboros conspiracy. The Pact needs someone who can see the board from the other side. Will you stand with us?',
          mood: 'hopeful',
        },
        {
          speaker: 'rowan_greenmantle',
          text: 'I won\'t pretend we can offer gold or titles. What we offer is the only currency that matters — a cause worth fighting for. The freedom of every farmer, healer, and child in the Marches.',
          mood: 'hopeful',
        },
      ],
      choices: [
        {
          id: 'ch3_c3_join_pact',
          text: 'Stand with the Verdant Pact — fight for the common people',
          tooltip: 'Commit to the cause of freedom at the cost of political power',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 25 },
            { type: 'faction_change', factionId: 'ironThrone', value: -15 },
            { type: 'set_flag', flagId: 'joined_pact', value: true },
          ],
          targetScene: 'ch3_pact_strategy',
        },
        {
          id: 'ch3_c3_advise_only',
          text: 'Offer military advice but maintain your independence',
          tooltip: 'Help without full commitment',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 15 },
            { type: 'set_flag', flagId: 'pact_advisor', value: true },
          ],
          targetScene: 'ch3_pact_strategy',
        },
        {
          id: 'ch3_c3_warn_caution',
          text: 'Urge caution — the Ouroboros wants factions fighting each other',
          tooltip: 'Try to prevent the Pact from walking into a trap',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 10 },
            { type: 'set_flag', flagId: 'pact_warned_ouroboros', value: true },
          ],
          targetScene: 'ch3_pact_strategy',
        },
        {
          id: 'ch3_c3_refuse_pact',
          text: 'Decline — the Pact\'s fight is not your fight',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: -15 },
            { type: 'set_flag', flagId: 'refused_pact', value: true },
          ],
          targetScene: 'ch3_crossroads_decision',
        },
      ],
    },

    // ── Scene 4: Guild Approach ───────────────────────────────────────
    {
      id: 'ch3_guild_approach',
      chapter: 3,
      title: 'The Merchant Prince',
      location: 'Valdoria — The Obsidian Exchange',
      artPrompt:
        'Opulent underground merchant hall, a charismatic man in fine dark clothes seated on a throne ' +
        'of stacked ledgers and gold bars, bodyguards in shadow, exotic goods on shelves, ' +
        'wealth and menace, dark fantasy',
      description: [
        'The Obsidian Exchange exists in the space between legality and ambition. Officially, it is ' +
        'a trading house for rare commodities. Unofficially, it is the nerve center of the most ' +
        'powerful criminal organization in Valdoria — and its master has been expecting you.',
        'Sylas Ashford receives you in his private office, a room that manages to be simultaneously ' +
        'austere and obscenely expensive. Every surface is dark wood and polished brass, every object ' +
        'chosen to communicate a single message: this man understands the value of everything.',
        'He is younger than the legends suggest — late forties, with silver threading through dark hair ' +
        'and the relaxed posture of someone who has never once doubted his own superiority. His smile ' +
        'is warm, practiced, and absolutely calculating.',
      ],
      dialogue: [
        {
          speaker: 'sylas_ashford',
          text: 'Aldric Vane. At last. I\'ve been following your career with great interest — both the official version and the considerably more entertaining truth.',
          mood: 'neutral',
        },
        {
          speaker: 'aldric_vane',
          text: 'You know the truth about my disgrace?',
        },
        {
          speaker: 'sylas_ashford',
          text: 'I know that your dismissal from the Order was arranged by Lord Castellan Dravek, who owed a substantial debt to parties that preferred you removed from the king\'s protection. I know the charges were fabricated. And I know that the same parties later used Conclave poison to finish what your removal made possible.',
          mood: 'sinister',
        },
        {
          speaker: 'narrator',
          text: 'He lets that sink in, sipping wine from a crystal glass as if discussing commodity prices.',
        },
        {
          speaker: 'sylas_ashford',
          text: 'The Guild has been tracking the Ouroboros for two years. Not out of civic duty — we are, as you may have heard, morally flexible — but because a conspiracy that destabilizes Valdoria is bad for business. Chaos benefits no one except the fanatics who thrive in it.',
          mood: 'neutral',
        },
        {
          speaker: 'sylas_ashford',
          text: 'I am prepared to share everything the Guild knows. Names, accounts, safe houses, the location of the Pale Sepulcher, and the identity of the Ouroboros agent who stole the Nighthollow from the Conclave vaults. In return, I ask for one thing.',
          mood: 'sinister',
        },
        {
          speaker: 'aldric_vane',
          text: 'Name it.',
        },
        {
          speaker: 'sylas_ashford',
          text: 'When this is over — when the conspiracy is crushed and the factions are picking through the rubble — I want the Guild to have a seat at the table. Not in the shadows. At the table. Legitimacy, Vane. That is my price.',
          mood: 'neutral',
        },
      ],
      choices: [
        {
          id: 'ch3_c4_accept_guild',
          text: 'Accept Sylas\'s offer — the Guild\'s intelligence is too valuable to refuse',
          tooltip: 'Align with the Guild for maximum information at maximum moral cost',
          consequences: [
            { type: 'faction_change', factionId: 'obsidianGuild', value: 25 },
            { type: 'faction_change', factionId: 'ironThrone', value: -5 },
            { type: 'set_flag', flagId: 'guild_alliance', value: true },
            { type: 'add_item', itemId: 'guild_intelligence_dossier' },
            { type: 'set_flag', flagId: 'knows_dravek_betrayal', value: true },
          ],
          targetScene: 'ch3_guild_briefing',
        },
        {
          id: 'ch3_c4_negotiate_terms',
          text: 'Counter-offer — information now, legitimacy is not yours to promise',
          tooltip: 'Requires Cunning — negotiate with a master negotiator',
          statCheck: {
            stat: 'cunning',
            difficulty: 7,
            successText:
              'Sylas laughs — genuine amusement. "You\'re better at this than I expected from a knight. Very well — I\'ll front you the intelligence. Consider it an investment in your gratitude."',
            failureText:
              '"A charming attempt, but I did not build this empire by accepting IOUs from fugitives. My terms are firm. Take them or leave."',
            successScene: 'ch3_guild_briefing',
            failureScene: 'ch3_guild_briefing',
          },
          consequences: [
            { type: 'faction_change', factionId: 'obsidianGuild', value: 15 },
            { type: 'set_flag', flagId: 'guild_negotiated', value: true },
            { type: 'stat_change', stat: 'cunning', value: 1 },
          ],
          targetScene: 'ch3_guild_briefing',
        },
        {
          id: 'ch3_c4_refuse_guild',
          text: 'Refuse — legitimizing criminals is too high a price',
          consequences: [
            { type: 'faction_change', factionId: 'obsidianGuild', value: -15 },
            { type: 'set_flag', flagId: 'refused_guild', value: true },
          ],
          targetScene: 'ch3_crossroads_decision',
        },
      ],
    },

    // ── Scene 5: Throne Mission ───────────────────────────────────────
    {
      id: 'ch3_throne_mission',
      chapter: 3,
      title: 'The Crown\'s Blade',
      location: 'Valdoria Capital — Castle Armory',
      artPrompt:
        'Medieval armory with racks of weapons and armor, a knight being fitted with new equipment ' +
        'by an armorer, captain of the guard watching, banners of the Iron Throne, dark fantasy',
      description: [
        'The castle armory smells of oil, steel, and purpose. Thorne has outfitted you with ' +
        'equipment from the royal stores — not the finest, but serviceable, and bearing the mark ' +
        'of the Crown\'s smiths. For the first time since your disgrace, you carry weapons that ' +
        'were given rather than stolen.',
        'The Queen\'s orders are clear: infiltrate the Pale Sepulcher before the Ouroboros can ' +
        'retrieve whatever lies within. You have three days before Isolde\'s armies march on the ' +
        'Conclave regardless of what you find.',
      ],
      dialogue: [
        {
          speaker: 'captain_thorne',
          text: 'Three days, Vane. After that, the Queen moves, and nothing — not evidence, not reason, not the gods themselves — will stop her.',
          mood: 'desperate',
        },
        {
          speaker: 'captain_thorne',
          text: 'I\'ve arranged for a patrol to look the other way at the eastern gate at midnight. After that, you\'re on your own. The road to the Sepulcher passes through the Ashwood — Conclave territory. Be careful.',
          mood: 'neutral',
        },
        {
          speaker: 'aldric_vane',
          text: 'And if I find what the Ouroboros is after?',
        },
        {
          speaker: 'captain_thorne',
          text: 'Bring it back. Destroy it. Whatever you judge best. I trust your instincts, Vane. I always did.',
          mood: 'hopeful',
        },
      ],
      choices: [
        {
          id: 'ch3_c5_depart_alone',
          text: 'Depart alone under cover of darkness',
          consequences: [
            { type: 'set_flag', flagId: 'sepulcher_alone', value: true },
          ],
          targetScene: 'ch3_road_encounter',
        },
        {
          id: 'ch3_c5_recruit_companion',
          text: 'Ask Thorne to assign a soldier to accompany you',
          tooltip: 'Gain backup at the cost of stealth',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 5 },
            { type: 'set_flag', flagId: 'throne_escort', value: true },
          ],
          targetScene: 'ch3_road_encounter',
        },
        {
          id: 'ch3_c5_seek_elara',
          text: 'Find Elara first — her knowledge of the Conclave will be invaluable in the Ashwood',
          tooltip: 'Only available if Elara is your companion',
          conditions: [
            { type: 'companion_present', companionId: 'elara_dawnwhisper', operator: 'true' },
          ],
          consequences: [
            { type: 'set_flag', flagId: 'sepulcher_with_elara', value: true },
          ],
          targetScene: 'ch3_road_encounter',
        },
      ],
    },

    // ── Scene 6: Conclave Preparation ─────────────────────────────────
    {
      id: 'ch3_conclave_preparation',
      chapter: 3,
      title: 'The Ward and the Way',
      location: 'The Ashen Spire — Ritual Chamber',
      artPrompt:
        'Underground ritual chamber with glowing runes on the floor forming a protective circle, ' +
        'a seer performing a warding ritual on a knight, candles floating in mid-air, ' +
        'purple and blue arcane light, dark fantasy',
      description: [
        'The Conclave\'s ritual chamber is a dome of polished obsidian, its walls carved with ' +
        'protective runes that pulse with a soft violet light. Elara — whether your companion ' +
        'or a newly appointed guide — leads you through the preparation with a scholar\'s precision ' +
        'and a defector\'s nervousness.',
        'The ward stone Malachar gave you must be attuned to your essence before it can protect you ' +
        'from the Sepulcher\'s defenses. The process involves standing in a circle of burning herbs ' +
        'while Seers chant in a language that predates written history.',
      ],
      dialogue: [
        {
          speaker: 'elara_dawnwhisper',
          text: 'The Sepulcher\'s wards were designed to kill anything that enters without authorization. The Ouroboros has found a way to bypass them — we don\'t know how. This ward stone will protect you, but only once. After it activates, you have perhaps an hour before the Sepulcher\'s defenses overwhelm it.',
          mood: 'fearful',
        },
        {
          speaker: 'aldric_vane',
          text: 'An hour to find and secure an artifact that a conspiracy has spent years pursuing. Wonderful.',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'I never said this would be easy. I said it would be necessary.',
          mood: 'neutral',
        },
        {
          speaker: 'narrator',
          text: 'The ritual complete, the ward stone glows faintly warm against your chest. It pulses in rhythm with your heartbeat, a second heart of crystallized magic.',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'There is one more thing. I have identified the traitor within the Conclave — the one who stole the Nighthollow. It is Seer Vaelith, Malachar\'s own apprentice. She has been feeding information to the Ouroboros for months. I have not told Malachar. I am not sure he would believe me.',
          mood: 'desperate',
        },
      ],
      choices: [
        {
          id: 'ch3_c6_confront_vaelith',
          text: 'Confront Seer Vaelith before departing',
          tooltip: 'Risky — but could neutralize a threat',
          consequences: [
            { type: 'set_flag', flagId: 'confronted_vaelith', value: true },
            { type: 'faction_change', factionId: 'ashenConclave', value: 10 },
          ],
          targetScene: 'ch3_vaelith_confrontation',
        },
        {
          id: 'ch3_c6_tell_malachar',
          text: 'Report Vaelith to Malachar — let the High Seer handle his own house',
          consequences: [
            { type: 'set_flag', flagId: 'reported_vaelith', value: true },
            { type: 'faction_change', factionId: 'ashenConclave', value: 15 },
          ],
          targetScene: 'ch3_road_encounter',
        },
        {
          id: 'ch3_c6_ignore_vaelith',
          text: 'Focus on the mission — Vaelith can wait',
          consequences: [
            { type: 'set_flag', flagId: 'ignored_vaelith', value: true },
          ],
          targetScene: 'ch3_road_encounter',
        },
      ],
    },

    // ── Scene 7: Pact Strategy ────────────────────────────────────────
    {
      id: 'ch3_pact_strategy',
      chapter: 3,
      title: 'The Council of Thorns',
      location: 'The Verdant Marches — Council Oak',
      artPrompt:
        'War council under ancient oak tree, map spread on a wooden table, rebel leaders debating ' +
        'strategy, some pointing angrily, a healer shaking his head, torchlight and tension, ' +
        'dark fantasy',
      description: [
        'The debate beneath the Council Oak has been raging for hours. Rowan wants to block the ' +
        'Queen\'s supply lines — a bold move that would force a negotiation. Cedric argues for ' +
        'sending envoys. The other leaders are divided, their voices rising and falling like ' +
        'waves against a shore.',
        'You have been asked to speak. A hundred faces turn toward you — farmers, hunters, healers, ' +
        'and children old enough to understand that the adults are scared. What you say next could ' +
        'determine whether the Verdant Pact goes to war or seeks peace.',
      ],
      dialogue: [
        {
          speaker: 'rowan_greenmantle',
          text: 'You have fought in the Crown\'s wars. You know their tactics, their weaknesses. The people want to hear from someone who has stood on the other side of the shield wall.',
          mood: 'hopeful',
        },
        {
          speaker: 'brother_cedric',
          text: 'Speak truth, friend. Not what they want to hear, but what they need to hear.',
          mood: 'neutral',
        },
      ],
      choices: [
        {
          id: 'ch3_c7_strategy_guerrilla',
          text: 'Advise guerrilla tactics — hit supply lines, avoid direct battle',
          tooltip: 'Requires Cunning — plan an asymmetric campaign',
          statCheck: {
            stat: 'cunning',
            difficulty: 5,
            successText:
              'Your plan is detailed and ruthlessly practical. The council listens in rapt silence. Even Cedric nods reluctantly — it minimizes casualties while maximizing pressure.',
            failureText:
              'Your plan has gaps that Rowan politely fills. The council is swayed, but your authority is diminished.',
            successScene: 'ch3_road_encounter',
            failureScene: 'ch3_road_encounter',
          },
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 15 },
            { type: 'set_flag', flagId: 'pact_guerrilla', value: true },
            { type: 'stat_change', stat: 'cunning', value: 1 },
          ],
          targetScene: 'ch3_road_encounter',
        },
        {
          id: 'ch3_c7_strategy_diplomacy',
          text: 'Urge diplomacy — send envoys to the Queen with evidence of the conspiracy',
          tooltip: 'The peaceful path',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 10 },
            { type: 'faction_change', factionId: 'ironThrone', value: 5 },
            { type: 'set_flag', flagId: 'pact_diplomatic', value: true },
          ],
          targetScene: 'ch3_road_encounter',
        },
        {
          id: 'ch3_c7_strategy_alliance',
          text: 'Propose an alliance with the Conclave — present a united front against the Ouroboros',
          tooltip: 'Bold and unconventional',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 10 },
            { type: 'faction_change', factionId: 'ashenConclave', value: 10 },
            { type: 'set_flag', flagId: 'pact_conclave_alliance', value: true },
          ],
          targetScene: 'ch3_road_encounter',
        },
        {
          id: 'ch3_c7_inspire',
          text: 'Rally the people — give them courage to face whatever comes',
          tooltip: 'Requires Charisma — inspire a frightened community',
          statCheck: {
            stat: 'charisma',
            difficulty: 5,
            successText:
              'Your words cut through the fear like sunlight through cloud. You speak of justice, of standing together, of the world the Pact can build if it survives this storm. The crowd rises to its feet.',
            failureText:
              'Your speech is earnest but flat. The crowd appreciates the effort, if not the execution.',
            successScene: 'ch3_road_encounter',
            failureScene: 'ch3_road_encounter',
          },
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 20 },
            { type: 'set_flag', flagId: 'pact_inspired', value: true },
            { type: 'stat_change', stat: 'charisma', value: 1 },
          ],
          targetScene: 'ch3_road_encounter',
        },
      ],
    },

    // ── Scene 8: Guild Briefing ───────────────────────────────────────
    {
      id: 'ch3_guild_briefing',
      chapter: 3,
      title: 'The Ledger of Sins',
      location: 'Valdoria — The Obsidian Exchange',
      artPrompt:
        'Merchant prince spreading documents across a desk, maps with marked locations, ' +
        'a spy pinning photographs and sketches to a wall of connections, candlelight, ' +
        'conspiracy board aesthetic, dark fantasy noir',
      description: [
        'Sylas Ashford is thorough. Over the course of three hours, he lays out the Guild\'s ' +
        'intelligence on the Ouroboros with the precision of an accountant auditing a failing ' +
        'business. Names, dates, financial transactions, safe house locations — the Guild has ' +
        'been building this dossier for two years, and it is devastating.',
        'The conspiracy is larger than you imagined. Agents in every faction, including three ' +
        'members of the Queen\'s privy council, two Conclave Seers, and — most disturbingly — ' +
        'a senior figure in the Obsidian Guild itself, though Sylas claims that agent has been ' +
        '"neutralized."',
      ],
      dialogue: [
        {
          speaker: 'sylas_ashford',
          text: 'The Ouroboros has been planning this for at least a decade. The king\'s assassination was Phase Two. Phase One was the systematic removal of anyone who might have stopped it — military commanders, loyal advisors, inconvenient knights.',
          mood: 'neutral',
        },
        {
          speaker: 'narrator',
          text: 'He pauses meaningfully at "inconvenient knights," and the implication hits you like a fist.',
        },
        {
          speaker: 'sylas_ashford',
          text: 'Your disgrace was Phase One, Vane. You were too close to the king, too loyal, too competent. They needed you gone before they could move. Lord Castellan Dravek arranged your fall — and he is one of the Ouroboros\'s senior operatives.',
          mood: 'sinister',
        },
        {
          speaker: 'aldric_vane',
          text: 'Dravek. I served under him for six years. I trusted him.',
        },
        {
          speaker: 'sylas_ashford',
          text: 'Trust is the most expensive commodity in Valdoria. And Dravek has been spending it lavishly. He is currently at the Pale Sepulcher, overseeing the retrieval of the artifact. Phase Three begins when that artifact is in Ouroboros hands.',
          mood: 'sinister',
        },
        {
          speaker: 'sylas_ashford',
          text: 'I have arranged transport and provisions for the journey. Nyx will guide you to the Sepulcher. All I ask is that when you confront Dravek, you remember who gave you the means to do so.',
          mood: 'neutral',
        },
      ],
      choices: [
        {
          id: 'ch3_c8_accept_nyx',
          text: 'Accept Nyx as your guide and depart immediately',
          consequences: [
            { type: 'add_companion', companionId: 'nyx' },
            { type: 'faction_change', factionId: 'obsidianGuild', value: 10 },
            { type: 'set_flag', flagId: 'guild_escort', value: true },
            { type: 'set_flag', flagId: 'knows_dravek_betrayal', value: true },
          ],
          targetScene: 'ch3_road_encounter',
        },
        {
          id: 'ch3_c8_go_alone',
          text: 'Take the intelligence but go alone — you don\'t trust Guild handlers',
          consequences: [
            { type: 'set_flag', flagId: 'sepulcher_alone', value: true },
            { type: 'set_flag', flagId: 'knows_dravek_betrayal', value: true },
            { type: 'add_item', itemId: 'guild_intelligence_dossier' },
          ],
          targetScene: 'ch3_road_encounter',
        },
        {
          id: 'ch3_c8_confront_dravek_info',
          text: 'Demand everything the Guild knows about Dravek specifically',
          tooltip: 'Personal vendetta fuel',
          consequences: [
            { type: 'set_flag', flagId: 'full_dravek_dossier', value: true },
            { type: 'set_flag', flagId: 'knows_dravek_betrayal', value: true },
            { type: 'add_item', itemId: 'dravek_dossier' },
            { type: 'stat_change', stat: 'cunning', value: 1 },
          ],
          targetScene: 'ch3_road_encounter',
        },
      ],
    },

    // ── Scene 9: Vaelith Confrontation ────────────────────────────────
    {
      id: 'ch3_vaelith_confrontation',
      chapter: 3,
      title: 'The Traitor Unmasked',
      location: 'The Ashen Spire — Vaelith\'s Laboratory',
      artPrompt:
        'Confrontation in an alchemist laboratory, woman in Conclave robes cornered by a knight, ' +
        'bubbling potions and dark ingredients on shelves, shattered glass, purple lightning, ' +
        'dark fantasy action scene',
      description: [
        'Seer Vaelith\'s laboratory occupies a corner of the Spire that other Conclave members ' +
        'avoid — not from policy, but from instinct. The air here is wrong, heavy with the smell ' +
        'of chemicals that have no business existing together. Shelves of sealed jars line the walls, ' +
        'their contents mercifully obscured by dark glass.',
        'You find her alone, bent over a workbench, grinding something in a mortar with the focused ' +
        'intensity of someone who knows exactly what she is creating. When you speak her name, she ' +
        'does not flinch. She does not even look up.',
      ],
      dialogue: [
        {
          speaker: 'narrator',
          text: 'Vaelith is younger than you expected — barely thirty, with the gaunt features and shadowed eyes of someone who sleeps poorly and eats less.',
        },
        {
          speaker: 'aldric_vane',
          text: 'Seer Vaelith. I know about the Nighthollow. I know you stole it from the vaults. I know you gave it to the Ouroboros.',
        },
        {
          speaker: 'narrator',
          text: 'She sets down the mortar. When she turns, her expression is not guilt or fear — it is resignation.',
        },
        {
          speaker: 'narrator',
          text: '"You don\'t understand," she says quietly. "None of you understand. Malachar speaks of preserving knowledge, of guarding the old truths. But he hoards them. He sits on a mountain of power and lets the world burn because interference might risk his precious archives."',
          mood: 'angry',
        },
        {
          speaker: 'narrator',
          text: '"The Ouroboros offered me something the Conclave never did — the chance to use knowledge to change the world. Not in a thousand years, not in a hundred. Now."',
          mood: 'desperate',
        },
      ],
      combat: {
        type: 'minor',
        enemyName: 'Seer Vaelith',
        enemyDescription:
          'A Conclave seer wielding defensive alchemy — smoke bombs, acid flasks, and a desperate will to escape.',
        primaryStat: 'cunning',
        difficulty: 5,
        secondaryStat: 'strength',
        description:
          'Vaelith hurls a flask that shatters into blinding smoke. Through the chemical haze, you hear her scrambling for the door. You must act fast or she will escape to warn the Ouroboros.',
        victoryConsequences: [
          { type: 'set_flag', flagId: 'captured_vaelith', value: true },
          { type: 'add_item', itemId: 'vaelith_journal' },
          { type: 'faction_change', factionId: 'ashenConclave', value: 15 },
          { type: 'stat_change', stat: 'cunning', value: 1 },
        ],
        victoryScene: 'ch3_road_encounter',
        defeatConsequences: [
          { type: 'set_flag', flagId: 'vaelith_escaped', value: true },
          { type: 'damage', value: 15 },
          { type: 'faction_change', factionId: 'ashenConclave', value: -5 },
        ],
        defeatScene: 'ch3_road_encounter',
      },
      choices: [
        {
          id: 'ch3_c9_subdue',
          text: 'Subdue Vaelith and bring her before Malachar',
          consequences: [
            { type: 'set_flag', flagId: 'vaelith_to_malachar', value: true },
          ],
          targetScene: 'ch3_road_encounter',
        },
        {
          id: 'ch3_c9_let_go',
          text: 'Let her run — she may lead you to more Ouroboros agents',
          tooltip: 'Requires Subtlety — follow without being detected',
          statCheck: {
            stat: 'subtlety',
            difficulty: 6,
            successText:
              'You trail Vaelith through the Spire\'s hidden passages. She leads you to a dead drop — a hollow stone containing coded messages. More names for the conspiracy.',
            failureText:
              'You lose her in the labyrinthine corridors. She vanishes, and with her goes a potential thread to the Ouroboros.',
            successScene: 'ch3_road_encounter',
            failureScene: 'ch3_road_encounter',
          },
          consequences: [
            { type: 'set_flag', flagId: 'followed_vaelith', value: true },
            { type: 'add_item', itemId: 'ouroboros_coded_messages' },
          ],
          targetScene: 'ch3_road_encounter',
        },
      ],
    },

    // ── Scene 10: Crossroads Decision (for those who refused) ─────────
    {
      id: 'ch3_crossroads_decision',
      chapter: 3,
      title: 'The Lonely Road',
      location: 'Valdoria — The King\'s Road',
      artPrompt:
        'Lone knight at a crossroads under stormy skies, four paths stretching in different directions, ' +
        'each glowing with a different color — iron gray, purple, green, obsidian black — ' +
        'dramatic clouds, dark fantasy landscape',
      description: [
        'You have refused the easy path — the shelter of a powerful faction, the comfort of belonging ' +
        'to something larger than yourself. The road ahead is lonely, but it is yours.',
        'The wind carries the distant sound of marching boots from the west, chanting from the north, ' +
        'and the rhythmic hammering of fortifications from the east. Valdoria is girding for war, ' +
        'and you stand at its center, unaligned and unbowed.',
        'But independence is a luxury that the hunted cannot long afford. Somewhere ahead lies the ' +
        'Pale Sepulcher, and the Ouroboros is already moving toward it. You cannot stop a conspiracy ' +
        'alone — but perhaps you can choose your allies more carefully than your enemies expect.',
      ],
      dialogue: [
        {
          speaker: 'narrator',
          text: 'The serpent medallion in your pocket — if you took one from the ambush — pulses with a faint warmth. The Ouroboros knows you are coming. The only question is whether you arrive on your terms or theirs.',
        },
      ],
      choices: [
        {
          id: 'ch3_c10_lone_wolf',
          text: 'Press on alone toward the Pale Sepulcher',
          tooltip: 'No faction backing — maximum freedom, maximum danger',
          consequences: [
            { type: 'set_flag', flagId: 'sepulcher_alone', value: true },
            { type: 'set_flag', flagId: 'independent_path', value: true },
            { type: 'stat_change', stat: 'subtlety', value: 1 },
          ],
          targetScene: 'ch3_road_encounter',
        },
        {
          id: 'ch3_c10_reconsider_throne',
          text: 'Reconsider — perhaps the Iron Throne deserves another chance',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 5 },
          ],
          targetScene: 'ch3_throne_approach',
        },
        {
          id: 'ch3_c10_reconsider_conclave',
          text: 'Reconsider — perhaps the Conclave\'s knowledge is worth the risk',
          consequences: [
            { type: 'faction_change', factionId: 'ashenConclave', value: 5 },
          ],
          targetScene: 'ch3_conclave_approach',
        },
        {
          id: 'ch3_c10_reconsider_pact',
          text: 'Reconsider — perhaps the Pact\'s cause is the most just',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 5 },
          ],
          targetScene: 'ch3_pact_approach',
        },
      ],
    },

    // ── Scene 11: Road Encounter (convergence + combat) ───────────────
    {
      id: 'ch3_road_encounter',
      chapter: 3,
      title: 'The Ashwood Gate',
      location: 'The Ashwood — Road to the Pale Sepulcher',
      artPrompt:
        'Dark twisted forest at night, an ancient stone archway covered in serpent carvings, ' +
        'glowing runes on the ground, armored figure approaching with drawn sword, ' +
        'eerie green mist, foreboding, dark fantasy',
      description: [
        'The road to the Pale Sepulcher leads through the deepest part of the Ashwood, where the ' +
        'trees have grown together into a living wall of twisted wood and the ground is carpeted ' +
        'in ash that has never known fire. Here, at the border between the known world and something ' +
        'far older, stands the Ashwood Gate — a stone archway carved with serpents so lifelike they ' +
        'seem to breathe.',
        'The Ouroboros has posted sentries. Three robed figures stand before the gate, their faces ' +
        'hidden behind masks of pale bone. They carry weapons of dark metal that seem to drink the ' +
        'moonlight rather than reflect it. Behind them, through the archway, you catch a glimpse ' +
        'of something that makes your blood run cold — a stairway descending into absolute darkness.',
        'This is the threshold. Beyond it lies the Pale Sepulcher, the Coil of Endings, and the ' +
        'truth about why a king had to die. There is no turning back.',
      ],
      dialogue: [
        {
          speaker: 'narrator',
          text: 'The sentries spot you simultaneously, moving into formation with the mechanical precision of soldiers who have trained together extensively. The tallest one speaks.',
        },
        {
          speaker: 'narrator',
          text: '"The serpent warned us you might come. Lord Dravek sends his regards — and his regrets. He says to tell you it was never personal, Sir Vane. Just necessary."',
        },
        {
          speaker: 'aldric_vane',
          text: 'Tell Dravek he can explain that to my face. After I\'m done with you.',
        },
      ],
      combat: {
        type: 'boss',
        enemyName: 'Ouroboros Gatekeepers',
        enemyDescription:
          'Three elite Ouroboros operatives in bone masks, wielding dark-metal weapons and working in lethal coordination. Their leader carries a blade that hums with stolen magic.',
        primaryStat: 'strength',
        difficulty: 7,
        secondaryStat: 'cunning',
        description:
          'The Gatekeepers attack as one — a rehearsed killing formation that leaves no opening. ' +
          'The leader hangs back while the flankers drive you toward the gate, trying to force you ' +
          'into the narrow archway where numbers cannot help you. You must break their formation or be overwhelmed.',
        victoryConsequences: [
          { type: 'set_flag', flagId: 'defeated_gatekeepers', value: true },
          { type: 'stat_change', stat: 'strength', value: 1 },
          { type: 'add_item', itemId: 'dark_metal_blade' },
          { type: 'set_flag', flagId: 'sepulcher_entrance', value: true },
        ],
        victoryScene: 'ch3_chapter_end',
        defeatConsequences: [
          { type: 'damage', value: 40 },
          { type: 'set_flag', flagId: 'barely_survived_gate', value: true },
        ],
        defeatScene: 'ch3_chapter_end_wounded',
      },
      choices: [
        {
          id: 'ch3_c11_charge',
          text: 'Draw your sword and charge',
          consequences: [],
          targetScene: 'ch3_chapter_end',
        },
        {
          id: 'ch3_c11_stealth',
          text: 'Attempt to bypass the sentries entirely',
          tooltip: 'Requires Subtlety — find another way in',
          statCheck: {
            stat: 'subtlety',
            difficulty: 7,
            successText:
              'You find a collapsed section of wall fifty paces from the gate. The gap is narrow, but you slip through into the Sepulcher\'s outer grounds without alerting the sentries.',
            failureText:
              'A loose stone gives you away. The sentries converge on your position. So much for subtlety.',
            successScene: 'ch3_chapter_end',
            failureScene: 'ch3_chapter_end',
          },
          consequences: [
            { type: 'set_flag', flagId: 'bypassed_gate', value: true },
          ],
          targetScene: 'ch3_chapter_end',
        },
        {
          id: 'ch3_c11_parley',
          text: 'Demand to speak with Dravek — invoke your former bond',
          tooltip: 'Requires Charisma — appeal to whatever remains of Dravek\'s humanity',
          statCheck: {
            stat: 'charisma',
            difficulty: 8,
            successText:
              'The lead sentry hesitates. "Lord Dravek did say... if Vane came willingly, he was to be brought before him. Alive." The bone mask tilts. "Drop your weapons. All of them."',
            failureText:
              '"Lord Dravek\'s orders are clear. You die here, knight." The dark blades rise.',
            successScene: 'ch3_chapter_end',
            failureScene: 'ch3_chapter_end',
          },
          consequences: [
            { type: 'set_flag', flagId: 'parley_dravek', value: true },
          ],
          targetScene: 'ch3_chapter_end',
        },
      ],
    },

    // ── Scene 12: Chapter End (victory) ───────────────────────────────
    {
      id: 'ch3_chapter_end',
      chapter: 3,
      title: 'The Descent',
      location: 'The Pale Sepulcher — Entrance',
      artPrompt:
        'Ancient stone stairway descending into darkness, serpent carvings on the walls glowing faintly, ' +
        'a knight standing at the top looking down, wind blowing upward from below carrying whispers, ' +
        'epic and foreboding, dark fantasy',
      description: [
        'The Ashwood Gate stands open behind you — passed through or bypassed, conquered or negotiated, ' +
        'but behind you nonetheless. Ahead, the stone stairway descends into the earth, each step ' +
        'carved with serpents that seem to writhe in the torchlight. The air rising from below is ' +
        'cold and ancient, carrying the mineral smell of undisturbed stone and something else — ' +
        'something that prickles the skin and sets the teeth on edge.',
        'You have chosen your allies. You have gathered your clues. You have fought, bled, and ' +
        'survived the opening moves of a conspiracy that spans the realm. But everything until now ' +
        'has been prelude. The real game begins below.',
        'Somewhere in the darkness beneath your feet, Lord Castellan Dravek — the man who destroyed ' +
        'your life to clear the path for regicide — is reaching for an artifact of terrible power. ' +
        'The Coil of Endings. The key that could unmake Valdoria itself.',
        'You take the first step down. The darkness swallows you like a held breath.',
      ],
      dialogue: [
        {
          speaker: 'narrator',
          text: 'The serpent carvings on the walls pulse once as you descend — a slow, rhythmic glow, like a heartbeat. As if the Sepulcher itself is waking.',
          mood: 'sinister',
        },
        {
          speaker: 'narrator',
          text: 'Whatever waits below, there is no turning back now. The price of loyalty has been paid — in blood, in trust, in the last remnants of the life you knew. All that remains is the descent, the confrontation, and the truth.',
        },
      ],
      choices: [
        {
          id: 'ch3_end_continue',
          text: 'Descend into the Pale Sepulcher',
          tooltip: 'Continue to Chapter 4',
          consequences: [
            { type: 'set_flag', flagId: 'entered_sepulcher', value: true },
            { type: 'set_flag', flagId: 'ch3_complete', value: true },
          ],
          targetScene: 'ch4_sepulcher_entry',
        },
      ],
    },

    // ── Scene 13: Chapter End (wounded) ───────────────────────────────
    {
      id: 'ch3_chapter_end_wounded',
      chapter: 3,
      title: 'The Wounded Descent',
      location: 'The Pale Sepulcher — Entrance',
      artPrompt:
        'Wounded knight leaning against a stone archway, bleeding but determined, looking down into ' +
        'a dark stairway, serpent carvings glowing faintly, battered armor, grim resolve, dark fantasy',
      description: [
        'You barely survived the gate. Blood soaks through your armor from a dozen wounds, and your ' +
        'sword arm trembles with exhaustion. The Gatekeepers are down — unconscious or dead, you ' +
        'cannot tell and do not care — but they have exacted a heavy toll.',
        'The stairway waits. The darkness below does not care whether you enter whole or broken, ' +
        'strong or depleted. It waits with the patience of stone, and it will swallow you either way.',
        'You lean against the archway and breathe. One breath. Two. Then you straighten, ignore ' +
        'the screaming of your wounds, and begin the descent. You did not come this far to die ' +
        'at the threshold.',
      ],
      dialogue: [
        {
          speaker: 'aldric_vane',
          text: 'Dravek. I\'m coming for you.',
          mood: 'angry',
        },
        {
          speaker: 'narrator',
          text: 'The serpent carvings pulse in answer — or perhaps in warning. The Pale Sepulcher opens before you like a mouth, and you step willingly into its teeth.',
        },
      ],
      choices: [
        {
          id: 'ch3_end_wounded_continue',
          text: 'Descend into the Pale Sepulcher, wounds and all',
          tooltip: 'Continue to Chapter 4 — wounded but resolute',
          consequences: [
            { type: 'set_flag', flagId: 'entered_sepulcher', value: true },
            { type: 'set_flag', flagId: 'entered_wounded', value: true },
            { type: 'set_flag', flagId: 'ch3_complete', value: true },
          ],
          targetScene: 'ch4_sepulcher_entry',
        },
        {
          id: 'ch3_end_wounded_rest',
          text: 'Rest and tend your wounds before descending — every minute matters, but so does survival',
          tooltip: 'Heal but risk Dravek reaching the artifact first',
          consequences: [
            { type: 'heal', value: 20 },
            { type: 'set_flag', flagId: 'entered_sepulcher', value: true },
            { type: 'set_flag', flagId: 'delayed_entry', value: true },
            { type: 'set_flag', flagId: 'ch3_complete', value: true },
          ],
          targetScene: 'ch4_sepulcher_entry',
        },
      ],
    },
  ],
};
