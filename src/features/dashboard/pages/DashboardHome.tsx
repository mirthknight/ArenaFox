import { SimpleGrid, Paper, Text, Group, Divider, Stack } from '@mantine/core';
import { ArrowUpRight, Users, Trophy, TrendingUp, ShieldCheck, type LucideIcon } from 'lucide-react';
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
                        <Text size="sm">You are signed in and synced with the dashboard tools.</Text>
                    </Group>
                    <Text size="sm" c="gray.5" className="max-w-2xl">
                        Need a new alliance space? Create a workspace to invite officers, track events, and keep player data scoped
                        to the right server.
                    </Text>
                </Stack>
                <WorkspaceCreateButton />
            </div>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
                <StatCard title="Total Players" value="2,543" icon={Users} trend="4%" />
                <StatCard title="Active Battles" value="12" icon={Trophy} trend="2%" />
                <StatCard title="Win Rate" value="68%" icon={TrendingUp} trend="1.4%" />
                <StatCard title="Total XP" value="892k" icon={Users} trend="5%" />
            </SimpleGrid>

            <Paper className="p-6 bg-[var(--af-surface-alt)] border border-[var(--af-border)] shadow-[0_12px_30px_rgba(0,0,0,0.35)] text-[var(--af-ink)]" radius="md">
                <Stack gap="md">
                    <Group justify="space-between">
                        <Text fw={700}>This week at a glance</Text>
                        <Text size="sm" c="gray.5">
                            Clean, Scandinavian-inspired layout for easier scanning.
                        </Text>
                    </Group>
                    <Divider />
                    <Text size="sm" c="gray.5">
                        Charts and activity feeds will render here once connected to live data.
                    </Text>
                </Stack>
            </Paper>
        </div>
    );
};
