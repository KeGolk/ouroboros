import { Chapter } from '../../../types/narrative';

const chapter01: Chapter = {
  id: 'ch01',
  number: 1,
  title: 'The Ashen Road',
  subtitle: 'In which a disgraced noble returns to a kingdom in flames',
  description:
    'News of the High King\'s assassination reaches you in exile. As you journey toward the capital, you encounter refugees, soldiers, and the first whispers of faction intrigue. Your choices here set the tone for everything that follows.',
  imagePrompt:
    'A lone cloaked traveler on a dusty road approaching a walled medieval city with smoke rising from within, refugees streaming in the opposite direction, stormy sky, oil painting style, dark muted palette with orange fire glow',
  startNodeId: 'ch01_start',
  availableFactions: ['iron_covenant', 'ashen_throne'],
  keyCharacters: ['kael', 'ser_brynn', 'mireth'],
  minLevel: 1,
  nodes: [
    {
      id: 'ch01_start',
      chapterId: 'ch01',
      title: 'The Road Home',
      text: 'The letter arrived three days ago, carried by a raven with ash-grey feathers: "The High King is dead. Murdered in his own hall. Come home." You burned the letter, as you burn everything that reminds you of Valdris. But your feet carried you to the road anyway.\n\nNow, a day\'s ride from the capital, the road tells its own story. Abandoned carts. A child\'s shoe in the mud. The acrid smell of something burning that isn\'t wood.\n\nAhead, where the road forks, you see a cluster of refugees huddled around a dying fire. Among them, a woman in battered armor bearing the wolf sigil of the Iron Covenant stands guard. Beyond the fork, smoke rises from the village of Ashford.',
      imagePrompt: 'A fork in a muddy road with refugees huddled around a small fire, an armored woman standing watch, smoke from a burning village in the distance, overcast sky, oil painting style',
      choices: [
        {
          id: 'ch01_help_refugees',
          text: 'Approach the refugees and offer what aid you can.',
          targetNode: 'ch01_refugees',
          consequences: [
            { type: 'set_relationship', target: 'ser_brynn', value: 10 },
            { type: 'grant_xp', target: 'charisma', value: 5 },
          ],
        },
        {
          id: 'ch01_investigate_smoke',
          text: 'Head toward Ashford to investigate the source of the smoke.',
          targetNode: 'ch01_ashford',
          consequences: [
            { type: 'grant_xp', target: 'resolve', value: 5 },
          ],
        },
        {
          id: 'ch01_avoid_both',
          text: 'Skirt both groups and take the hidden path through the woods.',
          targetNode: 'ch01_woods',
          consequences: [
            { type: 'grant_xp', target: 'dexterity', value: 5 },
          ],
        },
      ],
    },
    {
      id: 'ch01_refugees',
      chapterId: 'ch01',
      title: 'Among the Displaced',
      text: 'The armored woman\'s hand drops to her sword as you approach, then relaxes as she reads your bearing — noble-born, despite the worn traveling clothes.\n\n"I am Ser Brynn of Ashford," she says, her voice steady despite exhaustion. "These people fled when the Covenant garrison pulled back to the capital. Bandits took what the soldiers left behind."\n\nA child tugs at your cloak. An old man coughs blood into a rag. Ser Brynn watches you with eyes that are measuring something.\n\n"You have the look of someone who\'s lost things too," she says quietly. "We could use help getting these people to the capital gates. Or..." she glances toward the smoke. "Ashford still burns. There may be people trapped."',
      speaker: 'ser_brynn',
      imagePrompt: 'A young woman knight kneeling beside refugees around a campfire, exhausted but resolute, a child clinging to a traveler\'s cloak, oil painting style, warm firelight against cold sky',
      choices: [
        {
          id: 'ch01_escort_refugees',
          text: 'Help Ser Brynn escort the refugees to safety.',
          targetNode: 'ch01_escort',
          consequences: [
            { type: 'faction_rep', target: 'iron_covenant', value: 10 },
            { type: 'set_relationship', target: 'ser_brynn', value: 15 },
            { type: 'set_flag', target: 'saved_ashford_refugees', value: true },
          ],
        },
        {
          id: 'ch01_go_ashford_from_refugees',
          text: '"I\'ll check Ashford for survivors. Get these people moving."',
          targetNode: 'ch01_ashford',
          consequences: [
            { type: 'set_relationship', target: 'ser_brynn', value: 5 },
            { type: 'grant_xp', target: 'resolve', value: 10 },
          ],
        },
        {
          id: 'ch01_question_brynn',
          text: '"Why did the garrison pull back? What\'s really happening in the capital?"',
          targetNode: 'ch01_brynn_intel',
          consequences: [
            { type: 'grant_xp', target: 'cunning', value: 10 },
          ],
        },
      ],
    },
    {
      id: 'ch01_brynn_intel',
      chapterId: 'ch01',
      title: 'Whispers of Power',
      text: 'Ser Brynn\'s jaw tightens. She pulls you aside, out of earshot of the refugees.\n\n"Commander Vareth recalled every able sword to the capital. He says it\'s to maintain order, but..." She lowers her voice. "The Iron Covenant is positioning for control. They\'re not the only ones. The druids have sent emissaries. The Obsidian Circle\'s spies are everywhere. And the princess — Isolde — she\'s returned from exile."\n\nShe fixes you with a hard stare. "Everyone wants the throne, or to destroy it. And people like these —" she gestures at the refugees "— will be ground between the millstones. Unless someone gives a damn."\n\nHer hand finds the wolf sigil on her armor, and she seems to grip it like a talisman — or a chain.',
      speaker: 'ser_brynn',
      choices: [
        {
          id: 'ch01_promise_help',
          text: '"I give a damn. Let\'s get these people to safety, then figure out the rest."',
          targetNode: 'ch01_escort',
          consequences: [
            { type: 'set_relationship', target: 'ser_brynn', value: 20 },
            { type: 'faction_rep', target: 'iron_covenant', value: 5 },
            { type: 'set_flag', target: 'saved_ashford_refugees', value: true },
          ],
        },
        {
          id: 'ch01_pragmatic_response',
          text: '"Every faction you named has a claim. What matters is which one serves the realm — not just themselves."',
          targetNode: 'ch01_escort',
          consequences: [
            { type: 'set_relationship', target: 'ser_brynn', value: 10 },
            { type: 'grant_xp', target: 'cunning', value: 5 },
            { type: 'set_flag', target: 'saved_ashford_refugees', value: true },
          ],
        },
        {
          id: 'ch01_cold_response',
          text: '"I didn\'t come back for refugees. I came back for answers."',
          targetNode: 'ch01_ashford',
          consequences: [
            { type: 'set_relationship', target: 'ser_brynn', value: -10 },
            { type: 'grant_xp', target: 'resolve', value: 10 },
          ],
        },
      ],
    },
    {
      id: 'ch01_escort',
      chapterId: 'ch01',
      title: 'The Long Walk',
      text: 'The journey to the capital gates takes the rest of the day. You help carry a child too exhausted to walk. Ser Brynn maintains a perimeter, her training evident in every movement.\n\nAs the walls of Valdris rise before you, you notice something: the gates are manned not by royal guards but by soldiers wearing the Iron Covenant\'s wolf. Ser Brynn notices your look.\n\n"Commander Vareth took control of the gates two days ago. For the people\'s protection, he says." She doesn\'t sound convinced.\n\nAt the gate, a sergeant demands your name and business. Ser Brynn vouches for you, but the sergeant\'s eyes linger on your face with a flicker of recognition.\n\n"Wait," he says slowly. "I know that family crest. You\'re one of the —"',
      choices: [
        {
          id: 'ch01_admit_identity',
          text: 'Stand tall. "Yes. I am Kael of House Ashenmere. And I have business in the capital."',
          targetNode: 'ch01_gates_known',
          consequences: [
            { type: 'grant_xp', target: 'charisma', value: 10 },
            { type: 'faction_rep', target: 'ashen_throne', value: 5 },
          ],
        },
        {
          id: 'ch01_deny_identity',
          text: 'Cut him off. "You\'re mistaken. I\'m just a traveler helping these refugees."',
          targetNode: 'ch01_gates_hidden',
          consequences: [
            { type: 'grant_xp', target: 'cunning', value: 10 },
          ],
          statCheck: {
            stat: 'cunning',
            difficulty: 8,
            successNode: 'ch01_gates_hidden',
            failureNode: 'ch01_gates_known',
            description: 'Deceive the gate sergeant about your identity',
          },
        },
        {
          id: 'ch01_bribe_guard',
          text: 'Quietly press a coin into his palm. "Names are dangerous things these days, sergeant."',
          targetNode: 'ch01_gates_hidden',
          consequences: [
            { type: 'grant_xp', target: 'cunning', value: 5 },
            { type: 'grant_xp', target: 'dexterity', value: 5 },
          ],
        },
      ],
    },
    {
      id: 'ch01_ashford',
      chapterId: 'ch01',
      title: 'The Burning Village',
      text: 'Ashford is dying. Half the buildings are aflame, and the rest have been looted. Bodies lie in the square — some villagers, some wearing makeshift bandit armor.\n\nBut in the village hall, you hear voices. Kicking through the smoldering door, you find a standoff: three bandits hold a merchant family at knifepoint, while an old woman in grey robes stands between them, speaking calmly as if discussing the weather.\n\n"Ah," says the old woman, turning to you with a smile that doesn\'t reach her mismatched eyes. "Right on time. I told them someone would come."\n\nThe lead bandit snarls. "Kill the crone first, then the merchant. We ain\'t leaving empty-handed."',
      speaker: 'mireth',
      imagePrompt: 'Interior of a burning village hall, three armed bandits facing off against an elderly crone in grey robes, a terrified merchant family behind her, smoke and firelight, oil painting style, intense dramatic lighting',
      choices: [
        {
          id: 'ch01_fight_bandits',
          text: 'Draw your weapon and attack the bandits.',
          targetNode: 'ch01_combat_bandits',
          consequences: [
            { type: 'grant_xp', target: 'strength', value: 15 },
          ],
          statCheck: {
            stat: 'strength',
            difficulty: 6,
            successNode: 'ch01_combat_victory',
            failureNode: 'ch01_combat_pyrrhic',
            description: 'Overpower the bandits in combat',
          },
        },
        {
          id: 'ch01_negotiate_bandits',
          text: 'Try to talk the bandits down. "There\'s nothing left worth dying for here."',
          targetNode: 'ch01_negotiate',
          consequences: [
            { type: 'grant_xp', target: 'charisma', value: 15 },
          ],
          statCheck: {
            stat: 'charisma',
            difficulty: 10,
            successNode: 'ch01_negotiate_success',
            failureNode: 'ch01_combat_bandits',
            description: 'Convince the bandits to stand down',
          },
        },
        {
          id: 'ch01_sneak_bandits',
          text: 'Signal the old woman to keep talking while you circle behind the bandits.',
          targetNode: 'ch01_sneak_attack',
          consequences: [
            { type: 'grant_xp', target: 'dexterity', value: 15 },
          ],
          statCheck: {
            stat: 'dexterity',
            difficulty: 8,
            successNode: 'ch01_sneak_success',
            failureNode: 'ch01_combat_bandits',
            description: 'Sneak behind the bandits for a surprise attack',
          },
        },
      ],
    },
    {
      id: 'ch01_combat_bandits',
      chapterId: 'ch01',
      title: 'Steel and Smoke',
      text: 'The fight is brutal and close-quarters. The bandits are desperate men, but desperation makes them sloppy. You trade blows in the smoke-filled hall, the heat of the fire pressing in.\n\nThe old woman — Mireth, she calls herself — watches the fight with an expression of scholarly interest, occasionally tripping a bandit with her staff when one gets too close to the merchant family.',
      isCombatNode: true,
      combatEncounterId: 'ashford_bandits',
      choices: [
        {
          id: 'ch01_to_victory',
          text: 'Continue...',
          targetNode: 'ch01_combat_victory',
        },
      ],
    },
    {
      id: 'ch01_combat_victory',
      chapterId: 'ch01',
      title: 'Blood and Embers',
      text: 'The last bandit falls. The merchant clutches his family, weeping with relief. The old woman steps over the bodies without apparent concern and fixes you with those unsettling mismatched eyes.\n\n"Well fought. You move like someone who was trained by expensive tutors and then had the polish knocked off by hard living." She grins. "I am Mireth. I\'ve been waiting for you, though you don\'t know it yet."\n\nShe presses a strange brass compass into your hands. "This points toward what matters most. When you reach the capital — and you will — remember: the king wasn\'t killed by one hand. Ask who benefits from chaos itself, not who benefits from a throne."',
      speaker: 'mireth',
      consequences: [
        { type: 'give_item', target: 'mireths_compass', value: true, description: 'Mireth gives you her compass' },
        { type: 'set_relationship', target: 'mireth', value: 20 },
      ],
      choices: [
        {
          id: 'ch01_ask_mireth_more',
          text: '"Who are you, really? How did you know I was coming?"',
          targetNode: 'ch01_mireth_cryptic',
        },
        {
          id: 'ch01_take_compass_move',
          text: 'Take the compass and head for the capital. You\'ve lingered too long.',
          targetNode: 'ch01_to_capital',
        },
      ],
    },
    {
      id: 'ch01_combat_pyrrhic',
      chapterId: 'ch01',
      title: 'A Costly Victory',
      text: 'You defeat the bandits, but not before one of them wounds you badly. The old woman tends your injury with surprising skill, muttering about "young fools who swing before they think."\n\n"Mireth," she says by way of introduction. "And you need to learn to fight smarter or you won\'t survive what\'s coming." She presses a compass into your hands before you can argue.',
      speaker: 'mireth',
      consequences: [
        { type: 'give_item', target: 'mireths_compass', value: true },
        { type: 'set_relationship', target: 'mireth', value: 10 },
        { type: 'modify_stat', target: 'resolve', value: -1, description: 'Wounded in the fight' },
      ],
      choices: [
        {
          id: 'ch01_limp_to_capital',
          text: 'Bind your wounds and press on to the capital.',
          targetNode: 'ch01_to_capital',
        },
      ],
    },
    {
      id: 'ch01_negotiate_success',
      chapterId: 'ch01',
      title: 'Words as Weapons',
      text: 'Your words find the cracks in their resolve. These aren\'t killers — they\'re farmers who lost everything. One by one, they lower their weapons.\n\n"We just wanted to feed our families," the leader mumbles. The old woman nods approvingly.\n\n"Mercy," she says. "That\'s rarer than gold in Valdris these days. I am Mireth, and I think you and I are going to be friends." She hands you a strange compass. "A gift. You\'ll need it where you\'re going."',
      speaker: 'mireth',
      consequences: [
        { type: 'give_item', target: 'mireths_compass', value: true },
        { type: 'set_relationship', target: 'mireth', value: 25 },
        { type: 'faction_rep', target: 'verdant_court', value: 5, description: 'Mercy resonates with the Verdant Court\'s values' },
      ],
      choices: [
        {
          id: 'ch01_spare_bandits',
          text: 'Let the bandits go with a warning.',
          targetNode: 'ch01_to_capital',
          consequences: [
            { type: 'faction_rep', target: 'verdant_court', value: 5 },
            { type: 'faction_rep', target: 'iron_covenant', value: -5 },
          ],
        },
        {
          id: 'ch01_send_to_covenant',
          text: 'Tell them to surrender to the Iron Covenant garrison for fair trial.',
          targetNode: 'ch01_to_capital',
          consequences: [
            { type: 'faction_rep', target: 'iron_covenant', value: 10 },
          ],
        },
      ],
    },
    {
      id: 'ch01_sneak_success',
      chapterId: 'ch01',
      title: 'From the Shadows',
      text: 'Mireth catches your signal — one look from those mismatched eyes — and launches into a rambling tale about "the time I met a three-headed goat in the Salted Marches." The bandits stare in confusion.\n\nYou strike from behind, disarming the leader before the others can react. It\'s over in moments.\n\nMireth cackles. "Oh, I like you. Subtle. The realm needs more subtlety and less swordplay." She presses a strange compass into your hands. "Keep this close. It knows things."',
      speaker: 'mireth',
      consequences: [
        { type: 'give_item', target: 'mireths_compass', value: true },
        { type: 'set_relationship', target: 'mireth', value: 20 },
      ],
      choices: [
        {
          id: 'ch01_head_to_capital',
          text: 'Head for the capital.',
          targetNode: 'ch01_to_capital',
        },
      ],
    },
    {
      id: 'ch01_mireth_cryptic',
      chapterId: 'ch01',
      title: 'The Crone\'s Riddle',
      text: 'Mireth chuckles. "Who am I? I\'ve been a midwife, a spy, a scholar, and once — briefly — a pirate. I\'ve served every faction in Valdris and betrayed each one at least once. How did I know you were coming? Because the compass told me. It always points toward what matters most, and lately, it\'s been pointing toward this road."\n\nShe grows serious. "The king\'s death was not what it seems. The assassin was a tool. The hand that wielded them serves no faction you\'ve heard of yet. Be careful who you trust in the capital — especially those who offer trust too freely."',
      speaker: 'mireth',
      consequences: [
        { type: 'grant_xp', target: 'intelligence', value: 10 },
      ],
      choices: [
        {
          id: 'ch01_heed_warning',
          text: '"I\'ll remember. Thank you, Mireth."',
          targetNode: 'ch01_to_capital',
          consequences: [
            { type: 'set_relationship', target: 'mireth', value: 5 },
          ],
        },
      ],
    },
    {
      id: 'ch01_woods',
      chapterId: 'ch01',
      title: 'The Hidden Path',
      text: 'The old hunters\' path through the Thornwood is overgrown but passable. You move quietly, avoiding the chaos on the main road.\n\nDeep in the wood, you come upon a circle of standing stones — and a figure sitting cross-legged at its center. A young man with wild hair and amber eyes that catch the light like a wolf\'s. A massive raven perches on his shoulder.\n\n"Trespasser," he says, not unkindly. "The wood remembers who walks through it. You walk like a noble playing at being common." He stands, and you see the green-leaf tattoos on his arms. A druid. "I am Rowan. The Thornwood is Verdant Court territory. State your business, or the trees will do it for you."',
      speaker: 'rowan',
      imagePrompt: 'A wild young man with amber eyes sitting in a circle of standing stones in a dark forest, a large raven on his shoulder, green druidic tattoos visible on his arms, filtered forest light, oil painting style',
      choices: [
        {
          id: 'ch01_honest_with_rowan',
          text: '"I\'m heading to the capital. The king is dead and I need answers."',
          targetNode: 'ch01_rowan_talk',
          consequences: [
            { type: 'set_relationship', target: 'rowan', value: 10 },
            { type: 'grant_xp', target: 'charisma', value: 5 },
          ],
        },
        {
          id: 'ch01_challenge_rowan',
          text: '"The Thornwood belongs to no faction. I\'ll walk where I please."',
          targetNode: 'ch01_rowan_challenge',
          consequences: [
            { type: 'set_relationship', target: 'rowan', value: -15 },
            { type: 'grant_xp', target: 'resolve', value: 10 },
          ],
        },
        {
          id: 'ch01_offer_trade_rowan',
          text: '"I have information about troop movements on the eastern road. Interested?"',
          targetNode: 'ch01_rowan_trade',
          consequences: [
            { type: 'grant_xp', target: 'cunning', value: 10 },
          ],
        },
      ],
    },
    {
      id: 'ch01_rowan_talk',
      chapterId: 'ch01',
      title: 'The Druid\'s Grief',
      text: 'Rowan\'s expression shifts — still guarded, but with a flicker of kinship. "The king is dead. Good. His soldiers burned the Thornwood three years ago. Two hundred acres of ancient growth, and the creatures that lived in them. For a road."\n\nThe raven croaks. Rowan scratches its head. "But Elara says what comes next matters more than what came before. The Verdant Court will be at the capital for the Conclave — every faction will. If you\'re looking for answers, that\'s where you\'ll find them. Or where they\'ll find you."\n\nHe considers you. "I can guide you through the wood to the city\'s eastern gate. The Covenant doesn\'t watch that one as closely."',
      speaker: 'rowan',
      choices: [
        {
          id: 'ch01_accept_guide',
          text: 'Accept Rowan\'s guidance.',
          targetNode: 'ch01_to_capital',
          consequences: [
            { type: 'faction_rep', target: 'verdant_court', value: 10 },
            { type: 'set_relationship', target: 'rowan', value: 10 },
            { type: 'recruit_character', target: 'rowan', value: true },
          ],
        },
        {
          id: 'ch01_go_alone',
          text: '"I appreciate it, but I travel alone. Where\'s the eastern gate from here?"',
          targetNode: 'ch01_to_capital',
          consequences: [
            { type: 'set_relationship', target: 'rowan', value: -5 },
          ],
        },
      ],
    },
    {
      id: 'ch01_rowan_challenge',
      chapterId: 'ch01',
      title: 'Territorial Dispute',
      text: 'Rowan\'s amber eyes narrow. The raven spreads its wings. The trees themselves seem to lean closer.\n\n"Bold words from someone standing in a stone circle where the old gods still listen." He rises to his full height — taller than you expected. "But I respect boldness more than groveling. Walk your path, noble. But know that the Thornwood watches, and it has a long memory."\n\nHe steps aside, gesturing to a barely-visible trail. "That way leads to the eastern gate. Try not to trample anything sacred."',
      speaker: 'rowan',
      choices: [
        {
          id: 'ch01_walk_past',
          text: 'Nod curtly and continue to the capital.',
          targetNode: 'ch01_to_capital',
        },
      ],
    },
    {
      id: 'ch01_rowan_trade',
      chapterId: 'ch01',
      title: 'A Fair Exchange',
      text: 'Rowan\'s eyebrows rise. The raven tilts its head as if listening. "Troop movements? The Covenant\'s, I assume. They\'ve been mobilizing along the Thornwood\'s edge for weeks." He weighs you with those predator\'s eyes. "Speak, then. And if your information is good, I\'ll give something in return."',
      speaker: 'rowan',
      choices: [
        {
          id: 'ch01_share_truth',
          text: 'Share what you saw on the road — the garrison pulled back, leaving villages undefended.',
          targetNode: 'ch01_to_capital',
          consequences: [
            { type: 'faction_rep', target: 'verdant_court', value: 15 },
            { type: 'faction_rep', target: 'iron_covenant', value: -5 },
            { type: 'set_relationship', target: 'rowan', value: 15 },
          ],
        },
        {
          id: 'ch01_share_lie',
          text: 'Exaggerate the Covenant\'s strength to make the druids cautious.',
          targetNode: 'ch01_to_capital',
          consequences: [
            { type: 'faction_rep', target: 'iron_covenant', value: 5 },
            { type: 'grant_xp', target: 'cunning', value: 10 },
          ],
          statCheck: {
            stat: 'cunning',
            difficulty: 10,
            successNode: 'ch01_to_capital',
            failureNode: 'ch01_rowan_angry',
            description: 'Deceive Rowan with false intelligence',
          },
        },
      ],
    },
    {
      id: 'ch01_rowan_angry',
      chapterId: 'ch01',
      title: 'Caught in a Lie',
      text: 'Rowan\'s nostrils flare. The raven screeches. "You lie. I can smell it — the Thornwood can smell it. Your heartbeat tells more truth than your tongue."\n\nHe doesn\'t attack, but the contempt in his voice is worse. "Go to the capital, liar. I hope the factions treat you as well as you\'ve treated me." The trees seem to close behind him as he vanishes into the wood.',
      speaker: 'rowan',
      consequences: [
        { type: 'set_relationship', target: 'rowan', value: -25 },
        { type: 'faction_rep', target: 'verdant_court', value: -15 },
      ],
      choices: [
        {
          id: 'ch01_slink_away',
          text: 'Continue to the capital, lesson learned.',
          targetNode: 'ch01_to_capital',
        },
      ],
    },
    {
      id: 'ch01_gates_known',
      chapterId: 'ch01',
      title: 'A Name Remembered',
      text: 'The sergeant\'s eyes widen. "House Ashenmere. Your family was... I\'m sorry. But that name still carries weight with some people in the capital. And enemies with others."\n\nHe waves you through, but not before whispering: "Princess Isolde has been asking about survivors of the purge. You might want to find her — or avoid her. Depending on what kind of trouble you\'re looking for."\n\nThe gates of Valdris close behind you with a sound like a cell door.',
      consequences: [
        { type: 'faction_rep', target: 'ashen_throne', value: 10 },
        { type: 'set_flag', target: 'identity_known', value: true },
      ],
      choices: [
        {
          id: 'ch01_enter_capital',
          text: 'Enter the capital and begin searching for answers.',
          targetNode: 'ch01_end',
        },
      ],
    },
    {
      id: 'ch01_gates_hidden',
      chapterId: 'ch01',
      title: 'A Nobody Enters',
      text: 'The sergeant shrugs and waves you through. Just another refugee in a city swelling with them. Anonymous. Safe, for now.\n\nAs you pass through the shadow of the gatehouse, you hear soldiers gossiping: "...the Conclave meets in three days. Every faction sends representatives. Half of them want the throne, the other half want to burn it..."\n\nThe city stretches before you — familiar streets made strange by fear and occupation. Somewhere in this maze of stone, the truth about the king\'s death waits. And so do people who would kill to keep it buried.',
      consequences: [
        { type: 'grant_xp', target: 'dexterity', value: 5 },
      ],
      choices: [
        {
          id: 'ch01_enter_hidden',
          text: 'Disappear into the capital\'s crowded streets.',
          targetNode: 'ch01_end',
        },
      ],
    },
    {
      id: 'ch01_to_capital',
      chapterId: 'ch01',
      title: 'Approaching the Capital',
      text: 'The walls of Valdris rise from the plain like broken teeth against a bruised sky. Even from a distance, you can see the changes: more soldiers on the ramparts, smoke from campfires in the outer districts, the royal banner replaced by the Iron Covenant\'s wolf on the main gate.\n\nThis is the city where you were born. Where your family served. Where everything was taken from you. And now you\'re walking back into its jaws.',
      choices: [
        {
          id: 'ch01_main_gate',
          text: 'Approach the main gate openly.',
          targetNode: 'ch01_escort', // leads to the gate checkpoint
        },
        {
          id: 'ch01_sneak_in',
          text: 'Find another way in — the old sewage tunnels your family\'s servants used.',
          targetNode: 'ch01_gates_hidden',
          consequences: [
            { type: 'grant_xp', target: 'dexterity', value: 10 },
          ],
          statCheck: {
            stat: 'dexterity',
            difficulty: 6,
            successNode: 'ch01_gates_hidden',
            failureNode: 'ch01_escort',
            description: 'Navigate the forgotten tunnels into the city',
          },
        },
      ],
    },
    {
      id: 'ch01_end',
      chapterId: 'ch01',
      title: 'The Capital Awaits',
      text: 'The first night in Valdris, you find a room in a tavern called The Broken Crown — a name that would have been treasonous a month ago. The innkeeper asks no questions. The ale is watered. The walls are thin.\n\nThrough the floorboards, you hear whispered conversations — faction agents, refugees, opportunists, and frightened commoners. Everyone has a theory about who killed the king. Everyone has a plan. No one has the truth.\n\nAs you lie in the narrow bed, Mireth\'s compass — if you have it — spins lazily on the nightstand. Its needle points, insistently, toward the palace.\n\nTomorrow, the game begins in earnest.',
      imagePrompt: 'A dark tavern room at night, a figure lying on a narrow bed staring at the ceiling, moonlight through a dirty window, a compass on the nightstand with its needle pointing toward an unseen destination, oil painting style, moody blue-grey tones',
      isEndNode: true,
      choices: [],
    },
  ],
};

export default chapter01;
