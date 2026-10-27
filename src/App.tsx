import React, { useState, useEffect } from 'react';
import { 
  Movie, 
  Theatre, 
  Show, 
  Seat, 
  ConcessionItem, 
  SelectedConcession, 
  Booking, 
  User, 
  PaymentMethod 
} from './types';
import { api, getCurrentUser, setCurrentUser, clearAuthToken } from './lib/api';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { MovieFilters } from './components/MovieFilters';
import { MovieCard } from './components/MovieCard';
import { MovieDetailsModal } from './components/MovieDetailsModal';
import { ShowtimePicker } from './components/ShowtimePicker';
import { SeatMap } from './components/SeatMap';
import { ConcessionsSelector } from './components/ConcessionsSelector';
import { CheckoutModal } from './components/CheckoutModal';
import { TicketPassModal } from './components/TicketPassModal';
import { MyBookingsView } from './components/MyBookingsView';
import { TheatresView } from './components/TheatresView';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { Film, Sparkles, Popcorn, Shield, Ticket, Check } from 'lucide-react';

export default function App() {
  // Navigation & View State
  const [activeView, setActiveView] = useState<'home' | 'movies' | 'theatres' | 'bookings' | 'admin'>('home');
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');

  // Booking Flow State
  const [bookingStep, setBookingStep] = useState<'none' | 'showtimes' | 'seats' | 'concessions'>('none');
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);
  const [selectedTheatre, setSelectedTheatre] = useState<Theatre | null>(null);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [selectedConcessions, setSelectedConcessions] = useState<SelectedConcession[]>([]);

  // Modals
  const [detailsMovie, setDetailsMovie] = useState<Movie | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Data Store State
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [showSeats, setShowSeats] = useState<Seat[]>([]);
  const [concessions, setConcessions] = useState<ConcessionItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentUser, setUser] = useState<User | null>(getCurrentUser());
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedFormat, setSelectedFormat] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('now_showing');

  // Load initial data
  const loadData = async () => {
    try {
      setLoading(true);
      const [moviesRes, theatresRes, showsRes, concessionsRes, bookingsRes] = await Promise.all([
        api.getMovies(),
        api.getTheatres(),
        api.getShows(),
        api.getConcessions(),
        api.getBookings(currentUser?.id, currentUser?.role),
      ]);

      setMovies(moviesRes.movies);
      setTheatres(theatresRes.theatres);
      setShows(showsRes.shows);
      setConcessions(concessionsRes.concessions);
      setBookings(bookingsRes.bookings);

      // Default user if none
      if (!currentUser) {
        const defaultUser: User = {
          id: 'usr-1',
          name: 'Alex Morgan',
          email: 'alex@example.com',
          role: 'user',
          phone: '+1 (555) 389-2041',
        };
        setUser(defaultUser);
        setCurrentUser(defaultUser);
      }
    } catch (err) {
      console.error('Failed to load application data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter movies
  const filteredMovies = movies.filter((m) => {
    if (selectedStatus !== 'all' && m.status !== selectedStatus) return false;
    if (selectedGenre !== 'All' && !m.genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase())) return false;
    if (selectedLanguage !== 'All' && m.language.toLowerCase() !== selectedLanguage.toLowerCase()) return false;
    if (selectedFormat !== 'All' && !m.formats.some((f) => f.toLowerCase() === selectedFormat.toLowerCase())) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchDirector = m.director.toLowerCase().includes(q);
      const matchCast = m.cast.some((c) => c.toLowerCase().includes(q));
      if (!matchTitle && !matchDirector && !matchCast) return false;
    }
    return true;
  });

  // Featured Hero movie (e.g. first movie)
  const featuredMovie = movies[0];

  // Handlers for booking flow
  const handleStartBooking = (movie: Movie) => {
    setActiveMovie(movie);
    setBookingStep('showtimes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectShow = async (show: Show, theatre: Theatre) => {
    setSelectedShow(show);
    setSelectedTheatre(theatre);
    try {
      const res = await api.getShowSeats(show.id);
      setShowSeats(res.seats);
      setBookingStep('seats');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleProceedFromSeats = async (seats: Seat[]) => {
    setSelectedSeats(seats);
    if (selectedShow && currentUser) {
      try {
        await api.lockSeats(selectedShow.id, seats.map((s) => s.id), currentUser.id);
      } catch (e) {
        console.warn('Seat lock notice:', e);
      }
    }
    setBookingStep('concessions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedFromConcessions = (concs: SelectedConcession[]) => {
    setSelectedConcessions(concs);
    setIsCheckoutOpen(true);
  };

  const handleConfirmBooking = async (checkoutData: {
    userName: string;
    userEmail: string;
    userPhone: string;
    paymentMethod: PaymentMethod;
    discountCode?: string;
  }) => {
    if (!selectedShow) return;

    const res = await api.createBooking({
      userId: currentUser?.id || 'usr-1',
      userName: checkoutData.userName,
      userEmail: checkoutData.userEmail,
      userPhone: checkoutData.userPhone,
      showId: selectedShow.id,
      selectedSeats,
      selectedConcessions,
      paymentMethod: checkoutData.paymentMethod,
      discountCode: checkoutData.discountCode,
    });

    setConfirmedBooking(res.booking);
    setIsCheckoutOpen(false);
    setBookingStep('none');
    setActiveMovie(null);
    setSelectedShow(null);
    setSelectedSeats([]);
    setSelectedConcessions([]);

    // Refresh user bookings
    const refreshed = await api.getBookings(currentUser?.id, currentUser?.role);
    setBookings(refreshed.bookings);
  };

  const handleCancelBooking = async (bookingId: string) => {
    await api.cancelBooking(bookingId);
    // Reload bookings
    const refreshed = await api.getBookings(currentUser?.id, currentUser?.role);
    setBookings(refreshed.bookings);
  };

  const handleLogout = () => {
    clearAuthToken();
    setUser(null);
    setIsAuthOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E14] text-slate-100">
      
      {/* Universal Header with Top Bar Contract */}
      <Header
        currentUser={currentUser}
        activeView={activeView}
        selectedCity={selectedCity}
        onSelectView={(v) => {
          setActiveView(v);
          setBookingStep('none');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectCity={setSelectedCity}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        
        {/* VIEW 1: Active Booking Flow (Showtimes / Seats / Concessions) */}
        {bookingStep === 'showtimes' && activeMovie && (
          <ShowtimePicker
            movie={activeMovie}
            theatres={theatres}
            shows={shows.filter((s) => s.movieId === activeMovie.id)}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onSelectShow={handleSelectShow}
            onBackToMovies={() => setBookingStep('none')}
          />
        )}

        {bookingStep === 'seats' && activeMovie && selectedTheatre && selectedShow && (
          <SeatMap
            movie={activeMovie}
            theatre={selectedTheatre}
            show={selectedShow}
            seats={showSeats}
            onProceed={handleProceedFromSeats}
            onBack={() => setBookingStep('showtimes')}
          />
        )}

        {bookingStep === 'concessions' && activeMovie && selectedTheatre && selectedShow && (
          <ConcessionsSelector
            movie={activeMovie}
            theatre={selectedTheatre}
            show={selectedShow}
            selectedSeats={selectedSeats}
            concessionsList={concessions}
            onProceed={handleProceedFromConcessions}
            onBack={() => setBookingStep('seats')}
          />
        )}

        {/* VIEW 2: Theatres / Cinemas View */}
        {bookingStep === 'none' && activeView === 'theatres' && (
          <TheatresView
            theatres={theatres}
            movies={movies}
            shows={shows}
            onSelectMovieShow={handleStartBooking}
          />
        )}

        {/* VIEW 3: My Bookings & History */}
        {bookingStep === 'none' && activeView === 'bookings' && (
          <MyBookingsView
            bookings={bookings}
            onViewTicket={(b) => setConfirmedBooking(b)}
            onCancelBooking={handleCancelBooking}
            onExploreMovies={() => {
              setActiveView('movies');
              setBookingStep('none');
            }}
          />
        )}

        {/* VIEW 4: Admin Management Portal */}
        {bookingStep === 'none' && activeView === 'admin' && (
          <AdminPanel
            movies={movies}
            theatres={theatres}
            shows={shows}
            onRefreshData={loadData}
          />
        )}

        {/* VIEW 5: Home & Movies Listing */}
        {bookingStep === 'none' && (activeView === 'home' || activeView === 'movies') && (
          <div>
            {/* Hero Banner for Featured Blockbuster (on Home view) */}
            {activeView === 'home' && featuredMovie && (
              <HeroBanner
                movie={featuredMovie}
                onBookNow={handleStartBooking}
                onViewDetails={setDetailsMovie}
              />
            )}

            {/* Movies Catalog Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
              
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                    <Film className="w-3.5 h-3.5" />
                    <span>Now Premiering in Theatres</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-0.5">
                    Explore Movies & Showtimes
                  </h2>
                </div>

                <div className="text-xs text-slate-400">
                  Showing <strong className="text-slate-200">{filteredMovies.length}</strong> titles
                </div>
              </div>

              {/* Movie Filters */}
              <MovieFilters
                searchQuery={searchQuery}
                selectedGenre={selectedGenre}
                selectedLanguage={selectedLanguage}
                selectedFormat={selectedFormat}
                selectedStatus={selectedStatus}
                onSearchChange={setSearchQuery}
                onGenreChange={setSelectedGenre}
                onLanguageChange={setSelectedLanguage}
                onFormatChange={setSelectedFormat}
                onStatusChange={setSelectedStatus}
                onResetFilters={() => {
                  setSearchQuery('');
                  setSelectedGenre('All');
                  setSelectedLanguage('All');
                  setSelectedFormat('All');
                  setSelectedStatus('now_showing');
                }}
              />

              {/* Movie Cards Grid */}
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 py-12">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="aspect-[3/4] bg-slate-900/60 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : filteredMovies.length === 0 ? (
                <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl">
                  <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-slate-200">No movies match your criteria</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Try adjusting your genre, format, or search term to discover more showtimes.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredMovies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onSelect={setDetailsMovie}
                      onQuickBook={handleStartBooking}
                    />
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#080A0E] py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white tracking-tight font-display text-sm">
              IMOVIES
            </span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span>Movie Ticket Booking Made Simple</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <span>© 2026 IMovies Cinema Systems</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span>Dolby Atmos & IMAX Laser Certified</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <MovieDetailsModal
        movie={detailsMovie}
        onClose={() => setDetailsMovie(null)}
        onBookNow={handleStartBooking}
      />

      {isCheckoutOpen && selectedTheatre && selectedShow && (
        <CheckoutModal
          movie={activeMovie!}
          theatre={selectedTheatre}
          show={selectedShow}
          selectedSeats={selectedSeats}
          selectedConcessions={selectedConcessions}
          currentUser={currentUser}
          onConfirmBooking={handleConfirmBooking}
          onClose={() => setIsCheckoutOpen(false)}
        />
      )}

      <TicketPassModal
        booking={confirmedBooking}
        onClose={() => setConfirmedBooking(null)}
        onViewMyBookings={() => {
          setActiveView('bookings');
          setBookingStep('none');
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(u) => setUser(u)}
      />

    </div>
  );
}
