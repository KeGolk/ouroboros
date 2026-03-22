import { Chapter } from '../../../types/narrative';

const chapter03: Chapter = {
  id: 'ch03',
  number: 3,
  title: 'Shadows in the Archive',
  subtitle: 'In which secrets are uncovered and alliances tested',
  description:
    'Following the assassination attempt at the Conclave, you investigate the mysterious serpent symbol and Duke Maren\'s suspicious behavior. The Obsidian Circle\'s hidden library holds answers — if you can gain access.',
  imagePrompt:
    'A vast underground library carved from dark stone, shelves of ancient tomes lit by floating purple orbs, a cloaked figure searching through scrolls, oil painting style, deep purples and golds',
  startNodeId: 'ch03_start',
  availableFactions: ['obsidian_circle', 'ashen_throne'],
  keyCharacters: ['lysara', 'magister_thorn', 'duke_maren', 'mireth'],
  minLevel: 3,
  nodes: [
    {
      id: 'ch03_start',
      chapterId: 'ch03',
      title: 'The Trail of Ink and Blood',
      text: 'Three days after the Conclave, the city simmers. Covenant patrols have doubled. The factions negotiate behind closed doors. And you follow the only lead you have — the serpent symbol.\n\nLysara finds you first, appearing at your elbow in the Broken Crown as if she\'d been there all along. "That symbol you\'re asking about? Stop asking about it in public. People who ask about the Ouroboros tend to disappear."\n\nShe slides a brass key across the table. "The Circle\'s Lower Archive. Tonight. Come alone, or don\'t come at all."',
      speaker: 'lysara',
      choices: [
        {
          id: 'ch03_go_archive',
          text: 'Go to the Lower Archive tonight.',
          targetNode: 'ch03_archive_entrance',
          consequences: [
            { type: 'faction_rep', target: 'obsidian_circle', value: 5 },
          ],
        },
        {
          id: 'ch03_investigate_maren',
          text: 'Forget the Archive. Investigate Duke Maren\'s quarters instead.',
          targetNode: 'ch03_maren_spy',
          consequences: [
            { type: 'grant_xp', target: 'dexterity', value: 10 },
          ],
        },
        {
          id: 'ch03_consult_mireth',
          text: 'Seek out Mireth first. She knows more than she\'s told you.',
          targetNode: 'ch03_mireth_counsel',
          conditions: [
            { type: 'item_possessed', target: 'mireths_compass', operator: '==', value: true },
          ],
        },
      ],
    },
    {
      id: 'ch03_archive_entrance',
      chapterId: 'ch03',
      title: 'The Lower Archive',
      text: 'The Archive is beneath the old university, accessed through a crypt that smells of dust and old magic. The brass key turns with a click, and you descend into a cathedral of knowledge.\n\nShelves stretch into darkness, lit by floating orbs of pale violet light. Lysara waits at a reading desk, surrounded by open tomes. Beside her stands Magister Thorn, who regards you with those unsettling violet eyes.\n\n"The Ouroboros," Thorn says without preamble, "is not a faction. It is an idea — a philosophy that the cycle of kings and conquerors must be broken entirely. Not reformed. Not replaced. Ended."\n\nHe opens a book to a page showing the serpent symbol. "Someone has resurrected this philosophy and weaponized it. The king\'s assassination was just the beginning."',
      speaker: 'magister_thorn',
      choices: [
        {
          id: 'ch03_study_texts',
          text: 'Study the texts carefully. What does the Ouroboros philosophy actually prescribe?',
          targetNode: 'ch03_deep_study',
          consequences: [
            { type: 'grant_xp', target: 'intelligence', value: 15 },
          ],
          statCheck: {
            stat: 'intelligence',
            difficulty: 10,
            successNode: 'ch03_deep_study',
            failureNode: 'ch03_surface_study',
            description: 'Decipher the ancient texts about the Ouroboros',
          },
        },
        {
          id: 'ch03_demand_names',
          text: '"Philosophy doesn\'t throw knives. Who is behind this — names, Thorn."',
          targetNode: 'ch03_thorn_suspects',
          consequences: [
            { type: 'set_relationship', target: 'magister_thorn', value: -5 },
          ],
        },
        {
          id: 'ch03_ask_lysara_privately',
          text: 'Pull Lysara aside. "Is Thorn telling me everything?"',
          targetNode: 'ch03_lysara_truth',
          consequences: [
            { type: 'set_relationship', target: 'lysara', value: 10 },
          ],
        },
      ],
    },
    {
      id: 'ch03_deep_study',
      chapterId: 'ch03',
      title: 'The Serpent\'s Doctrine',
      text: 'Hours pass as you read. The Ouroboros texts are old — pre-dating the current dynasty by centuries. They describe a cycle: power concentrates, corrupts, collapses, and reconcentrates. The serpent eating its tail. The philosophy argues that the only way to break the cycle is to destroy the mechanisms of power itself — thrones, armies, magical institutions.\n\nBut here, in a margin, someone has written in fresh ink: "The cycle breaks when all four pillars fall simultaneously." Four pillars. Four factions.\n\nSomeone isn\'t trying to seize power. They\'re trying to destroy the concept of centralized power entirely — by making every faction destroy each other.',
      consequences: [
        { type: 'set_flag', target: 'learned_assassination_truth', value: true },
        { type: 'grant_xp', target: 'intelligence', value: 10 },
      ],
      choices: [
        {
          id: 'ch03_share_discovery',
          text: 'Share your discovery with Thorn and Lysara.',
          targetNode: 'ch03_shared_knowledge',
          consequences: [
            { type: 'faction_rep', target: 'obsidian_circle', value: 10 },
          ],
        },
        {
          id: 'ch03_keep_secret',
          text: 'Keep this insight to yourself. Knowledge is leverage.',
          targetNode: 'ch03_archive_exit',
          consequences: [
            { type: 'grant_xp', target: 'cunning', value: 15 },
          ],
        },
      ],
    },
    {
      id: 'ch03_surface_study',
      chapterId: 'ch03',
      title: 'Fragments',
      text: 'The texts are dense and archaic. You glean the basics — the Ouroboros philosophy opposes all centralized power — but the deeper implications elude you. Lysara notices your frustration.\n\n"Don\'t feel bad. It took me three months to crack the cipher on these texts, and I grew up reading banned books." She points to a passage. "The key bit: they believe destroying all four pillars of power will break what they call \'the cycle.\' Four pillars. Four factions."',
      speaker: 'lysara',
      consequences: [
        { type: 'set_flag', target: 'learned_assassination_truth', value: true },
      ],
      choices: [
        {
          id: 'ch03_surface_continue',
          text: 'Consider the implications.',
          targetNode: 'ch03_shared_knowledge',
        },
      ],
    },
    {
      id: 'ch03_thorn_suspects',
      chapterId: 'ch03',
      title: 'The Magister\'s List',
      text: 'Thorn\'s eyes narrow. "Names. Very well. Three people had the resources, knowledge, and motive to engineer the assassination in this manner. Duke Maren — who profits from chaos to increase his own influence. A woman called Mireth Greymantle — who has connections to every faction and allegiance to none. And..." He pauses. "...myself."\n\nThe silence stretches. "I include myself because intellectual honesty demands it. I have the capability. Whether I have the motive, you must judge for yourself."',
      speaker: 'magister_thorn',
      consequences: [
        { type: 'grant_xp', target: 'cunning', value: 10 },
      ],
      choices: [
        {
          id: 'ch03_believe_thorn',
          text: '"The fact that you named yourself earns you some trust. Let\'s focus on Maren."',
          targetNode: 'ch03_shared_knowledge',
          consequences: [
            { type: 'set_relationship', target: 'magister_thorn', value: 10 },
          ],
        },
        {
          id: 'ch03_suspect_thorn',
          text: '"Or you named yourself to seem transparent while hiding in plain sight."',
          targetNode: 'ch03_archive_exit',
          consequences: [
            { type: 'set_relationship', target: 'magister_thorn', value: -10 },
            { type: 'grant_xp', target: 'cunning', value: 5 },
          ],
        },
      ],
    },
    {
      id: 'ch03_lysara_truth',
      chapterId: 'ch03',
      title: 'Between the Lines',
      text: 'Lysara glances at Thorn, then pulls you behind a shelf. "Is he telling you everything? Ha. Thorn never tells anyone everything. But here\'s what I know that he won\'t say: the Circle has been studying the Ouroboros philosophy for decades. Not to stop it — to use it. Thorn believes the cycle of power can be broken through knowledge, not destruction. But some in the Circle disagree."\n\nShe bites her lip. "There\'s a faction within the faction. Thorn is fighting a war on two fronts, and he needs you more than he\'ll admit."',
      speaker: 'lysara',
      consequences: [
        { type: 'grant_xp', target: 'cunning', value: 10 },
      ],
      choices: [
        {
          id: 'ch03_use_leverage',
          text: '"Good. That means I have leverage. Let\'s see what else is in this Archive."',
          targetNode: 'ch03_deep_study',
        },
        {
          id: 'ch03_warn_lysara',
          text: '"Be careful, Lysara. Divided loyalties get people killed."',
          targetNode: 'ch03_shared_knowledge',
          consequences: [
            { type: 'set_relationship', target: 'lysara', value: 5 },
          ],
        },
      ],
    },
    {
      id: 'ch03_shared_knowledge',
      chapterId: 'ch03',
      title: 'The Conspiracy Revealed',
      text: 'The three of you piece it together: someone is manipulating events to turn the four factions against each other — not to seize power, but to destroy all power structures simultaneously. The Conclave assassination attempt was designed to make each faction suspect the others.\n\nThorn strokes his chin. "We must determine who is behind this before they succeed. Each faction will receive false evidence implicating the others. The question is: do we share this knowledge, or use it?"\n\nLysara rolls her eyes. "See? Even knowing someone\'s trying to make us fight, his first instinct is \'how do I exploit this.\'"',
      choices: [
        {
          id: 'ch03_share_with_all',
          text: '"We share it with all factions. United against a common enemy."',
          targetNode: 'ch03_unity_attempt',
          consequences: [
            { type: 'faction_rep', target: 'iron_covenant', value: 5 },
            { type: 'faction_rep', target: 'verdant_court', value: 5 },
            { type: 'faction_rep', target: 'ashen_throne', value: 5 },
            { type: 'set_flag', target: 'forged_alliance', value: true },
          ],
        },
        {
          id: 'ch03_share_selective',
          text: '"Share it only with our strongest ally. Trust must be earned."',
          targetNode: 'ch03_selective_share',
          consequences: [
            { type: 'grant_xp', target: 'cunning', value: 10 },
          ],
        },
        {
          id: 'ch03_keep_for_circle',
          text: '"The Circle should control this information. Knowledge is power."',
          targetNode: 'ch03_archive_exit',
          consequences: [
            { type: 'faction_rep', target: 'obsidian_circle', value: 15 },
            { type: 'set_relationship', target: 'magister_thorn', value: 10 },
          ],
        },
      ],
    },
    {
      id: 'ch03_maren_spy',
      chapterId: 'ch03',
      title: 'The Duke\'s Chambers',
      text: 'Duke Maren\'s quarters are in the palace\'s east wing — luxurious, well-guarded, and occupied. You watch from a rooftop across the courtyard as servants come and go.\n\nAt midnight, a cloaked figure arrives at Maren\'s door. Not a servant — they move with purpose and secrecy. Through the window, you see Maren hand them a sealed letter and a heavy purse.\n\nThe figure leaves by a servants\' passage. You can follow them or search Maren\'s study while he sleeps.',
      choices: [
        {
          id: 'ch03_follow_messenger',
          text: 'Follow the cloaked messenger.',
          targetNode: 'ch03_messenger_trail',
          statCheck: {
            stat: 'dexterity',
            difficulty: 12,
            successNode: 'ch03_messenger_caught',
            failureNode: 'ch03_messenger_lost',
            description: 'Shadow the messenger through the city',
          },
        },
        {
          id: 'ch03_search_study',
          text: 'Break into Maren\'s study while he sleeps.',
          targetNode: 'ch03_maren_study',
          statCheck: {
            stat: 'dexterity',
            difficulty: 14,
            successNode: 'ch03_maren_study',
            failureNode: 'ch03_maren_caught',
            description: 'Infiltrate the Duke\'s private study undetected',
          },
        },
      ],
    },
    {
      id: 'ch03_messenger_caught',
      chapterId: 'ch03',
      title: 'The Dead Drop',
      text: 'You follow the messenger through winding alleys to a dead drop beneath the old bridge. They leave the letter in a hollow stone and depart. You retrieve it.\n\nThe letter is in cipher, but you recognize enough to understand: Maren is in contact with agents provocateurs planted in every faction. He\'s feeding misinformation to each one, stoking their paranoia. The man behind the genial smile is orchestrating the very chaos that keeps him indispensable.\n\nAt the bottom, a postscript in plain text: "The serpent turns. Phase Two begins at the Harvest Moon."',
      consequences: [
        { type: 'set_flag', target: 'maren_letter_found', value: true },
        { type: 'set_flag', target: 'learned_assassination_truth', value: true },
        { type: 'grant_xp', target: 'cunning', value: 15 },
      ],
      choices: [
        {
          id: 'ch03_confront_maren',
          text: 'Confront Duke Maren with this evidence.',
          targetNode: 'ch03_maren_confrontation',
        },
        {
          id: 'ch03_hold_evidence',
          text: 'Hold the evidence. It\'s more useful as leverage than as accusation.',
          targetNode: 'ch03_archive_exit',
          consequences: [
            { type: 'grant_xp', target: 'cunning', value: 10 },
          ],
        },
      ],
    },
    {
      id: 'ch03_messenger_lost',
      chapterId: 'ch03',
      title: 'Slipped Away',
      text: 'The messenger is good — better than you. They vanish into the labyrinth of the lower city, and you\'re left with nothing but suspicion and cold feet.\n\nBut you did see the direction they headed: toward the old bridge, the boundary between the merchant quarter and the slums. Someone is operating from there.',
      choices: [
        { id: 'ch03_regroup', text: 'Return to plan your next move.', targetNode: 'ch03_archive_exit' },
      ],
    },
    {
      id: 'ch03_maren_study',
      chapterId: 'ch03',
      title: 'The Duke\'s Secrets',
      text: 'Maren\'s study is a treasury of information. Correspondence with every major player in Valdris, maps with coded annotations, financial ledgers that would make a tax collector weep.\n\nYou find what you need in a hidden drawer: letters bearing the serpent seal. Maren isn\'t the mastermind — he\'s receiving orders. From someone who signs only as "The Architect." The letters describe a plan to provoke war between the factions, then step in as mediator to claim ultimate authority.\n\nYou also find a list of names. People to be eliminated. Yours is not on it — yet.',
      consequences: [
        { type: 'set_flag', target: 'maren_letter_found', value: true },
        { type: 'set_flag', target: 'learned_assassination_truth', value: true },
        { type: 'give_item', target: 'shadow_dagger', value: true, description: 'You find the Kingslayer\'s blade in a locked box' },
        { type: 'grant_xp', target: 'intelligence', value: 15 },
      ],
      choices: [
        {
          id: 'ch03_take_evidence',
          text: 'Take the letters and the dagger as evidence.',
          targetNode: 'ch03_archive_exit',
        },
        {
          id: 'ch03_confront_study',
          text: 'Wake Maren. Confront him now.',
          targetNode: 'ch03_maren_confrontation',
        },
      ],
    },
    {
      id: 'ch03_maren_caught',
      chapterId: 'ch03',
      title: 'Discovered',
      text: 'A floorboard creaks. You freeze. From the darkness, Duke Maren\'s voice: "I was wondering when you\'d come snooping."\n\nA lamp flares. Maren sits in a chair by the door, fully dressed, a crossbow resting casually on his knee. He looks more tired than angry.\n\n"Sit down," he says. "Let\'s have the conversation you came here to have."',
      speaker: 'duke_maren',
      choices: [
        {
          id: 'ch03_sit_talk',
          text: 'Sit. Hear what he has to say.',
          targetNode: 'ch03_maren_confrontation',
        },
        {
          id: 'ch03_fight_maren',
          text: 'You didn\'t come here to chat. Go for the crossbow.',
          targetNode: 'ch03_maren_fight',
          statCheck: {
            stat: 'strength',
            difficulty: 14,
            successNode: 'ch03_maren_overpowered',
            failureNode: 'ch03_maren_escapes',
            description: 'Disarm Duke Maren before he can fire',
          },
        },
      ],
    },
    {
      id: 'ch03_maren_confrontation',
      chapterId: 'ch03',
      title: 'The Duke Unmasked',
      text: 'Maren\'s grandfatherly mask slips, revealing the calculation beneath. "I am not the Architect. I\'m a survivor. I\'ve served six kings and I\'ll serve a seventh — or a council, or a circle of druids, or whatever rises from this mess. The Architect contacted me a year before the assassination. Gave me a choice: cooperate or be added to the list."\n\nHe pours two glasses of wine. "I chose to cooperate. But I\'ve been undermining them from within. Slowly. Carefully. They don\'t know that I\'ve been feeding information to... well, to several people. Including, now, you."\n\nHe meets your eyes. "Do we have an arrangement? Or do you plan to be righteous and get us both killed?"',
      speaker: 'duke_maren',
      choices: [
        {
          id: 'ch03_accept_maren',
          text: '"We have an arrangement. For now. But if you\'re playing me, Maren..."',
          targetNode: 'ch03_archive_exit',
          consequences: [
            { type: 'set_relationship', target: 'duke_maren', value: 15 },
            { type: 'set_flag', target: 'spared_duke_maren', value: true },
            { type: 'grant_xp', target: 'cunning', value: 10 },
          ],
        },
        {
          id: 'ch03_reject_maren',
          text: '"I don\'t make deals with men who helped murder a king."',
          targetNode: 'ch03_archive_exit',
          consequences: [
            { type: 'set_relationship', target: 'duke_maren', value: -20 },
            { type: 'faction_rep', target: 'ashen_throne', value: -5 },
          ],
        },
        {
          id: 'ch03_expose_maren',
          text: '"I\'m taking this evidence to Princess Isolde. She deserves to know."',
          targetNode: 'ch03_archive_exit',
          consequences: [
            { type: 'faction_rep', target: 'ashen_throne', value: 15 },
            { type: 'set_relationship', target: 'princess_isolde', value: 15 },
            { type: 'set_relationship', target: 'duke_maren', value: -30 },
          ],
        },
      ],
    },
    {
      id: 'ch03_maren_fight',
      chapterId: 'ch03',
      title: 'Struggle in the Dark',
      text: 'You lunge for the crossbow. Maren is old but cunning — he anticipated this and pulls a cord that drops a heavy curtain between you.',
      isCombatNode: true,
      combatEncounterId: 'maren_guards',
      choices: [
        { id: 'ch03_fight_outcome', text: 'Continue...', targetNode: 'ch03_maren_overpowered' },
      ],
    },
    {
      id: 'ch03_maren_overpowered',
      chapterId: 'ch03',
      title: 'The Duke at Your Mercy',
      text: 'You disarm Maren and pin him to his desk. Papers scatter. His guards bang on the locked door.\n\n"Think," he gasps. "Kill me and you lose the only person inside the Architect\'s network. I have names. Dates. Plans. Kill me and those die with me."',
      speaker: 'duke_maren',
      choices: [
        {
          id: 'ch03_spare_overpowered',
          text: 'Spare him but take his evidence.',
          targetNode: 'ch03_archive_exit',
          consequences: [
            { type: 'set_flag', target: 'spared_duke_maren', value: true },
            { type: 'set_flag', target: 'maren_letter_found', value: true },
          ],
        },
        {
          id: 'ch03_kill_maren',
          text: '"Then I\'ll find another way." End him.',
          targetNode: 'ch03_archive_exit',
          consequences: [
            { type: 'kill_character', target: 'duke_maren', value: true },
            { type: 'faction_rep', target: 'ashen_throne', value: -10 },
            { type: 'grant_xp', target: 'resolve', value: 15 },
          ],
        },
      ],
    },
    {
      id: 'ch03_maren_escapes',
      chapterId: 'ch03',
      title: 'The Duke Slips Away',
      text: 'Maren fires the crossbow — not at you, but at the window latch. The window swings open and he drops through it with agility that belies his age. Guards flood the room.\n\nYou barely escape through the servants\' passage. Maren is free, warned, and now your enemy.',
      consequences: [
        { type: 'set_relationship', target: 'duke_maren', value: -20 },
      ],
      choices: [
        { id: 'ch03_flee_palace', text: 'Flee into the night.', targetNode: 'ch03_archive_exit' },
      ],
    },
    {
      id: 'ch03_mireth_counsel',
      chapterId: 'ch03',
      title: 'The Crone\'s Warning',
      text: 'You find Mireth — or she finds you — at the crossroads outside the old cemetery. She sits on a headstone, feeding breadcrumbs to ravens.\n\n"The Ouroboros. Yes, I know it well. I was part of it, once. A long time ago, when it was a philosophy, not a weapon." Her one good eye fixes on you. "Someone has perverted the idea. The original Ouroboros sought to end the cycle of tyranny through enlightenment. This new version seeks to end it through annihilation."\n\nShe stands, suddenly fierce. "Find the Architect before the Harvest Moon. After that, the pieces will be in motion and no one — not Thorn, not Vareth, not your clever little self — will be able to stop what comes."',
      speaker: 'mireth',
      consequences: [
        { type: 'set_flag', target: 'learned_assassination_truth', value: true },
        { type: 'grant_xp', target: 'intelligence', value: 15 },
      ],
      choices: [
        {
          id: 'ch03_ask_architect',
          text: '"Who is the Architect, Mireth?"',
          targetNode: 'ch03_mireth_answer',
        },
        {
          id: 'ch03_ask_involvement',
          text: '"You were part of it. Are you still?"',
          targetNode: 'ch03_mireth_past',
        },
      ],
    },
    {
      id: 'ch03_mireth_answer',
      chapterId: 'ch03',
      title: 'A Name Unspoken',
      text: '"If I knew that, dear, do you think I\'d be sitting in a graveyard feeding birds?" Mireth\'s humor fades. "I know only this: the Architect was once part of one of the four factions. They were betrayed — or believe they were — and their revenge is to destroy them all. Look for someone who was cast out. Someone with reason to hate every banner equally."\n\nShe places a gnarled hand on your shoulder. "Trust the compass. It knows what your mind hasn\'t accepted yet."',
      speaker: 'mireth',
      choices: [
        { id: 'ch03_leave_mireth', text: 'Thank Mireth and continue your investigation.', targetNode: 'ch03_archive_exit' },
      ],
    },
    {
      id: 'ch03_mireth_past',
      chapterId: 'ch03',
      title: 'Old Sins',
      text: 'Mireth is quiet for a long time. A raven lands on her shoulder.\n\n"I left the Ouroboros thirty years ago, when I realized that breaking cycles sometimes means becoming the next tyrant in line. I\'ve spent three decades trying to guide events gently — a word here, a compass there. Trying to help people like you find better answers than the ones I found."\n\nShe looks old. Truly old, for the first time. "I\'ve made terrible mistakes. The compass is my penance. It always points toward what matters most — and sometimes what matters most is stopping people like the person I used to be."',
      speaker: 'mireth',
      consequences: [
        { type: 'set_relationship', target: 'mireth', value: 10 },
      ],
      choices: [
        { id: 'ch03_comfort_mireth', text: 'Continue with new understanding.', targetNode: 'ch03_archive_exit' },
      ],
    },
    {
      id: 'ch03_unity_attempt',
      chapterId: 'ch03',
      title: 'Seeds of Unity',
      text: 'You arrange a secret meeting between representatives of each faction — not the leaders, but trusted seconds. Ser Brynn for the Covenant. Rowan for the Court. Lysara for the Circle. And, reluctantly, you speak for the Throne.\n\nThe meeting is tense but productive. They agree on one thing: an unknown enemy is more dangerous than a known rival. A fragile truce is struck — not alliance, but a ceasefire while the Architect is hunted.',
      consequences: [
        { type: 'set_flag', target: 'forged_alliance', value: true },
        { type: 'grant_xp', target: 'charisma', value: 15 },
      ],
      choices: [
        { id: 'ch03_alliance_formed', text: 'The hunt begins.', targetNode: 'ch03_archive_exit' },
      ],
    },
    {
      id: 'ch03_selective_share',
      chapterId: 'ch03',
      title: 'Chosen Confidence',
      text: 'You share the intelligence with only your closest factional ally. They receive it with grim determination.\n\n"This changes everything," they say. "But we can\'t act alone. We\'ll need to be strategic about who else we bring in — and when."',
      choices: [
        { id: 'ch03_selective_continue', text: 'Plan your next move carefully.', targetNode: 'ch03_archive_exit' },
      ],
    },
    {
      id: 'ch03_archive_exit',
      chapterId: 'ch03',
      title: 'The Web Tightens',
      text: 'Dawn breaks over Valdris with the color of old blood. You have pieces of the puzzle now — the Ouroboros, the Architect, Duke Maren\'s double game. But the picture is still incomplete.\n\nThe Harvest Moon is coming. Whatever "Phase Two" entails, the factions must be warned — or maneuvered. The question is whether you\'re gathering allies or gathering pawns.\n\nThe compass, warm in your pocket, points steadily toward the Thornwood. Something awaits you there.',
      isEndNode: true,
      choices: [],
    },
  ],
};

export default chapter03;
