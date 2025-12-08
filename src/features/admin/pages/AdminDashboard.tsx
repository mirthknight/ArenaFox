import { Badge, Button, Group, Table, Text, TextInput, Avatar, ActionIcon, Menu } from '@mantine/core';
import { Search, MoreHorizontal, Shield, UserCheck, UserX } from 'lucide-react';

const MOCK_USERS = [
    { id: 1, name: 'MirthKnight', email: 'mirthknight@gmail.com', role: 'super_admin', status: 'active' },
    { id: 2, name: 'ArenaFox', email: 'bot@fox.gg', role: 'admin', status: 'active' },
    { id: 3, name: 'Guest User', email: 'guest@example.com', role: 'member', status: 'inactive' },
];

export const AdminDashboard = () => {
    // In a real implementation, fetch users from Supabase here

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Group justify="space-between">
                <div>
                    <Text className="text-2xl font-bold text-white">User Management</Text>
                    <Text c="dimmed" size="sm">Manage accounts, permissions, and status.</Text>
                </div>
                <Button variant="white" color="dark">
                    Add User
                </Button>
            </Group>

            <div className="bg-zinc-900/50 border border-white/5 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-white/5">
                    <TextInput
                        placeholder="Search users..."
                        leftSection={<Search size={16} />}
                        className="max-w-md"
                        styles={{ input: { backgroundColor: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.1)' } }}
                    />
                </div>

                <Table verticalSpacing="sm" className="bg-transparent hover:bg-transparent">
                    <Table.Thead className="bg-white/5">
                        <Table.Tr>
                            <Table.Th className="text-zinc-400">User</Table.Th>
                            <Table.Th className="text-zinc-400">Role</Table.Th>
                            <Table.Th className="text-zinc-400">Status</Table.Th>
                            <Table.Th className="text-zinc-400 text-right">Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {MOCK_USERS.map((user) => (
                            <Table.Tr key={user.id} className="hover:bg-white/5 transition-colors">
                                <Table.Td>
                                    <Group gap="sm">
                                        <Avatar radius="xl" color="blue">{user.name[0]}</Avatar>
                                        <div>
                                            <Text size="sm" fw={500} className="text-white">{user.name}</Text>
                                            <Text size="xs" c="dimmed">{user.email}</Text>
                                        </div>
                                    </Group>
                                </Table.Td>
                                <Table.Td>
                                    <Badge
                                        variant="dot"
                                        color={user.role === 'super_admin' ? 'pink' : user.role === 'admin' ? 'blue' : 'gray'}
                                        className="bg-transparent"
                                    >
                                        {user.role.replace('_', ' ')}
                                    </Badge>
                                </Table.Td>
                                <Table.Td>
                                    <Badge
                                        color={user.status === 'active' ? 'teal' : 'red'}
                                        variant="light"
                                    >
                                        {user.status}
                                    </Badge>
                                </Table.Td>
                                <Table.Td className="text-right">
                                    <Menu position="bottom-end" shadow="md">
                                        <Menu.Target>
                                            <ActionIcon variant="subtle" color="gray">
                                                <MoreHorizontal size={16} />
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown className="bg-zinc-900 border-zinc-800">
                                            <Menu.Item leftSection={<UserCheck size={14} />}>Edit Details</Menu.Item>
                                            <Menu.Item leftSection={<Shield size={14} />}>Change Role</Menu.Item>
                                            <Menu.Divider className="border-zinc-700" />
                                            <Menu.Item color="red" leftSection={<UserX size={14} />}>Disable Account</Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </div>
        </div>
    );
};
