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

export const RuntimeOrderStatus = {
  Pending: 'Pending',
  Preparing: 'Preparing',
  Ready: 'Ready',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
} as const;

export type RuntimeOrderStatus = typeof RuntimeOrderStatus[keyof typeof RuntimeOrderStatus];

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

export interface SessionOrderDetailsViewModel extends OrderDetailsViewModel {
  runtimeStatus: RuntimeOrderStatus;
}

export const formatOrderTimestamp = (timestamp: string): string => {
  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) {
    return timestamp;
  }

  return parsed.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const resolveLocalizedName = (value: string): string => {
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

export const isRuntimeOrderStatus = (value: unknown): value is RuntimeOrderStatus => {
  return (
    value === RuntimeOrderStatus.Pending ||
    value === RuntimeOrderStatus.Preparing ||
    value === RuntimeOrderStatus.Ready ||
    value === RuntimeOrderStatus.Completed ||
    value === RuntimeOrderStatus.Cancelled
  );
};

export const toOrderItemStatus = (status: RuntimeOrderStatus): OrderItemStatus => {
  switch (status) {
    case RuntimeOrderStatus.Preparing:
      return OrderItemStatus.Preparing;
    case RuntimeOrderStatus.Ready:
      return OrderItemStatus.Ready;
    case RuntimeOrderStatus.Pending:
    case RuntimeOrderStatus.Completed:
    case RuntimeOrderStatus.Cancelled:
    default:
      return OrderItemStatus.New;
  }
};

export const isActiveRuntimeOrderStatus = (status: RuntimeOrderStatus): boolean => {
  return status === RuntimeOrderStatus.Pending || status === RuntimeOrderStatus.Preparing;
};

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
