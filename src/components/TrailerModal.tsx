import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Search, PlayCircle } from 'lucide-react';
import { useMovies } from '../context/MovieContext';

export const TrailerModal: React.FC = () => {
  const { activeTrailerKey, setActiveTrailerKey, activeMovie } = useMovies();
  const [showFallback, setShowFallback] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Reset state when trailer changes
  useEffect(() => {
    setShowFallback(false);
    setIframeLoaded(false);
  }, [activeTrailerKey]);

  // Auto-show fallback after 8 seconds if iframe hasn't loaded
  useEffect(() => {
    if (!activeTrailerKey) return;
    const timeout = setTimeout(() => {
      if (!iframeLoaded) setShowFallback(true);
    }, 8000);
    return () => clearTimeout(timeout);
  }, [activeTrailerKey, iframeLoaded]);

  if (!activeTrailerKey) return null;

  const movieTitle = activeMovie?.title || 'Movie';
  const movieYear = activeMovie?.year ? ` ${activeMovie.year}` : '';
  const embedUrl = `https://www.youtube.com/embed/${activeTrailerKey}?autoplay=1&rel=0`;
  const watchUrl = `https://www.youtube.com/watch?v=${activeTrailerKey}`;
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(movieTitle + movieYear + ' official trailer')}`;

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#000000]/90 flex items-center justify-center p-3 sm:p-4"
      onClick={() => setActiveTrailerKey(null)}
    >
      <div 
        className="relative w-full max-w-4xl bg-[#111111] rounded border border-[#282828] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#222222] bg-[#181818]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E50914]"></span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {movieTitle} — Trailer
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded text-[#808080] hover:text-white hover:bg-[#222222] text-xs flex items-center gap-1 transition-colors"
              title="Open on YouTube"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[10px]">YouTube</span>
            </a>
            <a
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded text-[#808080] hover:text-white hover:bg-[#222222] text-xs flex items-center gap-1 transition-colors"
              title="Search trailer on YouTube"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[10px]">Search</span>
            </a>
            <button
              onClick={() => setActiveTrailerKey(null)}
              aria-label="Close trailer"
              className="p-1.5 rounded text-[#808080] hover:text-white hover:bg-[#222222] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black">
          {!showFallback ? (
            <iframe
              src={embedUrl}
              title="Movie Trailer"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setIframeLoaded(true)}
            />
          ) : null}
          
          {/* Fallback overlay — shown after timeout or on error */}
          {showFallback && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#111111] gap-4 p-6">
              <PlayCircle className="w-16 h-16 text-[#333333]" />
              <div className="text-center">
                <p className="text-white font-semibold text-sm mb-1">{movieTitle}</p>
                <p className="text-[#808080] text-xs mb-4">Official trailer not available in embedded player</p>
              </div>
              <div className="flex gap-3">
                <a
                  href={searchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded bg-[#E50914] hover:bg-[#B20710] text-white text-xs font-semibold transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                  Search Trailer on YouTube
                </a>
                <a
                  href={watchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded bg-[#181818] hover:bg-[#222222] text-white text-xs font-semibold border border-[#333333] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open YouTube Link
                </a>
              </div>
              <button
                onClick={() => setShowFallback(false)}
                className="text-[#808080] hover:text-white text-xs underline transition-colors"
              >
                Try playing anyway
              </button>
            </div>
          )}
        </div>

        {/* Footer: Quick search link always visible */}
        <div className="px-4 py-2 bg-[#181818] border-t border-[#222222] flex items-center justify-between">
          <span className="text-[10px] text-[#808080]">
            If trailer doesn't load, use Search on YouTube
          </span>
          <a
            href={searchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-[#E50914] hover:text-white transition-colors flex items-center gap-1"
          >
            <Search className="w-3 h-3" />
            Find "{movieTitle}" trailer
          </a>
        </div>
      </div>
    </div>
  );
};
