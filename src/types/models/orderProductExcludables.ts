import { OrderProductTopping } from "./orderProductTopping";
import { Product } from "./product";
import { ProductExcludable } from "./productExcludable";

export interface OrderProductExcludable {
    id: string,
    orderProductId: string,
    productExcludableId : string,
    productExcludable: ProductExcludable,
    created: Date,
}