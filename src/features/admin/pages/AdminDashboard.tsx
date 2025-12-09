import { useMemo, useState } from 'react';
import { Badge, Divider, Group, Paper, Stack, Text } from '@mantine/core';
import { MailPlus } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { defaultProfiles, type MemberProfile } from '@/features/profiles/data/mockProfiles';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { InvitePanel } from '../components/InvitePanel';
import { UserTable } from '../components/UserTable';
import { EditUserModal } from '../components/EditUserModal';
import type { AdminUser } from '../types/admin.types';

const createInitialUsers = () => defaultProfiles.map((profile) => ({ ...profile, invitationStatus: 'active' as const }));

export const AdminDashboard = () => {
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<MemberProfile['role']>('member');
    const [users, setUsers] = useState<AdminUser[]>(createInitialUsers());
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
                    ? {
                          ...member,
                          isVerified: !member.isVerified,
                          statusLabel: member.isVerified ? 'Verification removed' : 'Badge granted',
                      }
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
            <EditUserModal
                editingUser={editingUser}
                editDraft={editDraft}
                canModerate={canModerate}
                canVerify={canVerify}
                canEditRole={canEditRole}
                onClose={closeEdit}
                onUpdateDraft={updateDraftField}
                onSave={saveEdit}
            />

            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 text-[var(--af-ink)]">
                <AdminPageHeader search={search} onSearchChange={setSearch} />

                <InvitePanel
                    inviteEmail={inviteEmail}
                    inviteRole={inviteRole}
                    onEmailChange={setInviteEmail}
                    onRoleChange={setInviteRole}
                    onSendInvite={sendInvite}
                />

                <Paper className="p-4 bg-[var(--af-surface-alt)] border border-[var(--af-border)] shadow-[0_12px_30px_rgba(0,0,0,0.35)]" radius="md">
                    <Stack gap="md">
                        <Group justify="space-between" align="center">
                            <Text fw={700}>Directory</Text>
                            <Badge color="fox" variant="light">Edit opens modal</Badge>
                        </Group>
                        <Divider />
                        <UserTable
                            users={filteredUsers}
                            canModerate={canModerate}
                            canVerify={canVerify}
                            onToggleVerified={toggleVerified}
                            onToggleEnabled={toggleEnabled}
                            onEdit={openEdit}
                        />
                    </Stack>
                </Paper>
            </div>
        </>
    );
};
