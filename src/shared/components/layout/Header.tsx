import { useNavigate } from 'react-router-dom';
import { ActionIcon, Avatar, Group, Menu, Text, Tooltip, UnstyledButton } from '@mantine/core';
import { LogOut, Settings, User as UserIcon, Bell } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { ThemeIconFrame } from '@/shared/components/ui';

export const Header = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login', { replace: true });
    };

    return (
        <header className="h-16 border-b border-slate-200 bg-white/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
            <Group gap="xs" className="cursor-pointer">
                {/* Simplified Logo */}
                <ThemeIconFrame icon="🦊" />
                <Text fz="xl" fw={900} className="tracking-tighter hidden sm:block text-slate-900">
                    ARENA <span className="text-indigo-600">FOX</span>
                </Text>
            </Group>

            <Group>
                <Tooltip label="Notifications">
                    <ActionIcon variant="light" color="indigo" size="lg" radius="md">
                        <Bell size={20} />
                    </ActionIcon>
                </Tooltip>

                <Menu shadow="md" width={200} position="bottom-end">
                    <Menu.Target>
                        <UnstyledButton className="p-1 rounded-full hover:bg-indigo-50 transition-colors">
                            <Group gap="xs">
                                <Avatar
                                    src={user?.avatarUrl}
                                    radius="xl"
                                    size="md"
                                    color="indigo"
                                >
                                    {user?.displayName?.charAt(0).toUpperCase()}
                                </Avatar>
                                <div className="hidden md:block">
                                    <Text size="sm" fw={600} className="leading-none text-slate-900">
                                        {user?.displayName}
                                    </Text>
                                    <Text size="xs" c="dimmed" className="mt-0.5">
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

                        <Menu.Item
                            color="red"
                            leftSection={<LogOut size={14} />}
                            onClick={handleSignOut}
                        >
                            Sign out
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Group>
        </header>
    );
};
