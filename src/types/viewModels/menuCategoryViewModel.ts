import { MenuProduct } from "../models";

export interface MenuCategoryViewModel {
    id: string,
    menuId: string,
    name: string,
    products: MenuProduct[]
}