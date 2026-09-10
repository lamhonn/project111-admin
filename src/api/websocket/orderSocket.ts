import { OrderActivityPayload, ws } from "./client";

export const OrderWebSocket = {
  subscribeToOrdersCreated: (
    userId: string, 
    onOrderCreated: (payload: OrderActivityPayload) => void
  ) => {
    return ws.subscribeUser(userId, { onOrderCreated });
  }
};