import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock chart.js
jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
  },
  ArcElement: {},
  CategoryScale: {},
  LinearScale: {},
  BarElement: {},
  Tooltip: {},
  Legend: {},
}));

// Mock dependencies
jest.mock('../../frontend/react/src/context/WatchlistContext', () => ({
  useWatchlist: () => ({
    watchlist: [],
    watchedMovies: [],
  }),
}));

jest.mock('../../frontend/react/src/context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

jest.mock('../../frontend/react/src/services/api', () => ({
  movieAPI: {
    getAll: jest.fn(() => Promise.resolve([])),
  },
}));

jest.mock('../../frontend/react/src/components/LoadingSpinner', () => {
  return function MockLoadingSpinner() {
    return <div data-testid="loading-spinner">Loading...</div>;
  };
});

import Dashboard from '../../frontend/react/src/pages/Dashboard';

describe('Dashboard Page', () => {
  test('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
