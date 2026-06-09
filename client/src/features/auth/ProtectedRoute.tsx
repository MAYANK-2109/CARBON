import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { Skeleton } from '../../components/feedback/Skeleton';
import { GlassCard } from '../../components/ui/GlassCard';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-primary)',
          padding: '24px'
        }}
      >
        <GlassCard
          glowColor="emerald"
          style={{
            maxWidth: '500px',
            width: '100%',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Skeleton variant="circular" width={48} height={48} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexGrow: 1 }}>
              <Skeleton variant="text" width="60%" height="20px" />
              <Skeleton variant="text" width="40%" height="14px" />
            </div>
          </div>
          <Skeleton variant="rectangular" height={150} />
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Skeleton variant="rectangular" width={100} height={36} />
            <Skeleton variant="rectangular" width={100} height={36} />
          </div>
        </GlassCard>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login but save the current location they tried to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
