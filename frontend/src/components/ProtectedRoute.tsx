import { Navigate, Outlet } from 'react-router-dom';
import { getToken, clearToken, isTokenExpired } from '../utils/auth';

const ProtectedRoute = () => {
  const token = getToken();

  if (!token || isTokenExpired(token)) {
    clearToken();
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;