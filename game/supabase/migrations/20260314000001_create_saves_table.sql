-- Migration: Create saves table for game save slots
-- Supports both authenticated users (Supabase auth) and anonymous/offline play

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─── Saves Table ────────────────────────────────────────────────────────────
create table public.saves (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references auth.users(id) on delete cascade,
  slot_name     text not null default 'Save 1',
  chapter       text not null default 'chapter_1',
  scene         text not null default 'scene_intro',
  game_state    jsonb not null default '{}'::jsonb,
  character_stats jsonb not null default '{}'::jsonb,
  is_autosave   boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ─── Indexes ────────────────────────────────────────────────────────────────
-- Fast lookup by user
create index idx_saves_user_id on public.saves(user_id);
-- Fast lookup for autosaves per user
create index idx_saves_user_autosave on public.saves(user_id, is_autosave) where is_autosave = true;
-- Fast lookup by user + slot name
create unique index idx_saves_user_slot on public.saves(user_id, slot_name) where user_id is not null;

-- ─── Auto-update updated_at trigger ─────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_saves_updated
  before update on public.saves
  for each row
  execute function public.handle_updated_at();

-- ─── Row Level Security ─────────────────────────────────────────────────────
alter table public.saves enable row level security;

-- Users can only see their own saves
create policy "Users can view own saves"
  on public.saves for select
  using (auth.uid() = user_id);

-- Users can insert their own saves
create policy "Users can insert own saves"
  on public.saves for insert
  with check (auth.uid() = user_id);

-- Users can update their own saves
create policy "Users can update own saves"
  on public.saves for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users can delete their own saves
create policy "Users can delete own saves"
  on public.saves for delete
  using (auth.uid() = user_id);

-- ─── Comments ───────────────────────────────────────────────────────────────
comment on table public.saves is 'Game save slots for Crowns of Ash. Stores player progress, stats, and full game state.';
comment on column public.saves.id is 'Unique save identifier';
comment on column public.saves.user_id is 'References auth.users. NULL for anonymous/offline saves (handled client-side via localStorage)';
comment on column public.saves.slot_name is 'Display name for the save slot (e.g. "Save 1", "Autosave", "Chapter 5 - Before Boss")';
comment on column public.saves.chapter is 'Current chapter ID (e.g. "chapter_1")';
comment on column public.saves.scene is 'Current scene ID within the chapter';
comment on column public.saves.game_state is 'Full GameState JSON: flags, choiceHistory, factions, deadCharacters, unlocks, completedChapters, ngPlusCycle, achievements, playtimeSeconds';
comment on column public.saves.character_stats is 'PlayerStats JSON: strength, cunning, charisma, wisdom, honor, corruption';
comment on column public.saves.is_autosave is 'Whether this save was created automatically at chapter transitions';
comment on column public.saves.created_at is 'When the save was first created';
comment on column public.saves.updated_at is 'When the save was last overwritten';
