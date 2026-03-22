import type { Chapter } from '../story-types';

export const chapter10: Chapter = {
  number: 10,
  title: 'Crown of Ashes',
  subtitle: 'The end of all things — and perhaps the beginning',
  openingNarration:
    'You descend into the earth beneath Ashenmere for the last time. Above, the forces you have gathered — fractured, suspicious, held together by nothing stronger than your word and their shared fear — wait in the ruins of a city that has already survived one siege. They will not survive another. Below, the ley-line burns with stolen power, and the Architect waits in the heart of it all, patient as the stone, ancient as the hatred that feeds him. This is where it ends. One way or another, this is where it ends.',
  artPrompt:
    'A lone armored figure descending a massive spiral staircase into a glowing underground cavern, the light from below casting dramatic shadows upward, dark fantasy climax',
  entryScene: 'ch10_the_descent',
  scenes: [
    // ── SCENE 1: The Descent ──
    {
      id: 'ch10_the_descent',
      chapter: 10,
      title: 'The Last Stairway',
      location: 'Ashenmere — The Deep Nexus Approach',
      artPrompt:
        'A spiral staircase carved into living rock descending into blue-white ley-line light, ancient runes on walls, dark fantasy',
      description: [
        'The stairs descend in a spiral so tight and deep that you lose all sense of direction within the first hundred steps. The walls are carved from living rock, veined with crystalline deposits that pulse with the ley-line\'s light — a cold, blue-white radiance that grows stronger as you descend.',
        'Your companions flank you: Elara, her hands already wreathed in protective sigils; Captain Thorne, his blade drawn, his jaw set with the grim resolve of a man who has made peace with whatever comes next. Behind them, the allies your choices have gathered — a different company depending on the bridges you built and the ones you burned.',
        'The air grows warm. Then hot. The ley-line\'s power presses against you like a physical weight, and you feel something else beneath it — a consciousness, vast and cold, that has been aware of your approach since you entered the city.',
      ],
      dialogue: [
        {
          speaker: 'elara_dawnwhisper',
          text: 'He knows we\'re coming. The ley-line is... singing. Or screaming. I can\'t tell the difference anymore.',
          mood: 'fearful',
        },
        {
          speaker: 'captain_thorne',
          text: 'Good. Let him know. I\'m done with shadows and conspiracies. Let it end face to face.',
          mood: 'angry',
        },
        {
          speaker: 'narrator',
          text: 'The stairway opens into a natural cavern so vast that the far wall is lost in darkness. The ley-line runs through its center like a river of molten starlight, and on its banks — no, within it, standing in the flow of raw arcane power as though it were a summer stream — a figure waits.',
        },
      ],
      choices: [
        {
          id: 'ch10_approach_cautiously',
          text: 'Approach cautiously — study Varen before engaging.',
          consequences: [
            { type: 'set_flag', flagId: 'ch10_cautious_approach', value: true },
            { type: 'stat_change', stat: 'cunning', value: 1 },
          ],
          targetScene: 'ch10_varen_speaks',
        },
        {
          id: 'ch10_charge',
          text: 'No more words. Charge.',
          consequences: [
            { type: 'set_flag', flagId: 'ch10_charged_varen', value: true },
            { type: 'stat_change', stat: 'strength', value: 1 },
          ],
          targetScene: 'ch10_first_clash',
        },
        {
          id: 'ch10_attempt_severance',
          text: 'Have Elara begin the severance ritual while you distract Varen.',
          conditions: [
            { type: 'companion_present', companionId: 'elara_dawnwhisper', operator: 'true' },
          ],
          consequences: [
            { type: 'set_flag', flagId: 'ch10_severance_started', value: true },
          ],
          targetScene: 'ch10_varen_speaks',
        },
      ],
    },

    // ── SCENE 2: Varen Speaks ──
    {
      id: 'ch10_varen_speaks',
      chapter: 10,
      title: 'The Architect\'s Welcome',
      location: 'Ashenmere — Ley-Line Nexus',
      artPrompt:
        'A gaunt, luminous figure standing within a river of magical energy in a vast underground cavern, eyes burning with cold fire, ancient and terrible, dark fantasy villain reveal',
      description: [
        'He is not what you expected. You imagined a monster — something twisted, deformed by decades of feeding on stolen power. Instead, Varen is beautiful, in the way that a glacier is beautiful: cold, ancient, and capable of grinding mountains to dust.',
        'His skin is translucent, veined with the same blue-white light as the ley-line. His eyes are not eyes at all but windows into a depth of power that makes your vision swim. He wears no armor, carries no weapon. He does not need to. The ley-line itself is his weapon, and it coils around him like a living thing.',
        'He smiles. It is the most terrifying thing you have ever seen.',
      ],
      dialogue: [
        {
          speaker: 'varen',
          text: 'Aldric Vane. The disgraced knight who refused to stay disgraced. I must confess, you\'ve exceeded every model I built for you. You were supposed to be a distraction — a convenient scapegoat. Instead, you became... this.',
          mood: 'sinister',
        },
        {
          speaker: 'aldric_vane',
          text: 'You murdered the king. You set the realm on fire. Why?',
          mood: 'angry',
        },
        {
          speaker: 'varen',
          text: 'Because the realm was already dying, Vane. The ley-lines are finite. The magic that sustains this world is bleeding away, century by century, drained by the Conclave\'s rituals, the Throne\'s enchanted weapons, the Guild\'s arcane commerce. In another hundred years, the lines will go dark. The wards will fail. The things sleeping beneath the mountains will wake.',
          mood: 'neutral',
        },
        {
          speaker: 'varen',
          text: 'King Aldren was a cork in a bottle. A well-meaning fool who refused to see the catastrophe approaching. His death was not cruelty — it was surgery. The chaos that followed was necessary. A realm that tears itself apart can be rebuilt. A realm that slowly suffocates in its own denial... cannot.',
          mood: 'sinister',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'You\'re insane. You killed a king and started a war because you think you can rebuild the world better than the people living in it?',
          mood: 'angry',
        },
        {
          speaker: 'varen',
          text: 'Not think, child. Know. I have spent thirty years bonded to the ley-line. I have seen the shape of what\'s coming. Every possible future, every timeline, every outcome. And in every single one where the old order persists... Valdoria dies. I am the only future where it doesn\'t.',
          mood: 'sinister',
        },
      ],
      choices: [
        {
          id: 'ch10_reject_vision',
          text: '"You\'re not a savior. You\'re a tyrant who murdered his way to power and dressed it up as prophecy."',
          consequences: [
            { type: 'set_flag', flagId: 'ch10_rejected_varen', value: true },
            { type: 'stat_change', stat: 'charisma', value: 1 },
          ],
          targetScene: 'ch10_first_clash',
        },
        {
          id: 'ch10_consider_vision',
          text: '"If the ley-lines are truly dying... what is your solution? What would you build?"',
          consequences: [
            { type: 'set_flag', flagId: 'ch10_heard_varen_out', value: true },
            { type: 'stat_change', stat: 'lore', value: 1 },
          ],
          targetScene: 'ch10_varens_offer',
        },
        {
          id: 'ch10_stall_for_ritual',
          text: 'Keep him talking — Elara needs time for the severance ritual.',
          conditions: [
            { type: 'flag_set', flagId: 'ch10_severance_started', operator: 'true' },
          ],
          statCheck: {
            stat: 'cunning',
            difficulty: 7,
            successText: 'You hold his attention, drawing out his monologue while feeling the subtle shift in the ley-line as Elara works her counter-magic behind you.',
            failureText: 'Varen\'s gaze flicks past you to Elara. "Ah. A severance ritual. How quaint." The ley-line lashes out, shattering her circle.',
            successScene: 'ch10_first_clash',
            failureScene: 'ch10_first_clash',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch10_stalled_varen', value: true },
          ],
          targetScene: 'ch10_first_clash',
        },
      ],
    },

    // ── SCENE 3: Varen's Offer ──
    {
      id: 'ch10_varens_offer',
      chapter: 10,
      title: 'The Temptation',
      location: 'Ashenmere — Ley-Line Nexus',
      artPrompt:
        'A glowing hand extended in offering within a cavern of magical light, temptation scene, dark fantasy',
      description: [
        'Varen extends a hand. It glows with the cold fire of the ley-line, and in its light you see — or think you see — visions. A Valdoria reborn. Cities gleaming with arcane light. Fields that never wither. A realm where no child goes hungry, no plague goes uncured, no injustice goes unanswered. A perfect world, governed by a perfect intelligence, sustained by the infinite power of a controlled and optimized ley-line network.',
        'It is beautiful. It is also, you sense on some level below thought, a cage.',
      ],
      dialogue: [
        {
          speaker: 'varen',
          text: 'Join me, Vane. You have proven yourself exceptional — resourceful, principled, unbowed by the petty tribalism that cripples the factions. I need someone like you. A champion. A face the people can trust while I do the work that must be done in the shadows.',
          mood: 'sinister',
        },
        {
          speaker: 'varen',
          text: 'The alternative is to fight me. And I think you know how that ends. I do not say this to threaten — I say it because I have seen it. Every future where you fight me ends in ash.',
          mood: 'neutral',
        },
        {
          speaker: 'captain_thorne',
          text: 'Don\'t listen to him, Vane. I\'ve heard this speech before — different words, same lie. Every tyrant thinks they\'re the exception. Every monster thinks they\'re the hero.',
          mood: 'angry',
        },
      ],
      choices: [
        {
          id: 'ch10_accept_offer',
          text: '"Show me. Show me this future you\'ve seen."',
          tooltip: 'Dangerous path — leads to a dark ending',
          consequences: [
            { type: 'set_flag', flagId: 'ch10_accepted_varen', value: true },
            { type: 'faction_change', factionId: 'ironThrone', value: -30 },
            { type: 'faction_change', factionId: 'verdantPact', value: -30 },
          ],
          targetScene: 'ch10_dark_convergence',
        },
        {
          id: 'ch10_refuse_offer',
          text: '"I\'ve heard enough. The people of Valdoria deserve to choose their own future — even a flawed one."',
          consequences: [
            { type: 'set_flag', flagId: 'ch10_refused_varen', value: true },
            { type: 'stat_change', stat: 'charisma', value: 1 },
          ],
          targetScene: 'ch10_first_clash',
        },
        {
          id: 'ch10_trick_varen',
          text: 'Pretend to consider the offer — use the moment to strike when his guard is down.',
          statCheck: {
            stat: 'subtlety',
            difficulty: 8,
            successText: 'You step forward as if to take his hand — and drive your blade into the gap between the ley-line\'s flow and his body. Varen screams. For the first time, he bleeds.',
            failureText: 'You reach for his hand and he reads the deception in your eyes. The ley-line erupts, hurling you backward into the cavern wall.',
            successScene: 'ch10_first_clash',
            failureScene: 'ch10_first_clash',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch10_tricked_varen', value: true },
          ],
          targetScene: 'ch10_first_clash',
        },
      ],
    },

    // ── SCENE 4: First Clash (Boss Fight Phase 1) ──
    {
      id: 'ch10_first_clash',
      chapter: 10,
      title: 'The Storm Breaks',
      location: 'Ashenmere — Ley-Line Nexus',
      artPrompt:
        'An epic battle in an underground cavern with magical energy exploding around combatants, a luminous figure hurling arcane blasts at a sword-wielding knight, dark fantasy boss fight',
      description: [
        'The first blow cracks the air like thunder. Whether you struck first or Varen did, the result is the same: the cavern erupts into chaos. The ley-line thrashes like a wounded serpent, and Varen rides its power with the ease of a man who has had thirty years to learn its rhythms.',
        'He does not fight like a sorcerer. He fights like the ley-line itself — with torrents of force that reshape the cavern around you, pillars of crystal erupting from the floor, gravity inverting in localized pockets, the very air becoming a weapon. You dodge a bolt of condensed starlight that punches a hole through three feet of solid granite.',
        'Thorne charges from the flank, his blade trailing sparks. Varen barely glances at him — a gesture, and Thorne is hurled backward, armor ringing against stone. But the distraction costs Varen a fraction of a second, and in that fraction you close the distance.',
      ],
      dialogue: [
        {
          speaker: 'varen',
          text: 'Courage. I respect it. I even admire it. But courage without power is just a prettier form of suicide.',
          mood: 'sinister',
        },
        {
          speaker: 'narrator',
          text: 'The ley-line surges and Varen\'s form becomes incandescent. He is drawing deeper now, pulling power from the line at a rate that makes the walls groan and the air taste of copper. He is not merely using the ley-line — he is becoming it.',
        },
      ],
      combat: {
        type: 'boss',
        enemyName: 'Varen the Architect — First Form',
        enemyDescription:
          'The Architect channels the ley-line\'s power directly, creating devastating arcane attacks. His connection to the magical current makes him nearly invulnerable to direct assault.',
        primaryStat: 'strength',
        difficulty: 8,
        secondaryStat: 'lore',
        description:
          'Varen fights with the full fury of the ley-line. You must find a way to disrupt his connection or endure his onslaught long enough for an opening.',
        victoryConsequences: [
          { type: 'set_flag', flagId: 'ch10_phase1_victory', value: true },
          { type: 'stat_change', stat: 'strength', value: 1 },
        ],
        victoryScene: 'ch10_leyline_crisis',
        defeatConsequences: [
          { type: 'damage', value: 35 },
          { type: 'set_flag', flagId: 'ch10_phase1_defeat', value: true },
        ],
        defeatScene: 'ch10_leyline_crisis',
      },
      choices: [
        {
          id: 'ch10_attack_connection',
          text: 'Target Varen\'s connection to the ley-line — cut the power at its source.',
          statCheck: {
            stat: 'lore',
            difficulty: 7,
            successText: 'You see the threads of power flowing from the ley-line into Varen\'s body and you cut them — not with your blade, but with a counter-sigil Elara taught you. Varen staggers.',
            failureText: 'You slash at the ley-line currents and they recoil, burning your hands. The power is too deeply bonded to sever by brute force.',
            successScene: 'ch10_leyline_crisis',
            failureScene: 'ch10_leyline_crisis',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch10_cut_connection', value: true },
          ],
          targetScene: 'ch10_leyline_crisis',
        },
        {
          id: 'ch10_brute_force',
          text: 'Overwhelm him with sheer martial skill — he may be powerful but he\'s not a trained fighter.',
          consequences: [
            { type: 'set_flag', flagId: 'ch10_brute_approach', value: true },
          ],
          targetScene: 'ch10_leyline_crisis',
        },
        {
          id: 'ch10_coordinated_assault',
          text: 'Coordinate with your allies — attack from multiple angles simultaneously.',
          conditions: [
            { type: 'flag_set', flagId: 'ch9_unified_path', operator: 'true' },
          ],
          consequences: [
            { type: 'set_flag', flagId: 'ch10_coordinated_attack', value: true },
            { type: 'faction_change', factionId: 'ironThrone', value: 5 },
            { type: 'faction_change', factionId: 'verdantPact', value: 5 },
          ],
          targetScene: 'ch10_leyline_crisis',
        },
      ],
      variants: [
        {
          condition: { type: 'flag_set', flagId: 'ch10_tricked_varen', operator: 'true' },
          description: [
            'Your surprise attack drew first blood — a thin line of luminous ichor across Varen\'s ribs. He is not invulnerable. The knowledge steadies your hand as the real battle begins.',
          ],
        },
        {
          condition: { type: 'flag_set', flagId: 'ch10_charged_varen', operator: 'true' },
          description: [
            'You hit him before he finished speaking — a clean strike that would have killed any mortal man. It barely staggers him, but the look of surprise on his face is worth the pain of the counterattack that follows.',
          ],
        },
      ],
    },

    // ── SCENE 5: Ley-Line Crisis ──
    {
      id: 'ch10_leyline_crisis',
      chapter: 10,
      title: 'The Breaking Point',
      location: 'Ashenmere — Ley-Line Nexus (Destabilizing)',
      artPrompt:
        'A massive underground cavern cracking apart, ley-line energy going wild, bolts of light striking in all directions, characters bracing against magical storm, dark fantasy catastrophe',
      description: [
        'The battle has destabilized the ley-line. Fissures spiderweb across the cavern ceiling, and through them you can see sky — impossibly far above, but drawing closer as the ground collapses. The ley-line itself has become erratic, pulsing in arrhythmic surges that send shockwaves through the earth.',
        'Varen stands at the epicenter, and for the first time, he looks afraid. Not of you — of what he has unleashed. His perfect control, maintained for thirty years, is slipping. The ley-line is no longer a tool; it is a wild thing, and it is breaking free.',
        'Above, you hear distant screams. The city. Ashenmere is above this cavern. Three thousand souls.',
      ],
      dialogue: [
        {
          speaker: 'varen',
          text: 'You fools. You absolute fools. The line is destabilizing. If it ruptures, it won\'t just destroy this cavern — it will take the city. It will take the entire valley. Everything within twenty miles will be scoured to bedrock.',
          mood: 'desperate',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'He\'s right. The energy readings are catastrophic. We have minutes — maybe less.',
          mood: 'desperate',
        },
        {
          speaker: 'captain_thorne',
          text: 'Three thousand people up there, Vane. Women. Children. The same people we bled to save in the siege.',
          mood: 'desperate',
        },
        {
          speaker: 'varen',
          text: 'I can stabilize it. But only if you stop fighting me. Only if you let me reconnect. I am the only one with the power to contain this — and you know it.',
          mood: 'desperate',
        },
      ],
      choices: [
        {
          id: 'ch10_let_varen_stabilize',
          text: 'Let Varen reconnect to the ley-line — saving the city means giving him back his power.',
          tooltip: 'Save the city but restore the Architect\'s power',
          consequences: [
            { type: 'set_flag', flagId: 'ch10_let_varen_reconnect', value: true },
          ],
          targetScene: 'ch10_final_choice',
        },
        {
          id: 'ch10_elara_stabilize',
          text: 'Refuse. Have Elara attempt the stabilization — she has the knowledge, if not the raw power.',
          statCheck: {
            stat: 'lore',
            difficulty: 8,
            successText: 'Elara steps into the ley-line\'s flow. The power nearly tears her apart, but she holds — she holds — and slowly, agonizingly, the current steadies. Varen watches in stunned disbelief.',
            failureText: 'Elara tries. Gods, how she tries. But the power is too much. She collapses, and the ley-line continues its catastrophic destabilization.',
            successScene: 'ch10_final_confrontation',
            failureScene: 'ch10_final_choice',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch10_elara_attempt', value: true },
          ],
          targetScene: 'ch10_final_confrontation',
        },
        {
          id: 'ch10_sacrifice_nexus',
          text: 'Destroy the nexus entirely — collapse the ley-line to deny Varen his power, whatever the cost.',
          tooltip: 'Radical solution — saves no one if it fails',
          consequences: [
            { type: 'set_flag', flagId: 'ch10_destroyed_nexus', value: true },
            { type: 'damage', value: 30 },
          ],
          targetScene: 'ch10_final_confrontation',
        },
        {
          id: 'ch10_evacuate',
          text: 'Send Thorne to evacuate the city above while you buy time against Varen.',
          consequences: [
            { type: 'set_flag', flagId: 'ch10_ordered_evacuation', value: true },
          ],
          targetScene: 'ch10_final_confrontation',
        },
      ],
    },

    // ── SCENE 6: Dark Convergence (Accepted Varen's Offer) ──
    {
      id: 'ch10_dark_convergence',
      chapter: 10,
      title: 'The Crown of Thorns',
      location: 'Ashenmere — Ley-Line Nexus',
      artPrompt:
        'A figure kneeling before a luminous being in an underground cavern, dark energy forming a crown above the kneeling figure\'s head, ominous, dark fantasy',
      description: [
        'You take his hand. The ley-line surges through you — a flood of power and vision that shatters every boundary between self and world. For one blinding instant you see what Varen sees: the web of ley-lines spanning the continent, the slow decay at their edges, the darkness gathering beyond the wards. He was not lying about the dying world.',
        'But you also see his solution — and it is not salvation. It is dominion. A realm of perfect order maintained by perfect control, where free will is a luxury permitted only to those who agree with the one who holds the power. A golden cage with no key.',
        'Behind you, Captain Thorne\'s voice is a distant thunder: "VANE! DON\'T!"',
      ],
      dialogue: [
        {
          speaker: 'varen',
          text: 'Yes. You see it now. The beauty of control. The peace of certainty. This is what I offer — not tyranny, but the end of suffering.',
          mood: 'triumphant',
        },
        {
          speaker: 'narrator',
          text: 'The power is intoxicating. You could reshape the world. You could end hunger, cure plague, silence the drums of war forever. All you have to do is stop being human.',
        },
      ],
      choices: [
        {
          id: 'ch10_embrace_power',
          text: 'Embrace the power fully. Become the Architect\'s champion and reshape Valdoria.',
          consequences: [
            { type: 'set_flag', flagId: 'ch10_became_champion', value: true },
            { type: 'faction_change', factionId: 'ironThrone', value: -50 },
            { type: 'faction_change', factionId: 'verdantPact', value: -50 },
          ],
          targetScene: 'ch10_ending_ash_and_ruin',
        },
        {
          id: 'ch10_betray_varen',
          text: 'You\'ve seen his weakness — betray Varen from within, using the connection against him.',
          statCheck: {
            stat: 'cunning',
            difficulty: 9,
            successText: 'You turn the power back on Varen. His shock is total — he never expected betrayal from inside his own gift. The ley-line tears between you like a living thing being ripped in half.',
            failureText: 'You try to reverse the flow and Varen smiles. "Did you think I wouldn\'t anticipate that?" The power surges, pinning you in place.',
            successScene: 'ch10_final_confrontation',
            failureScene: 'ch10_final_choice',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch10_betrayed_from_within', value: true },
            { type: 'damage', value: 20 },
          ],
          targetScene: 'ch10_final_confrontation',
        },
      ],
    },

    // ── SCENE 7: Final Choice (Transitional) ──
    {
      id: 'ch10_final_choice',
      chapter: 10,
      title: 'The Last Gambit',
      location: 'Ashenmere — Collapsing Nexus',
      artPrompt:
        'A cavern collapsing with magical energy, a desperate choice between two paths, rubble falling, dark fantasy',
      description: [
        'Time has run out. The ley-line shrieks, the cavern groans, and Varen stands at the center of it all — reconnected or not, desperate or triumphant, but still the lynchpin upon which everything turns.',
        'You have one chance left. One final act that will determine not just the battle but the shape of whatever world survives it.',
      ],
      dialogue: [
        {
          speaker: 'elara_dawnwhisper',
          text: 'Aldric — whatever you\'re going to do, do it now.',
          mood: 'desperate',
        },
      ],
      choices: [
        {
          id: 'ch10_final_attack',
          text: 'Pour everything into one final assault on Varen.',
          consequences: [
            { type: 'set_flag', flagId: 'ch10_final_assault', value: true },
          ],
          targetScene: 'ch10_final_confrontation',
        },
        {
          id: 'ch10_final_sacrifice',
          text: 'Sacrifice yourself to sever Varen\'s connection permanently.',
          consequences: [
            { type: 'set_flag', flagId: 'ch10_self_sacrifice', value: true },
            { type: 'damage', value: 50 },
          ],
          targetScene: 'ch10_final_confrontation',
        },
      ],
    },

    // ── SCENE 8: Final Confrontation (Boss Fight Phase 2) ──
    {
      id: 'ch10_final_confrontation',
      chapter: 10,
      title: 'Crown of Ashes',
      location: 'Ashenmere — Ley-Line Nexus Heart',
      artPrompt:
        'An epic final battle between a knight and a luminous arcane being in a shattering underground cavern, massive magical explosions, pillars of light, dark fantasy climax',
      description: [
        'This is the end. The cavern is tearing itself apart around you, the ley-line is a maelstrom of uncontrolled energy, and Varen — diminished, desperate, but still impossibly powerful — gathers everything he has left for one final strike.',
        'You see it building: a sphere of compressed starlight between his hands, growing brighter and denser with each heartbeat. If it detonates at full power, nothing in this cavern will survive. Nothing above it will survive either.',
        'You raise your blade. It is chipped, notched, stained with your blood and his. It is the most beautiful thing you have ever held.',
      ],
      dialogue: [
        {
          speaker: 'varen',
          text: 'You could have been a god, Vane. You chose to be a man. History will call you a fool.',
          mood: 'desperate',
        },
        {
          speaker: 'aldric_vane',
          text: 'History can call me whatever it likes. I\'ll be too busy being alive to care.',
          mood: 'triumphant',
        },
        {
          speaker: 'narrator',
          text: 'You charge. The sphere of starlight fills your vision. The world becomes white — and then, one way or another, it becomes something new.',
        },
      ],
      combat: {
        type: 'boss',
        enemyName: 'Varen the Architect — Final Form',
        enemyDescription:
          'Varen, partially unmoored from the ley-line, channels everything he has into a final apocalyptic attack. His body is disintegrating, becoming raw energy. He is a dying star, and he intends to take you with him.',
        primaryStat: 'strength',
        difficulty: 9,
        secondaryStat: 'cunning',
        description:
          'The final battle. Everything you\'ve learned, everyone you\'ve fought beside, every choice you\'ve made — it all comes down to this moment.',
        victoryConsequences: [
          { type: 'set_flag', flagId: 'ch10_varen_defeated', value: true },
          { type: 'add_item', itemId: 'crown_of_ashes' },
        ],
        victoryScene: 'ch10_resolution',
        defeatConsequences: [
          { type: 'damage', value: 40 },
          { type: 'set_flag', flagId: 'ch10_varen_survived', value: true },
        ],
        defeatScene: 'ch10_resolution',
      },
      choices: [
        {
          id: 'ch10_strike_true',
          text: 'Strike with everything you have — one perfect blow.',
          consequences: [
            { type: 'set_flag', flagId: 'ch10_killing_blow', value: true },
          ],
          targetScene: 'ch10_resolution',
        },
        {
          id: 'ch10_shield_allies',
          text: 'Use your body to shield your allies from the detonation.',
          consequences: [
            { type: 'set_flag', flagId: 'ch10_shielded_allies', value: true },
            { type: 'damage', value: 30 },
          ],
          targetScene: 'ch10_resolution',
        },
      ],
      variants: [
        {
          condition: { type: 'flag_set', flagId: 'ch10_coordinated_attack', operator: 'true' },
          description: [
            'You are not alone. Iron Guard and Verdant rangers attack in tandem. Conclave mages weave barriers of force. Guild assassins strike at Varen\'s blind spots. It is the first time in living memory that all four factions have fought as one — and it is magnificent.',
          ],
        },
        {
          condition: { type: 'flag_set', flagId: 'ch10_destroyed_nexus', operator: 'true' },
          description: [
            'The nexus is shattered. Without it, Varen is diminished — still powerful, still dangerous, but no longer a force of nature. He fights like a man now, and men can be beaten.',
          ],
        },
        {
          condition: { type: 'flag_set', flagId: 'ch10_self_sacrifice', operator: 'true' },
          description: [
            'You burn. The ley-line\'s power flows through you as you use your own body as the conduit to sever Varen\'s connection. It is agony beyond description — but through the pain, you feel the link snap. Varen screams. And you, somehow, keep standing.',
          ],
        },
      ],
    },

    // ── SCENE 9: Resolution ──
    {
      id: 'ch10_resolution',
      chapter: 10,
      title: 'After the Storm',
      location: 'Ashenmere — Surface, Dawn',
      artPrompt:
        'Dawn breaking over a battle-scarred city with a collapsed sinkhole where the ley-line nexus was, survivors emerging into light, bittersweet dark fantasy',
      description: [
        'Dawn. Somehow, impossibly, dawn.',
        'You emerge from the ruined earth like a creature born from the soil itself — covered in dust, bleeding from a dozen wounds, your armor cracked, your blade gone. Behind you, the ley-line nexus has collapsed into a sinkhole two hundred feet across, its light fading to a dim pulse like a dying heartbeat.',
        'Ashenmere stands. Battered, scarred, missing its eastern quarter and most of its dignity — but standing. The three thousand souls Captain Thorne stayed to protect are alive, gathered in the central square, looking up at the sky as if they\'ve never seen it before.',
        'Varen is gone. Whether dead, destroyed, or simply dissipated into the ley-line he loved more than any living thing, you cannot say. The crown of ashes — a circlet of fused stone and crystallized ley-line energy — is all that remains of the Architect\'s dream.',
      ],
      dialogue: [
        {
          speaker: 'elara_dawnwhisper',
          text: 'It\'s over. Aldric... it\'s over.',
          mood: 'hopeful',
        },
        {
          speaker: 'narrator',
          text: 'But it is not over. The realm still burns. The factions still quarrel. The king is still dead, and the future is still unwritten. What happens next depends on the choices you have made — and the one you are about to make.',
        },
        {
          speaker: 'captain_thorne',
          text: 'The people are looking to you, Vane. The factions, the survivors, the soldiers who fought beside you. They want to know: what comes next?',
          mood: 'neutral',
        },
      ],
      choices: [
        {
          id: 'ch10_ending_iron',
          text: 'Support Queen Isolde\'s claim. The realm needs a strong hand to rebuild.',
          tooltip: 'Iron Dominion ending — order through authority',
          conditions: [
            { type: 'faction_reputation', factionId: 'ironThrone', operator: 'gte', value: 30 },
          ],
          consequences: [
            { type: 'set_flag', flagId: 'ending_iron_dominion', value: true },
            { type: 'faction_change', factionId: 'ironThrone', value: 20 },
          ],
          targetScene: 'ending_iron_dominion',
        },
        {
          id: 'ch10_ending_arcane',
          text: 'Entrust the ley-lines to the Conclave. Magic must be preserved and guided by wisdom.',
          tooltip: 'Arcane Ascension ending — knowledge and mystical stewardship',
          conditions: [
            { type: 'faction_reputation', factionId: 'ashenConclave', operator: 'gte', value: 30 },
          ],
          consequences: [
            { type: 'set_flag', flagId: 'ending_arcane_ascension', value: true },
            { type: 'faction_change', factionId: 'ashenConclave', value: 20 },
          ],
          targetScene: 'ending_arcane_ascension',
        },
        {
          id: 'ch10_ending_dawn',
          text: 'Dissolve the old order. The people will govern themselves, as they always should have.',
          tooltip: 'People\'s Dawn ending — freedom and self-governance',
          conditions: [
            { type: 'faction_reputation', factionId: 'verdantPact', operator: 'gte', value: 30 },
          ],
          consequences: [
            { type: 'set_flag', flagId: 'ending_peoples_dawn', value: true },
            { type: 'faction_change', factionId: 'verdantPact', value: 20 },
          ],
          targetScene: 'ending_peoples_dawn',
        },
        {
          id: 'ch10_ending_shadow',
          text: 'Let Sylas reshape the realm from the shadows. Pragmatism, not ideology, will save Valdoria.',
          tooltip: 'Shadow Empire ending — pragmatic shadow governance',
          conditions: [
            { type: 'faction_reputation', factionId: 'obsidianGuild', operator: 'gte', value: 30 },
          ],
          consequences: [
            { type: 'set_flag', flagId: 'ending_shadow_empire', value: true },
            { type: 'faction_change', factionId: 'obsidianGuild', value: 20 },
          ],
          targetScene: 'ending_shadow_empire',
        },
        {
          id: 'ch10_ending_unified',
          text: 'Forge a new council — all four factions, sharing power equally. No more kings, no more shadows.',
          tooltip: 'Unified Realm ending — requires broad faction support',
          conditions: [
            { type: 'flag_set', flagId: 'ch9_unified_path', operator: 'true' },
          ],
          consequences: [
            { type: 'set_flag', flagId: 'ending_unified_realm', value: true },
            { type: 'faction_change', factionId: 'ironThrone', value: 10 },
            { type: 'faction_change', factionId: 'ashenConclave', value: 10 },
            { type: 'faction_change', factionId: 'verdantPact', value: 10 },
            { type: 'faction_change', factionId: 'obsidianGuild', value: 10 },
          ],
          targetScene: 'ending_unified_realm',
        },
      ],
      variants: [
        {
          condition: { type: 'flag_set', flagId: 'ch10_varen_survived', operator: 'true' },
          description: [
            'Varen is not dead. You can feel it — a distant pulse in the ruined ley-line, a whisper at the edge of hearing. He is diminished, scattered, but not destroyed. He will return. Someday, he will return. And whoever rules Valdoria when that day comes will need to be ready.',
          ],
        },
        {
          condition: { type: 'flag_set', flagId: 'ch10_self_sacrifice', operator: 'true' },
          description: [
            'You are changed. The ley-line\'s passage through your body has left its mark — silver veins beneath your skin, a faint luminescence in your eyes, a sense of the world\'s magical currents that will never fully fade. You are no longer entirely human. But you are alive. Against all odds, you are alive.',
          ],
        },
      ],
    },

    // ── SCENE 10: Ash and Ruin (Dark Ending) ──
    {
      id: 'ch10_ending_ash_and_ruin',
      chapter: 10,
      title: 'Ash and Ruin',
      location: 'Valdoria — The New Order',
      artPrompt:
        'A dark throne room with a figure wearing a crown of black crystal, the land outside the windows scorched and lifeless, dark fantasy tragic ending',
      description: [
        'You chose power. The histories will debate whether you chose it willingly or were seduced, but the result is the same: Valdoria falls under the shadow of a new Architect.',
        'Varen\'s knowledge fills you like water filling a vessel. You see the ley-lines, feel their rhythms, understand their failing. And you understand — too late, perhaps — that he was right about the dying world, if nothing else. The power to save it is in your hands now. The question is whether anything human remains in those hands to guide it.',
        'Captain Thorne died trying to stop you. Elara wept as she fled. The factions that might have been allies are now subjects. And the crown of ashes sits upon your brow like a sentence.',
      ],
      dialogue: [
        {
          speaker: 'narrator',
          text: 'In the years that follow, Valdoria knows peace — the peace of the grave, some whisper, but peace nonetheless. The ley-lines stabilize. The wards hold. The deep things do not wake. And if the people are not free, at least they are alive. Whether that is enough — whether that has ever been enough — is a question you no longer have the humanity to ask.',
        },
      ],
      choices: [
        {
          id: 'ch10_ash_end',
          text: 'The crown of ashes is yours. For better or worse, this is your legacy.',
          consequences: [
            { type: 'set_flag', flagId: 'game_complete', value: true },
          ],
          targetScene: 'ending_ash_and_ruin',
        },
      ],
    },
  ],
};
