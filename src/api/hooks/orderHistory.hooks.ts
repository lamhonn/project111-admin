import type { HistoryOrder } from '../mockData/orderHistory.mock';
import { MOCK_ORDER_HISTORY } from '../mockData/orderHistory.mock';

/**
 * Order History data hooks
 * 
 * TODO: Currently returns mock data. When ready to connect to real API,
 * replace with actual GraphQL queries or API calls.
 */

/**
 * Hook to fetch order history
 * Used for: Order History view
 */
export const useGetOrderHistory = () => {
  // Temporarily return mock data instead of making API query
  // This allows components to use the hook pattern while we develop
  return {
    data: MOCK_ORDER_HISTORY,
    loading: false,
    error: undefined,
  } as const;

  // When ready for real API, replace above with:
  // return useQuery<HistoryOrder[]>(GET_ORDER_HISTORY, {
  //   variables: { limit: 100 }, // Optional: add pagination, filters, etc.
  // });
};
