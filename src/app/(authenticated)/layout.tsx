'use client';

import type { ReactNode } from 'react';
import { RequireAuth } from '@/shared/components/layout/RequireAuth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <DashboardLayout>{children}</DashboardLayout>
    </RequireAuth>
  );
}
