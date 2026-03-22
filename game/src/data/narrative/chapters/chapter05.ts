import { Chapter } from '../../../types/narrative';

const chapter05: Chapter = {
  id: 'ch05',
  number: 5,
  title: 'The Harvest Masquerade',
  subtitle: 'In which masks conceal more than faces',
  description:
    'The annual Harvest Festival becomes a powder keg as all factions attend a grand masquerade. Behind the revelry, each faction plots its next move. You must navigate courtly intrigue, gather intelligence, and survive the night.',
  imagePrompt:
    'A grand medieval ballroom with masked figures in elaborate costumes, candlelight reflecting off gilded walls, whispered conversations in shadowed alcoves, oil painting style, rich golds and deep shadows',
  startNodeId: 'ch05_start',
  availableFactions: ['iron_covenant', 'verdant_court', 'obsidian_circle', 'ashen_throne'],
  keyCharacters: ['princess_isolde', 'lysara', 'duke_maren', 'commander_vareth', 'magister_thorn'],
  minLevel: 5,
  isBossChapter: false,
  nodes: [
    {
      id: 'ch05_start',
      chapterId: 'ch05',
      title: 'Behind the Mask',
      text: 'The Great Hall has been transformed. Thousands of candles burn in iron chandeliers. Masked nobles whirl across the dance floor while servants pour wine that flows like blood. It is the Harvest Masquerade — Valdris\'s oldest tradition, held even now as the realm teeters.\n\n"Everyone wears a mask tonight," Lysara murmurs beside you, adjusting her own — a fox with jeweled eyes. "The trick is figuring out which masks people wear on the other 364 days."\n\nYou spot the faction leaders through the crowd: Vareth in a wolf mask (subtle, as always), Elara wearing a crown of autumn leaves, Thorn in an obsidian half-mask, and Isolde in silver and grey. Each surrounded by their people. Each watching the others.',
      choices: [
        {
          id: 'ch05_dance_with_isolde',
          text: 'Ask Princess Isolde to dance. A conversation disguised as courtesy.',
          targetNode: 'ch05_isolde_dance',
          consequences: [
            { type: 'faction_rep', target: 'ashen_throne', value: 5 },
            { type: 'set_relationship', target: 'princess_isolde', value: 10 },
          ],
        },
        {
          id: 'ch05_find_maren',
          text: 'Search for Duke Maren. He\'s conspicuously absent from the floor.',
          targetNode: 'ch05_maren_hunt',
          consequences: [{ type: 'grant_xp', target: 'cunning', value: 10 }],
        },
        {
          id: 'ch05_work_the_room',
          text: 'Work the room. Gather gossip from minor nobles and servants.',
          targetNode: 'ch05_gossip',
          consequences: [{ type: 'grant_xp', target: 'charisma', value: 10 }],
        },
        {
          id: 'ch05_follow_lysara',
          text: 'Follow Lysara to the Circle\'s private gathering.',
          targetNode: 'ch05_circle_meeting',
          consequences: [{ type: 'faction_rep', target: 'obsidian_circle', value: 5 }],
        },
      ],
    },
    {
      id: 'ch05_isolde_dance',
      chapterId: 'ch05',
      title: 'The Silver Dance',
      text: 'Isolde accepts with a nod that is more command than consent. You take the floor together, and the other dancers part like water — everyone watching, pretending not to.\n\n"Duke Maren has been meeting with someone outside the city," she whispers as you turn. "My spies lost his trail near the old aqueducts. He\'s planning something for tonight." Another turn. "I need you to find out what. I can\'t leave the floor without signaling suspicion."\n\nHer hand tightens on yours. "There\'s something else. I received a letter today. Unsigned. It said: \'Your father\'s death was a mercy. Yours will not be.\' I believe the Architect intends to kill me tonight."',
      speaker: 'princess_isolde',
      choices: [
        {
          id: 'ch05_protect_isolde_stay',
          text: '"Then I stay at your side. Let them come."',
          targetNode: 'ch05_guard_duty',
          consequences: [
            { type: 'set_relationship', target: 'princess_isolde', value: 15 },
            { type: 'faction_rep', target: 'ashen_throne', value: 10 },
          ],
        },
        {
          id: 'ch05_hunt_threat',
          text: '"I\'ll find the threat before it reaches you. Stay visible, stay surrounded."',
          targetNode: 'ch05_maren_hunt',
          consequences: [
            { type: 'grant_xp', target: 'cunning', value: 10 },
          ],
        },
        {
          id: 'ch05_warn_vareth',
          text: '"Let me bring Vareth\'s soldiers in on this. Safety in numbers."',
          targetNode: 'ch05_vareth_alliance',
          consequences: [
            { type: 'faction_rep', target: 'iron_covenant', value: 10 },
          ],
        },
      ],
    },
    {
      id: 'ch05_maren_hunt',
      chapterId: 'ch05',
      title: 'The Duke\'s Trail',
      text: 'You slip away from the masquerade into the palace\'s shadowed corridors. The sounds of revelry fade as you descend toward the old aqueducts — ancient waterways beneath the palace, now dry and forgotten.\n\nVoices echo from below. Maren\'s unmistakable grandfatherly tone, and another — colder, distorted, as if filtered through water or magic.\n\n"Phase Two proceeds tonight," the cold voice says. "The princess dies. The factions blame each other. By morning, civil war."',
      consequences: [
        { type: 'set_flag', target: 'overheard_plot', value: true },
      ],
      choices: [
        {
          id: 'ch05_confront_maren_aq',
          text: 'Burst in and confront them.',
          targetNode: 'ch05_aqueduct_confrontation',
          consequences: [{ type: 'grant_xp', target: 'resolve', value: 15 }],
        },
        {
          id: 'ch05_listen_more',
          text: 'Keep listening. Learn everything you can.',
          targetNode: 'ch05_eavesdrop',
          statCheck: {
            stat: 'dexterity',
            difficulty: 14,
            successNode: 'ch05_eavesdrop_success',
            failureNode: 'ch05_eavesdrop_fail',
            description: 'Remain hidden while eavesdropping',
          },
        },
        {
          id: 'ch05_rush_back',
          text: 'Rush back to warn Isolde immediately.',
          targetNode: 'ch05_warning_race',
          consequences: [{ type: 'grant_xp', target: 'resolve', value: 10 }],
        },
      ],
    },
    {
      id: 'ch05_eavesdrop_success',
      chapterId: 'ch05',
      title: 'The Architect\'s Voice',
      text: 'You press against the cold stone and listen. The distorted voice continues:\n\n"The assassin is already in the hall. Dressed as a servant. When the clock strikes midnight, the poison will be in the princess\'s wine. The Iron Covenant will be blamed — the bottle came from Vareth\'s personal stock, as arranged."\n\nMaren\'s voice, shaking slightly: "And afterward? You promised I would be safe."\n\n"You will be useful, Duke. That is better than safe in the world I\'m building."\n\nThe voice falls silent. You hear footsteps departing through a deeper tunnel.',
      consequences: [
        { type: 'set_flag', target: 'know_assassination_method', value: true },
        { type: 'grant_xp', target: 'cunning', value: 15 },
      ],
      choices: [
        {
          id: 'ch05_rush_to_isolde',
          text: 'Rush to stop the poisoning!',
          targetNode: 'ch05_race_against_time',
        },
        {
          id: 'ch05_grab_maren',
          text: 'Grab Maren before he escapes. He\'s the key witness.',
          targetNode: 'ch05_aqueduct_confrontation',
        },
      ],
    },
    {
      id: 'ch05_eavesdrop_fail',
      chapterId: 'ch05',
      title: 'Detected',
      text: 'A loose stone betrays you. The voices stop. A blast of cold air sweeps through the tunnel — magic — and you\'re thrown against the wall. By the time your vision clears, the tunnel is empty. Maren and his mysterious contact are gone.',
      consequences: [
        { type: 'modify_stat', target: 'resolve', value: -1 },
      ],
      choices: [
        { id: 'ch05_recover_rush', text: 'Rush back to the masquerade. Something is wrong.', targetNode: 'ch05_race_against_time' },
      ],
    },
    {
      id: 'ch05_aqueduct_confrontation',
      chapterId: 'ch05',
      title: 'Face to Face',
      text: 'You step into the light. Maren goes pale. The other figure — a shimmer of distorted air where a person should be — pauses.\n\n"Interesting," the Architect\'s distorted voice says. "You\'re more resourceful than I expected." The shimmer begins to fade. "A pity. I had hoped you might see the necessity of what I\'m doing. Every faction, every throne, every system that puts one person above another — all of it must end. The serpent must eat its tail."\n\nThe shimmer vanishes. Maren is left alone with you, sweating.',
      choices: [
        {
          id: 'ch05_seize_maren',
          text: 'Seize Maren and drag him before the Conclave.',
          targetNode: 'ch05_race_against_time',
          consequences: [
            { type: 'set_flag', target: 'maren_captured', value: true },
            { type: 'set_relationship', target: 'duke_maren', value: -30 },
          ],
        },
        {
          id: 'ch05_use_maren',
          text: '"You\'re going to help me stop the assassination, Maren. Right now."',
          targetNode: 'ch05_race_against_time',
          consequences: [
            { type: 'grant_xp', target: 'charisma', value: 10 },
          ],
        },
      ],
    },
    {
      id: 'ch05_race_against_time',
      chapterId: 'ch05',
      title: 'Midnight Approaches',
      text: 'You race through the corridors. The clock in the Great Hall begins to chime. One... two... three...\n\nYou burst through the doors. The masquerade is in full swing. Somewhere in this sea of masks, a servant carries poisoned wine toward the princess.\n\nYou scan the crowd frantically. There — a servant with Isolde\'s goblet, moving through the dancers toward the royal dais.',
      choices: [
        {
          id: 'ch05_tackle_servant',
          text: 'Tackle the servant and knock the goblet away.',
          targetNode: 'ch05_save_dramatic',
          consequences: [{ type: 'grant_xp', target: 'strength', value: 10 }],
        },
        {
          id: 'ch05_shout_warning',
          text: 'Shout a warning across the hall.',
          targetNode: 'ch05_save_warning',
          consequences: [{ type: 'grant_xp', target: 'charisma', value: 10 }],
        },
        {
          id: 'ch05_intercept_quietly',
          text: 'Intercept quietly — take the goblet and switch it.',
          targetNode: 'ch05_save_subtle',
          statCheck: {
            stat: 'dexterity',
            difficulty: 12,
            successNode: 'ch05_save_subtle',
            failureNode: 'ch05_save_dramatic',
            description: 'Subtly intercept the poisoned wine',
          },
        },
      ],
    },
    {
      id: 'ch05_save_dramatic',
      chapterId: 'ch05',
      title: 'Chaos at the Masquerade',
      text: 'You crash through the crowd, sending nobles sprawling, and knock the goblet from the servant\'s hands. Wine splashes across the marble floor — and where it lands, the stone hisses and blackens.\n\nSilence falls. Every eye turns to you. The servant pulls a knife and lunges — but Ser Brynn is faster, tackling them to the ground.\n\nIsolde stares at the blackened floor, then at you. "That... was meant for me."\n\nThe Conclave erupts into panic. But you\'ve saved the princess — and the truth about the assassination plot is now impossible to deny.',
      consequences: [
        { type: 'set_flag', target: 'isolde_survived', value: true },
        { type: 'faction_rep', target: 'ashen_throne', value: 20 },
        { type: 'set_relationship', target: 'princess_isolde', value: 20 },
      ],
      choices: [
        { id: 'ch05_dramatic_aftermath', text: 'Address the stunned crowd.', targetNode: 'ch05_aftermath' },
      ],
    },
    {
      id: 'ch05_save_warning',
      chapterId: 'ch05',
      title: 'A Voice in the Crowd',
      text: '"ISOLDE! THE WINE IS POISONED!"\n\nYour voice cuts through the music. The princess\'s hand freezes inches from the goblet. The servant bolts. Covenant soldiers give chase.\n\nIt\'s less elegant than you\'d have liked, but Isolde is alive. She sets down the untouched goblet with a hand that barely trembles.',
      consequences: [
        { type: 'set_flag', target: 'isolde_survived', value: true },
        { type: 'faction_rep', target: 'ashen_throne', value: 15 },
      ],
      choices: [
        { id: 'ch05_warning_aftermath', text: 'Deal with the aftermath.', targetNode: 'ch05_aftermath' },
      ],
    },
    {
      id: 'ch05_save_subtle',
      chapterId: 'ch05',
      title: 'The Switch',
      text: 'You intercept the servant smoothly, taking the goblet with a courtier\'s practiced ease. "Allow me — it\'s tradition for a friend of the crown to present the toast." The servant hesitates, then retreats into the crowd.\n\nYou pour the wine into a planter and fetch a clean glass. Isolde takes it with a grateful nod, never knowing how close she came. You keep the poisoned goblet — evidence.\n\nLater, you show Isolde the planter. The flowers are dead.',
      consequences: [
        { type: 'set_flag', target: 'isolde_survived', value: true },
        { type: 'set_flag', target: 'poison_evidence', value: true },
        { type: 'faction_rep', target: 'ashen_throne', value: 20 },
        { type: 'grant_xp', target: 'dexterity', value: 15 },
      ],
      choices: [
        { id: 'ch05_subtle_aftermath', text: 'Show Isolde the evidence privately.', targetNode: 'ch05_aftermath' },
      ],
    },
    {
      id: 'ch05_guard_duty',
      chapterId: 'ch05',
      title: 'The Watchful Dance',
      text: 'You stay at Isolde\'s side through the evening, dancing and smiling while your eyes scan every servant, every shadow. When the wine comes, you take it first — and your hand tingles where it touches the goblet. Poison. You set it down casually and fetch a new glass.\n\nIsolde watches your face. She understands. "Tonight?" she whispers.\n\n"Tonight," you confirm.',
      consequences: [
        { type: 'set_flag', target: 'isolde_survived', value: true },
        { type: 'set_relationship', target: 'princess_isolde', value: 15 },
      ],
      choices: [
        { id: 'ch05_guard_aftermath', text: 'The masquerade continues, but the danger hasn\'t passed.', targetNode: 'ch05_aftermath' },
      ],
    },
    {
      id: 'ch05_gossip',
      chapterId: 'ch05',
      title: 'Whispers Among Masks',
      text: 'The lesser nobles are a goldmine. Between glasses of wine, you learn:\n\n- Vareth has been stockpiling weapons at three locations outside the city.\n- Elara\'s druids have been growing something in the palace gardens — at night, when no one watches.\n- Thorn has purchased the old university outright. Students have been evacuated.\n- Duke Maren was seen entering the old aqueducts an hour ago.\n\nEach piece is a thread. The question is which to pull.',
      consequences: [
        { type: 'grant_xp', target: 'charisma', value: 10 },
      ],
      choices: [
        {
          id: 'ch05_follow_maren_gossip',
          text: 'The aqueducts. Follow Maren.',
          targetNode: 'ch05_maren_hunt',
        },
        {
          id: 'ch05_investigate_gardens',
          text: 'The palace gardens. What are the druids growing?',
          targetNode: 'ch05_garden_mystery',
        },
        {
          id: 'ch05_warn_isolde_gossip',
          text: 'Find Isolde and share what you\'ve learned.',
          targetNode: 'ch05_isolde_dance',
        },
      ],
    },
    {
      id: 'ch05_circle_meeting',
      chapterId: 'ch05',
      title: 'The Hidden Room',
      text: 'Lysara leads you through a tapestry-hidden door to a private chamber where Thorn holds court with his inner circle. Maps of ley-lines cover every surface.\n\n"The siphon device you found was one of seven," Thorn says without preamble. "Our agents have located three more. All are draining power toward a central point beneath the capital. The Architect is building something — a larger version of the Arcane Nexus we once theorized."\n\nHe meets your eyes. "If activated, it would give one person control over every magical current in Valdris. Absolute power. The irony of an anti-power ideologue seeking ultimate power is not lost on me."',
      speaker: 'magister_thorn',
      consequences: [
        { type: 'set_flag', target: 'found_sunken_library', value: true },
        { type: 'grant_xp', target: 'intelligence', value: 15 },
      ],
      choices: [
        {
          id: 'ch05_help_thorn',
          text: '"How do we stop it?"',
          targetNode: 'ch05_thorn_plan',
          consequences: [{ type: 'faction_rep', target: 'obsidian_circle', value: 10 }],
        },
        {
          id: 'ch05_question_thorn',
          text: '"Or you want it for yourself. The Nexus was the Circle\'s theory, after all."',
          targetNode: 'ch05_thorn_accusation',
        },
      ],
    },
    {
      id: 'ch05_thorn_plan',
      chapterId: 'ch05',
      title: 'The Counter-Strategy',
      text: '"We disable the remaining siphons. Without them, the Nexus cannot activate. But each one is guarded — by Ouroboros agents, by corrupted ley-line energy, and in one case, by a creature summoned from beyond the Veil."\n\nThorn produces a map. "This is a war fought in shadows, not on battlefields. I need operatives, not armies. Are you willing?"',
      speaker: 'magister_thorn',
      choices: [
        { id: 'ch05_accept_thorn', text: '"Show me where to start."', targetNode: 'ch05_aftermath' },
        { id: 'ch05_need_allies', text: '"This requires more than the Circle alone. We need all factions."', targetNode: 'ch05_aftermath' },
      ],
    },
    {
      id: 'ch05_thorn_accusation',
      chapterId: 'ch05',
      title: 'The Magister\'s Confession',
      text: 'Thorn is silent for a long moment. Lysara shifts uncomfortably.\n\n"Yes," he says finally. "In another lifetime, I would have built the Nexus myself. The Circle\'s purpose was always to concentrate knowledge — and knowledge is power. But I have seen what uncontrolled power does. The king\'s assassination. The corruption of the Thornwood. The suffering of innocents."\n\nHis violet eyes are haunted. "I am a dangerous man trying to be a good one. That is the most honest thing I have ever said. Make of it what you will."',
      speaker: 'magister_thorn',
      consequences: [
        { type: 'set_relationship', target: 'magister_thorn', value: 10 },
      ],
      choices: [
        { id: 'ch05_respect_thorn', text: 'Respect his honesty and move forward together.', targetNode: 'ch05_aftermath' },
      ],
    },
    {
      id: 'ch05_garden_mystery',
      chapterId: 'ch05',
      title: 'Moonlit Blooms',
      text: 'In the palace gardens, by moonlight, you find Rowan tending strange luminescent plants. "Heartwood seedlings," he says. "Elara\'s insurance. If the Heartwood dies, these carry its essence. We can regrow the forest in a generation."\n\nHe looks up. "Something\'s happening tonight. The animals are restless. The trees are whispering warnings."',
      speaker: 'rowan',
      choices: [
        { id: 'ch05_garden_to_hall', text: 'Rush back to the masquerade. The warnings are justified.', targetNode: 'ch05_race_against_time' },
      ],
    },
    {
      id: 'ch05_vareth_alliance',
      chapterId: 'ch05',
      title: 'The Commander\'s Guard',
      text: 'Vareth listens to the threat with the focus of a man born for crisis. Within minutes, his soldiers have quietly surrounded the princess\'s section of the hall. "No one gets to her without going through my best," he says.\n\nHe catches your arm. "After tonight, the games end. If there\'s a conspiracy, I will root it out. Martial law may be the only answer. I hope you understand that."',
      speaker: 'commander_vareth',
      consequences: [
        { type: 'faction_rep', target: 'iron_covenant', value: 10 },
        { type: 'set_flag', target: 'supported_martial_law', value: true },
      ],
      choices: [
        { id: 'ch05_vareth_to_aftermath', text: 'The night continues under the shadow of steel.', targetNode: 'ch05_aftermath' },
      ],
    },
    {
      id: 'ch05_warning_race',
      chapterId: 'ch05',
      title: 'Against the Clock',
      text: 'You sprint back through the corridors, the clock chiming somewhere above. How many strikes? Nine? Ten? Time blurs.',
      choices: [
        { id: 'ch05_make_it_back', text: 'Burst into the hall.', targetNode: 'ch05_race_against_time' },
      ],
    },
    {
      id: 'ch05_aftermath',
      chapterId: 'ch05',
      title: 'When the Music Stops',
      text: 'By dawn, the masquerade is over in more ways than one. The masks are off — figuratively if not literally.\n\nIsolde is alive, but shaken. The assassination attempt has united the factions in outrage — temporarily. Each blames the others, but your evidence points to the true enemy: the Architect and the Ouroboros network.\n\nThe Conclave is reconvened. This time, no one is playing games. War is coming — the only question is who it\'s against.\n\nAs you leave the hall in the cold dawn light, the compass points south. Toward the mountains. Toward answers.',
      isEndNode: true,
      choices: [],
    },
  ],
};

export default chapter05;
