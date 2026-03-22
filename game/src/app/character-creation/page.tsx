'use client';

import React from 'react';
import { StatAllocation } from '@/components/character-creation/StatAllocation';
import type { StatBlock } from '@/lib/types/stats';

export default function CharacterCreationPage() {
  const handleConfirm = (stats: StatBlock) => {
    // TODO: Save to game state store and navigate to next step
    console.log('Character stats confirmed:', stats);
    alert('Stats confirmed! (Navigation not yet implemented)');
  };

  return (
    <main className="min-h-screen py-8">
      <StatAllocation
        onConfirm={handleConfirm}
        onBack={() => window.history.back()}
      />
    </main>
  );
}
