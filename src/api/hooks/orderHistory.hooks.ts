import type { HistoryOrderViewModel } from '../../viewModels';
import { MOCK_ORDER_HISTORY } from '../mockData/orders.mock';

const EMPTY_ORDER_HISTORY: HistoryOrderViewModel[] = MOCK_ORDER_HISTORY;

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
