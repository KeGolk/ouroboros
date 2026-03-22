'use client';

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import type { GameState } from '@/engine/types';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SaveSlot {
  /** Unique slot ID */
  id: string;
  /** User-given name for this save */
  name: string;
  /** The full game state snapshot */
  gameState: GameState;
  /** ISO timestamp when the save was created */
  createdAt: string;
  /** Whether this is an autosave */
  isAutosave: boolean;
  /** Optional chapter title for display */
  chapterTitle?: string;
  /** Optional thumbnail/scene description */
  sceneDescription?: string;
}

export interface SaveLoadModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Close the modal */
  onClose: () => void;
  /** Current game state for creating new saves */
  currentGameState: GameState | null;
  /** All existing save slots */
  saveSlots: SaveSlot[];
  /** Called when the user creates or overwrites a save */
  onSave: (slot: SaveSlot) => void;
  /** Called when the user loads a save */
  onLoad: (slot: SaveSlot) => void;
  /** Called when the user deletes a save */
  onDelete: (slotId: string) => void;
  /** Which tab to start on */
  initialTab?: 'save' | 'load';
  /** Current chapter title for display in new saves */
  currentChapterTitle?: string;
  /** Current scene description for display in new saves */
  currentSceneDescription?: string;
}

type ConfirmAction =
  | { type: 'load'; slot: SaveSlot }
  | { type: 'delete'; slot: SaveSlot }
  | { type: 'overwrite'; slot: SaveSlot; newName: string };

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Unknown';
  }
}

function formatPlaytime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function generateSlotId(): string {
  return `save_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function ConfirmDialog({
  action,
  onConfirm,
  onCancel,
}: {
  action: ConfirmAction;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const messages: Record<ConfirmAction['type'], { title: string; body: string; confirmLabel: string; danger: boolean }> = {
    load: {
      title: 'Load Save',
      body: `Load "${action.slot.name}"? Any unsaved progress will be lost.`,
      confirmLabel: 'Load',
      danger: false,
    },
    delete: {
      title: 'Delete Save',
      body: `Permanently delete "${action.slot.name}"? This cannot be undone.`,
      confirmLabel: 'Delete',
      danger: true,
    },
    overwrite: {
      title: 'Overwrite Save',
      body: `Overwrite "${action.slot.name}" with current progress?`,
      confirmLabel: 'Overwrite',
      danger: true,
    },
  };

  const msg = messages[action.type];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      {/* Dialog */}
      <div className="relative parchment-panel p-6 max-w-sm w-full space-y-4 animate-in fade-in zoom-in-95">
        <h3 className="font-display text-lg text-parchment-100">{msg.title}</h3>
        <p className="text-sm text-parchment-300 leading-relaxed">{msg.body}</p>
        <div className="flex gap-3 justify-end pt-2">
          <button
            onClick={onCancel}
            className="btn-medieval text-xs"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`btn-medieval text-xs ${
              msg.danger
                ? 'bg-blood-900/60 border-blood-700/50 text-blood-300 hover:bg-blood-800/60 hover:border-blood-600/50'
                : 'btn-medieval-primary'
            }`}
          >
            {msg.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function SaveSlotCard({
  slot,
  mode,
  onLoad,
  onDelete,
  onOverwrite,
}: {
  slot: SaveSlot;
  mode: 'save' | 'load';
  onLoad: (slot: SaveSlot) => void;
  onDelete: (slot: SaveSlot) => void;
  onOverwrite: (slot: SaveSlot) => void;
}) {
  const gs = slot.gameState;

  return (
    <div
      className={`
        group relative parchment-panel p-4 transition-all duration-200
        hover:border-gold-600/40 hover:shadow-inner-glow
        ${slot.isAutosave ? 'border-l-2 border-l-iron-500/60' : ''}
      `}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-display text-sm text-parchment-100 truncate">
              {slot.name}
            </h4>
            {slot.isAutosave && (
              <span className="flex-shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-display uppercase tracking-wider bg-iron-800/60 border border-iron-600/40 rounded text-iron-300">
                <AutosaveIcon />
                Auto
              </span>
            )}
          </div>
          <p className="text-xs text-parchment-400 mt-0.5">
            {formatTimestamp(slot.createdAt)}
          </p>
        </div>

        {/* Action buttons - visible on hover / always on touch */}
        <div className="flex gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150">
          {mode === 'load' ? (
            <button
              onClick={() => onLoad(slot)}
              className="btn-medieval text-[10px] px-2.5 py-1.5"
              title="Load this save"
            >
              Load
            </button>
          ) : (
            <button
              onClick={() => onOverwrite(slot)}
              className="btn-medieval text-[10px] px-2.5 py-1.5"
              title="Overwrite this save"
            >
              Overwrite
            </button>
          )}
          <button
            onClick={() => onDelete(slot)}
            className="btn-medieval text-[10px] px-2 py-1.5 text-blood-400 hover:text-blood-300 hover:border-blood-700/50"
            title="Delete this save"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {/* Info row */}
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-parchment-400">
        {slot.chapterTitle && (
          <span className="flex items-center gap-1">
            <BookIcon />
            {slot.chapterTitle}
          </span>
        )}
        <span className="flex items-center gap-1">
          <ClockIcon />
          {formatPlaytime(gs.playtimeSeconds)}
        </span>
        {gs.ngPlusCycle > 0 && (
          <span className="text-gold-400">
            NG+{gs.ngPlusCycle}
          </span>
        )}
      </div>

      {/* Scene description */}
      {slot.sceneDescription && (
        <p className="mt-1.5 text-[11px] text-parchment-500 italic line-clamp-2">
          {slot.sceneDescription}
        </p>
      )}

      {/* Mini stat row */}
      <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-parchment-500">
        <span title="Strength">STR {gs.stats.strength}</span>
        <span className="text-parchment-700">·</span>
        <span title="Dexterity">DEX {gs.stats.dexterity}</span>
        <span className="text-parchment-700">·</span>
        <span title="Intelligence">INT {gs.stats.intelligence}</span>
        <span className="text-parchment-700">·</span>
        <span title="Wisdom">WIS {gs.stats.wisdom}</span>
        <span className="text-parchment-700">·</span>
        <span title="Constitution">CON {gs.stats.constitution}</span>
        <span className="text-parchment-700">·</span>
        <span title="Charisma">CHA {gs.stats.charisma}</span>
        <span className="text-parchment-700">·</span>
        <span title="Influence">INF {gs.stats.influence}</span>
        <span className="text-parchment-700">·</span>
        <span title="Cunning">CUN {gs.stats.cunning}</span>
        <span className="text-parchment-700">·</span>
        <span title="Diplomacy">DIP {gs.stats.diplomacy}</span>
      </div>
    </div>
  );
}

// ─── Inline SVG Icons (no external deps) ────────────────────────────────────

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function AutosaveIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M23 4v6h-6" />
      <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function SaveLoadModal({
  isOpen,
  onClose,
  currentGameState,
  saveSlots,
  onSave,
  onLoad,
  onDelete,
  initialTab = 'save',
  currentChapterTitle,
  currentSceneDescription,
}: SaveLoadModalProps) {
  const [activeTab, setActiveTab] = useState<'save' | 'load'>(initialTab);
  const [newSaveName, setNewSaveName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [showNewSaveForm, setShowNewSaveForm] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setNewSaveName('');
      setSearchQuery('');
      setConfirmAction(null);
      setShowNewSaveForm(false);
    }
  }, [isOpen, initialTab]);

  // Focus name input when new-save form appears
  useEffect(() => {
    if (showNewSaveForm && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [showNewSaveForm]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (confirmAction) {
          setConfirmAction(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, confirmAction, onClose]);

  // Sort: autosaves first, then by date descending
  const sortedSlots = useMemo(() => {
    let filtered = [...saveSlots];

    // Apply search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.chapterTitle?.toLowerCase().includes(q) ||
          s.sceneDescription?.toLowerCase().includes(q)
      );
    }

    return filtered.sort((a, b) => {
      // Autosaves always at top
      if (a.isAutosave && !b.isAutosave) return -1;
      if (!a.isAutosave && b.isAutosave) return 1;
      // Then by creation date descending
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [saveSlots, searchQuery]);

  const manualSaveCount = saveSlots.filter((s) => !s.isAutosave).length;
  const autosaveCount = saveSlots.filter((s) => s.isAutosave).length;

  // ─── Handlers ───────────────────────────────────────────────────────────

  const handleCreateSave = useCallback(() => {
    if (!currentGameState) return;

    const name = newSaveName.trim() || `Save ${manualSaveCount + 1}`;

    const slot: SaveSlot = {
      id: generateSlotId(),
      name,
      gameState: { ...currentGameState, savedAt: Date.now() },
      createdAt: new Date().toISOString(),
      isAutosave: false,
      chapterTitle: currentChapterTitle,
      sceneDescription: currentSceneDescription,
    };

    onSave(slot);
    setNewSaveName('');
    setShowNewSaveForm(false);
  }, [currentGameState, newSaveName, manualSaveCount, currentChapterTitle, currentSceneDescription, onSave]);

  const handleConfirm = useCallback(() => {
    if (!confirmAction) return;

    switch (confirmAction.type) {
      case 'load':
        onLoad(confirmAction.slot);
        onClose();
        break;
      case 'delete':
        onDelete(confirmAction.slot.id);
        break;
      case 'overwrite':
        if (currentGameState) {
          const updatedSlot: SaveSlot = {
            ...confirmAction.slot,
            name: confirmAction.newName || confirmAction.slot.name,
            gameState: { ...currentGameState, savedAt: Date.now() },
            createdAt: new Date().toISOString(),
            chapterTitle: currentChapterTitle,
            sceneDescription: currentSceneDescription,
          };
          onSave(updatedSlot);
        }
        break;
    }
    setConfirmAction(null);
  }, [confirmAction, onLoad, onDelete, onSave, onClose, currentGameState, currentChapterTitle, currentSceneDescription]);

  const requestLoad = useCallback((slot: SaveSlot) => {
    setConfirmAction({ type: 'load', slot });
  }, []);

  const requestDelete = useCallback((slot: SaveSlot) => {
    setConfirmAction({ type: 'delete', slot });
  }, []);

  const requestOverwrite = useCallback((slot: SaveSlot) => {
    setConfirmAction({ type: 'overwrite', slot, newName: slot.name });
  }, []);

  // ─── Render ─────────────────────────────────────────────────────────────

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Save and Load Game"
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div
          ref={modalRef}
          className="relative w-full max-w-xl max-h-[85vh] flex flex-col parchment-panel overflow-hidden"
        >
          {/* ── Header ─────────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-parchment-800/30">
            <h2 className="font-display text-xl text-parchment-100 tracking-wide">
              Save &amp; Load
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-parchment-400 hover:text-parchment-100 hover:bg-shadow-700/50 transition-colors"
              aria-label="Close"
            >
              <CloseIcon />
            </button>
          </div>

          {/* ── Tab bar ────────────────────────────────────────────────────── */}
          <div className="flex border-b border-parchment-800/30">
            <button
              onClick={() => setActiveTab('save')}
              className={`flex-1 py-3 text-center font-display text-sm uppercase tracking-wider transition-all duration-200 ${
                activeTab === 'save'
                  ? 'text-gold-300 border-b-2 border-gold-500 bg-shadow-800/40'
                  : 'text-parchment-400 hover:text-parchment-200 hover:bg-shadow-800/20'
              }`}
              disabled={!currentGameState}
              title={!currentGameState ? 'No active game to save' : undefined}
            >
              Save Game
            </button>
            <button
              onClick={() => setActiveTab('load')}
              className={`flex-1 py-3 text-center font-display text-sm uppercase tracking-wider transition-all duration-200 ${
                activeTab === 'load'
                  ? 'text-gold-300 border-b-2 border-gold-500 bg-shadow-800/40'
                  : 'text-parchment-400 hover:text-parchment-200 hover:bg-shadow-800/20'
              }`}
            >
              Load Game
            </button>
          </div>

          {/* ── Search bar (load mode or when many saves) ──────────────────── */}
          {saveSlots.length > 3 && (
            <div className="px-4 pt-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-parchment-500">
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  placeholder="Search saves..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-shadow-800/60 border border-parchment-800/30 rounded text-parchment-200 placeholder:text-parchment-600 focus:outline-none focus:border-gold-600/50 transition-colors"
                />
              </div>
            </div>
          )}

          {/* ── Save slot count ─────────────────────────────────────────────── */}
          <div className="px-5 pt-3 pb-1 flex items-center justify-between text-[11px] text-parchment-500">
            <span>
              {manualSaveCount} manual save{manualSaveCount !== 1 ? 's' : ''}
              {autosaveCount > 0 && ` · ${autosaveCount} autosave${autosaveCount !== 1 ? 's' : ''}`}
            </span>
            {searchQuery && (
              <span className="text-gold-400">
                {sortedSlots.length} result{sortedSlots.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* ── Scrollable slot list ────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 scrollbar-thin">
            {/* New save button (save mode only) */}
            {activeTab === 'save' && currentGameState && (
              <div className="pt-1">
                {showNewSaveForm ? (
                  <div className="parchment-panel p-4 space-y-3 border-gold-600/30">
                    <label className="block">
                      <span className="text-xs font-display text-parchment-300 uppercase tracking-wider">
                        Save Name
                      </span>
                      <input
                        ref={nameInputRef}
                        type="text"
                        placeholder={`Save ${manualSaveCount + 1}`}
                        value={newSaveName}
                        onChange={(e) => setNewSaveName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCreateSave();
                          if (e.key === 'Escape') setShowNewSaveForm(false);
                        }}
                        maxLength={60}
                        className="mt-1 w-full px-3 py-2 text-sm bg-shadow-800/80 border border-parchment-800/40 rounded text-parchment-100 placeholder:text-parchment-600 focus:outline-none focus:border-gold-600/50 transition-colors"
                      />
                    </label>

                    {/* Current game info preview */}
                    <div className="text-[11px] text-parchment-400 space-y-0.5">
                      {currentChapterTitle && (
                        <p className="flex items-center gap-1">
                          <BookIcon /> {currentChapterTitle}
                        </p>
                      )}
                      <p className="flex items-center gap-1">
                        <ClockIcon /> {formatPlaytime(currentGameState.playtimeSeconds)} played
                      </p>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setShowNewSaveForm(false)}
                        className="btn-medieval text-[10px]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreateSave}
                        className="btn-medieval-primary text-[10px]"
                      >
                        Create Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowNewSaveForm(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-parchment-800/40 rounded-lg text-parchment-400 hover:text-gold-300 hover:border-gold-600/40 transition-all duration-200 group"
                  >
                    <PlusIcon />
                    <span className="font-display text-sm uppercase tracking-wider">
                      New Save
                    </span>
                  </button>
                )}
              </div>
            )}

            {/* Empty state */}
            {sortedSlots.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-parchment-500 font-display text-sm">
                  {searchQuery ? 'No saves match your search.' : 'No saved games yet.'}
                </p>
                {!searchQuery && activeTab === 'save' && currentGameState && (
                  <p className="text-parchment-600 text-xs mt-2">
                    Create your first save above.
                  </p>
                )}
                {!searchQuery && activeTab === 'load' && (
                  <p className="text-parchment-600 text-xs mt-2">
                    Start a new game or switch to the Save tab to create one.
                  </p>
                )}
              </div>
            )}

            {/* Save slot cards */}
            {sortedSlots.map((slot) => (
              <SaveSlotCard
                key={slot.id}
                slot={slot}
                mode={activeTab}
                onLoad={requestLoad}
                onDelete={requestDelete}
                onOverwrite={requestOverwrite}
              />
            ))}
          </div>

          {/* ── Footer ─────────────────────────────────────────────────────── */}
          <div className="px-5 py-3 border-t border-parchment-800/30 flex items-center justify-between">
            <p className="text-[10px] text-parchment-600 italic">
              Saves are stored locally. Sign in to sync across devices.
            </p>
            <button
              onClick={onClose}
              className="btn-medieval text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation dialog overlay */}
      {confirmAction && (
        <ConfirmDialog
          action={confirmAction}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </>
  );
}

export default SaveLoadModal;
