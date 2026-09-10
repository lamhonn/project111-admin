import { OrderStatus } from "../enums/orderStatus";
import { OrderProduct } from "./orderProduct";

export interface Order {
    Id: string,
    OrganizationId: string,
    SessionId: string,
    UserId: string,
    TabletId: string,
    TableNumber: number,
    TotalPrice: number,
    OrderProducts: OrderProduct[],
    OrderStatus: OrderStatus,
    Created: Date
}
