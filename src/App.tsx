import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { RequireAuth } from '@/shared/components/layout/RequireAuth';
import { DashboardHome } from '@/features/dashboard/pages/DashboardHome';
import { AdminDashboard } from '@/features/admin/pages/AdminDashboard';
import { ProfileDirectory } from '@/features/profiles/pages/ProfileDirectory';
import { NotFoundPage } from '@/shared/components/pages/NotFoundPage';
import { PageTitleUpdater } from '@/shared/components/layout/PageTitleUpdater';

function App() {
  return (
    <>
      <PageTitleUpdater />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<RequireAuth />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/profiles" element={<ProfileDirectory />} />
            <Route path="/admin" element={<Navigate to="/admin/users" replace />} />
            <Route path="/admin/users" element={<AdminDashboard />} />

            {/* Catch-all for authenticated users */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>

        {/*
           Catch-all for unauthenticated users (Redirect to login)
           We place this OUTSIDE the RequireAuth, but since the '*' inside RequireAuth catches
           everything for authenticated users, this one will effectively only match if RequireAuth
           didn't render?
           Actually, RequireAuth renders <Outlet /> or redirects.
           If user is NOT logged in, RequireAuth redirects to /login.
           So we just need to ensure that random paths redirect.
        */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
