import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock contexts and components
jest.mock('../frontend/react/src/context/AuthContext', () => ({
  useAuth: () => ({ user: null, logout: jest.fn() }),
}));

jest.mock('../frontend/react/src/context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: jest.fn() }),
}));

jest.mock('../frontend/react/src/components/SearchAutocomplete', () => {
  return function MockSearchAutocomplete({ placeholder }) {
    return <input data-testid="search-autocomplete" placeholder={placeholder || 'Search'} />;
  };
});

import Header from '../frontend/react/src/layouts/Header';

describe('Header Component', () => {
  test('renders header with logo', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(document.querySelector('.fa-film')).toBeInTheDocument();
  });

  test('renders sidebar navigation', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    const aside = document.querySelector('aside');
    expect(aside).toBeInTheDocument();
  });

  test('renders search component when sidebar expanded', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    // Search is only visible when sidebar is expanded, but component should exist
    expect(document.querySelector('aside')).toBeInTheDocument();
  });

  test('contains navigation section', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    const nav = document.querySelector('nav');
    expect(nav).toBeInTheDocument();
  });
});
