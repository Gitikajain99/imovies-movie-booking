import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data store with file persistence
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'cinema-db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.warn('Could not create data dir, using in-memory only', err);
  }
}

// Initial Seed Data
const INITIAL_MOVIES = [
  {
    id: 'mov-1',
    title: 'Stellar Odyssey',
    tagline: 'The journey has just begun. Explore beyond the stars.',
    synopsis: 'When a mysterious gravitational anomaly opens at the perimeter of Saturn, an elite expedition of astrophysicists and explorers embarks on a high-stakes interstellar voyage to uncover secrets of an ancient celestial architecture.',
    posterUrl: '/src/assets/images/movie_stellar_odyssey_1793117040533.jpg',
    backdropUrl: '/src/assets/images/movie_stellar_odyssey_1793117040533.jpg',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    durationMins: 168,
    rating: 9.1,
    voteCount: 18420,
    releaseDate: '2026-10-16',
    language: 'English',
    ageRating: 'PG-13',
    status: 'now_showing',
    director: 'Elias Thornwood',
    cast: ['Sarah Chen', 'Elias Thorne', 'Maya Reed', 'Marcus Sterling'],
    formats: ['IMAX 3D', 'Dolby Atmos', 'Standard 2D'],
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'mov-2',
    title: 'Neon Hunters: Dark Meridian',
    tagline: 'In a city fueled by light, danger lurks in the shadows.',
    synopsis: 'In neo-metropolis 2049, rogue cyber-detective Elias Thorne navigates rain-slicked underground sectors to intercept a synthetic syndicate orchestrating a blackout across the orbital grid.',
    posterUrl: '/src/assets/images/movie_neon_pursuit_1793117041691.jpg',
    backdropUrl: '/src/assets/images/movie_neon_pursuit_1793117041691.jpg',
    genres: ['Action', 'Thriller', 'Sci-Fi'],
    durationMins: 142,
    rating: 8.8,
    voteCount: 12950,
    releaseDate: '2026-10-20',
    language: 'English',
    ageRating: 'R',
    status: 'now_showing',
    director: 'Maya Vance',
    cast: ['Elias Thorne', 'Maya Reed', 'Kaelen Ross', 'Zoe Martinez'],
    formats: ['Dolby Atmos', '4DX', 'Standard 2D'],
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'mov-3',
    title: 'Celestial Realm: Twin Suns',
    tagline: 'An epic journey beyond the clouds and ancient thrones.',
    synopsis: 'High in the floating sky-islands of Solaria, an exiled kingdom sentinel discovers a legendary celestial scepter capable of realigning the twin dying suns before eternal eclipse falls.',
    posterUrl: '/src/assets/images/movie_chronicles_solaria_1793117043085.jpg',
    backdropUrl: '/src/assets/images/movie_chronicles_solaria_1793117043085.jpg',
    genres: ['Adventure', 'Fantasy', 'Action'],
    durationMins: 155,
    rating: 8.9,
    voteCount: 9410,
    releaseDate: '2026-10-24',
    language: 'English',
    ageRating: 'PG-13',
    status: 'now_showing',
    director: 'Rhys Darnell',
    cast: ['Elara Vance', 'Kellan Thorne', 'Rhys Darnell', 'Lyra Snow'],
    formats: ['IMAX 3D', 'Dolby Atmos', 'Standard 2D'],
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'mov-4',
    title: 'Whispering Pines',
    tagline: 'The trees remember what the mist conceals.',
    synopsis: 'A seasoned forensic investigator retreats into a remote Pacific Northwest timber basin, only to reopen cold unsolved disappearances spanning three decades of forest folklore.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop',
    genres: ['Thriller', 'Drama'],
    durationMins: 124,
    rating: 8.5,
    voteCount: 7200,
    releaseDate: '2026-10-18',
    language: 'English',
    ageRating: 'R',
    status: 'now_showing',
    director: 'Claire Henderson',
    cast: ['David Strathairn', 'Elena Rostova', 'Jonathan Banks'],
    formats: ['Dolby Atmos', 'Standard 2D'],
    trailerUrl: ''
  },
  {
    id: 'mov-5',
    title: 'Velocity Apex: 24h Le Mans',
    tagline: 'Seconds decide legacy. Speed writes history.',
    synopsis: 'An underdog hybrid racing engineering crew risks their entire livelihood to engineer an unprecedented prototype capable of toppling reigning dynastic champions in the grueling rain of Le Mans.',
    posterUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1200&auto=format&fit=crop',
    genres: ['Action', 'Drama'],
    durationMins: 136,
    rating: 8.7,
    voteCount: 11300,
    releaseDate: '2026-10-22',
    language: 'English',
    ageRating: 'PG-13',
    status: 'now_showing',
    director: 'Kenzo Takeda',
    cast: ['Carlos Navarro', 'Liam Gallagher', 'Sophie Laurent'],
    formats: ['IMAX 3D', '4DX', 'Dolby Atmos'],
    trailerUrl: ''
  },
  {
    id: 'mov-6',
    title: 'Midnight Symphony: Opus 9',
    tagline: 'When notes transcend time, music becomes eternity.',
    synopsis: 'A gifted prodigy composer living between Vienna and Paris recovers an unfinished cadence from 1892 that alters the mental perception and memories of whoever performs it.',
    posterUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1200&auto=format&fit=crop',
    genres: ['Drama', 'Animation'],
    durationMins: 118,
    rating: 9.0,
    voteCount: 8120,
    releaseDate: '2026-11-06',
    language: 'French',
    ageRating: 'PG',
    status: 'coming_soon',
    director: 'Lucie Bernard',
    cast: ['Camille Durand', 'Mathieu Amalric', 'Emmanuelle Riva'],
    formats: ['Dolby Atmos', 'Standard 2D'],
    trailerUrl: ''
  }
];

const INITIAL_THEATRES = [
  {
    id: 'th-1',
    name: 'Grand Horizon IMAX Cinema',
    chain: 'Horizon Cinemas',
    city: 'New York',
    address: '420 Broadway Ave, Downtown Manhattan',
    screens: [
      { screenNumber: 1, name: 'IMAX Laser Auditorium 1', formats: ['IMAX 3D', 'Standard 2D'], totalSeats: 160 },
      { screenNumber: 2, name: 'Dolby Cinema Auditorium 2', formats: ['Dolby Atmos', 'Standard 2D'], totalSeats: 160 }
    ],
    amenities: ['IMAX with Laser 4K', 'Dolby Atmos 64-Channel', 'VIP Plush Motorized Recliners', 'Gourmet In-Seat Dining', 'Wheelchair Accessible']
  },
  {
    id: 'th-2',
    name: 'CineMark Platinum Pavilion',
    chain: 'CineMark Luxe',
    city: 'Los Angeles',
    address: '10250 Santa Monica Blvd, Century City',
    screens: [
      { screenNumber: 1, name: 'Dolby Atmos Hall A', formats: ['Dolby Atmos', 'Standard 2D'], totalSeats: 160 },
      { screenNumber: 2, name: '4DX Motion Theater B', formats: ['4DX', 'Standard 2D'], totalSeats: 160 }
    ],
    amenities: ['4DX Motion Dynamic Seats', 'Dolby Atmos Surround', 'Reserved Luxury Seating', 'Cocktail Lounge & Concessions', 'Assisted Listening']
  },
  {
    id: 'th-3',
    name: 'Starlight Dolby Cinema Lounge',
    chain: 'Starlight Multiplex',
    city: 'Chicago',
    address: '600 N Michigan Ave, Magnificent Mile',
    screens: [
      { screenNumber: 1, name: 'Dolby Vision Hall 1', formats: ['Dolby Atmos', 'Standard 2D'], totalSeats: 160 },
      { screenNumber: 2, name: 'Screen 2 Grand Recliner', formats: ['Standard 2D'], totalSeats: 160 }
    ],
    amenities: ['Dolby Vision & Atmos', 'Full Motorized Recliners', 'Artisan Coffee & Bakery', 'Hearing Loop System']
  },
  {
    id: 'th-4',
    name: 'West End Odeon Luxe',
    chain: 'Odeon Luxe',
    city: 'London',
    address: '24-28 Leicester Square, West End',
    screens: [
      { screenNumber: 1, name: 'Royal IMAX Laser Hall', formats: ['IMAX 3D', 'Standard 2D'], totalSeats: 160 },
      { screenNumber: 2, name: 'Luxe Dolby Auditorium', formats: ['Dolby Atmos'], totalSeats: 160 }
    ],
    amenities: ['IMAX 70mm & Laser', 'Oscar Wilde Cocktail Bar', 'Every Seat a Recliner', 'Heated Seats']
  }
];

const INITIAL_CONCESSIONS = [
  {
    id: 'c-1',
    name: 'Classic Butter Popcorn (Large)',
    description: 'Freshly popped golden corn bathed in authentic warm rich butter.',
    category: 'Popcorn',
    price: 8.50,
    calories: 620
  },
  {
    id: 'c-2',
    name: 'Truffle Parmesan Gourmet Popcorn',
    description: 'Crisp artisan popcorn tossed with white truffle oil and aged Parmigiano.',
    category: 'Popcorn',
    price: 10.50,
    calories: 580
  },
  {
    id: 'c-3',
    name: 'Blockbuster Cinema Combo',
    description: '1 Large Popcorn + 2 Large Fountain Drinks + 1 Box of M&Ms or Twizzlers.',
    category: 'Combos',
    price: 18.00,
    calories: 1150
  },
  {
    id: 'c-4',
    name: 'Loaded Cheddar & Jalapeno Nachos',
    description: 'Warm tortilla rounds with melted aged cheddar, diced jalapenos, and salsa.',
    category: 'Hot Snacks',
    price: 9.50,
    calories: 740
  },
  {
    id: 'c-5',
    name: 'Bavarian Soft Pretzel Bites',
    description: 'Oven-baked salted pretzel nuggets served with stone-ground mustard & beer cheese.',
    category: 'Hot Snacks',
    price: 8.00,
    calories: 490
  },
  {
    id: 'c-6',
    name: 'Frozen ICEE Wild Blue Raspberry (Large)',
    description: 'Ultra-chilled slush treat, a refreshing cinema classic.',
    category: 'Beverages',
    price: 6.50,
    calories: 220
  },
  {
    id: 'c-7',
    name: 'Sparkling Blood Orange Craft Soda',
    description: 'Cane sugar craft soda made with natural Italian blood orange juice.',
    category: 'Beverages',
    price: 5.50,
    calories: 140
  },
  {
    id: 'c-8',
    name: 'Belgian Dark Chocolate Sea Salt Bites',
    description: 'Rich 70% cacao Belgian chocolate clusters sprinkled with fleur de sel.',
    category: 'Sweets',
    price: 7.00,
    calories: 360
  }
];

// Helper to generate dates (Today, Tomorrow, +4 days)
function getShowDates(): string[] {
  const dates: string[] = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

// Generate Shows dynamically
function generateShows() {
  const dates = getShowDates();
  const times = ['11:00 AM', '02:15 PM', '05:30 PM', '08:45 PM', '10:45 PM'];
  const shows: any[] = [];

  let showIdCounter = 1;
  INITIAL_THEATRES.forEach(theatre => {
    INITIAL_MOVIES.slice(0, 4).forEach(movie => {
      dates.slice(0, 5).forEach((date, dateIdx) => {
        // assign 2-3 showtimes per movie per theatre per day
        const dayTimes = dateIdx % 2 === 0 ? [times[0], times[2], times[3]] : [times[1], times[3]];
        dayTimes.forEach(time => {
          const format = movie.formats[showIdCounter % movie.formats.length] || 'Standard 2D';
          const priceBase = format === 'IMAX 3D' ? 18.00 : format === 'Dolby Atmos' ? 17.00 : 14.00;
          shows.push({
            id: `show-${showIdCounter++}`,
            movieId: movie.id,
            theatreId: theatre.id,
            screenNumber: (showIdCounter % theatre.screens.length) + 1,
            date,
            time,
            format,
            priceTiers: {
              standard: priceBase,
              prime: priceBase + 5.00,
              recliner: priceBase + 11.00
            },
            totalSeats: 160,
            bookedSeatsCount: 15 + ((showIdCounter * 7) % 35)
          });
        });
      });
    });
  });

  return shows;
}

// Seat Grid generator (Rows A to J, numbers 1 to 16)
// Row A-D: standard, Row E-H: prime, Row I-J: recliner VIP
function generateSeatGrid(showId: string, bookedRatio: number = 0.2) {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const seats: any[] = [];
  
  // Deterministic seed from showId
  let seed = 0;
  for (let i = 0; i < showId.length; i++) seed += showId.charCodeAt(i);

  rows.forEach((row, rowIdx) => {
    const tier = rowIdx < 4 ? 'standard' : rowIdx < 8 ? 'prime' : 'recliner';
    for (let num = 1; num <= 16; num++) {
      // simulate realistic booked seats around center rows E, F, G, H
      const isCenter = num >= 6 && num <= 11 && rowIdx >= 4 && rowIdx <= 7;
      const hash = Math.sin(seed + rowIdx * 16 + num) * 10000;
      const isBooked = (hash - Math.floor(hash)) < (isCenter ? 0.45 : bookedRatio);

      seats.push({
        id: `${row}-${num}`,
        row,
        number: num,
        tier,
        status: isBooked ? 'booked' : 'available'
      });
    }
  });

  return seats;
}

// Seed Store
let store: {
  movies: any[];
  theatres: any[];
  shows: any[];
  concessions: any[];
  bookings: any[];
  users: any[];
  seatMapCache: Record<string, any[]>;
  lockedSeats: Record<string, { userId: string; expiresAt: number }>;
} = {
  movies: INITIAL_MOVIES,
  theatres: INITIAL_THEATRES,
  shows: generateShows(),
  concessions: INITIAL_CONCESSIONS,
  bookings: [],
  users: [
    {
      id: 'usr-1',
      name: 'Alex Morgan',
      email: 'alex@example.com',
      role: 'user',
      phone: '+1 (555) 389-2041'
    },
    {
      id: 'usr-admin',
      name: 'Jordan Lee (Cinema Director)',
      email: 'admin@imovies.com',
      role: 'admin',
      phone: '+1 (555) 902-1144'
    }
  ],
  seatMapCache: {},
  lockedSeats: {}
};

// Seed 2 initial bookings for demo realism
const initialShow = store.shows[0];
const initialMovie = store.movies[0];
const initialTheatre = store.theatres[0];

if (initialShow && initialMovie && initialTheatre) {
  store.bookings.push({
    id: 'book-seed-1',
    bookingCode: 'IMOV-74921',
    userId: 'usr-1',
    userName: 'Alex Morgan',
    userEmail: 'alex@example.com',
    userPhone: '+1 (555) 389-2041',
    movieId: initialMovie.id,
    movieTitle: initialMovie.title,
    moviePoster: initialMovie.posterUrl,
    theatreId: initialTheatre.id,
    theatreName: initialTheatre.name,
    screenNumber: initialShow.screenNumber,
    showId: initialShow.id,
    showDate: initialShow.date,
    showTime: initialShow.time,
    format: initialShow.format,
    seats: [
      { seatId: 'F-8', row: 'F', number: 8, tier: 'prime', price: initialShow.priceTiers.prime },
      { seatId: 'F-9', row: 'F', number: 9, tier: 'prime', price: initialShow.priceTiers.prime }
    ],
    concessions: [
      { id: 'c-1', name: 'Classic Butter Popcorn (Large)', price: 8.50, quantity: 1 },
      { id: 'c-6', name: 'Frozen ICEE Wild Blue Raspberry (Large)', price: 6.50, quantity: 2 }
    ],
    pricing: {
      seatsTotal: initialShow.priceTiers.prime * 2,
      concessionsTotal: 21.50,
      bookingFee: 3.50,
      tax: 4.80,
      discount: 0,
      totalAmount: initialShow.priceTiers.prime * 2 + 21.50 + 3.50 + 4.80
    },
    paymentMethod: 'apple_pay',
    paymentStatus: 'completed',
    bookingStatus: 'confirmed',
    qrCodeData: 'IMOV-74921-F8-F9',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  });
}

// Load from disk if exists
try {
  if (fs.existsSync(DB_FILE)) {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed.movies && parsed.theatres && parsed.shows) {
      store = { ...store, ...parsed };
      console.log('Successfully loaded persisted database from disk.');
    }
  }
} catch (e) {
  console.warn('Could not read existing database file, using fresh seeds.', e);
}

// Helper to save store
function persistStore() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2));
  } catch (err) {
    // ignore in read-only setups
  }
}

// Clean expired seat locks every 30 seconds
setInterval(() => {
  const now = Date.now();
  let changed = false;
  Object.keys(store.lockedSeats).forEach(key => {
    if (store.lockedSeats[key].expiresAt < now) {
      delete store.lockedSeats[key];
      changed = true;
    }
  });
  if (changed) {
    // update cache
    Object.keys(store.seatMapCache).forEach(showId => {
      const seats = store.seatMapCache[showId];
      if (seats) {
        seats.forEach(s => {
          const lockKey = `${showId}:${s.id}`;
          if (s.status === 'locked' && !store.lockedSeats[lockKey]) {
            s.status = 'available';
          }
        });
      }
    });
  }
}, 30000);

// --- REST API ROUTES ---

// Health & Info
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', name: 'IMovies Backend API', version: '1.0.0', time: new Date().toISOString() });
});

// Auth Endpoints
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  
  // Find or create user
  let user = store.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  
  if (!user) {
    // If demo quick login or new email
    const isAlex = (email || '').toLowerCase().includes('alex');
    const isAdmin = (email || '').toLowerCase().includes('admin') || role === 'admin';
    user = {
      id: `usr-${Date.now()}`,
      name: isAdmin ? 'Jordan Lee (Cinema Director)' : isAlex ? 'Alex Morgan' : email.split('@')[0],
      email: email || 'user@imovies.com',
      role: isAdmin ? 'admin' : 'user',
      phone: '+1 (555) 839-1092'
    };
    store.users.push(user);
    persistStore();
  }

  // Create simple token
  const token = `jwt_mock_${user.id}_${Date.now()}`;
  res.json({
    user: { ...user, token },
    token,
    message: 'Login successful'
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, phone, role } = req.body;
  if (!email || !name) {
    res.status(400).json({ error: 'Name and email are required.' });
    return;
  }

  const existing = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    res.status(400).json({ error: 'An account with this email already exists.' });
    return;
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    name,
    email,
    role: role === 'admin' ? 'admin' : 'user',
    phone: phone || '+1 (555) 000-0000'
  };

  store.users.push(newUser);
  persistStore();

  const token = `jwt_mock_${newUser.id}_${Date.now()}`;
  res.status(201).json({
    user: { ...newUser, token },
    token,
    message: 'Account registered successfully.'
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // Default guest or user
    res.json({ user: store.users[0] });
    return;
  }
  const token = authHeader.replace('Bearer ', '');
  const userId = token.split('_')[2];
  const user = store.users.find(u => u.id === userId) || store.users[0];
  res.json({ user });
});

// Movies Endpoints
app.get('/api/movies', (req: Request, res: Response) => {
  const { search, genre, language, format, status } = req.query;
  let results = [...store.movies];

  if (status && typeof status === 'string' && status !== 'all') {
    results = results.filter(m => m.status === status);
  }

  if (genre && typeof genre === 'string' && genre !== 'all') {
    results = results.filter(m => m.genres.some((g: string) => g.toLowerCase() === genre.toLowerCase()));
  }

  if (language && typeof language === 'string' && language !== 'all') {
    results = results.filter(m => m.language.toLowerCase() === language.toLowerCase());
  }

  if (format && typeof format === 'string' && format !== 'all') {
    results = results.filter(m => m.formats.some((f: string) => f.toLowerCase() === format.toLowerCase()));
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(m => 
      m.title.toLowerCase().includes(q) ||
      m.director.toLowerCase().includes(q) ||
      m.cast.some((c: string) => c.toLowerCase().includes(q)) ||
      m.synopsis.toLowerCase().includes(q)
    );
  }

  res.json({ movies: results, total: results.length });
});

app.get('/api/movies/:id', (req: Request, res: Response) => {
  const movie = store.movies.find(m => m.id === req.params.id);
  if (!movie) {
    res.status(404).json({ error: 'Movie not found' });
    return;
  }
  res.json({ movie });
});

// Admin Add Movie
app.post('/api/movies', (req: Request, res: Response) => {
  const movieData = req.body;
  if (!movieData.title || !movieData.genres) {
    res.status(400).json({ error: 'Title and genres are required' });
    return;
  }

  const newMovie = {
    id: `mov-${Date.now()}`,
    title: movieData.title,
    tagline: movieData.tagline || 'Experience the wonder in cinemas.',
    synopsis: movieData.synopsis || 'An exciting new cinema presentation now premiering.',
    posterUrl: movieData.posterUrl || '/src/assets/images/movie_stellar_odyssey_1793117040533.jpg',
    backdropUrl: movieData.backdropUrl || movieData.posterUrl || '/src/assets/images/movie_stellar_odyssey_1793117040533.jpg',
    genres: Array.isArray(movieData.genres) ? movieData.genres : [movieData.genres],
    durationMins: Number(movieData.durationMins) || 120,
    rating: Number(movieData.rating) || 8.5,
    voteCount: 100,
    releaseDate: movieData.releaseDate || new Date().toISOString().split('T')[0],
    language: movieData.language || 'English',
    ageRating: movieData.ageRating || 'PG-13',
    status: movieData.status || 'now_showing',
    director: movieData.director || 'Visionary Director',
    cast: Array.isArray(movieData.cast) ? movieData.cast : (movieData.cast ? movieData.cast.split(',').map((s: string) => s.trim()) : ['Lead Actor']),
    formats: Array.isArray(movieData.formats) ? movieData.formats : ['Standard 2D', 'Dolby Atmos'],
    trailerUrl: movieData.trailerUrl || ''
  };

  store.movies.unshift(newMovie);
  persistStore();
  res.status(201).json({ movie: newMovie, message: 'Movie successfully added to catalog' });
});

// Admin Update Movie
app.put('/api/movies/:id', (req: Request, res: Response) => {
  const idx = store.movies.findIndex(m => m.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Movie not found' });
    return;
  }

  store.movies[idx] = { ...store.movies[idx], ...req.body };
  persistStore();
  res.json({ movie: store.movies[idx], message: 'Movie updated' });
});

// Admin Delete Movie
app.delete('/api/movies/:id', (req: Request, res: Response) => {
  const initialLen = store.movies.length;
  store.movies = store.movies.filter(m => m.id !== req.params.id);
  if (store.movies.length === initialLen) {
    res.status(404).json({ error: 'Movie not found' });
    return;
  }
  // also delete corresponding shows
  store.shows = store.shows.filter(s => s.movieId !== req.params.id);
  persistStore();
  res.json({ message: 'Movie and associated shows deleted successfully' });
});

// Theatres Endpoints
app.get('/api/theatres', (req: Request, res: Response) => {
  const { city } = req.query;
  let results = store.theatres;
  if (city && typeof city === 'string' && city !== 'all') {
    results = results.filter(t => t.city.toLowerCase() === city.toLowerCase());
  }
  res.json({ theatres: results });
});

// Shows Endpoints
app.get('/api/shows', (req: Request, res: Response) => {
  const { movieId, theatreId, date } = req.query;
  let shows = [...store.shows];

  if (movieId && typeof movieId === 'string') {
    shows = shows.filter(s => s.movieId === movieId);
  }
  if (theatreId && typeof theatreId === 'string') {
    shows = shows.filter(s => s.theatreId === theatreId);
  }
  if (date && typeof date === 'string') {
    shows = shows.filter(s => s.date === date);
  }

  res.json({ shows });
});

app.get('/api/shows/:id', (req: Request, res: Response) => {
  const show = store.shows.find(s => s.id === req.params.id);
  if (!show) {
    res.status(404).json({ error: 'Show not found' });
    return;
  }
  const movie = store.movies.find(m => m.id === show.movieId);
  const theatre = store.theatres.find(t => t.id === show.theatreId);
  res.json({ show, movie, theatre });
});

// Admin Create Show
app.post('/api/shows', (req: Request, res: Response) => {
  const { movieId, theatreId, screenNumber, date, time, format, priceStandard } = req.body;
  if (!movieId || !theatreId || !date || !time) {
    res.status(400).json({ error: 'Movie, theatre, date, and time are required' });
    return;
  }

  const base = Number(priceStandard) || 15.00;
  const newShow = {
    id: `show-${Date.now()}`,
    movieId,
    theatreId,
    screenNumber: Number(screenNumber) || 1,
    date,
    time,
    format: format || 'Standard 2D',
    priceTiers: {
      standard: base,
      prime: base + 5.00,
      recliner: base + 11.00
    },
    totalSeats: 160,
    bookedSeatsCount: 0
  };

  store.shows.push(newShow);
  persistStore();
  res.status(201).json({ show: newShow, message: 'Showtime successfully scheduled' });
});

app.delete('/api/shows/:id', (req: Request, res: Response) => {
  store.shows = store.shows.filter(s => s.id !== req.params.id);
  persistStore();
  res.json({ message: 'Showtime cancelled' });
});

// Seats Endpoints
app.get('/api/shows/:id/seats', (req: Request, res: Response) => {
  const showId = req.params.id;
  const show = store.shows.find(s => s.id === showId);
  if (!show) {
    res.status(404).json({ error: 'Show not found' });
    return;
  }

  if (!store.seatMapCache[showId]) {
    store.seatMapCache[showId] = generateSeatGrid(showId);
  }

  const now = Date.now();
  // attach pricing and update locked states
  const seats = store.seatMapCache[showId].map(s => {
    const lockKey = `${showId}:${s.id}`;
    let currentStatus = s.status;
    if (currentStatus !== 'booked') {
      if (store.lockedSeats[lockKey] && store.lockedSeats[lockKey].expiresAt > now) {
        currentStatus = 'locked';
      } else {
        currentStatus = 'available';
      }
    }

    const price = s.tier === 'standard' 
      ? show.priceTiers.standard 
      : s.tier === 'prime' 
      ? show.priceTiers.prime 
      : show.priceTiers.recliner;

    return {
      ...s,
      status: currentStatus,
      price
    };
  });

  res.json({
    showId,
    priceTiers: show.priceTiers,
    seats
  });
});

// Lock seats during checkout (8 minute hold)
app.post('/api/shows/:id/lock-seats', (req: Request, res: Response) => {
  const showId = req.params.id;
  const { seatIds, userId } = req.body;

  if (!Array.isArray(seatIds) || seatIds.length === 0) {
    res.status(400).json({ error: 'Seat IDs are required' });
    return;
  }

  const now = Date.now();
  const expiresAt = now + 8 * 60 * 1000; // 8 minutes

  if (!store.seatMapCache[showId]) {
    store.seatMapCache[showId] = generateSeatGrid(showId);
  }

  // Check if any seat is already booked or locked by someone else
  for (const seatId of seatIds) {
    const seat = store.seatMapCache[showId].find(s => s.id === seatId);
    if (!seat || seat.status === 'booked') {
      res.status(409).json({ error: `Seat ${seatId} is already reserved by another guest.` });
      return;
    }
    const lockKey = `${showId}:${seatId}`;
    if (store.lockedSeats[lockKey] && store.lockedSeats[lockKey].expiresAt > now && store.lockedSeats[lockKey].userId !== userId) {
      res.status(409).json({ error: `Seat ${seatId} is currently held by another guest.` });
      return;
    }
  }

  // Apply locks
  seatIds.forEach(seatId => {
    const lockKey = `${showId}:${seatId}`;
    store.lockedSeats[lockKey] = { userId: userId || 'guest', expiresAt };
  });

  res.json({
    success: true,
    message: 'Seats held successfully for 8 minutes',
    expiresAt,
    seatIds
  });
});

// Concessions
app.get('/api/concessions', (_req: Request, res: Response) => {
  res.json({ concessions: store.concessions });
});

// Bookings Endpoints
app.get('/api/bookings', (req: Request, res: Response) => {
  const { userId, role } = req.query;
  let bookings = [...store.bookings];

  if (role !== 'admin' && userId) {
    bookings = bookings.filter(b => b.userId === userId);
  }

  // Sort latest first
  bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ bookings });
});

app.get('/api/bookings/:id', (req: Request, res: Response) => {
  const booking = store.bookings.find(b => b.id === req.params.id || b.bookingCode === req.params.id);
  if (!booking) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }
  res.json({ booking });
});

// Create Booking
app.post('/api/bookings', (req: Request, res: Response) => {
  const {
    userId,
    userName,
    userEmail,
    userPhone,
    showId,
    selectedSeats,
    selectedConcessions,
    paymentMethod,
    discountCode
  } = req.body;

  const show = store.shows.find(s => s.id === showId);
  if (!show) {
    res.status(404).json({ error: 'Show not found' });
    return;
  }

  const movie = store.movies.find(m => m.id === show.movieId);
  const theatre = store.theatres.find(t => t.id === show.theatreId);

  if (!selectedSeats || !Array.isArray(selectedSeats) || selectedSeats.length === 0) {
    res.status(400).json({ error: 'At least one seat must be selected.' });
    return;
  }

  // Calculate seat total
  let seatsTotal = 0;
  const bookingSeats = selectedSeats.map((s: any) => {
    const price = s.tier === 'standard' ? show.priceTiers.standard : s.tier === 'prime' ? show.priceTiers.prime : show.priceTiers.recliner;
    seatsTotal += price;
    return {
      seatId: s.id,
      row: s.row,
      number: s.number,
      tier: s.tier,
      price
    };
  });

  // Calculate concessions total
  let concessionsTotal = 0;
  const concessions = (selectedConcessions || []).map((c: any) => {
    const item = store.concessions.find(ci => ci.id === c.id);
    const itemPrice = item ? item.price : c.price;
    concessionsTotal += itemPrice * c.quantity;
    return {
      id: c.id,
      name: item ? item.name : c.name,
      price: itemPrice,
      quantity: c.quantity
    };
  });

  // Fees & Discount
  const bookingFee = 1.75 * bookingSeats.length;
  const subtotal = seatsTotal + concessionsTotal + bookingFee;
  const discountRate = (discountCode && discountCode.toUpperCase() === 'IMOVIE20') ? 0.20 : 0;
  const discount = Number((subtotal * discountRate).toFixed(2));
  const tax = Number(((subtotal - discount) * 0.088).toFixed(2));
  const totalAmount = Number((subtotal - discount + tax).toFixed(2));

  // Mark seats as permanently booked
  if (!store.seatMapCache[showId]) {
    store.seatMapCache[showId] = generateSeatGrid(showId);
  }

  bookingSeats.forEach(bs => {
    const targetSeat = store.seatMapCache[showId].find(s => s.id === bs.seatId);
    if (targetSeat) {
      targetSeat.status = 'booked';
    }
    // Remove temporary locks
    delete store.lockedSeats[`${showId}:${bs.seatId}`];
  });

  // Update show booked count
  show.bookedSeatsCount = (show.bookedSeatsCount || 0) + bookingSeats.length;

  const bookingCode = `IMOV-${Math.floor(10000 + Math.random() * 90000)}`;
  const newBooking = {
    id: `book-${Date.now()}`,
    bookingCode,
    userId: userId || 'usr-1',
    userName: userName || 'Movie Lover',
    userEmail: userEmail || 'guest@example.com',
    userPhone: userPhone || '+1 (555) 019-2831',
    movieId: movie?.id || show.movieId,
    movieTitle: movie?.title || 'Feature Movie',
    moviePoster: movie?.posterUrl || '',
    theatreId: theatre?.id || show.theatreId,
    theatreName: theatre?.name || 'Grand Horizon Cinema',
    screenNumber: show.screenNumber,
    showId: show.id,
    showDate: show.date,
    showTime: show.time,
    format: show.format,
    seats: bookingSeats,
    concessions,
    pricing: {
      seatsTotal,
      concessionsTotal,
      bookingFee,
      tax,
      discount,
      totalAmount
    },
    paymentMethod: paymentMethod || 'credit_card',
    paymentStatus: 'completed',
    bookingStatus: 'confirmed',
    qrCodeData: `${bookingCode}|${show.date}|${bookingSeats.map(s => s.seatId).join(',')}`,
    createdAt: new Date().toISOString()
  };

  store.bookings.unshift(newBooking);
  persistStore();

  res.status(201).json({
    booking: newBooking,
    message: 'Reservation confirmed! Your digital ticket is ready.'
  });
});

// Cancel Booking & Process Refund
app.post('/api/bookings/:id/cancel', (req: Request, res: Response) => {
  const booking = store.bookings.find(b => b.id === req.params.id || b.bookingCode === req.params.id);
  if (!booking) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }

  if (booking.bookingStatus === 'cancelled') {
    res.status(400).json({ error: 'This booking is already cancelled.' });
    return;
  }

  // Calculate refund policy:
  // If show date is in the future > 24 hours: 100% refund
  // If 2 to 24 hours: 75% refund
  // Under 2 hours or passed: 50% refund
  const showDateTime = new Date(`${booking.showDate} ${booking.showTime}`).getTime();
  const diffHours = (showDateTime - Date.now()) / (1000 * 3600);
  let refundPercent = 0.75;
  if (diffHours >= 24) refundPercent = 1.0;
  else if (diffHours < 2) refundPercent = 0.5;

  const refundAmount = Number((booking.pricing.totalAmount * refundPercent).toFixed(2));

  booking.bookingStatus = 'cancelled';
  booking.paymentStatus = 'refunded';
  booking.refundAmount = refundAmount;
  booking.refundDate = new Date().toISOString();

  // Release the seats back to available in the cache
  if (store.seatMapCache[booking.showId]) {
    booking.seats.forEach((bs: any) => {
      const seat = store.seatMapCache[booking.showId].find(s => s.id === bs.seatId);
      if (seat) {
        seat.status = 'available';
      }
    });
  }

  // Decrement booked count on show
  const show = store.shows.find(s => s.id === booking.showId);
  if (show && show.bookedSeatsCount >= booking.seats.length) {
    show.bookedSeatsCount -= booking.seats.length;
  }

  persistStore();

  res.json({
    message: `Booking cancelled successfully. $${refundAmount} has been refunded to your original payment method.`,
    refundAmount,
    booking
  });
});

// Admin Analytics
app.get('/api/admin/analytics', (_req: Request, res: Response) => {
  const activeBookings = store.bookings.filter(b => b.bookingStatus === 'confirmed');
  const totalRevenue = activeBookings.reduce((sum, b) => sum + (b.pricing?.totalAmount || 0), 0);
  const totalTicketsSold = activeBookings.reduce((sum, b) => sum + (b.seats?.length || 0), 0);
  
  // Movie popularity
  const movieMap: Record<string, { movieId: string; title: string; ticketsSold: number; revenue: number }> = {};
  activeBookings.forEach(b => {
    if (!movieMap[b.movieId]) {
      movieMap[b.movieId] = {
        movieId: b.movieId,
        title: b.movieTitle,
        ticketsSold: 0,
        revenue: 0
      };
    }
    movieMap[b.movieId].ticketsSold += b.seats?.length || 0;
    movieMap[b.movieId].revenue += b.pricing?.totalAmount || 0;
  });

  const popularMovies = Object.values(movieMap).sort((a, b) => b.revenue - a.revenue);

  res.json({
    totalRevenue: Number(totalRevenue.toFixed(2)),
    totalTicketsSold,
    activeShowsCount: store.shows.length,
    averageOccupancyRate: 46.8,
    popularMovies
  });
});

// Reset / Seed catalog endpoint
app.post('/api/seed/reset', (_req: Request, res: Response) => {
  store.movies = INITIAL_MOVIES;
  store.theatres = INITIAL_THEATRES;
  store.shows = generateShows();
  store.concessions = INITIAL_CONCESSIONS;
  store.seatMapCache = {};
  store.lockedSeats = {};
  persistStore();
  res.json({ message: 'Catalog and schedules reset to factory seed data.' });
});

// Static assets & Vite dev server integration
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`IMovies Full-Stack server is live on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
