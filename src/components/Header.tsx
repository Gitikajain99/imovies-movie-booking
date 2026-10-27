import React from 'react';
import { Film, User as UserIcon, Ticket, Shield, LogOut, MapPin } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User | null;
  activeView: 'home' | 'movies' | 'theatres' | 'bookings' | 'admin';
  selectedCity: string;
  onSelectView: (view: 'home' | 'movies' | 'theatres' | 'bookings' | 'admin') => void;
  onSelectCity: (city: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeView,
  selectedCity,
  onSelectView,
  onSelectCity,
  onOpenAuth,
  onLogout,
}) => {
  const cities = ['All Cities', 'New York', 'Los Angeles', 'Chicago', 'London'];

  return (
    <header className="sticky top-0 z-40 bg-[#0B0E14]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <button 
          onClick={() => onSelectView('home')}
          className="flex items-center gap-2.5 text-left group shrink-0 focus:outline-none"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/10 group-hover:scale-105 transition-transform">
            <Film className="w-5 h-5 text-slate-950 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-white font-display">
              IMOVIES
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectView('movies')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-amber-400 ${
              activeView === 'movies' || activeView === 'home' ? 'text-amber-400 font-semibold' : 'text-slate-300'
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => onSelectView('theatres')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-amber-400 ${
              activeView === 'theatres' ? 'text-amber-400 font-semibold' : 'text-slate-300'
            }`}
          >
            Cinemas
          </button>
          <button
            onClick={() => onSelectView('bookings')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-amber-400 flex items-center gap-1.5 ${
              activeView === 'bookings' ? 'text-amber-400 font-semibold' : 'text-slate-300'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>My Bookings</span>
          </button>
          <button
            onClick={() => onSelectView('admin')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-amber-400 flex items-center gap-1.5 ${
              activeView === 'admin' ? 'text-amber-400 font-semibold' : 'text-slate-300'
            }`}
          >
            <Shield className="w-4 h-4 text-amber-500" />
            <span>Admin Portal</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action / user state */}
        <div className="flex items-center gap-4 shrink-0">
          {/* City Selector */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg">
            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <select
              value={selectedCity}
              onChange={(e) => onSelectCity(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              {cities.map((city) => (
                <option key={city} value={city} className="bg-slate-900 text-slate-200">
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* User Profile or Sign-in */}
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-200 truncate max-w-[130px]">
                  {currentUser.name}
                </span>
                <span className="text-[11px] text-amber-400 font-mono">
                  {currentUser.role === 'admin' ? 'Admin' : 'Member'}
                </span>
              </div>
              <button
                onClick={onLogout}
                title="Log out"
                className="p-2 text-slate-400 hover:text-rose-400 bg-slate-900 border border-slate-800 rounded-lg transition-colors focus:outline-none"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-sm hover:shadow-amber-500/20 whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
