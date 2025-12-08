import React from 'react';
import { Badge, Box, Container, Stack, Text, Title } from '@mantine/core';
import { Sparkles } from 'lucide-react';
import { SplashScreen, LoginForm, useSplashScreen } from '@/features/auth';
import { ThemeIconFrame } from '@/shared/components/ui';

/**
 * Main App component
 * Handles routing and layout (currently login page only)
 */
function App() {
  const { loading, progress } = useSplashScreen();

  return (
    <Box className="relative min-h-screen overflow-hidden">
      {loading && <SplashScreen progress={progress} />}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(101,243,197,0.16),transparent_18%),radial-gradient(circle_at_80%_10%,rgba(124,58,237,0.1),transparent_22%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.1),transparent_30%)]" />
        <div className="absolute inset-0 opacity-40 bg-[linear-gradient(135deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0)_40%,rgba(255,255,255,0.07)_70%,rgba(255,255,255,0)_100%)]" />
      </div>

      <Container size="sm" py="xl" className="relative z-10">
        <Stack gap="lg" align="stretch">
          <Stack gap={6} align="center">
            <ThemeIconFrame icon={<Sparkles size={18} />} />
            <Badge radius="xl" variant="light" color="teal" className="bg-white/5 border border-white/10">
              Login
            </Badge>
            <Title order={1} className="gradient-text" ta="center">
              Welcome back to Arena Fox
            </Title>
            <Text size="sm" c="gray.1" ta="center" maw={560}>
              Sign in to access your Arena Fox tools.
            </Text>
          </Stack>

          <LoginForm />
        </Stack>
      </Container>
    </Box>
  );
}

export default App;
