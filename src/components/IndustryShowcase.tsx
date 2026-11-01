import React from 'react';
import { Sparkles, ArrowRight, Film } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { MovieCard } from './MovieCard';
import { IndustryType, Movie } from '../types/movie';

interface CarouselRowProps {
  title: string;
  subtitle: string;
  movies: Movie[];
  onViewAll?: () => void;
  isAI?: boolean;
}

const CarouselRow: React.FC<CarouselRowProps> = ({ title, subtitle, movies, onViewAll, isAI }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            {isAI ? (
              <Sparkles className="w-4 h-4 text-[#E50914]" />
            ) : (
              <Film className="w-4 h-4 text-[#E50914]" />
            )}
            <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
              {title}
            </h2>
          </div>
          <p className="text-xs text-[#808080] mt-0.5">{subtitle}</p>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-xs font-semibold text-[#808080] hover:text-[#E50914] transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Horizontal Carousel */}
      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 pt-1 scrollbar-thin">
        {movies.slice(0, 10).map((movie) => (
          <div key={movie.id} className="w-36 sm:w-44 flex-shrink-0">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
};

export const IndustryShowcase: React.FC<{ onSelectIndustry: (ind: IndustryType) => void }> = ({ onSelectIndustry }) => {
  const { movies, personalizedRecommendations } = useMovies();

  const hollywoodTop = movies.filter(m => m.industry === 'Hollywood').slice(0, 10);
  const bollywoodTop = movies.filter(m => m.industry === 'Bollywood').slice(0, 10);
  const tollywoodTop = movies.filter(m => m.industry === 'Tollywood').slice(0, 10);
  const marathiTop = movies.filter(m => m.industry === 'Marathi').slice(0, 10);

  return (
    <div className="space-y-8 my-6">
      {/* AI Personalized Recommendations Feed */}
      <div className="p-4 sm:p-5 rounded bg-[#111111] border border-[#222222]">
        <CarouselRow
          title="Recommended For You"
          subtitle="Personalized recommendations weighted by your ratings, watchlist, and genres"
          movies={personalizedRecommendations.slice(0, 10).map(r => r.movie)}
          isAI={true}
        />
      </div>

      {/* Hollywood Carousel */}
      <CarouselRow
        title="Hollywood Blockbusters"
        subtitle="1,000 English sci-fi, classics, thrillers, and award-winning cinema"
        movies={hollywoodTop}
        onViewAll={() => onSelectIndustry('Hollywood')}
      />

      {/* Bollywood Carousel */}
      <CarouselRow
        title="Bollywood Hits & Masterpieces"
        subtitle="1,000 Hindi dramas, romances, thrillers, and iconic musical epics"
        movies={bollywoodTop}
        onViewAll={() => onSelectIndustry('Bollywood')}
      />

      {/* Tollywood Carousel */}
      <CarouselRow
        title="Tollywood Spectacles & Mass Cinema"
        subtitle="1,000 Telugu cinematic titans, high-octane action, folklore, and emotional sagas"
        movies={tollywoodTop}
        onViewAll={() => onSelectIndustry('Tollywood')}
      />

      {/* Marathi Carousel */}
      <CarouselRow
        title="Marathi Cinema Gems"
        subtitle="1,000 historic Maratha epics, heartfelt social dramas, and timeless comedies"
        movies={marathiTop}
        onViewAll={() => onSelectIndustry('Marathi')}
      />
    </div>
  );
};
