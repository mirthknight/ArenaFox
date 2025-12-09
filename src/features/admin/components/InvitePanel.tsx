import { Badge, Button, Group, Paper, Select, Stack, Text, TextInput } from '@mantine/core';
import { MailPlus } from 'lucide-react';
import type { MemberProfile } from '@/features/profiles/data/mockProfiles';

interface InvitePanelProps {
    inviteEmail: string;
    inviteRole: MemberProfile['role'];
    onEmailChange: (value: string) => void;
    onRoleChange: (value: MemberProfile['role']) => void;
    onSendInvite: () => void;
}

export const InvitePanel = ({ inviteEmail, inviteRole, onEmailChange, onRoleChange, onSendInvite }: InvitePanelProps) => (
    <Paper className="p-4 bg-[var(--af-surface-alt)] border border-[var(--af-border)] shadow-[0_12px_30px_rgba(0,0,0,0.35)]" radius="md">
        <Stack gap="sm">
            <Group gap="sm" align="flex-end" wrap="wrap">
                <TextInput
                    label="Invite by email"
                    placeholder="player@arena.gg"
                    value={inviteEmail}
                    onChange={(event) => onEmailChange(event.currentTarget.value)}
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
                    onChange={(value) => onRoleChange((value as MemberProfile['role']) ?? 'member')}
                    comboboxProps={{ withinPortal: false }}
                />
                <Button onClick={onSendInvite} disabled={!inviteEmail.trim()} leftSection={<MailPlus size={16} />}>
                    Send invite
                </Button>
            </Group>
            <Text size="xs" c="gray.5">
                Invitations keep accounts gated while we finish wiring real data.
            </Text>
            <Badge color="fox" variant="light" className="w-fit">
                Private beta only
            </Badge>
        </Stack>
    </Paper>
);
