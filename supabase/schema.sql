-- ========================================================
-- Movieflix - Movie Recommendation System Supabase Schema
-- ========================================================

-- Enable extensions
create extension if not exists "uuid-ossp";

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  favorite_industries text[] default array['Hollywood', 'Bollywood', 'Tollywood', 'Marathi'],
  favorite_genres text[] default array['Action', 'Drama', 'Sci-Fi'],
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Ratings Table
create table if not exists public.ratings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  movie_id text not null,
  rating integer not null check (rating >= 1 and rating <= 10),
  review text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, movie_id)
);

-- 3. Watchlist Table
create table if not exists public.watchlist (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  movie_id text not null,
  added_at timestamp with time zone default timezone('utc'::text, now()) not null,
  watched boolean default false,
  unique(user_id, movie_id)
);

-- 4. History Table
create table if not exists public.history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  movie_id text not null,
  watched_at timestamp with time zone default timezone('utc'::text, now()) not null,
  progress_percent integer default 100,
  unique(user_id, movie_id)
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.ratings enable row level security;
alter table public.watchlist enable row level security;
alter table public.history enable row level security;

-- RLS Policies: Profiles
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- RLS Policies: Ratings
create policy "Users can view own ratings" on public.ratings for select using (auth.uid() = user_id);
create policy "Users can insert own ratings" on public.ratings for insert with check (auth.uid() = user_id);
create policy "Users can update own ratings" on public.ratings for update using (auth.uid() = user_id);
create policy "Users can delete own ratings" on public.ratings for delete using (auth.uid() = user_id);

-- RLS Policies: Watchlist
create policy "Users can view own watchlist" on public.watchlist for select using (auth.uid() = user_id);
create policy "Users can insert own watchlist" on public.watchlist for insert with check (auth.uid() = user_id);
create policy "Users can update own watchlist" on public.watchlist for update using (auth.uid() = user_id);
create policy "Users can delete own watchlist" on public.watchlist for delete using (auth.uid() = user_id);

-- RLS Policies: History
create policy "Users can view own history" on public.history for select using (auth.uid() = user_id);
create policy "Users can insert own history" on public.history for insert with check (auth.uid() = user_id);
create policy "Users can update own history" on public.history for update using (auth.uid() = user_id);
create policy "Users can delete own history" on public.history for delete using (auth.uid() = user_id);

-- Auto-create profile trigger on auth signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/initials/svg?seed=' || new.email)
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
