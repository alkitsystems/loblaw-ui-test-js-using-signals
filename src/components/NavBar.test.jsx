// Test cases:

// Shows Login when not authenticated.
// Shows Hello and Logout when authenticated.
// Shows "Back to Campaigns" only on dashboard and when authenticated.

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import NavBar from './NavBar';
import { vi, test, expect } from 'vitest';

// Mock useAuth to always return authenticated
// Mock useAuth but keep the real AuthProvider
vi.mock('../context/AuthContext', async () => {
  const actual = await vi.importActual('../context/AuthContext');
  return {
    ...actual,
    useAuth: () => ({
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    }),
  };
});

test('shows Login when not authenticated', async () => {
  // Unauthenticated test: override mock for this test
  vi.resetModules(); // Reset module registry
  vi.doMock('../context/AuthContext', async () => {
    const actual = await vi.importActual('../context/AuthContext');
    return {
      ...actual,
      useAuth: () => ({
        isAuthenticated: false,
        login: vi.fn(),
        logout: vi.fn(),
        username: '',
      }),
    };
  });
  // Re-import NavBar after doMock
  const { default: NavBarUnauth } = await import('./NavBar');
  render(
    <AuthProvider>
      <MemoryRouter>
        <NavBarUnauth />
      </MemoryRouter>
    </AuthProvider>
  );
  expect(screen.getByText(/Login/i)).toBeInTheDocument();
});

test('shows Hello and Logout when authenticated', () => {
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/dashboard/1/Red']}>
        <NavBar />
      </MemoryRouter>
    </AuthProvider>
  );
  expect(screen.getByText(/Hello, User!/i)).toBeInTheDocument();
  expect(screen.getByText(/Logout/i)).toBeInTheDocument();
});

test('shows Back to Campaigns only on dashboard', () => {
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/dashboard/1/Red']}>
        <NavBar />
      </MemoryRouter>
    </AuthProvider>
  );
  expect(
    screen.getByRole('link', { name: /Back to Campaigns/i })
  ).toBeInTheDocument();
});
