import React from 'react';
import { Star, Award, MessageSquare } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { MovieCard } from './MovieCard';

export const RatingsView: React.FC<{ onExploreClick: () => void }> = ({ onExploreClick }) => {
  const { ratings, movieMap } = useMovies();

  const ratedList = Object.values(ratings)
    .map(r => ({ ...r, movie: movieMap.get(r.movieId) }))
    .filter(item => item.movie !== undefined)
    .sort((a, b) => b.rating - a.rating);

  const averageScore = ratedList.length > 0
    ? (ratedList.reduce((acc, curr) => acc + curr.rating, 0) / ratedList.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222222] pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded bg-[#181818] text-[#E50914] border border-[#282828]">
            <Star className="w-5 h-5 fill-[#E50914]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">Your Ratings</h1>
            <p className="text-xs text-[#808080]">
              Personal scores train the Movieflix recommendation engine
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2">
          <div className="bg-[#181818] border border-[#282828] px-3.5 py-2 rounded text-center">
            <p className="text-[10px] uppercase font-bold text-[#808080]">Total Rated</p>
            <p className="text-sm font-bold text-white font-mono">{ratedList.length}</p>
          </div>
          <div className="bg-[#181818] border border-[#282828] px-3.5 py-2 rounded text-center">
            <p className="text-[10px] uppercase font-bold text-[#808080]">Average Score</p>
            <p className="text-sm font-bold text-white font-mono flex items-center justify-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#E50914] text-[#E50914]" />
              {averageScore}
            </p>
          </div>
        </div>
      </div>

      {ratedList.length === 0 ? (
        <div className="text-center py-16 px-4 bg-[#111111] rounded border border-[#222222] my-6">
          <Award className="w-10 h-10 text-[#404040] mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">No ratings recorded</h3>
          <p className="text-xs text-[#808080] max-w-sm mx-auto mb-4">
            Select any title in the catalog to submit your 1 to 10 star rating.
          </p>
          <button
            onClick={onExploreClick}
            className="px-4 py-2 rounded bg-[#E50914] hover:bg-[#B20710] text-white font-semibold text-xs transition-colors"
          >
            Start Rating
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {ratedList.map(({ movie, rating, review }) => (
            movie && (
              <div key={movie.id} className="relative flex flex-col">
                <MovieCard movie={movie} />
                {review && (
                  <div className="mt-1.5 p-2 bg-[#111111] border border-[#282828] rounded text-[11px] text-[#CCCCCC] flex items-start gap-1.5">
                    <MessageSquare className="w-3 h-3 text-[#E50914] flex-shrink-0 mt-0.5" />
                    <p className="line-clamp-2 italic">"{review}"</p>
                  </div>
                )}
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};
