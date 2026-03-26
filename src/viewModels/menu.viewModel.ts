import type { Menu, MenuProduct } from '../api/types';

export interface MenuCategoryItemViewModel {
  id: string;
  name: string;
}

export interface MenuCategoryViewModel {
  id: string;
  name: string;
  showTopmost?: boolean;
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
      showTopmost?: boolean;
      items?: Array<{ id?: string; name?: string }>;
      productIds?: string[];
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

    return parsed.map((category, index) => {
      if (typeof category === 'string') {
        return {
          id: `category-${index + 1}`,
          name: category,
          showTopmost: false,
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
        name: category.name ?? `Category ${index + 1}`,
        showTopmost: Boolean(category.showTopmost),
        items: itemsFromObjects.length > 0 ? itemsFromObjects : itemsFromProductIds,
      };
    });
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
): MenuDataViewModel => ({
  menuId: menu.Id,
  menuName: menu.Name,
  description: '',
  isActive: menu.Enabled,
  categories:
    parseCategories(menu.Categories).length > 0
      ? parseCategories(menu.Categories)
      : (menuProducts
          .filter((menuProduct) => menuProduct.MenuId === menu.Id)
          .length > 0
          ? [
              {
                id: `${menu.Id}-category-1`,
                name: 'Default',
                items: menuProducts
                  .filter((menuProduct) => menuProduct.MenuId === menu.Id)
                  .map((menuProduct) => ({
                    id: menuProduct.ProductId,
                    name: menuProduct.ProductId,
                  })),
              },
            ]
          : []),
});
