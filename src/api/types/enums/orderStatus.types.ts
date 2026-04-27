// Order status enum representing the lifecycle of an order
export const OrderStatus = {
  Pending: 0,      // Order placed, awaiting restaurant acceptance
  Preparing: 1,    // Order accepted and being prepared
  Ready: 2,        // Order ready for pickup
  Completed: 3,    // Order completed/delivered
  Cancelled: 4     // Order cancelled
}

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
