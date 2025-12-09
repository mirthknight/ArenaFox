'use client';

import { useMemo, useState } from 'react';
import { Avatar, Badge, Button, Card, Checkbox, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { Heart, ShieldCheck, Users } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import type { MemberProfile } from '@/features/profiles/data/mockProfiles';
import { defaultProfiles } from '@/features/profiles/data/mockProfiles';

export const ProfileDirectory = () => {
    const { user } = useAuth();
    const [profiles, setProfiles] = useState<MemberProfile[]>(defaultProfiles);
    const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

    const canModerate = useMemo(() => user?.role === 'admin' || user?.role === 'super_admin', [user?.role]);

    const filteredProfiles = useMemo(
        () => profiles.filter((profile) => (showVerifiedOnly ? profile.isVerified : true)),
        [profiles, showVerifiedOnly]
    );

    const toggleLike = (id: string) => {
        setProfiles((prev) =>
            prev.map((profile) =>
                profile.id === id
                    ? {
                        ...profile,
                        likes: profile.likes + (profile.isLiked ? -1 : 1),
                        isLiked: !profile.isLiked,
                    }
                    : profile
            )
        );
    };

    const toggleEnable = (id: string) => {
        setProfiles((prev) => prev.map((profile) => (profile.id === id ? { ...profile, isEnabled: !profile.isEnabled } : profile)));
    };

    const toggleVerify = (id: string) => {
        setProfiles((prev) => prev.map((profile) => (profile.id === id ? { ...profile, isVerified: !profile.isVerified } : profile)));
    };

    return (
        <Stack gap="lg" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Group justify="space-between" align="center">
                <Stack gap={4}>
                    <Title order={2} className="text-[var(--af-ink)]">Profiles</Title>
                    <Group gap="xs" c="gray.5">
                        <Users size={16} />
                        <Text size="sm">Directory of members, with verification and likes.</Text>
                    </Group>
                </Stack>
                <Checkbox
                    label="Show verified only"
                    checked={showVerifiedOnly}
                    onChange={(event) => setShowVerifiedOnly(event.currentTarget.checked)}
                    color="fox"
                />
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                {filteredProfiles.map((profile) => (
                    <Card key={profile.id} className="glass-panel" radius="lg" shadow="xl" p="lg">
                        <Group justify="space-between" align="flex-start">
                            <Group gap="md">
                                <Avatar src={profile.avatarUrl} size="lg" radius="xl" color="fox">
                                    {profile.displayName.charAt(0)}
                                </Avatar>
                                <div>
                                    <Group gap="xs">
                                        <Text fw={700} className="text-[var(--af-ink)]">
                                            {profile.displayName}
                                        </Text>
                                        {profile.isVerified && <ShieldCheck size={16} className="text-[var(--af-accent)]" />}
                                    </Group>
                                    <Text size="sm" c="gray.5">{profile.email}</Text>
                                    {profile.statusLabel && (
                                        <Badge color="fox" variant="light" size="sm" className="mt-1 bg-[rgba(0,173,181,0.12)] border border-[var(--af-border)] text-[var(--af-ink)]">
                                            {profile.statusLabel}
                                        </Badge>
                                    )}
                                </div>
                            </Group>
                            <Badge color={profile.isEnabled ? 'green' : 'red'} variant="light">
                                {profile.isEnabled ? 'Enabled' : 'Disabled'}
                            </Badge>
                        </Group>

                        <Text size="sm" c="gray.4" mt="sm">
                            {profile.bio}
                        </Text>

                        <Group justify="space-between" mt="md">
                            <Button
                                variant={profile.isLiked ? 'light' : 'outline'}
                                color="fox"
                                leftSection={<Heart size={16} />}
                                onClick={() => toggleLike(profile.id)}
                            >
                                {profile.likes} likes
                            </Button>

                            {canModerate && (
                                <Group gap="xs">
                                    <Button
                                        variant="light"
                                        color="fox"
                                        onClick={() => toggleEnable(profile.id)}
                                        className="bg-[rgba(0,173,181,0.12)] border border-[var(--af-border)] text-[var(--af-ink)]"
                                    >
                                        {profile.isEnabled ? 'Disable' : 'Enable'}
                                    </Button>
                                    <Button
                                        variant={profile.isVerified ? 'outline' : 'light'}
                                        color="fox"
                                        onClick={() => toggleVerify(profile.id)}
                                        className="bg-[rgba(0,173,181,0.12)] border border-[var(--af-border)] text-[var(--af-ink)]"
                                    >
                                        {profile.isVerified ? 'Unverify' : 'Verify'}
                                    </Button>
                                </Group>
                            )}
                        </Group>
                    </Card>
                ))}
            </SimpleGrid>
        </Stack>
    );
};
