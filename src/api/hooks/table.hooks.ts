import type { TableMonitorViewModel } from '../../viewModels';
import { gql } from '@apollo/client';
import { useQuery, useSubscription } from '@apollo/client/react';
import { useEffect, useMemo, useState } from 'react';
import { mapGraphQLTabletToTablet } from '../graphql/mappers';
import { toTableMonitorViewModel } from '../../viewModels';
import { useOrganizationId } from './organization.hooks';

const TABLETS_QUERY = gql`
  query GetTabletsForMonitor($organizationId: ID!) {
    tablets(organizationId: $organizationId) {
      id
      userId
      tableNumber
      created
    }
  }
`;

const ACTIVE_DINING_SESSIONS_QUERY = gql`
  query ActiveDiningSessions($organizationId: ID!) {
    activeDiningSessions(organizationId: $organizationId) {
      sessionId
      tabletId
      tableNumber
      organizationId
      totalOrders
      totalSpent
      createdAt
      updatedAt
    }
  }
`;

const ORGANIZATION_SESSION_STARTED_SUBSCRIPTION = gql`
  subscription OrganizationSessionStarted($organizationId: ID!) {
    organizationSessionStarted(organizationId: $organizationId) {
      sessionId
      tabletId
      tableNumber
      organizationId
      startedAt
    }
  }
`;

const ORGANIZATION_SESSION_CLOSED_SUBSCRIPTION = gql`
  subscription OrganizationSessionClosed($organizationId: ID!) {
    organizationSessionClosed(organizationId: $organizationId) {
      sessionId
      tabletId
      tableNumber
      organizationId
      totalOrders
      totalSpent
      closedAt
    }
  }
`;

const ORGANIZATION_BILL_REQUESTED_SUBSCRIPTION = gql`
  subscription OrganizationBillRequested($organizationId: ID!) {
    organizationBillRequested(organizationId: $organizationId) {
      sessionId
      tabletId
      tableNumber
      organizationId
      totalOrders
      totalSpent
      timestamp
      message
    }
  }
`;

interface TabletsQueryData {
  tablets: Array<{
    id: string;
    userId?: string | null;
    tableNumber: number;
    created: string;
  }>;
}

interface ActiveDiningSessionsQueryData {
  activeDiningSessions: Array<{
    sessionId: string;
    tabletId: string;
    tableNumber: number;
    organizationId: string;
    totalOrders?: number | null;
    totalSpent?: number | null;
    createdAt: string;
    updatedAt: string;
  }>;
}

interface OrganizationScopedVariables {
  organizationId: string;
}

interface OrganizationSessionStartedSubscriptionData {
  organizationSessionStarted: {
    sessionId: string;
    tabletId: string;
    tableNumber: number;
    organizationId: string;
    startedAt: string;
  };
}

interface OrganizationSessionClosedSubscriptionData {
  organizationSessionClosed: {
    sessionId: string;
    tabletId: string;
  };
}

interface OrganizationBillRequestedSubscriptionData {
  organizationBillRequested: {
    sessionId: string;
  };
}

type ActiveSessionState = {
  sessionId: string;
  tabletId: string;
  tableNumber: number;
  organizationId: string;
  totalOrders: number;
  totalSpent: number;
};

export const useGetTableMonitor = () => {
  const { organizationId, loading: organizationLoading, error: organizationError } = useOrganizationId();
  const [activeSessionsByTablet, setActiveSessionsByTablet] = useState<Record<string, ActiveSessionState>>({});
  const [billRequestedSessionIds, setBillRequestedSessionIds] = useState<Set<string>>(new Set());

  const {
    data: tabletsData,
    loading: tabletsLoading,
    error: tabletsError,
  } = useQuery<TabletsQueryData, OrganizationScopedVariables>(TABLETS_QUERY, {
    variables: {
      organizationId: organizationId ?? '',
    },
    skip: !organizationId,
  });

  const {
    data: activeSessionsData,
    loading: activeSessionsLoading,
    error: activeSessionsError,
    refetch: refetchActiveSessions,
  } = useQuery<ActiveDiningSessionsQueryData, OrganizationScopedVariables>(ACTIVE_DINING_SESSIONS_QUERY, {
    variables: {
      organizationId: organizationId ?? '',
    },
    skip: !organizationId,
  });

  useEffect(() => {
    const nextState = (activeSessionsData?.activeDiningSessions ?? []).reduce<Record<string, ActiveSessionState>>(
      (accumulator, session) => {
        accumulator[session.tabletId] = {
          sessionId: session.sessionId,
          tabletId: session.tabletId,
          tableNumber: session.tableNumber,
          organizationId: session.organizationId,
          totalOrders: session.totalOrders ?? 0,
          totalSpent: session.totalSpent ?? 0,
        };
        return accumulator;
      },
      {}
    );

    setActiveSessionsByTablet(nextState);
    setBillRequestedSessionIds((previous) => {
      if (previous.size === 0) {
        return previous;
      }

      const activeSessionIds = new Set(Object.values(nextState).map((session) => session.sessionId));
      return new Set(Array.from(previous).filter((sessionId) => activeSessionIds.has(sessionId)));
    });
  }, [activeSessionsData]);

  useEffect(() => {
    if (!organizationId) {
      return;
    }

    const refreshSnapshot = () => {
      void refetchActiveSessions({ organizationId });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshSnapshot();
      }
    };

    window.addEventListener('focus', refreshSnapshot);
    window.addEventListener('online', refreshSnapshot);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', refreshSnapshot);
      window.removeEventListener('online', refreshSnapshot);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [organizationId, refetchActiveSessions]);

  const sessionStartedSubscription = useSubscription<
    OrganizationSessionStartedSubscriptionData,
    OrganizationScopedVariables
  >(ORGANIZATION_SESSION_STARTED_SUBSCRIPTION, {
    variables: {
      organizationId: organizationId ?? '',
    },
    skip: !organizationId,
    onData: ({ data }) => {
      const payload = data.data?.organizationSessionStarted;
      if (!payload) {
        return;
      }

      setActiveSessionsByTablet((previous) => ({
        ...previous,
        [payload.tabletId]: {
          sessionId: payload.sessionId,
          tabletId: payload.tabletId,
          tableNumber: payload.tableNumber,
          organizationId: payload.organizationId,
          totalOrders: 0,
          totalSpent: 0,
        },
      }));
    },
  });

  const sessionClosedSubscription = useSubscription<
    OrganizationSessionClosedSubscriptionData,
    OrganizationScopedVariables
  >(ORGANIZATION_SESSION_CLOSED_SUBSCRIPTION, {
    variables: {
      organizationId: organizationId ?? '',
    },
    skip: !organizationId,
    onData: ({ data }) => {
      const payload = data.data?.organizationSessionClosed;
      if (!payload) {
        return;
      }

      setActiveSessionsByTablet((previous) => {
        const next = { ...previous };

        if (payload.tabletId && next[payload.tabletId]?.sessionId === payload.sessionId) {
          delete next[payload.tabletId];
          return next;
        }

        const tabletId = Object.keys(next).find((id) => next[id].sessionId === payload.sessionId);
        if (tabletId) {
          delete next[tabletId];
        }

        return next;
      });

      setBillRequestedSessionIds((previous) => {
        if (!previous.has(payload.sessionId)) {
          return previous;
        }

        const next = new Set(previous);
        next.delete(payload.sessionId);
        return next;
      });
    },
  });

  const billRequestedSubscription = useSubscription<
    OrganizationBillRequestedSubscriptionData,
    OrganizationScopedVariables
  >(ORGANIZATION_BILL_REQUESTED_SUBSCRIPTION, {
    variables: {
      organizationId: organizationId ?? '',
    },
    skip: !organizationId,
    onData: ({ data }) => {
      const payload = data.data?.organizationBillRequested;
      if (!payload) {
        return;
      }

      setBillRequestedSessionIds((previous) => {
        if (previous.has(payload.sessionId)) {
          return previous;
        }

        const next = new Set(previous);
        next.add(payload.sessionId);
        return next;
      });
    },
  });

  const activeSessionByTableNumber = useMemo(() => {
    const map = new Map<number, ActiveSessionState>();
    for (const session of Object.values(activeSessionsByTablet)) {
      map.set(session.tableNumber, session);
    }
    return map;
  }, [activeSessionsByTablet]);

  const tableMonitor = useMemo<TableMonitorViewModel[]>(() => {
    return (tabletsData?.tablets ?? []).map((tablet) => {
      const base = toTableMonitorViewModel(mapGraphQLTabletToTablet(tablet));
      const session = activeSessionsByTablet[tablet.id] ?? activeSessionByTableNumber.get(base.number);

      if (!session) {
        return base;
      }

      return {
        ...base,
        status: 'active',
        sessionId: session.sessionId,
        items: session.totalOrders,
        value: session.totalSpent,
        billRequested: billRequestedSessionIds.has(session.sessionId),
      };
    });
  }, [activeSessionByTableNumber, activeSessionsByTablet, billRequestedSessionIds, tabletsData]);

  const combinedError =
    organizationError ??
    tabletsError ??
    activeSessionsError ??
    sessionStartedSubscription.error ??
    sessionClosedSubscription.error ??
    billRequestedSubscription.error;

  return {
    data: tableMonitor,
    loading: organizationLoading || tabletsLoading || activeSessionsLoading,
    error: combinedError,
  } as const;
};
