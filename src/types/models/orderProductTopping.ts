import { ProductTopping } from "./productTopping";

export interface OrderProductTopping {
    id: string,
    orderProductId: string,
    productToppingId: string,
    productTopping: ProductTopping,
    created: Date
}
