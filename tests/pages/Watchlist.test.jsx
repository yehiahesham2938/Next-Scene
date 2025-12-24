import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock dependencies
jest.mock('../../frontend/react/src/context/WatchlistContext', () => ({
  useWatchlist: () => ({
    watchlist: [],
    watchedMovies: [],
    loading: false,
    removeFromWatchlist: jest.fn(),
    markAsWatched: jest.fn(),
  }),
}));

jest.mock('../../frontend/react/src/context/ToastContext', () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

jest.mock('../../frontend/react/src/components/LoadingSpinner', () => {
  return function MockLoadingSpinner() {
    return <div data-testid="loading-spinner">Loading...</div>;
  };
});

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }) => <div className={className}>{children}</div>,
    button: ({ children, className, onClick, ...props }) => (
      <button className={className} onClick={onClick}>{children}</button>
    ),
    span: ({ children, className, ...props }) => <span className={className}>{children}</span>,
    a: ({ children, className, href, ...props }) => <a className={className} href={href}>{children}</a>,
    p: ({ children, className, ...props }) => <p className={className}>{children}</p>,
    img: ({ className, src, alt, ...props }) => <img className={className} src={src} alt={alt} />,
    section: ({ children, className, ...props }) => <section className={className}>{children}</section>,
    article: ({ children, className, ...props }) => <article className={className}>{children}</article>,
    li: ({ children, className, ...props }) => <li className={className}>{children}</li>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
  useAnimation: () => ({ start: jest.fn() }),
  useInView: () => [null, true],
}));

import Watchlist from '../../frontend/react/src/pages/Watchlist';

describe('Watchlist Page', () => {
  test('renders watchlist page', () => {
    render(
      <MemoryRouter>
        <Watchlist />
      </MemoryRouter>
    );
    expect(screen.getByText('My Watchlist')).toBeInTheDocument();
  });

  test('renders tab buttons', () => {
    render(
      <MemoryRouter>
        <Watchlist />
      </MemoryRouter>
    );
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('To Watch')).toBeInTheDocument();
    expect(screen.getByText('Watched')).toBeInTheDocument();
  });

  test('renders filter buttons', () => {
    render(
      <MemoryRouter>
        <Watchlist />
      </MemoryRouter>
    );
    expect(screen.getByText('Recently Added')).toBeInTheDocument();
  });

  test('shows empty state when no movies', () => {
    render(
      <MemoryRouter>
        <Watchlist />
      </MemoryRouter>
    );
    expect(screen.getByText(/your watchlist is empty/i)).toBeInTheDocument();
  });
});
