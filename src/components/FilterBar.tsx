import React from 'react';
import { SlidersHorizontal, X, ArrowUpDown, Smile } from 'lucide-react';
import { useMovies } from '../context/MovieContext';

const ALL_GENRES = [
  'Action', 'Comedy', 'Drama', 'Sci-Fi', 'Romance', 
  'Thriller', 'Crime', 'Horror', 'Adventure', 'Family', 
  'Fantasy', 'Music', 'Musical', 'History', 'Biography'
];

const MOODS = [
  'All',
  'Inspiring',
  'Mind-bending',
  'Dark & Gritty',
  'Heartwarming',
  'High-Octane',
  'Tear-jerker',
  'Feel-Good',
  'Chilling',
  'Laugh-out-loud',
  'Intense',
  'Epic & Grandiose',
  'Romantic & Soulful',
];

export const FilterBar: React.FC = () => {
  const {
    selectedIndustry,
    selectedGenres,
    toggleGenre,
    clearGenres,
    sortBy,
    setSortBy,
    selectedMood,
    setSelectedMood,
    filteredMovies,
  } = useMovies();

  const hasActiveFilters = selectedGenres.length > 0 || selectedMood !== 'All';

  return (
    <div className="bg-[#111111] rounded border border-[#222222] p-3.5 mb-6 space-y-3">
      
      {/* Top Row: Results count + Sort & Mood Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal className="w-4 h-4 text-[#E50914]" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            {selectedIndustry === 'All' ? 'All Industries' : `${selectedIndustry} Cinema`}
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-[#181818] text-[#808080] font-mono border border-[#282828]">
            {filteredMovies.length.toLocaleString()} {filteredMovies.length === 1 ? 'Film' : 'Films'}
          </span>
          {hasActiveFilters && (
            <button
              onClick={() => {
                clearGenres();
                setSelectedMood('All');
              }}
              className="text-xs text-[#E50914] hover:text-[#B20710] flex items-center gap-1 font-semibold ml-1 transition-colors"
            >
              <X className="w-3 h-3" /> Reset Filters
            </button>
          )}
        </div>

        {/* Sort & Mood Selectors */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Mood dropdown */}
          <div className="flex items-center gap-1.5 bg-[#181818] border border-[#282828] rounded px-2.5 py-1.5 flex-1 sm:flex-initial">
            <Smile className="w-3.5 h-3.5 text-[#808080]" />
            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              {MOODS.map(m => (
                <option key={m} value={m} className="bg-[#181818] text-white">
                  {m === 'All' ? 'Mood: All' : m}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By dropdown */}
          <div className="flex items-center gap-1.5 bg-[#181818] border border-[#282828] rounded px-2.5 py-1.5 flex-1 sm:flex-initial">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#808080]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="trending" className="bg-[#181818] text-white">Trending Now</option>
              <option value="rating" className="bg-[#181818] text-white">Top Rated (10 ★)</option>
              <option value="year_desc" className="bg-[#181818] text-white">Newest (2025-1970)</option>
              <option value="year_asc" className="bg-[#181818] text-white">Oldest / Classics</option>
              <option value="title" className="bg-[#181818] text-white">Title (A - Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Genre Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {ALL_GENRES.map((genre) => {
          const isSelected = selectedGenres.includes(genre);
          return (
            <button
              key={genre}
              onClick={() => toggleGenre(genre)}
              className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                isSelected
                  ? 'bg-[#E50914] text-white border border-[#E50914]'
                  : 'bg-[#181818] hover:bg-[#222222] text-[#808080] hover:text-white border border-[#282828]'
              }`}
            >
              {genre}
            </button>
          );
        })}
      </div>
    </div>
  );
};
