import { SimpleGrid, Paper, Text, Group, Divider, Stack } from '@mantine/core';
import { ArrowUpRight, Users, Trophy, TrendingUp, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';

export const DashboardHome = () => {
    const { user } = useAuth();

    const StatCard = ({ title, value, icon: Icon, trend }: { title: string; value: string; icon: any; trend?: string }) => (
        <Paper className="p-5 bg-white border border-slate-200 shadow-sm" radius="md">
            <Group justify="space-between" mb="sm">
                <div>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                        {title}
                    </Text>
                    <Text className="text-3xl font-bold text-slate-900 mt-1">{value}</Text>
                </div>
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Icon size={20} />
                </div>
            </Group>
            {trend && (
                <Group gap="xs" c="teal.6">
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
            <Stack gap={4}>
                <Text className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                    Welcome back, {user?.displayName}
                </Text>
                <Group gap="sm" c="dimmed">
                    <ShieldCheck size={16} />
                    <Text size="sm">You are signed in and synced with the dashboard tools.</Text>
                </Group>
            </Stack>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
                <StatCard title="Total Players" value="2,543" icon={Users} trend="4%" />
                <StatCard title="Active Battles" value="12" icon={Trophy} trend="2%" />
                <StatCard title="Win Rate" value="68%" icon={TrendingUp} trend="1.4%" />
                <StatCard title="Total XP" value="892k" icon={Users} trend="5%" />
            </SimpleGrid>

            <Paper className="p-6 bg-white border border-slate-200 shadow-sm" radius="md">
                <Stack gap="md">
                    <Group justify="space-between">
                        <Text fw={700}>This week at a glance</Text>
                        <Text size="sm" c="dimmed">
                            Clean, Scandinavian-inspired layout for easier scanning.
                        </Text>
                    </Group>
                    <Divider />
                    <Text size="sm" c="dimmed">
                        Charts and activity feeds will render here once connected to live data.
                    </Text>
                </Stack>
            </Paper>
        </div>
    );
};
