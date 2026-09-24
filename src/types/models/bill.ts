import { BillStatus } from "../enums/billStatus";
import { OrderProduct } from "./orderProduct";

export interface Bill {
    id: string,
    sessionId: string,
    tabletId: string,
    name: string,
    status: BillStatus,
    totalPrice: number,
    orderProducts: OrderProduct[] // array of OrderProductViewModel IDs
    created: Date
}