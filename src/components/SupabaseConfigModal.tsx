import React, { useState } from 'react';
import { X, Database, Check, Copy, ExternalLink, Key } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { SUPABASE_URL, SUPABASE_ANON_KEY, updateSupabaseCredentials, isSupabaseConfigured } from '../lib/supabase';

export const SupabaseConfigModal: React.FC = () => {
  const { isConfigModalOpen, setIsConfigModalOpen } = useMovies();
  const [url, setUrl] = useState(SUPABASE_URL);
  const [anonKey, setAnonKey] = useState(SUPABASE_ANON_KEY);
  const [savedNotice, setSavedNotice] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isConfigModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSupabaseCredentials(url, anonKey);
    setSavedNotice(true);
    setTimeout(() => {
      setIsConfigModalOpen(false);
    }, 1000);
  };

  const sampleSql = `-- Supabase Schema for Movieflix
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
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

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.ratings enable row level security;
alter table public.watchlist enable row level security;
alter table public.history enable row level security;

-- Policies
create policy "Users can view and edit own profile" on public.profiles for all using (auth.uid() = id);
create policy "Users can view and edit own ratings" on public.ratings for all using (auth.uid() = user_id);
create policy "Users can view and edit own watchlist" on public.watchlist for all using (auth.uid() = user_id);
create policy "Users can view and edit own history" on public.history for all using (auth.uid() = user_id);
`;

  const copySql = () => {
    navigator.clipboard.writeText(sampleSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#000000]/85 flex items-center justify-center p-4"
      onClick={() => setIsConfigModalOpen(false)}
    >
      <div 
        className="relative w-full max-w-2xl bg-[#111111] border border-[#282828] rounded p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsConfigModalOpen(false)}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-1.5 rounded text-[#808080] hover:text-white hover:bg-[#181818] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded bg-[#181818] text-[#E50914] border border-[#282828]">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              Database Configuration
              <span className="text-[10px] px-1.5 py-0.5 rounded-sm font-mono border border-[#333333] text-[#808080]">
                {isSupabaseConfigured() ? 'Connected' : 'Demo Mode Active'}
              </span>
            </h2>
            <p className="text-xs text-[#808080]">
              Connect Supabase for cloud sync of ratings, watchlist, and history
            </p>
          </div>
        </div>

        {savedNotice && (
          <div className="mb-4 p-2.5 rounded bg-[#181818] border border-[#E50914] text-white text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-[#E50914]" />
            <span>Credentials saved. Reloading...</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-3 mb-5">
          <div>
            <label className="block text-xs font-semibold text-[#808080] mb-1">
              Project URL (<code className="text-white font-mono">VITE_SUPABASE_URL</code>)
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full bg-[#181818] border border-[#282828] rounded px-3 py-2 text-xs text-white placeholder-[#666666] focus:outline-none focus:border-[#E50914] font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#808080] mb-1">
              Anon Public Key (<code className="text-white font-mono">VITE_SUPABASE_ANON_KEY</code>)
            </label>
            <input
              type="password"
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full bg-[#181818] border border-[#282828] rounded px-3 py-2 text-xs text-white placeholder-[#666666] focus:outline-none focus:border-[#E50914] font-mono"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#E50914] hover:bg-[#B20710] text-white font-semibold text-xs transition-colors"
            >
              Save Credentials
            </button>
            <button
              type="button"
              onClick={() => {
                setUrl('');
                setAnonKey('');
                updateSupabaseCredentials('', '');
              }}
              className="px-3 py-2 rounded bg-[#181818] hover:bg-[#222222] text-[#808080] hover:text-white border border-[#282828] text-xs font-semibold transition-colors"
            >
              Reset to Demo Mode
            </button>
          </div>
        </form>

        {/* SQL Setup Instructions */}
        <div className="border-t border-[#222222] pt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#E50914]" />
              Database Tables Schema (SQL)
            </h3>
            <button
              onClick={copySql}
              className="flex items-center gap-1 text-xs text-[#808080] hover:text-white px-2 py-1 rounded bg-[#181818] border border-[#282828] transition-colors"
            >
              {copiedSql ? <Check className="w-3 h-3 text-[#E50914]" /> : <Copy className="w-3 h-3" />}
              {copiedSql ? 'Copied' : 'Copy SQL'}
            </button>
          </div>

          <pre className="bg-[#000000] p-3 rounded text-[11px] font-mono text-[#CCCCCC] border border-[#282828] overflow-x-auto max-h-40 leading-relaxed scrollbar-thin">
            {sampleSql}
          </pre>

          <div className="mt-2 text-[11px] text-[#808080] space-y-0.5">
            <p>1. Open your <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-white hover:underline inline-flex items-center gap-0.5">Supabase Dashboard <ExternalLink className="w-2.5 h-2.5" /></a>.</p>
            <p>2. Paste the SQL in <strong>SQL Editor</strong> &gt; click <strong>Run</strong>.</p>
            <p>3. Go to <strong>Authentication &gt; Providers &gt; Google</strong> to enable Google OAuth.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
