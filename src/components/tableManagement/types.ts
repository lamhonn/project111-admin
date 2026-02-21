export interface Topping {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  toppings?: Topping[];
  excludables?: string[];
}

export interface Bill {
  id: string;
  items: OrderItem[];
  status: 'active' | 'requested';
}

export interface BillSplitConfiguration {
  bills: Bill[];
  unsplitItems: OrderItem[];
}

export interface Table {
  id: string;
  number: number;
  status: 'active' | 'inactive';
  progress: number;
  items: number;
  value: number;
  guestName?: string;
  locked?: boolean;
  orderItems?: OrderItem[];
  billSplitConfig?: BillSplitConfiguration;
}
