import { OrderProductExcludable } from "./orderProductExcludables";
import { OrderProductTopping } from "./orderProductTopping";

export interface OrderProduct {
    Id: string,
    OrderId: string,
    ProductId: string,
    ProductName: string,
    ProductPrice: number,
    OrderProductToppings: OrderProductTopping[],
    OrderProductExcludables: OrderProductExcludable[],
    Created: Date,
}
