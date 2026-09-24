import { MenuCategory } from "./menuCategory"
import { Product } from "./product"

export type MenuProduct = {
    id: string,
    menuId: string,
    productId: string,
    product: Product,
    menuCategoryId: string,
    menuCategory: MenuCategory,
    name: string,
    imgUrl?: string,
    price: number,
    created: Date
}
