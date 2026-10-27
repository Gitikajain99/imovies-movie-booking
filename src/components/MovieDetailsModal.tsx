import React from 'react';
import { X, Star, Clock, Calendar, Ticket, Film, User, Sparkles } from 'lucide-react';
import { Movie } from '../types';

interface MovieDetailsModalProps {
  movie: Movie | null;
  onClose: () => void;
  onBookNow: (movie: Movie) => void;
}

export const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({
  movie,
  onClose,
  onBookNow,
}) => {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-[#0F131C] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-white bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Banner */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-950">
          <img
            src={movie.backdropUrl || movie.posterUrl}
            alt={movie.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F131C] via-[#0F131C]/60 to-transparent" />
          
          {/* Header text over banner */}
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
                <span>{movie.genres.join(' · ')}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{movie.ageRating}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                {movie.title}
              </h2>
            </div>

            <button
              onClick={() => {
                onClose();
                onBookNow(movie);
              }}
              className="px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 shrink-0"
            >
              <Ticket className="w-4 h-4 text-slate-950" />
              <span>Book Tickets</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-xs">
            <div>
              <span className="text-slate-500 block">Rating</span>
              <span className="font-semibold text-amber-400 flex items-center gap-1 mt-0.5 tabular-nums text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {movie.rating.toFixed(1)} / 10
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Duration</span>
              <span className="font-semibold text-slate-200 flex items-center gap-1 mt-0.5 text-sm">
                <Clock className="w-4 h-4 text-slate-400" />
                {movie.durationMins} min
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Language</span>
              <span className="font-semibold text-slate-200 flex items-center gap-1 mt-0.5 text-sm">
                <Film className="w-4 h-4 text-slate-400" />
                {movie.language}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Release Date</span>
              <span className="font-semibold text-slate-200 flex items-center gap-1 mt-0.5 text-sm">
                <Calendar className="w-4 h-4 text-slate-400" />
                {movie.releaseDate}
              </span>
            </div>
          </div>

          {/* Tagline & Synopsis */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-amber-400 tracking-wide">SYNOPSIS</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {movie.synopsis}
            </p>
          </div>

          {/* Cast & Crew */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <span className="text-xs font-semibold text-amber-400 tracking-wide block mb-1.5">DIRECTOR</span>
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <User className="w-4 h-4 text-slate-400" />
                <span>{movie.director}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-amber-400 tracking-wide block mb-1.5">STARRING CAST</span>
              <div className="text-sm text-slate-300 flex flex-wrap gap-1">
                {movie.cast.map((actor, idx) => (
                  <span key={actor}>
                    {actor}{idx < movie.cast.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Audio & Experience Formats */}
          <div>
            <span className="text-xs font-semibold text-amber-400 tracking-wide block mb-2">EXPERIENCE FORMATS</span>
            <div className="flex flex-wrap gap-2">
              {movie.formats.map((fmt) => (
                <div 
                  key={fmt} 
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-amber-300 font-semibold flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{fmt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBookNow(movie);
              }}
              className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              <span>Select Showtime & Seats</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
