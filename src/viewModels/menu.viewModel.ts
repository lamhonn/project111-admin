import type { Menu, MenuProduct } from '../api/types';

export interface MenuCategoryItemViewModel {
  id: string;
  name: string;
}

export interface MenuCategoryViewModel {
  id: string;
  name: string;
  items: MenuCategoryItemViewModel[];
}

export interface ProductOptionViewModel {
  id: string;
  name: string;
}

export interface MenuListItemViewModel {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface MenuDataViewModel {
  menuId?: string;
  menuName?: string;
  description?: string;
  isActive?: boolean;
  activePeriodStart?: string;
  activePeriodEnd?: string;
  activeDays?: string[];
  activeFrom?: string;
  activeTo?: string;
  categories?: MenuCategoryViewModel[];
}

type RawCategory =
  | string
  | {
      id?: string;
      name?: string;
      en?: string;
      fi?: string;
      sv?: string;
      orderNumber?: number;
      items?: Array<{ id?: string; name?: string }>;
      productIds?: string[];
    };

const resolveCategoryName = (
  category:
    | {
        name?: string;
        en?: string;
        fi?: string;
        sv?: string;
      }
    | undefined,
  fallbackName: string
): string => {
  if (!category) {
    return fallbackName;
  }

  if (typeof category.name === 'string' && category.name.trim().length > 0) {
    try {
      const translated = JSON.parse(category.name) as
        | {
            en?: string;
            fi?: string;
            sv?: string;
          }
        | string;

      if (typeof translated === 'string') {
        return translated;
      }

      return translated.en ?? translated.fi ?? translated.sv ?? category.name;
    } catch {
      return category.name;
    }
  }

  return category.en ?? category.fi ?? category.sv ?? fallbackName;
};

const parseCategories = (value: string): MenuCategoryViewModel[] => {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as RawCategory[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    const normalizedCategories = parsed.map((category, index) => {
      if (typeof category === 'string') {
        return {
          id: `category-${index + 1}`,
          name: category,
          orderNumber: index + 1,
          items: [],
        };
      }

      const itemsFromObjects = (category.items ?? [])
        .filter((item) => item?.id)
        .map((item) => ({
          id: item.id as string,
          name: item.name ?? (item.id as string),
        }));
      const itemsFromProductIds = (category.productIds ?? []).map((productId) => ({
        id: productId,
        name: productId,
      }));

      return {
        id: category.id ?? `category-${index + 1}`,
        name: resolveCategoryName(category, `Category ${index + 1}`),
        orderNumber: category.orderNumber ?? index + 1,
        items: itemsFromObjects.length > 0 ? itemsFromObjects : itemsFromProductIds,
      };
    });

    return normalizedCategories
      .sort((firstCategory, secondCategory) => firstCategory.orderNumber - secondCategory.orderNumber)
      .map(({ id, name, items }) => ({ id, name, items }));
  } catch {
    return [];
  }
};

export const toMenuListItemViewModel = (menu: Menu): MenuListItemViewModel => ({
  id: menu.Id,
  name: menu.Name,
  description: '',
  isActive: menu.Enabled,
});

export const toMenuDataViewModel = (
  menu: Menu,
  menuProducts: MenuProduct[] = []
): MenuDataViewModel => {
  const parsedCategories = parseCategories(menu.Categories);
  const menuScopedProducts = menuProducts.filter((menuProduct) => menuProduct.MenuId === menu.Id);

  const categoriesWithProducts = parsedCategories.map((category) => {
    const hasInlineItems = (category.items ?? []).length > 0;
    if (hasInlineItems) {
      return category;
    }

    const itemsFromMenuProducts = menuScopedProducts
      .filter((menuProduct) => menuProduct.CategoryId === category.id)
      .map((menuProduct) => ({
        id: menuProduct.ProductId,
        name: menuProduct.ProductId,
      }));

    return {
      ...category,
      items: itemsFromMenuProducts,
    };
  });

  return {
    menuId: menu.Id,
    menuName: menu.Name,
    description: '',
    isActive: menu.Enabled,
    categories:
      categoriesWithProducts.length > 0
        ? categoriesWithProducts
        : (menuScopedProducts.length > 0
            ? [
                {
                  id: `${menu.Id}-category-1`,
                  name: 'Default',
                  items: menuScopedProducts.map((menuProduct) => ({
                    id: menuProduct.ProductId,
                    name: menuProduct.ProductId,
                  })),
                },
              ]
            : []),
  };
};
