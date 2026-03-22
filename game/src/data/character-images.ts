/**
 * ═══════════════════════════════════════════════════════════════════
 *  CHARACTER PORTRAIT ASSETS & AI GENERATION PROMPTS
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Each character has multiple poses and expressions for use in
 *  different narrative contexts:
 *
 *    - portrait:    Default neutral portrait (dialogue, menus)
 *    - angry:       Confrontation, combat initiation, betrayal
 *    - sad:         Loss, defeat, mourning scenes
 *    - happy:       Victory, alliance, reunion moments
 *    - determined:  Quest acceptance, battle preparation
 *    - suspicious:  Distrust, interrogation, secrets revealed
 *    - wounded:     Post-combat, near-death, weakened state
 *    - combat:      Active fighting pose for battle scenes
 *    - hooded:      Disguise, stealth, travel scenes
 *    - formal:      Court, ceremony, political scenes
 *
 *  Total: ~80 image assets across 9 characters
 *
 *  Placeholder SVGs are stored in /public/images/characters/
 *  AI prompts are provided for future high-quality generation.
 *
 * ═══════════════════════════════════════════════════════════════════
 */

// ── Types ────────────────────────────────────────────────────────

export type CharacterPose =
  | 'portrait'
  | 'angry'
  | 'sad'
  | 'happy'
  | 'determined'
  | 'suspicious'
  | 'wounded'
  | 'combat'
  | 'hooded'
  | 'formal';

export interface CharacterImage {
  /** Unique identifier matching pose key */
  pose: CharacterPose;
  /** Display label for this pose */
  label: string;
  /** Path to placeholder image asset */
  path: string;
  /** Narrative contexts where this image is used */
  usedIn: string[];
  /** Full AI image generation prompt */
  aiPrompt: string;
  /** Negative prompt for AI generation (what to avoid) */
  aiNegativePrompt: string;
  /** Suggested AI generation parameters */
  aiParams: {
    style: string;
    aspectRatio: '2:3' | '3:4' | '1:1';
    lighting: string;
    colorPalette: string[];
  };
}

export interface CharacterImageSet {
  /** Character ID matching characters.ts */
  characterId: string;
  /** Character display name */
  name: string;
  /** Base art direction shared across all poses */
  baseArtDirection: string;
  /** Individual pose images */
  images: CharacterImage[];
}

// ── Shared Negative Prompt ───────────────────────────────────────

const SHARED_NEGATIVE =
  'modern clothing, anachronistic elements, anime style, cartoon, chibi, '
  + 'bright neon colors, clean/sterile look, sci-fi elements, guns, '
  + 'smartphones, plastic, smooth airbrushed skin, stock photo look, '
  + 'watermark, text overlay, low quality, blurry, deformed hands';

// ── Helper ───────────────────────────────────────────────────────

function imagePath(charId: string, pose: string): string {
  return `/images/characters/${charId}_${pose}.svg`;
}

// ═════════════════════════════════════════════════════════════════
//  1. ALDRIC VANE — The Disgraced Knight (Player Character)
// ═════════════════════════════════════════════════════════════════

const aldricVane: CharacterImageSet = {
  characterId: 'aldric_vane',
  name: 'Aldric Vane',
  baseArtDirection:
    'A weathered knight in his mid-thirties with close-cropped dark hair and a jagged scar '
    + 'across his jaw. Grey-green watchful eyes. Battered half-plate armor with insignia '
    + 'scraped off. Gritty medieval realism, muted earth tones, chiaroscuro lighting. '
    + 'Rembrandt meets dark fantasy. Oil-on-canvas texture with visible brushstrokes.',
  images: [
    {
      pose: 'portrait',
      label: 'Default Portrait',
      path: imagePath('aldric_vane', 'portrait'),
      usedIn: ['dialogue', 'main menu', 'character sheet', 'save slots'],
      aiPrompt:
        'Portrait of a weathered knight in his mid-thirties, close-cropped dark hair, jagged '
        + 'scar across jaw, grey-green watchful eyes. Battered half-plate armor with insignia '
        + 'scraped off. Longsword hilt visible at hip. Neutral but alert expression, slight '
        + 'tension in jaw. Dark stone wall background. Gritty medieval oil painting, muted '
        + 'earth tones, chiaroscuro lighting, Rembrandt meets dark fantasy. Bust portrait, '
        + 'three-quarter view.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'dark fantasy oil painting',
        aspectRatio: '2:3',
        lighting: 'chiaroscuro, single candle from upper-left',
        colorPalette: ['#4A3C2A', '#6B5B3E', '#8B7D6B', '#2C2416', '#5C6B5C'],
      },
    },
    {
      pose: 'angry',
      label: 'Furious',
      path: imagePath('aldric_vane', 'angry'),
      usedIn: ['confrontation scenes', 'betrayal reveals', 'combat initiation'],
      aiPrompt:
        'Portrait of a furious knight, mid-thirties, dark hair, jaw scar prominent as muscles '
        + 'clench. Grey-green eyes blazing with controlled rage. Battered half-plate armor. '
        + 'Hand gripping longsword hilt, knuckles white. Torchlight casting harsh upward shadows. '
        + 'Background of flickering firelight on stone. Gritty medieval oil painting, dramatic '
        + 'reds and deep shadows, chiaroscuro. Intense close-up, confrontational angle.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'dark fantasy oil painting',
        aspectRatio: '2:3',
        lighting: 'harsh upward torchlight, deep shadows',
        colorPalette: ['#8B2500', '#4A3C2A', '#2C1810', '#6B3020', '#1A0F0A'],
      },
    },
    {
      pose: 'sad',
      label: 'Grief-Stricken',
      path: imagePath('aldric_vane', 'sad'),
      usedIn: ['companion death', 'loss scenes', 'reflecting on past'],
      aiPrompt:
        'Portrait of a grief-stricken knight, mid-thirties, dark hair, scar on jaw. Eyes '
        + 'downcast, grey-green irises dulled with sorrow. Battered armor rain-slicked. '
        + 'Shoulders slightly hunched. Background of grey rain against dark stone, blurred. '
        + 'Gritty medieval oil painting, cold blue-grey tones, diffuse overcast lighting. '
        + 'Melancholic composition, slightly off-center.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'dark fantasy oil painting',
        aspectRatio: '2:3',
        lighting: 'diffuse overcast, grey rain-light',
        colorPalette: ['#4A5568', '#6B7B8D', '#3A3D42', '#5C6670', '#2D3748'],
      },
    },
    {
      pose: 'happy',
      label: 'Rare Smile',
      path: imagePath('aldric_vane', 'happy'),
      usedIn: ['alliance victories', 'companion bonding', 'hopeful moments'],
      aiPrompt:
        'Portrait of a knight with a rare, genuine half-smile, mid-thirties, dark hair, '
        + 'scar on jaw. Grey-green eyes showing warmth and relief. Battered half-plate armor. '
        + 'Background of warm firelight in a tavern, amber glow. The smile is subtle, earned, '
        + 'not easy. Gritty medieval oil painting, warm golden tones, candlelight from right. '
        + 'Intimate close-up, three-quarter view.',
      aiNegativePrompt: SHARED_NEGATIVE + ', grinning, laughing, too cheerful',
      aiParams: {
        style: 'dark fantasy oil painting',
        aspectRatio: '2:3',
        lighting: 'warm candlelight from right side',
        colorPalette: ['#B8860B', '#8B7355', '#6B5B3E', '#D4A76A', '#4A3C2A'],
      },
    },
    {
      pose: 'determined',
      label: 'Resolute',
      path: imagePath('aldric_vane', 'determined'),
      usedIn: ['quest acceptance', 'battle preparation', 'key decisions'],
      aiPrompt:
        'Portrait of a determined knight setting his jaw, mid-thirties, dark hair, scar '
        + 'prominent. Grey-green eyes narrowed with steely resolve. Battered half-plate armor, '
        + 'hand resting on pommel of longsword. Dawn light breaking through clouds behind him. '
        + 'Background of misty battlefield at first light. Gritty medieval oil painting, '
        + 'cold steel blues with warm gold highlights. Heroic but grounded composition.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'dark fantasy oil painting',
        aspectRatio: '2:3',
        lighting: 'dawn light breaking through clouds, rim-lit',
        colorPalette: ['#4A5568', '#B8860B', '#6B7B8D', '#D4A76A', '#2D3748'],
      },
    },
    {
      pose: 'suspicious',
      label: 'Wary',
      path: imagePath('aldric_vane', 'suspicious'),
      usedIn: ['interrogation', 'political intrigue', 'discovering secrets'],
      aiPrompt:
        'Portrait of a wary knight with narrowed eyes, mid-thirties, dark hair, jaw scar. '
        + 'Grey-green eyes scanning, calculating. One eyebrow slightly raised. Battered '
        + 'half-plate armor. Candlelit interior, deep shadows on one side of face. Background '
        + 'of dimly lit corridor. Gritty medieval oil painting, noir-influenced, heavy shadow '
        + 'on left side. Tight framing, sense of tension.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'dark fantasy oil painting, noir influence',
        aspectRatio: '2:3',
        lighting: 'single candle, dramatic half-shadow',
        colorPalette: ['#2C2416', '#4A3C2A', '#6B5B3E', '#8B7D6B', '#1A1008'],
      },
    },
    {
      pose: 'wounded',
      label: 'Bloodied',
      path: imagePath('aldric_vane', 'wounded'),
      usedIn: ['post-combat defeat', 'near-death scenes', 'recovery'],
      aiPrompt:
        'Portrait of a wounded knight, mid-thirties, dark hair matted with sweat and blood. '
        + 'Jaw scar reopened, fresh cut across brow. Grey-green eyes glazed but defiant. '
        + 'Battered armor dented and scored, blood on pauldron. Leaning against stone wall. '
        + 'Background of dim cell or battlefield aftermath. Gritty medieval oil painting, '
        + 'desaturated, blood-red accents on grey. Pain and resilience.',
      aiNegativePrompt: SHARED_NEGATIVE + ', gore, excessive blood, graphic injury',
      aiParams: {
        style: 'dark fantasy oil painting',
        aspectRatio: '2:3',
        lighting: 'low ambient, faint torchlight',
        colorPalette: ['#3A3D42', '#8B2500', '#5C6670', '#4A3C2A', '#6B3020'],
      },
    },
    {
      pose: 'combat',
      label: 'Battle Stance',
      path: imagePath('aldric_vane', 'combat'),
      usedIn: ['combat encounters', 'boss fights', 'action scenes'],
      aiPrompt:
        'Action portrait of a knight mid-strike, mid-thirties, dark hair, jaw scar. '
        + 'Grey-green eyes focused with lethal intent. Longsword raised in a guard position, '
        + 'battered half-plate armor catching torchlight. Dynamic pose, weight on back foot. '
        + 'Background of blurred castle courtyard, rain falling. Gritty medieval oil painting, '
        + 'motion energy, warm steel highlights on dark background. Slightly wider framing to '
        + 'show upper body and sword.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'dark fantasy oil painting, dynamic composition',
        aspectRatio: '3:4',
        lighting: 'torchlight from multiple angles, rain reflections',
        colorPalette: ['#4A5568', '#B8860B', '#6B5B3E', '#8B7D6B', '#2C2416'],
      },
    },
    {
      pose: 'hooded',
      label: 'Disguised',
      path: imagePath('aldric_vane', 'hooded'),
      usedIn: ['stealth scenes', 'travel', 'entering hostile territory'],
      aiPrompt:
        'Portrait of a hooded figure, deep cowl shadowing upper face, only jaw scar and '
        + 'grey-green eyes visible beneath. Worn travelling cloak over hidden armor. '
        + 'Background of rainy city street at night, lanterns blurred. Gritty medieval oil '
        + 'painting, deep shadows, muted tones, noir atmosphere. Anonymous and dangerous. '
        + 'Close-up, frontal view, mystery in shadow.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'dark fantasy oil painting, noir',
        aspectRatio: '2:3',
        lighting: 'distant lantern light, deep hood shadow',
        colorPalette: ['#1A1008', '#2C2416', '#4A3C2A', '#5C6670', '#3A3D42'],
      },
    },
  ],
};

// ═════════════════════════════════════════════════════════════════
//  2. QUEEN ISOLDE BLACKTHORN — Iron Throne Leader
// ═════════════════════════════════════════════════════════════════

const queenIsolde: CharacterImageSet = {
  characterId: 'queen_isolde',
  name: 'Isolde Blackthorn',
  baseArtDirection:
    'A regal woman in her early forties with sharp features, pale skin, and black hair '
    + 'pulled tightly back. Iron crown on brow. High-collared crimson gown over blackened '
    + 'steel armor. Renaissance portrait style, rich darks, candlelight on steel. Composed, '
    + 'calculating, utterly without mercy.',
  images: [
    {
      pose: 'portrait',
      label: 'Default Portrait',
      path: imagePath('queen_isolde', 'portrait'),
      usedIn: ['dialogue', 'character profiles', 'court scenes'],
      aiPrompt:
        'Portrait of a regal queen in her early forties, sharp features, pale skin, black '
        + 'hair pulled tightly back in severe style. Iron crown resting on brow. High-collared '
        + 'gown of dark crimson over blackened steel armor visible at shoulders. Composed, '
        + 'calculating expression, thin lips set in neutral line. Throne room background with '
        + 'crimson banners, dark stone. Renaissance oil portrait, rich darks, warm candlelight '
        + 'on steel and silk. Three-quarter view, regal bearing.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'renaissance oil portrait, dark regal',
        aspectRatio: '2:3',
        lighting: 'warm candlelight from above, steel reflections',
        colorPalette: ['#8B0000', '#2C2416', '#C0C0C0', '#4A0000', '#1A0F0A'],
      },
    },
    {
      pose: 'angry',
      label: 'Cold Fury',
      path: imagePath('queen_isolde', 'angry'),
      usedIn: ['threats', 'sentencing', 'confrontation with Aldric'],
      aiPrompt:
        'Portrait of a furious queen, early forties, sharp pale features, black hair severe. '
        + 'Iron crown catching firelight. Eyes narrowed to dark slits, jaw tight with controlled '
        + 'rage. One hand gripping throne armrest. Crimson gown, blackened armor. Background of '
        + 'roaring hearth fire, crimson light flooding scene. Renaissance portrait, dramatic '
        + 'reds intensified, stark shadows. Cold fury — the kind that whispers, not screams.',
      aiNegativePrompt: SHARED_NEGATIVE + ', screaming, wild expression',
      aiParams: {
        style: 'renaissance oil portrait, dramatic',
        aspectRatio: '2:3',
        lighting: 'hearth fire from below-right, stark shadows',
        colorPalette: ['#8B0000', '#4A0000', '#2C0000', '#C0C0C0', '#1A0F0A'],
      },
    },
    {
      pose: 'sad',
      label: 'Private Grief',
      path: imagePath('queen_isolde', 'sad'),
      usedIn: ['reminiscing about Aldren', 'rare vulnerability', 'ending epilogues'],
      aiPrompt:
        'Portrait of a queen in a rare unguarded moment, early forties, sharp pale features '
        + 'softened by grief. Black hair slightly loosened from its severe style. Iron crown '
        + 'removed, held in one hand. Eyes glistening but no tears falling — she would not '
        + 'allow it. Simple dark shift, armor removed. Private chamber background, single '
        + 'candle. Renaissance portrait, intimate, soft shadows, warm and vulnerable. The '
        + 'woman beneath the queen.',
      aiNegativePrompt: SHARED_NEGATIVE + ', crying, sobbing, melodramatic',
      aiParams: {
        style: 'renaissance oil portrait, intimate',
        aspectRatio: '2:3',
        lighting: 'single candle, intimate warmth',
        colorPalette: ['#4A3C2A', '#8B7355', '#2C2416', '#6B5B3E', '#8B0000'],
      },
    },
    {
      pose: 'determined',
      label: 'Royal Command',
      path: imagePath('queen_isolde', 'determined'),
      usedIn: ['issuing decrees', 'war planning', 'alliance negotiations'],
      aiPrompt:
        'Portrait of a queen in command, early forties, sharp pale features set with absolute '
        + 'resolve. Black hair severe, iron crown glinting. Standing at a war table strewn with '
        + 'maps, one hand flat on the table. Crimson gown, full blackened steel armor visible. '
        + 'Background of war room, torches, iron chandelier. Renaissance portrait with military '
        + 'gravitas, warm steel tones, crimson accents. Authority incarnate.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'renaissance oil portrait, military authority',
        aspectRatio: '2:3',
        lighting: 'overhead iron chandelier, multiple torches',
        colorPalette: ['#8B0000', '#C0C0C0', '#4A3C2A', '#2C2416', '#6B5B3E'],
      },
    },
    {
      pose: 'suspicious',
      label: 'Calculating',
      path: imagePath('queen_isolde', 'suspicious'),
      usedIn: ['political maneuvering', 'distrust scenes', 'hidden agenda reveals'],
      aiPrompt:
        'Portrait of a queen studying someone with predatory calculation, early forties, '
        + 'sharp pale features, black hair severe. Iron crown. Eyes half-lidded, chin slightly '
        + 'raised — looking down at viewer. Thin smile that does not reach her eyes. Crimson '
        + 'gown, shadows deep. Background barely visible, all focus on her expression. '
        + 'Renaissance portrait, noir-influenced, heavy chiaroscuro. A spider watching a fly.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'renaissance oil portrait, noir',
        aspectRatio: '2:3',
        lighting: 'harsh side-lighting, deep chiaroscuro',
        colorPalette: ['#1A0F0A', '#8B0000', '#2C2416', '#C0C0C0', '#4A0000'],
      },
    },
    {
      pose: 'combat',
      label: 'Armed Regent',
      path: imagePath('queen_isolde', 'combat'),
      usedIn: ['boss fight', 'siege defense', 'final confrontation'],
      aiPrompt:
        'Action portrait of a queen in full blackened steel armor, early forties, sharp pale '
        + 'features hard as iron. Black hair pulled back, iron crown replaced with battle helm '
        + 'held under arm. Slender sword drawn in right hand. Crimson cloak billowing. '
        + 'Background of castle battlements, siege fires in distance. Renaissance portrait '
        + 'meets battle scene, dramatic movement, steel reflections, crimson and fire.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'renaissance battle portrait, dynamic',
        aspectRatio: '3:4',
        lighting: 'siege fires in distance, rim lighting',
        colorPalette: ['#C0C0C0', '#8B0000', '#4A3C2A', '#FF6B35', '#2C2416'],
      },
    },
    {
      pose: 'formal',
      label: 'Coronation',
      path: imagePath('queen_isolde', 'formal'),
      usedIn: ['court ceremonies', 'political scenes', 'throne room audiences'],
      aiPrompt:
        'Formal portrait of a queen on the Obsidian Throne, early forties, sharp pale features '
        + 'in full regal composure. Black hair in elaborate braided style, iron crown gleaming. '
        + 'Full crimson ceremonial gown with gold embroidery, ermine-trimmed cloak. Throne room '
        + 'background — obsidian throne, crimson banners, iron chandelier, court in shadows. '
        + 'Grand Renaissance coronation portrait, rich detail, candlelight, pageantry and power.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'grand renaissance coronation portrait',
        aspectRatio: '2:3',
        lighting: 'grand chandelier, multiple candles, ceremonial',
        colorPalette: ['#8B0000', '#B8860B', '#C0C0C0', '#2C2416', '#4A0000'],
      },
    },
    {
      pose: 'happy',
      label: 'Satisfied Smile',
      path: imagePath('queen_isolde', 'happy'),
      usedIn: ['victory scenes', 'successful manipulation', 'rare genuine warmth'],
      aiPrompt:
        'Portrait of a queen with a thin, satisfied smile, early forties, sharp pale features '
        + 'showing the ghost of genuine warmth. Black hair severe, iron crown. Eyes slightly '
        + 'crinkled — not with joy but with the satisfaction of a plan perfectly executed. '
        + 'Crimson gown, candlelit study background with wine goblet. Renaissance portrait, '
        + 'warm tones, intimate. A rare crack in the mask.',
      aiNegativePrompt: SHARED_NEGATIVE + ', grinning, laughing, too warm',
      aiParams: {
        style: 'renaissance oil portrait, intimate warmth',
        aspectRatio: '2:3',
        lighting: 'warm candlelight, intimate',
        colorPalette: ['#8B0000', '#B8860B', '#4A3C2A', '#6B5B3E', '#2C2416'],
      },
    },
    {
      pose: 'wounded',
      label: 'Fallen Queen',
      path: imagePath('queen_isolde', 'wounded'),
      usedIn: ['defeat scenes', 'assassination attempt', 'captured'],
      aiPrompt:
        'Portrait of a wounded queen, early forties, sharp pale features now ashen. Black hair '
        + 'disheveled, iron crown askew. Blood on her collar, armor dented. But her eyes — her '
        + 'eyes are still calculating, still dangerous. Leaning against throne, one hand pressed '
        + 'to a wound. Dim throne room, dying torches. Renaissance portrait, desaturated, '
        + 'blood-crimson the only warm color. Defiant even in defeat.',
      aiNegativePrompt: SHARED_NEGATIVE + ', gore, excessive blood',
      aiParams: {
        style: 'renaissance oil portrait, dramatic',
        aspectRatio: '2:3',
        lighting: 'dying torchlight, fading warmth',
        colorPalette: ['#3A3D42', '#8B0000', '#5C6670', '#2C2416', '#4A3C2A'],
      },
    },
  ],
};

// ═════════════════════════════════════════════════════════════════
//  3. HIGH SEER MALACHAR — Ashen Conclave Leader
// ═════════════════════════════════════════════════════════════════

const highSeerMalachar: CharacterImageSet = {
  characterId: 'high_seer_malachar',
  name: 'Malachar',
  baseArtDirection:
    'An impossibly old man with luminous silver eyes and a face like weathered parchment. '
    + 'Deep hood of ash-grey robes. Faint arcane glyphs shimmer beneath translucent skin. '
    + 'Gnarled staff with softly glowing crystal. Mystical, unsettling serenity. Muted purples, '
    + 'silvers, and candlelight gold.',
  images: [
    {
      pose: 'portrait',
      label: 'Default Portrait',
      path: imagePath('high_seer_malachar', 'portrait'),
      usedIn: ['dialogue', 'character profiles', 'prophecy scenes'],
      aiPrompt:
        'Portrait of an impossibly ancient seer, ageless face like cracked parchment, luminous '
        + 'silver eyes glowing faintly. Deep hood of ash-grey robes framing gaunt features. '
        + 'Faint arcane glyphs visible beneath translucent skin on temples and cheekbones. '
        + 'Serene, unsettling calm expression. Background of towering library shelves vanishing '
        + 'into shadow. Mystical dark fantasy oil painting, muted purples and silvers with '
        + 'candlelight gold accents. Three-quarter view, otherworldly.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'mystical dark fantasy oil painting',
        aspectRatio: '2:3',
        lighting: 'ethereal glow from staff crystal, candlelight',
        colorPalette: ['#6B5B7B', '#C0C0C0', '#B8860B', '#3D2B4F', '#8B7D9B'],
      },
    },
    {
      pose: 'angry',
      label: 'Terrible Power',
      path: imagePath('high_seer_malachar', 'angry'),
      usedIn: ['threatened scenes', 'confrontation', 'displaying power'],
      aiPrompt:
        'Portrait of an ancient seer radiating terrible power, silver eyes blazing white-hot, '
        + 'arcane glyphs across skin flaring vivid purple. Ash-grey robes billowing with '
        + 'unseen wind. Staff crystal erupting with blinding light. Face still calm — the anger '
        + 'is not in his expression but in the reality warping around him. Background of '
        + 'shattering library shelves, floating books, cracking stone. Dark fantasy oil painting, '
        + 'eldritch energy, purple lightning, terrible beauty.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'eldritch dark fantasy oil painting',
        aspectRatio: '2:3',
        lighting: 'blazing arcane light, purple energy bloom',
        colorPalette: ['#6B0099', '#C0C0C0', '#3D2B4F', '#FFFFFF', '#1A0033'],
      },
    },
    {
      pose: 'sad',
      label: 'Ancient Weariness',
      path: imagePath('high_seer_malachar', 'sad'),
      usedIn: ['remembering the past', 'failed prophecy', 'regret scenes'],
      aiPrompt:
        'Portrait of an impossibly old seer bowed by centuries of weight, silver eyes dimmed '
        + 'to pewter grey. Hood lowered, revealing thin white hair and deeply lined face. '
        + 'Staff leaned against wall, hands empty in lap. Arcane glyphs barely visible, faded. '
        + 'Background of rain-streaked window in empty chamber. Dark fantasy oil painting, '
        + 'cold grey-blue palette, soft diffuse light. The exhaustion of immortality.',
      aiNegativePrompt: SHARED_NEGATIVE + ', crying, melodramatic',
      aiParams: {
        style: 'melancholic dark fantasy oil painting',
        aspectRatio: '2:3',
        lighting: 'grey rain-light through window, diffuse',
        colorPalette: ['#5C6670', '#8B7D9B', '#3A3D42', '#6B5B7B', '#2D3748'],
      },
    },
    {
      pose: 'determined',
      label: 'Prophecy Spoken',
      path: imagePath('high_seer_malachar', 'determined'),
      usedIn: ['prophecy delivery', 'ritual scenes', 'crucial revelations'],
      aiPrompt:
        'Portrait of an ancient seer in the act of prophecy, silver eyes fully luminous, '
        + 'mouth slightly open as if speaking words of power. Arcane glyphs blazing across '
        + 'skin in geometric patterns. Staff raised, crystal pulsing with steady light. '
        + 'Background of concentric arcane circles floating in dark void. Dark fantasy oil '
        + 'painting, mystical intensity, silver and gold energy against deep purple-black. '
        + 'The weight of destiny in every line.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'mystical dark fantasy oil painting, prophetic',
        aspectRatio: '2:3',
        lighting: 'arcane glow from all directions, crystal focus',
        colorPalette: ['#C0C0C0', '#B8860B', '#6B5B7B', '#3D2B4F', '#FFFFFF'],
      },
    },
    {
      pose: 'suspicious',
      label: 'Cryptic Gaze',
      path: imagePath('high_seer_malachar', 'suspicious'),
      usedIn: ['testing Aldric', 'riddles', 'hidden motives revealed'],
      aiPrompt:
        'Portrait of an ancient seer with a cryptic, knowing expression. Silver eyes half-lidded, '
        + 'thin lips curved in the ghost of a smile that could mean anything. Hood deep, face '
        + 'mostly in shadow, only eyes and glyphs visible. Background of pitch darkness. Dark '
        + 'fantasy oil painting, extreme chiaroscuro, silver eye-glow the only light source. '
        + 'Inscrutable. Is he ally or architect of ruin?',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'dark fantasy oil painting, extreme chiaroscuro',
        aspectRatio: '2:3',
        lighting: 'only silver eye-glow and faint glyph luminescence',
        colorPalette: ['#1A1008', '#C0C0C0', '#3D2B4F', '#6B5B7B', '#0A0A0A'],
      },
    },
    {
      pose: 'combat',
      label: 'Arcane Wrath',
      path: imagePath('high_seer_malachar', 'combat'),
      usedIn: ['boss fight', 'magical confrontation', 'Conclave defense'],
      aiPrompt:
        'Action portrait of an ancient seer channeling devastating arcane power, silver eyes '
        + 'white with energy, mouth open in incantation. Staff thrust forward, crystal exploding '
        + 'with beam of silver-purple light. Robes whipping in magical wind. Arcane glyphs '
        + 'covering entire visible skin, blazing. Background of vaulted cathedral ceiling, '
        + 'magical debris, floating shattered stone. Dark fantasy oil painting, dynamic energy, '
        + 'eldritch power, terrifying beauty. Wider framing for action.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'eldritch dark fantasy oil painting, dynamic',
        aspectRatio: '3:4',
        lighting: 'arcane energy bloom, silver-purple light cascade',
        colorPalette: ['#6B0099', '#C0C0C0', '#FFFFFF', '#3D2B4F', '#B8860B'],
      },
    },
    {
      pose: 'formal',
      label: 'Conclave Ceremony',
      path: imagePath('high_seer_malachar', 'formal'),
      usedIn: ['Conclave meetings', 'ritual ceremonies', 'political negotiations'],
      aiPrompt:
        'Formal portrait of an ancient seer in full Conclave ceremonial regalia — layered '
        + 'robes of ash-grey silk with silver threadwork depicting cosmic patterns. Silver '
        + 'circlet replacing hood, revealing full gaunt face. Staff of office with elaborate '
        + 'crystal array. Background of Conclave sanctum, floating candles, arcane diagrams '
        + 'on walls. Dark fantasy oil painting, ceremonial grandeur, silver and purple majesty.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'ceremonial dark fantasy oil painting',
        aspectRatio: '2:3',
        lighting: 'floating candles, ambient arcane glow',
        colorPalette: ['#C0C0C0', '#6B5B7B', '#3D2B4F', '#B8860B', '#8B7D9B'],
      },
    },
    {
      pose: 'hooded',
      label: 'Shadow Prophet',
      path: imagePath('high_seer_malachar', 'hooded'),
      usedIn: ['secret meetings', 'manipulating from shadows', 'chapter transitions'],
      aiPrompt:
        'Portrait of a hooded figure, deep ash-grey cowl hiding all features except faint '
        + 'silver glow where eyes should be and ghostly blue-white arcane glyphs tracing '
        + 'otherwise invisible skin. Staff partially visible, crystal dim. Background of '
        + 'misty forest path at night, moonlight filtering through dead branches. Dark fantasy '
        + 'oil painting, spectral and ominous, the shadow behind the throne.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'spectral dark fantasy oil painting',
        aspectRatio: '2:3',
        lighting: 'faint moonlight, ghostly glyph luminescence',
        colorPalette: ['#1A1025', '#6B5B7B', '#C0C0C0', '#3D2B4F', '#2D1B3D'],
      },
    },
    {
      pose: 'wounded',
      label: 'Mortal Frailty',
      path: imagePath('high_seer_malachar', 'wounded'),
      usedIn: ['power loss', 'betrayal aftermath', 'mortality revealed'],
      aiPrompt:
        'Portrait of an ancient seer suddenly showing his centuries of age, silver eyes '
        + 'flickering like dying candles. Face even more deeply lined, skin papery and grey. '
        + 'Arcane glyphs guttering out one by one across his skin. Hood fallen back, thin '
        + 'white hair in disarray. Staff cracked, crystal dark. Background of crumbling '
        + 'sanctum. Dark fantasy oil painting, faded colors, dying light. Immortality '
        + 'catching up all at once.',
      aiNegativePrompt: SHARED_NEGATIVE + ', gore, excessive blood',
      aiParams: {
        style: 'dark fantasy oil painting, fading',
        aspectRatio: '2:3',
        lighting: 'dying arcane light, guttering candle',
        colorPalette: ['#5C6670', '#3A3D42', '#6B5B7B', '#8B7D9B', '#2D3748'],
      },
    },
  ],
};

// ═════════════════════════════════════════════════════════════════
//  4. ROWAN GREENMANTLE — Verdant Pact Leader
// ═════════════════════════════════════════════════════════════════

const rowanGreenmantle: CharacterImageSet = {
  characterId: 'rowan_greenmantle',
  name: 'Rowan Greenmantle',
  baseArtDirection:
    'A broad-shouldered man in his late forties with sun-weathered skin, calloused hands, '
    + 'and kind fierce brown eyes. Practical leather armor over homespun cloth, green cloak '
    + 'with oak-leaf brooch. Oak staff with druidic symbols, hand axe at belt. Earthy, '
    + 'grounded — warm browns and greens, natural light.',
  images: [
    {
      pose: 'portrait',
      label: 'Default Portrait',
      path: imagePath('rowan_greenmantle', 'portrait'),
      usedIn: ['dialogue', 'character profiles', 'Pact scenes'],
      aiPrompt:
        'Portrait of a broad-shouldered farmer-turned-revolutionary, late forties, sun-weathered '
        + 'skin, calloused hands visible. Kind, fierce brown eyes with deep crow\'s feet. '
        + 'Practical leather armor over homespun cloth, green cloak pinned with oak-leaf brooch. '
        + 'Expression of calm strength and hard-won wisdom. Forest background, dappled sunlight '
        + 'through oak canopy. Earthy dark fantasy oil painting, warm browns and greens, '
        + 'natural golden-hour light. Three-quarter view, grounded and real.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'earthy dark fantasy oil painting',
        aspectRatio: '2:3',
        lighting: 'dappled forest sunlight, golden hour',
        colorPalette: ['#4A6B2A', '#8B7355', '#6B5B3E', '#2D4A1A', '#D4A76A'],
      },
    },
    {
      pose: 'angry',
      label: 'Righteous Fury',
      path: imagePath('rowan_greenmantle', 'angry'),
      usedIn: ['witnessing injustice', 'rallying troops', 'confrontation with Throne'],
      aiPrompt:
        'Portrait of a furious revolutionary, late forties, sun-weathered face flushed with '
        + 'righteous anger. Brown eyes blazing. Hand gripping battle axe, knuckles white on '
        + 'oak shaft. Green cloak thrown back, leather armor visible. Veins in neck and temple '
        + 'visible. Background of burning village, orange firelight. Earthy dark fantasy oil '
        + 'painting, warm reds and angry oranges against earthy base. The rage of a farmer '
        + 'who has lost everything.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'earthy dark fantasy oil painting, passionate',
        aspectRatio: '2:3',
        lighting: 'village firelight, angry orange glow',
        colorPalette: ['#8B2500', '#FF6B35', '#4A6B2A', '#6B5B3E', '#2D4A1A'],
      },
    },
    {
      pose: 'sad',
      label: 'Mourning',
      path: imagePath('rowan_greenmantle', 'sad'),
      usedIn: ['remembering lost children', 'Pact casualties', 'cost of rebellion'],
      aiPrompt:
        'Portrait of a grieving revolutionary, late forties, sun-weathered face lined deeper '
        + 'by sorrow. Brown eyes distant, looking at something far away and long ago. '
        + 'Calloused hand touching a small wooden toy — a child\'s keepsake. Green cloak '
        + 'wrapped tight. Background of empty field at dusk, mist rising. Earthy dark fantasy '
        + 'oil painting, desaturated greens and blues, cold evening light. A father remembering.',
      aiNegativePrompt: SHARED_NEGATIVE + ', crying dramatically',
      aiParams: {
        style: 'earthy dark fantasy oil painting, melancholic',
        aspectRatio: '2:3',
        lighting: 'cold evening dusk, mist-diffused',
        colorPalette: ['#5C6670', '#4A6B2A', '#6B7B8D', '#3A3D42', '#2D4A1A'],
      },
    },
    {
      pose: 'happy',
      label: 'Hearty Laugh',
      path: imagePath('rowan_greenmantle', 'happy'),
      usedIn: ['campfire scenes', 'victory celebrations', 'bonding moments'],
      aiPrompt:
        'Portrait of a laughing revolutionary, late forties, sun-weathered face crinkled with '
        + 'genuine joy. Brown eyes warm and alive. Head tilted back slightly, broad smile '
        + 'showing imperfect teeth. Mug of ale in calloused hand. Campfire light warm on face. '
        + 'Background of rebel camp at night, bonfire, friends in soft focus. Earthy dark '
        + 'fantasy oil painting, warm golden firelight, amber tones. The man before the war.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'earthy dark fantasy oil painting, warm',
        aspectRatio: '2:3',
        lighting: 'warm campfire glow, golden amber',
        colorPalette: ['#B8860B', '#D4A76A', '#8B7355', '#4A6B2A', '#FF8C00'],
      },
    },
    {
      pose: 'determined',
      label: 'Battle Speech',
      path: imagePath('rowan_greenmantle', 'determined'),
      usedIn: ['rallying Pact forces', 'refusing compromise', 'key decisions'],
      aiPrompt:
        'Portrait of a determined revolutionary mid-speech, late forties, sun-weathered face '
        + 'set with unshakable resolve. Brown eyes burning with conviction. Oak staff raised '
        + 'in one hand, other hand extended toward unseen crowd. Green cloak billowing in wind. '
        + 'Background of dawn breaking over hilltop, rebel banners. Earthy dark fantasy oil '
        + 'painting, dramatic dawn lighting, greens and golds, heroic composition. A common '
        + 'man who became extraordinary.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'earthy dark fantasy oil painting, heroic',
        aspectRatio: '2:3',
        lighting: 'dramatic dawn backlight, golden rim',
        colorPalette: ['#4A6B2A', '#B8860B', '#D4A76A', '#2D4A1A', '#8B7355'],
      },
    },
    {
      pose: 'suspicious',
      label: 'Farmer\'s Shrewd Eye',
      path: imagePath('rowan_greenmantle', 'suspicious'),
      usedIn: ['negotiation', 'doubting ally motives', 'political scenes'],
      aiPrompt:
        'Portrait of a skeptical revolutionary, late forties, sun-weathered face with one '
        + 'eyebrow raised and lips pressed thin. Brown eyes sharp — the shrewdness of a '
        + 'farmer who knows when the harvest is being weighed with false stones. Arms crossed, '
        + 'leather armor visible. Background of dim tent interior, map table. Earthy dark '
        + 'fantasy oil painting, muted tones, single lamp light. Plain-spoken distrust.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'earthy dark fantasy oil painting',
        aspectRatio: '2:3',
        lighting: 'single oil lamp, practical illumination',
        colorPalette: ['#6B5B3E', '#4A6B2A', '#8B7355', '#2C2416', '#4A3C2A'],
      },
    },
    {
      pose: 'combat',
      label: 'Axe Raised',
      path: imagePath('rowan_greenmantle', 'combat'),
      usedIn: ['combat encounters', 'boss fights', 'rebellion battle scenes'],
      aiPrompt:
        'Action portrait of a revolutionary charging with battle axe raised, late forties, '
        + 'sun-weathered face contorted with battle fury. Brown eyes fierce. Leather armor over '
        + 'homespun, green cloak streaming behind. Oak staff strapped to back, hand axe '
        + 'swinging forward. Background of forest battlefield, rebels charging behind him. '
        + 'Earthy dark fantasy oil painting, dynamic movement, green-and-brown chaos of '
        + 'forest combat. Wider framing for action.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'earthy dark fantasy oil painting, dynamic',
        aspectRatio: '3:4',
        lighting: 'forest canopy filtered light, battle dust',
        colorPalette: ['#4A6B2A', '#8B7355', '#6B5B3E', '#2D4A1A', '#8B2500'],
      },
    },
    {
      pose: 'wounded',
      label: 'Fallen Leader',
      path: imagePath('rowan_greenmantle', 'wounded'),
      usedIn: ['defeat scenes', 'captured by Throne', 'sacrifice moments'],
      aiPrompt:
        'Portrait of a wounded revolutionary propped against an oak tree, late forties, '
        + 'sun-weathered face pale beneath the tan. Brown eyes still defiant despite blood '
        + 'on homespun shirt. Green cloak used as makeshift bandage around ribs. Broken axe '
        + 'nearby. Background of forest clearing after battle, trampled grass, scattered '
        + 'weapons. Earthy dark fantasy oil painting, desaturated, blood-brown on green. '
        + 'Unbowed, even now.',
      aiNegativePrompt: SHARED_NEGATIVE + ', gore, excessive blood',
      aiParams: {
        style: 'earthy dark fantasy oil painting',
        aspectRatio: '2:3',
        lighting: 'overcast forest light, grey-green',
        colorPalette: ['#5C6670', '#4A6B2A', '#8B2500', '#6B5B3E', '#3A3D42'],
      },
    },
    {
      pose: 'hooded',
      label: 'Man of the People',
      path: imagePath('rowan_greenmantle', 'hooded'),
      usedIn: ['traveling incognito', 'spy missions', 'entering Throne territory'],
      aiPrompt:
        'Portrait of a hooded figure in a worn green travelling cloak, face partially '
        + 'hidden. Brown eyes visible beneath hood, watchful. Calloused hands gripping '
        + 'staff, disguised as walking stick. Simple farmer\'s garb beneath — blending in '
        + 'among common folk. Background of market street, anonymous among crowd. Earthy '
        + 'dark fantasy oil painting, muted, anonymous. The leader as just another peasant.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'earthy dark fantasy oil painting, anonymous',
        aspectRatio: '2:3',
        lighting: 'overcast market light, grey-green',
        colorPalette: ['#4A6B2A', '#6B5B3E', '#8B7355', '#5C6670', '#2D4A1A'],
      },
    },
  ],
};

// ═════════════════════════════════════════════════════════════════
//  5. SYLAS ASHFORD — Obsidian Guild Leader
// ═════════════════════════════════════════════════════════════════

const sylasAshford: CharacterImageSet = {
  characterId: 'sylas_ashford',
  name: 'Sylas Ashford',
  baseArtDirection:
    'A lean, silver-haired man in his fifties with sharp cheekbones, a thin smile, and dark '
    + 'eyes that miss nothing. High-collared coat of black velvet with gold thread embroidery. '
    + 'Signet ring with serpent-and-coin seal. Noir portrait — dramatic shadows, gold highlights, '
    + 'elegant menace.',
  images: [
    {
      pose: 'portrait',
      label: 'Default Portrait',
      path: imagePath('sylas_ashford', 'portrait'),
      usedIn: ['dialogue', 'character profiles', 'Guild scenes'],
      aiPrompt:
        'Portrait of an elegant merchant prince, fifties, lean build, silver hair swept back, '
        + 'sharp cheekbones, thin knowing smile. Dark eyes reflecting candlelight like a cat. '
        + 'High-collared coat of black velvet with intricate gold thread embroidery. Signet '
        + 'ring bearing serpent-and-coin on right hand. Candlelit study background with maps, '
        + 'ledgers, goblet of wine. Noir dark fantasy oil painting, dramatic shadows, gold '
        + 'highlights, elegant menace. Three-quarter view, urbane and dangerous.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'noir dark fantasy oil painting',
        aspectRatio: '2:3',
        lighting: 'multiple candles, dramatic shadows, gold reflections',
        colorPalette: ['#1A1008', '#B8860B', '#2C2416', '#4A3C2A', '#C0C0C0'],
      },
    },
    {
      pose: 'angry',
      label: 'Cold Displeasure',
      path: imagePath('sylas_ashford', 'angry'),
      usedIn: ['deals broken', 'disrespected', 'threatening retribution'],
      aiPrompt:
        'Portrait of a merchant prince whose smile has frozen to ice, fifties, silver hair, '
        + 'sharp cheekbones. Dark eyes flat and dead as a shark\'s. Thin lips pressed together, '
        + 'smile gone. One hand adjusting signet ring — a subtle threat. Black velvet coat, '
        + 'gold embroidery catching harsh light. Background of dark office, single candle '
        + 'casting long shadow. Noir dark fantasy oil painting, cold, dangerous stillness. '
        + 'The anger of a man who destroys with ledgers, not swords.',
      aiNegativePrompt: SHARED_NEGATIVE + ', shouting, wild expression',
      aiParams: {
        style: 'noir dark fantasy oil painting, cold menace',
        aspectRatio: '2:3',
        lighting: 'single harsh candle, long shadows',
        colorPalette: ['#1A1008', '#B8860B', '#0A0A0A', '#2C2416', '#4A3C2A'],
      },
    },
    {
      pose: 'happy',
      label: 'The Deal Smile',
      path: imagePath('sylas_ashford', 'happy'),
      usedIn: ['successful negotiations', 'profit moments', 'charming scenes'],
      aiPrompt:
        'Portrait of a delighted merchant prince, fifties, silver hair, sharp cheekbones '
        + 'lifted in genuine (or convincingly performed) pleasure. Dark eyes bright with '
        + 'amusement. Broad smile showing perfect teeth, wine goblet raised in toast. Black '
        + 'velvet coat, gold thread catching warm light. Background of lavish Guild hall, '
        + 'candlelight banquet. Noir dark fantasy oil painting, warm gold tones, charming '
        + 'and magnetic. You almost forget he\'s dangerous.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'noir dark fantasy oil painting, charming',
        aspectRatio: '2:3',
        lighting: 'warm banquet candlelight, golden glow',
        colorPalette: ['#B8860B', '#D4A76A', '#2C2416', '#4A3C2A', '#8B7355'],
      },
    },
    {
      pose: 'determined',
      label: 'The Gambit',
      path: imagePath('sylas_ashford', 'determined'),
      usedIn: ['executing plans', 'high-stakes moments', 'Guild operations'],
      aiPrompt:
        'Portrait of a merchant prince in calculation mode, fifties, silver hair, sharp '
        + 'features focused with predatory concentration. Dark eyes tracking invisible chess '
        + 'pieces. Leaning forward over desk covered in coded ledgers and sealed messages. '
        + 'Black velvet coat, signet ring prominent as hand moves piece on a board. Background '
        + 'of spider-web of strings connecting notes on wall. Noir dark fantasy oil painting, '
        + 'sharp focus, gold and shadow. The architect at work.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'noir dark fantasy oil painting, focused',
        aspectRatio: '2:3',
        lighting: 'desk lamp, focused pool of light',
        colorPalette: ['#B8860B', '#1A1008', '#2C2416', '#4A3C2A', '#C0C0C0'],
      },
    },
    {
      pose: 'suspicious',
      label: 'Knowing Look',
      path: imagePath('sylas_ashford', 'suspicious'),
      usedIn: ['catching lies', 'revealing he knows your secret', 'leverage scenes'],
      aiPrompt:
        'Portrait of a merchant prince with a knowing, predatory half-smile, fifties, silver '
        + 'hair, sharp cheekbones. Dark eyes lidded with amusement — he knows something you '
        + 'don\'t want him to know. Chin resting on steepled fingers, signet ring prominent. '
        + 'Black velvet coat. Background completely dark, only face lit. Noir dark fantasy oil '
        + 'painting, extreme chiaroscuro, gold-lit features on void. Information is power, '
        + 'and he has both.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'noir dark fantasy oil painting, extreme chiaroscuro',
        aspectRatio: '2:3',
        lighting: 'single source below-right, face emerging from darkness',
        colorPalette: ['#0A0A0A', '#B8860B', '#1A1008', '#2C2416', '#D4A76A'],
      },
    },
    {
      pose: 'combat',
      label: 'Gentleman\'s Duel',
      path: imagePath('sylas_ashford', 'combat'),
      usedIn: ['boss fight', 'cornered', 'personal combat'],
      aiPrompt:
        'Action portrait of a merchant prince with a thin stiletto drawn from his sleeve, '
        + 'fifties, silver hair disarrayed for first time. Dark eyes cold with lethal focus. '
        + 'Black velvet coat open, revealing hidden blade harness. Fighting stance '
        + 'elegant — fencer\'s pose. Background of overturned desk, scattered coins and '
        + 'documents. Noir dark fantasy oil painting, dynamic but controlled, gold steel '
        + 'flash. Even violence is transactional.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'noir dark fantasy oil painting, dynamic',
        aspectRatio: '3:4',
        lighting: 'multiple candles, blade reflections',
        colorPalette: ['#C0C0C0', '#B8860B', '#1A1008', '#2C2416', '#4A3C2A'],
      },
    },
    {
      pose: 'formal',
      label: 'Guild Regalia',
      path: imagePath('sylas_ashford', 'formal'),
      usedIn: ['Guild council', 'formal negotiations', 'political scenes'],
      aiPrompt:
        'Formal portrait of a merchant prince in full Guild regalia, fifties, silver hair '
        + 'immaculate, sharp cheekbones. Floor-length coat of black velvet with gold serpent '
        + 'embroidery, ermine collar, heavy gold chain of office with obsidian pendants. '
        + 'Signet ring, multiple jeweled rings. Background of Guild great hall, obsidian '
        + 'pillars, gold-inlaid floor, massive ledger on podium. Noir dark fantasy oil '
        + 'painting, opulent, gold-dripping, power through wealth.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'noir dark fantasy oil painting, opulent',
        aspectRatio: '2:3',
        lighting: 'grand chandelier, gold everywhere',
        colorPalette: ['#B8860B', '#D4A76A', '#1A1008', '#2C2416', '#0A0A0A'],
      },
    },
    {
      pose: 'wounded',
      label: 'Bankrupt',
      path: imagePath('sylas_ashford', 'wounded'),
      usedIn: ['defeat', 'exposed', 'losing everything'],
      aiPrompt:
        'Portrait of a broken merchant prince, fifties, silver hair disarrayed, sharp '
        + 'cheekbones gaunt. Dark eyes hollow with disbelief. Black velvet coat torn, '
        + 'gold thread frayed. Signet ring gone — bare finger prominent. Surrounded by '
        + 'scattered, burned ledgers and empty coin purses. Background of ransacked study. '
        + 'Noir dark fantasy oil painting, desaturated, gold faded to ash. A man whose '
        + 'empire was built on paper — and paper burns.',
      aiNegativePrompt: SHARED_NEGATIVE + ', gore, excessive blood',
      aiParams: {
        style: 'noir dark fantasy oil painting, desolate',
        aspectRatio: '2:3',
        lighting: 'dying embers, fading warmth',
        colorPalette: ['#3A3D42', '#6B5B3E', '#5C6670', '#4A3C2A', '#8B7355'],
      },
    },
    {
      pose: 'hooded',
      label: 'Shadow Broker',
      path: imagePath('sylas_ashford', 'hooded'),
      usedIn: ['secret meetings', 'black market', 'intelligence operations'],
      aiPrompt:
        'Portrait of a hooded figure in an expensive but nondescript black cloak, only thin '
        + 'smile and gold signet ring visible. Dark eyes catching candlelight beneath deep '
        + 'cowl. Background of back-alley tavern, rain-slicked cobblestones, single lantern. '
        + 'Noir dark fantasy oil painting, deep shadows, single gold highlight on ring. '
        + 'The most powerful man in the room — and no one knows he\'s there.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'noir dark fantasy oil painting',
        aspectRatio: '2:3',
        lighting: 'distant lantern, rain reflections, gold ring highlight',
        colorPalette: ['#0A0A0A', '#1A1008', '#B8860B', '#2C2416', '#3A3D42'],
      },
    },
  ],
};

// ═════════════════════════════════════════════════════════════════
//  6. ELARA DAWNWHISPER — Companion (Conclave Defector)
// ═════════════════════════════════════════════════════════════════

const elaraDawnwhisper: CharacterImageSet = {
  characterId: 'elara_dawnwhisper',
  name: 'Elara Dawnwhisper',
  baseArtDirection:
    'A young woman in her early twenties with dark skin, close-cropped silver-white hair '
    + '(prematurely aged by Aetheric exposure), and luminous amber eyes that glow faintly. '
    + 'Tattered grey Conclave robe with insignia torn off, satchel of scrolls. Faint arcane '
    + 'marks on forearms. Warm undertones against cool mystical accents.',
  images: [
    {
      pose: 'portrait',
      label: 'Default Portrait',
      path: imagePath('elara_dawnwhisper', 'portrait'),
      usedIn: ['dialogue', 'character profiles', 'companion screen'],
      aiPrompt:
        'Portrait of a young mystic woman, early twenties, dark brown skin, close-cropped '
        + 'silver-white hair that catches light like moonstone. Luminous amber eyes with '
        + 'faint inner glow. Tattered grey Conclave robe with torn insignia patch, leather '
        + 'satchel bulging with scrolls slung over shoulder. Faint arcane marks trace her '
        + 'forearms like silver tattoos. Expression of guarded determination — wary but brave. '
        + 'Background of shadowed forest edge at twilight. Dark fantasy oil painting, warm '
        + 'skin tones against cool mystical silver-blue accents. Three-quarter view.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'dark fantasy oil painting, warm-cool contrast',
        aspectRatio: '2:3',
        lighting: 'twilight ambient with faint amber eye-glow',
        colorPalette: ['#8B6914', '#6B5B7B', '#D4A76A', '#3D2B4F', '#C0C0C0'],
      },
    },
    {
      pose: 'angry',
      label: 'Defiant',
      path: imagePath('elara_dawnwhisper', 'angry'),
      usedIn: ['confronting Malachar', 'defending Aldric', 'righteous fury'],
      aiPrompt:
        'Portrait of a defiant young mystic, early twenties, dark skin flushed, silver-white '
        + 'hair seeming to bristle with static energy. Amber eyes blazing bright, arcane marks '
        + 'on forearms flaring gold. Hands raised, fingers spread, magical energy crackling '
        + 'between them. Torn Conclave robe whipping in magical wind. Background of arcane '
        + 'energy distortion. Dark fantasy oil painting, warm amber energy against cool purple '
        + 'shadow. Young, powerful, and done being afraid.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'dark fantasy oil painting, energetic',
        aspectRatio: '2:3',
        lighting: 'amber arcane energy from hands, self-illuminated',
        colorPalette: ['#D4A76A', '#B8860B', '#6B5B7B', '#3D2B4F', '#FF8C00'],
      },
    },
    {
      pose: 'sad',
      label: 'Guilt-Haunted',
      path: imagePath('elara_dawnwhisper', 'sad'),
      usedIn: ['remembering Conclave complicity', 'failure scenes', 'loss'],
      aiPrompt:
        'Portrait of a haunted young mystic, early twenties, dark skin, silver-white hair '
        + 'limp and dull. Amber eyes dimmed, looking at her own hands as if they are stained. '
        + 'Arcane marks on forearms barely visible, faded. Torn Conclave robe wrapped tight '
        + 'around herself. Huddled posture. Background of empty dark room, single moonbeam. '
        + 'Dark fantasy oil painting, cool blue-grey tones, isolated, the weight of '
        + 'complicity. Young person carrying old guilt.',
      aiNegativePrompt: SHARED_NEGATIVE + ', crying rivers of tears',
      aiParams: {
        style: 'dark fantasy oil painting, somber',
        aspectRatio: '2:3',
        lighting: 'single moonbeam through window, cool blue',
        colorPalette: ['#4A5568', '#6B5B7B', '#3D2B4F', '#5C6670', '#8B6914'],
      },
    },
    {
      pose: 'happy',
      label: 'Wonder',
      path: imagePath('elara_dawnwhisper', 'happy'),
      usedIn: ['discovery moments', 'finding hope', 'friendship scenes'],
      aiPrompt:
        'Portrait of a young mystic with an expression of wonder, early twenties, dark skin '
        + 'glowing warmly, silver-white hair catching golden light. Amber eyes wide and bright '
        + 'with genuine delight, the first real smile she\'s allowed herself in months. Arcane '
        + 'marks shimmering softly, beautifully. A scroll unfurled in her hands, face lit from '
        + 'below by glowing text. Background of warm library, sunset light through window. '
        + 'Dark fantasy oil painting, warm gold and amber, hopeful. The scholar beneath the '
        + 'fugitive.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'dark fantasy oil painting, warm hopeful',
        aspectRatio: '2:3',
        lighting: 'warm sunset through window, glowing scroll',
        colorPalette: ['#D4A76A', '#B8860B', '#8B6914', '#6B5B7B', '#FF8C00'],
      },
    },
    {
      pose: 'determined',
      label: 'Arcane Focus',
      path: imagePath('elara_dawnwhisper', 'determined'),
      usedIn: ['preparing spells', 'research scenes', 'critical decisions'],
      aiPrompt:
        'Portrait of a focused young mystic, early twenties, dark skin, silver-white hair '
        + 'tucked behind ears. Amber eyes narrowed with concentration, a vertical line of '
        + 'focus between her brows. Hands hovering over an ancient tome, arcane marks on '
        + 'forearms glowing steady amber. Torn Conclave robe pushed back from arms. Background '
        + 'of arcane diagrams floating in air around her. Dark fantasy oil painting, amber '
        + 'glow against cool purple, intellectual intensity.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'dark fantasy oil painting, focused intensity',
        aspectRatio: '2:3',
        lighting: 'amber glow from tome and forearm marks',
        colorPalette: ['#B8860B', '#6B5B7B', '#D4A76A', '#3D2B4F', '#8B6914'],
      },
    },
    {
      pose: 'suspicious',
      label: 'Aetheric Sight',
      path: imagePath('elara_dawnwhisper', 'suspicious'),
      usedIn: ['detecting magic', 'sensing danger', 'reading hidden truth'],
      aiPrompt:
        'Portrait of a young mystic using her Aetheric sight, early twenties, dark skin. '
        + 'Amber eyes blazing with inner fire, pupils dilated, seeing something invisible to '
        + 'others. Silver-white hair floating slightly, defying gravity. Arcane marks pulsing '
        + 'in rhythm. One hand raised, palm out, as if reading the air itself. Background '
        + 'showing faint overlay of luminous threads — the Aetheric weave made visible. Dark '
        + 'fantasy oil painting, dual-layer reality, amber sight against normal world.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'dark fantasy oil painting, dual-reality',
        aspectRatio: '2:3',
        lighting: 'amber inner glow, ethereal thread-light',
        colorPalette: ['#D4A76A', '#8B6914', '#6B5B7B', '#B8860B', '#3D2B4F'],
      },
    },
    {
      pose: 'combat',
      label: 'Arcane Strike',
      path: imagePath('elara_dawnwhisper', 'combat'),
      usedIn: ['combat encounters', 'magical defense', 'boss fights'],
      aiPrompt:
        'Action portrait of a young mystic unleashing arcane power, early twenties, dark skin '
        + 'illuminated by amber energy. Silver-white hair whipping upward, eyes fully luminous '
        + 'gold. Both hands thrust forward, streams of amber-gold energy erupting outward. '
        + 'Arcane marks blazing white-hot. Torn Conclave robe billowing. Background of energy '
        + 'distortion, stone cracking, light bending. Dark fantasy oil painting, explosive '
        + 'power, amber and gold energy on dark canvas. Wider framing for energy flow.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'dark fantasy oil painting, explosive energy',
        aspectRatio: '3:4',
        lighting: 'self-illuminated amber energy, radiating outward',
        colorPalette: ['#FFD700', '#B8860B', '#D4A76A', '#3D2B4F', '#1A1008'],
      },
    },
    {
      pose: 'wounded',
      label: 'Magic Burnout',
      path: imagePath('elara_dawnwhisper', 'wounded'),
      usedIn: ['overexertion', 'Aetheric backlash', 'collapse scenes'],
      aiPrompt:
        'Portrait of a young mystic collapsed from magical overexertion, early twenties, '
        + 'dark skin ashen and slicked with sweat. Silver-white hair flat, dull. Amber eyes '
        + 'flickering — bright to dim to bright. Arcane marks on forearms raw and red, as '
        + 'if burned from within. Slumped against wall, scrolls scattered. Nosebleed, single '
        + 'drop of blood. Background blurred, indistinct. Dark fantasy oil painting, '
        + 'desaturated, ember-glow fading. The cost of power.',
      aiNegativePrompt: SHARED_NEGATIVE + ', gore, excessive blood',
      aiParams: {
        style: 'dark fantasy oil painting, fading embers',
        aspectRatio: '2:3',
        lighting: 'dying amber glow from forearm marks, dim',
        colorPalette: ['#5C6670', '#8B6914', '#3A3D42', '#6B5B7B', '#4A3C2A'],
      },
    },
    {
      pose: 'hooded',
      label: 'Fugitive Mystic',
      path: imagePath('elara_dawnwhisper', 'hooded'),
      usedIn: ['hiding from Conclave', 'stealth scenes', 'travel'],
      aiPrompt:
        'Portrait of a hooded young woman, deep grey cowl hiding silver-white hair, only '
        + 'luminous amber eyes and dark skin visible in shadow. Arcane marks carefully '
        + 'wrapped in cloth bandages to hide their glow. Satchel clutched protectively. '
        + 'Background of rain-soaked alley, Conclave hunters in blurred distance. Dark '
        + 'fantasy oil painting, tense, hunted, amber eye-glow the only warmth in cold scene.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'dark fantasy oil painting, hunted',
        aspectRatio: '2:3',
        lighting: 'faint amber eye-glow, cold rain-light',
        colorPalette: ['#3A3D42', '#5C6670', '#8B6914', '#4A5568', '#6B5B7B'],
      },
    },
  ],
};

// ═════════════════════════════════════════════════════════════════
//  7. CAPTAIN THORNE — Iron Throne Military Commander
// ═════════════════════════════════════════════════════════════════

const captainThorne: CharacterImageSet = {
  characterId: 'captain_thorne',
  name: 'Ser Gareth Thorne',
  baseArtDirection:
    'A broad, square-jawed man in his late forties with cropped iron-grey hair and deep-set '
    + 'blue eyes lined with exhaustion. Polished Crownguard plate armor — dark steel with '
    + 'crimson trim. Bastard sword and tower shield. Rigid military posture barely concealing '
    + 'strain. Stern, duty-worn, dark metallics and warm firelight.',
  images: [
    {
      pose: 'portrait',
      label: 'Default Portrait',
      path: imagePath('captain_thorne', 'portrait'),
      usedIn: ['dialogue', 'character profiles', 'Crownguard scenes'],
      aiPrompt:
        'Portrait of a military commander, late forties, broad square jaw, cropped iron-grey '
        + 'hair, deep-set blue eyes heavily lined with exhaustion and sleepless nights. Polished '
        + 'Crownguard plate armor — dark steel with crimson trim and crown insignia on '
        + 'breastplate. Rigid, military bearing, shoulders squared. Stone corridor background, '
        + 'torchlight. Gritty dark fantasy oil painting, stern duty-worn quality, dark metallics '
        + 'and warm firelight on steel. Three-quarter view, soldier\'s composure.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'gritty dark fantasy oil painting, military',
        aspectRatio: '2:3',
        lighting: 'corridor torchlight, warm on polished steel',
        colorPalette: ['#C0C0C0', '#8B0000', '#4A5568', '#2C2416', '#6B7B8D'],
      },
    },
    {
      pose: 'angry',
      label: 'Breaking Point',
      path: imagePath('captain_thorne', 'angry'),
      usedIn: ['moral conflict', 'receiving unjust orders', 'confrontation'],
      aiPrompt:
        'Portrait of a military commander at his breaking point, late forties, square jaw '
        + 'clenched, iron-grey hair. Blue eyes burning with suppressed fury, a vein visible '
        + 'in his temple. Gauntleted fist clenched at side. Crownguard armor, crimson trim. '
        + 'Background of empty barracks, overturned chair. Gritty dark fantasy oil painting, '
        + 'stark harsh light, the strain of a loyal man given unconscionable orders.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'gritty dark fantasy oil painting, strained',
        aspectRatio: '2:3',
        lighting: 'harsh overhead torchlight, stark shadows',
        colorPalette: ['#C0C0C0', '#8B0000', '#4A5568', '#2C2416', '#3A3D42'],
      },
    },
    {
      pose: 'sad',
      label: 'Weight of Duty',
      path: imagePath('captain_thorne', 'sad'),
      usedIn: ['soldiers lost', 'moral compromise', 'remembering Aldric'],
      aiPrompt:
        'Portrait of a weary commander alone after a battle, late forties, square jaw loose, '
        + 'iron-grey hair. Blue eyes staring at gauntlets in his lap — the hands that obeyed '
        + 'orders he knew were wrong. Crownguard armor bloodstained, unbuckled at throat. '
        + 'Seated on a supply crate in empty tent. Single candle guttering. Gritty dark fantasy '
        + 'oil painting, cold blue-grey, isolated, the loneliness of compromised honor.',
      aiNegativePrompt: SHARED_NEGATIVE + ', crying, melodramatic',
      aiParams: {
        style: 'gritty dark fantasy oil painting, weary',
        aspectRatio: '2:3',
        lighting: 'single guttering candle, cold ambient',
        colorPalette: ['#4A5568', '#6B7B8D', '#C0C0C0', '#3A3D42', '#2D3748'],
      },
    },
    {
      pose: 'determined',
      label: 'Officer\'s Resolve',
      path: imagePath('captain_thorne', 'determined'),
      usedIn: ['choosing Aldric\'s side', 'leading charge', 'key decisions'],
      aiPrompt:
        'Portrait of a commander who has made his decision, late forties, square jaw set like '
        + 'iron, iron-grey hair. Blue eyes clear for the first time — the doubt is gone, '
        + 'replaced by absolute resolve. Crownguard armor polished, sword drawn and held '
        + 'vertically before his face in a knight\'s salute. Background of dawn light through '
        + 'castle gate. Gritty dark fantasy oil painting, cold steel with warm dawn, the '
        + 'moment a soldier chooses conscience over crown.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'gritty dark fantasy oil painting, resolute',
        aspectRatio: '2:3',
        lighting: 'dawn light through gateway, rim-lit armor',
        colorPalette: ['#C0C0C0', '#B8860B', '#4A5568', '#8B0000', '#D4A76A'],
      },
    },
    {
      pose: 'suspicious',
      label: 'Intelligence Report',
      path: imagePath('captain_thorne', 'suspicious'),
      usedIn: ['reviewing evidence', 'doubting orders', 'secret investigations'],
      aiPrompt:
        'Portrait of a commander reading a dispatch with narrowed eyes, late forties, square '
        + 'jaw, iron-grey hair. Blue eyes sharp and analytical over the edge of a folded '
        + 'letter. One eyebrow raised. Crownguard armor, behind a desk with a map and candle. '
        + 'Background of dimly lit command post. Gritty dark fantasy oil painting, desk-lamp '
        + 'atmosphere, a soldier who thinks more than his superiors prefer.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'gritty dark fantasy oil painting',
        aspectRatio: '2:3',
        lighting: 'desk candle, focused reading light',
        colorPalette: ['#C0C0C0', '#4A5568', '#2C2416', '#6B7B8D', '#8B0000'],
      },
    },
    {
      pose: 'combat',
      label: 'Shield Wall',
      path: imagePath('captain_thorne', 'combat'),
      usedIn: ['combat encounters', 'boss fights', 'defensive stands'],
      aiPrompt:
        'Action portrait of a commander behind a raised tower shield, late forties, square '
        + 'jaw visible over shield rim, iron-grey hair. Blue eyes locked on target with '
        + 'professional lethal calm. Bastard sword poised over shield top for counterstrike. '
        + 'Crownguard plate catching impact sparks. Background of castle courtyard battle, '
        + 'soldiers fighting in formation. Gritty dark fantasy oil painting, dynamic defensive '
        + 'stance, steel and fire, professional violence. Wider framing for shield.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'gritty dark fantasy oil painting, military action',
        aspectRatio: '3:4',
        lighting: 'battle fire, steel sparks, torchlight',
        colorPalette: ['#C0C0C0', '#8B0000', '#FF6B35', '#4A5568', '#2C2416'],
      },
    },
    {
      pose: 'formal',
      label: 'Crownguard Captain',
      path: imagePath('captain_thorne', 'formal'),
      usedIn: ['court scenes', 'official duty', 'standing guard'],
      aiPrompt:
        'Formal portrait of a Crownguard captain at attention, late forties, square jaw, '
        + 'iron-grey hair, blue eyes forward. Full ceremonial Crownguard plate armor — dark '
        + 'steel polished to mirror finish, crimson cloak, crown insignia gleaming. Bastard '
        + 'sword sheathed, hands on tower shield planted before him. Background of throne room '
        + 'pillar, crimson banner. Gritty dark fantasy oil painting, formal military bearing, '
        + 'immaculate steel, the ideal soldier.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'gritty dark fantasy oil painting, formal military',
        aspectRatio: '2:3',
        lighting: 'throne room chandelier, formal even light',
        colorPalette: ['#C0C0C0', '#8B0000', '#4A5568', '#B8860B', '#2C2416'],
      },
    },
    {
      pose: 'wounded',
      label: 'Last Stand',
      path: imagePath('captain_thorne', 'wounded'),
      usedIn: ['sacrifice scene', 'defeat', 'holding the line'],
      aiPrompt:
        'Portrait of a wounded commander making a last stand, late forties, square jaw set '
        + 'through pain, iron-grey hair matted with blood and sweat. Blue eyes fierce despite '
        + 'a cut above one eye. Crownguard armor battered, breastplate cracked. Leaning on '
        + 'bastard sword planted in ground, shield arm hanging broken. Background of burning '
        + 'gatehouse, smoke and embers. Gritty dark fantasy oil painting, heroic last-stand '
        + 'composition, fire and broken steel.',
      aiNegativePrompt: SHARED_NEGATIVE + ', gore, excessive blood',
      aiParams: {
        style: 'gritty dark fantasy oil painting, heroic',
        aspectRatio: '2:3',
        lighting: 'fire from burning building, smoke-filtered',
        colorPalette: ['#C0C0C0', '#8B0000', '#FF6B35', '#4A5568', '#3A3D42'],
      },
    },
  ],
};

// ═════════════════════════════════════════════════════════════════
//  8. NYX — Companion (Obsidian Guild Information Broker)
// ═════════════════════════════════════════════════════════════════

const nyx: CharacterImageSet = {
  characterId: 'nyx',
  name: 'Nyx',
  baseArtDirection:
    'An androgynous figure of indeterminate age with sharp features, a knowing smirk, and '
    + 'dark eyes that catch candlelight like a cat\'s. Hooded leather coat over dark practical '
    + 'clothing, hidden pockets, thin dagger at wrist. Half-face in shadow. Noir aesthetic — '
    + 'deep shadows, warm amber highlights, roguish and dangerous.',
  images: [
    {
      pose: 'portrait',
      label: 'Default Portrait',
      path: imagePath('nyx', 'portrait'),
      usedIn: ['dialogue', 'character profiles', 'companion screen'],
      aiPrompt:
        'Portrait of an androgynous figure of indeterminate age, sharp angular features, '
        + 'knowing smirk playing at thin lips. Dark eyes catching candlelight like a cat\'s — '
        + 'reflective, predatory, amused. Hooded leather coat over dark practical clothing, '
        + 'multiple hidden pockets visible at chest. Thin dagger glinting at wrist. Half their '
        + 'face in shadow, half in warm amber light. Background of smoky tavern, blurred '
        + 'figures. Noir dark fantasy oil painting, deep shadows, warm amber highlights, '
        + 'roguish and dangerous. Three-quarter view.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'noir dark fantasy oil painting, roguish',
        aspectRatio: '2:3',
        lighting: 'half-face candlelight, smoky tavern amber',
        colorPalette: ['#1A1008', '#B8860B', '#2C2416', '#4A3C2A', '#D4A76A'],
      },
    },
    {
      pose: 'angry',
      label: 'Mask Off',
      path: imagePath('nyx', 'angry'),
      usedIn: ['betrayal discovered', 'protective fury', 'genuine emotion'],
      aiPrompt:
        'Portrait of an androgynous figure with their mask of amusement shattered, sharp '
        + 'features contorted with genuine rage — a rare and terrifying sight. Dark eyes '
        + 'completely flat, predator\'s eyes. Thin dagger drawn and held in reverse grip. '
        + 'Leather coat open, multiple concealed blades visible. Background of alley, rain, '
        + 'darkness. Noir dark fantasy oil painting, cold, stripped of all charm. The real '
        + 'person beneath the performance.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'noir dark fantasy oil painting, dangerous',
        aspectRatio: '2:3',
        lighting: 'cold rain-light, blade reflections only',
        colorPalette: ['#0A0A0A', '#C0C0C0', '#1A1008', '#2C2416', '#3A3D42'],
      },
    },
    {
      pose: 'sad',
      label: 'Unwitnessed Grief',
      path: imagePath('nyx', 'sad'),
      usedIn: ['secret vulnerability', 'loss of contact', 'rare genuine moment'],
      aiPrompt:
        'Portrait of an androgynous figure in a rare moment of genuine vulnerability, sharp '
        + 'features softened, smirk gone. Dark eyes distant, looking at a small personal '
        + 'token — a coin, a button, something meaningless to anyone else. Leather coat pulled '
        + 'tight. Alone on a rooftop at night. Background of starless city sky. Noir dark '
        + 'fantasy oil painting, cold blues, isolated, intimate. The grief Nyx would kill you '
        + 'for witnessing.',
      aiNegativePrompt: SHARED_NEGATIVE + ', crying, melodramatic',
      aiParams: {
        style: 'noir dark fantasy oil painting, intimate vulnerability',
        aspectRatio: '2:3',
        lighting: 'distant city lights below, cold starlight',
        colorPalette: ['#2D3748', '#4A5568', '#1A1008', '#6B7B8D', '#5C6670'],
      },
    },
    {
      pose: 'happy',
      label: 'Chaos Grin',
      path: imagePath('nyx', 'happy'),
      usedIn: ['successful scheme', 'enjoying danger', 'gleeful mischief'],
      aiPrompt:
        'Portrait of an androgynous figure with a wide, dangerous grin, sharp features lit '
        + 'with genuine delight at something going spectacularly wrong for someone else. Dark '
        + 'eyes sparkling with mischief and glee. Leather coat, leaning against a doorframe '
        + 'with arms crossed. Background of something burning or chaotic, reflected in their '
        + 'eyes. Noir dark fantasy oil painting, warm amber chaos-light, infectious dangerous '
        + 'energy. The person who set the fire, enjoying the warmth.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'noir dark fantasy oil painting, mischievous',
        aspectRatio: '2:3',
        lighting: 'warm fire-glow reflected in eyes, amber',
        colorPalette: ['#B8860B', '#FF6B35', '#1A1008', '#D4A76A', '#2C2416'],
      },
    },
    {
      pose: 'determined',
      label: 'Professional',
      path: imagePath('nyx', 'determined'),
      usedIn: ['planning heist', 'serious mission', 'dropping the act'],
      aiPrompt:
        'Portrait of an androgynous figure in full professional mode, sharp features set with '
        + 'quiet, lethal competence. Dark eyes focused and calculating, no smirk — this is the '
        + 'real Nyx, the professional. Hands laying out tools — lockpicks, coded messages, '
        + 'vials — on a dark cloth. Leather coat, hood down. Background of safe-house table, '
        + 'single candle. Noir dark fantasy oil painting, tight focus, methodical, the artisan '
        + 'at work.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'noir dark fantasy oil painting, professional',
        aspectRatio: '2:3',
        lighting: 'single candle, tools catching light',
        colorPalette: ['#1A1008', '#C0C0C0', '#B8860B', '#2C2416', '#4A3C2A'],
      },
    },
    {
      pose: 'suspicious',
      label: 'I Know Something',
      path: imagePath('nyx', 'suspicious'),
      usedIn: ['withholding information', 'testing loyalty', 'broker mode'],
      aiPrompt:
        'Portrait of an androgynous figure with one eyebrow raised and a smirk that says "I '
        + 'know exactly what you did." Sharp features, dark eyes glinting with barely concealed '
        + 'knowledge. Chin tilted, looking slightly down — a position of informational '
        + 'superiority. Leather coat, shadow-drenched. Background pitch black. Noir dark '
        + 'fantasy oil painting, extreme close-up, maximum smugness, single amber candle '
        + 'highlight on knowing expression.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'noir dark fantasy oil painting, knowing',
        aspectRatio: '2:3',
        lighting: 'single amber highlight from below-right',
        colorPalette: ['#0A0A0A', '#B8860B', '#1A1008', '#D4A76A', '#2C2416'],
      },
    },
    {
      pose: 'combat',
      label: 'Shadow Strike',
      path: imagePath('nyx', 'combat'),
      usedIn: ['combat encounters', 'assassination', 'ambush'],
      aiPrompt:
        'Action portrait of an androgynous figure mid-strike from shadow, sharp features half '
        + 'visible in motion blur. Dark eyes locked on target with predatory focus. Twin thin '
        + 'daggers drawn, one thrust forward, one guard position. Leather coat flaring with '
        + 'movement, hidden blades glinting. Background of darkness with single light source '
        + 'behind target (silhouette). Noir dark fantasy oil painting, dynamic stealth-strike, '
        + 'shadow and steel, lethal grace. Wider framing for action.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'noir dark fantasy oil painting, dynamic stealth',
        aspectRatio: '3:4',
        lighting: 'backlit target silhouette, blade glints only',
        colorPalette: ['#0A0A0A', '#C0C0C0', '#1A1008', '#B8860B', '#2C2416'],
      },
    },
    {
      pose: 'hooded',
      label: 'Deep Cover',
      path: imagePath('nyx', 'hooded'),
      usedIn: ['espionage', 'intelligence gathering', 'disguise'],
      aiPrompt:
        'Portrait of a completely anonymous hooded figure, face entirely hidden in deep shadow '
        + 'of leather hood. Only a faint glint of dark eyes visible. Nondescript dark clothing, '
        + 'nothing identifying — could be anyone. Standing in a crowd, utterly forgettable. '
        + 'Background of busy market, faces blurred. Noir dark fantasy oil painting, anonymous, '
        + 'invisible. The most dangerous person in the room is the one no one notices.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'noir dark fantasy oil painting, anonymous',
        aspectRatio: '2:3',
        lighting: 'ambient market light, deliberately flat',
        colorPalette: ['#3A3D42', '#5C6670', '#4A3C2A', '#2C2416', '#6B5B3E'],
      },
    },
    {
      pose: 'wounded',
      label: 'Caught',
      path: imagePath('nyx', 'wounded'),
      usedIn: ['captured', 'injured during mission', 'cover blown'],
      aiPrompt:
        'Portrait of an androgynous figure who has been caught, sharp features showing pain '
        + 'and — for the first time — fear. Dark eyes wide, calculating escape routes even '
        + 'now. Leather coat torn, a visible wound on the arm, blood on fingers that still '
        + 'grip a broken dagger. Pressed against an alley wall. Background of pursuit '
        + 'torchlight approaching. Noir dark fantasy oil painting, trapped animal energy, '
        + 'amber torchlight on cornered rogue.',
      aiNegativePrompt: SHARED_NEGATIVE + ', gore, excessive blood',
      aiParams: {
        style: 'noir dark fantasy oil painting, cornered',
        aspectRatio: '2:3',
        lighting: 'approaching torchlight, amber on desperation',
        colorPalette: ['#1A1008', '#B8860B', '#8B2500', '#2C2416', '#FF6B35'],
      },
    },
  ],
};

// ═════════════════════════════════════════════════════════════════
//  9. BROTHER CEDRIC — Companion (Verdant Pact Healer)
// ═════════════════════════════════════════════════════════════════

const brotherCedric: CharacterImageSet = {
  characterId: 'brother_cedric',
  name: 'Cedric of Thornwatch',
  baseArtDirection:
    'A tall, lean man in his fifties with a shaved head, warm brown skin, and deep laugh '
    + 'lines around calm dark eyes. Simple brown robes with green sash. Leather satchel of '
    + 'herbs and bandages. Large scarred gentle hands. Druidic vine tattoo on left forearm. '
    + 'Warm, grounded — earth tones, natural light, peaceful intensity.',
  images: [
    {
      pose: 'portrait',
      label: 'Default Portrait',
      path: imagePath('brother_cedric', 'portrait'),
      usedIn: ['dialogue', 'character profiles', 'companion screen'],
      aiPrompt:
        'Portrait of a tall, lean healer-monk, fifties, shaved head, warm brown skin with '
        + 'deep laugh lines around calm, kind dark eyes. Simple brown robes with a green sash '
        + 'at waist. Leather satchel visible at hip, stuffed with herbs and bandage rolls. '
        + 'Large hands, scarred from old battles, held in a gentle, open posture. Faint '
        + 'druidic vine tattoo visible on left forearm. Expression of serene compassion. '
        + 'Background of forest clearing, soft dappled green light. Warm dark fantasy oil '
        + 'painting, earth tones, natural light, peaceful intensity. Three-quarter view.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'warm dark fantasy oil painting, serene',
        aspectRatio: '2:3',
        lighting: 'soft dappled forest light, warm green',
        colorPalette: ['#6B5B3E', '#4A6B2A', '#8B7355', '#2D4A1A', '#D4A76A'],
      },
    },
    {
      pose: 'angry',
      label: 'Quiet Wrath',
      path: imagePath('brother_cedric', 'angry'),
      usedIn: ['witnessing cruelty', 'protecting the helpless', 'moral confrontation'],
      aiPrompt:
        'Portrait of a healer-monk in terrifying quiet anger, fifties, shaved head, brown '
        + 'skin. Dark eyes hard as stone — not the fury of a warrior but the implacable '
        + 'judgment of a man who has seen too much suffering caused by other men. Jaw set, '
        + 'lips thin. Large scarred hands clenched at sides but still empty — he will not '
        + 'pick up a weapon. Green sash visible, brown robes. Background of smoke and '
        + 'aftermath. Warm dark fantasy oil painting, contrast of gentle man with terrible '
        + 'intensity. The anger that whispers.',
      aiNegativePrompt: SHARED_NEGATIVE + ', shouting, wielding weapon',
      aiParams: {
        style: 'warm dark fantasy oil painting, intense quiet',
        aspectRatio: '2:3',
        lighting: 'harsh sidelight, smoke-filtered',
        colorPalette: ['#6B5B3E', '#3A3D42', '#4A6B2A', '#2C2416', '#8B7355'],
      },
    },
    {
      pose: 'sad',
      label: 'Vigil',
      path: imagePath('brother_cedric', 'sad'),
      usedIn: ['tending dying', 'loss of patient', 'remembering Thornwatch'],
      aiPrompt:
        'Portrait of a healer-monk keeping vigil over an unseen patient, fifties, shaved '
        + 'head bowed, brown skin. Dark eyes soft with sorrow and tenderness. Large scarred '
        + 'hands holding a dying candle — symbol of a life he could not save. Brown robes, '
        + 'green sash. Kneeling posture. Background of sickroom, dawn light barely touching '
        + 'the window. Warm dark fantasy oil painting, soft golden-grey tones, grief without '
        + 'despair. A man who mourns but does not break.',
      aiNegativePrompt: SHARED_NEGATIVE + ', crying dramatically',
      aiParams: {
        style: 'warm dark fantasy oil painting, vigil',
        aspectRatio: '2:3',
        lighting: 'dying candle and grey dawn, soft transitions',
        colorPalette: ['#6B5B3E', '#5C6670', '#8B7355', '#D4A76A', '#4A5568'],
      },
    },
    {
      pose: 'happy',
      label: 'Simple Joy',
      path: imagePath('brother_cedric', 'happy'),
      usedIn: ['healing success', 'sharing a meal', 'nature appreciation'],
      aiPrompt:
        'Portrait of a healer-monk with a wide, warm smile, fifties, shaved head tilted '
        + 'back slightly, brown skin glowing in sunlight. Dark eyes crinkled with genuine joy, '
        + 'laugh lines deepening. Holding a freshly baked loaf of bread in large gentle hands, '
        + 'or a wild flower. Brown robes, green sash. Background of sunlit meadow, wildflowers. '
        + 'Warm dark fantasy oil painting, golden sunlight, the simple pleasure of being alive. '
        + 'A man who finds wonder in bread and birdsong.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'warm dark fantasy oil painting, joyful',
        aspectRatio: '2:3',
        lighting: 'full golden sunlight, warm and open',
        colorPalette: ['#D4A76A', '#B8860B', '#4A6B2A', '#8B7355', '#FFD700'],
      },
    },
    {
      pose: 'determined',
      label: 'Healer\'s Oath',
      path: imagePath('brother_cedric', 'determined'),
      usedIn: ['refusing to abandon patients', 'standing ground', 'moral clarity'],
      aiPrompt:
        'Portrait of a healer-monk standing firm, fifties, shaved head, brown skin. Dark '
        + 'eyes steady with absolute moral certainty. Large scarred hands held out, palms up '
        + '— empty, unarmed, and utterly unafraid. Brown robes, green sash. Standing between '
        + 'something unseen (the viewer/threat) and something behind him (the wounded). '
        + 'Background of battlefield triage area. Warm dark fantasy oil painting, the courage '
        + 'of a man who fights with compassion.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'warm dark fantasy oil painting, resolute compassion',
        aspectRatio: '2:3',
        lighting: 'overcast, even light, unflinching',
        colorPalette: ['#6B5B3E', '#4A6B2A', '#8B7355', '#5C6670', '#2D4A1A'],
      },
    },
    {
      pose: 'suspicious',
      label: 'Quiet Observation',
      path: imagePath('brother_cedric', 'suspicious'),
      usedIn: ['reading a person', 'sensing dishonesty', 'moral judgment'],
      aiPrompt:
        'Portrait of a healer-monk studying someone with quiet, penetrating attention, '
        + 'fifties, shaved head, brown skin. Dark eyes calm but searching — the gaze of a '
        + 'man who has treated enough wounded liars to know when someone\'s pain is real and '
        + 'when it\'s performed. Head slightly tilted. Brown robes. Background of herb-drying '
        + 'room, bundles of plants. Warm dark fantasy oil painting, gentle light, deceptive '
        + 'mildness masking deep perception.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'warm dark fantasy oil painting, perceptive',
        aspectRatio: '2:3',
        lighting: 'warm ambient herb-room light',
        colorPalette: ['#6B5B3E', '#4A6B2A', '#8B7355', '#D4A76A', '#2D4A1A'],
      },
    },
    {
      pose: 'combat',
      label: 'Battlefield Healer',
      path: imagePath('brother_cedric', 'combat'),
      usedIn: ['combat support', 'healing during battle', 'triage under fire'],
      aiPrompt:
        'Action portrait of a healer-monk working under fire, fifties, shaved head, brown '
        + 'skin streaked with others\' blood. Dark eyes focused on his work — not the '
        + 'surrounding combat. Large scarred hands pressing bandages to an unseen wound. '
        + 'Brown robes hitched up, green sash torn for bandages. Background of battle chaos — '
        + 'blurred swords, fire, running figures — but he is an island of calm. Warm dark '
        + 'fantasy oil painting, sharp foreground focus against chaotic blur, the stillness '
        + 'at the center of violence.',
      aiNegativePrompt: SHARED_NEGATIVE + ', wielding weapon, fighting',
      aiParams: {
        style: 'warm dark fantasy oil painting, focus amidst chaos',
        aspectRatio: '3:4',
        lighting: 'battle fire ambient, focused on healing hands',
        colorPalette: ['#6B5B3E', '#8B2500', '#4A6B2A', '#FF6B35', '#8B7355'],
      },
    },
    {
      pose: 'wounded',
      label: 'Healer Broken',
      path: imagePath('brother_cedric', 'wounded'),
      usedIn: ['injured protecting others', 'unable to heal self', 'vulnerability'],
      aiPrompt:
        'Portrait of a wounded healer-monk, fifties, shaved head, brown skin ashen. Dark '
        + 'eyes looking at his own injured hands — the tools of his trade, now damaged. Brown '
        + 'robes bloodstained at the shoulder. Seated, herbs and bandages scattered around '
        + 'him — he has used them all on others, none left for himself. Background of empty '
        + 'triage tent. Warm dark fantasy oil painting, soft light, the cruel irony of the '
        + 'healer who cannot heal himself.',
      aiNegativePrompt: SHARED_NEGATIVE + ', gore, excessive blood',
      aiParams: {
        style: 'warm dark fantasy oil painting, vulnerable',
        aspectRatio: '2:3',
        lighting: 'soft tent-filtered light, grey warmth',
        colorPalette: ['#6B5B3E', '#5C6670', '#8B7355', '#8B2500', '#4A6B2A'],
      },
    },
    {
      pose: 'hooded',
      label: 'Wandering Monk',
      path: imagePath('brother_cedric', 'hooded'),
      usedIn: ['travelling', 'entering war zones', 'neutral passage'],
      aiPrompt:
        'Portrait of a hooded monk on the road, brown cowl up against rain, warm brown skin '
        + 'barely visible. Dark eyes serene even in bad weather. Simple brown robes, satchel '
        + 'of herbs on back, walking staff in hand. Green sash visible beneath cloak. '
        + 'Background of muddy road between battlefields, distant smoke. Warm dark fantasy oil '
        + 'painting, rain-grey with warm earth undertones. A man who walks toward suffering, '
        + 'not away from it.',
      aiNegativePrompt: SHARED_NEGATIVE,
      aiParams: {
        style: 'warm dark fantasy oil painting, pilgrim',
        aspectRatio: '2:3',
        lighting: 'overcast rain-light, muted warmth',
        colorPalette: ['#6B5B3E', '#5C6670', '#4A6B2A', '#3A3D42', '#8B7355'],
      },
    },
  ],
};

// ═════════════════════════════════════════════════════════════════
//  MASTER REGISTRY — All Character Image Sets
// ═════════════════════════════════════════════════════════════════

export const characterImageSets: CharacterImageSet[] = [
  aldricVane,
  queenIsolde,
  highSeerMalachar,
  rowanGreenmantle,
  sylasAshford,
  elaraDawnwhisper,
  captainThorne,
  nyx,
  brotherCedric,
];

// ── Lookup Utilities ─────────────────────────────────────────────

/** Get all images for a specific character */
export function getCharacterImages(characterId: string): CharacterImage[] {
  const set = characterImageSets.find(s => s.characterId === characterId);
  return set?.images ?? [];
}

/** Get a specific pose image for a character */
export function getCharacterImage(
  characterId: string,
  pose: CharacterPose,
): CharacterImage | undefined {
  const images = getCharacterImages(characterId);
  return images.find(img => img.pose === pose);
}

/** Get the image path for a character's specific pose, with fallback to portrait */
export function getCharacterImagePath(
  characterId: string,
  pose: CharacterPose = 'portrait',
): string {
  const img = getCharacterImage(characterId, pose);
  if (img) return img.path;
  // Fallback to portrait
  const portrait = getCharacterImage(characterId, 'portrait');
  return portrait?.path ?? `/images/characters/unknown_portrait.svg`;
}

/** Get the base art direction for a character (useful for AI batch generation) */
export function getCharacterArtDirection(characterId: string): string {
  const set = characterImageSets.find(s => s.characterId === characterId);
  return set?.baseArtDirection ?? '';
}

/** Get all AI prompts for batch generation */
export function getAllAiPrompts(): Array<{
  characterId: string;
  characterName: string;
  pose: CharacterPose;
  prompt: string;
  negativePrompt: string;
  params: CharacterImage['aiParams'];
}> {
  return characterImageSets.flatMap(set =>
    set.images.map(img => ({
      characterId: set.characterId,
      characterName: set.name,
      pose: img.pose,
      prompt: img.aiPrompt,
      negativePrompt: img.aiNegativePrompt,
      params: img.aiParams,
    })),
  );
}

/** Total image count */
export const TOTAL_CHARACTER_IMAGES = characterImageSets.reduce(
  (sum, set) => sum + set.images.length,
  0,
);
