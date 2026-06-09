import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import { ToastProvider } from './components/feedback/Toast';
import { ErrorBoundary } from './components/feedback/ErrorBoundary';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { PageShell } from './components/layout/PageShell';
import { Skeleton } from './components/feedback/Skeleton';

// Lazy load feature components for performance optimization and bundle size reduction
const DashboardPage = lazy(() =>
  import('./features/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const CalculatorPage = lazy(() =>
  import('./features/calculator/CalculatorPage').then((m) => ({ default: m.CalculatorPage }))
);
const HistoryPage = lazy(() =>
  import('./features/history/HistoryPage').then((m) => ({ default: m.HistoryPage }))
);
const TipsPage = lazy(() =>
  import('./features/tips/TipsPage').then((m) => ({ default: m.TipsPage }))
);
const ChatPage = lazy(() =>
  import('./features/chat/ChatPage').then((m) => ({ default: m.ChatPage }))
);
const LoginPage = lazy(() =>
  import('./features/auth/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
  import('./features/auth/RegisterPage').then((m) => ({ default: m.RegisterPage }))
);

import './App.css';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <PageShell>
              <Suspense fallback={<Skeleton height="300px" style={{ marginTop: '20px' }} />}>
                <Routes>
                  {/* Guest access routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Secure user dashboard & calculation routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/calculator"
                    element={
                      <ProtectedRoute>
                        <CalculatorPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/history"
                    element={
                      <ProtectedRoute>
                        <HistoryPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/tips"
                    element={
                      <ProtectedRoute>
                        <TipsPage />
                      </ProtectedRoute>
                    }
                  />
<Route
  path="/chat"
  element={
    <ProtectedRoute>
      <ChatPage />
    </ProtectedRoute>
  }
/>


                  {/* Default landing page fallbacks */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Suspense>
            </PageShell>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
