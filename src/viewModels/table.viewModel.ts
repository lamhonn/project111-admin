import type { Tablet } from '../api/types';

export interface ToppingViewModel {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderItemViewModel {
  id: string;
  productId: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  toppings?: ToppingViewModel[];
  excludables?: string[];
}

export interface BillViewModel {
  id: string;
  items: OrderItemViewModel[];
  status: 'active' | 'requested';
}

export interface BillSplitConfigurationViewModel {
  bills: BillViewModel[];
  unsplitItems: OrderItemViewModel[];
}

export interface TableMonitorViewModel {
  id: string;
  number: number;
  status: 'active' | 'inactive';
  progress: number;
  items: number;
  value: number;
  guestName?: string;
  locked?: boolean;
  orderItems?: OrderItemViewModel[];
  billSplitConfig?: BillSplitConfigurationViewModel;
}

export const toTableMonitorViewModel = (table: Tablet): TableMonitorViewModel => ({
  id: table.Id,
  number: table.TableNumber,
  status: 'inactive',
  progress: 0,
  items: 0,
  value: 0,
});
