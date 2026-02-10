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

/**
 * Mock data for dashboard
 * Following the pattern from products.mock.ts
 */

export const MOCK_INCOMING_ORDERS: IncomingOrder[] = [
  { id: '1', name: 'Bread with Avocado', orderNo: 220, image: '🥑' },
  { id: '2', name: 'Raspberry Lemon Meringue Pie', orderNo: 227, image: '🥧' },
  { id: '3', name: 'Oysters Rockefeller', orderNo: 266, image: '🦪' },
  { id: '4', name: 'Sticky Toffee Pudding', orderNo: 343, image: '🍮' },
  { id: '5', name: 'Veg bucket with cheese', orderNo: 124, image: '🧀' },
  { id: '6', name: 'Black Forest Cake', orderNo: 67, image: '🍰' },
  { id: '7', name: 'Cream Cheese Frosting', orderNo: 543, image: '🧁' },
  { id: '8', name: 'Arugula Blackberry Salad', orderNo: 211, image: '🥗' },
];

export const MOCK_IN_PROCESS_ORDERS: InProcessOrder[] = [
  { id: '1', name: '2 Special Biryani', orderNo: 220, status: 'ready' },
  { id: '2', name: 'Maple Bacon Doughnut', orderNo: 220, status: 'prep' },
  { id: '3', name: 'Raspberry Lemon Meringue Pie', orderNo: 220, status: 'ready' },
  { id: '4', name: 'Raspberry Lemon Meringue Pie', orderNo: 220, status: 'ready' },
];

export const MOCK_BILLS: Bill[] = [
  { id: '1', tableNumber: 5, guestName: 'Smith', amount: 45.50, items: 3 },
  { id: '2', tableNumber: 12, guestName: 'Johnson', amount: 78.20, items: 5 },
  { id: '3', tableNumber: 8, guestName: 'Williams', amount: 32.00, items: 2 },
  { id: '4', tableNumber: 3, guestName: 'Brown', amount: 120.75, items: 7 },
  { id: '5', tableNumber: 15, guestName: 'Davis', amount: 56.30, items: 4 },
  { id: '6', tableNumber: 7, guestName: 'Miller', amount: 89.00, items: 6 },
];

export const MOCK_DELIVERY_STATS: DeliveryStats = {
  delivered: 9,
  onTheWay: 23,
  cancelled: 2,
};

export const MOCK_ORDER_STATS: OrderStats = {
  today: 233,
  yesterday: 766,
  lastMonth: 5543,
};

// Mock order list sections with many orders for stress testing UI
export const MOCK_ORDER_LIST_SECTIONS: OrderListSection[] = [
  {
    section: 'newOrders',
    count: 8,
    orders: [
      {
        orderNo: '878856',
        brand: 'Brand 1',
        tableNumber: 5,
        time: '02:30 PM',
        amount: '$25.09',
        status: 'view',
        statusColor: 'success',
        internalStatus: OrderItemStatus.New,
      },
      {
        orderNo: '878857',
        brand: 'Brand 2',
        tableNumber: 2,
        time: '02:31 PM',
        amount: '$32.50',
        status: 'view',
        statusColor: 'success',
        internalStatus: OrderItemStatus.New,
      },
      {
        orderNo: '878858',
        brand: 'Brand 3',
        tableNumber: 9,
        time: '02:32 PM',
        amount: '$18.75',
        status: 'view',
        statusColor: 'success',
        internalStatus: OrderItemStatus.New,
      },
      {
        orderNo: '878859',
        brand: 'Brand 1',
        tableNumber: 14,
        time: '02:33 PM',
        amount: '$45.20',
        status: 'view',
        statusColor: 'success',
        internalStatus: OrderItemStatus.New,
      },
      {
        orderNo: '878860',
        brand: 'Brand 4',
        tableNumber: 6,
        time: '02:34 PM',
        amount: '$28.90',
        status: 'view',
        statusColor: 'success',
        internalStatus: OrderItemStatus.New,
      },
      {
        orderNo: '878861',
        brand: 'Brand 2',
        tableNumber: 11,
        time: '02:35 PM',
        amount: '$38.40',
        status: 'view',
        statusColor: 'success',
        internalStatus: OrderItemStatus.New,
      },
      {
        orderNo: '878862',
        brand: 'Brand 3',
        tableNumber: 1,
        time: '02:36 PM',
        amount: '$22.15',
        status: 'view',
        statusColor: 'success',
        internalStatus: OrderItemStatus.New,
      },
      {
        orderNo: '878863',
        brand: 'Brand 1',
        tableNumber: 17,
        time: '02:37 PM',
        amount: '$51.60',
        status: 'view',
        statusColor: 'success',
        internalStatus: OrderItemStatus.New,
      },
    ],
  },
  {
    section: 'preparing',
    count: 12,
    orders: [
      {
        orderNo: '878850',
        brand: 'Brand 1',
        tableNumber: 12,
        time: '02:15 PM',
        amount: '$42.30',
        status: 'ready',
        statusColor: 'warning',
        internalStatus: OrderItemStatus.Preparing,
      },
      {
        orderNo: '878851',
        brand: 'Brand 3',
        tableNumber: 8,
        time: '02:16 PM',
        amount: '$35.50',
        status: 'ready',
        statusColor: 'warning',
        internalStatus: OrderItemStatus.Preparing,
      },
      {
        orderNo: '878852',
        brand: 'Brand 2',
        tableNumber: 3,
        time: '02:17 PM',
        amount: '$28.75',
        status: 'ready',
        statusColor: 'warning',
        internalStatus: OrderItemStatus.Preparing,
      },
      {
        orderNo: '878853',
        brand: 'Brand 4',
        tableNumber: 16,
        time: '02:18 PM',
        amount: '$56.20',
        status: 'ready',
        statusColor: 'warning',
        internalStatus: OrderItemStatus.Preparing,
      },
      {
        orderNo: '878854',
        brand: 'Brand 1',
        tableNumber: 4,
        time: '02:19 PM',
        amount: '$31.40',
        status: 'ready',
        statusColor: 'warning',
        internalStatus: OrderItemStatus.Preparing,
      },
      {
        orderNo: '878855',
        brand: 'Brand 3',
        tableNumber: 10,
        time: '02:20 PM',
        amount: '$44.90',
        status: 'ready',
        statusColor: 'warning',
        internalStatus: OrderItemStatus.Preparing,
      },
      {
        orderNo: '878848',
        brand: 'Brand 2',
        tableNumber: 13,
        time: '02:10 PM',
        amount: '$39.80',
        status: 'ready',
        statusColor: 'warning',
        internalStatus: OrderItemStatus.Preparing,
      },
      {
        orderNo: '878849',
        brand: 'Brand 1',
        tableNumber: 7,
        time: '02:12 PM',
        amount: '$27.60',
        status: 'ready',
        statusColor: 'warning',
        internalStatus: OrderItemStatus.Preparing,
      },
      {
        orderNo: '878846',
        brand: 'Brand 4',
        tableNumber: 18,
        time: '02:05 PM',
        amount: '$48.50',
        status: 'ready',
        statusColor: 'warning',
        internalStatus: OrderItemStatus.Preparing,
      },
      {
        orderNo: '878847',
        brand: 'Brand 3',
        tableNumber: 20,
        time: '02:08 PM',
        amount: '$33.25',
        status: 'ready',
        statusColor: 'warning',
        internalStatus: OrderItemStatus.Preparing,
      },
      {
        orderNo: '878844',
        brand: 'Brand 2',
        tableNumber: 15,
        time: '02:00 PM',
        amount: '$41.70',
        status: 'ready',
        statusColor: 'warning',
        internalStatus: OrderItemStatus.Preparing,
      },
      {
        orderNo: '878845',
        brand: 'Brand 1',
        tableNumber: 19,
        time: '02:03 PM',
        amount: '$36.90',
        status: 'ready',
        statusColor: 'warning',
        internalStatus: OrderItemStatus.Preparing,
      },
    ],
  },
  {
    section: 'billRequests',
    count: 6,
    orders: [
      {
        orderNo: '543216',
        brand: 'Brand 1',
        tableNumber: 15,
        time: '01:45 PM',
        amount: '$62.50',
        status: 'print',
        statusColor: 'primary',
        internalStatus: OrderItemStatus.Ready,
      },
      {
        orderNo: '987654',
        brand: 'Brand 3',
        tableNumber: 7,
        time: '01:50 PM',
        amount: '$55.30',
        status: 'print',
        statusColor: 'secondary',
        internalStatus: OrderItemStatus.Ready,
      },
      {
        orderNo: '543217',
        brand: 'Brand 2',
        tableNumber: 22,
        time: '01:52 PM',
        amount: '$47.80',
        status: 'print',
        statusColor: 'primary',
        internalStatus: OrderItemStatus.Ready,
      },
      {
        orderNo: '543218',
        brand: 'Brand 4',
        tableNumber: 11,
        time: '01:55 PM',
        amount: '$73.20',
        status: 'print',
        statusColor: 'secondary',
        internalStatus: OrderItemStatus.Ready,
      },
      {
        orderNo: '543219',
        brand: 'Brand 1',
        tableNumber: 9,
        time: '01:57 PM',
        amount: '$39.90',
        status: 'print',
        statusColor: 'primary',
        internalStatus: OrderItemStatus.Ready,
      },
      {
        orderNo: '543220',
        brand: 'Brand 3',
        tableNumber: 24,
        time: '02:00 PM',
        amount: '$68.40',
        status: 'print',
        statusColor: 'secondary',
        internalStatus: OrderItemStatus.Ready,
      },
    ],
  },
];

/**
 * Mock order details
 * TODO: Replace with real API calls to fetch order details by orderNo
 */
export const MOCK_ORDER_DETAILS: Record<string, OrderDetails> = {
  '878856': {
    orderNo: '878856',
    tableNumber: 1,
    time: '02:30 PM',
    status: OrderItemStatus.New,
    products: [
      {
        id: 'p1',
        name: 'Grilled Salmon',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
        price: 24.99,
        quantity: 1,
        notes: 'Medium rare',
      },
      {
        id: 'p2',
        name: 'Caesar Salad',
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
        price: 12.50,
        quantity: 2,
      },
    ],
    total: 49.99,
  },
  '878857': {
    orderNo: '878857',
    tableNumber: 5,
    time: '02:31 PM',
    status: OrderItemStatus.New,
    products: [
      {
        id: 'p1',
        name: 'Margherita Pizza',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
        price: 18.99,
        quantity: 1,
      },
      {
        id: 'p2',
        name: 'Garlic Bread',
        image: 'https://images.unsplash.com/photo-1573140401552-3fab0b24f2ac?w=400',
        price: 6.50,
        quantity: 1,
      },
      {
        id: 'p3',
        name: 'Tiramisu',
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
        price: 8.99,
        quantity: 2,
      },
    ],
    total: 43.47,
  },
  '878858': {
    orderNo: '878858',
    tableNumber: 12,
    time: '02:32 PM',
    status: OrderItemStatus.New,
    products: [
      {
        id: 'p1',
        name: 'Beef Burger',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        price: 15.99,
        quantity: 2,
        notes: 'No onions',
      },
      {
        id: 'p2',
        name: 'French Fries',
        image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400',
        price: 5.50,
        quantity: 2,
      },
    ],
    total: 42.98,
  },
  '878844': {
    orderNo: '878844',
    tableNumber: 3,
    time: '02:00 PM',
    status: OrderItemStatus.Preparing,
    products: [
      {
        id: 'p1',
        name: 'Pasta Carbonara',
        image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
        price: 16.50,
        quantity: 1,
      },
      {
        id: 'p2',
        name: 'Bruschetta',
        image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400',
        price: 9.99,
        quantity: 1,
      },
    ],
    total: 26.49,
  },
  '878845': {
    orderNo: '878845',
    tableNumber: 7,
    time: '02:03 PM',
    status: OrderItemStatus.Preparing,
    products: [
      {
        id: 'p1',
        name: 'Chicken Teriyaki',
        image: 'https://images.unsplash.com/photo-1606491956391-3cbccdf4c5c4?w=400',
        price: 19.99,
        quantity: 2,
      },
      {
        id: 'p2',
        name: 'Miso Soup',
        image: 'https://images.unsplash.com/photo-1607301405678-323d9f7ce0de?w=400',
        price: 4.50,
        quantity: 2,
      },
      {
        id: 'p3',
        name: 'Edamame',
        image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b3?w=400',
        price: 5.99,
        quantity: 1,
      },
    ],
    total: 54.96,
  },
};

/**
 * Helper function to get order details by order number
 * TODO: Replace with actual API call
 */
export const getOrderDetails = (orderNo: string): OrderDetails | undefined => {
  return MOCK_ORDER_DETAILS[orderNo];
};
