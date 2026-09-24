import { OrderStatus } from "../enums/orderStatus";
import { OrderProductDto } from "./orderProductDto";

export interface OrderDto {
    id: string,
    organizationId: string,
    sessionId: string,
    userId: string,
    tabletId: string,
    totalPrice: number,
    orderStatus: OrderStatus,
    orderProducts: OrderProductDto[],
}
