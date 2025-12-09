'use client';

import { useState } from 'react';
import { Button, Group, Modal, Stack, TextInput, Text, Select } from '@mantine/core';
import { Rocket, Plus } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useWorkspaceActions } from '../state/useWorkspaceState';

interface WorkspaceCreateButtonProps {
  triggerVariant?: 'primary' | 'sidebar';
  compact?: boolean;
}

export const WorkspaceCreateButton = ({ triggerVariant = 'primary', compact = false }: WorkspaceCreateButtonProps) => {
  const { user } = useAuth();
  const { createWorkspace } = useWorkspaceActions();
  const [opened, setOpened] = useState(false);
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
    if (!name.trim()) {
      setError('Workspace name is required');
      return;
    }

    if (!user?.id) {
      setError('You need to be signed in to create a workspace.');
      return;
    }

    setIsSaving(true);

    try {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      await createWorkspace({
        name,
        slug,
        allianceName,
        allianceTag,
        description,
        serverId: typeof serverId === 'string' ? Number(serverId) || 0 : serverId,
        defaultTimezone,
        createdByUserId: user.id,
      });

      setOpened(false);
      resetForm();
    } catch (creationError) {
      console.error('[WorkspaceCreateButton] Failed to create workspace', creationError);
      setError('Unable to save workspace right now. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const TriggerButton = () => {
    if (triggerVariant === 'sidebar') {
      return (
        <Button
          fullWidth
          variant="light"
          color="fox"
          size={compact ? 'sm' : 'md'}
          leftSection={<Plus size={16} />}
          onClick={() => setOpened(true)}
          className="bg-[rgba(0,173,181,0.12)] border border-[var(--af-border)] text-[var(--af-ink)]"
        >
          {compact ? 'Add' : 'Create workspace'}
        </Button>
      );
    }

    return (
      <Button
        variant="gradient"
        gradient={{ from: '#0099a2', to: '#00adb5' }}
        leftSection={<Rocket size={18} />}
        onClick={() => setOpened(true)}
        className="text-[var(--af-ink)]"
      >
        New workspace
      </Button>
    );
  };

  return (
    <>
      <TriggerButton />
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Create a new workspace"
        centered
        radius="md"
        overlayProps={{ blur: 6 }}
      >
        <Stack gap="sm">
          <TextInput label="Workspace name" placeholder="Arena Fox HQ" value={name} onChange={(event) => setName(event.currentTarget.value)} />
          <Group grow>
            <TextInput label="Alliance name" placeholder="Northern Stars" value={allianceName} onChange={(event) => setAllianceName(event.currentTarget.value)} />
            <TextInput label="Alliance tag" placeholder="NST" value={allianceTag} onChange={(event) => setAllianceTag(event.currentTarget.value)} />
          </Group>
          <TextInput label="Description" placeholder="Coordinating arena events and training" value={description} onChange={(event) => setDescription(event.currentTarget.value)} />
          <Group grow>
            <TextInput label="Server ID" placeholder="123456" value={serverId} onChange={(event) => setServerId(event.currentTarget.value)} />
            <Select
              label="Default timezone"
              data={[{ value: 'UTC', label: 'UTC' }, { value: 'EST', label: 'US/Eastern' }, { value: 'PST', label: 'US/Pacific' }]}
              value={defaultTimezone}
              onChange={(value) => setDefaultTimezone(value ?? 'UTC')}
            />
          </Group>

          {error && (
            <Text size="sm" c="red.4">
              {error}
            </Text>
          )}

          <Group justify="flex-end">
            <Button variant="subtle" onClick={() => setOpened(false)}>
              Cancel
            </Button>
            <Button color="fox" onClick={handleCreate} loading={isSaving}>
              Save workspace
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};
