import React, { useState } from 'react';
import { 
  Sparkles, 
  Bookmark, 
  History, 
  Star, 
  Search, 
  Database, 
  User, 
  LogOut, 
  Menu, 
  X,
  Film
} from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';
import { IndustryType } from '../types/movie';

interface NavbarProps {
  currentTab: 'explore' | 'watchlist' | 'history' | 'ratings';
  setCurrentTab: (tab: 'explore' | 'watchlist' | 'history' | 'ratings') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { 
    watchlist, 
    history, 
    ratings, 
    selectedIndustry, 
    setSelectedIndustry, 
    setIsAIModalOpen, 
    setIsAuthModalOpen, 
    setIsConfigModalOpen,
    searchQuery,
    setSearchQuery,
    industryCounts
  } = useMovies();

  const { user, logout, isSupabaseActive } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const ratedCount = Object.keys(ratings).length;

  const handleIndustryClick = (industry: IndustryType | 'All') => {
    setSelectedIndustry(industry);
    setCurrentTab('explore');
    setMobileMenuOpen(false);
  };

  const industries: Array<{ label: string; value: IndustryType | 'All' }> = [
    { label: `All (${industryCounts.All})`, value: 'All' },
    { label: `Hollywood (${industryCounts.Hollywood})`, value: 'Hollywood' },
    { label: `Bollywood (${industryCounts.Bollywood})`, value: 'Bollywood' },
    { label: `Tollywood (${industryCounts.Tollywood})`, value: 'Tollywood' },
    { label: `Marathi (${industryCounts.Marathi})`, value: 'Marathi' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#000000]">
      {/* Row 1: Brand + Actions */}
      <div className="border-b border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
          
          {/* Brand Logo */}
          <button 
            onClick={() => { setSelectedIndustry('All'); setCurrentTab('explore'); }}
            className="flex items-center gap-2.5 text-left focus:outline-none flex-shrink-0"
          >
            <div className="w-8 h-8 rounded bg-[#E50914] flex items-center justify-center">
              <Film className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black tracking-tight text-white">
                MOVIE<span className="text-[#E50914]">FLIX</span>
              </span>
              <span className="hidden xl:inline-block text-[10px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded bg-[#181818] text-[#808080] border border-[#282828]">
                4,000 Films
              </span>
            </div>
          </button>

          {/* Search Bar (center area) */}
          <div className="flex-1 max-w-sm relative hidden lg:block">
            <Search className="w-3.5 h-3.5 text-[#808080] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 4,000 movies, actors, directors..."
              className="w-full bg-[#181818] border border-[#282828] rounded pl-8 pr-7 py-1.5 text-xs text-white placeholder-[#808080] focus:outline-none focus:border-[#E50914] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#808080] hover:text-white text-xs"
              >
                ×
              </button>
            )}
          </div>

          {/* Right Section / Actions */}
          <div className="flex items-center gap-2">
            
            {/* Ask Movieflix Button */}
            <button
              onClick={() => setIsAIModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#181818] hover:bg-[#222222] text-white text-xs font-semibold border border-[#333333] hover:border-[#E50914] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E50914]" />
              <span className="hidden sm:inline">Ask Movieflix</span>
              <span className="sm:hidden">AI</span>
            </button>

            {/* Watchlist Tab */}
            <button
              onClick={() => setCurrentTab('watchlist')}
              className={`relative p-2 rounded text-[#808080] hover:text-white hover:bg-[#181818] border border-transparent hover:border-[#282828] transition-colors ${
                currentTab === 'watchlist' ? 'text-white bg-[#181818] border-[#333333]' : ''
              }`}
              title="Watchlist"
            >
              <Bookmark className="w-4 h-4" />
              {watchlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E50914] text-white font-bold text-[9px] min-w-[16px] h-4 px-1 rounded flex items-center justify-center">
                  {watchlist.length > 99 ? '99+' : watchlist.length}
                </span>
              )}
            </button>

            {/* History Tab */}
            <button
              onClick={() => setCurrentTab('history')}
              className={`relative p-2 rounded text-[#808080] hover:text-white hover:bg-[#181818] border border-transparent hover:border-[#282828] transition-colors ${
                currentTab === 'history' ? 'text-white bg-[#181818] border-[#333333]' : ''
              }`}
              title="Watch History"
            >
              <History className="w-4 h-4" />
              {history.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#282828] text-white font-bold text-[9px] min-w-[16px] h-4 px-1 rounded border border-[#404040] flex items-center justify-center">
                  {history.length}
                </span>
              )}
            </button>

            {/* Ratings Tab */}
            <button
              onClick={() => setCurrentTab('ratings')}
              className={`relative p-2 rounded text-[#808080] hover:text-white hover:bg-[#181818] border border-transparent hover:border-[#282828] transition-colors ${
                currentTab === 'ratings' ? 'text-[#E50914] bg-[#181818] border-[#333333]' : ''
              }`}
              title="My Ratings"
            >
              <Star className="w-4 h-4" />
              {ratedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E50914] text-white font-bold text-[9px] min-w-[16px] h-4 px-1 rounded flex items-center justify-center">
                  {ratedCount}
                </span>
              )}
            </button>

            {/* Supabase Status / Config Button */}
            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium bg-[#181818] hover:bg-[#222222] border border-[#282828] text-[#808080] hover:text-white transition-colors"
              title="Database Configuration"
            >
              <Database className="w-3.5 h-3.5 text-[#CCCCCC]" />
              <span className="hidden xl:inline text-[#CCCCCC]">{isSupabaseActive ? 'Supabase Live' : 'Demo Mode'}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseActive ? 'bg-white' : 'bg-[#808080]'}`}></span>
            </button>

            {/* User Profile / Auth Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-0.5 rounded border border-[#282828] hover:border-[#E50914] transition-colors"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-7 h-7 rounded object-cover bg-[#181818]"
                  />
                </button>

                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-52 rounded bg-[#181818] border border-[#282828] shadow-2xl py-1 z-50"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-[#282828]">
                      <p className="text-xs font-bold text-white truncate">{user.fullName}</p>
                      <p className="text-[11px] text-[#808080] truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => { setCurrentTab('watchlist'); setProfileDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs text-[#CCCCCC] hover:text-white hover:bg-[#222222] flex items-center gap-2 transition-colors"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-[#E50914]" /> Watchlist ({watchlist.length})
                    </button>
                    <button
                      onClick={() => { setCurrentTab('history'); setProfileDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs text-[#CCCCCC] hover:text-white hover:bg-[#222222] flex items-center gap-2 transition-colors"
                    >
                      <History className="w-3.5 h-3.5 text-[#808080]" /> Watch History ({history.length})
                    </button>
                    <button
                      onClick={() => { setCurrentTab('ratings'); setProfileDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs text-[#CCCCCC] hover:text-white hover:bg-[#222222] flex items-center gap-2 transition-colors"
                    >
                      <Star className="w-3.5 h-3.5 text-[#E50914]" /> My Ratings ({ratedCount})
                    </button>
                    <button
                      onClick={() => { setIsConfigModalOpen(true); setProfileDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs text-[#CCCCCC] hover:text-white hover:bg-[#222222] flex items-center gap-2 transition-colors"
                    >
                      <Database className="w-3.5 h-3.5 text-[#808080]" /> Database Settings
                    </button>
                    <div className="border-t border-[#282828] my-1"></div>
                    <button
                      onClick={() => { logout(); setProfileDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs text-[#E50914] hover:bg-[#222222] flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#E50914] hover:bg-[#B20710] text-xs font-semibold text-white transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded text-[#808080] hover:text-white hover:bg-[#181818]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Industry Tabs — centered below logo */}
      <div className="hidden md:block bg-[#0a0a0a] border-b border-[#222222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-center gap-1 h-10">
            {industries.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => handleIndustryClick(value)}
                className={`px-4 py-1.5 rounded text-xs font-semibold transition-colors ${
                  currentTab === 'explore' && selectedIndustry === value
                    ? 'bg-[#E50914] text-white'
                    : 'text-[#808080] hover:text-white hover:bg-[#181818]'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111111] border-b border-[#222222] px-4 py-3 space-y-2">
          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 text-[#808080] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 4,000 movies..."
              className="w-full bg-[#181818] border border-[#282828] rounded pl-8 pr-3 py-2 text-xs text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {industries.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => handleIndustryClick(value)}
                className={`p-2 rounded text-xs font-semibold text-center ${
                  selectedIndustry === value ? 'bg-[#E50914] text-white' : 'bg-[#181818] text-[#CCCCCC]'
                } ${value === 'Marathi' ? 'col-span-2' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
