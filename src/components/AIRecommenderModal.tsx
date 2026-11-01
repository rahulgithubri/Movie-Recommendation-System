import React, { useState } from 'react';
import { Sparkles, X, Send, Film, ThumbsUp } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { parseAIRecommendationQuery } from '../services/aiRecommender';
import { AIRecommendationResult } from '../types/movie';
import { MovieCard } from './MovieCard';

export const AIRecommenderModal: React.FC = () => {
  const { isAIModalOpen, setIsAIModalOpen, movies, personalizedRecommendations } = useMovies();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AIRecommendationResult[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  if (!isAIModalOpen) return null;

  const quickPrompts = [
    "Marathi comedy with Laxmikant Berde or Ashok Saraf",
    "Mind-bending Hollywood sci-fi like Interstellar or Inception",
    "High-octane Tollywood mass action like RRR or Pushpa",
    "Romantic 90s Bollywood drama with melodious vibe",
    "Historical Marathi epic like Pawankhind or Subhedar",
    "Inspiring sports drama directed by Nitesh Tiwari"
  ];

  const handleSearch = (textToSearch?: string) => {
    const q = textToSearch || query;
    if (!q.trim()) return;

    setIsSearching(true);
    setTimeout(() => {
      const found = parseAIRecommendationQuery(q, movies, 12);
      setResults(found);
      setIsSearching(false);
    }, 200);
  };

  const handlePromptClick = (prompt: string) => {
    setQuery(prompt);
    handleSearch(prompt);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#000000]/85 flex items-center justify-center p-3 sm:p-6"
      onClick={() => setIsAIModalOpen(false)}
    >
      <div 
        className="relative w-full max-w-4xl bg-[#111111] border border-[#282828] rounded shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#222222] bg-[#181818]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#E50914] text-white flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                Ask Movieflix Recommender
                <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-[#111111] text-[#808080] border border-[#282828]">
                  Natural Language Engine
                </span>
              </h2>
              <p className="text-[11px] text-[#808080]">
                Search across all 4,000 films by mood, director, actors, theme, or era
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAIModalOpen(false)}
            aria-label="Close modal"
            className="p-1.5 rounded text-[#808080] hover:text-white hover:bg-[#222222] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input & Quick Prompts */}
        <div className="p-4 sm:p-5 border-b border-[#222222] bg-[#141414] space-y-3">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
            className="relative flex items-center gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. 'Show me a high-octane Tollywood action movie' or 'Heartwarming Marathi comedy'..."
              className="w-full bg-[#181818] border border-[#282828] rounded px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-[#808080] focus:outline-none focus:border-[#E50914] transition-colors"
            />
            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="px-4 py-2.5 rounded bg-[#E50914] hover:bg-[#B20710] text-white text-xs font-semibold disabled:opacity-50 transition-colors flex items-center gap-1.5 flex-shrink-0"
            >
              {isSearching ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Analyze</span>
                </>
              )}
            </button>
          </form>

          {/* Quick prompts */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#808080] uppercase tracking-wider">Suggested Queries:</span>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => handlePromptClick(p)}
                  className="text-xs px-2.5 py-1 rounded bg-[#181818] hover:bg-[#222222] text-[#CCCCCC] hover:text-white border border-[#282828] hover:border-[#404040] transition-colors text-left"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {results ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-[#CCCCCC] uppercase tracking-wider">
                  Matches for: <span className="text-white">"{query}"</span>
                </h3>
                <span className="text-xs text-[#808080] font-mono">
                  {results.length} found
                </span>
              </div>

              {results.length === 0 ? (
                <div className="text-center py-12 text-[#808080]">
                  <Film className="w-8 h-8 mx-auto text-[#404040] mb-2" />
                  <p className="text-xs">No direct matches. Try broader keywords or actor names.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {results.map(({ movie, score, reason }) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      aiScore={score}
                      aiReason={reason}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ThumbsUp className="w-3.5 h-3.5 text-[#E50914]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Personalized AI Matches (Based on your ratings & watchlist)
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {personalizedRecommendations.slice(0, 8).map(({ movie, score, reason }) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    aiScore={score}
                    aiReason={reason}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
