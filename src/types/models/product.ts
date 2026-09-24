import { Dietary } from "../enums";
import { ProductExcludable } from "./productExcludable";
import { ProductTopping } from "./productTopping";

export interface Product {
    id: string,
    organizationId: string,
    name: string, // JSON string with multilingual object
    description?: string, // JSON string with multilingual object
    ingredients?: string // JSON string with multilingual object
    price: number,
    dietaries: Dietary[], // Array of Dietary enum values
    freeToppings: number, // Number of toppings that can be added before PriceIncrement starts
    productToppings: ProductTopping[],
    productExcludables: ProductExcludable[],
    imgUrl?: string,
    created: Date,
}
