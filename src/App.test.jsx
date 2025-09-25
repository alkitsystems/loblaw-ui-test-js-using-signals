import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('App', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  expect(screen.queryByText('Good Luck!')).not.toBeInTheDocument();
});
