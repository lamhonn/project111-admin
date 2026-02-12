/**
 * Mock data for order history
 */

export interface HistoryOrderProduct {
  id: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface HistoryOrder {
  id: number;
  orderNumber: string;
  date: string;
  total: number;
  products: HistoryOrderProduct[];
}

export const MOCK_ORDER_HISTORY: HistoryOrder[] = [
  { 
    id: 1, 
    orderNumber: 'ORD-2026-001', 
    date: '2026-02-10 14:23', 
    total: 45.50,
    products: [
      { id: 'p1', name: 'Beef Burger', price: 15.99, quantity: 2, notes: 'Extra cheese' },
      { id: 'p2', name: 'French Fries', price: 6.76, quantity: 2 },
    ]
  },
  { 
    id: 2, 
    orderNumber: 'ORD-2026-002', 
    date: '2026-02-10 14:15', 
    total: 28.00,
    products: [
      { id: 'p1', name: 'Caesar Salad', price: 12.50, quantity: 2 },
      { id: 'p2', name: 'Iced Tea', price: 3.00, quantity: 1 },
    ]
  },
  { 
    id: 3, 
    orderNumber: 'ORD-2026-003', 
    date: '2026-02-10 13:45', 
    total: 67.80,
    products: [
      { id: 'p1', name: 'Pasta Carbonara', price: 16.50, quantity: 2 },
      { id: 'p2', name: 'Bruschetta', price: 9.99, quantity: 1 },
      { id: 'p3', name: 'Tiramisu', price: 7.41, quantity: 3 },
    ]
  },
  { 
    id: 4, 
    orderNumber: 'ORD-2026-004', 
    date: '2026-02-10 13:30', 
    total: 32.50,
    products: [
      { id: 'p1', name: 'Margherita Pizza', price: 13.99, quantity: 1 },
      { id: 'p2', name: 'Garlic Bread', price: 5.50, quantity: 1 },
      { id: 'p3', name: 'Coca Cola', price: 3.01, quantity: 4 },
    ]
  },
  { 
    id: 5, 
    orderNumber: 'ORD-2026-005', 
    date: '2026-02-10 12:50', 
    total: 54.20,
    products: [
      { id: 'p1', name: 'Chicken Teriyaki', price: 19.99, quantity: 2 },
      { id: 'p2', name: 'Miso Soup', price: 4.50, quantity: 2 },
      { id: 'p3', name: 'Edamame', price: 5.22, quantity: 1 },
    ]
  },
  { 
    id: 6, 
    orderNumber: 'ORD-2026-006', 
    date: '2026-02-10 12:30', 
    total: 22.00,
    products: [
      { id: 'p1', name: 'Club Sandwich', price: 11.00, quantity: 2 },
    ]
  },
  { 
    id: 7, 
    orderNumber: 'ORD-2026-007', 
    date: '2026-02-10 11:45', 
    total: 89.90,
    products: [
      { id: 'p1', name: 'Ribeye Steak', price: 35.00, quantity: 2 },
      { id: 'p2', name: 'Mac and Cheese', price: 8.50, quantity: 2 },
      { id: 'p3', name: 'Red Wine Glass', price: 2.90, quantity: 1 },
    ]
  },
  { 
    id: 8, 
    orderNumber: 'ORD-2026-008', 
    date: '2026-02-09 19:20', 
    total: 48.50,
    products: [
      { id: 'p1', name: 'Sushi Platter', price: 32.00, quantity: 1 },
      { id: 'p2', name: 'Green Tea', price: 2.50, quantity: 2 },
      { id: 'p3', name: 'Edamame', price: 5.75, quantity: 2 },
    ]
  },
  { 
    id: 9, 
    orderNumber: 'ORD-2026-009', 
    date: '2026-02-09 18:55', 
    total: 36.00,
    products: [
      { id: 'p1', name: 'Fish and Chips', price: 16.50, quantity: 2 },
      { id: 'p2', name: 'Lemonade', price: 3.00, quantity: 1 },
    ]
  },
  { 
    id: 10, 
    orderNumber: 'ORD-2026-010', 
    date: '2026-02-09 18:30', 
    total: 62.40,
    products: [
      { id: 'p1', name: 'BBQ Ribs', price: 24.99, quantity: 2 },
      { id: 'p2', name: 'Coleslaw', price: 4.50, quantity: 2 },
      { id: 'p3', name: 'Beer', price: 3.92, quantity: 1 },
    ]
  },
  { 
    id: 11, 
    orderNumber: 'ORD-2026-011', 
    date: '2026-02-09 17:15', 
    total: 75.30,
    products: [
      { id: 'p1', name: 'Lobster Tail', price: 42.00, quantity: 1 },
      { id: 'p2', name: 'Grilled Vegetables', price: 12.50, quantity: 1 },
      { id: 'p3', name: 'White Wine', price: 10.40, quantity: 2 },
    ]
  },
  { 
    id: 12, 
    orderNumber: 'ORD-2026-012', 
    date: '2026-02-09 16:45', 
    total: 41.20,
    products: [
      { id: 'p1', name: 'Chicken Wings', price: 14.99, quantity: 2 },
      { id: 'p2', name: 'Onion Rings', price: 5.61, quantity: 2 },
    ]
  },
  { 
    id: 13, 
    orderNumber: 'ORD-2026-013', 
    date: '2026-02-09 15:30', 
    total: 58.90,
    products: [
      { id: 'p1', name: 'Lamb Chops', price: 28.50, quantity: 2 },
      { id: 'p2', name: 'Mashed Potatoes', price: 1.90, quantity: 1 },
    ]
  },
  { 
    id: 14, 
    orderNumber: 'ORD-2026-014', 
    date: '2026-02-09 14:20', 
    total: 33.50,
    products: [
      { id: 'p1', name: 'Veggie Burger', price: 13.00, quantity: 2 },
      { id: 'p2', name: 'Sweet Potato Fries', price: 7.50, quantity: 1 },
    ]
  },
  { 
    id: 15, 
    orderNumber: 'ORD-2026-015', 
    date: '2026-02-09 13:10', 
    total: 92.00,
    products: [
      { id: 'p1', name: 'Seafood Paella', price: 38.00, quantity: 2 },
      { id: 'p2', name: 'Sangria Pitcher', price: 16.00, quantity: 1 },
    ]
  },
  { 
    id: 16, 
    orderNumber: 'ORD-2026-016', 
    date: '2026-02-08 19:45', 
    total: 64.80,
    products: [
      { id: 'p1', name: 'T-Bone Steak', price: 32.00, quantity: 2 },
      { id: 'p2', name: 'Coffee', price: 0.80, quantity: 1 },
    ]
  },
  { 
    id: 17, 
    orderNumber: 'ORD-2026-017', 
    date: '2026-02-08 18:30', 
    total: 27.50,
    products: [
      { id: 'p1', name: 'Chicken Quesadilla', price: 12.50, quantity: 2 },
      { id: 'p2', name: 'Guacamole', price: 2.50, quantity: 1 },
    ]
  },
  { 
    id: 18, 
    orderNumber: 'ORD-2026-018', 
    date: '2026-02-08 17:20', 
    total: 51.40,
    products: [
      { id: 'p1', name: 'Pad Thai', price: 15.50, quantity: 2 },
      { id: 'p2', name: 'Spring Rolls', price: 8.00, quantity: 2 },
      { id: 'p3', name: 'Thai Iced Tea', price: 4.40, quantity: 1 },
    ]
  },
  { 
    id: 19, 
    orderNumber: 'ORD-2026-019', 
    date: '2026-02-08 16:15', 
    total: 38.60,
    products: [
      { id: 'p1', name: 'Chicken Tikka Masala', price: 17.50, quantity: 2 },
      { id: 'p2', name: 'Naan Bread', price: 3.60, quantity: 1 },
    ]
  },
  { 
    id: 20, 
    orderNumber: 'ORD-2026-020', 
    date: '2026-02-08 15:00', 
    total: 71.20,
    products: [
      { id: 'p1', name: 'Beef Wellington', price: 42.00, quantity: 1 },
      { id: 'p2', name: 'Roasted Vegetables', price: 9.50, quantity: 2 },
      { id: 'p3', name: 'Chocolate Cake', price: 10.20, quantity: 1 },
    ]
  },
];
