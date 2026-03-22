'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { WorldMap } from '@/components/ui/WorldMap';
import { MAP_LOCATIONS } from '@/data/map-locations';
import {
  createFogOfWarState,
  discoverLocation,
  visitLocation,
  type FogOfWarState,
} from '@/engine/fog-of-war';

/**
 * World Map Demo Page
 *
 * Demonstrates the interactive world map component with fog of war,
 * location discovery, and chapter-based highlighting.
 */

// Faction colors for location detail sidebar
const FACTION_COLORS: Record<string, string> = {
  iron_covenant: '#8B7355',
  ironThrone: '#8B7355',
  verdant_court: '#4A7C59',
  verdantPact: '#4A7C59',
  obsidian_circle: '#6B5B8A',
  obsidianGuild: '#6B5B8A',
  ashen_throne: '#8B4513',
  ashenConclave: '#5A5A7A',
};

type DemoPreset = 'fresh' | 'early' | 'mid' | 'late' | 'full';

const PRESETS: Record<DemoPreset, { label: string; description: string }> = {
  fresh: { label: 'New Game', description: 'Only starting locations visible' },
  early: { label: 'Chapter 2', description: 'Heartlands explored, some rumors' },
  mid: { label: 'Chapter 5', description: 'Multiple regions discovered' },
  late: { label: 'Chapter 8', description: 'Most of the map revealed' },
  full: { label: 'Complete', description: 'All locations visited' },
};

function buildPresetFogState(preset: DemoPreset): FogOfWarState {
  let fog = createFogOfWarState(MAP_LOCATIONS);

  if (preset === 'fresh') return fog;

  // Early game: discover starting locations, visit a couple
  const earlyDiscover = [
    'valdoria_capital', 'thornhold_keep', 'merchant_quarter',
    'crossroads', 'northern_road',
  ];
  const earlyVisit = ['valdoria_capital', 'thornhold_keep'];

  for (const id of earlyDiscover) {
    const result = discoverLocation(fog, id, MAP_LOCATIONS);
    fog = result.state;
  }
  for (const id of earlyVisit) {
    const result = visitLocation(fog, id, MAP_LOCATIONS);
    fog = result.state;
  }

  if (preset === 'early') return fog;

  // Mid game: more regions discovered
  const midDiscover = [
    'verdant_marches_east', 'pact_camp', 'thornwood',
    'ashen_spire', 'grey_moors', 'guild_safehouse',
    'western_road', 'greywatch',
  ];
  const midVisit = [
    'merchant_quarter', 'crossroads', 'verdant_marches_east',
    'northern_road', 'grey_moors',
  ];

  for (const id of midDiscover) {
    const result = discoverLocation(fog, id, MAP_LOCATIONS);
    fog = result.state;
  }
  for (const id of midVisit) {
    const result = visitLocation(fog, id, MAP_LOCATIONS);
    fog = result.state;
  }

  if (preset === 'mid') return fog;

  // Late game: most things discovered
  const lateDiscover = [
    'ashenmere', 'siege_camp', 'eldergrove', 'port_blackwater',
    'smugglers_cove', 'queens_solar', 'keep_dungeons',
    'eastern_sewers', 'hollow_coin_tavern', 'ritual_chambers',
    'crown_citadel',
  ];
  const lateVisit = [
    'thornwood', 'ashen_spire', 'pact_camp', 'guild_safehouse',
    'western_road', 'greywatch', 'ashenmere',
  ];

  for (const id of lateDiscover) {
    const result = discoverLocation(fog, id, MAP_LOCATIONS);
    fog = result.state;
  }
  for (const id of lateVisit) {
    const result = visitLocation(fog, id, MAP_LOCATIONS);
    fog = result.state;
  }

  if (preset === 'late') return fog;

  // Full: visit everything
  for (const loc of MAP_LOCATIONS) {
    const result = visitLocation(fog, loc.id, MAP_LOCATIONS);
    fog = result.state;
  }

  return fog;
}

export default function WorldMapPage() {
  const [preset, setPreset] = useState<DemoPreset>('mid');
  const [activeLocation, setActiveLocation] = useState<string | undefined>('valdoria_capital');
  const [currentChapter, setCurrentChapter] = useState<number>(5);
  const [compact, setCompact] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const fogState = useMemo(() => buildPresetFogState(preset), [preset]);

  const handleLocationClick = useCallback((locationId: string) => {
    setSelectedLocation(locationId);
  }, []);

  const handleTravel = useCallback((destinationId: string, route: string[]) => {
    setActiveLocation(destinationId);
    setSelectedLocation(destinationId);
  }, []);

  const selectedLocationData = useMemo(() => {
    if (!selectedLocation) return null;
    return MAP_LOCATIONS.find((l) => l.id === selectedLocation) || null;
  }, [selectedLocation]);

  return (
    <div className="min-h-screen bg-shadow-950 text-parchment-200 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl md:text-4xl text-parchment-200 tracking-wide">
            World Map
          </h1>
          <p className="text-parchment-500 text-sm">
            Interactive map of the Kingdom of Valdris with fog of war discovery
          </p>
        </div>

        {/* Controls Panel */}
        <div className="parchment-panel p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Preset selector */}
            <div className="flex flex-col gap-1">
              <label className="font-display text-[10px] text-parchment-500 uppercase tracking-wider">
                Progress Preset
              </label>
              <div className="flex gap-1">
                {(Object.entries(PRESETS) as Array<[DemoPreset, typeof PRESETS.fresh]>).map(
                  ([key, value]) => (
                    <button
                      key={key}
                      className={`
                        px-3 py-1.5 text-xs font-display rounded transition-all
                        ${
                          preset === key
                            ? 'bg-gold-800/60 border border-gold-600/50 text-gold-200'
                            : 'bg-shadow-800/60 border border-parchment-800/30 text-parchment-400 hover:border-parchment-700/50 hover:text-parchment-300'
                        }
                      `}
                      onClick={() => setPreset(key)}
                      title={value.description}
                    >
                      {value.label}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Chapter selector */}
            <div className="flex flex-col gap-1">
              <label className="font-display text-[10px] text-parchment-500 uppercase tracking-wider">
                Chapter
              </label>
              <select
                className="bg-shadow-800/80 border border-parchment-800/30 rounded px-3 py-1.5 text-xs text-parchment-300 font-display"
                value={currentChapter}
                onChange={(e) => setCurrentChapter(Number(e.target.value))}
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((ch) => (
                  <option key={ch} value={ch}>
                    Chapter {ch}
                  </option>
                ))}
              </select>
            </div>

            {/* Compact toggle */}
            <div className="flex flex-col gap-1">
              <label className="font-display text-[10px] text-parchment-500 uppercase tracking-wider">
                View
              </label>
              <button
                className={`
                  px-3 py-1.5 text-xs font-display rounded transition-all
                  ${
                    compact
                      ? 'bg-gold-800/60 border border-gold-600/50 text-gold-200'
                      : 'bg-shadow-800/60 border border-parchment-800/30 text-parchment-400'
                  }
                `}
                onClick={() => setCompact(!compact)}
              >
                {compact ? 'Compact' : 'Full'}
              </button>
            </div>
          </div>
        </div>

        {/* Map + Sidebar layout */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Map */}
          <div className="flex-1">
            <WorldMap
              locations={MAP_LOCATIONS}
              fogState={fogState}
              activeLocationId={activeLocation}
              onLocationClick={handleLocationClick}
              onTravel={handleTravel}
              canTravel={true}
              showLegend={!compact}
              compact={compact}
            />
          </div>

          {/* Location Detail Sidebar */}
          <div className="lg:w-72 shrink-0">
            <div className="parchment-panel p-4 space-y-4">
              <h3 className="font-display text-sm text-parchment-300 uppercase tracking-wider border-b border-parchment-800/30 pb-2">
                Location Details
              </h3>

              {selectedLocationData ? (
                <div className="space-y-3">
                  <div>
                    <div className="font-display text-lg text-parchment-200">
                      {selectedLocationData.name}
                    </div>
                    <div className="text-[10px] text-parchment-600 uppercase tracking-wider mt-0.5">
                      {selectedLocationData.region} · {selectedLocationData.locationType}
                    </div>
                  </div>

                  <p className="text-xs text-parchment-400 leading-relaxed">
                    {selectedLocationData.description}
                  </p>

                  {selectedLocationData.lore && (
                    <div className="border-t border-parchment-800/30 pt-3">
                      <div className="font-display text-[10px] text-parchment-500 uppercase tracking-wider mb-1">
                        Lore
                      </div>
                      <p className="text-xs text-parchment-500 italic leading-relaxed">
                        {selectedLocationData.lore}
                      </p>
                    </div>
                  )}

                  {selectedLocationData.controllingFaction && (
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className="w-3 h-3 rounded-full border"
                        style={{
                          backgroundColor:
                            FACTION_COLORS[selectedLocationData.controllingFaction] || '#6d552d',
                          borderColor:
                            FACTION_COLORS[selectedLocationData.controllingFaction] || '#6d552d',
                        }}
                      />
                      <span className="text-parchment-400">
                        Controlled by{' '}
                        <span className="text-parchment-300">
                          {selectedLocationData.controllingFaction
                            .replace(/_/g, ' ')
                            .replace(/([A-Z])/g, ' $1')
                            .trim()}
                        </span>
                      </span>
                    </div>
                  )}

                  {selectedLocationData.adjacentLocations.length > 0 && (
                    <div className="border-t border-parchment-800/30 pt-3">
                      <div className="font-display text-[10px] text-parchment-500 uppercase tracking-wider mb-1">
                        Connected To
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {selectedLocationData.adjacentLocations.map((adjId) => {
                          const adj = MAP_LOCATIONS.find((l) => l.id === adjId);
                          return adj ? (
                            <button
                              key={adjId}
                              className="text-[10px] px-2 py-0.5 rounded bg-shadow-800/60 border border-parchment-800/30 text-parchment-400 hover:text-parchment-200 hover:border-gold-700/40 transition-colors"
                              onClick={() => {
                                setActiveLocation(adjId);
                                setSelectedLocation(adjId);
                              }}
                            >
                              {adj.name}
                            </button>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-parchment-600 italic">
                  Click a discovered location on the map to view its details.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
