// Test cases:

// Renders campaigns (success path)
// Shows error on fetch failure (non-OK response)
// Shows error on network failure (rejected fetch)
// Campaign buttons have aria-labels
// Shows skeleton while loading (initial state)

import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CampaignList from './CampaignList';
import { vi, test, beforeEach, afterEach, expect } from 'vitest';

// Mock fetch
beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          { id: 1, name: 'Red' },
          { id: 2, name: 'Blue' },
        ]),
    })
  );
});

afterEach(() => {
  vi.resetAllMocks();
});

test('renders campaigns', async () => {
  render(
    <MemoryRouter>
      <CampaignList />
    </MemoryRouter>
  );
  await waitFor(() => screen.getByText(/1: Red/i));
  expect(screen.getByText(/1: Red/i)).toBeInTheDocument();
  expect(screen.getByText(/2: Blue/i)).toBeInTheDocument();
});

test('shows skeleton while loading', async () => {
  // Use a fetch that resolves after a tick to observe skeleton
  global.fetch = vi.fn(
    () =>
      new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              ok: true,
              json: () =>
                Promise.resolve([
                  { id: 1, name: 'Red' },
                  { id: 2, name: 'Blue' },
                ]),
            }),
          50
        )
      )
  );
  render(
    <MemoryRouter>
      <CampaignList />
    </MemoryRouter>
  );
  expect(screen.getByTestId('campaign-list-skeleton')).toBeInTheDocument();
  await waitFor(() => screen.getByText(/1: Red/i));
});

test('shows error on fetch failure', async () => {
  global.fetch.mockImplementationOnce(() => Promise.resolve({ ok: false }));
  render(
    <MemoryRouter>
      <CampaignList />
    </MemoryRouter>
  );
  await waitFor(() => screen.getByText(/Failed to fetch campaigns/i));
  expect(screen.getByText(/Failed to fetch campaigns/i)).toBeInTheDocument();
});

test('campaign buttons have aria-labels', async () => {
  render(
    <MemoryRouter>
      <CampaignList />
    </MemoryRouter>
  );
  await waitFor(() => screen.getByText(/1: Red/i));
  const buttons = screen.getAllByRole('button');
  buttons.forEach((btn) => {
    expect(btn).toHaveAttribute('aria-label');
  });
});

test('shows error on network failure', async () => {
  global.fetch.mockImplementationOnce(() =>
    Promise.reject(new Error('Network error'))
  );
  render(
    <MemoryRouter>
      <CampaignList />
    </MemoryRouter>
  );
  await waitFor(() => screen.getByText(/Network error/i));
  expect(screen.getByText(/Network error/i)).toBeInTheDocument();
});
