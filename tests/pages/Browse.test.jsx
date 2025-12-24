import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

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
    getAll: jest.fn(() => Promise.resolve([
      { _id: '1', title: 'Movie 1', genre: 'Action', releaseYear: 2024 },
      { _id: '2', title: 'Movie 2', genre: 'Drama', releaseYear: 2023 },
    ])),
  },
}));

jest.mock('../../frontend/react/src/components/MovieGridSkeleton', () => {
  return function MockMovieGridSkeleton() {
    return <div data-testid="movie-grid-skeleton">Loading...</div>;
  };
});

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }) => <div className={className}>{children}</div>,
  },
  AnimatePresence: ({ children }) => children,
}));

import Browse from '../../frontend/react/src/pages/Browse';

describe('Browse Page', () => {
  test('renders browse page', () => {
    render(
      <MemoryRouter>
        <Browse />
      </MemoryRouter>
    );
    // Check loading state initially - there are multiple skeleton elements for mobile/desktop
    const skeletons = screen.getAllByTestId('movie-grid-skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  test('renders filter controls', async () => {
    render(
      <MemoryRouter>
        <Browse />
      </MemoryRouter>
    );
    // Search input should exist
    const searchInput = document.querySelector('input[type="text"]');
    expect(searchInput).toBeInTheDocument();
  });
});
