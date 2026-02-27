import type { HistoryOrderViewModel } from '../../viewModels';

const EMPTY_ORDER_HISTORY: HistoryOrderViewModel[] = [];

/**
 * Hook to fetch order history
 * Used for: Order History view
 */
export const useGetOrderHistory = () => {
  return {
    data: EMPTY_ORDER_HISTORY,
    loading: false,
    error: undefined,
  } as const;
};
