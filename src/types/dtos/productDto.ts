import { Dietary } from "../enums";
import { ProductExcludableDto } from "./productExcludableDto";
import { ProductToppingDto } from "./productToppingDto";

export interface ProductDto {
  Id: string;
  OrganizationId: string;
  Name: string; // JSON string containing the name in different languages
  Description?: string; // JSON string containing the description in different languages
  Ingredients?: string; // JSON string containing the ingredients in different languages
  Price: number;
  Dietaries: Dietary[];
  FreeToppings: number;
  ProductToppings: ProductToppingDto[];
  ProductExcludables: ProductExcludableDto[];
  ImgUrl?: string;
}