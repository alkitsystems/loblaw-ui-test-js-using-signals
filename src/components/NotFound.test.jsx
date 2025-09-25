// Test case:

// Renders not found message.

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import NotFound from './NotFound';
import { test, expect } from 'vitest';

test('renders not found message', () => {
  render(<NotFound />);
  expect(screen.getByText(/404 - Not Found/i)).toBeInTheDocument();
});
