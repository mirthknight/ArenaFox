'use client';

import { useEffect } from 'react';
import { Badge, Box, Container, Stack, Text, Title } from '@mantine/core';
import { Sparkles } from 'lucide-react';
import { LoginForm, useSplashScreen, SplashScreen, useSupabaseAuth, type LoginCredentials } from '@/features/auth';
import { ThemeIconFrame } from '@/shared/components/ui';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/context/AuthContext';

export const LoginPage = () => {
  const { loading, progress } = useSplashScreen();
  const { signIn, isSubmitting } = useSupabaseAuth();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [router, user]);

  const handleLogin = async (credentials: LoginCredentials) => {
    const profile = await signIn(credentials);
    if (profile) {
      return;
    }
  };

  return (
    <Box className="relative min-h-screen overflow-hidden">
      {loading && <SplashScreen progress={progress} />}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(0,173,181,0.22),transparent_18%),radial-gradient(circle_at_82%_14%,rgba(57,62,70,0.45),transparent_26%),radial-gradient(circle_at_48%_78%,rgba(0,173,181,0.18),transparent_32%)]" />
        <div className="absolute inset-0 opacity-50 bg-[linear-gradient(135deg,rgba(0,173,181,0.15)_0%,rgba(0,0,0,0)_40%,rgba(238,238,238,0.08)_70%,rgba(0,0,0,0)_100%)]" />
      </div>

      <Container size="sm" py="xl" className="relative z-10 flex flex-col justify-center min-h-screen">
        <Stack gap="lg" align="stretch">
          <Stack gap={6} align="center">
            <ThemeIconFrame icon={<Sparkles size={18} />} />
            <Badge radius="xl" variant="light" color="fox" className="bg-[rgba(0,173,181,0.12)] border border-[var(--af-border)] text-[var(--af-ink)]">
              Login
            </Badge>
            <Title order={1} className="gradient-text" ta="center">
              Welcome back to Arena Fox
            </Title>
            <Text size="sm" c="gray.3" ta="center" maw={560}>
              Sign in to access your Arena Fox tools.
            </Text>
          </Stack>

          <LoginForm onSubmit={handleLogin} isSubmitting={isSubmitting} />
        </Stack>
      </Container>
    </Box>
  );
};
