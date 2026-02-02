import { atom } from 'jotai';

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

// Dashboard state atoms
export const selectedMenuAtom = atom<string>('Dashboard');

export const incomingOrdersAtom = atom<IncomingOrder[]>([]);

export const inProcessOrdersAtom = atom<InProcessOrder[]>([]);

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
