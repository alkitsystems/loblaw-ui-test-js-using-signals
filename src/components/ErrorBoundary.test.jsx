// Test cases:

// Renders children when no error
// Shows fallback UI when a child throws

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

function Happy() {
  return <div data-testid='happy'>Happy Path</div>;
}

function Boom() {
  throw new Error('Boom!');
}

test('renders children when no error', () => {
  render(
    <ErrorBoundary>
      <Happy />
    </ErrorBoundary>
  );
  expect(screen.getByTestId('happy')).toBeInTheDocument();
});

test('shows fallback on error', () => {
  // Suppress console error noise for this test
  const orig = console.error;
  console.error = () => {};
  render(
    <ErrorBoundary>
      <Boom />
    </ErrorBoundary>
  );
  console.error = orig;
  expect(screen.getByRole('alert')).toBeInTheDocument();
  expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  expect(screen.getByText(/Boom!/i)).toBeInTheDocument();
});
