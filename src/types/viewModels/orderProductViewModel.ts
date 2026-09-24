import { ProductExcludable, ProductTopping } from "../models";

// used for frontend purposes
export interface OrderProductViewModel {
    id: string, 
    productId: string,
    name: string, // JSON string with multilingual object
    imgUrl?: string,
    price: number, // Total price, including toppings, calculated in UI level
    productToppings: ProductTopping[], // Store name and number. NOTE: As of now, saves multiple toppings as duplicates, e.g. [{ Id: 1, Name: Tomato }, { Id: 1, Name: Tomato }, ...]
    productExcludables: ProductExcludable[] // Store namess of the excludables
}