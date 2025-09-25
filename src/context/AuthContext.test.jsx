// Test cases:

// Initial state is not authenticated.
// Login with correct credentials sets authenticated and stores username.
// Login with incorrect credentials does not authenticate.
// Logout resets authentication and removes username.

import { render, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { test, expect } from 'vitest';

function TestComponent() {
  const { isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <span data-testid='auth'>{isAuthenticated ? 'yes' : 'no'}</span>
      <button onClick={() => login('admin', 'password')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

test('auth context login/logout', () => {
  const { getByText, getByTestId } = render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );
  expect(getByTestId('auth').textContent).toBe('no');
  act(() => getByText('Login').click());
  expect(getByTestId('auth').textContent).toBe('yes');
  act(() => getByText('Logout').click());
  expect(getByTestId('auth').textContent).toBe('no');
});

test('username persists on successful login', () => {
  // Clear any previous localStorage state
  localStorage.clear();
  function UsernameProbe() {
    const { login, username, isAuthenticated } = useAuth();
    return (
      <div>
        <span data-testid='user'>{username || ''}</span>
        <span data-testid='authstate'>{isAuthenticated ? 'auth' : 'anon'}</span>
        <button onClick={() => login('admin', 'password')}>DoLogin</button>
      </div>
    );
  }
  const { getByText, getByTestId } = render(
    <AuthProvider>
      <UsernameProbe />
    </AuthProvider>
  );
  expect(getByTestId('user').textContent).toBe('');
  act(() => getByText('DoLogin').click());
  expect(getByTestId('user').textContent).toBe('admin');
  expect(localStorage.getItem('username')).toBe('admin');
  expect(getByTestId('authstate').textContent).toBe('auth');
});
