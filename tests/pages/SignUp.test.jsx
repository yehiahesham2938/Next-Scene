import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock dependencies
jest.mock('../../frontend/react/src/context/AuthContext', () => ({
  useAuth: () => ({ login: jest.fn() }),
}));

jest.mock('../../frontend/react/src/services/api', () => ({
  authAPI: {
    signup: jest.fn(() => Promise.resolve({ _id: '123' })),
  },
}));

jest.mock('../../frontend/react/src/utils/helpers', () => ({
  isValidPassword: jest.fn(() => ({ valid: true })),
}));

jest.mock('../../frontend/react/src/components/Input', () => {
  return function MockInput({ label, id, value, onChange, type, placeholder }) {
    return (
      <div>
        {label && <label htmlFor={id}>{label}</label>}
        <input
          id={id}
          type={type || 'text'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          data-testid={`input-${id}`}
        />
      </div>
    );
  };
});

jest.mock('../../frontend/react/src/components/Button', () => {
  return function MockButton({ children, type, onClick }) {
    return <button type={type} onClick={onClick}>{children}</button>;
  };
});

import SignUp from '../../frontend/react/src/pages/SignUp';

describe('SignUp Page', () => {
  test('renders sign up form', () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );
    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });

  test('renders email input', () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );
    expect(screen.getByTestId('input-email')).toBeInTheDocument();
  });

  test('renders username input', () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );
    expect(screen.getByTestId('input-username')).toBeInTheDocument();
  });

  test('renders password input', () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );
    expect(screen.getByTestId('input-password')).toBeInTheDocument();
  });

  test('renders confirm password input', () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );
    expect(screen.getByTestId('input-confirmPassword')).toBeInTheDocument();
  });

  test('renders sign up button', () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('renders link to sign in', () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
  });
});
