import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured, signInWithGoogle } from '../lib/supabase';
import { UserProfile } from '../types/movie';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isSupabaseActive: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: () => void;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const GUEST_USER: UserProfile = {
  id: 'guest-cinephile-01',
  email: 'cinephile@cineai.stream',
  fullName: 'Arjun Verma (Demo Cinephile)',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  favoriteIndustries: ['Hollywood', 'Bollywood', 'Tollywood', 'Marathi'],
  favoriteGenres: ['Action', 'Drama', 'Sci-Fi', 'Comedy'],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('cineai_current_user');
    return saved ? JSON.parse(saved) : GUEST_USER;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isSupabaseActive = isSupabaseConfigured();

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    // Check existing Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const profile: UserProfile = {
          id: session.user.id,
          email: session.user.email || '',
          fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Movie Enthusiast',
          avatarUrl: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${session.user.email}`,
          favoriteIndustries: ['Hollywood', 'Bollywood', 'Tollywood', 'Marathi'],
          favoriteGenres: ['Action', 'Drama', 'Sci-Fi'],
        };
        setUser(profile);
        localStorage.setItem('cineai_current_user', JSON.stringify(profile));
      }
      setIsLoading(false);
    });

    // Listen to Supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const profile: UserProfile = {
          id: session.user.id,
          email: session.user.email || '',
          fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Movie Enthusiast',
          avatarUrl: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${session.user.email}`,
          favoriteIndustries: ['Hollywood', 'Bollywood', 'Tollywood', 'Marathi'],
          favoriteGenres: ['Action', 'Drama', 'Sci-Fi'],
        };
        setUser(profile);
        localStorage.setItem('cineai_current_user', JSON.stringify(profile));
      } else {
        // If guest was logged in, retain unless explicitly cleared
        const saved = localStorage.getItem('cineai_current_user');
        if (!saved) {
          setUser(null);
        }
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loginWithGoogle = async () => {
    if (!isSupabaseActive) {
      throw new Error('Supabase is not configured yet. Please configure your Supabase URL & Anon Key in settings.');
    }
    await signInWithGoogle();
  };

  const loginAsGuest = () => {
    setUser(GUEST_USER);
    localStorage.setItem('cineai_current_user', JSON.stringify(GUEST_USER));
  };

  const loginWithEmail = async (email: string, pass: string) => {
    if (!supabase) throw new Error('Supabase is not configured.');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
    if (data.user) {
      const profile: UserProfile = {
        id: data.user.id,
        email: data.user.email || email,
        fullName: data.user.user_metadata?.full_name || email.split('@')[0],
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
        favoriteIndustries: ['Hollywood', 'Bollywood', 'Tollywood', 'Marathi'],
        favoriteGenres: ['Action', 'Drama'],
      };
      setUser(profile);
      localStorage.setItem('cineai_current_user', JSON.stringify(profile));
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    if (!supabase) throw new Error('Supabase is not configured.');
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: { data: { full_name: name } }
    });
    if (error) throw error;
    if (data.user) {
      const profile: UserProfile = {
        id: data.user.id,
        email: data.user.email || email,
        fullName: name,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
        favoriteIndustries: ['Hollywood', 'Bollywood', 'Tollywood', 'Marathi'],
        favoriteGenres: ['Action', 'Drama'],
      };
      setUser(profile);
      localStorage.setItem('cineai_current_user', JSON.stringify(profile));
    }
  };

  const logout = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Sign out error', err);
      }
    }
    setUser(null);
    localStorage.removeItem('cineai_current_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isSupabaseActive,
        loginWithGoogle,
        loginAsGuest,
        loginWithEmail,
        signUpWithEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
