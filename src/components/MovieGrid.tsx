import React, { useState, useEffect } from 'react';
import { Film, ChevronDown } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { MovieCard } from './MovieCard';

export const MovieGrid: React.FC = () => {
  const { filteredMovies } = useMovies();
  const [visibleCount, setVisibleCount] = useState<number>(24);

  // Reset pagination when filter results change
  useEffect(() => {
    setVisibleCount(24);
  }, [filteredMovies]);

  const displayedMovies = filteredMovies.slice(0, visibleCount);
  const hasMore = visibleCount < filteredMovies.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 24);
  };

  if (filteredMovies.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-[#111111] rounded border border-[#222222] my-6">
        <Film className="w-10 h-10 text-[#404040] mx-auto mb-3" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">No matching titles</h3>
        <p className="text-xs text-[#808080] max-w-sm mx-auto">
          Try adjusting your search query, mood, or genre filters to explore the catalog.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {displayedMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex flex-col items-center justify-center pt-2 pb-6">
          <p className="text-xs text-[#808080] mb-3 font-mono">
            Showing {displayedMovies.length} of {filteredMovies.length.toLocaleString()} titles
          </p>
          <button
            onClick={handleLoadMore}
            className="flex items-center gap-2 px-6 py-2.5 rounded bg-[#181818] hover:bg-[#222222] text-white text-xs font-semibold border border-[#333333] hover:border-[#E50914] transition-colors"
          >
            <span>Load More ({Math.min(24, filteredMovies.length - displayedMovies.length)} Movies)</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#E50914]" />
          </button>
        </div>
      )}
    </div>
  );
};
