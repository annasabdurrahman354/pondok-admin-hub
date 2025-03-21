import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '@/context/SessionContext';

interface ProtectedRouteProps {
  requiredRole?: 'Admin Yayasan' | 'Admin Pondok';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { user } = useSession();

  if (!user) return <Navigate to="/login" replace />;
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'Admin Yayasan' ? "/yayasan/dashboard" : "/pondok/dashboard"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
