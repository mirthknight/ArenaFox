import { Badge, Button, Group, Modal, MultiSelect, NumberInput, Select, Stack, Switch, Text, TextInput, Textarea } from '@mantine/core';
import { CheckCircle2 } from 'lucide-react';
import type { AdminUser } from '../types/admin.types';
import type { MemberProfile } from '@/features/profiles/data/mockProfiles';

const availableBadges = ['Founder', 'Strategist', 'Moderator', 'Curator', 'Support', 'Tactician', 'Rookie'];

interface EditUserModalProps {
    editingUser: AdminUser | null;
    editDraft: AdminUser | null;
    canModerate: boolean;
    canVerify: boolean;
    canEditRole: boolean;
    onClose: () => void;
    onUpdateDraft: <K extends keyof AdminUser>(key: K, value: AdminUser[K]) => void;
    onSave: () => void;
}

export const EditUserModal = ({
    editingUser,
    editDraft,
    canModerate,
    canVerify,
    canEditRole,
    onClose,
    onUpdateDraft,
    onSave,
}: EditUserModalProps) => (
    <Modal
        opened={Boolean(editingUser)}
        onClose={onClose}
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
                    onChange={(event) => onUpdateDraft('displayName', event.currentTarget.value)}
                />
                <TextInput label="Email" value={editDraft.email} disabled />
                <Textarea
                    label="Bio"
                    minRows={3}
                    value={editDraft.bio}
                    onChange={(event) => onUpdateDraft('bio', event.currentTarget.value)}
                />
                <TextInput
                    label="Status label"
                    placeholder="e.g., Ready to compete"
                    value={editDraft.statusLabel ?? ''}
                    onChange={(event) => onUpdateDraft('statusLabel', event.currentTarget.value)}
                />
                <Select
                    label="Role"
                    data={[
                        { label: 'Member', value: 'member' },
                        { label: 'Admin', value: 'admin' },
                        { label: 'Super admin', value: 'super_admin' },
                    ]}
                    value={editDraft.role}
                    onChange={(value) => onUpdateDraft('role', (value as MemberProfile['role']) ?? editDraft.role)}
                    disabled={!canEditRole}
                    comboboxProps={{ withinPortal: false }}
                />

                <MultiSelect
                    label="Badges"
                    data={availableBadges.map((badge) => ({ value: badge, label: badge }))}
                    value={editDraft.badges}
                    onChange={(value) => onUpdateDraft('badges', value)}
                    searchable
                    placeholder="Add or remove badges"
                    comboboxProps={{ withinPortal: false }}
                />

                <NumberInput
                    label="Likes"
                    value={editDraft.likes}
                    onChange={(value) => onUpdateDraft('likes', typeof value === 'number' ? value : editDraft.likes)}
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
                        onChange={() => canVerify && onUpdateDraft('isVerified', !editDraft.isVerified)}
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
                        onChange={() => canModerate && onUpdateDraft('isEnabled', !editDraft.isEnabled)}
                        disabled={!canModerate}
                    />
                </Group>

                <Group justify="flex-end" gap="sm" mt="md">
                    <Button variant="default" onClick={onClose} color="gray">
                        Cancel
                    </Button>
                    <Button onClick={onSave} leftSection={<CheckCircle2 size={16} />}>
                        Save changes
                    </Button>
                </Group>
            </Stack>
        )}
    </Modal>
);
