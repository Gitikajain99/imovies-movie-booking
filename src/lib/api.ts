import { 
  Movie, 
  Theatre, 
  Show, 
  Seat, 
  Booking, 
  ConcessionItem, 
  User, 
  AdminAnalytics,
  SelectedConcession,
  PaymentMethod 
} from '../types';

const BASE_URL = '';

export function getAuthToken(): string | null {
  return localStorage.getItem('imovies_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('imovies_token', token);
}

export function clearAuthToken() {
  localStorage.removeItem('imovies_token');
  localStorage.removeItem('imovies_user');
}

export function getCurrentUser(): User | null {
  const data = localStorage.getItem('imovies_user');
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  return null;
}

export function setCurrentUser(user: User) {
  localStorage.setItem('imovies_user', JSON.stringify(user));
  if (user.token) {
    setAuthToken(user.token);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data as T;
}

export const api = {
  // Auth
  async login(email: string, role?: 'user' | 'admin'): Promise<{ user: User; token: string }> {
    const res = await request<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, role }),
    });
    setCurrentUser(res.user);
    return res;
  },

  async register(name: string, email: string, phone?: string, role?: 'user' | 'admin'): Promise<{ user: User; token: string }> {
    const res = await request<{ user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, role }),
    });
    setCurrentUser(res.user);
    return res;
  },

  async getMe(): Promise<{ user: User }> {
    return request<{ user: User }>('/api/auth/me');
  },

  // Movies
  async getMovies(params?: {
    search?: string;
    genre?: string;
    language?: string;
    format?: string;
    status?: string;
  }): Promise<{ movies: Movie[]; total: number }> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.genre && params.genre !== 'All') query.append('genre', params.genre);
    if (params?.language && params.language !== 'All') query.append('language', params.language);
    if (params?.format && params.format !== 'All') query.append('format', params.format);
    if (params?.status && params.status !== 'All') query.append('status', params.status);

    const qs = query.toString();
    return request<{ movies: Movie[]; total: number }>(`/api/movies${qs ? `?${qs}` : ''}`);
  },

  async getMovie(id: string): Promise<{ movie: Movie }> {
    return request<{ movie: Movie }>(`/api/movies/${id}`);
  },

  async createMovie(data: Partial<Movie>): Promise<{ movie: Movie; message: string }> {
    return request<{ movie: Movie; message: string }>('/api/movies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteMovie(id: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/api/movies/${id}`, {
      method: 'DELETE',
    });
  },

  // Theatres
  async getTheatres(city?: string): Promise<{ theatres: Theatre[] }> {
    const qs = city && city !== 'All' ? `?city=${encodeURIComponent(city)}` : '';
    return request<{ theatres: Theatre[] }>(`/api/theatres${qs}`);
  },

  // Shows
  async getShows(params?: {
    movieId?: string;
    theatreId?: string;
    date?: string;
  }): Promise<{ shows: Show[] }> {
    const query = new URLSearchParams();
    if (params?.movieId) query.append('movieId', params.movieId);
    if (params?.theatreId) query.append('theatreId', params.theatreId);
    if (params?.date) query.append('date', params.date);

    const qs = query.toString();
    return request<{ shows: Show[] }>(`/api/shows${qs ? `?${qs}` : ''}`);
  },

  async getShow(id: string): Promise<{ show: Show; movie: Movie; theatre: Theatre }> {
    return request<{ show: Show; movie: Movie; theatre: Theatre }>(`/api/shows/${id}`);
  },

  async createShow(data: any): Promise<{ show: Show; message: string }> {
    return request<{ show: Show; message: string }>('/api/shows', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteShow(id: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/api/shows/${id}`, {
      method: 'DELETE',
    });
  },

  // Seats & Real-time Locking
  async getShowSeats(showId: string): Promise<{ showId: string; priceTiers: any; seats: Seat[] }> {
    return request<{ showId: string; priceTiers: any; seats: Seat[] }>(`/api/shows/${showId}/seats`);
  },

  async lockSeats(showId: string, seatIds: string[], userId: string): Promise<{ success: boolean; expiresAt: number }> {
    return request<{ success: boolean; expiresAt: number }>(`/api/shows/${showId}/lock-seats`, {
      method: 'POST',
      body: JSON.stringify({ seatIds, userId }),
    });
  },

  // Concessions
  async getConcessions(): Promise<{ concessions: ConcessionItem[] }> {
    return request<{ concessions: ConcessionItem[] }>('/api/concessions');
  },

  // Bookings
  async createBooking(payload: {
    userId: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    showId: string;
    selectedSeats: Seat[];
    selectedConcessions: SelectedConcession[];
    paymentMethod: PaymentMethod;
    discountCode?: string;
  }): Promise<{ booking: Booking; message: string }> {
    return request<{ booking: Booking; message: string }>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getBookings(userId?: string, role?: string): Promise<{ bookings: Booking[] }> {
    const query = new URLSearchParams();
    if (userId) query.append('userId', userId);
    if (role) query.append('role', role);
    const qs = query.toString();
    return request<{ bookings: Booking[] }>(`/api/bookings${qs ? `?${qs}` : ''}`);
  },

  async getBooking(id: string): Promise<{ booking: Booking }> {
    return request<{ booking: Booking }>(`/api/bookings/${id}`);
  },

  async cancelBooking(id: string): Promise<{ message: string; refundAmount: number; booking: Booking }> {
    return request<{ message: string; refundAmount: number; booking: Booking }>(`/api/bookings/${id}/cancel`, {
      method: 'POST',
    });
  },

  // Admin
  async getAdminAnalytics(): Promise<AdminAnalytics> {
    return request<AdminAnalytics>('/api/admin/analytics');
  },

  async resetSeedData(): Promise<{ message: string }> {
    return request<{ message: string }>('/api/seed/reset', {
      method: 'POST',
    });
  },
};
