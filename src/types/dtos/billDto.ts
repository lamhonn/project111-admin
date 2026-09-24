import { BillStatus } from "../enums/billStatus";
import { OrderProductDto } from "./orderProductDto";

export interface BillDto {
    id: string,
    sessionId: string,
    name: string,
    status: BillStatus,
    orderProducts: OrderProductDto[],
    totalPrice: number,
}