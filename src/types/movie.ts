export type IndustryType = 'Hollywood' | 'Bollywood' | 'Tollywood' | 'Marathi';

export interface Movie {
  id: string;
  title: string;
  originalTitle: string;
  industry: IndustryType;
  language: string;
  year: number;
  genres: string[];
  director: string;
  cast: string[];
  rating: number;
  voteCount: number;
  duration: string;
  overview: string;
  poster: string;
  backdrop: string;
  trailerKey: string;
  mood: string;
  keywords: string[];
  featured?: boolean;
  trendingScore: number;
}

export interface UserRating {
  movieId: string;
  rating: number; // 1-10
  review?: string;
  updatedAt: string;
}

export interface WatchlistItem {
  movieId: string;
  addedAt: string;
  watched?: boolean;
}

export interface HistoryItem {
  movieId: string;
  watchedAt: string;
  progressPercent?: number;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  favoriteIndustries: IndustryType[];
  favoriteGenres: string[];
}

export interface AIRecommendationResult {
  movie: Movie;
  score: number;
  reason: string;
  matchHighlights: string[];
}
