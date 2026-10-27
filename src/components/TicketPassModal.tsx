import React from 'react';
import { Booking } from '../types';
import { CheckCircle2, Download, Printer, Calendar, MapPin, X, Film, Clock, Sparkles } from 'lucide-react';

interface TicketPassModalProps {
  booking: Booking | null;
  onClose: () => void;
  onViewMyBookings: () => void;
}

export const TicketPassModal: React.FC<TicketPassModalProps> = ({
  booking,
  onClose,
  onViewMyBookings,
}) => {
  if (!booking) return null;

  // Generate an .ics calendar file for the showtime
  const handleAddToCalendar = () => {
    const showStart = new Date(`${booking.showDate} ${booking.showTime}`);
    const showEnd = new Date(showStart.getTime() + 150 * 60 * 1000); // 2.5 hours approx

    const formatDateForIcs = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//IMovies Cinema Ticketing//EN',
      'BEGIN:VEVENT',
      `UID:${booking.bookingCode}@imovies.com`,
      `DTSTAMP:${formatDateForIcs(new Date())}`,
      `DTSTART:${formatDateForIcs(showStart)}`,
      `DTEND:${formatDateForIcs(showEnd)}`,
      `SUMMARY:Movie: ${booking.movieTitle} (${booking.format})`,
      `DESCRIPTION:Booking Reference: ${booking.bookingCode}\\nTheatre: ${booking.theatreName} (Screen ${booking.screenNumber})\\nSeats: ${booking.seats.map(s => s.seatId).join(', ')}`,
      `LOCATION:${booking.theatreName}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${booking.bookingCode}_${booking.movieTitle.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-[#0E121A] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success confirmation strip */}
        <div className="bg-emerald-500/10 border-b border-emerald-500/30 p-4 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Booking Confirmed & Seats Reserved!</span>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-white bg-slate-900/80 rounded-full transition-colors z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Digital Ticket Pass Stub */}
        <div className="p-6 space-y-6">
          
          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            
            {/* Top Ticket Half */}
            <div className="p-5 pb-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                    DIGITAL CINEMA PASS
                  </span>
                  <h3 className="text-xl font-extrabold text-white font-display mt-0.5">
                    {booking.movieTitle}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span className="text-amber-300 font-semibold">{booking.format}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="font-mono">Auditorium {booking.screenNumber}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono text-slate-500 block">BOOKING REF</span>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-900/60 px-2 py-0.5 rounded">
                    {booking.bookingCode}
                  </span>
                </div>
              </div>

              {/* Theatre details */}
              <div className="flex items-center gap-1.5 text-xs text-slate-300 pt-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{booking.theatreName}</span>
              </div>

              {/* Key metadata grid */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl text-center">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono block">DATE</span>
                  <span className="text-xs font-bold text-slate-200 mt-0.5 block">
                    {booking.showDate}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-mono block">TIME</span>
                  <span className="text-xs font-bold text-amber-400 mt-0.5 block tabular-nums">
                    {booking.showTime}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-mono block">SEATS</span>
                  <span className="text-xs font-bold text-white mt-0.5 block font-mono">
                    {booking.seats.map(s => s.seatId).join(', ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Perforated divider with tear notches */}
            <div className="relative flex items-center my-1">
              <div className="ticket-tear-left" />
              <div className="w-full border-t-2 border-dashed border-slate-800 mx-4" />
              <div className="ticket-tear-right" />
            </div>

            {/* Bottom Ticket Half: QR code & Barcode */}
            <div className="p-5 pt-3 space-y-4 bg-slate-950/40">
              
              {/* Concessions check */}
              {booking.concessions && booking.concessions.length > 0 && (
                <div className="text-xs text-slate-300 p-2.5 bg-slate-900/60 rounded-lg border border-slate-800">
                  <span className="text-amber-400 font-semibold block text-[11px] mb-1">
                    Pre-Ordered Concessions (Collect at Counter 2):
                  </span>
                  <div className="flex flex-wrap gap-2 text-slate-300">
                    {booking.concessions.map(c => (
                      <span key={c.id} className="text-slate-300">
                        {c.quantity}x {c.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Simulated QR Code matrix & Barcode */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-white rounded-xl text-slate-950">
                {/* Visual SVG QR Code Matrix */}
                <div className="p-1 border border-slate-200 rounded">
                  <svg className="w-24 h-24" viewBox="0 0 100 100" fill="currentColor">
                    {/* Corners */}
                    <rect x="5" y="5" width="28" height="28" fill="#000" rx="3" />
                    <rect x="9" y="9" width="20" height="20" fill="#fff" rx="2" />
                    <rect x="13" y="13" width="12" height="12" fill="#000" rx="1" />

                    <rect x="67" y="5" width="28" height="28" fill="#000" rx="3" />
                    <rect x="71" y="9" width="20" height="20" fill="#fff" rx="2" />
                    <rect x="75" y="13" width="12" height="12" fill="#000" rx="1" />

                    <rect x="5" y="67" width="28" height="28" fill="#000" rx="3" />
                    <rect x="9" y="71" width="20" height="20" fill="#fff" rx="2" />
                    <rect x="13" y="75" width="12" height="12" fill="#000" rx="1" />

                    {/* Matrix data bits */}
                    <rect x="40" y="8" width="6" height="6" />
                    <rect x="50" y="8" width="6" height="6" />
                    <rect x="40" y="20" width="6" height="6" />
                    <rect x="50" y="24" width="6" height="6" />
                    <rect x="8" y="42" width="6" height="6" />
                    <rect x="20" y="42" width="6" height="6" />
                    <rect x="12" y="52" width="6" height="6" />
                    <rect x="40" y="40" width="8" height="8" />
                    <rect x="54" y="40" width="6" height="6" />
                    <rect x="44" y="52" width="6" height="6" />
                    <rect x="56" y="56" width="6" height="6" />
                    <rect x="72" y="42" width="6" height="6" />
                    <rect x="84" y="42" width="6" height="6" />
                    <rect x="76" y="54" width="6" height="6" />
                    <rect x="40" y="72" width="6" height="6" />
                    <rect x="52" y="72" width="6" height="6" />
                    <rect x="44" y="84" width="6" height="6" />
                    <rect x="72" y="72" width="8" height="8" />
                    <rect x="84" y="84" width="8" height="8" />
                  </svg>
                </div>

                {/* Right side barcode & instructions */}
                <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    SCAN AT ENTRANCE GATE
                  </span>
                  
                  {/* Vector Barcode lines */}
                  <div className="flex items-center gap-[2px] h-8 w-full max-w-[190px] py-1">
                    {Array.from({ length: 32 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-full bg-slate-900 ${
                          i % 3 === 0 ? 'w-[3px]' : i % 2 === 0 ? 'w-[1px]' : 'w-[2px]'
                        }`}
                      />
                    ))}
                  </div>

                  <span className="text-xs font-mono font-bold tracking-widest text-slate-800">
                    {booking.bookingCode}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Show on phone or printed ticket.
                  </span>
                </div>
              </div>

              {/* Total Paid */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Guest: <strong className="text-slate-200">{booking.userName}</strong></span>
                <span>Total Paid: <strong className="text-amber-400 font-mono text-sm">${booking.pricing.totalAmount.toFixed(2)}</strong></span>
              </div>

            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleAddToCalendar}
              className="w-full sm:flex-1 py-2.5 px-3 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Add to Calendar (.ics)</span>
            </button>

            <button
              onClick={handlePrint}
              className="w-full sm:flex-1 py-2.5 px-3 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Print Pass</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onViewMyBookings();
              }}
              className="w-full sm:flex-1 py-2.5 px-3 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <span>My Bookings</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
