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
  categories: (menu.Categories || []).map((categoryName, index) => ({
    id: `${menu.Id}-category-${index + 1}`,
    name: categoryName,
    items: menuProducts
      .filter((menuProduct) => menuProduct.MenuId === menu.Id)
      .map((menuProduct) => ({
        id: menuProduct.ProductId,
        name: menuProduct.ProductId,
      })),
  })),
});
