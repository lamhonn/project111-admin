export interface ProductDto {
  Id: string;
  OrganizationId: string;
  Name: string; // JSON string containing the name in different languages
  Description: string | null; // JSON string containing the description in different languages
  Ingredients: string | null; // JSON string containing the ingredients in different languages
  Price: number;
  Dietaries: any[] | null;
  FreeToppings: number;
  ProductToppings: [];
  ProductExcludables: any[];
  ImgUrl: string | null;
}