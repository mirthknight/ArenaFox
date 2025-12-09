import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import App from './App';
import './index.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/context/AuthContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
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
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
);
