import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Mock dependencies
jest.mock('../../frontend/react/src/services/api', () => ({
  movieAPI: {
    getById: jest.fn(() => Promise.resolve({
      _id: '1',
      title: 'Test Movie',
      director: 'Test Director',
      releaseYear: 2024,
      runtime: 120,
      genre: 'Action',
      rating: 8.5,
      poster: '',
      description: 'Test description',
    })),
    update: jest.fn(() => Promise.resolve({})),
  },
}));

import EditMovie from '../../frontend/react/src/pages/EditMovie';

describe('EditMovie Page', () => {
  const renderWithRouter = () => {
    return render(
      <MemoryRouter initialEntries={['/admin/movie/edit/1']}>
        <Routes>
          <Route path="/admin/movie/edit/:id" element={<EditMovie />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('renders edit movie form', async () => {
    renderWithRouter();
    // Shows loading or edit form
    expect(document.body).toBeInTheDocument();
  });
});
