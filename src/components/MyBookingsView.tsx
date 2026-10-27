import React, { useState } from 'react';
import { Booking } from '../types';
import { Ticket, Calendar, Clock, MapPin, AlertTriangle, ArrowRight, CheckCircle2, RotateCcw, X, ShieldAlert } from 'lucide-react';

interface MyBookingsViewProps {
  bookings: Booking[];
  onViewTicket: (booking: Booking) => void;
  onCancelBooking: (bookingId: string) => Promise<void>;
  onExploreMovies: () => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  bookings,
  onViewTicket,
  onCancelBooking,
  onExploreMovies,
}) => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'cancelled'>('all');
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [isProcessingCancel, setIsProcessingCancel] = useState(false);

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'upcoming') return b.bookingStatus === 'confirmed';
    if (filter === 'cancelled') return b.bookingStatus === 'cancelled';
    return true;
  });

  const calculateRefundEstimate = (booking: Booking) => {
    const showDateTime = new Date(`${booking.showDate} ${booking.showTime}`).getTime();
    const diffHours = (showDateTime - Date.now()) / (1000 * 3600);
    let refundPercent = 0.75;
    let policyText = '75% refund (Within 24 hours of showtime)';

    if (diffHours >= 24) {
      refundPercent = 1.0;
      policyText = '100% full refund (More than 24 hours before showtime)';
    } else if (diffHours < 2) {
      refundPercent = 0.5;
      policyText = '50% partial refund (Less than 2 hours before showtime)';
    }

    const estimatedRefund = Number((booking.pricing.totalAmount * refundPercent).toFixed(2));
    return { refundPercent, policyText, estimatedRefund };
  };

  const handleConfirmCancel = async () => {
    if (!cancellingBooking) return;
    setIsProcessingCancel(true);
    try {
      await onCancelBooking(cancellingBooking.id);
      setCancellingBooking(null);
    } catch (err: any) {
      alert(err.message || 'Failed to cancel booking');
    } finally {
      setIsProcessingCancel(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
            <Ticket className="w-3.5 h-3.5" />
            <span>Ticket Vault & Reservation Management</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display mt-0.5">
            My Movie Bookings
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access your scannable digital passes, view cinema admission details, or manage cancellations.
          </p>
        </div>

        {/* Filter Switch */}
        <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-lg">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              filter === 'all'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              filter === 'upcoming'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              filter === 'cancelled'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl space-y-3">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-slate-200">No Reservations Found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You don't have any bookings matching this category. Explore the latest blockbusters and reserve seats!
          </p>
          <button
            onClick={onExploreMovies}
            className="mt-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
          >
            Explore Movies Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const isCancelled = b.bookingStatus === 'cancelled';
            return (
              <div
                key={b.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isCancelled
                    ? 'bg-slate-950/60 border-slate-900 opacity-70'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700/80'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  {/* Left: Movie & Showtime */}
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-22 rounded-lg bg-slate-950 overflow-hidden border border-slate-800 shrink-0">
                      {b.moviePoster ? (
                        <img
                          src={b.moviePoster}
                          alt={b.movieTitle}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                          <Ticket className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-900/50 px-2 py-0.5 rounded">
                          {b.bookingCode}
                        </span>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                            isCancelled
                              ? 'bg-rose-950/50 text-rose-400 border border-rose-900/50'
                              : 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/50'
                          }`}
                        >
                          {isCancelled ? 'Cancelled & Refunded' : 'Confirmed'}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white font-display">
                        {b.movieTitle}
                      </h3>

                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{b.theatreName} (Screen {b.screenNumber})</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="text-amber-300">{b.format}</span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400 pt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {b.showDate}
                        </span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="flex items-center gap-1 font-semibold text-slate-200">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          {b.showTime}
                        </span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="font-mono text-slate-300">
                          Seats: {b.seats.map(s => s.seatId).join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Pricing & Actions */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <div className="text-left md:text-right">
                      <span className="text-[11px] text-slate-500 block">Total Amount</span>
                      <span className="text-base font-bold text-white font-mono tabular-nums">
                        ${b.pricing.totalAmount.toFixed(2)}
                      </span>
                      {isCancelled && b.refundAmount && (
                        <span className="text-[11px] text-emerald-400 block font-mono">
                          Refunded: ${b.refundAmount.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {!isCancelled && (
                        <>
                          <button
                            onClick={() => onViewTicket(b)}
                            className="flex-1 sm:flex-initial px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Ticket className="w-3.5 h-3.5" />
                            <span>View Pass</span>
                          </button>

                          <button
                            onClick={() => setCancellingBooking(b)}
                            className="flex-1 sm:flex-initial px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/50 rounded-lg transition-colors flex items-center justify-center gap-1"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        </>
                      )}

                      {isCancelled && (
                        <span className="text-xs text-slate-500 italic">
                          Booking terminated
                        </span>
                      )}
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {cancellingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#0F131C] border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-rose-400">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-white font-display">
                  Cancel Booking & Refund
                </h3>
              </div>
              <button
                onClick={() => setCancellingBooking(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>
                Are you sure you want to cancel your reservation for{' '}
                <strong className="text-white">{cancellingBooking.movieTitle}</strong>?
              </p>

              {/* Policy breakdown box */}
              {(() => {
                const { policyText, estimatedRefund } = calculateRefundEstimate(cancellingBooking);
                return (
                  <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                    <span className="text-slate-400 font-semibold block">Refund Breakdown:</span>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Policy:</span>
                      <span className="text-slate-200 text-right">{policyText}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-800 text-sm font-bold">
                      <span className="text-slate-300">Refund to original card:</span>
                      <span className="text-emerald-400 font-mono">${estimatedRefund.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })()}

              <p className="text-[11px] text-slate-500">
                Once cancelled, your reserved seats ({cancellingBooking.seats.map(s => s.seatId).join(', ')}) will immediately be released back to the general cinema inventory.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setCancellingBooking(null)}
                disabled={isProcessingCancel}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isProcessingCancel}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors flex items-center gap-1.5"
              >
                {isProcessingCancel ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Refund...</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Confirm Cancellation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
