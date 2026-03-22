-- Migration: Create user profiles table
-- Stores display name, avatar, and auth provider info for authenticated players

-- ─── Profiles Table ───────────────────────────────────────────────────────
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text,
  avatar_url    text,
  auth_provider text not null default 'email',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ─── Auto-update updated_at trigger ─────────────────────────────────────────
create trigger on_profiles_updated
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- ─── Row Level Security ─────────────────────────────────────────────────────
alter table public.profiles enable row level security;

-- Users can view their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Users can insert their own profile (on first sign-in)
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ─── Auto-create profile on signup ────────────────────────────────────────
-- This trigger creates a profile row whenever a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url, auth_provider)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture'),
    coalesce(new.raw_app_meta_data->>'provider', 'email')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ─── Comments ─────────────────────────────────────────────────────────────
comment on table public.profiles is 'User profiles for Crowns of Ash. Auto-created on signup from auth provider metadata.';
comment on column public.profiles.auth_provider is 'The auth provider used: email, google, or discord';
