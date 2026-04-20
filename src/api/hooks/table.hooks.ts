import type { SessionOrderDetailsViewModel, TableMonitorViewModel } from '../../viewModels';
import { gql } from '@apollo/client';
import { useMutation, useQuery, useSubscription } from '@apollo/client/react';
import { useEffect, useMemo, useState } from 'react';
import { mapGraphQLTabletToTablet } from '../graphql/mappers';
import { toTableMonitorViewModel } from '../../viewModels';
import {
  formatOrderTimestamp,
  isRuntimeOrderStatus,
  resolveLocalizedName,
  RuntimeOrderStatus,
  toOrderItemStatus,
} from '../../viewModels';
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
      orderIds
      orderStatusByOrderId
      totalOrders
      totalSpent
      createdAt
      updatedAt
    }
  }
`;

const TABLE_SESSION_ORDERS_QUERY = gql`
  query GetTableSessionOrders($organizationId: ID!) {
    orders(organizationId: $organizationId) {
      id
      totalPrice
      tabletId
      tableNumber
      created
      products {
        id
        productId
        totalPrice
        product {
          id
          name
          imgUrl
          price
        }
      }
    }
  }
`;

const CLOSE_DINING_SESSION_MUTATION = gql`
  mutation CloseDiningSession($input: CloseDiningSessionInput!) {
    closeDiningSession(input: $input) {
      success
      message
    }
  }
`;

const ORGANIZATION_ORDER_PLACED_SUBSCRIPTION = gql`
  subscription TableOrderPlaced($organizationId: ID!) {
    organizationOrderPlaced(organizationId: $organizationId) {
      orderId
      tableNumber
      organizationId
      timestamp
    }
  }
`;

const ORGANIZATION_ORDER_STATUS_CHANGED_SUBSCRIPTION = gql`
  subscription TableOrderStatusChanged($organizationId: ID!) {
    organizationOrderStatusChanged(organizationId: $organizationId) {
      orderId
      tableNumber
      organizationId
      newStatus
      timestamp
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

interface CloseDiningSessionMutationData {
  closeDiningSession?: {
    success: boolean;
    message: string;
  } | null;
}

interface CloseDiningSessionMutationVariables {
  input: {
    sessionId: string;
    reason?: string;
    notes?: string;
  };
}

interface OrganizationOrderPlacedSubscriptionData {
  organizationOrderPlaced: {
    orderId: string;
    tableNumber: number;
    organizationId: string;
    timestamp: string;
  };
}

interface OrganizationOrderStatusChangedSubscriptionData {
  organizationOrderStatusChanged: {
    orderId: string;
    tableNumber: number;
    organizationId: string;
    newStatus: string;
    timestamp: string;
  };
}

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
    tabletId: string | null;
    tableNumber: number;
    organizationId: string;
    orderIds: string[];
    orderStatusByOrderId?: Record<string, string> | null;
    totalOrders?: number | null;
    totalSpent?: number | null;
    createdAt: string;
    updatedAt: string;
  }>;
}

interface TableSessionOrdersQueryData {
  orders: Array<{
    id: string;
    totalPrice: number;
    tabletId?: string | null;
    tableNumber: number;
    created: string;
    products?: Array<{
      id: string;
      productId: string;
      totalPrice: number;
      product?: {
        id: string;
        name: string;
        imgUrl?: string | null;
        price?: number | null;
      } | null;
    }> | null;
  }>;
}

interface OrganizationScopedVariables {
  organizationId: string;
}

interface OrganizationSessionStartedSubscriptionData {
  organizationSessionStarted: {
    sessionId: string;
    tabletId: string | null;
    tableNumber: number;
    organizationId: string;
    startedAt: string;
  };
}

interface OrganizationSessionClosedSubscriptionData {
  organizationSessionClosed: {
    sessionId: string;
    tabletId: string | null;
    tableNumber: number;
    organizationId: string;
    totalOrders: number;
    totalSpent: number;
    closedAt: string;
  };
}

interface OrganizationBillRequestedSubscriptionData {
  organizationBillRequested: {
    sessionId: string;
    tabletId: string | null;
    tableNumber: number;
    organizationId: string;
    totalOrders: number;
    totalSpent: number;
    timestamp: string;
    message: string;
  };
}

type ActiveSessionState = {
  sessionId: string;
  tabletId: string | null;
  tableNumber: number;
  organizationId: string;
  orderIds: string[];
  orderStatusByOrderId: Record<string, string>;
  totalOrders: number;
  totalSpent: number;
};

const getSessionStateKey = (sessionId: string, tabletId: string | null): string => {
  return tabletId ?? `session:${sessionId}`;
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
        accumulator[getSessionStateKey(session.sessionId, session.tabletId)] = {
          sessionId: session.sessionId,
          tabletId: session.tabletId,
          tableNumber: session.tableNumber,
          organizationId: session.organizationId,
          orderIds: session.orderIds ?? [],
          orderStatusByOrderId: session.orderStatusByOrderId ?? {},
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

      setActiveSessionsByTablet((previous) => {
        const next = { ...previous };

        Object.keys(next).forEach((id) => {
          const session = next[id];
          if (session.sessionId === payload.sessionId || session.tableNumber === payload.tableNumber) {
            delete next[id];
          }
        });

        next[getSessionStateKey(payload.sessionId, payload.tabletId)] = {
          sessionId: payload.sessionId,
          tabletId: payload.tabletId,
          tableNumber: payload.tableNumber,
          organizationId: payload.organizationId,
          orderIds: [],
          orderStatusByOrderId: {},
          totalOrders: 0,
          totalSpent: 0,
        };

        return next;
      });
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

interface TableSessionOrdersOptions {
  enabled?: boolean;
  pollInterval?: number;
}

export const useGetTableSessionOrders = (
  sessionId?: string,
  options: TableSessionOrdersOptions = {}
) => {
  const enabled = (options.enabled ?? true) && Boolean(sessionId);
  const pollInterval = options.pollInterval ?? 15000;
  const { organizationId, loading: organizationLoading, error: organizationError } = useOrganizationId();
  const [localSessionStatusOverrides, setLocalSessionStatusOverrides] = useState<Record<string, string>>({});

  const {
    data: ordersData,
    loading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useQuery<TableSessionOrdersQueryData, OrganizationScopedVariables>(TABLE_SESSION_ORDERS_QUERY, {
    variables: {
      organizationId: organizationId ?? '',
    },
    skip: !organizationId || !enabled,
    pollInterval: enabled ? pollInterval : 0,
  });

  const {
    data: sessionsData,
    loading: sessionsLoading,
    error: sessionsError,
    refetch: refetchSessions,
  } = useQuery<ActiveDiningSessionsQueryData, OrganizationScopedVariables>(ACTIVE_DINING_SESSIONS_QUERY, {
    variables: {
      organizationId: organizationId ?? '',
    },
    skip: !organizationId || !enabled,
    pollInterval: enabled ? pollInterval : 0,
  });

  const orderPlacedSubscription = useSubscription<
    OrganizationOrderPlacedSubscriptionData,
    OrganizationScopedVariables
  >(ORGANIZATION_ORDER_PLACED_SUBSCRIPTION, {
    variables: { organizationId: organizationId ?? '' },
    skip: !organizationId || !enabled,
    onData: ({ data }) => {
      const payload = data.data?.organizationOrderPlaced;
      if (!payload || !sessionId) {
        return;
      }

      setLocalSessionStatusOverrides((prev) => {
        const updated = { ...prev };
        delete updated[payload.orderId];
        return updated;
      });

      // Debug-only force refresh on new orders to avoid waiting for the next poll tick.
      void refetchOrders({ organizationId: organizationId ?? '' });
      void refetchSessions({ organizationId: organizationId ?? '' });
    },
  });

  const orderStatusChangedSubscription = useSubscription<
    OrganizationOrderStatusChangedSubscriptionData,
    OrganizationScopedVariables
  >(ORGANIZATION_ORDER_STATUS_CHANGED_SUBSCRIPTION, {
    variables: { organizationId: organizationId ?? '' },
    skip: !organizationId || !enabled,
    onData: ({ data }) => {
      const payload = data.data?.organizationOrderStatusChanged;
      if (!payload || !sessionId) {
        return;
      }

      setLocalSessionStatusOverrides((prev) => ({
        ...prev,
        [payload.orderId]: payload.newStatus,
      }));
    },
  });

  const data = useMemo<SessionOrderDetailsViewModel[]>(() => {
    if (!sessionId) {
      return [];
    }

    const session = (sessionsData?.activeDiningSessions ?? []).find((item) => item.sessionId === sessionId);
    if (!session) {
      return [];
    }

    const ordersById = new Map((ordersData?.orders ?? []).map((order) => [order.id, order]));

    return (session.orderIds ?? [])
      .map((orderId) => {
        const order = ordersById.get(orderId);
        if (!order) {
          return null;
        }

        const rawStatus =
          localSessionStatusOverrides[order.id] ??
          session.orderStatusByOrderId?.[order.id];
        const runtimeStatus = isRuntimeOrderStatus(rawStatus)
          ? rawStatus
          : RuntimeOrderStatus.Pending;

        return {
          orderNo: order.id,
          tableNumber: order.tableNumber,
          time: formatOrderTimestamp(order.created),
          status: toOrderItemStatus(runtimeStatus),
          runtimeStatus,
          total: order.totalPrice,
          products: (order.products ?? []).map((orderProduct) => ({
            id: orderProduct.id,
            name: resolveLocalizedName(orderProduct.product?.name ?? orderProduct.productId),
            image: orderProduct.product?.imgUrl ?? '',
            price: orderProduct.product?.price ?? orderProduct.totalPrice,
            quantity: 1,
          })),
        };
      })
      .filter((order): order is SessionOrderDetailsViewModel => order !== null);
  }, [localSessionStatusOverrides, ordersData, sessionId, sessionsData]);

  return {
    data,
    loading: organizationLoading || ordersLoading || sessionsLoading,
    error: organizationError ?? ordersError ?? sessionsError ?? orderPlacedSubscription.error ?? orderStatusChangedSubscription.error,
    refetch: async () => {
      if (!organizationId || !enabled) {
        return;
      }

      // Debug-only manual force refresh to fetch latest order/session state immediately.
      await Promise.all([
        refetchOrders({ organizationId }),
        refetchSessions({ organizationId }),
      ]);

      setLocalSessionStatusOverrides({});
    },
  } as const;
};

export const useCloseTableSession = () => {
  const [closeDiningSessionMutation, { loading }] = useMutation<
    CloseDiningSessionMutationData,
    CloseDiningSessionMutationVariables
  >(CLOSE_DINING_SESSION_MUTATION);

  const closeSession = async (
    sessionId: string,
    notes?: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await closeDiningSessionMutation({
        variables: {
          input: {
            sessionId,
            reason: 'NORMAL_CLOSE',
            notes,
          },
        },
      });

      const payload = response.data?.closeDiningSession;
      return {
        success: Boolean(payload?.success),
        message: payload?.message ?? 'Failed to close dining session',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error closing session',
      };
    }
  };

  return { closeSession, closing: loading };
};
