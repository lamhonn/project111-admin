import { OrderProductExcludableDto } from "./orderProductExcludableDto";
import { OrderProductToppingDto } from "./orderProductToppingDto";

export interface OrderProductDto {
    id: string,
    productId: string,
    name: string, // JSON string with multilingual object
    price: number,
    orderProductToppings: OrderProductToppingDto[],
    orderProductExcludables: OrderProductExcludableDto[],
}