import { Chapter } from '../../../types/narrative';

const chapter06: Chapter = {
  id: 'ch06',
  number: 6,
  title: 'The Sunken Library',
  subtitle: 'In which forbidden knowledge demands a terrible price',
  description:
    'Beneath the mountains lies the Sunken Library — a vast repository of ancient knowledge sealed away centuries ago. The Architect\'s power comes from here. You must descend into its depths, face its guardians, and decide what to do with its secrets.',
  imagePrompt:
    'A massive underground cavern with towering bookshelves carved into living rock, a glowing lake of magical energy at the center, crystalline bridges crossing the void, oil painting style, blue and gold ethereal light',
  startNodeId: 'ch06_start',
  availableFactions: ['obsidian_circle', 'verdant_court'],
  keyCharacters: ['magister_thorn', 'lysara', 'mireth'],
  minLevel: 6,
  isBossChapter: true,
  bossId: 'library_guardian',
  nodes: [
    {
      id: 'ch06_start',
      chapterId: 'ch06',
      title: 'The Descent',
      text: 'The Sunken Library lies beneath the Ashenmount range, accessed through a series of natural caves that the Obsidian Circle has been mapping for decades. Thorn\'s agents have cleared the upper passages, but what lies below is unknown territory.\n\nLysara leads the way, her arcane tattoos glowing faintly in the dark. "The Circle has dreamed of this place for generations. The largest collection of pre-Cataclysm knowledge in the known world. Sealed by the last Archon to prevent anyone from using its contents." She grins. "Until now."\n\nThe air grows thick with magic as you descend. Your compass spins wildly — too many things that \'matter most\' in one place.',
      choices: [
        {
          id: 'ch06_cautious_descent',
          text: 'Proceed cautiously, checking for traps and wards.',
          targetNode: 'ch06_first_ward',
          consequences: [{ type: 'grant_xp', target: 'cunning', value: 10 }],
        },
        {
          id: 'ch06_fast_descent',
          text: 'Move quickly. The Architect may already be inside.',
          targetNode: 'ch06_ambush',
          consequences: [{ type: 'grant_xp', target: 'resolve', value: 10 }],
        },
      ],
    },
    {
      id: 'ch06_first_ward',
      chapterId: 'ch06',
      title: 'The Living Riddle',
      text: 'The first ward is not a lock but a question. The stone archway speaks in a voice like grinding rock: "What power grows stronger the more it is shared?"\n\nLysara hesitates. "A riddle ward. Answer wrong and it collapses the passage."',
      choices: [
        {
          id: 'ch06_answer_knowledge',
          text: '"Knowledge."',
          targetNode: 'ch06_ward_passed',
          consequences: [{ type: 'grant_xp', target: 'intelligence', value: 15 }],
        },
        {
          id: 'ch06_answer_love',
          text: '"Love."',
          targetNode: 'ch06_ward_alternate',
          consequences: [{ type: 'grant_xp', target: 'charisma', value: 10 }],
        },
        {
          id: 'ch06_answer_fire',
          text: '"Fire."',
          targetNode: 'ch06_ward_failed',
        },
      ],
    },
    {
      id: 'ch06_ward_passed',
      chapterId: 'ch06',
      title: 'The Way Opens',
      text: 'The archway glows with approval. "Enter, seeker. Knowledge awaits those who understand its nature."\n\nThe passage opens into a vast cavern, and your breath catches. The Sunken Library stretches before you — shelf upon shelf carved into the living rock, rising hundreds of feet. At its center, a lake of liquid light — pure magical energy, concentrated over centuries.',
      choices: [
        { id: 'ch06_enter_library', text: 'Enter the Library proper.', targetNode: 'ch06_library_main' },
      ],
    },
    {
      id: 'ch06_ward_alternate',
      chapterId: 'ch06',
      title: 'An Unexpected Answer',
      text: 'The archway pauses. Then, with what sounds like amusement: "Not the expected answer. But not wrong. Love is a form of knowledge — the knowledge of another soul. You may pass, compassionate one. But be warned: what lies below tests the mind, not the heart."\n\nThe passage opens to reveal the vast library cavern.',
      choices: [
        { id: 'ch06_enter_library_alt', text: 'Enter with humility.', targetNode: 'ch06_library_main' },
      ],
    },
    {
      id: 'ch06_ward_failed',
      chapterId: 'ch06',
      title: 'The Collapse',
      text: 'The archway shudders. "Destruction masquerading as power. Denied." Stones begin to fall. Lysara shouts a containment spell, barely holding the ceiling. You scramble through a side passage, bruised but alive.\n\nA longer, rougher path brings you to the library from below — emerging near the lake of light rather than the entrance. Less dignified, but effective.',
      consequences: [
        { type: 'modify_stat', target: 'resolve', value: -1 },
      ],
      choices: [
        { id: 'ch06_enter_hard_way', text: 'You\'ve arrived. Take stock of your surroundings.', targetNode: 'ch06_library_main' },
      ],
    },
    {
      id: 'ch06_ambush',
      chapterId: 'ch06',
      title: 'Speed Has Its Costs',
      text: 'Your haste triggers a ward you didn\'t see. Magical energy crackles through the passage, stunning you momentarily. When you recover, Lysara is examining the triggered trap with professional interest.\n\n"Ancient work. Beautiful, really. If it hadn\'t almost killed us." She helps you up. "The Library\'s defenses are layered. We go slower from here."',
      consequences: [
        { type: 'modify_stat', target: 'resolve', value: -1 },
      ],
      choices: [
        { id: 'ch06_proceed_careful', text: 'Proceed more carefully.', targetNode: 'ch06_first_ward' },
      ],
    },
    {
      id: 'ch06_library_main',
      chapterId: 'ch06',
      title: 'The Cathedral of Knowledge',
      text: 'The Sunken Library is overwhelming. Millions of texts — scrolls, books, tablets, crystals that store information in light. Lysara is practically vibrating with excitement.\n\nBut the Library is not unoccupied. Crystalline constructs — guardians left by the last Archon — patrol the shelves. They ignore you for now, but their faceted eyes track your movement.\n\nAnd in the deepest chamber, past the lake of light, you see signs of recent occupation: a bedroll, food scraps, magical equipment. Someone has been living here. Working here.\n\nThree paths lead deeper: the Hall of Histories, the Vault of Praxis (practical magic), and the Sanctum of Sealing (where the most dangerous knowledge is kept).',
      choices: [
        {
          id: 'ch06_hall_histories',
          text: 'The Hall of Histories — understand the Architect\'s ideology.',
          targetNode: 'ch06_histories',
          consequences: [{ type: 'grant_xp', target: 'intelligence', value: 15 }],
        },
        {
          id: 'ch06_vault_praxis',
          text: 'The Vault of Praxis — find tools to fight the Architect.',
          targetNode: 'ch06_praxis',
          consequences: [{ type: 'grant_xp', target: 'strength', value: 10 }],
        },
        {
          id: 'ch06_sanctum_sealing',
          text: 'The Sanctum of Sealing — the most dangerous knowledge might be the most useful.',
          targetNode: 'ch06_sanctum',
          consequences: [{ type: 'grant_xp', target: 'resolve', value: 15 }],
        },
      ],
    },
    {
      id: 'ch06_histories',
      chapterId: 'ch06',
      title: 'The Cycle of Ages',
      text: 'The Hall of Histories contains records stretching back millennia. You find the original Ouroboros texts — not a philosophy of destruction, but a plea for understanding. The first Ouroboros scholars believed that power\'s cycle could be broken through enlightenment, not violence.\n\nBut tucked among these texts, annotated in modern handwriting, you find the Architect\'s journal. Page after page of grief-stricken fury: "I tried the peaceful way. I spent twenty years teaching, persuading, building bridges between factions. They burned my school. Killed my students. Called my ideas dangerous. If peaceful change is impossible, violent change is inevitable."',
      consequences: [
        { type: 'set_flag', target: 'learned_assassination_truth', value: true },
        { type: 'grant_xp', target: 'intelligence', value: 15 },
      ],
      choices: [
        {
          id: 'ch06_sympathize',
          text: 'There\'s a tragic logic to the Architect\'s evolution. Could they be reasoned with?',
          targetNode: 'ch06_guardian_approach',
          consequences: [{ type: 'grant_xp', target: 'charisma', value: 10 }],
        },
        {
          id: 'ch06_condemn',
          text: 'Grief doesn\'t justify genocide. The Architect must be stopped regardless.',
          targetNode: 'ch06_guardian_approach',
          consequences: [{ type: 'grant_xp', target: 'resolve', value: 10 }],
        },
      ],
    },
    {
      id: 'ch06_praxis',
      chapterId: 'ch06',
      title: 'The Arsenal of Ages',
      text: 'The Vault of Praxis contains the practical applications of ancient knowledge — weapons, defenses, healing techniques lost to time. Among them, you find the Obsidian Codex — a manual for manipulating ley-lines that the Circle has sought for centuries.\n\nLysara\'s eyes go wide. "This is it. This is what Thorn has been searching for his entire life. With this, we could build a counter-Nexus — or..." She trails off.\n\n"Or build the Nexus ourselves," you finish.',
      consequences: [
        { type: 'give_item', target: 'obsidian_codex', value: true },
      ],
      choices: [
        {
          id: 'ch06_take_codex',
          text: 'Take the Codex. Its power can be used for good.',
          targetNode: 'ch06_guardian_approach',
          consequences: [
            { type: 'faction_rep', target: 'obsidian_circle', value: 15 },
          ],
        },
        {
          id: 'ch06_leave_codex',
          text: 'Leave it. Some knowledge is too dangerous to possess.',
          targetNode: 'ch06_guardian_approach',
          consequences: [
            { type: 'faction_rep', target: 'verdant_court', value: 10 },
            { type: 'set_relationship', target: 'lysara', value: -10 },
          ],
        },
      ],
    },
    {
      id: 'ch06_sanctum',
      chapterId: 'ch06',
      title: 'The Sealed Chamber',
      text: 'The Sanctum is sealed by wards that respond to will, not knowledge. The door opens only for those with sufficient resolve — or sufficient desperation.\n\nInside, a single text sits on a pedestal: "The Unmaking." A spell of absolute destruction, capable of erasing not just a person but the concept of that person from reality. The ultimate weapon.\n\nA note pinned to the pedestal, in the Architect\'s hand: "I considered using this. I chose not to. Some prices are too high. Even for me."',
      consequences: [
        { type: 'set_flag', target: 'found_unmaking', value: true },
        { type: 'grant_xp', target: 'intelligence', value: 20 },
      ],
      choices: [
        {
          id: 'ch06_take_unmaking',
          text: 'Take the Unmaking spell. Even if you never use it.',
          targetNode: 'ch06_guardian_approach',
          consequences: [
            { type: 'set_flag', target: 'possesses_unmaking', value: true },
            { type: 'modify_stat', target: 'resolve', value: -2, description: 'The weight of ultimate destruction' },
          ],
        },
        {
          id: 'ch06_destroy_unmaking',
          text: 'Destroy it. No one should have this power.',
          targetNode: 'ch06_guardian_approach',
          consequences: [
            { type: 'grant_xp', target: 'resolve', value: 15 },
            { type: 'faction_rep', target: 'verdant_court', value: 10 },
          ],
        },
        {
          id: 'ch06_leave_unmaking',
          text: 'Leave it sealed. If the Architect chose not to use it, perhaps you should too.',
          targetNode: 'ch06_guardian_approach',
          consequences: [
            { type: 'grant_xp', target: 'cunning', value: 10 },
          ],
        },
      ],
    },
    {
      id: 'ch06_guardian_approach',
      chapterId: 'ch06',
      title: 'The Library\'s Warden',
      text: 'As you move toward the exit, the crystalline constructs converge. The largest — a towering figure of living crystal, ancient and magnificent — blocks your path.\n\n"You have taken from the Library," it says, its voice like chiming glass. "The Library requires balance. Knowledge given must be paid for with knowledge offered. What truth will you leave in exchange for what you take?"',
      choices: [
        {
          id: 'ch06_offer_truth',
          text: 'Share the truth about the Architect\'s plan — add it to the Library\'s collection.',
          targetNode: 'ch06_guardian_peaceful',
          consequences: [
            { type: 'grant_xp', target: 'intelligence', value: 15 },
          ],
        },
        {
          id: 'ch06_offer_nothing',
          text: '"The world needs this knowledge more than your shelves do."',
          targetNode: 'ch06_guardian_fight',
        },
        {
          id: 'ch06_offer_self',
          text: 'Offer a personal truth — your deepest secret, your greatest shame.',
          targetNode: 'ch06_guardian_sacrifice',
          consequences: [
            { type: 'grant_xp', target: 'resolve', value: 15 },
            { type: 'grant_xp', target: 'charisma', value: 10 },
          ],
        },
      ],
    },
    {
      id: 'ch06_guardian_peaceful',
      chapterId: 'ch06',
      title: 'Knowledge for Knowledge',
      text: 'The guardian considers your offering. Its crystalline body pulses with light as it absorbs the information — every detail about the Architect, the siphons, the conspiracy.\n\n"Acceptable. The Library grows. You may pass, and what you carry is yours." It steps aside. "But know this: the one you seek has already left this place. They took what they needed long ago. What you found were the scraps they left behind."\n\nA humbling thought. The Architect has been steps ahead all along.',
      choices: [
        { id: 'ch06_leave_peaceful', text: 'Ascend from the Library with what you\'ve learned.', targetNode: 'ch06_end' },
      ],
    },
    {
      id: 'ch06_guardian_fight',
      chapterId: 'ch06',
      title: 'The Crystal Warden',
      text: 'The guardian\'s body shifts, crystalline limbs reforming into weapons. "Then you take by force. As all who seek power eventually do."\n\nThe fight is brutal. The guardian is ancient, powerful, and fights with the weight of millennia of accumulated magical energy. Lysara\'s spells crack against its surface. Your blade chips but holds.\n\nBut crystal, for all its strength, is brittle. And you have something the guardian does not: desperation.',
      isCombatNode: true,
      combatEncounterId: 'library_guardian',
      choices: [
        {
          id: 'ch06_win_fight',
          text: 'Continue...',
          targetNode: 'ch06_guardian_defeated',
        },
      ],
    },
    {
      id: 'ch06_guardian_defeated',
      chapterId: 'ch06',
      title: 'Shattered Legacy',
      text: 'The guardian falls, its crystalline body fragmenting across the library floor. As it dies, its voice echoes one last time: "The Library forgives. The Library endures. But what you took today has a cost that compounds with time. Remember."\n\nLysara touches a shard gently. "Thousands of years old. Destroyed in minutes. Let\'s not let this be for nothing."',
      consequences: [
        { type: 'faction_rep', target: 'verdant_court', value: -10 },
        { type: 'faction_rep', target: 'obsidian_circle', value: -5 },
        { type: 'grant_xp', target: 'strength', value: 20 },
      ],
      choices: [
        { id: 'ch06_leave_fight', text: 'Leave the Library.', targetNode: 'ch06_end' },
      ],
    },
    {
      id: 'ch06_guardian_sacrifice',
      chapterId: 'ch06',
      title: 'The Price of Truth',
      text: 'You speak your truth. The shame of exile. The guilt of survival. The fear that in seeking justice, you\'re really seeking revenge. The worry that you\'re becoming what you despise.\n\nThe guardian absorbs it all, its light warm now rather than cold. "Rare," it says. "Most who come here offer facts. You offer understanding. The Library accepts — and offers a gift in return."\n\nA crystal forms in the air and floats into your hands. "This contains the Library\'s memory of the one you seek. Their true identity. Use it wisely."',
      consequences: [
        { type: 'set_flag', target: 'kingslayer_identified', value: true },
        { type: 'grant_xp', target: 'intelligence', value: 20 },
      ],
      choices: [
        { id: 'ch06_leave_gift', text: 'Ascend with the crystal of truth.', targetNode: 'ch06_end' },
      ],
    },
    {
      id: 'ch06_end',
      chapterId: 'ch06',
      title: 'Into the Light',
      text: 'You emerge from the Sunken Library as the sun sets, blinking in the fading light. The knowledge you carry — in your hands and in your mind — changes everything.\n\nThe Architect is no madman. They\'re a wounded idealist who has crossed a line from which there may be no return. The tools to stop them exist, but each comes with its own moral cost.\n\nAs you make camp in the mountain pass, Lysara studies the Codex by firelight while you consider the crystal, if you have it. Inside, a face swims — familiar, unexpected, and devastating.\n\nThe compass points north. Back to Valdris. Back to war.',
      isEndNode: true,
      choices: [],
    },
  ],
};

export default chapter06;
