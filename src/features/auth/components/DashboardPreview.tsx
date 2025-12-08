import React from 'react';
import { Badge, Card, Divider, Group, List, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { CheckCircle2, Crown, Shield, UserCheck, Users, Zap } from 'lucide-react';
import type { UserProfile } from '../types/auth.types';

interface DashboardPreviewProps {
  profile: UserProfile | null;
}

const VerifiedBadge = ({ visible }: { visible: boolean }) => {
  if (!visible) {
    return null;
  }

  return (
    <Badge color="teal" leftSection={<CheckCircle2 size={14} />} radius="md" variant="light">
      Verified
    </Badge>
  );
};

export const DashboardPreview: React.FC<DashboardPreviewProps> = ({ profile }) => {
  const isSuperAdmin = profile?.role === 'super_admin';

  return (
    <Card radius="xl" padding="lg" className="glass-panel border border-white/10">
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <div>
            <Text size="sm" c="gray.3">
              Dashboard preview
            </Text>
            <Group gap={8}>
              <Title order={3} c="white">
                {profile?.displayName ?? 'Team member'}
              </Title>
              <VerifiedBadge visible={Boolean(profile?.isVerified)} />
              {profile?.statusLabel && (
                <Badge color="grape" variant="light" radius="md">
                  {profile.statusLabel}
                </Badge>
              )}
            </Group>
          </div>
          {isSuperAdmin && (
            <Badge color="yellow" leftSection={<Crown size={14} />} variant="outline" radius="md">
              Super admin controls
            </Badge>
          )}
        </Group>

        <Text size="sm" c="gray.2">
          Secure Supabase sessions drive menu visibility. Only verified users see ticks, and super admins unlock user management
          without exposing secret keys in the client.
        </Text>

        <Divider variant="dashed" color="gray.7" />

        <Group align="flex-start" grow gap="md">
          <Stack gap="xs">
            <Group gap={8}>
              <ThemeIcon radius="md" color="teal" variant="light">
                <Shield size={16} />
              </ThemeIcon>
              <Text fw={700} c="white">
                Member menu
              </Text>
            </Group>
            <List spacing="xs" size="sm" c="gray.2">
              <List.Item icon={<ThemeIcon radius="xl" color="teal" size={24} variant="light" />}>Workspace access</List.Item>
              <List.Item icon={<ThemeIcon radius="xl" color="teal" size={24} variant="light" />}>Profile editor</List.Item>
              <List.Item icon={<ThemeIcon radius="xl" color="teal" size={24} variant="light" />}>Ticket inbox</List.Item>
            </List>
          </Stack>

          {isSuperAdmin && (
            <Stack gap="xs">
              <Group gap={8}>
                <ThemeIcon radius="md" color="yellow" variant="light">
                  <Users size={16} />
                </ThemeIcon>
                <Text fw={700} c="white">
                  User management
                </Text>
              </Group>
              <List spacing="xs" size="sm" c="gray.2">
                <List.Item icon={<ThemeIcon radius="xl" color="yellow" size={24} variant="light" />}>Enable/disable accounts</List.Item>
                <List.Item icon={<ThemeIcon radius="xl" color="yellow" size={24} variant="light" />}>Assign verified ticks</List.Item>
                <List.Item icon={<ThemeIcon radius="xl" color="yellow" size={24} variant="light" />}>Set labels (cool, hot)</List.Item>
                <List.Item icon={<ThemeIcon radius="xl" color="yellow" size={24} variant="light" />}>Provision new users</List.Item>
              </List>
            </Stack>
          )}

          <Stack gap="xs">
            <Group gap={8}>
              <ThemeIcon radius="md" color="indigo" variant="light">
                <Zap size={16} />
              </ThemeIcon>
              <Text fw={700} c="white">
                Security notes
              </Text>
            </Group>
            <List spacing="xs" size="sm" c="gray.2">
              <List.Item icon={<ThemeIcon radius="xl" color="indigo" size={24} variant="light" />}>Row-level security on tables</List.Item>
              <List.Item icon={<ThemeIcon radius="xl" color="indigo" size={24} variant="light" />}>Service role stays on server</List.Item>
              <List.Item icon={<ThemeIcon radius="xl" color="indigo" size={24} variant="light" />}>Secrets injected via .env only</List.Item>
            </List>
          </Stack>
        </Group>

        <Divider variant="dashed" color="gray.7" />

        <Group gap="xs">
          <ThemeIcon radius="md" color="grape" variant="light">
            <UserCheck size={16} />
          </ThemeIcon>
          <Text size="sm" c="gray.2">
            First email registered becomes the super admin. Admins alone can toggle verification and special labels; unverified
            users never display a tick.
          </Text>
        </Group>
      </Stack>
    </Card>
  );
};
