import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { PageLoader } from '@/shared/components/PageLoader';

// ─── Lazy-loaded pages ───────────────────────────────────────────────────────
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const UsersPage = lazy(() => import('@/features/users/pages/UsersPage'));
const UserDetailPage = lazy(() => import('@/features/users/pages/UserDetailPage'));
const CryptoPage = lazy(() => import('@/features/crypto/pages/CryptoPage'));
const WeatherPage = lazy(() => import('@/features/weather/pages/WeatherPage'));

function SuspensePage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <SuspensePage>
              <LoginPage />
            </SuspensePage>
          }
        />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route
            path="/"
            element={
              <SuspensePage>
                <DashboardPage />
              </SuspensePage>
            }
          />
          <Route
            path="/users"
            element={
              <SuspensePage>
                <UsersPage />
              </SuspensePage>
            }
          />
          <Route
            path="/users/:id"
            element={
              <SuspensePage>
                <UserDetailPage />
              </SuspensePage>
            }
          />
          <Route
            path="/crypto"
            element={
              <SuspensePage>
                <CryptoPage />
              </SuspensePage>
            }
          />
          <Route
            path="/weather"
            element={
              <SuspensePage>
                <WeatherPage />
              </SuspensePage>
            }
          />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
