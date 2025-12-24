import { render, screen, fireEvent } from '@testing-library/react';

// Mock the ThemeContext
const mockToggleTheme = jest.fn();
jest.mock('../frontend/react/src/context/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: mockToggleTheme,
  }),
}));

import ThemeToggle from '../frontend/react/src/components/ThemeToggle';

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    mockToggleTheme.mockClear();
  });

  test('renders toggle button', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('has correct aria-label', () => {
    render(<ThemeToggle />);
    expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument();
  });

  test('calls toggleTheme when clicked', () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  test('renders moon icon in light mode', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button.querySelector('.fa-moon')).toBeInTheDocument();
  });
});

describe('ThemeToggle in Dark Mode', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('renders sun icon in dark mode', () => {
    jest.doMock('../frontend/react/src/context/ThemeContext', () => ({
      useTheme: () => ({
        theme: 'dark',
        toggleTheme: jest.fn(),
      }),
    }));
    
    // Re-import to get updated mock
    const { default: ThemeToggleDark } = require('../frontend/react/src/components/ThemeToggle');
    render(<ThemeToggleDark />);
    const button = screen.getByRole('button');
    expect(button.querySelector('.fa-sun')).toBeInTheDocument();
  });
});
