import React, { useState } from 'react';
import { Theatre, Movie, Show } from '../types';
import { MapPin, Film, Sparkles, Clock, Check, ChevronRight } from 'lucide-react';

interface TheatresViewProps {
  theatres: Theatre[];
  movies: Movie[];
  shows: Show[];
  onSelectMovieShow: (movie: Movie) => void;
}

export const TheatresView: React.FC<TheatresViewProps> = ({
  theatres,
  movies,
  shows,
  onSelectMovieShow,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('All');

  const filteredTheatres = selectedCity === 'All'
    ? theatres
    : theatres.filter(t => t.city.toLowerCase() === selectedCity.toLowerCase());

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Premium Cinema Venues</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display mt-0.5">
            Partner Cinemas & Auditoriums
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Experience movies in cutting-edge IMAX Laser, Dolby Atmos 64-Channel, and VIP Luxury Recliner environments.
          </p>
        </div>

        {/* City Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
          {['All', 'New York', 'Los Angeles', 'Chicago', 'London'].map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                selectedCity === city
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Theatres List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTheatres.map((theatre) => {
          // Find movies playing at this theatre
          const theatreShowMovieIds = Array.from(new Set(shows.filter(s => s.theatreId === theatre.id).map(s => s.movieId)));
          const playingMovies = movies.filter(m => theatreShowMovieIds.includes(m.id));

          return (
            <div
              key={theatre.id}
              className="p-6 bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-2xl space-y-5 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                      {theatre.chain}
                    </span>
                    <h3 className="text-lg font-bold text-white font-display mt-0.5">
                      {theatre.name}
                    </h3>
                  </div>

                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                    {theatre.city}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{theatre.address}</span>
                </div>

                {/* Screens Breakdown */}
                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-300 block mb-1.5">Auditoriums & Screens:</span>
                  <div className="space-y-1">
                    {theatre.screens.map((screen) => (
                      <div
                        key={screen.screenNumber}
                        className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/60 border border-slate-850"
                      >
                        <span className="text-slate-300 font-medium">{screen.name}</span>
                        <div className="flex items-center gap-1.5">
                          {screen.formats.map((fmt) => (
                            <span
                              key={fmt}
                              className="text-[10px] font-mono text-amber-300 font-semibold"
                            >
                              {fmt}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities List */}
                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-300 block mb-1.5">Amenities:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {theatre.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Now Playing at this Theatre */}
              <div className="pt-4 border-t border-slate-800">
                <span className="text-xs font-semibold text-slate-400 block mb-2">
                  Now Playing ({playingMovies.length} movies):
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {playingMovies.map((movie) => (
                    <button
                      key={movie.id}
                      onClick={() => onSelectMovieShow(movie)}
                      className="group flex items-center gap-2 p-1.5 bg-slate-950 hover:bg-slate-800 rounded-lg border border-slate-800 hover:border-amber-400/50 transition-all shrink-0 text-left"
                    >
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        referrerPolicy="no-referrer"
                        className="w-8 h-11 object-cover rounded"
                      />
                      <div className="pr-2">
                        <span className="text-xs font-bold text-slate-200 group-hover:text-amber-400 block truncate max-w-[110px]">
                          {movie.title}
                        </span>
                        <span className="text-[10px] text-amber-300 font-mono">
                          View Times →
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
