import { MOCK_MENUS } from '../mockData/menu.mock';
import { toMenuListItemViewModel } from '../../viewModels';

export const useGetMenus = () => {
  return {
    data: MOCK_MENUS.map(toMenuListItemViewModel),
    loading: false,
    error: undefined,
  } as const;
};
