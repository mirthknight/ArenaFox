import type { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabaseClient } from '@/shared/lib/supabaseClient';
import {
  type ActivityLogEntry,
  type ChangeRequest,
  type Comment,
  type EventParticipation,
  type EventSession,
  type EventStatus,
  type EventType,
  type EventTypeCode,
  DEFAULT_EVENT_TYPES,
  type Player,
  type Workspace,
  type WorkspaceInvite,
  type WorkspaceMember,
  type WorkspaceRole,
} from '../types/workspace.types';

type HydratedWorkspaceState = {
  workspaces: Workspace[];
  workspaceMembers: WorkspaceMember[];
  workspaceInvites: WorkspaceInvite[];
  players: Player[];
  eventTypes: EventType[];
  eventSessions: EventSession[];
  eventParticipations: EventParticipation[];
  changeRequests: ChangeRequest[];
  activityLog: ActivityLogEntry[];
  comments: Comment[];
};

const now = () => new Date().toISOString();

const generateId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;

const clone = <T>(value: T): T => {
  const structuredCloneFn =
    (globalThis as { structuredClone?: (value: unknown) => unknown }).structuredClone;
  return typeof structuredCloneFn === 'function'
    ? (structuredCloneFn(value) as T)
    : (JSON.parse(JSON.stringify(value)) as T);
};

const mockWorkspaceId = 'workspace-mock-1';
const mockUserId = 'mock-user-1';

const createMockHydratedState = (): HydratedWorkspaceState => ({
  workspaces: [
    {
      id: mockWorkspaceId,
      name: 'Server 1161 – MEM',
      slug: 'server-1161-mem',
      serverId: 1161,
      allianceName: 'MEM',
      allianceTag: 'MEM',
      description: 'Demo workspace for offline mode',
      defaultTimezone: 'UTC',
      isArchived: false,
      createdByUserId: mockUserId,
      createdAt: now(),
      updatedAt: now(),
    },
  ],
  workspaceMembers: [
    {
      id: generateId(),
      workspaceId: mockWorkspaceId,
      userId: mockUserId,
      role: 'OWNER',
      joinedAt: now(),
    },
  ],
  workspaceInvites: [
    {
      id: generateId(),
      workspaceId: mockWorkspaceId,
      invitedEmail: 'alliance.new.member@example.com',
      invitedByUserId: mockUserId,
      roleOffered: 'EDITOR',
      token: 'mock-token-1',
      status: 'PENDING',
      expiresAt: now(),
      createdAt: now(),
    },
  ],
  players: [
    {
      id: generateId(),
      workspaceId: mockWorkspaceId,
      inGameName: 'ShieldWall',
      allianceRole: 'R4',
      cityLevel: 35,
      power: 120_000_000,
      isActive: true,
      joinedDate: now(),
      notes: 'Offline demo captain',
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: generateId(),
      workspaceId: mockWorkspaceId,
      inGameName: 'FrostArcher',
      allianceRole: 'R3',
      cityLevel: 33,
      power: 95_000_000,
      isActive: true,
      joinedDate: now(),
      notes: 'Reliable rally joiner',
      createdAt: now(),
      updatedAt: now(),
    },
  ],
  eventTypes: [...DEFAULT_EVENT_TYPES],
  eventSessions: [
    {
      id: generateId(),
      workspaceId: mockWorkspaceId,
      eventTypeCode: 'BEAR_TRAP',
      name: 'Bear Trap Warmup',
      startDateTime: now(),
      endDateTime: now(),
      status: 'COMPLETED',
      metadata: { trapLevel: 5, totalDamage: 1_250_000_000, rewardTier: 'Gold' },
      createdByUserId: mockUserId,
      createdAt: now(),
      updatedAt: now(),
    },
  ],
  eventParticipations: [],
  changeRequests: [],
  activityLog: [
    {
      id: generateId(),
      workspaceId: mockWorkspaceId,
      actorUserId: mockUserId,
      actionType: 'CREATE_WORKSPACE',
      targetType: 'WORKSPACE',
      targetId: mockWorkspaceId,
      diff: { mode: 'offline' },
      createdAt: now(),
    },
  ],
  comments: [
    {
      id: generateId(),
      workspaceId: mockWorkspaceId,
      targetType: 'WORKSPACE',
      targetId: mockWorkspaceId,
      authorUserId: mockUserId,
      body: 'Offline data is active because Supabase is not configured.',
      createdAt: now(),
      updatedAt: now(),
      isEdited: false,
    },
  ],
});

let mockState: HydratedWorkspaceState | null = null;

const ensureMockState = () => {
  if (!mockState) {
    mockState = createMockHydratedState();
  }
  return mockState;
};

const upsertMockMembershipForUser = (userId: string) => {
  const state = ensureMockState();
  const existing = state.workspaceMembers.find((member) => member.userId === userId);
  if (!existing) {
    state.workspaceMembers.push({
      id: generateId(),
      workspaceId: state.workspaces[0]?.id ?? mockWorkspaceId,
      userId,
      role: 'VIEWER',
      joinedAt: now(),
    });
  }
};

const usingMockRepository = !isSupabaseConfigured;

interface WorkspaceRow {
  id: string;
  name: string;
  slug: string;
  server_id: number;
  alliance_name: string;
  alliance_tag: string | null;
  description: string | null;
  default_timezone: string;
  is_archived: boolean;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
}

interface WorkspaceMemberRow {
  id: string;
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;
  joined_at: string;
}

interface WorkspaceInviteRow {
  id: string;
  workspace_id: string;
  invited_email: string;
  invited_by_user_id: string;
  role_offered: WorkspaceRole;
  token: string;
  status: WorkspaceInvite['status'];
  expires_at: string;
  created_at: string;
}

interface PlayerRow {
  id: string;
  workspace_id: string;
  in_game_name: string;
  alliance_role: string;
  city_level: number | null;
  power: number | null;
  is_active: boolean;
  joined_date: string | null;
  external_player_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface EventTypeRow {
  id: string;
  workspace_id: string | null;
  code: EventTypeCode;
  name: string;
  category: EventType['category'];
  description: string | null;
  is_enabled_by_default: boolean;
  default_fields: string[];
}

interface EventSessionRow {
  id: string;
  workspace_id: string;
  event_type_code: EventTypeCode;
  name: string | null;
  start_date_time: string;
  end_date_time: string | null;
  status: EventStatus;
  metadata: Record<string, unknown>;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
}

interface EventParticipationRow {
  id: string;
  event_session_id: string;
  player_id: string;
  role: string;
  stats: Record<string, number>;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface ChangeRequestRow {
  id: string;
  workspace_id: string;
  target_type: ChangeRequest['targetType'];
  target_id: string;
  requested_by_user_id: string;
  status: ChangeRequest['status'];
  proposed_changes: Record<string, unknown>;
  reviewer_user_id: string | null;
  reviewed_at: string | null;
  review_comment: string | null;
  created_at: string;
}

interface ActivityLogRow {
  id: string;
  workspace_id: string;
  actor_user_id: string;
  action_type: ActivityLogEntry['actionType'];
  target_type: ActivityLogEntry['targetType'];
  target_id: string;
  diff: Record<string, unknown> | null;
  created_at: string;
}

interface CommentRow {
  id: string;
  workspace_id: string;
  target_type: Comment['targetType'];
  target_id: string;
  author_user_id: string;
  body: string;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
}

const toWorkspace = (row: WorkspaceRow): Workspace => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  serverId: row.server_id,
  allianceName: row.alliance_name,
  allianceTag: row.alliance_tag ?? undefined,
  description: row.description ?? undefined,
  defaultTimezone: row.default_timezone,
  isArchived: row.is_archived,
  createdByUserId: row.created_by_user_id,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const fromWorkspace = (workspace: Workspace): WorkspaceRow => ({
  id: workspace.id,
  name: workspace.name,
  slug: workspace.slug,
  server_id: workspace.serverId,
  alliance_name: workspace.allianceName,
  alliance_tag: workspace.allianceTag ?? null,
  description: workspace.description ?? null,
  default_timezone: workspace.defaultTimezone,
  is_archived: workspace.isArchived,
  created_by_user_id: workspace.createdByUserId,
  created_at: workspace.createdAt,
  updated_at: workspace.updatedAt,
});

const toWorkspaceMember = (row: WorkspaceMemberRow): WorkspaceMember => ({
  id: row.id,
  workspaceId: row.workspace_id,
  userId: row.user_id,
  role: row.role,
  joinedAt: row.joined_at,
});

const toWorkspaceInvite = (row: WorkspaceInviteRow): WorkspaceInvite => ({
  id: row.id,
  workspaceId: row.workspace_id,
  invitedEmail: row.invited_email,
  invitedByUserId: row.invited_by_user_id,
  roleOffered: row.role_offered,
  token: row.token,
  status: row.status,
  expiresAt: row.expires_at,
  createdAt: row.created_at,
});

const toPlayer = (row: PlayerRow): Player => ({
  id: row.id,
  workspaceId: row.workspace_id,
  inGameName: row.in_game_name,
  allianceRole: row.alliance_role,
  cityLevel: row.city_level ?? undefined,
  power: row.power ?? undefined,
  isActive: row.is_active,
  joinedDate: row.joined_date ?? undefined,
  externalPlayerId: row.external_player_id ?? undefined,
  notes: row.notes ?? undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const toEventType = (row: EventTypeRow): EventType => ({
  id: row.id,
  workspaceId: row.workspace_id ?? undefined,
  code: row.code,
  name: row.name,
  category: row.category,
  description: row.description ?? undefined,
  isEnabledByDefault: row.is_enabled_by_default,
  defaultFields: row.default_fields,
});

const toEventSession = (row: EventSessionRow): EventSession => ({
  id: row.id,
  workspaceId: row.workspace_id,
  eventTypeCode: row.event_type_code,
  name: row.name ?? undefined,
  startDateTime: row.start_date_time,
  endDateTime: row.end_date_time ?? undefined,
  status: row.status,
  metadata: row.metadata,
  createdByUserId: row.created_by_user_id,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const toEventParticipation = (row: EventParticipationRow): EventParticipation => ({
  id: row.id,
  eventSessionId: row.event_session_id,
  playerId: row.player_id,
  role: row.role,
  stats: row.stats,
  notes: row.notes ?? undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const toChangeRequest = (row: ChangeRequestRow): ChangeRequest => ({
  id: row.id,
  workspaceId: row.workspace_id,
  targetType: row.target_type,
  targetId: row.target_id,
  requestedByUserId: row.requested_by_user_id,
  status: row.status,
  proposedChanges: row.proposed_changes,
  reviewerUserId: row.reviewer_user_id ?? undefined,
  reviewedAt: row.reviewed_at ?? undefined,
  reviewComment: row.review_comment ?? undefined,
  createdAt: row.created_at,
});

const toActivityLog = (row: ActivityLogRow): ActivityLogEntry => ({
  id: row.id,
  workspaceId: row.workspace_id,
  actorUserId: row.actor_user_id,
  actionType: row.action_type,
  targetType: row.target_type,
  targetId: row.target_id,
  diff: row.diff ?? undefined,
  createdAt: row.created_at,
});

const toComment = (row: CommentRow): Comment => ({
  id: row.id,
  workspaceId: row.workspace_id,
  targetType: row.target_type,
  targetId: row.target_id,
  authorUserId: row.author_user_id,
  body: row.body,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  isEdited: row.is_edited,
});

const handleSingle = async <TRow, TValue>(
  promise: PromiseLike<PostgrestSingleResponse<TRow>>,
  mapper: (row: TRow) => TValue
) => {
  const { data, error } = await promise;
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error('Record not found');
  }
  return mapper(data);
};

const handleList = async <TRow, TValue>(
  promise: PromiseLike<PostgrestResponse<TRow>>,
  mapper: (row: TRow) => TValue
) => {
  const { data, error } = await promise;
  if (error) {
    throw error;
  }
  return (data ?? []).map(mapper);
};

const upsertDefaultEventTypes = async (): Promise<EventType[]> => {
  if (usingMockRepository) {
    const state = ensureMockState();
    state.eventTypes = [...DEFAULT_EVENT_TYPES];
    return clone(state.eventTypes);
  }

  const { data, error } = await supabaseClient
    .from('event_types')
    .upsert(
      DEFAULT_EVENT_TYPES.map((evt) => ({
        id: evt.id,
        workspace_id: null,
        code: evt.code,
        name: evt.name,
        category: evt.category,
        description: evt.description ?? null,
        is_enabled_by_default: evt.isEnabledByDefault,
        default_fields: evt.defaultFields,
      })),
      { onConflict: 'code' }
    )
    .select('*');

  if (error) {
    throw error;
  }

  return (data ?? []).map(toEventType);
};

const fetchScopedWorkspaces = async (
  userId: string
  ): Promise<{ workspaces: Workspace[]; members: WorkspaceMember[]; workspaceIds: string[] }> => {
    if (usingMockRepository) {
      upsertMockMembershipForUser(userId);
      const state = ensureMockState();
      return {
        workspaces: clone(state.workspaces),
        members: clone(state.workspaceMembers),
        workspaceIds: clone(state.workspaces.map((workspace) => workspace.id)),
      };
    }

    const memberRows = await handleList(
      supabaseClient.from('workspace_members').select('*').eq('user_id', userId),
      toWorkspaceMember
    );

  const workspaceIds = memberRows.map((member) => member.workspaceId);
    const ownedWorkspaces = await handleList(
      supabaseClient.from('workspaces').select('*').eq('created_by_user_id', userId),
      toWorkspace
    );

  const memberWorkspaces = workspaceIds.length
      ? await handleList(
          supabaseClient.from('workspaces').select('*').in('id', workspaceIds),
          toWorkspace
        )
    : [];

  const workspaces = [...ownedWorkspaces];
  memberWorkspaces.forEach((workspace) => {
    if (!workspaces.find((existing) => existing.id === workspace.id)) {
      workspaces.push(workspace);
    }
  });

  const combinedIds = Array.from(new Set([...workspaces.map((w) => w.id), ...workspaceIds]));

  return { workspaces, members: memberRows, workspaceIds: combinedIds };
};

type WorkspaceCollections = Omit<HydratedWorkspaceState, 'workspaces' | 'workspaceMembers'>;

const fetchCollectionsForWorkspaces = async (workspaceIds: string[]): Promise<WorkspaceCollections> => {
  if (usingMockRepository) {
    const state = ensureMockState();
    const targetIds = workspaceIds.length ? workspaceIds : state.workspaces.map((workspace) => workspace.id);
    const filterByWorkspace = <T extends { workspaceId: string }>(collection: T[]) =>
      collection.filter((item) => targetIds.includes(item.workspaceId));

    const eventSessions = filterByWorkspace(state.eventSessions);
    const sessionIds = eventSessions.map((session) => session.id);
    const eventParticipations = state.eventParticipations.filter((participation) =>
      sessionIds.includes(participation.eventSessionId)
    );

    return {
      workspaceInvites: filterByWorkspace(state.workspaceInvites),
      players: filterByWorkspace(state.players),
      eventTypes: [...state.eventTypes],
      eventSessions,
      eventParticipations,
      changeRequests: filterByWorkspace(state.changeRequests),
      activityLog: filterByWorkspace(state.activityLog),
      comments: filterByWorkspace(state.comments),
    };
  }

  if (!workspaceIds.length) {
    return {
      workspaceInvites: [],
      players: [],
      eventTypes: [],
      eventSessions: [],
      eventParticipations: [],
      changeRequests: [],
      activityLog: [],
      comments: [],
    };
  }

  const invites = await handleList(
    supabaseClient.from('workspace_invites').select('*').in('workspace_id', workspaceIds),
    toWorkspaceInvite
  );

  const players = await handleList(
    supabaseClient.from('players').select('*').in('workspace_id', workspaceIds),
    toPlayer
  );

  const eventTypes = await handleList(
    supabaseClient
      .from('event_types')
      .select('*')
      .or(`workspace_id.is.null,workspace_id.in.(${workspaceIds.join(',')})`),
    toEventType
  );

  const eventSessions = await handleList(
    supabaseClient.from('event_sessions').select('*').in('workspace_id', workspaceIds),
    toEventSession
  );

  const sessionIds = eventSessions.map((session) => session.id);
  const eventParticipations = sessionIds.length
    ? await handleList(
        supabaseClient
          .from('event_participations')
          .select('*')
          .in('event_session_id', sessionIds),
        toEventParticipation
      )
    : [];

  const changeRequests = await handleList(
    supabaseClient.from('change_requests').select('*').in('workspace_id', workspaceIds),
    toChangeRequest
  );

  const activityLog = await handleList(
    supabaseClient.from('activity_logs').select('*').in('workspace_id', workspaceIds),
    toActivityLog
  );

  const comments = await handleList(
    supabaseClient.from('comments').select('*').in('workspace_id', workspaceIds),
    toComment
  );

  return {
    workspaceInvites: invites,
    players,
    eventTypes,
    eventSessions,
    eventParticipations,
    changeRequests,
    activityLog,
    comments,
  };
};

export const workspaceRepository = {
  async hydrateForUser(userId: string): Promise<HydratedWorkspaceState> {
    if (usingMockRepository) {
      upsertMockMembershipForUser(userId);
      return clone(ensureMockState());
    }

    await upsertDefaultEventTypes();
    const { workspaces, members, workspaceIds } = await fetchScopedWorkspaces(userId);
    const collectionState = await fetchCollectionsForWorkspaces(workspaceIds);

    return {
      workspaces,
      workspaceMembers: members,
      ...collectionState,
    };
  },

  async insertWorkspace(workspace: Workspace): Promise<Workspace> {
    if (usingMockRepository) {
      const state = ensureMockState();
      state.workspaces.push(workspace);
      return clone(workspace);
    }

    const row = fromWorkspace(workspace);
    return handleSingle(
      supabaseClient.from('workspaces').insert(row).select('*').single(),
      toWorkspace
    );
  },

  async updateWorkspace(workspace: Workspace): Promise<Workspace> {
    if (usingMockRepository) {
      const state = ensureMockState();
      const updated = clone(workspace);
      state.workspaces = state.workspaces.map((existing) =>
        existing.id === workspace.id ? updated : existing
      );
      return updated;
    }

    const row = fromWorkspace(workspace);
    return handleSingle(
      supabaseClient.from('workspaces').update(row).eq('id', workspace.id).select('*').single(),
      toWorkspace
    );
  },

  async insertWorkspaceMember(member: WorkspaceMember): Promise<WorkspaceMember> {
    if (usingMockRepository) {
      const state = ensureMockState();
      state.workspaceMembers.push(member);
      return clone(member);
    }

    return handleSingle(
      supabaseClient
        .from('workspace_members')
        .upsert({
          id: member.id,
          workspace_id: member.workspaceId,
          user_id: member.userId,
          role: member.role,
          joined_at: member.joinedAt,
        })
        .select('*')
        .single(),
      toWorkspaceMember
    );
  },

  async removeWorkspaceMember(memberId: string) {
    if (usingMockRepository) {
      const state = ensureMockState();
      state.workspaceMembers = state.workspaceMembers.filter((member) => member.id !== memberId);
      return;
    }

    const { error } = await supabaseClient.from('workspace_members').delete().eq('id', memberId);
    if (error) throw error;
  },

  async insertWorkspaceInvite(invite: WorkspaceInvite): Promise<WorkspaceInvite> {
    if (usingMockRepository) {
      const state = ensureMockState();
      state.workspaceInvites.push(invite);
      return clone(invite);
    }

    return handleSingle(
      supabaseClient
        .from('workspace_invites')
        .insert({
          id: invite.id,
          workspace_id: invite.workspaceId,
          invited_email: invite.invitedEmail,
          invited_by_user_id: invite.invitedByUserId,
          role_offered: invite.roleOffered,
          token: invite.token,
          status: invite.status,
          expires_at: invite.expiresAt,
          created_at: invite.createdAt,
        })
        .select('*')
        .single(),
      toWorkspaceInvite
    );
  },

  async updateWorkspaceInvite(inviteId: string, patch: Partial<WorkspaceInvite>): Promise<WorkspaceInvite> {
    if (usingMockRepository) {
      const state = ensureMockState();
      state.workspaceInvites = state.workspaceInvites.map((invite) =>
        invite.id === inviteId ? { ...invite, ...patch } : invite
      );
      return clone(state.workspaceInvites.find((invite) => invite.id === inviteId)!);
    }

    return handleSingle(
      supabaseClient
        .from('workspace_invites')
        .update({
          status: patch.status,
          expires_at: patch.expiresAt,
        })
        .eq('id', inviteId)
        .select('*')
        .single(),
      toWorkspaceInvite
    );
  },

  async insertPlayer(player: Player): Promise<Player> {
    if (usingMockRepository) {
      const state = ensureMockState();
      state.players.push(player);
      return clone(player);
    }

    return handleSingle(
      supabaseClient
        .from('players')
        .insert({
          id: player.id,
          workspace_id: player.workspaceId,
          in_game_name: player.inGameName,
          alliance_role: player.allianceRole,
          city_level: player.cityLevel ?? null,
          power: player.power ?? null,
          is_active: player.isActive,
          joined_date: player.joinedDate ?? null,
          external_player_id: player.externalPlayerId ?? null,
          notes: player.notes ?? null,
          created_at: player.createdAt,
          updated_at: player.updatedAt,
        })
        .select('*')
        .single(),
      toPlayer
    );
  },

  async updatePlayer(player: Player): Promise<Player> {
    if (usingMockRepository) {
      const state = ensureMockState();
      state.players = state.players.map((existing) => (existing.id === player.id ? player : existing));
      return clone(player);
    }

    return handleSingle(
      supabaseClient
        .from('players')
        .update({
          in_game_name: player.inGameName,
          alliance_role: player.allianceRole,
          city_level: player.cityLevel ?? null,
          power: player.power ?? null,
          is_active: player.isActive,
          joined_date: player.joinedDate ?? null,
          external_player_id: player.externalPlayerId ?? null,
          notes: player.notes ?? null,
          updated_at: player.updatedAt,
        })
        .eq('id', player.id)
        .select('*')
        .single(),
      toPlayer
    );
  },

  async insertEventType(eventType: EventType): Promise<EventType> {
    if (usingMockRepository) {
      const state = ensureMockState();
      state.eventTypes.push(eventType);
      return clone(eventType);
    }

    return handleSingle(
      supabaseClient
        .from('event_types')
        .upsert({
          id: eventType.id,
          workspace_id: eventType.workspaceId ?? null,
          code: eventType.code,
          name: eventType.name,
          category: eventType.category,
          description: eventType.description ?? null,
          is_enabled_by_default: eventType.isEnabledByDefault,
          default_fields: eventType.defaultFields,
        })
        .select('*')
        .single(),
      toEventType
    );
  },

  async insertEventSession(session: EventSession): Promise<EventSession> {
    if (usingMockRepository) {
      const state = ensureMockState();
      state.eventSessions.push(session);
      return clone(session);
    }

    return handleSingle(
      supabaseClient
        .from('event_sessions')
        .insert({
          id: session.id,
          workspace_id: session.workspaceId,
          event_type_code: session.eventTypeCode,
          name: session.name ?? null,
          start_date_time: session.startDateTime,
          end_date_time: session.endDateTime ?? null,
          status: session.status,
          metadata: session.metadata,
          created_by_user_id: session.createdByUserId,
          created_at: session.createdAt,
          updated_at: session.updatedAt,
        })
        .select('*')
        .single(),
      toEventSession
    );
  },

  async updateEventSession(session: EventSession): Promise<EventSession> {
    if (usingMockRepository) {
      const state = ensureMockState();
      state.eventSessions = state.eventSessions.map((existing) =>
        existing.id === session.id ? session : existing
      );
      return clone(session);
    }

    return handleSingle(
      supabaseClient
        .from('event_sessions')
        .update({
          name: session.name ?? null,
          start_date_time: session.startDateTime,
          end_date_time: session.endDateTime ?? null,
          status: session.status,
          metadata: session.metadata,
          updated_at: session.updatedAt,
        })
        .eq('id', session.id)
        .select('*')
        .single(),
      toEventSession
    );
  },

  async deleteEventSession(sessionId: string) {
    if (usingMockRepository) {
      const state = ensureMockState();
      state.eventSessions = state.eventSessions.filter((session) => session.id !== sessionId);
      state.eventParticipations = state.eventParticipations.filter(
        (participation) => participation.eventSessionId !== sessionId
      );
      return;
    }

    const { error } = await supabaseClient.from('event_sessions').delete().eq('id', sessionId);
    if (error) throw error;
  },

  async insertEventParticipation(participation: EventParticipation): Promise<EventParticipation> {
    if (usingMockRepository) {
      const state = ensureMockState();
      state.eventParticipations.push(participation);
      return clone(participation);
    }

    return handleSingle(
      supabaseClient
        .from('event_participations')
        .insert({
          id: participation.id,
          event_session_id: participation.eventSessionId,
          player_id: participation.playerId,
          role: participation.role,
          stats: participation.stats,
          notes: participation.notes ?? null,
          created_at: participation.createdAt,
          updated_at: participation.updatedAt,
        })
        .select('*')
        .single(),
      toEventParticipation
    );
  },

  async updateEventParticipation(participation: EventParticipation): Promise<EventParticipation> {
    if (usingMockRepository) {
      const state = ensureMockState();
      state.eventParticipations = state.eventParticipations.map((existing) =>
        existing.id === participation.id ? participation : existing
      );
      return clone(participation);
    }

    return handleSingle(
      supabaseClient
        .from('event_participations')
        .update({
          role: participation.role,
          stats: participation.stats,
          notes: participation.notes ?? null,
          updated_at: participation.updatedAt,
        })
        .eq('id', participation.id)
        .select('*')
        .single(),
      toEventParticipation
    );
  },

  async insertChangeRequest(changeRequest: ChangeRequest): Promise<ChangeRequest> {
    if (usingMockRepository) {
      const state = ensureMockState();
      state.changeRequests.push(changeRequest);
      return clone(changeRequest);
    }

    return handleSingle(
      supabaseClient
        .from('change_requests')
        .insert({
          id: changeRequest.id,
          workspace_id: changeRequest.workspaceId,
          target_type: changeRequest.targetType,
          target_id: changeRequest.targetId,
          requested_by_user_id: changeRequest.requestedByUserId,
          status: changeRequest.status,
          proposed_changes: changeRequest.proposedChanges,
          reviewer_user_id: changeRequest.reviewerUserId ?? null,
          reviewed_at: changeRequest.reviewedAt ?? null,
          review_comment: changeRequest.reviewComment ?? null,
          created_at: changeRequest.createdAt,
        })
        .select('*')
        .single(),
      toChangeRequest
    );
  },

  async updateChangeRequest(changeRequest: ChangeRequest): Promise<ChangeRequest> {
    if (usingMockRepository) {
      const state = ensureMockState();
      state.changeRequests = state.changeRequests.map((existing) =>
        existing.id === changeRequest.id ? changeRequest : existing
      );
      return clone(changeRequest);
    }

    return handleSingle(
      supabaseClient
        .from('change_requests')
        .update({
          status: changeRequest.status,
          proposed_changes: changeRequest.proposedChanges,
          reviewer_user_id: changeRequest.reviewerUserId ?? null,
          reviewed_at: changeRequest.reviewedAt ?? null,
          review_comment: changeRequest.reviewComment ?? null,
        })
        .eq('id', changeRequest.id)
        .select('*')
        .single(),
      toChangeRequest
    );
  },

  async insertActivityLog(entry: ActivityLogEntry): Promise<ActivityLogEntry> {
    if (usingMockRepository) {
      const state = ensureMockState();
      state.activityLog.push(entry);
      return clone(entry);
    }

    return handleSingle(
      supabaseClient
        .from('activity_logs')
        .insert({
          id: entry.id,
          workspace_id: entry.workspaceId,
          actor_user_id: entry.actorUserId,
          action_type: entry.actionType,
          target_type: entry.targetType,
          target_id: entry.targetId,
          diff: entry.diff ?? null,
          created_at: entry.createdAt,
        })
        .select('*')
        .single(),
      toActivityLog
    );
  },

  async insertComment(comment: Comment): Promise<Comment> {
    if (usingMockRepository) {
      const state = ensureMockState();
      state.comments.push(comment);
      return clone(comment);
    }

    return handleSingle(
      supabaseClient
        .from('comments')
        .insert({
          id: comment.id,
          workspace_id: comment.workspaceId,
          target_type: comment.targetType,
          target_id: comment.targetId,
          author_user_id: comment.authorUserId,
          body: comment.body,
          created_at: comment.createdAt,
          updated_at: comment.updatedAt,
          is_edited: comment.isEdited,
        })
        .select('*')
        .single(),
      toComment
    );
  },

  async updateComment(comment: Comment): Promise<Comment> {
    if (usingMockRepository) {
      const state = ensureMockState();
      state.comments = state.comments.map((existing) => (existing.id === comment.id ? comment : existing));
      return clone(comment);
    }

    return handleSingle(
      supabaseClient
        .from('comments')
        .update({
          body: comment.body,
          updated_at: comment.updatedAt,
          is_edited: comment.isEdited,
        })
        .eq('id', comment.id)
        .select('*')
        .single(),
      toComment
    );
  },
};
