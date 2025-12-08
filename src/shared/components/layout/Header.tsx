import { useNavigate } from 'react-router-dom';
import { ActionIcon, Avatar, Group, Menu, Text, Tooltip, UnstyledButton, rem, Badge } from '@mantine/core';
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
        <header className="h-16 border-b border-white/10 bg-gradient-to-r from-[#0b1220]/90 via-[#0f172a]/80 to-[#0b1220]/90 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-50 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
            <Group gap="xs" className="cursor-pointer">
                {/* Simplified Logo */}
                <div className="relative">
                    <div className="absolute inset-0 bg-primary-500/25 blur-lg rounded-full" />
                    <ThemeIconFrame icon="🦊" className="relative z-10" />
                </div>
                <Text fz="xl" fw={900} className="tracking-tighter hidden sm:block">
                    ARENA <span className="text-primary-400">FOX</span>
                </Text>
            </Group>

            <Group>
                {user?.role === 'super_admin' && <Badge color="teal" variant="light">Super admin</Badge>}
                <Tooltip label="Notifications">
                    <ActionIcon variant="subtle" color="gray" size="lg" radius="md">
                        <Bell size={20} />
                    </ActionIcon>
                </Tooltip>

                <Menu shadow="md" width={200} position="bottom-end">
                    <Menu.Target>
                        <UnstyledButton className="p-1 rounded-full hover:bg-white/5 transition-colors">
                            <Group gap="xs">
                                <Avatar
                                    src={user?.avatarUrl}
                                    radius="xl"
                                    size="md"
                                    color="orange"
                                >
                                    {user?.displayName?.charAt(0).toUpperCase()}
                                </Avatar>
                                <div className="hidden md:block">
                                    <Text size="sm" fw={500} className="leading-none text-white">
                                        {user?.displayName}
                                    </Text>
                                    <Text size="xs" c="dimmed" className="mt-0.5">
                                        {user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'admin' ? 'Admin' : 'Member'}
                                    </Text>
                                </div>
                            </Group>
                        </UnstyledButton>
                    </Menu.Target>

                    <Menu.Dropdown className="bg-zinc-900 border-zinc-800">
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
