import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useMemo } from 'react';
import type {
  DashboardOrderSnapshot,
  IncomingOrder,
  InProcessOrder,
  Bill,
  DeliveryStats,
  OrderStats,
  OrderListSection,
  OrderDetails,
} from '../../context/dashboardStore';
import {
  dashboardOrdersByIdAtom,
  OrderItemStatus,
  upsertDashboardSnapshotAtom,
  visibleOrderListSectionsAtom,
} from '../../context/dashboardStore';
import { useOrganizationId } from './organization.hooks';

const DASHBOARD_ORDERS_QUERY = gql`
  query GetDashboardOrders($organizationId: ID!) {
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

const DASHBOARD_ACTIVE_DINING_SESSIONS_QUERY = gql`
  query DashboardActiveDiningSessions($organizationId: ID!) {
    activeDiningSessions(organizationId: $organizationId) {
      sessionId
      tabletId
      tableNumber
      orderIds
      orderStatusByOrderId
    }
  }
`;

const UPDATE_ORDER_STATUS_MUTATION = gql`
  mutation UpdateOrderStatus($input: UpdateOrderStatusInput!) {
    updateOrderStatus(input: $input) {
      success
      message
    }
  }
`;

interface DashboardOrderProduct {
  id: string;
  productId: string;
  totalPrice: number;
  product?: {
    id: string;
    name: string;
    imgUrl?: string | null;
    price?: number | null;
  } | null;
}

interface DashboardOrder {
  id: string;
  totalPrice: number;
  tabletId?: string | null;
  tableNumber: number;
  created: string;
  products?: DashboardOrderProduct[] | null;
}

type RuntimeOrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';

interface ActiveDiningSession {
  sessionId: string;
  tabletId?: string | null;
  tableNumber: number;
  orderIds: string[];
  orderStatusByOrderId?: Record<string, RuntimeOrderStatus> | null;
}

interface DashboardOrdersQueryData {
  orders: DashboardOrder[];
}

interface DashboardActiveDiningSessionsQueryData {
  activeDiningSessions: ActiveDiningSession[];
}

interface DashboardOrdersQueryVariables {
  organizationId: string;
}

interface UpdateOrderStatusMutationData {
  updateOrderStatus?: {
    success: boolean;
    message: string;
  } | null;
}

interface UpdateOrderStatusMutationVariables {
  input: {
    orderId: string;
    status: 'Pending' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';
    message?: string;
  };
}

const formatAmount = (amount: number): string => `€${amount.toFixed(2)}`;

const formatOrderTime = (timestamp: string): string => {
  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) {
    return timestamp;
  }

  return parsed.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const resolveLocalizedName = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed.startsWith('{')) {
    return value;
  }

  try {
    const parsed = JSON.parse(trimmed) as Record<string, string>;
    return parsed.en ?? parsed.fi ?? parsed.sv ?? Object.values(parsed)[0] ?? value;
  } catch {
    return value;
  }
};

const isRuntimeOrderStatus = (value: unknown): value is RuntimeOrderStatus => {
  return (
    value === 'Pending' ||
    value === 'Preparing' ||
    value === 'Ready' ||
    value === 'Completed' ||
    value === 'Cancelled'
  );
};

const toRuntimeOrderStatusMap = (sessions: ActiveDiningSession[]): Record<string, RuntimeOrderStatus> => {
  const orderStatusById: Record<string, RuntimeOrderStatus> = {};

  sessions.forEach((session) => {
    const explicitStatusMap = session.orderStatusByOrderId ?? {};

    Object.entries(explicitStatusMap).forEach(([orderId, status]) => {
      if (isRuntimeOrderStatus(status)) {
        orderStatusById[orderId] = status;
      }
    });

    session.orderIds.forEach((orderId) => {
      if (!orderStatusById[orderId]) {
        orderStatusById[orderId] = 'Pending';
      }
    });
  });

  return orderStatusById;
};

const toFrontendStatus = (status: RuntimeOrderStatus): (typeof OrderItemStatus)[keyof typeof OrderItemStatus] => {
  switch (status) {
    case 'Preparing':
      return OrderItemStatus.Preparing;
    case 'Ready':
      return OrderItemStatus.Ready;
    case 'Pending':
    case 'Completed':
    case 'Cancelled':
    default:
      return OrderItemStatus.New;
  }
};

const isActiveDashboardStatus = (status: RuntimeOrderStatus): boolean => {
  return status === 'Pending' || status === 'Preparing';
};

const toDashboardSnapshot = (
  order: DashboardOrder,
  runtimeStatus: RuntimeOrderStatus
): DashboardOrderSnapshot => ({
  orderNo: order.id,
  tableNumber: order.tableNumber,
  time: formatOrderTime(order.created),
  amount: formatAmount(order.totalPrice),
  total: order.totalPrice,
  status: toFrontendStatus(runtimeStatus),
  products: (order.products ?? []).map((orderProduct) => ({
    id: orderProduct.id,
    name: resolveLocalizedName(orderProduct.product?.name ?? orderProduct.productId),
    image: orderProduct.product?.imgUrl ?? '',
    price: orderProduct.product?.price ?? orderProduct.totalPrice,
    quantity: 1,
  })),
});

const useDashboardRuntimeOrders = () => {
  const { organizationId, loading: organizationLoading, error: organizationError } = useOrganizationId();

  const { data, loading, error } = useQuery<DashboardOrdersQueryData, DashboardOrdersQueryVariables>(
    DASHBOARD_ORDERS_QUERY,
    {
      variables: {
        organizationId: organizationId ?? '',
      },
      skip: !organizationId,
      pollInterval: 15000,
    }
  );

  const {
    data: sessionsData,
    loading: sessionsLoading,
    error: sessionsError,
  } = useQuery<DashboardActiveDiningSessionsQueryData, DashboardOrdersQueryVariables>(
    DASHBOARD_ACTIVE_DINING_SESSIONS_QUERY,
    {
      variables: {
        organizationId: organizationId ?? '',
      },
      skip: !organizationId,
      pollInterval: 15000,
    }
  );

  const orders = useMemo(() => data?.orders ?? [], [data]);
  const activeSessions = useMemo(() => sessionsData?.activeDiningSessions ?? [], [sessionsData]);

  const snapshots = useMemo<DashboardOrderSnapshot[]>(() => {
    const runtimeStatusByOrderId = toRuntimeOrderStatusMap(activeSessions);
    const nextSnapshots: DashboardOrderSnapshot[] = [];

    orders.forEach((order) => {
      const runtimeStatus = runtimeStatusByOrderId[order.id];
      if (!runtimeStatus || !isActiveDashboardStatus(runtimeStatus)) {
        return;
      }

      const snapshot = toDashboardSnapshot(order, runtimeStatus);
      nextSnapshots.push(snapshot);
    });

    return nextSnapshots;
  }, [activeSessions, orders]);

  return {
    orders,
    snapshots,
    loading: organizationLoading || loading || sessionsLoading,
    error: organizationError ?? error ?? sessionsError,
  };
};

export const useSyncDashboardOrders = () => {
  const { snapshots, loading, error } = useDashboardRuntimeOrders();
  const upsertSnapshot = useSetAtom(upsertDashboardSnapshotAtom);

  useEffect(() => {
    upsertSnapshot({
      orders: snapshots,
      source: 'poll',
    });
  }, [snapshots, upsertSnapshot]);

  return {
    loading,
    error,
  } as const;
};

interface DashboardData {
  incomingOrders: IncomingOrder[];
  inProcessOrders: InProcessOrder[];
  bills: Bill[];
  deliveryStats: DeliveryStats;
  orderStats: OrderStats;
}

/**
 * Hook to fetch dashboard data
 * Used for: Dashboard overview, order management
 */
export const useGetDashboardData = () => {
  const { orders, snapshots, loading, error } = useDashboardRuntimeOrders();

  const data = useMemo<DashboardData>(() => {
    const incomingOrders = snapshots
      .filter((order) => order.status === OrderItemStatus.New)
      .map<IncomingOrder>((order) => ({
        id: order.orderNo,
        name: `Table ${order.tableNumber}`,
        orderNo: Number.parseInt(order.orderNo, 10) || 0,
        image: order.products[0]?.image ?? '',
      }));
    const inProcessOrders = snapshots
      .filter((order) => order.status === OrderItemStatus.Preparing)
      .map<InProcessOrder>((order) => ({
        id: order.orderNo,
        name: `Table ${order.tableNumber}`,
        orderNo: Number.parseInt(order.orderNo, 10) || 0,
        status: 'prep',
      }));

    const delivered = 0;
    const onTheWay = inProcessOrders.length;

    const now = new Date();
    const currentMonth = now.getMonth();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousMonthYear = currentMonth === 0 ? now.getFullYear() - 1 : now.getFullYear();

    const orderStats: OrderStats = {
      today: orders.filter((order) => new Date(order.created).toDateString() === now.toDateString()).length,
      yesterday: orders.filter((order) => {
        const createdAt = new Date(order.created);
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        return createdAt.toDateString() === yesterday.toDateString();
      }).length,
      lastMonth: orders.filter((order) => {
        const createdAt = new Date(order.created);
        return createdAt.getMonth() === previousMonth && createdAt.getFullYear() === previousMonthYear;
      }).length,
    };

    return {
      incomingOrders,
      inProcessOrders,
      bills: [] as Bill[],
      deliveryStats: {
        delivered,
        onTheWay,
        cancelled: 0,
      },
      orderStats,
    };
  }, [orders, snapshots]);

  return {
    data,
    loading,
    error,
  } as const;
};

/**
 * Hook to fetch incoming orders
 */
export const useGetIncomingOrders = () => {
  const { data, loading, error } = useGetDashboardData();

  return {
    data: data.incomingOrders,
    loading,
    error,
  } as const;
};

/**
 * Hook to fetch in-process orders
 */
export const useGetInProcessOrders = () => {
  const { data, loading, error } = useGetDashboardData();

  return {
    data: data.inProcessOrders,
    loading,
    error,
  } as const;
};

/**
 * Hook to fetch delivery statistics
 */
export const useGetDeliveryStats = () => {
  const { data, loading, error } = useGetDashboardData();

  return {
    data: data.deliveryStats,
    loading,
    error,
  } as const;
};

/**
 * Hook to fetch order statistics
 */
export const useGetOrderStats = () => {
  const { data, loading, error } = useGetDashboardData();

  return {
    data: data.orderStats,
    loading,
    error,
  } as const;
};

/**
 * Hook to fetch order list sections
 */
export const useGetOrderListSections = (): { data: OrderListSection[]; loading: boolean; error: undefined } => {
  const sections = useAtomValue(visibleOrderListSectionsAtom);
  const { loading } = useSyncDashboardOrders();

  return {
    data: sections,
    loading,
    error: undefined,
  } as const;
};

export const getOrderDetails = (
  orderNo: string,
  dashboardOrdersById: Record<
    string,
    {
      orderNo: string;
      tableNumber: number;
      time: string;
      total: number;
      status: (typeof OrderItemStatus)[keyof typeof OrderItemStatus];
      products: OrderDetails['products'];
    }
  >
): OrderDetails | null => {
  const order = dashboardOrdersById[orderNo];
  if (!order) {
    return null;
  }

  return {
    orderNo: order.orderNo,
    tableNumber: order.tableNumber,
    time: order.time,
    status: order.status,
    products: order.products,
    total: order.total,
  };
};

export const useDashboardOrdersById = () => {
  return useAtomValue(dashboardOrdersByIdAtom);
};

/**
 * Mutation hooks for order actions
 * These will send updates via WebSocket when connected
 */

export interface OrderActionResult {
  success: boolean;
  error?: string;
}

interface OrderActionsHook {
  acceptOrder: (orderNo: string) => Promise<OrderActionResult>;
  rejectOrder: (orderNo: string, reason?: string) => Promise<OrderActionResult>;
  markOrderReady: (orderNo: string) => Promise<OrderActionResult>;
  markOrderDelivered: (orderNo: string) => Promise<OrderActionResult>;
}

/**
 * Hook for order actions (accept, reject, etc.)
 * When WebSocket is connected, these actions will send real-time updates
 * When WebSocket is not connected, they work with local state only
 * 
 * Usage:
 * ```tsx
 * const { acceptOrder, rejectOrder } = useOrderActions();
 * 
 * const handleAccept = async () => {
 *   const result = await acceptOrder(orderNo);
 *   if (result.success) {
 *     // Handle success
 *   }
 * };
 * ```
 */
export const useOrderActions = (): OrderActionsHook => {
  const [updateOrderStatus] = useMutation<UpdateOrderStatusMutationData, UpdateOrderStatusMutationVariables>(
    UPDATE_ORDER_STATUS_MUTATION
  );

  const runUpdateOrderStatus = async (
    orderNo: string,
    status: UpdateOrderStatusMutationVariables['input']['status'],
    message?: string
  ): Promise<OrderActionResult> => {
    try {
      const response = await updateOrderStatus({
        variables: {
          input: {
            orderId: orderNo,
            status,
            message,
          },
        },
      });

      if (response.error) {
        return {
          success: false,
          error: response.error.message,
        };
      }

      const payload = response.data?.updateOrderStatus;
      if (!payload?.success) {
        return {
          success: false,
          error: payload?.message ?? 'Failed to update order status',
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  const acceptOrder = async (orderNo: string): Promise<OrderActionResult> =>
    runUpdateOrderStatus(orderNo, 'Preparing');

  const rejectOrder = async (orderNo: string, reason?: string): Promise<OrderActionResult> => {
    return runUpdateOrderStatus(orderNo, 'Cancelled', reason);
  };

  const markOrderReady = async (orderNo: string): Promise<OrderActionResult> => {
    return runUpdateOrderStatus(orderNo, 'Ready');
  };

  const markOrderDelivered = async (orderNo: string): Promise<OrderActionResult> => {
    return runUpdateOrderStatus(orderNo, 'Completed');
  };

  return {
    acceptOrder,
    rejectOrder,
    markOrderReady,
    markOrderDelivered,
  };
};
