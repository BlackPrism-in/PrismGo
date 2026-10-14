import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { AppLayout } from './App';
import { MASTER_DATA_ROLES } from './auth/auth-context';
import { AuthProvider } from './auth/AuthProvider';
import { RequireAuth, RequireRole } from './auth/guards';
import './index.css';
import { DepartmentsPage } from './pages/admin/DepartmentsPage';
import { DriversPage } from './pages/admin/DriversPage';
import { UsersPage } from './pages/admin/UsersPage';
import { VehiclesPage } from './pages/admin/VehiclesPage';
import { ApprovalsPage } from './pages/ApprovalsPage';
import { DashboardPage } from './pages/DashboardPage';
import { DispatchPage } from './pages/DispatchPage';
import { RequestDetailPage } from './pages/requests/RequestDetailPage';
import { RequestFormPage } from './pages/requests/RequestFormPage';
import { RequestsPage } from './pages/requests/RequestsPage';
import { LiveMapPage } from './pages/live/LiveMapPage';
import { LoginPage } from './pages/LoginPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

const admin = (element: React.ReactNode) => (
  <RequireRole roles={MASTER_DATA_ROLES}>{element}</RequireRole>
);

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'requests', element: <RequestsPage /> },
      { path: 'requests/new', element: <RequestFormPage /> },
      { path: 'requests/:id', element: <RequestDetailPage /> },
      { path: 'requests/:id/edit', element: <RequestFormPage /> },
      {
        path: 'approvals',
        element: (
          <RequireRole roles={['hod']}>
            <ApprovalsPage />
          </RequireRole>
        ),
      },
      { path: 'dispatch', element: admin(<DispatchPage />) },
      { path: 'live', element: admin(<LiveMapPage />) },
      { path: 'admin/departments', element: admin(<DepartmentsPage />) },
      { path: 'admin/users', element: admin(<UsersPage />) },
      { path: 'admin/vehicles', element: admin(<VehiclesPage />) },
      { path: 'admin/drivers', element: admin(<DriversPage />) },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
