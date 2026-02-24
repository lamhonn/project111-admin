import type { Product } from '../api/types';

export interface ProductToppingViewModel {
  name: string;
  priceIncrement: number;
}

export interface ProductListItemViewModel {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface ProductEditorViewModel {
  id: string;
  name: string;
  description: string;
  ingredients: string;
  imgUrl?: string;
  enabled: boolean;
  dietaries: number[];
  toppings: ProductToppingViewModel[];
  excludables: string[];
  ageRestricted: boolean;
  price: number;
  created: Date;
}

const parseJson = <T>(value: string | undefined, fallback: T): T => {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const toProductListItemViewModel = (product: Product): ProductListItemViewModel => ({
  id: product.Id,
  name: product.Name,
  description: product.Description ?? '',
  enabled: product.Enabled,
});

export const toProductEditorViewModel = (product: Product): ProductEditorViewModel => {
  const toppings = parseJson<Array<{ name?: string; priceIncrement?: number }>>(product.Toppings, []);
  const excludables = parseJson<Array<string | { fi?: string; en?: string; sv?: string }>>(product.Excludables, []);
  const ingredientTranslations = parseJson<Record<string, string>>(product.Ingredients, {});

  return {
    id: product.Id,
    name: product.Name,
    description: product.Description ?? '',
    ingredients: ingredientTranslations.fi ?? ingredientTranslations.en ?? ingredientTranslations.sv ?? '',
    imgUrl: product.ImgUrl,
    enabled: product.Enabled,
    dietaries: product.Dietaries ?? [],
    toppings: toppings.map((topping) => ({
      name: topping.name ?? '',
      priceIncrement: topping.priceIncrement ?? 0,
    })),
    excludables: excludables.map((item) =>
      typeof item === 'string' ? item : item.fi ?? item.en ?? item.sv ?? ''
    ),
    ageRestricted: product.AgeRestrictied,
    price: product.Price,
    created: product.Created,
  };
};
