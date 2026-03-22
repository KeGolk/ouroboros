import { Faction, FactionId } from '../../types/narrative';

export const factions: Record<FactionId, Faction> = {
  iron_covenant: {
    id: 'iron_covenant',
    name: 'The Iron Covenant',
    motto: 'Order through strength, peace through law.',
    description:
      'A militaristic alliance of lords and generals who believe only a strong central authority can prevent the realm from descending into chaos. They enforce order through disciplined armies and harsh justice. Their critics call them tyrants; their supporters call them the last bulwark against anarchy.',
    color: '#8B7355',
    values: ['discipline', 'loyalty', 'sacrifice', 'hierarchy'],
    leader: 'commander_vareth',
  },
  verdant_court: {
    id: 'verdant_court',
    name: 'The Verdant Court',
    motto: 'The land remembers what kings forget.',
    description:
      'A coalition of druids, hedge-knights, and rural lords who seek to return governance to the old ways — a council of equals guided by the land itself. They distrust centralized power but struggle with their own internal fractures and the naivety of idealism in a brutal world.',
    color: '#4A7C59',
    values: ['balance', 'tradition', 'community', 'nature'],
    leader: 'archdruid_elara',
  },
  obsidian_circle: {
    id: 'obsidian_circle',
    name: 'The Obsidian Circle',
    motto: 'Knowledge is the only throne that endures.',
    description:
      'A secretive cabal of scholars, alchemists, and sorcerers who believe the realm should be governed by those with the wisdom to wield power responsibly. They hoard forbidden knowledge and are willing to make terrible sacrifices for what they see as the greater good.',
    color: '#4A3B5C',
    values: ['knowledge', 'pragmatism', 'sacrifice', 'progress'],
    leader: 'magister_thorn',
  },
  ashen_throne: {
    id: 'ashen_throne',
    name: 'The Ashen Throne',
    motto: 'From ruin, we are reforged.',
    description:
      'The remnants of the royal bloodline and their loyalists, seeking to restore the monarchy under a new worthy ruler. They cling to tradition and legitimacy, but are haunted by the corruption that led to the High King\'s assassination. Some seek genuine reform; others merely want their old power back.',
    color: '#8B4513',
    values: ['legitimacy', 'tradition', 'nobility', 'continuity'],
    leader: 'princess_isolde',
  },
};
