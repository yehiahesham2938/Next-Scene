import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock the API
jest.mock('../frontend/react/src/services/api', () => ({
  movieAPI: {
    getAll: jest.fn(() => Promise.resolve([
      { _id: '1', title: 'Test Movie', genre: 'Action', director: 'John Doe', cast: ['Actor 1'] },
      { _id: '2', title: 'Another Movie', genre: 'Drama', director: 'Jane Smith', cast: ['Actor 2'] },
    ])),
  },
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

import SearchAutocomplete from '../frontend/react/src/components/SearchAutocomplete';

describe('SearchAutocomplete Component', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
    placeholder: 'Search movies...',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders input element', () => {
    render(
      <MemoryRouter>
        <SearchAutocomplete {...defaultProps} />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText('Search movies...')).toBeInTheDocument();
  });

  test('renders with custom placeholder', () => {
    render(
      <MemoryRouter>
        <SearchAutocomplete {...defaultProps} placeholder="Custom placeholder" />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });

  test('calls onChange when typing', () => {
    const onChange = jest.fn();
    render(
      <MemoryRouter>
        <SearchAutocomplete {...defaultProps} onChange={onChange} />
      </MemoryRouter>
    );
    
    const input = screen.getByPlaceholderText('Search movies...');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(onChange).toHaveBeenCalledWith('test');
  });

  test('displays value prop in input', () => {
    render(
      <MemoryRouter>
        <SearchAutocomplete {...defaultProps} value="search term" />
      </MemoryRouter>
    );
    expect(screen.getByDisplayValue('search term')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    render(
      <MemoryRouter>
        <SearchAutocomplete {...defaultProps} className="custom-class" />
      </MemoryRouter>
    );
    const input = screen.getByPlaceholderText('Search movies...');
    expect(input).toHaveClass('custom-class');
  });
});
