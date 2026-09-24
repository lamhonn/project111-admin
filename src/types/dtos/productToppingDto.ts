export interface ProductToppingDto {
    id: string,
    productId: string,
    name: string, // JSON string with multilingual object
    price: number,
    created: Date,
}