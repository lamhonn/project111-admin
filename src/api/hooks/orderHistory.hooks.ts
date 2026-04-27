import type { HistoryOrderViewModel } from '../../viewModels';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useMemo } from 'react';
import { useOrganizationId } from './organization.hooks';

const ORDER_HISTORY_QUERY = gql`
  query GetOrderHistory($organizationId: ID!) {
    orders(organizationId: $organizationId) {
      id
      totalPrice
      created
      products {
        id
        productId
        totalPrice
        product {
          id
          name
          imgUrl
        }
      }
    }
  }
`;

interface OrderHistoryQueryData {
  orders: Array<{
    id: string;
    totalPrice: number;
    created: string;
    products?: Array<{
      id: string;
      productId: string;
      totalPrice: number;
      product?: {
        id: string;
        name: string;
        imgUrl?: string | null;
      } | null;
    }> | null;
  }>;
}

interface OrderHistoryQueryVariables {
  organizationId: string;
}

const resolveProductName = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed.startsWith('{')) {
    return value;
  }

  try {
    const parsed = JSON.parse(trimmed) as Record<string, string>;
    return parsed.en ?? parsed.fi ?? parsed.sv ?? Object.values(parsed)[0] ?? value;
  } catch {
    return value;
  }
};

/**
 * Hook to fetch order history
 * Used for: Order History view
 */
export const useGetOrderHistory = () => {
  const { organizationId, loading: organizationLoading, error: organizationError } = useOrganizationId();

  const { data, loading, error } = useQuery<OrderHistoryQueryData, OrderHistoryQueryVariables>(ORDER_HISTORY_QUERY, {
    variables: {
      organizationId: organizationId ?? '',
    },
    skip: !organizationId,
  });

  const orderHistory = useMemo<HistoryOrderViewModel[]>(
    () =>
      (data?.orders ?? []).map((order) => ({
        id: order.id,
        orderNumber: order.id,
        date: new Date(order.created).toISOString(),
        total: order.totalPrice,
        products: (order.products ?? []).map((orderProduct) => ({
          id: orderProduct.id,
          name: resolveProductName(orderProduct.product?.name ?? orderProduct.productId),
          image: orderProduct.product?.imgUrl ?? undefined,
          price: orderProduct.totalPrice,
          quantity: 1,
        })),
      })),
    [data]
  );

  return {
    data: orderHistory,
    loading: organizationLoading || loading,
    error: organizationError ?? error,
  } as const;
};
