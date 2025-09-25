// Test cases:

// Renders label and value.

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import MetricTile from './MetricTile';
import { test, expect } from 'vitest';

test('renders label and value', () => {
  render(<MetricTile label='Test Label' value={123} />);
  expect(screen.getByText(/Test Label/i)).toBeInTheDocument();
  expect(screen.getByText(/123/)).toBeInTheDocument();
});
