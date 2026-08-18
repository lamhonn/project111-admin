import { atom } from 'jotai';
import { Menu } from '../types/models/menu';
import { MenuService } from '../api/services/menuService';
import { MenuCategory, MenuProduct } from '../types/models';
import { organizationIdAtom } from './authStore';
import { MenuCategoryViewModel } from '../types/viewModels/menuCategoryViewModel';
import { MenuViewModel } from '../types/viewModels/menuViewModel';
import { MenuDto } from '../types/dtos/menuDto';
import { MenuCategoryDto } from '../types/dtos/menuCategoryDto';

export const menusAtom = atom<Menu[]>([]);

export const menuProductsAtom = atom<MenuProduct[]>([]);

export const menuCategoriesAtom = atom<MenuCategory[]>([]);

export const loadingAtom = atom(false);

export const errorAtom = atom<string | null>(null);

export const getMenus = atom(
    (get) => get(menusAtom),
    async (get, set) => {
        set(loadingAtom, true);
        set(errorAtom, null);

        try {
            const organizationId = get(organizationIdAtom);
            if (!organizationId) return;

            const response = await MenuService.getByOrganizationId(organizationId);
            set(menusAtom, response);
        }
        catch (error) {
            set(errorAtom, "Error fetching menus");
        }
        finally {
            set(loadingAtom, false);
        }
    }
);

export const selectedMenuIdAtom = atom<string | null>(null);

export const getSelectedMenuAtom = atom(
    (get) => {
        const menus = get(menusAtom);
        const selectedMenuId = get(selectedMenuIdAtom);

        return menus.find(menu => menu.Id === selectedMenuId);
    }
);

export const createMenuAtom = atom(
    null,
    async (get, set, data: MenuViewModel) => {
        set(loadingAtom, true);
        set(errorAtom, null);

        try {
            // NOTE: consider type safety; convert Menu to MenuViewModel upon getMenusAtom altogether?
            const menuDto: MenuDto = {
                ...data,
                MenuCategories: data.MenuCategories.map(category => <MenuCategoryDto>{ ...category }),
            }
            await MenuService.create(menuDto);
            
            const menus = get(menusAtom);

            set(menusAtom, [...menus, 
                { 
                    ...data,
                    MenuCategories: data.MenuCategories.map(category => <MenuCategory>{ ...category, Created: data.Created }),
                    Created: data.Created 
                }
            ]);
        }
        catch {
            set(errorAtom, "Failed to create menu");
        } 
        finally {
            set(loadingAtom, false);
        }
    }
);

export const updateMenuAtom = atom(
    null,
    async (get, set, updatedMenu: MenuViewModel) => {
        set(loadingAtom, true);
        set(errorAtom, null);

        try {
            // NOTE: consider type safety; convert Menu to MenuViewModel upon getMenusAtom altogether?
            const menuDto: MenuDto = {
                ...updatedMenu,
                MenuCategories: updatedMenu.MenuCategories.map(category => <MenuCategoryDto>{ ...category }),
            }
            await MenuService.update(menuDto);
            
            const menus = get(menusAtom);

            const updatedMenus: Menu[] = menus.map(menu =>
                menu.Id === updatedMenu.Id
                ? { 
                    ...updatedMenu,
                    MenuCategories: updatedMenu.MenuCategories.map(category => <MenuCategory>{ ...category, Created: updatedMenu.Created }),
                    Created: updatedMenu.Created 
                }
                : menu
            );
            set(menusAtom, updatedMenus);
        }
        catch {
            set(errorAtom, "Failed to update menu");
        } 
        finally {
            set(loadingAtom, false);
        }
    }
);

export const getSelectedMenuCategoriesAtom = atom(
    (get) => {
        const menus = get(menusAtom);
        const selectedMenuId = get(selectedMenuIdAtom);

        const selectedMenu = menus.find(menu => menu.Id === selectedMenuId);

        if (!selectedMenu) return;

        const menuCategories: MenuCategoryViewModel[] = selectedMenu.MenuCategories.map(menuCategory => 
            (
                {
                    Id: menuCategory.Id,
                    Name: menuCategory.Name,
                    MenuId: menuCategory.MenuId,
                    Products: selectedMenu.MenuProducts.filter(product => product.MenuCategoryId === menuCategory.Id)
                }
            )
        );

        return menuCategories;
    }
);

export const deleteMenuAtom = atom(
    null,
    async (get, set, id: string) => {
        set(loadingAtom, true);
        set(errorAtom, null);

        try {
            await MenuService.delete(id);

            const menus = get(menusAtom);
            set(menusAtom, menus.filter(menu => menu.Id !== id));
        }
        catch {
            set(errorAtom, "Failed to delete menu");
        } 
        finally {
            set(loadingAtom, false);
        }
    }
);