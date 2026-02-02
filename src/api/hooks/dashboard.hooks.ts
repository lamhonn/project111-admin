import type {
  IncomingOrder,
  InProcessOrder,
  DeliveryStats,
  OrderStats,
} from '../../context/dashboardStore';
import {
  MOCK_INCOMING_ORDERS,
  MOCK_IN_PROCESS_ORDERS,
  MOCK_DELIVERY_STATS,
  MOCK_ORDER_STATS,
} from '../mockData/dashboard.mock';

/**
 * Dashboard data hooks
 * Following the pattern from product.hooks.ts
 * 
 * TODO: Currently returns mock data. When ready to connect to real API,
 * replace with actual GraphQL queries or API calls.
 */

interface DashboardData {
  incomingOrders: IncomingOrder[];
  inProcessOrders: InProcessOrder[];
  deliveryStats: DeliveryStats;
  orderStats: OrderStats;
}

/**
 * Hook to fetch dashboard data
 * Used for: Dashboard overview, order management
 */
export const useGetDashboardData = () => {
  // Temporarily return mock data instead of making API query
  // This allows components to use the hook pattern while we develop
  return {
    data: {
      incomingOrders: MOCK_INCOMING_ORDERS,
      inProcessOrders: MOCK_IN_PROCESS_ORDERS,
      deliveryStats: MOCK_DELIVERY_STATS,
      orderStats: MOCK_ORDER_STATS,
    } as DashboardData,
    loading: false,
    error: undefined,
  } as const;

  // When ready for real API, replace above with:
  // return useQuery<DashboardData>(GET_DASHBOARD_DATA, {
  //   pollInterval: 5000, // Refresh every 5 seconds for real-time updates
  // });
};

/**
 * Hook to fetch incoming orders
 */
export const useGetIncomingOrders = () => {
  return {
    data: MOCK_INCOMING_ORDERS,
    loading: false,
    error: undefined,
  } as const;
};

/**
 * Hook to fetch in-process orders
 */
export const useGetInProcessOrders = () => {
  return {
    data: MOCK_IN_PROCESS_ORDERS,
    loading: false,
    error: undefined,
  } as const;
};

/**
 * Hook to fetch delivery statistics
 */
export const useGetDeliveryStats = () => {
  return {
    data: MOCK_DELIVERY_STATS,
    loading: false,
    error: undefined,
  } as const;
};

/**
 * Hook to fetch order statistics
 */
export const useGetOrderStats = () => {
  return {
    data: MOCK_ORDER_STATS,
    loading: false,
    error: undefined,
  } as const;
};
