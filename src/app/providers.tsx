'use client';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import type { ReactNode } from 'react';
import { AuthProvider } from '@/features/auth/context/AuthContext';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <MantineProvider
      defaultColorScheme="dark"
      theme={{
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        colors: {
          fox: ['#e4f9fb', '#c8f1f4', '#a7e7ea', '#83dce0', '#5fd1d7', '#3cc6cd', '#1faeb5', '#00979f', '#007e86', '#00676f'],
        },
        primaryColor: 'fox',
        primaryShade: 6,
        defaultRadius: 'md',
        headings: { fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontWeight: '800' },
      }}
    >
      <Notifications position="top-right" limit={3} />
      <AuthProvider>{children}</AuthProvider>
    </MantineProvider>
  );
};
