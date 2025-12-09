import { Avatar, Button, Group, Switch, Table, Text, Tooltip } from '@mantine/core';
import { Pencil } from 'lucide-react';
import type { AdminUser } from '../types/admin.types';

interface UserTableProps {
    users: AdminUser[];
    canModerate: boolean;
    canVerify: boolean;
    onToggleVerified: (id: string) => void;
    onToggleEnabled: (id: string) => void;
    onEdit: (user: AdminUser) => void;
}

export const UserTable = ({ users, canModerate, canVerify, onToggleVerified, onToggleEnabled, onEdit }: UserTableProps) => (
    <div className="rounded-lg border border-[var(--af-border)] bg-[var(--af-surface)]">
        <Table.ScrollContainer minWidth={820}>
            <Table verticalSpacing="sm" highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>User</Table.Th>
                        <Table.Th>Role</Table.Th>
                        <Table.Th>Badges</Table.Th>
                        <Table.Th>Verified</Table.Th>
                        <Table.Th>Enabled</Table.Th>
                        <Table.Th>Likes</Table.Th>
                        <Table.Th className="text-right">Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {users.map((member) => (
                        <Table.Tr key={member.id}>
                            <Table.Td>
                                <Group gap="sm">
                                    <Avatar radius="xl" color={member.avatarColor ?? 'blue'}>{member.displayName[0]}</Avatar>
                                    <div>
                                        <Text size="sm" fw={600}>
                                            {member.displayName}
                                        </Text>
                                        <Text size="xs" c="gray.5">
                                            {member.email}
                                        </Text>
                                    </div>
                                </Group>
                            </Table.Td>
                            <Table.Td>
                                <Text size="sm" tt="capitalize">
                                    {member.role.replace('_', ' ')}
                                </Text>
                            </Table.Td>
                            <Table.Td>
                                <Text size="sm" c="gray.5">
                                    {member.badges.length ? member.badges.join(', ') : 'None'}
                                </Text>
                            </Table.Td>
                            <Table.Td>
                                <Tooltip label={canVerify ? 'Toggle verified badge' : 'Only super admin can verify'}>
                                    <Switch
                                        color="fox"
                                        size="sm"
                                        checked={member.isVerified}
                                        onChange={() => onToggleVerified(member.id)}
                                        disabled={!canVerify}
                                    />
                                </Tooltip>
                            </Table.Td>
                            <Table.Td>
                                <Tooltip label={canModerate ? 'Enable or disable account' : 'Admin access required'}>
                                    <Switch
                                        color="fox"
                                        size="sm"
                                        checked={member.isEnabled}
                                        onChange={() => onToggleEnabled(member.id)}
                                        disabled={!canModerate}
                                    />
                                </Tooltip>
                            </Table.Td>
                            <Table.Td>
                                <Text fw={600}>{member.likes}</Text>
                            </Table.Td>
                            <Table.Td className="text-right">
                                <Button
                                    variant="light"
                                    size="xs"
                                    leftSection={<Pencil size={14} />}
                                    onClick={() => onEdit(member)}
                                    disabled={!canModerate}
                                >
                                    Edit
                                </Button>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    </div>
);
