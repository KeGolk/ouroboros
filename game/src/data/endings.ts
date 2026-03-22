import type { Ending } from './story-types';

/**
 * ═══════════════════════════════════════════════════════════════════
 *  THE SIX ENDINGS OF AETHERMOOR
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Every path through the shattered realm converges on one of six
 *  possible futures. None are wholly triumphant. None are wholly
 *  damned. The player's choices — who they championed, who they
 *  betrayed, and what they were willing to sacrifice — determine
 *  which dawn breaks over the Obsidian Throne.
 *
 * ═══════════════════════════════════════════════════════════════════
 */

export const endings: Ending[] = [
  // ──────────────────────────────────────────────
  //  1. IRON DOMINION — The Throne Endures
  // ──────────────────────────────────────────────
  {
    id: 'ending_iron_dominion',
    title: 'Iron Dominion',
    subtitle: 'The Throne Endures, and the Realm Kneels',
    primaryFaction: 'ironThrone',
    conditions: [
      {
        type: 'faction_reputation',
        factionId: 'ironThrone',
        operator: 'gte',
        value: 60,
      },
      {
        type: 'flag_set',
        flagId: 'supported_isolde_coronation',
        operator: 'true',
      },
      {
        type: 'choice_made',
        choiceId: 'ch5_pledge_to_throne',
        operator: 'true',
      },
    ],
    narration: [
      'The bells of Ironhold Citadel toll for three days and three nights. Queen Isolde '
        + 'Blackthorn ascends the steps of the Obsidian Throne in full regalia — black iron '
        + 'crown fused with the ancient circlet of the Sundering Kings. Her gaze sweeps the '
        + 'great hall where every lord, merchant prince, and village elder kneels in enforced '
        + 'supplication. Aldric Vane stands at her right hand, the pardoned knight remade into '
        + 'the Queen\'s Bulwark, the sword behind her law.',

      'Within a fortnight, the Verdant Pact\'s guerrilla camps are dismantled. Rowan '
        + 'Greenmantle is offered a choice: the headsman\'s block or a life of comfortable '
        + 'exile in a tower overlooking the sea he will never sail. The Ashen Conclave\'s '
        + 'library-temples are placed under Crown audit — their knowledge no longer hoarded '
        + 'but catalogued, taxed, and distributed at the Throne\'s discretion. The Obsidian '
        + 'Guild\'s accounts are frozen until new trade charters are signed in the Queen\'s '
        + 'name alone.',

      'Peace settles over Aethermoor like a funeral shroud. The roads are safe. The granaries '
        + 'are full. The gallows are busy. Isolde rules with the cold precision of a surgeon '
        + 'cutting away infection — every dissenter a tumor, every rebel a fever to be broken. '
        + 'Aldric tells himself this is order, this is duty, this is what the realm needed. '
        + 'Some nights, walking the torchlit corridors of the citadel, he almost believes it.',

      'Years pass. The kingdom prospers in the way a well-run prison prospers: efficiently, '
        + 'quietly, without joy. Children grow up knowing the words to the Queen\'s Anthem '
        + 'before they learn their mothers\' lullabies. The old songs of the Greenwood are '
        + 'forbidden. The Conclave\'s prophecies are state property. And in the deepest vaults '
        + 'of Ironhold, where only Aldric and the Queen may tread, there is a room full of '
        + 'letters — confiscated correspondence from citizens who dared to dream aloud.',

      'Aldric Vane, once a knight who fought for justice, now guards a throne built on '
        + 'silence. He has become the very thing he once despised: an instrument of control '
        + 'wielded by a monarch who mistakes obedience for loyalty. But the realm endures. '
        + 'The realm always endures. And perhaps, he thinks, that is enough. It has to be enough.',
    ],
    epilogues: [
      {
        title: 'The Fate of the Crown',
        text:
          'Queen Isolde\'s reign lasts forty-one years — the longest unbroken rule since '
          + 'the Sundering. She never marries, never names an heir, and when she finally dies '
          + 'in her sleep at the age of seventy-three, the succession crisis she spent her life '
          + 'preventing erupts within hours of her last breath. The iron crown passes through '
          + 'six hands in a single bloody year. Aldric, grey-haired and weary, watches it all '
          + 'from a window and wonders if any of it mattered.',
      },
      {
        title: 'The Common Folk',
        text:
          'For a generation, the smallfolk know safety — and nothing else. Taxes are fair '
          + 'but unyielding. Justice is swift but deaf. The taverns are quiet, the festivals '
          + 'subdued, and the old stories told only in whispers. When Isolde dies and the wars '
          + 'return, the people discover they have forgotten how to fight, how to organize, '
          + 'how to govern themselves. They traded their teeth for bread, and now the bread is gone.',
      },
      {
        title: 'The Fallen Knight',
        text:
          'Aldric Vane is remembered differently depending on who tells the story. To the '
          + 'Crown loyalists, he is the Faithful Shield — the knight who chose duty over '
          + 'sentiment. To the children of the rebellion, he is the Betrayer — the man who '
          + 'could have changed everything and instead chose comfort. In his own journals, '
          + 'discovered decades after his death, he calls himself neither. He calls himself tired.',
      },
      {
        title: 'The Realm Itself',
        text:
          'Aethermoor under the Iron Dominion becomes a case study in the cost of stability. '
          + 'Roads, bridges, aqueducts — infrastructure flourishes. Art, music, free thought — '
          + 'these wither on the vine. The kingdom is a machine, efficient and soulless, and '
          + 'when it finally breaks, it shatters into pieces too small to reassemble.',
      },
    ],
    artPrompt:
      'A dark throne room lit by crimson torchlight. A woman in black iron armor sits on an '
      + 'obsidian throne, one hand resting on a crowned skull. A knight stands beside her, '
      + 'head bowed, sword planted point-down. Red banners hang from vaulted stone ceilings. '
      + 'Oil painting style, dark palette of blacks, deep reds, and steel grey. Oppressive '
      + 'grandeur, Game of Thrones aesthetic.',
    unlocks: [
      'ng_plus_iron_commander_class',
      'ng_plus_queens_blade_weapon',
      'ng_plus_authoritarian_dialogue_tree',
    ],
  },

  // ──────────────────────────────────────────────
  //  2. ARCANE ASCENSION — The Prophecy Fulfilled
  // ──────────────────────────────────────────────
  {
    id: 'ending_arcane_ascension',
    title: 'Arcane Ascension',
    subtitle: 'The Aether Remembers, and the Vessel Awakens',
    primaryFaction: 'ashenConclave',
    conditions: [
      {
        type: 'faction_reputation',
        factionId: 'ashenConclave',
        operator: 'gte',
        value: 60,
      },
      {
        type: 'flag_set',
        flagId: 'accepted_malachars_ritual',
        operator: 'true',
      },
      {
        type: 'has_item',
        itemId: 'aether_shard_complete',
        operator: 'true',
      },
    ],
    narration: [
      'The ritual chamber beneath the Library of Echoes has not been opened in four '
        + 'centuries. When Aldric descends the spiral stair, guided by the flickering witch-light '
        + 'of High Seer Malachar\'s staff, the air itself tastes of copper and ozone. Glyphs '
        + 'carved into the basalt walls pulse with a heartbeat older than the mountain. This is '
        + 'where the Sundering began. This is where it will end — or begin again.',

      'Malachar speaks the words of the Unbinding, and the Aether Shard in Aldric\'s hands '
        + 'detonates into light. Not the warm light of the sun but the cold, absolute radiance '
        + 'of pure knowledge — every truth the world has ever hidden, every secret the stones '
        + 'have swallowed, every forgotten name of every forgotten god. It pours into Aldric '
        + 'like a river into a cup, and the cup does not break. The cup expands. The cup becomes '
        + 'the river.',

      'When Aldric opens his eyes — if they can still be called eyes — the world is transparent. '
        + 'He sees the ley lines beneath the soil, the threads of causality connecting every '
        + 'living thing, the fracture points where reality is thin and the old powers bleed '
        + 'through. He sees Malachar\'s true face: not a prophet but a gardener, patiently '
        + 'cultivating vessels across millennia until one finally held. Aldric is not the first. '
        + 'He is merely the first to survive.',

      'The transformation ripples outward. Magic, once the jealous province of scholars and '
        + 'hedge-witches, saturates the realm like rain into parched earth. Crops grow in hours. '
        + 'Wounds close at a touch. The dead whisper to the living, and the living whisper back. '
        + 'It is beautiful and terrible — a world where every peasant can conjure fire, where '
        + 'every grudge can become a curse, where privacy is a memory and thought itself is naked.',

      'Aldric Vane — the Ascended, the Vessel, the Aether-Crowned — sits in the Oracle\'s '
        + 'Spire and watches over a realm that no longer needs kings or queens. It needs '
        + 'something worse. It needs a god. And gods, as Malachar knew, do not get to choose '
        + 'what they become.',
    ],
    epilogues: [
      {
        title: 'The Fate of the Crown',
        text:
          'The Obsidian Throne cracks down the middle on the night of the Ascension, as if '
          + 'the stone itself rejected the old order. Queen Isolde, stripped of her armies by '
          + 'soldiers who can now feel the ley lines singing, retreats to a farmhouse in the '
          + 'Crownlands and lives out her days in stunned, furious silence. She never bows. '
          + 'She never forgives. She dies clutching a sword she can no longer lift.',
      },
      {
        title: 'The Common Folk',
        text:
          'For a single, shining generation, Aethermoor is a paradise. Famine ends. Disease '
          + 'retreats. But magic without wisdom is a blade without a hilt. Feuds that once ended '
          + 'in fistfights now end in firestorms. Children who cannot control their gifts '
          + 'accidentally unmake the things they love. The Conclave scrambles to build schools '
          + 'fast enough to contain the chaos, but knowledge, once freed, does not consent to '
          + 'be leashed again.',
      },
      {
        title: 'The Vessel\'s Solitude',
        text:
          'Aldric remembers what it was like to be human the way one remembers a dream upon '
          + 'waking — with diminishing clarity and increasing nostalgia. He can feel every '
          + 'heartbeat in the realm, every prayer, every curse. He answers none of them. To '
          + 'intervene is to choose, and to choose is to rule, and he swore he would never '
          + 'become a tyrant. So instead he becomes something worse: an absent god, watching '
          + 'his children burn while his hands remain folded.',
      },
      {
        title: 'The Price of Enlightenment',
        text:
          'Malachar vanishes the morning after the ritual, his work complete. Centuries later, '
          + 'scholars will debate whether he was a savior or the most patient monster in history. '
          + 'The Aether flows freely, but it flows through a world that was never built to '
          + 'hold it. Cracks appear — in the sky, in the earth, in the fabric of time itself. '
          + 'The Sundering, it turns out, was not a catastrophe. It was a dam. And Malachar '
          + 'helped Aldric tear it down.',
      },
    ],
    artPrompt:
      'A figure suspended in mid-air above a ritual circle, body wreathed in crackling blue-white '
      + 'energy. Ancient glyphs spiral around them like a galaxy. Below, robed scholars kneel in '
      + 'a vast underground chamber carved from dark stone. Beams of arcane light pierce upward '
      + 'through the mountain. Ethereal, cosmic horror meets dark fantasy. Deep purples, electric '
      + 'blues, and blinding white highlights against obsidian darkness.',
    unlocks: [
      'ng_plus_aether_touched_class',
      'ng_plus_shard_of_ascension_relic',
      'ng_plus_arcane_dialogue_tree',
    ],
  },

  // ──────────────────────────────────────────────
  //  3. THE PEOPLE'S DAWN — The Old Order Falls
  // ──────────────────────────────────────────────
  {
    id: 'ending_peoples_dawn',
    title: 'The People\'s Dawn',
    subtitle: 'No Crown, No Chain, No Master',
    primaryFaction: 'verdantPact',
    conditions: [
      {
        type: 'faction_reputation',
        factionId: 'verdantPact',
        operator: 'gte',
        value: 60,
      },
      {
        type: 'flag_set',
        flagId: 'led_greenwood_uprising',
        operator: 'true',
      },
      {
        type: 'choice_made',
        choiceId: 'ch5_stand_with_rowan',
        operator: 'true',
      },
    ],
    narration: [
      'The Obsidian Throne does not fall to a siege. It falls to a song. Ten thousand '
        + 'voices — farmers, woodcutters, fishwives, stable hands — singing the Greenmother\'s '
        + 'Hymn as they march barefoot through the gates of Ironhold Citadel. The garrison '
        + 'stands ready, swords drawn, arrows nocked. But the soldiers are sons of farmers too, '
        + 'and their hands shake, and when Rowan Greenmantle walks to the front of the column '
        + 'with nothing but an oak staff and an open hand, the first sword clatters to the cobblestones.',

      'Aldric Vane is the one who opens the throne room doors. Not with a battering ram but '
        + 'with the key that Queen Isolde entrusted to him — a final betrayal that tastes like '
        + 'liberation. Inside, the Queen stands alone, crown in hand, and for a moment the two '
        + 'of them are the only people in the world. She does not beg. She does not curse. She '
        + 'sets the iron crown on the seat of the throne and walks past him without a word. He '
        + 'never sees her again.',

      'The Council of Roots convenes within the week — a chaotic, beautiful, infuriating '
        + 'assembly of village elders, guild representatives, druidic circle-speakers, and '
        + 'common folk chosen by lot. They argue for fourteen straight hours about the design '
        + 'of the council chamber before anyone raises the question of governance. Rowan chairs '
        + 'the proceedings with the patience of a man who has ploughed stony ground his entire '
        + 'life. Progress is glacial. But it is real.',

      'The first harvest under the new order is a disaster — not from blight but from '
        + 'disorganization. Without the Throne\'s tax-collectors, there is no centralized '
        + 'granary. Without the Guild\'s trade routes, surplus rots in barns while distant '
        + 'villages starve. The Council scrambles, improvises, fails, and tries again. Aldric, '
        + 'now a simple citizen with no title and no sword, volunteers to help coordinate '
        + 'supply runs between the Greenwood settlements. It is humble work. It is honest work. '
        + 'For the first time in years, he sleeps without dreaming of blood.',

      'The People\'s Dawn is not a triumph. It is a beginning — messy, fragile, and utterly '
        + 'human. There are no heroes on thrones, no prophecies fulfilled, no grand gestures '
        + 'that solve everything. There is only the slow, stubborn work of building something '
        + 'better from the wreckage of something worse. And in the Greenwood, where the ancient '
        + 'oaks still bear the scars of Throne axes, new saplings push through the ash.',
    ],
    epilogues: [
      {
        title: 'The Fate of the Crown',
        text:
          'The iron crown of Aethermoor is melted down and reforged into a bell that hangs '
          + 'in the Council of Roots\' meeting hall. It is rung once at the start of every '
          + 'session — a reminder that power, like metal, can be reshaped. The Obsidian Throne '
          + 'itself is left in the empty citadel, gathering dust. Some say it should be '
          + 'destroyed. Others say it should remain, a monument to what was. The Council votes '
          + 'to table the discussion. They have more pressing matters.',
      },
      {
        title: 'The Common Folk',
        text:
          'Freedom is harder than anyone expected. The first five years are lean, chaotic, '
          + 'and occasionally violent. Disputes that were once settled by royal decree now '
          + 'require weeks of mediation. But something changes in the eyes of the common people '
          + '— a spark that was never there under the crown. They argue, they stumble, they '
          + 'fail spectacularly. But they do it themselves, and there is a fierce, stubborn '
          + 'pride in that. The children born after the Dawn do not know what it means to kneel.',
      },
      {
        title: 'The Fallen Knight',
        text:
          'Aldric Vane refuses every title, every honor, every attempt to make him a symbol. '
          + 'He settles in a cottage on the edge of the Greenwood and takes up carpentry — '
          + 'building chairs, tables, doors. Simple things for simple people. He is, for the '
          + 'first time in his life, unremarkable. Visitors occasionally seek him out, hoping '
          + 'for wisdom or war stories. He offers them tea and asks about their harvest. When '
          + 'he dies, quietly, in his sleep, the village mourns him as a good neighbor. His '
          + 'gravestone reads: "He built things."',
      },
    ],
    artPrompt:
      'A vast crowd of medieval peasants and common folk streaming through the open gates of '
      + 'a massive stone fortress at dawn. Golden morning light bathes the scene. A man with '
      + 'an oak staff stands at the front, hand raised in peace. Green banners with leaf motifs '
      + 'flutter in the wind. Painterly, romantic but grounded — Delacroix meets Tolkien. '
      + 'Warm golds, earthy greens, and dawn pinks against grey stone.',
    unlocks: [
      'ng_plus_peoples_champion_class',
      'ng_plus_staff_of_the_greenmother_weapon',
      'ng_plus_populist_dialogue_tree',
    ],
  },

  // ──────────────────────────────────────────────
  //  4. SHADOW EMPIRE — Gold Rules All
  // ──────────────────────────────────────────────
  {
    id: 'ending_shadow_empire',
    title: 'Shadow Empire',
    subtitle: 'Every Soul Has a Ledger Entry',
    primaryFaction: 'obsidianGuild',
    conditions: [
      {
        type: 'faction_reputation',
        factionId: 'obsidianGuild',
        operator: 'gte',
        value: 60,
      },
      {
        type: 'flag_set',
        flagId: 'signed_guild_compact',
        operator: 'true',
      },
      {
        type: 'stat_check',
        stat: 'subtlety',
        operator: 'gte',
        value: 7,
      },
    ],
    narration: [
      'No trumpets herald the fall of the monarchy. No armies march. Instead, on a quiet '
        + 'Tuesday, the Crown\'s treasury reports a deficit so catastrophic that the royal '
        + 'household cannot afford candles. Three days later, a polite letter from Sylas Ashford '
        + 'arrives offering a "restructuring loan" at terms so generous they can only be a trap. '
        + 'Queen Isolde signs. She has no choice. The ink is barely dry before Guild auditors '
        + 'arrive at every ministry, every garrison, every customs house in the realm.',

      'Aldric Vane watches from the shadows — which is, he reflects, exactly where Sylas '
        + 'always wanted him. The former knight has become something stranger than a soldier '
        + 'and subtler than a spy: he is the Guild\'s Arbiter, the velvet glove over the iron '
        + 'fist of commerce. When disputes arise, Aldric resolves them. When competitors resist, '
        + 'Aldric persuades them. He has never been more effective, or more hollow.',

      'Within a year, Aethermoor has no king, no queen, no throne. It has a Board of Directors. '
        + 'The Merchant Republic of Aethermoor is proclaimed from the steps of the Blackhaven '
        + 'Exchange, and Sylas Ashford — humble servant of the people, first among equals, owner '
        + 'of sixty percent of the realm\'s arable land — rings the opening bell. The crowd '
        + 'cheers because the bread is cheap and the wine is flowing. The bread will not always '
        + 'be cheap.',

      'Prosperity arrives like a fever — hot, fast, and unsustainable. Blackhaven swells into '
        + 'a glittering metropolis. Bridges of black marble span the harbor. Theaters and '
        + 'pleasure houses bloom on every corner. The Guild\'s merchant fleet triples. Foreign '
        + 'delegations arrive seeking trade deals, and Sylas receives them in a hall more '
        + 'opulent than any throne room, wearing silk so fine it could cut glass. He smiles '
        + 'his silver smile and offers terms that sound like gifts and read like chains.',

      'Aldric understands, too late, the fundamental truth of the Shadow Empire: in a world '
        + 'where everything can be bought, nothing has value. Loyalty is a contract. Love is '
        + 'an investment. Honor is a brand. He has traded one kind of tyranny for another — '
        + 'the tyranny of the ledger, the spreadsheet, the quarterly report. The realm is richer '
        + 'than it has ever been, and it has never been poorer in the ways that matter.',

      'At night, in his lavish apartment above the Gilded Quarter, Aldric counts his coin '
        + 'and wonders when he stopped being able to taste the wine.',
    ],
    epilogues: [
      {
        title: 'The Fate of the Crown',
        text:
          'Queen Isolde accepts a generous pension and a villa on the coast. She is '
          + 'comfortable, irrelevant, and deeply, corrosively furious. The iron crown is '
          + 'purchased at auction by Sylas Ashford for a record sum and mounted behind glass '
          + 'in his private study — not as a trophy but as a reminder. "Crowns are just '
          + 'expensive hats," he tells visitors. "The real power was always in the purse strings."',
      },
      {
        title: 'The Common Folk',
        text:
          'The merchant republic brings opportunity and exploitation in equal measure. A '
          + 'clever farmer can become a landowner; a slow one becomes a tenant on land his '
          + 'family owned for generations. The Guild\'s labor contracts are technically legal, '
          + 'technically voluntary, and practically inescapable. Wages rise, but prices rise '
          + 'faster. The taverns are full and the songs are loud, but there is a brittle, '
          + 'desperate edge to the laughter — the sound of people spending money they do not have.',
      },
      {
        title: 'The Arbiter\'s Bargain',
        text:
          'Aldric Vane becomes the wealthiest commoner in Aethermoor and the loneliest man '
          + 'in Blackhaven. Every friendship is a transaction, every kindness a potential '
          + 'leverage point. He funds orphanages and schools — genuine acts of charity that '
          + 'Sylas approves because educated workers are more productive workers. In his later '
          + 'years, Aldric writes a memoir titled "The Price of Everything" that becomes a '
          + 'bestseller. Sylas buys the publishing house.',
      },
      {
        title: 'The Invisible Throne',
        text:
          'The Merchant Republic outlasts every kingdom on the continent, because it does not '
          + 'depend on bloodlines or prophecies — only profit margins. Sylas Ashford dies at '
          + 'eighty-eight, the richest man who ever lived, and is succeeded seamlessly by a '
          + 'protege who is succeeded by another. The system is immortal because it has no soul '
          + 'to lose. Aethermoor becomes the envy of the world: a nation that runs like '
          + 'clockwork and feels like a prison made of silk.',
      },
    ],
    artPrompt:
      'A grand merchant\'s exchange hall at night, lit by hundreds of candles reflected in '
      + 'polished obsidian floors. A silver-haired man in fine dark silk raises a golden bell. '
      + 'Behind him, a massive stained-glass window shows a serpent coiled around a mountain '
      + 'of coins. Well-dressed figures applaud. Noir aesthetic — deep blacks, molten gold '
      + 'highlights, candlelight reflections, decadent and sinister.',
    unlocks: [
      'ng_plus_shadow_broker_class',
      'ng_plus_ledger_of_souls_relic',
      'ng_plus_mercantile_dialogue_tree',
    ],
  },

  // ──────────────────────────────────────────────
  //  5. THE UNIFIED REALM — Peace Through Compromise
  // ──────────────────────────────────────────────
  {
    id: 'ending_unified_realm',
    title: 'The Unified Realm',
    subtitle: 'Four Pillars, One Foundation',
    conditions: [
      {
        type: 'faction_reputation',
        factionId: 'ironThrone',
        operator: 'gte',
        value: 40,
      },
      {
        type: 'faction_reputation',
        factionId: 'ashenConclave',
        operator: 'gte',
        value: 40,
      },
      {
        type: 'faction_reputation',
        factionId: 'verdantPact',
        operator: 'gte',
        value: 40,
      },
      {
        type: 'faction_reputation',
        factionId: 'obsidianGuild',
        operator: 'gte',
        value: 30,
      },
      {
        type: 'flag_set',
        flagId: 'brokered_four_faction_accord',
        operator: 'true',
      },
      {
        type: 'stat_check',
        stat: 'charisma',
        operator: 'gte',
        value: 8,
      },
    ],
    narration: [
      'The Accord of Ashenmere is signed at the only table in Aethermoor large enough to '
        + 'seat all four factions without anyone\'s back to a wall: a round oak table in '
        + 'a lakeside tavern that smells of fish stew and spilled ale. It is not the setting '
        + 'anyone imagined for the most important treaty in the realm\'s history. But Aldric '
        + 'Vane chose it deliberately — a place with no thrones, no altars, no ledgers. Just '
        + 'a table, and people willing to sit at it.',

      'Queen Isolde agrees to constitutional limits on the Crown. High Seer Malachar opens '
        + 'the Conclave\'s libraries to public scholarship. Rowan Greenmantle accepts a '
        + 'parliamentary seat for the commons. Sylas Ashford submits the Guild\'s accounts to '
        + 'an independent audit. None of them are happy. All of them are furious, in fact — '
        + 'Isolde at the loss of absolute authority, Malachar at the exposure of sacred texts, '
        + 'Rowan at the formality of institutions he despises, Sylas at the transparency he '
        + 'has spent a lifetime avoiding. Aldric watches them sign with the grim satisfaction '
        + 'of a man who knows that if everyone is equally angry, the compromise might actually '
        + 'be fair.',

      'The Tetrarchy — as scholars will later call it — is ungainly, argumentative, and '
        + 'maddeningly slow. Every decision requires consensus across four councils, each with '
        + 'veto power, each convinced the other three are idiots. Laws take months to pass. '
        + 'Infrastructure projects stall in committee. The realm\'s citizens complain bitterly '
        + 'about the inefficiency, which is, Aldric thinks, a very good sign. People who '
        + 'complain about their government are people who believe it can be better. Subjects '
        + 'of tyrants do not complain. They endure.',

      'Aldric refuses any formal role. He is the Mediator — an unofficial title that carries '
        + 'no salary, no residence, and no authority beyond the trust the four faction leaders '
        + 'place in his stubborn, infuriating fairness. He spends his days walking between '
        + 'council chambers, carrying messages, smoothing egos, and occasionally banging his '
        + 'head against a wall when Isolde and Rowan start shouting at each other again. It is '
        + 'exhausting, thankless work. It is the most important thing anyone in the realm is '
        + 'doing.',

      'Years later, a young scribe asks Aldric what the Unified Realm\'s greatest achievement '
        + 'is. He thinks for a long time. "We haven\'t killed each other yet," he says. The '
        + 'scribe waits for more. There is no more. That is the whole miracle.',
    ],
    epilogues: [
      {
        title: 'The Fate of the Crown',
        text:
          'Queen Isolde becomes the realm\'s first constitutional monarch — a role she '
          + 'performs with rigid dignity and private contempt. She is ceremonial head of state, '
          + 'commander of a military she can no longer deploy without parliamentary approval, '
          + 'and patron of arts she does not understand. History will remember her as the queen '
          + 'who chose to diminish herself rather than destroy the realm. She would hate that '
          + 'epitaph. It is accurate.',
      },
      {
        title: 'The Common Folk',
        text:
          'The Unified Realm is not paradise. It is something better: a flawed, breathing, '
          + 'imperfect society that slowly, fitfully, learns. Public schools open in the '
          + 'Greenwood. Trade guilds submit to labor standards. The Conclave trains village '
          + 'healers. The Throne\'s soldiers become a civil guard answerable to elected '
          + 'magistrates. Progress is measured in decades, not days, and the people grow '
          + 'impatient — but impatience, unlike despair, implies hope.',
      },
      {
        title: 'The Mediator\'s Legacy',
        text:
          'Aldric Vane dies at sixty-seven, having never held office, never worn a crown, '
          + 'and never once raised his sword after the Accord. At his funeral, representatives '
          + 'from all four factions stand in the same room without armed escorts for the first '
          + 'time. Isolde attends but does not speak. Rowan weeps openly. Sylas sends a wreath '
          + 'of golden flowers that costs more than a house. Malachar is absent, as always, '
          + 'but a single candle in the Oracle\'s Spire burns for seven days.',
      },
      {
        title: 'The Realm Reborn',
        text:
          'The Tetrarchy endures — improbably, stubbornly, against every prediction of '
          + 'collapse. It survives border wars, economic crises, a plague, and three '
          + 'assassination attempts on various council members. It survives because no single '
          + 'faction can seize control without the others noticing, and because the people, '
          + 'having tasted participation, will not surrender it. It is not the best of all '
          + 'possible worlds. It is merely the best one anyone has managed to build.',
      },
    ],
    artPrompt:
      'A round oak table in a rustic lakeside tavern, surrounded by four distinct figures: '
      + 'a queen in dark armor, a robed seer, a farmer with an oak staff, and a merchant in '
      + 'fine silk. A knight stands behind them, arms folded, watching. Through the window, '
      + 'a sunset over a calm lake. Warm, golden light suffuses the scene. Painterly realism, '
      + 'Vermeer-like intimacy, rich earth tones and amber light.',
    unlocks: [
      'ng_plus_diplomat_class',
      'ng_plus_accord_signet_ring_relic',
      'ng_plus_unity_dialogue_tree',
      'ng_plus_all_faction_perks',
    ],
  },

  // ──────────────────────────────────────────────
  //  6. ASH AND RUIN — The Realm Falls
  // ──────────────────────────────────────────────
  {
    id: 'ending_ash_and_ruin',
    title: 'Ash and Ruin',
    subtitle: 'The Fire That Follows Silence',
    conditions: [
      {
        type: 'faction_reputation',
        factionId: 'ironThrone',
        operator: 'lte',
        value: 20,
      },
      {
        type: 'faction_reputation',
        factionId: 'ashenConclave',
        operator: 'lte',
        value: 20,
      },
      {
        type: 'faction_reputation',
        factionId: 'verdantPact',
        operator: 'lte',
        value: 20,
      },
      {
        type: 'faction_reputation',
        factionId: 'obsidianGuild',
        operator: 'lte',
        value: 20,
      },
    ],
    narration: [
      'There is no single moment when the realm breaks. It is not a crack but an erosion — '
        + 'a slow, grinding dissolution that Aldric Vane watches with the helpless clarity of '
        + 'a man who can see the flood but cannot find high ground. The conspiracy he was meant '
        + 'to unravel has metastasized beyond any one faction, any one villain, any one '
        + 'betrayal. It is the sum of every compromise he failed to broker, every alliance '
        + 'he let shatter, every hand he refused to take.',

      'The war begins in autumn, as wars in Aethermoor always do. The Iron Throne marches on '
        + 'the Greenwood. The Verdant Pact sets fire to the Crownlands\' harvest. The Ashen '
        + 'Conclave seals its mountain passes and lets the lowlands burn, hoarding knowledge '
        + 'like dragons hoard gold. The Obsidian Guild sells weapons to all sides and '
        + 'provisions to none, watching the profit margins climb as the death toll rises. '
        + 'Every faction believes it will emerge victorious from the ashes. None of them will.',

      'Aldric fights in the Battle of the Blackwater Ford — not for any banner but simply '
        + 'because there are people drowning and he still remembers how to pull them from the '
        + 'current. He fights at the Siege of Mosshollow, at the Burning of the Library of '
        + 'Echoes, at the Sacking of Blackhaven. He fights until his sword arm is numb and his '
        + 'cause is nothing more than reflex. He is a knight without a liege, a hero without '
        + 'a story, a man with a blade and no reason to swing it except that he has forgotten '
        + 'how to stop.',

      'Winter comes early that year. The fires die because there is nothing left to burn. '
        + 'The armies retreat because there is nothing left to conquer. Aethermoor lies broken '
        + 'across the frozen landscape like a shattered mirror — each shard reflecting a '
        + 'fragment of what was, none large enough to show the whole. The Obsidian Throne stands '
        + 'empty in a roofless citadel, snow gathering in the seat where kings once sat.',

      'Aldric Vane walks north. He does not know where he is going. He does not know if there '
        + 'is anywhere left to go. Behind him, the smoke of a dead civilization rises into a '
        + 'sky the color of old iron, and ahead, the road stretches into white nothing. He walks '
        + 'because walking is the only thing left. He walks because stopping would mean accepting '
        + 'that it is over, and he is not ready for that. He may never be ready for that.',

      'In the spring, something green pushes through the ash.',
    ],
    epilogues: [
      {
        title: 'The Fate of the Crown',
        text:
          'Queen Isolde dies in the fifth month of the war, killed not by an enemy but by '
          + 'her own guard captain, who decides that a dead queen is worth more to his '
          + 'mercenary contract than a living one. The iron crown is lost in the chaos — '
          + 'melted, stolen, or buried, no one knows. The Obsidian Throne, which survived '
          + 'the Sundering itself, does not survive the winter. It cracks in the frost, and '
          + 'in the spring, wildflowers grow through the fissures.',
      },
      {
        title: 'The Common Folk',
        text:
          'The smallfolk suffer as they have always suffered — disproportionately, invisibly, '
          + 'and without anyone writing their names down. One in three does not survive the '
          + 'war-winter. The survivors become something harder and sadder than the people they '
          + 'were before: refugees in their own land, building shelters from the rubble of '
          + 'their own homes. But they build. Somehow, impossibly, stubbornly, they build.',
      },
      {
        title: 'The Wanderer',
        text:
          'Aldric Vane becomes a legend — not the kind written in books but the kind whispered '
          + 'around campfires. A grey knight who walks the ruined roads, helping where he can, '
          + 'mourning what he cannot. Some say he died at the Battle of the Ford. Some say he '
          + 'crossed the northern mountains and found another land. Some say he is still walking, '
          + 'an old man with a broken sword and eyes full of a world that no longer exists.',
      },
      {
        title: 'What Grows from Ash',
        text:
          'Aethermoor does not recover in any meaningful sense. What rises from the ruins is '
          + 'not a restoration but something new — smaller, humbler, chastened by the memory '
          + 'of what ambition cost. The old faction names become curses. The old borders become '
          + 'meaningless. In the villages that slowly, painfully coalesce from the wreckage, '
          + 'a new saying takes root: "Remember Aethermoor." It is not nostalgia. It is a '
          + 'warning.',
      },
    ],
    artPrompt:
      'A lone knight walking away down a snow-covered road, seen from behind. To the left, '
      + 'a ruined city smolders on the horizon, black smoke rising into a grey winter sky. '
      + 'To the right, skeletal trees and abandoned farmland. The knight\'s armor is dented '
      + 'and his sword is broken. A single green shoot pushes through the ash in the '
      + 'foreground. Bleak, beautiful, Cormac McCarthy meets dark fantasy. Desaturated palette '
      + 'of whites, greys, and ash blacks with one point of green.',
    unlocks: [
      'ng_plus_wanderer_class',
      'ng_plus_broken_blade_relic',
      'ng_plus_survivor_dialogue_tree',
    ],
  },
];
