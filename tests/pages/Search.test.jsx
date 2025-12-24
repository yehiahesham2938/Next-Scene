import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock dependencies
jest.mock('../../frontend/react/src/services/api', () => ({
  movieAPI: {
    search: jest.fn(() => Promise.resolve([])),
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

import Search from '../../frontend/react/src/pages/Search';

describe('Search Page', () => {
  test('renders search results heading', () => {
    render(
      <MemoryRouter initialEntries={['/search?q=test']}>
        <Search />
      </MemoryRouter>
    );
    expect(screen.getByText(/search results for/i)).toBeInTheDocument();
  });

  test('shows loading spinner initially', () => {
    render(
      <MemoryRouter initialEntries={['/search?q=test']}>
        <Search />
      </MemoryRouter>
    );
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('displays search query in heading', () => {
    render(
      <MemoryRouter initialEntries={['/search?q=matrix']}>
        <Search />
      </MemoryRouter>
    );
    expect(screen.getByText(/matrix/i)).toBeInTheDocument();
  });
});
