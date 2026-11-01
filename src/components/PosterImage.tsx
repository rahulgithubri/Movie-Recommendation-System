import React, { useState } from 'react';
import { Movie } from '../types/movie';
import { generatePosterDataUri, generateBackdropDataUri } from '../utils/posterGenerator';

interface PosterImageProps {
  movie: Movie;
  type?: 'poster' | 'backdrop';
  className?: string;
  alt?: string;
}

export const PosterImage: React.FC<PosterImageProps> = ({
  movie,
  type = 'poster',
  className = '',
  alt
}) => {
  const [hasError, setHasError] = useState(false);

  // If the URL has Unsplash or generic photo or has failed to load, generate custom original artwork
  const isGenericPhoto = !movie.poster || 
    movie.poster.includes('unsplash.com') ||
    (type === 'backdrop' && (!movie.backdrop || movie.backdrop.includes('unsplash.com')));

  const fallbackUri = type === 'poster' 
    ? generatePosterDataUri(movie)
    : generateBackdropDataUri(movie);

  const targetSrc = (!hasError && !isGenericPhoto)
    ? (type === 'poster' ? movie.poster : movie.backdrop)
    : fallbackUri;

  return (
    <img
      src={targetSrc}
      alt={alt || movie.title}
      loading="lazy"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
