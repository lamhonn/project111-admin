import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useMemo } from 'react';
import { mapGraphQLProductToProduct } from '../graphql/mappers';
import { toProductListItemViewModel, type ProductListItemViewModel } from '../../viewModels';
import { useOrganizationId } from './organization.hooks';

const PRODUCTS_QUERY = gql`
  query GetProducts($organizationId: ID!) {
    products(organizationId: $organizationId) {
      id
      name
      description
      organizationId
      price
      oldPrice
      toppings
      ingredients
      dietaries
      freeToppings
      excludables
      imgUrl
      enabled
      created
      ageRestricted
    }
  }
`;

interface ProductsQueryData {
  products: Array<{
    id: string;
    name: string;
    description?: string | null;
    organizationId: string;
    price: number;
    oldPrice?: number | null;
    toppings?: string | null;
    ingredients?: string | null;
    dietaries?: number[] | null;
    freeToppings: number;
    excludables?: string | null;
    imgUrl?: string | null;
    enabled: boolean;
    created: string;
    ageRestricted: boolean;
  }>;
}

interface ProductsQueryVariables {
  organizationId: string;
}

export const useGetProducts = () => {
  const { organizationId, loading: organizationLoading, error: organizationError } = useOrganizationId();

  const { data, loading, error } = useQuery<ProductsQueryData, ProductsQueryVariables>(PRODUCTS_QUERY, {
    variables: {
      organizationId: organizationId ?? '',
    },
    skip: !organizationId,
  });

  const productItems = useMemo<ProductListItemViewModel[]>(
    () => (data?.products ?? []).map(mapGraphQLProductToProduct).map(toProductListItemViewModel),
    [data]
  );

  return {
    data: productItems,
    loading: organizationLoading || loading,
    error: organizationError ?? error,
  } as const;
};
