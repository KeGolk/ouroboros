import { Chapter } from '../../../types/narrative';

const chapter07: Chapter = {
  id: 'ch07',
  number: 7,
  title: 'The Border War',
  subtitle: 'In which the factions clash and loyalties are forged in blood',
  description:
    'The Architect\'s provocations succeed: the Iron Covenant and the Verdant Court go to war on the western border. You must choose sides, seek peace, or exploit the chaos — while racing to prevent the conflict from spreading to all of Valdris.',
  imagePrompt:
    'A medieval battlefield at dawn with two armies facing each other across a misty field, siege engines and war banners, soldiers in iron armor versus nature-clad warriors, oil painting style, grey and red tones',
  startNodeId: 'ch07_start',
  availableFactions: ['iron_covenant', 'verdant_court', 'ashen_throne'],
  keyCharacters: ['commander_vareth', 'archdruid_elara', 'ser_brynn', 'rowan', 'princess_isolde'],
  minLevel: 7,
  isBossChapter: false,
  nodes: [
    {
      id: 'ch07_start',
      chapterId: 'ch07',
      title: 'The Western Front',
      text: 'It happened as the Architect planned. False evidence — a Covenant supply caravan "ambushed by druids," druidic groves "burned by Covenant soldiers" — has pushed both factions past the breaking point.\n\nCommander Vareth has marched his army to the Thornwood\'s edge. Archdruid Elara has woken the ancient defenses of the forest. Thousands of soldiers face an army of nature itself.\n\nYou arrive as the two forces stand a bowshot apart, neither willing to strike first but neither willing to retreat. In the no-man\'s-land between them, a single white flag flutters.',
      choices: [
        {
          id: 'ch07_negotiate_peace',
          text: 'Walk into no-man\'s-land under the white flag. Try to negotiate peace.',
          targetNode: 'ch07_peace_attempt',
          consequences: [
            { type: 'grant_xp', target: 'charisma', value: 15 },
          ],
        },
        {
          id: 'ch07_side_covenant',
          text: 'Join the Iron Covenant\'s ranks. Order must be maintained.',
          targetNode: 'ch07_covenant_camp',
          consequences: [
            { type: 'faction_rep', target: 'iron_covenant', value: 20 },
            { type: 'faction_rep', target: 'verdant_court', value: -20 },
          ],
        },
        {
          id: 'ch07_side_verdant',
          text: 'Join the Verdant Court\'s defense. The forest must be protected.',
          targetNode: 'ch07_verdant_camp',
          consequences: [
            { type: 'faction_rep', target: 'verdant_court', value: 20 },
            { type: 'faction_rep', target: 'iron_covenant', value: -20 },
          ],
        },
        {
          id: 'ch07_reveal_architect',
          text: 'Ride between both armies and reveal the Architect\'s manipulation.',
          targetNode: 'ch07_reveal_truth',
          consequences: [
            { type: 'grant_xp', target: 'charisma', value: 10 },
            { type: 'grant_xp', target: 'resolve', value: 10 },
          ],
          conditions: [
            { type: 'flag_set', target: 'learned_assassination_truth', operator: '==', value: true },
          ],
        },
      ],
    },
    {
      id: 'ch07_peace_attempt',
      chapterId: 'ch07',
      title: 'Between the Lines',
      text: 'Walking into no-man\'s-land takes more courage than any battle. Arrows from both sides track your movement. You feel very small between two forces that could crush you without thought.\n\nYou call for both leaders to meet. There\'s an agonizing pause — then Vareth steps forward from one side, Elara from the other. They meet in the middle, with you as the fulcrum.',
      choices: [
        {
          id: 'ch07_present_evidence',
          text: 'Present evidence that both sides were manipulated by the Architect.',
          targetNode: 'ch07_evidence_presented',
          conditions: [
            { type: 'flag_set', target: 'learned_assassination_truth', operator: '==', value: true },
          ],
          statCheck: {
            stat: 'charisma',
            difficulty: 14,
            successNode: 'ch07_peace_success',
            failureNode: 'ch07_peace_partial',
            description: 'Convince both leaders that they\'ve been manipulated',
          },
        },
        {
          id: 'ch07_appeal_honor',
          text: 'Appeal to their honor. This war serves no one but their enemies.',
          targetNode: 'ch07_honor_appeal',
          statCheck: {
            stat: 'charisma',
            difficulty: 16,
            successNode: 'ch07_peace_success',
            failureNode: 'ch07_peace_partial',
            description: 'Appeal to the leaders\' sense of honor',
          },
        },
        {
          id: 'ch07_propose_duel',
          text: 'Propose a champion\'s duel instead of full battle.',
          targetNode: 'ch07_duel_proposal',
          consequences: [{ type: 'grant_xp', target: 'cunning', value: 10 }],
        },
      ],
    },
    {
      id: 'ch07_evidence_presented',
      chapterId: 'ch07',
      title: 'The Truth Between Armies',
      text: 'You lay out everything: the Architect, the Ouroboros network, the false evidence planted to provoke exactly this confrontation. Both leaders listen — Vareth with a soldier\'s grim attention, Elara with ancient patience.\n\nWhen you finish, silence stretches between the armies.',
      choices: [
        { id: 'ch07_await_verdict', text: 'Wait for their response.', targetNode: 'ch07_peace_success' },
      ],
    },
    {
      id: 'ch07_peace_success',
      chapterId: 'ch07',
      title: 'The Thornwood Accord',
      text: 'Vareth and Elara look at each other — two leaders who have spent weeks preparing to kill the other\'s people. Then Vareth extends his mechanical hand.\n\n"I don\'t trust you," he says to Elara. "But I trust the evidence. And I trust this one." He nods at you. "We stand down. But I want the Architect\'s head on my wall."\n\nElara takes his hand. "The forest doesn\'t want your war, Commander. Find us the real enemy, and the Thornwood will fight beside you."\n\nIt\'s not friendship. It\'s not even trust. But it\'s not war.',
      consequences: [
        { type: 'set_flag', target: 'united_border_lords', value: true },
        { type: 'set_flag', target: 'forged_alliance', value: true },
        { type: 'faction_rep', target: 'iron_covenant', value: 10 },
        { type: 'faction_rep', target: 'verdant_court', value: 10 },
        { type: 'grant_xp', target: 'charisma', value: 20 },
      ],
      choices: [
        { id: 'ch07_peace_end', text: 'The armies stand down.', targetNode: 'ch07_end' },
      ],
    },
    {
      id: 'ch07_peace_partial',
      chapterId: 'ch07',
      title: 'A Fragile Ceasefire',
      text: 'Your words reach them — but not fully. Vareth agrees to a three-day ceasefire. Elara agrees to pull back the forest\'s defenses one mile. It\'s not peace, but it\'s not bloodshed.\n\n"Three days," Vareth says. "Bring me proof of this Architect, or we march." He turns on his heel and walks back to his army.\n\nElara watches him go. "Three days to prevent a war. I hope you work well under pressure."',
      consequences: [
        { type: 'set_flag', target: 'fragile_ceasefire', value: true },
        { type: 'grant_xp', target: 'charisma', value: 10 },
      ],
      choices: [
        { id: 'ch07_partial_end', text: 'The clock is ticking.', targetNode: 'ch07_end' },
      ],
    },
    {
      id: 'ch07_duel_proposal',
      chapterId: 'ch07',
      title: 'Trial by Combat',
      text: 'Both leaders consider the proposal. A single combat to decide the dispute — an ancient tradition that even the Covenant respects.\n\nVareth nods slowly. "I\'ll name my champion." He gestures to Ser Brynn, who steps forward, face pale but resolute.\n\nElara\'s eyes narrow. "The forest names its champion." Rowan emerges from the treeline, amber eyes blazing.\n\nTwo people you know — perhaps two people you care about — are about to fight to the death. Unless you intervene.',
      choices: [
        {
          id: 'ch07_volunteer_champion',
          text: '"I\'ll be the champion. For neither side — for the truth."',
          targetNode: 'ch07_player_duel',
          consequences: [{ type: 'grant_xp', target: 'resolve', value: 15 }],
        },
        {
          id: 'ch07_let_duel_proceed',
          text: 'Let the duel proceed. You can\'t save everyone.',
          targetNode: 'ch07_champion_duel',
        },
        {
          id: 'ch07_stop_duel',
          text: '"Wait — I have evidence that makes this duel unnecessary."',
          targetNode: 'ch07_evidence_presented',
          conditions: [
            { type: 'flag_set', target: 'learned_assassination_truth', operator: '==', value: true },
          ],
        },
      ],
    },
    {
      id: 'ch07_player_duel',
      chapterId: 'ch07',
      title: 'Your Fight',
      text: 'Both sides are stunned. But the ancient law is clear: any party may name themselves champion. You stand in the center of no-man\'s-land.\n\n"Who do you fight for?" Vareth demands.\n\n"For the truth. If I win, both sides stand down and hear what I have to say about who really started this war."\n\nAn Ouroboros agent steps forward from the Covenant ranks, dropping their disguise. "Then you\'ll fight me. The Architect suspected you might try this."',
      isCombatNode: true,
      combatEncounterId: 'ouroboros_champion',
      choices: [
        { id: 'ch07_win_duel', text: 'Continue...', targetNode: 'ch07_duel_victory' },
      ],
    },
    {
      id: 'ch07_duel_victory',
      chapterId: 'ch07',
      title: 'Victory and Revelation',
      text: 'You defeat the Ouroboros agent. As they fall, their disguise drops fully — revealing a face known to both armies. A Covenant officer AND a Verdant Court contact, playing both sides.\n\nThe gasps from both armies say everything. The truth is undeniable: they\'ve been played.',
      consequences: [
        { type: 'set_flag', target: 'united_border_lords', value: true },
        { type: 'grant_xp', target: 'strength', value: 20 },
      ],
      choices: [
        { id: 'ch07_duel_speech', text: 'Address both armies.', targetNode: 'ch07_peace_success' },
      ],
    },
    {
      id: 'ch07_champion_duel',
      chapterId: 'ch07',
      title: 'Steel Against Nature',
      text: 'Brynn and Rowan face each other. Steel versus claw. Discipline versus fury. The duel is savage and beautiful — and ends when Brynn disarms Rowan but refuses to deliver the killing blow.\n\n"I didn\'t become a knight to kill good people fighting for their home," she says, lowering her sword. Rowan stares at her, breathing hard.\n\nThe armies hold their breath.',
      choices: [
        {
          id: 'ch07_seize_moment',
          text: 'Seize the moment. "This is what the Architect wants — us killing each other."',
          targetNode: 'ch07_peace_partial',
          consequences: [
            { type: 'set_relationship', target: 'ser_brynn', value: 10 },
            { type: 'set_relationship', target: 'rowan', value: 10 },
          ],
        },
      ],
    },
    {
      id: 'ch07_covenant_camp',
      chapterId: 'ch07',
      title: 'Iron Ranks',
      text: 'You join Vareth\'s forces. The Commander clasps your shoulder. "Glad to have you. This won\'t be a slaughter — the druids are dangerous, but they\'re not soldiers. We hit their supply lines, force them to negotiate from weakness."\n\nSer Brynn looks at you with troubled eyes but says nothing. She has her orders.',
      choices: [
        {
          id: 'ch07_follow_orders',
          text: 'Follow Vareth\'s battle plan.',
          targetNode: 'ch07_covenant_battle',
          consequences: [{ type: 'grant_xp', target: 'strength', value: 15 }],
        },
        {
          id: 'ch07_suggest_mercy',
          text: 'Convince Vareth to target only military assets, not civilians.',
          targetNode: 'ch07_covenant_mercy',
          statCheck: {
            stat: 'charisma',
            difficulty: 12,
            successNode: 'ch07_covenant_mercy',
            failureNode: 'ch07_covenant_battle',
            description: 'Convince the Commander to show restraint',
          },
        },
      ],
    },
    {
      id: 'ch07_covenant_battle',
      chapterId: 'ch07',
      title: 'The Forest Burns',
      text: 'The battle is horrific. Covenant soldiers cut into the Thornwood with axes and fire while druidic magic sends roots and vines to crush them. You fight through scenes that will haunt your dreams.\n\nBy nightfall, the Covenant holds a mile of forest. But the cost is staggering — on both sides.',
      isCombatNode: true,
      combatEncounterId: 'border_battle',
      consequences: [
        { type: 'faction_rep', target: 'verdant_court', value: -15 },
        { type: 'set_relationship', target: 'rowan', value: -20 },
      ],
      choices: [
        { id: 'ch07_battle_aftermath', text: 'Survey the aftermath.', targetNode: 'ch07_end' },
      ],
    },
    {
      id: 'ch07_covenant_mercy',
      chapterId: 'ch07',
      title: 'A Soldier\'s Honor',
      text: 'Vareth agrees, grudgingly. "Targeted strikes. No fire in the deep wood. Civilian settlements are off-limits." He gives you a long look. "If we lose because of your mercy, remember that dead soldiers had families too."',
      consequences: [
        { type: 'faction_rep', target: 'verdant_court', value: 5 },
        { type: 'set_relationship', target: 'commander_vareth', value: -5 },
      ],
      choices: [
        { id: 'ch07_mercy_battle', text: 'The limited engagement begins.', targetNode: 'ch07_end' },
      ],
    },
    {
      id: 'ch07_verdant_camp',
      chapterId: 'ch07',
      title: 'Among the Trees',
      text: 'The Verdant Court\'s defense is the forest itself. Trees shift to block paths. Vines trap soldiers. Animals serve as scouts. Rowan coordinates the beasts while Elara maintains the deep enchantments.\n\n"We don\'t want to kill," Elara says. "We want to make the Covenant understand that the forest is not a resource to be conquered. It is alive. And it will defend itself."',
      speaker: 'archdruid_elara',
      choices: [
        {
          id: 'ch07_defensive_only',
          text: 'Help the Court maintain a purely defensive strategy.',
          targetNode: 'ch07_verdant_defense',
          consequences: [
            { type: 'grant_xp', target: 'intelligence', value: 10 },
          ],
        },
        {
          id: 'ch07_counter_attack',
          text: 'Suggest a counter-attack to force the Covenant to retreat.',
          targetNode: 'ch07_verdant_attack',
          consequences: [
            { type: 'grant_xp', target: 'cunning', value: 10 },
          ],
        },
      ],
    },
    {
      id: 'ch07_verdant_defense',
      chapterId: 'ch07',
      title: 'The Living Wall',
      text: 'The forest\'s defense is magnificent and terrible. The Thornwood becomes a maze that swallows soldiers, redirects armies, and exhaust invaders without killing them. By the third day, the Covenant is lost, demoralized, and ready to talk.',
      consequences: [
        { type: 'faction_rep', target: 'verdant_court', value: 10 },
        { type: 'grant_xp', target: 'intelligence', value: 15 },
      ],
      choices: [
        { id: 'ch07_defense_end', text: 'The forest holds.', targetNode: 'ch07_end' },
      ],
    },
    {
      id: 'ch07_verdant_attack',
      chapterId: 'ch07',
      title: 'Nature\'s Wrath',
      text: 'Rowan leads the counter-attack with savage joy. Animals swarm the Covenant\'s supply lines. Trees uproot themselves to form battering rams. The Covenant forces are driven back a league in a single night.\n\nBut in the chaos, you see something that gives you pause: Covenant soldiers fleeing in terror from walking trees. These are not evil men — they\'re frightened people following orders. The line between defense and atrocity blurs.',
      consequences: [
        { type: 'faction_rep', target: 'iron_covenant', value: -15 },
        { type: 'set_relationship', target: 'ser_brynn', value: -15 },
      ],
      choices: [
        { id: 'ch07_attack_end', text: 'The battle is won, but at what cost?', targetNode: 'ch07_end' },
      ],
    },
    {
      id: 'ch07_reveal_truth',
      chapterId: 'ch07',
      title: 'A Lone Voice',
      text: 'You ride between the armies, unarmed, and shout the truth: the assassination, the Architect, the false evidence, all of it. Arrows nock on both sides. Your voice cracks with urgency.\n\nFor a terrible moment, you think no one is listening. Then Ser Brynn steps forward from the Covenant line. "I believe them. I\'ve seen the evidence myself."\n\nAnd from the treeline, Rowan emerges. "The forest confirms it. The corruption came from outside — from neither army."',
      consequences: [
        { type: 'set_flag', target: 'united_border_lords', value: true },
        { type: 'grant_xp', target: 'charisma', value: 20 },
      ],
      choices: [
        { id: 'ch07_truth_aftermath', text: 'The truth echoes between the armies.', targetNode: 'ch07_peace_success' },
      ],
    },
    {
      id: 'ch07_honor_appeal',
      chapterId: 'ch07',
      title: 'The Weight of Honor',
      text: 'You speak of duty, of the oath every soldier and druid swore to protect the realm — not to destroy it. You speak of the children who will grow up fatherless, the forests that will take a century to regrow, the border that will lie open to true enemies while they fight each other.\n\nVareth\'s mechanical hand clenches. Elara\'s eyes glisten with something that might be tears.',
      choices: [
        { id: 'ch07_honor_result', text: 'Wait for their answer.', targetNode: 'ch07_peace_partial' },
      ],
    },
    {
      id: 'ch07_end',
      chapterId: 'ch07',
      title: 'The Cost of Conflict',
      text: 'Whether through peace, war, or uneasy ceasefire, the Border War leaves its mark. The factions are weakened, relationships are strained or strengthened, and the Architect watches from the shadows, calculating.\n\nBut something has changed. The factions can no longer pretend this is a simple power struggle. There is an enemy in the shadows, and they will need to face it — together or separately.\n\nIsolde sends word: while the west burned, she has been consolidating support in the capital. The Conclave will meet one final time. The realm\'s fate will be decided.\n\nThe compass points back to Valdris. The endgame approaches.',
      isEndNode: true,
      choices: [],
    },
  ],
};

export default chapter07;
