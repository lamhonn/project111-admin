import type { Dietary, Menu, MenuProduct, Order, OrderProduct, Product, Tablet } from '../types';

const toDate = (value: string | Date): Date => {
  if (value instanceof Date) {
    return value;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
};

type GraphQLProduct = {
  id: string;
  name: string;
  description?: string | null;
  organizationId: string;
  price: number;
  toppings?: string | null;
  ingredients?: string | null;
  dietaries?: number[] | null;
  freeToppings: number;
  maxToppings: number;
  excludables?: string | null;
  imgUrl?: string | null;
  enabled: boolean;
  created: string;
  ageRestricted: boolean;
};

export const mapGraphQLProductToProduct = (product: GraphQLProduct): Product => ({
  Id: product.id,
  Name: product.name,
  Description: product.description ?? undefined,
  OrganizationId: product.organizationId,
  Price: product.price,
  Toppings: product.toppings ?? undefined,
  Ingredients: product.ingredients ?? undefined,
  Dietaries: product.dietaries?.map((value) => value as Dietary) ?? undefined,
  FreeToppings: product.freeToppings,
  MaxToppings: product.maxToppings,
  Excludables: product.excludables ?? undefined,
  ImgUrl: product.imgUrl ?? undefined,
  Enabled: product.enabled,
  Created: toDate(product.created),
  AgeRestrictied: product.ageRestricted,
});

type GraphQLMenu = {
  id: string;
  organizationId: string;
  name: string;
  enabled: boolean;
  categories: string;
  patternStartTime?: string | null;
  patternEndTime?: string | null;
  eventStartTime?: string | null;
  eventEndTime?: string | null;
  created: string;
};

export const mapGraphQLMenuToMenu = (menu: GraphQLMenu): Menu => ({
  Id: menu.id,
  OrganizationId: menu.organizationId,
  Name: menu.name,
  Enabled: menu.enabled,
  Categories: menu.categories,
  PatternStartTime: menu.patternStartTime ? toDate(menu.patternStartTime) : undefined,
  PatternEndTime: menu.patternEndTime ? toDate(menu.patternEndTime) : undefined,
  EventStartTime: menu.eventStartTime ? toDate(menu.eventStartTime) : undefined,
  EventEndTime: menu.eventEndTime ? toDate(menu.eventEndTime) : undefined,
  Created: toDate(menu.created),
});

type GraphQLMenuProduct = {
  id: string;
  menuId: string;
  productId: string;
  categoryId: string;
  created: string;
};

export const mapGraphQLMenuProductToMenuProduct = (menuProduct: GraphQLMenuProduct): MenuProduct => ({
  Id: menuProduct.id,
  MenuId: menuProduct.menuId,
  ProductId: menuProduct.productId,
  CategoryId: menuProduct.categoryId,
  Created: toDate(menuProduct.created),
});

type GraphQLTablet = {
  id: string;
  userId?: string | null;
  tableNumber: number;
  created: string;
};

export const mapGraphQLTabletToTablet = (tablet: GraphQLTablet): Tablet => ({
  Id: tablet.id,
  UserId: tablet.userId ?? undefined,
  TableNumber: tablet.tableNumber,
  Created: toDate(tablet.created),
});

type GraphQLOrder = {
  id: string;
  organizationId: string;
  totalPrice: number;
  tabletId: string;
  tableNumber: number;
  created: string;
};

export const mapGraphQLOrderToOrder = (order: GraphQLOrder): Order => ({
  Id: order.id,
  OrganizationId: order.organizationId,
  TotalPrice: order.totalPrice,
  TabletId: order.tabletId,
  TableNumber: order.tableNumber,
  Created: toDate(order.created),
});

type GraphQLOrderProduct = {
  id: string;
  orderId: string;
  productId: string;
  totalPrice: number;
  created: string;
};

export const mapGraphQLOrderProductToOrderProduct = (orderProduct: GraphQLOrderProduct): OrderProduct => ({
  Id: orderProduct.id,
  OrderId: orderProduct.orderId,
  ProductId: orderProduct.productId,
  TotalPrice: orderProduct.totalPrice,
  Created: toDate(orderProduct.created),
});
