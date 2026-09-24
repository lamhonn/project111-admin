import { OrderStatus } from "../enums/orderStatus";
import { OrderProduct } from "./orderProduct";

export interface Order {
    id: string,
    organizationId: string,
    sessionId: string,
    userId: string,
    tabletId: string,
    tableNumber: number,
    totalPrice: number,
    orderProducts: OrderProduct[],
    orderStatus: OrderStatus,
    created: Date
}
