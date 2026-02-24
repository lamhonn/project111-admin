import { MOCK_PRODUCTS } from '../mockData/product.mock';
import { toProductListItemViewModel } from '../../viewModels';

export const useGetProducts = () => {
  return {
    data: MOCK_PRODUCTS.map(toProductListItemViewModel),
    loading: false,
    error: undefined,
  } as const;
};
