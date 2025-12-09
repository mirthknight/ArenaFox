import { isSupabaseConfigured, supabaseClient } from '@/shared/lib/supabaseClient';
import type { ArenaState, PartialArenaState } from './workspaceStore';

const SNAPSHOT_TABLE = 'workspace_state_snapshots';

const inMemorySnapshots = new Map<string, PartialArenaState>();

const makeKey = (userId: string, workspaceId?: string | null) => `${userId}::${workspaceId ?? 'all'}`;

export const loadWorkspaceState = async (
  userId: string,
  workspaceId?: string | null
): Promise<PartialArenaState> => {
  if (!userId) return {};

  if (!isSupabaseConfigured) {
    return inMemorySnapshots.get(makeKey(userId, workspaceId)) ?? {};
  }

  const { data, error } = await supabaseClient
    .from(SNAPSHOT_TABLE)
    .select('state_json')
    .match({ user_id: userId, workspace_id: workspaceId ?? null })
    .maybeSingle();

  if (error) {
    console.warn('[workspaceStorage] Falling back to memory snapshots', error);
    return inMemorySnapshots.get(makeKey(userId, workspaceId)) ?? {};
  }

  return (data?.state_json as PartialArenaState | null) ?? {};
};

export const saveWorkspaceState = async (
  userId: string,
  state: ArenaState,
  workspaceId?: string | null
) => {
  if (!userId) return;

  if (!isSupabaseConfigured) {
    inMemorySnapshots.set(makeKey(userId, workspaceId), state);
    return;
  }

  const payload = {
    user_id: userId,
    workspace_id: workspaceId ?? null,
    state_json: state,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabaseClient.from(SNAPSHOT_TABLE).upsert(payload, { onConflict: 'user_id,workspace_id' });

  if (error) {
    console.warn('[workspaceStorage] Failed to persist snapshot to Supabase; caching in memory', error);
    inMemorySnapshots.set(makeKey(userId, workspaceId), state);
  }
};

export const clearWorkspaceState = async (userId: string, workspaceId?: string | null) => {
  if (!userId) return;

  inMemorySnapshots.delete(makeKey(userId, workspaceId));

  if (!isSupabaseConfigured) return;

  const { error } = await supabaseClient
    .from(SNAPSHOT_TABLE)
    .delete()
    .match({ user_id: userId, workspace_id: workspaceId ?? null });

  if (error) {
    console.warn('[workspaceStorage] Failed to clear Supabase snapshot', error);
  }
};
