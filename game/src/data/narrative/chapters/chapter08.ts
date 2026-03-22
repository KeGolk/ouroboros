import { Chapter } from '../../../types/narrative';

const chapter08: Chapter = {
  id: 'ch08',
  number: 8,
  title: 'The Unmasking',
  subtitle: 'In which the Architect is revealed and the final game begins',
  description:
    'All paths converge as the Architect\'s identity is finally revealed. The conspiracy\'s full scope becomes clear, and you must choose your final allegiance before the endgame begins.',
  imagePrompt:
    'A hooded figure standing revealed in a shaft of light in a dark underground chamber, faction symbols crumbling on the walls, shocked faces of onlookers, oil painting style, dramatic chiaroscuro',
  startNodeId: 'ch08_start',
  availableFactions: ['iron_covenant', 'verdant_court', 'obsidian_circle', 'ashen_throne'],
  keyCharacters: ['magister_thorn', 'princess_isolde', 'commander_vareth', 'archdruid_elara', 'mireth', 'duke_maren'],
  minLevel: 8,
  nodes: [
    {
      id: 'ch08_start',
      chapterId: 'ch08',
      title: 'All Roads to Valdris',
      text: 'The capital seethes. The Border War — whether it ended in peace or blood — has left every faction on edge. The Conclave is convened one final time in the Hall of Kings, and this time, everyone knows it will be the last.\n\nBut you have one advantage the others lack: you know the Architect is close. The evidence — from the Library, from Maren, from Mireth\'s warnings — all points to someone within the factions themselves. Someone who was cast out and seeks revenge against all.\n\nAs you enter the Hall, the compass burns against your chest. It has never been this warm.',
      choices: [
        {
          id: 'ch08_use_crystal',
          text: 'Use the Library\'s crystal to reveal the Architect\'s identity.',
          targetNode: 'ch08_crystal_reveal',
          conditions: [
            { type: 'flag_set', target: 'kingslayer_identified', operator: '==', value: true },
          ],
        },
        {
          id: 'ch08_confront_maren_final',
          text: 'Force Duke Maren to reveal what he knows.',
          targetNode: 'ch08_maren_reveal',
          conditions: [
            { type: 'flag_set', target: 'spared_duke_maren', operator: '==', value: true },
          ],
        },
        {
          id: 'ch08_ask_mireth_final',
          text: 'Find Mireth. She\'s been holding back the final piece.',
          targetNode: 'ch08_mireth_reveal',
        },
        {
          id: 'ch08_set_trap',
          text: 'Set a trap at the Conclave. The Architect won\'t resist attending.',
          targetNode: 'ch08_trap_set',
          consequences: [{ type: 'grant_xp', target: 'cunning', value: 15 }],
        },
      ],
    },
    {
      id: 'ch08_crystal_reveal',
      chapterId: 'ch08',
      title: 'The Face in the Crystal',
      text: 'You activate the crystal before the assembled Conclave. Light spills from it, forming a face that everyone recognizes — and no one expects.\n\nThe Architect is Aldous Maren. Not a puppet, not a middleman — the Duke himself. The genial grandfather, the eternal survivor, the man who served six kings. He orchestrated the assassination, founded the new Ouroboros, and has been playing every faction against every other from the very beginning.\n\nMaren, if still alive, rises slowly from his chair. His grandfatherly mask drops for the last time, revealing something cold and ancient and utterly resolved.\n\n"Thirty years," he says. "I have watched kings destroy this realm. I have watched factions tear it apart. I have tried reform, persuasion, patience. None of it worked. The system is the disease. I am merely the surgeon."',
      speaker: 'duke_maren',
      consequences: [
        { type: 'set_flag', target: 'kingslayer_identified', value: true },
      ],
      choices: [
        {
          id: 'ch08_seize_maren_crystal',
          text: '"Seize him!"',
          targetNode: 'ch08_confrontation',
        },
        {
          id: 'ch08_hear_out_crystal',
          text: '"Wait. Let him speak. The realm deserves to hear the full truth."',
          targetNode: 'ch08_maren_speech',
          consequences: [{ type: 'grant_xp', target: 'cunning', value: 10 }],
        },
      ],
    },
    {
      id: 'ch08_maren_reveal',
      chapterId: 'ch08',
      title: 'The Duke Confesses',
      text: 'Cornered, out of options, Duke Maren does something no one expects: he tells the truth. All of it.\n\n"I killed the king. Or rather, I arranged his killing. I founded the new Ouroboros. I set every faction against the others. And I would do it all again." He looks at each faction leader in turn. "Because all of you — every one — would have done the same thing in my position. You just lack the honesty to admit it."\n\nThe hall erupts.',
      speaker: 'duke_maren',
      consequences: [
        { type: 'set_flag', target: 'kingslayer_identified', value: true },
      ],
      choices: [
        {
          id: 'ch08_to_confrontation_maren',
          text: 'Confront Maren before the situation spirals.',
          targetNode: 'ch08_confrontation',
        },
      ],
    },
    {
      id: 'ch08_mireth_reveal',
      chapterId: 'ch08',
      title: 'The Crone\'s Final Truth',
      text: 'You find Mireth in the palace cemetery, sitting on the same headstone. She looks older than you\'ve ever seen her.\n\n"You\'ve figured it out," she says. It\'s not a question. "Maren. It was always Maren. I knew thirty years ago, when we were both part of the original Ouroboros. We disagreed on methods. I left. He... evolved."\n\nShe stands with effort. "I should have stopped him then. I was too cowardly — or too understanding. His grief was real. His logic was sound. Only his conclusions were monstrous." She takes your hand. "End this. Please. Before what he\'s building activates and everything we\'ve fought for turns to ash."',
      speaker: 'mireth',
      consequences: [
        { type: 'set_flag', target: 'kingslayer_identified', value: true },
        { type: 'set_relationship', target: 'mireth', value: 15 },
      ],
      choices: [
        {
          id: 'ch08_go_to_conclave',
          text: 'Go to the Conclave and expose Maren.',
          targetNode: 'ch08_confrontation',
        },
      ],
    },
    {
      id: 'ch08_trap_set',
      chapterId: 'ch08',
      title: 'The Spider\'s Web',
      text: 'You work with Lysara and your allies to set a trap at the Conclave. False intelligence, carefully placed, suggests that the Nexus can be activated from the Hall of Kings itself. The Architect won\'t be able to resist.\n\nDuring the Conclave\'s opening ceremony, you spot it: Duke Maren, alone in a corridor he shouldn\'t be in, placing something on a ley-line junction point beneath the floor.\n\nYour people move in. Maren looks up, and for the first time, you see surprise on his face.',
      consequences: [
        { type: 'set_flag', target: 'kingslayer_identified', value: true },
      ],
      choices: [
        { id: 'ch08_spring_trap', text: '"It\'s over, Maren."', targetNode: 'ch08_confrontation' },
      ],
    },
    {
      id: 'ch08_maren_speech',
      chapterId: 'ch08',
      title: 'The Architect\'s Manifesto',
      text: 'Maren speaks, and despite everything, his words have a terrible clarity:\n\n"I served six kings. Each worse than the last. I watched the Covenant crush dissent in the name of order. I watched the Court let people die rather than compromise their principles. I watched the Circle hoard knowledge that could cure plagues. I watched the throne inherit power it never earned.\n\n"Every faction believes they\'re righteous. None of them are. The cycle repeats: power concentrates, corrupts, destroys, reconcentrates. The Ouroboros. The only way to break it is to break every pillar at once."\n\nHe activates a device beneath his robes. The floor glows with ley-line energy. "The Nexus is already charging. By midnight, it will be ready. And then — no more kings. No more factions. No more cycle."',
      speaker: 'duke_maren',
      choices: [
        { id: 'ch08_stop_maren', text: 'Stop him!', targetNode: 'ch08_confrontation' },
      ],
    },
    {
      id: 'ch08_confrontation',
      chapterId: 'ch08',
      title: 'The Architect Unleashed',
      text: 'Maren activates the Nexus\'s preliminary stage. Energy surges through the hall. Soldiers are thrown back. The faction leaders steady themselves.\n\nMaren stands at the center of a swirling vortex of ley-line energy, more powerful than any individual should be. His eyes glow with the same violet light as the Nexus.\n\n"You can\'t stop this," he says, his voice echoing with power. "The siphons have been feeding the Nexus for months. I only need to reach the central chamber beneath the palace. The path is already open."\n\nHe gestures, and a section of the floor collapses, revealing stairs descending into purple-lit darkness. Maren drops through before anyone can reach him.\n\nThe faction leaders turn to each other — and to you.',
      choices: [
        {
          id: 'ch08_rally_all',
          text: '"We pursue him together. All factions, one enemy."',
          targetNode: 'ch08_united_pursuit',
          consequences: [
            { type: 'grant_xp', target: 'charisma', value: 15 },
            { type: 'set_flag', target: 'forged_alliance', value: true },
          ],
          statCheck: {
            stat: 'charisma',
            difficulty: 14,
            successNode: 'ch08_united_pursuit',
            failureNode: 'ch08_divided_pursuit',
            description: 'Rally all factions to pursue the Architect together',
          },
        },
        {
          id: 'ch08_go_alone',
          text: '"I\'ll go after him. The factions secure the surface."',
          targetNode: 'ch08_solo_pursuit',
          consequences: [{ type: 'grant_xp', target: 'resolve', value: 15 }],
        },
        {
          id: 'ch08_let_maren_go',
          text: '"Let him go. If the Nexus activates, we need to prepare defenses, not chase him."',
          targetNode: 'ch08_prepare_defense',
          consequences: [{ type: 'grant_xp', target: 'cunning', value: 15 }],
        },
      ],
    },
    {
      id: 'ch08_united_pursuit',
      chapterId: 'ch08',
      title: 'Together into Darkness',
      text: 'For the first time in Valdris\'s history, all four factions act as one. Vareth\'s soldiers form the vanguard. Elara\'s druids reinforce the ley-lines against corruption. Thorn\'s mages counter Maren\'s traps. And Isolde leads from the front, the Ashen Crown on her brow.\n\nYou descend together into the Nexus chamber. The corridor blazes with contained power. The walls pulse like a heartbeat.',
      consequences: [
        { type: 'set_flag', target: 'forged_alliance', value: true },
      ],
      choices: [
        { id: 'ch08_into_nexus', text: 'Press into the Nexus chamber.', targetNode: 'ch08_end' },
      ],
    },
    {
      id: 'ch08_divided_pursuit',
      chapterId: 'ch08',
      title: 'Fractured Pursuit',
      text: 'The factions can\'t agree. Vareth wants to send soldiers. Elara wants to collapse the tunnel. Thorn wants to capture the Nexus intact. Isolde wants to lead personally.\n\nIn the end, you go with whatever faction has the strongest bond with you, while the others argue. Time bleeds away.',
      choices: [
        { id: 'ch08_divided_into_nexus', text: 'Descend with your closest allies.', targetNode: 'ch08_end' },
      ],
    },
    {
      id: 'ch08_solo_pursuit',
      chapterId: 'ch08',
      title: 'Alone in the Dark',
      text: 'You descend alone, leaving the factions to secure the surface. The corridor narrows, pulses with energy. You can feel Maren ahead — feel the Nexus pulling at you like a riptide.\n\nThis is how it began: alone, on a road, walking toward danger. Perhaps it\'s fitting that it ends the same way.',
      choices: [
        { id: 'ch08_solo_into_nexus', text: 'Continue alone.', targetNode: 'ch08_end' },
      ],
    },
    {
      id: 'ch08_prepare_defense',
      chapterId: 'ch08',
      title: 'Fortifying the Surface',
      text: 'You organize the factions into a defensive perimeter around the palace. If the Nexus activates, you want barriers, wards, and every blade available.\n\nThorn works with Elara to create a containment circle. Vareth positions soldiers at choke points. Isolde coordinates the evacuated civilians.\n\nBeneath your feet, the ground begins to hum.',
      choices: [
        { id: 'ch08_defense_end', text: 'The Nexus is charging. Time is running out.', targetNode: 'ch08_end' },
      ],
    },
    {
      id: 'ch08_end',
      chapterId: 'ch08',
      title: 'The Descent',
      text: 'The path to the Nexus chamber is a tunnel carved through living rock, lined with crystallized ley-line energy. The air hums with power. Your compass doesn\'t spin anymore — it points straight ahead, steady as a heartbeat.\n\nMaren is down there. The Nexus is down there. And the fate of every faction, every person, every ideal you\'ve fought for will be decided in the hours to come.\n\nYou take a breath. You step forward. The final act begins.',
      isEndNode: true,
      choices: [],
    },
  ],
};

export default chapter08;
