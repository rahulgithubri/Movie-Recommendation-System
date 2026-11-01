import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { MovieProvider, useMovies } from './context/MovieContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { FilterBar } from './components/FilterBar';
import { MovieGrid } from './components/MovieGrid';
import { MovieModal } from './components/MovieModal';
import { TrailerModal } from './components/TrailerModal';
import { AIRecommenderModal } from './components/AIRecommenderModal';
import { AuthModal } from './components/AuthModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { WatchlistView } from './components/WatchlistView';
import { HistoryView } from './components/HistoryView';
import { RatingsView } from './components/RatingsView';
import { IndustryShowcase } from './components/IndustryShowcase';
import { Sparkles, Film, Database } from 'lucide-react';
import { IndustryType } from './types/movie';

const MainContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'explore' | 'watchlist' | 'history' | 'ratings'>('explore');
  const { selectedIndustry, setSelectedIndustry, searchQuery, selectedGenres, selectedMood, setIsAIModalOpen } = useMovies();

  // If user has filters active, show grid directly; otherwise show Hero + Showcase + Grid
  const isFiltering = searchQuery.trim() !== '' || selectedGenres.length > 0 || selectedMood !== 'All';

  const handleSelectIndustryFromShowcase = (ind: IndustryType) => {
    setSelectedIndustry(ind);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white selection:bg-[#E50914] selection:text-white">
      {/* Top Navbar */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        {currentTab === 'explore' && (
          <div>
            {/* Show Hero Banner only when not actively searching or deeply filtering */}
            {!isFiltering && selectedIndustry === 'All' && <HeroBanner />}

            {/* Filter Bar */}
            <FilterBar />

            {/* Industry Showcase Carousel (when on explore root without deep search) */}
            {!isFiltering && selectedIndustry === 'All' && (
              <IndustryShowcase onSelectIndustry={handleSelectIndustryFromShowcase} />
            )}

            {/* Main Movie Catalog Grid */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3 border-b border-[#222222] pb-3">
                <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Film className="w-4 h-4 text-[#E50914]" />
                  <span>
                    {selectedIndustry === 'All' 
                      ? 'Catalog Overview (4,000 Films)' 
                      : `${selectedIndustry} Cinema (1,000 Films)`}
                  </span>
                </h2>
              </div>
              <MovieGrid />
            </div>
          </div>
        )}

        {currentTab === 'watchlist' && (
          <WatchlistView onExploreClick={() => setCurrentTab('explore')} />
        )}

        {currentTab === 'history' && (
          <HistoryView onExploreClick={() => setCurrentTab('explore')} />
        )}

        {currentTab === 'ratings' && (
          <RatingsView onExploreClick={() => setCurrentTab('explore')} />
        )}
      </main>

      {/* Floating Movieflix Action Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setIsAIModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded bg-[#E50914] hover:bg-[#B20710] text-white font-semibold text-xs shadow-2xl border border-[#B20710] transition-colors"
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span>Ask Movieflix</span>
        </button>
      </div>

      {/* Footer with Catalog Statistics */}
      <footer className="mt-16 border-t border-[#222222] bg-[#000000] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 pb-8 border-b border-[#181818]">
            <div className="bg-[#111111] p-3.5 rounded border border-[#222222]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#808080]">Industry 1</span>
              <p className="text-xl font-black text-white font-mono mt-0.5">1,000</p>
              <p className="text-xs text-[#808080]">Hollywood Classics & Sci-Fi</p>
            </div>
            <div className="bg-[#111111] p-3.5 rounded border border-[#222222]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#808080]">Industry 2</span>
              <p className="text-xl font-black text-white font-mono mt-0.5">1,000</p>
              <p className="text-xs text-[#808080]">Bollywood Hits & Epics</p>
            </div>
            <div className="bg-[#111111] p-3.5 rounded border border-[#222222]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#808080]">Industry 3</span>
              <p className="text-xl font-black text-white font-mono mt-0.5">1,000</p>
              <p className="text-xs text-[#808080]">Tollywood Action & Folklore</p>
            </div>
            <div className="bg-[#111111] p-3.5 rounded border border-[#222222]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#808080]">Industry 4</span>
              <p className="text-xl font-black text-white font-mono mt-0.5">1,000</p>
              <p className="text-xs text-[#808080]">Marathi Dramas & Historicals</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#808080]">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white font-bold">Movieflix Movie Recommendation System</span>
              <span>•</span>
              <span className="font-mono">4,000 Films Catalog</span>
              <span>•</span>
              <span className="text-[#CCCCCC] flex items-center gap-1">
                <Database className="w-3 h-3 text-[#E50914]" /> Supabase & Google Auth Ready
              </span>
            </div>
            <p>Solid Minimal Cinema Design System</p>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <MovieModal />
      <TrailerModal />
      <AIRecommenderModal />
      <AuthModal />
      <SupabaseConfigModal />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MovieProvider>
        <MainContent />
      </MovieProvider>
    </AuthProvider>
  );
}

export default App;
