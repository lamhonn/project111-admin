import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { useMemo } from 'react';
import type {
  IncomingOrder,
  InProcessOrder,
  Bill,
  DeliveryStats,
  OrderStats,
  OrderListSection,
  OrderDetails,
} from '../../context/dashboardStore';
import { OrderItemStatus } from '../../context/dashboardStore';
import { useOrganizationId } from './organization.hooks';

const DASHBOARD_ORDERS_QUERY = gql`
  query GetDashboardOrders($organizationId: ID!) {
    orders(organizationId: $organizationId) {
      id
      totalPrice
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
  tableNumber: number;
  created: string;
  products?: DashboardOrderProduct[] | null;
}

interface DashboardOrdersQueryData {
  orders: DashboardOrder[];
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

const latestOrderDetails = new Map<string, OrderDetails>();

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

const toIncomingOrder = (order: DashboardOrder): IncomingOrder => ({
  id: order.id,
  name: `Table ${order.tableNumber}`,
  orderNo: Number.parseInt(order.id, 10) || 0,
  image: order.products?.[0]?.product?.imgUrl ?? '',
});

const toInProcessOrder = (order: DashboardOrder): InProcessOrder => ({
  id: order.id,
  name: `Table ${order.tableNumber}`,
  orderNo: Number.parseInt(order.id, 10) || 0,
  status: 'prep',
});

const getSectionForOrder = (order: DashboardOrder): 'newOrders' | 'preparing' => {
  return (order.products?.length ?? 0) > 0 ? 'preparing' : 'newOrders';
};

const useDashboardOrders = () => {
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

  return {
    orders: data?.orders ?? [],
    loading: organizationLoading || loading,
    error: organizationError ?? error,
  };
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
  const { orders, loading, error } = useDashboardOrders();

  const data = useMemo<DashboardData>(() => {
    const incomingOrders = orders
      .filter((order) => getSectionForOrder(order) === 'newOrders')
      .map(toIncomingOrder);
    const inProcessOrders = orders
      .filter((order) => getSectionForOrder(order) === 'preparing')
      .map(toInProcessOrder);

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
  }, [orders]);

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
  const { orders, loading } = useDashboardOrders();

  const data = useMemo<OrderListSection[]>(() => {
    const newOrders = orders.filter((order) => getSectionForOrder(order) === 'newOrders');
    const preparingOrders = orders.filter((order) => getSectionForOrder(order) === 'preparing');

    latestOrderDetails.clear();
    orders.forEach((order) => {
      latestOrderDetails.set(order.id, {
        orderNo: order.id,
        tableNumber: order.tableNumber,
        time: formatOrderTime(order.created),
        status: getSectionForOrder(order) === 'newOrders' ? OrderItemStatus.New : OrderItemStatus.Preparing,
        products: (order.products ?? []).map((orderProduct) => ({
          id: orderProduct.id,
          name: resolveLocalizedName(orderProduct.product?.name ?? orderProduct.productId),
          image: orderProduct.product?.imgUrl ?? '',
          price: orderProduct.product?.price ?? orderProduct.totalPrice,
          quantity: 1,
        })),
        total: order.totalPrice,
      });
    });

    return [
      {
        section: 'newOrders',
        count: newOrders.length,
        orders: newOrders.map((order) => ({
          orderNo: order.id,
          brand: '',
          tableNumber: order.tableNumber,
          time: formatOrderTime(order.created),
          amount: formatAmount(order.totalPrice),
          status: 'view',
          statusColor: 'primary',
          internalStatus: OrderItemStatus.New,
        })),
      },
      {
        section: 'preparing',
        count: preparingOrders.length,
        orders: preparingOrders.map((order) => ({
          orderNo: order.id,
          brand: '',
          tableNumber: order.tableNumber,
          time: formatOrderTime(order.created),
          amount: formatAmount(order.totalPrice),
          status: 'ready',
          statusColor: 'success',
          internalStatus: OrderItemStatus.Preparing,
        })),
      },
      {
        section: 'billRequests',
        count: 0,
        orders: [],
      },
    ];
  }, [orders]);

  return {
    data,
    loading,
    error: undefined,
  } as const;
};

const parseOrderAmount = (amount: string): number => {
  const normalized = amount.replace(/[^\d.,-]/g, '').replace(',', '.');
  const parsed = Number.parseFloat(normalized);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const getOrderDetails = (orderNo: string, sections: OrderListSection[]): OrderDetails | null => {
  const liveOrderDetails = latestOrderDetails.get(orderNo);
  if (liveOrderDetails) {
    return liveOrderDetails;
  }

  const order = sections.flatMap((section) => section.orders).find((item) => item.orderNo === orderNo);

  if (!order) {
    return null;
  }

  return {
    orderNo: order.orderNo,
    tableNumber: order.tableNumber,
    time: order.time,
    status: order.internalStatus ?? OrderItemStatus.New,
    products: [],
    total: parseOrderAmount(order.amount),
  };
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

      if (response.errors?.length) {
        return {
          success: false,
          error: response.errors[0].message,
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
