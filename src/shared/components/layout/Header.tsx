'use client';

import { useRouter } from 'next/navigation';
import { ActionIcon, Avatar, Group, Menu, Text, Tooltip, UnstyledButton } from '@mantine/core';
import { LogOut, Settings, User as UserIcon, Bell, Menu as MenuIcon } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { ThemeIconFrame } from '@/shared/components/ui';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <header className="h-16 border-b border-[var(--af-border)] bg-[rgba(34,40,49,0.9)] backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <Group gap="sm">
        <ActionIcon
          variant="subtle"
          color="fox"
          radius="md"
          size="lg"
          onClick={onToggleSidebar}
          className="md:hidden"
          aria-label="Toggle navigation"
        >
          <MenuIcon size={18} />
        </ActionIcon>

        <Group gap="xs" className="cursor-pointer">
          <ThemeIconFrame icon="🦊" />
          <Text fz="xl" fw={900} className="tracking-tighter hidden sm:block text-[var(--af-ink)]">
            ARENA <span className="text-[var(--af-accent)]">FOX</span>
          </Text>
        </Group>
      </Group>

      <Group>
        <Tooltip label="Notifications">
          <ActionIcon variant="light" color="fox" size="lg" radius="md" className="bg-[rgba(0,173,181,0.12)] text-[var(--af-ink)]">
            <Bell size={20} />
          </ActionIcon>
        </Tooltip>

        <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            <UnstyledButton className="p-1 rounded-full hover:bg-[rgba(0,173,181,0.12)] transition-colors">
              <Group gap="xs">
                <Avatar src={user?.avatarUrl} radius="xl" size="md" color="fox">
                  {user?.displayName?.charAt(0).toUpperCase()}
                </Avatar>
                <div className="hidden md:block">
                  <Text size="sm" fw={600} className="leading-none text-[var(--af-ink)]">
                    {user?.displayName}
                  </Text>
                  <Text size="xs" c="gray.5" className="mt-0.5">
                    {user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'admin' ? 'Admin' : 'Member'}
                  </Text>
                </div>
              </Group>
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>My Account</Menu.Label>
            <Menu.Item leftSection={<UserIcon size={14} />}>
              Profile
            </Menu.Item>
            <Menu.Item leftSection={<Settings size={14} />}>
              Settings
            </Menu.Item>

            <Menu.Divider className="border-zinc-800" />

            <Menu.Item color="red" leftSection={<LogOut size={14} />} onClick={handleSignOut}>
              Sign out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </header>
  );
};
