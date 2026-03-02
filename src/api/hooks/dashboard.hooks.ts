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
import {
  MOCK_BILLS,
  MOCK_DELIVERY_STATS,
  MOCK_IN_PROCESS_ORDERS,
  MOCK_INCOMING_ORDERS,
  MOCK_ORDER_DETAILS,
  MOCK_ORDER_LIST_SECTIONS,
  MOCK_ORDER_STATS,
} from '../mockData/orders.mock';

interface DashboardData {
  incomingOrders: IncomingOrder[];
  inProcessOrders: InProcessOrder[];
  bills: Bill[];
  deliveryStats: DeliveryStats;
  orderStats: OrderStats;
}

const EMPTY_INCOMING_ORDERS: IncomingOrder[] = MOCK_INCOMING_ORDERS;
const EMPTY_IN_PROCESS_ORDERS: InProcessOrder[] = MOCK_IN_PROCESS_ORDERS;
const EMPTY_BILLS: Bill[] = MOCK_BILLS;
const EMPTY_DELIVERY_STATS: DeliveryStats = MOCK_DELIVERY_STATS;
const EMPTY_ORDER_STATS: OrderStats = MOCK_ORDER_STATS;
const EMPTY_ORDER_LIST_SECTIONS: OrderListSection[] = MOCK_ORDER_LIST_SECTIONS;
const EMPTY_DASHBOARD_DATA: DashboardData = {
  incomingOrders: EMPTY_INCOMING_ORDERS,
  inProcessOrders: EMPTY_IN_PROCESS_ORDERS,
  bills: EMPTY_BILLS,
  deliveryStats: EMPTY_DELIVERY_STATS,
  orderStats: EMPTY_ORDER_STATS,
};

/**
 * Hook to fetch dashboard data
 * Used for: Dashboard overview, order management
 */
export const useGetDashboardData = () => {
  return {
    data: EMPTY_DASHBOARD_DATA,
    loading: false,
    error: undefined,
  } as const;
};

/**
 * Hook to fetch incoming orders
 */
export const useGetIncomingOrders = () => {
  return {
    data: EMPTY_INCOMING_ORDERS,
    loading: false,
    error: undefined,
  } as const;
};

/**
 * Hook to fetch in-process orders
 */
export const useGetInProcessOrders = () => {
  return {
    data: EMPTY_IN_PROCESS_ORDERS,
    loading: false,
    error: undefined,
  } as const;
};

/**
 * Hook to fetch delivery statistics
 */
export const useGetDeliveryStats = () => {
  return {
    data: EMPTY_DELIVERY_STATS,
    loading: false,
    error: undefined,
  } as const;
};

/**
 * Hook to fetch order statistics
 */
export const useGetOrderStats = () => {
  return {
    data: EMPTY_ORDER_STATS,
    loading: false,
    error: undefined,
  } as const;
};

/**
 * Hook to fetch order list sections
 */
export const useGetOrderListSections = (): { data: OrderListSection[]; loading: boolean; error: undefined } => {
  return {
    data: EMPTY_ORDER_LIST_SECTIONS,
    loading: false,
    error: undefined,
  } as const;
};

const parseOrderAmount = (amount: string): number => {
  const normalized = amount.replace(/[^\d.,-]/g, '').replace(',', '.');
  const parsed = Number.parseFloat(normalized);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const getOrderDetails = (orderNo: string, sections: OrderListSection[]): OrderDetails | null => {
  const mockOrder = MOCK_ORDER_DETAILS[orderNo];
  if (mockOrder) {
    return mockOrder;
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
