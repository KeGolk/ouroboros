import { Chapter } from '../../../types/narrative';

const chapter02: Chapter = {
  id: 'ch02',
  number: 2,
  title: 'The Conclave of Wolves',
  subtitle: 'In which the factions reveal their teeth',
  description:
    'The four factions gather at the Grand Conclave to determine Valdris\'s future. Each leader makes their case, and you must decide whom to approach — and whom to spy upon. Alliances forged here will echo through the entire story.',
  imagePrompt:
    'A grand medieval council chamber with four faction banners hanging from stone pillars, leaders arguing around a massive round table, candlelight and tension, oil painting style, rich dark colors',
  startNodeId: 'ch02_start',
  availableFactions: ['iron_covenant', 'verdant_court', 'obsidian_circle', 'ashen_throne'],
  keyCharacters: ['commander_vareth', 'archdruid_elara', 'magister_thorn', 'princess_isolde', 'duke_maren'],
  minLevel: 2,
  nodes: [
    {
      id: 'ch02_start',
      chapterId: 'ch02',
      title: 'The Grand Hall',
      text: 'The Conclave convenes in the Hall of Kings — stripped now of royal banners, its walls hung instead with the sigils of four factions who each believe they should fill the void. The air crackles with barely contained hostility.\n\nCommander Vareth stands rigid in full armor, flanked by soldiers. Archdruid Elara sits cross-legged on the stone floor, ignoring the provided chair. Magister Thorn studies everyone with those unsettling violet eyes. And Princess Isolde — returned from exile — stands apart, her gaze fixed on her father\'s empty throne.\n\nYou have been granted observer status, courtesy of whatever connections you\'ve made. But observers in Valdris have a habit of becoming players.',
      imagePrompt: 'Interior of a vast medieval hall with four distinct groups of people in faction colors, an empty throne on a raised dais, tension palpable, oil painting style',
      choices: [
        {
          id: 'ch02_approach_vareth',
          text: 'Approach Commander Vareth\'s delegation.',
          targetNode: 'ch02_iron_meeting',
          consequences: [
            { type: 'faction_rep', target: 'iron_covenant', value: 5 },
          ],
        },
        {
          id: 'ch02_approach_elara',
          text: 'Approach Archdruid Elara.',
          targetNode: 'ch02_verdant_meeting',
          consequences: [
            { type: 'faction_rep', target: 'verdant_court', value: 5 },
          ],
        },
        {
          id: 'ch02_approach_thorn',
          text: 'Approach Magister Thorn.',
          targetNode: 'ch02_obsidian_meeting',
          consequences: [
            { type: 'faction_rep', target: 'obsidian_circle', value: 5 },
          ],
        },
        {
          id: 'ch02_approach_isolde',
          text: 'Approach Princess Isolde.',
          targetNode: 'ch02_ashen_meeting',
          consequences: [
            { type: 'faction_rep', target: 'ashen_throne', value: 5 },
          ],
        },
        {
          id: 'ch02_observe_all',
          text: 'Watch from the gallery. Information is more valuable than introductions.',
          targetNode: 'ch02_observe',
          consequences: [
            { type: 'grant_xp', target: 'cunning', value: 10 },
          ],
        },
      ],
    },
    {
      id: 'ch02_iron_meeting',
      chapterId: 'ch02',
      title: 'The Commander\'s Proposition',
      text: 'Vareth wastes no time on pleasantries. His mechanical hand grips the table edge, leaving scratches in the wood.\n\n"Valdris needs order, not debate. While these politicians talk, bandits raid the countryside, border lords arm their garrisons, and our enemies sharpen their swords. I propose a military governorship — temporary, until stability is restored. I need capable people. Your family served the crown once. Serve the realm now."\n\nSer Brynn, standing behind him, catches your eye. Her expression says: *He means well, but...*',
      speaker: 'commander_vareth',
      choices: [
        {
          id: 'ch02_accept_iron',
          text: '"The realm needs stability. I\'ll hear your full proposal."',
          targetNode: 'ch02_iron_alliance',
          consequences: [
            { type: 'faction_rep', target: 'iron_covenant', value: 15 },
            { type: 'set_relationship', target: 'commander_vareth', value: 15 },
          ],
        },
        {
          id: 'ch02_question_iron',
          text: '"Temporary power has a way of becoming permanent, Commander."',
          targetNode: 'ch02_iron_tension',
          consequences: [
            { type: 'set_relationship', target: 'commander_vareth', value: -5 },
            { type: 'grant_xp', target: 'cunning', value: 5 },
          ],
        },
        {
          id: 'ch02_decline_iron',
          text: '"I need to hear all sides before I commit to any."',
          targetNode: 'ch02_conclave_debate',
        },
      ],
    },
    {
      id: 'ch02_verdant_meeting',
      chapterId: 'ch02',
      title: 'The Archdruid\'s Vision',
      text: 'Elara does not rise when you approach. Instead, she gestures for you to sit on the stone floor beside her. It is, you realize, a test.\n\n"The old ways were council and consensus, before kings claimed divine right to rule alone," she says, her voice like wind through ancient trees. "I do not seek power. I seek balance. The land is sick — you can feel it, can\'t you? The rivers run fouler, the harvests thin. A realm in turmoil wounds the earth itself."\n\nHer moss-green eyes study you. "You have lost much. Loss can make one seek control, or it can teach one to let go. Which are you?"',
      speaker: 'archdruid_elara',
      choices: [
        {
          id: 'ch02_accept_verdant',
          text: '"I\'ve seen what the pursuit of power costs. Perhaps the old ways are worth trying."',
          targetNode: 'ch02_verdant_alliance',
          consequences: [
            { type: 'faction_rep', target: 'verdant_court', value: 15 },
            { type: 'set_relationship', target: 'archdruid_elara', value: 15 },
          ],
        },
        {
          id: 'ch02_challenge_verdant',
          text: '"Councils are slow. People are dying now. Can your old ways stop an army?"',
          targetNode: 'ch02_verdant_tension',
          consequences: [
            { type: 'set_relationship', target: 'archdruid_elara', value: -5 },
            { type: 'grant_xp', target: 'cunning', value: 5 },
          ],
        },
        {
          id: 'ch02_decline_verdant',
          text: '"I need time to consider. Forgive me, Archdruid."',
          targetNode: 'ch02_conclave_debate',
        },
      ],
    },
    {
      id: 'ch02_obsidian_meeting',
      chapterId: 'ch02',
      title: 'The Magister\'s Offer',
      text: 'Thorn does not approach you. He was already waiting, as if he knew exactly where you would walk. A goblet of wine appears in his hand — you didn\'t see him pour it.\n\n"The others will offer you purpose, belonging, righteousness. I offer only truth." His violet eyes gleam. "The king\'s assassination was not the act of a lone fanatic. It was engineered — precisely, surgically — by someone who understood the political machinery of Valdris. Someone who wanted exactly this chaos."\n\nHe sips his wine. "I know who. The price of that knowledge is your cooperation. The Obsidian Circle has resources the other factions cannot imagine. We require only... talented individuals who can move between worlds."',
      speaker: 'magister_thorn',
      choices: [
        {
          id: 'ch02_accept_obsidian',
          text: '"Truth is exactly what I came here for. What do you need?"',
          targetNode: 'ch02_obsidian_alliance',
          consequences: [
            { type: 'faction_rep', target: 'obsidian_circle', value: 15 },
            { type: 'set_relationship', target: 'magister_thorn', value: 10 },
          ],
        },
        {
          id: 'ch02_demand_proof',
          text: '"Prove it. Give me one name, one fact, before I agree to anything."',
          targetNode: 'ch02_obsidian_proof',
          consequences: [
            { type: 'grant_xp', target: 'cunning', value: 10 },
          ],
        },
        {
          id: 'ch02_decline_obsidian',
          text: '"I don\'t deal in shadows. If you know the truth, share it with the Conclave."',
          targetNode: 'ch02_conclave_debate',
          consequences: [
            { type: 'set_relationship', target: 'magister_thorn', value: -10 },
          ],
        },
      ],
    },
    {
      id: 'ch02_ashen_meeting',
      chapterId: 'ch02',
      title: 'The Princess\'s Burden',
      text: 'Isolde stands alone near the empty throne, one hand resting on its armrest. She doesn\'t flinch when you approach — she was watching your reflection in the polished stone.\n\n"House Ashenmere," she says quietly. "My father destroyed your family. I know. I spoke against it and was exiled for my trouble." A bitter smile. "Now they want me to sit in his chair as if nothing happened."\n\nShe turns to face you fully. Her eyes are her father\'s — steel grey — but there\'s something behind them he never had. Doubt. "I could restore your family\'s lands, your title. I could be a better ruler than he was. But I need allies who aren\'t just hunting for scraps from the royal table. I need people who\'ll tell me when I\'m wrong."',
      speaker: 'princess_isolde',
      choices: [
        {
          id: 'ch02_accept_ashen',
          text: '"Your father wronged my house, but you stood against him. That counts for something."',
          targetNode: 'ch02_ashen_alliance',
          consequences: [
            { type: 'faction_rep', target: 'ashen_throne', value: 15 },
            { type: 'set_relationship', target: 'princess_isolde', value: 20 },
          ],
        },
        {
          id: 'ch02_test_isolde',
          text: '"Pretty words. But how are you different from every other noble who promises reform?"',
          targetNode: 'ch02_ashen_tension',
          consequences: [
            { type: 'set_relationship', target: 'princess_isolde', value: 5 },
            { type: 'grant_xp', target: 'cunning', value: 10 },
          ],
        },
        {
          id: 'ch02_decline_ashen',
          text: '"I\'m not ready to serve any throne yet. But I wish you well, Princess."',
          targetNode: 'ch02_conclave_debate',
        },
      ],
    },
    {
      id: 'ch02_observe',
      chapterId: 'ch02',
      title: 'Eyes in the Gallery',
      text: 'From the gallery, you see what those on the floor cannot: the patterns. Duke Maren whispers to an Obsidian Circle aide. Vareth\'s soldiers are positioned at every exit. Elara\'s druids have brought seedlings — strange ones that pulse with faint light. And Isolde\'s hand keeps drifting to a concealed dagger at her hip.\n\nYou also notice someone else watching from the shadows across the gallery. A woman with arcane tattoos on her scalp and a knowing smirk. She catches your eye and mouths a single word: "Impressive."\n\nLysara Vex, the Obsidian Circle\'s Shadow Archivist, has noticed you noticing things.',
      speaker: 'lysara',
      choices: [
        {
          id: 'ch02_approach_lysara',
          text: 'Cross the gallery to speak with Lysara.',
          targetNode: 'ch02_lysara_meeting',
          consequences: [
            { type: 'set_relationship', target: 'lysara', value: 15 },
            { type: 'faction_rep', target: 'obsidian_circle', value: 5 },
          ],
        },
        {
          id: 'ch02_ignore_continue_watching',
          text: 'Ignore her and continue watching the delegations.',
          targetNode: 'ch02_conclave_debate',
          consequences: [
            { type: 'grant_xp', target: 'cunning', value: 5 },
          ],
        },
      ],
    },
    // ── Alliance nodes (brief, lead to debate) ──
    {
      id: 'ch02_iron_alliance',
      chapterId: 'ch02',
      title: 'The Iron Handshake',
      text: 'Vareth grips your hand with his mechanical one — the pressure carefully calibrated, but the message clear. You are now known as a Covenant sympathizer. This will open doors and close others.\n\n"Attend the debate. Listen to what the others say. Report to me after. That\'s all I ask — for now."\n\nSer Brynn falls into step beside you as you leave. "He\'s not a bad man," she says quietly. "But he sees everything as a battle to be won. Just... keep your eyes open. For both of us."',
      speaker: 'commander_vareth',
      consequences: [
        { type: 'recruit_character', target: 'ser_brynn', value: true },
      ],
      choices: [
        { id: 'ch02_to_debate_iron', text: 'Attend the Conclave debate.', targetNode: 'ch02_conclave_debate' },
      ],
    },
    {
      id: 'ch02_verdant_alliance',
      chapterId: 'ch02',
      title: 'Roots and Oaths',
      text: 'Elara places a living seed in your palm. It pulses with warmth. "Carry this. The Heartwood listens through it. You need not swear loyalty — the land does not demand oaths, only respect."\n\nShe smiles, and for a moment she looks impossibly old and impossibly young at once. "Go. Listen to the others. Learn what you can. The Court will be here when the wind changes — we always are."',
      speaker: 'archdruid_elara',
      consequences: [
        { type: 'give_item', target: 'thornweave_seed', value: true },
      ],
      choices: [
        { id: 'ch02_to_debate_verdant', text: 'Attend the Conclave debate.', targetNode: 'ch02_conclave_debate' },
      ],
    },
    {
      id: 'ch02_obsidian_alliance',
      chapterId: 'ch02',
      title: 'The Compact',
      text: 'Thorn produces a small obsidian pendant. "Wear this beneath your clothes. It identifies you to Circle agents. They will find you when needed — don\'t try to find them."\n\nHis smile is thin as a knife-edge. "Welcome to the only faction that tells you upfront that it\'s manipulating you. The others do it too; they\'re just less honest about it."',
      speaker: 'magister_thorn',
      choices: [
        { id: 'ch02_to_debate_obsidian', text: 'Attend the Conclave debate.', targetNode: 'ch02_conclave_debate' },
      ],
    },
    {
      id: 'ch02_ashen_alliance',
      chapterId: 'ch02',
      title: 'A Crown\'s Weight',
      text: 'Isolde produces a document — your family\'s deed of nobility, which you thought destroyed in the purge. "Duke Maren preserved it. He preserves everything that might be useful someday." Her tone carries warning.\n\n"Keep it safe. When I take the throne, I\'ll need honest voices at my council. The realm has had enough of yes-men."',
      speaker: 'princess_isolde',
      choices: [
        { id: 'ch02_to_debate_ashen', text: 'Attend the Conclave debate.', targetNode: 'ch02_conclave_debate' },
      ],
    },
    // ── Tension nodes ──
    {
      id: 'ch02_iron_tension',
      chapterId: 'ch02',
      title: 'A Soldier\'s Honesty',
      text: 'Vareth\'s mechanical hand clenches. "You think I want this? I\'m a soldier. I\'d rather be on a border wall than in a council chamber. But soldiers are what\'s needed now. When the realm is safe, I\'ll step aside." He meets your eyes. "You have my word."\n\nWhether that word is worth anything remains to be seen.',
      speaker: 'commander_vareth',
      choices: [
        { id: 'ch02_to_debate_iron2', text: 'Attend the Conclave debate.', targetNode: 'ch02_conclave_debate' },
      ],
    },
    {
      id: 'ch02_verdant_tension',
      chapterId: 'ch02',
      title: 'The Archdruid\'s Edge',
      text: 'Elara\'s patient expression doesn\'t waver, but something shifts behind her eyes — ancient and cold as deep water.\n\n"The Thornwood stopped three invasions before any army drew a sword. The old ways are not slow — they are patient. There is a difference." She plucks a stone from the floor and closes her fist. When she opens it, a flower blooms in her palm. "Patience creates. Haste destroys. Which has the realm had too much of?"',
      speaker: 'archdruid_elara',
      choices: [
        { id: 'ch02_to_debate_verdant2', text: 'Attend the Conclave debate.', targetNode: 'ch02_conclave_debate' },
      ],
    },
    {
      id: 'ch02_obsidian_proof',
      chapterId: 'ch02',
      title: 'A Fragment of Truth',
      text: 'Thorn inclines his head, as if you passed a test. "Very well. One name: Duke Maren. He was in correspondence with parties unknown for six months before the assassination. The letters were written in a cipher the Circle has only partially broken. The Duke smiles and pours wine, but his hands are not clean."\n\nHe sips. "Partial truth, freely given. The rest requires... investment."',
      speaker: 'magister_thorn',
      consequences: [
        { type: 'grant_xp', target: 'intelligence', value: 10 },
      ],
      choices: [
        {
          id: 'ch02_accept_after_proof',
          text: '"That\'s enough to start. I\'m in."',
          targetNode: 'ch02_obsidian_alliance',
          consequences: [
            { type: 'faction_rep', target: 'obsidian_circle', value: 10 },
          ],
        },
        {
          id: 'ch02_take_info_leave',
          text: 'Take the information but don\'t commit. Head to the debate.',
          targetNode: 'ch02_conclave_debate',
        },
      ],
    },
    {
      id: 'ch02_ashen_tension',
      chapterId: 'ch02',
      title: 'The Princess Tested',
      text: 'Isolde doesn\'t flinch. "Fair question. Here\'s my answer: I\'m different because I know what it\'s like to be powerless. I was exiled, hunted, stripped of everything. Most nobles who promise reform have never lived without servants. I\'ve slept in barns and begged for bread."\n\nShe leans close. "But if that\'s not enough — watch Duke Maren. He supports me publicly, but I\'ve caught him in three lies this week. If I can distrust my own allies, you can trust that I\'m not naive."',
      speaker: 'princess_isolde',
      consequences: [
        { type: 'grant_xp', target: 'cunning', value: 5 },
      ],
      choices: [
        { id: 'ch02_to_debate_ashen2', text: 'Attend the Conclave debate.', targetNode: 'ch02_conclave_debate' },
      ],
    },
    {
      id: 'ch02_lysara_meeting',
      chapterId: 'ch02',
      title: 'The Shadow Archivist',
      text: 'Lysara drops from her perch with catlike grace. "You\'ve got good eyes. Most people down there are too busy performing to notice who\'s watching. You and me, we\'re the watchers."\n\nShe pulls out a worn leather journal. "I keep track of interesting people. You just made the list. I work for the Circle, but I trade in information, not ideology. If you ever need to know something — or need someone to not know something — find me at the Broken Crown tavern. Ask for the house special."',
      speaker: 'lysara',
      consequences: [
        { type: 'recruit_character', target: 'lysara', value: true },
      ],
      choices: [
        { id: 'ch02_to_debate_lysara', text: 'Head down to the Conclave debate.', targetNode: 'ch02_conclave_debate' },
      ],
    },
    {
      id: 'ch02_conclave_debate',
      chapterId: 'ch02',
      title: 'The Conclave Erupts',
      text: 'The debate is a controlled explosion. Vareth demands martial law. Elara calls for dissolution of the monarchy. Thorn proposes a "meritocratic council" that everyone recognizes as a power grab. Isolde claims the throne by blood right and promises reform.\n\nDuke Maren, sitting behind Isolde, smiles through it all like a man watching children argue over a toy.\n\nThen someone throws a knife.\n\nIt misses Isolde by inches, embedding in the throne. Chaos erupts. In the pandemonium, you see the thrower — a hooded figure — fleeing through a side passage. You have seconds to act.',
      choices: [
        {
          id: 'ch02_chase_assassin',
          text: 'Chase the assassin!',
          targetNode: 'ch02_chase',
          consequences: [
            { type: 'grant_xp', target: 'strength', value: 10 },
          ],
        },
        {
          id: 'ch02_protect_isolde',
          text: 'Shield Princess Isolde.',
          targetNode: 'ch02_protect',
          consequences: [
            { type: 'faction_rep', target: 'ashen_throne', value: 15 },
            { type: 'set_relationship', target: 'princess_isolde', value: 15 },
          ],
        },
        {
          id: 'ch02_watch_reactions',
          text: 'Don\'t move. Watch who reacts and how.',
          targetNode: 'ch02_observe_chaos',
          consequences: [
            { type: 'grant_xp', target: 'cunning', value: 15 },
          ],
        },
      ],
    },
    {
      id: 'ch02_chase',
      chapterId: 'ch02',
      title: 'The Pursuit',
      text: 'You sprint after the hooded figure through winding corridors. They\'re fast, but you know these halls — you played in them as a child.\n\nYou corner them in a dead-end stairwell. They turn, and you catch a glimpse of their face before they swallow something — a capsule. Their eyes go wide, then vacant. They crumple.\n\nDead in seconds. Poison pill. Whoever sent them wanted no loose ends.\n\nBut in their hand, you find a scrap of parchment bearing a symbol you don\'t recognize — a serpent swallowing its own tail.',
      statCheck: {
        stat: 'strength',
        difficulty: 10,
        successNode: 'ch02_chase',
        failureNode: 'ch02_chase_failed',
        description: 'Chase down the fleeing assassin',
      },
      consequences: [
        { type: 'grant_xp', target: 'intelligence', value: 10 },
        { type: 'set_flag', target: 'found_serpent_symbol', value: true },
      ],
      choices: [
        { id: 'ch02_report_find', text: 'Return to the hall with what you found.', targetNode: 'ch02_end' },
      ],
    },
    {
      id: 'ch02_chase_failed',
      chapterId: 'ch02',
      title: 'Lost in the Corridors',
      text: 'The assassin is too fast. You lose them in the warren of passages beneath the palace. By the time you find your way back, the hall is in lockdown and Covenant soldiers are searching everyone.\n\nThe assassin is gone. The knife is being examined. And every faction is pointing fingers at every other faction.',
      choices: [
        { id: 'ch02_return_to_hall', text: 'Return to the hall.', targetNode: 'ch02_end' },
      ],
    },
    {
      id: 'ch02_protect',
      chapterId: 'ch02',
      title: 'A Shield for the Princess',
      text: 'You throw yourself between Isolde and danger. There is no second knife, but the gesture is noted — by Isolde, by Vareth, by everyone.\n\nIsolde grips your arm, her composure cracking for just a moment. "Thank you," she whispers. Then, louder, to the hall: "This is what happens when we argue instead of act. Someone wants us divided. Are we going to give them what they want?"\n\nDuke Maren, you notice, is already gone from his seat.',
      speaker: 'princess_isolde',
      consequences: [
        { type: 'set_flag', target: 'maren_suspicious_absence', value: true },
      ],
      choices: [
        { id: 'ch02_note_maren', text: 'Note Duke Maren\'s absence.', targetNode: 'ch02_end' },
      ],
    },
    {
      id: 'ch02_observe_chaos',
      chapterId: 'ch02',
      title: 'The Truth in Chaos',
      text: 'While others panic, you watch. And you see everything.\n\nVareth\'s soldiers move too quickly — they were already positioned for this. Elara doesn\'t flinch at the knife but watches Thorn. Thorn watches Duke Maren. And Maren — Maren glances at the side passage where the assassin fled, then deliberately looks away.\n\nHe knew. He may not have thrown the knife, but he knew it was coming.\n\nYou file this away. Mireth\'s compass, if you carry it, grows warm against your chest.',
      consequences: [
        { type: 'set_flag', target: 'maren_suspicious_absence', value: true },
        { type: 'set_flag', target: 'observed_conclave_tells', value: true },
        { type: 'grant_xp', target: 'cunning', value: 10 },
      ],
      choices: [
        { id: 'ch02_act_on_knowledge', text: 'The Conclave is adjourned. Time to act on what you saw.', targetNode: 'ch02_end' },
      ],
    },
    {
      id: 'ch02_end',
      chapterId: 'ch02',
      title: 'After the Storm',
      text: 'The Conclave is suspended. Each faction retreats to its quarters, bristling with suspicion. The city tightens like a fist.\n\nBack at the Broken Crown, you take stock. You\'ve made contacts — perhaps allies, perhaps handlers. Someone tried to kill the princess, and someone else ensured the assassin couldn\'t talk. The serpent symbol, if you found it, burns in your mind.\n\nThe factions will regroup. The game continues. And you are no longer just an observer.\n\nYou are a piece on the board — or perhaps, if you\'re clever enough, a player.',
      isEndNode: true,
      choices: [],
    },
  ],
};

export default chapter02;
