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

// Order list types (unified order view)
export const OrderItemStatus = {
  New: 'new',
  Preparing: 'preparing',
  Ready: 'ready',
} as const;

export type OrderItemStatus = typeof OrderItemStatus[keyof typeof OrderItemStatus];

export interface OrderListItem {
  orderNo: string;
  brand: string;
  tableNumber: number;
  time: string;
  amount: string;
  status: string;
  statusColor: 'success' | 'warning' | 'primary' | 'secondary' | 'error';
  // Internal status for logic
  internalStatus?: OrderItemStatus;
}

export interface OrderListSection {
  section: string;
  count: number;
  orders: OrderListItem[];
}

// Order product/item types for order details
export interface OrderProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  notes?: string;
}

// Full order details
export interface OrderDetails {
  orderNo: string;
  tableNumber: number;
  time: string;
  status: OrderItemStatus;
  products: OrderProduct[];
  total: number;
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

// Order list sections atom (data populated from hooks/API)
export const orderListSectionsAtom = atom<OrderListSection[]>([]);

// Order options dialog state
export const selectedOrderAtom = atom<OrderDetails | null>(null);
export const orderOptionsDialogOpenAtom = atom<boolean>(false);

// Write-only atom to update order status
export const updateOrderStatusAtom = atom(
  null,
  (get, set, { orderNo, newStatus }: { orderNo: string; newStatus: OrderItemStatus }) => {
    const sections = get(orderListSectionsAtom);
    
    // Update the status in the order list sections
    const updatedSections = sections.map(section => ({
      ...section,
      orders: section.orders.map(order => 
        order.orderNo === orderNo 
          ? { ...order, internalStatus: newStatus }
          : order
      ),
    }));
    
    set(orderListSectionsAtom, updatedSections);
    
    // Update selected order if it matches
    const selectedOrder = get(selectedOrderAtom);
    if (selectedOrder && selectedOrder.orderNo === orderNo) {
      set(selectedOrderAtom, { ...selectedOrder, status: newStatus });
    }
  }
);
