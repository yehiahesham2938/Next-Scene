import { render } from '@testing-library/react';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, style, ...props }) => (
      <div className={className} style={style} data-testid="motion-div">
        {children}
      </div>
    ),
  },
}));

import Skeleton from '../frontend/react/src/components/Skeleton';

describe('Skeleton Component', () => {
  test('renders skeleton element', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  test('applies default width class (w-full)', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('w-full');
  });

  test('applies default height class (h-4)', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('h-4');
  });

  test('applies custom width class', () => {
    const { container } = render(<Skeleton width="w-32" />);
    expect(container.firstChild).toHaveClass('w-32');
  });

  test('applies custom height class', () => {
    const { container } = render(<Skeleton height="h-8" />);
    expect(container.firstChild).toHaveClass('h-8');
  });

  test('applies custom className', () => {
    const { container } = render(<Skeleton className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  test('has base styling classes', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('bg-gray-200');
    expect(container.firstChild).toHaveClass('rounded');
  });

  test('contains animated motion div', () => {
    const { getByTestId } = render(<Skeleton />);
    expect(getByTestId('motion-div')).toBeInTheDocument();
  });
});
