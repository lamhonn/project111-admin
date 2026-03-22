import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useMemo } from 'react';
import { mapGraphQLMenuToMenu } from '../graphql/mappers';
import { toMenuListItemViewModel, type MenuListItemViewModel } from '../../viewModels';
import { useOrganizationId } from './organization.hooks';

const MENUS_QUERY = gql`
  query GetMenus($organizationId: ID!) {
    menus(organizationId: $organizationId) {
      id
      organizationId
      name
      enabled
      categories
      topmostCategory
      patternStartTime
      patternEndTime
      eventStartTime
      eventEndTime
      created
    }
  }
`;

interface MenusQueryData {
  menus: Array<{
    id: string;
    organizationId: string;
    name: string;
    enabled: boolean;
    categories: string;
    topmostCategory?: boolean | null;
    patternStartTime?: string | null;
    patternEndTime?: string | null;
    eventStartTime?: string | null;
    eventEndTime?: string | null;
    created: string;
  }>;
}

interface MenusQueryVariables {
  organizationId: string;
}

export const useGetMenus = () => {
  const { organizationId, loading: organizationLoading, error: organizationError } = useOrganizationId();

  const { data, loading, error } = useQuery<MenusQueryData, MenusQueryVariables>(MENUS_QUERY, {
    variables: {
      organizationId: organizationId ?? '',
    },
    skip: !organizationId,
  });

  const menus = useMemo<MenuListItemViewModel[]>(
    () => (data?.menus ?? []).map(mapGraphQLMenuToMenu).map(toMenuListItemViewModel),
    [data]
  );

  return {
    data: menus,
    loading: organizationLoading || loading,
    error: organizationError ?? error,
  } as const;
};
