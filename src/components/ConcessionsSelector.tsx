import React, { useState } from 'react';
import { ConcessionItem, SelectedConcession, Seat, Movie, Show, Theatre } from '../types';
import { Plus, Minus, Popcorn, ChevronRight } from 'lucide-react';

interface ConcessionsSelectorProps {
  movie: Movie;
  theatre: Theatre;
  show: Show;
  selectedSeats: Seat[];
  concessionsList: ConcessionItem[];
  onProceed: (selectedConcessions: SelectedConcession[]) => void;
  onBack: () => void;
}

export const ConcessionsSelector: React.FC<ConcessionsSelectorProps> = ({
  selectedSeats,
  concessionsList,
  onProceed,
  onBack,
}) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Popcorn', 'Combos', 'Hot Snacks', 'Beverages', 'Sweets'];

  const handleIncrement = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleDecrement = (id: string) => {
    setQuantities((prev) => {
      const next = { ...prev };
      if ((next[id] || 0) > 1) {
        next[id] -= 1;
      } else {
        delete next[id];
      }
      return next;
    });
  };

  const filteredItems = activeCategory === 'All'
    ? concessionsList
    : concessionsList.filter((item) => item.category === activeCategory);

  const selectedConcessions: SelectedConcession[] = Object.entries(quantities).map(([id, qty]) => {
    const item = concessionsList.find((c) => c.id === id)!;
    return {
      id,
      name: item.name,
      price: item.price,
      quantity: qty,
    };
  });

  const concessionsTotal = selectedConcessions.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const seatsTotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
            <Popcorn className="w-3.5 h-3.5" />
            <span>Gourmet Concessions & Refreshments</span>
          </div>
          <h2 className="text-xl font-extrabold text-white font-display mt-0.5">
            Grab Your Cinema Snacks
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pre-order freshly prepared popcorn, beverages, and warm snacks. Skip the queue!
          </p>
        </div>

        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          ← Back to Seats
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => {
          const qty = quantities[item.id] || 0;
          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                qty > 0
                  ? 'bg-slate-900 border-amber-400/60 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wide">
                    {item.category}
                  </span>
                  {item.calories && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      {item.calories} kcal
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-100 mt-1 line-clamp-1 font-display">
                  {item.name}
                </h4>

                <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-100 font-mono">
                  ${item.price.toFixed(2)}
                </span>

                {qty === 0 ? (
                  <button
                    onClick={() => handleIncrement(item.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-200 text-xs font-semibold transition-all border border-slate-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-lg p-1">
                    <button
                      onClick={() => handleDecrement(item.id)}
                      className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-mono font-bold text-amber-300 px-1">
                      {qty}
                    </span>
                    <button
                      onClick={() => handleIncrement(item.id)}
                      className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-4 z-30 p-4 sm:p-5 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-400">
            Tickets ({selectedSeats.length}) + Concessions ({selectedConcessions.reduce((s, c) => s + c.quantity, 0)} items)
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
            <span>Seats: <strong className="text-slate-100">${seatsTotal.toFixed(2)}</strong></span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Snacks: <strong className="text-amber-400">${concessionsTotal.toFixed(2)}</strong></span>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4">
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Current Subtotal</span>
            <span className="text-lg font-extrabold text-white font-mono tabular-nums">
              ${(seatsTotal + concessionsTotal).toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => onProceed(selectedConcessions)}
            className="px-6 py-3 rounded-xl font-bold text-sm bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-400/25 transition-all hover:scale-[1.02] flex items-center gap-2 whitespace-nowrap"
          >
            <span>Proceed to Payment</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
