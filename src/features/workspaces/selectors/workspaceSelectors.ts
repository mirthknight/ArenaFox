import type { ArenaState } from '../state/workspaceStore';
import type { EventParticipation, EventSession, EventTypeCode } from '../types/workspace.types';

export interface WorkspaceSummary {
  totalPlayers: number;
  activePlayers: number;
  eventsByType: Record<EventTypeCode, number>;
  upcomingEventsCount: number;
}

export interface EventTypeSummary {
  totalSessions: number;
  lastSessionDate?: string;
  averageAlliancePointsOrDamage?: number;
  topPlayersByMetric: { playerId: string; total: number }[];
}

export interface PlayerEventSummary {
  participationCountByEventType: Record<EventTypeCode, number>;
  recentPerformance: {
    sessionId: string;
    eventTypeCode: EventTypeCode;
    primaryStat: number;
    date: string;
  }[];
}

const toNumber = (value: unknown): number => (typeof value === 'number' ? value : Number(value) || 0);

const EVENT_PLAYER_METRIC_KEY: Record<EventTypeCode, string> = {
  BEAR_TRAP: 'totalDamage',
  ALLIANCE_MOBILIZATION: 'points',
  SWORDLAND_SHOWDOWN: 'relicPoints',
  VIKING_VENGEANCE: 'wavesCompleted',
  SANCTUARY_BATTLES: 'seasonPoints',
  ALL_OUT: 'points',
  ETERNITYS_REACH: 'copperOre',
};

const SESSION_METRIC_KEY: Partial<Record<EventTypeCode, string>> = {
  BEAR_TRAP: 'totalDamage',
  ALLIANCE_MOBILIZATION: 'totalAlliancePoints',
  SWORDLAND_SHOWDOWN: 'ourRelicPoints',
  VIKING_VENGEANCE: 'wavesCompleted',
  SANCTUARY_BATTLES: 'seasonPoints',
  ALL_OUT: 'points',
  ETERNITYS_REACH: 'copperOreTotal',
};

const aggregatePlayerMetric = (
  participations: EventParticipation[],
  metricKey: string
): { playerId: string; total: number }[] => {
  const totals = participations.reduce<Record<string, number>>((acc, participation) => {
    const value = toNumber(participation.stats[metricKey]);
    acc[participation.playerId] = (acc[participation.playerId] ?? 0) + value;
    return acc;
  }, {});

  return Object.entries(totals)
    .map(([playerId, total]) => ({ playerId, total }))
    .sort((a, b) => b.total - a.total);
};

const averageSessionMetric = (sessions: EventSession[], metricKey?: string) => {
  if (!metricKey) return undefined;
  if (sessions.length === 0) return undefined;
  const total = sessions.reduce((acc, session) => acc + toNumber(session.metadata[metricKey]), 0);
  return total / sessions.length;
};

export const getWorkspaceSummary = (state: ArenaState, workspaceId: string): WorkspaceSummary => {
  const playersInWorkspace = state.players.filter((player) => player.workspaceId === workspaceId);
  const sessions = state.eventSessions.filter((session) => session.workspaceId === workspaceId);
  const eventsByType = sessions.reduce<Record<EventTypeCode, number>>((acc, session) => {
    acc[session.eventTypeCode] = (acc[session.eventTypeCode] ?? 0) + 1;
    return acc;
  }, {} as Record<EventTypeCode, number>);

  const nowIso = new Date().toISOString();
  const upcomingEventsCount = sessions.filter((session) => session.startDateTime > nowIso && session.status === 'PLANNED').length;

  return {
    totalPlayers: playersInWorkspace.length,
    activePlayers: playersInWorkspace.filter((player) => player.isActive).length,
    eventsByType,
    upcomingEventsCount,
  };
};

export const getEventTypeSummary = (
  state: ArenaState,
  workspaceId: string,
  eventTypeCode: EventTypeCode
): EventTypeSummary => {
  const sessions = state.eventSessions.filter(
    (session) => session.workspaceId === workspaceId && session.eventTypeCode === eventTypeCode
  );
  const sessionIds = sessions.map((session) => session.id);
  const participations = state.eventParticipations.filter((participation) => sessionIds.includes(participation.eventSessionId));

  const lastSessionDate = sessions
    .map((session) => session.startDateTime)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];

  const averageAlliancePointsOrDamage = averageSessionMetric(sessions, SESSION_METRIC_KEY[eventTypeCode]);
  const topPlayersByMetric = aggregatePlayerMetric(participations, EVENT_PLAYER_METRIC_KEY[eventTypeCode]).slice(0, 5);

  return {
    totalSessions: sessions.length,
    lastSessionDate,
    averageAlliancePointsOrDamage,
    topPlayersByMetric,
  };
};

export const getPlayerEventSummary = (
  state: ArenaState,
  workspaceId: string,
  playerId: string
): PlayerEventSummary => {
  const sessionsById = state.eventSessions
    .filter((session) => session.workspaceId === workspaceId)
    .reduce<Record<string, EventSession>>((acc, session) => {
      acc[session.id] = session;
      return acc;
    }, {});

  const participations = state.eventParticipations.filter((participation) => {
    const session = sessionsById[participation.eventSessionId];
    return participation.playerId === playerId && Boolean(session);
  });

  const participationCountByEventType = participations.reduce<Record<EventTypeCode, number>>((acc, participation) => {
    const session = sessionsById[participation.eventSessionId];
    if (!session) return acc;
    acc[session.eventTypeCode] = (acc[session.eventTypeCode] ?? 0) + 1;
    return acc;
  }, {} as Record<EventTypeCode, number>);

  const recentPerformance = participations
    .map((participation) => {
      const session = sessionsById[participation.eventSessionId];
      return {
        sessionId: participation.eventSessionId,
        eventTypeCode: session.eventTypeCode,
        primaryStat: toNumber(participation.stats[EVENT_PLAYER_METRIC_KEY[session.eventTypeCode]]),
        date: session.startDateTime,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return {
    participationCountByEventType,
    recentPerformance,
  };
};
