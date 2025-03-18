
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  requiredRole?: 'Admin Yayasan' | 'Admin Pondok';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memverifikasi akun...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is required and doesn't match, redirect to appropriate dashboard
  if (requiredRole && user.role !== requiredRole) {
    if (user.role === 'Admin Yayasan') {
      return <Navigate to="/yayasan/dashboard" replace />;
    } else if (user.role === 'Admin Pondok') {
      return <Navigate to="/pondok/dashboard" replace />;
    }
  }

  // Check if Admin Pondok has pondok data
  if (user.role === 'Admin Pondok' && location.pathname !== '/pondok/sync' && !user.pondokId) {
    return <Navigate to="/pondok/sync" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
