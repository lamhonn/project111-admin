import { gql } from '@apollo/client';
import { useSubscription } from '@apollo/client/react';
import { useSetAtom } from 'jotai';
import { useMemo } from 'react';
import {
  billsAtom,
  orderStatsAtom,
  removeDashboardOrdersByTableNumberAtom,
  upsertDashboardSnapshotAtom,
  type DashboardOrderSnapshot,
  type OrderItemStatus,
  updateOrderStatusAtom,
} from '../../context/dashboardStore';
import { OrderItemStatus as OrderItemStatusValues } from '../../viewModels';
import { useOrderActions } from './dashboard.hooks';
import { useOrganizationId } from './organization.hooks';

const WebSocketState = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ERROR: 'error',
} as const;

type WebSocketState = typeof WebSocketState[keyof typeof WebSocketState];

interface WebSocketError {
  message: string;
  timestamp: string;
}

const ORGANIZATION_ORDER_PLACED_SUBSCRIPTION = gql`
  subscription OrganizationOrderPlaced($organizationId: ID!) {
    organizationOrderPlaced(organizationId: $organizationId) {
      orderId
      tabletId
      tableNumber
      organizationId
      timestamp
      order {
        id
        tableNumber
      }
      orderProducts {
        id
      }
    }
  }
`;

const ORGANIZATION_ORDER_STATUS_CHANGED_SUBSCRIPTION = gql`
  subscription OrganizationOrderStatusChanged($organizationId: ID!) {
    organizationOrderStatusChanged(organizationId: $organizationId) {
      orderId
      tabletId
      tableNumber
      organizationId
      newStatus
      timestamp
      message
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

type BackendOrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';

interface OrganizationOrderPlacedSubscriptionData {
  organizationOrderPlaced: {
    orderId: string;
    tabletId?: string | null;
    tableNumber: number;
    organizationId: string;
    timestamp: string;
    order?: {
      id: string;
      tableNumber: number;
    } | null;
    orderProducts?: Array<{ id: string }> | null;
  };
}

interface OrganizationOrderStatusChangedSubscriptionData {
  organizationOrderStatusChanged: {
    orderId: string;
    tabletId?: string | null;
    tableNumber: number;
    organizationId: string;
    newStatus: BackendOrderStatus;
    timestamp: string;
    message?: string | null;
  };
}

interface OrganizationBillRequestedSubscriptionData {
  organizationBillRequested: {
    sessionId: string;
    tabletId?: string | null;
    tableNumber: number;
    organizationId: string;
    totalOrders: number;
    totalSpent: number;
    timestamp: string;
    message?: string | null;
  };
}

interface OrganizationSessionClosedSubscriptionData {
  organizationSessionClosed: {
    sessionId: string;
    tabletId?: string | null;
    tableNumber: number;
    organizationId: string;
    totalOrders: number;
    totalSpent: number;
    closedAt: string;
  };
}

interface OrganizationSubscriptionVariables {
  organizationId: string;
}

interface DashboardRealtimeHook {
  state: WebSocketState;
  error: WebSocketError | null;
  isConnected: boolean;
  acceptOrder: (orderNo: string, acceptedBy?: string) => Promise<{ success: boolean; error?: string }>;
  rejectOrder: (orderNo: string, reason?: string, rejectedBy?: string) => Promise<{ success: boolean; error?: string }>;
  changeOrderStatus: (
    orderNo: string,
    oldStatus: OrderItemStatus,
    newStatus: OrderItemStatus,
    changedBy?: string
  ) => Promise<{ success: boolean; error?: string }>;
}

const toFrontendStatus = (status: BackendOrderStatus): OrderItemStatus | null => {
  switch (status) {
    case 'Pending':
      return OrderItemStatusValues.New;
    case 'Preparing':
      return OrderItemStatusValues.Preparing;
    case 'Ready':
      return OrderItemStatusValues.Ready;
    case 'Completed':
    case 'Cancelled':
      return OrderItemStatusValues.Ready;
    default:
      return null;
  }
};

export const useDashboardWebSocket = (): DashboardRealtimeHook => {
  const { organizationId, loading: organizationLoading, error: organizationError } = useOrganizationId();
  const { acceptOrder, rejectOrder, markOrderReady } = useOrderActions();

  const setBills = useSetAtom(billsAtom);
  const setOrderStats = useSetAtom(orderStatsAtom);
  const upsertSnapshot = useSetAtom(upsertDashboardSnapshotAtom);
  const removeOrdersByTableNumber = useSetAtom(removeDashboardOrdersByTableNumberAtom);
  const updateOrderStatus = useSetAtom(updateOrderStatusAtom);

  const orderPlacedSubscription = useSubscription<
    OrganizationOrderPlacedSubscriptionData,
    OrganizationSubscriptionVariables
  >(ORGANIZATION_ORDER_PLACED_SUBSCRIPTION, {
    variables: {
      organizationId: organizationId ?? '',
    },
    skip: !organizationId,
    onData: ({ data }) => {
      const payload = data.data?.organizationOrderPlaced;
      if (!payload) {
        return;
      }

      const orderId = payload.order?.id ?? payload.orderId;
      const tableNumber = payload.order?.tableNumber ?? payload.tableNumber;
      const snapshot: DashboardOrderSnapshot = {
        orderNo: orderId,
        tableNumber,
        time: new Date(payload.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        amount: '€0.00',
        total: 0,
        status: OrderItemStatusValues.New,
        products: [],
      };

      upsertSnapshot({
        orders: [snapshot],
        source: 'websocket',
      });

      setOrderStats((previous) => ({
        ...previous,
        today: previous.today + 1,
      }));
    },
  });

  const orderStatusSubscription = useSubscription<
    OrganizationOrderStatusChangedSubscriptionData,
    OrganizationSubscriptionVariables
  >(ORGANIZATION_ORDER_STATUS_CHANGED_SUBSCRIPTION, {
    variables: {
      organizationId: organizationId ?? '',
    },
    skip: !organizationId,
    onData: ({ data }) => {
      const payload = data.data?.organizationOrderStatusChanged;
      if (!payload) {
        return;
      }

      const nextStatus = toFrontendStatus(payload.newStatus);
      if (!nextStatus) {
        return;
      }

      updateOrderStatus({
        orderNo: payload.orderId,
        newStatus: nextStatus,
      });
    },
  });

  const billRequestedSubscription = useSubscription<
    OrganizationBillRequestedSubscriptionData,
    OrganizationSubscriptionVariables
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

      setBills((previous) => {
        if (previous.some((item) => item.id === payload.sessionId)) {
          return previous;
        }

        return [
          ...previous,
          {
            id: payload.sessionId,
            tableNumber: payload.tableNumber,
            guestName: `Table ${payload.tableNumber}`,
            amount: payload.totalSpent,
            items: payload.totalOrders,
          },
        ];
      });
    },
  });

  const sessionClosedSubscription = useSubscription<
    OrganizationSessionClosedSubscriptionData,
    OrganizationSubscriptionVariables
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

      setBills((previous) => previous.filter((item) => item.id !== payload.sessionId));
      removeOrdersByTableNumber(payload.tableNumber);
    },
  });

  const state = useMemo<WebSocketState>(() => {
    if (organizationLoading) {
      return WebSocketState.CONNECTING;
    }

    if (!organizationId) {
      return WebSocketState.DISCONNECTED;
    }

    if (
      organizationError ||
      orderPlacedSubscription.error ||
      orderStatusSubscription.error ||
      billRequestedSubscription.error ||
      sessionClosedSubscription.error
    ) {
      return WebSocketState.ERROR;
    }

    if (
      orderPlacedSubscription.loading ||
      orderStatusSubscription.loading ||
      billRequestedSubscription.loading ||
      sessionClosedSubscription.loading
    ) {
      return WebSocketState.CONNECTING;
    }

    return WebSocketState.CONNECTED;
  }, [
    billRequestedSubscription.error,
    billRequestedSubscription.loading,
    orderPlacedSubscription.error,
    orderPlacedSubscription.loading,
    orderStatusSubscription.error,
    orderStatusSubscription.loading,
    organizationError,
    organizationId,
    organizationLoading,
    sessionClosedSubscription.error,
    sessionClosedSubscription.loading,
  ]);

  const combinedError = useMemo<WebSocketError | null>(() => {
    const sourceError =
      organizationError ??
      orderPlacedSubscription.error ??
      orderStatusSubscription.error ??
      billRequestedSubscription.error ??
      sessionClosedSubscription.error;

    if (!sourceError) {
      return null;
    }

    return {
      message: sourceError.message,
      timestamp: new Date().toISOString(),
    };
  }, [
    billRequestedSubscription.error,
    orderPlacedSubscription.error,
    orderStatusSubscription.error,
    organizationError,
    sessionClosedSubscription.error,
  ]);

  const changeOrderStatus = async (
    orderNo: string,
    oldStatus: OrderItemStatus,
    newStatus: OrderItemStatus,
    changedBy?: string
  ) => {
    void oldStatus;
    void changedBy;

    if (newStatus === OrderItemStatusValues.Preparing) {
      return acceptOrder(orderNo);
    }

    if (newStatus === OrderItemStatusValues.Ready) {
      return markOrderReady(orderNo);
    }

    return {
      success: false,
      error: `Unsupported status transition target: ${newStatus}`,
    };
  };

  return {
    state,
    error: combinedError,
    isConnected: state === WebSocketState.CONNECTED,
    acceptOrder: (orderNo: string, acceptedBy?: string) => {
      void acceptedBy;
      return acceptOrder(orderNo);
    },
    rejectOrder: (orderNo: string, reason?: string, rejectedBy?: string) => {
      void rejectedBy;
      return rejectOrder(orderNo, reason);
    },
    changeOrderStatus,
  };
};

export const useAdminWebSocket = () => {
  return useDashboardWebSocket();
};
