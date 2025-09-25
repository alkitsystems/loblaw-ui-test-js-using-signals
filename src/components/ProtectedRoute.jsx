import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PropTypes from 'prop-types';

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};

function ProtectedRoute({ children }) {
  // guard: only allows if user is "authenticated"
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to='/' />;
}

export default ProtectedRoute;
