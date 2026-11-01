import { Movie, UserRating, WatchlistItem, HistoryItem, AIRecommendationResult, IndustryType } from '../types/movie';

// Calculate similarity between two movies
export function calculateMovieSimilarity(m1: Movie, m2: Movie): { score: number; reasons: string[] } {
  if (m1.id === m2.id) return { score: 1.0, reasons: ['Same movie'] };

  let score = 0;
  const reasons: string[] = [];

  // 1. Industry match
  if (m1.industry === m2.industry) {
    score += 0.10;
  }

  // 2. Genre overlap (Jaccard similarity)
  const g1 = new Set(m1.genres);
  const g2 = new Set(m2.genres);
  const commonGenres = m1.genres.filter(g => g2.has(g));
  const unionGenres = new Set([...m1.genres, ...m2.genres]);
  const genreSim = commonGenres.length / unionGenres.size;
  score += genreSim * 0.35;
  if (commonGenres.length > 0) {
    reasons.push(`Shares genres: ${commonGenres.join(', ')}`);
  }

  // 3. Director match
  if (m1.director.toLowerCase() === m2.director.toLowerCase()) {
    score += 0.25;
    reasons.push(`Both directed by ${m1.director}`);
  }

  // 4. Cast overlap
  const c2 = new Set(m2.cast.map(c => c.toLowerCase()));
  const commonCast = m1.cast.filter(c => c2.has(c.toLowerCase()));
  if (commonCast.length > 0) {
    score += (commonCast.length / Math.max(m1.cast.length, m2.cast.length)) * 0.20;
    reasons.push(`Stars: ${commonCast.join(', ')}`);
  }

  // 5. Mood match
  if (m1.mood && m2.mood && m1.mood.toLowerCase() === m2.mood.toLowerCase()) {
    score += 0.10;
    reasons.push(`Similar mood: ${m1.mood}`);
  }

  // 6. Era proximity (e.g., within 5-8 years)
  const yearDiff = Math.abs(m1.year - m2.year);
  if (yearDiff <= 3) {
    score += 0.05;
  } else if (yearDiff <= 8) {
    score += 0.02;
  }

  return { score: Math.min(1.0, score), reasons };
}

// Get top similar movies for a given movie
export function getSimilarMovies(targetMovie: Movie, allMovies: Movie[], limit = 10, sameIndustryOnly = false): AIRecommendationResult[] {
  const candidates = allMovies.filter(m => m.id !== targetMovie.id && (!sameIndustryOnly || m.industry === targetMovie.industry));

  const scored = candidates.map(movie => {
    const { score, reasons } = calculateMovieSimilarity(targetMovie, movie);
    return {
      movie,
      score: Math.round(score * 100),
      reason: reasons.length > 0 ? reasons.slice(0, 2).join(' • ') : `Popular in ${movie.industry}`,
      matchHighlights: reasons
    };
  });

  return scored
    .sort((a, b) => b.score - a.score || b.movie.rating - a.movie.rating)
    .slice(0, limit);
}

// Build user taste profile based on ratings, watchlist, and history
export function getPersonalizedRecommendations(
  allMovies: Movie[],
  ratings: UserRating[],
  watchlist: WatchlistItem[],
  history: HistoryItem[],
  limit = 20
): AIRecommendationResult[] {
  if (ratings.length === 0 && watchlist.length === 0 && history.length === 0) {
    // Cold start: return top-rated trending movies across all 4 industries
    return allMovies
      .filter(m => m.rating >= 8.0)
      .sort((a, b) => b.trendingScore - a.trendingScore || b.rating - a.rating)
      .slice(0, limit)
      .map(movie => ({
        movie,
        score: Math.round(movie.rating * 10),
        reason: `Critically acclaimed ${movie.industry} masterpiece (${movie.rating}/10)`,
        matchHighlights: [`High rating: ${movie.rating}`, movie.mood, ...movie.genres]
      }));
  }

  // Compute genre and industry weights
  const genreWeights: Record<string, number> = {};
  const industryWeights: Record<string, number> = {};
  const directorWeights: Record<string, number> = {};
  const castWeights: Record<string, number> = {};

  const movieMap = new Map<string, Movie>(allMovies.map(m => [m.id, m]));
  const seenIds = new Set<string>();

  // Factor ratings (highest signal)
  ratings.forEach(r => {
    const m = movieMap.get(r.movieId);
    if (!m) return;
    seenIds.add(m.id);
    const weight = (r.rating - 5) * 1.5; // positive for >=6, negative for <=4

    m.genres.forEach(g => { genreWeights[g] = (genreWeights[g] || 0) + weight; });
    industryWeights[m.industry] = (industryWeights[m.industry] || 0) + weight;
    directorWeights[m.director] = (directorWeights[m.director] || 0) + weight * 1.2;
    m.cast.forEach(c => { castWeights[c] = (castWeights[c] || 0) + weight * 0.8; });
  });

  // Factor watchlist (medium positive signal)
  watchlist.forEach(w => {
    const m = movieMap.get(w.movieId);
    if (!m) return;
    m.genres.forEach(g => { genreWeights[g] = (genreWeights[g] || 0) + 1.2; });
    industryWeights[m.industry] = (industryWeights[m.industry] || 0) + 1.5;
  });

  // Factor history (recent positive engagement)
  history.forEach(h => {
    const m = movieMap.get(h.movieId);
    if (!m) return;
    seenIds.add(m.id);
    m.genres.forEach(g => { genreWeights[g] = (genreWeights[g] || 0) + 0.8; });
    industryWeights[m.industry] = (industryWeights[m.industry] || 0) + 1.0;
  });

  // Score candidate movies not already watched
  const candidates = allMovies.filter(m => !seenIds.has(m.id));

  const scored = candidates.map(movie => {
    let score = 0;
    const highlights: string[] = [];

    // Genre scoring
    let genreScore = 0;
    movie.genres.forEach(g => {
      if (genreWeights[g]) {
        genreScore += genreWeights[g];
        if (genreWeights[g] > 1) highlights.push(`Matches your love for ${g}`);
      }
    });
    score += Math.max(0, genreScore * 1.5);

    // Industry affinity
    if (industryWeights[movie.industry]) {
      score += Math.max(0, industryWeights[movie.industry] * 1.2);
    }

    // Director affinity
    if (directorWeights[movie.director]) {
      score += Math.max(0, directorWeights[movie.director] * 2.5);
      highlights.push(`From director you enjoy: ${movie.director}`);
    }

    // Cast affinity
    movie.cast.forEach(c => {
      if (castWeights[c]) {
        score += Math.max(0, castWeights[c] * 1.8);
        highlights.push(`Features ${c}`);
      }
    });

    // Base quality boost
    score += (movie.rating - 6.0) * 3;

    const normalizedScore = Math.min(99, Math.max(50, Math.round(50 + score * 1.8)));

    const topReason = highlights.length > 0 
      ? highlights[0] 
      : `Top-rated pick in ${movie.industry} (${movie.rating} ★)`;

    return {
      movie,
      score: normalizedScore,
      reason: topReason,
      matchHighlights: highlights
    };
  });

  return scored
    .sort((a, b) => b.score - a.score || b.movie.rating - a.movie.rating)
    .slice(0, limit);
}

// Natural Language AI Query Parser ("Ask Movieflix")
export function parseAIRecommendationQuery(query: string, allMovies: Movie[], limit = 16): AIRecommendationResult[] {
  const clean = query.toLowerCase().trim();
  if (!clean) return [];

  // Detect industry
  let targetIndustry: IndustryType | null = null;
  if (clean.includes('hollywood') || clean.includes('english') || clean.includes('american')) targetIndustry = 'Hollywood';
  else if (clean.includes('bollywood') || clean.includes('hindi')) targetIndustry = 'Bollywood';
  else if (clean.includes('tollywood') || clean.includes('telugu')) targetIndustry = 'Tollywood';
  else if (clean.includes('marathi')) targetIndustry = 'Marathi';

  // Detect decades
  let minYear = 0;
  let maxYear = 9999;
  if (clean.includes('90s') || clean.includes('1990s')) { minYear = 1990; maxYear = 1999; }
  else if (clean.includes('80s') || clean.includes('1980s')) { minYear = 1980; maxYear = 1989; }
  else if (clean.includes('70s') || clean.includes('1970s')) { minYear = 1970; maxYear = 1979; }
  else if (clean.includes('2000s') || clean.includes('00s')) { minYear = 2000; maxYear = 2009; }
  else if (clean.includes('2010s') || clean.includes('recent')) { minYear = 2010; maxYear = 2026; }
  else if (clean.includes('classic') || clean.includes('old')) { minYear = 1970; maxYear = 2005; }

  // Detect moods/themes
  const queryTokens = clean.split(/\s+/).filter(t => t.length > 2);

  // Score movies
  const scored = allMovies.map(movie => {
    let score = 0;
    const highlights: string[] = [];

    // Industry constraint
    if (targetIndustry) {
      if (movie.industry === targetIndustry) {
        score += 35;
        highlights.push(`${targetIndustry} cinema`);
      } else {
        score -= 40;
      }
    }

    // Year constraint
    if (minYear > 0 && maxYear < 9999) {
      if (movie.year >= minYear && movie.year <= maxYear) {
        score += 20;
        highlights.push(`Released in ${movie.year}`);
      }
    }

    // Title exact/partial match
    if (clean.includes(movie.title.toLowerCase()) || movie.title.toLowerCase().includes(clean)) {
      score += 60;
      highlights.push(`Title match: ${movie.title}`);
    }

    // Director match
    if (clean.includes(movie.director.toLowerCase())) {
      score += 45;
      highlights.push(`Director: ${movie.director}`);
    }

    // Cast matches
    movie.cast.forEach(actor => {
      const actorLower = actor.toLowerCase();
      const parts = actorLower.split(' ');
      if (clean.includes(actorLower) || parts.some(p => p.length > 3 && clean.includes(p))) {
        score += 35;
        highlights.push(`Starring ${actor}`);
      }
    });

    // Genre matches
    movie.genres.forEach(genre => {
      const gLower = genre.toLowerCase();
      if (clean.includes(gLower) || (gLower === 'sci-fi' && (clean.includes('scifi') || clean.includes('science fiction')))) {
        score += 25;
        highlights.push(`Genre: ${genre}`);
      }
    });

    // Mood match
    if (movie.mood && clean.includes(movie.mood.toLowerCase())) {
      score += 20;
      highlights.push(`Mood: ${movie.mood}`);
    }

    // Keywords & overview tokens
    queryTokens.forEach(token => {
      if (['like', 'movie', 'movies', 'film', 'films', 'want', 'show', 'recommend', 'good', 'best', 'watch'].includes(token)) return;

      if (movie.keywords.some(k => k.includes(token))) {
        score += 8;
      }
      if (movie.overview.toLowerCase().includes(token)) {
        score += 5;
      }
    });

    // Rating quality modifier
    score += (movie.rating - 6.0) * 2.0;

    const finalScore = Math.min(100, Math.max(10, Math.round(score)));

    return {
      movie,
      score: finalScore,
      reason: highlights.length > 0 ? highlights.join(' • ') : `Matches themes from "${query}"`,
      matchHighlights: highlights
    };
  });

  return scored
    .filter(item => item.score >= 35)
    .sort((a, b) => b.score - a.score || b.movie.rating - a.movie.rating)
    .slice(0, limit);
}
