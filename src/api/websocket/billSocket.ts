import { BillActivityPayload, ws } from "./client";

export const BillWebSocket = {
  subscribeToBillsCreated: (
    userId: string, 
    onBillCreated: (payload: BillActivityPayload) => void
  ) => {
    return ws.subscribeUser(userId, { onBillCreated });
  }
};