import { useMemo, useState } from 'react';
import {
    ActionIcon,
    Avatar,
    Group,
    Stack,
    Text,
    Title,
    Tooltip,
    Switch,
    Table,
    Badge,
} from '@mantine/core';
import { Heart, Mail, ShieldCheck, ShieldOff } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { defaultProfiles, type MemberProfile } from '../data/mockProfiles';

export const ProfileDirectory = () => {
    const { user } = useAuth();
    const [profiles, setProfiles] = useState<MemberProfile[]>(defaultProfiles);

    const canModerate = useMemo(() => user?.role === 'admin' || user?.role === 'super_admin', [user?.role]);

    const toggleLike = (id: string) => {
        setProfiles((prev) => prev.map((profile) => (profile.id === id ? { ...profile, likes: profile.likes + 1 } : profile)));
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
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <Title order={2} className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
                    Member profiles
                </Title>
                <Text c="dimmed" size="sm">
                    A simplified, readable list of the people in your arena.
                </Text>
            </div>

            <div className="overflow-auto rounded-lg border border-slate-200 shadow-sm bg-white">
                <Table highlightOnHover verticalSpacing="sm">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Member</Table.Th>
                            <Table.Th>Email</Table.Th>
                            <Table.Th>Role</Table.Th>
                            <Table.Th>Status</Table.Th>
                            <Table.Th>Likes</Table.Th>
                            <Table.Th className="text-right">Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {profiles.map((profile) => (
                            <Table.Tr key={profile.id}>
                                <Table.Td>
                                    <Group gap="sm">
                                        <Avatar radius="xl" size="sm" color={profile.avatarColor ?? 'gray'}>
                                            {profile.displayName.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <div>
                                            <Group gap={8} align="center">
                                                <Text fw={700}>{profile.displayName}</Text>
                                                {profile.isVerified ? (
                                                    <Tooltip label="Verified">
                                                        <Badge color="indigo" variant="light" size="xs" leftSection={<ShieldCheck size={12} />}>
                                                            Verified
                                                        </Badge>
                                                    </Tooltip>
                                                ) : (
                                                    <Badge color="gray" variant="outline" size="xs" leftSection={<ShieldOff size={12} />}>
                                                        Pending
                                                    </Badge>
                                                )}
                                            </Group>
                                            <Text size="xs" c="dimmed">
                                                {profile.bio}
                                            </Text>
                                        </div>
                                    </Group>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="sm">{profile.email}</Text>
                                    {profile.statusLabel && (
                                        <Text size="xs" c="dimmed">
                                            {profile.statusLabel}
                                        </Text>
                                    )}
                                </Table.Td>
                                <Table.Td>
                                    <Text size="sm" tt="capitalize">
                                        {profile.role.replace('_', ' ')}
                                    </Text>
                                </Table.Td>
                                <Table.Td>
                                    <Tooltip label={canModerate ? 'Toggle availability' : 'Only admins can change availability'}>
                                        <Switch
                                            size="sm"
                                            color="indigo"
                                            checked={profile.isEnabled}
                                            onChange={() => toggleEnabled(profile.id)}
                                            disabled={!canModerate}
                                        />
                                    </Tooltip>
                                </Table.Td>
                                <Table.Td>
                                    <Text fw={600}>{profile.likes}</Text>
                                </Table.Td>
                                <Table.Td className="text-right">
                                    <Group gap="xs" justify="flex-end">
                                        <Tooltip label="Send message">
                                            <ActionIcon variant="subtle" color="gray" radius="md">
                                                <Mail size={16} />
                                            </ActionIcon>
                                        </Tooltip>
                                        <Tooltip label="Give a like">
                                            <ActionIcon
                                                variant="light"
                                                color="indigo"
                                                radius="md"
                                                onClick={() => toggleLike(profile.id)}
                                            >
                                                <Heart size={16} />
                                            </ActionIcon>
                                        </Tooltip>
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </div>
        </div>
    );
};

