export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type WorkspaceRole = "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  serverId: number;
  allianceName: string;
  allianceTag?: string;
  description?: string;
  defaultTimezone: string;
  isArchived: boolean;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;
  joinedAt: string;
}

export interface WorkspaceInvite {
  id: string;
  workspaceId: string;
  invitedEmail: string;
  invitedByUserId: string;
  roleOffered: WorkspaceRole;
  token: string;
  status: "PENDING" | "ACCEPTED" | "EXPIRED" | "CANCELLED";
  expiresAt: string;
  createdAt: string;
}

export type AllianceRole = "R5" | "R4" | "R3" | "R2" | "R1" | "Member" | "Guest" | "Other";

export interface Player {
  id: string;
  workspaceId: string;
  inGameName: string;
  allianceRole: AllianceRole | string;
  cityLevel?: number;
  power?: number;
  isActive: boolean;
  joinedDate?: string;
  externalPlayerId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type EventCategory =
  | "ALLIANCE_EVENT"
  | "SOLO_EVENT"
  | "KILL_EVENT"
  | "SEASONAL_EVENT";

export type EventTypeCode =
  | "BEAR_TRAP"
  | "ALLIANCE_MOBILIZATION"
  | "SWORDLAND_SHOWDOWN"
  | "VIKING_VENGEANCE"
  | "SANCTUARY_BATTLES"
  | "ALL_OUT"
  | "ETERNITYS_REACH";

export interface EventType {
  id: string;
  code: EventTypeCode;
  name: string;
  category: EventCategory;
  description?: string;
  workspaceId?: string;
  isEnabledByDefault: boolean;
  defaultFields: string[];
}

export type EventStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface EventSession {
  id: string;
  workspaceId: string;
  eventTypeCode: EventTypeCode;
  name?: string;
  startDateTime: string;
  endDateTime?: string;
  status: EventStatus;
  metadata: Record<string, unknown>;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
}

export type ParticipationRole =
  | "RALLY_LEADER"
  | "JOINER"
  | "DEFENDER"
  | "SOLO_ATTACKER"
  | "SUPPORT"
  | "OTHER";

export interface EventParticipation {
  id: string;
  eventSessionId: string;
  playerId: string;
  role: ParticipationRole | string;
  stats: Record<string, number>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ChangeTargetType = "EVENT_SESSION" | "PLAYER";

export type ChangeRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface ChangeRequest {
  id: string;
  workspaceId: string;
  targetType: ChangeTargetType;
  targetId: string;
  requestedByUserId: string;
  status: ChangeRequestStatus;
  proposedChanges: Record<string, unknown>;
  reviewerUserId?: string;
  reviewedAt?: string;
  reviewComment?: string;
  createdAt: string;
}

export type ActivityTargetType = "WORKSPACE" | "PLAYER" | "EVENT_SESSION" | "CHANGE_REQUEST";

export type ActivityActionType =
  | "CREATE_WORKSPACE"
  | "UPDATE_WORKSPACE"
  | "ARCHIVE_WORKSPACE"
  | "CREATE_PLAYER"
  | "UPDATE_PLAYER"
  | "CREATE_EVENT_SESSION"
  | "UPDATE_EVENT_SESSION"
  | "DELETE_EVENT_SESSION"
  | "INVITE_MEMBER"
  | "ACCEPT_INVITE"
  | "CREATE_CHANGE_REQUEST"
  | "REVIEW_CHANGE_REQUEST";

export interface ActivityLogEntry {
  id: string;
  workspaceId: string;
  actorUserId: string;
  actionType: ActivityActionType;
  targetType: ActivityTargetType;
  targetId: string;
  diff?: Record<string, unknown>;
  createdAt: string;
}

export type CommentTargetType = "WORKSPACE" | "PLAYER" | "EVENT_SESSION" | "CHANGE_REQUEST";

export interface Comment {
  id: string;
  workspaceId: string;
  targetType: CommentTargetType;
  targetId: string;
  authorUserId: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
}

export const BEAR_TRAP_METADATA_FIELDS = [
  "trapLevel",
  "totalDamage",
  "numberOfRallies",
  "rewardTier",
] as const;

export const ALLIANCE_MOBILIZATION_METADATA_FIELDS = [
  "cycleId",
  "totalAlliancePoints",
  "playerPoints",
  "rank",
] as const;

export const SWORDLAND_SHOWDOWN_METADATA_FIELDS = [
  "opponentAlliance",
  "legion",
  "ourRelicPoints",
  "theirRelicPoints",
] as const;

export const VIKING_VENGEANCE_METADATA_FIELDS = [
  "wavesCompleted",
  "hqBurned",
  "eventDurationMinutes",
] as const;

export const SANCTUARY_BATTLES_METADATA_FIELDS = [
  "seasonId",
  "phaseNumber",
  "sanctuariesHeld",
  "fortressesHeld",
  "seasonPoints",
  "seasonRank",
] as const;

export const ALL_OUT_METADATA_FIELDS = [
  "cycleId",
  "killsT1",
  "killsT2",
  "killsT3",
  "killsT4",
  "killsT5",
  "killsT6",
  "killsT7",
  "killsT8",
  "killsT9",
  "killsT10",
  "killsT11",
  "points",
  "troopsLost",
] as const;

export const ETERNITYS_REACH_METADATA_FIELDS = [
  "copperOreTotal",
  "finalRank",
  "guardsKilled",
  "veinsOccupied",
  "fracturedVeinsHit",
  "charmsEarned",
] as const;

export const EVENT_METADATA_FIELDS: Record<EventTypeCode, readonly string[]> = {
  BEAR_TRAP: BEAR_TRAP_METADATA_FIELDS,
  ALLIANCE_MOBILIZATION: ALLIANCE_MOBILIZATION_METADATA_FIELDS,
  SWORDLAND_SHOWDOWN: SWORDLAND_SHOWDOWN_METADATA_FIELDS,
  VIKING_VENGEANCE: VIKING_VENGEANCE_METADATA_FIELDS,
  SANCTUARY_BATTLES: SANCTUARY_BATTLES_METADATA_FIELDS,
  ALL_OUT: ALL_OUT_METADATA_FIELDS,
  ETERNITYS_REACH: ETERNITYS_REACH_METADATA_FIELDS,
};

export const DEFAULT_EVENT_TYPES: EventType[] = [
  {
    id: "global-event-bear-trap",
    code: "BEAR_TRAP",
    name: "Bear Trap",
    category: "ALLIANCE_EVENT",
    description: "Alliance event focused on coordinated rallies against the Bear Trap.",
    isEnabledByDefault: true,
    defaultFields: [...BEAR_TRAP_METADATA_FIELDS],
  },
  {
    id: "global-event-alliance-mobilization",
    code: "ALLIANCE_MOBILIZATION",
    name: "Alliance Mobilization",
    category: "ALLIANCE_EVENT",
    description: "Timed tasks for alliance members to earn points and rewards.",
    isEnabledByDefault: true,
    defaultFields: [...ALLIANCE_MOBILIZATION_METADATA_FIELDS],
  },
  {
    id: "global-event-swordland-showdown",
    code: "SWORDLAND_SHOWDOWN",
    name: "Swordland Showdown",
    category: "ALLIANCE_EVENT",
    description: "Alliance versus alliance relic control showdown.",
    isEnabledByDefault: true,
    defaultFields: [...SWORDLAND_SHOWDOWN_METADATA_FIELDS],
  },
  {
    id: "global-event-viking-vengeance",
    code: "VIKING_VENGEANCE",
    name: "Viking Vengeance",
    category: "ALLIANCE_EVENT",
    description: "Wave defense event testing alliance endurance.",
    isEnabledByDefault: true,
    defaultFields: [...VIKING_VENGEANCE_METADATA_FIELDS],
  },
  {
    id: "global-event-sanctuary-battles",
    code: "SANCTUARY_BATTLES",
    name: "Sanctuary Battles",
    category: "SEASONAL_EVENT",
    description: "Seasonal territory control and ranking for sanctuaries and fortresses.",
    isEnabledByDefault: true,
    defaultFields: [...SANCTUARY_BATTLES_METADATA_FIELDS],
  },
  {
    id: "global-event-all-out",
    code: "ALL_OUT",
    name: "All Out",
    category: "KILL_EVENT",
    description: "Kill event tracking troop tiers, losses, and point totals.",
    isEnabledByDefault: true,
    defaultFields: [...ALL_OUT_METADATA_FIELDS],
  },
  {
    id: "global-event-eternitys-reach",
    code: "ETERNITYS_REACH",
    name: "Eternity's Reach",
    category: "SOLO_EVENT",
    description: "Resource-focused solo competition measuring ore and combat contributions.",
    isEnabledByDefault: true,
    defaultFields: [...ETERNITYS_REACH_METADATA_FIELDS],
  },
];
