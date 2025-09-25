import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppBar, Toolbar } from '@mui/material';
import { useSignals } from '@preact/signals-react/runtime';

function NavBar() {
  useSignals();
  const { isAuthenticated, logout, username } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const showBackToCampaignsLink =
    isAuthenticated && location.pathname.startsWith('/dashboard');

  return (
    <AppBar position='static' sx={{ width: '100%' }}>
      <Toolbar component='nav' aria-label='Main navigation'>
        {showBackToCampaignsLink && (
          <NavLink
            to='/campaigns'
            className='navbar-item'
            aria-label='Back to Campaigns'
          >
            Back to Campaigns
          </NavLink>
        )}
        <div style={{ flexGrow: 1 }} />
        {isAuthenticated ? (
          <>
            <span
              className='navbar-item'
              aria-label={`Hello, ${username || 'User'}!`}
            >
              Hello, {username || 'User'}!
            </span>
            <button
              type='button'
              onClick={handleLogout}
              className='navbar-item'
              aria-label='Logout'
            >
              Logout
            </button>
          </>
        ) : (
          <NavLink to='/' className='navbar-item' aria-label='Login'>
            Login
          </NavLink>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
