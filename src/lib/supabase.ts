import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve from Vite env or fallback to LocalStorage config
const getEnvOrStorage = (key: string, storageKey: string): string => {
  const envObj = (import.meta as any).env || {};
  const envVal = envObj[key];
  if (envVal && typeof envVal === 'string' && envVal.trim() !== '' && !envVal.includes('your-supabase')) {
    return envVal;
  }
  return localStorage.getItem(storageKey) || '';
};

export const SUPABASE_URL = getEnvOrStorage('VITE_SUPABASE_URL', 'cineai_supabase_url');
export const SUPABASE_ANON_KEY = getEnvOrStorage('VITE_SUPABASE_ANON_KEY', 'cineai_supabase_anon_key');

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    SUPABASE_URL && 
    SUPABASE_ANON_KEY && 
    SUPABASE_URL.startsWith('https://') &&
    SUPABASE_ANON_KEY.length > 20
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Google OAuth trigger
export const signInWithGoogle = async () => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please add your Supabase URL & Anon Key.');
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) throw error;
  return data;
};

// Update Supabase configuration dynamically from the UI
export const updateSupabaseCredentials = (url: string, key: string) => {
  if (url) localStorage.setItem('cineai_supabase_url', url.trim());
  else localStorage.removeItem('cineai_supabase_url');

  if (key) localStorage.setItem('cineai_supabase_anon_key', key.trim());
  else localStorage.removeItem('cineai_supabase_anon_key');

  window.location.reload();
};
