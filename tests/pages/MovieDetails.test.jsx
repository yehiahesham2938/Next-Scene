import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Mock dependencies
jest.mock('../../frontend/react/src/context/AuthContext', () => ({
  useAuth: () => ({ user: { id: '1', role: 'user' } }),
}));

jest.mock('../../frontend/react/src/context/WatchlistContext', () => ({
  useWatchlist: () => ({
    watchlist: [],
    watchedMovies: [],
    addToWatchlist: jest.fn(),
    removeFromWatchlist: jest.fn(),
  }),
}));

jest.mock('../../frontend/react/src/services/api', () => ({
  movieAPI: {
    getById: jest.fn(() => Promise.resolve({
      _id: '1',
      title: 'Test Movie',
      genre: 'Action',
      director: 'Test Director',
      releaseYear: 2024,
      rating: 8.5,
      description: 'Test description',
    })),
    getAll: jest.fn(() => Promise.resolve([])),
  },
  adminAPI: {},
}));

jest.mock('../../frontend/react/src/components/LoadingSpinner', () => {
  return function MockLoadingSpinner() {
    return <div data-testid="loading-spinner">Loading...</div>;
  };
});

import MovieDetails from '../../frontend/react/src/pages/MovieDetails';

describe('MovieDetails Page', () => {
  const renderWithRouter = () => {
    return render(
      <MemoryRouter initialEntries={['/movie/1']}>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('renders loading state initially', () => {
    renderWithRouter();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
