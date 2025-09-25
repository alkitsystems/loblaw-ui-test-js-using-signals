import { createContext, useContext } from 'react';
import { signal } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';
import PropTypes from 'prop-types';

AuthProvider.propTypes = {
  children: PropTypes.node,
};

const AuthContext = createContext();
const isAuthenticated = signal(false);
const usernameSignal = signal(localStorage.getItem('username') || '');

export function AuthProvider({ children }) {
  useSignals();

  const login = (username, password) => {
    // Replace with real authentication logic
    if (username === 'admin' && password === 'password') {
      isAuthenticated.value = true;
      usernameSignal.value = username;
      localStorage.setItem('username', username);
      return true;
    }
    return false;
  };

  const logout = () => {
    isAuthenticated.value = false;
    usernameSignal.value = '';
    localStorage.removeItem('username');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isAuthenticated.value,
        username: usernameSignal.value,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
