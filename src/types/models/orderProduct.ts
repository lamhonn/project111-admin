import { OrderProductExcludable } from "./orderProductExcludables";
import { OrderProductTopping } from "./orderProductTopping";
import { Product } from "./product";

export interface OrderProduct {
    Id: string,
    OrderId: string,
    ProductId: string,
    ProductName: string,
    ProductPrice: string,
    OrderProductToppings: OrderProductTopping[],
    OrderProductExcludables: OrderProductExcludable[],
    Created: Date,
}
