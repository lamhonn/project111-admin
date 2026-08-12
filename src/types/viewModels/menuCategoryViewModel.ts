import { MenuProduct } from "../models";

export interface MenuCategoryViewModel {
    Id: string,
    MenuId: string,
    Name: string,
    Products: MenuProduct[]
}