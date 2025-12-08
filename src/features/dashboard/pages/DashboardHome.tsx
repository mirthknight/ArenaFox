import { SimpleGrid, Paper, Text, Group, Badge } from '@mantine/core';
import { ArrowUpRight, Users, Trophy, TrendingUp, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';

export const DashboardHome = () => {
    const { user } = useAuth();

    const StatCard = ({ title, value, icon: Icon, color }: any) => (
        <Paper className="p-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 backdrop-blur-xl shadow-[0_15px_45px_rgba(0,0,0,0.35)]" radius="md">
            <Group justify="space-between" mb="xs">
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                    {title}
                </Text>
                <Icon size={20} className={`text-${color}-500`} />
            </Group>

            <Group align="flex-end" gap="xs">
                <Text className="text-3xl font-bold font-mono text-white">{value}</Text>
                <Text color="teal" size="sm" fw={500} className="flex items-center mb-1">
                    <ArrowUpRight size={14} className="mr-0.5" />
                    12%
                </Text>
            </Group>
        </Paper>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <Text className="text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
                    Welcome back, {user?.displayName}
                </Text>
                <Group mt="xs" gap="sm">
                    <Text c="dimmed">
                        Unified access across login and dashboard.
                    </Text>
                    <Badge color="teal" leftSection={<ShieldCheck size={12} />} variant="light">
                        Verified session
                    </Badge>
                </Group>
            </div>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
                <StatCard title="Total Players" value="2,543" icon={Users} color="blue" />
                <StatCard title="Active Battles" value="12" icon={Trophy} color="yellow" />
                <StatCard title="Win Rate" value="68%" icon={TrendingUp} color="green" />
                <StatCard title="Total XP" value="892k" icon={Users} color="purple" />
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                <Paper className="p-6 bg-zinc-900/50 border border-white/5 h-64 flex flex-col justify-center items-center text-center">
                    <Text c="dimmed">Detailed analytics chart placeholder</Text>
                </Paper>
                <Paper className="p-6 bg-zinc-900/50 border border-white/5 h-64 flex flex-col justify-center items-center text-center">
                    <Text c="dimmed">Recent activity feed placeholder</Text>
                </Paper>
            </SimpleGrid>
        </div>
    );
};
