'use client';

import { SimpleGrid, Paper, Text, Group, Divider, Stack } from '@mantine/core';
import { ArrowUpRight, Users, Trophy, TrendingUp, ShieldCheck, BadgeCheck, type LucideIcon } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { WorkspaceCreateButton } from '@/features/workspaces';

export const DashboardHome = () => {
    const { user } = useAuth();

    const StatCard = ({ title, value, icon: StatIcon, trend }: { title: string; value: string; icon: LucideIcon; trend?: string }) => (
        <Paper className="p-5 bg-[var(--af-surface-alt)] border border-[var(--af-border)] shadow-[0_12px_30px_rgba(0,0,0,0.35)] text-[var(--af-ink)]" radius="md">
            <Group justify="space-between" mb="sm">
                <div>
                    <Text size="xs" c="gray.5" tt="uppercase" fw={700}>
                        {title}
                    </Text>
                    <Text className="text-3xl font-bold text-[var(--af-ink)] mt-1">{value}</Text>
                </div>
                <div className="p-2 bg-[rgba(0,173,181,0.12)] text-[var(--af-accent)] rounded-lg border border-[var(--af-border)]">
                    <StatIcon size={20} />
                </div>
            </Group>
            {trend && (
                <Group gap="xs" c="fox.4">
                    <ArrowUpRight size={14} />
                    <Text size="sm" fw={600}>
                        {trend} this week
                    </Text>
                </Group>
            )}
        </Paper>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <Stack gap={4}>
                    <Text className="text-3xl md:text-4xl font-black tracking-tight text-[var(--af-ink)]">
                        Welcome back, {user?.displayName}
                    </Text>
                    <Group gap="sm" c="gray.4">
                        <ShieldCheck size={16} />
                        <Text size="sm" fw={600}>
                            Super Admin controls are enabled with RLS protections.
                        </Text>
                    </Group>
                </Stack>
                <div className="flex gap-3 flex-wrap">
                    <WorkspaceCreateButton triggerVariant="primary" />
                    <button className="button-ghost" type="button">
                        View activity
                    </button>
                </div>
            </div>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
                <StatCard title="Active members" value="1,284" icon={Users} trend="12%" />
                <StatCard title="Badges issued" value="342" icon={Trophy} trend="8%" />
                <StatCard title="Engagement" value="87%" icon={TrendingUp} trend="5%" />
                <StatCard title="Verified" value="422" icon={ShieldCheck} />
            </SimpleGrid>

            <Divider className="border-[var(--af-border)]" my="md" />

            <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
                <Paper className="p-5 bg-[var(--af-surface-alt)] border border-[var(--af-border)] shadow-[0_12px_30px_rgba(0,0,0,0.35)] text-[var(--af-ink)]" radius="md">
                    <Group justify="space-between" mb="md">
                        <div>
                            <Text size="sm" c="gray.5" tt="uppercase" fw={700}>
                                Workspace health
                            </Text>
                            <Text className="text-xl font-bold text-[var(--af-ink)]">Engagement trends</Text>
                        </div>
                        <BadgeCheck className="text-[var(--af-accent)]" size={20} />
                    </Group>
                    <Text size="sm" c="gray.4">
                        Activity levels are stable. Consider inviting your alliance captains to the new profile directory.
                    </Text>
                </Paper>

                <Paper className="p-5 bg-[var(--af-surface-alt)] border border-[var(--af-border)] shadow-[0_12px_30px_rgba(0,0,0,0.35)] text-[var(--af-ink)]" radius="md">
                    <Group justify="space-between" mb="md">
                        <div>
                            <Text size="sm" c="gray.5" tt="uppercase" fw={700}>
                                Alerts
                            </Text>
                            <Text className="text-xl font-bold text-[var(--af-ink)]">Invites</Text>
                        </div>
                        <TrendingUp className="text-[var(--af-accent)]" size={20} />
                    </Group>
                    <Text size="sm" c="gray.4">
                        Invite flows are mocked today. Wire Supabase to deliver real invite links and status changes.
                    </Text>
                </Paper>
            </div>
        </div>
    );
};
