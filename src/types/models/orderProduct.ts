import { OrderProductExcludable } from "./orderProductExcludables";
import { OrderProductTopping } from "./orderProductTopping";

export interface OrderProduct {
    id: string,
    orderId: string,
    productId: string,
    productName: string,
    productPrice: number,
    orderProductToppings: OrderProductTopping[],
    orderProductExcludables: OrderProductExcludable[],
    created: Date,
}
