import { useMemo, useState } from 'react';
import {
    Avatar,
    Badge,
    Button,
    Divider,
    Group,
    Modal,
    Stack,
    Switch,
    Table,
    Text,
    TextInput,
    Title,
    Tooltip,
    Select,
    Textarea,
    NumberInput,
    MultiSelect,
    Paper,
} from '@mantine/core';
import { Search, MailPlus, CheckCircle2, Pencil } from 'lucide-react';
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
            color: 'fox',
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
            color: 'fox',
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
                size="lg"
                overlayProps={{ blur: 4, opacity: 0.4 }}
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

                        <MultiSelect
                            label="Badges"
                            data={availableBadges.map((badge) => ({ value: badge, label: badge }))}
                            value={editDraft.badges}
                            onChange={(value) => updateDraftField('badges', value)}
                            searchable
                            placeholder="Add or remove badges"
                            comboboxProps={{ withinPortal: false }}
                        />

                        <NumberInput
                            label="Likes"
                            value={editDraft.likes}
                            onChange={(value) => updateDraftField('likes', typeof value === 'number' ? value : editDraft.likes)}
                            min={0}
                        />

                        <Group justify="space-between" align="center">
                            <Group gap="sm">
                                <Text size="sm" fw={600}>
                                    Verified badge
                                </Text>
                                <Badge color="fox" variant="light">Super admin only</Badge>
                            </Group>
                            <Switch
                                size="md"
                                color="fox"
                                checked={editDraft.isVerified}
                                onChange={() => canVerify && updateDraftField('isVerified', !editDraft.isVerified)}
                                disabled={!canVerify}
                            />
                        </Group>

                        <Group justify="space-between" align="center">
                            <Group gap="sm">
                                <Text size="sm" fw={600}>
                                    Enabled
                                </Text>
                                <Badge color={editDraft.isEnabled ? 'fox' : 'red'} variant="light">
                                    {editDraft.isEnabled ? 'Active' : 'Disabled'}
                                </Badge>
                            </Group>
                            <Switch
                                size="md"
                                color="fox"
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

            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 text-[var(--af-ink)]">
                <Group justify="space-between" align="flex-start">
                    <div>
                        <Title order={2} className="text-2xl md:text-3xl font-black tracking-tight text-[var(--af-ink)]">
                            User management
                        </Title>
                        <Text c="gray.5" size="sm">
                            Keep profiles tidy with the table below and edit everything through the modal.
                        </Text>
                    </div>
                    <TextInput
                        placeholder="Search people..."
                        leftSection={<Search size={16} />}
                        className="max-w-xs"
                        value={search}
                        onChange={(event) => setSearch(event.currentTarget.value)}
                    />
                </Group>

                <Paper className="p-4 bg-[var(--af-surface-alt)] border border-[var(--af-border)] shadow-[0_12px_30px_rgba(0,0,0,0.35)]" radius="md">
                    <Stack gap="sm">
                        <Group gap="sm" align="flex-end" wrap="wrap">
                            <TextInput
                                label="Invite by email"
                                placeholder="player@arena.gg"
                                value={inviteEmail}
                                onChange={(event) => setInviteEmail(event.currentTarget.value)}
                                leftSection={<MailPlus size={16} />}
                                className="min-w-[240px]"
                            />
                            <Select
                                label="Role"
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
                        </Group>
                        <Text size="xs" c="gray.5">
                            Invitations keep accounts gated while we finish wiring real data.
                        </Text>
                    </Stack>
                </Paper>

                <Paper className="p-4 bg-[var(--af-surface-alt)] border border-[var(--af-border)] shadow-[0_12px_30px_rgba(0,0,0,0.35)]" radius="md">
                    <Stack gap="md">
                        <Group justify="space-between" align="center">
                            <Text fw={700}>Directory</Text>
                            <Badge color="fox" variant="light">Edit opens modal</Badge>
                        </Group>
                        <Divider />
                        <div className="overflow-auto rounded-lg border border-[var(--af-border)] bg-[var(--af-surface)]">
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
                                    {filteredUsers.map((member) => (
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
                                                        onChange={() => toggleVerified(member.id)}
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
                                                        onChange={() => toggleEnabled(member.id)}
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
                                                    onClick={() => openEdit(member)}
                                                    disabled={!canModerate}
                                                >
                                                    Edit
                                                </Button>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </div>
                    </Stack>
                </Paper>
            </div>
        </>
    );
};

