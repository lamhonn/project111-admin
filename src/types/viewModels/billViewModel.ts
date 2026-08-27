import { BillStatus } from "../enums/billStatus";
import { OrderProduct } from "../models";

export interface BillViewModel {
    Id: string,
    Name: string,
    Status: BillStatus,
    OrderProducts: OrderProduct[]
}