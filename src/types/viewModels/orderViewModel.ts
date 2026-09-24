import { OrderStatus } from "../enums/orderStatus";
import { OrderProductViewModel } from "./orderProductViewModel";

export interface OrderViewModel {
    id: string, // TODO: temp id. Create a logic to fetch the id from database.
    organizationId: string,
    sessionId: string,
    userId: string,
    tabletId: string,
    tableNumber: number,
    totalPrice: number,
    orderStatus: OrderStatus,
    orderProducts: OrderProductViewModel[],
    created: Date
}