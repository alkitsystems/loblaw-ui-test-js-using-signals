// Test cases:

// Renders dashboard metrics after loading.
// Shows error on fetch failure.
// Shows skeleton while loading.
// Increments iteration during polling.
// Clears polling interval on unmount.

import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi, test, beforeEach, afterEach, expect } from 'vitest';

// Mock useAuth to always return authenticated and a username
vi.mock('../context/AuthContext', async () => {
  const actual = await vi.importActual('../context/AuthContext');
  return {
    ...actual,
    useAuth: () => ({
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      username: 'admin',
    }),
  };
});

import Dashboard from './Dashboard';

const mockMetrics = {
  impressions: 10,
  clicks: 5,
  users: 3,
  conversions: 2,
  revenue: 100,
  cost: 50,
  ctr: 0.5,
  cpc: 10,
  roi: 2,
};

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockMetrics),
      })
    )
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

test('renders dashboard metrics after loading', async () => {
  render(
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

  expect(await screen.findAllByTestId('tile')).toHaveLength(9);
  expect(
    screen.getByTestId('tile-label-total-impressions')
  ).toBeInTheDocument();
  expect(screen.getByTestId('tile-label-total-clicks')).toBeInTheDocument();
  expect(screen.getByTestId('tile-label-total-ctr-(%)')).toBeInTheDocument();
  expect(screen.getByTestId('tile-label-total-users')).toBeInTheDocument();
  expect(screen.getByTestId('tile-label-current-number')).toBeInTheDocument();
  expect(
    screen.getByTestId('tile-label-most-recent-impressions')
  ).toBeInTheDocument();
  expect(
    screen.getByTestId('tile-label-most-recent-clicks')
  ).toBeInTheDocument();
  expect(
    screen.getByTestId('tile-label-most-recent-ctr-(%)')
  ).toBeInTheDocument();
  expect(
    screen.getByTestId('tile-label-most-recent-users')
  ).toBeInTheDocument();
});

test('shows error on fetch failure', async () => {
  global.fetch.mockImplementationOnce(() => Promise.resolve({ ok: false }));
  render(
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
    expect(screen.getByText(/Failed to fetch metrics/i)).toBeInTheDocument()
  );
});

test('shows skeleton while loading', async () => {
  render(
    <MemoryRouter initialEntries={['/dashboard/1/Red']}>
      <Routes>
        <Route
          path='/dashboard/:cid/:cname'
          element={<Dashboard disablePolling={true} />}
        />
      </Routes>
    </MemoryRouter>
  );
  // skeleton should be present
  expect(screen.getByTestId('dashboard-skeleton')).toBeInTheDocument();
  // wait for loading to finish
  await waitFor(() =>
    expect(screen.getByText(/Dashboard for Red Campaign/i)).toBeInTheDocument()
  );
});

test('increments iteration during polling', async () => {
  render(
    <MemoryRouter initialEntries={['/dashboard/1/Red']}>
      <Routes>
        <Route
          path='/dashboard/:cid/:cname'
          element={<Dashboard pollingIntervalMs={50} />}
        />
      </Routes>
    </MemoryRouter>
  );
  await waitFor(() =>
    expect(screen.getByText(/Dashboard for Red Campaign/i)).toBeInTheDocument()
  );
  // initial iteration tile should show 0 somewhere in the Current Number tile
  expect(screen.getByTestId('tile-label-current-number')).toBeInTheDocument();
  await waitFor(
    () => {
      const currentTileLabel = screen.getByTestId('tile-label-current-number');
      const valueEl =
        currentTileLabel.parentElement.querySelector('.tile-value');
      expect(Number(valueEl.textContent)).toBeGreaterThanOrEqual(1);
    },
    { timeout: 2000 }
  );
});

test('clears polling interval on unmount', async () => {
  // Spy on clearInterval
  const clearSpy = vi.spyOn(global, 'clearInterval');
  const { unmount } = render(
    <MemoryRouter initialEntries={['/dashboard/1/Red']}>
      <Routes>
        <Route
          path='/dashboard/:cid/:cname'
          element={<Dashboard pollingIntervalMs={50} />}
        />
      </Routes>
    </MemoryRouter>
  );
  await waitFor(() =>
    expect(screen.getByText(/Dashboard for Red Campaign/i)).toBeInTheDocument()
  );
  unmount();
  // Allow any cleanup microtasks
  await new Promise((r) => setTimeout(r, 0));
  expect(clearSpy).toHaveBeenCalled();
  clearSpy.mockRestore();
});
