import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import moviesData from '../data/movies.json';
import { Movie, IndustryType, UserRating, WatchlistItem, HistoryItem, AIRecommendationResult } from '../types/movie';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import { getPersonalizedRecommendations, getSimilarMovies } from '../services/aiRecommender';

interface MovieContextType {
  movies: Movie[];
  filteredMovies: Movie[];
  movieMap: Map<string, Movie>;
  // Filters & State
  selectedIndustry: IndustryType | 'All';
  setSelectedIndustry: (ind: IndustryType | 'All') => void;
  selectedGenres: string[];
  toggleGenre: (genre: string) => void;
  clearGenres: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  selectedMood: string;
  setSelectedMood: (mood: string) => void;
  // User activities
  ratings: Record<string, UserRating>;
  rateMovie: (movieId: string, rating: number, review?: string) => Promise<void>;
  watchlist: WatchlistItem[];
  toggleWatchlist: (movieId: string) => Promise<void>;
  isInWatchlist: (movieId: string) => boolean;
  history: HistoryItem[];
  addToHistory: (movieId: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  // Recommendations
  personalizedRecommendations: AIRecommendationResult[];
  getMovieSimilar: (movie: Movie, limit?: number) => AIRecommendationResult[];
  // Modals & Active items
  activeMovie: Movie | null;
  setActiveMovie: (m: Movie | null) => void;
  activeTrailerKey: string | null;
  setActiveTrailerKey: (key: string | null) => void;
  isAIModalOpen: boolean;
  setIsAIModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isConfigModalOpen: boolean;
  setIsConfigModalOpen: (open: boolean) => void;
  // Stats
  industryCounts: Record<string, number>;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const allMovies = moviesData as Movie[];

  // Modals
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);
  const [activeTrailerKey, setActiveTrailerKey] = useState<string | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);

  // Filters
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType | 'All'>('All');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('trending');
  const [selectedMood, setSelectedMood] = useState<string>('All');

  // User activity state
  const [ratings, setRatings] = useState<Record<string, UserRating>>(() => {
    const saved = localStorage.getItem('cineai_ratings');
    return saved ? JSON.parse(saved) : {};
  });

  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    const saved = localStorage.getItem('cineai_watchlist');
    return saved ? JSON.parse(saved) : [
      { movieId: 'hw-0005', addedAt: new Date().toISOString() }, // Inception
      { movieId: 'bw-0003', addedAt: new Date().toISOString() }, // 3 Idiots
      { movieId: 'tw-0001', addedAt: new Date().toISOString() }, // RRR
      { movieId: 'mr-0001', addedAt: new Date().toISOString() }, // Sairat
    ];
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('cineai_history');
    return saved ? JSON.parse(saved) : [
      { movieId: 'hw-0003', watchedAt: new Date(Date.now() - 3600000 * 24).toISOString(), progressPercent: 100 },
      { movieId: 'tw-0002', watchedAt: new Date(Date.now() - 3600000 * 48).toISOString(), progressPercent: 85 },
      { movieId: 'mr-0003', watchedAt: new Date(Date.now() - 3600000 * 72).toISOString(), progressPercent: 100 },
    ];
  });

  // Fast movie lookup map
  const movieMap = useMemo(() => {
    const map = new Map<string, Movie>();
    allMovies.forEach(m => map.set(m.id, m));
    return map;
  }, [allMovies]);

  // Industry counts
  const industryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: allMovies.length,
      Hollywood: 0,
      Bollywood: 0,
      Tollywood: 0,
      Marathi: 0,
    };
    allMovies.forEach(m => {
      counts[m.industry] = (counts[m.industry] || 0) + 1;
    });
    return counts;
  }, [allMovies]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('cineai_ratings', JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem('cineai_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('cineai_history', JSON.stringify(history));
  }, [history]);

  // Sync with Supabase if user is logged in
  useEffect(() => {
    const client = supabase;
    if (!user || !client) return;

    const fetchSupabaseUserData = async () => {
      try {
        // Fetch ratings
        const { data: remoteRatings } = await client
          .from('ratings')
          .select('movie_id, rating, review, updated_at')
          .eq('user_id', user.id);

        if (remoteRatings && remoteRatings.length > 0) {
          const ratingMap: Record<string, UserRating> = {};
          remoteRatings.forEach((r: any) => {
            ratingMap[r.movie_id] = {
              movieId: r.movie_id,
              rating: r.rating,
              review: r.review,
              updatedAt: r.updated_at,
            };
          });
          setRatings(prev => ({ ...prev, ...ratingMap }));
        }

        // Fetch watchlist
        const { data: remoteWatchlist } = await client
          .from('watchlist')
          .select('movie_id, added_at, watched')
          .eq('user_id', user.id);

        if (remoteWatchlist && remoteWatchlist.length > 0) {
          setWatchlist(remoteWatchlist.map((w: any) => ({
            movieId: w.movie_id,
            addedAt: w.added_at,
            watched: w.watched,
          })));
        }

        // Fetch history
        const { data: remoteHistory } = await client
          .from('history')
          .select('movie_id, watched_at, progress_percent')
          .eq('user_id', user.id)
          .order('watched_at', { ascending: false });

        if (remoteHistory && remoteHistory.length > 0) {
          setHistory(remoteHistory.map((h: any) => ({
            movieId: h.movie_id,
            watchedAt: h.watched_at,
            progressPercent: h.progress_percent,
          })));
        }
      } catch (err) {
        console.warn('Supabase sync skipped (tables may need migration):', err);
      }
    };

    fetchSupabaseUserData();
  }, [user]);

  // Rating action
  const rateMovie = async (movieId: string, rating: number, review?: string) => {
    const newRating: UserRating = {
      movieId,
      rating,
      review,
      updatedAt: new Date().toISOString(),
    };

    setRatings(prev => ({ ...prev, [movieId]: newRating }));

    if (user && supabase) {
      try {
        await supabase.from('ratings').upsert({
          user_id: user.id,
          movie_id: movieId,
          rating,
          review: review || null,
          updated_at: newRating.updatedAt,
        });
      } catch (err) {
        console.warn('Failed to save rating to Supabase', err);
      }
    }
  };

  // Watchlist action
  const toggleWatchlist = async (movieId: string) => {
    const exists = watchlist.some(w => w.movieId === movieId);
    const updated = exists
      ? watchlist.filter(w => w.movieId !== movieId)
      : [{ movieId, addedAt: new Date().toISOString() }, ...watchlist];

    setWatchlist(updated);

    if (user && supabase) {
      try {
        if (exists) {
          await supabase.from('watchlist').delete().match({ user_id: user.id, movie_id: movieId });
        } else {
          await supabase.from('watchlist').insert({
            user_id: user.id,
            movie_id: movieId,
            added_at: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.warn('Failed to sync watchlist to Supabase', err);
      }
    }
  };

  const isInWatchlist = (movieId: string) => watchlist.some(w => w.movieId === movieId);

  // History action
  const addToHistory = async (movieId: string) => {
    const newItem: HistoryItem = {
      movieId,
      watchedAt: new Date().toISOString(),
      progressPercent: 100,
    };
    const updated = [newItem, ...history.filter(h => h.movieId !== movieId)].slice(0, 50);
    setHistory(updated);

    if (user && supabase) {
      try {
        await supabase.from('history').upsert({
          user_id: user.id,
          movie_id: movieId,
          watched_at: newItem.watchedAt,
          progress_percent: 100,
        });
      } catch (err) {
        console.warn('Failed to sync history to Supabase', err);
      }
    }
  };

  const clearHistory = async () => {
    setHistory([]);
    if (user && supabase) {
      try {
        await supabase.from('history').delete().eq('user_id', user.id);
      } catch (err) {
        console.warn('Failed to clear history on Supabase', err);
      }
    }
  };

  // Genre toggle helper
  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const clearGenres = () => setSelectedGenres([]);

  // AI Personalized recommendations
  const personalizedRecommendations = useMemo(() => {
    return getPersonalizedRecommendations(
      allMovies,
      Object.values(ratings),
      watchlist,
      history,
      18
    );
  }, [allMovies, ratings, watchlist, history]);

  // Similar movies helper
  const getMovieSimilar = (movie: Movie, limit = 8) => {
    return getSimilarMovies(movie, allMovies, limit);
  };

  // Main Filtered & Sorted movies
  const filteredMovies = useMemo(() => {
    let result = allMovies;

    // 1. Industry filter
    if (selectedIndustry !== 'All') {
      result = result.filter(m => m.industry === selectedIndustry);
    }

    // 2. Genre filter (must have all selected genres)
    if (selectedGenres.length > 0) {
      result = result.filter(m => selectedGenres.every(g => m.genres.includes(g)));
    }

    // 3. Mood filter
    if (selectedMood !== 'All') {
      result = result.filter(m => m.mood === selectedMood);
    }

    // 4. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.originalTitle.toLowerCase().includes(q) ||
        m.director.toLowerCase().includes(q) ||
        m.cast.some(c => c.toLowerCase().includes(q)) ||
        m.genres.some(g => g.toLowerCase().includes(q)) ||
        m.keywords.some(k => k.includes(q))
      );
    }

    // 5. Sorting
    return [...result].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating || b.voteCount - a.voteCount;
        case 'trending':
          return b.trendingScore - a.trendingScore || b.rating - a.rating;
        case 'year_desc':
          return b.year - a.year || b.rating - a.rating;
        case 'year_asc':
          return a.year - b.year;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return b.trendingScore - a.trendingScore;
      }
    });
  }, [allMovies, selectedIndustry, selectedGenres, selectedMood, searchQuery, sortBy]);

  return (
    <MovieContext.Provider
      value={{
        movies: allMovies,
        filteredMovies,
        movieMap,
        selectedIndustry,
        setSelectedIndustry,
        selectedGenres,
        toggleGenre,
        clearGenres,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        selectedMood,
        setSelectedMood,
        ratings,
        rateMovie,
        watchlist,
        toggleWatchlist,
        isInWatchlist,
        history,
        addToHistory,
        clearHistory,
        personalizedRecommendations,
        getMovieSimilar,
        activeMovie,
        setActiveMovie,
        activeTrailerKey,
        setActiveTrailerKey,
        isAIModalOpen,
        setIsAIModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isConfigModalOpen,
        setIsConfigModalOpen,
        industryCounts,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) throw new Error('useMovies must be used within a MovieProvider');
  return context;
};
