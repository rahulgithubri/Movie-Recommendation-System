import React, { useState } from 'react';
import { X, Play, Plus, Check, Star, Sparkles, Calendar, Clock } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { MovieCard } from './MovieCard';

export const MovieModal: React.FC = () => {
  const { 
    activeMovie, 
    setActiveMovie, 
    setActiveTrailerKey, 
    toggleWatchlist, 
    isInWatchlist, 
    ratings, 
    rateMovie, 
    getMovieSimilar,
    addToHistory
  } = useMovies();

  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState<string>('');
  const [showReviewInput, setShowReviewInput] = useState<boolean>(false);

  if (!activeMovie) return null;

  const inWatchlist = isInWatchlist(activeMovie.id);
  const currentRating = ratings[activeMovie.id]?.rating || 0;
  const currentReview = ratings[activeMovie.id]?.review || '';
  const similarMovies = getMovieSimilar(activeMovie, 6);

  const handleRate = async (star: number) => {
    await rateMovie(activeMovie.id, star, reviewText || currentReview);
  };

  const handlePlayTrailer = () => {
    addToHistory(activeMovie.id);
    setActiveTrailerKey(activeMovie.trailerKey);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-[#000000]/85 flex items-center justify-center p-3 sm:p-6"
      onClick={() => setActiveMovie(null)}
    >
      <div 
        className="relative w-full max-w-4xl bg-[#111111] rounded border border-[#282828] shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setActiveMovie(null)}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 p-2 rounded bg-[#000000]/80 hover:bg-[#181818] text-[#808080] hover:text-white border border-[#333333] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Scrollable Container */}
        <div className="overflow-y-auto">
          {/* Hero Backdrop Header */}
          <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-[#000000]">
            <img
              src={activeMovie.backdrop}
              alt={activeMovie.title}
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/70 to-transparent"></div>

            {/* Quick Play Trailer on backdrop */}
            <button
              onClick={handlePlayTrailer}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2.5 px-5 py-3 rounded bg-[#E50914] hover:bg-[#B20710] text-white font-semibold text-xs shadow-xl transition-colors"
            >
              <Play className="w-4 h-4 fill-white" />
              Watch Trailer
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 -mt-20 relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              
              {/* Poster Thumbnail */}
              <div className="w-32 sm:w-40 aspect-[2/3] rounded overflow-hidden border border-[#333333] bg-[#000000] flex-shrink-0 shadow-lg">
                <img
                  src={activeMovie.poster}
                  alt={activeMovie.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info and Actions */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-[#181818] text-white border border-[#333333]">
                    {activeMovie.industry} Cinema
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-bold bg-[#181818] text-white border border-[#333333]">
                    <Star className="w-3 h-3 fill-[#E50914] text-[#E50914]" />
                    {activeMovie.rating} / 10 ({activeMovie.voteCount.toLocaleString()} votes)
                  </span>
                  <span className="text-xs text-[#808080] flex items-center gap-1 font-medium">
                    <Calendar className="w-3 h-3" /> {activeMovie.year}
                  </span>
                  <span className="text-xs text-[#808080] flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3" /> {activeMovie.duration}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {activeMovie.title}
                </h2>
                {activeMovie.originalTitle && activeMovie.originalTitle !== activeMovie.title && (
                  <p className="text-xs text-[#808080] italic">
                    Original Title: {activeMovie.originalTitle}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <button
                    onClick={handlePlayTrailer}
                    className="flex items-center gap-2 px-4 py-2 rounded bg-[#E50914] hover:bg-[#B20710] text-white font-semibold text-xs transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    Play Trailer
                  </button>
                  <button
                    onClick={() => toggleWatchlist(activeMovie.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold border transition-colors ${
                      inWatchlist
                        ? 'bg-[#181818] text-white border-[#E50914]'
                        : 'bg-[#181818] text-[#CCCCCC] hover:text-white border-[#333333] hover:bg-[#222222]'
                    }`}
                  >
                    {inWatchlist ? <Check className="w-3.5 h-3.5 text-[#E50914]" /> : <Plus className="w-3.5 h-3.5" />}
                    {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                  </button>
                </div>

                {/* 10-Star Interactive Rating Widget */}
                <div className="pt-3 border-t border-[#222222]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-white">
                      Your Rating: {currentRating > 0 ? `${currentRating} / 10 Stars` : 'Rate this movie'}
                    </span>
                    {currentRating > 0 && (
                      <button
                        onClick={() => setShowReviewInput(!showReviewInput)}
                        className="text-xs text-[#E50914] hover:underline font-medium"
                      >
                        {showReviewInput ? 'Cancel Review' : currentReview ? 'Edit Review' : 'Add Written Review'}
                      </button>
                    )}
                  </div>

                  {/* 10-Star Selector */}
                  <div className="flex items-center gap-1 flex-wrap">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => {
                      const isFilled = (hoverRating !== null ? hoverRating : currentRating) >= star;
                      return (
                        <button
                          key={star}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => handleRate(star)}
                          className="p-1 rounded hover:scale-110 transition-transform"
                          title={`Rate ${star}/10`}
                        >
                          <Star
                            className={`w-4 h-4 transition-colors ${
                              isFilled
                                ? 'fill-[#E50914] text-[#E50914]'
                                : 'text-[#333333] hover:text-[#666666]'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  {/* Review Input */}
                  {showReviewInput && (
                    <div className="mt-2 space-y-2">
                      <textarea
                        value={reviewText || currentReview}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your personal review..."
                        className="w-full bg-[#181818] border border-[#282828] rounded p-2.5 text-xs text-white placeholder-[#808080] focus:outline-none focus:border-[#E50914]"
                        rows={2}
                      />
                      <button
                        onClick={() => {
                          handleRate(currentRating || 8);
                          setShowReviewInput(false);
                        }}
                        className="px-3 py-1.5 rounded bg-[#E50914] hover:bg-[#B20710] text-white text-xs font-semibold"
                      >
                        Save Review
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Synopsis */}
            <div className="space-y-1.5 border-t border-[#222222] pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#808080]">Story Overview</h3>
              <p className="text-sm text-[#CCCCCC] leading-relaxed">
                {activeMovie.overview}
              </p>
            </div>

            {/* Cast & Director */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#222222] pt-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#808080] mb-1.5">Director</h4>
                <p className="text-xs font-semibold text-white bg-[#181818] px-3 py-1.5 rounded border border-[#282828] inline-block">
                  {activeMovie.director}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#808080] mb-1.5">Leading Cast</h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeMovie.cast.map(c => (
                    <span key={c} className="text-xs bg-[#181818] px-2.5 py-1 rounded text-[#CCCCCC] border border-[#282828]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Thematic Tags */}
            <div className="space-y-1.5 border-t border-[#222222] pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#808080]">Genres & Thematic Keywords</h4>
              <div className="flex flex-wrap gap-1.5">
                {activeMovie.genres.map(g => (
                  <span key={g} className="text-[11px] font-semibold bg-[#181818] text-[#CCCCCC] border border-[#333333] px-2.5 py-0.5 rounded-sm">
                    {g}
                  </span>
                ))}
                <span className="text-[11px] font-semibold bg-[#181818] text-[#CCCCCC] border border-[#333333] px-2.5 py-0.5 rounded-sm">
                  Mood: {activeMovie.mood}
                </span>
                {activeMovie.keywords.slice(0, 5).map(k => (
                  <span key={k} className="text-[11px] bg-[#111111] text-[#808080] border border-[#222222] px-2 py-0.5 rounded-sm">
                    #{k}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Recommended: More Like This */}
            <div className="pt-4 border-t border-[#222222]">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#E50914]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  More Like <span className="text-[#E50914]">{activeMovie.title}</span>
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 sm:gap-3">
                {similarMovies.map(({ movie, score, reason }) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    aiScore={score}
                    aiReason={reason}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
