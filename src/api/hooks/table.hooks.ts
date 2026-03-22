import type { TableMonitorViewModel } from '../../viewModels';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useMemo } from 'react';
import { mapGraphQLTabletToTablet } from '../graphql/mappers';
import { toTableMonitorViewModel } from '../../viewModels';
import { useOrganizationId } from './organization.hooks';

const TABLE_MONITOR_QUERY = gql`
  query GetTableMonitor($organizationId: ID!) {
    tablets(organizationId: $organizationId) {
      id
      userId
      tableNumber
      created
    }
    orders(organizationId: $organizationId) {
      id
      tableNumber
      totalPrice
      products {
        id
      }
    }
  }
`;

interface TableMonitorQueryData {
  tablets: Array<{
    id: string;
    userId?: string | null;
    tableNumber: number;
    created: string;
  }>;
  orders: Array<{
    id: string;
    tableNumber: number;
    totalPrice: number;
    products?: Array<{
      id: string;
    }> | null;
  }>;
}

interface TableMonitorQueryVariables {
  organizationId: string;
}

export const useGetTableMonitor = () => {
  const { organizationId, loading: organizationLoading, error: organizationError } = useOrganizationId();

  const { data, loading, error } = useQuery<TableMonitorQueryData, TableMonitorQueryVariables>(TABLE_MONITOR_QUERY, {
    variables: {
      organizationId: organizationId ?? '',
    },
    skip: !organizationId,
  });

  const tableMonitor = useMemo<TableMonitorViewModel[]>(() => {
    const orderStatsByTable = (data?.orders ?? []).reduce<Map<number, { itemCount: number; totalValue: number }>>(
      (accumulator, order) => {
        const previous = accumulator.get(order.tableNumber) ?? { itemCount: 0, totalValue: 0 };
        accumulator.set(order.tableNumber, {
          itemCount: previous.itemCount + (order.products?.length ?? 0),
          totalValue: previous.totalValue + order.totalPrice,
        });
        return accumulator;
      },
      new Map()
    );

    return (data?.tablets ?? []).map((tablet) => {
      const base = toTableMonitorViewModel(mapGraphQLTabletToTablet(tablet));
      const stats = orderStatsByTable.get(base.number);

      if (!stats) {
        return base;
      }

      return {
        ...base,
        status: 'active',
        items: stats.itemCount,
        value: stats.totalValue,
      };
    });
  }, [data]);

  return {
    data: tableMonitor,
    loading: organizationLoading || loading,
    error: organizationError ?? error,
  } as const;
};
