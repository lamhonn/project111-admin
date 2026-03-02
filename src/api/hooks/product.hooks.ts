import { MOCK_PRODUCTS } from '../mockData/products.mock';
import { toProductListItemViewModel, type ProductListItemViewModel } from '../../viewModels';

const MOCK_PRODUCT_ITEMS: ProductListItemViewModel[] = MOCK_PRODUCTS.map(toProductListItemViewModel);

export const useGetProducts = () => {
  return {
    data: MOCK_PRODUCT_ITEMS,
    loading: false,
    error: undefined,
  } as const;
};
