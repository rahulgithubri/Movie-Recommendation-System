import React, { useState, useEffect } from 'react';
import { Play, Plus, Check, Star, ChevronRight, ChevronLeft, Info } from 'lucide-react';
import { Movie } from '../types/movie';
import { useMovies } from '../context/MovieContext';
import { generateBackdropDataUri } from '../utils/posterGenerator';

export const HeroBanner: React.FC = () => {
  const { movies, setActiveMovie, setActiveTrailerKey, toggleWatchlist, isInWatchlist, addToHistory } = useMovies();

  // Curate 6 top featured blockbusters from across industries
  const featuredPool = [
    movies.find(m => m.id === 'hw-0005') || movies[4], // Inception
    movies.find(m => m.id === 'tw-0001') || movies[2000], // RRR
    movies.find(m => m.id === 'mr-0001') || movies[3000], // Sairat
    movies.find(m => m.id === 'bw-0004') || movies[1003], // Dangal
    movies.find(m => m.id === 'tw-0003') || movies[2002], // Baahubali 2
    movies.find(m => m.id === 'hw-0008') || movies[7], // Interstellar
  ].filter(Boolean) as Movie[];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredPool.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [featuredPool.length]);

  if (featuredPool.length === 0) return null;

  const currentMovie = featuredPool[currentIndex];
  const inWatchlist = isInWatchlist(currentMovie.id);

  const handlePlayTrailer = () => {
    addToHistory(currentMovie.id);
    setActiveTrailerKey(currentMovie.trailerKey);
  };

  return (
    <section 
      aria-label="Featured Movie"
      className="relative w-full h-[400px] sm:h-[460px] md:h-[500px] overflow-hidden rounded bg-[#111111] border border-[#222222] mb-8"
    >
      {/* Background Backdrop with Cinema-Grade Black Overlays */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: currentMovie.backdrop && !currentMovie.backdrop.includes('unsplash.com') ? `url(${currentMovie.backdrop})` : `url(${generateBackdropDataUri(currentMovie)})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/75 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#000000]/85 to-transparent w-full md:w-3/4"></div>
      </div>

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-8 flex flex-col justify-end pb-8 sm:pb-10 z-10">
        
        {/* Industry & Metadata Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-2.5">
          <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-[#181818] text-white border border-[#333333]">
            {currentMovie.industry} Cinema
          </span>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-bold bg-[#181818] text-white border border-[#333333]">
            <Star className="w-3 h-3 fill-[#E50914] text-[#E50914]" />
            {currentMovie.rating} / 10
          </span>
          <span className="text-xs text-[#808080] font-medium">
            {currentMovie.year} • {currentMovie.duration} • {currentMovie.language}
          </span>
          {currentMovie.mood && (
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-sm text-[10px] bg-[#181818] text-[#A0A0A0] border border-[#282828]">
              {currentMovie.mood}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-2 max-w-3xl">
          {currentMovie.title}
        </h1>

        {/* Director & Cast */}
        <p className="text-xs text-[#808080] mb-2 max-w-2xl font-medium">
          Directed by <span className="text-[#CCCCCC] font-semibold">{currentMovie.director}</span> • Starring {currentMovie.cast.join(', ')}
        </p>

        {/* Overview */}
        <p className="text-xs sm:text-sm text-[#A0A0A0] line-clamp-2 max-w-2xl mb-5 leading-relaxed">
          {currentMovie.overview}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handlePlayTrailer}
            className="flex items-center gap-2 px-5 py-2.5 rounded bg-[#E50914] hover:bg-[#B20710] text-white font-semibold text-xs transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            Watch Trailer
          </button>

          <button
            onClick={() => toggleWatchlist(currentMovie.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded text-xs font-semibold border transition-colors ${
              inWatchlist
                ? 'bg-[#181818] text-white border-[#E50914]'
                : 'bg-[#181818] text-[#CCCCCC] hover:text-white border-[#333333] hover:bg-[#222222]'
            }`}
          >
            {inWatchlist ? <Check className="w-3.5 h-3.5 text-[#E50914]" /> : <Plus className="w-3.5 h-3.5" />}
            {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
          </button>

          <button
            onClick={() => setActiveMovie(currentMovie)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded bg-[#111111] hover:bg-[#181818] text-[#808080] hover:text-white text-xs font-semibold border border-[#282828] transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            Details & AI Matches
          </button>
        </div>

        {/* Indicator bars */}
        <div className="flex items-center gap-1.5 mt-5">
          {featuredPool.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1 rounded-sm transition-all ${
                idx === currentIndex ? 'w-6 bg-[#E50914]' : 'w-2 bg-[#333333] hover:bg-[#555555]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Manual Slideshow Arrows */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev - 1 + featuredPool.length) % featuredPool.length)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded bg-[#111111]/90 hover:bg-[#181818] text-[#808080] hover:text-white border border-[#282828] transition-colors hidden sm:block z-20"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % featuredPool.length)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded bg-[#111111]/90 hover:bg-[#181818] text-[#808080] hover:text-white border border-[#282828] transition-colors hidden sm:block z-20"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </section>
  );
};
