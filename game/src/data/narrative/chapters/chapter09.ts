import { Chapter } from '../../../types/narrative';

const chapter09: Chapter = {
  id: 'ch09',
  number: 9,
  title: 'The Siege of Valdris',
  subtitle: 'In which the city becomes a battleground',
  description:
    'The Nexus activates partially, sending magical shockwaves through the capital. Ouroboros agents rise from hiding, and the city descends into chaos. You must fight through the siege, protect your allies, and reach the Nexus chamber.',
  imagePrompt:
    'A medieval city under siege from within, purple magical energy erupting from below, buildings cracking, soldiers fighting in the streets, civilians fleeing, oil painting style, dramatic purple and orange lighting',
  startNodeId: 'ch09_start',
  availableFactions: ['iron_covenant', 'verdant_court', 'obsidian_circle', 'ashen_throne'],
  keyCharacters: ['ser_brynn', 'rowan', 'lysara', 'commander_vareth', 'archdruid_elara'],
  minLevel: 9,
  isBossChapter: true,
  bossId: 'ouroboros_lieutenant',
  nodes: [
    {
      id: 'ch09_start',
      chapterId: 'ch09',
      title: 'The City Breaks',
      text: 'The Nexus pulses. Even partially activated, its power is terrifying. Purple lightning arcs from building to building. The streets crack as ley-line energy erupts upward. And from the chaos, Ouroboros agents emerge — hundreds of them, hidden in every faction, every institution, now revealed.\n\nThe city becomes a warzone. Covenant soldiers fight Ouroboros agents in the merchant quarter. Druids grow barriers of thorn and vine to protect civilian neighborhoods. Circle mages duel in showers of arcane fire.\n\nYou stand at the palace gates. Three districts burn. You can\'t save them all.',
      choices: [
        {
          id: 'ch09_save_civilians',
          text: 'The civilian quarter first. People before politics.',
          targetNode: 'ch09_civilian_rescue',
          consequences: [
            { type: 'grant_xp', target: 'charisma', value: 10 },
            { type: 'grant_xp', target: 'resolve', value: 10 },
          ],
        },
        {
          id: 'ch09_defend_palace',
          text: 'Defend the palace. The factions need their command structure intact.',
          targetNode: 'ch09_palace_defense',
          consequences: [
            { type: 'grant_xp', target: 'strength', value: 15 },
          ],
        },
        {
          id: 'ch09_push_nexus',
          text: 'Push straight for the Nexus entrance. Stop the source.',
          targetNode: 'ch09_nexus_push',
          consequences: [
            { type: 'grant_xp', target: 'resolve', value: 15 },
          ],
        },
      ],
    },
    {
      id: 'ch09_civilian_rescue',
      chapterId: 'ch09',
      title: 'Through Fire and Chaos',
      text: 'You fight through burning streets toward the residential quarter. Ser Brynn joins you, her sword singing, while Rowan\'s animals guide panicked families to safety.\n\nAn Ouroboros lieutenant blocks the bridge to the civilian quarter — a massive warrior in armor etched with serpent runes, wielding ley-line-enhanced weapons.\n\n"The civilians are already dead," the lieutenant sneers. "They just don\'t know it yet. The old world dies tonight."',
      isCombatNode: true,
      combatEncounterId: 'ouroboros_lieutenant',
      choices: [
        {
          id: 'ch09_fight_lieutenant',
          text: 'Fight the Ouroboros lieutenant.',
          targetNode: 'ch09_lieutenant_battle',
        },
      ],
    },
    {
      id: 'ch09_lieutenant_battle',
      chapterId: 'ch09',
      title: 'The Bridge Fight',
      text: 'The lieutenant fights with enhanced strength and speed. Ley-line energy crackles along their blade. But you\'ve fought harder battles, faced longer odds. You find openings, exploit weaknesses, and finally drive your blade through a gap in the serpent-etched armor.\n\nThe lieutenant falls. Behind them, the civilian quarter is intact — scared, shaken, but alive. Hundreds of people owe their lives to your choice.',
      consequences: [
        { type: 'set_flag', target: 'siege_survived', value: true },
        { type: 'grant_xp', target: 'strength', value: 20 },
      ],
      choices: [
        {
          id: 'ch09_civilian_to_nexus',
          text: 'Civilians are safe. Now head for the Nexus.',
          targetNode: 'ch09_nexus_approach',
        },
      ],
    },
    {
      id: 'ch09_palace_defense',
      chapterId: 'ch09',
      title: 'The Last Line',
      text: 'The palace is the factions\' command center. If it falls, coordination collapses and the city is lost. You organize the defense alongside Vareth, who for once looks like a man in his element.\n\nWave after wave of Ouroboros agents assault the gates. Between attacks, you coordinate with the faction leaders, issuing orders that save blocks of the city from destruction.\n\nVareth claps you on the shoulder between assaults. "Whatever happens tonight, you\'ve earned my respect. Not many civilians can hold a line like this."',
      speaker: 'commander_vareth',
      consequences: [
        { type: 'set_flag', target: 'siege_survived', value: true },
        { type: 'faction_rep', target: 'iron_covenant', value: 10 },
        { type: 'set_relationship', target: 'commander_vareth', value: 15 },
      ],
      choices: [
        {
          id: 'ch09_palace_cleared',
          text: 'The palace is secured. Push for the Nexus.',
          targetNode: 'ch09_nexus_approach',
        },
      ],
    },
    {
      id: 'ch09_nexus_push',
      chapterId: 'ch09',
      title: 'Through the Heart',
      text: 'You abandon the surface and plunge into the Nexus tunnels. The energy grows stronger with every step. Lysara runs beside you, her tattoos blazing as she counters ward after ward.\n\n"He\'s accelerating the activation," she gasps. "At this rate, the Nexus will be fully charged by midnight. If that happens, every ley-line in Valdris will be under his control."',
      speaker: 'lysara',
      consequences: [
        { type: 'set_flag', target: 'siege_survived', value: true },
      ],
      choices: [
        { id: 'ch09_push_deeper', text: 'Push deeper toward the chamber.', targetNode: 'ch09_nexus_approach' },
      ],
    },
    {
      id: 'ch09_nexus_approach',
      chapterId: 'ch09',
      title: 'The Final Corridor',
      text: 'The tunnel opens into a vast cavern beneath the palace — the mirror of the Sunken Library, but newer, rawer. Crystallized ley-line energy lines the walls like veins. At the center, a massive device — the Nexus — hums with building power. Maren stands at its controls, his eyes glowing with captured energy.\n\nBut he is not alone. Between you and the Nexus stands his final guardian: a creature of pure ley-line energy, shaped like an enormous serpent eating its own tail. The Ouroboros made manifest.\n\nMaren looks up. "Ah. You made it further than I expected. But it doesn\'t matter. In thirty minutes, the Nexus activates fully. Every ley-line, every drop of magical energy in Valdris, will answer to me. And then I will unmake the cycle forever."',
      speaker: 'duke_maren',
      choices: [
        {
          id: 'ch09_fight_guardian',
          text: 'Fight the Ouroboros guardian.',
          targetNode: 'ch09_guardian_battle',
        },
        {
          id: 'ch09_reason_with_maren',
          text: 'Try to reach Maren past the guardian. Reason with him.',
          targetNode: 'ch09_final_plea',
          statCheck: {
            stat: 'charisma',
            difficulty: 18,
            successNode: 'ch09_maren_hesitates',
            failureNode: 'ch09_guardian_battle',
            description: 'Reach the Architect with words instead of weapons',
          },
        },
        {
          id: 'ch09_use_codex',
          text: 'Use the Obsidian Codex to disrupt the Nexus from here.',
          targetNode: 'ch09_codex_counter',
          conditions: [
            { type: 'item_possessed', target: 'obsidian_codex', operator: '==', value: true },
          ],
        },
      ],
    },
    {
      id: 'ch09_guardian_battle',
      chapterId: 'ch09',
      title: 'The Serpent Uncoiled',
      text: 'The Ouroboros guardian strikes with the force of a tidal wave. Ley-line energy arcs from its body, shattering stone and warping reality. Your allies scatter — those who came with you — fighting for their lives.\n\nThe serpent is power made manifest, and it fights with the desperation of an ideology that knows it\'s cornered. But you have something it doesn\'t: you fight for people, not principles.',
      isCombatNode: true,
      combatEncounterId: 'ouroboros_serpent',
      choices: [
        { id: 'ch09_serpent_falls', text: 'Continue...', targetNode: 'ch09_guardian_defeated' },
      ],
    },
    {
      id: 'ch09_guardian_defeated',
      chapterId: 'ch09',
      title: 'The Serpent Falls',
      text: 'The guardian shatters, its energy dispersing into the walls. The cavern shakes. Maren staggers as the Nexus loses its protector.\n\nHe turns to face you, the glow in his eyes flickering. Behind the power, behind the ideology, you see the man — old, tired, grieving for a world he couldn\'t fix.\n\n"Thirty years," he whispers. "I gave everything. Every friend, every principle, every piece of my soul. For this. And you\'re going to stop me."',
      speaker: 'duke_maren',
      choices: [
        { id: 'ch09_to_final', text: 'Face the Architect.', targetNode: 'ch09_end' },
      ],
    },
    {
      id: 'ch09_maren_hesitates',
      chapterId: 'ch09',
      title: 'A Crack in the Resolve',
      text: 'Your words find the wound beneath the armor. Maren\'s hand trembles on the Nexus controls.\n\n"You think I haven\'t considered mercy?" he says, his voice cracking. "I tried mercy for twenty years. They burned my school. They killed my students. They took everything gentle and crushed it beneath their boots."\n\nThe guardian wavers, reflecting its master\'s uncertainty. "Give me one reason. One real reason why the cycle deserves to continue."',
      speaker: 'duke_maren',
      choices: [
        {
          id: 'ch09_argue_hope',
          text: '"Because the people in this city — the refugees, the farmers, the children — they didn\'t create the cycle. They don\'t deserve to pay for it."',
          targetNode: 'ch09_maren_broken',
          consequences: [
            { type: 'grant_xp', target: 'charisma', value: 20 },
          ],
        },
        {
          id: 'ch09_argue_change',
          text: '"Because breaking the cycle by force just starts a new one. You become the next tyrant."',
          targetNode: 'ch09_maren_broken',
          consequences: [
            { type: 'grant_xp', target: 'intelligence', value: 15 },
          ],
        },
        {
          id: 'ch09_attack_while_distracted',
          text: 'While he\'s distracted, strike at the Nexus controls.',
          targetNode: 'ch09_guardian_defeated',
          consequences: [
            { type: 'grant_xp', target: 'cunning', value: 15 },
            { type: 'set_relationship', target: 'mireth', value: -10 },
          ],
        },
      ],
    },
    {
      id: 'ch09_maren_broken',
      chapterId: 'ch09',
      title: 'The Architect\'s Tears',
      text: 'Maren\'s hand falls from the controls. The glow in his eyes dies. The guardian collapses into inert energy.\n\nThe old man stands in the fading light of the half-charged Nexus, and for the first time, he looks his age. "You\'re right," he says. "God help me, you\'re right. I became the thing I hated. The serpent eating its own tail."\n\nHe looks at the Nexus. "It\'s still charging. I... I don\'t know if I can stop it alone."',
      speaker: 'duke_maren',
      consequences: [
        { type: 'set_flag', target: 'maren_surrendered', value: true },
      ],
      choices: [
        { id: 'ch09_help_maren_stop', text: '"Then we stop it together."', targetNode: 'ch09_end' },
      ],
    },
    {
      id: 'ch09_codex_counter',
      chapterId: 'ch09',
      title: 'Knowledge Against Knowledge',
      text: 'You open the Obsidian Codex and begin the counter-sequence. The Nexus shudders as your interference disrupts its harmonics. Maren\'s eyes widen — he didn\'t expect anyone to have this knowledge.\n\n"The Codex," he breathes. "You found it. Clever. But even the Codex can only slow the process, not stop it. The ley-lines have too much momentum."',
      speaker: 'duke_maren',
      consequences: [
        { type: 'grant_xp', target: 'intelligence', value: 20 },
      ],
      choices: [
        {
          id: 'ch09_codex_and_fight',
          text: 'Keep channeling the Codex while your allies fight the guardian.',
          targetNode: 'ch09_guardian_battle',
        },
        {
          id: 'ch09_codex_overload',
          text: 'Overload the Codex to create a feedback loop in the Nexus.',
          targetNode: 'ch09_end',
          consequences: [
            { type: 'modify_stat', target: 'resolve', value: -2, description: 'The magical backlash is devastating' },
            { type: 'grant_xp', target: 'intelligence', value: 15 },
          ],
        },
      ],
    },
    {
      id: 'ch09_final_plea',
      chapterId: 'ch09',
      title: 'Words in the Maelstrom',
      text: 'You walk toward Maren, past the coiling guardian, hands raised. The energy buffets you like a storm. Every step is agony.\n\n"Maren! Aldous! This isn\'t who you were meant to be!"',
      choices: [
        { id: 'ch09_plea_result', text: 'Press forward.', targetNode: 'ch09_guardian_battle' },
      ],
    },
    {
      id: 'ch09_end',
      chapterId: 'ch09',
      title: 'The Turning Point',
      text: 'The Nexus still hums — damaged, disrupted, but not defeated. Maren is beaten or broken, but his creation has a momentum of its own. The ley-lines are already half-captured, and the energy continues to build.\n\nAbove, the city still fights. Below, the cavern trembles. The Nexus will reach full power by dawn unless you find a way to shut it down permanently.\n\nAnd that will require a choice — a final, irrevocable choice about what kind of world Valdris will be.\n\nThe last chapter of your story is about to be written.',
      isEndNode: true,
      choices: [],
    },
  ],
};

export default chapter09;
