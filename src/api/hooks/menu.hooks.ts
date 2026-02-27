import type { MenuListItemViewModel } from '../../viewModels';

const EMPTY_MENUS: MenuListItemViewModel[] = [];

export const useGetMenus = () => {
  return {
    data: EMPTY_MENUS,
    loading: false,
    error: undefined,
  } as const;
};
