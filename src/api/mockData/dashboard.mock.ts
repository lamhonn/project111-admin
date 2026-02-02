import type {
  IncomingOrder,
  InProcessOrder,
  OrderProcessStatus,
  DeliveryStats,
  OrderStats,
} from '../../context/dashboardStore';

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
