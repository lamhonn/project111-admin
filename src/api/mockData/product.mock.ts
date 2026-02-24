import type { Product } from '../types';

const now = new Date('2026-02-24T10:00:00.000Z');

export const MOCK_PRODUCTS: Product[] = [1, 2, 3, 4, 5, 6].map((item) => ({
  Id: `product-${item}`,
  OrganizationId: 'org-1',
  Name: `Product ${item}`,
  Description:
    'A delicious menu item made with fresh ingredients and carefully prepared to delight your customers. This product is a popular choice and comes highly recommended.',
  Price: 10 + item,
  Ingredients: JSON.stringify({ fi: 'Ainesosat', en: 'Ingredients', sv: 'Ingredienser' }),
  Dietaries: [],
  ImgUrl: undefined,
  Enabled: true,
  Created: now,
  AgeRestrictied: false,
  Toppings: JSON.stringify([]),
  Excludables: JSON.stringify([]),
}));
