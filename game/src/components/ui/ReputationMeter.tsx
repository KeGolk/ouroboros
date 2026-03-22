'use client';

import React, { useMemo } from 'react';
import type { FactionId, FactionStanding, ReputationTier } from '@/types/factions';
import { FACTIONS, FACTION_LIST } from '@/data/factions';
import { reputationToTier } from '@/types/factions';

// ─── Tier Visual Config ───────────────────────────────────────────────────────

interface TierStyle {
  label: string;
  badgeColor: string;
  badgeTextColor: string;
}

const TIER_STYLES: Record<ReputationTier, TierStyle> = {
  despised: {
    label: 'Despised',
    badgeColor: '#5C1A1A',
    badgeTextColor: '#F28B8B',
  },
  hostile: {
    label: 'Hostile',
    badgeColor: '#6B2D2D',
    badgeTextColor: '#E8A0A0',
  },
  neutral: {
    label: 'Neutral',
    badgeColor: '#3A3A3A',
    badgeTextColor: '#A0A0A0',
  },
  friendly: {
    label: 'Friendly',
    badgeColor: '#2D4A3A',
    badgeTextColor: '#8BC9A0',
  },
  honored: {
    label: 'Honored',
    badgeColor: '#3A5C2D',
    badgeTextColor: '#A0D88B',
  },
  exalted: {
    label: 'Exalted',
    badgeColor: '#5C6B1A',
    badgeTextColor: '#D4E88B',
  },
};

// ─── Helper: Clamp value for display ──────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Convert reputation (-100..100) to a 0..100% fill */
function reputationToPercent(reputation: number): number {
  return clamp(((reputation + 100) / 200) * 100, 0, 100);
}

// ─── Single Faction Bar ───────────────────────────────────────────────────────

interface FactionBarProps {
  factionId: FactionId;
  reputation: number;
  joined: boolean;
  compact?: boolean;
  showTooltip?: boolean;
  animate?: boolean;
}

function FactionBar({
  factionId,
  reputation,
  joined,
  compact = false,
  animate = true,
}: FactionBarProps) {
  const faction = FACTIONS[factionId];
  const tier = reputationToTier(reputation);
  const tierStyle = TIER_STYLES[tier];
  const fillPercent = reputationToPercent(reputation);

  // Determine bar color: use faction's primary color but blend toward red/green
  // based on sentiment
  const barColor = useMemo(() => {
    if (reputation <= -61) return '#8B2020'; // deep hostile red
    if (reputation <= -21) return '#A04040'; // red-tinted
    if (reputation <= 20) return faction.color; // faction base color
    if (reputation <= 60) return faction.color; // faction color trending positive
    if (reputation <= 89) return faction.accentColor; // accent for honored
    return '#C9B037'; // gold for exalted
  }, [reputation, faction.color, faction.accentColor]);

  // Glow effect for high/low rep
  const glowStyle = useMemo(() => {
    if (reputation >= 90)
      return { boxShadow: `0 0 12px 2px ${faction.accentColor}44` };
    if (reputation <= -61)
      return { boxShadow: '0 0 12px 2px #8B202044' };
    return {};
  }, [reputation, faction.accentColor]);

  return (
    <div
      className="faction-bar-container"
      style={{
        marginBottom: compact ? '8px' : '14px',
      }}
    >
      {/* Header row: sigil + name + tier badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '4px',
        }}
      >
        {/* Left: sigil + faction name */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span
            style={{ fontSize: compact ? '14px' : '16px' }}
            role="img"
            aria-label={faction.name}
          >
            {faction.sigil}
          </span>
          <span
            style={{
              fontFamily: '"Cinzel", "Palatino Linotype", serif',
              fontSize: compact ? '12px' : '14px',
              fontWeight: 600,
              color: '#D4C5A9',
              letterSpacing: '0.5px',
            }}
          >
            {faction.name}
          </span>
          {joined && (
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: faction.accentColor,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                border: `1px solid ${faction.accentColor}55`,
                borderRadius: '3px',
                padding: '1px 5px',
              }}
            >
              Joined
            </span>
          )}
        </div>

        {/* Right: reputation number + tier badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              fontFamily: '"Courier New", monospace',
              fontSize: compact ? '11px' : '13px',
              color: reputation >= 0 ? '#A0B88B' : '#B88B8B',
              fontWeight: 600,
            }}
          >
            {reputation >= 0 ? '+' : ''}
            {reputation}
          </span>
          <span
            style={{
              fontSize: compact ? '10px' : '11px',
              fontWeight: 600,
              color: tierStyle.badgeTextColor,
              backgroundColor: tierStyle.badgeColor,
              borderRadius: '4px',
              padding: '2px 8px',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              whiteSpace: 'nowrap',
            }}
          >
            {tierStyle.label}
          </span>
        </div>
      </div>

      {/* Progress bar track */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: compact ? '8px' : '12px',
          backgroundColor: '#1A1A1A',
          borderRadius: '6px',
          border: '1px solid #333',
          overflow: 'hidden',
          ...glowStyle,
        }}
      >
        {/* Center marker (neutral = 50%) */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '2px',
            backgroundColor: '#555',
            zIndex: 2,
          }}
        />

        {/* Fill bar */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${fillPercent}%`,
            backgroundColor: barColor,
            borderRadius: '5px',
            transition: animate ? 'width 0.6s ease-out, background-color 0.4s ease' : 'none',
            zIndex: 1,
          }}
        />

        {/* Parchment-like texture overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,0.05) 4px, rgba(0,0,0,0.05) 5px)',
            zIndex: 3,
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Faction motto (non-compact only) */}
      {!compact && (
        <div
          style={{
            marginTop: '2px',
            fontSize: '10px',
            color: '#6B6252',
            fontStyle: 'italic',
            fontFamily: '"Palatino Linotype", serif',
          }}
        >
          &ldquo;{faction.motto}&rdquo;
        </div>
      )}
    </div>
  );
}

// ─── Reputation Meter (all 4 factions) ────────────────────────────────────────

export interface ReputationMeterProps {
  /** Array of 4 faction standings (from game state) */
  standings: FactionStanding[];
  /** Compact mode for sidebar/overlay use */
  compact?: boolean;
  /** Whether to animate bar transitions */
  animate?: boolean;
  /** Optional title override */
  title?: string;
  /** Show/hide the panel header */
  showHeader?: boolean;
  /** Optional className for container */
  className?: string;
}

export function ReputationMeter({
  standings,
  compact = false,
  animate = true,
  title = 'Faction Standing',
  showHeader = true,
  className = '',
}: ReputationMeterProps) {
  // Index standings by factionId for lookup
  const standingMap = useMemo(() => {
    const map: Partial<Record<FactionId, FactionStanding>> = {};
    for (const s of standings) {
      map[s.factionId] = s;
    }
    return map;
  }, [standings]);

  return (
    <div
      className={`reputation-meter ${className}`}
      style={{
        backgroundColor: '#12100E',
        border: '1px solid #2A2520',
        borderRadius: '8px',
        padding: compact ? '10px 12px' : '16px 20px',
        fontFamily: '"Segoe UI", system-ui, sans-serif',
        maxWidth: '480px',
        width: '100%',
        // Parchment-like background texture
        backgroundImage:
          'radial-gradient(ellipse at 20% 50%, rgba(42, 37, 32, 0.3) 0%, transparent 70%), ' +
          'radial-gradient(ellipse at 80% 20%, rgba(42, 37, 32, 0.2) 0%, transparent 60%)',
      }}
      role="region"
      aria-label="Faction Reputation"
    >
      {/* Panel header */}
      {showHeader && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: compact ? '10px' : '16px',
            paddingBottom: '8px',
            borderBottom: '1px solid #2A2520',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontFamily: '"Cinzel", "Palatino Linotype", serif',
              fontSize: compact ? '14px' : '16px',
              fontWeight: 700,
              color: '#C9B97A',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </h3>
          {/* Scale legend */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              fontSize: '9px',
              color: '#6B6252',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            <span>-100</span>
            <span style={{ color: '#555' }}>|</span>
            <span>+100</span>
          </div>
        </div>
      )}

      {/* Faction bars — render in canonical faction order */}
      {FACTION_LIST.map((faction) => {
        const standing = standingMap[faction.id];
        return (
          <FactionBar
            key={faction.id}
            factionId={faction.id}
            reputation={standing?.reputation ?? 0}
            joined={standing?.joined ?? false}
            compact={compact}
            animate={animate}
          />
        );
      })}

      {/* Footer legend */}
      {!compact && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginTop: '8px',
            paddingTop: '8px',
            borderTop: '1px solid #2A2520',
          }}
        >
          {(
            ['despised', 'hostile', 'neutral', 'friendly', 'honored', 'exalted'] as ReputationTier[]
          ).map((tier) => {
            const style = TIER_STYLES[tier];
            return (
              <span
                key={tier}
                style={{
                  fontSize: '9px',
                  fontWeight: 600,
                  color: style.badgeTextColor,
                  backgroundColor: style.badgeColor,
                  borderRadius: '3px',
                  padding: '1px 6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {style.label}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ReputationMeter;
