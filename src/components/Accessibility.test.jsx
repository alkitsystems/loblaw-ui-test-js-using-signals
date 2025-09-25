// Test cases:

// CampaignList has no basic accessibility violations
// Dashboard has no basic accessibility violations
// Login has no basic accessibility violations
// NavBar has no basic accessibility violations

import '@testing-library/jest-dom';
import { render, waitFor, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import { expect, test, beforeEach, afterEach, vi } from 'vitest';

// Extend expect for axe matcher
expect.extend(toHaveNoViolations);

// Mock AuthContext to always be authenticated
vi.mock('../context/AuthContext', async () => {
  const actual = await vi.importActual('../context/AuthContext');
  return {
    ...actual,
    useAuth: () => ({
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      username: 'tester',
    }),
  };
});

import CampaignList from './CampaignList';
import Dashboard from './Dashboard';
import Login from './Login';
import NavBar from './NavBar';

const mockCampaigns = [
  { id: 1, name: 'Red' },
  { id: 2, name: 'Blue' },
];

const mockMetrics = {
  impressions: 10,
  clicks: 5,
  users: 3,
};

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn((url) => {
      if (url === '/api/campaigns') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCampaigns),
        });
      }
      if (url.startsWith('/api/campaigns/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMetrics),
        });
      }
      return Promise.resolve({ ok: false });
    })
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

test('CampaignList has no basic accessibility violations', async () => {
  const { container } = render(
    <MemoryRouter initialEntries={['/']}>
      {' '}
      <CampaignList />{' '}
    </MemoryRouter>
  );
  await waitFor(() =>
    expect(screen.getByText(/Campaigns/i)).toBeInTheDocument()
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('Dashboard has no basic accessibility violations', async () => {
  const { container } = render(
    <MemoryRouter initialEntries={['/dashboard/1/Red']}>
      <Routes>
        <Route
          path='/dashboard/:cid/:cname'
          element={<Dashboard disablePolling={true} />}
        />
      </Routes>
    </MemoryRouter>
  );
  await waitFor(() =>
    expect(screen.getByText(/Dashboard for Red Campaign/i)).toBeInTheDocument()
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('Login has no basic accessibility violations', async () => {
  const { container } = render(
    <MemoryRouter initialEntries={['/']}>
      {' '}
      <Login />{' '}
    </MemoryRouter>
  );
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument()
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('NavBar has no basic accessibility violations (authenticated, dashboard view)', async () => {
  const { container } = render(
    <MemoryRouter initialEntries={['/dashboard/1/Red']}>
      <NavBar />
    </MemoryRouter>
  );
  // Back to Campaigns link should appear because path starts with /dashboard
  await waitFor(() =>
    expect(
      screen.getByRole('link', { name: /back to campaigns/i })
    ).toBeInTheDocument()
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('NavBar has no basic accessibility violations (unauthenticated)', async () => {
  // Override mock to simulate unauthenticated state just for this test
  const authMod = await import('../context/AuthContext');
  vi.spyOn(authMod, 'useAuth').mockReturnValue({
    isAuthenticated: false,
    login: vi.fn(),
    logout: vi.fn(),
    username: '',
  });
  const { container } = render(
    <MemoryRouter initialEntries={['/']}>
      {' '}
      <NavBar />{' '}
    </MemoryRouter>
  );
  await waitFor(() =>
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument()
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
