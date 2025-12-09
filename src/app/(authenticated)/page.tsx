import type { Metadata } from 'next';
import { DashboardHome } from '@/features/dashboard/pages/DashboardHome';

export const metadata: Metadata = {
  title: 'Dashboard • Arena Fox',
};

export default function Page() {
  return <DashboardHome />;
}
