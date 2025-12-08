import { useMemo, useState } from 'react';
import {
    ActionIcon,
    Avatar,
    Badge,
    Button,
    Card,
    Divider,
    Group,
    Modal,
    Menu,
    SimpleGrid,
    Stack,
    Switch,
    Table,
    Text,
    TextInput,
    Title,
    Tooltip,
    Select,
    Textarea,
} from '@mantine/core';
import { Search, MoreHorizontal, Shield, UserCheck, UserX, Sparkles, MailPlus, CheckCircle2 } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import { useAuth } from '@/features/auth/context/AuthContext';
import { defaultProfiles, type MemberProfile } from '@/features/profiles/data/mockProfiles';
import { Navigate } from 'react-router-dom';

type AdminUser = MemberProfile & { invitationStatus: 'active' | 'pending' };

const availableBadges = ['Founder', 'Strategist', 'Moderator', 'Curator', 'Support', 'Tactician', 'Rookie'];

export const AdminDashboard = () => {
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<MemberProfile['role']>('member');
    const [users, setUsers] = useState<AdminUser[]>(
        defaultProfiles.map((profile) => ({ ...profile, invitationStatus: 'active' }))
    );
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [editDraft, setEditDraft] = useState<AdminUser | null>(null);

    const canVerify = user?.role === 'super_admin';
    const canModerate = canVerify || user?.role === 'admin';
    const canEditRole = user?.role === 'super_admin';
    const isAdminUser = canModerate;

    const filteredUsers = useMemo(
        () =>
            users.filter(
                (member) =>
                    member.displayName.toLowerCase().includes(search.toLowerCase()) ||
                    member.email.toLowerCase().includes(search.toLowerCase())
            ),
        [users, search]
    );

    const toggleVerified = (id: string) => {
        if (!canVerify) return;
        setUsers((prev) =>
            prev.map((member) =>
                member.id === id
                    ? { ...member, isVerified: !member.isVerified, statusLabel: member.isVerified ? 'Verification removed' : 'Badge granted' }
                    : member
            )
        );
    };

    const toggleEnabled = (id: string) => {
        if (!canModerate) return;
        setUsers((prev) =>
            prev.map((member) =>
                member.id === id
                    ? {
                          ...member,
                          isEnabled: !member.isEnabled,
                          statusLabel: member.isEnabled ? 'Disabled by admin' : 'Ready to compete',
                      }
                    : member
            )
        );
    };

    const updateBadges = (id: string, badge: string) => {
        if (!canModerate) return;
        setUsers((prev) =>
            prev.map((member) => {
                if (member.id !== id) return member;
                const hasBadge = member.badges.includes(badge);
                return {
                    ...member,
                    badges: hasBadge ? member.badges.filter((b) => b !== badge) : [...member.badges, badge],
                };
            })
        );
    };

    const sendInvite = () => {
        if (!inviteEmail.trim()) return;
        const handle = inviteEmail.split('@')[0];
        const newUser: AdminUser = {
            id: crypto.randomUUID(),
            displayName: handle.charAt(0).toUpperCase() + handle.slice(1),
            email: inviteEmail.trim().toLowerCase(),
            role: inviteRole,
            bio: 'Invited user awaiting first login.',
            badges: ['Invited'],
            likes: 0,
            isVerified: inviteRole === 'super_admin',
            isEnabled: true,
            statusLabel: 'Invite sent',
            avatarColor: 'cyan',
            invitationStatus: 'pending',
        };

        setUsers((prev) => [newUser, ...prev]);
        setInviteEmail('');

        notifications.show({
            title: 'Invitation dispatched',
            message: `${newUser.email} added as ${inviteRole}`,
            color: 'teal',
            icon: <MailPlus size={16} />,
        });
    };

    const updateDraftField = <K extends keyof AdminUser>(key: K, value: AdminUser[K]) => {
        setEditDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
    };

    const openEdit = (member: AdminUser) => {
        if (!canModerate) return;
        setEditingUser(member);
        setEditDraft(member);
    };

    const closeEdit = () => {
        setEditingUser(null);
        setEditDraft(null);
    };

    const saveEdit = () => {
        if (!editDraft) return;

        setUsers((prev) =>
            prev.map((member) =>
                member.id === editDraft.id
                    ? {
                          ...member,
                          ...editDraft,
                          role: canEditRole ? editDraft.role : member.role,
                          statusLabel: editDraft.statusLabel?.trim() || null,
                      }
                    : member
            )
        );

        notifications.show({
            title: 'Profile updated',
            message: `${editDraft.displayName} has been refreshed`,
            color: 'teal',
        });

        closeEdit();
    };

    if (!isAdminUser) {
        return <Navigate to="/" replace />;
    }

    return (
        <>
            <Modal
                opened={Boolean(editingUser)}
                onClose={closeEdit}
                title="Edit profile"
                centered
                overlayProps={{ blur: 4, opacity: 0.6 }}
                classNames={{ content: 'bg-[#0b1220] border border-white/10', header: 'border-b border-white/5' }}
            >
                {editDraft && (
                    <Stack gap="md">
                        <TextInput
                            label="Display name"
                            value={editDraft.displayName}
                            onChange={(event) => updateDraftField('displayName', event.currentTarget.value)}
                        />
                        <TextInput label="Email" value={editDraft.email} disabled />
                        <Textarea
                            label="Bio"
                            minRows={3}
                            value={editDraft.bio}
                            onChange={(event) => updateDraftField('bio', event.currentTarget.value)}
                        />
                        <TextInput
                            label="Status label"
                            placeholder="e.g., Ready to compete"
                            value={editDraft.statusLabel ?? ''}
                            onChange={(event) => updateDraftField('statusLabel', event.currentTarget.value)}
                        />
                        <Select
                            label="Role"
                            data={[
                                { label: 'Member', value: 'member' },
                                { label: 'Admin', value: 'admin' },
                                { label: 'Super admin', value: 'super_admin' },
                            ]}
                            value={editDraft.role}
                            onChange={(value) => updateDraftField('role', (value as MemberProfile['role']) ?? editDraft.role)}
                            disabled={!canEditRole}
                            comboboxProps={{ withinPortal: false }}
                        />

                        <Group justify="space-between" align="center">
                            <Group gap="sm">
                                <Text size="sm" fw={600} className="text-white">
                                    Verified badge
                                </Text>
                                <Badge color="teal" variant="light">Super admin only</Badge>
                            </Group>
                            <Switch
                                size="md"
                                color="teal"
                                checked={editDraft.isVerified}
                                onChange={() => canVerify && updateDraftField('isVerified', !editDraft.isVerified)}
                                disabled={!canVerify}
                            />
                        </Group>

                        <Group justify="space-between" align="center">
                            <Group gap="sm">
                                <Text size="sm" fw={600} className="text-white">
                                    Enabled
                                </Text>
                                <Badge color={editDraft.isEnabled ? 'teal' : 'red'} variant="light">
                                    {editDraft.isEnabled ? 'Active' : 'Disabled'}
                                </Badge>
                            </Group>
                            <Switch
                                size="md"
                                color="cyan"
                                checked={editDraft.isEnabled}
                                onChange={() => canModerate && updateDraftField('isEnabled', !editDraft.isEnabled)}
                                disabled={!canModerate}
                            />
                        </Group>

                        <Group justify="flex-end" gap="sm" mt="md">
                            <Button variant="default" onClick={closeEdit} color="gray">
                                Cancel
                            </Button>
                            <Button onClick={saveEdit} leftSection={<CheckCircle2 size={16} />}>
                                Save changes
                            </Button>
                        </Group>
                    </Stack>
                )}
            </Modal>

            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Group justify="space-between" align="flex-start">
                <div>
                    <Title order={2} className="text-2xl md:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-200 to-sky-300">
                        Super admin controls
                    </Title>
                    <Text c="dimmed" size="sm">
                        Invite users, manage verification, and keep access aligned with login styling.
                    </Text>
                </div>
                <Badge color="teal" variant="light" leftSection={<Sparkles size={14} />}>Consistent UI</Badge>
            </Group>

            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
                <Card className="bg-white/5 border border-white/10 backdrop-blur-xl" radius="lg" padding="lg">
                    <Stack gap="sm">
                        <Group justify="space-between">
                            <Text fw={700}>Invite by email</Text>
                            <Badge color="cyan" variant="light">Admin & Super admin</Badge>
                        </Group>
                        <TextInput
                            placeholder="player@arena.gg"
                            value={inviteEmail}
                            onChange={(event) => setInviteEmail(event.currentTarget.value)}
                            leftSection={<MailPlus size={16} />}
                        />
                        <Select
                            data={[
                                { label: 'Member', value: 'member' },
                                { label: 'Admin', value: 'admin' },
                                { label: 'Super admin', value: 'super_admin' },
                            ]}
                            value={inviteRole}
                            onChange={(value) => setInviteRole((value as MemberProfile['role']) ?? 'member')}
                            comboboxProps={{ withinPortal: false }}
                        />
                        <Button onClick={sendInvite} disabled={!inviteEmail.trim()} leftSection={<MailPlus size={16} />}>
                            Send invite
                        </Button>
                        <Text size="xs" c="gray.4">
                            No open sign-ups. Every account is invitation only.
                        </Text>
                    </Stack>
                </Card>

                <Card className="bg-white/5 border border-white/10 backdrop-blur-xl" radius="lg" padding="lg">
                    <Stack gap="sm">
                        <Group justify="space-between">
                            <Text fw={700}>Verification badge</Text>
                            <Badge color="teal" variant="light">Super admin only</Badge>
                        </Group>
                        <Text size="sm" c="gray.3">
                            Super admin toggles the verified shield to align with login trust indicators.
                        </Text>
                        <Group gap="xs">
                            <Badge color="teal" leftSection={<Shield size={12} />}>
                                Enabled per user
                            </Badge>
                            <Badge color="gray" variant="outline">
                                RLS respected
                            </Badge>
                        </Group>
                    </Stack>
                </Card>

                <Card className="bg-white/5 border border-white/10 backdrop-blur-xl" radius="lg" padding="lg">
                    <Stack gap="sm">
                        <Group justify="space-between">
                            <Text fw={700}>Profile management</Text>
                            <Badge color="violet" variant="light">Editable</Badge>
                        </Group>
                        <Text size="sm" c="gray.3">
                            Admins and super admins can disable accounts or adjust badges directly from the dashboard.
                        </Text>
                        <Divider className="border-white/5" />
                        <Text size="xs" c="gray.4">
                            Login experience and dashboard chrome now share the same neon palette.
                        </Text>
                    </Stack>
                </Card>
            </SimpleGrid>

            <Card className="bg-white/5 border border-white/10 backdrop-blur-xl" radius="lg" padding="lg">
                <Stack gap="md">
                    <Group justify="space-between" align="center">
                        <Text fw={700}>User directory</Text>
                        <TextInput
                            placeholder="Search users..."
                            leftSection={<Search size={16} />}
                            className="max-w-md"
                            styles={{ input: { backgroundColor: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.1)' } }}
                            value={search}
                            onChange={(event) => setSearch(event.currentTarget.value)}
                        />
                    </Group>

                    <Table verticalSpacing="sm" className="bg-transparent hover:bg-transparent">
                        <Table.Thead className="bg-white/5">
                            <Table.Tr>
                                <Table.Th className="text-zinc-300">User</Table.Th>
                                <Table.Th className="text-zinc-300">Role</Table.Th>
                                <Table.Th className="text-zinc-300">Badges</Table.Th>
                                <Table.Th className="text-zinc-300">Verified</Table.Th>
                                <Table.Th className="text-zinc-300">Enabled</Table.Th>
                                <Table.Th className="text-zinc-300">Likes</Table.Th>
                                <Table.Th className="text-zinc-300 text-right">Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {filteredUsers.map((member) => (
                                <Table.Tr key={member.id} className="hover:bg-white/5 transition-colors">
                                    <Table.Td>
                                        <Group gap="sm">
                                            <Avatar radius="xl" color={member.avatarColor ?? 'blue'}>{member.displayName[0]}</Avatar>
                                            <div>
                                                <Group gap={6}>
                                                    <Text size="sm" fw={600} className="text-white">
                                                        {member.displayName}
                                                    </Text>
                                                    {member.invitationStatus === 'pending' && (
                                                        <Badge color="yellow" size="xs" leftSection={<MailPlus size={10} />}>Pending</Badge>
                                                    )}
                                                </Group>
                                                <Text size="xs" c="dimmed">{member.email}</Text>
                                            </div>
                                        </Group>
                                    </Table.Td>
                                    <Table.Td>
                                        <Badge
                                            variant="dot"
                                            color={member.role === 'super_admin' ? 'pink' : member.role === 'admin' ? 'blue' : 'gray'}
                                            className="bg-transparent"
                                        >
                                            {member.role.replace('_', ' ')}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        <Group gap={6} className="flex flex-wrap">
                                            {member.badges.map((badge) => (
                                                <Badge key={badge} color="violet" variant="light" size="xs">
                                                    {badge}
                                                </Badge>
                                            ))}
                                        </Group>
                                    </Table.Td>
                                    <Table.Td>
                                        <Tooltip label={canVerify ? 'Toggle verified badge' : 'Only super admin can verify'}>
                                            <Switch
                                                color="teal"
                                                size="sm"
                                                checked={member.isVerified}
                                                onChange={() => toggleVerified(member.id)}
                                                disabled={!canVerify}
                                            />
                                        </Tooltip>
                                    </Table.Td>
                                    <Table.Td>
                                        <Tooltip label={canModerate ? 'Enable or disable account' : 'Admin access required'}>
                                            <Switch
                                                color="cyan"
                                                size="sm"
                                                checked={member.isEnabled}
                                                onChange={() => toggleEnabled(member.id)}
                                                disabled={!canModerate}
                                            />
                                        </Tooltip>
                                    </Table.Td>
                                    <Table.Td>
                                        <Badge color="cyan" variant="light">{member.likes}</Badge>
                                    </Table.Td>
                                    <Table.Td className="text-right">
                                        <Menu position="bottom-end" shadow="md" width={220} withinPortal>
                                            <Menu.Target>
                                                <ActionIcon variant="subtle" color="gray">
                                                    <MoreHorizontal size={16} />
                                                </ActionIcon>
                                            </Menu.Target>
                                            <Menu.Dropdown className="bg-zinc-900 border-zinc-800">
                                                <Menu.Label>Profile management</Menu.Label>
                                                <Menu.Item
                                                    leftSection={<UserCheck size={14} />}
                                                    onClick={() => openEdit(member)}
                                                    disabled={!canModerate}
                                                >
                                                    Edit details
                                                </Menu.Item>
                                                <Menu.Item leftSection={<CheckCircle2 size={14} />} onClick={() => toggleVerified(member.id)} disabled={!canVerify}>
                                                    {member.isVerified ? 'Remove badge' : 'Grant verified badge'}
                                                </Menu.Item>
                                                <Menu.Divider className="border-zinc-700" />
                                                <Menu.Label>Badges</Menu.Label>
                                                {availableBadges.map((badge) => (
                                                    <Menu.Item
                                                        key={badge}
                                                        leftSection={<Shield size={12} />}
                                                        onClick={() => updateBadges(member.id, badge)}
                                                        disabled={!canModerate}
                                                    >
                                                        {member.badges.includes(badge) ? 'Remove' : 'Add'} {badge}
                                                    </Menu.Item>
                                                ))}
                                                <Menu.Divider className="border-zinc-700" />
                                                <Menu.Item color="red" leftSection={<UserX size={14} />} onClick={() => toggleEnabled(member.id)} disabled={!canModerate}>
                                                    {member.isEnabled ? 'Disable account' : 'Enable account'}
                                                </Menu.Item>
                                            </Menu.Dropdown>
                                        </Menu>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Stack>
            </Card>
            </div>
        </>
    );
};

