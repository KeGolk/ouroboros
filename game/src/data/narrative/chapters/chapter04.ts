import { Chapter } from '../../../types/narrative';

const chapter04: Chapter = {
  id: 'ch04',
  number: 4,
  title: 'The Thornwood Pact',
  subtitle: 'In which old alliances are tested and the land speaks',
  description:
    'The Verdant Court summons you to the ancient Heartwood at the center of the Thornwood. The druids sense a corruption spreading through the land — tied to the Architect\'s plans. You must decide whether to heal the Heartwood or harness its power.',
  imagePrompt:
    'A massive ancient tree in a clearing surrounded by standing stones, druids in leaf-robes performing a ritual, green energy flowing from the earth, dark corruption creeping at the edges, oil painting style, deep greens and shadow',
  startNodeId: 'ch04_start',
  availableFactions: ['verdant_court', 'iron_covenant'],
  keyCharacters: ['archdruid_elara', 'rowan', 'ser_brynn'],
  minLevel: 4,
  nodes: [
    {
      id: 'ch04_start',
      chapterId: 'ch04',
      title: 'Into the Thornwood',
      text: 'The compass leads you into the Thornwood, where the canopy swallows the sky. Rowan meets you at the forest\'s edge — or rather, his raven does, circling three times before leading you down a hidden path.\n\nThe Thornwood is sick. You can see it in the blackened bark, the silence where birdsong should be, the grey moss that smells of decay. Rowan walks ahead, his jaw tight with barely controlled fury.\n\n"It started three weeks ago," he says. "Something is poisoning the ley-lines that feed the Heartwood. Elara says it\'s connected to whatever happened to the king. Magic doesn\'t lie — when the realm bleeds, the land bleeds with it."',
      speaker: 'rowan',
      choices: [
        {
          id: 'ch04_ask_leylines',
          text: '"Tell me about the ley-lines. What are they, exactly?"',
          targetNode: 'ch04_leyline_lore',
          consequences: [{ type: 'grant_xp', target: 'intelligence', value: 10 }],
        },
        {
          id: 'ch04_press_forward',
          text: '"Take me to Elara. We don\'t have time to waste."',
          targetNode: 'ch04_heartwood',
          consequences: [{ type: 'grant_xp', target: 'resolve', value: 5 }],
        },
        {
          id: 'ch04_examine_corruption',
          text: 'Examine the corrupted trees more closely.',
          targetNode: 'ch04_corruption_check',
          consequences: [{ type: 'grant_xp', target: 'intelligence', value: 5 }],
        },
      ],
    },
    {
      id: 'ch04_leyline_lore',
      chapterId: 'ch04',
      title: 'The Veins of the World',
      text: 'Rowan speaks grudgingly at first, then with growing passion. "The ley-lines are rivers of magical energy that flow through the earth. The Heartwood sits at a nexus — a place where many lines cross. The druids have tended it for millennia. It\'s not just a tree. It\'s... a heart. The realm\'s heart."\n\nHe touches a blackened trunk and pulls his hand back as if burned. "Someone is siphoning the ley-lines. Diverting them. The Obsidian Circle has been studying ley-line manipulation for years. Elara thinks they\'re responsible."\n\nHis amber eyes burn. "If the Heartwood dies, the Thornwood dies. And if the Thornwood dies, the western border lies open to anything."',
      speaker: 'rowan',
      consequences: [{ type: 'grant_xp', target: 'intelligence', value: 10 }],
      choices: [
        { id: 'ch04_to_heartwood', text: 'Continue to the Heartwood.', targetNode: 'ch04_heartwood' },
      ],
    },
    {
      id: 'ch04_corruption_check',
      chapterId: 'ch04',
      title: 'Reading the Rot',
      text: 'You press your hand against the blackened bark. If you have any magical sensitivity, you feel it — a wrongness, a flow of energy being pulled in a direction it shouldn\'t go. Like a river forced to run uphill.\n\nBut there\'s something else. Scratched into the bark, hidden beneath the rot: symbols. Not druidic. Not arcane, exactly. The Ouroboros serpent, repeated in a circle around the trunk. Someone has been here — physically, deliberately corrupting the trees.',
      consequences: [
        { type: 'set_flag', target: 'found_corruption_symbols', value: true },
        { type: 'grant_xp', target: 'intelligence', value: 10 },
      ],
      choices: [
        {
          id: 'ch04_show_rowan',
          text: 'Show Rowan the symbols.',
          targetNode: 'ch04_heartwood',
          consequences: [{ type: 'set_relationship', target: 'rowan', value: 10 }],
        },
        {
          id: 'ch04_keep_quiet',
          text: 'Say nothing for now. Continue to the Heartwood.',
          targetNode: 'ch04_heartwood',
          consequences: [{ type: 'grant_xp', target: 'cunning', value: 5 }],
        },
      ],
    },
    {
      id: 'ch04_heartwood',
      chapterId: 'ch04',
      title: 'The Heart of the Forest',
      text: 'The Heartwood is immense — a tree wider than a castle tower, its canopy a world unto itself. But even here, the corruption has reached. Black veins run up the pale bark. Leaves fall that should be green.\n\nArchdruid Elara stands at its base, hands pressed to the bark, eyes closed. Around her, a dozen druids maintain a protective circle. Rowan takes his place among them.\n\nElara opens her eyes. "You came. Good. The Heartwood is dying. I can slow it but not stop it. The corruption flows through the ley-lines from a source to the east — somewhere beneath the mountains. I need someone to find that source and sever it."\n\nShe hesitates. "But there is another option. The Heartwood\'s power could be... redirected. Instead of healing, it could be channeled into a weapon against whoever is doing this. It would kill the tree, but it would strike back."',
      speaker: 'archdruid_elara',
      choices: [
        {
          id: 'ch04_find_source',
          text: '"I\'ll find the source of corruption. The Heartwood is too important to sacrifice."',
          targetNode: 'ch04_quest_source',
          consequences: [
            { type: 'faction_rep', target: 'verdant_court', value: 15 },
            { type: 'set_relationship', target: 'archdruid_elara', value: 15 },
          ],
        },
        {
          id: 'ch04_weapon_option',
          text: '"If we could strike at the Architect directly... tell me about the weapon option."',
          targetNode: 'ch04_weapon_debate',
          consequences: [
            { type: 'set_relationship', target: 'rowan', value: -10 },
          ],
        },
        {
          id: 'ch04_ask_both',
          text: '"Is there no way to do both? Heal the tree and trace the source?"',
          targetNode: 'ch04_compromise',
          consequences: [
            { type: 'grant_xp', target: 'cunning', value: 10 },
          ],
          statCheck: {
            stat: 'intelligence',
            difficulty: 12,
            successNode: 'ch04_compromise',
            failureNode: 'ch04_no_compromise',
            description: 'Find a way to both heal and track the corruption',
          },
        },
      ],
    },
    {
      id: 'ch04_quest_source',
      chapterId: 'ch04',
      title: 'The Eastern Trail',
      text: 'Elara and Rowan guide you to where the ley-line corruption is strongest. The trail leads east, through the deepest part of the Thornwood, toward the Ashenmount foothills.\n\nRowan insists on accompanying you. "The forest is my blood. I won\'t sit and watch it die." His raven scouts ahead, returning with croaked reports of what lies on the trail.\n\nTwo days of hard travel bring you to a hidden valley where Iron Covenant soldiers guard a mining operation. They\'re not digging for ore — they\'re excavating ancient ruins. And the corruption pours from the pit like a river of darkness.',
      choices: [
        {
          id: 'ch04_confront_soldiers',
          text: 'Confront the Covenant soldiers. Demand to know what they\'re doing.',
          targetNode: 'ch04_covenant_confrontation',
          consequences: [{ type: 'faction_rep', target: 'iron_covenant', value: -10 }],
        },
        {
          id: 'ch04_sneak_into_ruins',
          text: 'Sneak past the guards into the ruins.',
          targetNode: 'ch04_ruins_sneak',
          statCheck: {
            stat: 'dexterity',
            difficulty: 12,
            successNode: 'ch04_ruins_interior',
            failureNode: 'ch04_caught_ruins',
            description: 'Infiltrate the guarded excavation site',
          },
        },
        {
          id: 'ch04_find_brynn',
          text: 'Look for Ser Brynn among the soldiers. She might help.',
          targetNode: 'ch04_brynn_ruins',
          conditions: [
            { type: 'flag_set', target: 'saved_ashford_refugees', operator: '==', value: true },
          ],
        },
      ],
    },
    {
      id: 'ch04_covenant_confrontation',
      chapterId: 'ch04',
      title: 'Steel Meets Wood',
      text: 'The Covenant captain is not pleased to see a druid and a disgraced noble demanding answers. "Commander Vareth\'s orders. This site is a matter of realm security. Turn around or be arrested."\n\nRowan growls. The trees lean closer. The soldiers grip their weapons tighter.',
      isCombatNode: true,
      combatEncounterId: 'covenant_patrol',
      choices: [
        {
          id: 'ch04_fight_soldiers',
          text: 'Fight your way through.',
          targetNode: 'ch04_ruins_interior',
          consequences: [
            { type: 'faction_rep', target: 'iron_covenant', value: -15 },
            { type: 'grant_xp', target: 'strength', value: 15 },
          ],
        },
        {
          id: 'ch04_intimidate',
          text: 'Invoke your noble name to demand passage.',
          targetNode: 'ch04_ruins_interior',
          statCheck: {
            stat: 'charisma',
            difficulty: 14,
            successNode: 'ch04_ruins_interior',
            failureNode: 'ch04_caught_ruins',
            description: 'Use your authority to gain access',
          },
        },
      ],
    },
    {
      id: 'ch04_brynn_ruins',
      chapterId: 'ch04',
      title: 'A Familiar Face',
      text: 'Ser Brynn is indeed among the garrison, looking deeply unhappy about it. She pulls you aside.\n\n"Vareth ordered the excavation. He says there\'s a weapon down there — something from the old wars that could secure the realm. But since the digging started, the forest has been dying and the soldiers have been having nightmares." She grips your arm. "Something is wrong here. I\'ve tried to tell the Commander but he won\'t listen. Help me shut this down."',
      speaker: 'ser_brynn',
      choices: [
        {
          id: 'ch04_help_brynn',
          text: '"Let\'s go down together. We\'ll find the truth."',
          targetNode: 'ch04_ruins_interior',
          consequences: [
            { type: 'set_relationship', target: 'ser_brynn', value: 15 },
          ],
        },
        {
          id: 'ch04_use_brynn',
          text: '"Get me inside. I\'ll handle the rest."',
          targetNode: 'ch04_ruins_interior',
          consequences: [
            { type: 'set_relationship', target: 'ser_brynn', value: 5 },
          ],
        },
      ],
    },
    {
      id: 'ch04_ruins_sneak',
      chapterId: 'ch04',
      title: 'Into the Dark',
      text: 'Rowan\'s knowledge of the forest gives you an edge. You find a collapsed section of the ruins that the soldiers haven\'t discovered and squeeze through into the dark interior.',
      choices: [
        { id: 'ch04_proceed', text: 'Proceed deeper.', targetNode: 'ch04_ruins_interior' },
      ],
    },
    {
      id: 'ch04_caught_ruins',
      chapterId: 'ch04',
      title: 'Captured',
      text: 'The soldiers catch you and throw you in a holding tent. But by nightfall, Rowan\'s raven has pecked through the tent ropes, and the forest itself creates a diversion — a sudden windstorm that scatters the camp. You escape into the ruins during the chaos.',
      consequences: [
        { type: 'modify_stat', target: 'resolve', value: -1, description: 'Rough treatment in captivity' },
      ],
      choices: [
        { id: 'ch04_escape_into_ruins', text: 'Enter the ruins.', targetNode: 'ch04_ruins_interior' },
      ],
    },
    {
      id: 'ch04_ruins_interior',
      chapterId: 'ch04',
      title: 'The Ley-Line Siphon',
      text: 'Beneath the surface, the ruins reveal themselves: an ancient druidic temple, long buried, now desecrated. In its heart, someone has constructed a device — a tangle of metal and crystal that pulses with dark energy. The ley-lines flow into it like rivers into a drain.\n\nThis is the source of the corruption. And carved on its base, unmistakable: the Ouroboros serpent.\n\nThe device isn\'t Covenant work. It was here before the soldiers arrived. Vareth was manipulated into excavating it, thinking it was a weapon. In a sense, it is — but not one he controls.\n\nYou can destroy it, which will heal the ley-lines but release a surge of wild magic. Or you can study it, potentially learning who built it.',
      choices: [
        {
          id: 'ch04_destroy_device',
          text: 'Destroy the siphon device immediately.',
          targetNode: 'ch04_destruction',
          consequences: [
            { type: 'faction_rep', target: 'verdant_court', value: 20 },
            { type: 'set_flag', target: 'heartwood_restored', value: true },
          ],
        },
        {
          id: 'ch04_study_device',
          text: 'Study the device first. Understanding it might reveal the Architect.',
          targetNode: 'ch04_study',
          consequences: [
            { type: 'faction_rep', target: 'obsidian_circle', value: 10 },
            { type: 'grant_xp', target: 'intelligence', value: 20 },
          ],
          statCheck: {
            stat: 'intelligence',
            difficulty: 14,
            successNode: 'ch04_study_success',
            failureNode: 'ch04_study_fail',
            description: 'Analyze the ancient siphon device',
          },
        },
        {
          id: 'ch04_redirect_device',
          text: 'Redirect the siphon — send the energy back through the ley-lines as a weapon.',
          targetNode: 'ch04_redirect',
          consequences: [
            { type: 'grant_xp', target: 'cunning', value: 15 },
          ],
        },
      ],
    },
    {
      id: 'ch04_destruction',
      chapterId: 'ch04',
      title: 'The Surge',
      text: 'You shatter the central crystal. Energy erupts outward in a blinding wave. The ruins shake. Rowan throws himself flat. The surge passes through the earth like a thunderclap, racing along the ley-lines back to the Heartwood.\n\nWhen the light fades, the corruption is gone. The black veins on the walls fade to clean stone. From above, you hear the sound of trees straightening, leaves unfurling, birdsong returning.\n\nThe Thornwood is healing. But the wild magic surge will be felt across Valdris — every magician, druid, and sensitive will know what happened here. The Architect will know you\'ve struck a blow.',
      consequences: [
        { type: 'set_flag', target: 'heartwood_restored', value: true },
        { type: 'grant_xp', target: 'resolve', value: 15 },
      ],
      choices: [
        { id: 'ch04_return_triumphant', text: 'Return to Elara with the good news.', targetNode: 'ch04_end' },
      ],
    },
    {
      id: 'ch04_study_success',
      chapterId: 'ch04',
      title: 'The Maker\'s Signature',
      text: 'The device is sophisticated — a blend of druidic, arcane, and something older. As you study it, you find an inscription hidden in the base: a maker\'s mark. It matches no known artificer, but the technique is unmistakable: this was built by someone trained in both the Obsidian Circle and the Verdant Court.\n\nSomeone who understood both magic and nature. Someone who was cast out from both.\n\nThe Architect isn\'t just an ideologue. They\'re a genius — and they have access to knowledge from multiple factions.',
      consequences: [
        { type: 'set_flag', target: 'architect_clue_found', value: true },
        { type: 'grant_xp', target: 'intelligence', value: 15 },
      ],
      choices: [
        {
          id: 'ch04_destroy_after_study',
          text: 'Now destroy it.',
          targetNode: 'ch04_destruction',
        },
        {
          id: 'ch04_preserve_device',
          text: 'Preserve it for further study. Disable but don\'t destroy.',
          targetNode: 'ch04_end',
          consequences: [
            { type: 'faction_rep', target: 'obsidian_circle', value: 10 },
            { type: 'faction_rep', target: 'verdant_court', value: -10 },
          ],
        },
      ],
    },
    {
      id: 'ch04_study_fail',
      chapterId: 'ch04',
      title: 'Too Complex',
      text: 'The device\'s workings are beyond your understanding. Rowan grows impatient. "Enough studying. The forest is dying while you tinker."',
      speaker: 'rowan',
      choices: [
        { id: 'ch04_give_up_study', text: 'Destroy the device.', targetNode: 'ch04_destruction' },
      ],
    },
    {
      id: 'ch04_redirect',
      chapterId: 'ch04',
      title: 'Playing with Fire',
      text: 'You attempt to reverse the siphon\'s flow, turning the stolen energy into a traceable signal that will lead back to the Architect. It\'s dangerous — like trying to reverse a river.\n\nThe device shudders. The energy shifts. For a moment, you feel a connection — a mind on the other end of the ley-line, vast and cold and surprised. Then it\'s gone, and the device overloads.\n\nThe explosion is contained, barely. But you caught a glimpse: the Architect operates from somewhere beneath the capital itself.',
      consequences: [
        { type: 'set_flag', target: 'heartwood_restored', value: true },
        { type: 'set_flag', target: 'architect_location_hint', value: true },
        { type: 'modify_stat', target: 'resolve', value: -1, description: 'Drained by the magical feedback' },
        { type: 'grant_xp', target: 'intelligence', value: 15 },
      ],
      choices: [
        { id: 'ch04_redirect_end', text: 'Return with what you\'ve learned.', targetNode: 'ch04_end' },
      ],
    },
    {
      id: 'ch04_weapon_debate',
      chapterId: 'ch04',
      title: 'The Cost of Weapons',
      text: 'Elara\'s expression is pained. "The Heartwood contains centuries of accumulated power. Released as a weapon, it could devastate an army, shatter a fortress, or kill a single target across any distance. But the tree would die. The Thornwood would wither within a generation. Everything my order has protected for millennia, gone."\n\nRowan steps forward, shaking with rage. "You can\'t seriously consider this. This is our HOME."\n\nElara raises a hand. "Everything is on the table when the realm\'s survival is at stake. That is the burden of leadership."',
      choices: [
        {
          id: 'ch04_reject_weapon',
          text: '"Rowan is right. We find another way."',
          targetNode: 'ch04_quest_source',
          consequences: [
            { type: 'set_relationship', target: 'rowan', value: 20 },
            { type: 'faction_rep', target: 'verdant_court', value: 10 },
          ],
        },
        {
          id: 'ch04_accept_weapon',
          text: '"Save it as a last resort. We try to heal first, but keep this option open."',
          targetNode: 'ch04_quest_source',
          consequences: [
            { type: 'set_relationship', target: 'archdruid_elara', value: 5 },
            { type: 'grant_xp', target: 'cunning', value: 10 },
          ],
        },
      ],
    },
    {
      id: 'ch04_compromise',
      chapterId: 'ch04',
      title: 'A Third Path',
      text: 'Your knowledge of both arcane and natural magic reveals an option Elara hadn\'t considered: you can use the Heartwood\'s connection to the ley-lines as a tracking mechanism. Like following a river upstream. It won\'t heal the tree, but it won\'t harm it further — and it will reveal the source.\n\nElara\'s eyes widen. "Clever. Very clever. The ley-lines remember every touch. If we listen carefully..."',
      consequences: [
        { type: 'grant_xp', target: 'intelligence', value: 15 },
        { type: 'set_relationship', target: 'archdruid_elara', value: 10 },
      ],
      choices: [
        { id: 'ch04_track_source', text: 'Follow the ley-line trail.', targetNode: 'ch04_quest_source' },
      ],
    },
    {
      id: 'ch04_no_compromise',
      chapterId: 'ch04',
      title: 'No Easy Answers',
      text: 'Elara shakes her head gently. "I\'m afraid it\'s one or the other. The Heartwood hasn\'t the strength for both."',
      choices: [
        {
          id: 'ch04_choose_heal',
          text: 'Find the source and heal the tree.',
          targetNode: 'ch04_quest_source',
        },
        {
          id: 'ch04_choose_weapon',
          text: 'Prepare the weapon. We may need it.',
          targetNode: 'ch04_weapon_debate',
        },
      ],
    },
    {
      id: 'ch04_end',
      chapterId: 'ch04',
      title: 'The Forest Remembers',
      text: 'You emerge from the Thornwood changed. The corruption is dealt with — one way or another — but the larger threat remains. The Architect is real, powerful, and working toward a deadline.\n\nElara clasps your hand. "You have done the Court a great service. The forest remembers its friends." Behind her, the Heartwood\'s leaves shimmer — healthier, if not fully healed.\n\nRowan nods once — the highest compliment from a man of few words.\n\nAs you leave the Thornwood, a raven drops a message at your feet. The seal is Isolde\'s: "The Harvest Festival approaches. I need you at the capital. It\'s time to make our move."',
      isEndNode: true,
      choices: [],
    },
  ],
};

export default chapter04;
