import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './components/NotFound';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import CampaignList from './components/CampaignList';
import Dashboard from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path='/' element={<Login />} />
          <Route
            path='/campaigns'
            element={
              <ProtectedRoute>
                <CampaignList />
              </ProtectedRoute>
            }
          />
          <Route
            path='/dashboard/:cid/:cname'
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
