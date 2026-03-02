import type {
  IncomingOrder,
  InProcessOrder,
  Bill,
  DeliveryStats,
  OrderStats,
  OrderListSection,
  OrderDetails,
} from '../../context/dashboardStore';
import { OrderItemStatus, OrderProcessStatus } from '../../context/dashboardStore';
import type { HistoryOrderViewModel } from '../../viewModels';

const now = new Date();

const minutesAgo = (minutes: number): string => {
  const date = new Date(now.getTime() - minutes * 60 * 1000);
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const isoDaysAgo = (days: number): string => {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export const MOCK_ORDER_DETAILS: Record<string, OrderDetails> = {
  '1001': {
    orderNo: '1001',
    tableNumber: 1,
    time: minutesAgo(10),
    status: OrderItemStatus.New,
    products: [
      {
        id: 'od-1001-1',
        name: 'Margherita Pizza',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=160',
        price: 12.99,
        quantity: 1,
      },
      {
        id: 'od-1001-2',
        name: 'French Fries',
        image: 'https://images.unsplash.com/photo-1630384082554-e4e5c0e7b869?w=160',
        price: 4.99,
        quantity: 1,
      },
      {
        id: 'od-1001-3',
        name: 'Coca-Cola',
        image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=160',
        price: 2.99,
        quantity: 2,
      },
    ],
    total: 23.96,
  },
  '1002': {
    orderNo: '1002',
    tableNumber: 2,
    time: minutesAgo(7),
    status: OrderItemStatus.New,
    products: [
      {
        id: 'od-1002-1',
        name: 'Cheese Burger',
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=160',
        price: 10.99,
        quantity: 2,
      },
      {
        id: 'od-1002-2',
        name: 'Sprite',
        image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=160',
        price: 2.99,
        quantity: 2,
      },
    ],
    total: 27.96,
  },
  '1003': {
    orderNo: '1003',
    tableNumber: 3,
    time: minutesAgo(15),
    status: OrderItemStatus.Preparing,
    products: [
      {
        id: 'od-1003-1',
        name: 'BBQ Chicken Pizza',
        image: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=160',
        price: 15.99,
        quantity: 1,
      },
      {
        id: 'od-1003-2',
        name: 'Onion Rings',
        image: 'https://images.unsplash.com/photo-1619221882783-4f9a5e2e3ee9?w=160',
        price: 5.49,
        quantity: 1,
      },
    ],
    total: 21.48,
  },
  '1004': {
    orderNo: '1004',
    tableNumber: 5,
    time: minutesAgo(18),
    status: OrderItemStatus.Preparing,
    products: [
      {
        id: 'od-1004-1',
        name: 'Veggie Supreme',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=160',
        price: 13.49,
        quantity: 1,
      },
      {
        id: 'od-1004-2',
        name: 'Mozzarella Sticks',
        image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=160',
        price: 6.99,
        quantity: 1,
      },
      {
        id: 'od-1004-3',
        name: 'Appelsiinimehu',
        image: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?w=160',
        price: 3.49,
        quantity: 1,
      },
    ],
    total: 23.97,
  },
  '1005': {
    orderNo: '1005',
    tableNumber: 1,
    time: minutesAgo(32),
    status: OrderItemStatus.Ready,
    products: [
      {
        id: 'od-1005-1',
        name: 'Classic Burger',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=160',
        price: 9.99,
        quantity: 2,
      },
      {
        id: 'od-1005-2',
        name: 'Heineken',
        image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=160',
        price: 5.9,
        quantity: 1,
      },
    ],
    total: 25.88,
  },
  '1006': {
    orderNo: '1006',
    tableNumber: 6,
    time: minutesAgo(40),
    status: OrderItemStatus.Ready,
    products: [
      {
        id: 'od-1006-1',
        name: 'Meat Lover\'s Pizza',
        image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=160',
        price: 16.99,
        quantity: 1,
      },
      {
        id: 'od-1006-2',
        name: 'San Miguel',
        image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=160',
        price: 5.9,
        quantity: 2,
      },
    ],
    total: 28.79,
  },
};

export const MOCK_ORDER_LIST_SECTIONS: OrderListSection[] = [
  {
    section: 'newOrders',
    count: 2,
    orders: [
      {
        orderNo: '1001',
        brand: 'Main Hall',
        tableNumber: 1,
        time: MOCK_ORDER_DETAILS['1001'].time,
        amount: '€23.96',
        status: 'view',
        statusColor: 'primary',
        internalStatus: OrderItemStatus.New,
      },
      {
        orderNo: '1002',
        brand: 'Main Hall',
        tableNumber: 2,
        time: MOCK_ORDER_DETAILS['1002'].time,
        amount: '€27.96',
        status: 'view',
        statusColor: 'primary',
        internalStatus: OrderItemStatus.New,
      },
    ],
  },
  {
    section: 'preparing',
    count: 2,
    orders: [
      {
        orderNo: '1003',
        brand: 'Kitchen',
        tableNumber: 3,
        time: MOCK_ORDER_DETAILS['1003'].time,
        amount: '€21.48',
        status: 'ready',
        statusColor: 'success',
        internalStatus: OrderItemStatus.Preparing,
      },
      {
        orderNo: '1004',
        brand: 'Kitchen',
        tableNumber: 5,
        time: MOCK_ORDER_DETAILS['1004'].time,
        amount: '€23.97',
        status: 'ready',
        statusColor: 'success',
        internalStatus: OrderItemStatus.Preparing,
      },
    ],
  },
  {
    section: 'billRequests',
    count: 2,
    orders: [
      {
        orderNo: '1005',
        brand: 'Cashier',
        tableNumber: 1,
        time: MOCK_ORDER_DETAILS['1005'].time,
        amount: '€25.88',
        status: 'print',
        statusColor: 'warning',
        internalStatus: OrderItemStatus.Ready,
      },
      {
        orderNo: '1006',
        brand: 'Cashier',
        tableNumber: 6,
        time: MOCK_ORDER_DETAILS['1006'].time,
        amount: '€28.79',
        status: 'print',
        statusColor: 'warning',
        internalStatus: OrderItemStatus.Ready,
      },
    ],
  },
];

export const MOCK_INCOMING_ORDERS: IncomingOrder[] = [
  { id: 'inc-1001', name: 'Margherita Pizza', orderNo: 1001, image: '🍕' },
  { id: 'inc-1002', name: 'Cheese Burger', orderNo: 1002, image: '🍔' },
];

export const MOCK_IN_PROCESS_ORDERS: InProcessOrder[] = [
  { id: 'proc-1003', name: 'BBQ Chicken Pizza', orderNo: 1003, status: OrderProcessStatus.Cooking },
  { id: 'proc-1004', name: 'Veggie Supreme', orderNo: 1004, status: OrderProcessStatus.Prep },
];

export const MOCK_BILLS: Bill[] = [
  { id: 'bill-1005', tableNumber: 1, guestName: 'Table 1', amount: 25.88, items: 3 },
  { id: 'bill-1006', tableNumber: 6, guestName: 'Table 6', amount: 28.79, items: 3 },
];

export const MOCK_DELIVERY_STATS: DeliveryStats = {
  delivered: 18,
  onTheWay: 4,
  cancelled: 1,
};

export const MOCK_ORDER_STATS: OrderStats = {
  today: 26,
  yesterday: 19,
  lastMonth: 612,
};

export const MOCK_ORDER_HISTORY: HistoryOrderViewModel[] = [
  {
    id: 'hist-1001',
    orderNumber: '1001',
    date: isoDaysAgo(0),
    total: 23.96,
    products: [
      { id: 'hp-1001-1', name: 'Margherita Pizza', image: '🍕', price: 12.99, quantity: 1 },
      { id: 'hp-1001-2', name: 'French Fries', image: '🍟', price: 4.99, quantity: 1 },
      { id: 'hp-1001-3', name: 'Coca-Cola', image: '🥤', price: 2.99, quantity: 2 },
    ],
  },
  {
    id: 'hist-0998',
    orderNumber: '998',
    date: isoDaysAgo(1),
    total: 31.47,
    products: [
      { id: 'hp-998-1', name: 'Pepperoni Pizza', image: '🍕', price: 14.99, quantity: 1 },
      { id: 'hp-998-2', name: 'Cabernet Sauvignon 12cl', image: '🍷', price: 9.5, quantity: 1 },
      { id: 'hp-998-3', name: 'French Fries', image: '🍟', price: 4.99, quantity: 1 },
    ],
  },
  {
    id: 'hist-0975',
    orderNumber: '975',
    date: isoDaysAgo(4),
    total: 45.94,
    products: [
      { id: 'hp-975-1', name: 'Classic Burger', image: '🍔', price: 9.99, quantity: 2 },
      { id: 'hp-975-2', name: 'Mozzarella Sticks', image: '🧀', price: 6.99, quantity: 1 },
      { id: 'hp-975-3', name: 'Heineken', image: '🍺', price: 5.9, quantity: 3 },
    ],
  },
  {
    id: 'hist-0942',
    orderNumber: '942',
    date: isoDaysAgo(9),
    total: 28.79,
    products: [
      { id: 'hp-942-1', name: 'Meat Lover\'s Pizza', image: '🍕', price: 16.99, quantity: 1 },
      { id: 'hp-942-2', name: 'San Miguel', image: '🍺', price: 5.9, quantity: 2 },
    ],
  },
  {
    id: 'hist-0891',
    orderNumber: '891',
    date: isoDaysAgo(21),
    total: 23.97,
    products: [
      { id: 'hp-891-1', name: 'Veggie Supreme', image: '🥬', price: 13.49, quantity: 1 },
      { id: 'hp-891-2', name: 'Mozzarella Sticks', image: '🧀', price: 6.99, quantity: 1 },
      { id: 'hp-891-3', name: 'Sprite', image: '🥤', price: 2.99, quantity: 1 },
    ],
  },
];
