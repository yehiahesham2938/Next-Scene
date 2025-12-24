import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock all dependencies
jest.mock('../../frontend/react/src/context/AuthContext', () => ({
  useAuth: () => ({ user: null }),
}));

jest.mock('../../frontend/react/src/services/api', () => ({
  movieAPI: {
    getAll: jest.fn(() => Promise.resolve([])),
  },
}));

jest.mock('../../frontend/react/src/components/MovieCard', () => {
  return function MockMovieCard({ movie }) {
    return <div data-testid="movie-card">{movie.title}</div>;
  };
});

jest.mock('../../frontend/react/src/components/LoadingSpinner', () => {
  return function MockLoadingSpinner() {
    return <div data-testid="loading-spinner">Loading...</div>;
  };
});

jest.mock('../../frontend/react/src/components/SearchAutocomplete', () => {
  return function MockSearchAutocomplete() {
    return <input data-testid="search-autocomplete" />;
  };
});

import Home from '../../frontend/react/src/pages/Home';

describe('Home Page', () => {
  test('renders home page', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    // Check loading spinner appears initially
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('renders search component', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByTestId('search-autocomplete')).toBeInTheDocument();
  });
});
