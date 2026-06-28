// Component/ProtactedRout.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const ProtectedRoute = () => {
  const { token } = useAuth();
  
  // Check if user is authenticated
  if (!token) {
    return <Navigate to="/admin" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;