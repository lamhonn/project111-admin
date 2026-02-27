import type { ProductListItemViewModel } from '../../viewModels';

const EMPTY_PRODUCTS: ProductListItemViewModel[] = [];

export const useGetProducts = () => {
  return {
    data: EMPTY_PRODUCTS,
    loading: false,
    error: undefined,
  } as const;
};
