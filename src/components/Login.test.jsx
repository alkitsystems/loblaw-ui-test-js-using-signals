// Test cases:

// Renders login form.
// Shows error on invalid credentials.
// Inputs have labels and aria attributes.
// Successful login navigates to /campaigns
// Clears error once user edits fields after invalid attempt
// Sets aria-invalid on password input when error present
// Does not navigate on invalid credentials
// Re-shows error on multiple invalid attempts

import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import { test, expect } from 'vitest';

test('renders login form', () => {
  render(
    <AuthProvider>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AuthProvider>
  );
  expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
});

test('shows error on invalid credentials', () => {
  render(
    <AuthProvider>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AuthProvider>
  );
  fireEvent.change(screen.getByPlaceholderText(/Username/i), {
    target: { value: 'wrong' },
  });
  fireEvent.change(screen.getByPlaceholderText(/Password/i), {
    target: { value: 'wrong' },
  });
  fireEvent.click(screen.getByRole('button', { name: /Login/i }));
  expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
});

test('clears error after user edits a field', () => {
  render(
    <AuthProvider>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AuthProvider>
  );
  const userInput = screen.getByPlaceholderText(/Username/i);
  const passInput = screen.getByPlaceholderText(/Password/i);
  const submit = screen.getByRole('button', { name: /Login/i });
  // trigger invalid
  fireEvent.change(userInput, { target: { value: 'wrong' } });
  fireEvent.change(passInput, { target: { value: 'wrong' } });
  fireEvent.click(submit);
  expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
  // edit username clears error
  fireEvent.change(userInput, { target: { value: 'stillwrong' } });
  expect(screen.queryByText(/Invalid credentials/i)).not.toBeInTheDocument();
});

test('password input has aria-invalid when error present and resets after edit', () => {
  render(
    <AuthProvider>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AuthProvider>
  );
  const userInput = screen.getByPlaceholderText(/Username/i);
  const passInput = screen.getByPlaceholderText(/Password/i);
  fireEvent.change(userInput, { target: { value: 'wrong' } });
  fireEvent.change(passInput, { target: { value: 'wrong' } });
  fireEvent.click(screen.getByRole('button', { name: /Login/i }));
  expect(passInput).toHaveAttribute('aria-invalid', 'true');
  // Change password clears error and aria-invalid
  fireEvent.change(passInput, { target: { value: 'new' } });
  expect(passInput).toHaveAttribute('aria-invalid', 'false');
});

test('does not navigate on invalid credentials', () => {
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/']}>
        {' '}
        <Routes>
          <Route path='/' element={<Login />} />
          <Route
            path='/campaigns'
            element={<div data-testid='campaigns-page'>Campaigns Page</div>}
          />
        </Routes>{' '}
      </MemoryRouter>
    </AuthProvider>
  );
  fireEvent.change(screen.getByPlaceholderText(/Username/i), {
    target: { value: 'bad' },
  });
  fireEvent.change(screen.getByPlaceholderText(/Password/i), {
    target: { value: 'creds' },
  });
  fireEvent.click(screen.getByRole('button', { name: /Login/i }));
  // stays on login page
  expect(screen.queryByTestId('campaigns-page')).not.toBeInTheDocument();
  expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
});

test('error reappears on multiple invalid attempts', () => {
  render(
    <AuthProvider>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AuthProvider>
  );
  const userInput = screen.getByPlaceholderText(/Username/i);
  const passInput = screen.getByPlaceholderText(/Password/i);
  const submit = screen.getByRole('button', { name: /Login/i });
  // First invalid
  fireEvent.change(userInput, { target: { value: 'wrong' } });
  fireEvent.change(passInput, { target: { value: 'wrong' } });
  fireEvent.click(submit);
  expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
  // Clear error by editing
  fireEvent.change(userInput, { target: { value: 'wrong2' } });
  expect(screen.queryByText(/Invalid credentials/i)).not.toBeInTheDocument();
  // Second invalid attempt
  fireEvent.click(submit);
  expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
});

test('inputs have labels and aria attributes', () => {
  render(
    <AuthProvider>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AuthProvider>
  );
  expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
});

test('successful login navigates to /campaigns', () => {
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route
            path='/campaigns'
            element={<div data-testid='campaigns-page'>Campaigns Page</div>}
          />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
  fireEvent.change(screen.getByPlaceholderText(/Username/i), {
    target: { value: 'admin' },
  });
  fireEvent.change(screen.getByPlaceholderText(/Password/i), {
    target: { value: 'password' },
  });
  fireEvent.click(screen.getByRole('button', { name: /Login/i }));
  expect(screen.getByTestId('campaigns-page')).toBeInTheDocument();
});
