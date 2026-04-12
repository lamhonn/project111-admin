import { atom } from 'jotai';
import type {
  OrderDetailsViewModel,
  OrderItemStatus as OrderItemStatusType,
  OrderListItemViewModel,
  OrderListSectionViewModel,
} from '../viewModels';
import { OrderItemStatus as OrderItemStatusValues } from '../viewModels';

/**
 * Dashboard Store - State management for Order Dashboard
 * Following the pattern from orderStore.ts
 */

// Menu item types
export interface MenuItem {
  text: string;
  icon: string;
  badge?: string;
  badgeColor?: 'error' | 'warning' | 'success' | 'info';
}

// Incoming order types
export interface IncomingOrder {
  id: string;
  name: string;
  orderNo: number;
  image: string;
}

// In-process order types
export const OrderProcessStatus = {
  Ready: 'ready',
  Prep: 'prep',
  Cooking: 'cooking',
} as const;

export type OrderProcessStatus = typeof OrderProcessStatus[keyof typeof OrderProcessStatus];

export interface InProcessOrder {
  id: string;
  name: string;
  orderNo: number;
  status: OrderProcessStatus;
}

// Bill request types
export interface Bill {
  id: string;
  tableNumber: number;
  guestName: string;
  amount: number;
  items: number;
}

// Delivery status types
export interface DeliveryStats {
  delivered: number;
  onTheWay: number;
  cancelled: number;
}

// Order statistics types
export interface OrderStats {
  today: number;
  yesterday: number;
  lastMonth: number;
}

export type OrderListItem = OrderListItemViewModel;
export type OrderListSection = OrderListSectionViewModel;
export type OrderDetails = OrderDetailsViewModel;
export const OrderItemStatus = OrderItemStatusValues;
export type OrderItemStatus = OrderItemStatusType;

export interface DashboardOrderSnapshot {
  orderNo: string;
  tableNumber: number;
  time: string;
  amount: string;
  total: number;
  products: OrderDetails['products'];
  status: OrderItemStatus;
}

interface DashboardOrderState extends DashboardOrderSnapshot {
  statusSource: 'poll' | 'websocket';
  statusUpdatedAt: number;
}

// Dashboard state atoms
export const selectedMenuAtom = atom<string>('Dashboard');

export const incomingOrdersAtom = atom<IncomingOrder[]>([]);

export const inProcessOrdersAtom = atom<InProcessOrder[]>([]);

export const billsAtom = atom<Bill[]>([]);

export const deliveryStatsAtom = atom<DeliveryStats>({
  delivered: 0,
  onTheWay: 0,
  cancelled: 0,
});

export const orderStatsAtom = atom<OrderStats>({
  today: 0,
  yesterday: 0,
  lastMonth: 0,
});

export const restaurantOpenAtom = atom<boolean>(true);

// Derived atom for active order count
export const activeOrderCountAtom = atom<number>(
  (get) => get(incomingOrdersAtom).length
);

// Derived atom for in-process order count
export const inProcessOrderCountAtom = atom<number>(
  (get) => get(inProcessOrdersAtom).length
);

// Derived atom for bill count
export const billCountAtom = atom<number>(
  (get) => get(billsAtom).length
);

export const dashboardOrdersByIdAtom = atom<Record<string, DashboardOrderState>>({});

const STATUS_PRIORITY: Record<OrderItemStatus, number> = {
  [OrderItemStatusValues.New]: 1,
  [OrderItemStatusValues.Preparing]: 2,
  [OrderItemStatusValues.Ready]: 3,
};

const STATUS_STALE_WINDOW_MS = 20000;

export const upsertDashboardSnapshotAtom = atom(
  null,
  (get, set, payload: { orders: DashboardOrderSnapshot[]; source: 'poll' | 'websocket' }) => {
    const now = Date.now();
    const current = get(dashboardOrdersByIdAtom);
    const previousOrderIds = new Set(Object.keys(current));
    const next: Record<string, DashboardOrderState> = { ...current };

    for (const order of payload.orders) {
      previousOrderIds.delete(order.orderNo);
      const existing = next[order.orderNo];

      if (!existing) {
        next[order.orderNo] = {
          ...order,
          statusSource: payload.source,
          statusUpdatedAt: now,
        };
        continue;
      }

      const incomingStatusPriority = STATUS_PRIORITY[order.status] ?? 0;
      const existingStatusPriority = STATUS_PRIORITY[existing.status] ?? 0;
      const websocketIsRecent =
        existing.statusSource === 'websocket' && now - existing.statusUpdatedAt < STATUS_STALE_WINDOW_MS;
      const shouldPreserveWebsocketStatus =
        payload.source === 'poll' && websocketIsRecent && existingStatusPriority > incomingStatusPriority;

      next[order.orderNo] = {
        ...order,
        status: shouldPreserveWebsocketStatus ? existing.status : order.status,
        statusSource: shouldPreserveWebsocketStatus ? existing.statusSource : payload.source,
        statusUpdatedAt: shouldPreserveWebsocketStatus ? existing.statusUpdatedAt : now,
      };
    }

    if (payload.source === 'poll') {
      for (const removedOrderId of previousOrderIds) {
        delete next[removedOrderId];
      }
    }

    set(dashboardOrdersByIdAtom, next);
  }
);

export const removeDashboardOrdersByTableNumberAtom = atom(null, (get, set, tableNumber: number) => {
  const current = get(dashboardOrdersByIdAtom);
  const next = Object.fromEntries(
    Object.entries(current).filter(([, order]) => order.tableNumber !== tableNumber)
  );
  set(dashboardOrdersByIdAtom, next);
});

export const clearDashboardOrdersAtom = atom(null, (_get, set) => {
  set(dashboardOrdersByIdAtom, {});
});

export const visibleOrderListSectionsAtom = atom<OrderListSection[]>((get) => {
  const orders = Object.values(get(dashboardOrdersByIdAtom));
  const newOrders = orders.filter((order) => order.status === OrderItemStatusValues.New);
  const preparingOrders = orders.filter((order) => order.status === OrderItemStatusValues.Preparing);

  const toListItem = (order: DashboardOrderState, section: 'newOrders' | 'preparing'): OrderListItem => ({
    orderNo: order.orderNo,
    brand: '',
    tableNumber: order.tableNumber,
    time: order.time,
    amount: order.amount,
    status: section === 'newOrders' ? 'view' : 'ready',
    statusColor: section === 'newOrders' ? 'primary' : 'success',
    internalStatus: order.status,
  });

  return [
    {
      section: 'newOrders',
      count: newOrders.length,
      orders: newOrders.map((order) => toListItem(order, 'newOrders')),
    },
    {
      section: 'preparing',
      count: preparingOrders.length,
      orders: preparingOrders.map((order) => toListItem(order, 'preparing')),
    },
    {
      section: 'billRequests',
      count: 0,
      orders: [],
    },
  ];
});

// Order options dialog state
export const selectedOrderAtom = atom<OrderDetails | null>(null);
export const orderOptionsDialogOpenAtom = atom<boolean>(false);

// Write-only atom to update order status
export const updateOrderStatusAtom = atom(
  null,
  (get, set, { orderNo, newStatus }: { orderNo: string; newStatus: OrderItemStatus }) => {
    const current = get(dashboardOrdersByIdAtom);
    const existing = current[orderNo];
    if (!existing) {
      return;
    }

    const next = { ...current };
    if (newStatus === OrderItemStatusValues.Ready) {
      delete next[orderNo];
    } else {
      next[orderNo] = {
        ...existing,
        status: newStatus,
        statusSource: 'websocket',
        statusUpdatedAt: Date.now(),
      };
    }

    set(dashboardOrdersByIdAtom, next);

    const selectedOrder = get(selectedOrderAtom);
    if (selectedOrder && selectedOrder.orderNo === orderNo) {
      set(selectedOrderAtom, { ...selectedOrder, status: newStatus });
    }
  }
);
