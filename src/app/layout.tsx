import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ColorSchemeScript } from '@mantine/core';
import './globals.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Arena Fox',
  description: 'Arena Fox dashboard and login experience built with Next.js and Mantine.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
