import type { Chapter } from '../story-types';

export const chapter1: Chapter = {
  number: 1,
  title: 'The Fallen Crown',
  subtitle: 'A king lies dead and the wolves circle the throne',
  openingNarration:
    'The night King Aldren died, the stars themselves seemed to dim over Valdoria. ' +
    'You remember the taste of iron in the air, the distant tolling of the cathedral bells, ' +
    'and the cold certainty that the world you knew had ended. You are Aldric Vane — once a ' +
    'knight of the Crown, now stripped of title and honor for a crime you did not commit. ' +
    'But tonight, as screams echo through the marble halls of Thornhold Keep, ' +
    'the question of your innocence may no longer matter. Tonight, everyone is suspect.',
  artPrompt:
    'Dark medieval throne room at night, a crown lying in a pool of blood on stone floor, ' +
    'shattered stained glass windows, moonlight streaming through, ominous shadows, ' +
    'oil painting style, dramatic chiaroscuro lighting',
  entryScene: 'ch1_throne_room',
  scenes: [
    // ── Scene 1: The Throne Room ──────────────────────────────────────
    {
      id: 'ch1_throne_room',
      chapter: 1,
      title: 'The Dead King',
      location: 'Thornhold Keep — Throne Room',
      artPrompt:
        'Grand medieval throne room, dead king slumped on iron throne, blood pooling on steps, ' +
        'guards rushing in with torches, stained glass casting red and gold light, dark fantasy',
      description: [
        'The throne room of Thornhold Keep is a cathedral of power — vaulted ceilings lost in shadow, ' +
        'pillars carved with the faces of dead monarchs, and at its heart, the Iron Seat itself, ' +
        'black as a starless night.',
        'King Aldren sits upon it still, though he will never rise again. His head lolls to one side, ' +
        'eyes open and glassy, a thin line of crimson tracing from the corner of his mouth to the ' +
        'jeweled collar at his throat. There is no wound you can see — no blade, no arrow. ' +
        'Only death, sudden and absolute.',
        'You came here tonight to petition for the restoration of your knighthood. Instead, you ' +
        'stand three paces from a murdered king, your boots leaving prints in his blood, and the ' +
        'sound of armored footsteps thundering down the corridor behind you.',
      ],
      dialogue: [
        {
          speaker: 'narrator',
          text: 'The door crashes open. Captain Thorne strides in at the head of a dozen soldiers, his scarred face tight with controlled fury.',
        },
        {
          speaker: 'captain_thorne',
          text: 'Secure the — gods above.',
          mood: 'fearful',
        },
        {
          speaker: 'narrator',
          text: 'His eyes move from the king to you. To the blood on your boots. His hand moves to his sword hilt.',
        },
        {
          speaker: 'captain_thorne',
          text: 'Vane. Step away from the throne. Slowly.',
          mood: 'angry',
        },
        {
          speaker: 'aldric_vane',
          text: 'Thorne, listen to me. I found him like this — I only just arrived. The poison was already—',
        },
        {
          speaker: 'captain_thorne',
          text: 'Poison? Nobody said anything about poison. How would a disgraced knight know the manner of a king\'s death before the royal physician?',
          mood: 'angry',
        },
        {
          speaker: 'narrator',
          text: 'The soldiers fan out, blocking every exit. You can see the calculation in Thorne\'s eyes — he is an honorable man, but duty and honor are pulling him in opposite directions.',
        },
      ],
      choices: [
        {
          id: 'ch1_c1_surrender',
          text: 'Surrender peacefully and plead your case',
          tooltip: 'Trust in the justice system — risky, but honorable',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 5 },
            { type: 'set_flag', flagId: 'surrendered_to_thorne', value: true },
          ],
          targetScene: 'ch1_dungeon',
        },
        {
          id: 'ch1_c1_persuade',
          text: 'Appeal to Thorne\'s sense of honor — you served together',
          tooltip: 'Requires Charisma — remind him of your shared history',
          statCheck: {
            stat: 'charisma',
            difficulty: 4,
            successText:
              'Thorne hesitates, conflict flickering across his scarred face. "You have until dawn," he growls. "Run."',
            failureText:
              'Thorne\'s jaw tightens. "We were brothers once, Vane. That only makes this worse." He signals his men.',
            successScene: 'ch1_escape_corridor',
            failureScene: 'ch1_dungeon',
          },
          consequences: [
            { type: 'set_flag', flagId: 'appealed_to_thorne', value: true },
          ],
          targetScene: 'ch1_escape_corridor',
        },
        {
          id: 'ch1_c1_examine',
          text: 'Point out the poisoning details to prove your innocence',
          tooltip: 'Requires Lore — identify the specific toxin used',
          statCheck: {
            stat: 'lore',
            difficulty: 5,
            successText:
              'You identify the blackened veins beneath the king\'s jaw — Nighthollow extract. Thorne pales. Only the Ashen Conclave keeps such secrets.',
            failureText:
              'Your knowledge fails you. The guards close in.',
            successScene: 'ch1_investigation',
            failureScene: 'ch1_dungeon',
          },
          consequences: [
            { type: 'set_flag', flagId: 'identified_poison', value: true },
            { type: 'faction_change', factionId: 'ashenConclave', value: -5 },
          ],
          targetScene: 'ch1_investigation',
        },
        {
          id: 'ch1_c1_fight',
          text: 'Fight your way past the guards',
          tooltip: 'Desperate and violent — will mark you as guilty',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: -15 },
            { type: 'set_flag', flagId: 'fought_guards', value: true },
            { type: 'stat_change', stat: 'strength', value: 1 },
          ],
          targetScene: 'ch1_combat_escape',
        },
      ],
    },

    // ── Scene 2: The Dungeon ──────────────────────────────────────────
    {
      id: 'ch1_dungeon',
      chapter: 1,
      title: 'Chains and Whispers',
      location: 'Thornhold Keep — Dungeons',
      artPrompt:
        'Dark medieval dungeon cell, iron chains on stone walls, single barred window with moonlight, ' +
        'rat scurrying across floor, dripping water, oppressive atmosphere, dark fantasy',
      description: [
        'The dungeons beneath Thornhold Keep are older than the monarchy itself — carved from living ' +
        'rock in an age when kings settled disputes with ritual combat rather than courts. The cold ' +
        'seeps into your bones as the iron door clangs shut behind you.',
        'Hours pass. Or perhaps minutes — time loses meaning in the dark. Then a whisper comes from ' +
        'the adjacent cell, barely louder than the drip of water on stone.',
      ],
      dialogue: [
        {
          speaker: 'narrator',
          text: 'A pale hand reaches through the gap between the cell bars. Long fingers, stained with ink and something darker.',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'You are Aldric Vane, are you not? The disgraced knight they found standing over the body.',
          mood: 'neutral',
        },
        {
          speaker: 'aldric_vane',
          text: 'Who are you? How do you know my name?',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'My name is Elara. I was a Seer of the Ashen Conclave — emphasis on "was." I have been in this cell for three weeks, ever since I discovered what Malachar was planning.',
          mood: 'fearful',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'The king was not supposed to die tonight. Something has accelerated the timeline. We are both running out of hours, Sir Vane.',
          mood: 'desperate',
        },
        {
          speaker: 'narrator',
          text: 'She produces a slender iron pin from her hair — the kind used to hold a Conclave veil in place. "I can pick these locks. I\'ve been waiting for the right moment. A distraction." She glances upward, toward the sounds of chaos above. "I believe this qualifies."',
        },
      ],
      choices: [
        {
          id: 'ch1_c2_trust_elara',
          text: 'Accept Elara\'s help and escape together',
          tooltip: 'Gain a knowledgeable ally, but trust a stranger',
          consequences: [
            { type: 'add_companion', companionId: 'elara_dawnwhisper' },
            { type: 'set_flag', flagId: 'escaped_with_elara', value: true },
            { type: 'faction_change', factionId: 'ashenConclave', value: -5 },
          ],
          targetScene: 'ch1_sewer_escape',
        },
        {
          id: 'ch1_c2_refuse_elara',
          text: 'Refuse — she could be part of the conspiracy',
          tooltip: 'Safer, but you remain locked up',
          consequences: [
            { type: 'set_flag', flagId: 'refused_elara', value: true },
          ],
          targetScene: 'ch1_solo_escape',
        },
        {
          id: 'ch1_c2_interrogate',
          text: 'Demand she tell you everything about Malachar\'s plan first',
          tooltip: 'Requires Cunning — press her for details before committing',
          statCheck: {
            stat: 'cunning',
            difficulty: 4,
            successText:
              'Elara\'s composure cracks. She reveals that Malachar seeks an artifact beneath the capital — and the king\'s death is merely the first step.',
            failureText:
              'Elara shakes her head. "There is no time for an interrogation. Trust me or rot — those are your options."',
            successScene: 'ch1_sewer_escape',
            failureScene: 'ch1_sewer_escape',
          },
          consequences: [
            { type: 'add_companion', companionId: 'elara_dawnwhisper' },
            { type: 'set_flag', flagId: 'knows_malachar_plan', value: true },
            { type: 'stat_change', stat: 'cunning', value: 1 },
          ],
          targetScene: 'ch1_sewer_escape',
        },
      ],
    },

    // ── Scene 3: Investigation (Lore path) ────────────────────────────
    {
      id: 'ch1_investigation',
      chapter: 1,
      title: 'The Poisoner\'s Trail',
      location: 'Thornhold Keep — Throne Room',
      artPrompt:
        'Close-up of a dead king\'s face with blackened veins, a knight examining the body with a torch, ' +
        'captain of the guard watching with suspicion, dark medieval fantasy, moody lighting',
      description: [
        'Thorne orders his soldiers to hold. The captain approaches the throne and peers at the king\'s ' +
        'throat where you pointed — the web of black veins spreading beneath the skin like roots of ' +
        'a poisoned tree.',
        '"Nighthollow," Thorne mutters, and the word hangs in the air like smoke. It is a poison known ' +
        'only to the Ashen Conclave, distilled from fungi that grow in their underground sanctums. ' +
        'No common assassin could procure it.',
        'A new tension fills the room. The guards exchange uneasy glances. If the Conclave murdered ' +
        'the king, this is not merely an assassination — it is the opening move of a war.',
      ],
      dialogue: [
        {
          speaker: 'captain_thorne',
          text: 'You know your poisons, Vane. That either makes you useful or extremely dangerous.',
          mood: 'neutral',
        },
        {
          speaker: 'aldric_vane',
          text: 'I studied under the healers at Greywatch before I took my oath. Nighthollow leaves a signature that is impossible to mistake.',
        },
        {
          speaker: 'captain_thorne',
          text: 'The Queen must be informed. She\'ll want to hear your testimony — and she\'ll want to know why a stripped knight was alone with her husband in the dead of night.',
          mood: 'neutral',
        },
        {
          speaker: 'narrator',
          text: 'Thorne studies you for a long moment, then makes a decision. He does not sheathe his sword, but he gestures for the guards to lower their weapons.',
        },
        {
          speaker: 'captain_thorne',
          text: 'You walk free tonight, Vane. But you walk with an escort, and you go where I say. The Queen will decide your fate at dawn.',
          mood: 'neutral',
        },
      ],
      choices: [
        {
          id: 'ch1_c3_accept_escort',
          text: 'Accept the escort to Queen Isolde',
          tooltip: 'Face the Queen directly — dangerous but could clear your name',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 10 },
            { type: 'set_flag', flagId: 'meeting_queen', value: true },
          ],
          targetScene: 'ch1_queen_audience',
        },
        {
          id: 'ch1_c3_slip_away',
          text: 'Agree, but slip away from the escort en route',
          tooltip: 'Requires Subtlety — disappear before reaching the Queen',
          statCheck: {
            stat: 'subtlety',
            difficulty: 5,
            successText:
              'You stumble convincingly near a servants\' passage and vanish before the guards can react.',
            failureText:
              'A guard catches your arm. "Nice try." Thorne\'s expression hardens.',
            successScene: 'ch1_escape_corridor',
            failureScene: 'ch1_queen_audience',
          },
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: -10 },
            { type: 'set_flag', flagId: 'betrayed_thorne_trust', value: true },
          ],
          targetScene: 'ch1_escape_corridor',
        },
        {
          id: 'ch1_c3_request_investigation',
          text: 'Ask Thorne to let you investigate the body further',
          tooltip: 'Push your advantage — more clues may be hidden',
          consequences: [
            { type: 'set_flag', flagId: 'thorough_investigation', value: true },
            { type: 'add_item', itemId: 'conclave_sigil_fragment' },
            { type: 'stat_change', stat: 'lore', value: 1 },
          ],
          targetScene: 'ch1_queen_audience',
        },
      ],
    },

    // ── Scene 4: Combat Escape ────────────────────────────────────────
    {
      id: 'ch1_combat_escape',
      chapter: 1,
      title: 'Blood and Steel',
      location: 'Thornhold Keep — Throne Room',
      artPrompt:
        'Knight fighting through royal guards in a throne room, swords clashing, sparks flying, ' +
        'overturned brazier casting wild shadows, desperate combat, dark fantasy action scene',
      description: [
        'There is no reasoning with drawn steel. You move on instinct — years of training that no ' +
        'dishonorable discharge can erase. You seize a ceremonial halberd from the wall mount and ' +
        'swing it in a wide arc, driving the nearest soldiers back.',
        'Thorne roars an order, but you are already moving. The throne room becomes a blur of torchlight ' +
        'and ringing metal.',
      ],
      dialogue: [
        {
          speaker: 'captain_thorne',
          text: 'Damn you, Vane! Stand down!',
          mood: 'angry',
        },
        {
          speaker: 'narrator',
          text: 'You have seconds before reinforcements arrive. The servant\'s door behind the tapestry is your only chance.',
        },
      ],
      combat: {
        type: 'minor',
        enemyName: 'Royal Guards',
        enemyDescription:
          'Three armored soldiers of the Iron Throne, well-trained but caught off guard by your sudden violence.',
        primaryStat: 'strength',
        difficulty: 4,
        secondaryStat: 'cunning',
        description:
          'You fight with the desperate efficiency of a cornered animal, using the throne room\'s pillars for cover.',
        victoryConsequences: [
          { type: 'set_flag', flagId: 'defeated_guards', value: true },
          { type: 'stat_change', stat: 'strength', value: 1 },
          { type: 'add_item', itemId: 'stolen_guard_sword' },
        ],
        victoryScene: 'ch1_escape_corridor',
        defeatConsequences: [
          { type: 'damage', value: 20 },
          { type: 'set_flag', flagId: 'captured_after_fight', value: true },
        ],
        defeatScene: 'ch1_dungeon',
      },
      choices: [
        {
          id: 'ch1_c4_flee',
          text: 'Dash for the servants\' passage',
          consequences: [],
          targetScene: 'ch1_escape_corridor',
        },
      ],
    },

    // ── Scene 5: Escape Corridor ──────────────────────────────────────
    {
      id: 'ch1_escape_corridor',
      chapter: 1,
      title: 'The Way Out',
      location: 'Thornhold Keep — Servants\' Passages',
      artPrompt:
        'Narrow medieval stone corridor lit by a single guttering torch, cobwebs, hidden doorway ' +
        'opening to a rainy city street, figure running in shadow, dark fantasy',
      description: [
        'The servants\' passages of Thornhold Keep are a warren of narrow corridors and forgotten ' +
        'stairways, built centuries ago so that the castle\'s invisible army of cooks and cleaners ' +
        'could move without offending noble eyes. Now they serve a different purpose — escape.',
        'Rain hammers the city beyond the walls. Through a crack in the stonework, you can see the ' +
        'capital of Valdoria spread below: the smoke-stained rooftops of the merchant quarter, the ' +
        'distant glow of the Conclave spire, and beyond the walls, the dark line of the Verdant Marches.',
        'Bells are ringing across the city now — the death knell for a king. Soon every gate will ' +
        'be sealed and every road watched. You must choose your path before the net closes.',
      ],
      dialogue: [
        {
          speaker: 'narrator',
          text: 'The city stretches before you, each district offering a different kind of sanctuary — and a different kind of danger.',
        },
      ],
      choices: [
        {
          id: 'ch1_c5_merchant_quarter',
          text: 'Head to the Merchant Quarter — the Obsidian Guild knows how to hide people',
          tooltip: 'Seek refuge among smugglers and spies',
          consequences: [
            { type: 'faction_change', factionId: 'obsidianGuild', value: 5 },
            { type: 'set_flag', flagId: 'fled_to_guild', value: true },
          ],
          targetScene: 'ch1_guild_contact',
        },
        {
          id: 'ch1_c5_conclave_spire',
          text: 'Make for the Conclave Spire — if they killed the king, they hold the answers',
          tooltip: 'Walk into the lion\'s den for the truth',
          consequences: [
            { type: 'faction_change', factionId: 'ashenConclave', value: 5 },
            { type: 'set_flag', flagId: 'fled_to_conclave', value: true },
          ],
          targetScene: 'ch1_conclave_approach',
        },
        {
          id: 'ch1_c5_verdant_marches',
          text: 'Flee beyond the walls to the Verdant Marches',
          tooltip: 'The rebels of the Pact may shelter a fugitive',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 5 },
            { type: 'set_flag', flagId: 'fled_to_pact', value: true },
          ],
          targetScene: 'ch1_marches_road',
        },
        {
          id: 'ch1_c5_stay_capital',
          text: 'Stay in the capital and hide — you need to investigate from the inside',
          tooltip: 'Dangerous, but the evidence is here',
          statCheck: {
            stat: 'subtlety',
            difficulty: 4,
            successText:
              'You find a bolt-hole in the tannery district, where the stench keeps even the most zealous searchers at bay.',
            failureText:
              'A patrol spots you within the hour. You barely escape the city through the eastern sewers.',
            successScene: 'ch1_guild_contact',
            failureScene: 'ch1_sewer_escape',
          },
          consequences: [
            { type: 'set_flag', flagId: 'stayed_in_capital', value: true },
            { type: 'stat_change', stat: 'subtlety', value: 1 },
          ],
          targetScene: 'ch1_guild_contact',
        },
      ],
    },

    // ── Scene 5b: Solo Escape (from dungeon without Elara) ────────────
    {
      id: 'ch1_solo_escape',
      chapter: 1,
      title: 'Alone in the Dark',
      location: 'Thornhold Keep — Dungeons',
      artPrompt:
        'Prisoner breaking free of chains in a dark dungeon, moonlight through barred window, ' +
        'determined expression, dark medieval fantasy',
      description: [
        'Elara withdraws her hand. "Your loss, knight. I won\'t wait for you." You hear the soft click ' +
        'of her lock opening, bare feet on stone, and then she is gone — vanished into the darkness ' +
        'like a wraith.',
        'Alone now, you study your cell with a soldier\'s eye. The mortar between the stones is ancient, ' +
        'crumbling. The iron ring bolted to the wall has a hairline fracture. This prison was built ' +
        'to hold peasants, not trained knights.',
      ],
      dialogue: [
        {
          speaker: 'narrator',
          text: 'With sustained effort, you work the iron ring free from the wall. It is not a key, but it is a tool — and a weapon.',
        },
      ],
      combat: {
        type: 'minor',
        enemyName: 'Dungeon Guard',
        enemyDescription:
          'A single bored guard, half-asleep at his post, startled by the sound of grinding stone.',
        primaryStat: 'strength',
        difficulty: 3,
        description:
          'You lure the guard to your cell door with feigned illness, then strike through the bars with the iron ring.',
        victoryConsequences: [
          { type: 'add_item', itemId: 'guard_keys' },
          { type: 'set_flag', flagId: 'solo_dungeon_escape', value: true },
        ],
        victoryScene: 'ch1_escape_corridor',
        defeatConsequences: [
          { type: 'damage', value: 15 },
          { type: 'set_flag', flagId: 'beaten_in_cell', value: true },
        ],
        defeatScene: 'ch1_sewer_escape',
      },
      choices: [
        {
          id: 'ch1_c5b_escape',
          text: 'Make your way to the servants\' passages',
          consequences: [],
          targetScene: 'ch1_escape_corridor',
        },
      ],
    },

    // ── Scene 5c: Sewer Escape ────────────────────────────────────────
    {
      id: 'ch1_sewer_escape',
      chapter: 1,
      title: 'Beneath the City',
      location: 'Thornhold — City Sewers',
      artPrompt:
        'Medieval sewer tunnel with arched brick ceiling, ankle-deep murky water, rats, distant light, ' +
        'two figures moving cautiously, dark fantasy underground',
      description: [
        'The sewers beneath Valdoria\'s capital are a second city — a labyrinth of ancient waterways ' +
        'and forgotten catacombs that predate the kingdom itself. The air is thick with the stench ' +
        'of rot and the echoes of dripping water.',
        'You press forward through the darkness, one hand on the slimy wall for guidance. Behind you, ' +
        'the sounds of pursuit fade to silence. Ahead, a faint gray light promises an exit — and the ' +
        'uncertain freedom beyond.',
      ],
      dialogue: [
        {
          speaker: 'narrator',
          text: 'The sewer empties into a culvert beyond the city\'s eastern wall. Dawn is breaking over the Verdant Marches, painting the sky in shades of ash and gold.',
        },
        {
          speaker: 'narrator',
          text: 'You are free — hunted, nameless, and alone. But free. The road stretches before you in three directions, each leading to a different power, a different truth, a different danger.',
        },
      ],
      choices: [
        {
          id: 'ch1_c5c_guild',
          text: 'Circle back to the Merchant Quarter — find the Obsidian Guild',
          consequences: [
            { type: 'faction_change', factionId: 'obsidianGuild', value: 5 },
            { type: 'set_flag', flagId: 'fled_to_guild', value: true },
          ],
          targetScene: 'ch1_guild_contact',
        },
        {
          id: 'ch1_c5c_marches',
          text: 'Head east into the Verdant Marches',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 5 },
            { type: 'set_flag', flagId: 'fled_to_pact', value: true },
          ],
          targetScene: 'ch1_marches_road',
        },
        {
          id: 'ch1_c5c_conclave',
          text: 'Follow the old aqueduct north toward the Conclave territories',
          consequences: [
            { type: 'faction_change', factionId: 'ashenConclave', value: 5 },
            { type: 'set_flag', flagId: 'fled_to_conclave', value: true },
          ],
          targetScene: 'ch1_conclave_approach',
        },
      ],
    },

    // ── Scene 6: Queen Audience ───────────────────────────────────────
    {
      id: 'ch1_queen_audience',
      chapter: 1,
      title: 'The Widow\'s Court',
      location: 'Thornhold Keep — Queen\'s Solar',
      artPrompt:
        'Regal medieval queen in black mourning dress seated in a candlelit solar, cold intelligent eyes, ' +
        'a disgraced knight kneeling before her, guards in shadow, dark fantasy political scene',
      description: [
        'Queen Isolde Blackthorn receives you in her private solar, not the throne room. The symbolism ' +
        'is deliberate — this is not a public audience but an interrogation dressed in velvet.',
        'She sits in a high-backed chair by the fire, already in mourning black, though her husband\'s ' +
        'body is barely cold. Her eyes are dry. Whatever grief she holds, it is buried deep beneath ' +
        'layers of calculation. You are not the first to notice that Isolde Blackthorn mourns like a ' +
        'woman who was prepared.',
      ],
      dialogue: [
        {
          speaker: 'queen_isolde',
          text: 'Sir Vane. Or is it simply Vane now? I confess I lose track of who has titles and who has lost them. There are so many of the latter these days.',
          mood: 'neutral',
        },
        {
          speaker: 'aldric_vane',
          text: 'Your Grace. I am sorry for your loss.',
        },
        {
          speaker: 'queen_isolde',
          text: 'Are you? How refreshing. Most of the men in this castle are too busy calculating their advantage to remember that a woman has lost her husband.',
          mood: 'sad',
        },
        {
          speaker: 'narrator',
          text: 'She lifts a goblet of wine but does not drink. Her gaze is steady, measuring.',
        },
        {
          speaker: 'queen_isolde',
          text: 'Captain Thorne tells me you identified the poison. Nighthollow. You understand what that implies — the Conclave\'s fingerprints on my husband\'s corpse. But you also understand, I hope, that obvious evidence is often planted evidence.',
          mood: 'sinister',
        },
        {
          speaker: 'queen_isolde',
          text: 'I need someone who is not bound to any faction. Someone with nothing left to lose. Someone who can move through Valdoria\'s shadows without the weight of allegiance. You, Vane, are uniquely qualified.',
          mood: 'neutral',
        },
      ],
      choices: [
        {
          id: 'ch1_c6_accept_queen',
          text: 'Accept the Queen\'s commission — investigate the assassination for her',
          tooltip: 'Become the Queen\'s agent with official (secret) sanction',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 15 },
            { type: 'set_flag', flagId: 'queens_agent', value: true },
            { type: 'add_item', itemId: 'queens_signet' },
          ],
          targetScene: 'ch1_escape_corridor',
        },
        {
          id: 'ch1_c6_negotiate',
          text: 'Demand the restoration of your knighthood as payment',
          tooltip: 'Requires Charisma — negotiate from a position of weakness',
          statCheck: {
            stat: 'charisma',
            difficulty: 6,
            successText:
              'Isolde\'s lips twitch — almost a smile. "Bold. I can work with bold. Very well — bring me the conspirators, and you shall have your title and more."',
            failureText:
              'Isolde\'s expression turns frigid. "You overestimate your bargaining position, Vane. But I am generous. You may have your life. For now."',
            successScene: 'ch1_escape_corridor',
            failureScene: 'ch1_escape_corridor',
          },
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 10 },
            { type: 'set_flag', flagId: 'queens_agent', value: true },
            { type: 'set_flag', flagId: 'knighthood_promised', value: true },
          ],
          targetScene: 'ch1_escape_corridor',
        },
        {
          id: 'ch1_c6_refuse_queen',
          text: 'Refuse — you trust the Queen no more than anyone else',
          tooltip: 'Independence, but you make a powerful enemy',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: -10 },
            { type: 'set_flag', flagId: 'refused_queen', value: true },
          ],
          targetScene: 'ch1_escape_corridor',
        },
      ],
    },

    // ── Scene 7: Guild Contact (end branch) ───────────────────────────
    {
      id: 'ch1_guild_contact',
      chapter: 1,
      title: 'The Coin\'s Edge',
      location: 'Valdoria — The Hollow Coin Tavern',
      artPrompt:
        'Smoky medieval tavern interior, hooded figures at shadowy tables, a cunning merchant prince ' +
        'with rings on every finger sitting in a private booth, candlelight, dark fantasy noir',
      description: [
        'The Hollow Coin sits in the crooked heart of the Merchant Quarter, a tavern that serves ' +
        'watered ale to dockworkers upstairs and information to those who can afford it in the ' +
        'cellars below. You were directed here by a street urchin who recognized the hand-sign ' +
        'every fugitive in Valdoria learns eventually.',
        'The cellar smells of pipe smoke and secrets. At a table in the deepest alcove, a figure ' +
        'waits — lean, dark-eyed, with the kind of smile that counts your worth in gold before ' +
        'you finish sitting down.',
      ],
      dialogue: [
        {
          speaker: 'nyx',
          text: 'Well, well. The disgraced knight who was found standing over a dead king. You are either the most incompetent assassin in Valdoria, or the most unlucky man alive.',
          mood: 'sinister',
        },
        {
          speaker: 'aldric_vane',
          text: 'I didn\'t kill him.',
        },
        {
          speaker: 'nyx',
          text: 'Darling, I don\'t care if you did. The Obsidian Guild deals in information, not morality. The question is: what can you offer us, and what do you need in return?',
          mood: 'neutral',
        },
        {
          speaker: 'narrator',
          text: 'She slides a cup of dark wine across the table. "Drink. You look like death, and I prefer my business partners breathing."',
        },
        {
          speaker: 'nyx',
          text: 'The Guild already knows things about the assassination that would make Captain Thorne weep into his armor. But knowledge has a price. Everything does.',
          mood: 'sinister',
        },
      ],
      choices: [
        {
          id: 'ch1_c7_deal',
          text: 'Strike a deal — offer your sword arm in exchange for information',
          tooltip: 'Become indebted to the Guild',
          consequences: [
            { type: 'faction_change', factionId: 'obsidianGuild', value: 10 },
            { type: 'set_flag', flagId: 'guild_debt', value: true },
            { type: 'set_flag', flagId: 'ch1_ended_guild', value: true },
          ],
          targetScene: 'ch2_guild_safehouse',
        },
        {
          id: 'ch1_c7_information',
          text: 'Trade what you know about the poison for what the Guild knows',
          tooltip: 'Requires having identified the poison',
          conditions: [
            { type: 'flag_set', flagId: 'identified_poison', operator: 'true' },
          ],
          consequences: [
            { type: 'faction_change', factionId: 'obsidianGuild', value: 15 },
            { type: 'set_flag', flagId: 'traded_info', value: true },
            { type: 'set_flag', flagId: 'ch1_ended_guild', value: true },
          ],
          targetScene: 'ch2_guild_safehouse',
        },
        {
          id: 'ch1_c7_leave',
          text: 'This feels wrong — leave and seek help elsewhere',
          consequences: [
            { type: 'faction_change', factionId: 'obsidianGuild', value: -5 },
            { type: 'set_flag', flagId: 'ch1_ended_independent', value: true },
          ],
          targetScene: 'ch2_crossroads',
        },
      ],
    },

    // ── Scene 8: Conclave Approach (end branch) ───────────────────────
    {
      id: 'ch1_conclave_approach',
      chapter: 1,
      title: 'The Spire\'s Shadow',
      location: 'Northern Road — Approach to the Ashen Spire',
      artPrompt:
        'Towering dark stone spire on a hill, surrounded by dead trees and swirling mist, ' +
        'a lone traveler approaching on a winding path, eerie purple-blue light from windows, ' +
        'dark fantasy landscape, foreboding atmosphere',
      description: [
        'The Ashen Spire rises from the hills north of the capital like a finger of black stone ' +
        'pointing an accusation at the heavens. No road leads to it — only a winding path through ' +
        'dead trees and ankle-deep ash that gives the Conclave its name.',
        'As you climb, the air grows thick with the hum of ancient magic. Runes carved into the ' +
        'path stones glow faintly beneath your boots, and you feel the unmistakable prickle of ' +
        'being watched by eyes that are not entirely human.',
        'At the gate — a door of black iron set into featureless stone — a voice speaks from nowhere ' +
        'and everywhere.',
      ],
      dialogue: [
        {
          speaker: 'narrator',
          text: 'The voice is neither male nor female, neither young nor old. It carries the weight of centuries.',
        },
        {
          speaker: 'high_seer_malachar',
          text: 'The disgraced knight comes seeking truth in the house of truth. How poetic. How predictable.',
          mood: 'sinister',
        },
        {
          speaker: 'aldric_vane',
          text: 'High Seer Malachar. I know what killed the king. I know it came from here.',
        },
        {
          speaker: 'high_seer_malachar',
          text: 'You know what poison was used. That is not the same as knowing who wielded it. A sword does not choose its victim — the hand does.',
          mood: 'neutral',
        },
        {
          speaker: 'high_seer_malachar',
          text: 'Enter, if you dare. But understand this: the Conclave does not offer shelter. We offer perspective. And perspective, Sir Vane, can be a more dangerous thing than any blade.',
          mood: 'sinister',
        },
      ],
      choices: [
        {
          id: 'ch1_c8_enter',
          text: 'Enter the Spire and seek the Conclave\'s knowledge',
          tooltip: 'Step into the heart of the suspected conspirators',
          consequences: [
            { type: 'faction_change', factionId: 'ashenConclave', value: 10 },
            { type: 'set_flag', flagId: 'entered_spire', value: true },
            { type: 'set_flag', flagId: 'ch1_ended_conclave', value: true },
          ],
          targetScene: 'ch2_conclave_inner',
        },
        {
          id: 'ch1_c8_challenge',
          text: 'Demand answers at the gate — refuse to enter on their terms',
          tooltip: 'Requires Charisma — negotiate from outside',
          statCheck: {
            stat: 'charisma',
            difficulty: 6,
            successText:
              'Malachar laughs — a sound like dry leaves in wind. "Spirit. The last knight who dared speak to me so became a footnote. Very well. I will send someone to meet you. Wait."',
            failureText:
              'Silence. The gate remains closed. You are left alone on the ash path as night falls.',
            successScene: 'ch2_conclave_emissary',
            failureScene: 'ch2_crossroads',
          },
          consequences: [
            { type: 'set_flag', flagId: 'challenged_malachar', value: true },
            { type: 'set_flag', flagId: 'ch1_ended_conclave', value: true },
          ],
          targetScene: 'ch2_conclave_emissary',
        },
        {
          id: 'ch1_c8_retreat',
          text: 'Think better of it — the Conclave cannot be trusted',
          consequences: [
            { type: 'set_flag', flagId: 'ch1_ended_independent', value: true },
          ],
          targetScene: 'ch2_crossroads',
        },
      ],
    },

    // ── Scene 9: Verdant Marches Road (end branch) ────────────────────
    {
      id: 'ch1_marches_road',
      chapter: 1,
      title: 'The Green Road',
      location: 'The Verdant Marches — Eastern Farmlands',
      artPrompt:
        'Lush medieval farmland at dawn, golden wheat fields, ancient oak trees, a campfire with ' +
        'rebel farmers gathered around it, a healer tending to a wounded man, pastoral but tense, ' +
        'dark fantasy countryside',
      description: [
        'The Verdant Marches are everything the capital is not — open sky, clean air, and the honest ' +
        'smell of turned earth. But the peace is an illusion. Every farmstead you pass has been ' +
        'fortified with makeshift walls, and the farmers carry sickles sharpened for more than harvest.',
        'The Verdant Pact has been at cold war with the Crown for a generation, and the assassination ' +
        'will shatter what fragile truce remained. By dawn, you find a Pact camp — not soldiers, ' +
        'but farmers and healers, united by a shared conviction that the old powers have failed them.',
        'A man in roughspun robes kneels beside a wounded traveler, his hands glowing with a faint ' +
        'green light. He looks up as you approach, and his eyes hold neither fear nor hostility — ' +
        'only a deep, patient compassion.',
      ],
      dialogue: [
        {
          speaker: 'brother_cedric',
          text: 'You carry a soldier\'s bearing and a fugitive\'s eyes. Sit. Eat. Whatever you are running from will not reach you here before breakfast.',
          mood: 'hopeful',
        },
        {
          speaker: 'aldric_vane',
          text: 'I\'m not sure you want to harbor me. The Crown will be looking for me by morning.',
        },
        {
          speaker: 'brother_cedric',
          text: 'The Crown has been looking for all of us since the day we decided that farmers deserve to eat what they grow. One more fugitive changes nothing.',
          mood: 'neutral',
        },
        {
          speaker: 'brother_cedric',
          text: 'I am Brother Cedric. I heal the wounded and counsel the angry — both of which the Marches have in abundance. Tell me your story, friend. The truth, if you can manage it.',
          mood: 'hopeful',
        },
      ],
      choices: [
        {
          id: 'ch1_c9_tell_truth',
          text: 'Tell Cedric everything — the king, the poison, the frame',
          tooltip: 'Full honesty with a potential ally',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 15 },
            { type: 'set_flag', flagId: 'told_cedric_truth', value: true },
            { type: 'set_flag', flagId: 'ch1_ended_pact', value: true },
          ],
          targetScene: 'ch2_pact_camp',
        },
        {
          id: 'ch1_c9_half_truth',
          text: 'Give a partial account — you\'re a fugitive, nothing more',
          tooltip: 'Protect yourself while gaining shelter',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 5 },
            { type: 'set_flag', flagId: 'ch1_ended_pact', value: true },
          ],
          targetScene: 'ch2_pact_camp',
        },
        {
          id: 'ch1_c9_move_on',
          text: 'Thank him but keep moving — you cannot endanger these people',
          tooltip: 'Noble but isolating',
          consequences: [
            { type: 'set_flag', flagId: 'ch1_ended_independent', value: true },
            { type: 'stat_change', stat: 'cunning', value: 1 },
          ],
          targetScene: 'ch2_crossroads',
        },
      ],
    },
  ],
};
