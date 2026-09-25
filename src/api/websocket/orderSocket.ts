import type { OrderActivityPayload } from "./client";
import { subscribeToDemoOrders } from "../mock/orderActivity";

export const OrderWebSocket = {
  subscribeToOrdersCreated: (
    userId: string, 
    onOrderCreated: (payload: OrderActivityPayload) => void
  ) => {
    return subscribeToDemoOrders(userId, onOrderCreated);
  }
};