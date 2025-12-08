import { useMemo, useState } from 'react';
import {
    ActionIcon,
    Avatar,
    Badge,
    Card,
    Group,
    SimpleGrid,
    Stack,
    Text,
    Title,
    Tooltip,
    Switch,
} from '@mantine/core';
import { Heart, Mail, ShieldCheck, ShieldOff } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { defaultProfiles, type MemberProfile } from '../data/mockProfiles';

export const ProfileDirectory = () => {
    const { user } = useAuth();
    const [profiles, setProfiles] = useState<MemberProfile[]>(defaultProfiles);

    const canModerate = useMemo(() => user?.role === 'admin' || user?.role === 'super_admin', [user?.role]);

    const toggleLike = (id: string) => {
        setProfiles((prev) =>
            prev.map((profile) => (profile.id === id ? { ...profile, likes: profile.likes + 1 } : profile))
        );
    };

    const toggleEnabled = (id: string) => {
        if (!canModerate) return;
        setProfiles((prev) =>
            prev.map((profile) =>
                profile.id === id ? { ...profile, isEnabled: !profile.isEnabled, statusLabel: profile.isEnabled ? 'Disabled by admin' : 'Ready to compete' } : profile
            )
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <Title order={2} className="text-2xl md:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-200 to-sky-300">
                    Member profiles
                </Title>
                <Text c="dimmed" size="sm">
                    View verified badges, likes, and availability without leaving the dashboard.
                </Text>
            </div>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                {profiles.map((profile) => (
                    <Card
                        key={profile.id}
                        radius="lg"
                        className="bg-white/5 border border-white/5 backdrop-blur-xl shadow-[0_15px_45px_rgba(0,0,0,0.35)]"
                        padding="lg"
                    >
                        <Stack gap="sm">
                            <Group justify="space-between" align="flex-start">
                                <Group gap="md">
                                    <Avatar radius="xl" size="md" color={profile.avatarColor ?? 'gray'}>
                                        {profile.displayName.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <div>
                                        <Group gap={8} align="center">
                                            <Text fw={700} className="text-white">
                                                {profile.displayName}
                                            </Text>
                                            {profile.isVerified ? (
                                                <Badge color="teal" leftSection={<ShieldCheck size={12} />} variant="light">
                                                    Verified
                                                </Badge>
                                            ) : (
                                                <Badge color="gray" leftSection={<ShieldOff size={12} />} variant="outline">
                                                    Pending
                                                </Badge>
                                            )}
                                        </Group>
                                        <Text size="xs" c="dimmed">
                                            {profile.email}
                                        </Text>
                                        {profile.statusLabel && (
                                            <Text size="xs" c="gray.4" className="mt-1">
                                                {profile.statusLabel}
                                            </Text>
                                        )}
                                    </div>
                                </Group>
                                <Tooltip label={canModerate ? 'Toggle availability' : 'Only admins can change availability'}>
                                    <Switch
                                        size="md"
                                        color="teal"
                                        checked={profile.isEnabled}
                                        onChange={() => toggleEnabled(profile.id)}
                                        disabled={!canModerate}
                                    />
                                </Tooltip>
                            </Group>

                            <Text size="sm" c="gray.3" className="leading-relaxed">
                                {profile.bio}
                            </Text>

                            <Group gap={8} className="flex flex-wrap">
                                {profile.badges.map((badge) => (
                                    <Badge key={badge} color="violet" variant="light" radius="sm">
                                        {badge}
                                    </Badge>
                                ))}
                            </Group>

                            <Group justify="space-between" align="center">
                                <Group gap="xs">
                                    <Badge variant="dot" color={profile.role === 'super_admin' ? 'teal' : profile.role === 'admin' ? 'blue' : 'gray'} className="bg-white/5">
                                        {profile.role.replace('_', ' ')}
                                    </Badge>
                                    <Badge variant="outline" color={profile.isEnabled ? 'teal' : 'red'}>
                                        {profile.isEnabled ? 'Enabled' : 'Disabled'}
                                    </Badge>
                                </Group>

                                <Group gap="xs">
                                    <Tooltip label="Send message">
                                        <ActionIcon variant="subtle" color="gray" radius="md">
                                            <Mail size={16} />
                                        </ActionIcon>
                                    </Tooltip>
                                    <Tooltip label="Give a like">
                                        <ActionIcon
                                            variant="gradient"
                                            gradient={{ from: 'teal', to: 'cyan', deg: 120 }}
                                            radius="md"
                                            onClick={() => toggleLike(profile.id)}
                                        >
                                            <Group gap={6}>
                                                <Heart size={16} />
                                                <Text size="xs" fw={700}>
                                                    {profile.likes}
                                                </Text>
                                            </Group>
                                        </ActionIcon>
                                    </Tooltip>
                                </Group>
                            </Group>
                        </Stack>
                    </Card>
                ))}
            </SimpleGrid>
        </div>
    );
};

