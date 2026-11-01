import React from 'react';
import { History, Trash2, Clock } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { MovieCard } from './MovieCard';

export const HistoryView: React.FC<{ onExploreClick: () => void }> = ({ onExploreClick }) => {
  const { history, movieMap, clearHistory } = useMovies();

  const historyMovies = history
    .map(h => ({ ...h, movie: movieMap.get(h.movieId) }))
    .filter(item => item.movie !== undefined);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#222222] pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded bg-[#181818] text-[#E50914] border border-[#282828]">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">Watch History</h1>
            <p className="text-xs text-[#808080]">
              Titles you've explored or trailers you've streamed ({history.length})
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#181818] hover:bg-[#222222] text-[#808080] hover:text-[#E50914] text-xs font-semibold border border-[#282828] transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear History
          </button>
        )}
      </div>

      {historyMovies.length === 0 ? (
        <div className="text-center py-16 px-4 bg-[#111111] rounded border border-[#222222] my-6">
          <History className="w-10 h-10 text-[#404040] mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">No watch history</h3>
          <p className="text-xs text-[#808080] max-w-sm mx-auto mb-4">
            When you watch trailers or explore movies, they'll appear here for quick access.
          </p>
          <button
            onClick={onExploreClick}
            className="px-4 py-2 rounded bg-[#E50914] hover:bg-[#B20710] text-white font-semibold text-xs transition-colors"
          >
            Browse Movies
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {historyMovies.map(({ movie, watchedAt }) => (
            movie && (
              <div key={movie.id} className="relative group">
                <MovieCard movie={movie} />
                <div className="mt-1 flex items-center gap-1 text-[10px] text-[#808080] font-mono">
                  <Clock className="w-3 h-3 text-[#666666]" />
                  <span>{formatDate(watchedAt)}</span>
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};
