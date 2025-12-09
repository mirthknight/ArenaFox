'use client';

import React, { useState } from 'react';
import {
  Anchor,
  Button,
  Card,
  Divider,
  Group,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { LogIn, ShieldCheck } from 'lucide-react';
import type { LoginCredentials } from '../types/auth.types';

interface LoginFormProps {
  onSubmit?: (credentials: LoginCredentials) => Promise<void> | void;
  isSubmitting?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isSubmitting }) => {
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const showErrorNotification = (message: string) => {
    notifications.show({
      title: 'Arena Fox',
      message,
      color: 'red',
      icon: (
        <span className="text-2xl" role="img" aria-label="Fox icon">
          🦊
        </span>
      ),
      styles: {
        root: {
          backgroundColor: 'rgba(57, 62, 70, 0.95)',
          border: '1px solid rgba(244, 63, 94, 0.45)',
          boxShadow: '0 14px 40px rgba(0, 0, 0, 0.35)',
          backdropFilter: 'blur(12px)',
        },
        title: {
          color: '#fca5a5',
          fontWeight: 600,
        },
        description: {
          color: '#fecdd3',
        },
        icon: {
          color: '#f87171',
        },
      },
    });
  };

  const validateEmail = (value: string): string | null => {
    if (!value || value.trim() === '') {
      return 'Email field is empty. Please enter your email address to continue.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Invalid email format. Please enter a valid email address (e.g., captain@arenafox.gg).';
    }
    return null;
  };

  const validatePassword = (value: string): string | null => {
    if (!value || value.trim() === '') {
      return 'Password is required to continue. Please enter your password.';
    }
    if (value.length < 6) {
      return 'Password is too short. Use at least 6 characters (preferably 12+ for security).';
    }
    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      showErrorNotification(emailError ?? passwordError ?? 'Invalid credentials');
      return;
    }

    if (!onSubmit) return;

    try {
      await onSubmit({ email, password, rememberMe });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed, please try again.';
      showErrorNotification(message);
    }
  };

  return (
    <Card shadow="xl" padding="lg" radius="lg" className="glass-panel">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Stack gap="sm">
          <div>
            <Title order={3} className="text-[var(--af-ink)]">Sign in</Title>
            <Text size="sm" c="gray.5">
              Use your Arena Fox credentials to continue.
            </Text>
          </div>

          <TextInput
            label="Email"
            placeholder="you@arenafox.gg"
            radius="md"
            size="md"
            leftSection={<LogIn size={18} />}
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            required
            classNames={{ input: 'bg-[rgba(57,62,70,0.6)] border-[var(--af-border)] text-[var(--af-ink)]' }}
          />

          <TextInput
            label="Password"
            type="password"
            placeholder="••••••••"
            radius="md"
            size="md"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            required
            classNames={{ input: 'bg-[rgba(57,62,70,0.6)] border-[var(--af-border)] text-[var(--af-ink)]' }}
          />

          <Group justify="space-between" align="center">
            <Switch
              label="Remember me"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.currentTarget.checked)}
              color="fox"
            />
            <Anchor href="#" underline="hover" size="sm" c="fox.4">
              Forgot password?
            </Anchor>
          </Group>

          <Button
            type="submit"
            size="md"
            radius="md"
            fullWidth
            loading={isSubmitting}
            leftSection={<ShieldCheck size={18} />}
            className="bg-gradient-to-r from-[var(--af-accent-strong)] to-[var(--af-accent)] text-[var(--af-ink)]"
          >
            Sign in securely
          </Button>

          <Divider
            label={(
              <Text c="gray.5" fw={600} className="tracking-[0.08em] uppercase text-xs">
                Secure by Supabase
              </Text>
            )}
            labelPosition="center"
          />

          <Text size="sm" c="gray.5" ta="center">
            Need an invite? Contact your Arena Fox admin.
          </Text>
        </Stack>
      </form>
    </Card>
  );
};
