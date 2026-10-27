import React, { useState } from 'react';
import { Calendar, MapPin, Sparkles, Clock, Film } from 'lucide-react';
import { Movie, Theatre, Show } from '../types';

interface ShowtimePickerProps {
  movie: Movie;
  theatres: Theatre[];
  shows: Show[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onSelectShow: (show: Show, theatre: Theatre) => void;
  onBackToMovies: () => void;
}

export const ShowtimePicker: React.FC<ShowtimePickerProps> = ({
  movie,
  theatres,
  shows,
  selectedDate,
  onSelectDate,
  onSelectShow,
  onBackToMovies,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');

  // Format dates for tab display
  const dateTabs = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().split('T')[0];
    const isToday = i === 0;
    const isTomorrow = i === 1;
    const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

    return {
      iso,
      label: isToday ? 'Today' : isTomorrow ? 'Tomorrow' : weekday,
      sublabel: dayNum,
    };
  });

  // Filter shows for selected date
  const filteredShows = shows.filter(s => {
    if (s.date !== selectedDate) return false;
    if (selectedFormat !== 'All' && s.format !== selectedFormat) return false;
    return true;
  });

  // Group shows by theatre
  const theatreMap = new Map<string, { theatre: Theatre; shows: Show[] }>();
  theatres.forEach(t => {
    if (selectedCity !== 'All' && t.city.toLowerCase() !== selectedCity.toLowerCase()) {
      return;
    }
    const tShows = filteredShows.filter(s => s.theatreId === t.id);
    if (tShows.length > 0) {
      theatreMap.set(t.id, { theatre: t, shows: tShows });
    }
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button & Movie Summary Strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-4">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            referrerPolicy="no-referrer"
            className="w-16 h-24 object-cover rounded-lg border border-slate-700/80 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
              <span>{movie.genres.join(' · ')}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="font-mono text-slate-300">{movie.ageRating}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300">{movie.durationMins}m</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display">
              {movie.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1 line-clamp-1">
              Select your preferred cinema, date, and showtime to reserve seats.
            </p>
          </div>
        </div>

        <button
          onClick={onBackToMovies}
          className="text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          ← Change Movie
        </button>
      </div>

      {/* Date Selection Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Select Date</span>
          </div>

          {/* Quick Format Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 hidden sm:inline">Format:</span>
            {['All', 'IMAX 3D', 'Dolby Atmos', 'Standard 2D'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedFormat === fmt
                    ? 'bg-amber-400 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Date Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {dateTabs.map((tab) => {
            const isSelected = tab.iso === selectedDate;
            return (
              <button
                key={tab.iso}
                onClick={() => onSelectDate(tab.iso)}
                className={`flex flex-col items-center justify-center min-w-[90px] py-2.5 px-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md shadow-amber-400/20'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <span className={`text-xs font-bold ${isSelected ? 'text-slate-950' : 'text-slate-200'}`}>
                  {tab.label}
                </span>
                <span className={`text-[11px] font-mono mt-0.5 ${isSelected ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                  {tab.sublabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Theatres & Showtimes List */}
      <div className="space-y-6">
        {theatreMap.size === 0 ? (
          <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
            <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-200">No Showtimes Found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              There are no available showtimes for this date or format combination. Try selecting another date above or resetting the format filter.
            </p>
            <button
              onClick={() => {
                setSelectedFormat('All');
                setSelectedCity('All');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          Array.from(theatreMap.values()).map(({ theatre, shows: tShows }) => (
            <div
              key={theatre.id}
              className="p-5 sm:p-6 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-4 hover:border-slate-700/80 transition-colors"
            >
              {/* Theatre Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white font-display">
                      {theatre.name}
                    </h3>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                      {theatre.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{theatre.address}</span>
                  </div>
                </div>

                {/* Amenities unboxed list */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-amber-400/90 font-medium">
                  {theatre.amenities.slice(0, 3).map((am, idx) => (
                    <span key={am} className="flex items-center gap-1">
                      {idx > 0 && <span aria-hidden="true" className="text-slate-600">·</span>}
                      <span>{am}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Showtimes Grid */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400">Available Showtimes:</span>
                <div className="flex flex-wrap gap-3">
                  {tShows.map((show) => {
                    const isAlmostFull = (show.bookedSeatsCount / show.totalSeats) > 0.65;
                    return (
                      <button
                        key={show.id}
                        onClick={() => onSelectShow(show, theatre)}
                        className="group flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950/80 hover:bg-amber-400 border border-slate-800 hover:border-amber-400 transition-all duration-200 text-left min-w-[120px]"
                      >
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-bold text-slate-100 group-hover:text-slate-950 tabular-nums">
                            {show.time}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] font-medium text-amber-400 group-hover:text-slate-900 mt-0.5">
                          <span>{show.format}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono">${show.priceTiers.standard.toFixed(2)}</span>
                        </div>

                        {isAlmostFull && (
                          <span className="text-[10px] text-rose-400 group-hover:text-rose-950 font-semibold mt-1">
                            Filling Fast
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
