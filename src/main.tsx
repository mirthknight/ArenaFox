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
      defaultColorScheme="light"
      theme={{
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        primaryColor: 'indigo',
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
