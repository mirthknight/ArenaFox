import { useState } from 'react';
import {
    Badge,
    Button,
    Group,
    Modal,
    NumberInput,
    Select,
    Stack,
    Text,
    TextInput,
    Textarea,
    UnstyledButton
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { Plus, Sparkles } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { workspaceStore } from '@/features/workspaces';

interface WorkspaceCreateButtonProps {
    triggerVariant?: 'primary' | 'sidebar';
    compact?: boolean;
}

const TIMEZONE_OPTIONS = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'America/New_York' },
    { value: 'Europe/London', label: 'Europe/London' },
    { value: 'Asia/Singapore', label: 'Asia/Singapore' },
];

const toSlug = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
        .replace(/-{2,}/g, '-') || `workspace-${Date.now()}`;

export const WorkspaceCreateButton = ({ triggerVariant = 'primary', compact = false }: WorkspaceCreateButtonProps) => {
    const { user } = useAuth();
    const [opened, { open, close }] = useDisclosure(false);
    const [name, setName] = useState('');
    const [allianceName, setAllianceName] = useState('');
    const [allianceTag, setAllianceTag] = useState('');
    const [description, setDescription] = useState('');
    const [serverId, setServerId] = useState<string | number>('');
    const [defaultTimezone, setDefaultTimezone] = useState('UTC');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resetForm = () => {
        setName('');
        setAllianceName('');
        setAllianceTag('');
        setDescription('');
        setServerId('');
        setDefaultTimezone('UTC');
        setError(null);
    };

    const handleCreate = async () => {
        if (!user) {
            setError('You need to be signed in to create a workspace.');
            return;
        }

        const trimmedName = name.trim();
        const trimmedAlliance = allianceName.trim();

        if (!trimmedName || !trimmedAlliance) {
            setError('Workspace name and alliance name are required.');
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            await workspaceStore.createWorkspace({
                name: trimmedName,
                slug: toSlug(trimmedName),
                serverId: typeof serverId === 'number' ? serverId : 0,
                allianceName: trimmedAlliance,
                allianceTag: allianceTag.trim() || undefined,
                description: description.trim() || undefined,
                defaultTimezone,
                createdByUserId: user.id,
            });

            notifications.show({
                title: 'Workspace created',
                message: `${trimmedName} is ready for your team.`,
                color: 'teal',
                withBorder: true,
            });

            resetForm();
            close();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unable to create workspace right now.';
            setError(message);
            notifications.show({
                title: 'Workspace creation failed',
                message,
                color: 'red',
                withBorder: true,
            });
        } finally {
            setIsSaving(false);
        }
    };

    const trigger =
        triggerVariant === 'sidebar' ? (
            <UnstyledButton
                onClick={open}
                className="group w-full"
                aria-label="Create workspace"
            >
                <div
                    className={`relative w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200
                        bg-[rgba(0,173,181,0.14)] text-[var(--af-ink)] shadow-[0_12px_28px_rgba(0,0,0,0.26)] border
                        border-[rgba(0,173,181,0.28)] hover:bg-[rgba(0,173,181,0.2)] ${compact ? 'justify-center' : ''}`}
                >
                    <span className="grid h-10 w-10 place-items-center rounded-lg border border-[rgba(0,173,181,0.45)]
                        bg-[rgba(0,173,181,0.22)] text-[var(--af-accent)]">
                        <Plus size={18} />
                    </span>
                    {!compact && (
                        <div className="flex-1 min-w-0">
                            <Text size="sm" fw={700} className="tracking-tight truncate">
                                New workspace
                            </Text>
                            <Text size="xs" c="gray.5" className="leading-tight">
                                Invite teammates and start logging events.
                            </Text>
                        </div>
                    )}
                </div>
            </UnstyledButton>
        ) : (
            <Button
                onClick={open}
                leftSection={<Sparkles size={16} />}
                color="fox"
                radius="md"
                size="md"
                className="bg-[var(--af-accent)] text-[var(--af-ink)] shadow-[0_10px_28px_rgba(0,0,0,0.25)] hover:shadow-[0_14px_34px_rgba(0,0,0,0.3)]"
            >
                Create workspace
            </Button>
        );

    return (
        <>
            {trigger}

            <Modal
                opened={opened}
                onClose={() => {
                    close();
                    resetForm();
                }}
                title={
                    <Group gap="xs">
                        <Badge color="fox" variant="light" size="lg" radius="sm">
                            Workspace
                        </Badge>
                        <Text fw={800}>Create a new workspace</Text>
                    </Group>
                }
                centered
                size="lg"
                overlayProps={{ backgroundOpacity: 0.55, blur: 4 }}
            >
                <Stack gap="md">
                    <Group justify="space-between">
                        <Text c="gray.5" size="sm">
                            Workspaces keep your alliance members, players, and events organized.
                        </Text>
                        <Badge color="gray" variant="outline">
                            {user ? 'Signed in' : 'Sign in required'}
                        </Badge>
                    </Group>

                    <TextInput
                        label="Workspace name"
                        placeholder="Server 1161 – MEM"
                        value={name}
                        onChange={(event) => setName(event.currentTarget.value)}
                        required
                    />

                    <NumberInput
                        label="Server ID"
                        placeholder="1161"
                        value={serverId}
                        onChange={setServerId}
                        min={0}
                        clampBehavior="strict"
                        hideControls
                    />

                    <Group grow>
                        <TextInput
                            label="Alliance name"
                            placeholder="MEM"
                            value={allianceName}
                            onChange={(event) => setAllianceName(event.currentTarget.value)}
                            required
                        />
                        <TextInput
                            label="Alliance tag"
                            placeholder="MEM"
                            value={allianceTag}
                            onChange={(event) => setAllianceTag(event.currentTarget.value)}
                        />
                    </Group>

                    <Textarea
                        label="Description"
                        placeholder="Add context for your officers and members"
                        minRows={2}
                        autosize
                        value={description}
                        onChange={(event) => setDescription(event.currentTarget.value)}
                    />

                    <Select
                        label="Default timezone"
                        placeholder="Select a timezone"
                        data={TIMEZONE_OPTIONS}
                        value={defaultTimezone}
                        onChange={(value) => setDefaultTimezone(value ?? 'UTC')}
                    />

                    {error && (
                        <Text size="sm" c="red.5">
                            {error}
                        </Text>
                    )}

                    <Group justify="flex-end" mt="sm">
                        <Button variant="subtle" onClick={close} radius="md">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreate}
                            loading={isSaving}
                            leftSection={<Plus size={16} />}
                            color="fox"
                            radius="md"
                        >
                            Create workspace
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </>
    );
};
