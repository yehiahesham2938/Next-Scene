import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../frontend/react/src/components/LoadingSpinner';

describe('LoadingSpinner Component', () => {
  test('renders with default message', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders with custom message', () => {
    render(<LoadingSpinner message="Please wait..." />);
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  test('renders without message when message is empty', () => {
    render(<LoadingSpinner message="" />);
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  test('applies small size class', () => {
    const { container } = render(<LoadingSpinner size="small" />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass('w-8', 'h-8');
  });

  test('applies medium size class by default', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass('w-12', 'h-12');
  });

  test('applies large size class', () => {
    const { container } = render(<LoadingSpinner size="large" />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass('w-16', 'h-16');
  });

  test('has spinner animation class', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});
