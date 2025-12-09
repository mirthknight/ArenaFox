import {
  type ActivityLogEntry,
  type ActivityTargetType,
  type Comment,
  type CommentTargetType,
  type ChangeRequest,
  type ChangeRequestStatus,
  type EventParticipation,
  type EventSession,
  type EventStatus,
  type EventType,
  type EventTypeCode,
  type ParticipationRole,
  type Player,
  type User,
  type Workspace,
  type WorkspaceInvite,
  type WorkspaceMember,
  type WorkspaceRole,
  DEFAULT_EVENT_TYPES,
} from '../types/workspace.types';
import { workspaceRepository } from './workspaceRepository';

export interface ArenaState {
  currentUser: User | null;
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
}

export type PartialArenaState = Partial<ArenaState>;

export interface PlayerFilters {
  name?: string;
  role?: string;
  isActive?: boolean;
}

export interface EventSessionFilters {
  status?: EventStatus;
  startingAfter?: string;
  startingBefore?: string;
}

export interface UpdateOptions {
  requireReview?: boolean;
  actorRole?: WorkspaceRole;
  actorUserId?: string;
  skipActivityLog?: boolean;
}

type Listener = (state: ArenaState) => void;

const createTimestamp = () => new Date().toISOString();

const generateId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;

const resolveActor = (actorUserId?: string) => actorUserId ?? 'system';

const mergeEventTypes = (base: EventType[], incoming: EventType[]) => {
  const map = new Map<string, EventType>();
  [...base, ...incoming].forEach((evt) => {
    const key = `${evt.workspaceId ?? 'global'}::${evt.code}`;
    map.set(key, evt);
  });
  return Array.from(map.values());
};

const buildInitialState = (initialState: PartialArenaState = {}): ArenaState => ({
  currentUser: initialState.currentUser ?? null,
  workspaces: initialState.workspaces ?? [],
  workspaceMembers: initialState.workspaceMembers ?? [],
  workspaceInvites: initialState.workspaceInvites ?? [],
  players: initialState.players ?? [],
  eventTypes: initialState.eventTypes ?? [...DEFAULT_EVENT_TYPES],
  eventSessions: initialState.eventSessions ?? [],
  eventParticipations: initialState.eventParticipations ?? [],
  changeRequests: initialState.changeRequests ?? [],
  activityLog: initialState.activityLog ?? [],
  comments: initialState.comments ?? [],
});

export const createWorkspaceStore = (initialState: PartialArenaState = {}) => {
  let state: ArenaState = buildInitialState(initialState);
  const listeners = new Set<Listener>();

  const notify = () => listeners.forEach((listener) => listener(state));

  const getState = () => state;

  const setState = (updater: (state: ArenaState) => ArenaState) => {
    state = updater(state);
    notify();
  };

  const subscribe = (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const persistActivity = async (
    entry: Omit<ActivityLogEntry, 'id' | 'createdAt'>
  ): Promise<ActivityLogEntry> => {
    const activity: ActivityLogEntry = {
      ...entry,
      id: generateId(),
      createdAt: createTimestamp(),
    };
    const savedActivity = await workspaceRepository.insertActivityLog(activity);
    setState((prev) => ({ ...prev, activityLog: [...prev.activityLog, savedActivity] }));
    return savedActivity;
  };

  const hydrateForUser = async (userId: string, currentUser?: User | null) => {
    const hydrated = await workspaceRepository.hydrateForUser(userId);
    setState((prev) =>
      buildInitialState({
        ...prev,
        ...hydrated,
        currentUser: currentUser ?? prev.currentUser,
        eventTypes: mergeEventTypes(DEFAULT_EVENT_TYPES, hydrated.eventTypes ?? []),
      })
    );
    return state;
  };

  const createWorkspace = async (
    input: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt' | 'isArchived'> & Partial<Pick<Workspace, 'isArchived'>>
  ): Promise<Workspace> => {
    const now = createTimestamp();
    const workspace: Workspace = {
      ...input,
      id: generateId(),
      isArchived: input.isArchived ?? false,
      createdAt: now,
      updatedAt: now,
    };

    const savedWorkspace = await workspaceRepository.insertWorkspace(workspace);
    const ownerMember: WorkspaceMember = {
      id: generateId(),
      workspaceId: savedWorkspace.id,
      userId: input.createdByUserId,
      role: 'OWNER',
      joinedAt: now,
    };

    const savedMember = await workspaceRepository.insertWorkspaceMember(ownerMember);

    setState((prev) => ({
      ...prev,
      workspaces: [...prev.workspaces, savedWorkspace],
      workspaceMembers: [...prev.workspaceMembers, savedMember],
    }));

    await persistActivity({
      actionType: 'CREATE_WORKSPACE',
      actorUserId: input.createdByUserId,
      workspaceId: savedWorkspace.id,
      targetType: 'WORKSPACE',
      targetId: savedWorkspace.id,
      diff: { workspace: savedWorkspace },
    });

    return savedWorkspace;
  };

  const updateWorkspace = async (
    id: string,
    patch: Partial<Workspace>,
    actorUserId?: string
  ): Promise<Workspace> => {
    const existing = state.workspaces.find((workspace) => workspace.id === id);
    if (!existing) throw new Error(`Workspace ${id} not found`);

    const updatedWorkspace: Workspace = { ...existing, ...patch, updatedAt: createTimestamp() };
    const savedWorkspace = await workspaceRepository.updateWorkspace(updatedWorkspace);

    setState((prev) => ({
      ...prev,
      workspaces: prev.workspaces.map((workspace) => (workspace.id === id ? savedWorkspace : workspace)),
    }));

    await persistActivity({
      actionType: 'UPDATE_WORKSPACE',
      actorUserId: resolveActor(actorUserId ?? savedWorkspace.createdByUserId),
      workspaceId: savedWorkspace.id,
      targetType: 'WORKSPACE',
      targetId: savedWorkspace.id,
      diff: patch,
    });

    return savedWorkspace;
  };

  const archiveWorkspace = async (id: string, actorUserId?: string) => {
    const workspace = await updateWorkspace(id, { isArchived: true }, actorUserId);
    await persistActivity({
      actionType: 'ARCHIVE_WORKSPACE',
      actorUserId: resolveActor(actorUserId ?? workspace.createdByUserId),
      workspaceId: workspace.id,
      targetType: 'WORKSPACE',
      targetId: workspace.id,
      diff: { isArchived: true },
    });
  };

  const listWorkspacesForUser = (userId: string): Workspace[] => {
    const memberWorkspaceIds = state.workspaceMembers
      .filter((member) => member.userId === userId)
      .map((member) => member.workspaceId);

    return state.workspaces.filter(
      (workspace) => workspace.createdByUserId === userId || memberWorkspaceIds.includes(workspace.id)
    );
  };

  const getWorkspaceById = (id: string) => state.workspaces.find((workspace) => workspace.id === id);

  const addWorkspaceMember = async (
    workspaceId: string,
    userId: string,
    role: WorkspaceRole
  ): Promise<WorkspaceMember> => {
    const member: WorkspaceMember = {
      id: generateId(),
      workspaceId,
      userId,
      role,
      joinedAt: createTimestamp(),
    };

    const savedMember = await workspaceRepository.insertWorkspaceMember(member);
    setState((prev) => ({ ...prev, workspaceMembers: [...prev.workspaceMembers, savedMember] }));

    await persistActivity({
      actionType: 'UPDATE_WORKSPACE',
      actorUserId: resolveActor(),
      workspaceId,
      targetType: 'WORKSPACE',
      targetId: workspaceId,
      diff: { memberAdded: savedMember },
    });

    return savedMember;
  };

  const updateWorkspaceMemberRole = async (
    memberId: string,
    role: WorkspaceRole,
    actorUserId?: string
  ): Promise<WorkspaceMember> => {
    const existing = state.workspaceMembers.find((member) => member.id === memberId);
    if (!existing) throw new Error(`Workspace member ${memberId} not found`);

    const updatedMember: WorkspaceMember = { ...existing, role };
    const savedMember = await workspaceRepository.insertWorkspaceMember(updatedMember);

    setState((prev) => ({
      ...prev,
      workspaceMembers: prev.workspaceMembers.map((member) => (member.id === memberId ? savedMember : member)),
    }));

    await persistActivity({
      actionType: 'UPDATE_WORKSPACE',
      actorUserId: resolveActor(actorUserId),
      workspaceId: savedMember.workspaceId,
      targetType: 'WORKSPACE',
      targetId: savedMember.workspaceId,
      diff: { memberId, role },
    });

    return savedMember;
  };

  const removeWorkspaceMember = async (memberId: string, actorUserId?: string) => {
    const existing = state.workspaceMembers.find((member) => member.id === memberId);
    if (!existing) return;

    await workspaceRepository.removeWorkspaceMember(memberId);
    setState((prev) => ({
      ...prev,
      workspaceMembers: prev.workspaceMembers.filter((member) => member.id !== memberId),
    }));

    await persistActivity({
      actionType: 'UPDATE_WORKSPACE',
      actorUserId: resolveActor(actorUserId),
      workspaceId: existing.workspaceId,
      targetType: 'WORKSPACE',
      targetId: existing.workspaceId,
      diff: { removedMemberId: existing.id },
    });
  };

  const createWorkspaceInvite = async (
    workspaceId: string,
    invitedEmail: string,
    roleOffered: WorkspaceRole,
    invitedByUserId: string,
    expiresAt?: string
  ): Promise<WorkspaceInvite> => {
    const invite: WorkspaceInvite = {
      id: generateId(),
      workspaceId,
      invitedEmail,
      invitedByUserId,
      roleOffered,
      token: generateId(),
      status: 'PENDING',
      expiresAt: expiresAt ?? new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
      createdAt: createTimestamp(),
    };

    const savedInvite = await workspaceRepository.insertWorkspaceInvite(invite);
    setState((prev) => ({ ...prev, workspaceInvites: [...prev.workspaceInvites, savedInvite] }));

    await persistActivity({
      actionType: 'INVITE_MEMBER',
      actorUserId: resolveActor(invitedByUserId),
      workspaceId,
      targetType: 'WORKSPACE',
      targetId: workspaceId,
      diff: { invitedEmail, roleOffered },
    });

    return savedInvite;
  };

  const acceptWorkspaceInvite = async (token: string, userId: string): Promise<WorkspaceMember> => {
    const invite = state.workspaceInvites.find((entry) => entry.token === token);
    if (!invite) throw new Error('Invite not found');

    const now = new Date();
    if (new Date(invite.expiresAt) < now && invite.status === 'PENDING') {
      const expired = await workspaceRepository.updateWorkspaceInvite(invite.id, { status: 'EXPIRED' });
      setState((prev) => ({
        ...prev,
        workspaceInvites: prev.workspaceInvites.map((entry) => (entry.id === expired.id ? expired : entry)),
      }));
      throw new Error('Invite expired');
    }

    if (invite.status !== 'PENDING') throw new Error('Invite is no longer valid');

    const acceptedInvite = await workspaceRepository.updateWorkspaceInvite(invite.id, { status: 'ACCEPTED' });
    setState((prev) => ({
      ...prev,
      workspaceInvites: prev.workspaceInvites.map((entry) => (entry.id === acceptedInvite.id ? acceptedInvite : entry)),
    }));

    const member = await addWorkspaceMember(acceptedInvite.workspaceId, userId, acceptedInvite.roleOffered);

    await persistActivity({
      actionType: 'ACCEPT_INVITE',
      actorUserId: userId,
      workspaceId: acceptedInvite.workspaceId,
      targetType: 'WORKSPACE',
      targetId: acceptedInvite.workspaceId,
      diff: { inviteId: acceptedInvite.id, memberId: member.id },
    });

    return member;
  };

  const createPlayer = async (
    workspaceId: string,
    input: Omit<Player, 'id' | 'workspaceId' | 'createdAt' | 'updatedAt'>
  ): Promise<Player> => {
    const now = createTimestamp();
    const player: Player = {
      ...input,
      id: generateId(),
      workspaceId,
      createdAt: now,
      updatedAt: now,
    };

    const savedPlayer = await workspaceRepository.insertPlayer(player);
    setState((prev) => ({ ...prev, players: [...prev.players, savedPlayer] }));

    await persistActivity({
      actionType: 'CREATE_PLAYER',
      actorUserId: resolveActor(),
      workspaceId,
      targetType: 'PLAYER',
      targetId: savedPlayer.id,
      diff: { player: savedPlayer },
    });

    return savedPlayer;
  };

  const createChangeRequest = async (
    input: Omit<ChangeRequest, 'id' | 'createdAt' | 'status'> & { status?: ChangeRequestStatus }
  ): Promise<ChangeRequest> => {
    const changeRequest: ChangeRequest = {
      ...input,
      id: generateId(),
      createdAt: createTimestamp(),
      status: input.status ?? 'PENDING',
    };

    const savedRequest = await workspaceRepository.insertChangeRequest(changeRequest);
    setState((prev) => ({ ...prev, changeRequests: [...prev.changeRequests, savedRequest] }));

    await persistActivity({
      actionType: 'CREATE_CHANGE_REQUEST',
      actorUserId: input.requestedByUserId,
      workspaceId: input.workspaceId,
      targetType: 'CHANGE_REQUEST',
      targetId: savedRequest.id,
      diff: input.proposedChanges,
    });

    return savedRequest;
  };

  const updatePlayer = async (
    playerId: string,
    patch: Partial<Player>,
    options?: UpdateOptions
  ): Promise<Player | ChangeRequest> => {
    const existing = state.players.find((player) => player.id === playerId);
    if (!existing) {
      throw new Error(`Player ${playerId} not found`);
    }

    if (options?.requireReview && options.actorRole === 'EDITOR') {
      return createChangeRequest({
        workspaceId: existing.workspaceId,
        targetType: 'PLAYER',
        targetId: playerId,
        requestedByUserId: resolveActor(options.actorUserId),
        proposedChanges: patch,
      });
    }

    const updatedPlayer: Player = { ...existing, ...patch, updatedAt: createTimestamp() };
    const savedPlayer = await workspaceRepository.updatePlayer(updatedPlayer);

    setState((prev) => ({
      ...prev,
      players: prev.players.map((player) => (player.id === playerId ? savedPlayer : player)),
    }));

    if (!options?.skipActivityLog) {
      await persistActivity({
        actionType: 'UPDATE_PLAYER',
        actorUserId: resolveActor(options?.actorUserId),
        workspaceId: savedPlayer.workspaceId,
        targetType: 'PLAYER',
        targetId: savedPlayer.id,
        diff: patch,
      });
    }

    return savedPlayer;
  };

  const listPlayers = (workspaceId: string, filters: PlayerFilters = {}): Player[] =>
    state.players.filter((player) => {
      if (player.workspaceId !== workspaceId) return false;
      if (typeof filters.isActive === 'boolean' && player.isActive !== filters.isActive) return false;
      if (filters.role && player.allianceRole !== filters.role) return false;
      if (filters.name && !player.inGameName.toLowerCase().includes(filters.name.toLowerCase())) return false;
      return true;
    });

  const getPlayer = (playerId: string) => state.players.find((player) => player.id === playerId);

  const createEventSession = async (
    workspaceId: string,
    eventTypeCode: EventTypeCode,
    baseData: Omit<EventSession, 'id' | 'workspaceId' | 'eventTypeCode' | 'createdAt' | 'updatedAt'>
  ): Promise<EventSession> => {
    const now = createTimestamp();
    const session: EventSession = {
      ...baseData,
      id: generateId(),
      workspaceId,
      eventTypeCode,
      createdAt: now,
      updatedAt: now,
    };

    const savedSession = await workspaceRepository.insertEventSession(session);
    setState((prev) => ({ ...prev, eventSessions: [...prev.eventSessions, savedSession] }));

    await persistActivity({
      actionType: 'CREATE_EVENT_SESSION',
      actorUserId: baseData.createdByUserId,
      workspaceId,
      targetType: 'EVENT_SESSION',
      targetId: savedSession.id,
      diff: { eventTypeCode, name: savedSession.name, status: savedSession.status },
    });

    return savedSession;
  };

  const updateEventSession = async (
    sessionId: string,
    patch: Partial<EventSession>,
    options?: UpdateOptions
  ): Promise<EventSession | ChangeRequest> => {
    const existing = state.eventSessions.find((session) => session.id === sessionId);
    if (!existing) {
      throw new Error(`Event session ${sessionId} not found`);
    }

    if (options?.requireReview && options.actorRole === 'EDITOR') {
      return createChangeRequest({
        workspaceId: existing.workspaceId,
        targetType: 'EVENT_SESSION',
        targetId: sessionId,
        requestedByUserId: resolveActor(options.actorUserId),
        proposedChanges: patch,
      });
    }

    const updatedSession: EventSession = { ...existing, ...patch, updatedAt: createTimestamp() };
    const savedSession = await workspaceRepository.updateEventSession(updatedSession);

    setState((prev) => ({
      ...prev,
      eventSessions: prev.eventSessions.map((session) => (session.id === sessionId ? savedSession : session)),
    }));

    if (!options?.skipActivityLog) {
      await persistActivity({
        actionType: 'UPDATE_EVENT_SESSION',
        actorUserId: resolveActor(options?.actorUserId),
        workspaceId: savedSession.workspaceId,
        targetType: 'EVENT_SESSION',
        targetId: savedSession.id,
        diff: patch,
      });
    }

    return savedSession;
  };

  const deleteEventSession = async (sessionId: string, actorUserId?: string) => {
    const removedSession = state.eventSessions.find((session) => session.id === sessionId);
    if (!removedSession) return;

    await workspaceRepository.deleteEventSession(sessionId);

    setState((prev) => {
      const eventSessions = prev.eventSessions.filter((session) => session.id !== sessionId);
      const eventParticipations = prev.eventParticipations.filter((participation) => participation.eventSessionId !== sessionId);
      return { ...prev, eventSessions, eventParticipations };
    });

    await persistActivity({
      actionType: 'DELETE_EVENT_SESSION',
      actorUserId: resolveActor(actorUserId),
      workspaceId: removedSession.workspaceId,
      targetType: 'EVENT_SESSION',
      targetId: removedSession.id,
      diff: { sessionId },
    });
  };

  const listEventSessions = (
    workspaceId: string,
    eventTypeCode?: EventTypeCode,
    filters: EventSessionFilters = {}
  ): EventSession[] =>
    state.eventSessions.filter((session) => {
      if (session.workspaceId !== workspaceId) return false;
      if (eventTypeCode && session.eventTypeCode !== eventTypeCode) return false;
      if (filters.status && session.status !== filters.status) return false;
      if (filters.startingAfter && session.startDateTime < filters.startingAfter) return false;
      if (filters.startingBefore && session.startDateTime > filters.startingBefore) return false;
      return true;
    });

  const addEventParticipation = async (
    sessionId: string,
    playerId: string,
    role: ParticipationRole | string,
    stats: Record<string, number>,
    notes?: string
  ): Promise<EventParticipation> => {
    const session = state.eventSessions.find((eventSession) => eventSession.id === sessionId);
    if (!session) {
      throw new Error(`Event session ${sessionId} not found for participation`);
    }

    const now = createTimestamp();
    const participation: EventParticipation = {
      id: generateId(),
      eventSessionId: sessionId,
      playerId,
      role,
      stats,
      notes,
      createdAt: now,
      updatedAt: now,
    };

    const savedParticipation = await workspaceRepository.insertEventParticipation(participation);
    setState((prev) => ({
      ...prev,
      eventParticipations: [...prev.eventParticipations, savedParticipation],
    }));

    return savedParticipation;
  };

  const updateEventParticipation = async (
    participationId: string,
    patch: Partial<EventParticipation>
  ): Promise<EventParticipation> => {
    const existing = state.eventParticipations.find((participation) => participation.id === participationId);
    if (!existing) {
      throw new Error(`Event participation ${participationId} not found`);
    }

    const updatedParticipation: EventParticipation = { ...existing, ...patch, updatedAt: createTimestamp() };
    const savedParticipation = await workspaceRepository.updateEventParticipation(updatedParticipation);

    setState((prev) => ({
      ...prev,
      eventParticipations: prev.eventParticipations.map((participation) =>
        participation.id === participationId ? savedParticipation : participation
      ),
    }));

    return savedParticipation;
  };

  const listEventParticipations = (sessionId: string): EventParticipation[] =>
    state.eventParticipations.filter((participation) => participation.eventSessionId === sessionId);

  const listChangeRequests = (workspaceId: string, statusFilter?: ChangeRequestStatus): ChangeRequest[] =>
    state.changeRequests.filter(
      (request) => request.workspaceId === workspaceId && (!statusFilter || request.status === statusFilter)
    );

  const applyApprovedChanges = async (
    changeRequest: ChangeRequest
  ): Promise<Player | EventSession | undefined> => {
    const timestamp = createTimestamp();

    if (changeRequest.targetType === 'PLAYER') {
      const player = state.players.find((entry) => entry.id === changeRequest.targetId);
      if (!player) return undefined;
      const updated: Player = { ...player, ...(changeRequest.proposedChanges as Partial<Player>), updatedAt: timestamp };
      const savedPlayer = await workspaceRepository.updatePlayer(updated);
      setState((prev) => ({
        ...prev,
        players: prev.players.map((entry) => (entry.id === savedPlayer.id ? savedPlayer : entry)),
      }));
      return savedPlayer;
    }

    const session = state.eventSessions.find((entry) => entry.id === changeRequest.targetId);
    if (!session) return undefined;
    const updatedSession: EventSession = {
      ...session,
      ...(changeRequest.proposedChanges as Partial<EventSession>),
      updatedAt: timestamp,
    };
    const savedSession = await workspaceRepository.updateEventSession(updatedSession);
    setState((prev) => ({
      ...prev,
      eventSessions: prev.eventSessions.map((entry) => (entry.id === savedSession.id ? savedSession : entry)),
    }));
    return savedSession;
  };

  const reviewChangeRequest = async (
    requestId: string,
    reviewerUserId: string,
    decision: Exclude<ChangeRequestStatus, 'PENDING'>,
    comment?: string
  ) => {
    const existing = state.changeRequests.find((request) => request.id === requestId);
    if (!existing) {
      throw new Error(`Change request ${requestId} not found`);
    }

    const updatedRequest: ChangeRequest = {
      ...existing,
      status: decision,
      reviewerUserId,
      reviewedAt: createTimestamp(),
      reviewComment: comment,
    };

    const savedRequest = await workspaceRepository.updateChangeRequest(updatedRequest);
    setState((prev) => ({
      ...prev,
      changeRequests: prev.changeRequests.map((request) => (request.id === savedRequest.id ? savedRequest : request)),
    }));

    let updatedTarget: Player | EventSession | undefined;

    if (decision === 'APPROVED') {
      updatedTarget = await applyApprovedChanges(savedRequest);
      if (updatedTarget) {
        await persistActivity({
          actionType: savedRequest.targetType === 'PLAYER' ? 'UPDATE_PLAYER' : 'UPDATE_EVENT_SESSION',
          actorUserId: reviewerUserId,
          workspaceId: savedRequest.workspaceId,
          targetType: savedRequest.targetType,
          targetId: savedRequest.targetId,
          diff: savedRequest.proposedChanges,
        });
      }
    }

    await persistActivity({
      actionType: 'REVIEW_CHANGE_REQUEST',
      actorUserId: reviewerUserId,
      workspaceId: savedRequest.workspaceId,
      targetType: 'CHANGE_REQUEST',
      targetId: savedRequest.id,
      diff: { decision, comment },
    });

    return { updatedTarget, updatedRequest: savedRequest };
  };

  const logActivity = (entry: Omit<ActivityLogEntry, 'id' | 'createdAt'>) => persistActivity(entry);

  const listActivityForWorkspace = (workspaceId: string) =>
    state.activityLog.filter((entry) => entry.workspaceId === workspaceId);

  const listActivityForTarget = (workspaceId: string, targetType: ActivityTargetType, targetId: string) =>
    state.activityLog.filter(
      (entry) => entry.workspaceId === workspaceId && entry.targetType === targetType && entry.targetId === targetId
    );

  const addComment = async (
    workspaceId: string,
    targetType: CommentTargetType,
    targetId: string,
    authorUserId: string,
    body: string
  ): Promise<Comment> => {
    const timestamp = createTimestamp();
    const comment: Comment = {
      id: generateId(),
      workspaceId,
      targetType,
      targetId,
      authorUserId,
      body,
      createdAt: timestamp,
      updatedAt: timestamp,
      isEdited: false,
    };

    const savedComment = await workspaceRepository.insertComment(comment);
    setState((prev) => ({ ...prev, comments: [...prev.comments, savedComment] }));
    return savedComment;
  };

  const editComment = async (commentId: string, body: string): Promise<Comment> => {
    const existing = state.comments.find((comment) => comment.id === commentId);
    if (!existing) {
      throw new Error(`Comment ${commentId} not found`);
    }

    const timestamp = createTimestamp();
    const updatedComment: Comment = { ...existing, body, isEdited: true, updatedAt: timestamp };
    const savedComment = await workspaceRepository.updateComment(updatedComment);

    setState((prev) => ({
      ...prev,
      comments: prev.comments.map((comment) => (comment.id === savedComment.id ? savedComment : comment)),
    }));

    return savedComment;
  };

  const listComments = (workspaceId: string, targetType: CommentTargetType, targetId: string) =>
    state.comments.filter(
      (comment) => comment.workspaceId === workspaceId && comment.targetType === targetType && comment.targetId === targetId
    );

  return {
    getState,
    setState,
    subscribe,
    hydrateForUser,
    createWorkspace,
    updateWorkspace,
    archiveWorkspace,
    listWorkspacesForUser,
    getWorkspaceById,
    addWorkspaceMember,
    updateWorkspaceMemberRole,
    removeWorkspaceMember,
    createWorkspaceInvite,
    acceptWorkspaceInvite,
    createPlayer,
    updatePlayer,
    listPlayers,
    getPlayer,
    createEventSession,
    updateEventSession,
    deleteEventSession,
    listEventSessions,
    addEventParticipation,
    updateEventParticipation,
    listEventParticipations,
    createChangeRequest,
    listChangeRequests,
    reviewChangeRequest,
    logActivity,
    listActivityForWorkspace,
    listActivityForTarget,
    addComment,
    editComment,
    listComments,
  };
};

export type WorkspaceStore = ReturnType<typeof createWorkspaceStore>;

export const workspaceStore = createWorkspaceStore();
