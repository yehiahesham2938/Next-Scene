import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../frontend/react/src/components/Input';

describe('Input Component', () => {
  test('renders input element', () => {
    render(<Input id="test-input" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('renders with label when provided', () => {
    render(<Input id="test-input" label="Username" />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  test('renders without label when not provided', () => {
    render(<Input id="test-input" />);
    expect(screen.queryByRole('label')).not.toBeInTheDocument();
  });

  test('handles value changes', () => {
    const handleChange = jest.fn();
    render(<Input id="test-input" value="" onChange={handleChange} />);
    
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });
    expect(handleChange).toHaveBeenCalled();
  });

  test('displays placeholder text', () => {
    render(<Input id="test-input" placeholder="Enter your name" />);
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
  });

  test('displays error message when provided', () => {
    render(<Input id="test-input" error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  test('does not display error when not provided', () => {
    render(<Input id="test-input" />);
    expect(screen.queryByText('This field is required')).not.toBeInTheDocument();
  });

  test('applies required attribute', () => {
    render(<Input id="test-input" required />);
    expect(screen.getByRole('textbox')).toBeRequired();
  });

  test('renders with different input types', () => {
    render(<Input id="test-input" type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
  });

  test('applies custom className', () => {
    render(<Input id="test-input" className="custom-class" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });
});
