import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock dependencies
jest.mock('../../frontend/react/src/services/api', () => ({
  movieAPI: {
    getAll: jest.fn(() => Promise.resolve([
      { _id: '1', title: 'Movie 1', genre: 'Action', releaseYear: 2024 },
    ])),
  },
  adminAPI: {
    deleteMovie: jest.fn(),
  },
}));

import AdminBrowse from '../../frontend/react/src/pages/AdminBrowse';

describe('AdminBrowse Page', () => {
  test('renders admin browse page with loading spinner', () => {
    render(
      <MemoryRouter>
        <AdminBrowse />
      </MemoryRouter>
    );
    // Loading spinner appears initially
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  test('renders content after loading', async () => {
    render(
      <MemoryRouter>
        <AdminBrowse />
      </MemoryRouter>
    );
    // Wait for content to load - look for Browse Movies title
    const browseTitle = await screen.findByText(/browse movies/i, {}, { timeout: 3000 });
    expect(browseTitle).toBeInTheDocument();
  });
});
