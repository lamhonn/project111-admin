import type { Order, OrderProduct } from '../api/types';

export interface HistoryOrderProductViewModel {
  id: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface HistoryOrderViewModel {
  id: string | number;
  orderNumber: string;
  date: string;
  total: number;
  products: HistoryOrderProductViewModel[];
}

export const OrderItemStatus = {
  New: 'new',
  Preparing: 'preparing',
  Ready: 'ready',
} as const;

export type OrderItemStatus = typeof OrderItemStatus[keyof typeof OrderItemStatus];

export interface OrderListItemViewModel {
  orderNo: string;
  brand: string;
  tableNumber: number;
  time: string;
  amount: string;
  status: string;
  statusColor: 'success' | 'warning' | 'primary' | 'secondary' | 'error';
  internalStatus?: OrderItemStatus;
}

export interface OrderListSectionViewModel {
  section: string;
  count: number;
  orders: OrderListItemViewModel[];
}

export interface OrderDetailsProductViewModel {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface OrderDetailsViewModel {
  orderNo: string;
  tableNumber: number;
  time: string;
  status: OrderItemStatus;
  products: OrderDetailsProductViewModel[];
  total: number;
}

export const toHistoryOrderViewModel = (
  order: Order,
  products: HistoryOrderProductViewModel[] = []
): HistoryOrderViewModel => ({
  id: order.Id,
  orderNumber: order.Id,
  date: order.Created.toISOString(),
  total: Number(order.TotalPrice),
  products,
});

export const toHistoryProductViewModel = (orderProduct: OrderProduct): HistoryOrderProductViewModel => ({
  id: orderProduct.Id,
  name: orderProduct.ProductId,
  price: orderProduct.TotalPrice,
  quantity: 1,
});
