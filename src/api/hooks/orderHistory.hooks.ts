import {
  toHistoryOrderViewModel,
  toHistoryProductViewModel,
  type HistoryOrderProductViewModel,
} from '../../viewModels';
import {
  MOCK_HISTORY_ORDERS_API,
  MOCK_HISTORY_ORDER_PRODUCTS_API,
} from '../mockData/orderHistoryApi.mock';

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
  const data = MOCK_HISTORY_ORDERS_API.map((order) => {
    const products: HistoryOrderProductViewModel[] = MOCK_HISTORY_ORDER_PRODUCTS_API
      .filter((orderProduct) => orderProduct.OrderId === order.Id)
      .map((orderProduct) => ({
        ...toHistoryProductViewModel(orderProduct),
        name: `Product ${orderProduct.ProductId}`,
      }));

    return {
      ...toHistoryOrderViewModel(order, products),
      date: order.Created.toISOString().replace('T', ' ').slice(0, 16),
    };
  });

  // Temporarily return mock data instead of making API query
  // This allows components to use the hook pattern while we develop
  return {
    data,
    loading: false,
    error: undefined,
  } as const;

  // When ready for real API, replace above with:
  // return useQuery<HistoryOrderViewModel[]>(GET_ORDER_HISTORY, {
  //   variables: { limit: 100 }, // Optional: add pagination, filters, etc.
  // });
};
