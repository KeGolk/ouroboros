/**
 * UI Element Placeholder Assets & AI Image Prompt Descriptions
 *
 * ~120 placeholder assets covering menus, buttons, icons, item sprites,
 * skill icons, HUD elements, and decorative UI pieces.
 *
 * Each entry contains:
 *  - id: unique key for referencing in components
 *  - name: human-readable label
 *  - category: asset group for organization
 *  - size: recommended pixel dimensions { w, h }
 *  - imagePrompt: AI art generation prompt (dark gritty medieval aesthetic)
 *  - fallbackColor: CSS color string for placeholder rendering
 *  - fallbackIcon: optional emoji/unicode glyph for text-based fallback
 */

export type UIAssetCategory =
  | 'menu-background'
  | 'button'
  | 'icon-stat'
  | 'icon-skill'
  | 'icon-item'
  | 'icon-faction'
  | 'icon-status'
  | 'hud'
  | 'frame'
  | 'divider'
  | 'portrait-frame'
  | 'misc';

export interface UIAsset {
  id: string;
  name: string;
  category: UIAssetCategory;
  size: { w: number; h: number };
  imagePrompt: string;
  fallbackColor: string;
  fallbackIcon?: string;
}

// ═══════════════════════════════════════════════════════════════════════
// MENU BACKGROUNDS  (8 assets)
// ═══════════════════════════════════════════════════════════════════════

const menuBackgrounds: UIAsset[] = [
  {
    id: 'bg_main_menu',
    name: 'Main Menu Background',
    category: 'menu-background',
    size: { w: 1920, h: 1080 },
    imagePrompt: 'A crumbling throne room at twilight, dust motes in dim light beams, an empty iron throne center frame, tattered banners of four factions hanging from pillars, dark fantasy matte painting, muted earth tones, parchment texture overlay',
    fallbackColor: '#1a1410',
  },
  {
    id: 'bg_character_creation',
    name: 'Character Creation Background',
    category: 'menu-background',
    size: { w: 1920, h: 1080 },
    imagePrompt: 'An alchemist workshop with shelves of reagents, a mirror reflecting shadows, armor stands with four different faction armors, candlelit, dark medieval aesthetic, oil painting style, muted warm tones',
    fallbackColor: '#1c1815',
  },
  {
    id: 'bg_inventory',
    name: 'Inventory Screen Background',
    category: 'menu-background',
    size: { w: 1920, h: 1080 },
    imagePrompt: 'Close-up of a worn leather satchel open on a wooden tavern table, scattered coins and parchment, dim firelight, top-down angle, dark medieval still life, oil painting style',
    fallbackColor: '#2a2118',
  },
  {
    id: 'bg_map',
    name: 'World Map Background',
    category: 'menu-background',
    size: { w: 1920, h: 1080 },
    imagePrompt: 'An aged parchment map spread on a war-table with iron weights at corners, ink stains, quill and compass rose, bird-eye view, sepia tones, hand-drawn cartography style, dark vignette',
    fallbackColor: '#3d3226',
  },
  {
    id: 'bg_combat',
    name: 'Combat Screen Background',
    category: 'menu-background',
    size: { w: 1920, h: 1080 },
    imagePrompt: 'A dark stone arena floor with scattered weapons and bloodstains, torches on pillars casting harsh shadows, fog rolling low, gritty medieval atmosphere, matte painting, desaturated palette',
    fallbackColor: '#151210',
  },
  {
    id: 'bg_dialogue',
    name: 'Dialogue Panel Background',
    category: 'menu-background',
    size: { w: 1200, h: 300 },
    imagePrompt: 'A horizontal strip of aged parchment with burnt edges, subtle ink filigree borders, dragon-claw watermark, warm sepia tone, seamless tileable texture',
    fallbackColor: '#3a3020',
  },
  {
    id: 'bg_game_over',
    name: 'Game Over Screen',
    category: 'menu-background',
    size: { w: 1920, h: 1080 },
    imagePrompt: 'A broken sword plunged into scorched earth under a blood-red sky, crows circling above, ruined castle silhouette in distance, dark fantasy matte painting, heavy vignette, desaturated reds and blacks',
    fallbackColor: '#120808',
  },
  {
    id: 'bg_victory',
    name: 'Victory Screen',
    category: 'menu-background',
    size: { w: 1920, h: 1080 },
    imagePrompt: 'Sunrise breaking over a restored kingdom, golden light flooding through stained glass of a grand hall, a crowned figure silhouetted, matte painting, warm golds and amber tones, oil painting style',
    fallbackColor: '#2a2010',
  },
];

// ═══════════════════════════════════════════════════════════════════════
// BUTTONS  (14 assets)
// ═══════════════════════════════════════════════════════════════════════

const buttons: UIAsset[] = [
  {
    id: 'btn_primary',
    name: 'Primary Button',
    category: 'button',
    size: { w: 280, h: 64 },
    imagePrompt: 'A rectangular iron plate with riveted edges, subtle gold inlay text area, slightly worn surface, game UI button, dark fantasy style, transparent background',
    fallbackColor: '#4a3828',
    fallbackIcon: '▬',
  },
  {
    id: 'btn_primary_hover',
    name: 'Primary Button Hover',
    category: 'button',
    size: { w: 280, h: 64 },
    imagePrompt: 'Same iron plate button glowing faintly amber at edges, gold inlay brightened, warm light emanating from rune etchings, game UI button hover state, dark fantasy',
    fallbackColor: '#6a4830',
  },
  {
    id: 'btn_primary_pressed',
    name: 'Primary Button Pressed',
    category: 'button',
    size: { w: 280, h: 64 },
    imagePrompt: 'Iron plate button depressed inward, shadow cast inside, dimmed gold inlay, pressed state, game UI, dark fantasy style',
    fallbackColor: '#3a2818',
  },
  {
    id: 'btn_secondary',
    name: 'Secondary Button',
    category: 'button',
    size: { w: 240, h: 56 },
    imagePrompt: 'A wooden plank button with iron corner brackets, carved text area, aged oak texture, game UI, dark medieval style, transparent background',
    fallbackColor: '#3d2e1e',
  },
  {
    id: 'btn_danger',
    name: 'Danger Button',
    category: 'button',
    size: { w: 240, h: 56 },
    imagePrompt: 'A dark iron button with red rune etchings, faint crimson glow along edges, warning sigil engraved, game UI, dark fantasy style',
    fallbackColor: '#4a1818',
  },
  {
    id: 'btn_choice_a',
    name: 'Dialogue Choice A',
    category: 'button',
    size: { w: 600, h: 72 },
    imagePrompt: 'A wide parchment scroll unfurled horizontally, iron clasps at ends, faint text lines visible, dialogue option UI element, sepia tones, medieval manuscript style',
    fallbackColor: '#352a1c',
  },
  {
    id: 'btn_choice_b',
    name: 'Dialogue Choice B',
    category: 'button',
    size: { w: 600, h: 72 },
    imagePrompt: 'A wide parchment scroll unfurled horizontally with darker ink and slight bloodstain in corner, dialogue option UI element, aged paper, medieval manuscript style',
    fallbackColor: '#30261a',
  },
  {
    id: 'btn_choice_locked',
    name: 'Locked Dialogue Choice',
    category: 'button',
    size: { w: 600, h: 72 },
    imagePrompt: 'A wide parchment scroll with a small iron padlock overlaid in corner, text area faded and illegible, locked option, grey tones, game UI, medieval style',
    fallbackColor: '#252220',
  },
  {
    id: 'btn_combat_action',
    name: 'Combat Action Button',
    category: 'button',
    size: { w: 200, h: 60 },
    imagePrompt: 'A shield-shaped iron button with sword-cross emblem, worn battle surface, game combat UI, dark fantasy, transparent background',
    fallbackColor: '#3a3030',
    fallbackIcon: '⚔',
  },
  {
    id: 'btn_combat_defend',
    name: 'Combat Defend Button',
    category: 'button',
    size: { w: 200, h: 60 },
    imagePrompt: 'A round shield-shaped button with crossed arms emblem, reinforced iron rim, game combat UI, dark fantasy, transparent background',
    fallbackColor: '#2a3040',
    fallbackIcon: '🛡',
  },
  {
    id: 'btn_tab_active',
    name: 'Active Tab',
    category: 'button',
    size: { w: 180, h: 48 },
    imagePrompt: 'An open book page tab with bright parchment, ink flourish at top, selected state, game UI tab, medieval manuscript style',
    fallbackColor: '#4a3c28',
  },
  {
    id: 'btn_tab_inactive',
    name: 'Inactive Tab',
    category: 'button',
    size: { w: 180, h: 48 },
    imagePrompt: 'A closed book page tab, darker aged parchment, folded corner, unselected state, game UI tab, medieval manuscript style',
    fallbackColor: '#2a2418',
  },
  {
    id: 'btn_close',
    name: 'Close / X Button',
    category: 'button',
    size: { w: 40, h: 40 },
    imagePrompt: 'A small circular iron medallion with an X scratched into surface, game UI close button, dark fantasy, transparent background',
    fallbackColor: '#3a2020',
    fallbackIcon: '✕',
  },
  {
    id: 'btn_arrow_right',
    name: 'Arrow Right Button',
    category: 'button',
    size: { w: 48, h: 48 },
    imagePrompt: 'A small triangular iron arrowhead pointing right, aged dark metal, game UI navigation arrow, medieval style, transparent background',
    fallbackColor: '#3a3020',
    fallbackIcon: '▶',
  },
];

// ═══════════════════════════════════════════════════════════════════════
// STAT ICONS  (8 assets)
// ═══════════════════════════════════════════════════════════════════════

const statIcons: UIAsset[] = [
  {
    id: 'icon_strength',
    name: 'Strength Icon',
    category: 'icon-stat',
    size: { w: 64, h: 64 },
    imagePrompt: 'A clenched iron gauntlet fist icon, dark metal with scratches, circular medallion frame, game RPG stat icon, dark fantasy, transparent background',
    fallbackColor: '#8B4513',
    fallbackIcon: '💪',
  },
  {
    id: 'icon_cunning',
    name: 'Cunning Icon',
    category: 'icon-stat',
    size: { w: 64, h: 64 },
    imagePrompt: 'A fox skull with one glowing eye icon, bone-white on dark, circular medallion frame, game RPG stat icon, dark fantasy, transparent background',
    fallbackColor: '#6B4C8A',
    fallbackIcon: '🦊',
  },
  {
    id: 'icon_charisma',
    name: 'Charisma Icon',
    category: 'icon-stat',
    size: { w: 64, h: 64 },
    imagePrompt: 'A golden tongue on a silver coin icon, ornate medieval heraldic style, circular medallion frame, game RPG stat icon, dark fantasy, transparent background',
    fallbackColor: '#B8860B',
    fallbackIcon: '👑',
  },
  {
    id: 'icon_arcana',
    name: 'Arcana Icon',
    category: 'icon-stat',
    size: { w: 64, h: 64 },
    imagePrompt: 'A glowing arcane eye with runic iris icon, ethereal blue-purple, circular medallion frame, game RPG stat icon, dark fantasy, transparent background',
    fallbackColor: '#4A2D8A',
    fallbackIcon: '🔮',
  },
  {
    id: 'icon_fortitude',
    name: 'Fortitude Icon',
    category: 'icon-stat',
    size: { w: 64, h: 64 },
    imagePrompt: 'A stone tower standing firm against lightning icon, grey and storm-blue, circular medallion frame, game RPG stat icon, dark fantasy, transparent background',
    fallbackColor: '#5A6A5A',
    fallbackIcon: '🏰',
  },
  {
    id: 'icon_perception',
    name: 'Perception Icon',
    category: 'icon-stat',
    size: { w: 64, h: 64 },
    imagePrompt: 'An eagle eye with crosshair pupil icon, sharp amber-gold, circular medallion frame, game RPG stat icon, dark fantasy, transparent background',
    fallbackColor: '#8B7A2B',
    fallbackIcon: '👁',
  },
  {
    id: 'icon_willpower',
    name: 'Willpower Icon',
    category: 'icon-stat',
    size: { w: 64, h: 64 },
    imagePrompt: 'A burning candle that refuses to extinguish in wind icon, resolute flame, circular medallion frame, game RPG stat icon, dark fantasy, transparent background',
    fallbackColor: '#B84A00',
    fallbackIcon: '🕯',
  },
  {
    id: 'icon_luck',
    name: 'Luck Icon',
    category: 'icon-stat',
    size: { w: 64, h: 64 },
    imagePrompt: 'A cracked coin landing on edge icon, impossible balance, gold and shadow, circular medallion frame, game RPG stat icon, dark fantasy, transparent background',
    fallbackColor: '#9A8A3A',
    fallbackIcon: '🎲',
  },
];

// ═══════════════════════════════════════════════════════════════════════
// SKILL ICONS  (20 assets)
// ═══════════════════════════════════════════════════════════════════════

const skillIcons: UIAsset[] = [
  // Iron Covenant skills
  {
    id: 'skill_crushing_blow',
    name: 'Crushing Blow',
    category: 'icon-skill',
    size: { w: 80, h: 80 },
    imagePrompt: 'A heavy warhammer mid-swing with impact shockwave icon, dark iron, red energy burst, square game ability icon with beveled iron border, dark fantasy',
    fallbackColor: '#6A2A2A',
    fallbackIcon: '🔨',
  },
  {
    id: 'skill_shield_wall',
    name: 'Shield Wall',
    category: 'icon-skill',
    size: { w: 80, h: 80 },
    imagePrompt: 'Three overlapping tower shields forming a wall icon, iron and oak, glowing defensive aura, square game ability icon with beveled iron border, dark fantasy',
    fallbackColor: '#4A5A6A',
    fallbackIcon: '🛡',
  },
  {
    id: 'skill_rallying_cry',
    name: 'Rallying Cry',
    category: 'icon-skill',
    size: { w: 80, h: 80 },
    imagePrompt: 'A war horn blowing with golden soundwaves icon, raised gauntlet behind it, buff ability, square game ability icon with beveled iron border, dark fantasy',
    fallbackColor: '#8A6A2A',
    fallbackIcon: '📯',
  },
  {
    id: 'skill_iron_resolve',
    name: 'Iron Resolve',
    category: 'icon-skill',
    size: { w: 80, h: 80 },
    imagePrompt: 'An armored knight kneeling with chains breaking around them icon, self-buff, silver glow, square game ability icon with beveled iron border, dark fantasy',
    fallbackColor: '#5A5A5A',
    fallbackIcon: '⛓',
  },
  {
    id: 'skill_commanders_strike',
    name: "Commander's Strike",
    category: 'icon-skill',
    size: { w: 80, h: 80 },
    imagePrompt: 'A pointed sword directing troops with tactical arrows icon, gold command lines, leadership ability, square game ability icon with beveled iron border, dark fantasy',
    fallbackColor: '#7A5A2A',
    fallbackIcon: '⚔',
  },
  // Gilded Veil skills
  {
    id: 'skill_poison_blade',
    name: 'Poison Blade',
    category: 'icon-skill',
    size: { w: 80, h: 80 },
    imagePrompt: 'A curved dagger dripping green poison icon, swirling toxic vapors, square game ability icon with ornate gold border, dark fantasy',
    fallbackColor: '#2A5A2A',
    fallbackIcon: '🗡',
  },
  {
    id: 'skill_shadow_step',
    name: 'Shadow Step',
    category: 'icon-skill',
    size: { w: 80, h: 80 },
    imagePrompt: 'A hooded figure dissolving into shadow tendrils icon, purple-black wisps, teleport ability, square game ability icon with ornate gold border, dark fantasy',
    fallbackColor: '#2A1A3A',
    fallbackIcon: '👤',
  },
  {
    id: 'skill_coin_toss',
    name: 'Coin Toss',
    category: 'icon-skill',
    size: { w: 80, h: 80 },
    imagePrompt: 'A spinning gold coin with skull on one side and crown on other icon, luck-based ability, glinting metal, square game ability icon with ornate gold border, dark fantasy',
    fallbackColor: '#8A7A1A',
    fallbackIcon: '🪙',
  },
  {
    id: 'skill_blackmail',
    name: 'Blackmail',
    category: 'icon-skill',
    size: { w: 80, h: 80 },
    imagePrompt: 'A sealed letter with broken wax seal and watching eye icon, dark manipulation ability, crimson and shadow, square game ability icon with ornate gold border, dark fantasy',
    fallbackColor: '#4A1A2A',
    fallbackIcon: '📜',
  },
  {
    id: 'skill_merchants_gambit',
    name: "Merchant's Gambit",
    category: 'icon-skill',
    size: { w: 80, h: 80 },
    imagePrompt: 'Stacked gold coins forming a shield with a hidden dagger behind icon, trade and treachery, square game ability icon with ornate gold border, dark fantasy',
    fallbackColor: '#6A5A1A',
    fallbackIcon: '💰',
  },
  // Verdant Court skills
  {
    id: 'skill_natures_wrath',
    name: "Nature's Wrath",
    category: 'icon-skill',
    size: { w: 80, h: 80 },
    imagePrompt: 'Thorny vines erupting from the earth with green energy icon, druidic attack spell, square game ability icon with living wood border, dark fantasy',
    fallbackColor: '#2A4A1A',
    fallbackIcon: '🌿',
  },
  {
    id: 'skill_healing_roots',
    name: 'Healing Roots',
    category: 'icon-skill',
    size: { w: 80, h: 80 },
    imagePrompt: 'Glowing golden roots wrapping around a wounded hand icon, warm green light, healing ability, square game ability icon with living wood border, dark fantasy',
    fallbackColor: '#3A6A2A',
    fallbackIcon: '🌱',
  },
  {
    id: 'skill_beast_call',
    name: 'Beast Call',
    category: 'icon-skill',
    size: { w: 80, h: 80 },
    imagePrompt: 'A wolf and raven silhouette howling/cawing at a green moon icon, summoning ability, wild energy, square game ability icon with living wood border, dark fantasy',
    fallbackColor: '#2A3A2A',
    fallbackIcon: '🐺',
  },
  {
    id: 'skill_bark_skin',
    name: 'Bark Skin',
    category: 'icon-skill',
    size: { w: 80, h: 80 },
    imagePrompt: 'An arm transforming into tree bark armor icon, leaves growing from joints, defensive buff, square game ability icon with living wood border, dark fantasy',
    fallbackColor: '#4A3A1A',
    fallbackIcon: '🌳',
  },
  {
    id: 'skill_entangle',
    name: 'Entangle',
    category: 'icon-skill',
    size: { w: 80, h: 80 },
    imagePrompt: 'Creeping vines wrapping around armored boots icon, roots from below, crowd control ability, square game ability icon with living wood border, dark fantasy',
    fallbackColor: '#1A3A1A',
    fallbackIcon: '🌾',
  },
  // Ashen Tribunal skills
  {
    id: 'skill_arcane_bolt',
    name: 'Arcane Bolt',
    category: 'icon-skill',
    size: { w: 80, h: 80 },
    imagePrompt: 'A spiraling bolt of violet-blue arcane energy icon, runic trail behind it, magic attack, square game ability icon with stone-carved border, dark fantasy',
    fallbackColor: '#3A2A5A',
    fallbackIcon: '⚡',
  },
  {
    id: 'skill_ward_of_silence',
    name: 'Ward of Silence',
    category: 'icon-skill',
    size: { w: 80, h: 80 },
    imagePrompt: 'A glowing sigil circle with a sealed mouth in center icon, anti-magic barrier, muted blue glow, square game ability icon with stone-carved border, dark fantasy',
    fallbackColor: '#2A2A4A',
    fallbackIcon: '🔇',
  },
  {
    id: 'skill_soul_drain',
    name: 'Soul Drain',
    category: 'icon-skill',
    size: { w: 80, h: 80 },
    imagePrompt: 'A skeletal hand pulling wisps of green soul energy from a figure icon, necromantic drain, square game ability icon with stone-carved border, dark fantasy',
    fallbackColor: '#1A2A1A',
    fallbackIcon: '💀',
  },
  {
    id: 'skill_ley_surge',
    name: 'Ley Surge',
    category: 'icon-skill',
    size: { w: 80, h: 80 },
    imagePrompt: 'Crackling ley-line energy erupting upward from a cracked floor icon, raw magical power, white-blue explosion, square game ability icon with stone-carved border, dark fantasy',
    fallbackColor: '#4A4A6A',
    fallbackIcon: '✨',
  },
  {
    id: 'skill_prophetic_shield',
    name: 'Prophetic Shield',
    category: 'icon-skill',
    size: { w: 80, h: 80 },
    imagePrompt: 'A translucent blue shield with an all-seeing eye in center icon, predictive defense, ethereal glow, square game ability icon with stone-carved border, dark fantasy',
    fallbackColor: '#3A3A5A',
    fallbackIcon: '🔵',
  },
];

// ═══════════════════════════════════════════════════════════════════════
// ITEM SPRITE ICONS  (20 assets)
// ═══════════════════════════════════════════════════════════════════════

const itemIcons: UIAsset[] = [
  {
    id: 'item_sword',
    name: 'Sword Sprite',
    category: 'icon-item',
    size: { w: 64, h: 64 },
    imagePrompt: 'A longsword with leather-wrapped hilt icon, aged steel blade, game inventory sprite, transparent background, dark fantasy pixel-art style',
    fallbackColor: '#8A8A8A',
    fallbackIcon: '🗡',
  },
  {
    id: 'item_shield',
    name: 'Shield Sprite',
    category: 'icon-item',
    size: { w: 64, h: 64 },
    imagePrompt: 'A kite shield with faded heraldry icon, dented and battle-worn, game inventory sprite, transparent background, dark fantasy pixel-art style',
    fallbackColor: '#6A5A4A',
    fallbackIcon: '🛡',
  },
  {
    id: 'item_potion_health',
    name: 'Health Potion Sprite',
    category: 'icon-item',
    size: { w: 64, h: 64 },
    imagePrompt: 'A glass vial with glowing red liquid and cork stopper icon, swirling crimson contents, game inventory sprite, transparent background, dark fantasy',
    fallbackColor: '#8A2020',
    fallbackIcon: '🧪',
  },
  {
    id: 'item_potion_mana',
    name: 'Mana Potion Sprite',
    category: 'icon-item',
    size: { w: 64, h: 64 },
    imagePrompt: 'A glass vial with glowing blue liquid and silver stopper icon, sparkling azure contents, game inventory sprite, transparent background, dark fantasy',
    fallbackColor: '#2040A0',
    fallbackIcon: '🧪',
  },
  {
    id: 'item_potion_antidote',
    name: 'Antidote Sprite',
    category: 'icon-item',
    size: { w: 64, h: 64 },
    imagePrompt: 'A round flask with murky green-yellow liquid icon, herbal remedy, game inventory sprite, transparent background, dark fantasy',
    fallbackColor: '#4A6A20',
    fallbackIcon: '🧴',
  },
  {
    id: 'item_armor_light',
    name: 'Light Armor Sprite',
    category: 'icon-item',
    size: { w: 64, h: 64 },
    imagePrompt: 'A leather jerkin with brass buckles icon, scout armor, game inventory sprite, transparent background, dark fantasy',
    fallbackColor: '#6A4A2A',
    fallbackIcon: '🧥',
  },
  {
    id: 'item_armor_heavy',
    name: 'Heavy Armor Sprite',
    category: 'icon-item',
    size: { w: 64, h: 64 },
    imagePrompt: 'A full plate breastplate with chainmail underneath icon, dark iron, game inventory sprite, transparent background, dark fantasy',
    fallbackColor: '#4A4A4A',
    fallbackIcon: '🛡',
  },
  {
    id: 'item_robe',
    name: 'Arcane Robe Sprite',
    category: 'icon-item',
    size: { w: 64, h: 64 },
    imagePrompt: 'A dark hooded robe with glowing runic embroidery icon, mage vestments, game inventory sprite, transparent background, dark fantasy',
    fallbackColor: '#2A1A4A',
    fallbackIcon: '👘',
  },
  {
    id: 'item_ring',
    name: 'Ring Sprite',
    category: 'icon-item',
    size: { w: 64, h: 64 },
    imagePrompt: 'A gold signet ring with dark gemstone icon, magical accessory, game inventory sprite, transparent background, dark fantasy',
    fallbackColor: '#B8860B',
    fallbackIcon: '💍',
  },
  {
    id: 'item_amulet',
    name: 'Amulet Sprite',
    category: 'icon-item',
    size: { w: 64, h: 64 },
    imagePrompt: 'A pendant amulet on a silver chain with pulsing amber gem icon, protective talisman, game inventory sprite, transparent background, dark fantasy',
    fallbackColor: '#8A6A10',
    fallbackIcon: '📿',
  },
  {
    id: 'item_scroll',
    name: 'Scroll Sprite',
    category: 'icon-item',
    size: { w: 64, h: 64 },
    imagePrompt: 'A rolled parchment scroll tied with red ribbon and wax seal icon, magical document, game inventory sprite, transparent background, dark fantasy',
    fallbackColor: '#8A7A5A',
    fallbackIcon: '📜',
  },
  {
    id: 'item_key',
    name: 'Key Sprite',
    category: 'icon-item',
    size: { w: 64, h: 64 },
    imagePrompt: 'An ornate iron skeleton key with dragon-head bow icon, heavy and ancient, game inventory sprite, transparent background, dark fantasy',
    fallbackColor: '#5A4A3A',
    fallbackIcon: '🔑',
  },
  {
    id: 'item_dagger',
    name: 'Dagger Sprite',
    category: 'icon-item',
    size: { w: 64, h: 64 },
    imagePrompt: 'A curved assassin dagger with dark leather grip icon, thin poisoned blade, game inventory sprite, transparent background, dark fantasy',
    fallbackColor: '#3A3A3A',
    fallbackIcon: '🔪',
  },
  {
    id: 'item_staff',
    name: 'Staff Sprite',
    category: 'icon-item',
    size: { w: 64, h: 64 },
    imagePrompt: 'A gnarled wooden staff with a crystal orb set in twisted branches at top icon, druidic focus, game inventory sprite, transparent background, dark fantasy',
    fallbackColor: '#4A3A1A',
    fallbackIcon: '🪄',
  },
  {
    id: 'item_bow',
    name: 'Bow Sprite',
    category: 'icon-item',
    size: { w: 64, h: 64 },
    imagePrompt: 'A recurve bow of dark yew wood with silver inlay icon, ranger weapon, game inventory sprite, transparent background, dark fantasy',
    fallbackColor: '#5A3A1A',
    fallbackIcon: '🏹',
  },
  {
    id: 'item_gold_pouch',
    name: 'Gold Pouch Sprite',
    category: 'icon-item',
    size: { w: 64, h: 64 },
    imagePrompt: 'A leather coin purse overflowing with gold coins icon, wealth, game inventory sprite, transparent background, dark fantasy',
    fallbackColor: '#B8960B',
    fallbackIcon: '💰',
  },
  {
    id: 'item_herb_bundle',
    name: 'Herb Bundle Sprite',
    category: 'icon-item',
    size: { w: 64, h: 64 },
    imagePrompt: 'A tied bundle of dried herbs and medicinal plants icon, alchemical ingredient, game inventory sprite, transparent background, dark fantasy',
    fallbackColor: '#3A5A2A',
    fallbackIcon: '🌿',
  },
  {
    id: 'item_lockpick',
    name: 'Lockpick Set Sprite',
    category: 'icon-item',
    size: { w: 64, h: 64 },
    imagePrompt: 'A set of thin metal lockpicks in a leather roll icon, thief tools, game inventory sprite, transparent background, dark fantasy',
    fallbackColor: '#5A5A5A',
    fallbackIcon: '🔧',
  },
  {
    id: 'item_torch',
    name: 'Torch Sprite',
    category: 'icon-item',
    size: { w: 64, h: 64 },
    imagePrompt: 'A burning torch with oil-soaked cloth wrapping icon, flickering orange flame, game inventory sprite, transparent background, dark fantasy',
    fallbackColor: '#8A4A0A',
    fallbackIcon: '🔥',
  },
  {
    id: 'item_map_fragment',
    name: 'Map Fragment Sprite',
    category: 'icon-item',
    size: { w: 64, h: 64 },
    imagePrompt: 'A torn piece of treasure map with X marking a location icon, aged parchment, game inventory sprite, transparent background, dark fantasy',
    fallbackColor: '#7A6A4A',
    fallbackIcon: '🗺',
  },
];

// ═══════════════════════════════════════════════════════════════════════
// FACTION ICONS  (8 assets — 4 factions × normal + stylized)
// ═══════════════════════════════════════════════════════════════════════

const factionIcons: UIAsset[] = [
  {
    id: 'faction_iron_covenant',
    name: 'Iron Covenant Emblem',
    category: 'icon-faction',
    size: { w: 128, h: 128 },
    imagePrompt: 'An iron gauntlet gripping a broken crown heraldic emblem, dark steel on crimson field, medieval coat of arms style, oil painting on aged canvas, dark fantasy',
    fallbackColor: '#5A3030',
    fallbackIcon: '⚔',
  },
  {
    id: 'faction_iron_covenant_banner',
    name: 'Iron Covenant Banner',
    category: 'icon-faction',
    size: { w: 200, h: 400 },
    imagePrompt: 'A tattered war banner hanging from an iron crossbar, crimson field with iron gauntlet emblem, battle-worn edges, full vertical banner, dark fantasy oil painting',
    fallbackColor: '#4A2020',
  },
  {
    id: 'faction_gilded_veil',
    name: 'Gilded Veil Emblem',
    category: 'icon-faction',
    size: { w: 128, h: 128 },
    imagePrompt: 'A golden mask with one eye closed heraldic emblem, ornate filigree on deep purple field, medieval coat of arms style, oil painting on aged canvas, dark fantasy',
    fallbackColor: '#6A5A20',
    fallbackIcon: '🎭',
  },
  {
    id: 'faction_gilded_veil_banner',
    name: 'Gilded Veil Banner',
    category: 'icon-faction',
    size: { w: 200, h: 400 },
    imagePrompt: 'A luxurious silk banner on a gilded rod, deep purple field with golden mask emblem, pristine but sinister, full vertical banner, dark fantasy oil painting',
    fallbackColor: '#3A2A50',
  },
  {
    id: 'faction_verdant_court',
    name: 'Verdant Court Emblem',
    category: 'icon-faction',
    size: { w: 128, h: 128 },
    imagePrompt: 'A great oak tree with antler-branches heraldic emblem, green and brown on moss-green field, medieval coat of arms style, oil painting on aged canvas, dark fantasy',
    fallbackColor: '#2A4A20',
    fallbackIcon: '🌳',
  },
  {
    id: 'faction_verdant_court_banner',
    name: 'Verdant Court Banner',
    category: 'icon-faction',
    size: { w: 200, h: 400 },
    imagePrompt: 'A living banner of woven vines and leaves on a branch crossbar, moss-green field with oak-antler emblem, growing and organic, full vertical banner, dark fantasy oil painting',
    fallbackColor: '#1A3A1A',
  },
  {
    id: 'faction_ashen_tribunal',
    name: 'Ashen Tribunal Emblem',
    category: 'icon-faction',
    size: { w: 128, h: 128 },
    imagePrompt: 'An all-seeing eye within a triangle of flame heraldic emblem, blue-white on slate-grey field, medieval coat of arms style, oil painting on aged canvas, dark fantasy',
    fallbackColor: '#3A3A5A',
    fallbackIcon: '👁',
  },
  {
    id: 'faction_ashen_tribunal_banner',
    name: 'Ashen Tribunal Banner',
    category: 'icon-faction',
    size: { w: 200, h: 400 },
    imagePrompt: 'An ancient stone-grey banner on a rune-carved staff, slate field with burning eye-triangle emblem, ash particles floating, full vertical banner, dark fantasy oil painting',
    fallbackColor: '#2A2A3A',
  },
];

// ═══════════════════════════════════════════════════════════════════════
// STATUS EFFECT ICONS  (12 assets)
// ═══════════════════════════════════════════════════════════════════════

const statusIcons: UIAsset[] = [
  {
    id: 'status_poisoned',
    name: 'Poisoned',
    category: 'icon-status',
    size: { w: 48, h: 48 },
    imagePrompt: 'A skull with green dripping liquid icon, toxic status effect, small game icon, neon green on dark, dark fantasy',
    fallbackColor: '#2A8A2A',
    fallbackIcon: '☠',
  },
  {
    id: 'status_bleeding',
    name: 'Bleeding',
    category: 'icon-status',
    size: { w: 48, h: 48 },
    imagePrompt: 'Three red blood drops falling icon, bleeding status effect, small game icon, crimson on dark, dark fantasy',
    fallbackColor: '#8A2020',
    fallbackIcon: '🩸',
  },
  {
    id: 'status_stunned',
    name: 'Stunned',
    category: 'icon-status',
    size: { w: 48, h: 48 },
    imagePrompt: 'Spinning stars around a dazed head silhouette icon, stun status effect, small game icon, yellow sparks on dark, dark fantasy',
    fallbackColor: '#8A8A20',
    fallbackIcon: '💫',
  },
  {
    id: 'status_buffed',
    name: 'Strength Buffed',
    category: 'icon-status',
    size: { w: 48, h: 48 },
    imagePrompt: 'An upward arrow with glowing red aura icon, stat buff active, small game icon, warm red-gold on dark, dark fantasy',
    fallbackColor: '#6A4A10',
    fallbackIcon: '⬆',
  },
  {
    id: 'status_debuffed',
    name: 'Weakened',
    category: 'icon-status',
    size: { w: 48, h: 48 },
    imagePrompt: 'A downward arrow with sickly grey aura icon, stat debuff active, small game icon, grey-purple on dark, dark fantasy',
    fallbackColor: '#4A3A5A',
    fallbackIcon: '⬇',
  },
  {
    id: 'status_shielded',
    name: 'Shielded',
    category: 'icon-status',
    size: { w: 48, h: 48 },
    imagePrompt: 'A glowing golden shield outline icon, protective barrier active, small game icon, gold on dark, dark fantasy',
    fallbackColor: '#6A6A20',
    fallbackIcon: '🛡',
  },
  {
    id: 'status_burning',
    name: 'Burning',
    category: 'icon-status',
    size: { w: 48, h: 48 },
    imagePrompt: 'A flame engulfing a figure silhouette icon, fire DOT effect, small game icon, orange-red on dark, dark fantasy',
    fallbackColor: '#8A4A0A',
    fallbackIcon: '🔥',
  },
  {
    id: 'status_frozen',
    name: 'Frozen',
    category: 'icon-status',
    size: { w: 48, h: 48 },
    imagePrompt: 'An ice crystal encasing a figure icon, frozen status, small game icon, pale blue-white on dark, dark fantasy',
    fallbackColor: '#4A6A8A',
    fallbackIcon: '❄',
  },
  {
    id: 'status_silenced',
    name: 'Silenced',
    category: 'icon-status',
    size: { w: 48, h: 48 },
    imagePrompt: 'A mouth with an X across it icon, magic-silenced status, small game icon, muted purple on dark, dark fantasy',
    fallbackColor: '#4A2A4A',
    fallbackIcon: '🤐',
  },
  {
    id: 'status_blessed',
    name: 'Blessed',
    category: 'icon-status',
    size: { w: 48, h: 48 },
    imagePrompt: 'A radiant halo with downward light rays icon, divine blessing status, small game icon, warm gold on dark, dark fantasy',
    fallbackColor: '#8A7A30',
    fallbackIcon: '✨',
  },
  {
    id: 'status_cursed',
    name: 'Cursed',
    category: 'icon-status',
    size: { w: 48, h: 48 },
    imagePrompt: 'A cracked dark rune circle with red eye in center icon, curse active, small game icon, dark red-black on dark, dark fantasy',
    fallbackColor: '#3A1010',
    fallbackIcon: '🔴',
  },
  {
    id: 'status_regenerating',
    name: 'Regenerating',
    category: 'icon-status',
    size: { w: 48, h: 48 },
    imagePrompt: 'A green leaf spiral with healing particles icon, health regen, small game icon, emerald green on dark, dark fantasy',
    fallbackColor: '#2A6A2A',
    fallbackIcon: '💚',
  },
];

// ═══════════════════════════════════════════════════════════════════════
// HUD ELEMENTS  (16 assets)
// ═══════════════════════════════════════════════════════════════════════

const hudElements: UIAsset[] = [
  {
    id: 'hud_health_bar_frame',
    name: 'Health Bar Frame',
    category: 'hud',
    size: { w: 300, h: 40 },
    imagePrompt: 'A horizontal bar frame of dark iron with rivets, blood-red fill area, heart emblem on left, game HUD health bar, dark fantasy, transparent background',
    fallbackColor: '#3A1010',
    fallbackIcon: '❤',
  },
  {
    id: 'hud_health_bar_fill',
    name: 'Health Bar Fill',
    category: 'hud',
    size: { w: 280, h: 24 },
    imagePrompt: 'A seamless horizontal gradient fill, deep red to bright crimson, subtle pulsing glow texture, health bar interior, game HUD, tileable',
    fallbackColor: '#AA2020',
  },
  {
    id: 'hud_mana_bar_frame',
    name: 'Mana Bar Frame',
    category: 'hud',
    size: { w: 300, h: 40 },
    imagePrompt: 'A horizontal bar frame of dark iron with arcane rune rivets, blue fill area, crystal emblem on left, game HUD mana bar, dark fantasy, transparent background',
    fallbackColor: '#101A3A',
    fallbackIcon: '🔷',
  },
  {
    id: 'hud_mana_bar_fill',
    name: 'Mana Bar Fill',
    category: 'hud',
    size: { w: 280, h: 24 },
    imagePrompt: 'A seamless horizontal gradient fill, deep blue to bright azure with swirling energy, mana bar interior, game HUD, tileable',
    fallbackColor: '#2040AA',
  },
  {
    id: 'hud_xp_bar_frame',
    name: 'XP Bar Frame',
    category: 'hud',
    size: { w: 400, h: 20 },
    imagePrompt: 'A thin horizontal bar frame of bronze with parchment interior, star emblem on right, experience bar, game HUD, dark fantasy, transparent background',
    fallbackColor: '#2A2A10',
  },
  {
    id: 'hud_xp_bar_fill',
    name: 'XP Bar Fill',
    category: 'hud',
    size: { w: 380, h: 12 },
    imagePrompt: 'A seamless horizontal gradient fill, amber to bright gold with sparkle particles, experience bar interior, game HUD, tileable',
    fallbackColor: '#AA8A20',
  },
  {
    id: 'hud_reputation_bar',
    name: 'Reputation Bar Frame',
    category: 'hud',
    size: { w: 250, h: 24 },
    imagePrompt: 'A thin horizontal bar frame with faction-colored fill area, neutral center marker, reputation/loyalty meter, game HUD, dark fantasy, transparent background',
    fallbackColor: '#2A2A2A',
  },
  {
    id: 'hud_minimap_frame',
    name: 'Minimap Frame',
    category: 'hud',
    size: { w: 200, h: 200 },
    imagePrompt: 'A circular frame of carved stone with compass rose at top, iron rivets, weathered edges, minimap border, game HUD, dark fantasy, transparent background',
    fallbackColor: '#2A2218',
  },
  {
    id: 'hud_portrait_frame_player',
    name: 'Player Portrait Frame',
    category: 'hud',
    size: { w: 96, h: 96 },
    imagePrompt: 'A square portrait frame of dark iron with crown detail at top, battle-worn edges, player character portrait border, game HUD, dark fantasy, transparent background',
    fallbackColor: '#3A3020',
  },
  {
    id: 'hud_portrait_frame_enemy',
    name: 'Enemy Portrait Frame',
    category: 'hud',
    size: { w: 96, h: 96 },
    imagePrompt: 'A square portrait frame of blood-red iron with skull detail at top, menacing edges, enemy portrait border, game HUD, dark fantasy, transparent background',
    fallbackColor: '#3A2020',
  },
  {
    id: 'hud_turn_indicator',
    name: 'Turn Indicator',
    category: 'hud',
    size: { w: 120, h: 40 },
    imagePrompt: 'A hourglass icon with sand falling on a small iron plaque, YOUR TURN indicator, game combat HUD, dark fantasy, transparent background',
    fallbackColor: '#4A3A10',
    fallbackIcon: '⏳',
  },
  {
    id: 'hud_action_points',
    name: 'Action Points Display',
    category: 'hud',
    size: { w: 160, h: 40 },
    imagePrompt: 'Three circular gem slots in an iron bracket, filled gems glow amber, empty gems are dark, action point counter, game HUD, dark fantasy, transparent background',
    fallbackColor: '#3A3010',
    fallbackIcon: '◆',
  },
  {
    id: 'hud_chapter_banner',
    name: 'Chapter Title Banner',
    category: 'hud',
    size: { w: 600, h: 100 },
    imagePrompt: 'A wide parchment banner unfurling with iron weights at corners, ornate calligraphy text area, chapter announcement, game HUD overlay, dark fantasy, sepia tones',
    fallbackColor: '#3A3020',
  },
  {
    id: 'hud_notification_toast',
    name: 'Notification Toast',
    category: 'hud',
    size: { w: 350, h: 60 },
    imagePrompt: 'A small parchment scroll popping up with wax seal, notification area, achievement/event alert, game HUD toast, dark fantasy, sepia tones, transparent background',
    fallbackColor: '#3A3020',
  },
  {
    id: 'hud_tooltip_bg',
    name: 'Tooltip Background',
    category: 'hud',
    size: { w: 300, h: 200 },
    imagePrompt: 'A dark parchment rectangle with thin gold filigree border, aged paper texture, tooltip/info panel background, game HUD, dark fantasy, semi-transparent dark',
    fallbackColor: '#1A1810',
  },
  {
    id: 'hud_quest_tracker',
    name: 'Quest Tracker Panel',
    category: 'hud',
    size: { w: 280, h: 400 },
    imagePrompt: 'A vertical parchment scroll pinned to a dark surface with iron tacks, lined text area with checkboxes, quest tracking sidebar, game HUD, dark fantasy, semi-transparent',
    fallbackColor: '#2A2418',
  },
];

// ═══════════════════════════════════════════════════════════════════════
// FRAMES & DECORATIVE ELEMENTS  (12 assets)
// ═══════════════════════════════════════════════════════════════════════

const frames: UIAsset[] = [
  {
    id: 'frame_panel_dark',
    name: 'Dark Panel Frame',
    category: 'frame',
    size: { w: 400, h: 600 },
    imagePrompt: 'A rectangular dark wood panel frame with iron corner brackets and nail heads, aged oak texture interior, UI panel border, game interface, dark fantasy, tileable edges',
    fallbackColor: '#1A1810',
  },
  {
    id: 'frame_panel_parchment',
    name: 'Parchment Panel Frame',
    category: 'frame',
    size: { w: 400, h: 600 },
    imagePrompt: 'A rectangular aged parchment panel with burnt edges and ink stain corners, leather-stitched border, UI panel, game interface, dark fantasy, tileable edges',
    fallbackColor: '#3A3020',
  },
  {
    id: 'frame_modal',
    name: 'Modal Dialog Frame',
    category: 'frame',
    size: { w: 600, h: 400 },
    imagePrompt: 'An ornate rectangular frame of dark iron and gold filigree, heavy riveted corners, throne-room window style, modal dialog border, game UI, dark fantasy',
    fallbackColor: '#2A2218',
  },
  {
    id: 'frame_inventory_slot',
    name: 'Inventory Slot Frame',
    category: 'frame',
    size: { w: 72, h: 72 },
    imagePrompt: 'A small square slot frame of dark iron with beveled edges, empty item slot, game inventory grid, dark fantasy, transparent background',
    fallbackColor: '#1A1A1A',
  },
  {
    id: 'frame_inventory_slot_selected',
    name: 'Inventory Slot Selected',
    category: 'frame',
    size: { w: 72, h: 72 },
    imagePrompt: 'A small square slot frame of glowing gold iron with beveled edges, selected item slot, warm glow effect, game inventory grid, dark fantasy, transparent background',
    fallbackColor: '#3A3010',
  },
  {
    id: 'frame_skill_slot',
    name: 'Skill Slot Frame',
    category: 'frame',
    size: { w: 80, h: 80 },
    imagePrompt: 'A square ability slot frame with arcane rune corners, dark stone texture, cooldown overlay area, game combat hotbar slot, dark fantasy, transparent background',
    fallbackColor: '#1A1A2A',
  },
  {
    id: 'frame_skill_slot_cooldown',
    name: 'Skill Slot Cooldown Overlay',
    category: 'frame',
    size: { w: 80, h: 80 },
    imagePrompt: 'A semi-transparent dark clock-wipe overlay for ability cooldown, shadowy sweep from top, game combat cooldown indicator, dark fantasy',
    fallbackColor: 'rgba(0,0,0,0.6)',
  },
  {
    id: 'frame_character_sheet',
    name: 'Character Sheet Frame',
    category: 'frame',
    size: { w: 800, h: 1000 },
    imagePrompt: 'A full-page parchment document with ornate header scroll, sections divided by ink lines, wax seal at bottom, character sheet layout, game UI, dark fantasy, aged paper texture',
    fallbackColor: '#2A2418',
  },
  {
    id: 'frame_dialogue_box',
    name: 'Dialogue Box Frame',
    category: 'frame',
    size: { w: 900, h: 250 },
    imagePrompt: 'A wide horizontal panel of dark wood with parchment interior, iron hinges at corners, NPC speech area, game dialogue box, dark fantasy',
    fallbackColor: '#1A1810',
  },
  {
    id: 'frame_card',
    name: 'Card Frame',
    category: 'frame',
    size: { w: 200, h: 280 },
    imagePrompt: 'A playing-card-sized frame of dark iron with parchment interior, ornate top banner for title, image area center, stats area bottom, game card border, dark fantasy',
    fallbackColor: '#2A2218',
  },
  {
    id: 'frame_achievement',
    name: 'Achievement Frame',
    category: 'frame',
    size: { w: 400, h: 80 },
    imagePrompt: 'A horizontal banner frame with laurel wreath on left, parchment text area, gold trim, achievement/trophy popup, game UI, dark fantasy, transparent background',
    fallbackColor: '#2A2A10',
  },
  {
    id: 'frame_save_slot',
    name: 'Save Slot Frame',
    category: 'frame',
    size: { w: 500, h: 100 },
    imagePrompt: 'A horizontal panel with small portrait window on left, parchment info area right, iron bracket border, save game slot, game UI, dark fantasy',
    fallbackColor: '#1A1A18',
  },
];

// ═══════════════════════════════════════════════════════════════════════
// DIVIDERS & ORNAMENTS  (8 assets)
// ═══════════════════════════════════════════════════════════════════════

const dividers: UIAsset[] = [
  {
    id: 'divider_horizontal',
    name: 'Horizontal Divider',
    category: 'divider',
    size: { w: 600, h: 16 },
    imagePrompt: 'A thin horizontal ornamental divider line with a small sword crossing it at center, dark iron filigree, game UI separator, dark fantasy, transparent background',
    fallbackColor: '#4A4A4A',
  },
  {
    id: 'divider_horizontal_gold',
    name: 'Gold Horizontal Divider',
    category: 'divider',
    size: { w: 600, h: 16 },
    imagePrompt: 'A thin horizontal ornamental divider line with crown motif at center, gold filigree on dark, game UI separator, dark fantasy, transparent background',
    fallbackColor: '#8A7A3A',
  },
  {
    id: 'divider_vertical',
    name: 'Vertical Divider',
    category: 'divider',
    size: { w: 16, h: 600 },
    imagePrompt: 'A thin vertical ornamental divider line with knotwork pattern, dark iron filigree, game UI separator, dark fantasy, transparent background',
    fallbackColor: '#4A4A4A',
  },
  {
    id: 'divider_chapter',
    name: 'Chapter Divider',
    category: 'divider',
    size: { w: 800, h: 40 },
    imagePrompt: 'An elaborate horizontal divider with dragon motif at center, scrollwork extending both sides, chapter break ornament, book illustration style, dark ink on parchment',
    fallbackColor: '#3A3020',
  },
  {
    id: 'ornament_corner_tl',
    name: 'Corner Ornament Top-Left',
    category: 'divider',
    size: { w: 64, h: 64 },
    imagePrompt: 'A top-left corner ornament of iron filigree with leaf and vine motif, decorative corner bracket, game UI, dark fantasy, transparent background',
    fallbackColor: '#4A4A3A',
  },
  {
    id: 'ornament_corner_br',
    name: 'Corner Ornament Bottom-Right',
    category: 'divider',
    size: { w: 64, h: 64 },
    imagePrompt: 'A bottom-right corner ornament of iron filigree with leaf and vine motif, decorative corner bracket, mirrored, game UI, dark fantasy, transparent background',
    fallbackColor: '#4A4A3A',
  },
  {
    id: 'ornament_flourish',
    name: 'Text Flourish',
    category: 'divider',
    size: { w: 200, h: 30 },
    imagePrompt: 'A calligraphic flourish swirl decoration, dark ink on transparent, text underline ornament, medieval manuscript style, game UI',
    fallbackColor: '#3A3A30',
  },
  {
    id: 'ornament_wax_seal',
    name: 'Wax Seal Ornament',
    category: 'divider',
    size: { w: 80, h: 80 },
    imagePrompt: 'A dark red wax seal with dragon sigil pressed into it, broken ribbon underneath, decorative document element, game UI, dark fantasy, transparent background',
    fallbackColor: '#6A2020',
  },
];

// ═══════════════════════════════════════════════════════════════════════
// PORTRAIT FRAMES  (4 assets)
// ═══════════════════════════════════════════════════════════════════════

const portraitFrames: UIAsset[] = [
  {
    id: 'portrait_frame_npc',
    name: 'NPC Portrait Frame',
    category: 'portrait-frame',
    size: { w: 128, h: 128 },
    imagePrompt: 'A square portrait frame of dark carved wood with heraldic top crest, dialogue speaker frame, NPC portrait border, game UI, dark fantasy, transparent background',
    fallbackColor: '#2A2218',
  },
  {
    id: 'portrait_frame_ally',
    name: 'Ally Portrait Frame',
    category: 'portrait-frame',
    size: { w: 128, h: 128 },
    imagePrompt: 'A square portrait frame with green-gold trim and laurel wreath at top, allied character, friendly NPC border, game UI, dark fantasy, transparent background',
    fallbackColor: '#2A3A18',
  },
  {
    id: 'portrait_frame_hostile',
    name: 'Hostile Portrait Frame',
    category: 'portrait-frame',
    size: { w: 128, h: 128 },
    imagePrompt: 'A square portrait frame with red-black iron spikes and skull at top, hostile character, enemy NPC border, game UI, dark fantasy, transparent background',
    fallbackColor: '#3A1A1A',
  },
  {
    id: 'portrait_frame_neutral',
    name: 'Neutral Portrait Frame',
    category: 'portrait-frame',
    size: { w: 128, h: 128 },
    imagePrompt: 'A square portrait frame of simple iron with balanced scales at top, neutral character, unknown allegiance border, game UI, dark fantasy, transparent background',
    fallbackColor: '#2A2A2A',
  },
];

// ═══════════════════════════════════════════════════════════════════════
// MISC UI ICONS  (12 assets)
// ═══════════════════════════════════════════════════════════════════════

const miscIcons: UIAsset[] = [
  {
    id: 'icon_save',
    name: 'Save Game Icon',
    category: 'misc',
    size: { w: 48, h: 48 },
    imagePrompt: 'A quill writing on parchment icon, save game symbol, dark ink, game UI icon, dark fantasy, transparent background',
    fallbackColor: '#6A5A3A',
    fallbackIcon: '💾',
  },
  {
    id: 'icon_load',
    name: 'Load Game Icon',
    category: 'misc',
    size: { w: 48, h: 48 },
    imagePrompt: 'An open book with glowing pages icon, load game symbol, warm light, game UI icon, dark fantasy, transparent background',
    fallbackColor: '#5A4A2A',
    fallbackIcon: '📖',
  },
  {
    id: 'icon_settings',
    name: 'Settings Icon',
    category: 'misc',
    size: { w: 48, h: 48 },
    imagePrompt: 'An iron gear/cog with medieval filigree icon, settings symbol, dark metal, game UI icon, dark fantasy, transparent background',
    fallbackColor: '#4A4A4A',
    fallbackIcon: '⚙',
  },
  {
    id: 'icon_quest_active',
    name: 'Active Quest Marker',
    category: 'misc',
    size: { w: 32, h: 32 },
    imagePrompt: 'A glowing golden exclamation mark on a small shield icon, active quest marker, game UI, dark fantasy, transparent background',
    fallbackColor: '#AA8A20',
    fallbackIcon: '❗',
  },
  {
    id: 'icon_quest_complete',
    name: 'Completed Quest Marker',
    category: 'misc',
    size: { w: 32, h: 32 },
    imagePrompt: 'A golden checkmark on a small shield icon, completed quest marker, game UI, dark fantasy, transparent background',
    fallbackColor: '#4A8A20',
    fallbackIcon: '✅',
  },
  {
    id: 'icon_locked',
    name: 'Locked Icon',
    category: 'misc',
    size: { w: 32, h: 32 },
    imagePrompt: 'A small iron padlock icon, locked content indicator, dark metal, game UI, dark fantasy, transparent background',
    fallbackColor: '#4A3A3A',
    fallbackIcon: '🔒',
  },
  {
    id: 'icon_new_game_plus',
    name: 'New Game+ Icon',
    category: 'misc',
    size: { w: 64, h: 64 },
    imagePrompt: 'An ouroboros serpent eating its tail with a plus symbol in center icon, new game plus, gold on dark, game UI, dark fantasy, transparent background',
    fallbackColor: '#6A5A10',
    fallbackIcon: '♾',
  },
  {
    id: 'icon_achievement',
    name: 'Achievement Icon',
    category: 'misc',
    size: { w: 48, h: 48 },
    imagePrompt: 'A medieval trophy chalice with laurel wreath icon, achievement earned, gold, game UI, dark fantasy, transparent background',
    fallbackColor: '#8A7A20',
    fallbackIcon: '🏆',
  },
  {
    id: 'icon_death_skull',
    name: 'Death/Defeat Icon',
    category: 'misc',
    size: { w: 64, h: 64 },
    imagePrompt: 'A cracked human skull with crossed bones icon, death/defeat symbol, bone-white on dark, game UI, dark fantasy, transparent background',
    fallbackColor: '#5A4A4A',
    fallbackIcon: '💀',
  },
  {
    id: 'icon_crown',
    name: 'Crown/Victory Icon',
    category: 'misc',
    size: { w: 64, h: 64 },
    imagePrompt: 'A golden crown with dark gemstones icon, victory/royalty symbol, gleaming gold, game UI, dark fantasy, transparent background',
    fallbackColor: '#AA8A10',
    fallbackIcon: '👑',
  },
  {
    id: 'icon_map_pin',
    name: 'Map Pin Icon',
    category: 'misc',
    size: { w: 32, h: 48 },
    imagePrompt: 'A small iron map pin/tack with red flag icon, location marker for world map, game UI, dark fantasy, transparent background',
    fallbackColor: '#6A2A2A',
    fallbackIcon: '📍',
  },
  {
    id: 'icon_level_up',
    name: 'Level Up Icon',
    category: 'misc',
    size: { w: 64, h: 64 },
    imagePrompt: 'A rising star burst with upward arrows icon, level up celebration, gold and white light, game UI, dark fantasy, transparent background',
    fallbackColor: '#8A8A20',
    fallbackIcon: '⭐',
  },
];

// ═══════════════════════════════════════════════════════════════════════
// AGGREGATE EXPORT
// ═══════════════════════════════════════════════════════════════════════

export const UI_ASSETS: UIAsset[] = [
  ...menuBackgrounds,
  ...buttons,
  ...statIcons,
  ...skillIcons,
  ...itemIcons,
  ...factionIcons,
  ...statusIcons,
  ...hudElements,
  ...frames,
  ...dividers,
  ...portraitFrames,
  ...miscIcons,
];

/** Quick lookup by asset id */
export const UI_ASSETS_BY_ID: Record<string, UIAsset> = Object.fromEntries(
  UI_ASSETS.map((asset) => [asset.id, asset])
);

/** Filter assets by category */
export function getAssetsByCategory(category: UIAssetCategory): UIAsset[] {
  return UI_ASSETS.filter((a) => a.category === category);
}

/** Total asset count (should be ~120+) */
export const UI_ASSET_COUNT = UI_ASSETS.length;
