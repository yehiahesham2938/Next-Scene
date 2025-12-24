import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock dependencies
jest.mock('../../frontend/react/src/context/AuthContext', () => ({
  useAuth: () => ({ login: jest.fn() }),
}));

jest.mock('../../frontend/react/src/services/api', () => ({
  authAPI: {
    signin: jest.fn(() => Promise.resolve({ data: {}, status: 200 })),
  },
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

jest.mock('react-snowfall', () => {
  return function MockSnowfall() {
    return null;
  };
});

import SignIn from '../../frontend/react/src/pages/SignIn';

describe('SignIn Page', () => {
  test('renders sign in form', () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
  });

  test('renders email input', () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );
    expect(screen.getByTestId('input-email')).toBeInTheDocument();
  });

  test('renders password input', () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );
    expect(screen.getByTestId('input-password')).toBeInTheDocument();
  });

  test('renders sign in button', () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('renders link to sign up', () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
  });
});
