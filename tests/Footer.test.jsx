import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock contexts
jest.mock('../frontend/react/src/context/AuthContext', () => ({
  useAuth: () => ({ user: null }),
}));

jest.mock('../frontend/react/src/context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: jest.fn() }),
}));

jest.mock('../frontend/react/src/components/SearchAutocomplete', () => {
  return function MockSearchAutocomplete() {
    return <input data-testid="search-autocomplete" placeholder="Search" />;
  };
});

import Footer from '../frontend/react/src/layouts/Footer';

describe('Footer Component', () => {
  const renderFooter = (user = null) => {
    jest.doMock('../frontend/react/src/context/AuthContext', () => ({
      useAuth: () => ({ user }),
    }));
    
    return render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
  };

  test('renders footer navigation', () => {
    renderFooter();
    expect(document.querySelector('nav')).toBeInTheDocument();
  });

  test('renders mobile navigation on small screens', () => {
    renderFooter();
    const nav = document.querySelector('nav.sm\\:hidden');
    expect(nav).toBeInTheDocument();
  });

  test('contains navigation links', () => {
    renderFooter();
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });
});
