import React, { useState } from 'react';
import { Movie, Theatre, Show, Seat, SelectedConcession, PaymentMethod, User } from '../types';
import { ShieldCheck, CreditCard, Smartphone, Gift, Tag, Check, AlertCircle, X, Lock } from 'lucide-react';

interface CheckoutModalProps {
  movie: Movie;
  theatre: Theatre;
  show: Show;
  selectedSeats: Seat[];
  selectedConcessions: SelectedConcession[];
  currentUser: User | null;
  onConfirmBooking: (data: {
    userName: string;
    userEmail: string;
    userPhone: string;
    paymentMethod: PaymentMethod;
    discountCode?: string;
  }) => Promise<void>;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  movie,
  theatre,
  show,
  selectedSeats,
  selectedConcessions,
  currentUser,
  onConfirmBooking,
  onClose,
}) => {
  const [name, setName] = useState(currentUser?.name || 'Alex Morgan');
  const [email, setEmail] = useState(currentUser?.email || 'alex@example.com');
  const [phone, setPhone] = useState(currentUser?.phone || '+1 (555) 389-2041');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Financial calculations
  const seatsTotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const concessionsTotal = selectedConcessions.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const bookingFee = selectedSeats.length * 1.75;
  const subtotal = seatsTotal + concessionsTotal + bookingFee;
  const discount = appliedPromo === 'IMOVIE20' ? Number((subtotal * 0.2).toFixed(2)) : 0;
  const taxableAmount = subtotal - discount;
  const tax = Number((taxableAmount * 0.088).toFixed(2));
  const finalTotal = Number((taxableAmount + tax).toFixed(2));

  const handleApplyPromo = () => {
    setPromoError(null);
    if (!promoCode.trim()) return;
    if (promoCode.trim().toUpperCase() === 'IMOVIE20') {
      setAppliedPromo('IMOVIE20');
    } else {
      setPromoError('Invalid code. Try "IMOVIE20" for 20% off.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    try {
      await onConfirmBooking({
        userName: name,
        userEmail: email,
        userPhone: phone,
        paymentMethod,
        discountCode: appliedPromo || undefined,
      });
    } catch (err: any) {
      alert(err.message || 'Payment processing error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#0F131C] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-slate-900/60">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Secure 256-Bit SSL Checkout</span>
            </div>
            <h3 className="text-lg font-bold text-white font-display mt-0.5">
              Confirm & Pay Reservation
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Order Summary Strip */}
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white font-display">
                  {movie.title}
                </h4>
                <div className="text-xs text-slate-400 mt-0.5">
                  <span>{theatre.name}</span> · <span>Screen {show.screenNumber}</span> · <span>{show.format}</span>
                </div>
                <div className="text-xs text-amber-400/90 font-medium mt-0.5">
                  {show.date} at {show.time}
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 block">Seats ({selectedSeats.length})</span>
                <span className="text-xs font-mono font-bold text-slate-200">
                  {selectedSeats.map(s => `${s.row}${s.number}`).join(', ')}
                </span>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Tickets ({selectedSeats.length} seats)</span>
                <span className="font-mono text-slate-200">${seatsTotal.toFixed(2)}</span>
              </div>

              {selectedConcessions.length > 0 && (
                <div className="flex justify-between text-slate-400">
                  <span>Snacks & Concessions ({selectedConcessions.reduce((s, c) => s + c.quantity, 0)} items)</span>
                  <span className="font-mono text-slate-200">${concessionsTotal.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400">
                <span>Convenience & Booking Fee</span>
                <span className="font-mono text-slate-200">${bookingFee.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Promo Discount (20%)</span>
                  <span className="font-mono">-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400">
                <span>Estimated Taxes & Fees (8.8%)</span>
                <span className="font-mono text-slate-200">${tax.toFixed(2)}</span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                <span>Grand Total</span>
                <span className="font-mono text-amber-400 text-base tabular-nums">${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Promo code input */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Have a promo code? (try IMOVIE20)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                disabled={appliedPromo !== null}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 uppercase placeholder:normal-case focus:outline-none focus:border-amber-400/80 transition-colors"
              />
            </div>
            {appliedPromo ? (
              <span className="px-3 py-2 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 rounded-lg flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Applied
              </span>
            ) : (
              <button
                type="button"
                onClick={handleApplyPromo}
                className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              >
                Apply
              </button>
            )}
          </div>
          {promoError && (
            <p className="text-[11px] text-rose-400 -mt-4">{promoError}</p>
          )}

          {/* Guest / Contact Details */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-300 block">
              Ticket Delivery & Contact Info
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400/80"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Email (for e-ticket)</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400/80"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Mobile Phone (SMS pass)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400/80"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-300 block">
              Choose Payment Method
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'credit_card', label: 'Credit Card', icon: CreditCard },
                { id: 'apple_pay', label: 'Apple Pay', icon: Smartphone },
                { id: 'instant_pay', label: 'Instant Pay / UPI', icon: Smartphone },
                { id: 'gift_card', label: 'Cinema Gift', icon: Gift },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-semibold ${
                      isSelected
                        ? 'bg-amber-400/10 border-amber-400 text-amber-300 shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit action */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Instant QR pass confirmation</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-lg shadow-amber-400/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <span>Pay ${finalTotal.toFixed(2)}</span>
                  <span>& Confirm</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
