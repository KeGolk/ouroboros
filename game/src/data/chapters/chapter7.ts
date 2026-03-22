import type { Chapter } from '../story-types';

export const chapter7: Chapter = {
  number: 7,
  title: 'The Siege of Ashenmere',
  subtitle: 'Blood and fire come to the crossroads of Valdoria',
  openingNarration:
    'The drumbeats began at dawn — a low, relentless thunder that shook the morning dew from the rooftops of Ashenmere. The city that had stood for three centuries as the neutral heart of Valdoria now found itself caught between iron and flame. Whoever holds Ashenmere holds the realm, the old saying went. Today, every faction meant to test that truth.',
  artPrompt:
    'A walled medieval city under siege at dawn, catapult fire streaking across an orange sky, defenders on ramparts silhouetted against flames, dark fantasy oil painting style',
  entryScene: 'ch7_siege_begins',
  scenes: [
    // ── SCENE 1: The Siege Begins ──
    {
      id: 'ch7_siege_begins',
      chapter: 7,
      title: 'The Drums of War',
      location: 'Ashenmere — Outer Walls',
      artPrompt:
        'Medieval city walls at dawn with siege engines approaching across misty fields, soldiers preparing defenses, dark fantasy',
      description: [
        'The walls of Ashenmere stretch before you like the spine of some vast, slumbering beast. Smoke rises from a dozen fires within the city — not from battle, not yet, but from the forges working through the night to arm every man and woman who can hold a blade.',
        'Below, on the churned fields beyond the moat, the besieging army assembles with terrible precision. Banners snap in the cold wind — you can make out the iron gauntlet of Queen Isolde\'s legions, but there are others too: sellswords, conscripted levies from a dozen vassal towns, and darker shapes that move at the edges of the host like wolves trailing a herd.',
        'Captain Thorne stands at the battlement beside you, his jaw set, his armor dulled with road dust. He has not slept. Neither have you.',
      ],
      dialogue: [
        {
          speaker: 'captain_thorne',
          text: 'Three thousand souls behind these walls, Vane. Merchants, mothers, children who\'ve never held anything sharper than a bread knife. And out there — ten thousand armed men who\'ve been promised plunder.',
          mood: 'desperate',
        },
        {
          speaker: 'aldric_vane',
          text: 'The garrison can hold the walls. The question is for how long.',
          mood: 'neutral',
        },
        {
          speaker: 'captain_thorne',
          text: 'A day. Perhaps two, if the eastern gate holds. After that...',
          mood: 'fearful',
        },
        {
          speaker: 'narrator',
          text: 'He does not finish the sentence. He does not need to. You have both seen what happens to cities that fall.',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'There is another way. The old aqueducts beneath the city — they connect to the river beyond the siege lines. If someone could slip through, reach the Verdant Pact encampment to the south...',
          mood: 'hopeful',
        },
        {
          speaker: 'captain_thorne',
          text: 'Reinforcements from rebels? You ask me to choose between the queen\'s wrath and the city\'s survival.',
          mood: 'angry',
        },
      ],
      choices: [
        {
          id: 'ch7_defend_walls',
          text: 'Stand with Thorne on the walls. The garrison needs every sword.',
          tooltip: 'Commit to the defense — strength and honor',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 10 },
            { type: 'set_flag', flagId: 'ch7_chose_defense', value: true },
            { type: 'stat_change', stat: 'strength', value: 1 },
          ],
          targetScene: 'ch7_wall_defense',
        },
        {
          id: 'ch7_seek_reinforcements',
          text: 'Volunteer to slip through the aqueducts and seek Verdant Pact aid.',
          tooltip: 'A dangerous mission — cunning and subtlety required',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 10 },
            { type: 'set_flag', flagId: 'ch7_sought_reinforcements', value: true },
          ],
          targetScene: 'ch7_aqueduct_escape',
        },
        {
          id: 'ch7_sabotage_siege',
          text: 'Propose a covert mission to sabotage the siege engines under cover of darkness.',
          tooltip: 'Strike from the shadows — subtlety and cunning',
          conditions: [
            { type: 'stat_check', stat: 'subtlety', operator: 'gte', value: 5 },
          ],
          consequences: [
            { type: 'faction_change', factionId: 'obsidianGuild', value: 10 },
            { type: 'set_flag', flagId: 'ch7_sabotage_mission', value: true },
          ],
          targetScene: 'ch7_sabotage_run',
        },
        {
          id: 'ch7_arcane_defense',
          text: 'Ask Elara to reach out to Ashen Conclave contacts for arcane support.',
          tooltip: 'Magic may turn the tide — but at what cost?',
          conditions: [
            { type: 'companion_present', companionId: 'elara_dawnwhisper', operator: 'true' },
          ],
          consequences: [
            { type: 'faction_change', factionId: 'ashenConclave', value: 5 },
            { type: 'set_flag', flagId: 'ch7_arcane_aid', value: true },
          ],
          targetScene: 'ch7_arcane_ritual',
        },
      ],
      variants: [
        {
          condition: { type: 'flag_set', flagId: 'allied_with_thorne', operator: 'true' },
          dialogue: [
            {
              speaker: 'captain_thorne',
              text: 'I\'m glad you\'re here, Vane. After everything — I\'m glad it\'s you beside me at the end.',
              mood: 'hopeful',
            },
          ],
        },
      ],
    },

    // ── SCENE 2: Wall Defense ──
    {
      id: 'ch7_wall_defense',
      chapter: 7,
      title: 'The First Assault',
      location: 'Ashenmere — Eastern Rampart',
      artPrompt:
        'Soldiers defending a medieval wall against scaling ladders, boiling oil, arrows flying, grim dark fantasy battle scene',
      description: [
        'They come with the rising sun at their backs, a deliberate cruelty — you must squint into the glare to see the scaling ladders rising like the legs of enormous insects against the wall.',
        'The first wave breaks against the stone with a sound like the sea. Ladders slam against the parapet. Grappling hooks bite into the crenellations. Below, a battering ram begins its rhythmic assault on the eastern gate, each impact sending tremors through the stone beneath your feet.',
        'Thorne roars orders and his voice carries the certainty that frightened men need. You draw your blade. The first attacker crests the wall — a wild-eyed conscript, barely old enough to shave — and the killing begins.',
      ],
      dialogue: [
        {
          speaker: 'captain_thorne',
          text: 'Hold the line! Push those ladders back! For Ashenmere!',
          mood: 'triumphant',
        },
        {
          speaker: 'narrator',
          text: 'The battle dissolves into a blur of steel and screaming. You fight not with thought but with the muscle-memory beaten into you during years of training. Parry. Cut. Pivot. An arrow hisses past your ear.',
        },
        {
          speaker: 'aldric_vane',
          text: 'Thorne — the gate! They\'re breaking through the gate!',
          mood: 'desperate',
        },
        {
          speaker: 'captain_thorne',
          text: 'Then choose, Vane! Hold this wall or save the gate — I cannot do both!',
          mood: 'desperate',
        },
      ],
      combat: {
        type: 'boss',
        enemyName: 'Siege Commander Varkoth',
        enemyDescription:
          'A massive warrior in blackened plate, commanding the scaling assault from atop the wall. His two-handed axe cleaves through defenders like kindling.',
        primaryStat: 'strength',
        difficulty: 7,
        secondaryStat: 'cunning',
        description:
          'The siege commander himself has crested the wall, his elite guard forming a beachhead on the rampart. If he is not stopped, the eastern wall will fall within the hour.',
        victoryConsequences: [
          { type: 'set_flag', flagId: 'ch7_varkoth_slain', value: true },
          { type: 'faction_change', factionId: 'ironThrone', value: 15 },
          { type: 'stat_change', stat: 'strength', value: 1 },
          { type: 'add_item', itemId: 'varkoths_black_axe' },
        ],
        victoryScene: 'ch7_wall_held',
        defeatConsequences: [
          { type: 'damage', value: 30 },
          { type: 'set_flag', flagId: 'ch7_wall_breached', value: true },
          { type: 'faction_change', factionId: 'ironThrone', value: -5 },
        ],
        defeatScene: 'ch7_wall_falls',
      },
      choices: [
        {
          id: 'ch7_hold_wall',
          text: 'Hold the wall — the rampart must not fall.',
          consequences: [
            { type: 'set_flag', flagId: 'ch7_held_wall', value: true },
          ],
          targetScene: 'ch7_wall_held',
        },
        {
          id: 'ch7_save_gate',
          text: 'Rush to reinforce the gate before the ram breaks through.',
          consequences: [
            { type: 'set_flag', flagId: 'ch7_saved_gate', value: true },
            { type: 'set_flag', flagId: 'ch7_wall_breached', value: true },
          ],
          targetScene: 'ch7_gate_defense',
        },
      ],
    },

    // ── SCENE 3: Aqueduct Escape (Reinforcement Path) ──
    {
      id: 'ch7_aqueduct_escape',
      chapter: 7,
      title: 'The Dark Below',
      location: 'Ashenmere — Ancient Aqueducts',
      artPrompt:
        'Dark underground waterway with crumbling stone arches, green bioluminescent moss, a figure wading through waist-deep water with a torch',
      description: [
        'The entrance to the aqueducts lies beneath the Temple of the Weeping Saint, hidden behind a crumbling altar that Elara pries aside with a grunt of effort. Below, the air is thick with the smell of ancient stone and stagnant water.',
        'You descend into darkness. The tunnel stretches ahead, its ceiling lost in shadow, its floor submerged beneath knee-deep water that runs black and cold. Somewhere in the distance, you hear the echo of dripping — or footsteps.',
        'The siege army does not know about these passages. At least, you pray they do not.',
      ],
      dialogue: [
        {
          speaker: 'elara_dawnwhisper',
          text: 'These aqueducts were built before the kingdom existed. The Ashen Conclave used them for rituals — there are wards down here, old protections. Some may still hold.',
          mood: 'fearful',
        },
        {
          speaker: 'narrator',
          text: 'The torchlight catches something on the wall — scratch marks, fresh ones, descending from an overhead grate. Someone else has been down here recently.',
        },
        {
          speaker: 'aldric_vane',
          text: 'We\'re not alone.',
          mood: 'fearful',
        },
      ],
      combat: {
        type: 'minor',
        enemyName: 'Tunnel Stalkers',
        enemyDescription:
          'A pack of pale, eyeless creatures that have made the aqueducts their hunting ground. They move in eerie silence, striking from the water.',
        primaryStat: 'cunning',
        difficulty: 5,
        description:
          'Shapes burst from the water around you — pale, sinuous things with too many limbs. They are fast, and the confined space leaves nowhere to run.',
        victoryConsequences: [
          { type: 'stat_change', stat: 'cunning', value: 1 },
        ],
        victoryScene: 'ch7_verdant_camp',
        defeatConsequences: [
          { type: 'damage', value: 20 },
        ],
        defeatScene: 'ch7_verdant_camp',
      },
      choices: [
        {
          id: 'ch7_push_forward',
          text: 'Press through the darkness — speed is everything.',
          statCheck: {
            stat: 'cunning',
            difficulty: 6,
            successText: 'You navigate the labyrinthine tunnels with instinctive precision, emerging beyond the siege lines.',
            failureText: 'You take a wrong turn and lose precious hours in the dark, nearly drowning in a flooded chamber.',
            successScene: 'ch7_verdant_camp',
            failureScene: 'ch7_verdant_camp',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch7_fast_escape', value: true },
          ],
          targetScene: 'ch7_verdant_camp',
        },
        {
          id: 'ch7_explore_ruins',
          text: 'Investigate the side passage — those scratch marks lead somewhere.',
          consequences: [
            { type: 'set_flag', flagId: 'ch7_found_aqueduct_secret', value: true },
            { type: 'add_item', itemId: 'ancient_ward_stone' },
            { type: 'faction_change', factionId: 'ashenConclave', value: 5 },
          ],
          targetScene: 'ch7_verdant_camp',
        },
      ],
    },

    // ── SCENE 4: Sabotage Run ──
    {
      id: 'ch7_sabotage_run',
      chapter: 7,
      title: 'Midnight Fire',
      location: 'Siege Camp — Enemy Lines',
      artPrompt:
        'A shadowy figure creeping through a moonlit military camp with siege towers and trebuchets, torches guttering, dark fantasy stealth scene',
      description: [
        'You slip from the city through a drainage culvert barely wide enough for a man, emerging into the cold mud of no-man\'s-land. The siege camp sprawls before you — a city of canvas and steel, reeking of horse sweat and lamp oil.',
        'The siege engines loom like skeletal giants against the starfield. Three trebuchets, two siege towers, and a ram the size of a river barge. Destroying them all is impossible. But crippling the worst of them — that might buy Ashenmere another day.',
        'Nyx materializes from the shadows beside you, silent as smoke. You nearly put a blade through her throat before recognizing the obsidian pin at her collar.',
      ],
      dialogue: [
        {
          speaker: 'nyx',
          text: 'The Guild sent me. Sylas has no interest in seeing Ashenmere fall — bad for business. I\'ve already poisoned the officers\' wine. Should thin their coordination by morning.',
          mood: 'neutral',
        },
        {
          speaker: 'aldric_vane',
          text: 'Poisoned. How many will die?',
          mood: 'angry',
        },
        {
          speaker: 'nyx',
          text: 'Fewer than if those trebuchets fire at dawn. Sentiment is a luxury, Vane. Shall we discuss ethics or shall we burn siege engines?',
          mood: 'sinister',
        },
      ],
      combat: {
        type: 'minor',
        enemyName: 'Siege Camp Sentries',
        enemyDescription:
          'Alert guards patrolling the siege engine park. If they raise the alarm, the mission is over.',
        primaryStat: 'subtlety',
        difficulty: 6,
        secondaryStat: 'cunning',
        description:
          'Two sentries stand between you and the trebuchets. One holds a horn that will summon the entire camp if blown.',
        victoryConsequences: [
          { type: 'stat_change', stat: 'subtlety', value: 1 },
          { type: 'set_flag', flagId: 'ch7_sentries_silenced', value: true },
        ],
        victoryScene: 'ch7_engines_burn',
        defeatConsequences: [
          { type: 'damage', value: 15 },
          { type: 'set_flag', flagId: 'ch7_alarm_raised', value: true },
        ],
        defeatScene: 'ch7_engines_burn',
      },
      choices: [
        {
          id: 'ch7_burn_trebuchets',
          text: 'Focus on the trebuchets — they\'re the deadliest threat.',
          consequences: [
            { type: 'set_flag', flagId: 'ch7_trebuchets_destroyed', value: true },
            { type: 'faction_change', factionId: 'obsidianGuild', value: 10 },
          ],
          targetScene: 'ch7_engines_burn',
        },
        {
          id: 'ch7_burn_towers',
          text: 'Target the siege towers — once those reach the walls, it\'s over.',
          consequences: [
            { type: 'set_flag', flagId: 'ch7_towers_destroyed', value: true },
            { type: 'faction_change', factionId: 'obsidianGuild', value: 10 },
          ],
          targetScene: 'ch7_engines_burn',
        },
        {
          id: 'ch7_free_prisoners',
          text: 'You spot caged prisoners near the supply wagons. Free them first.',
          tooltip: 'A moral choice — costs time but saves lives',
          consequences: [
            { type: 'set_flag', flagId: 'ch7_freed_prisoners', value: true },
            { type: 'faction_change', factionId: 'verdantPact', value: 10 },
            { type: 'faction_change', factionId: 'obsidianGuild', value: -5 },
          ],
          targetScene: 'ch7_engines_burn',
        },
      ],
    },

    // ── SCENE 5: Arcane Ritual Path ──
    {
      id: 'ch7_arcane_ritual',
      chapter: 7,
      title: 'The Weeping Circle',
      location: 'Ashenmere — Temple Undercroft',
      artPrompt:
        'A glowing magic circle on a stone floor with robed figures channeling energy, blue-purple arcane light illuminating ancient carvings, dark fantasy',
      description: [
        'The undercroft of the Temple of the Weeping Saint is older than the city itself — older, perhaps, than the kingdom. The stones here are not quarried but grown, shaped by arts long forgotten, and they hum with a resonance you feel in your teeth.',
        'Elara works with feverish intensity, her fingers tracing sigils in the air that hang like afterimages of lightning. Three other mages — Conclave defectors who followed her from the Spire — kneel at the cardinal points of a circle inscribed in silver dust.',
        'The ritual she proposes is dangerous. A ward of repulsion, cast over the entire eastern wall, that will hurl back any who attempt to scale it. But the power required is immense, and the source she intends to tap is the ley-line beneath Ashenmere — the same line the Conclave has jealously guarded for centuries.',
      ],
      dialogue: [
        {
          speaker: 'elara_dawnwhisper',
          text: 'The ley-line is a river of raw will, Aldric. Drawing from it without the Conclave\'s anchoring stones is like drinking from a waterfall — you\'ll get what you need, but it may drown you.',
          mood: 'fearful',
        },
        {
          speaker: 'aldric_vane',
          text: 'What happens if it goes wrong?',
          mood: 'neutral',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'The ward collapses. The backlash kills everyone in this room. And the ley-line destabilizes, which Malachar will feel from the Obsidian Spire. He\'ll know exactly what we attempted and exactly where to find us.',
          mood: 'fearful',
        },
        {
          speaker: 'narrator',
          text: 'She meets your eyes. In them you see not fear but the fierce, defiant hope of someone who has already counted the cost and found it acceptable.',
        },
      ],
      choices: [
        {
          id: 'ch7_full_ritual',
          text: 'Support the full ritual. The ward could save hundreds of lives.',
          statCheck: {
            stat: 'lore',
            difficulty: 7,
            successText: 'You steady the circle with your own will, and the ward erupts upward like a curtain of pale fire. The eastern wall shimmers with protection.',
            failureText: 'The ley-line surges beyond control. Elara screams. You manage to sever the connection, but the backlash shatters the circle and wounds everyone present.',
            successScene: 'ch7_ward_holds',
            failureScene: 'ch7_ward_fails',
          },
          consequences: [
            { type: 'faction_change', factionId: 'ashenConclave', value: 15 },
            { type: 'set_flag', flagId: 'ch7_attempted_ward', value: true },
          ],
          targetScene: 'ch7_ward_holds',
        },
        {
          id: 'ch7_partial_ritual',
          text: 'Convince Elara to attempt a lesser ward — safer, but it won\'t cover the whole wall.',
          consequences: [
            { type: 'faction_change', factionId: 'ashenConclave', value: 5 },
            { type: 'set_flag', flagId: 'ch7_partial_ward', value: true },
          ],
          targetScene: 'ch7_ward_holds',
        },
        {
          id: 'ch7_stop_ritual',
          text: 'Stop the ritual. The risk to Elara is too great.',
          consequences: [
            { type: 'faction_change', factionId: 'ashenConclave', value: -10 },
            { type: 'set_flag', flagId: 'ch7_stopped_ritual', value: true },
          ],
          targetScene: 'ch7_thornes_crisis',
        },
      ],
    },

    // ── SCENE 6: Convergence — Thorne's Crisis ──
    {
      id: 'ch7_thornes_crisis',
      chapter: 7,
      title: 'The Weight of the Crown',
      location: 'Ashenmere — Command Tower',
      artPrompt:
        'A weary knight commander standing before a map table in a torch-lit tower, the glow of fires visible through arrow slits, anguished decision, dark fantasy',
      description: [
        'The second day dawns red. The siege has ground on through the night — a relentless, exhausting pressure designed to break the defenders\' will before it breaks the walls. It is working.',
        'Captain Thorne stands before the map table in the command tower, and for the first time since you have known him, his hands are shaking. A messenger has arrived from Queen Isolde: Ashenmere is to be surrendered. The city is to be handed over intact, its garrison to lay down arms. In exchange, the civilian population will be spared.',
        'But Thorne has seen what "spared" means under the queen\'s new edicts. The dissenters imprisoned. The temples burned. The old freedoms of the crossroads city stripped away and replaced with iron law.',
      ],
      dialogue: [
        {
          speaker: 'captain_thorne',
          text: 'I swore an oath, Vane. To the crown. To the throne. And now the crown asks me to hand three thousand people to a fate I would not wish on my worst enemy.',
          mood: 'desperate',
        },
        {
          speaker: 'captain_thorne',
          text: 'My whole life, I believed that honor meant obedience. That the chain of command was sacred. That a soldier who questions his orders is no better than a brigand.',
          mood: 'sad',
        },
        {
          speaker: 'narrator',
          text: 'He removes his gauntlet and sets it on the table beside his commander\'s seal. His bare hand is scarred, callused, human.',
        },
        {
          speaker: 'captain_thorne',
          text: 'Tell me what to do, Aldric. Because for the first time in thirty years of service, I do not know.',
          mood: 'desperate',
        },
      ],
      choices: [
        {
          id: 'ch7_counsel_defy',
          text: '"Defy the order. Your oath was to protect the people, not to hand them to tyranny."',
          tooltip: 'Encourage Thorne to rebel — major political consequences',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: -20 },
            { type: 'faction_change', factionId: 'verdantPact', value: 15 },
            { type: 'set_flag', flagId: 'ch7_thorne_defects', value: true },
            { type: 'stat_change', stat: 'charisma', value: 1 },
          ],
          targetScene: 'ch7_siege_aftermath',
        },
        {
          id: 'ch7_counsel_obey',
          text: '"Obey the queen. An honorable surrender saves more lives than a doomed last stand."',
          tooltip: 'Maintain order — pragmatic but costly to freedom',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 15 },
            { type: 'faction_change', factionId: 'verdantPact', value: -15 },
            { type: 'set_flag', flagId: 'ch7_city_surrendered', value: true },
          ],
          targetScene: 'ch7_siege_aftermath',
        },
        {
          id: 'ch7_counsel_negotiate',
          text: '"Neither. Use the surrender as cover to negotiate better terms — buy time and leverage."',
          tooltip: 'The shrewd path — cunning required',
          statCheck: {
            stat: 'cunning',
            difficulty: 7,
            successText: 'Your plan works. Thorne sends a counter-proposal that buys the city three more days and extracts concessions for the civilian population.',
            failureText: 'The queen sees through the delay and sends a final ultimatum: surrender by nightfall or face annihilation.',
            successScene: 'ch7_siege_aftermath',
            failureScene: 'ch7_siege_aftermath',
          },
          consequences: [
            { type: 'faction_change', factionId: 'obsidianGuild', value: 10 },
            { type: 'set_flag', flagId: 'ch7_negotiated_terms', value: true },
          ],
          targetScene: 'ch7_siege_aftermath',
        },
      ],
      variants: [
        {
          condition: { type: 'flag_set', flagId: 'ch7_chose_defense', operator: 'true' },
          description: [
            'You fought beside Thorne on the walls. You watched him rally men who wanted to flee, hold a line that should have broken, carry a wounded boy down from the rampart with arrows falling like rain. You know exactly what kind of man he is. And that is why his anguish cuts you to the bone.',
          ],
        },
      ],
    },

    // ── Convergence scenes (brief transitions) ──
    {
      id: 'ch7_wall_held',
      chapter: 7,
      title: 'Dawn on the Rampart',
      location: 'Ashenmere — Eastern Wall',
      artPrompt: 'Victorious defenders on a battle-damaged medieval wall at dawn, exhausted but standing, dark fantasy',
      description: [
        'The wall holds. By some miracle of steel and stubbornness, the wall holds. The attackers fall back as dawn breaks, leaving their dead draped over the battlements like grim pennants.',
        'You lean against the parapet, gasping, your sword arm trembling with exhaustion. Around you, the surviving defenders share water and bandages in the hollow silence that follows battle.',
      ],
      dialogue: [
        {
          speaker: 'captain_thorne',
          text: 'One day bought. Perhaps our last. But by the gods, we earned it.',
          mood: 'triumphant',
        },
      ],
      choices: [
        {
          id: 'ch7_to_crisis',
          text: 'Follow Thorne to the command tower — a message has arrived from the queen.',
          consequences: [],
          targetScene: 'ch7_thornes_crisis',
        },
      ],
    },

    {
      id: 'ch7_wall_falls',
      chapter: 7,
      title: 'Breach',
      location: 'Ashenmere — Eastern Wall (Breached)',
      artPrompt: 'A broken medieval wall with attackers pouring through the gap, defenders falling back in desperate retreat, dark fantasy',
      description: [
        'The wall falls. Varkoth\'s elite guard pour through the breach, and the defenders break — not all at once, but in a slow, terrible unraveling as fear spreads from man to man like plague.',
        'You are carried backward by the retreating tide, fighting to stay upright, fighting to keep your blade between the enemy and the fleeing civilians behind you.',
      ],
      dialogue: [
        {
          speaker: 'captain_thorne',
          text: 'Fall back to the inner keep! Protect the civilians — move!',
          mood: 'desperate',
        },
      ],
      choices: [
        {
          id: 'ch7_retreat_to_crisis',
          text: 'Rally at the inner keep with Thorne.',
          consequences: [
            { type: 'damage', value: 10 },
          ],
          targetScene: 'ch7_thornes_crisis',
        },
      ],
    },

    {
      id: 'ch7_gate_defense',
      chapter: 7,
      title: 'The Shattered Gate',
      location: 'Ashenmere — Eastern Gate',
      artPrompt: 'Defenders bracing a cracking medieval gate against a battering ram, splinters flying, desperate struggle, dark fantasy',
      description: [
        'You arrive at the gate just as the ram strikes its final blow. The iron-banded oak splinters inward and the foremost attackers charge through the gap — only to meet a wall of spears hastily organized by the gate sergeant.',
        'You throw yourself into the breach, fighting in the narrow confines of the shattered gateway where numbers count for nothing and courage counts for everything.',
      ],
      dialogue: [
        {
          speaker: 'narrator',
          text: 'For twenty terrible minutes you hold the gate. When reinforcements finally arrive from the western wall, you are standing among the dead, your sword notched to ruin, your armor painted red.',
        },
      ],
      combat: {
        type: 'minor',
        enemyName: 'Gate Assault Vanguard',
        enemyDescription: 'The first wave of heavily armored shock troops pouring through the shattered gate.',
        primaryStat: 'strength',
        difficulty: 6,
        description: 'The narrow gateway forces the attackers into a killing funnel, but their numbers seem endless.',
        victoryConsequences: [
          { type: 'set_flag', flagId: 'ch7_gate_held', value: true },
          { type: 'faction_change', factionId: 'ironThrone', value: 10 },
          { type: 'stat_change', stat: 'strength', value: 1 },
        ],
        victoryScene: 'ch7_thornes_crisis',
        defeatConsequences: [
          { type: 'damage', value: 25 },
          { type: 'set_flag', flagId: 'ch7_gate_lost', value: true },
        ],
        defeatScene: 'ch7_thornes_crisis',
      },
      choices: [
        {
          id: 'ch7_gate_to_crisis',
          text: 'The gate is held — for now. Report to Thorne.',
          consequences: [],
          targetScene: 'ch7_thornes_crisis',
        },
      ],
    },

    {
      id: 'ch7_verdant_camp',
      chapter: 7,
      title: 'The Green Banner',
      location: 'Thornwood — Verdant Pact Encampment',
      artPrompt: 'A rebel camp in a dense forest with green banners, campfires, armed peasants and rangers, earthy dark fantasy',
      description: [
        'You emerge from the aqueduct into moonlight and forest. The Verdant Pact camp is hidden beneath the eaves of the Thornwood, invisible from the road — a sprawling settlement of tents, lean-tos, and camouflaged watchtowers.',
        'Rowan Greenmantle meets you at the perimeter. He is younger than you expected — barely thirty, with a fox\'s clever face and the calloused hands of a man who has worked the earth and fought upon it in equal measure.',
      ],
      dialogue: [
        {
          speaker: 'rowan_greenmantle',
          text: 'Aldric Vane. The disgraced knight who\'s been turning Valdoria upside down. I\'ve heard the stories. Some of them are even flattering.',
          mood: 'neutral',
        },
        {
          speaker: 'aldric_vane',
          text: 'Ashenmere is falling. Three thousand civilians behind those walls.',
          mood: 'desperate',
        },
        {
          speaker: 'rowan_greenmantle',
          text: 'I know. And I have eight hundred fighters — farmers, foresters, a few deserters from the queen\'s own legions. Not enough to break a siege. But perhaps enough to change the shape of one.',
          mood: 'hopeful',
        },
        {
          speaker: 'rowan_greenmantle',
          text: 'The question is: what happens after? If my people bleed for that city, I need assurances. Ashenmere must be free — no crown, no conclave, no guild pulling the strings.',
          mood: 'angry',
        },
      ],
      choices: [
        {
          id: 'ch7_promise_freedom',
          text: '"You have my word. Ashenmere will govern itself."',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 20 },
            { type: 'faction_change', factionId: 'ironThrone', value: -10 },
            { type: 'set_flag', flagId: 'ch7_promised_freedom', value: true },
          ],
          targetScene: 'ch7_thornes_crisis',
        },
        {
          id: 'ch7_promise_nothing',
          text: '"I can\'t promise what I don\'t control. But I\'ll fight for it."',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 5 },
            { type: 'set_flag', flagId: 'ch7_honest_with_rowan', value: true },
          ],
          targetScene: 'ch7_thornes_crisis',
        },
        {
          id: 'ch7_offer_alliance',
          text: '"Fight with us and the Pact earns a seat at the table when this is over — a real voice in governance."',
          statCheck: {
            stat: 'charisma',
            difficulty: 6,
            successText: 'Rowan studies you for a long moment, then nods. "A seat at the table. I\'ll hold you to that, knight."',
            failureText: 'Rowan scoffs. "Pretty words. I\'ve heard them before, from prettier mouths. But we\'ll come — for the people, not for your promises."',
            successScene: 'ch7_thornes_crisis',
            failureScene: 'ch7_thornes_crisis',
          },
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 10 },
            { type: 'set_flag', flagId: 'ch7_pact_alliance', value: true },
          ],
          targetScene: 'ch7_thornes_crisis',
        },
      ],
    },

    {
      id: 'ch7_engines_burn',
      chapter: 7,
      title: 'Fire in the Night',
      location: 'Siege Camp — Trebuchet Park',
      artPrompt: 'Massive wooden siege engines ablaze in the night, silhouettes fleeing, sparks ascending into dark sky, dark fantasy',
      description: [
        'The oil catches and the night splits open. The first trebuchet goes up like a funeral pyre, its massive arm cracking in the heat with a sound like a giant\'s spine breaking. The fire leaps to the second, then the third — a chain of destruction that lights the siege camp bright as noon.',
        'Horns blare. Soldiers pour from tents in various states of undress, shouting, stumbling, searching for enemies they cannot find in the chaos. Nyx grabs your arm and pulls you into the shadows.',
      ],
      dialogue: [
        {
          speaker: 'nyx',
          text: 'Beautiful. Sylas will be pleased — those engines cost more than most towns are worth. Now run.',
          mood: 'triumphant',
        },
        {
          speaker: 'narrator',
          text: 'You run. Behind you, the siege camp burns, and for the first time in days, the drums of war fall silent.',
        },
      ],
      choices: [
        {
          id: 'ch7_return_to_city',
          text: 'Slip back into the city before dawn.',
          consequences: [
            { type: 'faction_change', factionId: 'obsidianGuild', value: 5 },
          ],
          targetScene: 'ch7_thornes_crisis',
        },
      ],
    },

    {
      id: 'ch7_ward_holds',
      chapter: 7,
      title: 'The Shimmering Wall',
      location: 'Ashenmere — Eastern Wall',
      artPrompt: 'A medieval wall glowing with blue-white magical energy, repelling attackers who are hurled backward, ethereal dark fantasy',
      description: [
        'The ward rises like a second wall — invisible until touched, then erupting into blinding radiance. The first scaling party to reach the rampart is hurled backward as if struck by a giant\'s hand, their bodies tumbling through the air to crash among their own ranks.',
        'A ragged cheer erupts from the defenders. For one shining moment, Ashenmere is untouchable.',
      ],
      dialogue: [
        {
          speaker: 'elara_dawnwhisper',
          text: 'It will hold until sunset. After that, I cannot guarantee anything. We need to make those hours count.',
          mood: 'hopeful',
        },
      ],
      choices: [
        {
          id: 'ch7_ward_to_crisis',
          text: 'Use the reprieve to attend Thorne\'s war council.',
          consequences: [],
          targetScene: 'ch7_thornes_crisis',
        },
      ],
    },

    {
      id: 'ch7_ward_fails',
      chapter: 7,
      title: 'Backlash',
      location: 'Ashenmere — Temple Undercroft',
      artPrompt: 'A shattered magic circle with unconscious mages, cracked stone floor glowing with residual energy, dark fantasy',
      description: [
        'The ley-line bucks like a wounded horse. The circle shatters — not gradually but all at once, the silver dust igniting in a flash that leaves you blind and deaf. When your senses return, you are on the floor, tasting blood.',
        'Elara is alive but unconscious, her nose bleeding freely. Two of the three other mages are not moving. The undercroft walls are cracked, and through the fissures you can see the pale glow of the exposed ley-line, pulsing like an infected wound.',
      ],
      dialogue: [
        {
          speaker: 'narrator',
          text: 'You carry Elara from the ruins of the temple. Above, the siege continues unabated. The wall will have to hold on steel and stubbornness alone.',
        },
      ],
      choices: [
        {
          id: 'ch7_ward_fail_to_crisis',
          text: 'Get Elara to safety and report to Thorne.',
          consequences: [
            { type: 'damage', value: 20 },
            { type: 'set_flag', flagId: 'ch7_elara_wounded', value: true },
          ],
          targetScene: 'ch7_thornes_crisis',
        },
      ],
    },

    // ── SCENE 7: Siege Aftermath (Chapter Exit) ──
    {
      id: 'ch7_siege_aftermath',
      chapter: 7,
      title: 'Ashes and Oaths',
      location: 'Ashenmere — Central Square',
      artPrompt:
        'A battle-scarred medieval city square at dusk, survivors gathering among rubble, smoke rising, somber atmosphere, dark fantasy',
      description: [
        'The siege ends — not with triumph but with exhaustion. The attacking army withdraws at dusk, not routed but spent, dragging its wounded through mud churned to red clay. Ashenmere still stands, though "stands" may be generous. The eastern quarter is rubble. The granaries are burning. The well in the market square is choked with debris.',
        'In the central square, survivors gather in the failing light. Soldiers and civilians alike, their faces identical masks of shock and fatigue. Someone has placed candles on the steps of the ruined temple — hundreds of them, one for each of the fallen.',
        'Captain Thorne watches the candles flicker from the steps of the command tower. His decision — whatever it was — is made. The consequences will unfold in the days to come.',
      ],
      dialogue: [
        {
          speaker: 'captain_thorne',
          text: 'Whatever comes next, Vane — whatever we\'ve set in motion today — remember that we chose. Not the crown, not the gods, not fate. We chose.',
          mood: 'sad',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'The investigation. The king\'s death. It all connects to this — to Ashenmere, to the ley-line beneath it. I can feel it, Aldric. The truth is close now.',
          mood: 'hopeful',
        },
        {
          speaker: 'narrator',
          text: 'Night falls over Ashenmere, and with it comes a silence deeper than sleep. Tomorrow you will seek the truth. Tonight, you mourn.',
        },
      ],
      choices: [
        {
          id: 'ch7_to_chapter_8',
          text: 'Rest, and prepare to pursue the truth behind the king\'s assassination.',
          consequences: [
            { type: 'set_flag', flagId: 'ch7_complete', value: true },
          ],
          targetScene: 'ch8_the_dead_kings_shadow',
        },
      ],
    },
  ],
};
