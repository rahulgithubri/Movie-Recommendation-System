import React from 'react';
import { Play, Plus, Check, Star } from 'lucide-react';
import { Movie } from '../types/movie';
import { useMovies } from '../context/MovieContext';
import { PosterImage } from './PosterImage';

interface MovieCardProps {
  movie: Movie;
  aiScore?: number;
  aiReason?: string;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, aiScore, aiReason }) => {
  const { setActiveMovie, setActiveTrailerKey, toggleWatchlist, isInWatchlist, ratings, addToHistory } = useMovies();

  const inWatchlist = isInWatchlist(movie.id);
  const userRating = ratings[movie.id]?.rating;

  const handleCardClick = () => {
    setActiveMovie(movie);
  };

  const handlePlayTrailer = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToHistory(movie.id);
    setActiveTrailerKey(movie.trailerKey);
  };

  const handleToggleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWatchlist(movie.id);
  };

  return (
    <article 
      onClick={handleCardClick}
      className="group relative flex flex-col bg-[#181818] rounded border border-[#282828] hover:border-[#404040] hover:border-b-[#E50914] transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#111111]">
        <PosterImage
          movie={movie}
          type="poster"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1 pointer-events-none z-10">
          <span className="px-1.5 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider bg-[#000000]/90 text-white border border-[#333333]">
            {movie.industry}
          </span>
          <div className="flex items-center gap-1">
            {aiScore !== undefined && (
              <span className="px-1.5 py-0.5 rounded-sm bg-[#E50914] text-white text-[9px] font-bold">
                {aiScore}% Match
              </span>
            )}
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-sm bg-[#000000]/90 text-white text-[10px] font-semibold border border-[#333333]">
              <Star className="w-2.5 h-2.5 fill-[#E50914] text-[#E50914]" />
              {movie.rating}
            </span>
          </div>
        </div>

        {/* User Rating Tag */}
        {userRating && (
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-sm bg-[#000000]/90 text-white border border-[#E50914] font-bold text-[10px] flex items-center gap-1 z-10">
            <Star className="w-2.5 h-2.5 fill-[#E50914] text-[#E50914]" />
            You: {userRating}/10
          </div>
        )}

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-[#000000]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 z-20">
          <button
            onClick={handlePlayTrailer}
            className="p-2.5 rounded bg-[#E50914] hover:bg-[#B20710] text-white shadow transition-colors"
            title="Play Trailer"
          >
            <Play className="w-4 h-4 fill-white" />
          </button>
          <button
            onClick={handleToggleWatchlist}
            className={`p-2.5 rounded text-white border transition-colors ${
              inWatchlist
                ? 'bg-[#181818] border-[#E50914] text-[#E50914]'
                : 'bg-[#181818] border-[#333333] hover:bg-[#282828]'
            }`}
            title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            {inWatchlist ? <Check className="w-4 h-4 text-[#E50914]" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-3 flex flex-col flex-1 justify-between gap-2">
        <div>
          <div className="flex items-center justify-between text-[10px] text-[#808080] mb-0.5 font-medium">
            <span>{movie.year}</span>
            <span>{movie.duration}</span>
          </div>
          <h3 className="font-semibold text-xs sm:text-sm text-white group-hover:text-[#E50914] transition-colors truncate" title={movie.title}>
            {movie.title}
          </h3>
          <p className="text-[11px] text-[#808080] truncate mt-0.5">
            {movie.director} • {movie.cast.slice(0, 2).join(', ')}
          </p>
        </div>

        {/* Genres & AI Reason */}
        <div>
          <div className="flex flex-wrap gap-1">
            {movie.genres.slice(0, 2).map(g => (
              <span key={g} className="text-[9px] px-1.5 py-0.5 rounded-sm bg-[#111111] text-[#808080] border border-[#282828]">
                {g}
              </span>
            ))}
            {movie.genres.length > 2 && (
              <span className="text-[9px] px-1 py-0.5 text-[#666666]">
                +{movie.genres.length - 2}
              </span>
            )}
          </div>

          {aiReason && (
            <p className="text-[10px] text-[#808080] italic truncate mt-1 border-t border-[#222222] pt-1">
              {aiReason}
            </p>
          )}
        </div>
      </div>
    </article>
  );
};
