import React, { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';

interface ProtectedRouteProps {
  children: ReactNode;
  requireProducer?: boolean;
  fallback?: ReactNode;
  onUnauthorized?: () => void;
}

/**
 * ProtectedRoute component that checks authentication status
 * and optionally checks if user is a producer.
 * 
 * Usage:
 * <ProtectedRoute onUnauthorized={() => showLogin()}>
 *   <UserDashboard />
 * </ProtectedRoute>
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireProducer = false,
  fallback = null,
  onUnauthorized,
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-a4coGreen mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    onUnauthorized?.();
    return <>{fallback}</>;
  }

  // Check if producer role is required
  if (requireProducer && !user?.isProducer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Acceso Restringido
          </h2>
          <p className="text-gray-600">
            Esta página es solo para productores.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

