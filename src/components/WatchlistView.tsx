import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { MovieCard } from './MovieCard';
import { IndustryType } from '../types/movie';

export const WatchlistView: React.FC<{ onExploreClick: () => void }> = ({ onExploreClick }) => {
  const { watchlist, movieMap } = useMovies();
  const [industryFilter, setIndustryFilter] = useState<IndustryType | 'All'>('All');

  const watchlistMovies = watchlist
    .map(w => ({ ...w, movie: movieMap.get(w.movieId) }))
    .filter(item => item.movie !== undefined)
    .filter(item => industryFilter === 'All' || item.movie?.industry === industryFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222222] pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded bg-[#181818] text-[#E50914] border border-[#282828]">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">Your Watchlist</h1>
            <p className="text-xs text-[#808080]">
              {watchlist.length} {watchlist.length === 1 ? 'title saved' : 'titles saved for later'}
            </p>
          </div>
        </div>

        {/* Industry Filter for Watchlist */}
        <div className="flex items-center gap-1 bg-[#111111] p-1 rounded border border-[#222222] text-xs">
          {(['All', 'Hollywood', 'Bollywood', 'Tollywood', 'Marathi'] as const).map(ind => (
            <button
              key={ind}
              onClick={() => setIndustryFilter(ind)}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                industryFilter === ind
                  ? 'bg-[#E50914] text-white'
                  : 'text-[#808080] hover:text-white hover:bg-[#181818]'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {watchlistMovies.length === 0 ? (
        <div className="text-center py-16 px-4 bg-[#111111] rounded border border-[#222222] my-6">
          <Bookmark className="w-10 h-10 text-[#404040] mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Your Watchlist is empty</h3>
          <p className="text-xs text-[#808080] max-w-sm mx-auto mb-4">
            Browse across Hollywood, Bollywood, Tollywood, and Marathi titles and click "+" to add them.
          </p>
          <button
            onClick={onExploreClick}
            className="px-4 py-2 rounded bg-[#E50914] hover:bg-[#B20710] text-white font-semibold text-xs transition-colors"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {watchlistMovies.map(({ movie }) => (
            movie && <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};
