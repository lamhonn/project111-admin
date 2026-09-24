import { BillStatus } from "../enums/billStatus";
import { OrderProduct } from "../models";

export interface BillViewModel {
    id: string,
    name: string,
    status: BillStatus,
    orderProducts: OrderProduct[]
}