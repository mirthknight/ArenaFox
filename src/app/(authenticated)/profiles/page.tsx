import type { Metadata } from 'next';
import { ProfileDirectory } from '@/features/profiles/pages/ProfileDirectory';

export const metadata: Metadata = {
  title: 'Profiles • Arena Fox',
};

export default function Page() {
  return <ProfileDirectory />;
}
