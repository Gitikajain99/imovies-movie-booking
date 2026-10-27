export type MovieFormat = 'IMAX 3D' | 'Dolby Atmos' | '4DX' | 'Standard 2D';
export type MovieGenre = 'Action' | 'Sci-Fi' | 'Adventure' | 'Thriller' | 'Drama' | 'Animation' | 'Comedy' | 'Horror';
export type MovieLanguage = 'English' | 'Spanish' | 'Hindi' | 'French' | 'Japanese';
export type MovieStatus = 'now_showing' | 'coming_soon';

export interface Movie {
  id: string;
  title: string;
  tagline: string;
  synopsis: string;
  posterUrl: string;
  backdropUrl?: string;
  genres: MovieGenre[];
  durationMins: number;
  rating: number; // e.g. 8.8
  voteCount: number;
  releaseDate: string;
  language: MovieLanguage;
  ageRating: 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';
  status: MovieStatus;
  director: string;
  cast: string[];
  formats: MovieFormat[];
  trailerUrl?: string;
}

export interface TheatreScreen {
  screenNumber: number;
  name: string;
  formats: MovieFormat[];
  totalSeats: number;
}

export interface Theatre {
  id: string;
  name: string;
  chain: string;
  city: string;
  address: string;
  screens: TheatreScreen[];
  amenities: string[];
}

export interface PriceTiers {
  standard: number;
  prime: number;
  recliner: number;
}

export interface Show {
  id: string;
  movieId: string;
  theatreId: string;
  screenNumber: number;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "07:30 PM"
  format: MovieFormat;
  priceTiers: PriceTiers;
  totalSeats: number;
  bookedSeatsCount: number;
}

export type SeatTier = 'standard' | 'prime' | 'recliner';
export type SeatStatus = 'available' | 'selected' | 'booked' | 'locked';

export interface Seat {
  id: string; // e.g. "F-8"
  row: string; // "F"
  number: number; // 8
  tier: SeatTier;
  price: number;
  status: SeatStatus;
  lockedBy?: string;
  lockExpiresAt?: number;
}

export interface ConcessionItem {
  id: string;
  name: string;
  description: string;
  category: 'Popcorn' | 'Combos' | 'Beverages' | 'Hot Snacks' | 'Sweets';
  price: number;
  calories?: number;
  imageUrl?: string;
}

export interface SelectedConcession {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface BookingSeat {
  seatId: string;
  row: string;
  number: number;
  tier: SeatTier;
  price: number;
}

export interface PricingBreakdown {
  seatsTotal: number;
  concessionsTotal: number;
  bookingFee: number;
  tax: number;
  discount: number;
  totalAmount: number;
}

export type BookingStatus = 'confirmed' | 'cancelled' | 'completed';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'instant_pay' | 'apple_pay' | 'gift_card';

export interface Booking {
  id: string;
  bookingCode: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  theatreId: string;
  theatreName: string;
  screenNumber: number;
  showId: string;
  showDate: string;
  showTime: string;
  format: MovieFormat;
  seats: BookingSeat[];
  concessions: SelectedConcession[];
  pricing: PricingBreakdown;
  paymentMethod: PaymentMethod;
  paymentStatus: 'completed' | 'refunded';
  bookingStatus: BookingStatus;
  qrCodeData: string;
  createdAt: string;
  refundAmount?: number;
  refundDate?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  token?: string;
}

export interface AdminAnalytics {
  totalRevenue: number;
  totalTicketsSold: number;
  activeShowsCount: number;
  averageOccupancyRate: number;
  popularMovies: {
    movieId: string;
    title: string;
    ticketsSold: number;
    revenue: number;
  }[];
}
