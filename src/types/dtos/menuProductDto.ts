export interface MenuProductDto {
    id: string,
    menuId: string,
    productId: string,
    menuCategoryId: string,
    name: string,
    imgUrl?: string,
    price: number,
    created: Date
}