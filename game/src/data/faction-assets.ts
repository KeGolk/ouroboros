import type { FactionId } from '../types/factions';

/**
 * ═══════════════════════════════════════════════════════════════════
 *  FACTION VISUAL ASSETS — Placeholder Image Prompts & Metadata
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Each entry represents a pre-generated placeholder image used in the
 *  game UI. The `artPrompt` field contains the AI generation prompt so
 *  that images can be regenerated or refined later. The `placeholder`
 *  field describes a simple CSS gradient/color fallback used until real
 *  assets are produced.
 *
 *  Asset categories:
 *    • emblem       — Faction crest / coat of arms (square, icon-sized)
 *    • banner       — Tall vertical flag / standard (portrait ratio)
 *    • propaganda   — In-world poster / proclamation (portrait or square)
 *    • background   — Full-width scene backdrop (landscape, 16:9)
 *    • seal         — Official wax seal / stamp (square, small)
 *    • territory    — Territory / location scenic (landscape)
 *    • war_banner   — Battle standard / rallying flag (landscape)
 *
 *  Total: 56 assets (14 per faction)
 * ═══════════════════════════════════════════════════════════════════
 */

// ──────────────────────────────────────────────
//  TYPES
// ──────────────────────────────────────────────

export type FactionAssetCategory =
  | 'emblem'
  | 'banner'
  | 'propaganda'
  | 'background'
  | 'seal'
  | 'territory'
  | 'war_banner';

export interface FactionAsset {
  /** Unique identifier for this asset */
  id: string;
  /** Which faction this asset belongs to */
  factionId: FactionId;
  /** Asset category */
  category: FactionAssetCategory;
  /** Human-readable label for UI/editor */
  label: string;
  /** Recommended aspect ratio: 'square' | 'portrait' | 'landscape' */
  aspectRatio: 'square' | 'portrait' | 'landscape';
  /** Recommended render dimensions (px) */
  dimensions: { width: number; height: number };
  /** AI art-generation prompt — detailed enough for Midjourney / SDXL */
  artPrompt: string;
  /** CSS gradient or solid color used as placeholder until image exists */
  placeholderCSS: string;
  /** Optional path to a generated image file (filled in once generated) */
  imagePath?: string;
  /** Tags for filtering/search */
  tags: string[];
}

// ──────────────────────────────────────────────
//  STYLE CONSTANTS  (shared prompt fragments)
// ──────────────────────────────────────────────

const STYLE_BASE =
  'Dark gritty medieval fantasy, Game of Thrones aesthetic, muted desaturated palette, '
  + 'parchment and stone textures, oil-painting brushwork, dramatic chiaroscuro lighting.';

const STYLE_IRON =
  'Color palette dominated by dark crimson (#8B0000), steel silver (#C0C0C0), and charcoal black. '
  + 'Motifs: crossed swords, iron crowns, war helms, fortress battlements. ' + STYLE_BASE;

const STYLE_ASHEN =
  'Color palette dominated by ashen violet (#4A4A6A), antiqued gold (#D4AF37), and grey. '
  + 'Motifs: open tomes, glowing glyphs, hourglass, all-seeing eye, quill and ink. ' + STYLE_BASE;

const STYLE_VERDANT =
  'Color palette dominated by forest green (#2E5D34), bark brown (#8B6914), and moss. '
  + 'Motifs: oak leaves, antlers, standing stones, woven vines, druidic spirals. ' + STYLE_BASE;

const STYLE_OBSIDIAN =
  'Color palette dominated by obsidian dark (#1C1C2E), gold (#FFD700), and midnight blue. '
  + 'Motifs: coiled serpent, merchant scales, skeleton keys, coins, daggers. ' + STYLE_BASE;

// ──────────────────────────────────────────────
//  IRON THRONE ASSETS (14)
// ──────────────────────────────────────────────

const ironThroneAssets: FactionAsset[] = [
  // ── Emblems ──
  {
    id: 'iron_emblem_primary',
    factionId: 'ironThrone',
    category: 'emblem',
    label: 'Iron Throne Primary Emblem',
    aspectRatio: 'square',
    dimensions: { width: 512, height: 512 },
    artPrompt:
      'A heraldic coat of arms featuring two crossed longswords behind a heavy iron crown, '
      + 'set on a crimson shield bordered with hammered steel rivets. Weathered metal texture, '
      + 'blood-red enamel inlay, scratches and battle damage visible. ' + STYLE_IRON,
    placeholderCSS:
      'radial-gradient(circle at 50% 40%, #C0C0C0 0%, #8B0000 45%, #2a0000 100%)',
    tags: ['emblem', 'crest', 'heraldry', 'iron', 'swords', 'crown'],
  },
  {
    id: 'iron_emblem_military',
    factionId: 'ironThrone',
    category: 'emblem',
    label: 'Iron Throne Military Insignia',
    aspectRatio: 'square',
    dimensions: { width: 256, height: 256 },
    artPrompt:
      'A circular military insignia stamped in steel: a gauntleted fist clutching a '
      + 'lightning bolt, encircled by a laurel wreath of iron thorns. Engraved metal texture '
      + 'on a crimson field. ' + STYLE_IRON,
    placeholderCSS:
      'radial-gradient(circle, #C0C0C0 0%, #8B0000 70%)',
    tags: ['emblem', 'insignia', 'military', 'fist', 'steel'],
  },

  // ── Banners ──
  {
    id: 'iron_banner_great_hall',
    factionId: 'ironThrone',
    category: 'banner',
    label: 'Great Hall War Banner',
    aspectRatio: 'portrait',
    dimensions: { width: 512, height: 1024 },
    artPrompt:
      'A tall crimson war banner hanging in a stone great hall, bearing the Iron Throne '
      + 'crossed-swords sigil in silver thread. The fabric is heavy velvet, frayed at the '
      + 'edges with soot stains from torchlight. Iron rings attach it to a dark wooden beam. '
      + STYLE_IRON,
    placeholderCSS:
      'linear-gradient(180deg, #5a0000 0%, #8B0000 30%, #8B0000 70%, #3a0000 100%)',
    tags: ['banner', 'flag', 'great_hall', 'velvet', 'war'],
  },
  {
    id: 'iron_banner_battlefield',
    factionId: 'ironThrone',
    category: 'war_banner',
    label: 'Battlefield Standard',
    aspectRatio: 'landscape',
    dimensions: { width: 1024, height: 512 },
    artPrompt:
      'A tattered battlefield standard planted in muddy, blood-soaked ground. The crimson '
      + 'flag with the crossed-swords emblem whips in a stormy wind. Broken weapons and '
      + 'fallen soldiers surround it. Smoke rises in the background. ' + STYLE_IRON,
    placeholderCSS:
      'linear-gradient(135deg, #3a0000 0%, #8B0000 50%, #C0C0C0 100%)',
    tags: ['war_banner', 'battlefield', 'standard', 'tattered', 'storm'],
  },

  // ── Propaganda ──
  {
    id: 'iron_propaganda_conscription',
    factionId: 'ironThrone',
    category: 'propaganda',
    label: 'Conscription Proclamation',
    aspectRatio: 'portrait',
    dimensions: { width: 512, height: 720 },
    artPrompt:
      'A weathered parchment proclamation nailed to a wooden post. Bold blackletter text '
      + 'reads "SERVE THE THRONE — PROTECT THE REALM". A woodcut illustration of a knight '
      + 'on horseback leading peasant soldiers. Red wax seal at the bottom. Torn edges, '
      + 'rain-stained. ' + STYLE_IRON,
    placeholderCSS:
      'linear-gradient(180deg, #d4c4a0 0%, #b8a080 50%, #8B0000 95%)',
    tags: ['propaganda', 'poster', 'conscription', 'parchment', 'woodcut'],
  },
  {
    id: 'iron_propaganda_order',
    factionId: 'ironThrone',
    category: 'propaganda',
    label: 'Order Through Strength Poster',
    aspectRatio: 'square',
    dimensions: { width: 512, height: 512 },
    artPrompt:
      'A stylized propaganda poster with an iron-helmed knight standing over a crumbling '
      + 'city. Text banner reads "ORDER THROUGH STRENGTH". Stark red and silver palette, '
      + 'blocky woodcut style reminiscent of Soviet constructivism adapted to medieval '
      + 'aesthetics. ' + STYLE_IRON,
    placeholderCSS:
      'linear-gradient(180deg, #C0C0C0 0%, #8B0000 100%)',
    tags: ['propaganda', 'poster', 'motto', 'knight', 'constructivism'],
  },

  // ── Backgrounds ──
  {
    id: 'iron_bg_throne_room',
    factionId: 'ironThrone',
    category: 'background',
    label: 'Ironhold Throne Room',
    aspectRatio: 'landscape',
    dimensions: { width: 1920, height: 1080 },
    artPrompt:
      'Interior of a vast stone throne room. A massive iron throne forged from melted '
      + 'swords sits on a raised dais. Crimson banners hang from vaulted ceilings. Shafts '
      + 'of dusty light stream through narrow slit windows. Armed guards in plate armor '
      + 'flank the entrance. Cold, austere, intimidating. ' + STYLE_IRON,
    placeholderCSS:
      'linear-gradient(180deg, #1a0000 0%, #3a0a0a 30%, #8B0000 60%, #1a0000 100%)',
    tags: ['background', 'throne_room', 'interior', 'ironhold', 'fortress'],
  },
  {
    id: 'iron_bg_war_camp',
    factionId: 'ironThrone',
    category: 'background',
    label: 'Military War Camp',
    aspectRatio: 'landscape',
    dimensions: { width: 1920, height: 1080 },
    artPrompt:
      'A sprawling military encampment at dusk. Rows of canvas tents with crimson pennants. '
      + 'Soldiers sharpen weapons around campfires. A command tent with a war table is visible '
      + 'in the center. The silhouette of Ironhold Citadel looms on a distant hill. '
      + 'Smoke, orange firelight, and grey sky. ' + STYLE_IRON,
    placeholderCSS:
      'linear-gradient(180deg, #4a3020 0%, #8B0000 40%, #1a0000 100%)',
    tags: ['background', 'war_camp', 'exterior', 'dusk', 'soldiers', 'campfire'],
  },
  {
    id: 'iron_bg_battlements',
    factionId: 'ironThrone',
    category: 'background',
    label: 'Blackwall Keep Battlements',
    aspectRatio: 'landscape',
    dimensions: { width: 1920, height: 1080 },
    artPrompt:
      'View from the top of massive stone battlements overlooking a barren, war-scarred '
      + 'landscape. Iron Throne banners whip in a cold wind. Siege equipment (catapults, '
      + 'ballistae) line the wall. Storm clouds gather on the horizon. A lone sentinel '
      + 'stands watch. ' + STYLE_IRON,
    placeholderCSS:
      'linear-gradient(180deg, #4a4a5a 0%, #8B0000 30%, #2a2a2a 70%, #1a0000 100%)',
    tags: ['background', 'battlements', 'fortress', 'exterior', 'storm'],
  },

  // ── Seals ──
  {
    id: 'iron_seal_royal',
    factionId: 'ironThrone',
    category: 'seal',
    label: 'Royal Wax Seal',
    aspectRatio: 'square',
    dimensions: { width: 256, height: 256 },
    artPrompt:
      'A dark red wax seal stamped with the Iron Throne crossed-swords emblem. The wax is '
      + 'thick and cracked, pressed into aged parchment. Visible fingerprint ridges in the '
      + 'wax. Dramatic side-lighting. Macro photography style. ' + STYLE_IRON,
    placeholderCSS:
      'radial-gradient(circle, #a01010 0%, #8B0000 60%, #3a0000 100%)',
    tags: ['seal', 'wax', 'stamp', 'royal', 'document'],
  },

  // ── Territory ──
  {
    id: 'iron_territory_crownlands',
    factionId: 'ironThrone',
    category: 'territory',
    label: 'The Crownlands Vista',
    aspectRatio: 'landscape',
    dimensions: { width: 1024, height: 576 },
    artPrompt:
      'A sweeping vista of the Crownlands: rolling farmland divided by stone walls, '
      + 'watchtowers dotting the horizon, a wide military road cutting through the center. '
      + 'In the distance, the spires of Ironhold Citadel rise above morning mist. '
      + 'Peasants work fields under the watchful eye of mounted patrols. ' + STYLE_IRON,
    placeholderCSS:
      'linear-gradient(180deg, #6a6a7a 0%, #8B0000 20%, #4a5a3a 60%, #2a3a1a 100%)',
    tags: ['territory', 'crownlands', 'landscape', 'farmland', 'watchtowers'],
  },
  {
    id: 'iron_territory_kings_march',
    factionId: 'ironThrone',
    category: 'territory',
    label: "The King's March Road",
    aspectRatio: 'landscape',
    dimensions: { width: 1024, height: 576 },
    artPrompt:
      'A wide, paved military highway stretching to the horizon — The King\'s March. '
      + 'Stone mile-markers bear the crossed-swords emblem. A column of armored soldiers '
      + 'marches in formation. Crimson supply wagons follow. Overcast sky, bare winter '
      + 'trees flank the road. ' + STYLE_IRON,
    placeholderCSS:
      'linear-gradient(180deg, #5a5a6a 0%, #3a3a4a 40%, #8B0000 70%, #1a1a2a 100%)',
    tags: ['territory', 'kings_march', 'road', 'army', 'march'],
  },

  // ── Additional ──
  {
    id: 'iron_propaganda_loyalty',
    factionId: 'ironThrone',
    category: 'propaganda',
    label: 'Loyalty Oath Broadsheet',
    aspectRatio: 'portrait',
    dimensions: { width: 512, height: 720 },
    artPrompt:
      'A formal loyalty oath printed on heavy parchment, bordered by iron chain motifs. '
      + 'A woodcut at the top depicts subjects kneeling before the Iron Throne. Text reads: '
      + '"SWEAR YOUR OATH — TRAITORS FACE THE IRON JUSTICE." Red and black ink, '
      + 'official government typography. ' + STYLE_IRON,
    placeholderCSS:
      'linear-gradient(180deg, #d4c0a0 0%, #8B0000 70%, #2a0000 100%)',
    tags: ['propaganda', 'oath', 'loyalty', 'parchment', 'official'],
  },
  {
    id: 'iron_bg_armory',
    factionId: 'ironThrone',
    category: 'background',
    label: 'Ironhold Grand Armory',
    aspectRatio: 'landscape',
    dimensions: { width: 1920, height: 1080 },
    artPrompt:
      'The cavernous grand armory of Ironhold Citadel. Racks of swords, halberds, and '
      + 'crossbows line the walls. Armor stands display full plate sets bearing the '
      + 'crossed-swords emblem. Smiths work at forges in the back, sparks flying. '
      + 'Red-hot metal glows in the dim light. Industrial, martial, formidable. ' + STYLE_IRON,
    placeholderCSS:
      'linear-gradient(180deg, #1a0a0a 0%, #8B0000 40%, #C0C0C0 60%, #1a0a0a 100%)',
    tags: ['background', 'armory', 'interior', 'forge', 'weapons', 'smithing'],
  },
];

// ──────────────────────────────────────────────
//  ASHEN CONCLAVE ASSETS (14)
// ──────────────────────────────────────────────

const ashenConclaveAssets: FactionAsset[] = [
  // ── Emblems ──
  {
    id: 'ashen_emblem_primary',
    factionId: 'ashenConclave',
    category: 'emblem',
    label: 'Ashen Conclave Primary Emblem',
    aspectRatio: 'square',
    dimensions: { width: 512, height: 512 },
    artPrompt:
      'A heraldic emblem of an open tome with glowing arcane glyphs rising from its pages, '
      + 'framed by a circle of ash and starlight. The book rests on a crescent moon. '
      + 'Etched in antiqued gold on a deep violet field. ' + STYLE_ASHEN,
    placeholderCSS:
      'radial-gradient(circle at 50% 40%, #D4AF37 0%, #4A4A6A 50%, #1a1a3a 100%)',
    tags: ['emblem', 'crest', 'tome', 'glyphs', 'arcane'],
  },
  {
    id: 'ashen_emblem_oracle',
    factionId: 'ashenConclave',
    category: 'emblem',
    label: 'Oracle Eye Sigil',
    aspectRatio: 'square',
    dimensions: { width: 256, height: 256 },
    artPrompt:
      'A single stylized all-seeing eye with an iris made of concentric arcane runes, '
      + 'radiating lines of faint gold light. Set within a triangle of ash-grey stone. '
      + 'Engraved, weathered texture. ' + STYLE_ASHEN,
    placeholderCSS:
      'radial-gradient(circle, #D4AF37 0%, #4A4A6A 60%, #1a1a3a 100%)',
    tags: ['emblem', 'eye', 'oracle', 'runes', 'sigil'],
  },

  // ── Banners ──
  {
    id: 'ashen_banner_library',
    factionId: 'ashenConclave',
    category: 'banner',
    label: 'Library of Echoes Banner',
    aspectRatio: 'portrait',
    dimensions: { width: 512, height: 1024 },
    artPrompt:
      'A long violet silk banner embroidered with gold thread, depicting an open book '
      + 'beneath a constellation of seven stars. The banner hangs between two towering '
      + 'library shelves filled with ancient tomes. Dust motes float in candlelight. '
      + STYLE_ASHEN,
    placeholderCSS:
      'linear-gradient(180deg, #2a2a4a 0%, #4A4A6A 30%, #4A4A6A 70%, #2a2a4a 100%)',
    tags: ['banner', 'library', 'silk', 'stars', 'books'],
  },
  {
    id: 'ashen_banner_processional',
    factionId: 'ashenConclave',
    category: 'war_banner',
    label: 'Conclave Processional Standard',
    aspectRatio: 'landscape',
    dimensions: { width: 1024, height: 512 },
    artPrompt:
      'A ceremonial processional standard carried by hooded grey-robed acolytes through '
      + 'a fog-shrouded mountain pass. The banner bears the Conclave\'s open-tome emblem '
      + 'in shimmering gold. Incense smoke trails from censers. Mystical, reverent '
      + 'atmosphere. ' + STYLE_ASHEN,
    placeholderCSS:
      'linear-gradient(135deg, #2a2a4a 0%, #4A4A6A 50%, #D4AF37 100%)',
    tags: ['war_banner', 'processional', 'ceremony', 'acolytes', 'fog'],
  },

  // ── Propaganda ──
  {
    id: 'ashen_propaganda_knowledge',
    factionId: 'ashenConclave',
    category: 'propaganda',
    label: 'Knowledge Is Power Decree',
    aspectRatio: 'portrait',
    dimensions: { width: 512, height: 720 },
    artPrompt:
      'An illuminated manuscript page serving as a public decree. Ornate gold-leaf '
      + 'borders with intertwined serpents and hourglasses. Elegant calligraphy reads '
      + '"KNOWLEDGE IS THE ONLY TRUE POWER — SEEK THE CONCLAVE\'S WISDOM". An illustration '
      + 'of a scholar handing a book to a kneeling peasant. Violet wax seal. ' + STYLE_ASHEN,
    placeholderCSS:
      'linear-gradient(180deg, #d4c4a0 0%, #b8a080 40%, #4A4A6A 90%)',
    tags: ['propaganda', 'decree', 'illuminated', 'manuscript', 'wisdom'],
  },
  {
    id: 'ashen_propaganda_warning',
    factionId: 'ashenConclave',
    category: 'propaganda',
    label: 'Forbidden Knowledge Warning',
    aspectRatio: 'square',
    dimensions: { width: 512, height: 512 },
    artPrompt:
      'A carved stone tablet mounted on a library wall, bearing the warning: "UNSANCTIONED '
      + 'SORCERY INVITES THE SECOND SUNDERING". Below the text, a bas-relief depicts a city '
      + 'crumbling into fire. The all-seeing eye of the Conclave watches from above. '
      + 'Ominous, authoritarian. ' + STYLE_ASHEN,
    placeholderCSS:
      'linear-gradient(180deg, #4A4A6A 0%, #3a3a5a 50%, #1a1a2a 100%)',
    tags: ['propaganda', 'warning', 'stone_tablet', 'sorcery', 'sundering'],
  },

  // ── Backgrounds ──
  {
    id: 'ashen_bg_library',
    factionId: 'ashenConclave',
    category: 'background',
    label: 'Library of Echoes Interior',
    aspectRatio: 'landscape',
    dimensions: { width: 1920, height: 1080 },
    artPrompt:
      'An impossibly vast library interior with shelves rising into darkness. Floating '
      + 'orbs of pale violet light illuminate reading alcoves. Scholars in grey robes '
      + 'drift between aisles. Open books hover on lecterns. A central astrolabe spins '
      + 'slowly. Dust, candlelight, and the glow of arcane glyphs on the floor. '
      + STYLE_ASHEN,
    placeholderCSS:
      'linear-gradient(180deg, #1a1a3a 0%, #4A4A6A 40%, #2a2a4a 70%, #0a0a1a 100%)',
    tags: ['background', 'library', 'interior', 'vast', 'arcane', 'scholars'],
  },
  {
    id: 'ashen_bg_sanctum',
    factionId: 'ashenConclave',
    category: 'background',
    label: 'Greymist Sanctum Chamber',
    aspectRatio: 'landscape',
    dimensions: { width: 1920, height: 1080 },
    artPrompt:
      'A circular stone chamber deep within the Greymist Sanctum. Arcane circles glow '
      + 'on the floor in violet and gold. Crystal vials line carved shelves. A scrying '
      + 'pool in the center reflects star-patterns that don\'t match the sky above. '
      + 'Incense smoke curls. Cold, mystical atmosphere. ' + STYLE_ASHEN,
    placeholderCSS:
      'radial-gradient(circle at 50% 60%, #D4AF37 0%, #4A4A6A 40%, #0a0a1a 100%)',
    tags: ['background', 'sanctum', 'interior', 'scrying', 'arcane_circle'],
  },
  {
    id: 'ashen_bg_spire',
    factionId: 'ashenConclave',
    category: 'background',
    label: "Oracle's Spire Exterior",
    aspectRatio: 'landscape',
    dimensions: { width: 1920, height: 1080 },
    artPrompt:
      'The Oracle\'s Spire — a needle-thin tower of pale grey stone piercing through '
      + 'a permanent layer of mist, its peak crowned with a faintly glowing orb. The '
      + 'tower sits on a rocky promontory above cloud-filled valleys. Lightning flickers '
      + 'in distant stormclouds. An ancient stone stairway spirals upward. ' + STYLE_ASHEN,
    placeholderCSS:
      'linear-gradient(180deg, #6a6a8a 0%, #4A4A6A 30%, #8a8aaa 50%, #2a2a4a 100%)',
    tags: ['background', 'spire', 'exterior', 'tower', 'mist', 'oracle'],
  },

  // ── Seals ──
  {
    id: 'ashen_seal_archon',
    factionId: 'ashenConclave',
    category: 'seal',
    label: "Archon's Seal",
    aspectRatio: 'square',
    dimensions: { width: 256, height: 256 },
    artPrompt:
      'A violet wax seal stamped with the Conclave\'s open-tome-and-stars emblem. The wax '
      + 'has a faint shimmer as if infused with crushed amethyst. Pressed onto aged grey '
      + 'parchment with visible fibers. Macro detail shot. ' + STYLE_ASHEN,
    placeholderCSS:
      'radial-gradient(circle, #6a5a9a 0%, #4A4A6A 60%, #2a2a4a 100%)',
    tags: ['seal', 'wax', 'archon', 'amethyst', 'official'],
  },

  // ── Territory ──
  {
    id: 'ashen_territory_ashenveil',
    factionId: 'ashenConclave',
    category: 'territory',
    label: 'Ashenveil Citadel Vista',
    aspectRatio: 'landscape',
    dimensions: { width: 1024, height: 576 },
    artPrompt:
      'The fog-shrouded city of Ashenveil carved into the Greymist Mountains. Spires and '
      + 'domes of pale stone emerge from perpetual mist. Bridges connect towers across '
      + 'deep ravines. Faint glows emanate from windows — a city of eternal study. '
      + 'Dawn light barely penetrates the grey overcast. ' + STYLE_ASHEN,
    placeholderCSS:
      'linear-gradient(180deg, #8a8a9a 0%, #4A4A6A 40%, #3a3a5a 70%, #1a1a3a 100%)',
    tags: ['territory', 'ashenveil', 'citadel', 'mountains', 'mist', 'city'],
  },
  {
    id: 'ashen_territory_greymist',
    factionId: 'ashenConclave',
    category: 'territory',
    label: 'Greymist Mountain Pass',
    aspectRatio: 'landscape',
    dimensions: { width: 1024, height: 576 },
    artPrompt:
      'A narrow mountain pass through the Greymist range. Stone waymarkers carved with '
      + 'protective glyphs line the path. Thick fog swirls at ankle height. Ruins of an '
      + 'ancient watchtower cling to a cliff face. The path disappears into white mist '
      + 'ahead — mysterious, foreboding. ' + STYLE_ASHEN,
    placeholderCSS:
      'linear-gradient(180deg, #9a9aaa 0%, #6a6a8a 40%, #4A4A6A 80%, #2a2a4a 100%)',
    tags: ['territory', 'greymist', 'mountain', 'pass', 'fog', 'ruins'],
  },

  // ── Additional ──
  {
    id: 'ashen_propaganda_prophecy',
    factionId: 'ashenConclave',
    category: 'propaganda',
    label: 'Prophecy Proclamation Scroll',
    aspectRatio: 'portrait',
    dimensions: { width: 512, height: 720 },
    artPrompt:
      'An ornate scroll unfurled on a lectern, bearing a prophecy in silver ink on '
      + 'indigo-dyed vellum. Illuminated illustrations of celestial alignments frame '
      + 'the text. The header reads: "THE STARS HAVE SPOKEN — HEED THE CONCLAVE." '
      + 'Gold-leaf astronomical diagrams. ' + STYLE_ASHEN,
    placeholderCSS:
      'linear-gradient(180deg, #4A4A6A 0%, #2a2a4a 40%, #D4AF37 90%)',
    tags: ['propaganda', 'prophecy', 'scroll', 'celestial', 'silver_ink'],
  },
  {
    id: 'ashen_bg_observatory',
    factionId: 'ashenConclave',
    category: 'background',
    label: 'Conclave Star Observatory',
    aspectRatio: 'landscape',
    dimensions: { width: 1920, height: 1080 },
    artPrompt:
      'A domed stone observatory atop the Oracle\'s Spire. A massive brass orrery '
      + 'dominates the center, its planetary rings slowly turning. The domed ceiling '
      + 'is open to a star-filled sky. Hooded astronomers record observations at '
      + 'writing desks. Telescopes and astrolabes line the walls. Violet and gold '
      + 'light from arcane instruments. ' + STYLE_ASHEN,
    placeholderCSS:
      'radial-gradient(circle at 50% 30%, #D4AF37 0%, #4A4A6A 40%, #0a0a1a 100%)',
    tags: ['background', 'observatory', 'orrery', 'stars', 'astronomy', 'spire'],
  },
];

// ──────────────────────────────────────────────
//  VERDANT PACT ASSETS (14)
// ──────────────────────────────────────────────

const verdantPactAssets: FactionAsset[] = [
  // ── Emblems ──
  {
    id: 'verdant_emblem_primary',
    factionId: 'verdantPact',
    category: 'emblem',
    label: 'Verdant Pact Primary Emblem',
    aspectRatio: 'square',
    dimensions: { width: 512, height: 512 },
    artPrompt:
      'A heraldic emblem of a great oak tree with spreading roots and branches forming '
      + 'a perfect circle. Antlers grow from the trunk like branches. Carved into living '
      + 'wood with moss filling the grooves. Forest green on bark brown. ' + STYLE_VERDANT,
    placeholderCSS:
      'radial-gradient(circle at 50% 40%, #8B6914 0%, #2E5D34 50%, #0a2a0a 100%)',
    tags: ['emblem', 'crest', 'oak', 'antlers', 'roots', 'circle'],
  },
  {
    id: 'verdant_emblem_druid',
    factionId: 'verdantPact',
    category: 'emblem',
    label: 'Druidic Circle Mark',
    aspectRatio: 'square',
    dimensions: { width: 256, height: 256 },
    artPrompt:
      'A druidic spiral carved into a moss-covered standing stone. The spiral is a triple '
      + 'triskelion made of intertwined vine tendrils. Lichen and small ferns grow from '
      + 'the carvings. Morning dew glistens. ' + STYLE_VERDANT,
    placeholderCSS:
      'radial-gradient(circle, #4a7a3a 0%, #2E5D34 60%, #0a2a0a 100%)',
    tags: ['emblem', 'druid', 'spiral', 'triskelion', 'stone', 'moss'],
  },

  // ── Banners ──
  {
    id: 'verdant_banner_greenwood',
    factionId: 'verdantPact',
    category: 'banner',
    label: 'Greenwood Council Banner',
    aspectRatio: 'portrait',
    dimensions: { width: 512, height: 1024 },
    artPrompt:
      'A hand-woven linen banner dyed with natural forest-green pigment, depicting a '
      + 'white stag surrounded by oak leaves. The banner hangs from a living branch of '
      + 'an ancient tree, its edges deliberately ragged. Wildflowers are woven into the '
      + 'bottom hem. ' + STYLE_VERDANT,
    placeholderCSS:
      'linear-gradient(180deg, #1a3a1a 0%, #2E5D34 30%, #2E5D34 70%, #8B6914 100%)',
    tags: ['banner', 'woven', 'stag', 'oak', 'greenwood', 'natural'],
  },
  {
    id: 'verdant_banner_rebellion',
    factionId: 'verdantPact',
    category: 'war_banner',
    label: 'Rebel War Standard',
    aspectRatio: 'landscape',
    dimensions: { width: 1024, height: 512 },
    artPrompt:
      'A rough-hewn guerrilla war banner — torn green cloth tied to a sharpened wooden '
      + 'stake, painted with a clenched fist wrapped in thorny vines. Mud-splattered, '
      + 'rain-soaked, planted defiantly at the edge of a burned field. Smoke rises from '
      + 'a destroyed tax wagon in the background. ' + STYLE_VERDANT,
    placeholderCSS:
      'linear-gradient(135deg, #1a2a1a 0%, #2E5D34 40%, #8B6914 80%, #3a2a0a 100%)',
    tags: ['war_banner', 'rebellion', 'guerrilla', 'fist', 'thorns', 'defiance'],
  },

  // ── Propaganda ──
  {
    id: 'verdant_propaganda_freedom',
    factionId: 'verdantPact',
    category: 'propaganda',
    label: 'No King But the Land Leaflet',
    aspectRatio: 'portrait',
    dimensions: { width: 512, height: 720 },
    artPrompt:
      'A hand-printed leaflet on rough bark-paper. A crude but powerful woodcut shows a '
      + 'peasant breaking a crown over their knee. Text in rough hand-lettering: "NO KING '
      + 'BUT THE LAND — THE GREENMOTHER PROVIDES". Smeared green ink, crumpled edges. '
      + 'Looks like it was mass-produced by a village printing press. ' + STYLE_VERDANT,
    placeholderCSS:
      'linear-gradient(180deg, #c4b490 0%, #a49470 50%, #2E5D34 95%)',
    tags: ['propaganda', 'leaflet', 'woodcut', 'peasant', 'crown', 'freedom'],
  },
  {
    id: 'verdant_propaganda_land_rights',
    factionId: 'verdantPact',
    category: 'propaganda',
    label: 'Land Rights Broadsheet',
    aspectRatio: 'square',
    dimensions: { width: 512, height: 512 },
    artPrompt:
      'A broadsheet posted on a village notice board. Illustrated with a map showing '
      + '"STOLEN LANDS" marked in red, depicting territories seized by the Iron Throne. '
      + 'Text reads "THE SOIL BELONGS TO THOSE WHO TILL IT". Borders decorated with '
      + 'pressed leaves and vine patterns. Earthy, populist aesthetic. ' + STYLE_VERDANT,
    placeholderCSS:
      'linear-gradient(180deg, #b8a878 0%, #8B6914 50%, #2E5D34 100%)',
    tags: ['propaganda', 'broadsheet', 'land_rights', 'map', 'populist'],
  },

  // ── Backgrounds ──
  {
    id: 'verdant_bg_council_grove',
    factionId: 'verdantPact',
    category: 'background',
    label: 'Elder Council Grove',
    aspectRatio: 'landscape',
    dimensions: { width: 1920, height: 1080 },
    artPrompt:
      'A sacred forest clearing where massive ancient oaks form a natural cathedral. '
      + 'Moss-covered stone seats arranged in a circle for the Elder Council. Shafts '
      + 'of green-gold light filter through the canopy. Fireflies drift lazily. Carved '
      + 'faces peer from tree trunks. Wildflowers carpet the ground. Serene but '
      + 'powerful. ' + STYLE_VERDANT,
    placeholderCSS:
      'linear-gradient(180deg, #1a3a1a 0%, #2E5D34 30%, #4a7a4a 50%, #1a3a1a 80%, #0a1a0a 100%)',
    tags: ['background', 'grove', 'council', 'oaks', 'sacred', 'clearing'],
  },
  {
    id: 'verdant_bg_village',
    factionId: 'verdantPact',
    category: 'background',
    label: 'Mosshollow Village',
    aspectRatio: 'landscape',
    dimensions: { width: 1920, height: 1080 },
    artPrompt:
      'A small forest village of thatched-roof cottages built around and into massive '
      + 'tree trunks. Rope bridges connect upper platforms. Vegetable gardens flourish '
      + 'between homes. Chickens and goats roam freely. Smoke rises from clay chimneys. '
      + 'Children play near a communal well. Warm, rustic, alive. ' + STYLE_VERDANT,
    placeholderCSS:
      'linear-gradient(180deg, #3a5a3a 0%, #2E5D34 30%, #8B6914 60%, #4a3a1a 100%)',
    tags: ['background', 'village', 'mosshollow', 'treehouses', 'rustic'],
  },
  {
    id: 'verdant_bg_thornwatch',
    factionId: 'verdantPact',
    category: 'background',
    label: 'Thornwatch Outpost',
    aspectRatio: 'landscape',
    dimensions: { width: 1920, height: 1080 },
    artPrompt:
      'A hidden guerrilla outpost in dense forest. Wooden palisades reinforced with '
      + 'living thorn bushes. Watchtowers built into ancient trees. Camouflaged weapon '
      + 'racks and a training ground of packed earth. Green-cloaked sentries blend into '
      + 'the foliage. Tense, military, but organic — grown rather than built. '
      + STYLE_VERDANT,
    placeholderCSS:
      'linear-gradient(180deg, #0a2a0a 0%, #2E5D34 40%, #1a3a1a 80%, #0a1a0a 100%)',
    tags: ['background', 'outpost', 'thornwatch', 'guerrilla', 'fortification'],
  },

  // ── Seals ──
  {
    id: 'verdant_seal_elder',
    factionId: 'verdantPact',
    category: 'seal',
    label: 'Elder Council Seal',
    aspectRatio: 'square',
    dimensions: { width: 256, height: 256 },
    artPrompt:
      'A seal pressed in green beeswax, depicting the Verdant Pact oak-and-antlers emblem. '
      + 'The wax is mixed with crushed leaves giving it a mottled green-brown texture. '
      + 'Pressed onto rough handmade paper. A small dried flower is embedded in the wax. '
      + STYLE_VERDANT,
    placeholderCSS:
      'radial-gradient(circle, #4a7a3a 0%, #2E5D34 60%, #1a3a1a 100%)',
    tags: ['seal', 'wax', 'elder', 'green', 'organic', 'flower'],
  },

  // ── Territory ──
  {
    id: 'verdant_territory_greenwood',
    factionId: 'verdantPact',
    category: 'territory',
    label: 'The Greenwood Deep',
    aspectRatio: 'landscape',
    dimensions: { width: 1024, height: 576 },
    artPrompt:
      'Deep primeval forest — the Greenwood. Cathedral-sized trees with trunks wider than '
      + 'houses. Bioluminescent mushrooms glow on roots. A narrow deer path winds through '
      + 'ferns taller than a person. Ancient carvings on the trees mark druidic territory. '
      + 'Mysterious, primal, untamed. ' + STYLE_VERDANT,
    placeholderCSS:
      'linear-gradient(180deg, #0a2a0a 0%, #1a4a1a 40%, #2E5D34 60%, #0a1a0a 100%)',
    tags: ['territory', 'greenwood', 'forest', 'primeval', 'mushrooms', 'ancient'],
  },
  {
    id: 'verdant_territory_druids_glen',
    factionId: 'verdantPact',
    category: 'territory',
    label: "The Druid's Glen",
    aspectRatio: 'landscape',
    dimensions: { width: 1024, height: 576 },
    artPrompt:
      'A hidden valley — the Druid\'s Glen. A waterfall cascades into a crystal pool '
      + 'surrounded by standing stones covered in spiraling carvings. Herbs and medicinal '
      + 'plants grow in careful rows between the stones. A stone altar sits at the center '
      + 'with offerings of fruit and flowers. Mist rises from the warm pool. Sacred, '
      + 'healing atmosphere. ' + STYLE_VERDANT,
    placeholderCSS:
      'linear-gradient(180deg, #3a6a3a 0%, #2E5D34 30%, #4a8a6a 60%, #1a3a1a 100%)',
    tags: ['territory', 'glen', 'druid', 'waterfall', 'standing_stones', 'sacred'],
  },

  // ── Additional ──
  {
    id: 'verdant_propaganda_harvest',
    factionId: 'verdantPact',
    category: 'propaganda',
    label: 'Harvest Festival Invitation',
    aspectRatio: 'portrait',
    dimensions: { width: 512, height: 720 },
    artPrompt:
      'A hand-illustrated festival notice on bark-paper. Colorful (but earthy) '
      + 'illustrations of dancing villagers, bountiful harvest tables, and a great '
      + 'bonfire. Text reads: "THE GREENMOTHER\'S HARVEST — ALL FREE FOLK WELCOME." '
      + 'Pressed wildflowers decorate the borders. Joyful yet defiant — a celebration '
      + 'of independence. ' + STYLE_VERDANT,
    placeholderCSS:
      'linear-gradient(180deg, #c4b490 0%, #8B6914 40%, #2E5D34 80%)',
    tags: ['propaganda', 'harvest', 'festival', 'celebration', 'community'],
  },
  {
    id: 'verdant_bg_sacred_tree',
    factionId: 'verdantPact',
    category: 'background',
    label: 'The Greenmother Sacred Tree',
    aspectRatio: 'landscape',
    dimensions: { width: 1920, height: 1080 },
    artPrompt:
      'An impossibly ancient tree — the Greenmother\'s Heart — with a trunk so wide '
      + 'it could contain a cathedral. Its roots descend into a glowing underground '
      + 'spring. Offerings of flowers, carved totems, and woven garlands hang from '
      + 'its lower branches. Druids meditate at its base. An overwhelming sense of '
      + 'ancient, living power. Bioluminescent moss lights the scene. ' + STYLE_VERDANT,
    placeholderCSS:
      'radial-gradient(circle at 50% 60%, #4a8a4a 0%, #2E5D34 40%, #0a2a0a 100%)',
    tags: ['background', 'sacred_tree', 'greenmother', 'ancient', 'druids', 'shrine'],
  },
];

// ──────────────────────────────────────────────
//  OBSIDIAN GUILD ASSETS (14)
// ──────────────────────────────────────────────

const obsidianGuildAssets: FactionAsset[] = [
  // ── Emblems ──
  {
    id: 'obsidian_emblem_primary',
    factionId: 'obsidianGuild',
    category: 'emblem',
    label: 'Obsidian Guild Primary Emblem',
    aspectRatio: 'square',
    dimensions: { width: 512, height: 512 },
    artPrompt:
      'A heraldic emblem of a coiled serpent eating its own tail (ouroboros), encircling '
      + 'a faceted obsidian gemstone. The serpent\'s scales are rendered in polished gold '
      + 'on a field of deep midnight black. Set within a ornate merchant\'s shield frame '
      + 'with coin motifs along the border. ' + STYLE_OBSIDIAN,
    placeholderCSS:
      'radial-gradient(circle at 50% 40%, #FFD700 0%, #1C1C2E 50%, #0a0a1a 100%)',
    tags: ['emblem', 'crest', 'ouroboros', 'serpent', 'obsidian', 'gold'],
  },
  {
    id: 'obsidian_emblem_trade',
    factionId: 'obsidianGuild',
    category: 'emblem',
    label: 'Guild Trade Mark',
    aspectRatio: 'square',
    dimensions: { width: 256, height: 256 },
    artPrompt:
      'A merchant\'s trade mark: balanced scales with a dagger on one pan and a pile of '
      + 'gold coins on the other, perfectly balanced. Stamped in gold leaf on black leather. '
      + 'The style of a luxury brand logo — clean, menacing, elegant. ' + STYLE_OBSIDIAN,
    placeholderCSS:
      'radial-gradient(circle, #FFD700 0%, #1C1C2E 65%, #0a0a1a 100%)',
    tags: ['emblem', 'trade_mark', 'scales', 'dagger', 'coins', 'balance'],
  },

  // ── Banners ──
  {
    id: 'obsidian_banner_guild_hall',
    factionId: 'obsidianGuild',
    category: 'banner',
    label: 'Guild Hall Silk Banner',
    aspectRatio: 'portrait',
    dimensions: { width: 512, height: 1024 },
    artPrompt:
      'An opulent black silk banner with gold-thread embroidery of the ouroboros serpent. '
      + 'The banner hangs in a lavish guild hall with polished obsidian pillars. Candelabras '
      + 'cast warm golden light. The fabric shimmers with hidden patterns visible only at '
      + 'certain angles — secret guild codes woven into the silk. ' + STYLE_OBSIDIAN,
    placeholderCSS:
      'linear-gradient(180deg, #0a0a1a 0%, #1C1C2E 30%, #1C1C2E 70%, #FFD700 95%)',
    tags: ['banner', 'silk', 'guild_hall', 'opulent', 'ouroboros', 'gold_thread'],
  },
  {
    id: 'obsidian_banner_docks',
    factionId: 'obsidianGuild',
    category: 'war_banner',
    label: 'Blackhaven Docks Pennant',
    aspectRatio: 'landscape',
    dimensions: { width: 1024, height: 512 },
    artPrompt:
      'A row of black pennants bearing gold Guild emblems, strung between the masts of '
      + 'merchant galleons in Blackhaven Port at night. Lanterns on the ships cast golden '
      + 'reflections on dark water. Shadowy dock workers load cargo. A thin fog rolls in '
      + 'from the sea. Noir atmosphere. ' + STYLE_OBSIDIAN,
    placeholderCSS:
      'linear-gradient(135deg, #0a0a1a 0%, #1C1C2E 40%, #FFD700 90%)',
    tags: ['war_banner', 'pennant', 'docks', 'ships', 'harbour', 'noir'],
  },

  // ── Propaganda ──
  {
    id: 'obsidian_propaganda_opportunity',
    factionId: 'obsidianGuild',
    category: 'propaganda',
    label: 'Opportunity Awaits Broadside',
    aspectRatio: 'portrait',
    dimensions: { width: 512, height: 720 },
    artPrompt:
      'A slick broadside advertisement printed on quality vellum. An illustration of a '
      + 'well-dressed merchant extending a hand to a ragged commoner, a golden city rising '
      + 'behind them. Text in elegant font: "FORTUNE FAVOURS THE BOLD — THE GUILD PROVIDES". '
      + 'Small print at the bottom (terms and conditions). Gold and black ink. ' + STYLE_OBSIDIAN,
    placeholderCSS:
      'linear-gradient(180deg, #d4c4a0 0%, #b8a080 40%, #1C1C2E 90%)',
    tags: ['propaganda', 'broadside', 'opportunity', 'merchant', 'advertisement'],
  },
  {
    id: 'obsidian_propaganda_price',
    factionId: 'obsidianGuild',
    category: 'propaganda',
    label: 'Every Man Has a Price Notice',
    aspectRatio: 'square',
    dimensions: { width: 512, height: 512 },
    artPrompt:
      'A tavern notice board posting — a wanted/hiring poster with the Guild emblem at '
      + 'top. Text reads "EVERY MAN HAS A PRICE — WHAT\'S YOURS?" Below, a list of '
      + 'bounties and job postings with coin amounts. Gold coins are pinned to the board '
      + 'as proof of payment. Dark, transactional, seductive. ' + STYLE_OBSIDIAN,
    placeholderCSS:
      'linear-gradient(180deg, #3a3020 0%, #1C1C2E 50%, #FFD700 100%)',
    tags: ['propaganda', 'notice', 'bounty', 'hiring', 'tavern', 'coins'],
  },

  // ── Backgrounds ──
  {
    id: 'obsidian_bg_guild_hall',
    factionId: 'obsidianGuild',
    category: 'background',
    label: 'Obsidian Guild Hall Interior',
    aspectRatio: 'landscape',
    dimensions: { width: 1920, height: 1080 },
    artPrompt:
      'Interior of the Obsidian Guild\'s grand hall. Polished black stone floors reflect '
      + 'golden candlelight. A massive map table in the center shows trade routes marked '
      + 'with gold pins. Velvet curtains conceal alcoves where deals are whispered. Ornate '
      + 'vaults visible behind iron gates. Rich, dark, opulent — wealth displayed as '
      + 'power. ' + STYLE_OBSIDIAN,
    placeholderCSS:
      'linear-gradient(180deg, #0a0a1a 0%, #1C1C2E 30%, #2a2a3e 50%, #FFD700 95%)',
    tags: ['background', 'guild_hall', 'interior', 'opulent', 'map_table', 'vaults'],
  },
  {
    id: 'obsidian_bg_undermarket',
    factionId: 'obsidianGuild',
    category: 'background',
    label: 'Undermarket Vaults',
    aspectRatio: 'landscape',
    dimensions: { width: 1920, height: 1080 },
    artPrompt:
      'The Undermarket — a vast underground bazaar in converted mine tunnels. Stalls '
      + 'sell contraband, exotic goods, and information. Lanterns hang from chains. '
      + 'Hooded figures browse displays of poisons, lockpicks, and forged documents. '
      + 'A currency exchange booth dominates one wall. Dangerous, thrilling, illicit. '
      + STYLE_OBSIDIAN,
    placeholderCSS:
      'linear-gradient(180deg, #0a0a0a 0%, #1C1C2E 40%, #2a1a0a 60%, #FFD700 100%)',
    tags: ['background', 'undermarket', 'underground', 'bazaar', 'contraband'],
  },
  {
    id: 'obsidian_bg_blackhaven',
    factionId: 'obsidianGuild',
    category: 'background',
    label: 'Blackhaven Port Skyline',
    aspectRatio: 'landscape',
    dimensions: { width: 1920, height: 1080 },
    artPrompt:
      'The skyline of Blackhaven Port at twilight. A sprawling harbour city where '
      + 'merchant towers compete in height. Ships crowd the harbour. Smoke rises from '
      + 'foundries and taverns. The Gilded Quarter glows with warm light on the hill, '
      + 'while the docks below are shadowy and fog-wreathed. A city of stark inequality — '
      + 'gold above, darkness below. ' + STYLE_OBSIDIAN,
    placeholderCSS:
      'linear-gradient(180deg, #2a1a3a 0%, #1C1C2E 30%, #FFD700 50%, #1C1C2E 80%, #0a0a1a 100%)',
    tags: ['background', 'blackhaven', 'port', 'skyline', 'harbour', 'twilight'],
  },

  // ── Seals ──
  {
    id: 'obsidian_seal_contract',
    factionId: 'obsidianGuild',
    category: 'seal',
    label: 'Guild Contract Seal',
    aspectRatio: 'square',
    dimensions: { width: 256, height: 256 },
    artPrompt:
      'A black wax seal stamped with the ouroboros serpent, used on Guild contracts. The '
      + 'wax is mixed with real crushed obsidian giving it a glittering, volcanic texture. '
      + 'A thin gold ribbon emerges from beneath the seal. Pressed onto expensive cream '
      + 'vellum. ' + STYLE_OBSIDIAN,
    placeholderCSS:
      'radial-gradient(circle, #2a2a3e 0%, #1C1C2E 50%, #FFD700 100%)',
    tags: ['seal', 'wax', 'contract', 'obsidian', 'ouroboros', 'official'],
  },

  // ── Territory ──
  {
    id: 'obsidian_territory_gilded_quarter',
    factionId: 'obsidianGuild',
    category: 'territory',
    label: 'The Gilded Quarter',
    aspectRatio: 'landscape',
    dimensions: { width: 1024, height: 576 },
    artPrompt:
      'The Gilded Quarter of Blackhaven — a hilltop district of mansions with golden '
      + 'rooftops and manicured gardens behind high walls. Marble fountains and statuary '
      + 'line wide cobblestone boulevards. Private guards in black-and-gold livery stand '
      + 'at every gate. Ostentatious wealth in a medieval setting. ' + STYLE_OBSIDIAN,
    placeholderCSS:
      'linear-gradient(180deg, #3a3a4a 0%, #FFD700 30%, #1C1C2E 70%, #0a0a1a 100%)',
    tags: ['territory', 'gilded_quarter', 'mansions', 'wealth', 'guards'],
  },
  {
    id: 'obsidian_territory_whispering_docks',
    factionId: 'obsidianGuild',
    category: 'territory',
    label: 'The Whispering Docks',
    aspectRatio: 'landscape',
    dimensions: { width: 1024, height: 576 },
    artPrompt:
      'The Whispering Docks at night — a fog-choked labyrinth of wooden piers, '
      + 'warehouse shadows, and smuggler\'s coves. Dim lanterns sway on ropes. A '
      + 'cloaked figure exchanges a small package with a dockhand. Rats scurry '
      + 'along mooring ropes. The dark water reflects nothing. Menacing, atmospheric. '
      + STYLE_OBSIDIAN,
    placeholderCSS:
      'linear-gradient(180deg, #0a0a1a 0%, #1C1C2E 50%, #1a1a2a 80%, #FFD700 100%)',
    tags: ['territory', 'docks', 'whispering', 'smuggler', 'fog', 'night'],
  },

  // ── Additional ──
  {
    id: 'obsidian_propaganda_debt',
    factionId: 'obsidianGuild',
    category: 'propaganda',
    label: 'Debt Collection Notice',
    aspectRatio: 'portrait',
    dimensions: { width: 512, height: 720 },
    artPrompt:
      'A menacing debt collection notice on expensive black-bordered vellum. Gold-printed '
      + 'text reads: "YOUR DEBT IS DUE — THE GUILD ALWAYS COLLECTS." An illustration of '
      + 'a skeleton hand reaching from shadows to grasp a bag of coins. The Guild seal '
      + 'at the bottom. Intimidating, legally precise, threatening. ' + STYLE_OBSIDIAN,
    placeholderCSS:
      'linear-gradient(180deg, #d4c4a0 0%, #1C1C2E 60%, #FFD700 100%)',
    tags: ['propaganda', 'debt', 'collection', 'threat', 'menacing'],
  },
  {
    id: 'obsidian_bg_counting_house',
    factionId: 'obsidianGuild',
    category: 'background',
    label: 'Guild Counting House',
    aspectRatio: 'landscape',
    dimensions: { width: 1920, height: 1080 },
    artPrompt:
      'The interior of the Guild\'s central counting house. Rows of clerks at tall desks '
      + 'weigh coins on precision scales. Locked iron strongboxes line the walls. An '
      + 'enormous abacus hangs behind the chief accountant\'s elevated desk. Quills '
      + 'scratch on ledgers. Candlelight glints off stacks of gold. Meticulous, cold, '
      + 'the beating heart of mercantile empire. ' + STYLE_OBSIDIAN,
    placeholderCSS:
      'linear-gradient(180deg, #0a0a1a 0%, #1C1C2E 30%, #FFD700 50%, #1C1C2E 80%, #0a0a1a 100%)',
    tags: ['background', 'counting_house', 'interior', 'gold', 'clerks', 'ledgers'],
  },
];

// ──────────────────────────────────────────────
//  SHARED / NEUTRAL ASSETS (bonus)
// ──────────────────────────────────────────────

/**
 * Shared faction-interaction assets used when factions clash or cooperate.
 * These don't belong to a single faction but reference multiple.
 */
export interface SharedFactionAsset {
  id: string;
  label: string;
  category: 'background' | 'propaganda';
  aspectRatio: 'landscape' | 'portrait' | 'square';
  dimensions: { width: number; height: number };
  artPrompt: string;
  placeholderCSS: string;
  involvedFactions: FactionId[];
  tags: string[];
}

const sharedAssets: SharedFactionAsset[] = [
  {
    id: 'shared_bg_summit',
    label: 'Four-Faction Summit Hall',
    category: 'background',
    aspectRatio: 'landscape',
    dimensions: { width: 1920, height: 1080 },
    artPrompt:
      'A neutral summit hall where all four factions meet. Four distinct banners — crimson, '
      + 'violet, green, and black — hang from the four walls. A round stone table with four '
      + 'throne-like chairs sits in the center. Tension fills the air. Guards from each '
      + 'faction eye each other warily. ' + STYLE_BASE,
    placeholderCSS:
      'linear-gradient(135deg, #8B0000 0%, #4A4A6A 33%, #2E5D34 66%, #1C1C2E 100%)',
    involvedFactions: ['ironThrone', 'ashenConclave', 'verdantPact', 'obsidianGuild'],
    tags: ['background', 'summit', 'neutral', 'diplomacy', 'four_factions'],
  },
  {
    id: 'shared_bg_contested_border',
    label: 'Contested Borderlands',
    category: 'background',
    aspectRatio: 'landscape',
    dimensions: { width: 1920, height: 1080 },
    artPrompt:
      'A war-torn borderland where faction territories collide. A burned village sits at '
      + 'the crossroads. Torn banners from multiple factions litter the ground. A stone '
      + 'boundary marker has been defaced. Refugees move along a dirt road. Smoke and '
      + 'desolation. ' + STYLE_BASE,
    placeholderCSS:
      'linear-gradient(180deg, #4a3a2a 0%, #3a2a1a 40%, #2a1a0a 80%, #1a0a0a 100%)',
    involvedFactions: ['ironThrone', 'verdantPact'],
    tags: ['background', 'border', 'contested', 'war', 'refugees', 'burned'],
  },
];

// ═══════════════════════════════════════════════
//  COMBINED EXPORT & LOOKUP UTILITIES
// ═══════════════════════════════════════════════

/** All faction-specific assets (56 total) */
export const ALL_FACTION_ASSETS: FactionAsset[] = [
  ...ironThroneAssets,
  ...ashenConclaveAssets,
  ...verdantPactAssets,
  ...obsidianGuildAssets,
];

/** Shared inter-faction assets */
export const SHARED_FACTION_ASSETS: SharedFactionAsset[] = sharedAssets;

/** Total asset count (faction + shared) */
export const TOTAL_ASSET_COUNT = ALL_FACTION_ASSETS.length + SHARED_FACTION_ASSETS.length;

/** Get all assets for a specific faction */
export function getAssetsByFaction(factionId: FactionId): FactionAsset[] {
  return ALL_FACTION_ASSETS.filter((a) => a.factionId === factionId);
}

/** Get all assets of a specific category */
export function getAssetsByCategory(category: FactionAssetCategory): FactionAsset[] {
  return ALL_FACTION_ASSETS.filter((a) => a.category === category);
}

/** Get assets filtered by faction AND category */
export function getAssets(
  factionId: FactionId,
  category: FactionAssetCategory,
): FactionAsset[] {
  return ALL_FACTION_ASSETS.filter(
    (a) => a.factionId === factionId && a.category === category,
  );
}

/** Look up a single asset by ID */
export function getAssetById(id: string): FactionAsset | undefined {
  return ALL_FACTION_ASSETS.find((a) => a.id === id);
}

/** Get all emblem assets (for faction selection UI, headers, etc.) */
export function getAllEmblems(): FactionAsset[] {
  return getAssetsByCategory('emblem');
}

/** Get the primary emblem for a faction */
export function getPrimaryEmblem(factionId: FactionId): FactionAsset | undefined {
  return ALL_FACTION_ASSETS.find(
    (a) => a.factionId === factionId && a.category === 'emblem' && a.id.endsWith('_primary'),
  );
}

/** Get all background assets for use in scene rendering */
export function getAllBackgrounds(): FactionAsset[] {
  return getAssetsByCategory('background');
}

/** Get the CSS placeholder for an asset (fallback when no image is generated) */
export function getPlaceholder(assetId: string): string {
  const asset = getAssetById(assetId);
  return asset?.placeholderCSS ?? 'linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 100%)';
}

/** Summary statistics for debugging/admin */
export function getAssetStats(): Record<string, number> {
  const stats: Record<string, number> = {
    total: ALL_FACTION_ASSETS.length,
    shared: SHARED_FACTION_ASSETS.length,
    grand_total: TOTAL_ASSET_COUNT,
  };

  // Per faction
  const factionIds: FactionId[] = ['ironThrone', 'ashenConclave', 'verdantPact', 'obsidianGuild'];
  for (const fid of factionIds) {
    stats[fid] = getAssetsByFaction(fid).length;
  }

  // Per category
  const categories: FactionAssetCategory[] = [
    'emblem', 'banner', 'propaganda', 'background', 'seal', 'territory', 'war_banner',
  ];
  for (const cat of categories) {
    stats[`cat_${cat}`] = getAssetsByCategory(cat).length;
  }

  return stats;
}
