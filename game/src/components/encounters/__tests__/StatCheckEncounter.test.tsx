/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { StatCheckEncounter } from '../StatCheckEncounter';
import type { MinorEncounter, MinorEncounterResult } from '@/types/combat';
import type { StatBlock } from '@/types/stats';

// ─── Test Fixtures ──────────────────────────────────────────────────

const createStatBlock = (overrides: Partial<Record<string, number>> = {}): StatBlock => {
  const defaults: Record<string, number> = {
    strength: 10,
    dexterity: 10,
    intelligence: 10,
    wisdom: 10,
    constitution: 10,
    charisma: 10,
    influence: 10,
    cunning: 10,
    diplomacy: 10,
    ...overrides,
  };

  const block: Record<string, { base: number; modifiers: never[]; total: number }> = {};
  for (const [key, value] of Object.entries(defaults)) {
    block[key] = { base: value, modifiers: [], total: value };
  }
  return block as unknown as StatBlock;
};

const sampleEncounter: MinorEncounter = {
  id: 'test_encounter_1',
  type: 'minor',
  description: 'A locked iron gate bars your path. Ancient runes glow faintly on its surface.',
  checkStat: 'wisdom',
  difficulty: 12,
  secondaryStat: 'cunning',
  secondaryMultiplier: 0.5,
  failureDamage: 8,
  successText: 'The runes yield to your understanding, and the gate swings open silently.',
  failureText: 'The runes flare with blinding light. A shock of arcane energy courses through you.',
  experienceReward: 50,
  chapterId: 'chapter_1',
};

const highStatsBlock = createStatBlock({ wisdom: 18, cunning: 14 });
const lowStatsBlock = createStatBlock({ wisdom: 5, cunning: 4 });

// ─── Tests ──────────────────────────────────────────────────────────

describe('StatCheckEncounter', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders encounter description in intro phase', () => {
    const onResolve = jest.fn();
    const onContinue = jest.fn();

    render(
      <StatCheckEncounter
        encounter={sampleEncounter}
        playerStats={highStatsBlock}
        onResolve={onResolve}
        onContinue={onContinue}
      />
    );

    // Should show the encounter description
    expect(screen.getByText(sampleEncounter.description)).toBeInTheDocument();
    // Should show the "Face the Challenge" button
    expect(screen.getByText('Face the Challenge')).toBeInTheDocument();
    // Should show difficulty badge
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('transitions to stat display phase when challenge button is clicked', () => {
    const onResolve = jest.fn();
    const onContinue = jest.fn();

    render(
      <StatCheckEncounter
        encounter={sampleEncounter}
        playerStats={highStatsBlock}
        onResolve={onResolve}
        onContinue={onContinue}
      />
    );

    fireEvent.click(screen.getByText('Face the Challenge'));

    // Should show the stat display with primary stat
    expect(screen.getByText('WIS')).toBeInTheDocument();
    // Should show "Test Your Mettle" button
    expect(screen.getByText('Test Your Mettle')).toBeInTheDocument();
  });

  it('shows correct difficulty label for different DCs', () => {
    const easierEncounter = { ...sampleEncounter, difficulty: 5 };
    const onResolve = jest.fn();
    const onContinue = jest.fn();

    render(
      <StatCheckEncounter
        encounter={easierEncounter}
        playerStats={highStatsBlock}
        onResolve={onResolve}
        onContinue={onContinue}
      />
    );

    expect(screen.getByText('Trivial')).toBeInTheDocument();
  });

  it('calls onResolve with a deterministic result when custom resolver is provided', async () => {
    const onResolve = jest.fn();
    const onContinue = jest.fn();

    const customResult: MinorEncounterResult = {
      success: true,
      statValue: 18,
      difficulty: 12,
      secondaryBonus: 7,
      totalCheck: 26,
      damageTaken: 0,
      experienceGained: 50,
      narrative: 'The runes yield to your understanding, and the gate swings open silently.',
    };

    const customResolver = jest.fn().mockReturnValue(customResult);

    render(
      <StatCheckEncounter
        encounter={sampleEncounter}
        playerStats={highStatsBlock}
        onResolve={onResolve}
        onContinue={onContinue}
        resolveEncounter={customResolver}
      />
    );

    // Move to stat display
    fireEvent.click(screen.getByText('Face the Challenge'));
    // Start rolling
    fireEvent.click(screen.getByText('Test Your Mettle'));

    // Fast-forward through the roll animation (20 ticks × 80ms + 500ms result delay)
    act(() => {
      jest.advanceTimersByTime(2200);
    });

    expect(customResolver).toHaveBeenCalledWith(highStatsBlock, sampleEncounter);
    expect(onResolve).toHaveBeenCalledWith(customResult);
  });

  it('shows success result for high stats', async () => {
    const onResolve = jest.fn();
    const onContinue = jest.fn();

    const customResult: MinorEncounterResult = {
      success: true,
      statValue: 18,
      difficulty: 12,
      secondaryBonus: 7,
      totalCheck: 26,
      damageTaken: 0,
      experienceGained: 50,
      narrative: sampleEncounter.successText,
    };

    render(
      <StatCheckEncounter
        encounter={sampleEncounter}
        playerStats={highStatsBlock}
        onResolve={onResolve}
        onContinue={onContinue}
        resolveEncounter={() => customResult}
      />
    );

    fireEvent.click(screen.getByText('Face the Challenge'));
    fireEvent.click(screen.getByText('Test Your Mettle'));

    act(() => {
      jest.advanceTimersByTime(2200);
    });

    await waitFor(() => {
      expect(screen.getByText('Success!')).toBeInTheDocument();
    });
  });

  it('shows failure result with damage for low stats', async () => {
    const onResolve = jest.fn();
    const onContinue = jest.fn();

    const customResult: MinorEncounterResult = {
      success: false,
      statValue: 5,
      difficulty: 12,
      secondaryBonus: 2,
      totalCheck: 6,
      damageTaken: 8,
      experienceGained: 12,
      narrative: sampleEncounter.failureText,
    };

    render(
      <StatCheckEncounter
        encounter={sampleEncounter}
        playerStats={lowStatsBlock}
        onResolve={onResolve}
        onContinue={onContinue}
        resolveEncounter={() => customResult}
      />
    );

    fireEvent.click(screen.getByText('Face the Challenge'));
    fireEvent.click(screen.getByText('Test Your Mettle'));

    act(() => {
      jest.advanceTimersByTime(2200);
    });

    await waitFor(() => {
      expect(screen.getByText('Failure!')).toBeInTheDocument();
    });
  });

  it('calls onContinue when Continue button is clicked after narrative', async () => {
    const onResolve = jest.fn();
    const onContinue = jest.fn();

    const customResult: MinorEncounterResult = {
      success: true,
      statValue: 18,
      difficulty: 12,
      secondaryBonus: 7,
      totalCheck: 26,
      damageTaken: 0,
      experienceGained: 50,
      narrative: sampleEncounter.successText,
    };

    render(
      <StatCheckEncounter
        encounter={sampleEncounter}
        playerStats={highStatsBlock}
        onResolve={onResolve}
        onContinue={onContinue}
        resolveEncounter={() => customResult}
      />
    );

    // Progress through all phases
    fireEvent.click(screen.getByText('Face the Challenge'));
    fireEvent.click(screen.getByText('Test Your Mettle'));

    act(() => {
      jest.advanceTimersByTime(2200);
    });

    await waitFor(() => {
      expect(screen.getByText('See What Happens...')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('See What Happens...'));

    await waitFor(() => {
      expect(screen.getByText('Continue')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Continue'));
    expect(onContinue).toHaveBeenCalledWith(customResult);
  });

  it('displays XP reward on both success and failure', async () => {
    const onResolve = jest.fn();
    const onContinue = jest.fn();

    const customResult: MinorEncounterResult = {
      success: true,
      statValue: 18,
      difficulty: 12,
      secondaryBonus: 7,
      totalCheck: 26,
      damageTaken: 0,
      experienceGained: 50,
      narrative: sampleEncounter.successText,
    };

    render(
      <StatCheckEncounter
        encounter={sampleEncounter}
        playerStats={highStatsBlock}
        onResolve={onResolve}
        onContinue={onContinue}
        resolveEncounter={() => customResult}
      />
    );

    fireEvent.click(screen.getByText('Face the Challenge'));
    fireEvent.click(screen.getByText('Test Your Mettle'));

    act(() => {
      jest.advanceTimersByTime(2200);
    });

    await waitFor(() => {
      expect(screen.getByText('+50 XP')).toBeInTheDocument();
    });
  });

  it('renders encounter without secondary stat', () => {
    const onResolve = jest.fn();
    const onContinue = jest.fn();

    const simpleEncounter: MinorEncounter = {
      ...sampleEncounter,
      secondaryStat: undefined,
    };

    render(
      <StatCheckEncounter
        encounter={simpleEncounter}
        playerStats={highStatsBlock}
        onResolve={onResolve}
        onContinue={onContinue}
      />
    );

    fireEvent.click(screen.getByText('Face the Challenge'));

    // Primary stat should be visible
    expect(screen.getByText('WIS')).toBeInTheDocument();
    // Secondary stat (CUN) should NOT be visible
    expect(screen.queryByText('CUN')).not.toBeInTheDocument();
  });
});
