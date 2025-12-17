const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Auth APIs
export const authAPI = {
  signup: async (email, password, username) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    });
    return response.json();
  },

  signin: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    return { data, status: response.status };
  },
};

// Movie APIs
export const movieAPI = {
  getAll: async (limit = null) => {
    const url = limit 
      ? `${API_BASE_URL}/api/movies?limit=${limit}`
      : `${API_BASE_URL}/api/movies`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch movies');
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/movies/${id}`);
    if (!response.ok) throw new Error('Failed to fetch movie');
    return response.json();
  },

  search: async (query) => {
    const response = await fetch(`${API_BASE_URL}/api/movies/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search movies');
    return response.json();
  },

  getByGenre: async (genre) => {
    const response = await fetch(`${API_BASE_URL}/api/movies/genre/${encodeURIComponent(genre)}`);
    if (!response.ok) throw new Error('Failed to fetch movies by genre');
    return response.json();
  },
};

// Watchlist APIs
export const watchlistAPI = {
  get: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/api/watchlist?userId=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch watchlist');
    return response.json();
  },

  add: async (userId, movieId) => {
    const response = await fetch(`${API_BASE_URL}/api/watchlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, movieId }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to add to watchlist' }));
      throw new Error(errorData.message || 'Failed to add to watchlist');
    }
    return response.json();
  },

  remove: async (userId, movieId) => {
    console.log('API remove called with:', { userId, movieId, url: `${API_BASE_URL}/api/watchlist/remove?userId=${userId}&movieId=${movieId}` });
    try {
      const response = await fetch(`${API_BASE_URL}/api/watchlist/remove?userId=${userId}&movieId=${movieId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, movieId }),
      });
      console.log('Remove response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch((e) => {
          console.error('Failed to parse error response:', e);
          return { message: `HTTP ${response.status}: Failed to remove from watchlist` };
        });
        console.error('Backend error:', errorData);
        throw new Error(errorData.message || 'Failed to remove from watchlist');
      }
      const result = await response.json();
      console.log('Remove successful:', result);
      return result;
    } catch (error) {
      console.error('API remove error:', error);
      throw error;
    }
  },

  markWatched: async (userId, movieId, watched = true) => {
    const response = await fetch(`${API_BASE_URL}/api/watchlist/watched`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, movieId, watched }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to mark as watched' }));
      throw new Error(errorData.message || 'Failed to mark as watched');
    }
    return response.json();
  },

  search: async (userId, query) => {
    const response = await fetch(`${API_BASE_URL}/api/watchlist/search?userId=${userId}&query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to search watchlist' }));
      throw new Error(errorData.message || 'Failed to search watchlist');
    }
    return response.json();
  },
};

// Admin APIs
export const adminAPI = {
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/stats`);
    if (!response.ok) throw new Error('Failed to fetch admin stats');
    return response.json();
  },

  getUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  getMostWatchlisted: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/most-watchlisted`);
    if (!response.ok) throw new Error('Failed to fetch most watchlisted movies');
    return response.json();
  },

  addMovie: async (movieData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/movies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movieData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to add movie' }));
      throw new Error(errorData.message || 'Failed to add movie');
    }
    return response.json();
  },

  updateMovie: async (id, movieData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/movies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movieData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update movie' }));
      throw new Error(errorData.message || 'Failed to update movie');
    }
    return response.json();
  },

  deleteMovie: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/movies/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to delete movie' }));
      throw new Error(errorData.message || 'Failed to delete movie');
    }
    return response.json();
  },

  updateUserRole: async (userId, role) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update user role' }));
      throw new Error(errorData.message || 'Failed to update user role');
    }
    return response.json();
  },

  deleteUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to delete user' }));
      throw new Error(errorData.message || 'Failed to delete user');
    }
    return response.json();
  },
};

export default {
  auth: authAPI,
  movies: movieAPI,
  watchlist: watchlistAPI,
  admin: adminAPI,
};
