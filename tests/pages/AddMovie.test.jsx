import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock dependencies
jest.mock('../../frontend/react/src/services/api', () => ({
  adminAPI: {
    addMovie: jest.fn(() => Promise.resolve({ _id: '123' })),
  },
}));

import AddMovie from '../../frontend/react/src/pages/AddMovie';

describe('AddMovie Page', () => {
  test('renders add movie form', () => {
    render(
      <MemoryRouter>
        <AddMovie />
      </MemoryRouter>
    );
    expect(screen.getByText(/add new movie/i)).toBeInTheDocument();
  });

  test('renders title input', () => {
    render(
      <MemoryRouter>
        <AddMovie />
      </MemoryRouter>
    );
    const titleInput = document.querySelector('input[name="title"]');
    expect(titleInput).toBeInTheDocument();
  });

  test('renders director input', () => {
    render(
      <MemoryRouter>
        <AddMovie />
      </MemoryRouter>
    );
    const directorInput = document.querySelector('input[name="director"]');
    expect(directorInput).toBeInTheDocument();
  });

  test('renders genre select', () => {
    render(
      <MemoryRouter>
        <AddMovie />
      </MemoryRouter>
    );
    const genreSelect = document.querySelector('select[name="genre"]');
    expect(genreSelect).toBeInTheDocument();
  });

  test('renders submit button', () => {
    render(
      <MemoryRouter>
        <AddMovie />
      </MemoryRouter>
    );
    // Use role query to find submit button specifically
    const submitButton = screen.getByRole('button', { name: /add movie/i });
    expect(submitButton).toBeInTheDocument();
  });

  test('renders cancel button', () => {
    render(
      <MemoryRouter>
        <AddMovie />
      </MemoryRouter>
    );
    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
  });
});
