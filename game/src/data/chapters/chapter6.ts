import type { Chapter } from '../story-types';

export const chapter6: Chapter = {
  number: 6,
  title: 'Shifting Alliances',
  subtitle: 'In war, the only constant is betrayal',
  openingNarration:
    'The truth of the Ashen Conclave\'s machinations spreads through Valdoria like poison in a well — corrupting every alliance, every certainty, every grudging trust that held the factions in their uneasy orbit. Aldric Vane carries knowledge that could unite the realm or shatter it beyond repair. The factions circle one another with new suspicion, old allies become potential traitors, and in the spaces between, those who were enemies discover they may need each other more than they ever imagined. The game board has been upended, and the pieces must find new positions — or be swept away entirely.',
  artPrompt:
    'A medieval war council scene where representatives from four different factions sit at a round table, each eyeing the others with suspicion, daggers hidden beneath the table, maps and goblets between them, oil painting style, tense political atmosphere, candlelight and shadow',
  entryScene: 'ch6_factionReturn',
  scenes: [
    // ─── Scene 1: Return to the Factions ──────────────────────────
    {
      id: 'ch6_factionReturn',
      chapter: 6,
      title: 'The Bearer of Unwelcome News',
      location: 'Valdoria - Various',
      artPrompt:
        'A lone rider approaching a fortified city at sunset, carrying multiple faction banners, guards on the walls watching warily, oil painting style, tension and uncertainty',
      description: [
        'Word of the Sanctum\'s collapse has already spread by the time Aldric reaches civilization. Rumors fly faster than ravens in Valdoria — each retelling more distorted than the last. Some say the Conclave destroyed itself. Some say an army of the dead rose from the ley lines. Some say a disgraced knight walked into the heart of prophecy and challenged a god.',
        'The truth, as always, is both simpler and more terrible. But truth is a commodity with diminishing value in a realm at war, and the question facing Aldric now is not what happened but whom to tell, and how much, and what to ask for in return.',
        'Every faction wants him. Every faction suspects him. And somewhere in the shadows, Malachar recalculates.',
      ],
      dialogue: [
        {
          speaker: 'narrator',
          text: 'Three messengers wait at the crossroads outside Ashenmere, each bearing a different seal. The Iron Throne, the Verdant Pact, and the Obsidian Guild have all sent summons. Only the Ashen Conclave is silent — but their silence speaks loudest of all.',
        },
      ],
      choices: [
        {
          id: 'ch6_answer_throne',
          text: 'Answer Queen Isolde\'s summons — the Iron Throne has the military power to act on what you have learned.',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 10 },
            { type: 'set_flag', flagId: 'ch6_chose_throne', value: true },
          ],
          targetScene: 'ch6_throneAudience',
        },
        {
          id: 'ch6_answer_pact',
          text: 'Go to Rowan and the Verdant Pact — they understand the ley lines and may know how to protect the remaining villages.',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 10 },
            { type: 'set_flag', flagId: 'ch6_chose_pact', value: true },
          ],
          targetScene: 'ch6_pactCouncil',
        },
        {
          id: 'ch6_answer_guild',
          text: 'Seek Sylas Ashford — the Obsidian Guild can find Malachar, and their intelligence network is the best weapon against a man who sees the future.',
          consequences: [
            { type: 'faction_change', factionId: 'obsidianGuild', value: 10 },
            { type: 'set_flag', flagId: 'ch6_chose_guild', value: true },
          ],
          targetScene: 'ch6_guildMeeting',
        },
        {
          id: 'ch6_summon_all',
          text: 'Send word to all three factions — demand a summit. The threat is too great for any one faction to face alone.',
          tooltip: 'Ambitious diplomacy requiring reputation',
          statCheck: {
            stat: 'charisma',
            difficulty: 8,
            successText: 'Your reputation — earned through blood and revelation — carries enough weight to bring all three factions to the table.',
            failureText: 'The messengers return with mixed results. Queen Isolde agrees. Rowan grudgingly accepts. Sylas sends a note: "I will be there. You will not see me."',
            successScene: 'ch6_grandSummit',
            failureScene: 'ch6_throneAudience',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch6_called_summit', value: true },
          ],
          targetScene: 'ch6_grandSummit',
        },
      ],
    },

    // ─── Scene: Throne Audience ───────────────────────────────────
    {
      id: 'ch6_throneAudience',
      chapter: 6,
      title: 'The Queen\'s Judgment',
      location: 'Ironhold Fortress - Throne Room',
      artPrompt:
        'A dark stone throne room with a powerful queen on an iron throne, a knight kneeling before her, guards flanking the walls, torchlight casting harsh shadows, oil painting style, power and intimidation',
      description: [
        'The Iron Throne is not a metaphor. It is an actual throne forged from the weapons of defeated enemies, a mass of blades and spearpoints welded together into something that looks less like a seat of power and more like a warning. Queen Isolde sits upon it as though the discomfort is a virtue — which, in her philosophy, it is.',
        'The throne room is full. Commanders, advisors, nobles, and spies crowd the galleries, all of them watching the disgraced knight who walked into the Sanctum of Echoes and walked out again. Aldric can feel their gazes like physical pressure — some curious, some hostile, some calculating how his story might be useful.',
        'Captain Thorne stands at the Queen\'s right hand, his scarred face unreadable. He gives Aldric the smallest nod — the kind of acknowledgment that in military culture communicates volumes.',
      ],
      dialogue: [
        {
          speaker: 'queen_isolde',
          text: 'Vane. My scouts report that you entered the Ashen Conclave\'s most sacred fortress, confronted their ancient and presumably immortal leader, and survived. Either you are the most capable knight in Valdoria or the most spectacular liar. For the realm\'s sake, I hope the former.',
          mood: 'neutral',
        },
        {
          speaker: 'queen_isolde',
          text: 'Report. Everything. And understand that what you say in this room will determine not only your fate but the course of this war.',
          mood: 'sinister',
        },
        {
          speaker: 'narrator',
          text: 'The court waits. The silence has the quality of a held breath — the kind that precedes either a sigh of relief or a gasp of horror.',
        },
      ],
      choices: [
        {
          id: 'ch6_full_report_throne',
          text: 'Tell everything — Malachar\'s plan, the Harrowings, the coming darkness. Hold nothing back.',
          tooltip: 'Complete transparency with the Iron Throne',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 15 },
            { type: 'set_flag', flagId: 'ch6_throne_knows_all', value: true },
          ],
          targetScene: 'ch6_throneResponse',
        },
        {
          id: 'ch6_strategic_report',
          text: 'Report the military facts — Malachar\'s power, the Sanctum\'s destruction, the remaining Harrowing targets — but omit the vision of the coming darkness. One crisis at a time.',
          tooltip: 'Selective disclosure',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 10 },
            { type: 'set_flag', flagId: 'ch6_throne_partial_truth', value: true },
            { type: 'stat_change', stat: 'cunning', value: 1 },
          ],
          targetScene: 'ch6_throneResponse',
        },
        {
          id: 'ch6_demand_reinstatement',
          text: 'Before reporting anything, demand your knighthood be restored. You have earned it ten times over, and you will not grovel before a throne that discarded you.',
          tooltip: 'Assert your worth before cooperating',
          statCheck: {
            stat: 'charisma',
            difficulty: 8,
            successText: 'Queen Isolde\'s eyes narrow, then widen with something almost like respect. "You have spine, Vane. Very well. Captain Thorne — restore this man\'s rank. Now, report."',
            failureText: '"You dare make demands of the Iron Throne?" Isolde\'s voice is ice. "You will speak because I command it, not because I have paid for the privilege."',
            successScene: 'ch6_throneResponse',
            failureScene: 'ch6_throneResponse',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch6_demanded_reinstatement', value: true },
          ],
          targetScene: 'ch6_throneResponse',
        },
      ],
    },

    // ─── Scene: Throne Response ───────────────────────────────────
    {
      id: 'ch6_throneResponse',
      chapter: 6,
      title: 'The Iron Decision',
      location: 'Ironhold Fortress - Throne Room',
      artPrompt:
        'A queen standing before a war table, pointing at a map with decisive authority, commanders around her with varied expressions of concern and determination, oil painting style',
      description: [
        'Isolde listens to the entire report without interruption — a discipline that few in Valdoria possess. When Aldric finishes, the silence stretches until it becomes a sound of its own. Then the Queen rises from the Iron Throne and descends the dais steps, her boots ringing on stone.',
        'She walks to the war table, her black cloak trailing behind her, and stares at the carved map of Valdoria as though she can will the realm into submission through eye contact alone.',
      ],
      dialogue: [
        {
          speaker: 'queen_isolde',
          text: 'So. The Conclave was never neutral. The war was manufactured. My soldiers died — my people died — to feed a ritual designed by a man who considers mortality an inconvenience. I have governed through many crises, Vane, but I confess this one tests even my composure.',
          mood: 'angry',
        },
        {
          speaker: 'captain_thorne',
          text: 'Your Majesty, if the Harrowing targets are known, we can garrison the remaining villages. The Iron Throne can protect them by force where diplomacy has failed.',
          mood: 'neutral',
        },
        {
          speaker: 'queen_isolde',
          text: 'And stretch our forces thinner than they already are, while the Verdant Pact raids our supply lines and the Guild sells our secrets to whoever bids highest? No. We need allies. Or at least, we need enemies who are willing to stop being enemies long enough to survive.',
          mood: 'neutral',
        },
        {
          speaker: 'queen_isolde',
          text: 'Vane. You have proven yourself resourceful, if undisciplined. I am granting you the rank of Queen\'s Envoy — authority to negotiate on behalf of the Iron Throne. Go to the other factions. Build a coalition. And know that if you betray this trust, there is nowhere in any future, prophesied or otherwise, where my reach will not find you.',
          mood: 'sinister',
        },
      ],
      choices: [
        {
          id: 'ch6_accept_envoy',
          text: 'Accept the role of Queen\'s Envoy. The Iron Throne\'s authority will open doors that need opening.',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 15 },
            { type: 'set_flag', flagId: 'ch6_queens_envoy', value: true },
            { type: 'add_item', itemId: 'queens_envoy_seal' },
            { type: 'stat_change', stat: 'charisma', value: 1 },
          ],
          targetScene: 'ch6_nyxRevelation',
        },
        {
          id: 'ch6_conditional_acceptance',
          text: 'Accept, but on the condition that the Iron Throne ceases all aggression against the Verdant Pact immediately. A coalition requires good faith.',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 5 },
            { type: 'faction_change', factionId: 'verdantPact', value: 10 },
            { type: 'set_flag', flagId: 'ch6_conditional_envoy', value: true },
            { type: 'add_item', itemId: 'queens_envoy_seal' },
          ],
          targetScene: 'ch6_nyxRevelation',
        },
        {
          id: 'ch6_decline_envoy',
          text: 'Decline. You will not be the Iron Throne\'s leash-hound. You will build a coalition, but as an independent agent, beholden to no faction.',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: -15 },
            { type: 'set_flag', flagId: 'ch6_independent_agent', value: true },
            { type: 'stat_change', stat: 'cunning', value: 1 },
          ],
          targetScene: 'ch6_nyxRevelation',
        },
      ],
    },

    // ─── Scene: Pact Council ──────────────────────────────────────
    {
      id: 'ch6_pactCouncil',
      chapter: 6,
      title: 'The Roots Remember',
      location: 'The Thornwood - Elder Grove',
      artPrompt:
        'A council of druids and rangers in the heart of an ancient forest, sitting on massive root formations, a knight presenting testimony, bioluminescent mushrooms providing light, oil painting style',
      description: [
        'The Elder Grove is deeper in the Thornwood than any outsider has been permitted to enter. The trees here are so ancient that their trunks have fused into living walls, creating chambers of bark and leaf that breathe with the forest\'s slow pulse. Bioluminescent fungi provide a pale green light that makes everything look like a dream half-remembered.',
        'The Verdant Pact\'s full council sits in a circle on root formations worn smooth by centuries of use. Rowan presides, but here he is first among equals, not a lord — the Pact governs by consensus, and every voice carries weight.',
        'Brother Cedric tends a small fire at the center of the circle, brewing a tea of herbs that sharpens the mind and loosens the tongue. He offers Aldric a cup with a gentle warning: "Speak only truth here. The trees listen, and they remember lies."',
      ],
      dialogue: [
        {
          speaker: 'rowan_greenmantle',
          text: 'The Thornknight has told us what she witnessed at the bridge. Your Iron Throne friends burned two of our supply camps while you were in the Sanctum. And now you come to us with tales of prophecy and cosmic darkness. Forgive me if my enthusiasm is measured.',
          mood: 'angry',
        },
        {
          speaker: 'brother_cedric',
          text: 'Rowan. Listen to the man before you judge him. We have all been maneuvered. If Malachar\'s Harrowings are real, the ley lines themselves are in danger. And without ley lines, the Thornwood dies. Everything dies.',
          mood: 'hopeful',
        },
        {
          speaker: 'rowan_greenmantle',
          text: 'I have heard the trees singing differently for months. A dissonance in the deep roots, as though the earth itself is in pain. If this man has an explanation, I will listen. But I will not be manipulated again — not by the Conclave, not by the Throne, and not by a disgraced knight seeking redemption.',
          mood: 'neutral',
        },
      ],
      choices: [
        {
          id: 'ch6_appeal_to_nature',
          text: 'The ley lines feed the Thornwood. The Harrowings corrupt the ley lines. If the Verdant Pact will not act, they are choosing to let their sacred forest die.',
          tooltip: 'Appeal to what the Pact values most',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 15 },
            { type: 'set_flag', flagId: 'ch6_appealed_nature', value: true },
            { type: 'stat_change', stat: 'charisma', value: 1 },
          ],
          targetScene: 'ch6_pactDecision',
        },
        {
          id: 'ch6_offer_targets',
          text: 'Present the list of remaining Harrowing targets — four villages that can still be saved. The Pact can reach them faster than any army.',
          tooltip: 'Practical cooperation',
          conditions: [
            { type: 'has_item', itemId: 'harrowing_target_list', operator: 'true' },
          ],
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 20 },
            { type: 'set_flag', flagId: 'ch6_shared_targets_pact', value: true },
          ],
          targetScene: 'ch6_pactDecision',
        },
        {
          id: 'ch6_challenge_rowan',
          text: 'Enough suspicion. Challenge Rowan directly — ask what he would do differently if the positions were reversed.',
          consequences: [
            { type: 'set_flag', flagId: 'ch6_challenged_rowan', value: true },
          ],
          targetScene: 'ch6_pactDecision',
        },
      ],
    },

    // ─── Scene: Pact Decision ─────────────────────────────────────
    {
      id: 'ch6_pactDecision',
      chapter: 6,
      title: 'The Green Consensus',
      location: 'The Thornwood - Elder Grove',
      artPrompt:
        'A druid council voting by raising wooden staves, green light pulsing from the earth beneath them, a dramatic forest council scene, oil painting style',
      description: [
        'The council deliberates in the Pact\'s way — not through argument but through silence. Each elder closes their eyes and listens to the Thornwood itself, feeling the deep roots for the truth that words cannot convey. Minutes pass. The forest breathes. And one by one, the elders open their eyes.',
        'Rowan reads the consensus in their faces before anyone speaks.',
      ],
      dialogue: [
        {
          speaker: 'rowan_greenmantle',
          text: 'The grove has spoken. The trees confirm what the knight says — the ley lines are wounded, and the wounds are growing. If we do nothing, the Thornwood will die within a year. We will act.',
          mood: 'neutral',
        },
        {
          speaker: 'rowan_greenmantle',
          text: 'But we will not be the Iron Throne\'s auxiliaries. We fight for the land, not for any queen. And if this coalition you propose fails, we withdraw to protect the Thornwood with everything we have. Do you understand?',
          mood: 'angry',
        },
        {
          speaker: 'brother_cedric',
          text: 'Rowan... perhaps this is the moment we have prayed for. Not just alliance against a common enemy, but the beginning of real peace. The kind that grows from shared purpose rather than exhaustion.',
          mood: 'hopeful',
        },
      ],
      choices: [
        {
          id: 'ch6_accept_pact_terms',
          text: 'Accept Rowan\'s terms. The Verdant Pact fights for the land, not for the Throne. That is enough.',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 15 },
            { type: 'set_flag', flagId: 'ch6_pact_alliance', value: true },
            { type: 'add_companion', companionId: 'brother_cedric' },
          ],
          targetScene: 'ch6_nyxRevelation',
        },
        {
          id: 'ch6_push_for_more',
          text: 'The terms are not enough. The Pact must commit to working alongside the Iron Throne directly, not as a separate force.',
          statCheck: {
            stat: 'charisma',
            difficulty: 9,
            successText: 'Rowan\'s jaw tightens, but Cedric\'s hand on his arm steadies him. "Very well. We march together. But you had better be right about this, Vane."',
            failureText: '"You ask too much." Rowan\'s voice is ice and stone. "We will protect the villages. That is our offer. Take it or leave."',
            successScene: 'ch6_nyxRevelation',
            failureScene: 'ch6_nyxRevelation',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch6_pact_full_alliance', value: true },
          ],
          targetScene: 'ch6_nyxRevelation',
        },
      ],
    },

    // ─── Scene: Guild Meeting ─────────────────────────────────────
    {
      id: 'ch6_guildMeeting',
      chapter: 6,
      title: 'The Merchant\'s Calculus',
      location: 'Ashenmere - The Obsidian Exchange',
      artPrompt:
        'A grand underground trading hall with obsidian pillars, a merchant prince at the head of a long table, gold and documents everywhere, assassins standing in the shadows, oil painting style, opulent danger',
      description: [
        'The Obsidian Exchange is the Guild\'s true seat of power — not the petty safehouses scattered across Valdoria, but a vast underground trading hall beneath Ashenmere\'s merchant quarter, where information, favors, and occasionally lives change hands with the efficiency of a well-run market.',
        'Sylas Ashford has gathered his inner circle. These are not thugs or common thieves — they are bankers, spymasters, merchant captains, and the occasional retired assassin who now trades in futures rather than fatalities. They regard Aldric with the professional assessment of people who measure everyone\'s value to the nearest coin.',
        'Nyx stands behind Sylas, her expression suggesting she has been waiting for this meeting with uncharacteristic impatience.',
      ],
      dialogue: [
        {
          speaker: 'sylas_ashford',
          text: 'The Sanctum of Echoes has collapsed. The ley line nexus is disrupted. Malachar has gone to ground. And every faction in Valdoria is scrambling to understand what this means for their bottom line. Have I missed anything?',
          mood: 'neutral',
        },
        {
          speaker: 'sylas_ashford',
          text: 'Here is the Guild\'s position, plainly stated: chaos is profitable in the short term and catastrophic in the long term. The Harrowings, the faction war, the coming darkness your friend the seer babbles about — all of it is bad for business if it destroys the market entirely. We are willing to invest in stability. But we require returns.',
          mood: 'sinister',
        },
        {
          speaker: 'nyx',
          text: 'Sylas. Tell him what I found. Tell him or I will.',
          mood: 'angry',
        },
      ],
      choices: [
        {
          id: 'ch6_hear_nyx',
          text: 'Turn to Nyx. Whatever she has found is clearly more important than Sylas\'s negotiation.',
          consequences: [
            { type: 'set_flag', flagId: 'ch6_heard_nyx_early', value: true },
          ],
          targetScene: 'ch6_nyxRevelation',
        },
        {
          id: 'ch6_negotiate_first',
          text: 'Finish the negotiation with Sylas first. Understand the Guild\'s terms before introducing new variables.',
          consequences: [
            { type: 'faction_change', factionId: 'obsidianGuild', value: 10 },
            { type: 'set_flag', flagId: 'ch6_negotiated_guild', value: true },
          ],
          targetScene: 'ch6_guildTerms',
        },
        {
          id: 'ch6_play_them',
          text: 'Neither — reveal that you have already spoken with other factions. Make the Guild understand they are not the only option, and their price should reflect that.',
          tooltip: 'Use leverage against the Guild',
          statCheck: {
            stat: 'cunning',
            difficulty: 8,
            successText: 'Sylas\'s eyebrow rises. For a merchant prince, being outmaneuvered at the negotiation table is the highest form of compliment. "Well played, Vane. Very well — adjusted terms."',
            failureText: 'Sylas sees through the bluff immediately. "You overestimate your position, Vane. But I admire the attempt."',
            successScene: 'ch6_guildTerms',
            failureScene: 'ch6_guildTerms',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch6_leveraged_guild', value: true },
          ],
          targetScene: 'ch6_guildTerms',
        },
      ],
    },

    // ─── Scene: Guild Terms ───────────────────────────────────────
    {
      id: 'ch6_guildTerms',
      chapter: 6,
      title: 'The Price of Alliance',
      location: 'Ashenmere - The Obsidian Exchange',
      artPrompt:
        'A tense negotiation scene with a merchant prince and a knight across a table covered in contracts and gold coins, an assassin watching from the shadows, oil painting style',
      description: [
        'Sylas produces a contract — not a simple document but a bound leather folio thick with clauses, sub-clauses, and provisions that would make a royal clerk weep with envious admiration. The Guild does not shake hands. The Guild signs terms.',
      ],
      dialogue: [
        {
          speaker: 'sylas_ashford',
          text: 'The Obsidian Guild will provide intelligence on Malachar\'s movements, protection for the remaining Harrowing target villages through our agent network, and logistical support for whatever coalition you assemble. In return, we require three things.',
          mood: 'neutral',
        },
        {
          speaker: 'sylas_ashford',
          text: 'First: a seat at whatever governing council emerges after this crisis. The Guild has been excluded from legitimate power for too long. Second: amnesty for all Guild operations conducted during the faction war. Third: trade rights through the Thornwood — routes the Verdant Pact has denied us for decades.',
          mood: 'sinister',
        },
        {
          speaker: 'narrator',
          text: 'The terms are not unreasonable, which makes them dangerous. Sylas deals in prices that seem fair until you examine what you have actually sold.',
        },
      ],
      choices: [
        {
          id: 'ch6_accept_guild_terms',
          text: 'Accept the terms. The Guild\'s resources are needed, and their price is one that can be revisited after the crisis.',
          consequences: [
            { type: 'faction_change', factionId: 'obsidianGuild', value: 20 },
            { type: 'faction_change', factionId: 'verdantPact', value: -10 },
            { type: 'set_flag', flagId: 'ch6_guild_alliance', value: true },
            { type: 'add_item', itemId: 'guild_alliance_contract' },
          ],
          targetScene: 'ch6_nyxRevelation',
        },
        {
          id: 'ch6_counter_offer',
          text: 'Counter-offer: the governing seat and the amnesty, but the Thornwood trade routes must be negotiated with the Verdant Pact directly.',
          tooltip: 'Negotiate without betraying the Pact',
          statCheck: {
            stat: 'cunning',
            difficulty: 7,
            successText: 'Sylas considers, then nods slowly. "Acceptable. We will negotiate the routes ourselves. Your diplomatic instincts are improving, Vane."',
            failureText: '"The routes are non-negotiable. Without them, the logistical support is impossible. Choose."',
            successScene: 'ch6_nyxRevelation',
            failureScene: 'ch6_nyxRevelation',
          },
          consequences: [
            { type: 'faction_change', factionId: 'obsidianGuild', value: 10 },
            { type: 'set_flag', flagId: 'ch6_guild_modified_terms', value: true },
            { type: 'add_item', itemId: 'guild_alliance_contract' },
          ],
          targetScene: 'ch6_nyxRevelation',
        },
        {
          id: 'ch6_reject_guild_terms',
          text: 'Reject the terms entirely. The Guild\'s help is not worth legitimizing their shadow operations or selling out the Verdant Pact\'s sovereignty.',
          consequences: [
            { type: 'faction_change', factionId: 'obsidianGuild', value: -15 },
            { type: 'faction_change', factionId: 'verdantPact', value: 5 },
            { type: 'set_flag', flagId: 'ch6_rejected_guild', value: true },
          ],
          targetScene: 'ch6_nyxRevelation',
        },
      ],
    },

    // ─── Scene: Grand Summit ──────────────────────────────────────
    {
      id: 'ch6_grandSummit',
      chapter: 6,
      title: 'The Summit of Thorns',
      location: 'The Neutral Ground - Ashenmere Bridge',
      artPrompt:
        'Representatives from four factions meeting on a large stone bridge, each group in distinct colors and armor styles, tense and historic atmosphere, oil painting style, dramatic sky',
      description: [
        'The summit convenes on the Ashenmere Bridge — neutral ground by necessity, since no faction will enter another\'s stronghold. The irony is not lost on anyone that this same bridge was drenched in blood mere weeks ago.',
        'Queen Isolde arrives first, in black armor polished to a mirror sheen, flanked by Captain Thorne and a honor guard of twelve. Rowan Greenmantle comes next, emerging from the treeline with Brother Cedric and a company of rangers who refuse to leave the forest\'s edge. Sylas Ashford appears from within the Ashenmere gatehouse, impeccably dressed, Nyx his only visible companion — though everyone knows the Guild has agents in every shadow.',
        'No representative comes from the Ashen Conclave. Their seat remains empty, a reminder of the faction that started this crisis.',
      ],
      dialogue: [
        {
          speaker: 'queen_isolde',
          text: 'This is the first time representatives of all major factions have met on neutral ground since the signing of the Valdorian Compact, ninety years ago. I trust we can conduct ourselves with the civility that occasion deserves, if not the sincerity.',
          mood: 'neutral',
        },
        {
          speaker: 'rowan_greenmantle',
          text: 'Civility. From the woman whose army salted our fields at Greenhollow. I will speak plainly, as is my custom: the Pact is here because the alternative is extinction, not because we have forgiven anything.',
          mood: 'angry',
        },
        {
          speaker: 'sylas_ashford',
          text: 'And the Guild is here because dead customers generate no revenue. Let us skip the historical grievances and discuss the threat at hand. Vane — you called this summit. Justify it.',
          mood: 'neutral',
        },
      ],
      choices: [
        {
          id: 'ch6_present_evidence_summit',
          text: 'Present everything: the Harrowings, Malachar\'s Unraveling, the coming darkness. Let the factions decide together.',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 5 },
            { type: 'faction_change', factionId: 'verdantPact', value: 5 },
            { type: 'faction_change', factionId: 'obsidianGuild', value: 5 },
            { type: 'set_flag', flagId: 'ch6_summit_full_disclosure', value: true },
          ],
          targetScene: 'ch6_summitNegotiations',
        },
        {
          id: 'ch6_focus_immediate',
          text: 'Focus on the immediate threat: four villages at risk of Harrowing. Save the cosmic darkness for later — too much truth at once will paralyze them.',
          consequences: [
            { type: 'set_flag', flagId: 'ch6_summit_practical', value: true },
            { type: 'stat_change', stat: 'cunning', value: 1 },
          ],
          targetScene: 'ch6_summitNegotiations',
        },
        {
          id: 'ch6_challenge_summit',
          text: 'Turn the question back on them: each faction has blood on its hands. Before discussing the future, each must acknowledge their role in the current catastrophe.',
          tooltip: 'Force accountability before cooperation',
          statCheck: {
            stat: 'charisma',
            difficulty: 10,
            successText: 'The silence that follows your challenge is thunderous. Then, impossibly, Queen Isolde speaks first: "The Iron Throne acknowledges the burning of Greenhollow was... disproportionate." The dam breaks.',
            failureText: 'The leaders bristle. Rowan\'s hand goes to his knife. Isolde\'s eyes turn to ice. Sylas simply laughs. "Well. That went poorly."',
            successScene: 'ch6_summitNegotiations',
            failureScene: 'ch6_summitNegotiations',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch6_summit_accountability', value: true },
          ],
          targetScene: 'ch6_summitNegotiations',
        },
      ],
    },

    // ─── Scene: Summit Negotiations ───────────────────────────────
    {
      id: 'ch6_summitNegotiations',
      chapter: 6,
      title: 'The Terms of Survival',
      location: 'The Neutral Ground - Ashenmere Bridge',
      artPrompt:
        'Faction leaders leaning over a map on a stone bridge, pointing at locations, heated but productive discussion, the empty Conclave seat prominent, oil painting style',
      description: [
        'The negotiations stretch for hours, progressing from hostile posturing to grudging cooperation to something that almost resembles collaboration. Maps are spread on the bridge\'s stone railing. Territories are redrawn with chalk. Promises are made that no one fully trusts but everyone needs.',
        'Through it all, the empty Conclave seat sits like an accusation.',
      ],
      dialogue: [
        {
          speaker: 'captain_thorne',
          text: 'If we garrison the four remaining target villages jointly — Iron Throne soldiers, Pact rangers, Guild agents — we can protect them while sending a strike force to locate Malachar. The question is command structure.',
          mood: 'neutral',
        },
        {
          speaker: 'rowan_greenmantle',
          text: 'The Pact will not serve under Iron Throne officers. Our rangers answer to the Grove.',
          mood: 'angry',
        },
        {
          speaker: 'sylas_ashford',
          text: 'And Guild agents answer to the Guild. Perhaps the solution is obvious: the one person here who belongs to no faction commands the joint force. Vane.',
          mood: 'sinister',
        },
        {
          speaker: 'queen_isolde',
          text: 'The merchant makes an irritating amount of sense. Vane — you have worked with all of us. None of us trust each other. All of us, for reasons I cannot fathom, seem to trust you. Will you command this coalition?',
          mood: 'neutral',
        },
      ],
      choices: [
        {
          id: 'ch6_accept_command',
          text: 'Accept command of the coalition force. It is the burden you have been building toward since the investigation began.',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 10 },
            { type: 'faction_change', factionId: 'verdantPact', value: 10 },
            { type: 'faction_change', factionId: 'obsidianGuild', value: 10 },
            { type: 'set_flag', flagId: 'ch6_coalition_commander', value: true },
            { type: 'stat_change', stat: 'charisma', value: 2 },
            { type: 'add_item', itemId: 'coalition_command_seal' },
          ],
          targetScene: 'ch6_nyxRevelation',
        },
        {
          id: 'ch6_shared_command',
          text: 'Propose shared command — a council of four, one from each faction plus yourself as tiebreaker. Less efficient, more legitimate.',
          consequences: [
            { type: 'set_flag', flagId: 'ch6_shared_command', value: true },
            { type: 'stat_change', stat: 'cunning', value: 1 },
          ],
          targetScene: 'ch6_nyxRevelation',
        },
        {
          id: 'ch6_decline_command',
          text: 'Decline. You are an investigator, not a general. Nominate Captain Thorne instead — he has the military experience and the honor to hold a coalition together.',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 15 },
            { type: 'set_flag', flagId: 'ch6_thorne_commands', value: true },
          ],
          targetScene: 'ch6_nyxRevelation',
        },
      ],
    },

    // ─── Scene: Nyx's Revelation ──────────────────────────────────
    {
      id: 'ch6_nyxRevelation',
      chapter: 6,
      title: 'The Spy\'s Gift',
      location: 'Varies - A Private Moment',
      artPrompt:
        'A shadowy figure revealing a hidden document to a knight in a private alcove, moonlight through a narrow window, oil painting style, intimate conspiracy',
      description: [
        'Nyx finds Aldric alone. She has a talent for that — for appearing in the precise moment when privacy and vulnerability intersect. Tonight she carries no weapons visible, though with Nyx, visibility is never a reliable indicator.',
        'She produces a sealed leather case from inside her cloak and sets it on the table between them with the care of someone handling something explosive.',
      ],
      dialogue: [
        {
          speaker: 'nyx',
          text: 'I have been working this angle for six months, since before the Sanctum fell. Sylas does not know about this. No one does. I am giving it to you because you are the only person in Valdoria who might use it correctly instead of profitably.',
          mood: 'neutral',
        },
        {
          speaker: 'narrator',
          text: 'Inside the case: a collection of letters, written in three different hands, bearing the seals of the Iron Throne, the Verdant Pact, and the Obsidian Guild. Letters that were never meant to be found. Letters that reveal a truth so corrosive it could dissolve the alliance Aldric has spent weeks building.',
        },
        {
          speaker: 'nyx',
          text: 'Malachar did not act alone. He had agents in every faction. Not just informants — true believers. People who knew about the Harrowings and chose to let them happen. People who are still here. Still in power.',
          mood: 'sinister',
        },
        {
          speaker: 'nyx',
          text: 'One letter is from a member of Queen Isolde\'s inner council, providing Malachar with troop movements so the Harrowings could proceed unimpeded. One is from a Verdant Pact elder who agreed to look the other way while villages outside the Thornwood burned. And one — this one troubles me most — is from someone in the Guild\'s own leadership, facilitating the transfer of ritual components across faction lines.',
          mood: 'fearful',
        },
        {
          speaker: 'narrator',
          text: 'The letters are not signed with names, only with code designations. But Nyx has done her work. In the margin of each letter, she has penciled a name. Three names. Three traitors. Three pillars of the alliance Aldric is trying to build.',
        },
        {
          speaker: 'nyx',
          text: 'What you do with this information will define whether your coalition survives or tears itself apart. If you reveal the traitors publicly, every faction will turn inward, purging and paranoid. If you say nothing, the traitors remain in position to sabotage everything. If you deal with them quietly... well. That is what the Guild would do. But I am giving this to you, not to the Guild.',
          mood: 'neutral',
        },
      ],
      choices: [
        {
          id: 'ch6_reveal_publicly',
          text: 'Take the evidence to all faction leaders simultaneously. The coalition must be built on truth, even if truth is a weapon that cuts the wielder.',
          tooltip: 'Transparency at the cost of stability',
          consequences: [
            { type: 'set_flag', flagId: 'ch6_revealed_traitors', value: true },
            { type: 'faction_change', factionId: 'ironThrone', value: -10 },
            { type: 'faction_change', factionId: 'verdantPact', value: -10 },
            { type: 'faction_change', factionId: 'obsidianGuild', value: -10 },
            { type: 'stat_change', stat: 'charisma', value: 1 },
          ],
          targetScene: 'ch6_betrayalFallout',
        },
        {
          id: 'ch6_confront_privately',
          text: 'Confront each traitor individually and in private. Give them the chance to confess and turn against Malachar — or face exposure.',
          tooltip: 'Surgical precision — risk and reward',
          statCheck: {
            stat: 'cunning',
            difficulty: 8,
            successText: 'You approach each traitor separately. Two crumble under pressure and agree to cooperate. The third... the third runs.',
            failureText: 'The first traitor you approach smiles coldly and says, "I wondered when someone would figure it out." Then they reach for a weapon.',
            successScene: 'ch6_betrayalFallout',
            failureScene: 'ch6_traitorFight',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch6_confronted_privately', value: true },
          ],
          targetScene: 'ch6_betrayalFallout',
        },
        {
          id: 'ch6_keep_secret',
          text: 'Tell no one. Use the knowledge as leverage — knowing who the traitors are is more valuable than exposing them. Watch them, feed them misinformation, and turn Malachar\'s network against him.',
          tooltip: 'The pragmatist\'s choice',
          consequences: [
            { type: 'set_flag', flagId: 'ch6_kept_traitor_secret', value: true },
            { type: 'stat_change', stat: 'subtlety', value: 2 },
            { type: 'faction_change', factionId: 'obsidianGuild', value: 5 },
          ],
          targetScene: 'ch6_convergence',
        },
        {
          id: 'ch6_tell_nyx_handle',
          text: 'Ask Nyx to handle it — the Guild way. Quiet. Efficient. Permanent.',
          tooltip: 'Let the assassin do what assassins do',
          consequences: [
            { type: 'set_flag', flagId: 'ch6_nyx_handled_traitors', value: true },
            { type: 'faction_change', factionId: 'obsidianGuild', value: 15 },
            { type: 'faction_change', factionId: 'ironThrone', value: -5 },
            { type: 'faction_change', factionId: 'verdantPact', value: -5 },
          ],
          targetScene: 'ch6_convergence',
        },
      ],
    },

    // ─── Scene: Traitor Fight ─────────────────────────────────────
    {
      id: 'ch6_traitorFight',
      chapter: 6,
      title: 'The Mole Strikes',
      location: 'Varies - A Private Chamber',
      artPrompt:
        'A tense fight in a candlelit room between a knight and a well-dressed traitor wielding a hidden blade, documents scattered across the floor, oil painting style, sudden violence',
      description: [
        'The traitor moves with the practiced ease of someone who has been preparing for this moment. A concealed blade appears in their hand — Conclave steel, inscribed with binding runes that crackle with pale energy. They are not just a collaborator. They are a weapon Malachar left behind.',
        'The small chamber becomes a deadly arena. Furniture overturns. Candles scatter. And in the confined space, every advantage belongs to the one who strikes first.',
      ],
      dialogue: [
        {
          speaker: 'narrator',
          text: 'The traitor\'s eyes glow with the same pale fire as the Sanctum sentinels. Malachar\'s influence runs deeper than letters and loyalty — this person has been touched by the Ashenwild, their mind partially dissolved into the seer\'s network.',
        },
      ],
      combat: {
        type: 'minor',
        enemyName: 'Malachar\'s Sleeper Agent',
        enemyDescription:
          'A faction insider corrupted by Conclave magic, wielding a rune-inscribed blade. Their movements are unnaturally precise — guided by fragmentary prophecy that gives them split-second foresight.',
        primaryStat: 'strength',
        difficulty: 7,
        secondaryStat: 'subtlety',
        description:
          'The sleeper agent fights with prophetic foresight — they seem to know where your blade will be a heartbeat before you swing. But their foresight is fragmentary, not complete. Feints and misdirection can bypass it.',
        victoryConsequences: [
          { type: 'stat_change', stat: 'strength', value: 1 },
          { type: 'set_flag', flagId: 'ch6_defeated_sleeper', value: true },
          { type: 'add_item', itemId: 'conclave_binding_blade' },
        ],
        victoryScene: 'ch6_betrayalFallout',
        defeatConsequences: [
          { type: 'damage', value: 25 },
          { type: 'set_flag', flagId: 'ch6_sleeper_escaped', value: true },
        ],
        defeatScene: 'ch6_betrayalFallout',
      },
      choices: [
        {
          id: 'ch6_subdue_traitor',
          text: 'Fight to subdue, not kill. A living traitor can provide intelligence on Malachar\'s remaining network.',
          consequences: [
            { type: 'set_flag', flagId: 'ch6_captured_traitor', value: true },
          ],
          targetScene: 'ch6_betrayalFallout',
        },
        {
          id: 'ch6_kill_traitor',
          text: 'End this. A blade guided by prophetic magic is too dangerous to leave alive.',
          consequences: [
            { type: 'set_flag', flagId: 'ch6_killed_traitor', value: true },
          ],
          targetScene: 'ch6_betrayalFallout',
        },
      ],
    },

    // ─── Scene: Betrayal Fallout ──────────────────────────────────
    {
      id: 'ch6_betrayalFallout',
      chapter: 6,
      title: 'The Cracks in the Foundation',
      location: 'Varies',
      artPrompt:
        'Faction leaders in heated argument, accusations flying, guards reaching for weapons, a knight standing in the middle trying to maintain order, oil painting style, political crisis',
      description: [
        'The exposure of Malachar\'s agents within the factions sends shockwaves through every alliance, every tentative peace, every grudging handshake of the past weeks. Trust — already the rarest commodity in Valdoria — collapses.',
        'Queen Isolde demands a purge of her entire advisory council. Rowan accuses the Iron Throne of planting the evidence. Sylas vanishes for twelve hours, presumably eliminating his own liabilities, and returns with an expression that dares anyone to ask where he has been.',
        'The coalition that Aldric fought to build trembles on its foundations.',
      ],
      dialogue: [
        {
          speaker: 'queen_isolde',
          text: 'If my own advisors were Conclave agents, how can I trust any of you? How can any of us trust anyone? Malachar may be gone, but his poison remains.',
          mood: 'angry',
        },
        {
          speaker: 'rowan_greenmantle',
          text: 'Perhaps that is exactly what he wants. If his agents are exposed, we tear ourselves apart. If they remain hidden, they sabotage us. Either way, Malachar wins.',
          mood: 'neutral',
        },
        {
          speaker: 'elara_dawnwhisper',
          text: 'Rowan is right. This is a Conclave strategy — the Paradox of Revelation. Expose your own agents to create paranoia that is more destructive than the agents ever were. Malachar does not need moles if we are too busy suspecting each other to function.',
          mood: 'fearful',
        },
      ],
      choices: [
        {
          id: 'ch6_rally_coalition',
          text: 'This is exactly the reaction Malachar wants. Refuse to let it work. Rally the leaders with the reminder that the real enemy is still out there, and he is counting on this exact response.',
          tooltip: 'Lead through the crisis',
          statCheck: {
            stat: 'charisma',
            difficulty: 9,
            successText: 'Your words cut through the paranoia like sunlight through fog. Not perfectly — suspicion remains. But enough to hold the coalition together. Barely.',
            failureText: 'The words fall flat. Isolde storms out. Rowan follows. The coalition is not dead, but it is on life support.',
            successScene: 'ch6_convergence',
            failureScene: 'ch6_convergence',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch6_rallied_coalition', value: true },
            { type: 'stat_change', stat: 'charisma', value: 1 },
          ],
          targetScene: 'ch6_convergence',
        },
        {
          id: 'ch6_propose_test',
          text: 'Propose a test of loyalty — each faction commits forces to defend one of the Harrowing target villages. Actions speak louder than oaths.',
          consequences: [
            { type: 'set_flag', flagId: 'ch6_proposed_loyalty_test', value: true },
          ],
          targetScene: 'ch6_convergence',
        },
        {
          id: 'ch6_use_malachar_research',
          text: 'If you have Malachar\'s research, present it now — the coming darkness is bigger than faction politics, and the evidence may be enough to override paranoia.',
          tooltip: 'The cosmic threat as unifying force',
          conditions: [
            { type: 'has_item', itemId: 'malachar_research_notes', operator: 'true' },
          ],
          consequences: [
            { type: 'set_flag', flagId: 'ch6_showed_research', value: true },
            { type: 'faction_change', factionId: 'ironThrone', value: 5 },
            { type: 'faction_change', factionId: 'verdantPact', value: 5 },
            { type: 'faction_change', factionId: 'obsidianGuild', value: 5 },
          ],
          targetScene: 'ch6_convergence',
        },
      ],
      variants: [
        {
          condition: { type: 'flag_set', flagId: 'ch6_revealed_traitors', operator: 'true' },
          description: [
            'The public revelation has created exactly the chaos Aldric feared. Faction guards eye each other across the summit table. Hands rest on sword hilts. The air crackles with barely contained violence.',
            'But there is something else in the room too — a grim determination that comes from knowing the worst. The traitors are known. The infection is identified. What remains is whether the patient will survive the cure.',
          ],
        },
        {
          condition: { type: 'flag_set', flagId: 'ch6_captured_traitor', operator: 'true' },
          dialogue: [
            {
              speaker: 'narrator',
              text: 'The captured sleeper agent sits bound in a chair, their eyes still faintly glowing with Conclave magic. Under interrogation, they reveal fragments — not of Malachar\'s plan, but of his emotional state. "He is afraid," the agent whispers. "Not of you. Of being wrong. Of having sacrificed everything for a miscalculation." It is the most human thing Aldric has heard about the High Seer.',
            },
          ],
        },
      ],
    },

    // ─── Scene: Double Agent Opportunity ──────────────────────────
    {
      id: 'ch6_doubleAgent',
      chapter: 6,
      title: 'The Two-Faced Coin',
      location: 'Ashenmere - Neutral Ground',
      artPrompt:
        'A knight standing at a literal crossroads at night, four paths leading in different directions, each lit by a different colored light, oil painting style, metaphorical and atmospheric',
      description: [
        'Nyx finds Aldric at the crossroads again — literally this time, standing at the junction of four roads at midnight, each one leading to a different faction stronghold. She materializes from shadow with the casual grace of someone who has been following him for hours.',
        'Her proposition is simple in concept and devastating in implication.',
      ],
      dialogue: [
        {
          speaker: 'nyx',
          text: 'You have earned trust with every faction. More trust than any single person has held since before the faction war began. Do you understand what that means?',
          mood: 'neutral',
        },
        {
          speaker: 'nyx',
          text: 'It means you can be the bridge that holds the coalition together. Or it means you can be the knife that cuts the coalition to serve the faction you truly believe in. Or — and this is the option that interests me most — you can serve all of them simultaneously, feeding each exactly what they need to hear, playing the game at a level that would make Malachar himself pause.',
          mood: 'sinister',
        },
        {
          speaker: 'nyx',
          text: 'The Guild calls it being a Fulcrum — the still point around which the world turns. It is the most dangerous position in politics. It is also the most powerful. And right now, Vane, you are the only person in Valdoria who could occupy it.',
          mood: 'neutral',
        },
      ],
      choices: [
        {
          id: 'ch6_stay_loyal',
          text: 'Reject the double agent path. You have chosen your allegiance, and manipulating the factions would make you no different from Malachar.',
          tooltip: 'Honor over advantage',
          consequences: [
            { type: 'set_flag', flagId: 'ch6_stayed_loyal', value: true },
            { type: 'stat_change', stat: 'charisma', value: 2 },
          ],
          targetScene: 'ch6_convergence',
        },
        {
          id: 'ch6_become_fulcrum',
          text: 'Accept. The factions need to be managed, and the coming darkness does not care about anyone\'s political purity. Become the Fulcrum.',
          tooltip: 'Pragmatic manipulation for the greater good',
          consequences: [
            { type: 'set_flag', flagId: 'ch6_became_fulcrum', value: true },
            { type: 'stat_change', stat: 'subtlety', value: 2 },
            { type: 'stat_change', stat: 'cunning', value: 1 },
            { type: 'faction_change', factionId: 'obsidianGuild', value: 10 },
          ],
          targetScene: 'ch6_convergence',
        },
        {
          id: 'ch6_switch_faction',
          text: 'Use this moment to formally switch your primary allegiance. The faction you have been working with is not the one you believe in — and the coming crisis demands authenticity.',
          tooltip: 'Change faction allegiance',
          consequences: [
            { type: 'set_flag', flagId: 'ch6_switched_faction', value: true },
          ],
          targetScene: 'ch6_factionSwitch',
        },
      ],
    },

    // ─── Scene: Faction Switch ────────────────────────────────────
    {
      id: 'ch6_factionSwitch',
      chapter: 6,
      title: 'New Colors',
      location: 'Varies',
      artPrompt:
        'A knight removing one faction\'s tabard and putting on another\'s, standing between two worlds, oil painting style, symbolic transformation',
      description: [
        'Allegiance in Valdoria is not abstract. It is worn, spoken, tattooed, scarred into flesh and woven into the fabric of daily life. To change faction is to change identity — to declare that everything you were is less important than what you choose to become.',
        'Aldric stands at the threshold of that transformation, weighing what he owes against what he believes.',
      ],
      dialogue: [
        {
          speaker: 'narrator',
          text: 'The choice reverberates through every alliance, every promise, every thread of trust he has woven since the investigation began. Some threads will hold. Others will snap. The question is which ones he can afford to lose.',
        },
      ],
      choices: [
        {
          id: 'ch6_join_ironThrone',
          text: 'Pledge to the Iron Throne. Order and military discipline are what Valdoria needs to survive the coming storm.',
          consequences: [
            { type: 'faction_change', factionId: 'ironThrone', value: 30 },
            { type: 'faction_change', factionId: 'verdantPact', value: -15 },
            { type: 'faction_change', factionId: 'obsidianGuild', value: -10 },
            { type: 'set_flag', flagId: 'ch6_joined_throne', value: true },
          ],
          targetScene: 'ch6_convergence',
        },
        {
          id: 'ch6_join_verdantPact',
          text: 'Pledge to the Verdant Pact. The land itself is what matters — thrones and guilds will crumble, but if the earth endures, so will its people.',
          consequences: [
            { type: 'faction_change', factionId: 'verdantPact', value: 30 },
            { type: 'faction_change', factionId: 'ironThrone', value: -15 },
            { type: 'faction_change', factionId: 'obsidianGuild', value: -10 },
            { type: 'set_flag', flagId: 'ch6_joined_pact', value: true },
          ],
          targetScene: 'ch6_convergence',
        },
        {
          id: 'ch6_join_obsidianGuild',
          text: 'Pledge to the Obsidian Guild. In the end, information and adaptability will defeat prophecy where blunt force and idealism cannot.',
          consequences: [
            { type: 'faction_change', factionId: 'obsidianGuild', value: 30 },
            { type: 'faction_change', factionId: 'ironThrone', value: -15 },
            { type: 'faction_change', factionId: 'verdantPact', value: -10 },
            { type: 'set_flag', flagId: 'ch6_joined_guild', value: true },
          ],
          targetScene: 'ch6_convergence',
        },
        {
          id: 'ch6_join_ashenConclave',
          text: 'Seek out the Ashen Conclave. Malachar may be a monster, but his knowledge of the coming darkness is the only weapon that might actually work. Find him. Join him. Change him from within.',
          tooltip: 'The most dangerous and unpredictable choice',
          consequences: [
            { type: 'faction_change', factionId: 'ashenConclave', value: 30 },
            { type: 'faction_change', factionId: 'ironThrone', value: -20 },
            { type: 'faction_change', factionId: 'verdantPact', value: -20 },
            { type: 'faction_change', factionId: 'obsidianGuild', value: -15 },
            { type: 'set_flag', flagId: 'ch6_joined_conclave', value: true },
          ],
          targetScene: 'ch6_convergence',
        },
      ],
    },

    // ─── Scene: Convergence ───────────────────────────────────────
    {
      id: 'ch6_convergence',
      chapter: 6,
      title: 'All Roads Lead Here',
      location: 'Ashenmere - The Crossroads',
      artPrompt:
        'A dramatic gathering of diverse characters at a moonlit crossroads, four faction banners hanging limply in still air, a sense of destiny and determination, oil painting style, epic and somber',
      description: [
        'The paths converge. Whatever choices Aldric has made — whatever alliances forged, trusts broken, loyalties sworn — they all lead here, to the crossroads outside Ashenmere under a sky of impossible stars that should not be visible this far south. The Ashenwild bleeds through. The barrier thins.',
        'Word arrives from three directions simultaneously, carried by exhausted riders and silent Guild messengers and a raven with silver-tipped feathers. The news is the same from all sources, confirming what Aldric has dreaded since the Sanctum: Malachar has found new nexus points for the remaining Harrowings, and the ninth ritual is already underway.',
        'Four villages remain on the target list. Four convergences needed to complete the Unraveling. And the coalition — whatever shape it has taken, however fractured or unified — must now act or accept that the world will be remade in the image of one man\'s terrible certainty.',
      ],
      dialogue: [
        {
          speaker: 'elara_dawnwhisper',
          text: 'I can feel it — the ley lines screaming. Malachar has relocated to a mobile ritual. He is not in one place anymore. He is everywhere the ley lines touch, which is everywhere. We cannot strike at him directly. We can only protect the targets.',
          mood: 'desperate',
        },
        {
          speaker: 'narrator',
          text: 'Captain Thorne arrives at the crossroads with a company of Iron Throne cavalry. Rowan emerges from the treeline with his best rangers. Nyx steps from shadow with a handful of Guild operatives. Brother Cedric follows, carrying medical supplies and quiet faith.',
        },
        {
          speaker: 'narrator',
          text: 'They gather around Aldric — not as subordinates, not as allies, but as something rarer. People who have chosen to fight for a future they cannot yet see, led by a man whose only qualification is that he never stopped asking questions and never stopped caring about the answers.',
        },
        {
          speaker: 'captain_thorne',
          text: 'Four targets. Not enough forces to protect all of them adequately. Whatever we do, we will have to make choices about who lives and who we cannot save. I have made such choices before. They do not get easier.',
          mood: 'sad',
        },
        {
          speaker: 'rowan_greenmantle',
          text: 'Then we had better make sure our choices count. Vane — what is the plan?',
          mood: 'neutral',
        },
      ],
      choices: [
        {
          id: 'ch6_divide_forces',
          text: 'Divide the coalition — send a force to each village. Spread thin but cover all targets. No village left undefended.',
          tooltip: 'Maximum coverage, minimum strength at each point',
          consequences: [
            { type: 'set_flag', flagId: 'ch6_divided_forces', value: true },
            { type: 'stat_change', stat: 'cunning', value: 1 },
          ],
          targetScene: 'ch6_finalPreparation',
        },
        {
          id: 'ch6_concentrate_forces',
          text: 'Concentrate forces on the two most vulnerable villages. Accept that the others may fall, but ensure that at least two are saved beyond doubt.',
          tooltip: 'Pragmatic triage',
          consequences: [
            { type: 'set_flag', flagId: 'ch6_concentrated_forces', value: true },
          ],
          targetScene: 'ch6_finalPreparation',
        },
        {
          id: 'ch6_bait_trap',
          text: 'Set a trap. Evacuate the villages in secret and use one of them as bait — fill it with soldiers disguised as villagers and wait for Malachar\'s agents to come.',
          tooltip: 'Offensive defense',
          statCheck: {
            stat: 'cunning',
            difficulty: 9,
            successText: 'The plan is brilliant in its simplicity. Empty villages, hidden armies, and a trap that even prophecy might not anticipate — because who expects the prey to become the hunter?',
            failureText: 'The logistics prove nearly impossible. Evacuating four villages in secret requires more time and coordination than the coalition possesses.',
            successScene: 'ch6_finalPreparation',
            failureScene: 'ch6_finalPreparation',
          },
          consequences: [
            { type: 'set_flag', flagId: 'ch6_set_trap', value: true },
            { type: 'stat_change', stat: 'cunning', value: 1 },
          ],
          targetScene: 'ch6_finalPreparation',
        },
        {
          id: 'ch6_confront_malachar_directly',
          text: 'Forget the villages. Strike at Malachar himself. Elara can trace the ley lines to his position — a surgical strike at the heart of the Unraveling.',
          tooltip: 'High risk, high reward',
          consequences: [
            { type: 'set_flag', flagId: 'ch6_hunts_malachar', value: true },
            { type: 'stat_change', stat: 'strength', value: 1 },
          ],
          targetScene: 'ch6_finalPreparation',
        },
      ],
      variants: [
        {
          condition: { type: 'flag_set', flagId: 'ch6_became_fulcrum', operator: 'true' },
          dialogue: [
            {
              speaker: 'nyx',
              text: 'The Fulcrum holds. I have been feeding each faction slightly different versions of the plan — not lies, but emphasis. The Throne believes this is a military operation. The Pact believes it is a defense of the land. The Guild believes it is an investment. You have given each of them a reason to fight that speaks to their nature. Whether that is leadership or manipulation depends entirely on whether it works.',
              mood: 'neutral',
            },
          ],
        },
        {
          condition: { type: 'flag_set', flagId: 'ch6_joined_conclave', operator: 'true' },
          description: [
            'Aldric stands apart from the coalition he helped build, wearing the grey robes of the Ashen Conclave over his armor. The other faction members regard him with a mixture of confusion and betrayal. But he carries knowledge now — Malachar\'s knowledge, the Conclave\'s understanding of the ley lines — that none of them possess.',
            'It is the loneliest position in Valdoria. But it may also be the most necessary.',
          ],
        },
      ],
    },

    // ─── Scene: Final Preparation ─────────────────────────────────
    {
      id: 'ch6_finalPreparation',
      chapter: 6,
      title: 'Before the Dawn',
      location: 'Ashenmere - Coalition Camp',
      artPrompt:
        'A coalition war camp at dawn with soldiers from different factions preparing for battle, sharpening weapons, saying prayers, a knight walking among them with purpose, oil painting style, quiet intensity before battle',
      description: [
        'The night before the coalition moves is the longest of Aldric\'s life. He walks through the camp — past Iron Throne soldiers checking armor straps, past Verdant Pact rangers fletching arrows with prayers woven into the feathers, past Guild agents memorizing maps and contingency plans. Past Brother Cedric, who sits by a fire, bandages at the ready, humming a hymn for those who will need healing and those who will be beyond it.',
        'Each person he passes carries the weight of the same question: will this work? There is no prophecy to answer them. Malachar has seen a thousand futures, but the coalition is fighting for one that he never considered possible — a future built not on one man\'s omniscience, but on the stubborn, imperfect, gloriously unpredictable will of people who chose to trust each other despite every reason not to.',
        'Dawn breaks over Valdoria. The stars of the Ashenwild fade, but they do not disappear entirely — pale ghosts of impossible constellations lingering at the edge of perception, a reminder that the barrier between worlds grows thinner with every hour.',
      ],
      dialogue: [
        {
          speaker: 'elara_dawnwhisper',
          text: 'Aldric. Whatever happens tomorrow — whatever I was before, puppet or pilgrim, tool or traitor — what I am now is here. With you. By choice. And that choice is mine, regardless of who may have foreseen it.',
          mood: 'hopeful',
        },
        {
          speaker: 'captain_thorne',
          text: 'I have served the Iron Throne for thirty years. In all that time, I never imagined I would ride into battle beside druids and assassins. But honor is not about choosing easy companions. It is about choosing the right fight. This is the right fight.',
          mood: 'neutral',
        },
        {
          speaker: 'nyx',
          text: 'I will be where I always am. In the shadows, where the real work happens. If things go wrong — and they will, because things always go wrong — look for me. I will be there.',
          mood: 'neutral',
        },
        {
          speaker: 'narrator',
          text: 'The coalition rides out at dawn. Behind them, the crossroads of Ashenmere stands empty, its four roads stretching toward four horizons. Ahead, the remaining villages wait, the ley lines pulse with stolen energy, and somewhere in the vast and terrible architecture of possibility, High Seer Malachar watches the one future he did not predict — the future where people too stubborn to be managed decided to save themselves.',
        },
      ],
      choices: [
        {
          id: 'ch6_ride_to_war',
          text: 'Ride out with the coalition. Whatever comes next, you will face it together.',
          consequences: [
            { type: 'set_flag', flagId: 'ch6_chapter_complete', value: true },
            { type: 'heal', value: 20 },
          ],
          targetScene: 'ch7_openingBattle',
        },
        {
          id: 'ch6_one_last_prayer',
          text: 'Pause for one last moment. Not prayer — Aldric has never been the praying sort. But acknowledgment. Of the dead, the lost, the burned villages, the broken oaths. For them, ride forward.',
          consequences: [
            { type: 'set_flag', flagId: 'ch6_chapter_complete', value: true },
            { type: 'set_flag', flagId: 'ch6_remembered_dead', value: true },
            { type: 'heal', value: 20 },
            { type: 'stat_change', stat: 'charisma', value: 1 },
          ],
          targetScene: 'ch7_openingBattle',
        },
      ],
    },
  ],
};
