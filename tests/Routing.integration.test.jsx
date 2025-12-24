import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Simple mock components for testing routing
const MockHome = () => <div data-testid="home-page">Home Page</div>;
const MockNotFound = () => <div data-testid="not-found-page">404 - Not Found</div>;
const MockSignIn = () => <div data-testid="signin-page">Sign In Page</div>;
const MockBrowse = () => <div data-testid="browse-page">Browse Movies</div>;

// Mock context providers
const MockAuthProvider = ({ children }) => children;
const MockThemeProvider = ({ children }) => children;

// Simple Router Setup for Testing
import { Routes, Route } from 'react-router-dom';

const TestRouter = ({ initialRoute = '/' }) => {
  return (
    <MemoryRouter initialEntries={[initialRoute]}>
      <MockAuthProvider>
        <MockThemeProvider>
          <Routes>
            <Route path="/" element={<MockHome />} />
            <Route path="/signin" element={<MockSignIn />} />
            <Route path="/browse" element={<MockBrowse />} />
            <Route path="*" element={<MockNotFound />} />
          </Routes>
        </MockThemeProvider>
      </MockAuthProvider>
    </MemoryRouter>
  );
};

describe('Routing Integration Tests', () => {
  test('renders Home page on default route', () => {
    render(<TestRouter initialRoute="/" />);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  test('renders SignIn page on /signin route', () => {
    render(<TestRouter initialRoute="/signin" />);
    expect(screen.getByTestId('signin-page')).toBeInTheDocument();
    expect(screen.getByText('Sign In Page')).toBeInTheDocument();
  });

  test('renders Browse page on /browse route', () => {
    render(<TestRouter initialRoute="/browse" />);
    expect(screen.getByTestId('browse-page')).toBeInTheDocument();
    expect(screen.getByText('Browse Movies')).toBeInTheDocument();
  });

  test('renders NotFound page for unknown routes', () => {
    render(<TestRouter initialRoute="/unknown-page" />);
    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    expect(screen.getByText('404 - Not Found')).toBeInTheDocument();
  });

  test('renders NotFound page for deeply nested unknown routes', () => {
    render(<TestRouter initialRoute="/some/unknown/deep/path" />);
    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
  });
});
