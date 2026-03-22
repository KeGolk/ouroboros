import { Chapter } from '../../../types/narrative';

const chapter10: Chapter = {
  id: 'ch10',
  number: 10,
  title: 'The Ashen Crown',
  subtitle: 'In which all choices find their consequence',
  description:
    'The final chapter. The Nexus must be dealt with, the Architect\'s legacy resolved, and the future of Valdris decided. Your accumulated choices, alliances, and character determine which of the six endings unfolds.',
  imagePrompt:
    'A massive underground chamber with a glowing crystalline nexus at its center, four faction leaders standing at cardinal points, the protagonist at the heart facing the ultimate choice, oil painting style, all faction colors swirling together',
  startNodeId: 'ch10_start',
  availableFactions: ['iron_covenant', 'verdant_court', 'obsidian_circle', 'ashen_throne'],
  keyCharacters: ['commander_vareth', 'archdruid_elara', 'magister_thorn', 'princess_isolde', 'mireth', 'duke_maren'],
  minLevel: 10,
  isBossChapter: true,
  bossId: 'nexus_core',
  nodes: [
    {
      id: 'ch10_start',
      chapterId: 'ch10',
      title: 'Dawn of the Last Day',
      text: 'The Nexus chamber pulses with barely contained energy. The device — part machine, part magic, part something older — throbs at the cavern\'s center like a second heart beneath the city. Its light paints everything in shades of violet and gold.\n\nYour allies have gathered — those who survived, those who chose to stand with you. Each faction leader (or their successor, if the leader fell) stands at a cardinal point around the Nexus, as if drawn there by the ley-lines themselves.\n\nMireth appears at your side. "This is the moment, dear. The Nexus can be destroyed, controlled, redirected, or..." she pauses. "...embraced. Each path leads to a different world. Choose wisely. There are no second chances."\n\nThe compass in your pocket burns one final time, then goes still. It has brought you here. The rest is up to you.',
      speaker: 'mireth',
      imagePrompt: 'A vast underground cavern with a massive crystalline device pulsing with purple-gold energy, four groups of people standing at cardinal points, an elderly woman and the protagonist at the center, oil painting style, epic and solemn',
      choices: [
        {
          id: 'ch10_iron_path',
          text: 'Seize the Nexus for the Iron Covenant. Order will be enforced.',
          targetNode: 'ch10_iron_ending',
          conditions: [
            { type: 'faction_reputation', target: 'iron_covenant', operator: '>=', value: 50 },
          ],
          consequences: [
            { type: 'faction_rep', target: 'iron_covenant', value: 20 },
            { type: 'set_flag', target: 'supported_martial_law', value: true },
          ],
        },
        {
          id: 'ch10_verdant_path',
          text: 'Return the Nexus energy to the land. Dissolve centralized power.',
          targetNode: 'ch10_verdant_ending',
          conditions: [
            { type: 'faction_reputation', target: 'verdant_court', operator: '>=', value: 50 },
          ],
          consequences: [
            { type: 'faction_rep', target: 'verdant_court', value: 20 },
            { type: 'set_flag', target: 'dissolved_monarchy', value: true },
          ],
        },
        {
          id: 'ch10_obsidian_path',
          text: 'Activate the Nexus under the Circle\'s guidance. Knowledge will govern.',
          targetNode: 'ch10_obsidian_ending',
          conditions: [
            { type: 'faction_reputation', target: 'obsidian_circle', operator: '>=', value: 50 },
          ],
          consequences: [
            { type: 'faction_rep', target: 'obsidian_circle', value: 20 },
            { type: 'set_flag', target: 'nexus_activated', value: true },
          ],
        },
        {
          id: 'ch10_ashen_path',
          text: 'Destroy the Nexus and crown Isolde under a charter of rights.',
          targetNode: 'ch10_ashen_ending',
          conditions: [
            { type: 'faction_reputation', target: 'ashen_throne', operator: '>=', value: 50 },
          ],
          consequences: [
            { type: 'faction_rep', target: 'ashen_throne', value: 20 },
            { type: 'set_flag', target: 'charter_drafted', value: true },
          ],
        },
        {
          id: 'ch10_shadow_path',
          text: 'Sabotage the Nexus so no faction can claim it. Rule from the shadows.',
          targetNode: 'ch10_shadow_ending',
          conditions: [
            { type: 'stat_minimum', target: 'cunning', operator: '>=', value: 14 },
          ],
          isHidden: true,
        },
        {
          id: 'ch10_exile_path',
          text: 'Walk away. Let them fight over it. You\'re done.',
          targetNode: 'ch10_exile_ending',
        },
      ],
    },
    // ── Iron Covenant Ending Path ──
    {
      id: 'ch10_iron_ending',
      chapterId: 'ch10',
      title: 'The Iron Will',
      text: 'You direct the Nexus energy toward Vareth. The Commander gasps as power flows into him — not corrupting, but amplifying. His mechanical hand blazes with light. His voice, when he speaks, carries the weight of the ley-lines themselves.\n\n"By the authority vested in me by the realm\'s need and the will of its people," he declares, "I claim governance of Valdris. Not as king — as Protector. Until order is restored."\n\nElara shakes her head in sorrow. Thorn calculates. Isolde reaches for her sword, then lets her hand fall. The power is undeniable.\n\nBrynn catches your eye across the chamber. Her expression is unreadable — pride and fear in equal measure.\n\nVareth turns to you. "You made this possible. Will you serve as my right hand? Help me build something that lasts?"',
      speaker: 'commander_vareth',
      consequences: [
        { type: 'set_flag', target: 'supported_martial_law', value: true },
        { type: 'unlock_ending', target: 'iron_dominion', value: true },
      ],
      choices: [
        {
          id: 'ch10_accept_iron',
          text: '"I will. But I\'ll also tell you when you\'re wrong."',
          targetNode: 'ch10_iron_epilogue',
        },
        {
          id: 'ch10_refuse_iron',
          text: '"I helped you claim power. I won\'t help you keep it. That you must earn."',
          targetNode: 'ch10_iron_epilogue',
          consequences: [{ type: 'set_relationship', target: 'commander_vareth', value: -10 }],
        },
      ],
    },
    {
      id: 'ch10_iron_epilogue',
      chapterId: 'ch10',
      title: 'The Iron Dominion',
      text: 'The Nexus energy stabilizes under Covenant control. The siege ends. Order is restored with brutal efficiency.\n\nIn the weeks that follow, Vareth is true to his word — mostly. The borders are secured, justice is dispensed, the bandits are crushed. But the emergency powers never quite expire. The military tribunals that were "temporary" become permanent. And the other factions, stripped of their independent power, can only watch as the Covenant\'s iron grip tightens.\n\nYou sit at the council table, honored and troubled, as the Protector\'s most trusted advisor. The peace is real. The cost is freedom. And somewhere in the back of your mind, Mireth\'s voice whispers: "The cycle continues."',
      isEndNode: true,
      choices: [],
    },
    // ── Verdant Court Ending Path ──
    {
      id: 'ch10_verdant_ending',
      chapterId: 'ch10',
      title: 'The Great Unbinding',
      text: 'You and Elara work together to reverse the Nexus — not destroying it, but opening it. The concentrated ley-line energy flows outward, returning to the earth, the rivers, the roots of trees. The Thornwood shudders with renewed life. Across the realm, the land itself heals.\n\nThe Nexus crumbles as its purpose is fulfilled. No one will ever concentrate this much power again — the ley-lines, once freed, will resist any attempt at capture.\n\n"The monarchy dies here," Elara says. "Not with violence, but with the land\'s consent. From this day, the realm governs itself — village by village, grove by grove, each answering to their neighbors, not to a throne."\n\nRowan weeps openly. He\'s never looked so young.',
      speaker: 'archdruid_elara',
      consequences: [
        { type: 'set_flag', target: 'dissolved_monarchy', value: true },
        { type: 'unlock_ending', target: 'verdant_renewal', value: true },
      ],
      choices: [
        {
          id: 'ch10_accept_verdant',
          text: 'Embrace the new world. Take your place on the Grand Council.',
          targetNode: 'ch10_verdant_epilogue',
        },
      ],
    },
    {
      id: 'ch10_verdant_epilogue',
      chapterId: 'ch10',
      title: 'The Verdant Renewal',
      text: 'The Grand Council convenes beneath the Heartwood, now healthier than it\'s been in centuries. Elara guides but does not rule. Vareth grumbles but serves. Thorn contributes knowledge without demanding control. Even Isolde, crown set aside, finds purpose as the voice of the old nobility learning new ways.\n\nIt is imperfect. It is slow. It is, perhaps, the closest thing to justice this realm has ever known.\n\nYou sit in the Council circle as the seasons turn, helping mediate disputes between villages that have never governed themselves before. It is humble work. It is necessary work. And when you walk through the Thornwood, the trees bow.',
      isEndNode: true,
      choices: [],
    },
    // ── Obsidian Circle Ending Path ──
    {
      id: 'ch10_obsidian_ending',
      chapterId: 'ch10',
      title: 'The Arcane Ascension',
      text: 'You help Thorn take control of the Nexus. The Magister\'s eyes blaze with violet fire as the ley-lines answer to him — and through him, to the Circle.\n\n"This is what the Ouroboros was meant to be," he whispers. "Not destruction. Transcendence. With this power, we can end disease, hunger, ignorance. We can build a paradise."\n\nLysara watches with a mixture of awe and terror. "And who decides what paradise looks like?" she asks quietly.\n\nThorn doesn\'t answer. He\'s already working.',
      speaker: 'magister_thorn',
      consequences: [
        { type: 'set_flag', target: 'nexus_activated', value: true },
        { type: 'unlock_ending', target: 'obsidian_ascension', value: true },
      ],
      choices: [
        {
          id: 'ch10_accept_obsidian',
          text: 'Stand with Thorn. Guide this power toward good.',
          targetNode: 'ch10_obsidian_epilogue',
        },
      ],
    },
    {
      id: 'ch10_obsidian_epilogue',
      chapterId: 'ch10',
      title: 'The Obsidian Ascension',
      text: 'Valdris transforms. Diseases that have plagued the realm for centuries are cured in weeks. Crops grow in abundance. The weather itself obeys the Circle\'s calculations.\n\nBut the price is surveillance. The ley-lines that heal also watch. Every use of magic — a farmer\'s hedge-charm, a midwife\'s soothing spell — is monitored. The Circle says it\'s for safety. It always starts with safety.\n\nYou serve as Thorn\'s bridge to the mundane world, translating his brilliant but inhuman vision into policies that people can live with. It works, mostly. But you see the cracks — the ley-lines straining, Thorn\'s grip tightening, Lysara\'s growing unease.\n\nParadise has a shelf life. You just hope you can keep it together long enough for something gentler to grow.',
      isEndNode: true,
      choices: [],
    },
    // ── Ashen Throne Ending Path ──
    {
      id: 'ch10_ashen_ending',
      chapterId: 'ch10',
      title: 'The Crown Reforged',
      text: 'You destroy the Nexus. The explosion of freed energy shakes the mountain, cracks the palace walls, and sends a shockwave across Valdris that clears the sky of storm clouds for the first time in weeks.\n\nIn the silence that follows, you produce the Charter of Rights — drafted in late nights with Isolde, debated with every faction. Not a perfect document. A possible one.\n\nIsolde takes the Ashen Crown — blackened, battered, but unbroken — and places it on her own head. "I take this crown not by right of blood, but by consent of the governed. And I submit myself to this charter, as will every ruler who follows me."\n\nShe looks at you. "Will you witness?"',
      speaker: 'princess_isolde',
      consequences: [
        { type: 'set_flag', target: 'charter_drafted', value: true },
        { type: 'give_item', target: 'charter_scroll', value: true },
        { type: 'unlock_ending', target: 'ashen_restoration', value: true },
      ],
      choices: [
        {
          id: 'ch10_witness_coronation',
          text: '"I witness. And I\'ll hold you to it."',
          targetNode: 'ch10_ashen_epilogue',
        },
      ],
    },
    {
      id: 'ch10_ashen_epilogue',
      chapterId: 'ch10',
      title: 'The Ashen Restoration',
      text: 'The coronation is held in the ruins of the Hall of Kings, open to the sky where the roof collapsed during the siege. It feels right — a new beginning in the wreckage of the old.\n\nIsolde rules. Not perfectly — she has her father\'s temper and her own demons. But the charter holds. The factions maintain their autonomy under the crown\'s protection. Disputes are mediated, not crushed.\n\nYou serve as Chancellor — the voice that tells the queen uncomfortable truths. Some days she listens. Some days she doesn\'t. But the charter remains, and with it, the hope that this time, the cycle might actually bend.',
      isEndNode: true,
      choices: [],
    },
    // ── Shadow Throne Ending Path ──
    {
      id: 'ch10_shadow_ending',
      chapterId: 'ch10',
      title: 'The Puppeteer\'s Gambit',
      text: 'While the faction leaders argue about what to do with the Nexus, you work quietly. A word here, a sabotaged connection there, a false reading that sends Thorn\'s calculations askew. The Nexus doesn\'t explode or activate — it simply... fails. Magnificently, spectacularly, and in a way that each faction blames on the others.\n\nIn the confusion, you ensure that the Nexus\'s residual energy is distributed — a little to each faction, enough to keep them strong enough to resist each other but too weak to dominate. A perfect balance of weakness.\n\nMaren, if he\'s alive, watches from his cell and laughs. "You\'re me," he says. "Thirty years ago. I wonder if you\'ll end up in the same place."',
      speaker: 'duke_maren',
      consequences: [
        { type: 'set_flag', target: 'betrayed_iron', value: true },
        { type: 'set_flag', target: 'betrayed_verdant', value: true },
        { type: 'set_flag', target: 'betrayed_obsidian', value: true },
        { type: 'set_flag', target: 'betrayed_ashen', value: true },
        { type: 'unlock_ending', target: 'shadow_throne', value: true },
      ],
      choices: [
        {
          id: 'ch10_accept_shadow',
          text: 'Smile. The game never ends — it just changes players.',
          targetNode: 'ch10_shadow_epilogue',
        },
      ],
    },
    {
      id: 'ch10_shadow_epilogue',
      chapterId: 'ch10',
      title: 'The Shadow Throne',
      text: 'No one knows what you did. That\'s the point.\n\nA new government forms — messy, contentious, a compromise that satisfies no one completely. Which means it\'s working. Behind it, invisible, you pull strings. You feed information to factions that need it, withhold it from factions that don\'t. You prevent crises that no one even knows were coming.\n\nIt is lonely, exhausting, terrifying work. One mistake and the balance collapses. But someone has to do it. Someone who understands that power is most dangerous when it\'s visible, and most useful when it\'s not.\n\nYou take a sip of wine. Alone. Watching the city from a window in a house no one knows you own.\n\nThe serpent eats its tail. But this time, you\'re the one holding the serpent.',
      isEndNode: true,
      choices: [],
    },
    // ── Exile Ending Path ──
    {
      id: 'ch10_exile_ending',
      chapterId: 'ch10',
      title: 'The Road South',
      text: 'You look at the Nexus. You look at the faction leaders, each burning with ambition or idealism or both. You look at your hands — scarred, tired, stained with choices that will never wash clean.\n\n"No," you say.\n\nEveryone stops.\n\n"I\'m done." You place the compass on the ground. "You all have enough power to destroy each other or to build something. I\'m not going to make that choice for you. I\'ve been everyone\'s tool, everyone\'s weapon, everyone\'s pawn. No more."\n\nYou walk out of the cavern, up through the tunnels, past the bewildered soldiers, through the broken gates, and out onto the southern road. No one stops you. Perhaps they\'re too shocked. Perhaps they understand.',
      consequences: [
        { type: 'set_flag', target: 'refused_all_factions', value: true },
        { type: 'unlock_ending', target: 'exile_wanderer', value: true },
      ],
      choices: [
        {
          id: 'ch10_keep_walking',
          text: 'Keep walking. Don\'t look back.',
          targetNode: 'ch10_exile_epilogue',
        },
      ],
    },
    {
      id: 'ch10_exile_epilogue',
      chapterId: 'ch10',
      title: 'The Exile\'s Road',
      text: 'The road south is long. Behind you, the sky above Valdris flickers with the lights of whatever choice the factions make without you. You don\'t turn around.\n\nWeeks pass. You cross the Thornwood\'s southern edge, where Rowan\'s ravens follow you for a day before turning back. You pass through the Salted Marches, where an old woman who might be Mireth waves from a hilltop, or might just be a farmer.\n\nYou find a village. You find a garden. You find, slowly, a version of yourself that doesn\'t flinch at loud noises or calculate escape routes in every room.\n\nThe compass is gone. You don\'t need it anymore. You know what matters most.\n\nIt\'s a quiet life. It\'s a small life. It\'s yours.\n\nAnd it\'s enough.',
      imagePrompt: 'A small cottage garden in golden afternoon light, a figure in simple clothes tending vegetables, distant mountains on the horizon, a walking stick leaning against the wall, peaceful and warm, oil painting style, soft golden palette',
      isEndNode: true,
      choices: [],
    },
  ],
};

export default chapter10;
