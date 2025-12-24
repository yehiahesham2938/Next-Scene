import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Mock contexts and components
jest.mock('../frontend/react/src/context/AuthContext', () => ({
  useAuth: () => ({ user: null, logout: jest.fn() }),
}));

jest.mock('../frontend/react/src/context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: jest.fn() }),
}));

jest.mock('../frontend/react/src/layouts/Header', () => {
  return function MockHeader() {
    return <header data-testid="header">Header</header>;
  };
});

jest.mock('../frontend/react/src/layouts/Footer', () => {
  return function MockFooter() {
    return <footer data-testid="footer">Footer</footer>;
  };
});

jest.mock('../frontend/react/src/components/Toaster', () => {
  return function MockToaster() {
    return <div data-testid="toaster">Toaster</div>;
  };
});

import MainLayout from '../frontend/react/src/layouts/MainLayout';

describe('MainLayout Component', () => {
  const renderWithRoute = (route = '/') => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<div data-testid="home">Home</div>} />
            <Route path="/signin" element={<div data-testid="signin">Sign In</div>} />
            <Route path="/signup" element={<div data-testid="signup">Sign Up</div>} />
            <Route path="/browse" element={<div data-testid="browse">Browse</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
  };

  test('renders Header component', () => {
    renderWithRoute('/');
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  test('renders main content area', () => {
    renderWithRoute('/');
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('renders Toaster component', () => {
    renderWithRoute('/');
    expect(screen.getByTestId('toaster')).toBeInTheDocument();
  });

  test('renders child route content', () => {
    renderWithRoute('/');
    expect(screen.getByTestId('home')).toBeInTheDocument();
  });

  test('hides footer on signin page', () => {
    renderWithRoute('/signin');
    expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
  });

  test('hides footer on signup page', () => {
    renderWithRoute('/signup');
    expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
  });

  test('shows footer on other pages', () => {
    renderWithRoute('/browse');
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('has correct layout structure', () => {
    const { container } = renderWithRoute('/');
    expect(container.querySelector('.flex.flex-col.min-h-screen')).toBeInTheDocument();
  });
});
