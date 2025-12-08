import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, LogIn, ShieldCheck, Sparkles } from 'lucide-react';
import {
  Anchor,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Group,
  Progress,
  Stack,
  Switch,
  Text,
  TextInput,
  Title
} from '@mantine/core';
import { notifications } from '@mantine/notifications';

function ThemeIconFrame({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-teal-200 ring-1 ring-white/10">
      <motion.div animate={{ rotate: [0, -5, 5, 0] }} transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}>
        {icon}
      </motion.div>
    </div>
  );
}

function SplashScreen({ progress }: { progress: number }) {
  return (
    <Box className="splash-screen">
      <motion.div
        className="splash-orb"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
      >
        <motion.span
          role="img"
          aria-label="Animated fox"
          className="text-5xl"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          🦊
        </motion.span>
      </motion.div>
      <Stack gap={4} align="center">
        <Text size="lg" fw={700} c="white">
          Preparing Arena Fox
        </Text>
        <Text size="sm" c="gray.2">
          Loading secure login and user workspace context.
        </Text>
      </Stack>
      <Progress value={progress} radius="xl" size="lg" maw={320} className="w-full max-w-xs" />
      <Text size="sm" c="gray.3">
        {Math.round(progress)}% ready
      </Text>
    </Box>
  );
}

function App() {
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(10);
  const [isReady, setIsReady] = useState(document.readyState === 'complete');

  useEffect(() => {
    const handleReadyState = () => {
      if (document.readyState === 'complete') {
        setIsReady(true);
        setProgress(100);
        setLoading(false);
      }
    };

    const timer = isReady
      ? undefined
      : setInterval(() => {
          setProgress((value) => Math.min(value + Math.random() * 12, 95));
        }, 260);

    handleReadyState();
    document.addEventListener('readystatechange', handleReadyState);

    return () => {
      if (timer) {
        clearInterval(timer);
      }
      document.removeEventListener('readystatechange', handleReadyState);
    };
  }, [isReady]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    notifications.show({
      title: 'Arena Fox',
      message: 'Logged in. Create and manage your workspaces after you enter.',
      color: 'teal',
      icon: <LogIn size={16} />
    });
  };

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

          <Card radius="xl" padding="lg" className="glass-panel">
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <div>
                  <Text size="sm" c="gray.3">
                    Secure access
                  </Text>
                  <Title order={3} c="white">
                    Log in to continue
                  </Title>
                </div>
              </Group>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <TextInput
                  required
                  type="email"
                  label="Email"
                  placeholder="captain@arenafox.gg"
                  leftSection={<ShieldCheck size={16} />}
                  radius="md"
                  styles={{ label: { color: 'var(--mantine-color-gray-4)' } }}
                />
                <TextInput
                  required
                  type="password"
                  label="Password"
                  placeholder="••••••••••••"
                  leftSection={<AlertCircle size={16} />}
                  radius="md"
                  styles={{ label: { color: 'var(--mantine-color-gray-4)' } }}
                />

                <Group justify="space-between" align="center" mt="xs">
                  <Switch
                    size="md"
                    color="teal"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.currentTarget.checked)}
                    label={
                      <Stack gap={0}>
                        <Text size="sm" c="white">
                          Remember me
                        </Text>
                        <Text size="xs" c="gray.3">
                          Keep this device ready for quick access.
                        </Text>
                      </Stack>
                    }
                  />
                  <Anchor size="sm" href="#" underline="hover" c="teal.2">
                    Forgot password?
                  </Anchor>
                </Group>

                <Button type="submit" fullWidth leftSection={<LogIn size={16} />} radius="md" size="sm" color="teal">
                  Continue to Arena Fox
                </Button>
                <Button
                  fullWidth
                  variant="outline"
                  radius="md"
                  size="sm"
                  color="gray"
                  leftSection={<span className="text-lg">G</span>}
                  disabled
                >
                  Continue with Gmail
                </Button>
              </form>

              <Divider my="sm" variant="dashed" color="gray.7" />

              <Stack gap={4}>
                <Text size="sm" fw={600} c="white">
                  Workspace guidance
                </Text>
                <Text size="sm" c="gray.2">
                  Set up workspaces after you sign in—no extra steps required.
                </Text>
              </Stack>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}

export default App;
