import React, { useState } from 'react';
import { Star, Clock, Ticket, Film, Info } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
  onQuickBook: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelect,
  onQuickBook,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group flex flex-col bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5">
      
      {/* Poster Media Box (Aspect 3:4 or 4:5) */}
      <div 
        className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950 cursor-pointer"
        onClick={() => onSelect(movie)}
      >
        {!imageError && movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-500">
            <Film className="w-12 h-12 mb-3 text-amber-500/50" />
            <span className="text-sm font-semibold text-slate-300 text-center font-display">
              {movie.title}
            </span>
            <span className="text-xs text-slate-500 mt-1">{movie.genres.join(' · ')}</span>
          </div>
        )}

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickBook(movie);
              }}
              className="flex-1 py-2 px-3 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Book Seats</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(movie);
              }}
              title="Details & Trailer"
              className="p-2 text-slate-300 hover:text-white bg-slate-900/90 border border-slate-700/80 rounded-lg transition-colors"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Unboxed subtle format indicator (top right) */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
          {movie.formats.slice(0, 2).map((fmt) => (
            <span
              key={fmt}
              className="text-[10px] font-mono font-bold tracking-tight px-1.5 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-amber-300 border border-slate-700/60"
            >
              {fmt}
            </span>
          ))}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex-1 p-4 flex flex-col justify-between space-y-3">
        <div>
          {/* Metadata Row: Clean unboxed text with middle dots */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
            <span className="font-medium text-slate-300">{movie.genres[0]}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              {movie.durationMins}m
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400 font-mono text-[11px]">{movie.ageRating}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelect(movie)}
            className="text-base font-bold text-slate-100 hover:text-amber-400 font-display line-clamp-1 cursor-pointer transition-colors"
          >
            {movie.title}
          </h3>

          {/* Tagline / Subtitle */}
          <p className="text-xs text-slate-400 line-clamp-1 mt-1">
            {movie.tagline}
          </p>
        </div>

        {/* Bottom stats row */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-amber-400 font-semibold tabular-nums">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{movie.rating.toFixed(1)}</span>
            <span className="text-[11px] text-slate-500 font-normal">
              ({(movie.voteCount / 1000).toFixed(1)}k)
            </span>
          </div>

          <button
            onClick={() => onQuickBook(movie)}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            <span>Showtimes</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>

      </div>

    </div>
  );
};
