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

/**
 * Login form component with email/password inputs and remember me option
 * Uses notification-based error messages with fox icon
 */
export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isSubmitting }) => {
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /**
   * Shows error notification with fox icon and danger/red colors
   */
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

  /**
   * Validates email and returns error message if invalid
   */
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

  /**
   * Validates password and returns error message if invalid
   */
  const validatePassword = (value: string): string | null => {
    if (!value || value.trim() === '') {
      return 'Password field is empty. Please enter your password to continue.';
    }
    if (value.length < 6) {
      return 'Invalid password. Password must be at least 6 characters long.';
    }
    return null;
  };

  /**
   * Validates entire form and shows appropriate error notifications
   */
  const validateForm = (): boolean => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    // Show specific error messages
    if (emailError && passwordError) {
      // Both fields are invalid
      showErrorNotification('Please enter both a valid email address and password to continue.');
      return false;
    }

    if (emailError) {
      showErrorNotification(emailError);
      return false;
    }

    if (passwordError) {
      showErrorNotification(passwordError);
      return false;
    }

    return true;
  };

  /**
   * Handles form submission with validation
   * Prevents browser default validation and shows notification errors
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    // Validate form and show specific error notifications
    if (!validateForm()) {
      return;
    }

    const credentials: LoginCredentials = {
      email: email.trim(),
      password,
      rememberMe,
    };

    if (onSubmit) {
      await onSubmit(credentials);
    } else {
      // Default behavior: show notification
      notifications.show({
        title: 'Arena Fox',
        message: 'Logged in. Create and manage your workspaces after you enter.',
        color: 'fox',
        icon: <LogIn size={16} />,
      });
    }
  };

  return (
    <Card radius="xl" padding="lg" className="glass-panel text-[var(--af-ink)]">
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <div>
            <Text size="sm" c="gray.4">
              Secure access
            </Text>
            <Title order={3} c="white">
              Log in to continue
            </Title>
          </div>
        </Group>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <TextInput
            type="email"
            label="Email"
            placeholder="captain@arenafox.gg"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            leftSection={<ShieldCheck size={16} />}
            radius="md"
            styles={{
              input: { backgroundColor: 'rgba(34,40,49,0.6)', color: 'var(--af-ink)' },
              label: { color: 'var(--af-ink-soft)' },
            }}
          />
          <TextInput
            type="password"
            label="Password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            leftSection={<ShieldCheck size={16} />}
            radius="md"
            styles={{
              input: { backgroundColor: 'rgba(34,40,49,0.6)', color: 'var(--af-ink)' },
              label: { color: 'var(--af-ink-soft)' },
            }}
          />

          <Group justify="space-between" align="center" mt="xs">
            <Switch
              size="md"
              color="fox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.currentTarget.checked)}
              label={
                <Stack gap={0}>
                  <Text size="sm" c="white">
                    Remember me
                  </Text>
                  <Text size="xs" c="gray.4">
                    Keep this device ready for quick access.
                  </Text>
                </Stack>
              }
            />
            <Anchor size="sm" href="#" underline="hover" c="fox.2">
              Forgot password?
            </Anchor>
          </Group>

          <Button
            type="submit"
            fullWidth
            leftSection={<LogIn size={16} />}
            radius="md"
            size="sm"
            color="fox"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Securing session…' : 'Continue to Arena Fox'}
          </Button>
          <Button
            fullWidth
            variant="outline"
            radius="md"
            size="sm"
            color="fox"
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
          <Text size="sm" c="gray.4">
            Set up workspaces after you sign in—no extra steps required.
          </Text>
        </Stack>
      </Stack>
    </Card>
  );
};

