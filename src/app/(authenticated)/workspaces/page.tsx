'use client';

import { useEffect, useMemo, useState } from 'react';
import { Badge, Card, Group, Skeleton, Stack, Text, Title } from '@mantine/core';
import { Activity, Building2, Users } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { WorkspaceCreateButton } from '@/features/workspaces/components/WorkspaceCreateButton';
import { getWorkspaceSummary } from '@/features/workspaces/selectors/workspaceSelectors';
import { workspaceStore } from '@/features/workspaces/state/workspaceStore';
import { useWorkspaceState } from '@/features/workspaces/state/useWorkspaceState';

const WorkspaceDirectoryPage = () => {
  const { user } = useAuth();
  const workspaces = useWorkspaceState((state) => state.workspaces);
  const members = useWorkspaceState((state) => state.workspaceMembers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const hydrate = async () => {
      if (!user?.id) return;
      setLoading(true);
      setError(null);

      try {
        await workspaceStore.hydrateForUser(user.id, {
          id: user.id,
          email: user.email,
          displayName: user.displayName ?? user.email,
          avatarUrl: user.avatarUrl,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } catch (hydrationError) {
        console.error('[WorkspaceDirectoryPage] Failed to hydrate workspace store', hydrationError);
        if (mounted) {
          setError('Unable to load workspaces right now.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    hydrate();

    return () => {
      mounted = false;
    };
  }, [user?.id, user?.email, user?.displayName, user?.avatarUrl]);

  const userWorkspaces = useMemo(() => {
    if (!user?.id) return [];

    const memberWorkspaceIds = members
      .filter((member) => member.userId === user.id)
      .map((member) => member.workspaceId);

    return workspaces.filter(
      (workspace) => workspace.createdByUserId === user.id || memberWorkspaceIds.includes(workspace.id)
    );
  }, [user?.id, members, workspaces]);

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-start">
        <Stack gap={4}>
          <Title order={2} className="text-[var(--af-ink)]">
            Workspaces
          </Title>
          <Text c="gray.5" size="sm">
            Keep your alliances organized across servers with shared dashboards.
          </Text>
        </Stack>
        <WorkspaceCreateButton />
      </Group>

      {error && (
        <Card shadow="sm" padding="md" radius="md" className="border border-red-400/30 bg-red-900/10 text-red-1">
          {error}
        </Card>
      )}

      {loading ? (
        <Stack gap="md">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} height={120} radius="md" />
          ))}
        </Stack>
      ) : (
        <Stack gap="md">
          {userWorkspaces.map((workspace) => {
            const summary = getWorkspaceSummary(workspaceStore.getState(), workspace.id);

            return (
              <Card
                key={workspace.id}
                shadow="sm"
                padding="md"
                radius="md"
                className="border border-[var(--af-border)] bg-[rgba(255,255,255,0.02)]"
              >
                <Group justify="space-between" align="flex-start">
                  <Stack gap={6} className="flex-1 min-w-0">
                    <Group gap="sm" wrap="wrap">
                      <Badge color="fox" variant="light" leftSection={<Building2 size={14} />}>
                        {workspace.serverId ? `Server ${workspace.serverId}` : 'Workspace'}
                      </Badge>
                      {workspace.allianceTag && (
                        <Badge color="gray" variant="light">
                          {workspace.allianceTag}
                        </Badge>
                      )}
                      {workspace.isArchived && <Badge color="gray">Archived</Badge>}
                    </Group>
                    <Title order={4} className="text-[var(--af-ink)] leading-tight">
                      {workspace.name}
                    </Title>
                    <Text size="sm" c="gray.4" className="max-w-3xl">
                      {workspace.description || 'No description yet.'}
                    </Text>
                  </Stack>
                  <Group gap="md" wrap="wrap" align="flex-start">
                    <Stack gap={4} align="flex-end">
                      <Group gap={6} c="gray.4">
                        <Users size={16} />
                        <Text size="sm">{summary.totalPlayers} members</Text>
                      </Group>
                      <Group gap={6} c="gray.4">
                        <Activity size={16} />
                        <Text size="sm">{summary.upcomingEventsCount} upcoming events</Text>
                      </Group>
                    </Stack>
                  </Group>
                </Group>
              </Card>
            );
          })}

          {userWorkspaces.length === 0 && !loading && (
            <Card shadow="sm" padding="lg" radius="md" className="border border-[var(--af-border)] text-[var(--af-ink-soft)]">
              <Stack gap="sm" align="center">
                <Text size="sm">You don’t have any workspaces yet.</Text>
                <WorkspaceCreateButton />
              </Stack>
            </Card>
          )}
        </Stack>
      )}
    </Stack>
  );
};

export default WorkspaceDirectoryPage;
