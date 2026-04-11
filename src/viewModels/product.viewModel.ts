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
  ingredients?: string;
  imgUrl?: string;
  price?: number;
  dietaries?: number[];
  toppings?: ProductToppingViewModel[];
  excludables?: string[];
  freeToppings?: number;
  maxToppings?: number;
  ageRestricted?: boolean;
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
  freeToppings: number;
  maxToppings: number;
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

const resolveLocalizedText = (value: string | undefined): string => {
  if (!value) {
    return '';
  }

  const parsed = parseJson<Record<string, string> | string>(value, value);
  if (typeof parsed === 'string') {
    return parsed;
  }

  return parsed.en ?? parsed.fi ?? parsed.sv ?? Object.values(parsed)[0] ?? '';
};

export const toProductListItemViewModel = (product: Product): ProductListItemViewModel => ({
  id: product.Id,
  name: resolveLocalizedText(product.Name),
  description: resolveLocalizedText(product.Description),
  enabled: product.Enabled,
  ingredients: resolveLocalizedText(product.Ingredients),
  imgUrl: product.ImgUrl,
  price: product.Price,
  dietaries: product.Dietaries,
  toppings: parseJson<Array<{
    name?: string;
    Name?: string | Record<string, string>;
    priceIncrement?: number;
    PriceIncrement?: number;
  }>>(product.Toppings, []).map((topping) => ({
    name:
      topping.name ??
      (typeof topping.Name === 'string'
        ? topping.Name
        : topping.Name?.en ?? topping.Name?.fi ?? topping.Name?.sv ?? '') ??
      '',
    priceIncrement: topping.priceIncrement ?? topping.PriceIncrement ?? 0,
  })),
  excludables: parseJson<Array<string | { fi?: string; en?: string; sv?: string }>>(product.Excludables, []).map((item) =>
    typeof item === 'string' ? item : item.fi ?? item.en ?? item.sv ?? ''
  ),
  freeToppings: product.FreeToppings,
  maxToppings: product.MaxToppings,
  ageRestricted: product.AgeRestrictied,
});

export const toProductEditorViewModel = (product: Product): ProductEditorViewModel => {
  const toppings = parseJson<Array<{
    name?: string;
    Name?: string | Record<string, string>;
    priceIncrement?: number;
    PriceIncrement?: number;
  }>>(product.Toppings, []);
  const excludables = parseJson<Array<string | { fi?: string; en?: string; sv?: string }>>(product.Excludables, []);
  const ingredientTranslations = parseJson<Record<string, string>>(product.Ingredients, {});

  return {
    id: product.Id,
    name: resolveLocalizedText(product.Name),
    description: resolveLocalizedText(product.Description),
    ingredients: ingredientTranslations.fi ?? ingredientTranslations.en ?? ingredientTranslations.sv ?? '',
    imgUrl: product.ImgUrl,
    enabled: product.Enabled,
    dietaries: product.Dietaries ?? [],
    toppings: toppings.map((topping) => ({
      name:
        topping.name ??
        (typeof topping.Name === 'string'
          ? topping.Name
          : topping.Name?.en ?? topping.Name?.fi ?? topping.Name?.sv ?? '') ??
        '',
      priceIncrement: topping.priceIncrement ?? topping.PriceIncrement ?? 0,
    })),
    excludables: excludables.map((item) =>
      typeof item === 'string' ? item : item.fi ?? item.en ?? item.sv ?? ''
    ),
    freeToppings: product.FreeToppings,
    maxToppings: product.MaxToppings,
    ageRestricted: product.AgeRestrictied,
    price: product.Price,
    created: product.Created,
  };
};
