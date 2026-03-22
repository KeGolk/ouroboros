'use client';

import React, { useState, useMemo, useCallback, useRef } from 'react';
import type { MapLocation, DiscoveryStatus, FogOfWarState } from '../../engine/fog-of-war';
import { getLocationStatus, getExplorationProgress } from '../../engine/fog-of-war';

// ─── Props ──────────────────────────────────────────────────────────────────

export interface WorldMapProps {
  /** All map locations */
  locations: MapLocation[];
  /** Current fog of war state */
  fogState: FogOfWarState;
  /** Currently active location (where the player is now) */
  activeLocationId?: string;
  /** Callback when player clicks a discovered location */
  onLocationClick?: (locationId: string) => void;
  /** Callback when player confirms travel to a destination */
  onTravel?: (destinationId: string, route: string[]) => void;
  /** Whether travel is currently allowed (e.g., not in combat) */
  canTravel?: boolean;
  /** Whether to show the legend panel */
  showLegend?: boolean;
  /** Whether the map is in compact (mobile) mode */
  compact?: boolean;
}

// ─── Location Type Icons ────────────────────────────────────────────────────

const LOCATION_ICONS: Record<MapLocation['locationType'], string> = {
  city: '🏰',
  castle: '⚔️',
  village: '🏘️',
  wilderness: '🌲',
  ruins: '🏚️',
  stronghold: '🛡️',
  temple: '⛩️',
  landmark: '📍',
};

// ─── Status Styles ──────────────────────────────────────────────────────────

interface StatusStyle {
  markerClass: string;
  labelClass: string;
  tooltipPrefix: string;
}

const STATUS_STYLES: Record<DiscoveryStatus, StatusStyle> = {
  undiscovered: {
    markerClass: 'opacity-0 pointer-events-none',
    labelClass: 'hidden',
    tooltipPrefix: '',
  },
  rumored: {
    markerClass: 'opacity-40 grayscale cursor-help',
    labelClass: 'opacity-40 italic',
    tooltipPrefix: 'Rumored: ',
  },
  discovered: {
    markerClass: 'opacity-80 cursor-pointer hover:opacity-100 hover:scale-110',
    labelClass: 'opacity-80',
    tooltipPrefix: '',
  },
  visited: {
    markerClass: 'opacity-100 cursor-pointer hover:scale-110',
    labelClass: 'opacity-100',
    tooltipPrefix: '',
  },
};

// ─── Pathfinding (BFS) ─────────────────────────────────────────────────────

/**
 * BFS pathfinding: find shortest route between two locations via adjacency.
 * Only traverses discovered/visited locations.
 * Returns array of location IDs forming the path, or empty if unreachable.
 */
function findRoute(
  fromId: string,
  toId: string,
  locations: MapLocation[],
  fogState: FogOfWarState,
): string[] {
  if (fromId === toId) return [fromId];
  if (!fromId || !toId) return [];

  const locMap = new Map<string, MapLocation>();
  for (const loc of locations) locMap.set(loc.id, loc);

  const queue: string[][] = [[fromId]];
  const visited = new Set<string>([fromId]);

  while (queue.length > 0) {
    const currentPath = queue.shift()!;
    const current = currentPath[currentPath.length - 1];
    const currentLoc = locMap.get(current);
    if (!currentLoc) continue;

    for (const adjId of currentLoc.adjacentLocations) {
      if (visited.has(adjId)) continue;

      const adjStatus = getLocationStatus(fogState, adjId);
      if (adjStatus !== 'discovered' && adjStatus !== 'visited') continue;

      const newPath = [...currentPath, adjId];
      if (adjId === toId) return newPath;

      visited.add(adjId);
      queue.push(newPath);
    }
  }

  return [];
}

/** Get all edges along a route as [from, to] pairs. */
function getRouteEdges(route: string[]): [string, string][] {
  const edges: [string, string][] = [];
  for (let i = 0; i < route.length - 1; i++) {
    edges.push([route[i], route[i + 1]]);
  }
  return edges;
}

/** Check if a given edge is part of a route. */
function isEdgeOnRoute(
  locA: string,
  locB: string,
  routeEdges: [string, string][],
): boolean {
  return routeEdges.some(
    ([from, to]) =>
      (from === locA && to === locB) || (from === locB && to === locA),
  );
}

// ─── Travel Confirmation Modal ──────────────────────────────────────────────

interface TravelModalProps {
  destination: MapLocation;
  route: string[];
  locations: MapLocation[];
  onConfirm: () => void;
  onCancel: () => void;
}

function TravelModal({ destination, route, locations, onConfirm, onCancel }: TravelModalProps) {
  const locMap = useMemo(() => {
    const map = new Map<string, MapLocation>();
    for (const loc of locations) map.set(loc.id, loc);
    return map;
  }, [locations]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="parchment-panel mx-4 max-w-sm w-full"
        style={{ padding: '20px 24px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          className="font-display text-base text-center mb-4"
          style={{ color: '#C9B97A' }}
        >
          Travel to {destination.name}?
        </h3>

        {/* Route step-by-step */}
        <div
          className="rounded-lg mb-4"
          style={{
            backgroundColor: '#0A0A0A',
            border: '1px solid #2A2520',
            padding: '10px 12px',
          }}
        >
          {route.map((locId, i) => {
            const loc = locMap.get(locId);
            if (!loc) return null;
            const isStart = i === 0;
            const isEnd = i === route.length - 1;
            return (
              <React.Fragment key={locId}>
                <div className="flex items-center gap-2 py-1">
                  <span className="text-sm">
                    {LOCATION_ICONS[loc.locationType]}
                  </span>
                  <span
                    className="text-xs"
                    style={{
                      color: isStart ? '#C9B97A' : isEnd ? '#88CC88' : '#A09880',
                      fontWeight: isStart || isEnd ? 600 : 400,
                    }}
                  >
                    {loc.name}
                  </span>
                  {isStart && (
                    <span className="text-[9px]" style={{ color: '#6B6252' }}>(current)</span>
                  )}
                  {isEnd && (
                    <span className="text-[9px]" style={{ color: '#88CC88' }}>(destination)</span>
                  )}
                </div>
                {i < route.length - 1 && (
                  <div className="text-[10px] pl-6 py-0.5" style={{ color: '#4A4540' }}>↓</div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex justify-between text-[11px] mb-4" style={{ color: '#A09880' }}>
          <span>{route.length - 1} {route.length - 1 === 1 ? 'stop' : 'stops'}</span>
          {destination.controllingFaction && (
            <span style={{ color: '#8B6B38' }}>
              {destination.controllingFaction.replace(/_/g, ' ')} territory
            </span>
          )}
        </div>

        <div className="flex gap-3">
          <button className="btn-medieval flex-1" onClick={onCancel}>Cancel</button>
          <button className="btn-medieval-primary flex-1" onClick={onConfirm}>Travel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Enhanced Tooltip ───────────────────────────────────────────────────────

interface LocationTooltipProps {
  location: MapLocation;
  status: DiscoveryStatus;
  isActive: boolean;
  route: string[];
  isOnRoute: boolean;
  isDestination: boolean;
  canTravel: boolean;
}

function LocationTooltip({
  location, status, isActive, route, isOnRoute, isDestination, canTravel,
}: LocationTooltipProps) {
  const hasRoute = route.length > 1;
  const routeStops = route.length - 1;

  return (
    <div
      className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-3
        px-4 py-3 rounded-lg min-w-[220px] max-w-[300px]
        bg-shadow-900/95 border border-parchment-800/50 shadow-xl pointer-events-none"
    >
      {status === 'rumored' ? (
        <>
          <div className="font-display text-sm text-parchment-400 italic mb-1">Unknown Location</div>
          <div className="text-xs text-parchment-600">
            You have heard rumors of a place in this area, but you have not yet discovered it.
          </div>
        </>
      ) : (
        <>
          {/* Name + icon */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">{LOCATION_ICONS[location.locationType]}</span>
            <div>
              <div className="font-display text-sm text-parchment-200">{location.name}</div>
              {location.region && (
                <div className="text-[10px] text-parchment-600 uppercase tracking-wider">{location.region}</div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="text-xs text-parchment-400 mb-2">{location.description}</div>

          {/* Lore (visited only) */}
          {status === 'visited' && location.lore && (
            <div className="text-xs text-gold-600/80 italic border-t border-parchment-800/30 pt-2 mt-2 mb-2">
              {location.lore}
            </div>
          )}

          {/* Controlling faction */}
          {location.controllingFaction && (status === 'visited' || status === 'discovered') && (
            <div className="text-xs text-parchment-500 mb-1">
              Controlled by: <span className="text-parchment-300">{location.controllingFaction.replace(/_/g, ' ')}</span>
            </div>
          )}

          {/* Current location */}
          {isActive && (
            <div className="flex items-center gap-1.5 text-xs font-display mt-2" style={{ color: '#C9B97A' }}>
              <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#C9B97A' }} />
              Current Location
            </div>
          )}

          {/* Travel route info */}
          {!isActive && (status === 'discovered' || status === 'visited') && (
            <div className="border-t border-parchment-800/30 pt-2 mt-2">
              {hasRoute ? (
                <div className="space-y-1">
                  <div className="text-[10px]" style={{ color: '#6B6252' }}>
                    Route: {routeStops} {routeStops === 1 ? 'stop' : 'stops'}
                  </div>
                  {canTravel ? (
                    <div className="text-[10px] font-display" style={{ color: '#88CC88' }}>Click to travel →</div>
                  ) : (
                    <div className="text-[10px] italic" style={{ color: '#8B4040' }}>Travel unavailable</div>
                  )}
                </div>
              ) : (
                <div className="text-[10px] italic" style={{ color: '#8B4040' }}>No known route</div>
              )}
            </div>
          )}

          {/* Status badge */}
          <div className="text-[10px] text-parchment-700 mt-1 uppercase tracking-wider">
            {isOnRoute && !isActive ? '◈ On Route'
              : isDestination ? '◎ Destination'
              : status === 'discovered' ? '○ Discovered'
              : '● Visited'}
          </div>
        </>
      )}
      {/* Arrow */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
        <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-shadow-900/95" />
      </div>
    </div>
  );
}

// ─── Location Marker ────────────────────────────────────────────────────────

interface LocationMarkerProps {
  location: MapLocation;
  status: DiscoveryStatus;
  isActive: boolean;
  isOnRoute: boolean;
  isDestination: boolean;
  route: string[];
  canTravel: boolean;
  onClick?: () => void;
  compact?: boolean;
}

function LocationMarker({
  location, status, isActive, isOnRoute, isDestination, route, canTravel, onClick, compact,
}: LocationMarkerProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const style = STATUS_STYLES[status];
  const touchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (status === 'undiscovered') {
    return (
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${location.x}%`, top: `${location.y}%` }}
      >
        <div className="fog-marker w-6 h-6 rounded-full bg-shadow-900/60 border border-shadow-700/30 animate-pulse-slow" />
      </div>
    );
  }

  const markerSize = location.isMajor
    ? compact ? 'w-8 h-8 text-base' : 'w-10 h-10 text-lg'
    : compact ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm';

  let extraRingClass = '';
  const extraBorderStyle: React.CSSProperties = {};
  if (isDestination && !isActive) {
    extraRingClass = 'ring-2 ring-green-500/50';
    extraBorderStyle.borderColor = '#88CC88';
  } else if (isOnRoute && !isActive) {
    extraRingClass = 'ring-1 ring-amber-500/30';
    extraBorderStyle.borderColor = '#C9B97A99';
  }

  const handleTouchStart = useCallback(() => {
    setShowTooltip(true);
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    touchTimeoutRef.current = setTimeout(() => setShowTooltip(false), 3000);
  }, []);

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
      style={{ left: `${location.x}%`, top: `${location.y}%` }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onTouchStart={handleTouchStart}
    >
      <button
        onClick={(status === 'discovered' || status === 'visited') ? onClick : undefined}
        className={`
          ${markerSize} flex items-center justify-center rounded-full
          border-2 transition-all duration-300 ease-out touch-manipulation select-none
          ${style.markerClass} ${extraRingClass}
          ${isActive
            ? 'border-gold-400 bg-gold-800/80 ring-2 ring-gold-400/50 animate-shimmer scale-110'
            : isDestination ? 'bg-green-900/60 scale-110'
            : isOnRoute ? 'bg-amber-900/40 scale-105'
            : status === 'visited' ? 'border-gold-600/60 bg-shadow-800/90'
            : status === 'discovered' ? 'border-parchment-600/50 bg-shadow-800/80'
            : 'border-shadow-600/40 bg-shadow-900/70'}
        `}
        style={extraBorderStyle}
        aria-label={`${style.tooltipPrefix}${status === 'rumored' ? '???' : location.name}${isActive ? ' (current location)' : ''}${isDestination ? ' (destination)' : ''}`}
        disabled={status === 'rumored'}
      >
        <span className={status === 'rumored' ? 'blur-[1px]' : ''}>
          {status === 'rumored' ? '?' : LOCATION_ICONS[location.locationType]}
        </span>
      </button>

      {!compact && (
        <div
          className={`absolute left-1/2 transform -translate-x-1/2 mt-1 font-display text-xs whitespace-nowrap text-center transition-colors duration-300
            ${style.labelClass}
            ${isActive ? 'text-gold-300 font-bold'
              : isDestination ? 'font-semibold'
              : isOnRoute ? 'font-medium'
              : 'text-parchment-400'}`}
          style={{ color: isDestination ? '#88CC88' : isOnRoute ? '#C9B97A' : undefined }}
        >
          {status === 'rumored' ? '???' : location.name}
        </div>
      )}

      {isActive && (
        <div className="absolute inset-0 -m-1 rounded-full border-2 border-gold-400/40 animate-ping" />
      )}

      {isDestination && !isActive && (
        <div className="absolute inset-0 -m-1.5 rounded-full border-2 animate-ping" style={{ borderColor: 'rgba(136, 204, 136, 0.3)' }} />
      )}

      {showTooltip && (
        <LocationTooltip
          location={location} status={status} isActive={isActive}
          route={route} isOnRoute={isOnRoute} isDestination={isDestination} canTravel={canTravel}
        />
      )}
    </div>
  );
}

// ─── Connection Lines with Route Highlighting ───────────────────────────────

interface ConnectionLinesProps {
  locations: MapLocation[];
  fogState: FogOfWarState;
  routeEdges: [string, string][];
}

function ConnectionLines({ locations, fogState, routeEdges }: ConnectionLinesProps) {
  const lines = useMemo(() => {
    const rendered = new Set<string>();
    const result: { x1: number; y1: number; x2: number; y2: number; opacity: number; isOnRoute: boolean }[] = [];

    for (const loc of locations) {
      const locStatus = getLocationStatus(fogState, loc.id);
      if (locStatus === 'undiscovered') continue;

      for (const adjId of loc.adjacentLocations) {
        const pairKey = [loc.id, adjId].sort().join('--');
        if (rendered.has(pairKey)) continue;
        rendered.add(pairKey);

        const adjLoc = locations.find(l => l.id === adjId);
        if (!adjLoc) continue;

        const adjStatus = getLocationStatus(fogState, adjId);
        if (adjStatus === 'undiscovered') continue;

        const onRoute = isEdgeOnRoute(loc.id, adjId, routeEdges);
        let opacity = locStatus === 'rumored' || adjStatus === 'rumored' ? 0.15
          : locStatus === 'visited' && adjStatus === 'visited' ? 0.4 : 0.25;
        if (onRoute) opacity = 1;

        result.push({ x1: loc.x, y1: loc.y, x2: adjLoc.x, y2: adjLoc.y, opacity, isOnRoute: onRoute });
      }
    }
    return result;
  }, [locations, fogState, routeEdges]);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <filter id="road-glow">
          <feGaussianBlur stdDeviation="0.3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Non-route paths */}
      {lines.filter(l => !l.isOnRoute).map((line, i) => (
        <line key={`p-${i}`} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
          stroke="#8a6b38" strokeWidth="0.3" strokeDasharray="1,0.5" opacity={line.opacity} filter="url(#road-glow)" />
      ))}

      {/* Route-highlighted paths with glow + animated direction */}
      {lines.filter(l => l.isOnRoute).map((line, i) => (
        <g key={`r-${i}`}>
          {/* Glow */}
          <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
            stroke="#C9B97A" strokeWidth="1.2" opacity={0.3} filter="url(#route-glow)" />
          {/* Solid route */}
          <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
            stroke="#C9B97A" strokeWidth="0.6" opacity={0.9} strokeLinecap="round" />
          {/* Animated marching ants */}
          <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
            stroke="#88CC88" strokeWidth="0.4" strokeDasharray="0.8,2" opacity={0.7} strokeLinecap="round">
            <animate attributeName="stroke-dashoffset" from="0" to="-5.6" dur="1.2s" repeatCount="indefinite" />
          </line>
        </g>
      ))}
    </svg>
  );
}

// ─── Supporting Components ──────────────────────────────────────────────────

function FogOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 opacity-30" style={{
        background: 'radial-gradient(ellipse at 20% 30%, rgba(26, 27, 30, 0.9) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(26, 27, 30, 0.8) 0%, transparent 40%), radial-gradient(ellipse at 50% 50%, rgba(26, 27, 30, 0.4) 0%, transparent 60%)',
      }} />
      <div className="absolute inset-0 opacity-20 animate-pulse-slow" style={{
        background: 'radial-gradient(ellipse at 30% 20%, rgba(100, 100, 120, 0.3) 0%, transparent 40%), radial-gradient(ellipse at 70% 80%, rgba(100, 100, 120, 0.2) 0%, transparent 35%)',
      }} />
    </div>
  );
}

function ExplorationBar({ fogState }: { fogState: FogOfWarState }) {
  const progress = getExplorationProgress(fogState);
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-shadow-900/60 border-t border-parchment-800/30">
      <span className="font-display text-xs text-parchment-500 uppercase tracking-wider whitespace-nowrap">Explored</span>
      <div className="flex-1 h-2 bg-shadow-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress.percentage}%`, background: 'linear-gradient(90deg, #6d552d, #d49a2a)' }} />
      </div>
      <span className="font-display text-xs text-parchment-400 whitespace-nowrap">{progress.percentage}%</span>
      <div className="hidden sm:flex items-center gap-2 text-[10px] text-parchment-600 ml-2">
        <span>● {progress.visited} visited</span>
        <span>○ {progress.discovered} discovered</span>
        <span className="italic">? {progress.rumored} rumored</span>
      </div>
    </div>
  );
}

function MapLegend() {
  return (
    <div className="absolute bottom-14 right-3 z-20 parchment-panel px-3 py-2 text-[10px]">
      <div className="font-display text-xs text-parchment-400 uppercase tracking-wider mb-2">Legend</div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gold-600/80 border border-gold-400" />
          <span className="text-parchment-400">Current Location</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-shadow-800 border border-gold-600/60" />
          <span className="text-parchment-400">Visited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-shadow-800/80 border border-parchment-600/50" />
          <span className="text-parchment-400">Discovered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-shadow-900/70 border border-shadow-600/40 opacity-40" />
          <span className="text-parchment-400 italic">Rumored</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 rounded" style={{ backgroundColor: '#C9B97A' }} />
          <span className="text-parchment-400">Travel Route</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-900/60 border-2" style={{ borderColor: '#88CC88' }} />
          <span className="text-parchment-400">Destination</span>
        </div>
      </div>
    </div>
  );
}

function RegionLabels({ locations, fogState }: { locations: MapLocation[]; fogState: FogOfWarState }) {
  const regionCenters = useMemo(() => {
    const regionMap = new Map<string, { x: number[]; y: number[]; hasVisible: boolean }>();
    for (const loc of locations) {
      const status = getLocationStatus(fogState, loc.id);
      if (!regionMap.has(loc.region)) regionMap.set(loc.region, { x: [], y: [], hasVisible: false });
      const data = regionMap.get(loc.region)!;
      data.x.push(loc.x);
      data.y.push(loc.y);
      if (status !== 'undiscovered') data.hasVisible = true;
    }
    const centers: { name: string; x: number; y: number }[] = [];
    for (const [name, data] of regionMap.entries()) {
      if (!data.hasVisible) continue;
      const avgX = data.x.reduce((a, b) => a + b, 0) / data.x.length;
      const avgY = data.y.reduce((a, b) => a + b, 0) / data.y.length;
      centers.push({ name, x: avgX, y: Math.max(5, avgY - 8) });
    }
    return centers;
  }, [locations, fogState]);

  return (
    <>
      {regionCenters.map(region => (
        <div key={region.name} className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
          style={{ left: `${region.x}%`, top: `${region.y}%` }}>
          <span className="font-display text-[10px] text-parchment-700/50 uppercase tracking-[0.3em] whitespace-nowrap">
            {region.name}
          </span>
        </div>
      ))}
    </>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function WorldMap({
  locations, fogState, activeLocationId, onLocationClick, onTravel,
  canTravel = true, showLegend = true, compact = false,
}: WorldMapProps) {
  const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(null);
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null);
  const [showTravelModal, setShowTravelModal] = useState(false);

  const targetLocationId = selectedDestinationId || hoveredLocationId;

  const route = useMemo(() => {
    if (!activeLocationId || !targetLocationId || targetLocationId === activeLocationId) return [];
    return findRoute(activeLocationId, targetLocationId, locations, fogState);
  }, [activeLocationId, targetLocationId, locations, fogState]);

  const routeEdges = useMemo(() => getRouteEdges(route), [route]);
  const routeLocationSet = useMemo(() => new Set(route), [route]);

  const handleLocationClick = useCallback((locationId: string) => {
    const status = getLocationStatus(fogState, locationId);
    if (status !== 'discovered' && status !== 'visited') return;
    if (onLocationClick) onLocationClick(locationId);
    if (locationId !== activeLocationId && canTravel && onTravel) {
      const travelRoute = findRoute(activeLocationId || '', locationId, locations, fogState);
      if (travelRoute.length > 1) {
        setSelectedDestinationId(locationId);
        setShowTravelModal(true);
      }
    }
  }, [fogState, onLocationClick, activeLocationId, canTravel, onTravel, locations]);

  const handleTravelConfirm = useCallback(() => {
    if (selectedDestinationId && onTravel && route.length > 1) onTravel(selectedDestinationId, route);
    setShowTravelModal(false);
    setSelectedDestinationId(null);
  }, [selectedDestinationId, onTravel, route]);

  const handleTravelCancel = useCallback(() => {
    setShowTravelModal(false);
    setSelectedDestinationId(null);
  }, []);

  const destinationLocation = useMemo(() => {
    if (!selectedDestinationId) return null;
    return locations.find(l => l.id === selectedDestinationId) || null;
  }, [selectedDestinationId, locations]);

  return (
    <div className="parchment-panel overflow-hidden flex flex-col">
      {/* Map Header */}
      <div className="px-4 py-2 border-b border-parchment-800/30 flex items-center justify-between">
        <h2 className="font-display text-sm text-parchment-300 uppercase tracking-wider">Kingdom of Valdris</h2>
        <div className="flex items-center gap-3">
          {activeLocationId && (
            <span className="text-[10px] text-gold-500 font-display flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#C9B97A' }} />
              {locations.find(l => l.id === activeLocationId)?.name || 'Unknown'}
            </span>
          )}
          <span className="text-[10px] text-parchment-600 font-display">World Map</span>
        </div>
      </div>

      {/* Map Area */}
      <div
        className={`relative w-full overflow-hidden ${compact ? 'h-[300px]' : 'h-[500px] lg:h-[600px]'}`}
        style={{
          background: 'linear-gradient(135deg, #1a1b1e 0%, #28292d 30%, #1a150b 60%, #28292d 100%), radial-gradient(circle at 50% 40%, rgba(109, 85, 45, 0.1) 0%, transparent 60%)',
        }}
      >
        <FogOverlay />

        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
          <div className="w-full h-full" style={{
            backgroundImage: 'linear-gradient(rgba(212, 154, 42, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 154, 42, 0.3) 1px, transparent 1px)',
            backgroundSize: '10% 10%',
          }} />
        </div>

        {/* Connection lines with route highlighting */}
        <ConnectionLines locations={locations} fogState={fogState} routeEdges={routeEdges} />

        {/* Location markers */}
        {locations.map(loc => {
          const status = getLocationStatus(fogState, loc.id);
          const isActive = loc.id === activeLocationId;
          const isOnRoute = routeLocationSet.has(loc.id) && !isActive;
          const isDestination = loc.id === targetLocationId && !isActive;
          const locRoute = loc.id === targetLocationId ? route : [];

          return (
            <LocationMarker
              key={loc.id} location={loc} status={status} isActive={isActive}
              isOnRoute={isOnRoute} isDestination={isDestination} route={locRoute}
              canTravel={canTravel} onClick={() => handleLocationClick(loc.id)} compact={compact}
            />
          );
        })}

        {!compact && <RegionLabels locations={locations} fogState={fogState} />}
        {showLegend && !compact && <MapLegend />}
      </div>

      {/* Exploration progress */}
      <ExplorationBar fogState={fogState} />

      {/* Travel modal */}
      {showTravelModal && destinationLocation && (
        <TravelModal
          destination={destinationLocation} route={route} locations={locations}
          onConfirm={handleTravelConfirm} onCancel={handleTravelCancel}
        />
      )}
    </div>
  );
}

export default WorldMap;
