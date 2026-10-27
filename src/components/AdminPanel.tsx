import React, { useState, useEffect } from 'react';
import { 
  Movie, 
  Theatre, 
  Show, 
  Booking, 
  AdminAnalytics, 
  MovieGenre, 
  MovieFormat 
} from '../types';
import { api } from '../lib/api';
import { 
  Shield, 
  Plus, 
  Film, 
  Calendar, 
  Armchair, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Trash2, 
  RefreshCw, 
  Clock, 
  Check, 
  AlertCircle 
} from 'lucide-react';

interface AdminPanelProps {
  movies: Movie[];
  theatres: Theatre[];
  shows: Show[];
  onRefreshData: () => Promise<void>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  movies,
  theatres,
  shows,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'movies' | 'shows' | 'bookings' | 'occupancy'>('overview');
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // New Movie Form State
  const [newMovie, setNewMovie] = useState({
    title: '',
    tagline: '',
    synopsis: '',
    genres: ['Action', 'Sci-Fi'],
    durationMins: 130,
    rating: 8.8,
    language: 'English',
    ageRating: 'PG-13',
    status: 'now_showing',
    director: '',
    cast: '',
    posterUrl: '/src/assets/images/movie_stellar_odyssey_1793117040533.jpg',
    formats: ['IMAX 3D', 'Dolby Atmos', 'Standard 2D']
  });

  // New Show Form State
  const [newShow, setNewShow] = useState({
    movieId: movies[0]?.id || '',
    theatreId: theatres[0]?.id || '',
    screenNumber: 1,
    date: new Date().toISOString().split('T')[0],
    time: '07:30 PM',
    format: 'IMAX 3D',
    priceStandard: 16.00
  });

  // Selected Show for Occupancy Monitor
  const [selectedOccupancyShowId, setSelectedOccupancyShowId] = useState<string>(shows[0]?.id || '');
  const [occupancySeats, setOccupancySeats] = useState<any[]>([]);

  // Load analytics & bookings
  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [stats, bookingsRes] = await Promise.all([
        api.getAdminAnalytics(),
        api.getBookings(undefined, 'admin')
      ]);
      setAnalytics(stats);
      setAllBookings(bookingsRes.bookings);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Load seats when occupancy tab or show changes
  useEffect(() => {
    if (activeTab === 'occupancy' && selectedOccupancyShowId) {
      api.getShowSeats(selectedOccupancyShowId)
        .then(res => setOccupancySeats(res.seats))
        .catch(console.error);
    }
  }, [activeTab, selectedOccupancyShowId]);

  const handleCreateMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setActionSuccess(null);
    try {
      await api.createMovie({
        ...newMovie,
        language: newMovie.language as any,
        ageRating: newMovie.ageRating as any,
        status: newMovie.status as any,
        cast: newMovie.cast.split(',').map(s => s.trim()).filter(Boolean) as any,
        genres: newMovie.genres as any,
        formats: newMovie.formats as any
      });
      setActionSuccess(`Movie "${newMovie.title}" added to catalog.`);
      setNewMovie({
        title: '',
        tagline: '',
        synopsis: '',
        genres: ['Action', 'Sci-Fi'],
        durationMins: 130,
        rating: 8.8,
        language: 'English',
        ageRating: 'PG-13',
        status: 'now_showing',
        director: '',
        cast: '',
        posterUrl: '/src/assets/images/movie_stellar_odyssey_1793117040533.jpg',
        formats: ['IMAX 3D', 'Dolby Atmos', 'Standard 2D']
      });
      await onRefreshData();
      await loadAdminData();
    } catch (err: any) {
      setActionError(err.message || 'Failed to add movie');
    }
  };

  const handleDeleteMovie = async (id: string, title: string) => {
    if (!confirm(`Delete movie "${title}" and all its showtimes?`)) return;
    try {
      await api.deleteMovie(id);
      setActionSuccess(`Movie "${title}" removed.`);
      await onRefreshData();
      await loadAdminData();
    } catch (err: any) {
      setActionError(err.message || 'Failed to delete movie');
    }
  };

  const handleCreateShow = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setActionSuccess(null);
    try {
      await api.createShow(newShow);
      setActionSuccess(`Showtime scheduled successfully.`);
      await onRefreshData();
      await loadAdminData();
    } catch (err: any) {
      setActionError(err.message || 'Failed to schedule showtime');
    }
  };

  const handleDeleteShow = async (id: string) => {
    if (!confirm('Cancel this scheduled showtime?')) return;
    try {
      await api.deleteShow(id);
      setActionSuccess('Showtime deleted.');
      await onRefreshData();
      await loadAdminData();
    } catch (err: any) {
      setActionError(err.message || 'Failed to delete show');
    }
  };

  const handleResetCatalog = async () => {
    if (!confirm('Reset entire catalog, shows, and database to default seeds?')) return;
    try {
      await api.resetSeedData();
      await onRefreshData();
      await loadAdminData();
      setActionSuccess('Database catalog reset to default seeds.');
    } catch (err: any) {
      setActionError(err.message || 'Reset failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-slate-900/90 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white font-display">
              Cinema Admin & Scheduling Console
            </h2>
            <p className="text-xs text-slate-400">
              Manage movie releases, auditorium scheduling, real-time occupancy, and customer bookings.
            </p>
          </div>
        </div>

        <button
          onClick={handleResetCatalog}
          className="text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Reset Demo Seeds</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{actionError}</span>
        </div>
      )}

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono mt-1 tabular-nums">
            ${analytics ? analytics.totalRevenue.toFixed(2) : '0.00'}
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">Live verified tickets</span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Tickets Sold</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono mt-1 tabular-nums">
            {analytics ? analytics.totalTicketsSold : 0}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Across all auditoriums</span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Shows</span>
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono mt-1 tabular-nums">
            {shows.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Across 4 cinema chains</span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Average Occupancy</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono mt-1 tabular-nums">
            {analytics ? analytics.averageOccupancyRate.toFixed(1) : '46.8'}%
          </div>
          <span className="text-[11px] text-purple-400 mt-1 block">Optimal capacity band</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800 no-scrollbar text-xs font-semibold">
        {[
          { id: 'overview', label: 'Overview & Top Movies', icon: TrendingUp },
          { id: 'movies', label: `Movie Catalog (${movies.length})`, icon: Film },
          { id: 'shows', label: `Scheduled Shows (${shows.length})`, icon: Calendar },
          { id: 'occupancy', label: 'Live Hall Occupancy', icon: Armchair },
          { id: 'bookings', label: `Bookings Ledger (${allBookings.length})`, icon: DollarSign },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-3 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 border-b-2 ${
                isSelected
                  ? 'border-amber-400 text-amber-300 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl">
            <h3 className="text-sm font-bold text-white mb-4">Top Grossing Movies</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500">
                    <th className="pb-3">Movie Title</th>
                    <th className="pb-3">Tickets Sold</th>
                    <th className="pb-3 text-right">Revenue Generated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {analytics?.popularMovies && analytics.popularMovies.length > 0 ? (
                    analytics.popularMovies.map((m) => (
                      <tr key={m.movieId} className="hover:bg-slate-800/40">
                        <td className="py-3 font-semibold text-slate-200">{m.title}</td>
                        <td className="py-3 font-mono text-slate-300">{m.ticketsSold} tickets</td>
                        <td className="py-3 font-mono text-amber-400 text-right font-bold">${m.revenue.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-slate-500">
                        No transactions recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Movies Catalog */}
      {activeTab === 'movies' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Movie Form */}
          <div className="lg:col-span-1 p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Add New Movie Release</span>
            </div>

            <form onSubmit={handleCreateMovie} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Movie Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Interstellar Echoes"
                  value={newMovie.title}
                  onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Beyond the event horizon"
                  value={newMovie.tagline}
                  onChange={(e) => setNewMovie({ ...newMovie, tagline: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    value={newMovie.durationMins}
                    onChange={(e) => setNewMovie({ ...newMovie, durationMins: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">IMDb Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMovie.rating}
                    onChange={(e) => setNewMovie({ ...newMovie, rating: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Director</label>
                <input
                  type="text"
                  placeholder="Director name"
                  value={newMovie.director}
                  onChange={(e) => setNewMovie({ ...newMovie, director: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Cast (comma separated)</label>
                <input
                  type="text"
                  placeholder="Actor A, Actor B, Actor C"
                  value={newMovie.cast}
                  onChange={(e) => setNewMovie({ ...newMovie, cast: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Synopsis</label>
                <textarea
                  rows={2}
                  placeholder="Brief synopsis..."
                  value={newMovie.synopsis}
                  onChange={(e) => setNewMovie({ ...newMovie, synopsis: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-md mt-2"
              >
                Publish Movie to Catalog
              </button>
            </form>
          </div>

          {/* Existing Movies List */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-bold text-white">Current Movie Catalog ({movies.length})</h3>
            <div className="space-y-2.5">
              {movies.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={m.posterUrl}
                      alt={m.title}
                      referrerPolicy="no-referrer"
                      className="w-12 h-16 object-cover rounded border border-slate-700/80 shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{m.title}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                        <span>{m.genres.join(' · ')}</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span>{m.durationMins}m</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="text-amber-400 font-mono">★ {m.rating}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteMovie(m.id, m.title)}
                    title="Delete movie"
                    className="p-2 text-rose-400 hover:text-white hover:bg-rose-900/40 rounded-lg transition-colors border border-rose-900/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Shows Scheduler */}
      {activeTab === 'shows' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Show Form */}
          <div className="lg:col-span-1 p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Schedule New Showtime</span>
            </div>

            <form onSubmit={handleCreateShow} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Select Movie</label>
                <select
                  value={newShow.movieId}
                  onChange={(e) => setNewShow({ ...newShow, movieId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                >
                  {movies.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Select Theatre</label>
                <select
                  value={newShow.theatreId}
                  onChange={(e) => setNewShow({ ...newShow, theatreId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                >
                  {theatres.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newShow.date}
                    onChange={(e) => setNewShow({ ...newShow, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Showtime</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 07:30 PM"
                    value={newShow.time}
                    onChange={(e) => setNewShow({ ...newShow, time: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Format</label>
                  <select
                    value={newShow.format}
                    onChange={(e) => setNewShow({ ...newShow, format: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="IMAX 3D">IMAX 3D</option>
                    <option value="Dolby Atmos">Dolby Atmos</option>
                    <option value="4DX">4DX</option>
                    <option value="Standard 2D">Standard 2D</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Base Price ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newShow.priceStandard}
                    onChange={(e) => setNewShow({ ...newShow, priceStandard: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-md mt-2"
              >
                Add Showtime to Calendar
              </button>
            </form>
          </div>

          {/* Scheduled Shows List */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-bold text-white">Scheduled Shows ({shows.length})</h3>
            <div className="max-h-[550px] overflow-y-auto space-y-2 pr-1">
              {shows.slice(0, 30).map((s) => {
                const movie = movies.find(m => m.id === s.movieId);
                const theatre = theatres.find(t => t.id === s.theatreId);
                return (
                  <div
                    key={s.id}
                    className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-200">{movie?.title || 'Movie'}</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">
                        <span>{theatre?.name}</span> · <span className="text-amber-400 font-semibold">{s.format}</span>
                      </div>
                      <div className="text-slate-500 font-mono text-[10px] mt-0.5">
                        {s.date} at {s.time} · Price: ${s.priceTiers.standard}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteShow(s.id)}
                      title="Cancel Showtime"
                      className="p-1.5 text-rose-400 hover:text-white hover:bg-rose-900/40 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Real-Time Hall Occupancy */}
      {activeTab === 'occupancy' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs">
            <span className="font-semibold text-slate-300">Select Show to Inspect Live Hall Seating:</span>
            <select
              value={selectedOccupancyShowId}
              onChange={(e) => setSelectedOccupancyShowId(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none"
            >
              {shows.map((s) => {
                const movie = movies.find(m => m.id === s.movieId);
                const theatre = theatres.find(t => t.id === s.theatreId);
                return (
                  <option key={s.id} value={s.id}>
                    {movie?.title} — {theatre?.name} ({s.date} {s.time})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="p-6 bg-[#0E121A] border border-slate-800 rounded-2xl flex flex-col items-center">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest mb-6">
              AUDITORIUM SEAT MAP REAL-TIME AUDIT
            </span>

            {/* Occupancy grid */}
            <div className="min-w-[640px] flex flex-col items-center space-y-2">
              {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map((row) => (
                <div key={row} className="flex items-center gap-2">
                  <span className="w-4 text-center text-xs font-mono text-slate-500">{row}</span>
                  <div className="flex items-center gap-1">
                    {occupancySeats.filter(s => s.row === row).map((seat) => (
                      <div
                        key={seat.id}
                        title={`${seat.id} - ${seat.status}`}
                        className={`w-6 h-6 rounded flex items-center justify-center text-[9px] font-mono font-bold ${
                          seat.status === 'booked'
                            ? 'bg-rose-500/80 text-white'
                            : seat.status === 'locked'
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {seat.number}
                      </div>
                    ))}
                  </div>
                  <span className="w-4 text-center text-xs font-mono text-slate-500">{row}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-400 mt-6 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-slate-800 border border-slate-700" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-rose-500" />
                <span className="text-rose-400">Booked / Paid</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-amber-400" />
                <span className="text-amber-300">Checkout Hold</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Customer Bookings Ledger */}
      {activeTab === 'bookings' && (
        <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white">Full Customer Bookings Ledger</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500">
                  <th className="pb-3">Ref Code</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Movie & Theatre</th>
                  <th className="pb-3">Seats</th>
                  <th className="pb-3">Total Paid</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {allBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40">
                    <td className="py-3 font-mono font-bold text-amber-400">{b.bookingCode}</td>
                    <td className="py-3">
                      <div className="font-semibold text-slate-200">{b.userName}</div>
                      <div className="text-[11px] text-slate-500">{b.userEmail}</div>
                    </td>
                    <td className="py-3">
                      <div className="text-slate-200">{b.movieTitle}</div>
                      <div className="text-[11px] text-slate-500">{b.theatreName}</div>
                    </td>
                    <td className="py-3 font-mono text-slate-300">
                      {b.seats.map(s => s.seatId).join(', ')}
                    </td>
                    <td className="py-3 font-mono font-bold text-slate-200">
                      ${b.pricing.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          b.bookingStatus === 'cancelled'
                            ? 'bg-rose-950/60 text-rose-400 border border-rose-900/40'
                            : 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/40'
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
