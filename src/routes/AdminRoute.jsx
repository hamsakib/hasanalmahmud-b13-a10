import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, userRole, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg text-blue-600"></span></div>;
  if (!user || userRole !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

export default AdminRoute;
