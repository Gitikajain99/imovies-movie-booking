import React, { useState, useEffect } from 'react';
import { Movie, Theatre, Show, Seat, SeatTier } from '../types';
import { Clock, ShieldCheck, Armchair, Sparkles, ChevronRight, AlertCircle } from 'lucide-react';

interface SeatMapProps {
  movie: Movie;
  theatre: Theatre;
  show: Show;
  seats: Seat[];
  onProceed: (selectedSeats: Seat[]) => void;
  onBack: () => void;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  movie,
  theatre,
  show,
  seats,
  onProceed,
  onBack,
}) => {
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(480); // 8 minutes countdown
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Group seats by row
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  // Toggle seat selection
  const handleToggleSeat = (seat: Seat) => {
    if (seat.status === 'booked' || seat.status === 'locked') return;

    setErrorMsg(null);
    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds(selectedSeatIds.filter((id) => id !== seat.id));
    } else {
      if (selectedSeatIds.length >= 8) {
        setErrorMsg('Maximum 8 tickets per reservation allowed.');
        return;
      }
      setSelectedSeatIds([...selectedSeatIds, seat.id]);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (selectedSeatIds.length === 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedSeatIds.length]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Calculate selected seats details
  const selectedSeats = seats.filter((s) => selectedSeatIds.includes(s.id));
  const subtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
            <span>{theatre.name}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300 font-mono">Screen {show.screenNumber}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-amber-300">{show.format}</span>
          </div>
          <h2 className="text-xl font-extrabold text-white font-display mt-0.5">
            {movie.title}
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>{show.date}</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-slate-200">{show.time}</span>
          </div>
        </div>

        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          ← Change Showtime
        </button>
      </div>

      {/* Countdown lock banner if seats selected */}
      {selectedSeatIds.length > 0 && (
        <div className="flex items-center justify-between p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Seats are held for your session. Complete checkout before timer expires.</span>
          </div>
          <span className="font-mono font-bold text-amber-300 text-sm tabular-nums">
            {formatTimer(timeLeft)}
          </span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Auditorium Seating Area */}
      <div className="p-6 sm:p-8 bg-[#0D1017] border border-slate-800/90 rounded-2xl relative overflow-hidden">
        
        {/* Curved Cinema Screen */}
        <div className="relative mb-12 flex flex-col items-center">
          <div className="w-3/4 sm:w-2/3 h-2 rounded-t-full bg-gradient-to-r from-amber-500/20 via-amber-400 to-amber-500/20 shadow-lg shadow-amber-500/30" />
          <div className="w-full h-12 screen-glow pointer-events-none" />
          <span className="text-[10px] tracking-widest text-slate-500 uppercase font-mono mt-1">
            ALL EYES THIS WAY · SCREEN
          </span>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 pb-8 mb-8 border-b border-slate-800/70">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md border border-slate-700 bg-slate-800" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-amber-400 shadow-sm shadow-amber-400/50" />
            <span className="text-amber-300 font-medium">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-slate-950 border border-slate-900 opacity-40 cursor-not-allowed" />
            <span>Reserved</span>
          </div>
          <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
            <span className="text-slate-500">Tiers:</span>
            <span className="text-slate-300">Standard (${show.priceTiers.standard.toFixed(2)})</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300">Prime (${show.priceTiers.prime.toFixed(2)})</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-amber-400 font-medium">VIP Recliner (${show.priceTiers.recliner.toFixed(2)})</span>
          </div>
        </div>

        {/* Seats Grid */}
        <div className="overflow-x-auto pb-4 no-scrollbar">
          <div className="min-w-[680px] flex flex-col items-center space-y-2.5">
            {rows.map((row) => {
              const rowSeats = seats.filter((s) => s.row === row);
              const tier = rowSeats[0]?.tier || 'standard';
              const isRecliner = tier === 'recliner';

              return (
                <div key={row} className="flex items-center gap-3">
                  {/* Row Letter */}
                  <span className="w-5 text-xs font-mono font-bold text-slate-500 text-right">
                    {row}
                  </span>

                  {/* Seat columns */}
                  <div className="flex items-center gap-1.5">
                    {rowSeats.map((seat) => {
                      const isSelected = selectedSeatIds.includes(seat.id);
                      const isBooked = seat.status === 'booked';
                      const isLocked = seat.status === 'locked';

                      // Aisle gaps after seat 4 and seat 12
                      const hasAisleGap = seat.number === 4 || seat.number === 12;

                      return (
                        <React.Fragment key={seat.id}>
                          <button
                            disabled={isBooked || isLocked}
                            onClick={() => handleToggleSeat(seat)}
                            title={`${seat.row}${seat.number} - ${seat.tier.toUpperCase()} ($${seat.price.toFixed(2)})`}
                            className={`
                              ${isRecliner ? 'w-8 h-8 rounded-lg' : 'w-7 h-7 rounded-md'}
                              flex items-center justify-center text-[10px] font-mono font-semibold transition-all duration-150
                              ${
                                isBooked
                                  ? 'bg-slate-950 border border-slate-900 text-slate-700 cursor-not-allowed opacity-35'
                                  : isLocked
                                  ? 'bg-amber-950/40 border border-amber-800/40 text-amber-700 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/40 scale-105 border border-amber-300 font-bold'
                                  : tier === 'recliner'
                                  ? 'bg-slate-800/90 hover:bg-slate-700 border border-amber-500/40 text-amber-200'
                                  : tier === 'prime'
                                  ? 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300'
                                  : 'bg-slate-850 hover:bg-slate-750 border border-slate-750 text-slate-400'
                              }
                            `}
                          >
                            {seat.number}
                          </button>

                          {hasAisleGap && <div className="w-6" />}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {/* Row Letter Right */}
                  <span className="w-5 text-xs font-mono font-bold text-slate-500 text-left">
                    {row}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Floating Bottom Action Bar */}
      <div className="sticky bottom-4 z-30 p-4 sm:p-5 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-400">
            Selected Seats: ({selectedSeats.length})
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            {selectedSeats.length === 0 ? (
              <span className="text-sm font-medium text-slate-500">
                Please click on the seats above to select
              </span>
            ) : (
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedSeats.map((s) => (
                  <span
                    key={s.id}
                    className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-400/20 border border-amber-400/40 text-amber-300"
                  >
                    {s.row}{s.number}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-6">
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Total Tickets Price</span>
            <span className="text-lg font-extrabold text-white font-mono tabular-nums">
              ${subtotal.toFixed(2)}
            </span>
          </div>

          <button
            disabled={selectedSeats.length === 0}
            onClick={() => onProceed(selectedSeats)}
            className={`
              px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap
              ${
                selectedSeats.length > 0
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-400/25 hover:scale-[1.02]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }
            `}
          >
            <span>Add Snacks & Concessions</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
