import { Dietary } from "../enums";
import { ProductExcludableDto } from "./productExcludableDto";
import { ProductToppingDto } from "./productToppingDto";

export interface ProductDto {
  id: string;
  organizationId: string;
  name: string; // JSON string containing the name in different languages
  description?: string; // JSON string containing the description in different languages
  ingredients?: string; // JSON string containing the ingredients in different languages
  price: number;
  dietaries: Dietary[];
  freeToppings: number;
  productToppings: ProductToppingDto[];
  productExcludables: ProductExcludableDto[];
  imgUrl?: string;
}