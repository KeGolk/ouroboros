import type { Chapter } from '../story-types';

export const chapter9: Chapter = {
  number: 9,
  title: 'The Council of Thorns',
  subtitle: 'Four thrones, one table, and a truth that could unite or destroy them all',
  openingNarration:
    'The ruins of Thornhallow have not seen a gathering of this magnitude in a thousand years. Built atop the very hill where Valdoria\'s first king brokered peace between warring tribes, the ancient council hall stands open to the sky, its stone pillars strangled by briars thicker than a man\'s arm. It is a fitting place for what may be the realm\'s last chance at survival — or its final descent into chaos.',
  artPrompt:
    'An ancient ruined stone hall overgrown with massive thorned briars, four delegations approaching from different directions, dramatic sky, dark fantasy political summit',
  entryScene: 'ch9_council_gathering',
  scenes: [
    // ── SCENE 1: The Gathering ──
    {
      id: 'ch9_council_gathering',
      chapter: 9,
      title: 'The Gathering Storm',
      location: 'Thornhallow — Council Ruins',
      artPrompt:
        'Four delegations meeting at a thorn-covered ancient stone table under open sky, tension, banners of four factions, dark fantasy',
      description: [
        'They arrive like the four winds — each from a different direction, each bringing a different storm.',
        'Queen Isolde comes from the north with an escort of fifty Iron Guard in polished black plate. She wears no crown but carries the authority of one in every measured step. High Seer Malachar descends from the east, attended by silent acolytes in ash-grey robes, his ancient face unreadable as carved stone. From the south, Rowan Greenmantle rides at the head of a column of rangers and freed peasants, their green cloaks bright against the autumn forest. And from the west, Sylas Ashford arrives in a gilded carriage drawn by matching black horses, flanked by Guild enforcers whose casual posture belies their lethal readiness.',
        'You stand at the center of the ancient council table — a slab of granite so old that the carvings on its surface have been worn to ghosts. You are the one who called this meeting. The one who must hold it together.',
      ],
      dialogue: [
        {
          speaker: 'queen_isolde',
          text: 'Vane. You summoned the crown to negotiate in a ruin. I trust you have a very good reason, or this meeting will be shorter than you hope.',
          mood: 'angry',
        },
        {
          speaker: 'high_seer_malachar',
          text: 'The ley-lines tremble. Something has disturbed the deep currents beneath Ashenmere. I felt it from the Obsidian Spire. I trust this... council... will illuminate the cause.',
          mood: 'neutral',
        },
        {
          speaker: 'rowan_greenmantle',
          text: 'I came because Vane asked and because my people are dying. If this is a trap, the Pact will ensure it\'s a costly one.',
          mood: 'angry',
        },
        {
          speaker: 'sylas_ashford',
          text: 'Ladies, gentlemen, zealots, rebels — shall we sit? The sooner we begin, the sooner we can return to our various schemes.',
          mood: 'neutral',
        },
      ],
      choices: [
        {
          id: 'ch9_reveal_truth_immediately',
          text: 'Reveal Varen\'s identity and the conspiracy at once — shock them into attention.',
          statCheck: {
            stat: 'charisma',
            difficulty: 7,
            successText: 'Your words fall like hammer blows. The evidence is undeniable. For one stunned moment, the four most powerful people in Valdoria are united by a single emotion: horror.',
            failureText: 'You lay out the truth, but the reaction is not unity — it is accusation. Each faction turns on the others, old grievances erupting like lanced wounds.',
            successScene: 'ch9_truth_accepted',
            failureScene: 'ch9_factions_clash',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch9_revealed_truth_first', value: true },
          ],
          targetScene: 'ch9_truth_accepted',
        },
        {
          id: 'ch9_build_consensus_first',
          text: 'First acknowledge each faction\'s grievances — build common ground before revealing the conspiracy.',
          consequences: [
            { type: 'set_flag', flagId: 'ch9_built_consensus', value: true },
            { type: 'stat_change', stat: 'charisma', value: 1 },
          ],
          targetScene: 'ch9_airing_grievances',
        },
        {
          id: 'ch9_private_meetings',
          text: 'Request private meetings with each leader before the full council — test loyalties first.',
          consequences: [
            { type: 'set_flag', flagId: 'ch9_private_diplomacy', value: true },
            { type: 'stat_change', stat: 'cunning', value: 1 },
          ],
          targetScene: 'ch9_private_audience',
        },
        {
          id: 'ch9_accuse_malachar',
          text: 'Directly accuse Malachar of harboring Varen — force the Conclave\'s hand.',
          conditions: [
            { type: 'flag_set', flagId: 'ch8_understood_binding', operator: 'true' },
          ],
          consequences: [
            { type: 'faction_change', factionId: 'ashenConclave', value: -20 },
            { type: 'set_flag', flagId: 'ch9_accused_malachar', value: true },
          ],
          targetScene: 'ch9_malachar_confronted',
        },
      ],
    },

    // ── SCENE 2: Airing Grievances ──
    {
      id: 'ch9_airing_grievances',
      chapter: 9,
      title: 'Old Wounds',
      location: 'Thornhallow — Council Table',
      artPrompt:
        'Four faction leaders arguing around an ancient stone table, gestures of anger and accusation, thorn-covered pillars, dark fantasy',
      description: [
        'You let them speak. It is perhaps the bravest thing you have done — braver than the siege, braver than the aqueducts — because listening to four faction leaders air decades of grievance without drawing steel requires a patience that borders on the superhuman.',
        'Isolde speaks of the crown\'s burden — the impossible task of holding a fractured realm together while rebels undermine her authority and mystics hoard power that could serve the people. Malachar speaks of ancient obligations, of magical threats that the mundane mind cannot comprehend, of the Conclave\'s thankless vigil against forces that would consume the world. Rowan speaks of hunger, of injustice, of children who die from preventable diseases while the crown builds monuments. Sylas speaks of trade routes strangled by war, of an economy collapsing under the weight of everyone else\'s idealism.',
        'Each of them is right. Each of them is also, in their own way, wrong. And all of them are complicit in a king\'s death.',
      ],
      dialogue: [
        {
          speaker: 'queen_isolde',
          text: 'The Pact burns my granaries and calls it liberation. The Conclave hoards knowledge that could feed thousands and calls it wisdom. The Guild bleeds the treasury and calls it commerce. And I am the tyrant?',
          mood: 'angry',
        },
        {
          speaker: 'rowan_greenmantle',
          text: 'Your granaries were built on land stolen from my people three generations ago. The grain inside them was grown by hands that were never paid a fair wage. So yes, Your Majesty — we burned them. And we\'d do it again.',
          mood: 'angry',
        },
        {
          speaker: 'high_seer_malachar',
          text: 'You squabble over grain while the foundations of reality tremble. The ley-lines are failing. If they collapse, your crops will wither, your forges will cool, and the wards that keep the deep things sleeping will shatter. But please — continue arguing about economics.',
          mood: 'angry',
        },
        {
          speaker: 'sylas_ashford',
          text: 'The Seer makes a fair point, though I notice he neglects to mention why the ley-lines are failing. Perhaps because the answer is inconvenient.',
          mood: 'sinister',
        },
      ],
      choices: [
        {
          id: 'ch9_redirect_to_truth',
          text: '"Enough. You\'ve all said your piece. Now hear mine — because what I have to say changes everything."',
          consequences: [
            { type: 'set_flag', flagId: 'ch9_redirected_council', value: true },
          ],
          targetScene: 'ch9_truth_accepted',
        },
        {
          id: 'ch9_find_common_ground',
          text: '"You all want Valdoria to survive. Start there. Every other argument is secondary."',
          statCheck: {
            stat: 'charisma',
            difficulty: 6,
            successText: 'A reluctant silence falls. It is not agreement — not yet — but it is the first moment since the council began where no one is shouting.',
            failureText: 'Rowan scoffs, Isolde bristles, and Malachar looks at you with the patient contempt of a man watching a child try to solve a riddle meant for adults.',
            successScene: 'ch9_truth_accepted',
            failureScene: 'ch9_truth_accepted',
          },
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 5 },
            { type: 'faction_change', factionId: 'verdantPact', value: 5 },
          ],
          targetScene: 'ch9_truth_accepted',
        },
      ],
    },

    // ── SCENE 3: Private Audience ──
    {
      id: 'ch9_private_audience',
      chapter: 9,
      title: 'Whispers Before the Storm',
      location: 'Thornhallow — Outer Galleries',
      artPrompt:
        'Two figures in hushed conversation in a ruined stone gallery overgrown with thorns, moonlight, dark fantasy',
      description: [
        'You take them aside one by one, in the vine-choked galleries that ring the council hall. Each conversation is a negotiation, a confession, and a test — you are measuring loyalties, searching for the weak points where truth might penetrate pride.',
      ],
      dialogue: [
        {
          speaker: 'narrator',
          text: 'Who do you speak with first? Each private audience will shape the dynamic of the full council that follows.',
        },
      ],
      choices: [
        {
          id: 'ch9_private_isolde',
          text: 'Speak with Queen Isolde — appeal to her duty to the crown.',
          statCheck: {
            stat: 'charisma',
            difficulty: 6,
            successText: 'Isolde listens with the still intensity of a hawk. "If this Varen exists — if he manipulated the crown — then he is an enemy of the state. I will hear your evidence."',
            failureText: 'Isolde\'s eyes narrow. "You speak of conspiracy, Vane. Every traitor claims a hidden mastermind to excuse their own treason. Show me proof, or show me the door."',
            successScene: 'ch9_truth_accepted',
            failureScene: 'ch9_truth_accepted',
          },
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 10 },
            { type: 'set_flag', flagId: 'ch9_isolde_prepared', value: true },
          ],
          targetScene: 'ch9_truth_accepted',
        },
        {
          id: 'ch9_private_malachar',
          text: 'Confront Malachar — demand answers about Varen.',
          statCheck: {
            stat: 'lore',
            difficulty: 7,
            successText: 'For the first time, you see something like genuine emotion cross the High Seer\'s ancient face. "Varen. So the past returns at last. Yes, Vane — I will tell you about my greatest failure."',
            failureText: 'Malachar regards you with millennia-old patience. "You speak of things beyond your understanding. But I will not stop you from trying."',
            successScene: 'ch9_truth_accepted',
            failureScene: 'ch9_truth_accepted',
          },
          consequences: [
            { type: 'faction_change', factionId: 'ashenConclave', value: 5 },
            { type: 'set_flag', flagId: 'ch9_malachar_confessed', value: true },
          ],
          targetScene: 'ch9_truth_accepted',
        },
        {
          id: 'ch9_private_rowan',
          text: 'Meet with Rowan — secure the Pact\'s support for the revelation.',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 10 },
            { type: 'set_flag', flagId: 'ch9_rowan_onside', value: true },
          ],
          targetScene: 'ch9_truth_accepted',
        },
        {
          id: 'ch9_private_sylas',
          text: 'Bargain with Sylas — his intelligence network could confirm Varen\'s location.',
          consequences: [
            { type: 'faction_change', factionId: 'obsidianGuild', value: 10 },
            { type: 'set_flag', flagId: 'ch9_sylas_onside', value: true },
          ],
          targetScene: 'ch9_truth_accepted',
        },
      ],
    },

    // ── SCENE 4: Malachar Confronted ──
    {
      id: 'ch9_malachar_confronted',
      chapter: 9,
      title: 'The Seer\'s Shame',
      location: 'Thornhallow — Eastern Gallery',
      artPrompt:
        'An ancient mystic in ash-grey robes recoiling from an accusation, magical energy crackling around his staff, thorn-covered ruins, dark fantasy',
      description: [
        'The words land like stones. Malachar\'s acolytes reach for their staves, but the High Seer raises a hand and they freeze. For a long, terrible moment, the most powerful mystic in Valdoria says nothing. Then, slowly, like a glacier calving, his composure fractures.',
        'It begins as a tremor in his hands — those ancient hands that have shaped ley-lines and read the fate of nations. Then his shoulders bow, just slightly, under a weight that has nothing to do with his years.',
      ],
      dialogue: [
        {
          speaker: 'high_seer_malachar',
          text: 'Varen was... the most gifted student the Conclave has ever produced. His understanding of the ley-lines surpassed mine within a decade. I was proud. Too proud to see what he was becoming.',
          mood: 'sad',
        },
        {
          speaker: 'high_seer_malachar',
          text: 'He wanted to merge with the ley-line. To become part of it — a living conduit of pure arcane force. I forbade it. The ritual would have killed him, or worse. He attempted it anyway.',
          mood: 'sad',
        },
        {
          speaker: 'high_seer_malachar',
          text: 'I thought he died. I mourned him for thirty years. And all that time, he was beneath Ashenmere, feeding, growing, becoming something that is no longer entirely human.',
          mood: 'fearful',
        },
        {
          speaker: 'queen_isolde',
          text: 'You mean to tell me that the Conclave\'s negligence created the monster that murdered my husband — and you covered it up?',
          mood: 'angry',
        },
        {
          speaker: 'high_seer_malachar',
          text: 'I did not cover it up. I believed him dead. But yes — the responsibility is mine. His creation. His survival. His crimes. All of it flows from my failure.',
          mood: 'desperate',
        },
      ],
      choices: [
        {
          id: 'ch9_press_malachar',
          text: '"Responsibility isn\'t enough. What can you do to stop him?"',
          consequences: [
            { type: 'set_flag', flagId: 'ch9_malachar_pledged', value: true },
            { type: 'faction_change', factionId: 'ashenConclave', value: 10 },
          ],
          targetScene: 'ch9_the_decision',
        },
        {
          id: 'ch9_demand_reparations',
          text: '"The Conclave must answer for this. Open your archives. Share your knowledge. No more hoarding."',
          consequences: [
            { type: 'faction_change', factionId: 'ashenConclave', value: -15 },
            { type: 'faction_change', factionId: 'verdantPact', value: 10 },
            { type: 'set_flag', flagId: 'ch9_conclave_archives_opened', value: true },
          ],
          targetScene: 'ch9_the_decision',
        },
        {
          id: 'ch9_show_mercy_malachar',
          text: '"You were deceived like all of us. Help us now, and the past can be addressed later."',
          consequences: [
            { type: 'faction_change', factionId: 'ashenConclave', value: 15 },
            { type: 'set_flag', flagId: 'ch9_showed_mercy_malachar', value: true },
          ],
          targetScene: 'ch9_the_decision',
        },
      ],
    },

    // ── SCENE 5: Truth Accepted ──
    {
      id: 'ch9_truth_accepted',
      chapter: 9,
      title: 'The Architect Unmasked',
      location: 'Thornhallow — Council Table',
      artPrompt:
        'Four faction leaders around a stone table, evidence spread before them, expressions of shock and realization, dramatic lighting, dark fantasy',
      description: [
        'You lay it all before them. The ledger. The ritual site. The decoded orders. The Architect\'s letters. Piece by piece, the conspiracy assembles itself before the eyes of four leaders who believed they were the architects of their own ambitions — and now discover they were merely instruments.',
        'The silence that follows is the most dangerous moment of the council. It is the silence of humiliation, of pride confronting its own blindness. Four of the most powerful people in Valdoria have been told they were puppets, and the instinct to deny, to deflect, to blame is as strong as the instinct to breathe.',
      ],
      dialogue: [
        {
          speaker: 'queen_isolde',
          text: 'If this is true — and I will require independent verification — then we have all been played for fools. Every one of us fed this creature exactly what it needed: chaos.',
          mood: 'angry',
        },
        {
          speaker: 'rowan_greenmantle',
          text: 'My scouts mapped the hunting grounds. We gave him the king\'s movements. Gods forgive us.',
          mood: 'sad',
        },
        {
          speaker: 'sylas_ashford',
          text: 'I supplied the poison. Unknowingly, as the knight so delicately puts it, but supplied it nonetheless. The Guild\'s ledgers confirm the Convergence Account. It exists. It was funded by all four of us.',
          mood: 'neutral',
        },
        {
          speaker: 'high_seer_malachar',
          text: 'Varen was my apprentice. My responsibility. Whatever he has become, I must bear my share of the blame.',
          mood: 'sad',
        },
        {
          speaker: 'narrator',
          text: 'Four confessions. Four proud souls, each bending under the weight of truth. The question now is whether that weight breaks them — or forges them into something stronger.',
        },
      ],
      choices: [
        {
          id: 'ch9_call_for_alliance',
          text: '"Varen used your divisions against you. The only way to defeat him is to stand together."',
          statCheck: {
            stat: 'charisma',
            difficulty: 7,
            successText: 'Your words ring through the ancient hall like a bell. One by one, the faction leaders meet each other\'s eyes. Something shifts.',
            failureText: 'The words are right, but the moment is fragile. Old suspicions die hard, and not everyone at the table is ready to trust.',
            successScene: 'ch9_the_decision',
            failureScene: 'ch9_factions_clash',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch9_proposed_alliance', value: true },
            { type: 'faction_change', factionId: 'ironThrone', value: 5 },
            { type: 'faction_change', factionId: 'ashenConclave', value: 5 },
            { type: 'faction_change', factionId: 'verdantPact', value: 5 },
            { type: 'faction_change', factionId: 'obsidianGuild', value: 5 },
          ],
          targetScene: 'ch9_the_decision',
        },
        {
          id: 'ch9_demand_accountability',
          text: '"Alliance, yes — but with conditions. Each faction must acknowledge its role and make restitution."',
          consequences: [
            { type: 'set_flag', flagId: 'ch9_demanded_accountability', value: true },
            { type: 'stat_change', stat: 'cunning', value: 1 },
          ],
          targetScene: 'ch9_the_decision',
        },
        {
          id: 'ch9_military_focus',
          text: '"Debates can wait. We need a war plan — now. Where is Varen, and how do we kill him?"',
          consequences: [
            { type: 'set_flag', flagId: 'ch9_war_footing', value: true },
            { type: 'stat_change', stat: 'strength', value: 1 },
          ],
          targetScene: 'ch9_the_decision',
        },
      ],
      variants: [
        {
          condition: { type: 'flag_set', flagId: 'ch9_built_consensus', operator: 'true' },
          description: [
            'Because you let them speak first — let them voice their pain and their anger — the truth lands differently. Not as an accusation, but as a revelation. They have already seen each other\'s humanity. Now they see the puppet strings.',
          ],
        },
        {
          condition: { type: 'flag_set', flagId: 'ch9_private_diplomacy', operator: 'true' },
          description: [
            'Your private conversations have prepared the ground. The leaders you spoke with lean forward, nodding — they\'ve had time to process the shock. The others are caught off-guard, but the prepared allies steady the table.',
          ],
        },
      ],
    },

    // ── SCENE 6: Factions Clash ──
    {
      id: 'ch9_factions_clash',
      chapter: 9,
      title: 'The Table Breaks',
      location: 'Thornhallow — Council Table',
      artPrompt:
        'Four faction delegations drawing weapons and squaring off in an ancient ruin, magical energy crackling, tense standoff, dark fantasy',
      description: [
        'It happens in an instant. Isolde\'s guards draw steel. Rowan\'s rangers nock arrows. Malachar\'s acolytes raise their staves, and the air thickens with gathering arcane force. Sylas\'s enforcers melt into the shadows, hands on concealed blades.',
        'The ancient council table — the table where Valdoria\'s first peace was forged — stands between four armies about to tear each other apart.',
      ],
      dialogue: [
        {
          speaker: 'queen_isolde',
          text: 'The Conclave created this monster and the Pact helped it murder my husband. There will be a reckoning.',
          mood: 'angry',
        },
        {
          speaker: 'rowan_greenmantle',
          text: 'We were manipulated — all of us! Drawing swords now is exactly what Varen wants!',
          mood: 'desperate',
        },
        {
          speaker: 'high_seer_malachar',
          text: 'If the queen wants war, the Conclave will oblige. We have tolerated the crown\'s arrogance for far too long.',
          mood: 'angry',
        },
        {
          speaker: 'sylas_ashford',
          text: 'Well. This is going splendidly.',
          mood: 'neutral',
        },
      ],
      combat: {
        type: 'minor',
        enemyName: 'Council Melee',
        enemyDescription: 'The council devolves into a chaotic skirmish as faction guards clash.',
        primaryStat: 'charisma',
        difficulty: 6,
        secondaryStat: 'strength',
        description: 'You must intervene physically and verbally to prevent the council from becoming a bloodbath.',
        victoryConsequences: [
          { type: 'set_flag', flagId: 'ch9_stopped_fighting', value: true },
          { type: 'stat_change', stat: 'charisma', value: 1 },
        ],
        victoryScene: 'ch9_the_decision',
        defeatConsequences: [
          { type: 'damage', value: 20 },
          { type: 'set_flag', flagId: 'ch9_council_bloodshed', value: true },
          { type: 'faction_change', factionId: 'ironThrone', value: -10 },
          { type: 'faction_change', factionId: 'verdantPact', value: -10 },
        ],
        defeatScene: 'ch9_the_decision',
      },
      choices: [
        {
          id: 'ch9_step_between',
          text: 'Step between the factions — physically place yourself in the crossfire.',
          statCheck: {
            stat: 'charisma',
            difficulty: 8,
            successText: 'Your voice cuts through the chaos like a blade. "THE NEXT PERSON WHO DRAWS BLOOD IN THIS HALL ANSWERS TO ME." The sheer audacity of it freezes every hand.',
            failureText: 'You step forward and an arrow grazes your arm. The pain is sharp, but it gets their attention.',
            successScene: 'ch9_the_decision',
            failureScene: 'ch9_the_decision',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch9_stood_between', value: true },
          ],
          targetScene: 'ch9_the_decision',
        },
        {
          id: 'ch9_let_them_fight',
          text: 'Let them fight. Sometimes blood must be spilled before peace can take root.',
          consequences: [
            { type: 'set_flag', flagId: 'ch9_allowed_violence', value: true },
            { type: 'faction_change', factionId: 'ironThrone', value: -5 },
            { type: 'faction_change', factionId: 'verdantPact', value: -5 },
            { type: 'damage', value: 10 },
          ],
          targetScene: 'ch9_the_decision',
        },
      ],
    },

    // ── SCENE 7: Assassination Attempt ──
    {
      id: 'ch9_assassination_attempt',
      chapter: 9,
      title: 'The Shadow Strikes',
      location: 'Thornhallow — Council Table',
      artPrompt:
        'A shadowy assassin leaping from thorned vines toward a faction leader, magical shields activating, chaos, dark fantasy action',
      description: [
        'The blade comes from nowhere — or rather, from everywhere. The thorns themselves seem to part as a figure drops from the vine-covered pillars above, a dagger of black glass aimed at Queen Isolde\'s throat.',
        'Time slows. You see the assassin\'s eyes — flat, lifeless, glowing with a faint inner light that is unmistakably arcane. This is no ordinary killer. This is one of Varen\'s constructs: a vessel, a puppet, sent to ensure the council ends in blood.',
      ],
      dialogue: [
        {
          speaker: 'narrator',
          text: 'The assassin moves with inhuman speed. Its blade trails dark energy — a killing curse woven into obsidian glass. One cut will be enough.',
        },
      ],
      combat: {
        type: 'minor',
        enemyName: 'Varen\'s Shadow Construct',
        enemyDescription: 'A magically animated assassin puppet sent by the Architect, glowing with dark arcane energy.',
        primaryStat: 'cunning',
        difficulty: 7,
        secondaryStat: 'strength',
        description: 'The construct is fast, silent, and aimed at Queen Isolde. You have seconds to react.',
        victoryConsequences: [
          { type: 'set_flag', flagId: 'ch9_saved_isolde', value: true },
          { type: 'faction_change', factionId: 'ironThrone', value: 20 },
          { type: 'stat_change', stat: 'cunning', value: 1 },
        ],
        victoryScene: 'ch9_the_decision',
        defeatConsequences: [
          { type: 'damage', value: 25 },
          { type: 'set_flag', flagId: 'ch9_isolde_wounded', value: true },
          { type: 'faction_change', factionId: 'ironThrone', value: -10 },
        ],
        defeatScene: 'ch9_the_decision',
      },
      choices: [
        {
          id: 'ch9_shield_isolde',
          text: 'Throw yourself between the assassin and the queen.',
          consequences: [
            { type: 'damage', value: 15 },
            { type: 'faction_change', factionId: 'ironThrone', value: 15 },
            { type: 'set_flag', flagId: 'ch9_shielded_queen', value: true },
          ],
          targetScene: 'ch9_the_decision',
        },
        {
          id: 'ch9_intercept_blade',
          text: 'Try to intercept the assassin\'s blade mid-strike.',
          statCheck: {
            stat: 'strength',
            difficulty: 7,
            successText: 'You catch the assassin\'s wrist and twist. The obsidian blade shatters against the stone table. The construct collapses, its animating force spent.',
            failureText: 'The blade slices your forearm as you reach for it. Pain flares white-hot, but you\'ve deflected the killing stroke.',
            successScene: 'ch9_the_decision',
            failureScene: 'ch9_the_decision',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch9_intercepted_assassin', value: true },
            { type: 'add_item', itemId: 'obsidian_blade_shard' },
          ],
          targetScene: 'ch9_the_decision',
        },
        {
          id: 'ch9_warn_shout',
          text: 'Shout a warning — give Isolde\'s guards time to react.',
          consequences: [
            { type: 'set_flag', flagId: 'ch9_warned_guards', value: true },
            { type: 'faction_change', factionId: 'ironThrone', value: 10 },
          ],
          targetScene: 'ch9_the_decision',
        },
      ],
    },

    // ── SCENE 8: The Decision — Major Branching Point ──
    {
      id: 'ch9_the_decision',
      chapter: 9,
      title: 'The Choice of Ages',
      location: 'Thornhallow — Council Table',
      artPrompt:
        'Four faction banners surrounding a stone table with a map of the realm, a lone figure standing at its center making a momentous decision, dramatic light, dark fantasy',
      description: [
        'The council comes at last to its crux. The truth is known. The enemy is named. The question that remains is the oldest question in politics, the question that has broken empires and built them: what comes next?',
        'Four visions for Valdoria\'s future sit at the table, each demanding primacy. The Iron Throne offers order through strength. The Ashen Conclave offers wisdom through knowledge. The Verdant Pact offers freedom through reform. The Obsidian Guild offers stability through pragmatism. And Varen — the Architect — offers nothing but annihilation.',
        'You stand at the center of it all, the disgraced knight who has somehow become the fulcrum upon which the realm\'s fate balances. Whatever you say next will echo through history.',
      ],
      dialogue: [
        {
          speaker: 'queen_isolde',
          text: 'March on Ashenmere with the combined might of the realm. My legions will lead the assault. Varen dies, and the crown restores order. It is the only path that guarantees stability.',
          mood: 'triumphant',
        },
        {
          speaker: 'high_seer_malachar',
          text: 'Brute force will not defeat Varen. He is beyond the reach of swords. Only the Conclave\'s deepest arts can unmake what he has become. Let me lead a ritual to sever him from the ley-line — and from existence.',
          mood: 'neutral',
        },
        {
          speaker: 'rowan_greenmantle',
          text: 'And after? When Varen is dead and the old order reasserts itself? No. We fight Varen, yes — but we fight for a new Valdoria. A realm where the people govern themselves, free from crowns and conclaves and guilds.',
          mood: 'hopeful',
        },
        {
          speaker: 'sylas_ashford',
          text: 'Ideology is a luxury. I propose a practical solution: the Guild\'s network can locate Varen, the Conclave can weaken him, and whoever survives the fight can negotiate the future afterward. Let us focus on what works.',
          mood: 'neutral',
        },
      ],
      choices: [
        {
          id: 'ch9_support_crown',
          text: 'Support Queen Isolde\'s military solution — order must be restored through strength.',
          tooltip: 'The Iron Throne path — military might and centralized authority',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 25 },
            { type: 'faction_change', factionId: 'verdantPact', value: -15 },
            { type: 'set_flag', flagId: 'ch9_iron_path', value: true },
          ],
          targetScene: 'ch9_council_aftermath',
        },
        {
          id: 'ch9_support_conclave',
          text: 'Support Malachar\'s ritual approach — arcane power must counter arcane power.',
          tooltip: 'The Ashen Conclave path — mystical knowledge and ancient wisdom',
          consequences: [
            { type: 'faction_change', factionId: 'ashenConclave', value: 25 },
            { type: 'faction_change', factionId: 'ironThrone', value: -10 },
            { type: 'set_flag', flagId: 'ch9_arcane_path', value: true },
          ],
          targetScene: 'ch9_council_aftermath',
        },
        {
          id: 'ch9_support_pact',
          text: 'Support Rowan\'s vision — fight Varen and build a new, free Valdoria from the ashes.',
          tooltip: 'The Verdant Pact path — freedom and reform',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 25 },
            { type: 'faction_change', factionId: 'ironThrone', value: -15 },
            { type: 'set_flag', flagId: 'ch9_freedom_path', value: true },
          ],
          targetScene: 'ch9_council_aftermath',
        },
        {
          id: 'ch9_support_guild',
          text: 'Support Sylas\'s pragmatic plan — efficiency over ideology.',
          tooltip: 'The Obsidian Guild path — pragmatism and shadow governance',
          consequences: [
            { type: 'faction_change', factionId: 'obsidianGuild', value: 25 },
            { type: 'faction_change', factionId: 'verdantPact', value: -10 },
            { type: 'set_flag', flagId: 'ch9_shadow_path', value: true },
          ],
          targetScene: 'ch9_council_aftermath',
        },
        {
          id: 'ch9_forge_unity',
          text: '"None of you are strong enough alone. Combine your forces — all four factions, working as one. I\'ll lead the assault."',
          tooltip: 'The unified path — requires high reputation with multiple factions',
          conditions: [
            { type: 'faction_reputation', factionId: 'ironThrone', operator: 'gte', value: 20 },
            { type: 'faction_reputation', factionId: 'verdantPact', operator: 'gte', value: 20 },
          ],
          statCheck: {
            stat: 'charisma',
            difficulty: 8,
            successText: 'The words leave your mouth with the weight of destiny. One by one, the faction leaders nod — reluctantly, grudgingly, but they nod. For the first time in living memory, Valdoria is united.',
            failureText: 'The ambition is admirable, but the execution falters. Two factions agree; two demur. It is a partial unity — better than nothing, but not the alliance you hoped for.',
            successScene: 'ch9_council_aftermath',
            failureScene: 'ch9_council_aftermath',
          },
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 10 },
            { type: 'faction_change', factionId: 'ashenConclave', value: 10 },
            { type: 'faction_change', factionId: 'verdantPact', value: 10 },
            { type: 'faction_change', factionId: 'obsidianGuild', value: 10 },
            { type: 'set_flag', flagId: 'ch9_unified_path', value: true },
          ],
          targetScene: 'ch9_council_aftermath',
        },
      ],
      variants: [
        {
          condition: { type: 'flag_set', flagId: 'ch9_saved_isolde', operator: 'true' },
          dialogue: [
            {
              speaker: 'queen_isolde',
              text: 'Vane saved my life when the assassin struck. He has earned the right to speak — and the right to be heard. I will follow his counsel.',
              mood: 'neutral',
            },
          ],
        },
        {
          condition: { type: 'flag_set', flagId: 'ch9_council_bloodshed', operator: 'true' },
          description: [
            'Blood stains the ancient stone. Guards on both sides nurse wounds. The council nearly ended in slaughter, and the shadow of that violence hangs over every word spoken now. Trust is a commodity in desperately short supply.',
          ],
        },
      ],
    },

    // ── SCENE 9: Council Aftermath ──
    {
      id: 'ch9_council_aftermath',
      chapter: 9,
      title: 'The March Begins',
      location: 'Thornhallow — Council Ruins, Sunset',
      artPrompt:
        'A combined army mustering at sunset near ancient ruins, multiple faction banners flying together, dramatic sky, dark fantasy',
      description: [
        'The council ends not with a signature on parchment but with a handshake — or, in some cases, a grudging nod across the thorned table. It is not trust. It is barely even cooperation. But it is a beginning.',
        'As the sun sets over Thornhallow, the delegations begin to merge into something that resembles, however imperfectly, a unified force. Iron Guard stand beside Verdant rangers. Conclave mages walk among Guild scouts. The sight is as strange and beautiful as a solar eclipse — something that should not happen, and yet does.',
        'Ahead lies Ashenmere, and beneath it, the ley-line nexus where Varen — the Architect, the puppet master, the forgotten apprentice — has been growing in power for three decades. The final confrontation approaches.',
      ],
      dialogue: [
        {
          speaker: 'elara_dawnwhisper',
          text: 'You did it, Aldric. I didn\'t think it was possible, but you actually brought them together. Now we just have to defeat a demigod with the power of a murdered king coursing through his veins.',
          mood: 'hopeful',
        },
        {
          speaker: 'aldric_vane',
          text: 'Simple, then.',
          mood: 'neutral',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'Simple.',
          mood: 'hopeful',
        },
        {
          speaker: 'narrator',
          text: 'She takes your hand. Her fingers are cold, but her grip is steady. Together, you watch the sun disappear behind the mountains, painting the sky in shades of fire and ash. Tomorrow, you march. Tomorrow, this ends.',
        },
      ],
      choices: [
        {
          id: 'ch9_to_chapter_10',
          text: 'March on Ashenmere. End this.',
          consequences: [
            { type: 'set_flag', flagId: 'ch9_complete', value: true },
          ],
          targetScene: 'ch10_the_descent',
        },
      ],
    },
  ],
};
