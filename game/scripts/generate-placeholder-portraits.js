#!/usr/bin/env node
/**
 * Generate placeholder SVG portrait assets for all characters.
 *
 * Each SVG shows a styled silhouette with character name and pose label,
 * using the character's faction color scheme.
 *
 * Run: node scripts/generate-placeholder-portraits.js
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'characters');

// Character definitions with faction colors and silhouette hints
const characters = [
  {
    id: 'aldric_vane',
    name: 'Aldric Vane',
    title: 'The Disgraced Knight',
    primaryColor: '#6B5B3E',
    secondaryColor: '#4A3C2A',
    accentColor: '#8B7D6B',
    bgColor: '#1A1008',
    silhouetteType: 'knight',
    poses: [
      { pose: 'portrait', label: 'Default Portrait' },
      { pose: 'angry', label: 'Furious' },
      { pose: 'sad', label: 'Grief-Stricken' },
      { pose: 'happy', label: 'Rare Smile' },
      { pose: 'determined', label: 'Resolute' },
      { pose: 'suspicious', label: 'Wary' },
      { pose: 'wounded', label: 'Bloodied' },
      { pose: 'combat', label: 'Battle Stance' },
      { pose: 'hooded', label: 'Disguised' },
    ],
  },
  {
    id: 'queen_isolde',
    name: 'Isolde Blackthorn',
    title: 'Queen Regent',
    primaryColor: '#8B0000',
    secondaryColor: '#4A0000',
    accentColor: '#C0C0C0',
    bgColor: '#1A0F0A',
    silhouetteType: 'queen',
    poses: [
      { pose: 'portrait', label: 'Default Portrait' },
      { pose: 'angry', label: 'Cold Fury' },
      { pose: 'sad', label: 'Private Grief' },
      { pose: 'determined', label: 'Royal Command' },
      { pose: 'suspicious', label: 'Calculating' },
      { pose: 'combat', label: 'Armed Regent' },
      { pose: 'formal', label: 'Coronation' },
      { pose: 'happy', label: 'Satisfied Smile' },
      { pose: 'wounded', label: 'Fallen Queen' },
    ],
  },
  {
    id: 'high_seer_malachar',
    name: 'Malachar',
    title: 'High Seer',
    primaryColor: '#6B5B7B',
    secondaryColor: '#3D2B4F',
    accentColor: '#C0C0C0',
    bgColor: '#1A1025',
    silhouetteType: 'mage',
    poses: [
      { pose: 'portrait', label: 'Default Portrait' },
      { pose: 'angry', label: 'Terrible Power' },
      { pose: 'sad', label: 'Ancient Weariness' },
      { pose: 'determined', label: 'Prophecy Spoken' },
      { pose: 'suspicious', label: 'Cryptic Gaze' },
      { pose: 'combat', label: 'Arcane Wrath' },
      { pose: 'formal', label: 'Conclave Ceremony' },
      { pose: 'hooded', label: 'Shadow Prophet' },
      { pose: 'wounded', label: 'Mortal Frailty' },
    ],
  },
  {
    id: 'rowan_greenmantle',
    name: 'Rowan Greenmantle',
    title: 'Voice of the Greenwood',
    primaryColor: '#4A6B2A',
    secondaryColor: '#2D4A1A',
    accentColor: '#D4A76A',
    bgColor: '#0A1A08',
    silhouetteType: 'fighter',
    poses: [
      { pose: 'portrait', label: 'Default Portrait' },
      { pose: 'angry', label: 'Righteous Fury' },
      { pose: 'sad', label: 'Mourning' },
      { pose: 'happy', label: 'Hearty Laugh' },
      { pose: 'determined', label: 'Battle Speech' },
      { pose: 'suspicious', label: "Farmer's Shrewd Eye" },
      { pose: 'combat', label: 'Axe Raised' },
      { pose: 'wounded', label: 'Fallen Leader' },
      { pose: 'hooded', label: 'Man of the People' },
    ],
  },
  {
    id: 'sylas_ashford',
    name: 'Sylas Ashford',
    title: 'Guildmaster',
    primaryColor: '#B8860B',
    secondaryColor: '#1A1008',
    accentColor: '#D4A76A',
    bgColor: '#0A0A0A',
    silhouetteType: 'noble',
    poses: [
      { pose: 'portrait', label: 'Default Portrait' },
      { pose: 'angry', label: 'Cold Displeasure' },
      { pose: 'happy', label: 'The Deal Smile' },
      { pose: 'determined', label: 'The Gambit' },
      { pose: 'suspicious', label: 'Knowing Look' },
      { pose: 'combat', label: "Gentleman's Duel" },
      { pose: 'formal', label: 'Guild Regalia' },
      { pose: 'wounded', label: 'Bankrupt' },
      { pose: 'hooded', label: 'Shadow Broker' },
    ],
  },
  {
    id: 'elara_dawnwhisper',
    name: 'Elara Dawnwhisper',
    title: 'The Unbound Seer',
    primaryColor: '#8B6914',
    secondaryColor: '#6B5B7B',
    accentColor: '#D4A76A',
    bgColor: '#1A1025',
    silhouetteType: 'mystic',
    poses: [
      { pose: 'portrait', label: 'Default Portrait' },
      { pose: 'angry', label: 'Defiant' },
      { pose: 'sad', label: 'Guilt-Haunted' },
      { pose: 'happy', label: 'Wonder' },
      { pose: 'determined', label: 'Arcane Focus' },
      { pose: 'suspicious', label: 'Aetheric Sight' },
      { pose: 'combat', label: 'Arcane Strike' },
      { pose: 'wounded', label: 'Magic Burnout' },
      { pose: 'hooded', label: 'Fugitive Mystic' },
    ],
  },
  {
    id: 'captain_thorne',
    name: 'Ser Gareth Thorne',
    title: 'Captain of the Crownguard',
    primaryColor: '#C0C0C0',
    secondaryColor: '#4A5568',
    accentColor: '#8B0000',
    bgColor: '#1A1A1A',
    silhouetteType: 'knight',
    poses: [
      { pose: 'portrait', label: 'Default Portrait' },
      { pose: 'angry', label: 'Breaking Point' },
      { pose: 'sad', label: 'Weight of Duty' },
      { pose: 'determined', label: "Officer's Resolve" },
      { pose: 'suspicious', label: 'Intelligence Report' },
      { pose: 'combat', label: 'Shield Wall' },
      { pose: 'formal', label: 'Crownguard Captain' },
      { pose: 'wounded', label: 'Last Stand' },
    ],
  },
  {
    id: 'nyx',
    name: 'Nyx',
    title: 'The Whisper',
    primaryColor: '#B8860B',
    secondaryColor: '#1A1008',
    accentColor: '#D4A76A',
    bgColor: '#050505',
    silhouetteType: 'rogue',
    poses: [
      { pose: 'portrait', label: 'Default Portrait' },
      { pose: 'angry', label: 'Mask Off' },
      { pose: 'sad', label: 'Unwitnessed Grief' },
      { pose: 'happy', label: 'Chaos Grin' },
      { pose: 'determined', label: 'Professional' },
      { pose: 'suspicious', label: 'I Know Something' },
      { pose: 'combat', label: 'Shadow Strike' },
      { pose: 'hooded', label: 'Deep Cover' },
      { pose: 'wounded', label: 'Caught' },
    ],
  },
  {
    id: 'brother_cedric',
    name: 'Cedric of Thornwatch',
    title: 'Brother of the Green',
    primaryColor: '#6B5B3E',
    secondaryColor: '#4A6B2A',
    accentColor: '#D4A76A',
    bgColor: '#0A1A08',
    silhouetteType: 'monk',
    poses: [
      { pose: 'portrait', label: 'Default Portrait' },
      { pose: 'angry', label: 'Quiet Wrath' },
      { pose: 'sad', label: 'Vigil' },
      { pose: 'happy', label: 'Simple Joy' },
      { pose: 'determined', label: "Healer's Oath" },
      { pose: 'suspicious', label: 'Quiet Observation' },
      { pose: 'combat', label: 'Battlefield Healer' },
      { pose: 'wounded', label: 'Healer Broken' },
      { pose: 'hooded', label: 'Wandering Monk' },
    ],
  },
];

// Silhouette path data for different character types
const silhouettes = {
  knight: `M50,15 C55,15 58,18 58,23 C58,28 55,32 50,33 C45,32 42,28 42,23 C42,18 45,15 50,15 Z
           M42,35 L35,40 L30,65 L38,65 L40,55 L45,60 L42,85 L48,85 L50,70 L52,85 L58,85 L55,60 L60,55 L62,65 L70,65 L65,40 L58,35 Z`,
  queen: `M50,12 C56,12 60,16 60,22 C60,28 56,32 50,34 C44,32 40,28 40,22 C40,16 44,12 50,12 Z
          M38,10 L35,8 L40,12 M62,10 L65,8 L60,12
          M40,36 L32,42 L30,70 L38,72 L40,60 L45,65 L42,88 L48,88 L50,72 L52,88 L58,88 L55,65 L60,60 L62,72 L70,70 L68,42 L60,36 Z`,
  mage: `M50,14 C55,14 58,18 58,24 C58,30 55,34 50,35 C45,34 42,30 42,24 C42,18 45,14 50,14 Z
         M35,10 L50,5 L65,10 L60,35 L50,38 L40,35 Z
         M40,38 L28,48 L25,80 L40,78 L42,60 L48,88 L52,88 L58,60 L60,78 L75,80 L72,48 L60,38 Z`,
  fighter: `M50,16 C55,16 58,20 58,25 C58,30 55,34 50,35 C45,34 42,30 42,25 C42,20 45,16 50,16 Z
            M38,36 L30,42 L28,70 L38,70 L40,55 L44,62 L42,88 L48,88 L50,72 L52,88 L58,88 L56,62 L60,55 L62,70 L72,70 L70,42 L62,36 Z
            M28,42 L20,38 L18,45 L28,48 M72,42 L80,38 L82,45 L72,48`,
  noble: `M50,14 C55,14 58,18 58,24 C58,30 55,34 50,35 C45,34 42,30 42,24 C42,18 45,14 50,14 Z
          M40,36 L32,40 L28,72 L38,74 L40,58 L45,64 L42,88 L48,88 L50,72 L52,88 L58,88 L55,64 L60,58 L62,74 L72,72 L68,40 L60,36 Z
          M32,40 L28,38 L26,44 L32,46 M68,40 L72,38 L74,44 L68,46`,
  mystic: `M50,14 C55,14 58,18 58,24 C58,30 55,34 50,35 C45,34 42,30 42,24 C42,18 45,14 50,14 Z
           M40,36 L32,44 L28,76 L40,74 L42,58 L48,88 L52,88 L58,58 L60,74 L72,76 L68,44 L60,36 Z
           M32,44 L22,52 L20,48 M68,44 L78,52 L80,48
           M48,50 L50,46 L52,50 L50,54 Z`,
  rogue: `M50,16 C54,16 57,19 57,24 C57,29 54,33 50,34 C46,33 43,29 43,24 C43,19 46,16 50,16 Z
          M42,35 L36,40 L32,68 L40,68 L42,55 L46,60 L44,88 L48,88 L50,70 L52,88 L56,88 L54,60 L58,55 L60,68 L68,68 L64,40 L58,35 Z
          M36,40 L30,36 L28,42 L34,44`,
  monk: `M50,16 C55,16 58,20 58,25 C58,30 55,34 50,35 C45,34 42,30 42,25 C42,20 45,16 50,16 Z
         M38,36 L30,44 L26,80 L40,78 L42,60 L48,88 L52,88 L58,60 L60,78 L74,80 L70,44 L62,36 Z
         M30,44 L28,44 L26,50 L30,50 M70,44 L72,44 L74,50 L70,50`,
};

// Pose-specific decorative elements
const poseDecorations = {
  portrait: '',
  angry: `<line x1="35" y1="18" x2="42" y2="22" stroke="ACCENT" stroke-width="1.5" opacity="0.7"/>
          <line x1="65" y1="18" x2="58" y2="22" stroke="ACCENT" stroke-width="1.5" opacity="0.7"/>`,
  sad: `<path d="M40,28 Q50,32 60,28" fill="none" stroke="ACCENT" stroke-width="1" opacity="0.5"/>`,
  happy: `<path d="M42,28 Q50,32 58,28" fill="none" stroke="ACCENT" stroke-width="1.5" opacity="0.7"/>`,
  determined: `<line x1="35" y1="20" x2="42" y2="20" stroke="ACCENT" stroke-width="1.5" opacity="0.7"/>
               <line x1="58" y1="20" x2="65" y2="20" stroke="ACCENT" stroke-width="1.5" opacity="0.7"/>`,
  suspicious: `<line x1="38" y1="20" x2="44" y2="22" stroke="ACCENT" stroke-width="1" opacity="0.6"/>
               <line x1="62" y1="20" x2="56" y2="22" stroke="ACCENT" stroke-width="1" opacity="0.6"/>`,
  wounded: `<line x1="44" y1="26" x2="48" y2="30" stroke="#8B2500" stroke-width="1.5" opacity="0.8"/>
            <line x1="52" y1="24" x2="56" y2="28" stroke="#8B2500" stroke-width="1" opacity="0.6"/>`,
  combat: `<line x1="72" y1="20" x2="82" y2="10" stroke="ACCENT" stroke-width="2" opacity="0.8"/>
           <line x1="82" y1="10" x2="80" y2="15" stroke="ACCENT" stroke-width="1.5" opacity="0.6"/>`,
  hooded: `<path d="M30,14 Q50,2 70,14 L65,36 Q50,40 35,36 Z" fill="PRIMARY" opacity="0.5"/>`,
  formal: `<path d="M42,10 L50,6 L58,10" fill="none" stroke="ACCENT" stroke-width="1.5" opacity="0.8"/>
           <circle cx="50" cy="8" r="2" fill="ACCENT" opacity="0.6"/>`,
};

function generateSVG(character, poseInfo) {
  const silhouette = silhouettes[character.silhouetteType] || silhouettes.knight;
  let decoration = poseDecorations[poseInfo.pose] || '';
  decoration = decoration
    .replace(/ACCENT/g, character.accentColor)
    .replace(/PRIMARY/g, character.primaryColor);

  // Create a subtle texture pattern
  const textureId = `texture-${character.id}-${poseInfo.pose}`;
  const gradientId = `grad-${character.id}-${poseInfo.pose}`;
  const vignetteId = `vignette-${character.id}-${poseInfo.pose}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="400" height="480">
  <defs>
    <!-- Background gradient -->
    <radialGradient id="${gradientId}" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="${character.secondaryColor}"/>
      <stop offset="100%" stop-color="${character.bgColor}"/>
    </radialGradient>
    <!-- Vignette -->
    <radialGradient id="${vignetteId}" cx="50%" cy="50%" r="50%">
      <stop offset="60%" stop-color="transparent"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.6)"/>
    </radialGradient>
    <!-- Parchment texture -->
    <filter id="${textureId}">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise"/>
      <feColorMatrix type="saturate" values="0" in="noise" result="grey"/>
      <feBlend in="SourceGraphic" in2="grey" mode="multiply"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="100" height="120" fill="url(#${gradientId})"/>
  <rect width="100" height="120" fill="url(#${vignetteId})"/>

  <!-- Decorative border -->
  <rect x="2" y="2" width="96" height="116" fill="none" stroke="${character.primaryColor}" stroke-width="0.5" opacity="0.4" rx="1"/>
  <rect x="4" y="4" width="92" height="112" fill="none" stroke="${character.accentColor}" stroke-width="0.3" opacity="0.3" rx="1"/>

  <!-- Character silhouette -->
  <g filter="url(#${textureId})" opacity="0.8">
    <path d="${silhouette}" fill="${character.primaryColor}" stroke="${character.accentColor}" stroke-width="0.3"/>
  </g>

  <!-- Pose-specific decorations -->
  ${decoration}

  <!-- Faction accent line -->
  <line x1="20" y1="92" x2="80" y2="92" stroke="${character.accentColor}" stroke-width="0.5" opacity="0.5"/>

  <!-- Character name -->
  <text x="50" y="100" text-anchor="middle" fill="${character.accentColor}" font-family="serif" font-size="5" font-weight="bold" opacity="0.9">${character.name}</text>

  <!-- Pose label -->
  <text x="50" y="106" text-anchor="middle" fill="${character.primaryColor}" font-family="serif" font-size="3.5" font-style="italic" opacity="0.7">${poseInfo.label}</text>

  <!-- Title -->
  <text x="50" y="112" text-anchor="middle" fill="${character.accentColor}" font-family="serif" font-size="2.8" opacity="0.5">${character.title}</text>
</svg>`;
}

// Generate the unknown/fallback portrait
function generateUnknownSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="400" height="480">
  <defs>
    <radialGradient id="unknown-grad" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#2C2416"/>
      <stop offset="100%" stop-color="#0A0A0A"/>
    </radialGradient>
  </defs>
  <rect width="100" height="120" fill="url(#unknown-grad)"/>
  <rect x="2" y="2" width="96" height="116" fill="none" stroke="#4A3C2A" stroke-width="0.5" opacity="0.4" rx="1"/>
  <text x="50" y="50" text-anchor="middle" fill="#6B5B3E" font-family="serif" font-size="24" opacity="0.4">?</text>
  <text x="50" y="100" text-anchor="middle" fill="#6B5B3E" font-family="serif" font-size="5" opacity="0.6">Unknown</text>
</svg>`;
}

// ── Main ──────────────────────────────────────────────────────

// Ensure output directory exists
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

let totalGenerated = 0;

for (const character of characters) {
  for (const poseInfo of character.poses) {
    const svg = generateSVG(character, poseInfo);
    const filename = `${character.id}_${poseInfo.pose}.svg`;
    const filepath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(filepath, svg, 'utf-8');
    totalGenerated++;
  }
}

// Generate unknown fallback
fs.writeFileSync(path.join(OUTPUT_DIR, 'unknown_portrait.svg'), generateUnknownSVG(), 'utf-8');
totalGenerated++;

console.log(`Generated ${totalGenerated} placeholder portrait SVGs in ${OUTPUT_DIR}`);
console.log(`Characters: ${characters.length}`);
console.log(`Poses per character: ${characters.map(c => c.poses.length).join(', ')}`);
