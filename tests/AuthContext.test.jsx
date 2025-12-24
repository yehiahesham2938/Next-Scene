import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider, useAuth } from '../frontend/react/src/context/AuthContext';

// Mock auth utils
jest.mock('../frontend/react/src/utils/auth', () => ({
  getUser: jest.fn(() => null),
  setUser: jest.fn(),
  removeUser: jest.fn(),
}));

import { getUser, setUser, removeUser } from '../frontend/react/src/utils/auth';

// Test component to access context
const TestConsumer = () => {
  const { user, login, logout, updateUser, isAdmin, loading } = useAuth();
  return (
    <div>
      <span data-testid="user-value">{user ? user.email : 'no-user'}</span>
      <span data-testid="is-admin">{isAdmin ? 'admin' : 'not-admin'}</span>
      <span data-testid="loading">{loading ? 'loading' : 'not-loading'}</span>
      <button onClick={() => login({ email: 'test@test.com', role: 'user' })}>Login</button>
      <button onClick={logout}>Logout</button>
      <button onClick={() => updateUser({ email: 'updated@test.com', role: 'admin' })}>Update</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getUser.mockReturnValue(null);
  });

  test('provides null user by default', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    expect(screen.getByTestId('user-value')).toHaveTextContent('no-user');
  });

  test('login sets user', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    
    fireEvent.click(screen.getByText('Login'));
    expect(screen.getByTestId('user-value')).toHaveTextContent('test@test.com');
    expect(setUser).toHaveBeenCalledWith({ email: 'test@test.com', role: 'user' });
  });

  test('logout clears user', () => {
    getUser.mockReturnValue({ email: 'test@test.com' });
    
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    
    fireEvent.click(screen.getByText('Logout'));
    expect(screen.getByTestId('user-value')).toHaveTextContent('no-user');
    expect(removeUser).toHaveBeenCalled();
  });

  test('updateUser updates user data', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    
    fireEvent.click(screen.getByText('Update'));
    expect(screen.getByTestId('user-value')).toHaveTextContent('updated@test.com');
    expect(setUser).toHaveBeenCalledWith({ email: 'updated@test.com', role: 'admin' });
  });

  test('isAdmin is true when user has admin role', () => {
    getUser.mockReturnValue({ email: 'admin@test.com', role: 'admin' });
    
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('is-admin')).toHaveTextContent('admin');
  });

  test('isAdmin is false when user is not admin', () => {
    getUser.mockReturnValue({ email: 'user@test.com', role: 'user' });
    
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('is-admin')).toHaveTextContent('not-admin');
  });

  test('useAuth throws error when used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => render(<TestConsumer />)).toThrow('useAuth must be used within AuthProvider');
    
    consoleError.mockRestore();
  });

  test('loads user from storage on mount', () => {
    getUser.mockReturnValue({ email: 'stored@test.com', role: 'user' });
    
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('user-value')).toHaveTextContent('stored@test.com');
  });
});
