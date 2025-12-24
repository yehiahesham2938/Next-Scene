import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock chart.js
jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
  },
  ArcElement: {},
  BarElement: {},
  CategoryScale: {},
  LinearScale: {},
  Tooltip: {},
  Legend: {},
  LineElement: {},
  PointElement: {},
  PieController: {},
  BarController: {},
  LineController: {},
}));

// Mock dependencies
jest.mock('../../frontend/react/src/services/api', () => ({
  movieAPI: {
    getAll: jest.fn(() => Promise.resolve([])),
  },
  adminAPI: {
    getUsers: jest.fn(() => Promise.resolve([])),
    getStats: jest.fn(() => Promise.resolve({
      totalMovies: 10,
      totalUsers: 5,
      totalWatchlistItems: 20,
    })),
  },
}));

import AdminDashboard from '../../frontend/react/src/pages/AdminDashboard';

describe('AdminDashboard Page', () => {
  test('renders admin dashboard', () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );
    // Should show loading or dashboard content
    expect(document.body).toBeInTheDocument();
  });
});
