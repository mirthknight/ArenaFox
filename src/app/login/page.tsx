import type { Metadata } from 'next';
import { LoginPage } from '@/features/auth/pages/LoginPage';

export const metadata: Metadata = {
  title: 'Login • Arena Fox',
  description: 'Sign in to the Arena Fox dashboard.',
};

export default function Page() {
  return <LoginPage />;
}
