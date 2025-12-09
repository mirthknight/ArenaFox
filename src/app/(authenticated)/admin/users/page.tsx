import type { Metadata } from 'next';
import { AdminDashboard } from '@/features/admin/pages/AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin • Arena Fox',
};

export default function Page() {
  return <AdminDashboard />;
}
