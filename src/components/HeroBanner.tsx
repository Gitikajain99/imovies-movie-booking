import React from 'react';
import { Star, Clock, Ticket, Play, Sparkles } from 'lucide-react';
import { Movie } from '../types';

interface HeroBannerProps {
  movie: Movie;
  onBookNow: (movie: Movie) => void;
  onViewDetails: (movie: Movie) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  movie,
  onBookNow,
  onViewDetails,
}) => {
  return (
    <div className="relative w-full overflow-hidden bg-slate-950 border-b border-slate-800">
      {/* Background Image with Deep Gradient Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={movie.backdropUrl || movie.posterUrl}
          alt={movie.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top opacity-30 transform scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E14] via-[#0B0E14]/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Info */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            
            {/* Meta Row (Zero-pill discipline: unboxed text with middle dot separators) */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-amber-400">
              <span className="flex items-center gap-1 font-semibold text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Featured Premiere
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300">{movie.genres.join(', ')}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {Math.floor(movie.durationMins / 60)}h {movie.durationMins % 60}m
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="flex items-center gap-1 text-amber-400 font-semibold tabular-nums">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {movie.rating.toFixed(1)} / 10
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display text-balance">
              {movie.title}
            </h1>

            {/* Tagline */}
            <p className="text-base sm:text-lg text-amber-200/90 italic font-medium">
              "{movie.tagline}"
            </p>

            {/* Synopsis */}
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl line-clamp-3 leading-relaxed">
              {movie.synopsis}
            </p>

            {/* Formats list (Clean unboxed tags) */}
            <div className="flex items-center gap-3 pt-2 text-xs font-mono text-slate-400">
              <span className="text-slate-500 font-sans">Available Formats:</span>
              <div className="flex items-center gap-2">
                {movie.formats.map((fmt) => (
                  <span
                    key={fmt}
                    className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-900 border border-slate-700/80 text-amber-300"
                  >
                    {fmt}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => onBookNow(movie)}
                className="px-6 py-3 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] flex items-center gap-2"
              >
                <Ticket className="w-4 h-4 text-slate-950" />
                <span>Book Tickets</span>
              </button>

              <button
                onClick={() => onViewDetails(movie)}
                className="px-5 py-3 text-sm font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 rounded-lg transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Trailer & Details</span>
              </button>
            </div>
          </div>

          {/* Side Poster Card Preview */}
          <div className="lg:col-span-4 hidden lg:flex justify-end">
            <div className="relative group cursor-pointer" onClick={() => onBookNow(movie)}>
              <div className="w-72 h-[410px] rounded-xl overflow-hidden shadow-2xl border border-slate-700/70 relative">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                    <Ticket className="w-4 h-4" /> Click to select showtime
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
